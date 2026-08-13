@extends('layouts.page', [
    'title' => 'El método — cómo está construido Quantum Arcade (y sobre qué investigación)',
    'description' => 'Las decisiones didácticas, de interfaz y de accesibilidad de Quantum Arcade explicadas una a una, con la investigación que las sostiene: mastery learning, práctica de recuerdo, repetición espaciada, simulaciones interactivas, carga cognitiva, WCAG.',
    'robots' => 'index, follow',
])

@push('head')
@verbatim
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "El método de Quantum Arcade: aprender computación cuántica jugando, según la investigación",
  "inLanguage": "es",
  "author": { "@type": "Person", "name": "Davide Cavallini", "url": "https://www.linkedin.com/in/davidecavallini/" },
  "about": ["aprendizaje basado en el juego", "mastery learning", "práctica de recuerdo", "repetición espaciada", "computación cuántica"]
}
</script>
@endverbatim
@endpush

@section('body')
<header class="topbar">
  <div class="wrap-wide topbar-in">
    <a class="brand" href="{{ \App\Support\Site::page('home', $locale) }}"><img class="logo" src="/assets/logo.svg" alt="" width="30" height="30"><span>Quantum Arcade<small>computación cuántica jugando</small></span></a>
    <span class="topbar-spacer"></span>
    @include('partials.language-picker')
    <a class="btn sm ghost" href="{{ \App\Support\Site::page('home', $locale) }}">🗺️ Mapa</a>
  </div>
</header>

<main class="wrap">

<div class="lesson-hero">
  <nav class="crumbs"><a href="{{ \App\Support\Site::page('home', $locale) }}">Mapa</a> › El método</nav>
  <h1>Cómo está construido este curso</h1>
  <p class="lead">Cada decisión — desde que se juega antes de leer, hasta cómo se desbloquean los niveles o el color
  de los botones — sale de una línea de investigación concreta. Aquí están listadas en claro, para que puedas discutirlas.</p>
</div>

<div class="tldr">
  <b>En dos líneas:</b> se aprende haciendo (simulaciones interactivas), se consolida recordando de memoria (cuestionarios),
  se retiene en el tiempo (repaso espaciado), se avanza solo tras demostrar que se ha entendido (mastery learning),
  y la interfaz está diseñada para <b>quitar</b> carga cognitiva, no para añadirla.
  Debajo están <b>todas</b> las decisiones, incluidas las del orden de los niveles, los sonidos, el registro obligatorio
  y la manera en que está escrito el texto comercial de este sitio — con las fuentes al final.
</div>

<h2>1. Por qué un videojuego y no un vídeo</h2>
<p>El metaanálisis de <b>Wouters y colegas (2013)</b> sobre 77 estudios (más de 5.500 participantes) encuentra que los "serious games"
producen un aprendizaje superior a la instrucción tradicional (d ≈ 0,29) y sobre todo una <b>retención</b> mejor
(d ≈ 0,36). Pero con un detalle decisivo: funcionan <b>mejor cuando el juego va acompañado de otra instrucción</b>
y cuando la experiencia se reparte en varias sesiones.</p>
<p><b>Lo que sacamos de aquí:</b> ningún nivel es "solo juego". Cada minijuego va seguido (o precedido) de una explicación
escrita, de una fórmula desmontada y de un ejemplo numérico resuelto. Y por eso existe el Repaso relámpago:
para empujar hacia varias sesiones en vez de un maratón único.</p>

<h2>2. Por qué se toca antes de leer</h2>
<p>Las simulaciones interactivas del proyecto <b>PhET</b> (University of Colorado Boulder) muestran ganancias conceptuales
iguales o superiores a las obtenidas con el material de laboratorio real, y generan discusiones más productivas.
La línea de investigación sobre el <b>productive failure</b> (Kapur) muestra además que <i>intentar</i> un problema antes de recibir
la explicación — incluso fallando — lleva a una comprensión conceptual más profunda que recibir la regla de entrada.</p>
<p><b>Lo que sacamos de aquí:</b> en casi todos los niveles el deslizador llega antes que la fórmula. Primero ves las flechas
cancelarse, luego te explicamos que se llama interferencia destructiva.</p>

<h2>3. Por qué hay cuestionarios (y por qué no ponen nota)</h2>
<p>El <b>testing effect</b> (Roediger &amp; Karpicke) es uno de los resultados más sólidos de la psicología cognitiva:
recordar de memoria una información la refuerza mucho más que releerla durante el mismo tiempo. Las revisiones
sobre técnicas de estudio colocan la <b>práctica de examen</b> y la <b>práctica distribuida</b> en los primeros puestos por eficacia.</p>
<p><b>Lo que sacamos de aquí:</b> los cuestionarios son de baja exigencia, con retroalimentación inmediata que explica <i>por qué</i>,
repetibles hasta el infinito y sin puntuación negativa. Equivocarse es parte del método: una pregunta fallada vuelve
antes en el repaso, una acertada vuelve más tarde (sistema de cajas de <b>Leitner</b>: 1 día → 3 → 7 → 21 → 60).</p>

