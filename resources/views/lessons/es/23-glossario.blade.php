@php($description = 'Glosario completo de la informática cuántica en español: amplitud, fase, cúbit, entrelazamiento, oráculo, QFT, decoherencia y todos los términos del curso, con el mapa que los conecta.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { nOf } from '/js/core/levels.js';   // i numeri di livello si calcolano, non si scrivono

const L = renderLesson({
  id: '23-glossario',
  lead: `Todo el vocabulario en una sola página, en el orden en que te lo has encontrado — así puedes volver cada vez
         que se te escape una palabra. Al final está el <b>hilo</b> completo: cómo se llega de "2 + 2" a Shor sin saltos.`,

  steps: [
    {
      t: 'El hilo conductor, de principio a fin',
      html: `<pre style="line-height:1.75"><code>números con signo (0·1)
   └─ probabilidad = cuadrado (0·1) ───────────────┐
coordenadas y grados (0·2)                         │
   └─ flecha = punto = pareja de números           │
seno y coseno = sombras de un punto que gira (0·3) │
probabilidad y frecuencias (0·4)                   │
                                                   ▼
CÚBIT = dos amplitudes (1) ── medida → |amplitud|² ─┘
   ├─ esfera de Bloch: latitud = probabilidad, longitud = fase (2)
   ├─ puertas = rotaciones; H·Z·H = X (3)
   ├─ dos cúbits → 4 amplitudes → ENTRELAZAMIENTO (4)
   ├─ circuitos (5)
   └─ no-clonación → teletransporte (6)
                    │
INTERFERENCIA: las amplitudes se suman, luego se eleva al cuadrado (7)
   └─ dos signos no bastan → FLECHAS COMPLEJAS, e^{iθ} (8)
                    │
   ├─ oráculo: escribe en las fases → Deutsch–Jozsa (9)
   ├─ cadena secreta en las fases → Bernstein–Vazirani (10)
   └─ amplificación → Grover (11)
                    │
ONDAS: amplitud, periodo, frecuencia (${nOf('13-onde')}) → fase (${nOf('14-fase')}) → suma de ondas (${nOf('15-somma-onde')})
   └─ DFT: "rota y suma" encuentra las periodicidades (${nOf('16-dft')}) → FFT (${nOf('17-fft')})
                    │
QFT = DFT sobre las amplitudes, con n²/2 puertas (${nOf('18-qft')})
   ├─ QPE: leer una fase como número (${nOf('19-qpe')})
   └─ SHOR: periodo → picos → fracciones continuas → factores (${nOf('20-shor')})
                    │
ruido y corrección de errores (${nOf('21-rumore')}) · taller creativo (${nOf('22-officina')}) · examen (${nOf('24-esame')})</code></pre>
             <div class="callout key"><b>Si tuviera que resumir el curso entero en una frase:</b>
             «Un ordenador cuántico explora todas las posibilidades a la vez y organiza las <b>fases</b> de forma que
             las respuestas equivocadas se <b>cancelen</b> y la correcta se vuelva <b>muy probable</b>.»
             Todo lo demás son detalles técnicos sobre cómo se organizan esas fases.</div>`,
    },
    {
      t: 'Glosario A–Z',
      html: `
        <table class="table">
          <tr><th style="width:26%">Término</th><th>Qué significa (en castellano de verdad)</th><th style="width:12%">Nivel</th></tr>
          <tr><td><b>Amplitud</b></td><td>El número (en general una flecha compleja) asociado a un resultado posible. Su <b>cuadrado</b> es la probabilidad. Puede ser negativa: de ahí la interferencia.</td><td>${nOf('01-qubit')}</td></tr>
          <tr><td><b>Amplitud (de una onda)</b></td><td>Cómo de alta es una onda; en el sonido es el volumen.</td><td>${nOf('13-onde')}</td></tr>
          <tr><td><b>Autoestado / autovalor</b></td><td>Estado que una operación deja idéntico salvo por una fase; esa fase es el autovalor.</td><td>${nOf('19-qpe')}</td></tr>
          <tr><td><b>Base de medida</b></td><td>La "dirección" a lo largo de la cual se mide. Medir en base Z da 0/1; en base X da +/−. No existe un estado que sea seguro en todas las bases.</td><td>${nOf('02-bloch')}</td></tr>
          <tr><td><b>Bloch (esfera de)</b></td><td>Mapa de todos los estados de un cúbit: norte |0⟩, sur |1⟩, ecuador las superposiciones al 50%.</td><td>${nOf('02-bloch')}</td></tr>
          <tr><td><b>Born (regla de)</b></td><td>Probabilidad = |amplitud|². El puente entre las matemáticas y el laboratorio.</td><td>${nOf('01-qubit')}</td></tr>
          <tr><td><b>Bra-ket</b></td><td>Notación |ψ⟩ para los estados (ket) y ⟨ψ| para los "duales" (bra). Es solo una caja para decir "esto es un estado".</td><td>${nOf('01-qubit')}</td></tr>
          <tr><td><b>CNOT</b></td><td>Puerta de dos cúbits: da la vuelta al objetivo solo si el control vale 1. Sobre una superposición crea entrelazamiento.</td><td>${nOf('04-due-qubit')}</td></tr>
          <tr><td><b>Decoherencia</b></td><td>El entorno "mide" involuntariamente el sistema y destruye las fases. El enemigo número uno del hardware.</td><td>${nOf('21-rumore')}</td></tr>
          <tr><td><b>Codificación densa</b></td><td>Mandar 2 bits clásicos transmitiendo 1 cúbit, aprovechando entrelazamiento ya compartido.</td><td>${nOf('06-teletrasporto')}</td></tr>
          <tr><td><b>DFT</b></td><td>Transformada discreta de Fourier: "rota cada dato y suma" para descubrir las periodicidades.</td><td>${nOf('16-dft')}</td></tr>
          <tr><td><b>Difusor</b></td><td>En Grover: refleja las amplitudes alrededor de la media, amplificando la marcada.</td><td>${nOf('11-grover')}</td></tr>
          <tr><td><b>Entrelazamiento</b></td><td>Estado de varios cúbits que no se puede describir cúbit a cúbit: la información está en la relación.</td><td>${nOf('04-due-qubit')}</td></tr>
          <tr><td><b>Fase</b></td><td>"En qué punto de la vuelta estás". No cambia las probabilidades, pero decide qué se cancelará. El ingrediente secreto de todo.</td><td>${nOf('01-qubit') + ', ' + nOf('02-bloch') + ', ' + nOf('08-frecce') + ', ' + nOf('14-fase')}</td></tr>
          <tr><td><b>FFT</b></td><td>Algoritmo clásico que calcula la DFT en N·log N en vez de N² (divide y vencerás).</td><td>${nOf('17-fft')}</td></tr>
          <tr><td><b>Frecuencia</b></td><td>Cuántos ciclos por segundo (Hz). Inversa del periodo: f = 1/T.</td><td>${nOf('13-onde')}</td></tr>
          <tr><td><b>Grover</b></td><td>Búsqueda en √N intentos en vez de N/2. Ganancia cuadrática, válida para cualquier búsqueda sin estructura.</td><td>${nOf('11-grover')}</td></tr>
          <tr><td><b>Hadamard (H)</b></td><td>La puerta más importante: crea y deshace las superposiciones. Es ella la que convierte las fases en probabilidades observables.</td><td>${nOf('01-qubit') + ', ' + nOf('03-porte')}</td></tr>
          <tr><td><b>Interferencia</b></td><td>Las amplitudes se suman antes del cuadrado: las concordes se refuerzan, las opuestas se anulan.</td><td>${nOf('07-interferenza')}</td></tr>
          <tr><td><b>Medida</b></td><td>Operación irreversible: elige un resultado al azar según |amplitud|² y reescribe el estado.</td><td>${nOf('01-qubit') + ', ' + nOf('02-bloch')}</td></tr>
          <tr><td><b>No-clonación</b></td><td>No existe una máquina que copie un estado cuántico desconocido.</td><td>${nOf('06-teletrasporto')}</td></tr>
          <tr><td><b>Número complejo</b></td><td>Una flecha: longitud + ángulo. e^{iθ} es la flecha de longitud 1 en el ángulo θ.</td><td>${nOf('08-frecce')}</td></tr>
          <tr><td><b>Oráculo</b></td><td>Caja negra que marca con un signo menos los estados que cumplen una condición: escribe la información en las fases.</td><td>${nOf('09-deutsch')}</td></tr>
          <tr><td><b>Periodo</b></td><td>Cada cuánto se repite una cosa. T = 1/f.</td><td>${nOf('13-onde')}</td></tr>
          <tr><td><b>Phase kickback</b></td><td>El truco por el que la fase generada por un oráculo "rebota" sobre el registro de control.</td><td>${nOf('09-deutsch') + ', ' + nOf('19-qpe')}</td></tr>
          <tr><td><b>Puerta (gate)</b></td><td>Operación reversible (unitaria) sobre uno o más cúbits: en la esfera es siempre una rotación.</td><td>${nOf('03-porte')}</td></tr>
          <tr><td><b>Poscuántica (criptografía)</b></td><td>Algoritmos clásicos resistentes a Shor y Grover; estandarizados por el NIST en 2024.</td><td>${nOf('20-shor')}</td></tr>
          <tr><td><b>QFT</b></td><td>Transformada de Fourier sobre las amplitudes: n²/2 puertas, convierte periodicidad en picos.</td><td>${nOf('18-qft')}</td></tr>
          <tr><td><b>QPE</b></td><td>Estimación de fase: copia una fase en los cúbits de lectura y la hace medible con la QFT inversa.</td><td>${nOf('19-qpe')}</td></tr>
          <tr><td><b>Cúbit</b></td><td>Unidad elemental: dos amplitudes, una para |0⟩ y otra para |1⟩.</td><td>${nOf('01-qubit')}</td></tr>
          <tr><td><b>Shor</b></td><td>Factorización en tiempo polinómico, reduciendo el problema a la búsqueda de un periodo.</td><td>${nOf('20-shor')}</td></tr>
          <tr><td><b>Síndrome (medida de)</b></td><td>Medida que revela <b>dónde</b> ha ocurrido un error sin revelar la información codificada.</td><td>${nOf('21-rumore')}</td></tr>
          <tr><td><b>Superposición</b></td><td>Estado en el que varios resultados tienen amplitud distinta de cero a la vez.</td><td>${nOf('01-qubit')}</td></tr>
          <tr><td><b>SWAP</b></td><td>Puerta que intercambia dos cúbits; cierra el circuito de la QFT.</td><td>${nOf('05-circuiti') + ', ' + nOf('18-qft')}</td></tr>
          <tr><td><b>Teletransporte</b></td><td>Transferir un estado usando entrelazamiento + 2 bits clásicos. El original se destruye.</td><td>${nOf('06-teletrasporto')}</td></tr>
          <tr><td><b>Unitaria (operación)</b></td><td>Conserva la probabilidad total y es reversible: todas las puertas lo son, la medida no.</td><td>${nOf('03-porte')}</td></tr>
        </table>`,
    },
    {
      t: 'Los errores más comunes (que ahora sabes reconocer)',
      html: `<div class="grid-2">
               <div class="panel"><h3 class="panel-title" style="margin-top:0"><span class="dot"></span>❌ "Prueba todas las soluciones en paralelo"</h3>
                 <p class="mb0 dim">Las explora todas, pero <b>solo puede leer una</b>. La ventaja nace de la interferencia
                 que elimina las equivocadas, no del paralelismo en sí.</p></div>
               <div class="panel"><h3 class="panel-title" style="margin-top:0"><span class="dot"></span>❌ "Un cúbit es 0 y 1 a la vez"</h3>
                 <p class="mb0 dim">Es una lista de <b>amplitudes</b>, es decir, de flechas. El "0 y 1 a la vez" no explica por qué
                 dos Hadamard devuelven el cúbit a cero: las flechas sí.</p></div>
               <div class="panel"><h3 class="panel-title" style="margin-top:0"><span class="dot"></span>❌ "La amplitud es la probabilidad"</h3>
                 <p class="mb0 dim">La probabilidad es su <b>cuadrado</b>. Amplitud 0,6 → probabilidad 36%, no 60%.</p></div>
               <div class="panel"><h3 class="panel-title" style="margin-top:0"><span class="dot"></span>❌ "El entrelazamiento transmite información instantánea"</h3>
                 <p class="mb0 dim">No: quien está al otro lado solo ve resultados aleatorios. Para usarlos hace falta un canal clásico
                 normal (teletransporte, nivel 6).</p></div>
               <div class="panel"><h3 class="panel-title" style="margin-top:0"><span class="dot"></span>❌ "Los ordenadores cuánticos sustituirán a los nuestros"</h3>
                 <p class="mb0 dim">Son aceleradores especializados para unos pocos problemas con estructura adecuada.
                 Para escribir un correo seguirán siendo inútiles para siempre.</p></div>
               <div class="panel"><h3 class="panel-title" style="margin-top:0"><span class="dot"></span>❌ "La QFT es una FFT más rápida"</h3>
                 <p class="mb0 dim">Transforma 2^n amplitudes con n²/2 puertas, pero no las puedes leer: sirve para hacer interferir,
                 no para producir espectros.</p></div>
             </div>`,
    },
    {
      t: 'Dónde continuar',
      html: `<ul>
               <li><b>Qiskit</b> (IBM, Python) — la manera más directa de hacer correr los circuitos que has construido aquí
                   en simuladores serios y en hardware real, gratis.</li>
               <li><b>Nielsen y Chuang</b>, <i>Quantum Computation and Quantum Information</i> — el libro de referencia.
                   Después de este curso, los primeros capítulos te resultarán familiares.</li>
               <li><b>Certificaciones reconocidas</b>: si necesitas un título que puedas hacer valer, mira la certificación
                   oficial de IBM sobre Qiskit y los cursos universitarios en línea (edX, Coursera) emitidos por centros acreditados.
                   El certificado del próximo nivel es del autor de este curso, no de un organismo acreditado: sirve para
                   demostrar el recorrido hecho, no para sustituir a una certificación oficial.</li>
               <li><b>Mi canal de YouTube</b> y los artículos en <b>Red Hot Cyber</b>, enlazados en la portada.</li>
             </ul>`,
    },
  ],

  quiz: [
    { q: '¿Cuál es el resumen correcto de la ventaja cuántica?',
      options: ['prueba todas las soluciones y lee la mejor', 'organiza las fases de forma que las respuestas equivocadas se cancelen', 'es simplemente más rápido', 'usa más memoria'], correct: 1,
      why: 'Explorarlo todo es gratis; lo difícil es <b>leer</b>. La interferencia sirve para hacer muy probable la respuesta correcta.' },
    { q: 'Amplitud 0,6: ¿cuál es la probabilidad?',
      options: ['60%', '36%', '6%', '80%'], correct: 1,
      why: 'Regla de Born: 0,6² = 0,36.' },
    { q: '¿Permite el entrelazamiento comunicarse más rápido que la luz?',
      options: ['sí', 'no: los resultados son aleatorios y hace falta un canal clásico', 'solo con fotones', 'solo a distancias cortas'], correct: 1,
      why: 'Las correlaciones solo se ven comparando los resultados, y la comparación viaja a velocidad normal.' },
  ],

  outro: `<div class="callout ok">Lo tienes todo. Solo queda una cosa: <b>el examen final</b>. Preguntas sobre todo el recorrido,
          sin límite de tiempo, intentos ilimitados — y, del 80% para arriba, tu certificado.</div>`,
});
@endsection
