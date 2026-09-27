@php($description = 'Probabilidad con monedas y dados: la ley de los grandes números, sucesos independientes y por qué toda medida cuántica necesita miles de tiradas.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { diceLab } from '/js/widgets/basicmath.js';

const L = renderLesson({
  id: '00-caso',
  lead: `Monedas y dados: aprendemos a decir lo probable que es que pase algo, y por qué el azar, con muchos lanzamientos, se vuelve previsible.`,

  steps: [
    {
      t: 'Probabilidad = cuántas veces de cuántas',
      html: `<p>Lanzas una moneda: dos posibilidades, cara o cruz. Ninguna está favorecida, así que cada una tiene probabilidad
             <b>1 entre 2</b> = 1/2 = 0,5 = <b>50%</b> (¡las tres escrituras del nivel 0·1!).</p>
             <p>Lanzas un dado: seis caras, cada una <b>1 entre 6</b> ≈ 0,167 ≈ <b>16,7%</b>.</p>
             <div class="callout key"><b>Regla que vale siempre:</b> sumando las probabilidades de todas las posibilidades
             tiene que dar <b>1</b> (es decir, 100%). Si te sale más o menos, has olvidado un caso o has contado uno dos veces.</div>
             <p><b>Pero cuidado con el malentendido más común:</b> "50%" no quiere decir que en 10 lanzamientos salgan exactamente
             5 caras. Quiere decir que <b>cuantos más lanzamientos hagas</b>, más se acerca la proporción a la mitad. Pruébalo:</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'lanci', title: 'Mil lanzamientos', text: 'haz al menos 1000 lanzamientos y mira cómo las barras se colocan sobre la línea teórica.', xp: 30 });
        el.appendChild(m.root);
        diceLab(el, { onWin: () => m.complete() });
      },
      after: `<p class="dim small">Este fenómeno se llama <b>ley de los grandes números</b>: el azar, con números grandes,
              se vuelve increíblemente previsible. Es la razón por la que los casinos nunca quiebran.</p>`,
    },
    {
      t: 'Unas cuentas fáciles',
      html: `<p><b>Probabilidad de dos cosas juntas (independientes):</b> se <b>multiplican</b>.<br>
             Dos caras seguidas: 1/2 × 1/2 = 1/4 = 25%.<br>
             Tres caras seguidas: 1/2 × 1/2 × 1/2 = 1/8 = 12,5%. <span class="muted">(¡otra vez las potencias de 2!)</span></p>
             <p><b>Probabilidad de "esto o aquello" (casos distintos):</b> se <b>suman</b>.<br>
             Con un dado, "sale 1 o 6" = 1/6 + 1/6 = 2/6 = 33,3%.</p>
             <div class="callout">Con 3 monedas los resultados posibles son CCC, CCX, CXC, CXX, XCC, XCX, XXC, XXX (C = cara, X = cruz): son <b>8 = 2³</b>.
             Cada moneda de más duplica los resultados.</div>`,
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> Con el dado, ¿cuántos lanzamientos hacen falta para que todas las barras queden a menos del 1% de la línea teórica? Pruébalo.</p>
        <p><b>2.</b> Si lanzas 10 monedas, ¿cuál es la probabilidad de que salgan <b>todas</b> caras? <span class="muted">(1/2^10 = 1/1024)</span></p>
        <p class="mb0"><b>3.</b> Un amigo dice: "han salido 5 cruces seguidas, ahora es más probable que salga cara". ¿Tiene razón?
           <span class="muted">(no: la moneda no tiene memoria — es la "falacia del jugador")</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Lanzando una moneda 10 veces, ¿salen siempre exactamente 5 caras?',
      options: ['sí, siempre', 'no, pero cuantos más lanzamientos hagas más se acerca la proporción a la mitad', 'no, salen siempre más cruces', 'depende de la moneda'], correct: 1,
      why: 'Es la ley de los grandes números: con pocos lanzamientos los porcentajes bailan, con muchos se estabilizan.' },
    { q: '¿Probabilidad de sacar tres caras seguidas?',
      options: ['1/2', '1/6', '1/8', '3/2'], correct: 2,
      why: 'Sucesos independientes: se multiplican. 1/2 × 1/2 × 1/2 = 1/8 = 12,5%.' },
    { q: 'La suma de las probabilidades de todos los resultados posibles vale…',
      options: ['0', '1 (es decir, 100%)', 'depende', 'el número de resultados'], correct: 1,
      why: 'Algo tiene que pasar: la suma es siempre 1.' },
  ],

  outro: `<div class="callout ok"><b>¡Hecho!</b> Ya sabes calcular las probabilidades de monedas y dados. En el siguiente nivel:
          el <b>reloj de los números</b>, es decir contar por vueltas como las horas en el reloj.</div>`,
});
@endsection
