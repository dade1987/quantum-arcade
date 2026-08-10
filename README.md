<div align="center">

<img src="public_html/assets/logo.svg" width="110" alt="Quantum Arcade">

# Quantum Arcade

**Impara l'informatica quantistica giocando. In italiano, da zero, fino all'algoritmo di Shor.**

[![Collaudo](https://github.com/dade1987/quantum-arcade/actions/workflows/collaudo.yml/badge.svg)](https://github.com/dade1987/quantum-arcade/actions/workflows/collaudo.yml)
[![Copertura backend](https://img.shields.io/badge/copertura%20backend-100%25-success)](docs/BACKEND.md)
[![Copertura frontend](https://img.shields.io/badge/copertura%20frontend-100%25%20righe-success)](tests/js/unit)
[![Codice](https://img.shields.io/badge/codice-PolyForm%20Noncommercial%201.0.0-blue)](LICENSE)
[![Contenuti](https://img.shields.io/badge/contenuti-CC%20BY--NC--SA%204.0-blue)](LICENSE)

[Come contribuire](CONTRIBUTING.md) · [Il metodo e le fonti](public_html/metodo.html) · [Architettura](docs/BACKEND.md)

</div>

---

28 livelli interattivi che partono dalle **basi di matematica delle medie** e arrivano alla
**trasformata di Fourier quantistica**, alla **stima di fase** e all'**algoritmo di Shor**.
Ogni concetto ha un mini-gioco: prima muovi, poi capisci. Sotto c'è un simulatore quantistico
a vettore di stato scritto da zero, verificato dai test: il circuito della QFT riproduce
**esattamente** la matrice di Fourier.

| | |
|---|---|
| **Per chi** | Da chi ha finito le medie in su. Nessun prerequisito di fisica. |
| **Quanto dura** | 10–20 minuti a livello. Un pomeriggio abbondante il percorso completo. |
| **Come si avanza** | Dimostrando la padronanza: una missione pratica **e** un quiz di richiamo. |
| **Cosa c'è alla fine** | Un'officina dove inventi algoritmi tuoi, e un esame con attestato verificabile. |

È **un solo progetto Laravel**: il gioco vive dentro `public_html/`, le API e le pagine
dinamiche sono gestite dai moduli. Un dominio, un deploy, nessun passaggio di build.

---

## Avvio in locale

```bash
composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite && php artisan migrate

npm install          # solo per i test (Playwright)
npm start            # → http://127.0.0.1:8010
```

Con `MAIL_MAILER=log` le email di conferma finiscono in `storage/logs/laravel.log`:
comodo per provare la registrazione senza configurare la posta.

---

## Struttura

```
public_html/               DOCUMENT ROOT (nome imposto da Hostinger) — il gioco E il front controller
  index.html               hub: mappa livelli, ripasso spaziato, bio, servizi
  index.php                front controller di Laravel
  metodo.html              scelte didattiche e ricerche che le sostengono
  privacy.html             informativa GDPR
  lezioni/*.html           28 livelli
  css/style.css            tema unico
  js/core/                 motore del gioco
    levels.js              ordine dei livelli e prerequisiti (fonte di verità)
    qsim.js                simulatore quantistico (ampiezze, porte, misura, QFT)
    dsp.js                 DFT / FFT / avvolgimento
    store.js               XP, padronanza, ripasso (Leitner)
    account.js  api.js     registrazione, sessione, sincronizzazione
    canvas.js  audio.js    motore grafico 2D + suoni arcade
    lesson.js  ui.js  formula.js
  js/widgets/              i mini-giochi (uno o più per livello)

dati/banca-esame.js        banca domande dell'esame — FUORI dalla radice web

Modules/                   moduli nwidart
  Accounts/                registrazione, conferma email, accesso, profilo
  Progress/                progressi salvati sul server
  Certificates/            esame corretto lato server, attestato PDF, verifica pubblica
  Chat/                    tutor AI (Neuron AI, RAG sui contenuti del sito, embedding locali)

tests/
  Feature/Moduli/          test PHP dei quattro moduli (100% di copertura)
  js/unit/                 test del motore del gioco (100% righe)
  js/e2e/                  Playwright: percorso utente + audit grafico
tools/                     validatore, test matematici, sincronizzazione esame
docs/BACKEND.md            architettura e messa online su Hostinger
```

---

## Collaudo

```bash
npm test                 # motore del gioco (102 test) + validazione di tutti i file
npm run test:coverage    # copertura del frontend
npm run test:php         # 84 test dei moduli Laravel
npm run test:php:coverage
npm run test:e2e         # 67 test Playwright (desktop + telefono)
npm run test:all         # tutto
```

Stato attuale: **frontend 100% righe · backend 100% · 67 test end-to-end verdi**.

Il validatore (`npm run validate`) controlla sintassi JS, script inline nelle pagine,
import risolvibili, tag HTML bilanciati, risorse mancanti, coerenza con `levels.js`,
sintassi PHP, JSON e SVG. Lanciarlo prima di ogni pubblicazione.

---

## Manutenzione

| Quando | Comando |
|---|---|
| Hai modificato i livelli | `php artisan chat:ingest` (riallinea il tutor) |
| Hai modificato l'esame (`dati/banca-esame.js`) | `npm run exam:sync` |
| Vuoi sapere dove il corso non è chiaro | `php artisan chat:report` |
| Prima di pubblicare | `npm run test:all` |
| Sul server, dopo ogni caricamento | `bash tools/messa-online.sh` |
| Per sapere se il server è a posto | `php artisan sito:controlla --produzione` |

---

## Messa online (Hostinger, un solo dominio)

Su Hostinger la web root è già `public_html`: si carica il progetto nella home e funziona.

```bash
cp .env.example .env && nano .env     # una volta sola
php artisan key:generate
bash tools/messa-online.sh            # dipendenze, migrazioni, cache, indice, controllo
```

L'ultimo passo dello script è `php artisan sito:controlla --produzione`, che verifica
una per una le cose che altrimenti si scoprono dagli utenti — `.env` scaricabile dal web,
`APP_DEBUG` acceso, SMTP non configurato, PDF puntato alla cartella sbagliata — e per
ognuna dice **come si risolve**.

Istruzioni complete, variabili d'ambiente e cron: [docs/BACKEND.md](docs/BACKEND.md).

---

## Contribuire

Il progetto è aperto: correzioni, livelli nuovi, traduzioni, mini-giochi migliori.
**[CONTRIBUTING.md](CONTRIBUTING.md)** spiega da dove cominciare in base a quanto tempo hai —
dieci minuti per un refuso, mezza giornata per un livello intero — ed è costruito attorno
alle barriere che la ricerca ha misurato per chi arriva in un progetto open source.

Il contributo più prezioso non è codice: è **dirmi dove non si capisce**.
C'è un modello di issue apposta.

Prima di aprire una pull request: `npm run test:all`.

- [Codice di comportamento](CODE_OF_CONDUCT.md) — in breve: qui arriva gente che non sa,
  e far sentire stupido qualcuno lavora contro lo scopo del progetto.
- [Sicurezza](SECURITY.md) — le vulnerabilità si segnalano in privato.

## Licenza — libera, ma non commerciale

Il progetto è aperto: si può leggere, studiare, modificare, tradurre, installare sul proprio
server e usare nella scuola pubblica. Quello che non si può fare, senza accordo, è
**guadagnarci**: rivenderlo o insegnarlo in un corso a pagamento.

| | Licenza | In pratica |
|---|---|---|
| **Codice** (PHP, JS, CSS, test) | [PolyForm Noncommercial 1.0.0](LICENSE) | usalo e modificalo per qualunque scopo non commerciale |
| **Contenuti didattici** (testi, quiz, glossario) | [CC BY-NC-SA 4.0](LICENSE) | riusali citando la fonte, senza scopo di lucro, con la stessa licenza |
| **Fotografia dell'autore** | tutti i diritti riservati | non riutilizzabile fuori da questo progetto |

**Scuola pubblica, ricerca e no profit: sempre libero.** Scuole statali e paritarie,
università, biblioteche, enti pubblici, associazioni senza scopo di lucro, doposcuola
gratuiti e chiunque studi per conto proprio possono usarlo senza chiedere niente.

**Formazione a pagamento: serve un accordo.** Accademie private, enti di formazione
professionale, corsi aziendali, bootcamp e ripetizioni retribuite sono usi commerciali —
non vietati, da concordare. Vale anche quando ciò che si vende è la docenza e non il
materiale: se lo studente paga, si passa da un accordo. Di norma è una formalità:
[scrivimi](https://calendly.com/davidecavallini1987/meeting).

**Contribuendo** accetti che il tuo contributo esca con queste stesse licenze e che l'autore
possa includerlo in eventuali licenze commerciali: senza, un singolo contributo bloccherebbe
per sempre il progetto. Il dettaglio, e il perché, sono al punto 5 di [LICENSE](LICENSE).

> Nota per chi conosce le definizioni: una licenza non commerciale **non** è "open source"
> secondo l'Open Source Initiative, perché limita i campi di utilizzo. È una scelta
> deliberata: il codice resta leggibile, modificabile e migliorabile da chiunque, ma il
> lavoro non finisce rivenduto da altri.

## Crediti

Contenuti e codice di **Davide Cavallini** — [YouTube](https://www.youtube.com/@informaticacavallini)
· [LinkedIn](https://www.linkedin.com/in/davidecavallini/)
· [Red Hot Cyber](https://www.redhotcyber.com/post/author/davide-cavallini/)

Le fonti scientifiche su cui è costruito il metodo didattico sono elencate,
una per una, in [`public_html/metodo.html`](public_html/metodo.html).
