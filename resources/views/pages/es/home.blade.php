@extends('layouts.page', [
    'title' => 'Quantum Arcade — Computación cuántica jugando | curso interactivo gratuito en español',
    'description' => 'Curso-videojuego gratuito en español para aprender computación cuántica desde cero: ondas, fase, números complejos, transformada de Fourier (DFT), cúbits, puertas, entrelazamiento, Grover, QFT y algoritmo de Shor. 41 niveles interactivos con un simulador cuántico real. De Davide Cavallini.',
    'ogTitle' => 'Quantum Arcade — aprende computación cuántica jugando',
    'ogDescription' => '41 niveles interactivos en español: de las ondas a la transformada de Fourier cuántica y al algoritmo de Shor. Con un simulador cuántico de verdad y desbloqueo por dominio.',
])

@push('head')
@verbatim
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": "https://quantumarcade.it/es/#course",
      "name": "Quantum Arcade — Computación cuántica jugando",
      "description": "Curso interactivo gratuito en español que enseña computación cuántica partiendo de las ondas y la transformada de Fourier hasta la QFT y el algoritmo de Shor, con 41 niveles jugables y un simulador cuántico de vector de estado.",
      "inLanguage": "es",
      "isAccessibleForFree": true,
      "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      "isBasedOn": "https://github.com/dade1987/quantum-arcade",
      "educationalLevel": "Desde secundaria en adelante",
      "teaches": [
        "Ondas sinusoidales: amplitud, frecuencia y fase (con el periodo T = 1/f)",
        "Números complejos y exponencial compleja e^{iθ}",
        "Interferencia constructiva y destructiva",
        "Transformada de Fourier discreta (DFT) y FFT",
        "Cúbits, esfera de Bloch, medida y probabilidad",
        "Puertas cuánticas de uno y dos cúbits, entrelazamiento",
        "Algoritmos de Deutsch-Jozsa, Bernstein-Vazirani, Grover y Simon",
        "Ventaja cuántica exponencial y problema del periodo escondido",
        "Transformada de Fourier cuántica (QFT)",
        "Quantum Phase Estimation y algoritmo de Shor"
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
      "description": "Programador desde los 7 años (aprendió en un Commodore 64 con su abuelo), profesional desde 2012, en computación cuántica desde 2017 y en inteligencia artificial desde 2019. Forward Deployed AI Engineer, desarrolla sistemas de gestión con IA a medida para empresas. Formación universitaria en matemáticas y estadística en la London School of Economics. Autor en Red Hot Cyber y divulgador en YouTube.",
      "image": "https://quantumarcade.it/assets/davide.jpeg",
      "sameAs": [
        "https://www.youtube.com/@informaticacavallini",
        "https://www.linkedin.com/in/davidecavallini/",
        "https://www.redhotcyber.com/post/author/davide-cavallini/",
        "https://calendly.com/davidecavallini1987/meeting"
      ],
      "knowsAbout": [
        "inteligencia artificial aplicada a la empresa",
        "sistemas de gestión con IA a medida",
        "computación cuántica",
        "desarrollo de software",
        "ciberseguridad"
      ],
      "alumniOf": { "@type": "EducationalOrganization", "name": "London School of Economics and Political Science" }
    },
    {
      "@type": "FAQPage",
      "@id": "https://quantumarcade.it/es/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Hace falta saber matemáticas para aprender computación cuántica?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. Quantum Arcade empieza con una Parte 0 dedicada a las bases (números negativos, fracciones y porcentajes, coordenadas, grados, probabilidad) pensada para quien ha terminado la secundaria. El seno, el coseno, los números complejos y la exponencial compleja se construyen dentro del curso partiendo de un punto que gira en un círculo." }
        },
        {
          "@type": "Question",
          "name": "¿Qué es la transformada de Fourier cuántica (QFT), en palabras sencillas?",
          "acceptedAnswer": { "@type": "Answer", "text": "La QFT es la transformada de Fourier aplicada a las amplitudes de un estado cuántico. Igual que la Fourier clásica convierte una señal en el tiempo en una lista de frecuencias, la QFT convierte la información contenida en la posición de las amplitudes en información contenida en sus fases. Se construye con puertas de Hadamard, rotaciones de fase controladas y SWAP finales, en total unas n²/2 puertas sobre n cúbits." }
        },
        {
          "@type": "Question",
          "name": "¿Por qué el algoritmo de Shor usa la transformada de Fourier?",
          "acceptedAnswer": { "@type": "Answer", "text": "Shor reduce la factorización de un número al problema de encontrar el periodo de la función f(x) = a^x mod N. El periodo está escondido en las amplitudes de un estado cuántico: la QFT lo convierte en picos de probabilidad medibles. Del valor medido, con fracciones continuas, se obtiene el periodo r y de ahí los factores mediante MCD(a^(r/2) ± 1, N), siempre que r sea par y a^(r/2) no sea congruente con −1 módulo N; si no, se elige otra a y se repite (ocurre en menos de la mitad de los casos)." }
        },
        {
          "@type": "Question",
          "name": "¿Un cúbit es como una moneda trucada?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. Una moneda mezclada dos veces sigue al azar, mientras que un cúbit al que se le aplican dos puertas de Hadamard vuelve con certeza al estado de partida. La diferencia es la interferencia: las amplitudes cuánticas son números complejos con una dirección y pueden cancelarse entre sí, algo que las probabilidades clásicas no hacen nunca." }
        },
        {
          "@type": "Question",
          "name": "¿Quantum Arcade es gratis? ¿Hace falta registrarse?",
          "acceptedAnswer": { "@type": "Answer", "text": "Sí, es completamente gratuito. Hace falta una cuenta gratuita (nombre, apellidos, correo y contraseña) porque el progreso se guarda en el servidor y porque el examen final, corregido en el servidor, emite un certificado de finalización en PDF con un código verificable públicamente." }
        }
      ]
    }
  ]
}
</script>
@endverbatim
@endpush

