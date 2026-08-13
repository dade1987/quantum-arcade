@php($description = 'La transformada de Fourier cuántica (QFT) explicada paso a paso: del circuito con Hadamard y rotaciones de fase controladas a la comparación con la DFT clásica, con simulador verificado.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { confronto } from '/js/core/confronto.js';
import { qftLab, qftPeriodLab } from '/js/widgets/qft.js';

const L = renderLesson({
  id: '18-qft',
  lead: `Ya estamos. Cogemos la DFT del nivel 16 y la aplicamos <b>no</b> a datos grabados,
         sino a las <b>amplitudes de un estado cuántico</b>. El resultado es la QFT: las mismas matemáticas, otro hardware,
         consecuencias enormes.`,

  steps: [
    {
      t: 'Primero en clásico: la DFT y la FFT, que ya sabes hacer',
      html: `<p>Los dos niveles anteriores te han dejado con dos algoritmos <b>clásicos</b> en el bolsillo, y
             conviene mirarlos bien una última vez antes de pasar a la versión cuántica.</p>
             <ul>
               <li>La <b>DFT</b> coge N números y devuelve N: para cada uno de ellos hace N multiplicaciones.
                   Total <b>N²</b>. Con N = 1024 son más de un millón de operaciones.</li>
               <li>La <b>FFT</b> da exactamente el mismo resultado partiendo el problema por la mitad, de forma
                   recursiva: <b>N·log₂N</b>. Con N = 1024 son unas 10.000 operaciones, cien veces menos.</li>
             </ul>
             <p>Son dos algoritmos normalísimos, que funcionan cada vez que abres un MP3 o haces una llamada.
             Y — este es el punto — <b>al final te dan los N números, escritos, para leerlos</b>.</p>` +
             confronto({
               titolo: 'Fourier: tres maneras de hacerla',
               livello: 'k5-costo',
               vaiA: 'Repasa los costes de los algoritmos (nivel K·5)',
               classico: {
                 titolo: 'DFT y FFT',
                 html: `<p>DFT: <b>N²</b> multiplicaciones. FFT: <b>N·log N</b>, y es una de las ideas más útiles
                        del siglo XX.</p>
                        <p class="mb0">Al final tienes <b>todos los N coeficientes</b> en memoria: los imprimes,
                        los comparas, los modificas, haces con ellos lo que quieras.</p>`,
               },
               quantistico: {
                 titolo: 'QFT',
                 html: `<p>Unas <b>log²N</b> puertas: con N = 2⁶⁰ son unos miles de puertas frente a un número de
                        operaciones clásicas mayor que la edad del universo en segundos.</p>
                        <p class="mb0">Pero los coeficientes siguen siendo <b>amplitudes</b>: no los puedes leer.
                        Mides, y sale <b>uno</b>, con probabilidad proporcional a su cuadrado.</p>`,
               },
               numeri: [
                 { cosa: 'N = 1024', classico: 'FFT: ~10.000 operaciones', quantistico: 'QFT: ~100 puertas' },
                 { cosa: 'resultados legibles', classico: 'los N', quantistico: 'uno, al azar, con peso' },
                 { cosa: 'sirve para', classico: 'mirar un espectro', quantistico: 'encontrar un periodo (Shor)' },
               ],
               verdetto: `<b>La QFT es enormemente más rápida y enormemente menos útil — tomada por sí sola.</b>
                          Se convierte en un arma solo cuando el espectro tiene <b>un único pico</b>, o poquísimos:
                          entonces esa única medida pesca casi con seguridad el número que hace falta. Y es
                          exactamente el caso de la búsqueda de periodo, es decir, de Shor.`,
             }),
    },
    {
      t: 'La misma fórmula, números distintos',
      html: `<p>Pongamos las dos cosas una al lado de la otra. Fíjate en que <b>solo cambia la primera columna</b>:</p>
             <table class="table">
               <tr><th>Fourier clásica (DFT)</th><th>Fourier cuántica (QFT)</th></tr>
               <tr><td>trabaja sobre N números guardados en memoria</td><td>trabaja sobre las 2^n <b>amplitudes</b> de n cúbits</td></tr>
               <tr><td><code>X(k) = Σ x(n)·e^{−2πikn/N}</code></td><td><code>|k⟩ ← Σ amplitud(n)·e^{+2πikn/N}/√N</code></td></tr>
               <tr><td>cuesta N² (o N·log N con la FFT)</td><td>cuesta unas <b>n²/2 puertas</b></td></tr>
               <tr><td>lees <b>todos</b> los N resultados</td><td>lees <b>un solo</b> resultado, al azar, midiendo</td></tr>
               <tr><td>sirve para analizar señales</td><td>sirve para hacer <b>interferir</b> y revelar <b>periodicidades</b></td></tr>
             </table>
             <div class="callout key"><b>La frase que hay que guardarse:</b> la QFT coge la información que está en la
             <b>posición</b> de las amplitudes y la traslada a su <b>fase</b> — y viceversa.
             No "calcula Fourier más rápido": <b>reorganiza</b> el estado de forma que, después, una medida
             revele algo que antes era invisible.</div>`,
    },
    {
      t: 'El ejemplo con 2 cúbits, todo escrito',
      html: `<p>Tomemos el estado <b>|01⟩</b>, es decir amplitudes <code>[0, 1, 0, 0]</code>. La QFT lo transforma en
             algo proporcional a:</p>
             <div class="formula">½ · [ <span class="hl-n">1</span> , <span class="hl-k">i</span> , <span class="hl-N">−1</span> , <span class="hl-x">−i</span> ]
             &nbsp;&nbsp;→&nbsp;&nbsp; cuatro flechas a <b>0°, 90°, 180°, 270°</b>: → ↑ ← ↓</div>
             <p>Mira lo que ha pasado:</p>
             <ul>
               <li><b>Antes:</b> una sola barra alta. La información estaba <b>en la posición</b> ("estoy en el estado 01").</li>
               <li><b>Después:</b> cuatro barras <b>todas iguales</b> (25% de probabilidad cada una), pero con <b>cuatro fases distintas</b>.
                   La información ha pasado <b>a las fases</b>.</li>
             </ul>
             <p>Si ahora midieras, obtendrías un resultado al azar entre cuatro: <b>parece</b> que lo has perdido todo.
             No es así: esas fases son exactamente lo que hace falta para que se cancelen las respuestas equivocadas
             en el paso siguiente del algoritmo. <b>La QFT nunca es el último paso de un algoritmo útil.</b></p>
             <p class="dim small">(Según el convenio de signo que se elija en la fórmula, podrías encontrarte
             escrito <code>[1, −i, −1, i]</code>. Solo cambia el sentido de rotación: la sustancia es idéntica.)</p>`,
    },
    {
      t: 'El circuito: tres ingredientes y ya está',
      html: `<p>La QFT se construye con puertas que ya conoces:</p>
             <ol>
               <li><b>Hadamard</b> sobre un cúbit — pone en juego las dos posibilidades (nivel 3);</li>
               <li><b>Rotaciones de fase controladas</b> <code>CP(π/2^k)</code> — rotan la fase <i>solo si</i> el otro cúbit es 1
                   (nivel 8 para la rotación, nivel 4 para el control);</li>
               <li><b>SWAP</b> finales — porque el circuito produce los cúbits en orden invertido.</li>
             </ol>
             <p>Mueve el deslizador "puertas aplicadas" y mira cómo las barras se transforman de puerta en puerta.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'qft', title: 'Ejecuta la QFT', text: 'lleva el circuito hasta el final y comprueba que coincide con la DFT clásica.', xp: 70 });
        el.appendChild(m.root);
        qftLab(el, { n: 3, x: 1, onWin: () => m.complete() });
      },
      after: `<div class="callout"><b>¿Por qué esas rotaciones justamente así?</b> Porque la fase que necesita el cúbit j
              depende de <b>todos</b> los bits menos significativos, cada uno con un peso reducido a la mitad: el primero aporta 180°,
              el segundo 90°, el tercero 45°… Es exactamente el modo en que un número binario "pesa" sus cifras.
              Las rotaciones controladas son la traducción cuántica de ese pesaje.</div>`,
    },
    {
      t: 'La cuenta de las puertas (donde está la ventaja)',
      html: ``,
      mount: el => {
        formula(el, {
          title: 'Cuántas puertas hacen falta para n cúbits',
          hint: 'Toca las piezas para entender de dónde sale la cuenta.',
          parts: [
            { t: 'n', id: 'n', color: 'cyan', name: 'número de cúbits', say: 'Sobre cada cúbit va una Hadamard: n puertas en total.' },
            { t: '+' },
            { t: 'n(n−1)/2', id: 'rot', color: 'violet', name: 'rotaciones controladas', say: 'El primer cúbit recibe n−1, el segundo n−2, y así sucesivamente: es la suma 1+2+…+(n−1).', ex: 'n = 10 → 45 rotaciones controladas.' },
            { t: '+' },
            { t: 'n/2', id: 'sw', color: 'green', name: 'SWAP finales', say: 'Sirven para devolver los cúbits al orden correcto. A menudo se evitan por completo, simplemente leyendo los cúbits al revés.' },
            { t: '≈' },
            { t: 'n²/2', id: 'tot', color: 'amber', name: 'total', say: 'Crece como el CUADRADO del número de cúbits, mientras que el número de amplitudes transformadas crece como 2^n. Es un crecimiento ridículamente lento comparado con lo que maneja.', ex: 'n = 20 cúbits → 1.048.576 amplitudes transformadas con unas 210 puertas.' },
          ],
        });
      },
      after: `<div class="callout warn"><b>Y aquí la trampa, otra vez (pero ahora estás equipado para verla).</b>
              Con 210 puertas tocas un millón de amplitudes. Pero <b>no las puedes leer</b>: la medida devuelve una sola,
              elegida al azar. No has "calculado la FFT de un millón de números en 210 pasos": has <b>reorganizado</b>
              un millón de amplitudes de forma que una cierta <b>propiedad global</b> se vuelva muy probable.
              ¿Qué propiedad? El próximo paso lo enseña.</div>`,
    },
    {
      t: 'Aquello para lo que existe la QFT: periodicidad → picos',
      html: `<p>Preparemos un estado "de peine": amplitudes distintas de cero <b>cada r posiciones</b>
             (exactamente lo que producirá el algoritmo de Shor). Luego aplicamos la QFT.</p>
             <p>El resultado es la razón por la que existe toda esta construcción:</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'periodo', title: 'De peine a picos', text: 'prueba al menos dos periodos distintos y observa dónde acaban los picos.', xp: 60 });
        el.appendChild(m.root);
        qftPeriodLab(el, { n: 4, onWin: () => m.complete() });
      },
      after: `<div class="callout key"><b>Las dos propiedades de oro:</b>
              <ol style="margin:8px 0 0">
                <li>periodo <b>r</b> en el estado de partida → picos sobre los <b>múltiplos de N/r</b> tras la QFT.
                    Midiendo un pico y haciendo dos cuentas, <b>obtienes r</b>.</li>
                <li>el <b>desfase inicial</b> del peine (desde dónde empieza) <b>no mueve los picos</b>.
                    Es una suerte enorme: significa que se puede medir a mitad del algoritmo algo aleatorio
                    sin estropear la información útil.</li>
              </ol></div>`,
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> Aplica la QFT al estado |000⟩ (todo ceros): ¿qué obtienes? <span class="muted">(la superposición uniforme: la QFT de una "constante" es un solo pico, y viceversa)</span></p>
        <p><b>2.</b> ¿Y al estado |100⟩? Mira el dibujo de las fases: ¿cuántas veces "gira" mientras recorres las barras?</p>
        <p><b>3.</b> En el juego del peine, prueba r = 3 con N = 16: los picos ya no caen sobre números enteros.
           ¿Qué les pasa a las barras? <span class="muted">(se ensanchan — es el motivo por el que Shor necesita las fracciones continuas)</span></p>
        <p class="mb0"><b>4.</b> Como inventor: ¿qué otra propiedad "global" de un estado te gustaría convertir en un pico?
           Si encuentras una transformación unitaria que lo haga, tienes un algoritmo nuevo.</p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué le hace la QFT a la información contenida en un estado?',
      options: ['la borra', 'la traslada de la posición de las amplitudes a sus fases (y viceversa)', 'la copia', 'la mide'], correct: 1,
      why: 'De |01⟩ (una sola barra) se pasa a cuatro barras iguales con cuatro fases distintas: la información está toda ahí, pero escrita en otro sitio.' },
    { q: '¿De qué puertas se compone el circuito de la QFT?',
      options: ['solo CNOT', 'Hadamard, rotaciones de fase controladas y SWAP', 'solo medidas', 'X e Y'], correct: 1,
      why: 'Una H por cúbit, luego rotaciones de fase controladas por los cúbits menos significativos, y al final los SWAP para restablecer el orden.' },
    { q: '¿Cuántas puertas hacen falta para la QFT sobre n cúbits?',
      options: ['2^n', 'unas n²/2', 'n·log n', 'siempre 10'], correct: 1,
      why: 'n Hadamard + n(n−1)/2 rotaciones + los SWAP: con 20 cúbits bastan unas 210 puertas para un millón de amplitudes.' },
    { q: 'Si un estado tiene periodo r, tras la QFT los picos se encuentran…',
      options: ['en los múltiplos de r', 'en los múltiplos de N/r', 'siempre en 0', 'al azar'], correct: 1,
      why: 'Periodo pequeño → picos separados, periodo grande → picos juntos. Es la relación inversa entre periodo y frecuencia del nivel 13.' },
    { q: '¿Por qué la QFT no sirve para calcular el espectro de un archivo de audio?',
      options: ['porque es imprecisa', 'porque al medir se lee un solo resultado, no el espectro entero', 'porque es lenta', 'porque solo funciona con 2 cúbits'], correct: 1,
      why: 'Transforma todas las amplitudes con poquísimas puertas, pero la medida devuelve una sola: sirve para organizar interferencias, no para producir listas de números legibles.' },
  ],

  outro: `<div class="callout ok"><b>Lo que te llevas a casa:</b> la QFT es la DFT aplicada a las amplitudes;
          cuesta n²/2 puertas; traslada la información entre posición y fase; convierte <b>periodicidad</b> en <b>picos de probabilidad</b>.
          Próximo nivel: usarla al revés para leer una fase escondida — la última pieza antes de Shor.</div>`,
});
@endsection
