@php($description = 'Ecuaciones explicadas con la balanza, fórmulas inversas deducidas paso a paso y funciones como máquinas: cuándo se puede volver atrás y cuándo la información se ha perdido. La base de la reversibilidad y de las puertas cuánticas.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { bilanciaLab, macchinaLab } from '/js/widgets/equazioni.js';

const L = renderLesson({
  id: '00-equazioni',
  lead: `Este nivel responde a dos preguntas que parecen de colegio y no lo son. La primera: <b>¿qué significa
         «resolver» una ecuación?</b> (respuesta: casi nada de lo que te contaron — la x no se «encuentra», se
         <b>saca a la vista</b>). La segunda: <b>¿cuándo se puede volver atrás?</b> Esa segunda pregunta, jugada con
         máquinas de números enteros, es exactamente lo que en lo cuántico se llama reversibilidad, y es la razón por
         la que las puertas están hechas como están hechas.`,

  steps: [
    {
      t: 'Qué es una ecuación (y qué significa resolverla)',
      html: `<p>Empieza por el signo <b>=</b>. No significa «ahora calcula»: significa <b>estas dos cosas pesan lo
             mismo</b>. Una ecuación es una balanza en equilibrio, y ya está.</p>
             <p>En <code>2x + 3 = 11</code> a la izquierda hay dos cajas cerradas — cada una contiene el mismo número,
             que no conocemos — más tres pesas de uno. A la derecha hay once pesas. Las dos partes están en
             equilibrio: <b>es un hecho</b>, no una pregunta.</p>
             <div class="callout key">Entonces, ¿qué significa «resolver»? Significa <b>quitar de en medio todo lo que
             rodea a la caja</b>, hasta que a la izquierda quede una sola caja. En ese momento el otro platillo te dice
             cuánto pesa. La x no ha cambiado: ya estaba ahí, ya valía ese número. Solo se ha vuelto visible.</div>
             <p>Y la regla para hacerlo es una sola:</p>
             <div class="formula">lo que le haces a un platillo, <span class="hl-n">se lo tienes que hacer al otro</span></div>
             <p>Si lo haces, la balanza sigue en equilibrio y la respuesta no se mueve. Si no lo haces, has escrito algo
             falso. En el juego la barra no se inclina nunca: ese es el punto.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bilancia', title: 'Saca la x a la vista', text: 'resuelve 3 ecuaciones manteniendo la balanza en equilibrio.', xp: 35 });
        el.appendChild(m.root);
        bilanciaLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Mira la línea «la x vale…» mientras juegas: <b>no cambia nunca</b>, jugada tras jugada. Es la prueba de
              que las jugadas no resuelven nada: solo dejan claro algo que ya era cierto.</p>
              <div class="callout key">La palabra <b>álgebra</b> nace justo aquí. Viene del título de un libro de
              al-Juarismi, hacia el año 820: <i>al-yabr</i> significa «recomponer», es decir, mover una pieza de un
              platillo al otro sin romper el equilibrio. Mil doscientos años después, estás haciendo lo mismo con el
              ratón.</div>`,
    },

    {
      t: 'Girar una fórmula: las fórmulas inversas',
      html: `<p>Una fórmula es una balanza ya escrita. «Girarla» significa usar las mismas jugadas para despejar otra
             letra en lugar de la x.</p>
             <p>Un ejemplo que conoces: el área de un rectángulo es <code>A = b · h</code>. Si conoces el área y la base
             y quieres la altura, divides los dos platillos entre b y obtienes <code>h = A / b</code>. No has aprendido
             una fórmula nueva: has hecho <b>una jugada</b> sobre la vieja.</p>
             <p>Ahora las tres fórmulas del curso que te tocará girar, desmontadas una a una:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Con n bits eliges entre 2ⁿ', html: 'La fórmula es <b>N = 2ⁿ</b>. Si sabes cuántos bits tienes (n), el número de posibilidades sale solo. Pero a menudo hace falta lo contrario.' },
          { h: 'Gírala', html: 'Si sabes cuántas posibilidades necesitas (N) y quieres saber cuántos bits hacen falta, la jugada que «deshace» la potencia se llama <b>logaritmo</b>: <b>n = log₂N</b>. Con N = 1024 → n = 10. Es el nivel siguiente, y es todo lo que hay.' },
          { h: 'La regla del cúbit', html: 'La regla es <b>α² + β² = 1</b> (las dos probabilidades suman el 100%). Si conoces α y quieres β, quita α² de los dos platillos: <b>β² = 1 − α²</b>, y luego la raíz: <b>β = √(1 − α²)</b>.' },
          { h: 'Una cuenta de verdad', html: 'Con α = 0,6: β² = 1 − 0,36 = 0,64, así que β = 0,8. Compruébalo: 0,6² + 0,8² = 0,36 + 0,64 = 1 ✓.' },
          { h: 'La fase de una vuelta', html: 'En la transformada de Fourier aparece siempre <b>θ = 2π·k/N</b>. Si sabes el ángulo y quieres saber a qué k corresponde, multiplicas los dos platillos por N y divides entre 2π: <b>k = θ·N / (2π)</b>.' },
          { h: 'La clave', html: 'Son siempre las mismas tres jugadas: <b>suma o resta</b> lo mismo a ambos lados, <b>multiplica o divide</b> ambos lados, o <b>aplica a ambos lados</b> la misma operación, siempre que se pueda deshacer (raíz, logaritmo). Nada más.' },
        ], { doneLabel: '¡Claro!' });
      },
      after: `<div class="callout warn"><b>Un aviso que vale un nivel:</b> esa última jugada solo funciona con
              operaciones <b>que se pueden deshacer</b>. Elevar al cuadrado, por ejemplo, no se deshace del todo: de
              β² = 0,64 sale β = 0,8 <b>o bien</b> β = −0,8, y cuál era ya no se sabe. Y ese es precisamente el
              siguiente paso.</div>`,
    },

    {
      t: 'Las funciones son máquinas (y algunas no vuelven atrás)',
      html: `<p>Una <b>función</b> es una máquina que toma un número y devuelve otro. Las reglas son dos, y son todas:</p>
             <ul>
               <li>a cada número que entra le corresponde <b>una sola</b> salida (si no, no es una máquina, es un dado);</li>
               <li>el conjunto de números que <b>pueden</b> entrar se llama <b>dominio</b>: «÷0» no vale, ni la raíz de
                   un número negativo, mientras nos quedemos en los números normales.</li>
             </ul>
             <p>Hasta aquí, obvio. La pregunta interesante es otra, y el juego va todo sobre ella:</p>
             <div class="callout key"><b>Mirando solo la salida, ¿se puede saber qué había entrado?</b></div>
             <p>Para algunas máquinas sí, siempre: si te digo que la salida es 10 y la máquina duplica, entró 5. Para
             otras no, y no por pereza: <b>es imposible</b>. Si la máquina eleva al cuadrado y la salida es 9, entró 3 o
             entró −3, y ninguna información del mundo puede decirte cuál, porque esa información <b>ya no
             existe</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'macchine', title: 'Quién vuelve atrás y quién no', text: 'clasifica correctamente 4 máquinas.', xp: 40 });
        el.appendChild(m.root);
        macchinaLab(el, { need: 4, onWin: () => m.complete() });
      },
      after: `<p>El criterio que has usado tiene nombre: una máquina se puede recorrer hacia atrás si y solo si <b>nunca
              manda dos números distintos al mismo sitio</b>. Cuando dos entradas chocan, a partir de ahí son
              indistinguibles.</p>
              <p>Y hay una forma de decirlo que merece la pena guardar: <b>una máquina que pierde información no se
              puede invertir</b>. No es una limitación técnica: es la definición.</p>`,
    },

    {
      t: 'Por qué todo esto se vuelve cuántico',
      html: `<p>Ahora juntemos las dos mitades del nivel, y el resultado es más fuerte de lo que parece.</p>
             <p>Las puertas lógicas de un ordenador normal — AND, OR — son máquinas <b>sin vuelta</b>: de un AND que
             vale 0 no sabes si las entradas eran 0 y 0, 0 y 1, o 1 y 0. Tres situaciones distintas, una sola salida:
             información perdida en cada operación.</p>
             <p>Las puertas cuánticas, en cambio, <b>tienen</b> que volver atrás. Siempre. Y la razón la puedes deducir
             tú, con una fórmula girada:</p>`,
      mount: el => {
        formula(el, {
          title: 'La cadena, en cuatro piezas',
          parts: [
            { t: 'probabilidad = amplitud²', id: 'p', color: 'cyan', name: 'la regla de Born', say: 'Cada posibilidad tiene una amplitud; la probabilidad de verla es su cuadrado.', ex: 'Amplitud 0,6 → probabilidad 0,36.' },
            { t: '→' },
            { t: 'suma = 1', id: 's', color: 'amber', name: 'las probabilidades suman 100%', say: 'La suma de los cuadrados de todas las amplitudes tiene que dar 1: algo tiene que pasar.', ex: '0,6² + 0,8² = 1 ✓' },
            { t: '→' },
            { t: 'longitud fija', id: 'l', color: 'green', name: 'la flecha del estado mide 1', say: 'Suma de cuadrados = 1 es Pitágoras: la flecha que representa el estado tiene siempre la misma longitud.', ex: 'En el nivel de las matrices es el círculo del que la flecha no sale nunca.' },
            { t: '→' },
            { t: 'se vuelve atrás', id: 'r', color: 'violet', name: 'la puerta es invertible', say: 'Una máquina que no aplasta ni alarga nada no puede mandar dos estados distintos al mismo sitio: así que siempre se puede recorrer hacia atrás.', ex: 'Por eso no existe una puerta cuántica «AND» como la clásica: tiraría información.' },
          ],
        });
      },
      after: `<div class="callout ok">Esta cadena es todo el puente entre la matemática de secundaria y lo cuántico:
              <b>probabilidades que suman 100% → longitud que no cambia → máquina que se puede invertir</b>. En el nivel
              de la reversibilidad la encuentras por el lado de la información, en el de las matrices por el lado de la
              geometría. Es la misma frase dicha en tres idiomas.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En la ecuación <code>3x = x + 8</code> no basta con quitar pesas: hay que quitar <b>una caja</b> de
           los dos platillos. ¿Por qué es una jugada legal?</p>
        <p><b>2.</b> Gira tú esta fórmula: <code>v = s / t</code>. Despeja <b>t</b>. ¿Qué jugada has hecho, y sobre qué
           platillo?</p>
        <p><b>3.</b> La máquina «resto de la división entre 4» manda 1, 5, 9, 13… todos al mismo sitio. ¿Dónde has visto
           ya esta máquina? <span class="muted">(pista: el reloj del nivel 0·5)</span></p>
        <p class="mb0"><b>4.</b> Pregunta de inventor: la máquina «×0» tira <b>todo</b>. Si una puerta cuántica pudiera
           hacer eso, ¿qué le pasaría a la suma de las probabilidades?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué significa el signo «=» en una ecuación?', options: ['ahora calcula el resultado', 'las dos partes valen lo mismo', 'la x está a la izquierda', 'el número mayor está a la derecha'], correct: 1,
      why: 'Es una balanza en equilibrio: los dos lados pesan lo mismo. Resolver no cambia ese hecho, solo lo hace legible aislando la x.' },
    { q: '¿Por qué una jugada hay que hacerla en los dos lados?', options: ['por costumbre', 'porque si no la igualdad deja de ser cierta', 'para ir más rápido', 'solo cuando hay fracciones'], correct: 1,
      why: 'Quitar peso de un solo platillo desequilibra la balanza: lo que quedaría escrito sería falso, y la respuesta ya no sería la de antes.' },
    { q: 'De A = b · h, ¿cómo se despeja h?', options: ['h = A · b', 'h = A / b', 'h = A − b', 'h = b / A'], correct: 1,
      why: 'Se dividen ambos lados entre b: a la izquierda queda h, a la derecha A/b. Es la misma jugada de la balanza aplicada a una fórmula.' },
    { q: '¿Cuándo se puede recorrer hacia atrás una máquina (función)?', options: ['cuando los números son pequeños', 'cuando nunca manda dos entradas distintas a la misma salida', 'cuando solo usa sumas', 'siempre'], correct: 1,
      why: 'Si dos entradas distintas dan la misma salida, desde la salida es imposible saber de cuál venías: esa información ya no existe.' },
    { q: '¿Por qué toda puerta cuántica tiene que ser invertible?', options: ['por convenio de los físicos', 'porque conserva la longitud de la flecha de estado y por tanto no puede aplastar dos estados distintos en uno', 'porque es más rápida', 'porque si no hacen falta más cúbits'], correct: 1,
      why: 'Probabilidad = amplitud² y la suma tiene que dar 1: la flecha del estado siempre mide 1. Una máquina que no cambia las longitudes no puede hacer chocar dos estados, así que siempre se puede invertir.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Una ecuación es una balanza, resolverla significa sacar a la vista lo
          que ya estaba, girar una fórmula son las mismas tres jugadas, y una máquina vuelve atrás solo si no pierde
          información por el camino. Esa última frase es la que el resto del curso llamará, según el momento,
          reversibilidad o unitariedad.</div>`,
});
@endsection
