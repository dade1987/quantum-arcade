@php($description = 'El producto escalar explicado como «cuánto se parecen dos flechas»: las dos fórmulas, la ortogonalidad como distinguibilidad y la medida cuántica como proyección. Con la historia de Gibbs, Heaviside y la notación de Dirac.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { scalareLab, ombraLab } from '/js/widgets/scalare.js';

const L = renderLesson({
  id: '00-scalare',
  lead: `En toda la literatura cuántica hay un símbolo que aparece más que ningún otro: <b>⟨φ|ψ⟩</b>. Parece un
         jeroglífico y en realidad es algo que ya sabes juzgar a ojo: <b>cuánto apuntan dos flechas en la misma
         dirección</b>. Un solo número. De ese número salen, sin añadir nada, la ortogonalidad, la longitud, la
         distancia entre dos estados y — lo gordo — <b>la regla con la que se calculan las probabilidades
         cuánticas</b>.`,

  steps: [
    {
      t: 'Un solo número para decir «cuánto se llevan bien»',
      html: `<p>Toma dos flechas. Querrías un número que diga si apuntan al mismo lado, si son perpendiculares o si van
             en sentidos opuestos. Ese número existe, se llama <b>producto escalar</b> y se calcula así:</p>
             <div class="formula">a · b = a<sub>x</sub>·b<sub>x</sub> + a<sub>y</sub>·b<sub>y</sub></div>
             <p>Se multiplican las coordenadas de dos en dos y se suma. Eso es todo. Y el resultado dice exactamente lo
             que queríamos:</p>
             <ul>
               <li><b>grande y positivo</b> → las flechas apuntan más o menos al mismo lado;</li>
               <li><b>cero</b> → son <b>perpendiculares</b>: no se parecen en nada;</li>
               <li><b>negativo</b> → apuntan en sentidos opuestos.</li>
             </ul>
             <p>En el juego arrastra las dos puntas y mira cómo se mueve el número. Busca el cero: es el caso que
             importa.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'scalare', title: 'Cero, máximo, negativo', text: 'acierta los 3 retos moviendo las dos flechas.', xp: 40 });
        el.appendChild(m.root);
        scalareLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>El juego enseña también la otra cara del mismo número:</p>
              <div class="formula">a · b = |a| · |b| · cos(ángulo entre las dos)</div>
              <p>Las dos fórmulas dan <b>siempre</b> el mismo resultado: la primera se calcula rápido, la segunda se
              entiende. Y explica por qué el cero cae en los 90°: el coseno de 90° es cero (nivel 0·3, el punto que gira:
              arriba del todo, la sombra horizontal es nula).</p>
              <div class="callout key"><b>Un poco de historia.</b> Esta notación no es antigua: nace en la década de 1880,
              cuando <b>Josiah Willard Gibbs</b> y <b>Oliver Heaviside</b> tomaron el producto de cuaterniones de Hamilton
              — un objeto incómodo — y lo partieron en dos piezas más útiles: una que devuelve un número (esta, el
              producto <i>escalar</i>) y otra que devuelve una flecha (el producto vectorial). El cálculo vectorial que se
              estudia hoy es ese corte, hecho para que cuadraran las cuentas del electromagnetismo.</div>`,
    },

    {
      t: 'La sombra: cuánto de una flecha va en una dirección',
      html: `<p>Hay una forma de leer el producto escalar que vale más que la fórmula. Toma una dirección (una flecha de
             <b>longitud 1</b>) y pregúntate: <b>¿cuánto de mi flecha va en esa dirección?</b></p>
             <p>La respuesta es su <b>sombra</b> sobre esa dirección, y la sombra es exactamente el producto escalar con
             esa dirección.</p>
             <div class="callout key">Es la misma sombra del nivel 0·3: seno y coseno eran las dos sombras de un punto que
             gira, en la pared y en el suelo. Ahora tienen un nombre general: <b>proyección</b>.</div>
             <p>Dos consecuencias inmediatas, y vale la pena pararse en ellas:</p>
             <ul>
               <li>la sombra de una flecha <b>sobre sí misma</b> es su longitud: de ahí <b>|a|² = a · a</b>, que es
                   Pitágoras escrito de otra manera;</li>
               <li>la <b>distancia</b> entre dos flechas es la longitud de su diferencia: cuánto de lejos están las
                   puntas. En lo cuántico sirve para decir cuánto se parecen dos estados.</li>
             </ul>`,
      mount: el => {
        stepper(el, [
          { h: 'La pregunta', html: 'Tengo la flecha (3, 4) y la dirección horizontal (1, 0). ¿Cuánto de mi flecha va en horizontal?' },
          { h: 'La cuenta', html: '(3, 4) · (1, 0) = 3·1 + 4·0 = <b>3</b>. Es la coordenada x, o sea: las coordenadas <b>ya son</b> sombras, sobre las dos direcciones de base.' },
          { h: 'La longitud', html: '(3, 4) · (3, 4) = 9 + 16 = 25, y la longitud es √25 = <b>5</b>. El producto escalar de una flecha consigo misma da el cuadrado de su longitud: es Pitágoras, escrito con un punto.' },
          { h: 'La distancia', html: 'Entre (3, 4) y (0, 4) la diferencia es (3, 0), de longitud <b>3</b>. Distancia = longitud de la diferencia: siempre la misma herramienta.' },
          { h: 'Por qué nos servirá', html: 'En lo cuántico la <b>amplitud</b> de un resultado es la sombra del estado sobre la dirección de ese resultado, y la <b>fidelidad</b> entre dos estados (cuánto se parecen) es su producto escalar al cuadrado.' },
        ], { doneLabel: '¡Claro!' });
      },
    },

    {
      t: 'La medida cuántica es una sombra (y su regla es Pitágoras)',
      html: `<p>Ahora la pieza gorda. Un estado cuántico es una flecha de <b>longitud 1</b>. Medirlo significa elegir
             <b>dos direcciones perpendiculares</b> — una por cada resultado posible — y mirar las dos sombras del estado
             sobre ellas.</p>
             <ul>
               <li>las dos sombras son las <b>amplitudes</b>;</li>
               <li>sus <b>cuadrados</b> son las probabilidades de los dos resultados;</li>
               <li>y los dos cuadrados suman siempre <b>1</b>, porque las direcciones son perpendiculares y vale
                   Pitágoras.</li>
             </ul>
             <div class="callout key">Relee la última línea: <b>«las probabilidades suman siempre el 100%» no es una regla
             impuesta, es el teorema de Pitágoras</b>. En el juego puedes girar el estado y girar la base cuanto quieras:
             esa suma no se mueve.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'ombra', title: 'Certeza, certeza, mitad y mitad', text: 'acierta las 3 configuraciones girando el estado y la base.', xp: 50 });
        el.appendChild(m.root);
        ombraLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Y ahora la frase que vuelve una y otra vez en el curso: <b>|0⟩ y |1⟩ son ortogonales</b>. Significa que su
              producto escalar es cero, es decir, que <b>no se parecen en nada</b>, es decir, que se pueden distinguir
              <b>con certeza</b>: si el estado está exactamente sobre una de las dos direcciones, la sombra sobre la otra
              es nula y ese resultado no sale nunca.</p>
              <p>Dos estados <b>no</b> ortogonales, en cambio, no se pueden distinguir con certeza con una sola medida. Es
              un límite de la física, no de la tecnología, y es la razón por la que funciona la criptografía cuántica:
              quien espía tiene que adivinar la base, y al equivocarse deja rastro.</p>
              <div class="callout key"><b>Un poco de historia.</b> El símbolo ⟨φ|ψ⟩ lo inventó <b>Paul Dirac</b> en 1939:
              tomó la palabra inglesa <i>bracket</i> (corchete) y la partió en dos, <i>bra</i> ⟨φ| y <i>ket</i> |ψ⟩. Un
              juego de palabras convertido en la notación estándar de la física, por la mejor de las razones: ese símbolo
              <b>es</b> el producto escalar, y le recuerda a quien lo escribe que dentro hay una pregunta: «¿cuánto se
              parece este estado a aquel?».</div>`,
    },

    {
      t: 'El resumen en una sola fórmula',
      html: ``,
      mount: el => {
        formula(el, {
          title: 'El producto escalar y sus cuatro oficios',
          hint: 'Toca las piezas: siempre es la misma cuenta, con cuatro nombres distintos.',
          parts: [
            { t: 'a · b', id: 'p', color: 'cyan', name: 'cuánto se parecen', say: 'Un número: grande si apuntan juntas, cero si son perpendiculares, negativo si son opuestas.', ex: '(1,0) · (0,1) = 0 → perpendiculares.' },
            { t: '|a|² = a · a', id: 'l', color: 'green', name: 'la longitud', say: 'El producto escalar de una flecha consigo misma es el cuadrado de su longitud. Es Pitágoras.', ex: '(3,4) · (3,4) = 25 → longitud 5.' },
            { t: 'sombra = ψ · d', id: 'o', color: 'amber', name: 'la amplitud', say: 'Con d una dirección de longitud 1: cuánto del estado va en esa dirección. En lo cuántico se llama amplitud.', ex: 'Estado a 45°, dirección horizontal → sombra 0,707.' },
            { t: 'sombra² = probabilidad', id: 'b', color: 'pink', name: 'la regla de Born', say: 'La probabilidad de ese resultado es la sombra al cuadrado. Y la suma de los cuadrados da 1 por Pitágoras.', ex: '0,707² = 0,5 → 50%.' },
          ],
        });
      },
      after: `<div class="callout ok">Cuatro cosas que parecían distintas — parecido, longitud, amplitud, probabilidad —
              son la misma cuenta vista desde cuatro lados. Cuando te encuentres ⟨φ|ψ⟩ sabrás exactamente qué estás
              leyendo.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego, alarga una de las dos flechas sin girarla: ¿cambia el producto escalar? ¿Y el
           ángulo? <span class="muted">(el producto sí, el ángulo no: son dos informaciones distintas)</span></p>
        <p><b>2.</b> Dos flechas de longitud 1 con producto escalar 0,5: ¿qué ángulo hay entre ellas?
           <span class="muted">(pista: ¿el coseno de cuánto vale 0,5?)</span></p>
        <p><b>3.</b> En el segundo juego pon la base a 45° y el estado a 0°: ¿qué probabilidades salen? ¿Y dónde has visto
           ya ese número? <span class="muted">(0,707² = 0,5: es la puerta H)</span></p>
        <p class="mb0"><b>4.</b> Pregunta de inventor: si dos estados cuánticos <b>no</b> son ortogonales, ninguna medida
           puede distinguirlos con certeza. Intenta explicarte por qué mirando las sombras, y luego piensa en lo que eso
           significa para alguien que quiera espiar una comunicación cuántica.</p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué dice el producto escalar de dos flechas?', options: ['su longitud total', 'cuánto apuntan en la misma dirección', 'el área entre ambas', 'su suma'], correct: 1,
      why: 'Es un solo número: grande y positivo si van juntas, cero si son perpendiculares, negativo si son opuestas. Se calcula multiplicando las coordenadas de dos en dos y sumando.' },
    { q: '¿Cuánto vale el producto escalar entre (1, 0) y (0, 1)?', options: ['1', '0', '2', '−1'], correct: 1,
      why: '1·0 + 0·1 = 0. Cero significa perpendiculares: en lo cuántico es la condición que hace distinguibles con certeza dos estados.' },
    { q: '¿Qué es la amplitud de un resultado, geométricamente?', options: ['la longitud del estado', 'la sombra (proyección) del estado sobre la dirección de ese resultado', 'el ángulo del estado', 'la distancia al origen'], correct: 1,
      why: 'Es el producto escalar entre el estado y la dirección del resultado: cuánto del estado va en esa dirección. La probabilidad es esa sombra al cuadrado.' },
    { q: '¿Por qué las probabilidades de una medida suman siempre 100%?', options: ['por convenio', 'porque las direcciones de la base son perpendiculares y vale el teorema de Pitágoras', 'porque se normalizan después', 'porque el estado es complejo'], correct: 1,
      why: 'El estado mide 1 y las dos direcciones son perpendiculares: la suma de los cuadrados de las sombras es el cuadrado de la longitud, es decir 1. No es una regla impuesta, es geometría.' },
    { q: '¿Se pueden distinguir con certeza dos estados NO ortogonales con una medida?', options: ['sí, siempre', 'no, nunca con certeza', 'solo si miden 1', 'solo con más cúbits'], correct: 1,
      why: 'Si no son perpendiculares, cada uno tiene una sombra no nula también sobre la dirección del otro: cualquier medida puede fallar. Es un límite físico y es la base de la criptografía cuántica.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Un número que dice cuánto se parecen dos flechas, y de ahí: longitud,
          distancia, amplitud, probabilidad. La próxima vez que leas ⟨φ|ψ⟩ no verás un jeroglífico, verás una
          sombra.</div>`,
});
@endsection
