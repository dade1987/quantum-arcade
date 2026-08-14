@extends('layouts.page', [
    'title' => 'Il metodo — come è costruito Quantum Arcade (e su quali ricerche)',
    'description' => 'Le scelte didattiche, di interfaccia e di accessibilità di Quantum Arcade spiegate una per una, con le ricerche che le sostengono: mastery learning, retrieval practice, ripetizione dilazionata, simulazioni interattive, carico cognitivo, WCAG.',
    'robots' => 'index, follow',
])

@push('head')
@verbatim
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Il metodo di Quantum Arcade: imparare la quantistica giocando, secondo la ricerca",
  "inLanguage": "it",
  "author": { "@type": "Person", "name": "Davide Cavallini", "url": "https://www.linkedin.com/in/davidecavallini/" },
  "about": ["apprendimento basato sul gioco", "mastery learning", "retrieval practice", "ripetizione dilazionata", "informatica quantistica"]
}
</script>
@endverbatim
@endpush

@section('body')
<header class="topbar">
  <div class="wrap-wide topbar-in">
    <a class="brand" href="{{ \App\Support\Site::page('home', $locale) }}"><img class="logo" src="/assets/logo.svg" alt="" width="30" height="30"><span>Quantum Arcade<small>informatica quantistica giocando</small></span></a>
    <span class="topbar-spacer"></span>
    @include('partials.language-picker')
    <a class="btn sm ghost" href="{{ \App\Support\Site::page('home', $locale) }}">🗺️ Mappa</a>
  </div>
</header>

<main class="wrap">

<div class="lesson-hero">
  <nav class="crumbs"><a href="{{ \App\Support\Site::page('home', $locale) }}">Mappa</a> › Il metodo</nav>
  <h1>Come è costruito questo corso</h1>
  <p class="lead">Ogni scelta — dal fatto che si gioca prima di leggere, a come si sbloccano i livelli, fino al colore
  dei bottoni — è presa da un filone di ricerca preciso. Qui le trovi elencate in chiaro, così puoi contestarle.</p>
</div>

<div class="tldr">
  <b>In due righe:</b> si impara facendo (simulazioni interattive), si consolida richiamando a memoria (quiz),
  si ricorda nel tempo (ripasso dilazionato), si avanza solo dopo aver dimostrato di aver capito (mastery learning),
  e l'interfaccia è progettata per <b>togliere</b> carico cognitivo, non per aggiungerne.
  Sotto trovi <b>tutte</b> le scelte, comprese quelle sull'ordine dei livelli, sui suoni, sull'obbligo di registrazione
  e sul modo in cui è scritto il testo commerciale di questo sito — con le fonti in fondo.
</div>

<h2>1. Perché un videogioco e non un video</h2>
<p>La meta-analisi di <b>Wouters e colleghi (2013)</b> su 77 studi (oltre 5.500 partecipanti) trova che i "serious games"
producono un apprendimento superiore all'istruzione tradizionale (d ≈ 0,29) e soprattutto una <b>ritenzione</b> migliore
(d ≈ 0,36). Ma con un dettaglio decisivo: funzionano <b>meglio quando il gioco è accompagnato da altra istruzione</b>
e quando l'esperienza è distribuita su più sessioni.</p>
<p><b>Cosa ne ricaviamo qui:</b> nessun livello è "solo gioco". Ogni mini-gioco è seguito (o preceduto) da una spiegazione
scritta, da una formula smontata e da un esempio numerico svolto. Ed è per questo che c'è il Ripasso lampo:
per spingere verso più sessioni invece che una maratona sola.</p>

<h2>2. Perché si tocca prima di leggere</h2>
<p>Le simulazioni interattive del progetto <b>PhET</b> (University of Colorado Boulder) mostrano guadagni concettuali
pari o superiori a quelli ottenuti con l'apparato di laboratorio reale, e generano discussioni più produttive.
La linea di ricerca sul <b>productive failure</b> (Kapur) mostra inoltre che <i>tentare</i> un problema prima di ricevere
la spiegazione — anche fallendo — porta a una comprensione concettuale più profonda rispetto a ricevere subito la regola.</p>
<p><b>Cosa ne ricaviamo qui:</b> in quasi tutti i livelli il cursore arriva prima della formula. Prima vedi le frecce
cancellarsi, poi ti spieghiamo che si chiama interferenza distruttiva.</p>

<h2>3. Perché ci sono i quiz (e perché non danno voti)</h2>
<p>Il <b>testing effect</b> (Roediger &amp; Karpicke) è uno dei risultati più solidi della psicologia cognitiva:
richiamare a memoria un'informazione la rinforza molto più che rileggerla per lo stesso tempo. Le rassegne
sulle tecniche di studio collocano <b>practice testing</b> e <b>distributed practice</b> ai primi posti per efficacia.</p>
<p><b>Cosa ne ricaviamo qui:</b> i quiz sono a bassa posta in gioco, con feedback immediato che spiega <i>perché</i>,
riprovabili all'infinito e senza punteggio negativo. Sbagliare è parte del metodo: una domanda sbagliata torna
prima nel ripasso, una giusta torna più tardi (sistema a scatole di <b>Leitner</b>: 1 giorno → 3 → 7 → 21 → 60).</p>