<h2>4. Por qué los niveles solo se desbloquean con el dominio</h2>
<p>En el <b>mastery learning</b> (Bloom) el estudiante avanza cuando ha demostrado dominar la unidad actual,
con tiempo e intentos variables en vez de fijos. Los efectos medidos están entre los más consistentes de la enseñanza
individualizada, sobre todo para quien parte con más retraso.</p>
<div class="callout key"><b>Nuestra regla de desbloqueo (deliberadamente doble):</b>
<ul style="margin:8px 0 0">
  <li><b>prueba práctica</b> — la misión dentro del minijuego: demuestras que sabes <i>hacerlo</i>;</li>
  <li><b>prueba de recuerdo</b> — las preguntas del nivel, todas acertadas al menos una vez: demuestras que sabes <i>explicarlo</i>.</li>
</ul>
<p style="margin:8px 0 0">Solo la primera se podría sortear a base de intentos al azar; solo la segunda se puede adivinar.
Juntas son una señal fiable. Quien quiera moverse libre de todos modos (una persona adulta que repasa, un docente que prepara
la clase) puede activar el <b>modo libre</b> desde la portada.</p></div>

<h2>5. Por qué la interfaz es tan desnuda</h2>
<p>La <b>teoría de la carga cognitiva</b> (Sweller) y los principios del <b>aprendizaje multimedia</b> (Mayer) prescriben
algunas cosas muy concretas, aplicadas aquí al pie de la letra:</p>
<table class="table">
  <tr><th>Principio</th><th>Cómo se aplica en Quantum Arcade</th></tr>
  <tr><td><b>Coherencia</b> — fuera lo superfluo</td><td>ninguna animación decorativa, ninguna foto de banco de imágenes, ningún emergente: en la pantalla solo está lo que el concepto necesita</td></tr>
  <tr><td><b>Señalización</b> — destaca lo que importa</td><td>colores constantes en todo el curso: amplitud = amarillo, fase = violeta, resultado = rosa, "está" = verde, "no está" = rojo</td></tr>
  <tr><td><b>Contigüidad espacial</b></td><td>los números están escritos <i>dentro</i> del gráfico, junto al objeto que describen, no en una leyenda lejana</td></tr>
  <tr><td><b>Segmentación</b></td><td>los pasos difíciles van a golpes ("Siguiente →"), al ritmo que marca quien lee</td></tr>
  <tr><td><b>Preentrenamiento</b></td><td>los términos se definen <i>antes</i> de usarlos en una fórmula: la Parte 0 existe para eso</td></tr>
  <tr><td><b>Estilo coloquial</b></td><td>se tutea y se usan palabras normales: el "efecto de personalización" muestra que ayuda a comprender</td></tr>
</table>

<h2>6. Colores, contraste, accesibilidad</h2>
<ul>
  <li><b>Tema oscuro con texto de alto contraste</b> y ancho de línea limitado a ~75 caracteres: dos parámetros que
      inciden directamente en la fatiga de lectura.</li>
  <li><b>Ninguna información confiada solo al color</b>: cada estado tiene también un símbolo o una etiqueta (✓, ✗, 🔒),
      requisito WCAG para quien tiene daltonismo.</li>
  <li><b>Zonas táctiles</b> de al menos 44 px, <b>foco visible</b> para la navegación con teclado,
      soporte de <code>prefers-reduced-motion</code> para quien lleva mal las animaciones.</li>
  <li><b>Retroalimentación inmediata</b> en cada acción (por debajo de 100 ms): los deslizadores actualizan el dibujo mientras los mueves,
      no al soltarlos. Es el umbral pasado el cual una interfaz deja de parecer "tuya".</li>
</ul>

<h2>7. Motivación: por qué XP y niveles, pero ninguna clasificación</h2>
<p>La <b>teoría de la autodeterminación</b> (Deci &amp; Ryan) identifica tres motores: competencia, autonomía, relación.
Los metaanálisis sobre gamificación muestran efectos positivos pero <b>frágiles</b>: puntos e insignias funcionan si señalan
<i>competencia adquirida</i>, y pueden ser contraproducentes si se convierten en la única razón para jugar o si crean
presión por comparación social.</p>
<p><b>Lo que sacamos de aquí:</b> los XP llegan solo por cosas realmente hechas (misión superada, pregunta recordada),
los rangos describen una habilidad ("Señor de las flechas", "Cazador de periodos") y <b>no existe ninguna clasificación</b>
ni cronómetro corriendo. La autonomía queda protegida por el modo libre y por poder rejugar cualquier nivel.</p>

<h2>8. ¿Y el último nivel?</h2>
<p>La investigación sobre el aprendizaje de las STEM distingue entre <i>saber aplicar</i> y <i>saber transferir</i>.
La transferencia solo se entrena con problemas <b>mal definidos</b>, donde no hay un procedimiento que repetir.
Por eso el último nivel es un taller abierto: objetivos que alcanzar, bloques a disposición,
ninguna solución escrita en ninguna parte, y un contador de "cuántas veces has consultado al oráculo"
que te empuja a buscar un camino más listo.</p>


