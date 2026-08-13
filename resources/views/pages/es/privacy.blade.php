@extends('layouts.page', [
    'title' => 'Privacidad y datos — Quantum Arcade',
    'description' => 'Aviso de privacidad de Quantum Arcade: qué datos recojo (solo el correo y el progreso), por qué, durante cuánto tiempo y cómo borrarlos todos con un clic.',
])


@section('body')
<header class="topbar">
  <div class="wrap-wide topbar-in">
    <a class="brand" href="{{ \App\Support\Site::page('home', $locale) }}">
      <img class="logo" src="/assets/logo.svg" alt="" width="30" height="30">
      <span>Quantum Arcade<small>computación cuántica jugando</small></span>
    </a>
    <span class="topbar-spacer"></span>
    @include('partials.language-picker')
    <a class="btn sm ghost" href="{{ \App\Support\Site::page('home', $locale) }}">🗺️ Mapa</a>
  </div>
</header>

<main class="wrap">

<div class="lesson-hero">
  <nav class="crumbs"><a href="{{ \App\Support\Site::page('home', $locale) }}">Inicio</a> › Privacidad</nav>
  <h1>Privacidad y datos</h1>
  <p class="lead">Escrito en español comprensible, no en lenguaje jurídico. Si algo no te cuadra, escríbeme
  y lo cambio o te lo explico.</p>
</div>

<div class="tldr">
  <b>En resumen:</b> recojo <b>tu correo</b> (para dejarte entrar) y <b>tu progreso en el juego</b> (para que no lo pierdas).
  Si usas el tutor con IA, conservo las <b>preguntas que le haces</b> para saber dónde el curso no está claro.
  Nada de publicidad, nada de perfilado, nada de vender datos a terceros. Puedes borrarlo todo tú mismo, con un clic,
  desde el panel de tu cuenta.
</div>

<h2>Quién trata los datos</h2>
<p><b>Responsable del tratamiento:</b> Davide Cavallini, autor y gestor de Quantum Arcade.
Para cualquier solicitud sobre tus datos puedes escribirme por
<a href="https://www.linkedin.com/in/davidecavallini/" target="_blank" rel="noopener">LinkedIn</a>
o desde el <a href="https://calendly.com/davidecavallini1987/meeting" target="_blank" rel="noopener">calendario de contacto</a>.</p>

<h2>Qué datos recojo y por qué</h2>
<table class="table">
  <tr><th>Dato</th><th>Para qué</th><th>Base jurídica</th><th>Cuánto tiempo</th></tr>
  <tr>
    <td><b>Correo electrónico</b></td>
    <td>Dejarte entrar sin contraseña (te mando un enlace) y recuperar la cuenta en otros dispositivos.</td>
    <td>Ejecución del servicio solicitado (art. 6.1.b RGPD)</td>
    <td>Mientras mantengas la cuenta</td>
  </tr>
  <tr>
    <td><b>Nombre</b> (opcional)</td>
    <td>Aparecer en el certificado de finalización. Sin él, el certificado no se puede generar.</td>
    <td>Ejecución del servicio</td>
    <td>Mientras mantengas la cuenta</td>
  </tr>
  <tr>
    <td><b>Progreso de juego</b><br><span class="muted small">niveles superados, XP, respuestas de los cuestionarios</span></td>
    <td>Que no lo pierdas y desbloquear los niveles siguientes.</td>
    <td>Ejecución del servicio</td>
    <td>Mientras mantengas la cuenta</td>
  </tr>
  <tr>
    <td><b>Resultados del examen y certificado</b></td>
    <td>Permitir la verificación pública del certificado mediante su código.</td>
    <td>Ejecución del servicio</td>
    <td>5 años (un certificado debe seguir siendo verificable con el tiempo)</td>
  </tr>
  <tr>
    <td><b>Preguntas al tutor con IA</b></td>
    <td>Responderlas y, de forma agregada, entender qué temas resultan poco claros para reescribirlos.</td>
    <td>Interés legítimo en mejorar el curso (art. 6.1.f)</td>
    <td>180 días</td>
  </tr>
  <tr>
    <td><b>Registros técnicos</b> (IP, hora)</td>
    <td>Seguridad: impedir abusos y envíos masivos de correo.</td>
    <td>Interés legítimo</td>
    <td>30 días</td>
  </tr>
</table>

<div class="callout"><b>Lo que NO hago:</b> ninguna cookie de perfilado, ningún rastreador publicitario,
ninguna venta o cesión de datos a terceros con fines de marketing, ningún boletín si no lo has pedido.
Las únicas cookies son las técnicas que mantienen abierta la sesión después de que hagas clic en el enlace de acceso.</div>

<h2>Quién más ve los datos</h2>
<ul>
  <li><b>El servicio de alojamiento</b> en el que corre el sitio (servidores en la Unión Europea).</li>
  <li><b>El servicio que envía los correos</b> de acceso: ve tu dirección para poder entregarte el mensaje.</li>
  <li><b>El proveedor del modelo de IA</b> que alimenta al tutor: recibe el texto de la pregunta que escribes
      y los fragmentos del curso pertinentes. <b>No recibe tu correo ni tu progreso.</b>
      Por eso: <b>no escribas datos personales en el tutor</b>, no los necesita.</li>
</ul>
<p class="dim small">Con cada uno de estos proveedores hay (o habrá antes de la puesta en línea)
un acuerdo de tratamiento de datos conforme al art. 28 del RGPD.</p>

<h2>Tus derechos, ejercitables ya</h2>
<ul>
  <li><b>Ver tus datos:</b> están todos a la vista en el juego (progreso) y en el panel de cuenta (correo, nombre).</li>
  <li><b>Borrarlo todo:</b> panel de cuenta → <b>Eliminar cuenta y datos</b>. Desaparece todo de verdad,
      incluidas las conversaciones con el tutor. Si tenías un certificado, su código deja de constar como válido.</li>
  <li><b>Corregir</b> nombre y correo, <b>oponerte</b> a los tratamientos basados en el interés legítimo,
      <b>llevarte</b> tus datos: escríbeme y me encargo.</li>
  <li><b>Reclamación:</b> puedes dirigirte a la autoridad italiana de protección de datos (garanteprivacy.it)
      o a la autoridad de control del país de la UE en el que vivas.</li>
</ul>

<h2>Menores</h2>
<p>El curso está pensado también para chicos y chicas de secundaria y bachillerato. Si tienes <b>menos de 14 años</b>,
para crear una cuenta hace falta el consentimiento de un progenitor o tutor (art. 8 RGPD, según su aplicación en Italia).
<b>Puedes hacer igualmente todo el curso</b>: pide a una persona adulta que te acompañe en el registro,
o úsalo en el colegio bajo la supervisión de un docente.</p>

<h2>Si cambia algo</h2>
<p>Cuando modifique esta página de forma sustancial lo avisaré en la portada y, para los cambios que afecten
a datos ya recogidos, por correo.</p>

<p class="muted small">Última actualización: 10 de agosto de 2026.</p>

<nav class="nav-foot">
  <a class="btn ghost" href="{{ \App\Support\Site::page('home', $locale) }}">← Volver al curso</a>
  <a class="btn ghost" href="{{ \App\Support\Site::page('method', $locale) }}">🔬 El método y las fuentes</a>
</nav>

</main>
@endsection