<h2>4. Perché i livelli si sbloccano solo con la padronanza</h2>
<p>Nel <b>mastery learning</b> (Bloom) lo studente procede quando ha dimostrato di padroneggiare l'unità corrente,
con tempo e tentativi variabili invece che fissi. Gli effetti misurati sono fra i più consistenti dell'istruzione
individualizzata, soprattutto per chi parte più indietro.</p>
<div class="callout key"><b>La nostra regola di sblocco (deliberatamente doppia):</b>
<ul style="margin:8px 0 0">
  <li><b>prova pratica</b> — la missione dentro il mini-gioco: dimostri di saperlo <i>fare</i>;</li>
  <li><b>prova di richiamo</b> — le domande del livello, tutte corrette almeno una volta: dimostri di saperlo <i>spiegare</i>.</li>
</ul>
<p style="margin:8px 0 0">Solo la prima sarebbe aggirabile a forza di tentativi casuali; solo la seconda si può indovinare.
Insieme sono un segnale affidabile. Chi vuole comunque girare libero (un adulto che ripassa, un insegnante che prepara
la lezione) può attivare la <b>modalità libera</b> dalla home.</p></div>

<h2>5. Perché l'interfaccia è così spoglia</h2>
<p>La <b>teoria del carico cognitivo</b> (Sweller) e i principi di <b>apprendimento multimediale</b> (Mayer) prescrivono
alcune cose molto concrete, che qui sono applicate alla lettera:</p>
<table class="table">
  <tr><th>Principio</th><th>Come è applicato in Quantum Arcade</th></tr>
  <tr><td><b>Coerenza</b> — via il superfluo</td><td>niente animazioni decorative, niente stock photo, niente popup: sullo schermo c'è solo ciò che serve al concetto</td></tr>
  <tr><td><b>Segnalazione</b> — evidenzia ciò che conta</td><td>colori costanti in tutto il corso: ampiezza = giallo, fase = viola, risultato = rosa, "c'è" = verde, "non c'è" = rosso</td></tr>
  <tr><td><b>Contiguità spaziale</b></td><td>i numeri sono scritti <i>dentro</i> il grafico, accanto all'oggetto che descrivono, non in una legenda lontana</td></tr>
  <tr><td><b>Segmentazione</b></td><td>i passaggi difficili sono a scatti ("Avanti →"), con il ritmo deciso da chi legge</td></tr>
  <tr><td><b>Pre-addestramento</b></td><td>i termini vengono definiti <i>prima</i> di essere usati in una formula: la Parte 0 esiste per questo</td></tr>
  <tr><td><b>Stile colloquiale</b></td><td>si dà del tu e si usano parole normali: il "personalization effect" mostra che aiuta la comprensione</td></tr>
</table>

<h2>6. Colori, contrasto, accessibilità</h2>
<ul>
  <li><b>Tema scuro con testo ad alto contrasto</b> e larghezza di riga limitata a ~75 caratteri: due parametri che
      incidono direttamente sulla fatica di lettura.</li>
  <li><b>Nessuna informazione affidata al solo colore</b>: ogni stato ha anche un simbolo o un'etichetta (✓, ✗, 🔒),
      requisito WCAG per chi ha daltonismo.</li>
  <li><b>Bersagli tattili</b> di almeno 44 px, <b>focus visibile</b> per la navigazione da tastiera,
      supporto a <code>prefers-reduced-motion</code> per chi soffre le animazioni.</li>
  <li><b>Feedback immediato</b> su ogni azione (sotto i 100 ms): i cursori aggiornano il disegno mentre li muovi,
      non al rilascio. È la soglia oltre la quale un'interfaccia smette di sembrare "tua".</li>
</ul>

<h2>7. Motivazione: perché XP e livelli, ma niente classifiche</h2>
<p>La <b>teoria dell'autodeterminazione</b> (Deci &amp; Ryan) individua tre motori: competenza, autonomia, relazione.
Le meta-analisi sulla gamification mostrano effetti positivi ma <b>fragili</b>: punti e badge funzionano se segnalano
<i>competenza acquisita</i>, e possono essere controproducenti se diventano l'unico motivo per giocare o se creano
pressione da confronto sociale.</p>
<p><b>Cosa ne ricaviamo qui:</b> gli XP arrivano solo per cose realmente fatte (missione superata, domanda richiamata),
i ranghi descrivono un'abilità ("Signore delle frecce", "Cacciatore di periodi") e <b>non esiste alcuna classifica</b>
né timer che corre. L'autonomia è tutelata dalla modalità libera e dalla possibilità di rigiocare qualsiasi livello.</p>

<h2>8. E l'ultimo livello?</h2>
<p>La ricerca sull'apprendimento delle STEM distingue fra <i>saper applicare</i> e <i>saper trasferire</i>.
Il trasferimento si allena solo su problemi <b>mal definiti</b>, dove non esiste una procedura da ripetere.
Per questo l'ultimo livello è un'officina aperta: obiettivi da raggiungere, blocchi a disposizione,
nessuna soluzione scritta da nessuna parte, e un contatore di "quante volte hai interrogato l'oracolo"
che ti spinge a cercare una strada più furba.</p>