<h2>9. Por qué el cúbit llega en el nivel 1 y Fourier solo en el 13</h2>
<p>La primera versión de este curso seguía el orden "lógico": ondas → Fourier → cúbit. Impecable sobre el papel,
equivocado en la práctica: siete niveles de matemáticas antes de ver el objeto por el que uno ha llegado aquí.</p>
<p>El orden actual sigue dos principios consolidados:</p>
<ul>
  <li><b>Currículo en espiral</b> (Bruner, 1960): un concepto se encuentra varias veces, primero en forma simple y luego
      completa. Las amplitudes aparecen en el nivel 1 como números <b>con signo</b> (+ y −), que bastan para entender
      la interferencia y H·H; se convierten en <b>flechas complejas</b> en el nivel 8, cuando dos signos ya no bastan.
      Volver sobre los mismos conceptos con distancia es además <b>práctica espaciada</b>: dos beneficios en una sola decisión.</li>
  <li><b>Justo a tiempo</b>: una herramienta se introduce donde hace falta, no antes. Las ondas y la transformada de Fourier llegan
      en los niveles 13–17, justo antes de la QFT, cuando la pregunta "¿cómo encuentro una periodicidad escondida?"
      ya se la ha hecho quien juega — en el nivel 12, con el algoritmo de Simon, se descubre que solo se saben encontrar
      periodos "en XOR", y para los de verdad hacen falta las ondas. Introducirlos siete niveles antes significaba
      responder a una pregunta que aún no había nacido.</li>
</ul>
<div class="callout key"><b>Regla que me he impuesto:</b> ninguna herramienta puede introducirse más de un nivel
antes del punto en que hace falta, y cada concepto debe volver al menos dos veces.</div>

<h2>10. Por qué el ordenador clásico va primero (y sigue siendo opcional)</h2>
<p>«Cuántico» no es una cosa: es una <b>diferencia</b>. Y una diferencia solo se ve si se conoce el término de
comparación. Quien nunca ha enfocado qué es un bit no tiene manera de darse cuenta de qué tiene de raro un
cúbit: le falta el fondo sobre el que se recorta la figura. Casi todas las frases equivocadas que circulan —
«prueba todos los caminos a la vez», «es infinitamente más rápido» — nacen exactamente de ahí.</p>
<p>De ahí dos decisiones que se sostienen mutuamente:</p>
<ul>
  <li>una <b>Parte K</b> de seis niveles sobre el ordenador normal (bits, puertas lógicas, suma con acarreo,
      búsqueda, coste de los algoritmos, reversibilidad y principio de Landauer), jugada con los mismos
      minijuegos que el resto del curso;</li>
  <li>un <b>bloque de comparación</b> que abre cada nivel cuántico en el que la comparación existe de verdad: a la
      izquierda cómo se hace con un ordenador normal, a la derecha qué cambia, y debajo el número que dice cuánto
      vale la diferencia. Donde la comparación vale una partida y no un párrafo — la búsqueda antes de Grover, el
      oráculo interrogado a mano antes de Deutsch–Jozsa, el código de repetición antes de la corrección de errores
      cuántica — el minijuego clásico se juega ahí mismo.</li>
</ul>
<p>Por qué está hecho <b>así</b> y no con un capítulo de teoría inicial:</p>
<ul>
  <li><b>Comparar dos casos concretos hace emerger el principio</b> mejor que enunciar el principio y luego dar un
      ejemplo (Gentner, Loewenstein y Thompson, 2003; Alfieri, Nokes-Malach y Schunn, 2013). Funciona sobre todo
      cuando los dos casos se parecen casi del todo y se diferencian en <b>un solo punto</b>: que es exactamente
      la relación entre bit y cúbit, entre búsqueda lineal y Grover, entre DFT y QFT.</li>
  <li><b>Las dos columnas están una al lado de la otra</b>, no una debajo de la otra: leer la segunda reteniendo
      la primera es carga cognitiva gastada en memoria en vez de en razonamiento (efecto de la atención dividida,
      Sweller, Ayres y Kalyuga). Con las columnas juntas, la comparación la hacen los ojos.</li>
  <li><b>El número del final es siempre del mismo tipo</b> (cuántas operaciones, cuántas preguntas, cuántos
      estados): una vara que no cambia de unidad de un nivel a otro es lo que permite darse cuenta de que Grover
      y Shor <b>no hacen lo mismo</b> — uno es una ganancia cuadrática, el otro exponencial.</li>
  <li><b>La Parte K es opcional</b>, como la Parte 0, y queda fuera de la cadena de prerrequisitos. Quien ya sabe
      cómo funciona un ordenador sigue de largo; quien tiene un hueco vuelve a ella en el momento en que el hueco
      se nota — que es el momento en que se aprende de verdad, y no dos semanas antes «porque está en el
      temario». Cada bloque de comparación lleva el enlace al nivel clásico correspondiente, así que la puerta
      está siempre abierta y nunca es un peaje.</li>
</ul>
<div class="callout key"><b>Efecto colateral buscado:</b> quien termina la Parte K ha aprendido bien también
informática clásica — binario, puertas, complejidad, reversibilidad — que es algo útil de por sí, y no solo el
preámbulo de otra cosa.</div>

