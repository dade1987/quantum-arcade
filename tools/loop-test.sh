#!/usr/bin/env bash
# ============================================================================
# LOOP: "sistema i test finché non passano"
#
# Esempio concreto di loop engineering su questo progetto. L'idea è semplice:
# invece di chiedere a Claude una correzione perfetta al primo colpo, gli si
# fa girare un ciclo con un giudice oggettivo — la suite di test — che dopo
# ogni tentativo dice sì o no.
#
#   OSSERVA   → lancia `npm test` (unit Node + tools/validate.mjs)
#   DECIDE    → passa a Claude l'output del fallimento
#   AGISCE    → Claude modifica i file
#   VERIFICA  → rilancia i test
#   RIPETE    → finché sono verdi, o finché non si smette di fare progressi
#
#   bash tools/loop-test.sh              # fino a 5 giri sui test JS
#   bash tools/loop-test.sh -n 10        # fino a 10 giri
#   bash tools/loop-test.sh -c 'npm run test:php'   # su un altro comando
#   bash tools/loop-test.sh --secco      # mostra il loop senza chiamare Claude
#
# Il loop tocca solo il working tree: non committa e non pusha nulla, così i
# tentativi restano tuoi da rileggere con `git diff` prima di tenerli.
# ============================================================================
set -uo pipefail

RADICE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$RADICE"

COMANDO="npm test"
MAX_GIRI=5
SECCO=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    -c|--comando) COMANDO="$2"; shift 2 ;;
    -n|--giri)    MAX_GIRI="$2"; shift 2 ;;
    --secco)      SECCO=1; shift ;;
    -h|--help)    sed -n '2,25p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) echo "opzione sconosciuta: $1" >&2; exit 2 ;;
  esac
done

if [[ $SECCO -eq 0 ]] && ! command -v claude >/dev/null 2>&1; then
  echo "✗ manca la CLI \`claude\` (npm i -g @anthropic-ai/claude-code)."
  echo "  Per vedere solo il ciclo dei test: bash tools/loop-test.sh --secco"
  exit 127
fi

REGISTRO="$(mktemp -d)/loop"
mkdir -p "$REGISTRO"
IMPRONTA_PRECEDENTE=""

for (( giro = 1; giro <= MAX_GIRI; giro++ )); do
  echo "── giro $giro/$MAX_GIRI ─ osservo: $COMANDO"
  USCITA="$REGISTRO/giro-$giro.log"

  # OSSERVA — il comando è il giudice: il suo exit code decide, non l'opinione
  # del modello su come è andata.
  if ( eval "$COMANDO" ) >"$USCITA" 2>&1; then
    echo "✅ verde al giro $giro."
    [[ $giro -gt 1 ]] && echo "   rileggi le modifiche con: git diff"
    exit 0
  fi

  CODA="$(tail -c 4000 "$USCITA")"
  echo "❌ rosso. Ultime righe:"
  echo "$CODA" | tail -15 | sed 's/^/     /'

  # STOP anticipato: se il fallimento è identico a quello del giro prima,
  # il loop non sta più imparando nulla e continuare brucia solo token.
  IMPRONTA="$(printf '%s' "$CODA" | cksum)"
  if [[ "$IMPRONTA" == "$IMPRONTA_PRECEDENTE" ]]; then
    echo "⏹  fallimento identico al giro precedente: mi fermo, serve una mano umana."
    exit 1
  fi
  IMPRONTA_PRECEDENTE="$IMPRONTA"

  if [[ $SECCO -eq 1 ]]; then
    echo "   (--secco: qui chiamerei Claude con l'output qui sopra)"
    exit 1
  fi

  [[ $giro -eq $MAX_GIRI ]] && break

  # AGISCE — contesto minimo e mirato: il comando, l'errore, e i limiti.
  # Niente cronologia dei giri precedenti: il codice sul disco è già lo stato.
  echo "→ passo il fallimento a Claude…"
  claude -p "Nel repository Quantum Arcade il comando \`$COMANDO\` fallisce.

Output del fallimento:
---
$CODA
---

Trova la causa e correggila nel codice sorgente. Vincoli:
- correggi il codice, non il test: un test va modificato solo se dimostri che
  la sua aspettativa è sbagliata, e in quel caso spiega perché;
- niente scorciatoie per far passare la suite (skip, try/catch vuoti, asserzioni
  annacquate, valori attesi riscritti sul risultato ottenuto);
- tocca il minor numero di file possibile;
- non fare commit e non fare push." \
    --allowedTools 'Read' 'Edit' 'Write' 'Grep' 'Glob' 'Bash(npm test:*)' 'Bash(node:*)' \
    || { echo "✗ la chiamata a Claude è fallita."; exit 1; }
done

echo "⏹  ancora rosso dopo $MAX_GIRI giri. Log dei tentativi in $REGISTRO"
exit 1
