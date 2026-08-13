@php($description = 'Las puertas cuánticas como rotaciones: X, Z, Y, H, S, T y P(θ), por qué tienen que ser unitarias y reversibles, y por qué H·Z·H = X es el esquema de todo algoritmo.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { blochLab } from '/js/widgets/bloch.js';
import { confronto } from '/js/core/confronto.js';
import { porteCoppia } from '/js/widgets/coppie.js';
import { formula, stepper } from '/js/core/formula.js';

const L = renderLesson({
  id: '03-porte',
  lead: `Las "puertas" cuánticas son las operaciones que puedes hacer sobre un cúbit. Buena noticia: son <b>todas rotaciones</b>
         de la flecha en la esfera. Ninguna crea ni destruye información — y eso, como veremos, no es un detalle.`,

  steps: [
    {
      t: 'Primero en clásico: qué hace una puerta lógica',
      html: `<p>En un ordenador normal una <b>puerta</b> coge dos bits y devuelve uno: AND, OR, XOR. Son tablas
             de cuatro filas, y con ellas está construido todo — es más, con la sola <b>NAND</b> está construido
             todo.</p>
             <p>Pero hay un detalle que en lo clásico no molesta a nadie y que aquí se convierte en el punto
             central: una puerta AND <b>tira un bit</b>. De una salida 0 ya no sabes si las entradas eran 00, 01
             o 10. El cálculo sigue perdiendo trozos por el camino, y a nadie le importa.</p>
             <p>Antes de leer el catálogo, pruébalo: aquí abajo hay una aguja que va de |0⟩ a |1⟩ y un objetivo
             a medio camino. Intenta acertarlo con las puertas clásicas — luego pasa a las cuánticas e inténtalo
             otra vez. El muro contra el que chocas en modo clásico <b>es</b> la lección.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'lancetta', title: 'El objetivo a medio camino', text: 'inténtalo con las puertas clásicas (no se puede, y está bien así), luego acértalo con las cuánticas.', xp: 35 });
        el.appendChild(m.root);
        porteCoppia(el, { onWin: () => m.complete() });
      },
      after: `<p>Las puertas cuánticas no se lo pueden permitir. No por elegancia: porque la física no lo
             permite.</p>` +
             confronto({
               titolo: 'Puerta clásica y puerta cuántica',
               livello: 'k2-porte',
               vaiA: 'Juega con AND, OR, XOR y NAND (nivel K·2)',
               classico: {
                 titolo: 'AND, OR, XOR, NAND',
                 html: `<p>Dos bits dentro, <b>uno</b> fuera. Son <b>tablas</b>: se describen enumerando qué sale
                        para cada entrada.</p>
                        <p class="mb0">Casi todas <b>pierden información</b> y no se pueden rehacer hacia atrás.
                        Conjunto universal: {NAND}.</p>`,
               },
               quantistico: {
                 titolo: 'X, Z, H, rotaciones',
                 html: `<p>n cúbits dentro, <b>n</b> fuera. Son <b>rotaciones</b>: se describen diciendo cuánto
                        giran el estado, y de hecho se ven moverse sobre la esfera.</p>
                        <p class="mb0">Todas <b>reversibles</b>, siempre. Conjunto universal: {H, T, CNOT}.</p>`,
               },
               numeri: [
                 { cosa: 'bits/cúbits de entrada → salida', classico: '2 → 1', quantistico: 'n → n' },
                 { cosa: '¿se vuelve atrás?', classico: 'no (salvo NOT)', quantistico: 'siempre' },
                 { cosa: 'aplicándola dos veces', classico: 'en general no vuelve nada', quantistico: 'X, Z y H vuelven al punto de partida' },
               ],
               verdetto: `<b>Que H aplicada dos veces devuelva exactamente al estado inicial</b> — cosa que con
                          una moneda mezclada dos veces no pasa nunca — es el primer experimento en el que la
                          diferencia se toca con la mano. Tenlo a la vista en los pasos que siguen.`,
             }),
    },
    {
      t: 'El catálogo, en palabras llanas',
      html: `<table class="table">
               <tr><th>Puerta</th><th>Qué le hace al estado</th><th>En la esfera</th><th>Para qué sirve</th></tr>
               <tr><td class="mono"><b>X</b></td><td>intercambia |0⟩ y |1⟩</td><td>da la vuelta norte↔sur (rotación de 180° en torno a X)</td><td>es el NOT clásico</td></tr>
               <tr><td class="mono"><b>Z</b></td><td>deja |0⟩, pone − en |1⟩</td><td>gira 180° por el ecuador</td><td>marca una posibilidad sin cambiar su probabilidad</td></tr>
               <tr><td class="mono"><b>Y</b></td><td>X y Z juntas (con una i)</td><td>rotación de 180° en torno a Y</td><td>menos usada a mano, comodísima en teoría</td></tr>
               <tr><td class="mono"><b>H</b></td><td>crea/deshace la superposición</td><td>lleva el polo al ecuador y viceversa</td><td><b>la puerta más importante de todas</b></td></tr>
               <tr><td class="mono"><b>S</b></td><td>fase +90° en |1⟩</td><td>cuarto de vuelta por el ecuador</td><td>control fino de la fase</td></tr>
               <tr><td class="mono"><b>T</b></td><td>fase +45° en |1⟩</td><td>octavo de vuelta</td><td>hace falta para la universalidad (ver abajo)</td></tr>
               <tr><td class="mono"><b>P(θ)</b></td><td>fase θ en |1⟩</td><td>rotación de θ por el ecuador</td><td>¡es el ladrillo de la <b>QFT</b>!</td></tr>
             </table>
             <p>Pruébalas todas: mira dónde acaba la flecha y lee el estado que aparece debajo.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'porte', title: 'La vuelta de las puertas', text: 'partiendo de |0⟩, ¿consigues llevar el cúbit exactamente a |1⟩ usando SOLO H, Z y H? (luego mira las probabilidades)', xp: 40 });
        el.appendChild(m.root);
        blochLab(el, {
          onChange: (s, hist) => {
            const last3 = hist.slice(-3).join(',');
            if (last3 === 'H,Z,H' && (s.re[1] ** 2 + s.im[1] ** 2) > 0.99) m.complete();
          },
        });
      },
      after: `<div class="callout key"><b>El descubrimiento más bonito de este nivel:</b> <code>H · Z · H = X</code>.
              Es decir: una rotación de <b>fase</b> (¡que por sí sola no cambia ninguna probabilidad!), metida entre dos Hadamard,
              se convierte en un <b>NOT completo</b>. Es el mecanismo que hay detrás de <b>todos</b> los algoritmos cuánticos:
              escribes la información en las fases y luego usas H para convertirla en algo <b>medible</b>.</div>`,
    },
    {
      t: 'Las puertas como matrices (fácil, prometido)',
      html: `<p>Una puerta es una tablita 2×2 que dice: "el nuevo |0⟩ se obtiene así, el nuevo |1⟩ así".
             Aplicarla significa hacer dos multiplicaciones y dos sumas. Nada más.</p>
             <pre><code>estado:  [ a ]        puerta X: [ 0  1 ]       resultado: [ b ]
         [ b ]                  [ 1  0 ]                  [ a ]     ← ¡intercambiados!

puerta Z:[ 1   0 ]   →  [ a ]        puerta H: (1/√2)[ 1   1 ] →  (1/√2)[ a+b ]
         [ 0  −1 ]      [−b ]                         [ 1  −1 ]          [ a−b ]</code></pre>
             <p>Mira la última: <b>a+b</b> y <b>a−b</b>. Por eso H es la puerta de la interferencia: <b>suma</b> y
             <b>resta</b> las dos amplitudes. Si a y b son iguales, a−b da <b>cero</b>: una posibilidad desaparece.</p>`,
      mount: el => {
        formula(el, {
          title: 'Por qué las puertas tienen que ser "unitarias"',
          hint: 'Toca las piezas: hay una razón profunda por la que no toda tablita 2×2 es una puerta válida.',
          parts: [
            { t: 'U', id: 'U', color: 'cyan', name: 'la puerta', say: 'La tablita que describe la operación. Tiene que conservar la longitud total del vector de estado.' },
            { t: '† ', id: 'dag', color: 'violet', name: 'la "traspuesta conjugada"', say: 'Se lee "U daga". Es la puerta reflejada y con las fases invertidas: en la práctica, la puerta que DESHACE U.' },
            { t: 'U = I', id: 'I', color: 'green', name: 'identidad', say: 'Aplicar U y luego U† tiene que devolverlo todo como estaba. Eso garantiza dos cosas fundamentales: las probabilidades siguen sumando 1, y toda operación es REVERSIBLE.', ex: 'H·H = I, X·X = I, S·S† = I. Pruébalo en el juego: aplica dos veces la misma puerta y vuelves al punto de partida.' },
          ],
        });
      },
      after: `<div class="callout warn"><b>Consecuencia enorme:</b> en el cálculo cuántico <b>no existe el "borrar"</b>.
              La puerta AND clásica toma dos bits y devuelve uno: tira información, y no se puede volver atrás.
              Una puerta cuántica, en cambio, es siempre <b>reversible</b>. Es el mismo principio de los
              <b>ordenadores reversibles</b> estudiados por Fredkin y Toffoli en los años 80: computar sin destruir
              información (y, en teoría, sin disipar energía).</div>`,
    },
    {
      t: '¿Cuántas puertas hacen falta para hacerlo todo?',
      html: `<p>En lo clásico bastan unas pocas puertas (por ejemplo NAND) para construir cualquier circuito: se dice que son
             un conjunto <b>universal</b>. En lo cuántico vale algo parecido:</p>
             <div class="callout key"><b>{ H, T, CNOT }</b> es un conjunto universal: con estas tres puertas se puede aproximar
             <b>cualquier</b> operación cuántica con la precisión que se quiera.</div>
             <p>¿Por qué justo T (45°) y no solo S (90°)? Porque con ángulos "cómodos" (múltiplos de 90°) se obtiene solo un
             conjunto limitado de estados, que un ordenador clásico puede simular deprisa (teorema de Gottesman–Knill).
             La T "rompe la rejilla" y es lo que hace que el cálculo cuántico sea difícil de imitar clásicamente.
             En los ordenadores reales la T es además la puerta <b>más cara</b> de realizar con corrección de errores:
             quienes diseñan cuentan literalmente cuántas T hacen falta ("T-count").</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Comprobación 1', html: 'En el juego: aplica <b>X</b> dos veces partiendo de |0⟩. ¿Dónde acabas? <br><b>|0⟩.</b> X·X = identidad.' },
          { h: 'Comprobación 2', html: 'Aplica <b>S</b> cuatro veces. Cada S gira 90°, así que 4×90° = 360°: vuelves al punto de partida. <b>S⁴ = I.</b>' },
          { h: 'Comprobación 3', html: 'Aplica <b>T</b> ocho veces: 8×45° = 360°. <b>T⁸ = I.</b> Y dos T hacen una S (45+45 = 90).' },
          { h: 'Comprobación 4 (la importante)', html: 'Aplica <b>H</b>, luego <b>Z</b>, luego <b>H</b> partiendo de |0⟩: acabas en <b>|1⟩</b>. Una puerta de pura fase se ha convertido en un NOT: <b>H·Z·H = X</b>.' },
          { h: 'La moraleja', html: 'Las puertas de fase por sí solas "no hacen nada visible". Pero <b>en medio</b> de dos Hadamard se convierten en operaciones concretas. Todo algoritmo que verás está construido sobre ese sándwich: <b>H → algo en las fases → H</b>.' },
        ], { doneLabel: '¡Comprobado!' });
      },
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> Encuentra dos secuencias <b>distintas</b> de puertas que lleven |0⟩ al mismísimo estado.
           <span class="muted">(ejemplo: H·H·H = H)</span></p>
        <p><b>2.</b> ¿Cuántas T seguidas hacen falta para obtener una Z? ¿Y para volver a la identidad?</p>
        <p><b>3.</b> Usando solo H y P(θ), ¿consigues alcanzar <b>cualquier</b> punto de la esfera? Prueba a llevar la flecha
           a un punto "al azar" elegido por ti.</p>
        <p class="mb0"><b>4.</b> Pregunta de inventor (te la reencontrarás en el nivel 22, el taller): si un algoritmo tiene que hacer
           <b>desaparecer</b> las respuestas incorrectas, ¿qué puerta usarías para marcarlas y cuál para hacerlas interferir?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Cuánto da H·Z·H?',
      options: ['Z', 'X', 'la identidad', 'una medida'], correct: 1,
      why: 'Una rotación de fase metida entre dos Hadamard se convierte en un NOT completo. Es el modelo de todo algoritmo cuántico: fase → interferencia → resultado medible.' },
    { q: '¿Por qué todas las puertas cuánticas son reversibles?',
      options: ['por comodidad de cálculo', 'porque tienen que conservar la probabilidad total (son unitarias)', 'porque son lentas', 'no es cierto: la medida es una puerta'], correct: 1,
      why: 'Unitariedad: U†U = I. Conserva la suma de las probabilidades y hace invertible toda operación. La <b>medida</b>, de hecho, no es una puerta: es la única operación irreversible.' },
    { q: 'Un conjunto universal de puertas cuánticas es…',
      options: ['{X, Z}', '{H, T, CNOT}', '{medida, H}', '{S, Z}'], correct: 1,
      why: 'Con Hadamard, T y CNOT se aproxima cualquier operación. Con solo puertas "a 90°" te quedas en el grupo de Clifford, simulable de forma eficiente clásicamente.' },
    { q: 'La puerta P(θ) aplicada a un cúbit en el ecuador…',
      options: ['cambia las probabilidades de medida', 'rota la fase sin cambiar las probabilidades', 'mide el cúbit', 'crea entrelazamiento'], correct: 1,
      why: 'Mueve la longitud, no la latitud. Pero esa fase decidirá qué se suma y qué se cancela en la Hadamard siguiente — y es justamente el ladrillo de la QFT.' },
  ],

  outro: `<div class="callout ok"><b>Lo que te llevas a casa:</b> toda puerta es una rotación; H crea y deshace superposiciones;
          las puertas de fase mueven la longitud; todo es reversible menos la medida; <b>H·Z·H = X</b> es el esquema
          de todo algoritmo. Ahora añadimos el segundo cúbit — y llega el entrelazamiento.</div>`,
});
@endsection
