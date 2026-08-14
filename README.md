<div align="center">

<img src="public_html/assets/logo.svg" width="110" alt="Quantum Arcade">

# Quantum Arcade

**Impara l'informatica quantistica giocando. Da zero, fino all'algoritmo di Shor.**

**In italiano, in inglese e in spagnolo.** &nbsp;·&nbsp; [🇮🇹 italiano](https://quantumarcade.it/) &nbsp;·&nbsp; [🇬🇧 English](https://quantumarcade.it/en/) &nbsp;·&nbsp; [🇪🇸 español](https://quantumarcade.it/es/)

[![Collaudo](https://github.com/dade1987/quantum-arcade/actions/workflows/collaudo.yml/badge.svg)](https://github.com/dade1987/quantum-arcade/actions/workflows/collaudo.yml)
[![Copertura backend](https://img.shields.io/badge/copertura%20backend-100%25-success)](docs/BACKEND.md)
[![Copertura frontend](https://img.shields.io/badge/copertura%20frontend-100%25%20righe-success)](tests/js/unit)
[![Codice](https://img.shields.io/badge/codice-PolyForm%20Noncommercial%201.0.0-blue)](LICENSE)
[![Contenuti](https://img.shields.io/badge/contenuti-CC%20BY--NC--SA%204.0-blue)](LICENSE)

[Come contribuire](CONTRIBUTING.md) · [Il metodo e le fonti](public_html/metodo.html) · [Architettura](docs/BACKEND.md)

</div>

---

54 livelli interattivi che partono dalle **basi di matematica delle medie**, passano dal
**computer classico** (bit, porte logiche, somma binaria, ricerca, complessità, reversibilità)
e arrivano alla **trasformata di Fourier quantistica**, alla **stima di fase** e all'**algoritmo
di Shor**. Ogni concetto ha un mini-gioco: prima muovi, poi capisci. Sotto c'è un simulatore
quantistico a vettore di stato scritto da zero, verificato dai test: il circuito della QFT
riproduce **esattamente** la matrice di Fourier.

Gli attrezzi matematici non arrivano mai come premessa: arrivano **giocati, appena prima di
servire**. L'aritmetica dell'orologio e il massimo comune divisore stanno prima di Shor, le
matrici prima delle porte, gli autovettori prima della stima di fase, la serie geometrica prima
della trasformata di Fourier — e la derivata prima dei **metodi variazionali**, cioè del
quantistico che gira davvero, oggi, sull'hardware rumoroso.

Ogni livello quantistico si apre con il **confronto fianco a fianco**: come si farebbe la stessa
cosa con un computer normale, cosa cambia con quello quantistico, e il numero che dice quanto vale
la differenza. Perché «quantistico» non è una cosa: è una differenza, e una differenza si vede solo
avendo il termine di paragone.

Dove il confronto vale una partita e non un paragrafo, i due modi stanno **dentro lo stesso
mini-gioco**, con un interruttore che cambia macchina: stesso schermo, stessi bottoni, stessa
missione — cambia il meccanismo, e basta. E in modo classico alcune missioni **non si possono
vincere**: il muro è la lezione.

| | |
|---|---|
| **Per chi** | Da chi ha finito le medie in su. Nessun prerequisito di fisica, né di informatica. |
| **Quanto dura** | 10–20 minuti a livello. Un pomeriggio abbondante il percorso completo. |
| **Come si avanza** | Dimostrando la padronanza: una missione pratica **e** un quiz di richiamo. |
| **Cosa c'è alla fine** | Un'officina dove inventi algoritmi tuoi, e un esame con attestato verificabile. |
| **In che lingue** | Italiano (originale), inglese e spagnolo: tre edizioni complete, esame e attestato compresi. |
| **Come si cambia lingua** | Dal 🌐 in alto, in ogni pagina. Si resta dove sei, e ogni lingua è scritta nella propria lingua. |

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
public_html/               DOCUMENT ROOT (nome imposto da Hostinger) — solo asset e front controller
  index.php                front controller di Laravel
  css/style.css            tema unico
  js/core/                 motore del gioco
    levels.js              ordine dei livelli e prerequisiti (fonte di verità)
    qsim.js                simulatore quantistico (ampiezze, porte, misura, QFT)
    dsp.js                 DFT / FFT / avvolgimento
    store.js               XP, padronanza, ripasso (Leitner)
    account.js  api.js     registrazione, sessione, sincronizzazione
    canvas.js  audio.js    motore grafico 2D + suoni arcade
    lesson.js  ui.js  formula.js
    i18n.js                lingua della pagina, t(), indirizzi delle altre versioni
    confronto.js           il blocco «classico ⇄ quantistico» che apre le lezioni
    glossario.js           i termini del corso (fonte di verità: pannello, definizioni
                           al tocco e tabella del livello 23 leggono tutti da qui)
  js/i18n/en.js  es.js     i dizionari: la frase italiana è la chiave
  js/widgets/              i mini-giochi (uno o più per livello)
    classic.js  classic2.js  quelli del computer classico: interruttori, porte logiche,
                           sommatore, ricerca, curve di crescita, porte reversibili,
                           oracolo classico, codice a ripetizione
    coppie.js              gli esercizi appaiati: la stessa plancia con un interruttore
                           che passa dal computer normale a quello quantistico
                           (registro, porte, sfida di Bell, due strade)

lang/en.json  lang/es.json  le stesse traduzioni per il lato Laravel (__())

resources/views/           LE PAGINE. Una view per pagina per lingua, un layout per tutte
  layouts/page.blade.php   <head> di ogni pagina: title, canonical, hreflang, dati strutturati
  layouts/lesson.blade.php titolo e descrizione di una lezione, presi da levels.js
  partials/                il selettore di lingua, in un posto solo
  pages/{it,en,es}/        home, metodo, privacy
  lessons/{it,en,es}/      i 54 livelli, con il nome dell'ID (lo slug sta nell'indirizzo)

config/site.php            GENERATO da levels.js con `npm run sync`: lingue, livelli, slug,
                           titoli. È da qui che nascono le rotte e i <head>

data/exam-bank-sample.js   banca domande pubblica (per chi contribuisce)
                           l'esame vero sta in exam-bank-private.js, che NON è in git

Modules/                   moduli nwidart
  Accounts/                registrazione, conferma email, accesso, profilo
  Progress/                progressi salvati sul server
  Certificates/            esame corretto lato server, attestato PDF, verifica pubblica
  Chat/                    tutor AI (Neuron AI, RAG sui contenuti del sito, embedding locali)

tests/
  Feature/Modules/         test PHP dei quattro moduli (100% di copertura)
  js/unit/                 test del motore del gioco (100% righe)
  js/e2e/                  Playwright: percorso utente, audit grafico, link e indirizzi
tools/                     validatore, test matematici, sincronizzazione esame
docs/BACKEND.md            architettura e messa online su Hostinger
```

---

## Collaudo

```bash
npm test                 # motore del gioco (458 test) + validatore + stato delle lingue
npm run test:coverage    # copertura del frontend
npm run test:php         # 124 test dei moduli Laravel
npm run test:php:coverage
npm run test:e2e         # Playwright: percorso utente, audit grafico di ogni pagina, le tre lingue, i link
npm run test:cross  # confronta il simulatore con QuantumSim (implementazione indipendente)
npm run test:all         # tutto
```

Stato attuale: **frontend 100% righe · backend 100%**. I due conteggi qui sopra non sono
decorativi: `npm run validate` li confronta con i test che esistono davvero e si ferma se
qualcuno aggiunge un test senza aggiornarli — come è già successo con il numero di livelli
stampato sull'attestato.

Il validatore (`npm run validate`) controlla sintassi JS, script inline nelle pagine,
import risolvibili, tag HTML bilanciati, risorse mancanti, coerenza con `levels.js`,
sintassi PHP, JSON e SVG. Lanciarlo prima di ogni pubblicazione.

Sulle tre lingue controlla anche che nessuna resti indietro: una lingua pubblicata
deve avere **tutte** le lezioni, il numero di livelli scritto a parole deve combaciare
in tutte e tre, e la sitemap deve elencare ogni pagina di ogni edizione. `npm run languages`
confronta le frasi usate nel codice con i dizionari e fallisce se ne manca una — così
una frase nuova aggiunta in italiano non resta invisibile finché qualcuno non apre per
caso la pagina in spagnolo.

---

## Manutenzione

| Quando | Comando |
|---|---|
| Hai modificato i livelli | `php artisan chat:ingest` (riallinea il tutor) |
| Hai aggiunto o rinominato pagine | `npm run sitemap` |
| Hai aggiunto frasi da tradurre | `npm run languages` (con `--fix` prepara le chiavi mancanti) |
| Hai modificato l'esame (`data/exam-bank-*.js`) | `npm run exam:sync` |
| Vuoi sapere dove il corso non è chiaro | `php artisan chat:report` |
| Prima di pubblicare | `npm run test:all` |
| Sul server, dopo ogni caricamento | `bash tools/deploy.sh` |
| Per sapere se il server è a posto | `php artisan site:check --production` |

---

## Messa online (Hostinger, un solo dominio)

Su Hostinger la web root è già `public_html`: si carica il progetto nella home e funziona.

```bash
cp .env.example .env && nano .env     # una volta sola
php artisan key:generate
bash tools/deploy.sh            # dipendenze, migrazioni, cache, indice, controllo
```

L'ultimo passo dello script è `php artisan site:check --production`, che verifica
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

## Ringraziamenti

**Francesco Sisini** — per [QuantumSim](https://github.com/francescosisini/QuantumSim), il suo simulatore di
circuiti quantistici in C, che qui serve come **implementazione indipendente** contro cui verificare il
simulatore di questo progetto: trecento circuiti generati a caso, due programmi scritti da persone diverse in
linguaggi diversi, scarto massimo dell'ordine di 10⁻¹⁵. Lo ringrazio per avermene concesso liberamente l'uso, e
soprattutto perché **è dai suoi libri che ho cominciato a imparare questa materia**.

> QuantumSim è rilasciato con licenza GNU GPL v3 e **non è incluso in questo progetto**: `npm run test:cross`
> lo scarica in `.quantumsim/` (fuori da git), lo compila e lo interroga. Resta un attrezzo del banco di prova,
> non una dipendenza del sito.

## Crediti

Contenuti e codice di **Davide Cavallini** — [YouTube](https://www.youtube.com/@informaticacavallini)
· [LinkedIn](https://www.linkedin.com/in/davidecavallini/)
· [Red Hot Cyber](https://www.redhotcyber.com/post/author/davide-cavallini/)

Le fonti scientifiche su cui è costruito il metodo didattico sono elencate,
una per una, in [`public_html/metodo.html`](public_html/metodo.html).
