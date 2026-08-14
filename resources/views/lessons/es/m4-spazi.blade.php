@php($description = 'Espacios vectoriales explicados jugando: combinación lineal, base y dimensión tocadas con la mano, por qué en una base ortonormal las coordenadas son las sombras (producto escalar), qué significa de verdad «cambiar de base de medida» y de dónde sale el 2^n que hace imposible simular muchos cúbits.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { baseLab, dimensioneLab } from '/js/widgets/spazi.js';

const L = renderLesson({
  id: 'm4-spazi',
  lead: `La palabra <b>base</b> recorre todo este curso — base de medida, base computacional, cambio de base — y hasta
         ahora la has entendido por intuición. Ahora se convierte en algo que se toca, y con ella llega la palabra
         <b>dimensión</b>: el número del que sale el famoso <b>2<sup>n</sup></b>, es decir, el motivo por el que un
         ordenador normal no puede simular cincuenta cúbits. Son solo dos conceptos, y se ven los dos moviendo dos
         deslizadores.`,

  steps: [
    {
      t: 'Qué es un espacio vectorial (sin axiomas)',
      html: `<p>Definición honesta, en una línea: un <b>espacio vectorial</b> es un sitio lleno de objetos con los que
             solo sabes hacer dos cosas — <b>sumarlos entre sí</b> y <b>alargarlos o acortarlos</b> multiplicándolos
             por un número. Nada más.</p>
             <p>Parece poco, y en cambio la misma estructura aparece en sitios que no se parecen en nada:</p>
             <table class="table">
               <tr><th>Los objetos</th><th>Sumar significa</th><th>Alargar significa</th></tr>
               <tr><td>flechas en el plano</td><td>punta con cola</td><td>estirarlas más</td></tr>
               <tr><td>listas de números</td><td>sumarlas casilla a casilla</td><td>multiplicarlas todas por k</td></tr>
               <tr><td>ondas y sonidos</td><td>superponerlos</td><td>subir el volumen</td></tr>
               <tr><td><b>estados cuánticos</b></td><td><b>la superposición</b></td><td>cambiar la amplitud</td></tr>
             </table>
             <div class="callout key">Esa última fila es el motivo por el que existe este nivel. La <b>superposición
             cuántica</b> no es un fenómeno exótico que haya que aceptar: es la <b>suma</b> de un espacio vectorial.
             Cuando escribes α|0⟩ + β|1⟩ estás haciendo exactamente lo que haces al sumar dos flechas — y todas las
             reglas que vas a ver valen allí igual.</div>
             <p>El nombre técnico de «alarga y suma» es <b>combinación lineal</b>. En el juego haces una a mano.</p>`,
    },

    {
      t: 'Dos flechas que bastan para todo el plano',
      html: `<p>Te doy dos flechas y dos deslizadores. Puedes alargar o acortar cada una lo que quieras, incluso al
             revés, y luego sumarlas. Pregunta: <b>¿hasta dónde llegas?</b></p>
             <p>Prueba con la primera base, luego prueba a cambiarla. Y sobre todo prueba la última, la llamada «dos
             en línea»: está para enseñar algo que con palabras no se entiende.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'base', title: 'Tres objetivos', text: 'alcanza 3 objetivos distintos.', xp: 45 });
        el.appendChild(m.root);
        baseLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>El resultado es claro y tiene dos caras:</p>
              <ul>
                <li>con dos flechas <b>no alineadas</b> llegas a <b>cualquier</b> punto del plano. No «casi todos»:
                    todos, y de una sola manera. Dos flechas así se llaman <b>base</b>, y los dos números de los
                    deslizadores son las <b>coordenadas</b> del punto en esa base;</li>
                <li>con dos flechas <b>alineadas</b> no llegas nunca, por mucho que insistas: cualquier combinación
                    se queda en la misma recta. Medio plano es inalcanzable.</li>
              </ul>
              <div class="callout warn"><b>Ese muro era intencionado</b>, y el juego te lo dice en vez de dejarte dar
              vueltas. Es la forma más rápida de entender qué significa <b>independientes</b>: dos flechas son
              independientes cuando la segunda <b>añade una dirección nueva</b> en vez de repetir la primera.</div>
              <p class="mb0">Y fíjate en algo que se ve al cambiar de base: <b>el mismo punto tiene coordenadas
              distintas en bases distintas</b>. El punto no se mueve — cambia la manera de nombrarlo. Guárdalo:
              dentro de dos pasos se convierte en el corazón de la medida cuántica.</p>`,
    },

    {
      t: 'Cuántas hacen falta: la dimensión',
      html: `<p>Ahora la pregunta que da el número. No «qué flechas», sino <b>cuántas</b>.</p>
             <p>En el juego tienes una colección de flechas y las enciendes o apagas. El objetivo es cubrir todo el
             plano usando el <b>mínimo</b> número posible.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'dimensione', title: 'El mínimo que basta', text: 'encuentra el conjunto mínimo que cubre el plano, en 3 colecciones.', xp: 50 });
        el.appendChild(m.root);
        dimensioneLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Elijas las flechas como las elijas, la cuenta acaba siempre igual: <b>hacen falta exactamente
              dos</b>. Una no basta (solo cubres una recta), tres son demasiadas (una se puede escribir con las
              otras).</p>
              <div class="callout key">Ese número se llama <b>dimensión</b>, y lo notable es que <b>no depende de la
              base</b>: puedes elegir los ejes, una base girada, una torcida — las coordenadas cambian todas, el
              número de flechas necesarias no. Es una propiedad del <b>espacio</b>, no de tu elección.</div>
              <p>Hay una colección, sin embargo, que no llega: aquella en la que todas las flechas están sobre la
              misma recta. Allí la dimensión del espacio que cubres es <b>1</b>, y ninguna elección te salva. No es
              un fallo del juego: es la diferencia entre «tengo muchas flechas» y «tengo muchas
              <b>direcciones</b>».</p>`,
    },

    {
      t: 'Base ortonormal: cuando las coordenadas son las sombras',
      html: `<p>Entre todas las bases posibles hay una familia mucho más cómoda que las demás: las hechas de flechas
             de <b>longitud 1</b> y <b>perpendiculares</b> entre sí. Se llaman <b>ortonormales</b>, y la comodidad es
             esta:</p>
             <div class="callout key">En una base ortonormal, para encontrar las coordenadas de un punto <b>no tienes
             que resolver nada</b>: basta hacer el <b>producto escalar</b> con cada flecha de la base. Es decir —
             nivel 0·9 — basta <b>proyectar la sombra</b>.</div>
             <p>En una base torcida el atajo no vale y la cuenta es más larga: por eso en mecánica cuántica las bases
             son <b>siempre</b> ortonormales.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'El punto de partida', html: 'Un estado de cúbit es <b>α|0⟩ + β|1⟩</b>. Míralo por lo que es: una <b>combinación lineal</b> de dos flechas de base, con coeficientes α y β.' },
          { h: 'La base computacional', html: '|0⟩ y |1⟩ son dos flechas <b>perpendiculares y de longitud 1</b>: una base ortonormal. Así que α y β son simplemente las dos <b>sombras</b> del estado sobre esas direcciones.' },
          { h: 'La regla de Born', html: 'La probabilidad de leer 0 es <b>α²</b>, la sombra al cuadrado. Y como en una base ortonormal vale Pitágoras, α² + β² es la longitud al cuadrado del estado, que es 1: <b>las probabilidades suman 100%</b> por construcción.' },
          { h: 'La otra base', html: 'Las flechas |+⟩ y |−⟩ (la suma y la diferencia de |0⟩ y |1⟩, normalizadas) son <b>otra base ortonormal del mismo espacio</b>: girada 45°. El estado no cambia; cambian los dos números con los que lo describes.' },
          { h: 'Qué es medir', html: 'Medir significa <b>elegir una base</b> y preguntarle al estado: «¿en cuál de tus direcciones de base te encuentro?». Las probabilidades son las sombras al cuadrado <i>en esa base</i>.' },
          { h: 'Por qué lo mismo da respuestas distintas', html: 'El estado |+⟩ medido en la base de |+⟩ y |−⟩ da <b>siempre</b> «más», con certeza. El mismo estado medido en la base de |0⟩ y |1⟩ da 50 y 50. No ha cambiado el estado: ha cambiado la <b>pregunta</b>. Y ahí está todo el famoso «depende de cómo midas».' },
        ], { doneLabel: '¡Claro!' });
      },
      after: `<div class="callout ok"><b>Resumen en una línea:</b> el estado es un punto, la base es el sistema de
              coordenadas, medir es pedir las coordenadas. Cambiar de base no mueve el punto — cambia la
              pregunta.</div>`,
    },

    {
      t: 'El dos elevado a n, y por qué da miedo',
      html: `<p>Ahora la cuenta que lo decide todo. ¿Cómo de grande es el espacio en el que vive un registro
             cuántico?</p>
             <p>Un cúbit tiene dos direcciones de base, |0⟩ y |1⟩: <b>dimensión 2</b>. Dos cúbits tienen como base
             |00⟩, |01⟩, |10⟩, |11⟩: <b>dimensión 4</b>. Tres cúbits: ocho. Cada cúbit de más <b>duplica</b>:</p>
             <div class="formula">n cúbits → dimensión <span class="hl-n">2<sup>n</sup></span> &nbsp;&nbsp;(no 2n)</div>
             <p>Esa distinción, que parece un detalle de escritura, es todo el campo. Con n bits clásicos necesitas
             <b>n</b> números para decir cómo está el registro. Con n cúbits hacen falta <b>2<sup>n</sup></b> — uno
             por amplitud — porque el estado es una combinación lineal de todas las configuraciones a la vez.</p>
             <table class="table">
               <tr><th>Cúbits</th><th>Números que guardar</th><th>Memoria (a 16 bytes cada uno)</th></tr>
               <tr><td class="mono">10</td><td class="mono">1.024</td><td>16 KB</td></tr>
               <tr><td class="mono">30</td><td class="mono">1.073.741.824</td><td>~17 GB</td></tr>
               <tr><td class="mono">50</td><td class="mono">~10¹⁵</td><td>~18.000 TB</td></tr>
               <tr><td class="mono">300</td><td class="mono">~10⁹⁰</td><td>más que los átomos del universo observable</td></tr>
             </table>
             <div class="callout key">Por eso el simulador de este curso llega a unos pocos cúbits y no a trescientos:
             no es pereza del código, es la <b>dimensión del espacio</b>. Y por eso también un ordenador cuántico es
             interesante — no «porque va rápido», sino porque es un objeto físico que <b>habita</b> ese espacio sin
             tener que escribirlo.</div>
             <p class="mb0">Y ojo con el malentendido más extendido: tener 2<sup>n</sup> amplitudes <b>no</b> significa
             poder leer 2<sup>n</sup> respuestas. La medida devuelve <b>una sola</b>. Todo el oficio de los algoritmos
             cuánticos consiste en hacer interferir esas amplitudes para que la respuesta correcta sea la que sale —
             que es exactamente lo que viste hacer a las raíces de la unidad en los niveles 15·b y M·3.</p>`,
    },

    {
      t: 'De dónde viene: un profesor de instituto y un diccionario de sánscrito',
      html: `<p>La idea de estudiar «cosas que se suman y se alargan» en abstracto — sin decir si son flechas, números
             o funciones — es sorprendentemente reciente, y nace de un libro que <b>casi nadie leyó</b>.</p>
             <p>En <b>1844</b> <b>Hermann Grassmann</b>, profesor de instituto en Stettin, publica la <i>Lineale
             Ausdehnungslehre</i> — «teoría de la extensión lineal» — en la que construye, con unos ochenta años de
             adelanto, buena parte del álgebra lineal moderna: dependencia, independencia, dimensión, subespacios. El
             libro está escrito de forma tan abstracta y oscura que es <b>ignorado</b>. Grassmann no es profesor
             universitario, no tiene una cátedra desde la que hacerse oír, y los matemáticos de la época lo
             encuentran ilegible.</p>
             <div class="callout key"><b>La curiosidad:</b> decepcionado, Grassmann <b>abandona las matemáticas</b> y
             se pone a estudiar sánscrito. Publica una traducción del <i>Rigveda</i> y un <b>diccionario</b> que se
             convierte en obra de referencia — tanto que recibe un doctorado honoris causa <b>por lingüística</b>, no
             por matemáticas. Su diccionario del Rigveda se sigue usando hoy. Murió sin saber que su libro
             «ilegible» estaba a punto de convertirse en el idioma de la física del siglo XX.</div>
             <p>Entre los primeros en darle la razón hay un italiano: en <b>1888</b> <b>Giuseppe Peano</b> publica el
             <i>Calcolo geometrico secondo l'Ausdehnungslehre di H. Grassmann</i> y mete dentro, casi de tapadillo, la
             <b>primera definición axiomática moderna de espacio vectorial</b>: la lista de reglas que todavía hoy
             está en los manuales. También esa pasa bastante desapercibida durante décadas.</p>
             <p>El salto a lo cuántico llega con <b>David Hilbert</b> y sobre todo con <b>John von Neumann</b>, que en
             <b>1932</b> reescribe toda la mecánica cuántica como geometría en un espacio vectorial con producto
             escalar — lo que hoy se llama <b>espacio de Hilbert</b>. De ahí en adelante «estado» significa
             <b>vector</b>, «observable» significa <b>operador</b> y «medida» significa <b>proyección sobre una
             base</b>: es decir, exactamente las tres cosas de este nivel.</p>
             <div class="callout ok"><b>Vale la pena señalarlo:</b> Grassmann intentaba ordenar la geometría, no
             describir átomos. Ochenta años después, su lenguaje resultó ser el único apropiado para hacerlo. Es la
             misma historia de los números complejos del nivel M·3 — y pasa tan a menudo que tiene nombre: «la
             irrazonable eficacia de las matemáticas».</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego elige la base «girada 45°» y alcanza el objetivo (2 ; 1). ¿Qué números
           necesitas? Luego haz lo mismo con la base «los ejes». <span class="muted">(mismo punto, números distintos:
           en eso consiste el cambio de base)</span></p>
        <p><b>2.</b> Sigue en el primer juego, con la base «dos en línea», e intenta alcanzar cualquier objetivo. Al
           cabo de un rato para: ¿<b>qué</b> propiedad les falta a esas dos flechas?</p>
        <p><b>3.</b> En el segundo juego, la colección 3 tiene cuatro flechas. ¿Cuántos pares distintos forman una
           base? <span class="muted">(no todos: la 1 y la 2 están alineadas entre sí)</span></p>
        <p><b>4.</b> Si un cúbit tiene dimensión 2 y dos cúbits dimensión 4, ¿cuántos números hacen falta para
           <b>ocho</b> cúbits? ¿Y para <b>veinte</b>? <span class="muted">(256 y poco más de un millón)</span></p>
        <p class="mb0"><b>5.</b> De inventor: las flechas del plano tienen dimensión 2. Las funciones — que también se
           suman y se alargan — ¿qué dimensión tienen? <span class="muted">(pista: ¿cuántas hacen falta para
           construir todas las demás? ¿y qué pinta la transformada de Fourier, que escribe cualquier onda como suma
           de senos y cosenos?)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué es, en esencia, un espacio vectorial?', options: ['un conjunto de flechas', 'un sitio lleno de objetos que se pueden sumar entre sí y alargar multiplicándolos por un número', 'un sistema de coordenadas', 'el espacio de tres dimensiones'], correct: 1,
      why: 'Solo hacen falta esas dos operaciones. Por eso la misma estructura vale para flechas, listas de números, ondas y estados cuánticos — y la superposición cuántica es simplemente la suma de un espacio vectorial.' },
    { q: '¿Cuándo dos flechas del plano forman una base?', options: ['cuando son perpendiculares', 'cuando no están sobre la misma recta', 'cuando miden 1', 'cuando apuntan a la derecha'], correct: 1,
      why: 'Basta con que sean independientes, es decir, que la segunda añada una dirección nueva. Perpendiculares y de longitud 1 es una condición más fuerte (ortonormal), cómoda pero no necesaria.' },
    { q: '¿Qué es la dimensión de un espacio?', options: ['el número de flechas de que dispones', 'el número mínimo de flechas necesarias para alcanzarlo todo — y no depende de qué base elijas', 'la longitud de la flecha más larga', 'el número de coordenadas positivas'], correct: 1,
      why: 'Menos no bastan, más son redundantes. El número es una propiedad del espacio: cambiar de base cambia las coordenadas, no cuántas hacen falta.' },
    { q: 'En una base ortonormal, ¿cómo se encuentran las coordenadas de un punto?', options: ['resolviendo un sistema', 'haciendo el producto escalar con cada flecha de la base: son las sombras', 'midiendo los ángulos', 'no se pueden encontrar'], correct: 1,
      why: 'Esa comodidad es lo que hace ortonormales a todas las bases de la mecánica cuántica: las amplitudes son las proyecciones del estado sobre las direcciones de base, y las probabilidades son esas sombras al cuadrado.' },
    { q: '¿Qué significa medir un cúbit en una base distinta?', options: ['cambiar el estado del cúbit', 'hacerle una pregunta distinta: el estado sigue siendo el mismo, cambian las coordenadas con que lo describes', 'cambiar el orden de los cúbits', 'repetir la medida'], correct: 1,
      why: 'El estado es un punto; la base es el sistema de coordenadas. |+⟩ medido en la base de |+⟩ y |−⟩ da siempre lo mismo; medido en la de |0⟩ y |1⟩ da 50 y 50. El punto no se ha movido.' },
    { q: '¿Cuál es la dimensión del espacio de estados de n cúbits?', options: ['2n', 'n²', '2^n', 'n'], correct: 2,
      why: 'Cada cúbit de más duplica el número de amplitudes que hay que guardar. Con 50 cúbits son unos 10¹⁵ números: por eso simular un ordenador cuántico en uno normal se vuelve imposible.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Base = pocas flechas que bastan para todo; dimensión = cuántas hacen
          falta, y no depende de qué base elijas; base ortonormal = coordenadas que son sombras, es decir productos
          escalares. Con esas tres piezas «cambiar de base de medida» deja de ser una fórmula y se vuelve una frase
          normal — y el 2<sup>n</sup> deja de ser una amenaza y se vuelve una cuenta que sabes rehacer.</div>`,
});
@endsection
