<div align="center">

<img src="public_html/assets/logo.svg" width="110" alt="Quantum Arcade">

# Quantum Arcade

**Impara l'informatica quantistica giocando. In italiano, da zero, fino all'algoritmo di Shor.**

[![Collaudo](https://github.com/dade1987/quantum-arcade/actions/workflows/collaudo.yml/badge.svg)](https://github.com/dade1987/quantum-arcade/actions/workflows/collaudo.yml)
[![Copertura backend](https://img.shields.io/badge/copertura%20backend-100%25-success)](docs/BACKEND.md)
[![Copertura frontend](https://img.shields.io/badge/copertura%20frontend-100%25%20righe-success)](tests/js/unit)
[![Licenza](https://img.shields.io/badge/codice-MIT-blue)](LICENSE)
[![Contenuti](https://img.shields.io/badge/contenuti-CC%20BY--SA%204.0-blue)](LICENSE)

[Come contribuire](CONTRIBUTING.md) · [Il metodo e le fonti](public_html/metodo.html) · [Architettura](docs/BACKEND.md)

</div>

---

27 livelli interattivi che partono dalle **basi di matematica delle medie** e arrivano alla
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
  lezioni/*.html           27 livelli
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
  js/data/exam-bank.js     banca domande dell'esame (fonte di verità)

Modules/                   moduli nwidart
  Accounts/                registrazione, conferma email, accesso, profilo
  Progress/                progressi salvati sul server
  Certificates/            esame corretto lato server, attestato PDF, verifica pubblica
  Chat/                    tutor AI (Neuron AI, RAG sui contenuti del sito)

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
npm run test:php         # 71 test dei moduli Laravel
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
| Hai modificato l'esame (`public_html/js/data/exam-bank.js`) | `npm run exam:sync` |
| Vuoi sapere dove il corso non è chiaro | `php artisan chat:report` |
| Prima di pubblicare | `npm run test:all` |

---

## Messa online (Hostinger, un solo dominio)

Su Hostinger la web root è già `public_html`: si carica il progetto nella home e funziona.
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

## Licenze

- **Codice**: [MIT](LICENSE) — fanne quello che vuoi.
- **Contenuti didattici** (testi, quiz, glossario): [CC BY-SA 4.0](LICENSE) — riusali citando
  la fonte e mantenendo la stessa licenza.
- **Eccezione**: la fotografia dell'autore non è riutilizzabile fuori da questo progetto.

## Crediti

Contenuti e codice di **Davide Cavallini** — [YouTube](https://www.youtube.com/@informaticacavallini)
· [LinkedIn](https://www.linkedin.com/in/davidecavallini/)
· [Red Hot Cyber](https://www.redhotcyber.com/post/author/davide-cavallini/)

Le fonti scientifiche su cui è costruito il metodo didattico sono elencate,
una per una, in [`public_html/metodo.html`](public_html/metodo.html).