@section('body')
<a class="skip-link" href="#mapa">Saltar al contenido</a>

<header class="topbar">
  <div class="wrap-wide topbar-in">
    <a class="brand" href="{{ \App\Support\Site::page('home', $locale) }}">
      <img class="logo" src="/assets/logo.svg" alt="" width="30" height="30">
      <span>Quantum Arcade<small>computación cuántica jugando</small></span>
    </a>
    <span class="topbar-spacer"></span>
    <div id="xp-host"></div>
  </div>
</header>

<main class="wrap">

  <!-- ============ HERO ============ -->
  <div style="padding:46px 0 6px">
    <span class="tag cyan">🎮 curso-videojuego gratuito en español</span>
    <h1 style="margin-top:14px">Aprende computación cuántica<br><span style="background:linear-gradient(90deg,var(--cyan),var(--violet));-webkit-background-clip:text;background-clip:text;color:transparent">jugando de verdad.</span></h1>
    <p class="lead">
      Cuarenta y un niveles interactivos que parten de las <b>matemáticas de secundaria</b>, pasan por las <b>ondas</b>
      (amplitud, frecuencia y fase: los tres mandos que bastan para describir una sinusoide — el periodo es la frecuencia
      del revés, T = 1/f) y llegan hasta la <b>transformada de Fourier cuántica</b> y el <b>algoritmo de Shor</b>.
      Cada fórmula está desmontada pieza a pieza, y cada pieza la puedes <b>tocar, arrastrar y romper</b>
      hasta que se te encienda la bombilla.
    </p>
    <!-- Quien probó el sitio preguntó "¿pero a quién va dirigido?". Si alguien
         tiene que preguntarlo, la portada ya ha fallado: aquí la respuesta llega
         antes que la pregunta, con el requisito dicho en palabras corrientes. -->
    <div class="callout ok" style="margin:16px 0 6px">
      <b>Para quién es:</b> si has terminado la secundaria y sabes qué es un porcentaje, este curso es para ti.
      <b>No hace falta física</b>, ni universidad, ni saber trigonometría: el seno, el coseno y los números
      complejos te los construyes aquí dentro, jugando, en el momento en que hacen falta.
    </div>

    <p id="progress-line" class="dim" style="font-size:15px"></p>
    <div class="btn-row" style="margin:18px 0 6px">
      <a class="btn primary" id="continue" href="{{ \App\Support\Site::lessonPath('01-qubit', $locale) }}">▶ Empezar</a>
      <a class="btn ghost" href="{{ \App\Support\Site::lessonPath('00-numeri', $locale) }}">🧮 Empiezo desde cero absoluto (Parte 0)</a>
      <a class="btn ghost" href="{{ \App\Support\Site::lessonPath('k1-bit', $locale) }}">💻 No sé qué es un bit (Parte K)</a>
      <a class="btn ghost" href="#mapa">🗺️ Todos los niveles</a>
      <a class="btn ghost" href="{{ \App\Support\Site::page('method', $locale) }}">🔬 El método (y la investigación)</a>
    </div>

    <!-- El glosario es una referencia, no un premio de fin de curso: está arriba
         y queda a una tecla de distancia en cualquier página. El enlace apunta
         igualmente a la página completa, así funciona también sin JavaScript. -->
    <p class="small dim" style="margin:10px 0 0">
      📖 <b>¿Dudas con una palabra?</b> El <a href="{{ \App\Support\Site::lessonPath('23-glossario', $locale) }}" id="apri-glossario">glosario</a>
      se abre al lado del texto en cualquier página — también con la tecla <b>G</b> — con el nivel en el que
      se explica cada término. Y dentro de las lecciones las palabras subrayadas dan la definición
      con un toque, sin perder el hilo.
    </p>
  </div>

  <div class="panel hidden" id="account-banner" style="border-color:rgba(34,211,238,.45);margin-top:6px">
    <div class="grid-2" style="align-items:center">
      <div>
        <h3 style="margin-top:0">Puedes empezar ya — la cuenta viene después</h3>
        <p class="mb0 dim">La <b>Parte 0</b> y el <b>nivel 1</b> se juegan sin registrarse: cinco niveles
        enteros, para ver si el curso es para ti. La cuenta (nombre, apellidos, correo y contraseña: <b>es gratis</b>
        y lleva menos de un minuto) sirve para <b>guardar el progreso en el servidor</b> — así lo recuperas en
        cualquier dispositivo y no muere con la caché del navegador — y porque el <b>certificado final</b> lleva tus
        datos y tiene que ser verificable por cualquiera.</p>
      </div>
      <div class="btn-row" style="justify-content:flex-end">
        <a class="btn primary" href="#" id="banner-login">✍️ Crea tu cuenta</a>
        <a class="btn ghost" href="{{ \App\Support\Site::page('privacy', $locale) }}">Cómo trato los datos</a>
      </div>
    </div>
  </div>

  <!-- ============ TL;DR — útil para lectores humanos y para motores generativos ============ -->
  <div class="tldr">
    <b>En resumen:</b> Quantum Arcade es un curso gratuito en español que enseña computación cuántica
    con minijuegos interactivos y un simulador de vector de estado escrito desde cero.
    Se parte de las ondas y la transformada de Fourier clásica, se construyen cúbits, puertas y entrelazamiento,
    y se llega a Grover, QFT, Quantum Phase Estimation y Shor. Cada nivel se desbloquea <b>demostrando el dominio</b>
    (una misión práctica en el juego + un cuestionario de recuerdo), y las preguntas ya vistas vuelven días después
    en el <b>Repaso relámpago</b>. Para jugar hace falta una <b>cuenta gratuita</b> (nombre, apellidos, correo): el progreso
    se guarda en el servidor y te sigue a todas partes, el <b>tutor con IA</b> responde a tus dudas y el examen final
    — corregido por el servidor — emite un <b>certificado en PDF</b> con un código verificable públicamente.
  </div>

  <!-- ============ CÓMO FUNCIONA ============ -->
  <h2 id="como-funciona">Cómo funciona</h2>
  <div class="grid-3">
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>1 · Primero se toca</h3>
      <p class="mb0 dim">Cada concepto llega como minijuego: deslizadores, flechas que arrastrar, circuitos que montar.
      Primero mueves y te equivocas, luego lees la explicación. No es un capricho: aprender así aguanta mejor con el tiempo.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>2 · Las matemáticas están todas</h3>
      <p class="mb0 dim">No es un curso "sin fórmulas": están <b>todas</b>, de la más simple a la más pesada.
      Pero cada símbolo es un botón: lo tocas y te dice qué hace, con los números reales que estás moviendo en el juego.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>3 · Se termina inventando</h3>
      <p class="mb0 dim">El último nivel es un <b>taller</b>: montas bloques cuánticos como piezas,
      los pruebas en retos abiertos e intentas batir tu récord. Ahí no repites: <b>inventas</b>.</p>
    </div>
  </div>

  <!-- ============ REPASO ============ -->
  <h2 id="repaso-relampago">🔁 Repaso relámpago</h2>
  <p class="dim">Pocas preguntas, repetidas en el momento justo (tras 1 día, luego 3, luego 7, luego 21).
  Es la combinación de <b>recuerdo activo</b> y <b>repetición espaciada</b>: de todas las técnicas de estudio medidas
  por la investigación, son las dos que mejor funcionan.</p>
  <div class="panel" id="ripasso"></div>

  <!-- ============ AUTOR ============ -->
  <h2 id="autor">Quién ha hecho este curso</h2>
  <div class="panel">
    <div class="author">
      <div>
        <img src="/assets/davide.jpeg" alt="Davide Cavallini, Forward Deployed AI Engineer y autor del curso" width="320" height="320">
        <div class="cap">Davide Cavallini · Forward Deployed AI Engineer</div>
      </div>
      <div class="who">
        <h3 style="margin-top:0">Hola, soy Davide Cavallini</h3>
        <p class="dim" style="margin-bottom:10px">
          Programo desde los <b>7 años</b>: aprendí con mi abuelo en un <b>Commodore 64</b>,
          y desde entonces no lo he dejado. <b>De profesión desde 2012</b>, me acerqué a la <b>computación
          cuántica en 2017</b> y a la <b>inteligencia artificial en 2019</b>.
        </p>
        <p class="dim" style="margin-bottom:10px">
          Hoy soy <b>Forward Deployed AI Engineer</b>: mi oficio es llevar la inteligencia artificial
          <b>dentro de las empresas</b>, no a las diapositivas. En concreto construyo <b>sistemas de gestión con IA
          a medida</b>: software de gestión cosido al proceso real del cliente, con la IA puesta donde produce
          resultados medibles (y quitada de donde solo hace bonito).
        </p>
        <p class="dim" style="margin-bottom:10px">
          <b>Formación:</b> estudios universitarios en <b>matemáticas y estadística</b> en la <b>London School of Economics (LSE)</b>,
          más cursos especializados de <b>computación cuántica</b> y de <b>matemáticas avanzadas aplicadas al cálculo cuántico</b>
          (el recorrido completo está en mi perfil de LinkedIn).
        </p>
        <p class="dim" style="margin-bottom:10px">
          <b>Enseño desde hace años:</b> he dado cursos y clases en <b>8 organizaciones distintas</b> — empresas privadas y
          <b>públicas</b>, escuelas, academias y programas de formación profesional — y también doy
          <b>clases individuales</b>, uno a uno, para quien prefiere ir a su ritmo.
        </p>
        <p class="dim" style="margin-bottom:10px">
          Formo parte de <b>Red Hot Cyber</b>, donde escribo sobre ciberseguridad, desarrollo y tecnologías emergentes.
          En mi <b>canal de YouTube</b> enseño programación, ciberseguridad y computación cuántica:
          Quantum Arcade nació de ahí, reescrito desde cero en forma de videojuego porque
          <b>mirar no basta, hay que trastear</b>.
        </p>
        <p class="dim" style="margin-bottom:14px">
          Este es, que yo sepa, el <b>primer sitio en italiano</b> que enseña computación cuántica
          <b>jugando</b>, con un simulador cuántico de verdad bajo el capó en vez de animaciones falsas —
          y esta edición en español es una traducción completa, no un resumen.
        </p>
        <div class="btn-row">
          <a class="btn sm primary" href="https://calendly.com/davidecavallini1987/meeting" target="_blank" rel="noopener">📅 Reserva una charla</a>
          <a class="btn sm" href="https://www.youtube.com/@informaticacavallini" target="_blank" rel="noopener">▶ Canal de YouTube</a>
          <a class="btn sm" href="https://www.linkedin.com/in/davidecavallini/" target="_blank" rel="noopener">in LinkedIn</a>
          <a class="btn sm" href="https://www.redhotcyber.com/post/author/davide-cavallini/" target="_blank" rel="noopener">🔥 Artículos en Red Hot Cyber</a>
        </div>
      </div>
    </div>
  </div>

  <!-- ============ TRABAJEMOS JUNTOS ============ -->
  <h2 id="trabajemos-juntos">Trabajemos juntos</h2>
  <p class="dim" style="max-width:72ch">
    Este curso es gratuito y seguirá siéndolo. Si te ha servido y en tu empresa, escuela o camino personal
    hace falta alguien que <b>haga</b> o <b>enseñe</b> estas cosas, aquí está lo que hago — con los números reales,
    sin inflarlos.
  </p>

  <div class="grid-3" style="margin-top:8px">
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Sistemas de gestión con IA a medida</h3>
      <p class="dim">Análisis del proceso, diseño y puesta en producción de sistemas de gestión con IA integrada:
      extracción de documentos, asistentes internos, automatizaciones, integración con los sistemas que la empresa ya usa.</p>
      <p class="mb0 dim"><b>Cómo se empieza:</b> media jornada de análisis para ver dónde la IA da un retorno real
      y — sobre todo — dónde conviene <b>no</b> ponerla.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Formación para empresas y escuelas</h3>
      <p class="dim">He enseñado en <b>8 organizaciones</b> entre empresas privadas y públicas, escuelas y academias.
      Mismo enfoque que este sitio: se toca, se falla, se entiende.</p>
      <p class="mb0 dim"><b>Formatos:</b> desde una charla divulgativa de una hora hasta un programa completo
      con laboratorio. Temas: IA aplicada, desarrollo, ciberseguridad, computación cuántica.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Clases individuales</h3>
      <p class="dim">Uno a uno, a tu ritmo, sobre tu objetivo concreto: preparar un examen, entender de verdad
      un tema, plantear un proyecto, retomar el código después de años.</p>
      <p class="mb0 dim"><b>También vale</b> si partes de cero: la Parte 0 de este sitio nació justo
      de las preguntas de quien empieza.</p>
    </div>
  </div>

  <div class="panel" style="margin-top:16px;border-color:rgba(34,211,238,.45)">
    <div class="grid-2" style="align-items:center">
      <div>
        <h3 style="margin-top:0">Hablemos 20 minutos, sin compromiso</h3>
        <p class="mb0 dim">Elige tú la hora en el calendario. Si después de la charla la respuesta correcta es
        "no te hace falta", te lo digo: me importa más que el proyecto tenga sentido que el que arranque.</p>
      </div>
      <div class="btn-row" style="justify-content:flex-end">
        <a class="btn primary" href="https://calendly.com/davidecavallini1987/meeting" target="_blank" rel="noopener">
          📅 Reserva una llamada
        </a>
        <a class="btn ghost" href="https://www.linkedin.com/in/davidecavallini/" target="_blank" rel="noopener">💬 LinkedIn</a>
      </div>
    </div>
  </div>

  <!-- ============ MAPA ============ -->
  <h2 id="mapa">🗺️ El mapa de niveles</h2>
  <p class="dim">Cada nivel se abre superando la prueba del anterior: una <b>misión práctica</b> dentro del juego
  más el <b>cuestionario de recuerdo</b>. Intentos ilimitados, sin penalización, sin nota.
  La <b>Parte 0</b> (matemáticas de secundaria), la <b>Parte K</b> (el ordenador clásico) y el <b>nivel 1</b>
  están siempre abiertos: las dos primeras son opcionales y se juegan cuando hacen falta.</p>
  <div id="map"></div>

  <!-- ============ FAQ ============ -->
  <h2 id="preguntas">Preguntas frecuentes</h2>
  <div class="grid-2">
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>¿Tengo que saber matemáticas?</h3>
      <p class="mb0 dim">No. La <b>Parte 0</b> cubre números negativos, fracciones y porcentajes, coordenadas, grados y probabilidad:
      está pensada para quien acaba de terminar la secundaria. El seno, el coseno, los números complejos y e^{iθ} se construyen
      dentro del curso, partiendo de un punto que gira en un círculo.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>¿Tengo que saber ya cómo funciona un ordenador normal?</h3>
      <p class="mb0 dim">No, y de hecho conviene <b>no</b> darlo por sabido. La <b>Parte K</b> — seis niveles
      opcionales — explica jugando el ordenador clásico: bits y binario, puertas lógicas, la suma con acarreo, la
      búsqueda lineal y binaria, el coste de los algoritmos, la reversibilidad. Sirve porque «cuántico» es una
      <b>diferencia</b>, y una diferencia solo se ve teniendo el término de comparación: cada nivel cuántico
      empieza con una comparación lado a lado entre cómo se hace en clásico y qué cambia.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>¿Es un simulador de verdad?</h3>
      <p class="mb0 dim">Sí: un simulador de vector de estado escrito desde cero (amplitudes complejas, puertas controladas,
      medida probabilística, entrelazamiento). El circuito de la QFT que montas está verificado con pruebas automáticas:
      reproduce <b>exactamente</b> la matriz de Fourier.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>¿Tengo que registrarme?</h3>
      <p class="dim">Sí, y es gratis: hacen falta nombre, apellidos, correo y contraseña. No es para recoger datos —
      es porque el <b>progreso se guarda en el servidor</b> (lo recuperas en cualquier dispositivo) y porque el
      <b>certificado final</b> lleva tus datos y un código que cualquiera puede verificar. Si el estado viviera solo en el navegador,
      cualquiera podría modificarlo y el certificado no valdría nada.</p>
      <p class="mb0 dim"><a href="{{ \App\Support\Site::page('privacy', $locale) }}">Cómo trato los datos →</a>
      <label class="check" style="display:flex;margin-top:10px"><input type="checkbox" id="freemode"> modo libre (desbloquea todos los niveles)</label>
      <button class="btn tiny" id="reset" style="margin-top:8px">borrar el progreso local</button></p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>¿Cuánto se tarda?</h3>
      <p class="mb0 dim">Cada nivel son 10–20 minutos jugados con calma; el recorrido completo es una tarde larga.
      Pero el <b>taller</b> final puede tenerte entretenido semanas, porque ahí las soluciones no están escritas en ninguna parte.</p>
    </div>
    <div class="panel">
      <h3 class="panel-title" style="margin-top:0"><span class="dot"></span>Soy docente: ¿puedo usarlo en clase?</h3>
      <p class="dim">Si enseñas en un <b>centro público o concertado</b>, en la universidad, en una biblioteca, en un organismo público
      o en una asociación sin ánimo de lucro: sí, libremente y sin pedir nada. Vale también para actividades extraescolares
      y grupos de estudio gratuitos. Puedes descargarlo todo, modificarlo, traducirlo o instalarlo en tu propio servidor:
      el <a href="https://github.com/dade1987/quantum-arcade" target="_blank" rel="noopener">código es público</a>
      y se aceptan contribuciones.</p>
      <p class="mb0 dim">Si en cambio la formación es <b>de pago</b> — academia privada, curso de empresa, bootcamp,
      clases particulares remuneradas — hace falta un acuerdo, y suele ser un trámite:
      <a href="https://calendly.com/davidecavallini1987/meeting" target="_blank" rel="noopener">pide cita</a>.
      Todos los detalles están en la <a href="https://github.com/dade1987/quantum-arcade/blob/main/LICENSE" target="_blank" rel="noopener">licencia</a>.</p>
    </div>
  </div>

  <nav class="nav-foot" style="justify-content:center;gap:18px;flex-wrap:wrap">
    <a class="dim small" href="{{ \App\Support\Site::page('method', $locale) }}">El método y las fuentes científicas</a>
    <span class="muted small">·</span>
    <a class="dim small" href="{{ \App\Support\Site::page('privacy', $locale) }}">Privacidad y datos</a>
    <span class="muted small">·</span>
    <a class="dim small" href="https://github.com/dade1987/quantum-arcade" target="_blank" rel="noopener">Código fuente en GitHub</a>
    <span class="muted small">·</span>
    <a class="dim small" href="https://github.com/dade1987/quantum-arcade/blob/main/LICENSE" target="_blank" rel="noopener">Licencia libre no comercial</a>
    <span class="muted small">·</span>
    <span class="muted small">Quantum Arcade · de Davide Cavallini · hecho en Italia</span>
  </nav>

</main>
@endsection

@push('scripts')
<script type="module" src="/js/home.js"></script>
@endpush