<div class="callout key" style="margin-top:18px"><b>Cómo se presenta en la práctica, nivel a nivel.</b>
Donde la comparación vale una partida y no un párrafo, los dos modos están dentro del <b>mismo minijuego</b>, con
un interruptor que cambia de máquina: misma pantalla, mismos botones, misma misión. Cambia el mecanismo, y ya
está. Pasa en el nivel 1 (el mismo registro de tres casillas: una columna llena frente a ocho), en el 3 (la misma
aguja: saltos contra rotaciones), en el 4 (el reto de los sobres, donde lo clásico se queda en el 75% y el
entrelazamiento llega al 85%) y en el 7 (dos caminos, donde las probabilidades se suman y las amplitudes se
cancelan).</div>
<p>Tres detalles de esos cuatro juegos son intencionados y vale la pena declararlos:</p>
<ul>
  <li><b>Primero se prueba, luego se explica</b>, y en modo clásico algunas misiones <b>no se pueden ganar</b>.
      Chocar contra el muro con las herramientas que uno tiene hace que la solución posterior sea mucho más
      sólida que recibirla primero: es el <i>productive failure</i> de Kapur, ya citado en el punto 2. Eso sí, el
      juego dice cuándo el muro es un muro, en vez de dejarte dando vueltas: fallar es útil, fallar sin saberlo
      no.</li>
  <li><b>Los dos casos están alineados</b>: si algo cambia entre los dos modos, es porque es <b>la</b> cosa. Es la
      condición que hace eficaz la comparación (Gentner, <i>structure mapping</i>): la mente aísla la diferencia
      solo si todo lo demás coincide.</li>
  <li><b>El modo de cálculo se ve siempre</b>, en cada minijuego del curso: azul «ordenador normal», violeta
      «ordenador cuántico», con icono y palabra escrita junto al color — nunca el color solo, como en el punto 6.
      La Parte 0 y los laboratorios de ondas no llevan etiqueta, porque las matemáticas no son ni una cosa ni la
      otra.</li>
</ul>

<h2>11. El sonido: información, no decoración</h2>
<p>Un arcade sin sonidos no es un arcade, pero el ruido por el ruido viola el <b>principio de coherencia</b> de Mayer
(todo lo que no sirve al concepto resta atención). El compromiso aplicado aquí:</p>
<ul>
  <li>cada <b>tipo de evento tiene su timbre</b>, siempre el mismo: clic, XP, misión, medida cuántica,
      interferencia constructiva, interferencia destructiva, fanfarria de nivel. En pocos minutos reconoces
      qué ha pasado <b>sin mirar</b>: el sonido se vuelve un segundo canal de información;</li>
  <li>sonidos <b>breves</b> (por debajo de 350 ms) y a volumen bajo, generados en vivo con WebAudio: ningún archivo que descargar,
      funciona también con conexión lenta;</li>
  <li>el error <b>no castiga</b>: dos notas descendentes, no un zumbador. Una retroalimentación punitiva aumenta la ansiedad de
      rendimiento y reduce la disposición a reintentar, que es justo lo que hace falta en un curso por dominio;</li>
  <li>se puede <b>apagar todo</b> y la elección se recuerda. Ningún sonido arranca antes de una interacción,
      como exigen también las reglas de los navegadores.</li>
</ul>

<h2>12. "Efecto wow": retroalimentación inmediata y específica</h2>
<p>En la primera versión, los minijuegos de la Parte 0 no decían si lo estabas haciendo bien. La investigación sobre retroalimentación
(Hattie &amp; Timperley; Shute) es clara en un punto: funciona cuando es <b>inmediata</b>, <b>específica</b>
y referida a la <b>tarea</b>, no a la persona. De ahí tres añadidos, presentes ahora en <b>todos</b> los juegos:</p>
<ul>
  <li><b>El objetivo siempre escrito arriba</b>, en una banda propia: no tienes que acordarte de qué te habían pedido.</li>
  <li><b>Barra de "cuánto te falta"</b> que pasa de roja a ámbar a verde, acompañada de un tono que sube conforme
      te acercas: color + sonido + texto, tres canales para la misma información (útil también para quien tiene
      dificultades con los colores).</li>
  <li><b>Celebración visible</b> al llegar — chispas, destello, sonido — porque el momento en que lo has entendido
      tiene que ser inequívoco. Es la única concesión "decorativa", y dura medio segundo.</li>
</ul>

<h2>13. Por qué la cuenta es obligatoria (y por qué no me gusta)</h2>
<p>Pedir un registro es fricción, y la fricción hace perder gente: sería más cómodo para todos hacer correr
todo en el navegador. Dos razones lo convierten igualmente en la decisión correcta:</p>
<ul>
  <li><b>el progreso no debe morir con la caché.</b> Un curso de 35 niveles se hace en varias sesiones y a menudo en varios
      dispositivos: perderlo todo por una limpieza del navegador es la forma más tonta de abandonar;</li>
  <li><b>el certificado tiene que valer algo.</b> Las preguntas del examen llegan del servidor <b>sin</b> las respuestas correctas
      y la corrección ocurre en el servidor: si el estado viviera en el navegador, cualquiera podría asignarse el 100%
      con dos líneas de consola, y el certificado sería papel mojado.</li>
</ul>
<p>A cambio: solo los datos que hacen falta de verdad (nombre, apellidos, correo — la fecha de nacimiento es opcional y sirve para
distinguir a personas con el mismo nombre), ningún perfilado, ninguna publicidad, borrado total con un clic.
Todo está escrito en el <a href="{{ \App\Support\Site::page('privacy', $locale) }}">aviso de privacidad</a>.</p>

