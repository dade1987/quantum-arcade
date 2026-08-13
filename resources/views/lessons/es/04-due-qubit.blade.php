@php($description = 'De 2 amplitudes a 4: la puerta CNOT, la receta de Bell, el test de separabilidad y por qué el entrelazamiento hace imposible la simulación clásica.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { twoQubitLab } from '/js/widgets/quantum2.js';
import { confronto } from '/js/core/confronto.js';
import { bellCoppia } from '/js/widgets/coppie.js';
import { stepper, formula } from '/js/core/formula.js';

const L = renderLesson({
  id: '04-due-qubit',
  lead: `Con un cúbit teníamos 2 amplitudes. Con dos cúbits tenemos <b>4</b>, con tres <b>8</b>, con n cúbits <b>2^n</b>
         (¡las potencias de 2 del nivel 0·1!). Y sobre todo: aparece un fenómeno que en el mundo clásico no existe,
         el <b>entrelazamiento</b>.`,

  steps: [
    {
      t: 'Primero en clásico: dos bits, y las correlaciones que se pueden hacer',
      html: `<p>Dos bits clásicos tienen cuatro configuraciones: 00, 01, 10, 11. El ordenador guarda <b>una</b>.
             Hasta aquí nada nuevo.</p>
             <p>Pero los dos bits pueden estar <b>correlacionados</b>, y eso también se hace clásicamente. Mete
             dos papeles iguales en dos sobres — o los dos «0», o los dos «1» — mézclalos, y manda un sobre a
             Roma y otro a Sídney. Quien abre el de Roma sabe al instante qué hay en Sídney. No hay nada
             misterioso: <b>la información ya estaba en el sobre</b> desde que salió.</p>
             <p>Y lo que los sobres <b>no</b> saben hacer se puede medir, ahora mismo, con un juego. Alice y Bob
             están lejos y reciben una pregunta cada uno; ganan la ronda si sus respuestas guardan cierta relación
             con las preguntas. Con cualquier acuerdo tomado antes de separarse no se pasa del <b>75%</b> de
             rondas ganadas — pruébalos todos. Con un par entrelazado se llega al <b>85%</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bell', title: 'El adelantamiento del 75%', text: 'juega 100 rondas con los sobres, luego 100 con el entrelazamiento y supera el 78%.', xp: 45 });
        el.appendChild(m.root);
        bellCoppia(el, { onWin: () => m.complete() });
      },
      after: `<p>Ese adelantamiento es el experimento que ganó el Nobel de física en 2022. A partir de aquí,
             cuando dentro de poco leas «los dos cúbits entrelazados dan siempre el mismo resultado», sabrás que
             <b>no</b> es esa la parte sorprendente: los sobres ya lo hacen.</p>` +
             confronto({
               titolo: 'Correlación clásica y entrelazamiento',
               livello: 'k1-bit',
               vaiA: 'Repasa los bits (nivel K·1)',
               classico: {
                 titolo: 'Dos sobres cerrados',
                 html: `<p>El contenido está decidido <b>en la salida</b>. Abrir un sobre te dice el otro, pero no
                        cambia nada: solo estás leyendo algo ya escrito.</p>
                        <p class="mb0">Las correlaciones clásicas respetan un límite preciso (las
                        <b>desigualdades de Bell</b>): ciertas combinaciones de medidas nunca superan el 75% de
                        acuerdo.</p>`,
               },
               quantistico: {
                 titolo: 'Dos cúbits entrelazados',
                 html: `<p>El contenido <b>no está decidido</b> antes de la medida — y no es ignorancia nuestra,
                        está demostrado experimentalmente.</p>
                        <p class="mb0">Las mismas combinaciones de medidas llegan al <b>85%</b> de acuerdo. Es el
                        número que ganó el Nobel de física en 2022, y es la manera de distinguir, en el
                        laboratorio, un sobre de un entrelazamiento.</p>`,
               },
               numeri: [
                 { cosa: 'configuraciones posibles', classico: '4', quantistico: '4 amplitudes a la vez' },
                 { cosa: 'estado decidido antes de la medida', classico: 'sí', quantistico: 'no' },
                 { cosa: 'acuerdo máximo en el test de Bell', classico: '75%', quantistico: '~85% (medido)' },
               ],
               verdetto: `<b>«Correlacionados» no basta para explicar el entrelazamiento — los sobres están
                          correlacionados.</b> Lo que los sobres no pueden hacer es pasar del 75%, y los cúbits
                          lo hacen. A partir de ahí ninguna explicación «clásica pero escondida» se sostiene.`,
             }),
    },
    {
      t: 'Dos cúbits = cuatro posibilidades',
      html: `<p>Si tienes dos monedas, los resultados posibles son cuatro: CC, CX, XC, XX. Con dos cúbits es igual,
             solo que cada posibilidad tiene su <b>flecha</b>:</p>
             <div class="formula">|ψ⟩ = <span class="hl-n">a</span>|00⟩ + <span class="hl-k">b</span>|01⟩ + <span class="hl-N">c</span>|10⟩ + <span class="hl-x">d</span>|11⟩
             &nbsp;&nbsp; con &nbsp; |a|²+|b|²+|c|²+|d|² = 1</div>
             <p class="dim small">Convención usada en todo el curso: en la escritura |q₁q₀⟩ el cúbit <b>q0</b> es el
             de más a la derecha. Así que |10⟩ significa "q1 vale 1, q0 vale 0".</p>
             <p>Si los dos cúbits son independientes, las cuatro amplitudes se obtienen <b>multiplicando</b> las de cada uno
             (se llama <b>producto tensorial</b>, pero es solo "todas las combinaciones"):</p>
             <pre><code>cúbit A = a₀|0⟩ + a₁|1⟩        cúbit B = b₀|0⟩ + b₁|1⟩

juntos:   a₀b₀|00⟩ + a₀b₁|01⟩ + a₁b₀|10⟩ + a₁b₁|11⟩
          └── cada combinación: probabilidad de que pase A y pase B ──┘</code></pre>
             <p>Exactamente como "probabilidad de dos cosas juntas = se multiplican" del nivel 0·4. Nada nuevo… todavía.</p>`,
    },
    {
      t: 'La puerta CNOT: la primera puerta de dos cúbits',
      html: `<p>CNOT ("NOT controlado") mira un cúbit (el <b>control</b>) y, <b>solo si vale 1</b>, da la vuelta al otro
             (el <b>objetivo</b>). En tabla:</p>
             <table class="table">
               <tr><th>antes</th><th>después</th><th>qué ha pasado</th></tr>
               <tr><td class="mono">|00⟩</td><td class="mono">|00⟩</td><td>control 0 → no toca nada</td></tr>
               <tr><td class="mono">|01⟩</td><td class="mono">|11⟩</td><td>control 1 → da la vuelta al objetivo</td></tr>
               <tr><td class="mono">|10⟩</td><td class="mono">|10⟩</td><td>control 0 → nada</td></tr>
               <tr><td class="mono">|11⟩</td><td class="mono">|01⟩</td><td>control 1 → da la vuelta</td></tr>
             </table>
             <p class="dim small">(aquí el control es q0, el objetivo q1)</p>
             <div class="callout"><b>Nota para quien programa:</b> CNOT es <b>reversible</b> — aplicándola dos veces vuelves al punto
             de partida — y puede hacer de "copia" para los bits clásicos (si el objetivo parte de 0, acaba igual que el control).
             Es la puerta con la que Fredkin y Toffoli mostraban que se puede calcular sin destruir información.
             <b>Pero cuidado:</b> copia <i>bits</i>, no <i>estados cuánticos</i>. Sobre una superposición hace
             otra cosa muy distinta — y justo esa "otra cosa" es el entrelazamiento.</div>`,
    },
    {
      t: 'La receta de Bell: H + CNOT',
      html: `<p>Y ahora el momento clave. En el juego pulsa en secuencia <b>H q0</b> y luego <b>CNOT q0→q1</b>.
             Mira las barras de las amplitudes y las dos esferas de Bloch.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bell', title: 'Crea un estado de Bell', text: 'pulsa H q0 y luego CNOT q0→q1: el test de separabilidad tiene que señalar "entrelazados".', xp: 50 });
        el.appendChild(m.root);
        twoQubitLab(el, { onEntangle: () => m.complete() });
      },
      after: `<div class="callout key"><b>Qué ha pasado:</b> el estado es <code>(|00⟩ + |11⟩)/√2</code>.
              Solo dos posibilidades: <b>los dos 0</b> o <b>los dos 1</b>, al 50%. Nunca 01, nunca 10.<br><br>
              Y las dos esferas de Bloch se han <b>acortado hasta desaparecer</b>: tomados por separado, los dos cúbits ya no tienen
              ningún estado definido. <b>La información no está en las partes: está en la relación entre las partes.</b>
              Esto es el entrelazamiento.</div>`,
    },
    {
      t: 'Cómo se reconoce el entrelazamiento (la cuenta de verdad)',
      html: `<p>Un estado de dos cúbits es <b>separable</b> (= los dos cúbits son independientes) si y solo si se puede escribir
             como producto de dos estados sueltos. Hay un test rapidísimo:</p>
             <div class="formula">a·d − b·c = 0 &nbsp;→&nbsp; separable &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
             a·d − b·c ≠ 0 &nbsp;→&nbsp; <span class="hl-x">ENTRELAZADO</span></div>`,
      mount: el => {
        stepper(el, [
          { h: 'Ejemplo 1', html: 'Estado <code>(|00⟩ + |01⟩)/√2</code> → a = b = 1/√2, c = d = 0.<br>a·d − b·c = 0 − 0 = <b>0</b> → separable. De hecho es "q1 está a 0, q0 está en superposición": dos cúbits independientes.' },
          { h: 'Ejemplo 2 (Bell)', html: 'Estado <code>(|00⟩ + |11⟩)/√2</code> → a = d = 1/√2, b = c = 0.<br>a·d − b·c = 1/2 − 0 = <b>1/2 ≠ 0</b> → <b>ENTRELAZADO</b>.' },
          { h: 'Por qué funciona el test', html: 'Si el estado fuera un producto, tendrías a = a₀b₀, b = a₀b₁, c = a₁b₀, d = a₁b₁. Al hacer a·d obtendrías a₀b₀a₁b₁, y al hacer b·c obtendrías a₀b₁a₁b₀: ¡los mismos cuatro factores! La diferencia sería por fuerza cero.' },
          { h: 'La consecuencia física', html: 'Si el estado está entrelazado, midiendo <b>un solo</b> cúbit obtienes un resultado al azar, pero <b>determinas al instante</b> también el otro. Da igual lo lejos que estén.' },
          { h: 'El límite (¡importante!)', html: 'Esto NO permite transmitir información más rápido que la luz: quien está al otro lado solo ve resultados al azar. Se da cuenta únicamente <b>comparando los resultados</b>, y para compararlos hace falta una llamada normal. Volvemos a ello en el nivel 6.' },
        ], { doneLabel: '¡Test entendido!' });
      },
    },
    {
      t: 'Por qué el entrelazamiento es el recurso de verdad',
      html: `<p>Contemos los números necesarios para describir el estado:</p>
             <table class="table">
               <tr><th>Sistema</th><th>Descripción clásica</th><th>Descripción cuántica</th></tr>
               <tr><td>2 cúbits separables</td><td>2 + 2 números</td><td>2 + 2 números: basta describirlos uno a uno</td></tr>
               <tr><td>2 cúbits entrelazados</td><td>—</td><td><b>4 números</b>: no hay forma de descomponerlo</td></tr>
               <tr><td>50 cúbits entrelazados</td><td>—</td><td><b>2⁵⁰ ≈ 10¹⁵ números</b></td></tr>
             </table>
             <div class="callout key">Por eso simular un ordenador cuántico en un ordenador normal se vuelve
             imposible tan deprisa: ya con 50 cúbits tendrías que guardar en memoria mil billones de números complejos.
             <b>No es la superposición por sí sola lo que hace difícil el cálculo clásico: es el entrelazamiento.</b>
             (Un estado sin entrelazamiento, por muy en superposición que esté, se simula perfectamente en un portátil.)</div>
             <p class="dim">Curiosidad histórica: fue justo esta imposibilidad la que llevó a Richard Feynman a decir, en 1981,
             una frase que fundó el campo: «La naturaleza no es clásica, maldita sea, y si queréis simularla os conviene
             hacerla cuántica».</p>`,
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> Crea el estado de Bell y mide 200 veces: ¿cuántas veces sale 01 o 10? <span class="muted">(cero — siempre)</span></p>
        <p><b>2.</b> Prueba <b>H q0</b> y <b>H q1</b> (sin CNOT): ¿el test dice separable o entrelazado? ¿Por qué,
           si los dos están en superposición?</p>
        <p><b>3.</b> Tras crear Bell, aplica <b>Z q0</b>: ¿cambian las probabilidades? ¿Y el estado?
           <span class="muted">(se convierte en (|00⟩ − |11⟩)/√2: otro estado de Bell, invisible para las probabilidades)</span></p>
        <p class="mb0"><b>4.</b> ¿Consigues "deshacer" el entrelazamiento y volver a |00⟩? <span class="muted">(sí: CNOT y luego H — ¡las puertas son reversibles!)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Con 4 cúbits, ¿cuántas amplitudes describen el estado?',
      options: ['4', '8', '16', '32'], correct: 2,
      why: '2⁴ = 16. Cada cúbit añadido duplica el número de amplitudes.' },
    { q: 'El estado (|00⟩ + |11⟩)/√2, al medirlo, da…',
      options: ['siempre 00', '00 o 11, al 50%, nunca 01 ni 10', 'los cuatro resultados equiprobables', '01 o 10'], correct: 1,
      why: 'Las amplitudes de 01 y 10 son cero: esos resultados no salen nunca. Los dos cúbits están perfectamente correlacionados.' },
    { q: '¿Qué hace la CNOT cuando el control está en superposición?',
      options: ['da media vuelta al objetivo', 'crea entrelazamiento entre los dos cúbits', 'mide el control', 'no hace nada'], correct: 1,
      why: 'Con un control en superposición la CNOT ata los dos cúbits: el resultado ya no se puede descomponer en dos estados separados.' },
    { q: '¿Por qué simular 50 cúbits entrelazados en un PC es impracticable?',
      options: ['porque los cúbits son rápidos', 'porque harían falta 2⁵⁰ números complejos en memoria', 'porque la medida es aleatoria', 'porque faltan las bibliotecas'], correct: 1,
      why: 'Unas 10¹⁵ amplitudes: petabytes de memoria solo para escribir el estado. Es la observación de Feynman que puso en marcha la computación cuántica.' },
  ],

  outro: `<div class="callout ok"><b>Lo que te llevas a casa:</b> n cúbits = 2^n amplitudes; la CNOT ata los cúbits;
          un estado entrelazado no se puede describir cúbit a cúbit; el entrelazamiento — no la superposición sola —
          es lo que hace difícil imitar el cálculo cuántico. Ahora veamos qué <b>puedes</b> y qué <b>no puedes</b>
          hacer con él: no-clonación y teletransporte.</div>`,
});
@endsection
