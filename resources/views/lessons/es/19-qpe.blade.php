@php($description = 'La estimación cuántica de fase (QPE) explicada jugando: cómo leer una fase escondida como número binario usando la QFT inversa. El motor de Shor y de la química cuántica.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { qpeLab } from '/js/widgets/qft.js';

const L = renderLesson({
  id: '19-qpe',
  lead: `Una operación cuántica, aplicada a ciertos estados especiales, los deja idénticos salvo por una <b>fase</b>.
         Esa fase es un número que nos gustaría <b>leer</b>… pero las fases son invisibles a las medidas.
         La QPE es la máquina que las hace visibles — y es el motor de verdad de Shor.`,

  steps: [
    {
      t: 'El problema: leer lo invisible',
      html: `<p>Existen estados especiales (se llaman <b>autoestados</b>) que, bajo una cierta operación U, no cambian
             salvo por un factor de fase:</p>
             <div class="formula">U|u⟩ = e^{2πi<span class="hl-k">φ</span>}·|u⟩ &nbsp;&nbsp;&nbsp;<span class="muted">con φ entre 0 y 1</span></div>
             <p>Si aplicas U y luego mides, no notas <b>nada</b>: las probabilidades son idénticas (nivel 1: la fase no se ve).
             Y sin embargo ese número φ vale oro: en la química cuántica es la <b>energía</b> de una molécula, en Shor es
             lo que esconde el <b>periodo</b>.</p>
             <div class="callout key"><b>La idea de la QPE, en una línea:</b> no midas la fase.
             <b>Cópiala en los cúbits</b>, en forma de número binario, y luego mide esos.</div>`,
    },
    {
      t: 'Cómo se copia una fase dentro de unos cúbits',
      html: `<p>Hace falta un truco que ya conoces del nivel 9: el <b>phase kickback</b>.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Preparación', html: 'Coge <b>t</b> cúbits "de lectura" y ponlos todos en superposición con unas Hadamard. Al lado, mantén el estado especial |u⟩.' },
          { h: 'Aplicaciones controladas', html: 'Aplica <b>U controlada</b> por el primer cúbit de lectura: 1 vez. Luego U controlada por el segundo: <b>2 veces</b>. Por el tercero: <b>4 veces</b>. Y así sucesivamente, duplicando.' },
          { h: 'Qué pasa', html: 'Cada aplicación de U añade la fase e^{2πiφ}. Aplicándola 2^j veces, el cúbit número j se carga de una fase <b>e^{2πi·2^j·φ}</b>. El estado |u⟩ no cambia nunca: la fase "rebota" entera sobre los cúbits de lectura.' },
          { h: 'El resultado intermedio', html: 'Los t cúbits de lectura están ahora en un estado cuyas fases dibujan exactamente el número φ escrito en binario, con una vuelta completa por cada cifra. Es el mismo estado que se obtendría aplicando la QFT al número φ·2^t.' },
          { h: 'El movimiento final', html: 'Aplicas la <b>QFT inversa</b> (QFT†): como la QFT convierte números en fases, su inversa convierte esas fases <b>de nuevo en un número</b>. Ahora basta con medir los t cúbits y leer las cifras binarias de φ.' },
          { h: 'La precisión', html: 'Con t cúbits lees φ con t cifras binarias, es decir con precisión 1/2^t. <b>Cada cúbit de lectura de más duplica la precisión.</b>' },
        ], { doneLabel: '¡Mecanismo entendido!' });
      },
    },
    {
      t: 'Pruébalo: fases cómodas y fases incómodas',
      html: `<p>Mueve la fase escondida y el número de cúbits de lectura. Mira el histograma:</p>
             <ul>
               <li>si φ es <b>representable exactamente</b> con t cifras binarias (por ejemplo ½, ¼, ⅜),
                   sale una sola barra al <b>100%</b>;</li>
               <li>si no lo es (por ejemplo ⅓), la probabilidad se <b>desparrama</b> alrededor del valor correcto —
                   pero se mantiene concentrada: al menos un <b>40%</b> aproximadamente sobre el valor más cercano, y más del 80% sobre uno de los dos vecinos.</li>
             </ul>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'qpe', title: 'Aumenta la precisión', text: 'lleva los cúbits de lectura a al menos 5 y observa cómo se estrecha el pico.', xp: 60 });
        el.appendChild(m.root);
        qpeLab(el, { t: 4, onWin: () => m.complete() });
      },
      after: `<div class="callout"><b>Ese "40%" no es un defecto:</b> es suficiente. Basta con repetir el algoritmo unas cuantas veces
              y quedarse con el resultado más frecuente. En la computación cuántica se convive con la probabilidad:
              lo importante es que la respuesta correcta sea <b>mucho más probable</b> que las demás, no que sea segura.</div>`,
    },
    {
      t: 'Para qué sirve, en concreto',
      html: `<table class="table">
               <tr><th>Ámbito</th><th>Qué es la "fase" φ</th><th>Por qué sirve</th></tr>
               <tr><td><b>Algoritmo de Shor</b></td><td>ligada al <b>periodo</b> de a^x mod N</td><td>encontrar el periodo → factorizar (nivel 20)</td></tr>
               <tr><td><b>Química cuántica</b></td><td>la <b>energía</b> de un estado molecular</td><td>calcular energías de enlace: es la principal aplicación "útil" que se espera</td></tr>
               <tr><td><b>Álgebra lineal cuántica</b></td><td>los <b>autovalores</b> de una matriz</td><td>subrutina de algoritmos tipo HHL</td></tr>
             </table>
             <div class="callout warn"><b>El coste escondido:</b> la QPE exige aplicar U <b>2^t veces</b> en total
             (1 + 2 + 4 + … ). Si U es cara de realizar, la cuenta sube deprisa.
             Es uno de los motivos por los que los algoritmos basados en QPE — Shor incluido — requieren ordenadores cuánticos
             bastante más grandes y estables que los actuales. Hablamos de ello en el nivel 21.</div>`,
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> Con t = 3 cúbits, ¿qué fases se leen <b>exactamente</b>? <span class="muted">(los múltiplos de 1/8)</span></p>
        <p><b>2.</b> Pon φ = 0,3 y aumenta t de 2 a 7: mira cómo se estrecha el pico. ¿A qué t la lectura es "bastante buena"?</p>
        <p><b>3.</b> ¿Por qué aplicar U 2^j veces en vez de j veces? ¿Qué pasaría usando pesos 1, 2, 3, 4 en vez de 1, 2, 4, 8?</p>
        <p class="mb0"><b>4.</b> Como inventor: la QPE es "la QFT al revés". ¿Sabrías imaginar un algoritmo que use
           <b>dos</b> QFT, una a la ida y otra a la vuelta? <i>(Existen: se llaman algoritmos de "quantum walk".)</i></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Para qué sirve la Quantum Phase Estimation?',
      options: ['para medir la posición de un cúbit', 'para leer una fase escondida como número binario', 'para crear entrelazamiento', 'para corregir errores'], correct: 1,
      why: 'Copia la fase en los cúbits de lectura mediante aplicaciones controladas de U y luego la hace legible con la QFT inversa.' },
    { q: '¿Cuántas veces hay que aplicar U desde el cúbit de lectura número j?',
      options: ['1 vez', 'j veces', '2^j veces', 'ninguna'], correct: 2,
      why: 'Los pesos se duplican (1, 2, 4, 8…) porque así las fases acumuladas se corresponden con las cifras binarias del número buscado.' },
    { q: '¿Qué efecto tiene añadir un cúbit de lectura?',
      options: ['duplica la precisión', 'reduce el tiempo a la mitad', 'no cambia nada', 'solo duplica el ruido'], correct: 0,
      why: 'Con t cúbits la precisión es 1/2^t: cada cúbit de más añade una cifra binaria (pero duplica también el número de aplicaciones de U).' },
    { q: 'Si la fase no es representable exactamente con t bits…',
      options: ['el algoritmo falla', 'la probabilidad se concentra en los valores más cercanos', 'sale siempre cero', 'hace falta otro algoritmo'], correct: 1,
      why: 'Se obtiene igualmente el valor correcto con probabilidad alta (más del 40% sobre el más cercano): basta repetir unas cuantas veces y quedarse con el resultado más frecuente.' },
  ],

  outro: `<div class="callout ok"><b>Lo que te llevas a casa:</b> las fases no se miden, pero se pueden <b>copiar en los cúbits</b>
          y luego leer con la QFT inversa; la precisión se duplica por cada cúbit añadido; es el motor de Shor
          y de la química cuántica. Ahora tienes todas las piezas: <b>vamos a factorizar.</b></div>`,
});
@endsection
