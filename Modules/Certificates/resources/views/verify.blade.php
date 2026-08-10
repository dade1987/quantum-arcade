<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Verifica attestato {{ $code }} — Quantum Arcade</title>
<meta name="description" content="Pagina di verifica pubblica degli attestati di completamento del corso Quantum Arcade.">
<meta name="robots" content="noindex, follow">
<link rel="stylesheet" href="/css/style.css">
<link rel="icon" type="image/svg+xml" href="/assets/logo.svg">
</head>
<body>

<header class="topbar">
  <div class="wrap-wide topbar-in">
    <a class="brand" href="/">
      <img class="logo" src="/assets/logo.svg" alt="" width="30" height="30">
      <span>Quantum Arcade<small>informatica quantistica giocando</small></span>
    </a>
    <span class="topbar-spacer"></span>
    <a class="btn sm ghost" href="/">🗺️ Vai al corso</a>
  </div>
</header>

<main class="wrap">
  <div class="lesson-hero">
    <nav class="crumbs"><a href="/">Home</a> › Verifica attestato</nav>
    <h1>Verifica attestato</h1>
    <p class="lead">Codice richiesto: <span class="mono">{{ $code }}</span></p>
  </div>

  @if($certificate && $certificate->isValid())
    <div class="attestato">
      <div class="att-top">QUANTUM ARCADE</div>
      <div class="att-sub">Attestato di completamento del corso</div>
      <div class="att-name">{{ $certificate->holder_name }}</div>
      <p class="att-txt">
        ha completato il percorso <b>“Informatica quantistica giocando”</b> — 27 livelli interattivi,
        dalle basi matematiche fino alla trasformata di Fourier quantistica e all'algoritmo di Shor —
        superando l'esame finale con il <b>{{ $certificate->percent }}%</b> di risposte esatte.
      </p>
      <div class="att-row">
        <div><div class="att-lab">Rilasciato il</div><div>{{ $certificate->issued_at->format('d/m/Y') }}</div></div>
        <div><div class="att-lab">Codice</div><div class="mono">{{ $certificate->code }}</div></div>
        <div><div class="att-lab">Versione corso</div><div>{{ $certificate->course_version }}</div></div>
        <div><div class="att-lab">Autore del corso</div><div>Davide Cavallini</div></div>
      </div>
      <div class="att-note">
        Attestato di completamento rilasciato dall'autore del corso.
        Non costituisce una certificazione accreditata da un ente terzo.
      </div>
    </div>

    <div class="callout ok" style="margin-top:20px">
      <b>✅ Attestato valido.</b> L'esame è stato corretto dal server: le risposte esatte non sono mai
      state inviate al browser di chi lo ha sostenuto, quindi il punteggio non è manipolabile lato client.
    </div>

    <div class="btn-row" style="margin:16px 0">
      <a class="btn sm" href="/api/badge/{{ $certificate->code }}.json">📄 Versione Open Badge (JSON)</a>
      <a class="btn sm ghost" onclick="window.print()">🖨️ Stampa</a>
      <a class="btn sm primary" href="/">▶ Fai anche tu il corso (gratis)</a>
    </div>

  @elseif($certificate && ! $certificate->isValid())
    <div class="callout warn">
      <b>⚠️ Attestato revocato.</b> Questo codice è esistito ma è stato annullato in data
      {{ $certificate->revoked_at->format('d/m/Y') }}. Per chiarimenti, contatta l'autore del corso.
    </div>
  @else
    <div class="callout warn">
      <b>❌ Nessun attestato con questo codice.</b><br>
      Controlla di aver copiato il codice per intero (formato <span class="mono">QA-XXXXXXX</span>).
      Se il codice ti è stato mostrato da qualcuno come prova di una certificazione, sappi che
      <b>non risulta rilasciato da Quantum Arcade</b>.
    </div>
  @endif

  <h2>Che cosa attesta (e che cosa no)</h2>
  <div class="grid-2">
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Che cosa attesta</h3>
      <p class="mb0 dim">Che la persona indicata ha completato un percorso strutturato di 27 livelli
      su onde, qubit, porte quantistiche, entanglement, algoritmi (Deutsch–Jozsa, Bernstein–Vazirani,
      Grover), QFT, stima di fase e algoritmo di Shor, e ha superato un esame a risposta multipla
      corretto dal server con almeno l'80%.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Che cosa NON attesta</h3>
      <p class="mb0 dim">Non è un titolo di studio e non è una certificazione accreditata da un ente terzo
      (per quelle esistono, ad esempio, la certificazione IBM su Qiskit e i corsi universitari con
      certificato). È una prova di percorso, verificabile pubblicamente da questa pagina.</p>
    </div>
  </div>
</main>

</body>
</html>
