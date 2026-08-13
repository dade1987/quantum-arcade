#!/usr/bin/env bash
#
# Messa online / aggiornamento di Quantum Arcade su Hostinger.
#
# SI LANCIA SUL SERVER, via SSH, dalla cartella del progetto (quella che
# contiene artisan e public_html):
#
#     bash tools/deploy.sh
#
# Fa i passi nell'ordine giusto e si ferma al primo che fallisce, invece di
# proseguire lasciando il sito a metà. Alla fine esegue il controllo pre-volo:
# se quello è verde, il sito è davvero pronto.
#
# È scritto per essere rilanciato ogni volta che si aggiorna il sito: non
# cancella niente e non tocca il .env.

set -euo pipefail

cd "$(dirname "$0")/.."

blu()   { printf '\n\033[1;36m▸ %s\033[0m\n' "$1"; }
rosso() { printf '\033[1;31m✗ %s\033[0m\n' "$1" >&2; }

if [ ! -f artisan ]; then
  rosso "Non trovo artisan: lancia questo script dalla cartella del progetto."
  exit 1
fi

if [ ! -f .env ]; then
  rosso "Manca il .env. Copialo da .env.example e compilalo (vedi docs/BACKEND.md, sezione 4)."
  exit 1
fi

blu "1/7 Dipendenze PHP (senza quelle di sviluppo)"
# I manifest in bootstrap/cache elencano i pacchetti trovati all'ULTIMA
# installazione, quelli di sviluppo compresi. Con --no-dev i pacchetti di
# sviluppo spariscono da vendor/ ma restano scritti nel manifest, e la prima
# chiamata ad artisan muore con
#
#     Class "Laravel\Pail\PailServiceProvider" not found
#
# cioè PRIMA di arrivare al package:discover che avrebbe riscritto il manifest.
# Si cancellano qui, prima di toccare artisan: vengono rigenerati dai passi
# 4 e 5, e non contengono niente che non sia ricalcolabile.
rm -f bootstrap/cache/*.php

# --no-scripts non è una precauzione: gli hosting condivisi (Hostinger compreso)
# disattivano proc_open, e Composer ne ha bisogno per lanciare gli script finali.
# Senza questo, l'installazione scarica tutto e poi muore sull'ultimo passo con
# "The Process class relies on proc_open". Lo script che serviva lo lanciamo noi
# subito dopo, direttamente: quello gira in-process e non chiede proc_open.
composer install --no-dev --optimize-autoloader --no-interaction --no-scripts
php artisan package:discover

blu "2/7 Permessi delle cartelle scrivibili"
chmod -R 775 storage bootstrap/cache

blu "3/7 Struttura del database"
php artisan migrate --force

blu "4/7 Pulizia delle cache vecchie"
php artisan optimize:clear

blu "5/7 Cache di configurazione, rotte e viste"
php artisan config:cache
php artisan route:cache
php artisan view:cache

blu "6/7 Indice dei contenuti per il tutor"
# Va rifatto a ogni aggiornamento dei livelli: se cambia il testo e l'indice
# resta vecchio, il tutor cita pagine che non dicono più quello.
php artisan chat:ingest

blu "7/7 Controllo pre-volo"
php artisan site:check --production

printf '\n\033[1;32m✅ Fatto.\033[0m Ultimo passo a mano: apri il sito in incognito,\n'
printf '   iscriviti con un indirizzo vero e controlla che l'"'"'email di conferma arrivi.\n\n'
