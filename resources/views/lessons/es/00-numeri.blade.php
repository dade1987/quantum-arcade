@php($description = 'Números negativos, dobles y mitades, fracciones y porcentajes, potencias de 2 y raíz cuadrada: las bases matemáticas para la computación cuántica, explicadas jugando.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { numberLine, percentLab, squareRootLab, powersLab } from '/js/widgets/basicmath.js';

const L = renderLesson({
  id: '00-numeri',
  lead: `Cuatro juegos sobre las bases: números negativos, fracciones y porcentajes, cuadrados y raíces, potencias de 2.
         Te harán falta en todo el resto del curso.`,

  steps: [
    {
      t: 'Números por encima y por debajo del cero',
      html: `<p>La <b>recta numérica</b> tiene el cero en medio: los positivos a la derecha, los <b>negativos</b> a la izquierda.</p>
             <p><b>Ejemplo:</b> un termómetro. +5° y −5° están los dos a 5 grados del cero, pero en lados opuestos.</p>
             <p>Multiplicar por <b>−1</b> cambia el lado pero no la distancia al cero: 3 → −3, −7 → 7.</p>
             <p>En el juego tienes cinco movimientos: +1, −1, ×2 (doble), ÷2 (mitad), ×(−1) (cambia de lado).
             Llega al objetivo con los menos movimientos posibles.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'linea', title: 'Tiro al blanco', text: 'llega a un objetivo en la recta numérica.', xp: 20 });
        el.appendChild(m.root);
        numberLine(el, { onWin: () => m.complete() });
      },
    },
    {
      t: 'De 3/4 a 0,75 a 75%',
      html: `<p>Una <b>fracción</b> como 3/4 quiere decir: divide en 4 partes iguales y toma 3.</p>
             <p><b>De fracción a decimal:</b> haz la división. 3/4 = 3 ÷ 4 = 0,75.<br>
             <i>Ejemplo:</i> 3 euros repartidos entre 4 personas son 0,75 € por cabeza, es decir, 75 céntimos.</p>
             <p><b>De decimal a porcentaje:</b> multiplica por 100. 0,75 × 100 = 75 → <b>75%</b>.<br>
             "Por ciento" quiere decir "de cada 100": 75% = 75 partes de 100.</p>
             <p><i>Ejemplo:</i> una pizza cortada en 4 trozos. Te comes 3: 3/4 = 0,75 = 75% de la pizza.</p>
             <table class="table">
               <tr><th>Fracción</th><th>Decimal</th><th>Porcentaje</th><th>En palabras</th></tr>
               <tr><td class="mono">1/2</td><td class="mono">0,5</td><td class="mono">50%</td><td>mitad</td></tr>
               <tr><td class="mono">1/4</td><td class="mono">0,25</td><td class="mono">25%</td><td>un cuarto</td></tr>
               <tr><td class="mono">3/4</td><td class="mono">0,75</td><td class="mono">75%</td><td>tres cuartos</td></tr>
               <tr><td class="mono">1/1</td><td class="mono">1</td><td class="mono">100%</td><td>todo</td></tr>
             </table>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'perc', title: 'El pastelero preciso', text: 'acierta dos objetivos distintos con el deslizador.', xp: 20 });
        el.appendChild(m.root);
        percentLab(el, { onWin: () => m.complete() });
      },
    },
    {
      t: 'Cuadrado y raíz cuadrada',
      html: `<p><b>Elevar al cuadrado</b> quiere decir multiplicar un número por sí mismo: 3² = 3 × 3 = 9.</p>
             <p>La <b>raíz cuadrada</b> hace lo contrario: buscas el número que, multiplicado por sí mismo, da el de partida.</p>
             <p><b>Cómo se calcula: probando.</b></p>
             <ul>
               <li>√16: 3 × 3 = 9 es poco, 4 × 4 = 16 vale → <b>√16 = 4</b>.</li>
               <li>√20: 4 × 4 = 16 es poco, 5 × 5 = 25 es demasiado, así que está entre 4 y 5. Pruebo 4,5 × 4,5 = 20,25: casi. √20 ≈ 4,47.</li>
               <li>En una calculadora basta la tecla <b>√</b>.</li>
             </ul>
             <p><i>Ejemplo:</i> una habitación cuadrada de 16 m² tiene 4 m de lado, porque 4 × 4 = 16.</p>
             <div class="callout warn"><p><b>Por qué 0,5 × 0,5 da 0,25.</b> Multiplicar por 0,5 quiere decir <b>tomar la mitad</b>.
             Así que 0,5 × 0,5 = la mitad de 0,5 = <b>0,25</b>.</p>
             <ul>
               <li><i>Pizza:</i> la mitad de media pizza = un cuarto de pizza.</li>
               <li><i>Dinero:</i> la mitad de 50 céntimos = 25 céntimos.</li>
             </ul>
             <p>En general, multiplicar por un número menor que 1 quiere decir tomar solo una parte, así que el resultado se hace más pequeño.</p>
             <p><b>Cómo se hace la cuenta:</b> multiplica sin comas (5 × 5 = 25). Luego cuenta las cifras después de la coma
             en los dos números (1 + 1 = 2) y pon 2 también en el resultado: <b>0,25</b>.<br>
             <i>Otro ejemplo:</i> 0,3 × 0,3 → 3 × 3 = 9 → dos cifras después de la coma → <b>0,09</b>.</p></div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'radice', title: 'El lado correcto', text: 'encuentra el lado que produce cierta área (es decir, calcula una raíz cuadrada).', xp: 25 });
        el.appendChild(m.root);
        squareRootLab(el, { onWin: () => m.complete() });
      },
    },
    {
      t: 'Las potencias de 2',
      html: `<p><b>2^n</b> quiere decir: multiplica 2 por sí mismo n veces. 2³ = 2 × 2 × 2 = 8.</p>
             <p>Cada vez que n sube 1, multiplicas por 2 una vez más, así que el resultado se duplica:</p>
             <table class="table">
               <tr><th>n</th><td class="mono">1</td><td class="mono">2</td><td class="mono">3</td><td class="mono">4</td><td class="mono">5</td><td class="mono">6</td><td class="mono">7</td><td class="mono">8</td><td class="mono">9</td><td class="mono">10</td></tr>
               <tr><th>2^n</th><td class="mono">2</td><td class="mono">4</td><td class="mono">8</td><td class="mono">16</td><td class="mono">32</td><td class="mono">64</td><td class="mono">128</td><td class="mono">256</td><td class="mono">512</td><td class="mono"><b>1.024</b></td></tr>
             </table>
             <p><b>n = 10 → unos mil:</b> con 10 duplicaciones llegas a 1.024, es decir, unos 1.000.</p>
             <p><b>n = 20 → un millón, más o menos:</b> otras 10 duplicaciones multiplican otra vez por 1.024, es decir, por unos 1.000.
             Así que 1.000 × 1.000 = <b>1.000.000</b>. El valor exacto es 1.048.576.</p>
             <p><i>Ejemplo:</i> la leyenda del tablero de ajedrez. 1 grano de arroz en la primera casilla, 2 en la segunda, 4 en la tercera,
             duplicando cada vez. En la casilla 64 harían falta más granos de los que existen en la Tierra.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'pow', title: 'Hasta un millón', text: 'lleva el deslizador a n = 20 y mira en cuántos valores se convierte.', xp: 20 });
        el.appendChild(m.root);
        powersLab(el, { onWin: () => m.complete() });
      },
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el juego de la recta: empezando en 1, ¿cuál es el menor número de movimientos para llegar a −8?</p>
        <p><b>2.</b> ¿Cuál es el lado de un cuadrado de área 0,49? ¿Y de área 1?</p>
        <p><b>3.</b> ¿Cuántas veces tienes que duplicar 1 para pasar de 1.000? ¿Y para pasar de 1.000.000?</p>
        <p class="mb0"><b>4.</b> ¿0,3 × 0,3 es mayor o menor que 0,3?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Cuánto es 0,5 × 0,5?', options: ['1', '0,25', '0,5', '2,5'], correct: 1,
      why: 'Multiplicar por 0,5 quiere decir tomar la mitad: la mitad de 0,5 es 0,25.' },
    { q: '¿A qué porcentaje corresponde 3/4?', options: ['34%', '43%', '75%', '30%'], correct: 2,
      why: '3 ÷ 4 = 0,75, y 0,75 × 100 = 75, es decir, 75 de 100 = 75%.' },
    { q: '¿Cuánto es 2⁵?', options: ['10', '25', '32', '64'], correct: 2,
      why: '2 × 2 × 2 × 2 × 2 = 32.' },
    { q: '¿Qué quiere decir multiplicar un número por −1?', options: ['dividirlo por la mitad', 'anularlo', 'mandarlo al lado opuesto respecto al cero', 'elevarlo al cuadrado'], correct: 2,
      why: 'Cambia el lado, no la distancia al cero: 5 se convierte en −5.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> En el siguiente nivel: las <b>coordenadas</b> (dónde está un punto)
          y los <b>grados</b> (cuánto está girado un objeto).</div>`,
});
@endsection
