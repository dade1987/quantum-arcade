# Loop engineering, terra terra

Invece di scrivere *un* prompt perfetto, si progetta un **ciclo** che si ripete
finché il lavoro non è fatto. Il modello sbaglia spesso al primo colpo, ma con
un giudice oggettivo che dopo ogni tentativo dice sì o no, converge in pochi giri.

## Il ciclo

1. **Osserva** — leggi lo stato reale (qui: l'esito di `npm test`).
2. **Decide** — scegli la prossima mossa in base a quello che è appena fallito.
3. **Agisce** — modifica i file.
4. **Verifica** — rilancia lo stesso comando.
5. **Ripeti** — finché è verde, o finché ha senso continuare.

## Le quattro manopole

| Manopola | In questo progetto |
|---|---|
| **Giudice** | `npm test` = unit test Node + `tools/validate.mjs`. Decide l'exit code, non l'opinione del modello. |
| **Contesto** | Solo il comando e le ultime righe dell'errore. Il codice sul disco è già lo stato: la cronologia dei giri precedenti è rumore. |
| **Vincoli** | "Correggi il codice, non il test." Senza questo paletto il modo più veloce per far passare la suite è indebolirla. |
| **Stop** | Verde, oppure `MAX_GIRI`, oppure due fallimenti identici di fila (il loop non sta più imparando). |

## Provalo

```bash
bash tools/loop-test.sh --secco    # mostra il ciclo senza chiamare Claude
bash tools/loop-test.sh            # fino a 5 giri su `npm test`
bash tools/loop-test.sh -n 10 -c 'npm run test:php'
```

Il loop non committa e non pusha: rileggi i tentativi con `git diff` prima di tenerli.

## Errori tipici

- **Nessuno stop** → giri infiniti che bruciano token.
- **Feedback vago** ("sembra a posto") invece di un exit code.
- **Contesto che cresce a ogni giro** finché non satura la memoria.
- **Giudice corruttibile**: se il modello può modificare i test, prima o poi lo fa.

## Farlo con Claude, ad altri livelli

- **Claude Code** è già un loop (pensa → tool → legge l'output → ripete): lo si
  modella con `CLAUDE.md`, gli hook e i subagent.
- **`/loop`** riesegue un prompt a intervalli, per monitoraggio e polling.
- **Claude Agent SDK** per loop su misura, con i tuoi tool.
- **Claude API**: il `tool_runner` dell'SDK gestisce il ciclo tool-use, oppure
  lo si scrive a mano (messaggio → `tool_use` → esegui → `tool_result` → ripeti).
