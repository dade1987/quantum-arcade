@php($description = 'La derivada explicada como pendiente y puesta a trabajar: los algoritmos variacionales (VQE, QAOA), es decir, la computación cuántica que de verdad se ejecuta hoy en hardware ruidoso. Con la regla del desplazamiento y el coste de los disparos.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { pendenzaLab, vqeLab } from '/js/widgets/variazionale.js';

const L = renderLesson({
  id: '21b-variazionale',
  lead: `Hay algo que este curso todavía no ha dicho: los algoritmos que has aprendido — Grover, la estimación de fase,
         Shor — necesitan máquinas grandes y limpias, y esas <b>hoy no existen</b>. Lo que se ejecuta ahora mismo, en
         procesadores cuánticos reales y ruidosos, es otra familia. Funcionan así: el ordenador cuántico mide un número,
         un ordenador normal gira un mando para hacerlo bajar, y se repite. La herramienta para girar el mando en el
         sentido correcto se llama <b>derivada</b>, y es más sencilla que su fama.`,

  steps: [
    {
      t: 'La pendiente: por dónde se baja',
      html: `<p>Imagina que estás en una colina, de noche, y quieres bajar al valle. No ves el paisaje, pero puedes notar
             con los pies <b>cuánto está inclinado el suelo</b> donde estás. Con eso basta: da un paso hacia donde baja y
             vuelve a empezar.</p>
             <p>Ese «cuánto está inclinado» tiene un nombre preciso: es la <b>pendiente</b> de la curva en el punto donde
             estás, es decir, la inclinación de la recta que toca la curva allí.</p>
             <div class="callout key">Dos hechos, y es todo lo que hace falta:
             <ul style="margin:8px 0 0">
               <li>el <b>signo</b> da el sentido: pendiente positiva → se baja hacia la izquierda; negativa → hacia la derecha;</li>
               <li>donde la pendiente es <b>cero</b>, el suelo está llano: has llegado.</li>
             </ul></div>
             <p>En el juego mueve el punto y mira cómo se inclina la recta. Busca el fondo, pero ojo con la trampa.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'pendenza', title: 'Encuentra dos fondos de valle', text: 'lleva la pendiente a cero en el fondo de dos valles distintos.', xp: 40 });
        el.appendChild(m.root);
        pendenzaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Habrás encontrado la trampa: en el «valle doble» y en la onda hay un punto donde la pendiente es cero
              pero estás <b>en la cima</b>, no en el fondo. Y hay otra peor: en el valle doble hay <b>dos</b> fondos, y
              quien baja a ciegas acaba en el más cercano, no necesariamente en el más bajo.</p>
              <div class="callout warn"><b>Tenlo presente:</b> «pendiente cero» solo significa «aquí me he parado». Que
              sea el punto más bajo de todos no lo garantiza nadie. Es el problema número uno de los algoritmos que vas a
              ver, y también de todo el aprendizaje automático.</div>
              <p class="mb0">El nombre técnico de la pendiente es <b>derivada</b>. Ahora la ponemos a trabajar.</p>`,
    },

    {
      t: 'La computación cuántica que se ejecuta hoy: VQE',
      html: `<p>Este es el esquema, y es sorprendentemente sencillo:</p>
             <ol>
               <li>se construye un circuito cuántico con <b>mandos</b> (ángulos de rotación regulables);</li>
               <li>el ordenador cuántico prepara el estado y <b>mide</b> un número: normalmente la <b>energía</b> de una
                   molécula o el coste de una solución candidata;</li>
               <li>un ordenador normal mira ese número, calcula por dónde se baja y <b>gira los mandos</b>;</li>
               <li>se repite hasta que el número deja de bajar.</li>
             </ol>
             <p>Se llama <b>VQE</b> (Variational Quantum Eigensolver) cuando el número que hay que bajar es la energía de
             una molécula, y <b>QAOA</b> cuando es el coste de un problema de optimización. La estructura es la misma.</p>
             <div class="callout key">En el juego tienes un solo mando y una energía que bajar. Prueba primero a mano y
             luego deja que baje el algoritmo. Y sobre todo: <b>cambia el número de disparos</b> y mira qué le pasa a la
             pendiente medida.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'vqe', title: 'Toca el fondo dos veces', text: 'alcanza el mínimo en 2 problemas distintos.', xp: 60 });
        el.appendChild(m.root);
        vqeLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Con 50 disparos la pendiente medida baila bastante y la bajada va en zigzag; con 5000 es estable, pero
              cada paso cuesta cien veces más. No es un defecto del juego: <b>es el problema</b>. El error sobre una media
              medida baja como 1/√(disparos), así que una cifra decimal más cuesta cien veces las medidas.</p>`,
    },

    {
      t: 'La parte que lo clásico no sabe hacer',
      html: `<p>Hasta aquí podrías objetar, con razón: si el ordenador normal hace la bajada, ¿qué pone de su parte el
             cuántico? Dos cosas, y la segunda es elegante.</p>
             <p>La primera: <b>prepara y mide un estado</b> que un ordenador normal no sabría ni escribir; ese es todo el
             sentido de la superposición, con sus exponenciales amplitudes.</p>
             <p>La segunda tiene que ver con la pendiente. En un ordenador normal la derivada de una función medida se
             estima «a ojo»: se evalúa en dos puntos muy cercanos y se hace la diferencia, y con datos ruidosos eso es un
             desastre, porque la diferencia entre dos números casi iguales es casi solo ruido. En los circuitos cuánticos
             hay un camino mejor:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'La pregunta', html: 'Quiero la pendiente de la energía respecto al mando θ, y lo único que sé hacer es <b>medir la energía</b> para un θ dado.' },
          { h: 'El truco clásico (y por qué no basta)', html: 'Mido en θ y en θ+0,001 y hago la diferencia dividida entre 0,001. Pero las dos medidas tienen un ruido mucho mayor que la diferencia que busco: el resultado es casi solo ruido.' },
          { h: 'La regla del desplazamiento', html: 'En los circuitos paramétricos vale algo especial: la pendiente exacta es<br><b>[ E(θ + un cuarto de vuelta) − E(θ − un cuarto de vuelta) ] / 2</b>.' },
          { h: 'Por qué es mejor', html: 'No es una aproximación: es <b>exacta</b>. Y los dos puntos están <b>lejos</b>, así que la diferencia es grande comparada con el ruido. En el juego lo ves escrito: el número de la regla del desplazamiento coincide siempre con la pendiente verdadera.' },
          { h: 'De dónde sale', html: 'Del hecho de que la energía, al variar un mando de rotación, es siempre una combinación de seno y coseno: una función así queda determinada por pocos puntos, y su derivada se obtiene exactamente de dos valores separados 90°.' },
          { h: 'En la práctica', html: 'Es la receta que usan hoy todas las librerías de quantum machine learning para entrenar circuitos: <b>parameter-shift rule</b>, Mitarai y colaboradores (2018), Schuld y colaboradores (2019).' },
        ], { doneLabel: '¡Claro!' });
      },
      after: `<div class="callout ok"><b>El cuadro honesto, hoy:</b> ninguna máquina del mundo ejecuta Shor sobre números
              reales, y los métodos variacionales en hardware ruidoso todavía no han demostrado ganar a los mejores
              algoritmos clásicos en las mismas moléculas. Pero son lo que se puede <b>ejecutar ahora</b>, y son el campo
              donde se está aprendiendo a convivir con el ruido. Merece la pena saberlo y merece la pena decirlo sin
              exagerar.</div>`,
    },

    {
      t: 'De dónde viene',
      html: `<p>Hay una razón profunda por la que «bajar la energía» es una estrategia sensata, y no es nueva: se llama
             <b>principio variacional</b>. Dice una sola cosa, pero potente: <b>cualquier</b> estado que pruebes, la
             energía media que midas es <b>mayor o igual</b> que la del estado fundamental verdadero. Nunca puedes
             acabar por debajo. Así que cuanto más bajas, más te acercas a la respuesta, y siempre sabes por qué lado te
             estás equivocando.</p>
             <p>El método de cálculo que se deriva es de 1908 (<b>Walther Ritz</b>, siguiendo a <b>Lord Rayleigh</b>):
             eliges una familia de estados con unos cuantos mandos y buscas el ajuste que da la energía más baja. Es
             exactamente lo que has hecho en el juego, solo que allí el estado lo prepara un circuito cuántico en lugar
             de una fórmula escrita a mano.</p>
             <div class="callout key">El resto es reciente y merece la pena fecharlo: el primer <b>VQE</b> ejecutado en un
             procesador de verdad es de <b>2014</b> (Peruzzo y colegas, en un chip fotónico, para la molécula HeH⁺); el
             <b>QAOA</b> es del mismo año (Farhi, Goldstone y Gutmann). La regla del desplazamiento, que hace exacta la
             pendiente, llega en 2018-2019. Es un campo más joven que muchos de quienes lo leen.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el «valle doble», parte desde la derecha y baja. Luego parte desde la izquierda. ¿Acabas en el
           mismo fondo? ¿Qué dice eso de un algoritmo que empieza en un punto al azar?</p>
        <p><b>2.</b> En el segundo juego pon <b>50 disparos</b> y pulsa «baja todo lo que puedas» varias veces: ¿el punto
           final es siempre el mismo? ¿Y con 5000?</p>
        <p><b>3.</b> Mira los dos números de abajo: la pendiente medida con la regla del desplazamiento y la verdadera.
           ¿Con cuántos disparos empiezan a coincidir de verdad?</p>
        <p class="mb0"><b>4.</b> Pregunta de inventor: con un solo mando el fondo se encuentra a ojo. Con <b>cien</b>
           mandos (como en los VQE de verdad) ya no se puede mirar la curva: solo se puede notar la pendiente bajo los
           pies. ¿Qué problemas crees que aparecen? <span class="muted">(pista: si el paisaje se vuelve llano casi en
           todas partes, la pendiente ya no dice por dónde ir; se llama «meseta estéril»)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué dice la pendiente (derivada) de una curva en un punto?', options: ['lo alta que es la curva', 'cuánto y en qué sentido sube o baja la curva ahí', 'dónde está el mínimo', 'cuántas veces la curva cruza el cero'], correct: 1,
      why: 'Es la inclinación de la recta que toca la curva en ese punto: el signo da el sentido, el valor da lo empinado. Sirve para saber hacia dónde moverse para bajar.' },
    { q: '¿Pendiente cero significa siempre «estoy en el punto más bajo»?', options: ['sí, siempre', 'no: puede ser una cima, o un fondo cualquiera y no el más bajo', 'solo si la curva es una parábola', 'solo con más de un mando'], correct: 1,
      why: 'En la cima la pendiente es cero igual que en el fondo. Y puede haber varios fondos: bajar desde un punto al azar te lleva al más cercano, no al mejor.' },
    { q: 'En un algoritmo variacional, ¿quién hace qué?', options: ['todo el ordenador cuántico', 'el cuántico prepara y mide, el clásico gira los mandos', 'todo el ordenador clásico', 'se alternan al azar'], correct: 1,
      why: 'Es un bucle a dos: la máquina cuántica prepara el estado y mide un número, la clásica usa la pendiente para actualizar los parámetros. De ahí el nombre «híbridos».' },
    { q: '¿Qué es la regla del desplazamiento (parameter-shift)?', options: ['una forma de reducir el ruido', 'una forma de obtener la pendiente EXACTA evaluando la energía con el mando desplazado un cuarto de vuelta', 'una técnica de corrección de errores', 'un método para acortar circuitos'], correct: 1,
      why: 'La diferencia entre E(θ + 90°) y E(θ − 90°), dividida entre dos, es exactamente la derivada. Dos evaluaciones lejanas entre sí, mucho más robustas al ruido que un incremento pequeño.' },
    { q: '¿Por qué importa tanto el número de disparos?', options: ['porque gasta batería', 'porque el error sobre una media medida baja como 1/√disparos: una cifra más cuesta cien veces las medidas', 'porque enfría el chip', 'porque cambia el resultado verdadero'], correct: 1,
      why: 'La media medida es estadística: con pocos disparos baila, y la bajada baila con ella. Es el coste oculto que hace difíciles los métodos variacionales en el hardware de hoy.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> La derivada es la pendiente, la pendiente dice por dónde se baja, y la
          computación cuántica de hoy la usa así: prepara, mide, gira el mando, repite. Con la regla del desplazamiento
          que hace la pendiente exacta en vez de estimada, y el ruido de los disparos recordando cuánto cuesta cada
          número. Ahora puedes ir al taller a inventar algoritmos propios sabiendo también <b>qué se ejecuta de
          verdad</b>.</div>`,
});
@endsection
