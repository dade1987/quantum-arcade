@php($description = 'Búsqueda lineal y búsqueda binaria jugadas contando comparaciones: por qué en una lista desordenada no se puede hacer mejor que N/2 intentos, y por qué ese es justo el récord que bate Grover.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { confronto } from '/js/core/confronto.js';
import { searchRace } from '/js/widgets/classic2.js';

const L = renderLesson({
  id: 'k4-ricerca',
  lead: `«Buscar» parece una sola cosa y en realidad son dos, y la diferencia entre las dos lo es todo.
         Buscar en una estantería <b>ordenada</b> es fácil y rapidísimo. Buscar en una estantería
         <b>desordenada</b> es pesado y no hay astucia que valga. Juega a las dos contando los intentos con los
         dedos: ese número es la vara con la que, en el nivel 11, mediremos a Grover.`,

  steps: [
    {
      t: 'Dos estanterías, dos mundos',
      html: `<p>En el juego las cajas esconden números y tú buscas uno.</p>
             <ul>
               <li><b>Estantería desordenada:</b> una caja abierta solo te dice qué hay <b>en esa</b>. Ninguna
                   pista sobre dónde mirar después. Prueba, cuenta, y verás que acabas abriendo alrededor de
                   la <b>mitad</b> antes de encontrarlo — a veces antes por suerte, a veces casi todas.</li>
               <li><b>Estantería ordenada:</b> cada caja abierta te dice además <b>hacia qué lado</b> seguir.
                   Abres la del medio y tiras media estantería. Luego otra mitad. Luego otra.</li>
             </ul>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'ricerca', title: 'Las dos cacerías', text: 'encuentra el número en la estantería desordenada, y luego en la ordenada usando como mucho 5 aperturas.', xp: 40 });
        el.appendChild(m.root);
        searchRace(el, { n: 16, onWin: () => m.complete() });
      },
      after: `<div class="callout key"><b>La cuenta de las dos estrategias</b>, sobre N cajas:
              <br>· <b>lineal</b> (desorden): de media <b>N/2</b> aperturas, N en el peor caso.
              <br>· <b>binaria</b> (ordenada): <b>log₂N</b> aperturas, siempre, también en el peor caso.
              <br>Sobre un millón de cajas: 500.000 contra <b>20</b>. No es una diferencia de velocidad del
              ordenador: es una diferencia de <b>método</b>, y vale en cualquier máquina.</div>`,
    },
    {
      t: 'Por qué en el desorden no se puede hacer mejor',
      html: `<p>Esta es una de las pocas cosas que en informática se <b>demuestran</b>, y la demostración cabe en
             tres líneas que puedes seguir sin matemáticas:</p>
             <div class="callout">
               <p>Imagina ser el adversario y poder decidir el contenido de las cajas <b>mientras</b> el otro
               busca. Cada vez que abre una caja, tú le metes dentro un número equivocado — puedes hacerlo
               mientras quede al menos una caja cerrada.</p>
               <p class="mb0">Mientras haya una caja cerrada, el buscador <b>no puede estar seguro</b>.
               Así que en el peor caso tiene que abrirlas todas. No existe algoritmo astuto: la información que
               le hace falta no está en la estantería, está repartida en N sitios y hay que recogerla de uno
               en uno.</p>
             </div>
             <p>Este tipo de razonamiento se llama <b>cota inferior</b>: no dice «todavía no lo hemos conseguido»,
             dice «no lo conseguirá nunca nadie». Y por eso el resultado de Grover hizo ruido: parecía
             violarla.</p>
             <div class="callout warn"><b>No la viola.</b> La cota vale para un ordenador que abre <b>una caja
             cada vez</b>. Grover abre las cajas de una manera que clásicamente no existe: las interroga todas
             a la vez y luego hace que las respuestas equivocadas <b>se cancelen entre ellas</b>. Y de hecho
             existe un segundo teorema que dice que ni siquiera un ordenador cuántico puede hacer mejor que √N:
             la cota también está ahí, solo que más abajo.</div>`,
      after: confronto({
        titolo: 'Buscar la aguja en el pajar: las tres formas',
        livello: '11-grover',
        vaiA: 'Ve a Grover (nivel 11)',
        classico: {
          titolo: 'Con un ordenador normal',
          html: `<p>Estantería <b>ordenada</b>: divide por la mitad cada vez → <b>log₂N</b> intentos. Imbatible,
                 y ningún ordenador cuántico lo mejora.</p>
                 <p class="mb0">Estantería <b>desordenada</b>: ningún atajo → <b>N/2</b> intentos de media.
                 Demostrado que no se puede hacer mejor.</p>`,
        },
        quantistico: {
          titolo: 'Con Grover',
          html: `<p>En la estantería <b>desordenada</b>: unos <b>√N</b> intentos. Sobre un millón de cajas, mil
                 en vez de medio millón.</p>
                 <p class="mb0">En la estantería <b>ordenada</b> no sirve de nada: log₂N ya es mejor que √N.
                 La ventaja cuántica solo existe donde el clásico <b>no tiene estructura que aprovechar</b>.</p>`,
        },
        numeri: [
          { cosa: 'N = 100', classico: '50 intentos', quantistico: '10 intentos' },
          { cosa: 'N = 1.000.000', classico: '500.000', quantistico: '~785' },
          { cosa: 'lista ordenada, N = 1.000.000', classico: '20', quantistico: '20 (ninguna ganancia)' },
        ],
        verdetto: `<b>La ganancia de Grover es cuadrática, no mágica:</b> parte el exponente por la mitad, no lo
                   derriba. Y por eso contra la criptografía simétrica basta con duplicar la longitud de la
                   clave, mientras que contra RSA (que cae por otro motivo, en el nivel 20) no basta nada.`,
      }),
    },
    {
      t: 'Buscar, en la práctica: por qué nadie busca de verdad',
      html: `<p>Si abres la agenda del móvil y escribes tres letras, el resultado aparece <b>al instante</b>
             incluso con diez mil contactos. No es búsqueda lineal, ni tampoco binaria: es que alguien, antes,
             ha construido un <b>índice</b>.</p>
             <ul>
               <li><b>Ordenar cuesta</b> N·log N, pero se paga una vez y luego cada búsqueda cuesta log N.
                   Compensa en cuanto se busca más de una vez.</li>
               <li><b>Las tablas hash</b> van más allá: convierten el dato en una dirección y llegan
                   <b>de una vez</b>, de media. Por eso las bases de datos casi nunca buscan de verdad.</li>
               <li><b>El caso en el que Grover importa de verdad</b> es aquel en el que el índice <b>no se puede
                   construir</b>: cuando las posibilidades no están en un archivo sino que se <i>generan</i> —
                   todas las claves posibles, todas las jugadas posibles, todas las combinaciones posibles.
                   Ahí no hay nada que ordenar, porque no hay nada escrito en ninguna parte.</li>
             </ul>
             <div class="callout warn"><b>La objeción honesta:</b> para que Grover busque en un archivo real
             habría que <b>cargar antes el archivo</b> en el ordenador cuántico, y cargar N datos cuesta al menos
             N. La ganancia se esfuma. Por eso Grover se usa en problemas <b>generados por una regla</b> (una
             función que invertir), no en listas de clientes.</div>`,
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En la estantería ordenada de 16 cajas, ¿cuántas aperturas hacen falta <b>como máximo</b>? Comprueba que 2⁴ = 16 y que la respuesta es 4 (más una para confirmar).</p>
        <p><b>2.</b> En la desordenada, juega cinco partidas y apunta los intentos: haz la media. ¿Te acercas a 8?</p>
        <p><b>3.</b> Si la estantería tiene un millón de cajas y abres una por segundo: ¿cuánto tiempo para la búsqueda lineal en el peor caso? ¿Y para la binaria?</p>
        <p class="mb0"><b>4.</b> De inventor: ¿y si hubiera <b>dos</b> cajas correctas en vez de una? ¿Mejora la búsqueda lineal? ¿Cuánto? <span class="muted">(y guárdate la respuesta: también cambia el número de iteraciones de Grover)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'En una lista NO ordenada de N elementos, ¿cuántas comparaciones hacen falta de media?',
      options: ['log N', 'N/2', '√N', 'siempre 1'], correct: 1,
      why: 'De media media lista, en el peor caso toda. Sin estructura no existe mejor estrategia, y está demostrado.' },
    { q: 'La búsqueda binaria requiere…',
      options: ['una lista ordenada', 'una lista corta', 'un ordenador rápido', 'dos procesadores'], correct: 0,
      why: 'Hace falta el orden: es lo que permite tirar media lista en cada comparación.' },
    { q: '¿Por qué Grover no ayuda en una lista ya ordenada?',
      options: ['porque es demasiado lento', 'porque log N ya es mucho mejor que √N', 'porque no funciona con números', 'porque necesita demasiada memoria'], correct: 1,
      why: 'Sobre un millón de elementos: 20 comparaciones con la binaria contra unas 785 con Grover. La ventaja cuántica solo vive donde falta la estructura.' },
    { q: '¿Qué es una «cota inferior» en informática?',
      options: ['el tiempo mínimo de un ordenador concreto', 'una demostración de que ningún algoritmo puede hacerlo mejor', 'el número mínimo de líneas de código', 'la memoria mínima necesaria'], correct: 1,
      why: 'No dice «hasta ahora nadie lo ha conseguido»: dice «nadie lo conseguirá nunca». También Grover tiene la suya, y es √N.' },
  ],

  outro: `<div class="callout ok"><b>Lo que te llevas:</b> con estructura (el orden) se busca en log N; sin
          estructura se pagan N/2 y no hay escapatoria. Ten presentes estos dos números: el nivel 11 añadirá un
          tercero, √N, y ahora sabrás entre qué y qué está.
          Siguiente nivel: ponemos todos los costes en un único gráfico.</div>`,
});
@endsection
