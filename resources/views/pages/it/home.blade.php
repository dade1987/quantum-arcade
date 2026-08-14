@extends('layouts.page', [
    'title' => 'Quantum Arcade — Informatica quantistica giocando | corso interattivo gratuito in italiano',
    'description' => 'Corso-videogioco gratuito in italiano per imparare l\'informatica quantistica da zero: onde, fase, numeri complessi, trasformata di Fourier (DFT), qubit, porte, entanglement, Grover, QFT e algoritmo di Shor. 37 livelli interattivi con simulatore quantistico reale. Di Davide Cavallini.',
    'ogTitle' => 'Quantum Arcade — impara l\'informatica quantistica giocando',
    'ogDescription' => '37 livelli interattivi in italiano: dalle onde alla trasformata di Fourier quantistica e all\'algoritmo di Shor. Con simulatore quantistico vero e sblocco per padronanza.',
])

@push('head')
@verbatim
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": "https://quantumarcade.it/#course",
      "name": "Quantum Arcade — Informatica quantistica giocando",
      "description": "Corso interattivo gratuito in italiano che insegna l'informatica quantistica partendo dalle onde e dalla trasformata di Fourier fino alla QFT e all'algoritmo di Shor, tramite 37 livelli giocabili con simulatore quantistico a vettore di stato.",
      "inLanguage": "it",
      "isAccessibleForFree": true,
      "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      "isBasedOn": "https://github.com/dade1987/quantum-arcade",
      "educationalLevel": "Da scuola secondaria di primo grado in su",
      "teaches": [
        "Onde sinusoidali: ampiezza, frequenza e fase (con il periodo T = 1/f)",
        "Numeri complessi ed esponenziale complesso e^{iθ}",
        "Interferenza costruttiva e distruttiva",
        "Trasformata di Fourier discreta (DFT) e FFT",
        "Qubit, sfera di Bloch, misura e probabilità",
        "Porte quantistiche a uno e due qubit, entanglement",
        "Algoritmi di Deutsch-Jozsa, Bernstein-Vazirani, Grover e Simon",
        "Vantaggio quantistico esponenziale e problema del periodo nascosto",
        "Trasformata di Fourier quantistica (QFT)",
        "Quantum Phase Estimation e algoritmo di Shor"
      ],
      "provider": { "@id": "https://quantumarcade.it/#author" },
      "author": { "@id": "https://quantumarcade.it/#author" },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "courseWorkload": "PT6H"
      }
    },
    {
      "@type": "Person",
      "@id": "https://quantumarcade.it/#author",
      "name": "Davide Cavallini",
      "jobTitle": "Forward Deployed AI Engineer",
      "description": "Programmatore da quando aveva 7 anni (imparato sul Commodore 64 con il nonno), professionista dal 2012, attivo nell'informatica quantistica dal 2017 e nell'intelligenza artificiale dal 2019. Forward Deployed AI Engineer, sviluppa gestionali AI su misura per le aziende. Formazione universitaria in matematica e statistica alla London School of Economics. Autore su Red Hot Cyber e divulgatore su YouTube.",
      "image": "https://quantumarcade.it/assets/davide.jpeg",
      "sameAs": [
        "https://www.youtube.com/@informaticacavallini",
        "https://www.linkedin.com/in/davidecavallini/",
        "https://www.redhotcyber.com/post/author/davide-cavallini/",
        "https://calendly.com/davidecavallini1987/meeting"
      ],
      "knowsAbout": [
        "intelligenza artificiale applicata alle aziende",
        "gestionali AI su misura",
        "informatica quantistica",
        "sviluppo software",
        "sicurezza informatica"
      ],
      "alumniOf": { "@type": "EducationalOrganization", "name": "London School of Economics and Political Science" },
      "makesOffer": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gestionali AI su misura", "serviceType": "Sviluppo software con intelligenza artificiale" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Formazione aziendale e scolastica", "serviceType": "Docenza su AI, sviluppo, cybersecurity e informatica quantistica" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Lezioni individuali", "serviceType": "Tutoraggio uno a uno" } }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://quantumarcade.it/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Serve saper già la matematica per imparare l'informatica quantistica?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. Quantum Arcade parte da una Parte 0 dedicata alle basi (numeri negativi, frazioni e percentuali, coordinate, gradi, probabilità) pensata per chi ha finito la scuola media. Seno, coseno, numeri complessi ed esponenziale complesso vengono costruiti dentro il corso partendo da un punto che gira su un cerchio." }
        },
        {
          "@type": "Question",
          "name": "Che cos'è la trasformata di Fourier quantistica (QFT), in parole semplici?",
          "acceptedAnswer": { "@type": "Answer", "text": "La QFT è la trasformata di Fourier applicata alle ampiezze di uno stato quantistico. Come la Fourier classica trasforma un segnale nel tempo in una lista di frequenze, la QFT trasforma l'informazione contenuta nella posizione delle ampiezze in informazione contenuta nelle loro fasi. Si realizza con porte di Hadamard, rotazioni di fase controllate e SWAP finali, per un totale di circa n²/2 porte su n qubit." }
        },
        {
          "@type": "Question",
          "name": "Perché l'algoritmo di Shor usa la trasformata di Fourier?",
          "acceptedAnswer": { "@type": "Answer", "text": "Shor riduce la fattorizzazione di un numero al problema di trovare il periodo della funzione f(x) = a^x mod N. Il periodo è nascosto nelle ampiezze di uno stato quantistico: la QFT lo trasforma in picchi di probabilità misurabili. Dal valore misurato, con le frazioni continue, si ricava il periodo r e da lì i fattori tramite MCD(a^(r/2) ± 1, N), purché r sia pari e a^(r/2) non sia congruo a −1 modulo N; altrimenti si sceglie un altro a e si ripete (succede in meno della metà dei casi)." }
        },
        {
          "@type": "Question",
          "name": "Un qubit è come una moneta truccata?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. Una moneta mescolata due volte resta casuale, mentre un qubit a cui si applicano due porte di Hadamard torna con certezza allo stato di partenza. La differenza è l'interferenza: le ampiezze quantistiche sono numeri complessi con una direzione e possono cancellarsi fra loro, cosa che le probabilità classiche non fanno mai." }
        },
        {
          "@type": "Question",
          "name": "Quantum Arcade è gratuito? Serve registrarsi?",
          "acceptedAnswer": { "@type": "Answer", "text": "Sì, è completamente gratuito. Serve un account gratuito (nome, cognome, email e password) perché i progressi vengono salvati sul server e perché l'esame finale, corretto lato server, rilascia un attestato di completamento in PDF con codice verificabile pubblicamente." }
        }
      ]
    }
  ]
}
</script>
@endverbatim
@endpush

