@extends('layouts.page', [
    'title' => 'Privacy e dati — Quantum Arcade',
    'description' => 'Informativa privacy di Quantum Arcade: quali dati raccolgo (solo email e progressi), perché, per quanto tempo e come cancellarli in un click.',
])


@section('body')
<header class="topbar">
  <div class="wrap-wide topbar-in">
    <a class="brand" href="{{ \App\Support\Site::page('home', $locale) }}">
      <img class="logo" src="/assets/logo.svg" alt="" width="30" height="30">
      <span>Quantum Arcade<small>informatica quantistica giocando</small></span>
    </a>
    <span class="topbar-spacer"></span>
    @include('partials.language-picker')
    <a class="btn sm ghost" href="{{ \App\Support\Site::page('home', $locale) }}">🗺️ Mappa</a>
  </div>
</header>

<main class="wrap">

<div class="lesson-hero">
  <nav class="crumbs"><a href="{{ \App\Support\Site::page('home', $locale) }}">Home</a> › Privacy</nav>
  <h1>Privacy e dati</h1>
  <p class="lead">Scritta in italiano comprensibile, non in legalese. Se qualcosa non ti torna, scrivimi
  e la cambio o te la spiego.</p>
</div>

<div class="tldr">
  <b>In breve:</b> raccolgo <b>la tua email</b> (per farti entrare) e i <b>tuoi progressi nel gioco</b> (per non fartili perdere).
  Se usi il tutor AI, conservo le <b>domande che gli fai</b> per capire dove il corso non è chiaro.
  Niente pubblicità, niente profilazione, niente vendita di dati a terzi. Puoi cancellare tutto da solo, in un click,
  dal pannello del tuo account.
</div>

<h2>Chi tratta i dati</h2>
<p><b>Titolare del trattamento:</b> Davide Cavallini, autore e gestore di Quantum Arcade.
Per qualunque richiesta relativa ai tuoi dati puoi scrivermi tramite
<a href="https://www.linkedin.com/in/davidecavallini/" target="_blank" rel="noopener">LinkedIn</a>
o dal <a href="https://calendly.com/davidecavallini1987/meeting" target="_blank" rel="noopener">calendario dei contatti</a>.</p>

<h2>Quali dati raccolgo e perché</h2>
<table class="table">
  <tr><th>Dato</th><th>Perché</th><th>Base giuridica</th><th>Per quanto</th></tr>
  <tr>
    <td><b>Email</b></td>
    <td>Farti entrare senza password (ti mando un link) e recuperare l'account su altri dispositivi.</td>
    <td>Esecuzione del servizio richiesto (art. 6.1.b GDPR)</td>
    <td>Finché tieni l'account</td>
  </tr>
  <tr>
    <td><b>Nome</b> (facoltativo)</td>
    <td>Comparire sull'attestato di completamento. Se non lo dai, l'attestato non si può generare.</td>
    <td>Esecuzione del servizio</td>
    <td>Finché tieni l'account</td>
  </tr>
  <tr>
    <td><b>Progressi di gioco</b><br><span class="muted small">livelli superati, XP, risposte ai quiz</span></td>
    <td>Non fartili perdere e sbloccare i livelli successivi.</td>
    <td>Esecuzione del servizio</td>
    <td>Finché tieni l'account</td>
  </tr>
  <tr>
    <td><b>Esiti dell'esame e attestato</b></td>
    <td>Permettere la verifica pubblica dell'attestato tramite il suo codice.</td>
    <td>Esecuzione del servizio</td>
    <td>5 anni (un attestato deve restare verificabile nel tempo)</td>
  </tr>
  <tr>
    <td><b>Domande al tutor AI</b></td>
    <td>Rispondere e, in forma aggregata, capire quali argomenti risultano poco chiari per riscriverli.</td>
    <td>Legittimo interesse a migliorare il corso (art. 6.1.f)</td>
    <td>180 giorni</td>
  </tr>
  <tr>
    <td><b>Log tecnici</b> (IP, orario)</td>
    <td>Sicurezza: impedire abusi e invii massivi di email.</td>
    <td>Legittimo interesse</td>
    <td>30 giorni</td>
  </tr>
</table>

<div class="callout"><b>Cosa NON faccio:</b> nessun cookie di profilazione, nessun tracker pubblicitario,
nessuna vendita o cessione dei dati a terzi per marketing, nessun invio di newsletter se non l'hai chiesto.
Gli unici cookie sono quelli tecnici che tengono aperta la sessione dopo che hai cliccato il link di accesso.</div>

<h2>Chi altro vede i dati</h2>
<ul>
  <li><b>Il servizio di hosting</b> su cui gira il sito (server in Unione Europea).</li>
  <li><b>Il servizio che invia le email</b> di accesso: vede il tuo indirizzo per consegnarti il messaggio.</li>
  <li><b>Il fornitore del modello AI</b> che alimenta il tutor: riceve il testo della domanda che scrivi
      e i pezzi di corso pertinenti. <b>Non riceve la tua email né i tuoi progressi.</b>
      Per questo motivo: <b>non scrivere dati personali nel tutor</b>, non ne ha bisogno.</li>
</ul>
<p class="dim small">Con ciascuno di questi fornitori è in essere (o va stipulato prima della messa online)
un accordo sul trattamento dei dati ai sensi dell'art. 28 GDPR.</p>

<h2>I tuoi diritti, esercitabili subito</h2>
<ul>
  <li><b>Vedere i tuoi dati:</b> sono tutti visibili nel gioco (progressi) e nel pannello account (email, nome).</li>
  <li><b>Cancellare tutto:</b> pannello account → <b>Elimina account e dati</b>. Sparisce tutto davvero,
      comprese le conversazioni con il tutor. Se avevi un attestato, il codice smette di risultare valido.</li>
  <li><b>Correggere</b> nome ed email, <b>opporti</b> ai trattamenti basati sul legittimo interesse,
      <b>portare via</b> i tuoi dati: scrivimi e provvedo.</li>
  <li><b>Reclamo:</b> puoi rivolgerti al Garante per la protezione dei dati personali (garanteprivacy.it).</li>
</ul>

<h2>Minori</h2>
<p>Il corso è pensato anche per ragazzi delle scuole medie e superiori. Se hai <b>meno di 14 anni</b>,
per creare un account serve il consenso di un genitore o di chi ne fa le veci (art. 8 GDPR, come recepito in Italia).
<b>Puoi comunque fare tutto il corso</b>: chiedi a un adulto di accompagnarti nella registrazione,
oppure usalo a scuola sotto la supervisione di un docente.</p>

<h2>Se cambia qualcosa</h2>
<p>Quando modifico questa pagina in modo sostanziale lo segnalo nella home e, per le modifiche che riguardano
i dati già raccolti, via email.</p>

<p class="muted small">Ultimo aggiornamento: 10 agosto 2026.</p>

<nav class="nav-foot">
  <a class="btn ghost" href="{{ \App\Support\Site::page('home', $locale) }}">← Torna al corso</a>
  <a class="btn ghost" href="{{ \App\Support\Site::page('method', $locale) }}">🔬 Il metodo e le fonti</a>
</nav>

</main>
@endsection
