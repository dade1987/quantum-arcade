# Backend — Laravel + moduli nwidart, tutto su un solo dominio

Il backend **è già costruito e funzionante**. Questo documento spiega com'è fatto,
come si avvia in locale e come si mette online su Hostinger — un dominio solo, un deploy solo.

---

## 1. Come è organizzato

```
Modules/                       moduli nwidart (uno per dominio funzionale)
├── Accounts/                  registrazione, conferma email, accesso, profilo
├── Progress/                  salvataggio progressi lato server
├── Certificates/              esame corretto dal server, attestato, PDF, verifica
└── Chat/                      tutor AI (Neuron AI) e archivio conversazioni

public_html/                   ← WEB ROOT (nome obbligato da Hostinger)
├── index.php                  front controller Laravel
└── css/ js/ assets/                       gli asset del gioco (nessun passaggio di build)

storage/app/rag/               archivio vettoriale del tutor (file, niente DB extra)
```

**Non esiste una cartella `backend/`**: il progetto Laravel *è* la radice del repository.
Il gioco non viene copiato né compilato: i file in `public_html/` sono quelli che si modificano.

**Un solo dominio.** Apache serve i file statici se esistono (regola standard di Laravel),
altrimenti passa a PHP. Quindi:

| URL | Chi risponde |
|---|---|
| `/css/…` , `/js/…` , `/assets/…` | gli asset, serviti dal web server |
| `/` , `/lezioni/…` , `/en/lessons/…` | le pagine, composte da Blade |
| `/api/*` | Laravel (moduli) |
| `/verifica/{codice}` | Laravel (pagina pubblica di verifica) |
| `/attestato/{codice}.pdf` | Laravel (PDF generato al volo) |

---

## 2. Cosa fa ogni modulo

