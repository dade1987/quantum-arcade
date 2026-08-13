@php($description = 'El primer algoritmo que gana demostrablemente al clásico: oráculos de fase, phase kickback y el esquema de cuatro tiempos que hay detrás de todo algoritmo cuántico.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { deutschLab } from '/js/widgets/algos.js';

const L = renderLesson({
  id: '09-deutsch',
  lead: `Primer algoritmo de verdad. Un problema de juguete, pero el primer caso histórico (Deutsch 1985, luego Deutsch–Jozsa 1992)
         en el que un ordenador cuántico gana <b>demostrablemente</b> al clásico. Y el esquema que verás aquí
         es el <b>mismo</b> de todos los algoritmos posteriores.`,

  steps: [
    {
      t: 'Qué es un oráculo',
      html: `<p>Un <b>oráculo</b> es una caja negra que sabe calcular una función <b>f</b> pero no te dice cómo.
             Tú solo puedes consultarla: le das una entrada, te da la salida. El coste del algoritmo se mide en
             <b>número de consultas</b>.</p>
             <p>¿Por qué trabajar con cajas negras? Porque así se puede <b>demostrar</b> que un método es mejor que otro,
             sin discutir lo listo que sea quien programa. Es el banco de pruebas estándar de la teoría de la complejidad.</p>
             <div class="callout key"><b>El oráculo cuántico (versión "de fase")</b> hace una sola cosa:
             <code>|x⟩ → (−1)^f(x) |x⟩</code><br>
             Es decir: <b>pone un signo menos</b> delante de los estados en los que f vale 1, y deja en paz a los demás.
             No cambia ninguna probabilidad (¡el cuadrado de −1 es 1!): escribe la información <b>solo en las fases</b>.</div>
             <p class="dim small">Curiosidad técnica: en la práctica el oráculo se realiza con un cúbit auxiliar puesto en
             |−⟩ = (|0⟩ − |1⟩)/√2. Cuando la CNOT controlada por f da la vuelta a ese cúbit, el efecto es un signo menos que
             "rebota" sobre el registro principal. El fenómeno se llama <b>phase kickback</b> y es el truco
             más reutilizado de toda la disciplina.</p>`,
    },
    {
      t: 'El problema',
      html: `<p>Te dan una función f que, para cada una de las N entradas, responde 0 o 1. Te garantizan que es
             <b>una de estas dos</b>:</p>
             <ul>
               <li><b>constante</b>: responde siempre lo mismo (siempre 0 o siempre 1);</li>
               <li><b>equilibrada</b>: responde 0 para exactamente la mitad de las entradas y 1 para la otra mitad.</li>
             </ul>
             <p><b>Pregunta:</b> ¿cuál de las dos?</p>
             <p><b>¿Cuánto cuesta clásicamente?</b> En el peor caso tienes que mirar <b>la mitad más una</b> de las entradas:
             si las primeras N/2 dan todas 0, podrías estar ante una constante… o ante una equilibrada que se está riendo de ti.
             Con N = 8 hacen falta 5 preguntas, con N = 1.000.000 hacen falta 500.001.</p>
             <p><b>Cuánticamente: UNA.</b> Siempre. Pruébalo — primero con el botón lento y luego con el cuántico.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'dj', title: 'Una sola pregunta', text: 'resuelve el problema con la consulta cuántica y acierta.', xp: 55 });
        el.appendChild(m.root);
        deutschLab(el, { n: 3, onWin: () => m.complete() });
      },
    },
    {
      t: 'Por qué funciona (la cuenta, sin saltos)',
      html: `<p>Tres movimientos: <b>H en todos → oráculo → H en todos</b>. Esto es lo que pasa en cada uno.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Movimiento 1 — H en todos los cúbits', html: 'De |000⟩ se pasa a una superposición con <b>las 8 posibilidades</b>, todas con la misma amplitud +1/√8.<br>En pantalla: ocho barras idénticas.' },
          { h: 'Movimiento 2 — el oráculo', html: 'Pone un <b>menos</b> sobre las posibilidades en las que f = 1. Las alturas de las barras no cambian (¡las probabilidades son idénticas!), solo cambian los <b>signos</b>. Si midieras ahora, no aprenderías nada: todas las salidas serían equiprobables.' },
          { h: 'Caso constante', html: 'Si f es constante, <b>todos</b> los signos son iguales (todos + o todos −). El estado es, salvo el signo global, idéntico al de antes.' },
          { h: 'Caso equilibrado', html: 'Si f es equilibrada, <b>la mitad</b> de los signos son + y la mitad −. El estado es profundamente distinto: es "de tablero de ajedrez".' },
          { h: 'Movimiento 3 — otra vez H en todos', html: 'La H "cuenta" las coincidencias entre los signos.<br>• Todos iguales → todas las amplitudes convergen en |000⟩: probabilidad <b>100%</b> de medir todo ceros.<br>• Mitad y mitad → las amplitudes sobre |000⟩ se <b>cancelan exactamente</b>: probabilidad <b>0%</b> de medir todo ceros.' },
          { h: 'La lectura del resultado', html: 'Mides una vez:<br>• sale <b>000…0</b> → la función era <b>constante</b>;<br>• sale <b>cualquier otra cosa</b> → era <b>equilibrada</b>.<br>Ninguna probabilidad de fallar: el resultado es <b>determinista</b>.' },
          { h: 'El esquema general', html: '<b>H (pon todo en juego) → oráculo (escribe en las fases) → H (haz interferir) → mide.</b><br>Todo algoritmo cuántico que verás — Bernstein–Vazirani, Grover, Simon, Shor — es una variación sobre esos cuatro tiempos. En el taller final será tu paleta.' },
        ], { doneLabel: '¡He entendido el mecanismo!' });
      },
    },
    {
      t: '¿Cuánto vale de verdad este resultado?',
      html: `<div class="callout warn"><b>Honestidad intelectual.</b> Deutsch–Jozsa es una victoria <b>enorme</b> sobre el papel
             (¡1 contra 500.001!) pero sobre un problema <b>inventado a propósito</b> y sin aplicaciones prácticas.
             Además, un algoritmo clásico <b>probabilístico</b> se apaña con poquísimas preguntas: bastan una decena
             de entradas al azar para estar casi seguro de la respuesta.<br><br>
             El valor de verdad es otro: es la <b>primera demostración limpia</b> de que la interferencia es un recurso de cálculo,
             y es el modelo sobre el que se construyen algoritmos que sí importan (Simon → Shor).</div>
             <p>Históricamente fue así: Deutsch (1985) resuelve el caso de un solo bit; Deutsch y Jozsa (1992) lo extienden
             a n bits; Bernstein y Vazirani (1993) encuentran un problema parecido pero con ventaja incluso sobre los métodos probabilísticos;
             Simon (1994) encuentra la primera ventaja <b>exponencial</b> neta — y leyendo el trabajo de Simon,
             Peter Shor tiene la idea que lleva a la factorización. Una cadena de seis años, y estamos en el nivel 20.</p>`,
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el juego, genera funciones hasta encontrar una constante: ¿cuántas preguntas clásicas has tenido que hacer
           antes de estar <b>seguro</b>?</p>
        <p><b>2.</b> ¿Qué pasaría si la función no fuera ni constante ni equilibrada (por ejemplo 3 ceros y 5 unos)?
           ¿Seguiría siendo fiable el resultado? <span class="muted">(no — el algoritmo se fía de la promesa)</span></p>
        <p><b>3.</b> ¿Por qué medir <b>solo</b> el estado |000…0⟩ basta para decidir? ¿Qué representa esa barra?</p>
        <p class="mb0"><b>4.</b> Como inventor: ¿sabrías construir un oráculo que, en vez de decir "constante o equilibrada",
           revele algo más útil? <i>(El nivel siguiente hace exactamente eso.)</i></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué hace un oráculo de fase?',
      options: ['calcula f y la imprime', 'pone un signo menos sobre los estados en los que f vale 1', 'mide el registro', 'crea entrelazamiento'], correct: 1,
      why: 'Escribe la información en las fases sin cambiar ninguna probabilidad: por sí solo es invisible, pero prepara el terreno para la interferencia final.' },
    { q: '¿Cuántas consultas necesita Deutsch–Jozsa?',
      options: ['1', 'N/2', 'log N', 'N'], correct: 0,
      why: 'Una sola, con respuesta segura. Clásicamente, en el peor caso, hacen falta N/2 + 1.' },
    { q: '¿Cómo se lee el resultado final?',
      options: ['se cuentan las medidas', 'si sale todo ceros la función es constante, si no es equilibrada', 'se mira la fase', 'se mide solo el primer cúbit'], correct: 1,
      why: 'Las amplitudes sobre |00…0⟩ se suman si los signos son todos iguales (constante) y se cancelan si son mitad y mitad (equilibrada).' },
    { q: 'El esquema general de un algoritmo cuántico es…',
      options: ['medida → puerta → medida', 'H (superposición) → oráculo (fases) → interferencia → medida', 'entrelazamiento → copia → medida', 'oráculo → oráculo → oráculo'], correct: 1,
      why: 'Cuatro tiempos: pon todo en juego, escribe la información en las fases, haz interferir, lee. Solo cambia el tercer tiempo de un algoritmo a otro.' },
  ],

  outro: `<div class="callout ok"><b>Lo que te llevas a casa:</b> el oráculo escribe en las <b>fases</b>; las Hadamard finales
          convierten los signos en <b>posiciones medibles</b>; una pregunta en vez de medio millón.
          Nivel siguiente: el mismo esquema, pero para robar una contraseña.</div>`,
});
@endsection
