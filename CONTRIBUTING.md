# Contribuire a Quantum Arcade

Grazie: che tu voglia correggere un refuso o scrivere un livello nuovo, qui trovi tutto
quello che serve. Questo documento è organizzato attorno a un fatto misurato dalla ricerca
sull'open source: **le persone non abbandonano un progetto perché è difficile, ma perché non
capiscono da dove cominciare e non ricevono risposta.** Le [fonti sono in fondo](#perché-questo-documento-è-fatto-così).

---

## In 5 minuti: il primo contributo

```bash
git clone https://github.com/<utente>/quantum-arcade.git
cd quantum-arcade

composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite && php artisan migrate

npm install          # serve solo per i test
npm start            # → http://127.0.0.1:8010
```

Se il sito si apre e riesci a registrarti, l'ambiente è a posto. **Le email di conferma
finiscono in `storage/logs/laravel.log`** finché non configuri un vero SMTP: cerca `verify?token=`
e incolla il link nel browser.

Poi:

```bash
npm run test:all     # unitari + PHP + end-to-end + validatore
```

Se è tutto verde, puoi cominciare.

---

## Da dove cominciare (scegli il tuo livello di impegno)

| Tempo | Cosa puoi fare | Dove si tocca |
|---|---|---|
| 10 minuti | Correggere un refuso, chiarire una frase confusa | `resources/views/lessons/it/*.blade.php` |
| 30 minuti | Aggiungere una domanda al quiz di un livello | stesso file, sezione `quiz:` |
| 1 ora | Migliorare un mini-gioco esistente (etichette, colori, suoni) | `public_html/js/widgets/*.js` |
| mezza giornata | Scrivere un **livello nuovo** | vedi sotto |
| 20 minuti | Migliorare una traduzione inglese o spagnola | `resources/views/{lessons,pages}/{en,es}/`, `js/i18n/*.js` |
| 20 minuti | Correggere il nome di una lingua nel selettore | `LOCALE_NAMES` in `js/core/i18n.js` — scritto **nella lingua stessa**, mai una bandiera |
| a piacere | Aggiungere una **quarta** lingua | apri prima una issue: sono 90 pagine, meglio parlarne |

Le issue etichettate **`buon primo contributo`** sono scelte apposta: piccole, isolate,
con il file già indicato. Se non ne trovi di libere, apri una issue e dillo: te ne preparo una.

---

## Come è fatto il progetto

```
public_html/          SOLO asset: il motore del gioco in JS, il tema, le immagini
  js/core/            motore: simulatore quantistico, DFT, stato del giocatore, interfaccia
  js/i18n/            i dizionari: en.js, es.js (la chiave è la frase italiana)
  js/widgets/         i mini-giochi, uno o più per livello
resources/views/      LE PAGINE, come view Blade
  layouts/            il <head> di tutte: title, canonical, hreflang. Nessuna pagina lo riscrive
  pages/{it,en,es}/   home, metodo, privacy
  lessons/{it,en,es}/ una view per lezione per lingua: contiene SOLO i contenuti
config/site.php       GENERATO da levels.js (`npm run sync`): da qui nascono rotte e <head>
lang/                 en.json, es.json: le stesse traduzioni per il lato Laravel
Modules/              backend Laravel a moduli: Accounts, Progress, Certificates, Chat
tests/                test PHP, test unitari JS, test end-to-end Playwright
tools/                validatore, verifiche matematiche, sincronizzazione esame, sitemap
```

Due regole che tengono in piedi tutto:

1. **`public_html/js/core/levels.js` è l'unica fonte di verità** per l'elenco dei livelli,
   il loro ordine e i prerequisiti. Se aggiungi un livello, parti da lì.
2. **Nessun passaggio di build.** I file che modifichi sono quelli che vanno online.
   Niente webpack, niente Vite, niente `npm run build`.

---

## Aggiungere un livello

1. Aggiungi una riga in `public_html/js/core/levels.js`. Il percorso del file **non si
   scrive**: si ricava dall'`id`, così una lingua non può dimenticarsene una a metà elenco.

   ```js
   { id: '25-mio-livello', part: 'D', n: 25,
     title: t('Titolo breve'), desc: t('Una riga che invogli a entrarci.'), xp: 120 },
   ```

2. Aggiungi l'id alla mappa `SLUG` nello stesso file, con il nome che il file avrà nelle
   altre due lingue (anche gli indirizzi sono tradotti: `/en/lessons/`, `/es/lecciones/`).
3. Copia una lezione esistente simile (`resources/views/lessons/it/11-grover.blade.php` è un
   buon modello) e cambia `id`, contenuti e quiz. Poi fai lo stesso in `lessons/en/` e
   `lessons/es/`: una lingua pubblicata deve avere **tutte** le lezioni, e il validatore si
   ferma se ne manca una. Il nome del file è l'**id**, non lo slug: lo slug sta nell'indirizzo,
   che si traduce, mentre l'id è quello che le tre lingue hanno in comune.
4. Il titolo **non si scrive**. Lo compone `layouts/lesson.blade.php` da numero e titolo del
   livello, che stanno in `levels.js`. Era proprio questo il punto: scritti a mano, i titoli
   di 21 lezioni su 28 avevano smesso di corrispondere alla pagina.
5. `npm run sync` rigenera `config/site.php`, da cui nascono le rotte: senza, il livello nuovo
   non ha un indirizzo.
6. `npm run languages` dice quali frasi nuove mancano nei dizionari (`--fix` prepara le chiavi).
7. `npm run sitemap` rigenera l'elenco degli indirizzi per i motori di ricerca.
8. `npm run validate` controlla che l'id combaci, che le view esistano in tutte le lingue,
   che nessuna si riscriva la testa da sola e che l'HTML sia valido.
9. `npm run test:e2e` verifica che la pagina non abbia errori JS, non sbordi e disegni davvero —
   e, dentro i mini-giochi, che nessuna scritta finisca fuori dalla tela, sopra a un'altra o
   troncata coi puntini (`tests/js/e2e/07-canvas.spec.js`, su computer e su telefono).

### Quando un mini-gioco «si vede male»

Le scritte dei mini-giochi sono disegnate dentro il canvas: per il DOM non esistono, quindi
nessuna misura sugli elementi HTML può accorgersi che una finisce sotto il bordo. Il collaudo
end-to-end le controlla da solo, ma per guardarci dentro a mano ci sono due strumenti che
aprono ogni livello su più formati di schermo e scrivono un rapporto:

```bash
npm start &                                        # il sito su :8010
node tools/audit-canvas-text.mjs  http://127.0.0.1:8010   # → tests/testi-canvas.json
node tools/audit-playability.mjs  http://127.0.0.1:8010   # → tests/giocabilita.json
```

Si registrano un account di collaudo da soli (senza, la lezione non monta i giochi) e saltano
i motori che non hai installato. Il rapporto elenca, livello per livello e schermo per schermo,
che cosa esce dalla tela, che cosa si accavalla e che cosa è troppo piccolo per leggerlo.

Quasi tutti questi difetti nascono dallo stesso punto: `Stage` **accorcia la tela** quando la
finestra è bassa (un telefono girato in orizzontale), e una scena disegnata a distanze fisse
dall'alto va a sbattere sul fondo. Quando scrivi un widget, ricava le misure da `s.h` invece
di fissarle: `height` è una richiesta, non una promessa.

**Cosa rende buono un livello, in questo progetto:**

- si **tocca prima di leggere**: il cursore viene prima della formula;
- ogni formula ha i suoi simboli **cliccabili** (usa `formula()` da `js/core/formula.js`);
- c'è **una missione** con un traguardo verificabile, non solo testo;
- c'è un **quiz di richiamo** con spiegazione del *perché*, anche per le risposte sbagliate;
- niente concetti usati prima di essere introdotti: se ti serve un attrezzo,
  o è già stato costruito in un livello precedente, o lo costruisci tu lì.

Il ragionamento dietro queste regole è documentato in
[`public_html/metodo.html`](public_html/metodo.html), con le ricerche che le sostengono.

---

## Aggiungere o modificare un mini-gioco

I widget vivono in `public_html/js/widgets/` e seguono tutti la stessa forma:

```js
export function mioGioco(host, opts = {}) {
  const cfg = Object.assign({ onWin: null }, opts);
  const w = widget(host, { title: '…', subtitle: '…' });

  const stage = new Stage(w.body, { height: 300, draw(ctx, s) { /* disegno */ } });
  const fx = attachFX(stage);          // scintille e lampi ai traguardi

  // …controlli, logica…

  function traguardo() { fx.win(); sfx.ok(); cfg.onWin && cfg.onWin(); }

  return { stage };
}
```

Quattro cose non negoziabili, perché sono la differenza fra un widget e un giocattolo inutile:

1. **L'obiettivo è scritto sullo schermo**, non solo nel testo della lezione.
2. **Feedback continuo**: si deve capire se ci si sta avvicinando *prima* di arrivarci
   (colore + suono + numero).
3. **Suono coerente**: usa gli effetti già esistenti in `js/core/audio.js`, non aggiungerne
   di nuovi senza motivo. Ogni suono deve significare sempre la stessa cosa.
4. **Deve funzionare col dito**: bersagli da almeno 44 px, niente hover come unica affordance.

---

## Modificare il backend

```bash
php artisan test                       # 124 test, devono restare verdi
XDEBUG_MODE=coverage php artisan test --coverage
```

La copertura del backend è al **100%** e vorremmo restarci: se aggiungi un ramo di codice,
aggiungi il test che lo percorre. Non è pedanteria — tre bug veri (il PDF che cercava la
cartella sbagliata, i progressi non salvabili a stato vuoto, i codici attestato con lettere
ambigue) sono stati trovati esattamente così.

Le rotte stanno in `Modules/<Modulo>/routes/`, la logica in `app/Http/Controllers/`.
Se aggiungi un modulo: `php artisan module:make NomeModulo` e poi registra il namespace
in `composer.json` (`autoload.psr-4`).

---

## Prima di aprire una pull request

```bash
npm run test:all
```

Deve essere tutto verde. In più:

- **un contributo, una pull request**: più facile da leggere, più veloce da accettare;
- **scrivi in inglese** nel codice, nei nomi e nei commenti: i contenuti esistono in tre lingue,
  ma il codice è uno solo e lo legge chiunque. I *contenuti* delle lezioni restano ovviamente
  nella loro lingua;
- **spiega il perché** nel messaggio della PR, non il cosa (il cosa si vede dal diff);
- se cambi un contenuto didattico, dì **su quale base**: un'esperienza in aula, una fonte,
  una segnalazione di uno studente. Le opinioni valgono, ma dichiarate.

### Messaggi di commit

Formato semplice, in italiano:

```
livello 11: chiarita la spiegazione del diffusore
widget: la sfera di Bloch ora si gira anche col dito
backend: l'attestato riporta la data di nascita
```

---

## Cosa succede dopo

Rispondo alle issue e alle PR **entro pochi giorni**. Se non rispondo, insisti pure:
non è disinteresse, è che mi è sfuggita. La ricerca sull'open source è chiarissima su questo
punto — la mancata risposta della comunità è uno dei motivi principali per cui chi arriva
se ne va — e sarebbe sciocco cascarci proprio in un progetto che parla di metodo.

Se una PR non viene accettata, spiego sempre perché. Un "no" motivato è utile;
un silenzio non lo è mai.

---

## Chi partecipa

Chi contribuisce in modo sostanziale viene citato nel `README` e, se vuole, nella pagina
dei crediti del sito. Le pipeline interessanti trovate nell'**officina** (livello 22)
finiranno in una sezione dedicata con il nome di chi le ha scoperte.

---

## Una nota sulle domande d'esame

Nel repository trovi `data/exam-bank-sample.js`: sono domande vere ma **pubbliche**, e
servono a far girare sito e test in locale. L'esame che rilascia l'attestato usa una banca
diversa, che non sta in git e non è scaricabile da nessuna parte — perché un esame le cui
risposte si possono leggere non misura niente.

Se vuoi proporre domande nuove, aprine una issue o mandale nella pull request modificando la
banca d'esempio: le valuto e, se sono buone, entrano in quella vera.

---

## Con che licenza esce il tuo contributo

Il progetto è **libero ma non commerciale**: chiunque può leggerlo, modificarlo, tradurlo,
installarlo sul proprio server e usarlo nella scuola pubblica, all'università o in un doposcuola
gratuito. Quello che non si può fare, senza accordo scritto, è **guadagnarci**: rivenderlo,
infilarlo in un prodotto a pagamento o usarlo per insegnare in un corso a pagamento. Il testo completo è in [LICENSE](LICENSE):

- **codice** → [PolyForm Noncommercial 1.0.0](LICENSE)
- **contenuti didattici** → [CC BY-NC-SA 4.0](LICENSE)

Aprendo una pull request accetti due cose:

1. il tuo contributo esce **con queste stesse licenze** (regola standard: quello che entra
   ha la licenza di quello che esce);
2. autorizzi l'autore a includerlo nelle eventuali **licenze commerciali** che concede a chi
   le chiede.

Il punto 2 sembra sbilanciato ed è giusto spiegarlo: senza, basterebbe una sola pull request
accettata per rendere impossibile qualunque accordo futuro, anche a chi ha scritto tutto il
resto. Tu **mantieni il tuo copyright**, resti nella cronologia del progetto e nei crediti.
Se la condizione non ti convince, scrivilo nella pull request: si discute (per esempio
tenendo il tuo contributo in un file separato e marcato).

Una precisazione onesta: una licenza non commerciale **non** è "open source" secondo la
definizione dell'Open Source Initiative, perché limita i campi di utilizzo. Se per te è un
criterio dirimente è meglio saperlo prima di scrivere codice, non dopo.

---

## Perché questo documento è fatto così

La revisione sistematica di **Steinmacher e colleghi** su 21 studi individua cinque famiglie
di barriere per chi arriva in un progetto open source: trovare da dove iniziare, interazioni
sociali, problemi di codice, **documentazione inadeguata** e lacune di conoscenza. Le più
frequenti sono la difficoltà di **trovare un compito adatto** e la **mancata risposta**
della comunità.

Da qui le scelte concrete di questo file:

| Barriera individuata dalla ricerca | Cosa ho fatto |
|---|---|
| "Non so da dove iniziare" | tabella dei contributi per tempo disponibile, issue `buon primo contributo` con il file già indicato |
| "Non riesco a far partire il progetto" | avvio in cinque comandi, con la verifica esplicita che dice se ha funzionato |
| "La documentazione è vecchia o incompleta" | il validatore controlla che i riferimenti nei documenti esistano davvero; la CI lo esegue a ogni PR |
| "Non ricevo risposta" | impegno esplicito sui tempi, e un "no" sempre motivato |
| "Non so se il mio contributo è giusto" | un solo comando (`npm run test:all`) dice se va bene, prima di aprire la PR |

**Fonti**

- Steinmacher, I., Gerosa, M. A., Redmiles, D. — *Barriers Faced by Newcomers to Open Source Projects: A Systematic Review* — [testo (PDF)](https://www.ime.usp.br/~gerosa/papers/Steinmacher2014_Chapter_BarriersFacedByNewcomersToOpen.pdf)
- Steinmacher, I. et al. — *A systematic literature review on the barriers faced by newcomers to open source software projects*, Information and Software Technology — [articolo](https://www.sciencedirect.com/science/article/abs/pii/S0950584914002390)
- Steinmacher, I., Gerosa, M. A., Redmiles, D. — *How to Support Newcomers Onboarding to Open Source Software Projects* — [capitolo](https://link.springer.com/chapter/10.1007/978-3-642-55128-4_29)
