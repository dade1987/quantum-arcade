@php($description = 'Autovectores y autovalores aprendidos jugando: las flechas que una transformación no gira, y por qué sobre esas flechas una puerta cuántica solo cambia la fase. El nivel que hace legible la estimación de fase.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { eigenHunt, phaseHunt } from '/js/widgets/autovettori.js';

const L = renderLesson({
  id: '18b-autovettori',
  lead: `El nivel siguiente se llama <b>estimación de fase</b> y empieza así: «dado un estado que la operación deja igual
         salvo por una fase, mide esa fase». Es una frase que se puede leer dos veces sin entender nada, a menos que
         sepas qué es ese estado. Se llama <b>autovector</b>, en veinte minutos se encuentra con las manos, y a partir de
         ahí la estimación de fase deja de ser magia y pasa a ser una receta evidente.`,

  steps: [
    {
      t: 'Las flechas que la máquina no gira',
      html: `<p>Recupera la máquina de las matrices: toma una flecha y devuelve otra. Casi siempre la flecha que sale
             <b>apunta a otro sitio</b> que la que entra.</p>
             <p>Pero no siempre. Para ciertas direcciones — pocas, especiales — la flecha que sale está <b>en la misma
             recta</b> que la que entra: quizá más larga, quizá más corta, quizá dada la vuelta, pero <b>en línea</b>.</p>
             <div class="callout key">Una flecha así se llama <b>autovector</b> de la máquina. El número por el que queda
             multiplicada se llama <b>autovalor</b>. Son solo dos nombres largos para algo que ahora ves.</div>
             <p>En el juego: arrastra la flecha azul y mira la naranja, que es su transformada. Cuando las dos están en
             línea el juego lo dice, y también te dice cuánto se ha estirado la flecha.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'caccia', title: 'A la caza de direcciones quietas', text: 'encuentra 3 direcciones que se queden en línea, en máquinas distintas.', xp: 45 });
        el.appendChild(m.root);
        eigenHunt(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Tres cosas que el juego hace descubrir, y que valen para cualquier máquina:</p>
              <ul>
                <li>el <b>estiramiento</b> tiene dos direcciones quietas (los ejes), con autovalores 2 y 0,5;</li>
                <li>la <b>puerta H</b> tiene dos, con autovalores <b>+1 y −1</b>: no alarga nada, solo voltea;</li>
                <li>el <b>tobogán</b> tiene una sola. No es un fallo del juego: hay máquinas que son así.</li>
              </ul>
              <div class="callout warn"><b>Y luego está la rotación</b>, que no tiene <b>ninguna</b> dirección quieta:
              lo gira todo, sin excepciones. Si te parece un callejón sin salida, guarda la idea: dentro de dos pasos se
              convierte en la clave de todo.</div>`,
    },

    {
      t: 'Por qué nos importa: las puertas son máquinas',
      html: `<p>Una puerta cuántica es una matriz unitaria, y las matrices unitarias tienen una propiedad cómoda: <b>no
             alargan ni acortan nada</b>. Así que sus autovalores no pueden ser 2 ni 0,5: tienen que ser números de
             longitud 1.</p>
             <p>Solo con números reales los únicos candidatos serían <b>+1</b> y <b>−1</b>. Y en efecto la puerta Z y la
             puerta H tienen justo esos. Pero la rotación acaba de enseñarnos que las transformaciones con autovalores
             reales no bastan.</p>
             <div class="callout key">La salida ya la conoces de la Parte B: los números de longitud 1 no son dos, son
             <b>todo un círculo</b>: son las <b>fases</b> e^{iθ}. Aquí está el punto de llegada:
             <p class="mb0" style="margin-top:8px"><b>Sobre un autovector, una puerta cuántica no cambia el estado: lo
             multiplica por una fase.</b></p></div>
             <p>Que es, palabra por palabra, la frase con la que empieza el nivel siguiente, solo que ahora sabes qué
             significa.</p>`,
    },

    {
      t: 'La fase se mide contando',
      html: `<p>Tomemos una puerta U que, sobre su autovector, gira la fase <b>90°</b> cada vez que la aplicas. Aplícala
             cuatro veces: 90 + 90 + 90 + 90 = 360, es decir, una vuelta entera. Has vuelto a casa.</p>
             <p>La cuenta también se puede hacer al revés, y esa es la parte interesante: <b>si cuento cuántas
             aplicaciones hacen falta para volver a casa, he medido la fase</b>. Cuatro aplicaciones → un cuarto de
             vuelta → 90°.</p>
             <div class="callout key">Fíjate en una cosa mientras juegas: las <b>probabilidades no cambian nunca</b>. La
             fase por sí sola es invisible para una medida. Solo se ve haciéndola <b>interferir</b>, que es exactamente
             el oficio de la transformada de Fourier.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'fase', title: 'Mide dos fases contando', text: 'lleva la flecha a casa y di cuántas aplicaciones hacen falta, para 2 puertas distintas.', xp: 55 });
        el.appendChild(m.root);
        phaseHunt(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Si esta cuenta te ha recordado algo, tienes razón: es el mismo juego del <b>ritmo que vuelve</b> del reloj
              modular (nivel 0·5). Allí contabas pasos para volver al 1, aquí cuentas aplicaciones para volver a casa. Es
              la misma matemática, y no es casualidad que Shor use las dos.</p>`,
    },

    {
      t: 'Del recuento a la estimación de fase',
      html: `<p>Contar a mano tiene un defecto: <b>cuesta una aplicación cada vez</b>. Con una fase pequeña — una milésima
             de vuelta — harían falta mil aplicaciones y mil medidas. El ordenador cuántico hace el mismo trabajo de otra
             manera:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Paso 1', html: 'Se prepara el registro de lectura en <b>superposición</b> de todos los números: 0, 1, 2, 3, … (bastan puertas H, una por cúbit).' },
          { h: 'Paso 2', html: 'Se aplica U <b>una vez</b> controlada por el primer cúbit, <b>dos</b> por el segundo, <b>cuatro</b> por el tercero, y así: duplicando, con pocos cúbits se llega a muchísimas aplicaciones.' },
          { h: 'Paso 3', html: 'Gracias al <b>phase kickback</b>, la fase del autovector acaba escrita en el registro de lectura: cada número x queda multiplicado por la fase repetida x veces. Es un <b>peine de fases</b> que gira siempre al mismo ritmo.' },
          { h: 'Paso 4', html: 'Un peine que gira a ritmo constante es justo lo que la <b>transformada de Fourier</b> sabe leer: la QFT inversa lo convierte en un <b>pico</b> sobre un solo número.' },
          { h: 'Paso 5', html: 'Se mide y sale ese número: es la fase, escrita en binario. El recuento que tú has hecho de una aplicación en una aplicación, la máquina lo hace <b>todo a la vez</b>.' },
          { h: '¿Y Shor?', html: 'Shor es este procedimiento aplicado a la multiplicación modular: la «fase» que hay que leer es 1/r, y r es el periodo del reloj. Por eso aquel nivel y este son el mismo nivel visto desde dos lados.' },
        ], { doneLabel: '¡Claro!' });
      },
      after: `<div class="callout ok">Con esto en la mano, el nivel siguiente se lee como una receta: preparar el
              autovector, aplicar U duplicando, leer con la Fourier inversa. Sin magia y sin ningún paso que haya que dar
              por bueno.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego prueba la <b>puerta H</b>: sus dos direcciones quietas no están sobre los ejes.
           ¿En qué ángulo están, más o menos? <span class="muted">(pista: a medio camino entre el eje horizontal y la
           diagonal)</span></p>
        <p><b>2.</b> ¿Qué significa un autovalor <b>negativo</b>, mirando las dos flechas? ¿Y por qué una puerta cuántica
           puede permitírselo sin romper las probabilidades?</p>
        <p><b>3.</b> En el segundo juego elige 72°: ¿cuántas aplicaciones para volver a casa? ¿Y si la puerta girara 1°?
           ¿Cuántas medidas harían falta para contarlas a mano?</p>
        <p class="mb0"><b>4.</b> Pregunta de inventor: si una puerta deja <b>todas</b> las flechas en línea consigo mismas,
           ¿qué matriz es? <span class="muted">(¿y para qué sirve en un circuito?)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué es un autovector de una transformación?', options: ['la flecha más larga', 'una flecha que la transformación deja en línea consigo misma', 'la primera columna de la matriz', 'una flecha de longitud 1'], correct: 1,
      why: 'La transformación puede alargarla, acortarla o voltearla, pero no le cambia la dirección: se queda en la misma recta. El factor de multiplicación es el autovalor.' },
    { q: '¿Por qué los autovalores de una puerta cuántica tienen módulo 1?', options: ['por convenio', 'porque una puerta es unitaria y no cambia las longitudes', 'porque siempre son números enteros', 'porque la medida los normaliza'], correct: 1,
      why: 'Si un autovalor fuera 2, esa flecha se duplicaría y las probabilidades pasarían del 100%. Con módulo 1 el único efecto posible es una rotación de la fase.' },
    { q: 'Al aplicar una puerta a su autovector, ¿qué cambia?', options: ['el estado se convierte en otro estado', 'solo la fase', 'la probabilidad de leer 0', 'el número de cúbits'], correct: 1,
      why: 'El estado se queda igual salvo por un factor de fase: por eso las probabilidades medidas no cambian nada, y hace falta la Fourier para sacar esa fase a la luz.' },
    { q: 'Si una puerta U gira la fase 72° cada vez, ¿tras cuántas aplicaciones se vuelve al punto de partida?', options: ['3', '4', '5', '8'], correct: 2,
      why: '72 × 5 = 360, una vuelta entera. Contar esas aplicaciones equivale a medir la fase: un quinto de vuelta.' },
    { q: '¿Por qué la rotación de 90° no tiene autovectores reales?', options: ['porque es demasiado rápida', 'porque gira todas las flechas sin excepción: sus autovalores son fases complejas', 'porque su matriz no es cuadrada', 'porque no es unitaria'], correct: 1,
      why: 'Ninguna flecha real se queda en línea. Sus autovalores son ±i: números de longitud 1 pero complejos. Es justo el motivo por el que lo cuántico vive sobre los números complejos.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Autovector = la flecha que la máquina no gira. Autovalor = por cuánto la
          multiplica. En una puerta cuántica ese autovalor es una <b>fase</b>, y contar cuántas aplicaciones te devuelven
          a casa ya es una medida de esa fase. El nivel siguiente lo hace de un solo golpe.</div>`,
});
@endsection