### Accounts
Registrazione con **nome, cognome, data di nascita, email, password**
(i dati anagrafici servono all'attestato: senza, non è verificabile da terzi).
Conferma email tramite link monouso; nel database si salva **solo l'hash** del token.
Accesso con email+password, oppure con link via email se la password è persa.
Cancellazione completa dell'account in un click (GDPR art. 17), con eliminazione a cascata.

| Rotta | Cosa fa |
|---|---|
| `POST /api/auth/register` | crea l'account e invia la mail di conferma |
| `POST /api/auth/login` | accesso con password (rate limit 8 tentativi/15 min) |
| `POST /api/auth/magic` | manda un link di accesso (risposta identica anche se l'email non esiste) |
| `GET /api/auth/verify?token=` | conferma email e apre la sessione |
| `POST /api/auth/profile` · `/password` · `/resend` · `/logout` | gestione account |
| `DELETE /api/auth/me` | cancella tutto |

### Progress
Una riga per utente con XP e uno stato JSON. La fusione fra dispositivi **non perde mai nulla**:
XP = massimo, livelli/missioni = unione, ripasso = si tiene la scatola più bassa.
`level_events` registra in forma aggregata dove i giocatori si bloccano.

### Certificates
- `GET /api/exam/questions` → tutte le domande della banca, mescolate, **senza le risposte esatte**;
- `POST /api/exam/submit` → correzione **lato server**, salvataggio del tentativo,
  emissione dell'attestato se ≥ 80%;
- `GET /verifica/{code}` → pagina pubblica di verifica;
- `GET /attestato/{code}.pdf` → PDF A4 orizzontale (dompdf);
- `GET /api/badge/{code}.json` → Open Badge / Verifiable Credential.

La banca domande sta in `Modules/Certificates/config/config.php`, generata da
`npm run exam:sync`. Le domande hanno un problema che nessun altro contenuto ha:
**se si possono leggere, l'esame non misura niente**. E si possono leggere in due modi —
dall'URL, se il file sta in `public_html`, e da GitHub, visto che il repository è pubblico.
Quindi le banche sono due:

| File | In git? | A cosa serve |
|---|---|---|
| `data/exam-bank-sample.js` | sì | far girare sito e test a chi contribuisce |
| `data/exam-bank-private.js` | **no** | l'esame vero, solo sul tuo computer e sul server |

`npm run exam:sync` genera da ciascuna il rispettivo file PHP; `config.php` carica quello
riservato se lo trova, altrimenti quello d'esempio. **Il file `domande-riservate.php` non
arriva con il deploy** (non è in git): va caricato a mano una volta, e rifatto quando cambi
le domande. `php artisan site:check` avvisa in giallo se online sta girando quella
d'esempio.

### Chat — il tutor
Agente **RAG con Neuron AI** (PHP puro, nessun processo Node da tenere acceso):

- `Modules/Chat/app/Agents/QuantumTutor.php` — istruzioni e fabbriche dei fornitori.
  **Chi risponde** si sceglie dal `.env` (`CHAT_PROVIDER`): `deepseek` (predefinito),
  `anthropic`, `openai`. **Come si cerca** si sceglie con `CHAT_EMBEDDINGS`;
- `Modules/Chat/app/Embeddings/EmbeddingLocale.php` — embedding calcolati in casa,
  senza API. Esiste perché **DeepSeek non offre un'API di embedding**: senza questo
  servirebbe una seconda chiave, di un secondo fornitore, solo per la ricerca.
  È feature hashing su parole, radici e coppie di parole; costo zero, nessuna rete,
  189 pezzi indicizzati in mezzo secondo. Il limite (dichiarato) è che non capisce i
  sinonimi: se serve più precisione si passa a `CHAT_EMBEDDINGS=openai` e una chiave;
- archivio vettoriale **su file** (`FileVectorStore`), creato da solo alla prima
  installazione. Neuron AI supporta anche Qdrant, Chroma, Pinecone, Weaviate,
  Elasticsearch e MariaDB, ma il primo gruppo sono servizi da tenere accesi e
  `MariaDBVectorStore` richiede MariaDB 11.7+ con tipo `VECTOR` nativo: su hosting
  condiviso l'archivio su file è l'unico che regge davvero;
- `php artisan chat:ingest` — legge le pagine in `public_html/`, le spezza in blocchi
  e calcola gli embedding. **Da rilanciare dopo ogni modifica ai contenuti**;
- `php artisan chat:report` — domande più frequenti, livelli più citati, risposte bocciate:
  è la lista dei livelli da riscrivere;
- conversazioni salvate in `conversations` / `chat_messages` con voto 👍/👎.

Regole scritte nel prompt: risponde solo con quello che trova nel sito, cita il livello,
**non dà le soluzioni delle missioni** (solo indizi) e non promette certificazioni accreditate.

---

## 3. Avvio in locale

```bash
composer install
cp .env.example .env            # se non c'è già
php artisan key:generate
touch database/database.sqlite  # oppure configura MySQL
php artisan migrate
php artisan serve --port=8010   # oppure: npm start
# → http://127.0.0.1:8010
```

I contenuti si modificano direttamente in `public_html/`: nessun passaggio di build, nessun watcher.

Con `MAIL_MAILER=log` le email di conferma finiscono in `storage/logs/laravel.log`:
comodo per provare la registrazione senza configurare la posta.

---

## 4. Variabili d'ambiente

```env
APP_URL=https://iltuodominio.it
DB_CONNECTION=mysql            # su Hostinger

MAIL_MAILER=smtp               # casella del dominio creata dal pannello Hostinger
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=no-reply@iltuodominio.it
MAIL_PASSWORD=...
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=no-reply@iltuodominio.it
MAIL_FROM_NAME="Quantum Arcade"

CHAT_PROVIDER=deepseek         # deepseek | anthropic | openai
CHAT_API_KEY=...               # la chiave del fornitore scelto
CHAT_MODEL=                    # vuoto = predefinito del fornitore
CHAT_EMBEDDINGS=locale         # nessuna chiave, nessun costo (vedi sopra)
CHAT_TOP_K=6
CHAT_RATE_PER_HOUR=30
CHAT_STORE_CONVERSATIONS=true
```

Serve **una chiave sola**, quella del modello che risponde: la ricerca dentro il sito è
locale. Senza chiave il tutor risponde «non sono configurato» e **il resto del sito funziona
normalmente**: non è un blocco.

---

## 5. Messa online su Hostinger

Hostinger serve **sempre** la cartella `public_html` e non la si può rinominare: per questo
la cartella pubblica di Laravel qui **si chiama già `public_html`** (glielo dice
`bootstrap/app.php` con `usePublicPath`). Non c'è nessun pannello da toccare.

### Struttura sul server

```
~/                          ← home dell'hosting
├── app/  bootstrap/  config/  database/  Modules/  routes/  storage/  vendor/
├── artisan  composer.json  .env
└── public_html/            ← l'unica cartella raggiungibile dal web
    ├── index.php               front controller Laravel
    └── css/ js/ assets/                      gli asset del gioco
```

Tutto ciò che sta **fuori** da `public_html` non è raggiungibile dal browser: `.env`,
database, codice dei moduli e archivio del tutor restano protetti.

### Passi

1. **Carica il progetto nella home** (Git deploy, SSH o File Manager).
   Se `public_html` esiste già ed è vuota, sovrascrivila con quella del progetto.
2. Da SSH, prepara il `.env` (una volta sola):
   ```bash
   cd ~
   cp .env.example .env && nano .env      # vedi la sezione 4
   php artisan key:generate
   ```
3. Lancia lo script di messa online — fa tutto il resto nell'ordine giusto e si
   ferma al primo passo che fallisce:
   ```bash
   bash tools/deploy.sh
   ```
   Dipendenze, permessi, migrazioni, cache, indice del tutor e **controllo
   pre-volo**. Va rilanciato a ogni aggiornamento del sito: non tocca il `.env`
   e non cancella dati.
4. **Svuota la cache della CDN** (hPanel → *Prestazioni/CDN* → svuota cache), oppure
   aspetta. Hostinger serve i file statici dietro la sua CDN (`hcdn`): dopo un
   aggiornamento alcuni nodi possono continuare a servire il CSS e il JS vecchi, e
   siccome HTML, CSS e JS di questo sito cambiano insieme, il risultato non è
   «una funzione a metà» ma una pagina rotta — è già capitato con il glossario.
   Da `public_html/.htaccess` css e js ora si riconvalidano a ogni visita
   (ETag → 304, costo quasi zero); le pagine non passano di lì perché non sono
   più file, ma Laravel risponde già `no-cache, private`, che è più stretto.
   Le copie già in cache però restano fino alla scadenza: la prima volta la
   cache va svuotata a mano. Come verificare da fuori:
   ```bash
   curl -sI https://tuodominio/css/style.css | grep -iE 'last-modified|x-hcdn-cache-status'
   curl -s  https://tuodominio/css/style.css | grep -c gloss-panel   # 0 = stai vedendo il vecchio
   ```
5. **HTTPS**: attiva il certificato gratuito dal pannello e forza il redirect a https.
6. **Cron** (pannello Hostinger, ogni minuto):
   ```
   php ~/artisan schedule:run >> /dev/null 2>&1
   ```
7. **Prova a mano** quello che nessuno script può verificare: registrati con un
   indirizzo vero, controlla che l'email di conferma arrivi (e non in spam), fai
   l'esame, scarica il PDF, apri `/verifica/{codice}` da un browser in incognito.

### Il controllo pre-volo

```bash
php artisan site:check --production
```

Verifica una per una le cose che altrimenti si scoprono dagli utenti: versione ed
estensioni di PHP, `APP_KEY`, `APP_URL` in https, `APP_DEBUG` spento, permessi di
`storage`, presenza di `index.php` in `public_html` e delle view in `resources/views`, **`.env` non
scaricabile dal web**, connessione al database e tabelle create, SMTP configurato
(con `MAIL_MAILER=log` nessuno riceve la conferma), banca domande dell'esame,
`dompdf` puntato alla cartella giusta, chiave del tutor e indice dei contenuti.

Ogni riga rossa dice anche **come si risolve**. Esce con codice di errore se
qualcosa impedisce di aprire al pubblico, quindi si può mettere in uno script.

### `proc_open` disattivato (succede su quasi tutti gli hosting condivisi)

Se `composer install` scarica tutto e poi si ferma con

```
The Process class relies on proc_open, which is not available on your PHP installation
```

non è un guasto e i pacchetti ci sono già: Composer non riesce a lanciare l'ultimo script,
perché per farlo dovrebbe avviare un altro processo. Si risolve così:

```bash
composer install --no-dev --optimize-autoloader --no-scripts
php artisan package:discover
```

`tools/deploy.sh` lo fa già in questo modo, quindi se usi lo script non incontri
il problema. `php artisan site:check` segnala in giallo quando `proc_open` è disattivato.

Lo stesso `proc_open` mancante colpiva anche il **tutor**: Neuron AI manda le sue tracce
a Inspector in un processo separato, e ogni domanda finiva in errore 500 con
`PHP function 'proc_open' is not available` (anche senza Inspector configurato).
`ChatServiceProvider` ora, dove `proc_open` non c'è, impone a Inspector il trasporto
`sync`: non serve toccare il `.env`.

### Se non hai accesso SSH (piani base)

`composer install` va lanciato in locale e la cartella `vendor/` caricata insieme al resto;
le migrazioni si possono eseguire una volta sola da una rotta protetta temporanea, oppure
importando lo schema SQL da phpMyAdmin. In quel caso ricordati di rimuovere la rotta subito dopo.

### Node in produzione non serve
Node è usato soltanto per i test e per il validatore. Il sito gira con PHP e basta.

---

## 6. Manutenzione

| Quando | Comando |
|---|---|
| Hai modificato i livelli | `php artisan chat:ingest` |
| Hai modificato l'esame | `npm run exam:sync` poi `php artisan config:cache` |
| Vuoi sapere dove il corso non è chiaro | `php artisan chat:report` |
| Prima di ogni pubblicazione | `npm run test:all` (unitari + PHP + end-to-end + validazione) |
| Hai pubblicato e dal browser non vedi le modifiche | svuota la cache della CDN da hPanel, poi ricarica con Ctrl+Shift+R (o in incognito) |
| `Class "Laravel\Pail\PailServiceProvider" not found` | `rm -f bootstrap/cache/*.php` e rilancia: è il manifest dei pacchetti rimasto da un'installazione di sviluppo (lo script lo fa già da sé) |

---

## 7. Cosa resta da decidere (non è codice, sono scelte tue)

- **Certificazione accreditata**: oggi l'attestato è rilasciato dall'autore ed è verificabile,
  ma **non è accreditato**. Per renderlo tale serve un ente terzo: accordo con un ente di
  formazione/ateneo che co-firmi, oppure uno schema ISO/IEC 17024 con accreditamento Accredia.
  Finché non c'è, il sito lo dichiara apertamente (ed è la scelta giusta).
- **Informativa privacy**: `privacy.html` è completa ma va integrata con i nomi reali dei
  fornitori scelti (hosting, SMTP, modello AI) e con i relativi accordi art. 28 GDPR.
- **Minori di 14 anni**: serve il consenso di chi esercita la responsabilità genitoriale.
  Oggi è scritto nell'informativa; se il pubblico scolastico diventa importante,
  vale la pena aggiungere un flusso dedicato per le classi.
