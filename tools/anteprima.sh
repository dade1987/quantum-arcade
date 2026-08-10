#!/usr/bin/env bash
# ============================================================================
# ANTEPRIMA STATICA
#
# Prepara una copia del gioco da pubblicare su GitHub Pages, per farlo provare
# a qualcuno prima che il dominio vero sia in piedi.
#
# Cosa funziona nell'anteprima: tutti i livelli, i mini-giochi, il simulatore,
# il glossario, il ripasso e i progressi (che stanno nel browser, in
# localStorage). Cosa no: registrazione, progressi sul server, esame con
# attestato e tutor AI, perché hanno bisogno di Laravel. Il gioco lo gestisce
# già da solo — `js/core/api.js` fallisce in modo pulito quando il server non
# risponde — ma l'anteprima lo dice anche a chi la sta guardando, così nessuno
# pensa che sia rotta.
#
#   bash tools/anteprima.sh [cartella-di-uscita]
# ============================================================================
set -euo pipefail

RADICE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
USCITA="${1:-_anteprima}"
[[ "$USCITA" = /* ]] || USCITA="$RADICE/$USCITA"

echo "→ copio public_html in $USCITA"
rm -rf "$USCITA"
mkdir -p "$USCITA"
cp -R "$RADICE/public_html/." "$USCITA/"

# Il front controller di Laravel qui non serve: senza PHP è solo un file di
# testo scaricabile, e confonde.
rm -f "$USCITA/index.php"

# L'anteprima non deve finire nei motori di ricerca e rubare le visite al
# dominio vero: robots.txt che chiude tutto, e via la sitemap.
printf 'User-agent: *\nDisallow: /\n' > "$USCITA/robots.txt"
rm -f "$USCITA/sitemap.xml"

# GitHub Pages passerebbe i file da Jekyll: qui non serve e rovina le cartelle
# che iniziano con l'underscore.
touch "$USCITA/.nojekyll"

echo "→ segno le pagine come anteprima"
AVVISO='<div id="avviso-anteprima" style="position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;gap:.75rem;align-items:center;justify-content:center;flex-wrap:wrap;padding:.55rem 1rem;background:#151233;color:#e8e6f5;font:500 13px/1.4 system-ui,sans-serif;border-top:2px solid #6f5cff"><span><strong>Anteprima</strong> — tutti i livelli si giocano e i progressi restano in questo browser. Account, attestato e tutor AI hanno bisogno del server e qui sono spenti.</span><button type="button" onclick="document.getElementById(&quot;avviso-anteprima&quot;).remove()" style="background:transparent;border:1px solid currentColor;border-radius:3px;color:inherit;padding:.15rem .5rem;cursor:pointer;font:inherit">chiudi</button></div>'

conta=0
while IFS= read -r -d '' pagina; do
  # noindex anche nella pagina, non solo in robots.txt: prima si toglie la
  # riga che dice ai motori di indicizzare, poi si mette quella che lo vieta.
  perl -0pi -e 's|\s*<meta name="robots"[^>]*>||g' "$pagina"
  perl -0pi -e 's|<head>|<head>\n<meta name="robots" content="noindex, nofollow">|' "$pagina"
  # l'avviso in fondo, appena prima della chiusura del body
  perl -0pi -e "s|</body>|$AVVISO\n</body>|" "$pagina"
  conta=$((conta + 1))
done < <(find "$USCITA" -name '*.html' -print0)

echo "✓ anteprima pronta: $conta pagine in $USCITA"
