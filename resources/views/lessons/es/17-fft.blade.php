@php($description = 'Por qué la FFT cuesta N·log N en vez de N²: divide y vencerás explicado paso a paso, con la comparación directa con las puertas de la QFT cuántica.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { costLab, butterflyLab } from '/js/widgets/fftlab.js';

const L = renderLesson({
  id: '17-fft',
  lead: `La DFT del nivel 16 es correcta pero lenta: para N números hace N×N multiplicaciones. La <b>FFT</b> obtiene
         el mismísimo resultado con muchas menos operaciones. Entender <i>por qué</i> es importante, porque la QFT
         cuántica usa el mismo truco — llevado mucho más lejos.`,

  steps: [
    {
      t: 'El problema: N² crece fatal',
      html: `<p>Relee la fórmula del nivel 16: para <b>cada</b> frecuencia k tienes que sumar <b>N</b> trozos. Y las frecuencias
             que hay que probar son N. Total: <b>N × N</b> operaciones.</p>
             <table class="table">
               <tr><th>N (muestras)</th><th>DFT directa (N²)</th><th>Tiempo orientativo</th></tr>
               <tr><td class="mono">8</td><td class="mono">64</td><td>instantáneo</td></tr>
               <tr><td class="mono">1.024</td><td class="mono">1.048.576</td><td>unos milisegundos</td></tr>
               <tr><td class="mono">1.000.000</td><td class="mono">1.000.000.000.000</td><td>horas</td></tr>
             </table>
             <p>Un archivo de audio de pocos segundos ya tiene cientos de miles de muestras: con la DFT directa,
             cada análisis requeriría horas. Con la FFT, milisegundos. Es la diferencia entre "imposible" y "lo hace tu móvil
             mientras cantas en el karaoke".</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'costi', title: 'La cuenta que lo cambia todo', text: 'lleva el deslizador a al menos 16 cúbits y compara los tres números: DFT, FFT y puertas de la QFT.', xp: 35 });
        el.appendChild(m.root);
        costLab(el, { onWin: () => m.complete() });
      },
    },
    {
      t: 'El truco: pares e impares',
      html: `<p>La idea (Cooley y Tukey, 1965 — ¡pero ya intuida por Gauss en 1805!) es esta:</p>
             <div class="callout key">Una DFT sobre <b>N</b> puntos se puede obtener a partir de <b>dos</b> DFT sobre <b>N/2</b> puntos:
             una sobre las muestras de posición <b>par</b>, otra sobre las de posición <b>impar</b>. Luego bastan N combinaciones finales
             para volver a juntar los resultados.</div>
             <p>¿Por qué compensa? Porque dos problemas de la mitad cuestan 2 × (N/2)² = N²/2: <b>ya la mitad</b>.
             Y lo mismo se puede repetir dentro de cada una de las dos mitades. Y dentro de sus mitades. Y así sucesivamente.</p>
             <p>¿Cuántas veces se puede partir N por la mitad antes de llegar a 1? Exactamente <b>log₂N</b> veces
             (para N = 1024 son 10 veces). De ahí sale el famoso <b>N·log N</b>.</p>`,
      mount: el => butterflyLab(el),
      after: `<div class="callout"><b>La fórmula del "volver a juntar":</b>
              <code>X(k) = Par(k) + e^{−i2πk/N} · Impar(k)</code><br>
              Esa <b>e^{−i2πk/N}</b> es nuestra flecha rotatoria del nivel 8 (en la jerga se llama <i>twiddle factor</i>):
              sirve para rotar la contribución de los impares antes de sumarla. Cada combinación de este tipo se llama
              <b>mariposa</b>, por cómo se dibuja el esquema.</div>`,
    },
    {
      t: '¿Y la QFT? El mismo truco, pero sobre amplitudes',
      html: `<p>Ahora la comparación que nos llevará directos a la parte cuántica. Mira los tres números del juego de arriba
             para N = 2^20 (alrededor de un millón):</p>
             <table class="table">
               <tr><th>Método</th><th>Operaciones</th><th>Qué obtienes</th></tr>
               <tr><td>DFT directa</td><td class="mono">~10¹²</td><td>todos los resultados, legibles</td></tr>
               <tr><td>FFT</td><td class="mono">~10⁷</td><td>todos los resultados, legibles</td></tr>
               <tr><td><b>QFT</b> (cuántica)</td><td class="mono">~210 puertas</td><td><b>un solo resultado</b> cuando mides</td></tr>
             </table>
             <div class="callout warn"><b>No piques:</b> la QFT no es "una FFT 50.000 veces más rápida".
             La QFT transforma un millón de amplitudes con doscientas puertas, pero <b>esas amplitudes no las puedes leer</b>:
             la medida te devuelve una sola, elegida al azar según las probabilidades.
             <br><br>La QFT sirve cuando te interesa una <b>propiedad global</b> — típicamente una <b>periodicidad</b> —
             que, tras la transformada, se convierte en el resultado <b>más probable</b>. No sirve para imprimir el espectro de un MP3.</div>
             <p>Esta distinción es lo que separa a quien ha entendido la computación cuántica de quien repite eslóganes.
             Agárrate a ella: volveremos a insistir en el nivel 18.</p>`,
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el juego de los costes, encuentra el valor de n por encima del cual la DFT directa supera los mil millones de operaciones.</p>
        <p><b>2.</b> La FFT clásica exige que N sea una potencia de 2. ¿Por qué, según tú? <span class="muted">(pista: partir por la mitad)</span></p>
        <p><b>3.</b> Con 30 cúbits tendrías más de mil millones de amplitudes y la QFT usaría unas 465 puertas.
           Si pudieras leerlas todas, habrías batido a la FFT por un factor enorme. ¿Por qué el "si" es imposible?</p>
        <p class="mb0"><b>4.</b> Una pregunta para dejar abierta hasta el nivel 18: ¿qué <b>pregunta</b> podrías hacerle a un millón
           de amplitudes, de forma que la respuesta sea <b>un solo número</b>?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Cuál es el coste típico de la FFT sobre N puntos?',
      options: ['N', 'N log N', 'N²', '2^N'], correct: 1,
      why: 'log₂N niveles de partición por la mitad, N operaciones por nivel. Para N = 1024: unas 5.120 mariposas frente a 1.048.576 multiplicaciones.' },
    { q: '¿En qué se basa el truco de la FFT?',
      options: ['aproxima el resultado', 'divide el problema en muestras pares e impares', 'usa números reales en vez de complejos', 'ignora las frecuencias altas'], correct: 1,
      why: 'Es divide y vencerás, y el resultado es <b>exacto</b>, no aproximado: idéntico al de la DFT directa.' },
    { q: '¿Por qué la QFT no sustituye a la FFT para analizar un archivo de audio?',
      options: ['porque es menos precisa', 'porque al medir se obtiene un solo resultado, no toda la lista', 'porque es más lenta', 'porque solo sirve para los números primos'], correct: 1,
      why: 'Transforma todas las amplitudes con poquísimas puertas, pero leerlas todas es imposible: la medida devuelve una sola. Sirve para hacer interferir, no para imprimir.' },
  ],

  outro: `<div class="callout ok"><b>¡Parte C completada!</b> Tienes ondas, fase, suma de ondas, DFT y FFT: la herramienta está lista.
          En la Parte D la montamos dentro de un circuito cuántico y nace la <b>QFT</b>.</div>`,
});
@endsection