@section('body')
<a class="skip-link" href="#mappa">Salta al contenuto</a>

<header class="topbar">
  <div class="wrap-wide topbar-in">
    <a class="brand" href="{{ \App\Support\Site::page('home', $locale) }}">
      <img class="logo" src="/assets/logo.svg" alt="" width="30" height="30">
      <span>Quantum Arcade<small>informatica quantistica giocando</small></span>
    </a>
    <span class="topbar-spacer"></span>
    <div id="xp-host"></div>
  </div>
</header>

<main class="wrap">

  <!-- ============ HERO ============ -->
  <div style="padding:46px 0 6px">
    <span class="tag cyan">🇮🇹 corso-videogioco gratuito in italiano</span>
    <h1 style="margin-top:14px">Impara l'informatica quantistica<br><span style="background:linear-gradient(90deg,var(--cyan),var(--violet));-webkit-background-clip:text;background-clip:text;color:transparent">giocandoci davvero.</span></h1>
    <p class="lead">
      Trentasette livelli interattivi che partono dalle <b>basi di matematica delle medie</b>, passano dalle <b>onde</b>
      (ampiezza, frequenza e fase: le tre manopole che bastano a descrivere una sinusoide — il periodo è la frequenza
      girata al contrario, T = 1/f) e arrivano fino alla <b>trasformata di Fourier quantistica</b> e all'<b>algoritmo di Shor</b>.
      Ogni formula è smontata pezzo per pezzo e ogni pezzo lo puoi <b>toccare, trascinare e rompere</b>
      finché non ti si accende la lampadina.
    </p>
    <!-- Chi ha provato il sito ha chiesto "ma a chi è rivolto?". Se uno se lo
         deve chiedere, la home ha già fallito: qui la risposta arriva prima
         della domanda, con il prerequisito detto in parole di tutti i giorni. -->
    <div class="callout ok" style="margin:16px 0 6px">
      <b>Per chi è:</b> se hai finito le medie e sai cos'è una percentuale, questo corso è per te.
      <b>Non serve fisica</b>, non serve l'università, non serve saper già la trigonometria: seno,
      coseno e numeri complessi te li costruisci qui dentro, giocando, nel momento in cui servono.
    </div>

    <p id="progress-line" class="dim" style="font-size:15px"></p>
    <div class="btn-row" style="margin:18px 0 6px">
      <a class="btn primary" id="continue" href="{{ \App\Support\Site::lessonPath('01-qubit', $locale) }}">▶ Inizia</a>
      <a class="btn ghost" href="{{ \App\Support\Site::lessonPath('00-numeri', $locale) }}">🧮 Parto da zero zero (Parte 0)</a>
      <a class="btn ghost" href="{{ \App\Support\Site::lessonPath('k1-bit', $locale) }}">💻 Non so cos'è un bit (Parte K)</a>
      <a class="btn ghost" href="#mappa">🗺️ Tutti i livelli</a>
      <a class="btn ghost" href="{{ \App\Support\Site::page('method', $locale) }}">🔬 Il metodo (e le ricerche)</a>
    </div>

    <!-- Il glossario è un riferimento, non un premio di fine corso: sta in cima
         e resta a un tasto di distanza in ogni pagina. Il collegamento punta
         comunque alla pagina completa, così funziona anche senza JavaScript. -->
    <p class="small dim" style="margin:10px 0 0">
      📖 <b>Dubbio su una parola?</b> Il <a href="{{ \App\Support\Site::lessonPath('23-glossario', $locale) }}" id="apri-glossario">glossario</a>
      si apre di fianco al testo in qualsiasi pagina — anche col tasto <b>G</b> — con il livello in cui ogni
      termine è spiegato. E dentro le lezioni le parole sottolineate danno la definizione al tocco,
      senza perdere il segno.
    </p>
  </div>

  <div class="panel hidden" id="account-banner" style="border-color:rgba(34,211,238,.45);margin-top:6px">
    <div class="grid-2" style="align-items:center">
      <div>
        <h3 style="margin-top:0">Puoi cominciare subito — l'account serve dopo</h3>
        <p class="mb0 dim">La <b>Parte 0</b> e il <b>livello 1</b> si giocano senza registrarsi: cinque livelli
        interi, per capire se il corso fa per te. L'account (nome, cognome, email e password: <b>è gratis</b>
        e ci vuole meno di un minuto) serve per <b>salvare i progressi sul server</b> — così li ritrovi su ogni
        dispositivo e non muoiono con la cache del browser — e perché l'<b>attestato finale</b> riporta i tuoi
        dati e dev'essere verificabile da chiunque.</p>
      </div>
      <div class="btn-row" style="justify-content:flex-end">
        <a class="btn primary" href="#" id="banner-login">✍️ Crea il tuo account</a>
        <a class="btn ghost" href="{{ \App\Support\Site::page('privacy', $locale) }}">Come tratto i dati</a>
      </div>
    </div>
  </div>

  <!-- ============ TL;DR — utile a lettori umani e a motori generativi ============ -->
  <div class="tldr">
    <b>In breve:</b> Quantum Arcade è un corso gratuito in italiano che insegna l'informatica quantistica
    con mini-giochi interattivi e un simulatore a vettore di stato scritto da zero.
    Si parte dalle onde e dalla trasformata di Fourier classica, si costruiscono qubit, porte ed entanglement,
    e si arriva a Grover, QFT, Quantum Phase Estimation e Shor. Ogni livello si sblocca <b>dimostrando la padronanza</b>
    (una missione pratica nel gioco + un quiz di richiamo), e le domande già viste tornano a distanza di giorni
    nel <b>Ripasso lampo</b>. Per giocare serve un <b>account gratuito</b> (nome, cognome, email): i progressi si salvano sul server e ti seguono ovunque, il <b>tutor AI</b> risponde alle tue domande e l'esame finale — corretto dal server — rilascia un <b>attestato in PDF</b> con codice verificabile pubblicamente.
  </div>

  <!-- ============ COME FUNZIONA ============ -->
  <h2 id="come-funziona">Come funziona</h2>
  <div class="grid-3">
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>1 · Prima si tocca</h3>
      <p class="mb0 dim">Ogni concetto arriva come mini-gioco: cursori, frecce da trascinare, circuiti da montare.
      Prima muovi e sbagli, poi leggi la spiegazione. Non è un vezzo: imparare così regge meglio nel tempo.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>2 · La matematica c'è tutta</h3>
      <p class="mb0 dim">Non è un corso "senza formule": ci sono <b>tutte</b>, dalla più semplice alla più pesante.
      Ma ogni simbolo è un bottone: lo tocchi e ti dice cosa fa, con i numeri veri che stai muovendo nel gioco.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>3 · Si finisce inventando</h3>
      <p class="mb0 dim">L'ultimo livello è un'<b>officina</b>: monti blocchi quantistici come mattoncini,
      li provi su sfide aperte e cerchi di battere il tuo record. Lì non ripeti: <b>inventi</b>.</p>
    </div>
  </div>

  <!-- ============ RIPASSO ============ -->
  <h2 id="ripasso-lampo">🔁 Ripasso lampo</h2>
  <p class="dim">Poche domande, riproposte al momento giusto (dopo 1 giorno, poi 3, poi 7, poi 21).
  È la combinazione di <b>richiamo attivo</b> e <b>ripetizione dilazionata</b>: fra tutte le tecniche di studio misurate
  dalla ricerca, sono le due che funzionano meglio.</p>
  <div class="panel" id="ripasso"></div>

  <!-- ============ AUTORE ============ -->
  <h2 id="autore">Chi ha fatto questo corso</h2>
  <div class="panel">
    <div class="author">
      <div>
        <img src="/assets/davide.jpeg" alt="Davide Cavallini, Forward Deployed AI Engineer e autore del corso" width="320" height="320">
        <div class="cap">Davide Cavallini · Forward Deployed AI Engineer</div>
      </div>
      <div class="who">
        <h3 style="margin-top:0">Ciao, sono Davide Cavallini</h3>
        <p class="dim" style="margin-bottom:10px">
          Programmo da quando avevo <b>7 anni</b>: ho imparato con mio nonno su un <b>Commodore 64</b>,
          e da lì non ho più smesso. <b>Di professione dal 2012</b>, mi sono avvicinato all'<b>informatica quantistica
          nel 2017</b> e all'<b>intelligenza artificiale nel 2019</b>.
        </p>
        <p class="dim" style="margin-bottom:10px">
          Oggi sono un <b>Forward Deployed AI Engineer</b>: il mio mestiere è portare l'intelligenza artificiale
          <b>dentro le aziende</b>, non nelle slide. In concreto costruisco <b>gestionali AI su misura</b>:
          software gestionali cuciti sul processo reale del cliente, con l'AI messa dove produce risultati
          misurabili (e tolta da dove fa solo scena).
        </p>
        <p class="dim" style="margin-bottom:10px">
          <b>Formazione:</b> percorso universitario in <b>matematica e statistica</b> alla <b>London School of Economics (LSE)</b>,
          più corsi specialistici di <b>informatica quantistica</b> e di <b>matematica avanzata applicata al calcolo quantistico</b>
          (il percorso completo è sul mio profilo LinkedIn).
        </p>
        <p class="dim" style="margin-bottom:10px">
          <b>Insegno da anni:</b> ho tenuto corsi e docenze in <b>8 realtà diverse</b> — aziende private e
          <b>pubbliche</b>, scuole, academy e percorsi di formazione professionale — e seguo anche
          <b>lezioni individuali</b>, uno a uno, per chi preferisce andare al proprio ritmo.
        </p>
        <p class="dim" style="margin-bottom:10px">
          Faccio parte di <b>Red Hot Cyber</b>, dove scrivo di sicurezza informatica, sviluppo e tecnologie emergenti.
          Sul mio <b>canale YouTube</b> insegno programmazione, cybersecurity e informatica quantistica:
          Quantum Arcade nasce da lì, riscritto da zero in forma di videogioco perché
          <b>guardare non basta, bisogna smanettare</b>.
        </p>
        <p class="dim" style="margin-bottom:14px">
          Questo è, a mia conoscenza, il <b>primo sito in italiano</b> che insegna l'informatica quantistica
          <b>giocando</b>, con un simulatore quantistico vero sotto il cofano invece che animazioni finte.
        </p>
        <div class="btn-row">
          <a class="btn sm primary" href="https://calendly.com/davidecavallini1987/meeting" target="_blank" rel="noopener">📅 Prenota una chiacchierata</a>
          <a class="btn sm" href="https://www.youtube.com/@informaticacavallini" target="_blank" rel="noopener">▶ Canale YouTube</a>
          <a class="btn sm" href="https://www.linkedin.com/in/davidecavallini/" target="_blank" rel="noopener">in LinkedIn</a>
          <a class="btn sm" href="https://www.redhotcyber.com/post/author/davide-cavallini/" target="_blank" rel="noopener">🔥 Articoli su Red Hot Cyber</a>
        </div>
      </div>
    </div>
  </div>

  <!-- ============ LAVORA CON ME ============ -->
  <h2 id="lavora-con-me">Lavoriamo insieme</h2>
  <p class="dim" style="max-width:72ch">
    Questo corso è gratuito e resterà gratuito. Se ti è stato utile e nella tua azienda, scuola o percorso personale
    c'è bisogno di qualcuno che <b>faccia</b> o <b>insegni</b> queste cose, di seguito c'è cosa faccio — con i numeri veri,
    senza gonfiarli.
  </p>

  <div class="grid-3" style="margin-top:8px">
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Gestionali AI su misura</h3>
      <p class="dim">Analisi del processo, progettazione e messa in produzione di gestionali con AI integrata:
      estrazione documenti, assistenti interni, automazioni, integrazioni con i sistemi che l'azienda già usa.</p>
      <p class="mb0 dim"><b>Come si parte:</b> mezza giornata di analisi per capire dove l'AI produce un ritorno reale
      e — soprattutto — dove conviene <b>non</b> metterla.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Formazione per aziende e scuole</h3>
      <p class="dim">Ho insegnato in <b>8 realtà</b> fra aziende private e pubbliche, scuole e academy.
      Stesso approccio di questo sito: si tocca, si sbaglia, si capisce.</p>
      <p class="mb0 dim"><b>Formati:</b> da un intervento divulgativo di un'ora fino a un percorso completo
      con laboratorio. Argomenti: AI applicata, sviluppo, cybersecurity, informatica quantistica.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Lezioni individuali</h3>
      <p class="dim">Uno a uno, al tuo ritmo, sul tuo obiettivo concreto: preparare un esame, capire davvero
      un argomento, impostare un progetto, riprendere in mano il codice dopo anni.</p>
      <p class="mb0 dim"><b>Va bene anche</b> se parti da zero: la Parte 0 di questo sito nasce proprio
      dalle domande di chi comincia.</p>
    </div>
  </div>

  <div class="panel" style="margin-top:16px;border-color:rgba(34,211,238,.45)">
    <div class="grid-2" style="align-items:center">
      <div>
        <h3 style="margin-top:0">Parliamone 20 minuti, senza impegno</h3>
        <p class="mb0 dim">Scegli tu l'orario dal calendario. Se dopo la chiacchierata la risposta giusta è
        "non ti serve", te lo dico: mi interessa di più che il progetto abbia senso, non che parta.</p>
      </div>
      <div class="btn-row" style="justify-content:flex-end">
        <a class="btn primary" href="https://calendly.com/davidecavallini1987/meeting" target="_blank" rel="noopener">
          📅 Prenota una chiamata
        </a>
        <a class="btn ghost" href="https://www.linkedin.com/in/davidecavallini/" target="_blank" rel="noopener">💬 LinkedIn</a>
      </div>
    </div>
  </div>

  <!-- ============ MAPPA ============ -->
  <h2 id="mappa">🗺️ La mappa dei livelli</h2>
  <p class="dim">Ogni livello si apre superando la prova del precedente: una <b>missione pratica</b> dentro il gioco
  più il <b>quiz di richiamo</b>. Tentativi illimitati, nessuna penalità, nessun voto.
  La <b>Parte 0</b> (matematica delle medie), la <b>Parte K</b> (il computer classico) e il <b>livello 1</b>
  sono sempre aperti: le prime due sono facoltative e si giocano quando servono.</p>
  <div id="map"></div>

  <!-- ============ FAQ ============ -->
  <h2 id="domande">Domande frequenti</h2>
  <div class="grid-2">
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Devo saper già la matematica?</h3>
      <p class="mb0 dim">No. La <b>Parte 0</b> copre numeri negativi, frazioni e percentuali, coordinate, gradi e probabilità:
      è pensata per chi ha appena finito le medie. Seno, coseno, numeri complessi ed e^{iθ} vengono costruiti
      dentro il corso, partendo da un punto che gira su un cerchio.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Devo sapere già come funziona un computer normale?</h3>
      <p class="mb0 dim">No, e anzi conviene <b>non</b> darlo per scontato. La <b>Parte K</b> — sei livelli
      facoltativi — spiega giocando il computer classico: bit e binario, porte logiche, la somma con il riporto,
      la ricerca lineare e binaria, il costo degli algoritmi, la reversibilità. Serve perché «quantistico» è una
      <b>differenza</b>, e una differenza si vede solo avendo il termine di paragone: ogni livello quantistico
      comincia con un confronto fianco a fianco fra come si fa in classico e cosa cambia.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>È un simulatore vero?</h3>
      <p class="mb0 dim">Sì: simulatore a vettore di stato scritto da zero (ampiezze complesse, porte controllate,
      misura probabilistica, entanglement). Il circuito della QFT che monti è verificato con test automatici:
      riproduce <b>esattamente</b> la matrice di Fourier.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Devo registrarmi?</h3>
      <p class="dim">Sì, ed è gratis: servono nome, cognome, email e password. Non è per raccogliere dati —
      è perché i <b>progressi si salvano sul server</b> (li ritrovi su ogni dispositivo) e perché l'<b>attestato finale</b>
      riporta i tuoi dati e un codice che chiunque può verificare. Se lo stato vivesse solo nel browser,
      chiunque potrebbe modificarlo e l'attestato non varrebbe niente.</p>
      <p class="mb0 dim"><a href="{{ \App\Support\Site::page('privacy', $locale) }}">Come tratto i dati →</a>
      <label class="check" style="display:flex;margin-top:10px"><input type="checkbox" id="freemode"> modalità libera (sblocca tutti i livelli)</label>
      <button class="btn tiny" id="reset" style="margin-top:8px">azzera progressi locali</button></p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Quanto ci vuole?</h3>
      <p class="mb0 dim">Ogni livello sono 10–20 minuti giocati con calma; il percorso completo è un pomeriggio abbondante.
      Ma l'<b>officina</b> finale può tenerti impegnato per settimane, perché lì le soluzioni non sono scritte da nessuna parte.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Sono un insegnante: posso usarlo in classe?</h3>
      <p class="dim">Se insegni in una <b>scuola statale o paritaria</b>, all'università, in biblioteca, in un ente pubblico
      o in un'associazione senza scopo di lucro: sì, liberamente e senza chiedere niente. Vale anche per doposcuola
      e gruppi di studio gratuiti. Puoi scaricare tutto, modificarlo, tradurlo o installarlo su un server tuo:
      il <a href="https://github.com/dade1987/quantum-arcade" target="_blank" rel="noopener">codice è pubblico</a>
      e si accettano contributi.</p>
      <p class="mb0 dim">Se invece la formazione è <b>a pagamento</b> — accademia privata, corso aziendale, bootcamp,
      ripetizioni retribuite — serve un accordo, e di solito è una formalità:
      <a href="https://calendly.com/davidecavallini1987/meeting" target="_blank" rel="noopener">prendi un appuntamento</a>.
      Tutti i dettagli nella <a href="https://github.com/dade1987/quantum-arcade/blob/main/LICENSE" target="_blank" rel="noopener">licenza</a>.</p>
    </div>
  </div>

  <nav class="nav-foot" style="justify-content:center;gap:18px;flex-wrap:wrap">
    <a class="dim small" href="{{ \App\Support\Site::page('method', $locale) }}">Il metodo e le fonti scientifiche</a>
    <span class="muted small">·</span>
    <a class="dim small" href="{{ \App\Support\Site::page('privacy', $locale) }}">Privacy e dati</a>
    <span class="muted small">·</span>
    <a class="dim small" href="https://github.com/dade1987/quantum-arcade" target="_blank" rel="noopener">Codice sorgente su GitHub</a>
    <span class="muted small">·</span>
    <a class="dim small" href="https://github.com/dade1987/quantum-arcade/blob/main/LICENSE" target="_blank" rel="noopener">Licenza libera non commerciale</a>
    <span class="muted small">·</span>
    <span class="muted small">Quantum Arcade · di Davide Cavallini · fatto in Italia, in italiano</span>
  </nav>

</main>
@endsection

@push('scripts')
<script type="module" src="/js/home.js"></script>
@endpush
