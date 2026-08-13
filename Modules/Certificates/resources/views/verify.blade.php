<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ __('Verifica attestato') }} {{ $code }} — Quantum Arcade</title>
<meta name="description" content="{{ __('Pagina di verifica pubblica degli attestati di completamento del corso Quantum Arcade.') }}">
<meta name="robots" content="noindex, follow">
<link rel="stylesheet" href="/css/style.css">
<link rel="icon" type="image/svg+xml" href="/assets/logo.svg">
</head>
<body>

<header class="topbar">
  <div class="wrap-wide topbar-in">
    <a class="brand" href="/">
      <img class="logo" src="/assets/logo.svg" alt="" width="30" height="30">
      <span>Quantum Arcade<small>{{ __('informatica quantistica giocando') }}</small></span>
    </a>
    <span class="topbar-spacer"></span>
    {{-- questa pagina gira fuori dal sito: chi la riceve deve poter scegliere la lingua --}}
    <span class="lang-pick" role="group" aria-label="{{ __('Lingua') }}">
      @foreach($lingue as $l)
        @if($l === app()->getLocale())
          <span class="lang-opt on" lang="{{ $l }}" aria-current="true">{{ strtoupper($l) }}</span>
        @else
          <a class="lang-opt" href="?lang={{ $l }}" hreflang="{{ $l }}" lang="{{ $l }}"
             rel="nofollow">{{ strtoupper($l) }}</a>
        @endif
      @endforeach
    </span>
    <a class="btn sm ghost" href="{{ $home }}">🗺️ {{ __('Vai al corso') }}</a>
  </div>
</header>

<main class="wrap">
  <div class="lesson-hero">
    <nav class="crumbs"><a href="{{ $home }}">{{ __('Home') }}</a> › {{ __('Verifica attestato') }}</nav>
    <h1>{{ __('Verifica attestato') }}</h1>
    <p class="lead">{{ __('Codice richiesto:') }} <span class="mono">{{ $code }}</span></p>
  </div>

  @if($certificate && $certificate->isValid())
    <div class="attestato">
      <div class="att-top">QUANTUM ARCADE</div>
      <div class="att-sub">{{ __('Attestato di completamento del corso') }}</div>
      <div class="att-name">{{ $certificate->holder_name }}</div>
      <p class="att-txt">
        {!! __('ha completato il percorso <b>“Informatica quantistica giocando”</b> — :livelli livelli interattivi, dalle basi matematiche fino alla trasformata di Fourier quantistica e all\'algoritmo di Shor — superando l\'esame finale con il <b>:percento%</b> di risposte esatte.', [
          'livelli'  => config('certificates.levels_count'),
          'percento' => $certificate->percent,
        ]) !!}
      </p>
      <div class="att-row">
        <div><div class="att-lab">{{ __('Rilasciato il') }}</div><div>{{ $certificate->issued_at->format('d/m/Y') }}</div></div>
        <div><div class="att-lab">{{ __('Codice') }}</div><div class="mono">{{ $certificate->code }}</div></div>
        <div><div class="att-lab">{{ __('Versione corso') }}</div><div>{{ $certificate->course_version }}</div></div>
        <div><div class="att-lab">{{ __('Autore del corso') }}</div><div>Davide Cavallini</div></div>
      </div>
      <div class="att-note">
        {{ __('Attestato di completamento rilasciato dall\'autore del corso. Non costituisce una certificazione accreditata da un ente terzo.') }}
      </div>
    </div>

    <div class="callout ok" style="margin-top:20px">
      {!! __('<b>✅ Attestato valido.</b> L\'esame è stato corretto dal server: le risposte esatte non sono mai state inviate al browser di chi lo ha sostenuto, quindi il punteggio non è manipolabile lato client.') !!}
    </div>

    <div class="btn-row" style="margin:16px 0">
      <a class="btn sm" href="/api/badge/{{ $certificate->code }}.json?lang={{ app()->getLocale() }}">📄 {{ __('Versione Open Badge (JSON)') }}</a>
      <a class="btn sm ghost" onclick="window.print()">🖨️ {{ __('Stampa') }}</a>
      <a class="btn sm primary" href="{{ $home }}">▶ {{ __('Fai anche tu il corso (gratis)') }}</a>
    </div>

  @elseif($certificate && ! $certificate->isValid())
    <div class="callout warn">
      {!! __('<b>⚠️ Attestato revocato.</b> Questo codice è esistito ma è stato annullato in data :data. Per chiarimenti, contatta l\'autore del corso.', ['data' => $certificate->revoked_at->format('d/m/Y')]) !!}
    </div>
  @else
    <div class="callout warn">
      {!! __('<b>❌ Nessun attestato con questo codice.</b><br>Controlla di aver copiato il codice per intero (formato <span class="mono">QA-XXXXXXX</span>). Se il codice ti è stato mostrato da qualcuno come prova di una certificazione, sappi che <b>non risulta rilasciato da Quantum Arcade</b>.') !!}
    </div>
  @endif

  <h2>{{ __('Che cosa attesta (e che cosa no)') }}</h2>
  <div class="grid-2">
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>{{ __('Che cosa attesta') }}</h3>
      <p class="mb0 dim">{{ __('Che la persona indicata ha completato un percorso strutturato di :livelli livelli su onde, qubit, porte quantistiche, entanglement, algoritmi (Deutsch–Jozsa, Bernstein–Vazirani, Grover), QFT, stima di fase e algoritmo di Shor, e ha superato un esame a risposta multipla corretto dal server con almeno l\'80%.', ['livelli' => config('certificates.levels_count')]) }}</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>{{ __('Che cosa NON attesta') }}</h3>
      <p class="mb0 dim">{{ __('Non è un titolo di studio e non è una certificazione accreditata da un ente terzo (per quelle esistono, ad esempio, la certificazione IBM su Qiskit e i corsi universitari con certificato). È una prova di percorso, verificabile pubblicamente da questa pagina.') }}</p>
    </div>
  </div>
</main>

</body>
</html>