<h2>9. Perché il qubit arriva al livello 1 e Fourier solo al 13</h2>
<p>La prima versione di questo corso seguiva l'ordine "logico": onde → Fourier → qubit. Sulla carta impeccabile,
nella pratica sbagliato: sette livelli di matematica prima di vedere l'oggetto per cui uno è arrivato qui.</p>
<p>L'ordine attuale segue due principi consolidati:</p>
<ul>
  <li><b>Curriculum a spirale</b> (Bruner, 1960): un concetto si incontra più volte, prima in forma semplice e poi
      completa. Le ampiezze compaiono al livello 1 come numeri <b>con il segno</b> (+ e −), che bastano per capire
      l'interferenza e H·H; diventano <b>frecce complesse</b> al livello 8, quando due segni non bastano più.
      Tornare sugli stessi concetti a distanza è anche <b>pratica dilazionata</b>: due benefici in una scelta sola.</li>
  <li><b>Just-in-time</b>: un attrezzo si introduce dove serve, non prima. Onde e trasformata di Fourier arrivano
      ai livelli 13–17, subito prima della QFT, quando la domanda "come faccio a trovare una periodicità nascosta?"
      se l'è già posta chi gioca — al livello 12, con l'algoritmo di Simon, si scopre di saper trovare
      solo periodi "in XOR", e per quelli veri servono le onde. Introdurli sette livelli prima significava
      rispondere a una domanda non ancora nata.</li>
</ul>
<div class="callout key"><b>Regola che mi sono dato:</b> nessun attrezzo può essere introdotto più di un livello
prima del punto in cui serve, e ogni concetto deve tornare almeno due volte.</div>

<h2>10. Perché il computer classico viene prima (e resta facoltativo)</h2>
<p>«Quantistico» non è una cosa: è una <b>differenza</b>. E una differenza si vede solo se si conosce il termine
di paragone. Chi non ha mai messo a fuoco che cos'è un bit non ha modo di accorgersi di che cosa sia strano in un
qubit: gli manca lo sfondo su cui si stacca la figura. Quasi tutte le frasi sbagliate che circolano —
«prova tutte le strade insieme», «è infinitamente più veloce» — nascono esattamente da lì.</p>
<p>Da qui due scelte, che si sostengono a vicenda:</p>
<ul>
  <li>una <b>Parte K</b> di sei livelli sul computer normale (bit, porte logiche, somma con il riporto, ricerca,
      costo degli algoritmi, reversibilità e principio di Landauer), giocata con gli stessi mini-giochi del resto
      del corso;</li>
  <li>un <b>blocco di confronto</b> in apertura di ogni livello quantistico dove un confronto esiste davvero:
      a sinistra come si fa con un computer normale, a destra cosa cambia, sotto il numero che dice quanto vale
      la differenza. Dove il confronto vale una partita e non un paragrafo — la ricerca prima di Grover, l'oracolo
      interrogato a mano prima di Deutsch–Jozsa, il codice a ripetizione prima della correzione d'errore
      quantistica — il mini-gioco classico si gioca lì, sul posto.</li>
</ul>
<p>Le ragioni per cui è fatto <b>così</b> e non con un capitolo di teoria iniziale:</p>
<ul>
  <li><b>Confrontare due casi concreti fa emergere il principio</b> meglio che enunciare il principio e poi darne
      un esempio (Gentner, Loewenstein &amp; Thompson, 2003; Alfieri, Nokes-Malach &amp; Schunn, 2013). Funziona
      soprattutto quando i due casi si somigliano quasi del tutto e differiscono in <b>un punto solo</b>: che è
      esattamente il rapporto fra bit e qubit, fra ricerca lineare e Grover, fra DFT e QFT.</li>
  <li><b>Le due colonne stanno affiancate</b>, non una sotto l'altra: leggere la seconda tenendo a mente la prima
      è carico cognitivo speso in memoria invece che in ragionamento (effetto dell'attenzione divisa, Sweller,
      Ayres &amp; Kalyuga). Con le colonne accostate il confronto lo fanno gli occhi.</li>
  <li><b>Il numero in fondo è sempre dello stesso tipo</b> (quante operazioni, quante domande, quanti stati):
      un metro che non cambia unità di misura da un livello all'altro è ciò che permette di accorgersi che
      Grover e Shor <b>non fanno la stessa cosa</b> — uno è un guadagno quadratico, l'altro esponenziale.</li>
  <li><b>La Parte K è facoltativa</b>, come la Parte 0, e sta fuori dalla catena dei prerequisiti. Chi sa già
      come funziona un computer tira dritto; chi ha un buco ci torna nel momento in cui il buco si fa sentire —
      che è il momento in cui si impara davvero, e non due settimane prima "perché è nel programma". Ogni blocco
      di confronto porta il link al livello classico corrispondente, quindi la porta è sempre aperta e non è mai
      un pedaggio.</li>
</ul>
<div class="callout key"><b>Effetto collaterale voluto:</b> chi finisce la Parte K ha imparato bene anche
l'informatica classica — binario, porte, complessità, reversibilità — che è roba utile di per sé, e non solo
il preambolo di qualcos'altro.</div>