<h2>14. El tutor con IA que se niega a darte la solución</h2>
<p>El tutor responde solo con los contenidos de este sitio (RAG) y, por diseño, <b>no da las soluciones de las
misiones</b>: da una pista y te devuelve al deslizador correcto. Es una decisión incómoda pero sostenida por la investigación sobre las
<b>dificultades deseables</b> (Bjork): el esfuerzo de llegar por tu cuenta es justo lo que produce el aprendizaje
duradero. Un tutor complaciente haría que todo pareciera más fácil y dejaría menos poso.</p>
<p>Cada respuesta cita el nivel y pone su enlace: el objetivo del tutor es <b>devolverte al juego</b>,
no sustituirlo. Y si una pregunta no encuentra respuesta en los contenidos, lo dice en vez de inventar.</p>

<h2>15. Cómo sé que el simulador no miente</h2>
<p>Un curso que enseña con un simulador tiene un problema de fondo: si el simulador se equivoca, enseña el error —
y lo enseña de forma convincente, porque lo hace ver. Las pruebas del proyecto comprueban las propiedades que uno
espera (las puertas siguen siendo unitarias, la QFT reproduce <i>exactamente</i> la matriz de Fourier, las probabilidades
suman uno). Pero esas pruebas las escribo yo, con el mismo razonamiento con el que está escrito el simulador:
si el error está en el razonamiento, las pruebas lo confirman en vez de encontrarlo.</p>
<p>Por eso el simulador se contrasta con una <b>implementación independiente</b>:
<a href="https://github.com/francescosisini/QuantumSim" target="_blank" rel="noopener">QuantumSim</a>, escrito en C
por <b>Francesco Sisini</b>. Trescientos circuitos generados al azar — hasta 4 cúbits, con Hadamard, Pauli, S, T, T†,
rotaciones de fase, CNOT, CZ y Toffoli — se ejecutan en ambos simuladores y las amplitudes se comparan una
a una. Lenguajes distintos, autores distintos, código escrito sin conocerse: <b>la desviación máxima es del orden
de 10⁻¹⁵</b>, es decir, el límite de precisión de los números del ordenador. Un error común a ambos, llegados a ese punto,
es muy improbable.</p>
<p class="dim small">QuantumSim se publica con licencia GNU GPL v3 y <b>no está incluido en este sitio</b>: se
descarga y compila solo cuando se lanza la verificación (<code>npm run test:cross</code>), como una herramienta
de banco de pruebas. Doy las gracias a Francesco Sisini por dejarme usarlo — y sobre todo porque es de
<b>sus libros</b> de donde empecé a aprender esta materia.</p>

<h2>16. El texto del sitio: qué técnicas de persuasión uso, declaradas</h2>
<p>Este sitio tiene también un objetivo profesional: darme a conocer como alguien que construye sistemas de IA y enseña.
Me parece honesto declarar qué palancas estoy usando, para que puedas valorarlas:</p>
<table class="table">
  <tr><th>Técnica</th><th>Investigación de referencia</th><th>Cómo la uso aquí</th></tr>
  <tr><td><b>Efecto de gradiente del objetivo</b></td><td>Kivetz, Urminsky &amp; Zheng (2006)</td>
      <td>barra de XP y niveles visibles: la motivación crece cuanto más cerca está la meta</td></tr>
  <tr><td><b>Progreso regalado</b></td><td>Nunes &amp; Drèze (2006)</td>
      <td>la Parte 0 ya es "camino recorrido" para quien conoce las bases: se parte de una barra que no está vacía</td></tr>
  <tr><td><b>Prueba social</b></td><td>Cialdini</td>
      <td>números <b>reales</b>: 8 organizaciones en las que he enseñado, 35 niveles, más de 300 pruebas automáticas. Ningún "10.000 alumnos felices" inventado</td></tr>
  <tr><td><b>Reciprocidad</b></td><td>Cialdini</td>
      <td>el curso completo es gratuito y sigue siéndolo: la petición de contacto llega después, y solo si te ha servido</td></tr>
  <tr><td><b>Reducción de la fricción</b></td><td>modelo de Fogg (B = MAP)</td>
      <td>una sola acción principal por sección y un calendario para reservar, en vez de un formulario largo</td></tr>
</table>
<div class="callout warn"><b>Lo que NO hago, por decisión propia:</b> ninguna cuenta atrás falsa, ninguna
"escasez" inventada, ningún número inflado, ninguna promesa de certificación reconocida que no tengo.
Las técnicas de persuasión aplicadas a una afirmación falsa no son marketing: son un engaño,
y en un sitio que enseña a distinguir lo verdadero de lo verosímil serían además ridículas.</div>

