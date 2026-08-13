@php($description = 'Complejidad computacional explicada jugando: log N, N, N log N, N cuadrado y 2 elevado a N comparados, con los tiempos reales de cálculo. La vara para entender qué es la ventaja cuántica.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { confronto } from '/js/core/confronto.js';
import { costLab } from '/js/widgets/classic2.js';

const L = renderLesson({
  id: 'k5-costo',
  lead: `«Rápido» no quiere decir nada si no se dice <b>respecto a qué</b>. En informática un algoritmo se juzga
         así: cuando el problema se duplica, ¿cuánto crece el trabajo? ¿Se duplica también? ¿Crece en uno?
         ¿Se multiplica por cuatro? ¿Va al cuadrado del universo? Son cinco respuestas posibles, y toda la
         diferencia entre un problema resuelto y uno imposible está en cuál de las cinco te toca.`,

  steps: [
    {
      t: 'Las cinco curvas, y qué significa vivir dentro de ellas',
      html: `<table class="table">
               <tr><th>Coste</th><th>Nombre</th><th>Si N se duplica…</th><th>Ejemplo</th></tr>
               <tr><td class="mono">log N</td><td>logarítmico</td><td>+1 operación</td><td>búsqueda binaria (K·4)</td></tr>
               <tr><td class="mono">√N</td><td>raíz</td><td>×1,41</td><td>Grover (nivel 11)</td></tr>
               <tr><td class="mono">N</td><td>lineal</td><td>×2</td><td>leer una lista</td></tr>
               <tr><td class="mono">N·log N</td><td>casi lineal</td><td>poco más de ×2</td><td>ordenar, FFT (nivel 17)</td></tr>
               <tr><td class="mono">N²</td><td>cuadrático</td><td>×4</td><td>comparar todos con todos, DFT (nivel 16)</td></tr>
               <tr><td class="mono">2ⁿ</td><td>exponencial</td><td>×2 por <b>cada bit de más</b></td><td>probar todas las claves</td></tr>
             </table>
             <p>La tabla se lee en diez segundos pero no se <b>siente</b>. Para sentirla hay que convertir las
             operaciones en <b>tiempo</b>. Mueve el cursor y mira qué les pasa a las seis curvas — la escala
             vertical es logarítmica, si no la última se saldría de la pantalla ya en N = 30.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'costo', title: 'El muro exponencial', text: 'encuentra el primer N para el que 2^N supera un año de cálculo.', xp: 40 });
        el.appendChild(m.root);
        costLab(el, { onWin: () => m.complete() });
      },
      after: `<div class="callout key"><b>El número que hay que recordar es 55.</b> Un ordenador que hace mil
              millones de operaciones por segundo tarda menos de un segundo en 2³⁰, una hora en 2⁴², <b>más de un
              año</b> en 2⁵⁵ y más que la edad del universo en 2¹⁰⁰. No es cuestión de comprar una máquina
              mejor: duplicar la potencia del ordenador te hace ganar <b>un bit</b>. Uno.</div>`,
    },
    {
      t: 'Por qué las constantes no cuentan (y cuándo sí)',
      html: `<p>Cuando se dice que un algoritmo «cuesta N²» se está tirando un montón de cosas: el número exacto
             de operaciones, la velocidad del procesador, si el código está bien escrito. Es a propósito.
             Se escribe <b>O(N²)</b> y se lee «crece como N²».</p>
             <p>El motivo está en el gráfico: un algoritmo N² escrito fatal en un ordenador de 1990 le gana
             igualmente a un algoritmo 2ⁿ escrito de maravilla en un supercomputador, en cuanto N se hace lo
             bastante grande. La <b>forma</b> de la curva gana siempre a la constante, tarde o temprano.</p>
             <div class="callout warn"><b>Pero «tarde o temprano» puede estar lejísimos.</b> Es el error clásico
             de quien solo lee la teoría: existen algoritmos con constantes tan enormes que resultan inutilizables
             pese a tener mejor curva. Y vale <b>justamente para lo cuántico</b>: hoy una operación sobre cúbits
             es millones de veces más lenta y más frágil que una operación sobre bits. Una ventaja cuadrática
             como la de Grover, con esas constantes, en muchos casos prácticos ni se nota — mientras que una
             ventaja exponencial como la de Shor barre cualquier constante.</div>`,
    },
    {
      t: 'El vocabulario que hace falta para entender los titulares',
      html: `<ul>
               <li><b>P</b> — los problemas que se <b>resuelven</b> en tiempo polinómico (N, N², N³…). El reino
                   del «se puede hacer».</li>
               <li><b>NP</b> — los problemas cuya solución, <b>si alguien te la da</b>, se comprueba en tiempo
                   polinómico. Un sudoku resuelto se verifica en un minuto; resolverlo es otra historia.</li>
               <li><b>¿P = NP?</b> — la pregunta del millón de dólares: ¿resolver es siempre tan fácil como
                   verificar? Casi nadie cree que sí, nadie sabe demostrarlo.</li>
               <li><b>NP-completos</b> — los más duros de la clase NP, todos equivalentes entre sí (viajante de
                   comercio, mochila, coloreado de grafos…). Si resuelves uno rápido, los resuelves todos.</li>
               <li><b>BQP</b> — los problemas resolubles en tiempo polinómico por un ordenador <b>cuántico</b>.</li>
             </ul>
             <div class="callout key"><b>La frase que vale todo el nivel:</b> no se sabe si BQP contiene los
             problemas NP-completos, y <b>casi todos los expertos piensan que no</b>. La factorización — la que
             resuelve Shor — <b>no es</b> NP-completa: es un caso especial, con una estructura escondida (una
             periodicidad) que lo cuántico sabe aprovechar. Cuando leas «los ordenadores cuánticos resolverán
             los problemas imposibles», que sepas que casi siempre es falso: resolverán rápido <b>algunos</b>
             problemas con la estructura adecuada.</div>`,
      after: confronto({
        titolo: 'El catálogo de las ventajas cuánticas, por lo que valen',
        livello: '20-shor',
        vaiA: 'Ve a Shor (nivel 20)',
        classico: {
          titolo: 'Qué cuesta hoy',
          html: `<ul class="mb0">
                   <li>Búsqueda sin estructura: <b>N</b></li>
                   <li>Transformada de Fourier: <b>N·log N</b> (FFT)</li>
                   <li>Factorizar un número de n cifras binarias: <b>alrededor de 2^(n^⅓)</b> — prácticamente exponencial</li>
                   <li>Simular 50 partículas cuánticas: <b>2⁵⁰ números</b>, imposible</li>
                 </ul>`,
        },
        quantistico: {
          titolo: 'Qué costaría',
          html: `<ul class="mb0">
                   <li>Grover: <b>√N</b> — ganancia <b>cuadrática</b></li>
                   <li>QFT: <b>log²N</b> puertas — pero el resultado no se puede leer entero (nivel 18)</li>
                   <li>Shor: <b>unos n³</b> — ganancia <b>exponencial</b>, y ese es el golpe gordo</li>
                   <li>Simulación cuántica: <b>polinómica</b> — el motivo original por el que Feynman propuso
                       todo esto, en 1981</li>
                 </ul>`,
        },
        numeri: [
          { cosa: 'clave AES-128 (fuerza bruta)', classico: '2¹²⁸', quantistico: '2⁶⁴ (Grover)' },
          { cosa: 'RSA-2048 (factorizar)', classico: 'miles de millones de años', quantistico: 'horas, con una máquina que todavía no existe' },
          { cosa: 'viajante de comercio', classico: 'exponencial', quantistico: 'exponencial (ninguna ganancia conocida)' },
        ],
        verdetto: `<b>Tres filas, tres veredictos distintos.</b> Una ventaja cuadrática se compensa duplicando las
                   claves; una exponencial rehace la criptografía del mundo; y para la mayoría de los problemas
                   difíciles no se conoce <b>ninguna</b> ventaja. Quien te cuenta lo cuántico en una sola línea
                   te está contando un cuento.`,
      }),
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> Con el cursor en N = 40: ¿cuántas operaciones hace un algoritmo N² y cuántas uno 2ⁿ? ¿Cuántas veces más?</p>
        <p><b>2.</b> Un ordenador 1000 veces más rápido, ¿cuántos bits mueve el muro de 2ⁿ? <span class="muted">(1000 ≈ 2¹⁰: diez bits. Diez.)</span></p>
        <p><b>3.</b> Si Grover lleva 2¹²⁸ a 2⁶⁴, ¿qué le hace a 2²⁵⁶? ¿Por qué la recomendación poscuántica es «duplica la clave»?</p>
        <p class="mb0"><b>4.</b> De inventor: ¿cuál de las seis curvas describe «buscar una palabra en un diccionario de papel»? ¿Y «comparar cada foto con todas las demás»?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Un algoritmo O(2ⁿ): ¿qué pasa al añadir UN bit al problema?',
      options: ['el trabajo crece en 1', 'el trabajo se duplica', 'el trabajo va al cuadrado', 'no cambia nada'], correct: 1,
      why: 'Cada bit duplica. Por eso comprar un ordenador el doble de rápido te hace ganar un solo bit.' },
    { q: '¿Por qué se desprecian las constantes multiplicativas?',
      options: ['porque no se saben calcular', 'porque al crecer N la forma de la curva domina igualmente', 'por pereza', 'porque todos los ordenadores son iguales'], correct: 1,
      why: 'La curva gana tarde o temprano. Pero «tarde o temprano» puede estar lejos: en lo cuántico real las constantes importan mucho.' },
    { q: 'La factorización, la que resuelve Shor, ¿es un problema NP-completo?',
      options: ['sí, el más difícil de todos', 'no: es un caso especial con una estructura periódica escondida', 'sí, pero solo para números grandes', 'la pregunta no tiene sentido'], correct: 1,
      why: 'No es NP-completa. Lo cuántico la aprovecha porque hay una periodicidad que encontrar, no porque «resuelva los problemas difíciles».' },
    { q: 'La ganancia de Grover es…',
      options: ['exponencial', 'cuadrática', 'logarítmica', 'nula'], correct: 1,
      why: 'De N a √N: parte el exponente por la mitad. Por eso basta con duplicar la longitud de las claves simétricas.' },
  ],

  outro: `<div class="callout ok"><b>Lo que te llevas:</b> el coste de un algoritmo se mide por cómo crece, no por
          lo rápido que es hoy; polinómico y exponencial son dos mundos distintos; y las ventajas cuánticas son
          de dos tipos bien distintos, cuadrática y exponencial, con consecuencias incomparables.
          Siguiente nivel: lo último que hay que saber del ordenador clásico, lo que explica por qué el cuántico
          está hecho como está hecho.</div>`,
});
@endsection
