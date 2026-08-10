#!/usr/bin/env bash
# Smoke test: apre ogni pagina in Chrome headless e fallisce se c'è un errore JS.
# Uso: tools/smoke.sh [porta]     (default 8010, il server Laravel)
PORT="${1:-8010}"
OUT="/tmp/quantum-smoke"
mkdir -p "$OUT"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PAGES=$(cd "$ROOT/public_html" && ls index.html metodo.html privacy.html lezioni/*.html 2>/dev/null)
FAIL=0
for p in $PAGES; do
  name=$(echo "$p" | tr '/' '_')
  err=$(google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
        --virtual-time-budget=4000 --window-size=1280,2400 \
        --screenshot="$OUT/$name.png" \
        --enable-logging=stderr --log-level=0 \
        "http://localhost:$PORT/$p" 2>&1 | grep -iE 'ERROR:CONSOLE|Uncaught|SyntaxError|is not defined|TypeError' | head -5)
  if [ -n "$err" ]; then
    echo "❌ $p"; echo "$err" | sed 's/^/     /'; FAIL=1
  else
    echo "✅ $p"
  fi
done
echo "screenshot in $OUT"
exit $FAIL