<h2>17. Cómo está escrito para los buscadores y para las IA</h2>
<p>La mitad de las búsquedas de hoy acaba dentro de una respuesta generada por una IA en vez de en una lista de enlaces.
Las indicaciones que salen de la investigación sobre <i>Generative Engine Optimization</i> son coherentes con escribir bien:</p>
<ul>
  <li><b>datos estructurados</b> (JSON-LD: Course, Person, FAQPage) para que una máquina entienda qué es este recurso,
      quién lo ha escrito y qué enseña;</li>
  <li><b>afirmaciones autocontenidas y citables</b>: cada respuesta importante está en un párrafo que se sostiene solo,
      sin necesitar el contexto de alrededor;</li>
  <li>un archivo <a href="/llms.txt">llms.txt</a> con los hechos verificables del proyecto, para quien indexa con modelos de lenguaje;</li>
  <li><b>señales de fiabilidad</b>: autor en claro, fuentes enlazadas, fecha de actualización y admisión explícita
      de los límites (el certificado no está acreditado).</li>
</ul>
<p class="dim small">Nota: la misma investigación muestra que los contenidos citados por las IA son los <b>estructurados y verificables</b>.
Otra manera de decir que escribir con honestidad y escribir para que te encuentren, por una vez, coinciden.</p>

<h2>18. Los tres idiomas, y cómo se pasa de uno a otro</h2>
<p>El curso existe entero en italiano, inglés y español: no un resumen traducido, tres ediciones completas —
examen y certificado incluidos. También las direcciones están traducidas (<code>/en/lessons/</code>,
<code>/es/lecciones/</code>), porque una página en español que vive en una carpeta llamada "lezioni" es una
página traducida a medias, y se nota.</p>
<p>El selector de arriba sigue cuatro reglas, y ninguna es estética:</p>
<ul>
  <li><b>Cada idioma está escrito en su propio idioma</b> — «Español», no «Spagnolo». Quien busca su idioma lo
      busca tal como se escribe en su casa, no traducido a un idioma que quizá no lee. Es la recomendación del
      W3C y del Nielsen Norman Group, y es también el motivo por el que la primera versión no funcionaba:
      decía «IT EN ES», y las siglas ISO son etiquetas mudas para quien no las ha visto nunca.</li>
  <li><b>Nada de banderas.</b> Una bandera indica un estado, no un idioma: ¿cuál le pondrías al español, entre
      los veinte países que lo hablan? En su lugar un globo terráqueo, el único símbolo que el público asocia
      a "idioma" sin asociarlo a un país.</li>
  <li><b>Se cambia de idioma sin perder el sitio.</b> Quien está leyendo la QFT en italiano y elige English
      quiere la QFT en inglés, no volver a empezar desde el mapa. Las direcciones de las otras versiones son
      los mismos <code>hreflang</code> que la página ya declara para los buscadores: calcularlos por segunda vez
      sería la manera clásica de hacer que se separen.</li>
  <li><b>Si tu navegador habla otro idioma te lo digo, pero no te muevo.</b> Aparece una línea —escrita <i>en</i>
      el idioma que propone, si no no se lee— con dos botones: cambiar, o seguir. Y luego no vuelve a preguntar.
      La redirección automática está desaconsejada explícitamente por Google para los sitios multilingües:
      impide llegar a propósito a una versión concreta, confunde a quien habla más idiomas de los que tiene
      configurados en el navegador, y esconde las otras copias a los buscadores.</li>
</ul>
<div class="callout key">La regla que hay debajo de las cuatro: <b>ofrecer, no decidir</b>. Quien lee sabe en qué
idioma quiere leer mejor de lo que lo sabe su navegador.</div>

<h2>19. El glosario que se queda abierto mientras lees</h2>
<p>Durante un tramo el glosario fue la <b>última</b> página del curso. Un error: la palabra que te bloquea la lectura
no te espera al final, te la encuentras en el nivel 4 — y una palabra que no se entiende no aplaza el problema, lo
<b>multiplica</b>, porque cada frase siguiente la usa como si estuviera clara.</p>
<p>Ahora el glosario está arriba en todas las páginas y se queda abierto <i>mientras</i> lees. Las decisiones
concretas vienen de cinco resultados de la investigación, no de una moda gráfica:</p>
<table class="table">
  <tr><th>Resultado</th><th>Cómo se aplica</th></tr>
  <tr><td><b>Split-attention effect</b> (Ayres y Sweller): sostener una frase en la cabeza mientras se busca la
      definición en otro sitio gasta la misma memoria de trabajo que hacía falta para entender el concepto</td>
      <td>el panel se abre <i>al lado</i> del texto y, cuando la pantalla lo permite, <b>desplaza</b> la página en
      vez de taparla: no se cambia de página ni se pierde el hilo</td></tr>
  <tr><td><b>Contigüidad espacial</b> (Mayer): la explicación va junto a lo explicado</td>
      <td>los términos están marcados dentro del texto y la definición aparece <b>al lado de la palabra</b>, en dos
      líneas, con el número del nivel que la explica de verdad</td></tr>
  <tr><td><b>Recognition rather than recall</b> (Nielsen, 6.ª heurística): no hay que acordarse de que una función
      existe</td>
      <td>el botón 📖 está en la barra superior de <b>todas</b> las páginas del curso — el mapa, las lecciones y esta — y el atajo
      (<b>G</b>) es el mismo en todo el sitio</td></tr>
  <tr><td><b>Glosas</b> (Nation; metaanálisis de Yun sobre glosas hipertextuales): las definiciones breves y a un
      gesto de distancia ayudan a la comprensión y al recuerdo del léxico; las largas cortan la lectura</td>
      <td>dos líneas, nunca un muro de texto, y la búsqueda acepta también el número de un nivel
      («¿qué era aquello del 12?»)</td></tr>
  <tr><td><b>Expertise reversal effect</b> (Kalyuga et al.): la ayuda que necesita quien empieza <b>estorba</b> a
      quien ya sabe</td>
      <td>cada término se marca <b>una sola vez por página</b>, la primera; y el resaltado tiene un interruptor que
      se queda apagado también en las páginas siguientes</td></tr>