<div class="callout key" style="margin-top:18px"><b>Come si presenta in pratica, livello per livello.</b>
Dove il confronto vale una partita e non un paragrafo, i due modi stanno dentro <b>lo stesso mini-gioco</b>, con un
interruttore che cambia macchina: stesso schermo, stessi bottoni, stessa missione. Cambia il meccanismo, e basta.
Succede al livello 1 (lo stesso registro di tre caselle: una colonna piena contro otto), al 3 (la stessa lancetta:
salti contro rotazioni), al 4 (la sfida delle buste, dove il classico si ferma al 75% e l'entanglement arriva
all'85%) e al 7 (due strade, dove le probabilità si sommano e le ampiezze si cancellano).</div>
<p>Tre dettagli di quei quattro giochi sono voluti e vale la pena dichiararli:</p>
<ul>
  <li><b>Prima si prova, poi si spiega</b>, e in modo classico certe missioni <b>non si possono vincere</b>.
      Sbattere contro il muro con gli attrezzi che si hanno rende la soluzione successiva molto più solida che
      riceverla per prima: è il <i>productive failure</i> di Kapur, già citato al punto 2. Il gioco però dice
      quando il muro è un muro, invece di lasciar girare a vuoto: fallire è utile, farlo senza saperlo no.</li>
  <li><b>I due casi sono allineati</b>: se una cosa cambia fra i due modi, è perché è <b>la</b> cosa. È la
      condizione che rende efficace il confronto (Gentner, <i>structure mapping</i>): il cervello isola la
      differenza solo se tutto il resto combacia.</li>
  <li><b>Il modo di calcolo si vede sempre</b>, su ogni mini-gioco del corso: blu «computer normale», viola
      «computer quantistico», con icona e parola scritta accanto al colore — mai il colore da solo, come al
      punto 6. La Parte 0 e i laboratori delle onde non portano etichetta, perché la matematica non è né l'una
      né l'altra cosa.</li>
</ul>

<h2>11. Il suono: informazione, non decorazione</h2>
<p>Un arcade senza suoni non è un arcade, ma il rumore per il rumore viola il <b>principio di coerenza</b> di Mayer
(tutto ciò che non serve al concetto sottrae attenzione). Il compromesso applicato qui:</p>
<ul>
  <li>ogni <b>tipo di evento ha il suo timbro</b>, sempre lo stesso: click, XP, missione, misura quantistica,
      interferenza costruttiva, interferenza distruttiva, fanfara di livello. Dopo pochi minuti riconosci
      cosa è successo <b>senza guardare</b>: il suono diventa un secondo canale di informazione;</li>
  <li>suoni <b>brevi</b> (sotto i 350 ms) e a volume basso, generati dal vivo con WebAudio: nessun file da scaricare,
      funziona anche a connessione lenta;</li>
  <li>l'errore <b>non punisce</b>: due note discendenti, non un buzzer. Un feedback punitivo aumenta l'ansia da
      prestazione e riduce la disponibilità a riprovare, che è esattamente ciò che serve in un corso a padronanza;</li>
  <li>si può <b>spegnere tutto</b> e la scelta viene ricordata. Nessun suono parte prima di un'interazione,
      come richiedono anche le regole dei browser.</li>
</ul>

<h2>12. "Effetto wow": feedback immediato e specifico</h2>
<p>Nella prima versione, i mini-giochi della Parte 0 non dicevano se stavi andando bene. La ricerca sul feedback
(Hattie &amp; Timperley; Shute) è chiara su un punto: il feedback funziona quando è <b>immediato</b>, <b>specifico</b>
e riferito al <b>compito</b>, non alla persona. Da qui tre aggiunte, presenti ora in <b>tutti</b> i giochi:</p>
<ul>
  <li><b>Obiettivo sempre scritto in alto</b>, in una banda dedicata: non devi ricordarti cosa ti era stato chiesto.</li>
  <li><b>Barra "quanto sei vicino"</b> che passa da rossa ad ambra a verde, accompagnata da un tono che sale man mano
      che ti avvicini: colore + suono + testo, tre canali per la stessa informazione (utile anche a chi ha
      difficoltà con i colori).</li>
  <li><b>Festeggiamento visibile</b> al traguardo — scintille, lampo, suono — perché il momento in cui hai capito
      dev'essere inequivocabile. È l'unica concessione "decorativa", e dura mezzo secondo.</li>
</ul>

<h2>13. Perché l'account è obbligatorio (e perché non mi piace)</h2>
<p>Chiedere una registrazione è attrito, e l'attrito fa perdere persone: sarebbe più comodo per tutti far girare
tutto nel browser. Due ragioni lo rendono comunque la scelta giusta:</p>
<ul>
  <li><b>i progressi non devono morire con la cache.</b> Un corso da 41 livelli si fa in più sessioni e spesso su più
      dispositivi: perdere tutto per una pulizia del browser è il modo più stupido di abbandonare;</li>
  <li><b>l'attestato deve valere qualcosa.</b> Le domande dell'esame arrivano dal server <b>senza</b> le risposte esatte
      e la correzione avviene sul server: se lo stato vivesse nel browser, chiunque potrebbe assegnarsi il 100%
      con due righe di console, e l'attestato sarebbe carta straccia.</li>
</ul>
<p>In cambio: solo i dati che servono davvero (nome, cognome, email — la data di nascita è facoltativa e serve a
distinguere gli omonimi), nessuna profilazione, nessuna pubblicità, cancellazione totale in un click.
Tutto scritto nell'<a href="{{ \App\Support\Site::page('privacy', $locale) }}">informativa</a>.</p>

<h2>14. Il tutor AI che si rifiuta di darti la soluzione</h2>
<p>Il tutor risponde solo con i contenuti di questo sito (RAG) e, per progetto, <b>non fornisce le soluzioni delle
missioni</b>: dà un indizio e ti rimanda al cursore giusto. È una scelta scomoda ma sostenuta dalla ricerca sulle
<b>desiderable difficulties</b> (Bjork): la fatica di arrivarci da soli è proprio ciò che produce l'apprendimento
duraturo. Un tutor compiacente farebbe sembrare tutto più facile e lascerebbe meno.</p>
<p>Ogni risposta cita il livello e ne mette il link: l'obiettivo del tutor è <b>riportarti dentro al gioco</b>,
non sostituirlo. E se una domanda non trova risposta nei contenuti, lo dice invece di inventare.</p>

<h2>15. Come faccio a sapere che il simulatore non mente</h2>
<p>Un corso che insegna con un simulatore ha un problema di fondo: se il simulatore sbaglia, insegna l'errore —
e lo insegna in modo convincente, perché lo fa vedere. I test del progetto controllano le proprietà che ci si
aspetta (le porte restano unitarie, la QFT riproduce <i>esattamente</i> la matrice di Fourier, le probabilità
sommano a uno). Ma quei test sono scritti da me, sullo stesso ragionamento con cui è scritto il simulatore:
se l'errore sta nel ragionamento, i test lo confermano invece di trovarlo.</p>
<p>Per questo il simulatore è confrontato con un'<b>implementazione indipendente</b>:
<a href="https://github.com/francescosisini/QuantumSim" target="_blank" rel="noopener">QuantumSim</a>, scritto in C
da <b>Francesco Sisini</b>. Trecento circuiti generati a caso — fino a 4 qubit, con Hadamard, Pauli, S, T, T†,
rotazioni di fase, CNOT, CZ e Toffoli — vengono eseguiti da entrambi i simulatori e le ampiezze confrontate una
per una. Linguaggi diversi, autori diversi, codice scritto senza conoscersi: <b>lo scarto massimo è dell'ordine
di 10⁻¹⁵</b>, cioè il limite della precisione dei numeri del computer. Un errore comune a entrambi, a quel punto,
è molto improbabile.</p>
<p class="dim small">QuantumSim è rilasciato con licenza GNU GPL v3 e <b>non è incluso in questo sito</b>: viene
scaricato e compilato solo quando si lancia la verifica (<code>npm run test:cross</code>), come un attrezzo
da banco di prova. Ringrazio Francesco Sisini per avermene concesso l'uso — e soprattutto perché è dai
<b>suoi libri</b> che ho cominciato a imparare questa materia.</p>

<h2>16. Il testo del sito: quali tecniche di persuasione uso, dichiarate</h2>
<p>Questo sito ha anche uno scopo professionale: farmi conoscere come persona che costruisce sistemi AI e insegna.
Trovo corretto dichiarare quali leve sto usando, così puoi valutarle:</p>
<table class="table">
  <tr><th>Tecnica</th><th>Ricerca di riferimento</th><th>Come la uso qui</th></tr>
  <tr><td><b>Effetto gradiente dell'obiettivo</b></td><td>Kivetz, Urminsky &amp; Zheng (2006)</td>
      <td>barra XP e livelli visibili: la motivazione cresce quanto più il traguardo è vicino</td></tr>
  <tr><td><b>Progresso donato</b></td><td>Nunes &amp; Drèze (2006)</td>
      <td>la Parte 0 è già "percorso fatto" per chi conosce le basi: si parte da una barra non vuota</td></tr>
  <tr><td><b>Prova sociale</b></td><td>Cialdini</td>
      <td>numeri <b>veri</b>: 8 realtà in cui ho insegnato, 41 livelli, oltre 300 test automatici. Nessun "10.000 studenti felici" inventato</td></tr>
  <tr><td><b>Reciprocità</b></td><td>Cialdini</td>
      <td>il corso completo è gratuito e resta gratuito: la richiesta di contatto viene dopo, e solo se ti è servito</td></tr>
  <tr><td><b>Riduzione dell'attrito</b></td><td>modello di Fogg (B = MAP)</td>
      <td>una sola azione principale per sezione e un calendario per prenotare, invece di un modulo lungo</td></tr>
</table>
<div class="callout warn"><b>Quello che NON faccio, per scelta:</b> nessun conto alla rovescia finto, nessuna
"scarsità" inventata, nessun numero gonfiato, nessuna promessa di certificazione riconosciuta che non ho.
Le tecniche di persuasione applicate a un'affermazione falsa non sono marketing: sono un imbroglio,
e su un sito che insegna a distinguere il vero dal verosimile sarebbero anche ridicole.</div>

<h2>17. Come è scritto per i motori di ricerca e per le AI</h2>
<p>Metà delle ricerche oggi finisce dentro una risposta generata da un'AI invece che in una lista di link.
Le indicazioni emerse dalla ricerca sulla <i>Generative Engine Optimization</i> sono coerenti con lo scrivere bene:</p>
<ul>
  <li><b>dati strutturati</b> (JSON-LD: Course, Person, FAQPage) perché una macchina capisca cos'è questa risorsa,
      chi l'ha scritta e cosa insegna;</li>
  <li><b>affermazioni autoconsistenti e citabili</b>: ogni risposta importante sta in un paragrafo che si regge da solo,
      senza bisogno del contesto attorno;</li>
  <li>un file <a href="/llms.txt">llms.txt</a> con i fatti verificabili del progetto, per chi indicizza con modelli linguistici;</li>
  <li><b>segnali di affidabilità</b>: autore in chiaro, fonti linkate, data di aggiornamento, e ammissione esplicita
      dei limiti (l'attestato non è accreditato).</li>
</ul>
<p class="dim small">Nota: la stessa ricerca mostra che i contenuti citati dalle AI sono quelli <b>strutturati e verificabili</b>.
Un altro modo per dire che scrivere onestamente e scrivere per essere trovati, per una volta, coincidono.</p>

<h2>18. Le tre lingue, e come si passa da una all'altra</h2>
<p>Il corso esiste per intero in italiano, inglese e spagnolo: non un riassunto tradotto, tre edizioni complete —
esame e attestato compresi. Anche gli indirizzi sono tradotti (<code>/en/lessons/</code>, <code>/es/lecciones/</code>),
perché una pagina in spagnolo che vive in una cartella chiamata "lezioni" è una pagina tradotta a metà, e si vede.</p>
<p>Il selettore in alto segue quattro regole, e nessuna è estetica:</p>
<ul>
  <li><b>Ogni lingua è scritta nella propria lingua</b> — «Español», non «Spagnolo». Chi cerca la propria lingua
      la cerca com'è scritta a casa sua, non tradotta in una lingua che magari non legge. È la raccomandazione
      del W3C e del Nielsen Norman Group, ed è anche il motivo per cui la prima versione non funzionava:
      diceva «IT EN ES», e le sigle ISO sono etichette mute per chi non le ha mai viste.</li>
  <li><b>Niente bandiere.</b> Una bandiera indica uno stato, non una lingua: quale metteresti allo spagnolo,
      fra i venti paesi che lo parlano? Al loro posto un mappamondo, che è l'unico simbolo che il pubblico
      associa a "lingua" senza associarlo a un paese.</li>
  <li><b>Si cambia lingua restando dove sei.</b> Chi sta leggendo la QFT in italiano e sceglie English vuole
      la QFT in inglese, non ricominciare dalla mappa. Gli indirizzi delle altre versioni sono gli stessi
      <code>hreflang</code> che la pagina dichiara già per i motori di ricerca: calcolarli una seconda volta
      sarebbe il modo classico di farli divergere.</li>
  <li><b>Se il tuo browser parla un'altra lingua te lo dico, ma non ti sposto.</b> Compare una riga
      — scritta <i>nella</i> lingua che propone, se no non si legge — con due bottoni: passa, oppure resta.
      Poi non chiede più. Il reindirizzamento automatico è sconsigliato esplicitamente da Google per i siti
      multilingua: impedisce di raggiungere di proposito una certa versione, confonde chi parla più lingue
      di quelle che ha configurato nel browser, e nasconde le altre copie ai motori di ricerca.</li>
</ul>
<div class="callout key">La regola sotto tutte e quattro: <b>offrire, non decidere</b>. Chi legge sa in che lingua
vuole leggere meglio di quanto lo sappia il suo browser.</div>

<h2>19. Il glossario che sta aperto mentre leggi</h2>
<p>Per un pezzo di strada il glossario è stato l'<b>ultima</b> pagina del corso. Sbagliato: la parola che blocca la
lettura non la incontri in fondo, la incontri al livello 4 — e una parola non capita non rimanda il problema,
lo <b>moltiplica</b>, perché ogni frase dopo la usa come se fosse chiara.</p>
<p>Ora il glossario sta in cima a ogni pagina e resta aperto <i>mentre</i> si legge. Le scelte precise vengono
da cinque risultati della ricerca, non da una moda grafica:</p>
<table class="table">
  <tr><th>Risultato</th><th>Come è applicato</th></tr>
  <tr><td><b>Split-attention effect</b> (Ayres &amp; Sweller): tenere a mente una frase mentre si cerca altrove
      la definizione consuma la stessa memoria di lavoro che serviva a capire il concetto</td>
      <td>il pannello si apre <i>di fianco</i> al testo e, quando lo schermo lo consente, <b>sposta</b> la pagina
      invece di coprirla: non si cambia pagina e non si perde il segno</td></tr>
  <tr><td><b>Contiguità spaziale</b> (Mayer): la spiegazione va vicino all'oggetto spiegato</td>
      <td>i termini sono marcati dentro il testo e la definizione compare <b>accanto alla parola</b>, in due righe,
      col numero del livello che la spiega per davvero</td></tr>
  <tr><td><b>Recognition rather than recall</b> (Nielsen, 6ª euristica): non si deve ricordare che una funzione esiste</td>
      <td>il bottone 📖 è nella barra in alto di <b>ogni</b> pagina del corso — mappa, lezioni e questa — e la scorciatoia
      (<b>G</b>) è la stessa in tutto il sito</td></tr>
  <tr><td><b>Glosse</b> (Nation; meta-analisi di Yun sulle glosse ipertestuali): definizioni brevi e a un gesto di
      distanza aiutano comprensione e memoria del lessico; quelle lunghe interrompono la lettura</td>
      <td>due righe, mai un muro di testo, e la ricerca accetta anche il numero di un livello
      («cos'era quella cosa del 12?»)</td></tr>
  <tr><td><b>Expertise reversal effect</b> (Kalyuga et al.): l'aiuto che serve al principiante <b>ostacola</b>
      chi già sa</td>
      <td>ogni termine si marca <b>una volta sola per pagina</b>, la prima; e l'evidenziazione si spegne con un
      interruttore che resta spento anche nelle pagine successive</td></tr>
</table>
<p>Il pannello, per scelta, <b>non è modale</b>: non blocca la lezione e non pretende di essere chiuso per continuare.
Bloccare la pagina per mostrare una definizione sarebbe come chiudere il libro per aprire il vocabolario.
Sotto i 1100 px di larghezza non c'è spazio per due colonne: lì copre, e allora basta toccare fuori per chiuderlo.</p>
<p class="dim small">Effetto collaterale utile: i termini vivono in un <b>file solo</b> (<code>js/core/glossario.js</code>),
quindi la tabella del livello 23, il pannello e le definizioni al tocco non possono più dire tre cose diverse —
cosa che era già cominciata a succedere fra la versione italiana e quelle tradotte.</p>

<h2>Fonti</h2>
<p class="dim small">Elencate nell'ordine in cui compaiono nel testo. Dove non c'è un link è perché il riferimento
è un libro o un articolo classico facilmente reperibile: preferisco citarlo così piuttosto che linkare una copia
di dubbia provenienza.</p>
<ul class="src">
  <li>Wouters, P., van Nimwegen, C., van Oostendorp, H., van der Spek, E. (2013). <i>A meta-analysis of the cognitive and motivational effects of serious games</i>. Journal of Educational Psychology, 105(2), 249–265. — <a href="https://eric.ed.gov/?id=EJ1008015" target="_blank" rel="noopener">scheda ERIC</a></li>
  <li>Clark, D. B., Tanner-Smith, E. E., Killingsworth, S. S. (2016). <i>Digital Games, Design, and Learning: A Systematic Review and Meta-Analysis</i>. Review of Educational Research, 86(1), 79–122. — <a href="https://journals.sagepub.com/doi/10.3102/0034654315582065" target="_blank" rel="noopener">articolo</a></li>
  <li>Sailer, M., Homner, L. (2020). <i>The Gamification of Learning: a Meta-analysis</i>. Educational Psychology Review. — <a href="https://link.springer.com/article/10.1007/s10648-019-09498-w" target="_blank" rel="noopener">articolo</a></li>
  <li>Perkins, K. et al. <i>PhET: Interactive Simulations for Teaching and Learning Physics</i>. The Physics Teacher, 44(1), 18–23. — <a href="https://pubs.aip.org/aapt/pte/article/44/1/18/274167/PhET-Interactive-Simulations-for-Teaching-and" target="_blank" rel="noopener">articolo</a></li>
  <li>Kapur, M. <i>Productive Failure</i>. — <a href="https://boldscience.org/wp-content/uploads/2025/04/Productive-Failure.pdf" target="_blank" rel="noopener">sintesi divulgativa (PDF)</a></li>
  <li>Roediger, H. L., Karpicke, J. D. — sul <i>testing effect</i> e l'effetto "in avanti" del richiamo: <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3983480/" target="_blank" rel="noopener">Retrieval practice enhances new learning (PMC)</a></li>
  <li>Rassegna sistematica su <i>spaced learning, interleaving e retrieval practice</i> (2023), Journal of the American College of Radiology. — <a href="https://www.jacr.org/article/S1546-1440(23)00646-4/fulltext" target="_blank" rel="noopener">articolo</a></li>
  <li>Sintesi divulgativa su richiamo + pratica dilazionata: <a href="https://evidencebased.education/resource/retrieval-and-spaced-practice-study-strategies-that-must-be-combined/" target="_blank" rel="noopener">Evidence Based Education</a></li>
  <li>Bjork, R. A. — <i>Desirable Difficulties in Theory and Practice</i>: perché ciò che rende l'apprendimento più faticoso sul momento lo rende più solido nel tempo. — <a href="https://www.researchgate.net/publication/347931447_Desirable_Difficulties_in_Theory_and_Practice" target="_blank" rel="noopener">testo</a></li>
  <li>Kivetz, R., Urminsky, O., Zheng, Y. (2006). <i>The Goal-Gradient Hypothesis Resurrected</i>. Journal of Marketing Research. — <a href="https://business.columbia.edu/insights/chazen-global-insights/goal-gradient-hypothesis-resurrected" target="_blank" rel="noopener">sintesi Columbia Business School</a></li>
  <li>Nunes, J. C., Drèze, X. (2006). <i>The Endowed Progress Effect: How Artificial Advancement Increases Effort</i>. Journal of Consumer Research. — <a href="https://www.researchgate.net/publication/23547282_The_Endowed_Progress_Effect_How_Artificial_Advancement_Increases_Effort" target="_blank" rel="noopener">testo</a></li>
  <li>Sisini, F. — <i>QuantumSim</i>, simulatore di circuiti quantistici in C, e i libri divulgativi dello stesso autore da cui è cominciato il mio percorso in questa materia. — <a href="https://github.com/francescosisini/QuantumSim" target="_blank" rel="noopener">repository</a></li>
  <li>Gentner, D., Loewenstein, J., Thompson, L. (2003). <i>Learning and Transfer: A General Role for Analogical Encoding</i>. Journal of Educational Psychology — confrontare due casi concreti fa emergere il principio comune meglio che studiarli uno alla volta. — <a href="https://groups.psych.northwestern.edu/gentner/papers/GentnerLoewensteinThompson03.pdf" target="_blank" rel="noopener">PDF</a></li>
  <li>Alfieri, L., Nokes-Malach, T. J., Schunn, C. D. (2013). <i>Learning Through Case Comparisons: A Meta-Analytic Review</i>. Educational Psychologist, 48(2), 87–113. — <a href="https://www.tandfonline.com/doi/abs/10.1080/00461520.2013.775712" target="_blank" rel="noopener">articolo</a></li>
  <li>Landauer, R. (1961), <i>Irreversibility and Heat Generation in the Computing Process</i>, e Bérut, A. et al. (2012), <i>Experimental verification of Landauer's principle</i>, Nature 483, 187–189 — il costo termodinamico di cancellare un bit, previsto e poi misurato. — <a href="https://www.nature.com/articles/nature10872" target="_blank" rel="noopener">articolo su Nature</a></li>
  <li>Bruner, J. S. (1960). <i>The Process of Education</i> — il curriculum a spirale: tornare sugli stessi concetti a livelli via via più profondi.</li>
  <li>Sweller, J. — teoria del carico cognitivo; Mayer, R. E. — principi di apprendimento multimediale (coerenza, segnalazione, contiguità, segmentazione, pre-addestramento, stile colloquiale).</li>
  <li>Hattie, J., Timperley, H. (2007). <i>The Power of Feedback</i>; Shute, V. (2008). <i>Focus on Formative Feedback</i> — il feedback funziona se immediato, specifico e riferito al compito.</li>
  <li>Deci, E. L., Ryan, R. M. — teoria dell'autodeterminazione: competenza, autonomia, relazione.</li>
  <li>Cialdini, R. B. — <i>Influence</i>: reciprocità, prova sociale, autorevolezza. Usate qui solo su affermazioni verificabili.</li>
  <li>Sulla <i>Generative Engine Optimization</i>: <a href="https://backlinko.com/generative-engine-optimization-geo" target="_blank" rel="noopener">panoramica delle pratiche</a> e <a href="https://arxiv.org/pdf/2606.12439" target="_blank" rel="noopener">position paper sui rischi (arXiv)</a></li>
  <li>WCAG 2.2 (W3C) per contrasto, bersagli tattili, focus visibile e informazione mai affidata al solo colore. — <a href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noopener">quick reference</a></li>
  <li>Ayres, P., Sweller, J. — <i>The Split-Attention Principle in Multimedia Learning</i>, in <i>The Cambridge Handbook of Multimedia Learning</i>: perché tenere insieme frase e definizione costa memoria di lavoro.</li>
  <li>Kalyuga, S., Ayres, P., Chandler, P., Sweller, J. (2003). <i>The Expertise Reversal Effect</i>. Educational Psychologist, 38(1), 23–31 — l'aiuto utile al principiante ostacola l'esperto.</li>
  <li>Nielsen, J. — <i>10 Usability Heuristics for User Interface Design</i>, in particolare la sesta («recognition rather than recall»). — <a href="https://www.nngroup.com/articles/ten-usability-heuristics/" target="_blank" rel="noopener">testo</a></li>
  <li>Nation, I. S. P. (2001). <i>Learning Vocabulary in Another Language</i>. Cambridge University Press — sul ruolo delle glosse.</li>
  <li>Yun, J. (2011). <i>The effects of hypertext glosses on L2 vocabulary acquisition: a meta-analysis</i>. Computer Assisted Language Learning, 24(1), 39–58.</li>
</ul>

<div class="callout"><b>Onestà intellettuale:</b> nessuno di questi studi riguarda <i>questo</i> corso in particolare, e gli effect size
in didattica sono medi, non garanzie. Se noti che qualcosa non funziona — un livello troppo ripido, un gioco poco chiaro —
è un dato utile: scrivimelo.</div>

<nav class="nav-foot">
  <a class="btn ghost" href="{{ \App\Support\Site::page('home', $locale) }}">← Torna alla mappa</a>
  <a class="btn primary" href="{{ \App\Support\Site::lessonPath('01-qubit', $locale) }}">▶ Comincia a giocare</a>
</nav>

<p class="muted small" style="text-align:center;margin-top:18px">
  Tutto il progetto è pubblico su
  <a class="dim" href="https://github.com/dade1987/quantum-arcade" target="_blank" rel="noopener">GitHub</a>
  con <a class="dim" href="https://github.com/dade1987/quantum-arcade/blob/main/LICENSE" target="_blank" rel="noopener">licenza libera non commerciale</a>:
  studiarlo, modificarlo e usarlo nella scuola pubblica si può sempre; per la formazione a pagamento serve un accordo.
  Se trovi un errore in queste pagine, <a class="dim" href="https://github.com/dade1987/quantum-arcade/issues" target="_blank" rel="noopener">segnalalo</a>.
</p>

</main>
@endsection

@push('scripts')
{{-- Il glossario vale anche qui: chi legge come è fatto il corso incontra gli
     stessi termini, e non deve andarseli a cercare in un'altra pagina. --}}
<script type="module">
import { bottoneGlossario, montaGlossario } from '/js/widgets/glossario.js';
const barra = document.querySelector('.topbar-in');
const mappa = barra.querySelector('.btn');
barra.insertBefore(bottoneGlossario(), mappa);
montaGlossario();
</script>
@endpush
