@php($description = 'Por qué no se puede copiar un estado cuántico desconocido, cómo el teletransporte cuántico lo mueve igualmente y cómo la codificación densa mete dos bits clásicos en un cúbit.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { confronto } from '/js/core/confronto.js';
import { teleportLab } from '/js/widgets/quantum2.js';

const L = renderLesson({
  id: '06-teletrasporto',
  lead: `Tres resultados famosos, todos consecuencia de lo que ya sabes: <b>no puedes copiar un cúbit</b>,
         <b>puedes moverlo</b> (teletransporte) y <b>puedes meter dos bits en un solo cúbit</b> (codificación densa).
         Nada de magia: solo entrelazamiento y medida.`,

  steps: [
    {
      t: 'Primero en clásico: copiar es gratis, y por eso nunca piensas en ello',
      html: `<p>Copia un archivo, reenvía un mensaje, dale a Ctrl-C: has duplicado información sin tocar el
             original, sin coste y sin límites. Es tan obvio que ni siquiera parece una propiedad — y en cambio
             es <b>la</b> propiedad sobre la que se sostiene media informática: las copias de seguridad, la
             caché, el código de repetición del nivel K·6, el hecho mismo de que puedas leer un bit sin
             gastarlo.</p>
             <p>Un bit se copia porque leerlo <b>no lo cambia</b>: miras la tensión del cable, ves que es alta,
             la reescribes en otro sitio. Ya está.</p>
             <p>Con un cúbit ese paso — «miras… ves… reescribes» — es justo lo que no se puede hacer. Y no es un
             límite tecnológico por superar: es un <b>teorema</b>.</p>` +
             confronto({
               titolo: 'Copiar un bit, copiar un cúbit',
               livello: 'k1-bit',
               vaiA: 'Repasa qué es un bit (nivel K·1)',
               classico: {
                 titolo: 'El bit se copia',
                 html: `<p>Leer no altera. Copiar es gratis, ilimitado y perfecto.</p>
                        <p class="mb0">Consecuencias: copias de seguridad, redundancia, corrección de errores por
                        repetición, y que una interceptación en una línea <b>no deje rastro</b>.</p>`,
               },
               quantistico: {
                 titolo: 'El cúbit no',
                 html: `<p><b>Teorema de no clonación</b> (Wootters y Zurek, 1982): no existe ninguna operación
                        que duplique un estado cuántico desconocido.</p>
                        <p class="mb0">Consecuencias: nada de copias de seguridad de cúbits, corrección de
                        errores mucho más difícil — pero también criptografía cuántica, donde <b>una
                        interceptación se ve</b> porque deja marca.</p>`,
               },
               numeri: [
                 { cosa: 'copias de un estado desconocido', classico: 'infinitas', quantistico: 'cero' },
                 { cosa: 'moverlo a otro sitio', classico: 'copiar y borrar', quantistico: 'teletransporte: 2 bits clásicos + 1 par entrelazado' },
                 { cosa: 'interceptación', classico: 'invisible', quantistico: 'detectable' },
               ],
               verdetto: `<b>La misma prohibición genera el problema y el regalo.</b> No poder copiar hace difícil
                          proteger los cúbits de los errores (nivel 21), y al mismo tiempo hace posible una línea
                          de comunicación en la que espiar es imposible sin que te pillen.`,
             }),
    },
    {
      t: 'El teorema de no-clonación',
      html: `<p>Pregunta razonable: si un cúbit es delicado, ¿por qué no hacer una copia de seguridad?</p>
             <p><b>No se puede.</b> Y la demostración es tan sencilla que cabe en cinco líneas.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Hipótesis', html: 'Supongamos que existe una fotocopiadora cuántica <b>C</b> que, dado un estado cualquiera |ψ⟩ y una hoja en blanco |0⟩, produce dos copias: <code>C(|ψ⟩|0⟩) = |ψ⟩|ψ⟩</code>.' },
          { h: 'Prueba 1', html: 'Funciona con |0⟩: <code>C(|0⟩|0⟩) = |0⟩|0⟩</code> ✓' },
          { h: 'Prueba 2', html: 'Funciona con |1⟩: <code>C(|1⟩|0⟩) = |1⟩|1⟩</code> ✓' },
          { h: 'Prueba 3 — la trampa', html: 'Probemos con |+⟩ = (|0⟩+|1⟩)/√2.<br>Como toda puerta cuántica es <b>lineal</b> (actúa por separado sobre cada pieza y luego suma), la máquina tiene que dar:<br><code>(|0⟩|0⟩ + |1⟩|1⟩)/√2</code>' },
          { h: 'Pero nosotros queríamos…', html: '<code>|+⟩|+⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2</code>, que tiene <b>cuatro</b> términos.<br>Los dos resultados son <b>distintos</b>: el primero es un estado de Bell (entrelazado), el segundo no.' },
          { h: 'Conclusión', html: 'La fotocopiadora universal <b>no puede existir</b>. Puedes copiar los dos estados de base, pero no las superposiciones. Es el <b>teorema de no-clonación</b> (Wootters y Zurek, 1982).' },
          { h: 'Consecuencias prácticas', html: '• Nada de copias de seguridad de un estado cuántico → la corrección de errores cuántica tiene que ser mucho más astuta (nivel 21).<br>• Quien intercepte no puede copiar los cúbits de una comunicación sin dejar rastro → es la base de la <b>criptografía cuántica</b> (QKD).' },
        ], { doneLabel: '¡Demostración entendida!' });
      },
    },
    {
      t: 'Si no puedo copiarlo… ¿al menos puedo moverlo?',
      html: `<p>Sí. Se llama <b>teletransporte cuántico</b> y se ha demostrado en laboratorio miles de veces
             (entre edificios, por fibra e incluso hacia satélites).</p>
             <p>La receta usa tres cúbits:</p>
             <ul>
               <li><b>q0</b>: el cúbit misterioso que Alice quiere enviar (¡ella misma no sabe qué contiene!);</li>
               <li><b>q1</b> y <b>q2</b>: una pareja <b>entrelazada</b> preparada antes; q1 se queda con Alice, q2 va a Bob.</li>
             </ul>
             <p>Pulsa «paso siguiente» y sigue el comentario debajo del gráfico.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'teleport', title: 'Teletransporta un estado', text: 'ejecuta todos los pasos y lleva a cero la diferencia entre el cúbit de partida y el de Bob.', xp: 55 });
        el.appendChild(m.root);
        teleportLab(el, { onDone: () => m.complete() });
      },
      after: `<div class="callout warn"><b>Las tres cosas que no hay que malinterpretar:</b>
              <ol style="margin:8px 0 0">
                <li><b>No viaja materia:</b> el cúbit de Bob ya estaba ahí. Se <i>reconfigura</i>, no se envía.</li>
                <li><b>No es instantáneo:</b> hacen falta <b>2 bits clásicos</b> que Alice tiene que comunicar de forma normal
                    (teléfono, fibra, paloma mensajera). Sin ellos, Bob solo tiene ruido. Nada de información más rápida que la luz.</li>
                <li><b>El original muere:</b> la medida de Alice destruye el estado de partida. Es una <b>transferencia</b>,
                    no una copia — y por eso la no-clonación sigue en pie.</li>
              </ol></div>`,
    },
    {
      t: 'Codificación densa: dos bits dentro de un cúbit',
      html: `<p>El truco inverso, descubierto por Bennett y Wiesner. Alice y Bob comparten de antemano una pareja entrelazada.
             Luego Alice, actuando <b>solo sobre su cúbit</b>, puede mandarle a Bob <b>dos bits clásicos</b> enviándole
             <b>un solo cúbit</b>.</p>
             <table class="table">
               <tr><th>Bits que enviar</th><th>Qué aplica Alice a su cúbit</th><th>Estado de Bell resultante</th></tr>
               <tr><td class="mono">00</td><td>nada (I)</td><td class="mono">(|00⟩ + |11⟩)/√2</td></tr>
               <tr><td class="mono">01</td><td>X</td><td class="mono">(|10⟩ + |01⟩)/√2</td></tr>
               <tr><td class="mono">10</td><td>Z</td><td class="mono">(|00⟩ − |11⟩)/√2</td></tr>
               <tr><td class="mono">11</td><td>Z y luego X</td><td class="mono">(|10⟩ − |01⟩)/√2</td></tr>
             </table>
             <p>Los cuatro estados resultantes son <b>perfectamente distinguibles</b> para Bob (que tiene los dos cúbits tras
             recibir el de Alice): aplica CNOT y H y lee dos bits limpios.</p>
             <div class="callout"><b>El balance honesto:</b> no es "información gratis". La pareja entrelazada hay que distribuirla
             <i>antes</i>, y eso cuesta. Pero es la demostración de que el entrelazamiento es un <b>recurso</b> de verdad,
             que se puede gastar — exactamente igual que el ancho de banda o la memoria.</div>
             <p class="dim small">Nota para curiosos: teletransporte y codificación densa son dos caras de la misma moneda.
             En el primero gastas 1 pareja entrelazada + 2 bits clásicos para enviar 1 cúbit. En la segunda gastas 1 pareja entrelazada
             + 1 cúbit para enviar 2 bits clásicos.</p>`,
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el teletransporte, ¿qué ve Bob <b>antes</b> de recibir los dos bits clásicos?
           <span class="muted">(un estado completamente al azar: ninguna información, si no se violaría la relatividad)</span></p>
        <p><b>2.</b> Prueba a teletransportar un estado con θ = 0 (es decir |0⟩): ¿funciona? ¿Es un caso interesante o trivial?</p>
        <p><b>3.</b> Si Alice se equivoca y aplica la corrección X cuando tenía que aplicar Z, ¿qué recibe Bob?</p>
        <p class="mb0"><b>4.</b> Pregunta de criptógrafo: si alguien intenta leer los cúbits en tránsito,
           ¿qué le pasa al estado? ¿Y cómo se dan cuenta Alice y Bob? <i>(Es exactamente el protocolo BB84.)</i></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'El teorema de no-clonación dice que…',
      options: ['no se puede medir un cúbit', 'no existe una máquina que copie un estado cuántico desconocido', 'no se pueden crear estados entrelazados', 'los cúbits se pierden al cabo de un segundo'], correct: 1,
      why: 'La linealidad de las operaciones cuánticas hace imposible una fotocopiadora universal: funcionaría con los estados de base pero fallaría con todas las superposiciones.' },
    { q: 'En el teletransporte cuántico, ¿qué viaja de Alice a Bob?',
      options: ['el cúbit físico', 'dos bits clásicos, por un canal normal', 'nada', 'un fotón entrelazado'], correct: 1,
      why: 'El cúbit de Bob ya está ahí (entrelazado). Alice solo necesita dos bits clásicos para decirle qué corrección aplicar: por eso no se supera la velocidad de la luz.' },
    { q: 'Tras el teletransporte, el estado original de Alice…',
      options: ['sigue idéntico', 'queda destruido por la medida', 'se entrelaza con Bob', 'se duplica'], correct: 1,
      why: 'Es una transferencia, no una copia: la medida de Alice destruye el original. Por eso la no-clonación no se viola.' },
    { q: 'La codificación densa permite…',
      options: ['enviar 2 bits clásicos usando 1 cúbit y una pareja entrelazada ya compartida', 'copiar un cúbit', 'comprimir archivos', 'medir dos cúbits a la vez'], correct: 0,
      why: 'El entrelazamiento compartido de antemano es un recurso que se puede "gastar" para duplicar la capacidad de un canal cuántico.' },
  ],

  outro: `<div class="callout ok"><b>¡Parte A completada!</b> Sabes qué es un cúbit, cómo se mide, cómo se manipula,
          qué es el entrelazamiento y qué se puede (y qué no) hacer. En la Parte B subimos el listón:
          amplitudes que apuntan en cualquier dirección, y los primeros algoritmos que de verdad ganan al ordenador clásico.</div>`,
});
@endsection