</table>
<p>El panel, a propósito, <b>no es modal</b>: no bloquea la lección ni exige que lo cierres para seguir. Bloquear la
página para mostrar una definición sería como cerrar el libro para abrir el diccionario. Por debajo de 1100 px de
ancho no hay sitio para dos columnas: ahí sí tapa, y basta con tocar fuera para cerrarlo.</p>
<p class="dim small">Efecto secundario útil: los términos viven en un <b>solo archivo</b>
(<code>js/core/glossario.js</code>), así que la tabla del nivel 23, el panel y las definiciones al toque ya no pueden
decir tres cosas distintas — algo que ya había empezado a pasar entre la versión italiana y las traducidas.</p>

<h2>Fuentes</h2>
<p class="dim small">Listadas en el orden en que aparecen en el texto. Donde no hay enlace es porque la referencia
es un libro o un artículo clásico fácil de encontrar: prefiero citarlo así antes que enlazar una copia
de origen dudoso.</p>
<ul class="src">
  <li>Wouters, P., van Nimwegen, C., van Oostendorp, H., van der Spek, E. (2013). <i>A meta-analysis of the cognitive and motivational effects of serious games</i>. Journal of Educational Psychology, 105(2), 249–265. — <a href="https://eric.ed.gov/?id=EJ1008015" target="_blank" rel="noopener">ficha ERIC</a></li>
  <li>Clark, D. B., Tanner-Smith, E. E., Killingsworth, S. S. (2016). <i>Digital Games, Design, and Learning: A Systematic Review and Meta-Analysis</i>. Review of Educational Research, 86(1), 79–122. — <a href="https://journals.sagepub.com/doi/10.3102/0034654315582065" target="_blank" rel="noopener">artículo</a></li>
  <li>Sailer, M., Homner, L. (2020). <i>The Gamification of Learning: a Meta-analysis</i>. Educational Psychology Review. — <a href="https://link.springer.com/article/10.1007/s10648-019-09498-w" target="_blank" rel="noopener">artículo</a></li>
  <li>Perkins, K. et al. <i>PhET: Interactive Simulations for Teaching and Learning Physics</i>. The Physics Teacher, 44(1), 18–23. — <a href="https://pubs.aip.org/aapt/pte/article/44/1/18/274167/PhET-Interactive-Simulations-for-Teaching-and" target="_blank" rel="noopener">artículo</a></li>
  <li>Kapur, M. <i>Productive Failure</i>. — <a href="https://boldscience.org/wp-content/uploads/2025/04/Productive-Failure.pdf" target="_blank" rel="noopener">síntesis divulgativa (PDF)</a></li>
  <li>Roediger, H. L., Karpicke, J. D. — sobre el <i>testing effect</i> y el efecto "hacia delante" del recuerdo: <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3983480/" target="_blank" rel="noopener">Retrieval practice enhances new learning (PMC)</a></li>
  <li>Revisión sistemática sobre <i>aprendizaje espaciado, intercalado y práctica de recuerdo</i> (2023), Journal of the American College of Radiology. — <a href="https://www.jacr.org/article/S1546-1440(23)00646-4/fulltext" target="_blank" rel="noopener">artículo</a></li>
  <li>Síntesis divulgativa sobre recuerdo + práctica espaciada: <a href="https://evidencebased.education/resource/retrieval-and-spaced-practice-study-strategies-that-must-be-combined/" target="_blank" rel="noopener">Evidence Based Education</a></li>
  <li>Bjork, R. A. — <i>Desirable Difficulties in Theory and Practice</i>: por qué lo que hace el aprendizaje más costoso en el momento lo hace más sólido con el tiempo. — <a href="https://www.researchgate.net/publication/347931447_Desirable_Difficulties_in_Theory_and_Practice" target="_blank" rel="noopener">texto</a></li>
  <li>Kivetz, R., Urminsky, O., Zheng, Y. (2006). <i>The Goal-Gradient Hypothesis Resurrected</i>. Journal of Marketing Research. — <a href="https://business.columbia.edu/insights/chazen-global-insights/goal-gradient-hypothesis-resurrected" target="_blank" rel="noopener">síntesis de Columbia Business School</a></li>
  <li>Nunes, J. C., Drèze, X. (2006). <i>The Endowed Progress Effect: How Artificial Advancement Increases Effort</i>. Journal of Consumer Research. — <a href="https://www.researchgate.net/publication/23547282_The_Endowed_Progress_Effect_How_Artificial_Advancement_Increases_Effort" target="_blank" rel="noopener">texto</a></li>
  <li>Sisini, F. — <i>QuantumSim</i>, simulador de circuitos cuánticos en C, y los libros divulgativos del mismo autor con los que empezó mi camino en esta materia. — <a href="https://github.com/francescosisini/QuantumSim" target="_blank" rel="noopener">repositorio</a></li>
  <li>Gentner, D., Loewenstein, J., Thompson, L. (2003). <i>Learning and Transfer: A General Role for Analogical Encoding</i>. Journal of Educational Psychology — comparar dos casos concretos hace emerger el principio común mejor que estudiarlos de uno en uno. — <a href="https://groups.psych.northwestern.edu/gentner/papers/GentnerLoewensteinThompson03.pdf" target="_blank" rel="noopener">PDF</a></li>
  <li>Alfieri, L., Nokes-Malach, T. J., Schunn, C. D. (2013). <i>Learning Through Case Comparisons: A Meta-Analytic Review</i>. Educational Psychologist, 48(2), 87–113. — <a href="https://www.tandfonline.com/doi/abs/10.1080/00461520.2013.775712" target="_blank" rel="noopener">artículo</a></li>
  <li>Landauer, R. (1961), <i>Irreversibility and Heat Generation in the Computing Process</i>, y Bérut, A. et al. (2012), <i>Experimental verification of Landauer's principle</i>, Nature 483, 187–189 — el coste termodinámico de borrar un bit, predicho y luego medido. — <a href="https://www.nature.com/articles/nature10872" target="_blank" rel="noopener">artículo en Nature</a></li>
  <li>Bruner, J. S. (1960). <i>The Process of Education</i> — el currículo en espiral: volver sobre los mismos conceptos a niveles cada vez más profundos.</li>
  <li>Sweller, J. — teoría de la carga cognitiva; Mayer, R. E. — principios del aprendizaje multimedia (coherencia, señalización, contigüidad, segmentación, preentrenamiento, estilo coloquial).</li>
  <li>Hattie, J., Timperley, H. (2007). <i>The Power of Feedback</i>; Shute, V. (2008). <i>Focus on Formative Feedback</i> — la retroalimentación funciona si es inmediata, específica y referida a la tarea.</li>
  <li>Deci, E. L., Ryan, R. M. — teoría de la autodeterminación: competencia, autonomía, relación.</li>
  <li>Cialdini, R. B. — <i>Influence</i>: reciprocidad, prueba social, autoridad. Usadas aquí solo sobre afirmaciones verificables.</li>
  <li>Sobre la <i>Generative Engine Optimization</i>: <a href="https://backlinko.com/generative-engine-optimization-geo" target="_blank" rel="noopener">panorámica de prácticas</a> y <a href="https://arxiv.org/pdf/2606.12439" target="_blank" rel="noopener">position paper sobre los riesgos (arXiv)</a></li>
  <li>WCAG 2.2 (W3C) para contraste, zonas táctiles, foco visible e información nunca confiada solo al color. — <a href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noopener">referencia rápida</a></li>
  <li>Ayres, P., Sweller, J. — <i>The Split-Attention Principle in Multimedia Learning</i>, en <i>The Cambridge Handbook of Multimedia Learning</i>: por qué mantener separadas frase y definición cuesta memoria de trabajo.</li>
  <li>Kalyuga, S., Ayres, P., Chandler, P., Sweller, J. (2003). <i>The Expertise Reversal Effect</i>. Educational Psychologist, 38(1), 23–31 — la ayuda que sirve a quien empieza estorba a quien ya sabe.</li>
  <li>Nielsen, J. — <i>10 Usability Heuristics for User Interface Design</i>, en particular la sexta («recognition rather than recall»). — <a href="https://www.nngroup.com/articles/ten-usability-heuristics/" target="_blank" rel="noopener">texto</a></li>
  <li>Nation, I. S. P. (2001). <i>Learning Vocabulary in Another Language</i>. Cambridge University Press — sobre el papel de las glosas.</li>
  <li>Yun, J. (2011). <i>The effects of hypertext glosses on L2 vocabulary acquisition: a meta-analysis</i>. Computer Assisted Language Learning, 24(1), 39–58.</li>
