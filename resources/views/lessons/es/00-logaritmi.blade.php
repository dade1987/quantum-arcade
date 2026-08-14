@php($description = 'Exponenciales y logaritmos aprendidos jugando: cuántos bits para N casos, cuántas veces se puede dividir por la mitad y por qué «polinómico en el número de cifras» es la frase que explica la ventaja cuántica de Shor.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { bitLab, dimezzaLab } from '/js/widgets/logaritmi.js';

const L = renderLesson({
  id: '00-logaritmi',
  lead: `«Logaritmo» es una palabra que asusta y esconde una pregunta sencillísima: <b>¿cuántas veces tengo que
         multiplicar un número por sí mismo para llegar ahí?</b> En el curso aparece casi siempre de una sola forma —
         <b>cuántos bits, o cuántos cúbits, hacen falta</b> — y es la misma pregunta que «cuántas cifras tiene este
         número». Hay veinte minutos de juego entre tú y la frase más importante de todo el curso:
         <i>Shor es rápido en el número de cifras</i>.`,

  steps: [
    {
      t: 'El exponencial, en una línea: solo duplica',
      html: `<p>Esta parte ya la sabes del nivel 0·1, así que solo el recordatorio: un interruptor tiene dos posiciones,
             dos interruptores tienen cuatro, tres tienen ocho. Cada interruptor de más <b>duplica</b>.</p>
             <div class="formula">con n interruptores eliges entre <span class="hl-n">2ⁿ</span> posibilidades</div>
             <p>Duplicar es lento al principio e inhumano después: 10 interruptores dan 1024, 20 más de un millón, 30 más
             de mil millones. Es el crecimiento que el nivel K·5 pone a competir con los demás.</p>
             <div class="callout key">Pero la pregunta que hace falta de verdad, en la práctica, es casi siempre <b>la
             girada</b>: no «cuánto es 2¹⁰», sino «para mil cosas, ¿cuántos interruptores necesito?». Y ahí entra el
             logaritmo.</div>`,
    },

    {
      t: 'La pregunta girada: el logaritmo',
      html: `<p>En el juego eliges cuántas cosas tienes que distinguir — las 26 letras, las 52 cartas, los 365 días — y
             enciendes interruptores hasta que basten. Busca el <b>mínimo</b>: aquel por debajo del cual ya no llegas.</p>
             <p>Ese mínimo <b>es</b> el logaritmo en base 2, redondeado hacia arriba. Nada más.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bit', title: 'El mínimo que basta', text: 'encuentra el número mínimo de interruptores para 3 casos distintos.', xp: 35 });
        el.appendChild(m.root);
        bitLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Mira el escalón: para 1000 casos, 9 interruptores cubren 512 y <b>no bastan</b>; 10 cubren 1024 y sí.
              Por eso se redondea siempre hacia arriba: medio interruptor no existe.</p>
              <div class="formula">2¹⁰ = 1024 &nbsp;⟺&nbsp; log₂(1024) = <span class="hl-n">10</span></div>
              <p>Las dos escrituras dicen exactamente lo mismo, leídas desde dos lados. El logaritmo es la operación que
              <b>deshace</b> la potencia, como la resta deshace la suma y la división deshace la multiplicación (nivel
              0·7: solo las operaciones que se deshacen se pueden mover de un platillo al otro).</p>`,
    },

    {
      t: 'La misma pregunta disfrazada: cuántas veces puedo dividir por la mitad',
      html: `<p>Ahora una pregunta que parece otra cosa: parto de 1000 y sigo <b>dividiendo por la mitad</b>. ¿Tras
             cuántos cortes queda uno solo?</p>
             <p>Pruébalo en el juego y luego mira el número que sale.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'dimezza', title: 'Hasta uno solo', text: 'divide hasta el final y di cuántos cortes han hecho falta, en 2 números.', xp: 40 });
        el.appendChild(m.root);
        dimezzaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Es el mismo número de antes. No por casualidad: son <b>la misma pregunta</b>.</p>
              <div class="callout key">«¿Cuántas veces tengo que duplicar 1 para llegar a N?» y «¿cuántas veces tengo que
              dividir N por la mitad para llegar a 1?» tienen por fuerza la misma respuesta: es la misma escalera
              recorrida en los dos sentidos. Ese número se llama <b>log₂N</b>.</div>
              <p>Y aquí se iluminan tres puntos del curso a la vez:</p>
              <ul>
                <li>la <b>búsqueda binaria</b> (nivel K·4) parte la estantería por la mitad en cada pregunta: por eso las
                    preguntas son log₂N y no N;</li>
                <li>la <b>FFT</b> (nivel 17) parte el problema por la mitad en cada etapa: las etapas son log₂N, y de ahí
                    sale el coste N·log N;</li>
                <li><b>n cúbits</b> manejan 2ⁿ amplitudes: girando la frase, para representar N posibilidades hacen falta
                    log₂N cúbits. Veinte cúbits para un millón de casos.</li>
              </ul>`,
    },

    {
      t: 'El número de cifras es un logaritmo (y aquí se decide todo)',
      html: `<p>¿Cuántas cifras tiene un número? Mira lo que pasa en base 10:</p>
             <table class="table">
               <tr><th>Número</th><th>Cifras</th></tr>
               <tr><td class="mono">7</td><td class="mono">1</td></tr>
               <tr><td class="mono">1 000</td><td class="mono">4</td></tr>
               <tr><td class="mono">1 000 000</td><td class="mono">7</td></tr>
               <tr><td class="mono">1 000 000 000</td><td class="mono">10</td></tr>
             </table>
             <p>El número crece mil veces y las cifras aumentan en tres. Las cifras son <b>el logaritmo</b> del número:
             crecen lentísimamente mientras el número explota.</p>
             <div class="callout key">Ahora relee la frase que en el nivel de Shor parece técnica y en realidad lo es
             todo:
             <p style="margin:8px 0 0"><i>«Shor factoriza en tiempo <b>polinómico en el número de cifras</b> de N».</i></p>
             <p class="mb0" style="margin-top:8px">Número de cifras = log N. Así que «polinómico en log N», que es
             <b>infinitamente más rápido</b> que «polinómico en N». Un número de 600 cifras es tan grande como 10⁶⁰⁰,
             pero cifras tiene 600: un algoritmo que trabaja sobre las cifras tiene delante un problema minúsculo
             comparado con uno que trabaja sobre el número.</p></div>`,
      mount: el => {
        stepper(el, [
          { h: 'El problema', html: 'Factorizar N probando divisores uno a uno cuesta unos <b>√N</b> intentos. Con N de 600 cifras, √N tiene 300 cifras: más intentos que átomos hay en el universo observable.' },
          { h: 'La medida correcta', html: 'El tamaño real del problema no es N: es <b>lo largo que es de escribir</b>, es decir el número de cifras, es decir log N. Un ordenador recibe 600 cifras, no 10⁶⁰⁰ objetos.' },
          { h: 'Qué significa «eficiente»', html: 'Un algoritmo se considera eficiente si el tiempo crece como una <b>potencia del número de cifras</b> (log N al cuadrado, al cubo…). Si en cambio crece como √N o como N, es exponencial <b>en el número de cifras</b>: doblar las cifras eleva al cuadrado el trabajo.' },
          { h: 'Dónde está Shor', html: 'Shor está en el primer grupo: unas <b>(log N)³</b> operaciones. Por eso un número de 600 cifras, inatacable de forma clásica, estaría al alcance de una máquina cuántica lo bastante grande.' },
          { h: '¿Y Grover?', html: 'Grover busca en <b>√N</b> en vez de en N: una ganancia real pero <b>cuadrática</b>, no exponencial. En un problema con 2ⁿ posibilidades sigue siendo 2^(n/2): mucho, pero aún exponencial en las cifras. De ahí la diferencia de fama entre los dos algoritmos.' },
          { h: 'El resumen en una línea', html: 'La ventaja cuántica no es «va más rápido»: es <b>cambiar cómo crece el tiempo al crecer las cifras</b>. Y las cifras son un logaritmo.' },
        ], { doneLabel: '¡Claro!' });
      },
    },

    {
      t: 'Dos reglas que vienen bien',
      html: `<p>Cerramos con las dos propiedades que uno se encuentra leyendo, y que son menos misteriosas de lo que
             parecen.</p>`,
      mount: el => {
        formula(el, {
          title: 'El logaritmo, pieza a pieza',
          parts: [
            { t: 'log(a · b)', id: 'p', color: 'cyan', name: 'el logaritmo de un producto', say: 'El logaritmo convierte las multiplicaciones en sumas: log(a·b) = log a + log b.', ex: 'log₂(8 · 4) = log₂32 = 5 = 3 + 2 ✓' },
            { t: '=' },
            { t: 'log a + log b', id: 's', color: 'green', name: 'la suma de los dos logaritmos', say: 'Es la razón por la que antes de las calculadoras se multiplicaba con tablas logarítmicas y reglas de cálculo: sumar es más fácil.', ex: 'Y en informática: duplicar los datos añade UN paso a la búsqueda binaria, no los duplica.' },
            { t: '·' },
            { t: 'log(aⁿ)', id: 'e', color: 'amber', name: 'el logaritmo de una potencia', say: 'Un exponente se convierte en un factor: log(aⁿ) = n · log a.', ex: 'log₂(2¹⁰) = 10 · log₂2 = 10 · 1 = 10 ✓' },
            { t: '=' },
            { t: 'n · log a', id: 'n', color: 'violet', name: 'el exponente baja', say: 'Es la regla que permite decir «el crecimiento exponencial, en escala logarítmica, es una recta».', ex: 'En un gráfico logarítmico 2ⁿ se convierte en una línea recta: la pendiente es log 2.' },
          ],
        });
      },
      after: `<div class="callout ok">No hace falta aprendérselas de memoria: basta recordar que el logaritmo <b>baja un
              piso</b> todo lo que toca: las multiplicaciones pasan a sumas, los exponentes pasan a factores. Por eso
              aparece siempre que los números se vuelven inmanejables.</div>`,
    },

    {
      t: 'De dónde viene',
      html: `<p>Los logaritmos no nacen en una clase de matemáticas: nacen de un <b>problema de fatiga</b>. En el siglo XVI
             los astrónomos pasaban días multiplicando números de ocho o diez cifras — posiciones de los planetas, rutas
             marítimas — y cada multiplicación a mano es una ocasión para equivocarse.</p>
             <p><b>John Napier</b>, en Escocia, trabajó veinte años en ello y en <b>1614</b> publicó las primeras tablas.
             La idea era exactamente la del último paso: si cada número se escribe como una <b>potencia</b>, multiplicar
             dos números pasa a ser <b>sumar</b> sus exponentes. Y sumar es algo que se hace sin equivocarse.</p>
             <p>Tres años después <b>Henry Briggs</b> fue a visitarlo y juntos eligieron la base 10, que hace cómodas las
             tablas con cifras decimales. De ahí salen la regla de cálculo, un siglo de navegación y — cuando llegaron
             los ordenadores — la forma estándar de medir lo que cuesta un algoritmo.</p>
             <div class="callout key">Se cuenta que Laplace decía que los logaritmos, «al reducir a pocos días el trabajo
             de muchos meses, duplicaron la vida de los astrónomos». Que es lo que hace un logaritmo también aquí: coge
             un crecimiento que explota y lo devuelve a una escala que una persona puede mirar.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> ¿Cuántos cúbits hacen falta para representar todas las respuestas posibles de un problema con mil
           millones de casos? <span class="muted">(pruébalo en el juego: la respuesta es 30)</span></p>
        <p><b>2.</b> Si un algoritmo clásico tarda N pasos y uno cuántico √N, ¿cuántas veces más rápido es con un millón
           de casos? ¿Y con mil millones? <span class="muted">(la respuesta crece, y por eso Grover importa)</span></p>
        <p><b>3.</b> Un número RSA de 2048 bits, ¿cuántas cifras decimales tiene, más o menos?
           <span class="muted">(pista: 2048 · log₁₀2 ≈ 2048 · 0,301)</span></p>
        <p class="mb0"><b>4.</b> Pregunta de inventor: si mañana se encontrara un algoritmo <b>clásico</b> polinómico en
           el número de cifras para factorizar, ¿qué pasaría con la ventaja de Shor?
           <span class="muted">(no está descartado: nadie ha demostrado nunca que factorizar sea difícil)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué es log₂(1024)?', options: ['1024 dividido entre 2', 'el número de veces que multiplicas 2 por sí mismo para llegar a 1024, es decir 10', '2 elevado a 1024', 'la mitad de 1024'], correct: 1,
      why: '2¹⁰ = 1024, así que log₂(1024) = 10. Las dos escrituras dicen lo mismo leídas desde cada lado.' },
    { q: '¿Cuántos bits hacen falta para distinguir 1000 cosas?', options: ['9', '10', '100', '1000'], correct: 1,
      why: 'Con 9 bits cubres 512 casos: no bastan. Con 10 cubres 1024: bastan, y son el mínimo. Siempre se redondea hacia arriba.' },
    { q: '¿Cuántas veces se puede dividir 1000 por la mitad antes de bajar a 1?', options: ['3', '10', '100', '500'], correct: 1,
      why: 'Diez: es el mismo número que los bits necesarios, porque es la misma pregunta recorrida al revés. Y es la razón por la que la búsqueda binaria hace 10 comparaciones en vez de 1000.' },
    { q: '¿Por qué «polinómico en el número de cifras» es tan importante?', options: ['porque es más elegante', 'porque el número de cifras es el logaritmo del número: crece lentísimamente mientras el número explota', 'porque las cifras siempre son pocas', 'porque evita los redondeos'], correct: 1,
      why: 'Un número de 600 cifras vale unos 10⁶⁰⁰. Un algoritmo que crece como una potencia de 600 es tratable; uno que crece como 10⁶⁰⁰ no lo es. Toda la ventaja de Shor vive en esa diferencia.' },
    { q: '¿Cuánto vale log(a · b)?', options: ['log a · log b', 'log a + log b', 'log a − log b', 'a · log b'], correct: 1,
      why: 'El logaritmo convierte los productos en sumas. Es la propiedad que hizo posibles las reglas de cálculo y las tablas logarítmicas, y la que endereza las curvas exponenciales en los gráficos logarítmicos.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Un logaritmo es «cuántas veces tengo que duplicar», que también es
          «cuántas veces puedo dividir por la mitad», que también es «cuántas cifras hacen falta». Con esto en la mano,
          «n cúbits para 2ⁿ amplitudes» y «polinómico en el número de cifras» dejan de ser fórmulas que hay que aguantar
          y pasan a ser frases que dicen algo preciso.</div>`,
});
@endsection