</ul>

<div class="callout"><b>Honestidad intelectual:</b> ninguno de estos estudios trata de <i>este</i> curso en particular, y los tamaños de efecto
en didáctica son medias, no garantías. Si notas que algo no funciona — un nivel demasiado empinado, un juego poco claro —
es un dato útil: escríbemelo.</div>

<nav class="nav-foot">
  <a class="btn ghost" href="{{ \App\Support\Site::page('home', $locale) }}">← Volver al mapa</a>
  <a class="btn primary" href="{{ \App\Support\Site::lessonPath('01-qubit', $locale) }}">▶ Empieza a jugar</a>
</nav>

<p class="muted small" style="text-align:center;margin-top:18px">
  Todo el proyecto es público en
  <a class="dim" href="https://github.com/dade1987/quantum-arcade" target="_blank" rel="noopener">GitHub</a>
  con <a class="dim" href="https://github.com/dade1987/quantum-arcade/blob/main/LICENSE" target="_blank" rel="noopener">licencia libre no comercial</a>:
  estudiarlo, modificarlo y usarlo en la escuela pública se puede siempre; para la formación de pago hace falta un acuerdo.
  Si encuentras un error en estas páginas, <a class="dim" href="https://github.com/dade1987/quantum-arcade/issues" target="_blank" rel="noopener">avísame</a>.
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
