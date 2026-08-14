@php($description = 'Las matrices 2×2 explicadas sin álgebra: una máquina que toma una flecha y devuelve otra. Las columnas como destinos, el producto como composición y el descubrimiento de que X, Z y H son matrices unitarias.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { matrixLab, gatePuzzle } from '/js/widgets/matrici.js';

const L = renderLesson({
  id: '00-matrici',
  lead: `«Matriz» es una palabra que asusta y no debería: una matriz 2×2 es <b>una tabla de cuatro números</b>, y hace
         una sola cosa — <b>toma una flecha y devuelve otra flecha</b>. De aquí en adelante, en el curso, cada puerta
         cuántica será una de esas tablas. Aprenderlas ahora, jugando, cuesta veinte minutos; encontrarlas por primera
         vez dentro de la transformada de Fourier cuántica cuesta muchísimo más.`,

  steps: [
    {
      t: 'Una máquina que mueve flechas',
      html: `<p>Imagina una máquina con <b>cuatro mandos</b>. Le metes una flecha y sale otra flecha: quizá más larga,
             quizá girada, quizá volteada.</p>
             <p>Para saberlo <b>todo</b> de esta máquina no hace falta probarla con infinitas flechas. Bastan dos pruebas:</p>
             <ul>
               <li>dónde acaba la flecha <b>roja</b>, la que va un paso a la derecha: <b>(1, 0)</b>;</li>
               <li>dónde acaba la flecha <b>verde</b>, la que va un paso hacia arriba: <b>(0, 1)</b>.</li>
             </ul>
             <p>¿Por qué? Porque cualquier otra flecha está hecha de esas dos. La flecha (3, 2) es «tres pasos a la
             derecha y dos hacia arriba»: si sabes dónde acaban los pasos, sabes dónde acaba ella.</p>
             <div class="callout key">En el juego de abajo las flechas discontinuas dicen <b>dónde tienen que llegar</b>.
             Gira los mandos hasta que las flechas llenas caigan encima. Fíjate también en el cuadrilátero azul: no
             estás moviendo dos flechas, estás moviendo <b>todo el plano</b>.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'manopole', title: 'Tres máquinas por encargo', text: 'acierta 3 retos distintos girando los mandos.', xp: 35 });
        el.appendChild(m.root);
        matrixLab(el, { need: 3, onWin: () => m.complete() });
      },
    },

    {
      t: 'Las columnas son los destinos',
      html: `<p>Ahora mira los cuatro números que has girado, escritos como tabla:</p>
             <div class="formula">[ <span class="hl-n">a</span> &nbsp; <span class="hl-N">b</span> ]<br>
                                  [ <span class="hl-n">c</span> &nbsp; <span class="hl-N">d</span> ]</div>
             <p>La <b>primera columna</b> (a, c) es exactamente el lugar donde acaba la flecha roja. La <b>segunda
             columna</b> (b, d) es donde acaba la verde. No es una regla que memorizar: es lo que acabas de ver ocurrir
             en la pantalla.</p>
             <p>Y la cuenta para una flecha cualquiera sale sola:</p>`,
      mount: el => {
        formula(el, {
          title: 'Matriz por flecha, pieza a pieza',
          parts: [
            { t: '[a b; c d]', id: 'm', color: 'cyan', name: 'la máquina', say: 'Los cuatro números: la primera columna dice dónde acaba (1,0), la segunda dónde acaba (0,1).', ex: 'Para la puerta X: [0 1; 1 0] — la roja acaba arriba, la verde a la derecha: se intercambian.' },
            { t: '·' },
            { t: '(x, y)', id: 'v', color: 'amber', name: 'la flecha de entrada', say: 'x pasos a la derecha e y pasos hacia arriba.', ex: '(3, 2) significa tres pasos de roja más dos de verde.' },
            { t: '=' },
            { t: '(a·x + b·y', id: 'r1', color: 'green', name: 'la primera coordenada del resultado', say: 'Cuánto te desplazas en horizontal: la aportación de la roja más la de la verde.', ex: 'Con [2 0; 0 3] y (3, 2): 2·3 + 0·2 = 6.' },
            { t: ',' },
            { t: 'c·x + d·y)', id: 'r2', color: 'pink', name: 'la segunda coordenada del resultado', say: 'Cuánto te desplazas en vertical, con el mismo razonamiento.', ex: 'Con [2 0; 0 3] y (3, 2): 0·3 + 3·2 = 6.' },
          ],
        });
      },
      after: `<div class="callout key">Dos máquinas seguidas siguen siendo una sola máquina, y su tabla se llama
              <b>producto</b> de las dos. Cuidado con el orden: primero la camisa y luego la chaqueta no es lo mismo que
              primero la chaqueta y luego la camisa. En matemáticas se dice que el producto <b>no es conmutativo</b>, y
              en el siguiente juego lo tocas con la mano.</div>`,
    },

    {
      t: 'Las puertas cuánticas son matrices',
      html: `<p>Estas son las tres puertas que encontrarás en todo el curso, escritas como son de verdad:</p>
             <table class="table">
               <tr><th>Puerta</th><th>Tabla</th><th>Qué hace</th></tr>
               <tr><td class="mono">X</td><td class="mono">[0 1 ; 1 0]</td><td>intercambia |0⟩ y |1⟩: es el NOT cuántico</td></tr>
               <tr><td class="mono">Z</td><td class="mono">[1 0 ; 0 −1]</td><td>deja |0⟩ como está y le cambia el signo a |1⟩</td></tr>
               <tr><td class="mono">H</td><td class="mono">[0,71 &nbsp;0,71 ; 0,71 &nbsp;−0,71]</td><td>crea la superposición a medias — ese 0,71 es 1/√2</td></tr>
             </table>
             <p>El estado de un cúbit, por ahora, es una flecha con dos números: <b>cuánto pesa |0⟩</b> y <b>cuánto pesa
             |1⟩</b>. Aplicar una puerta significa hacer pasar esa flecha por la máquina.</p>
             <div class="callout key">En el juego hay un <b>círculo discontinuo</b>. Pulsa todas las puertas que quieras,
             en el orden que quieras: <b>la punta de la flecha no sale nunca del círculo</b>. No lo pierdas de vista,
             porque es lo más importante de este nivel.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'puzzle', title: 'Dos objetivos, tres puertas', text: 'resuelve 2 puzles combinando X, Z y H.', xp: 45 });
        el.appendChild(m.root);
        gatePuzzle(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Si has resuelto el primer puzle con <b>H, luego Z, luego H</b>, acabas de descubrir por tu cuenta algo
              cierto y famoso: esas tres puertas seguidas hacen exactamente lo que hace la X.</p>
              <div class="formula">H · Z · H = X</div>
              <p>No es un truco de manual: es el producto de tres tablas que da una cuarta tabla. Y volverá en todo el
              curso, porque es la forma estándar de convertir un «cambio de signo» en un «cambio de respuesta».</p>`,
    },

    {
      t: 'Por qué la longitud nunca cambia',
      html: `<p>Las máquinas que <b>no alargan ni acortan nada</b> tienen nombre: se llaman <b>unitarias</b>. X, Z y H lo
             son; una máquina que lo duplica todo, no.</p>
             <p>El juego de los mandos te lo escribe debajo: prueba a poner <span class="mono">a = 2</span> y mira cómo
             cambia el mensaje. Y ahora la clave:</p>`,
      mount: el => {
        stepper(el, [
          { h: 'El hecho de partida', html: 'La probabilidad de leer un resultado es el <b>cuadrado</b> de su amplitud (nivel 0·1: 0,71² ≈ 0,5).' },
          { h: 'La suma de las probabilidades', html: 'Las probabilidades de todos los resultados tienen que dar <b>100%</b>. Siempre. Un cúbit que diera 40% y 30% no significaría nada.' },
          { h: 'Qué significa para la flecha', html: 'Suma de cuadrados = 1 es Pitágoras: significa que la flecha del estado mide <b>exactamente 1</b>. Por eso en el juego está sobre el círculo.' },
          { h: 'La conclusión', html: 'Una puerta puede girar la flecha, voltearla, mezclarla, pero <b>no puede cambiar su longitud</b>, porque si no las probabilidades dejarían de sumar 100%. Por eso toda puerta cuántica es unitaria.' },
          { h: 'Una consecuencia de regalo', html: 'Una máquina que no aplasta nada siempre se puede <b>recorrer hacia atrás</b>: no se ha perdido información. Es la reversibilidad del nivel K·6, reencontrada por otro camino.' },
        ], { doneLabel: '¡Claro!' });
      },
      after: `<div class="callout ok">A partir de ahora «puerta cuántica» y «matriz unitaria 2×2» son para ti la misma
              cosa, y el círculo del juego es la razón. Es la definición que encontrarás en cualquier libro, solo que tú
              has llegado a ella pulsando botones.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el juego de los mandos, ¿qué tabla <b>aplasta todo sobre el eje horizontal</b>? ¿Es unitaria?
           ¿Qué les pasaría a las probabilidades de un cúbit?</p>
        <p><b>2.</b> Aplica <b>X y luego Z</b>, y después empieza de nuevo con <b>Z y luego X</b>. ¿Acaba la flecha en el
           mismo sitio? <span class="muted">(respuesta: casi — cambia un signo, y ese signo en lo cuántico se nota, y mucho)</span></p>
        <p><b>3.</b> Pulsa <b>H dos veces</b> seguidas partiendo de |0⟩. ¿Dónde vuelves? ¿Sabes decir cuánto vale H·H?</p>
        <p class="mb0"><b>4.</b> Pregunta de inventor: la rotación de 90° que construiste en el primer juego, ¿es unitaria?
           Si lo es, podría ser una puerta cuántica de verdad — y lo es: en el curso se llama rotación y la encontrarás en
           la esfera de Bloch.</p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué dicen las dos columnas de una matriz 2×2?', options: ['dos números al azar', 'dónde acaban las dos flechas de base', 'la longitud de la flecha', 'la probabilidad del resultado'], correct: 1,
      why: 'La primera columna es el lugar donde acaba (1, 0), la segunda donde acaba (0, 1). Sabiendo esos dos destinos se sabe dónde acaba cualquier flecha.' },
    { q: 'La matriz [0 1 ; 1 0] aplicada a la flecha (1, 0) da…', options: ['(1, 0)', '(0, 1)', '(1, 1)', '(0, 0)'], correct: 1,
      why: 'La primera columna es (0, 1): la flecha que iba a la derecha acaba arriba. Es la puerta X, el NOT cuántico.' },
    { q: '¿Por qué toda puerta cuántica tiene que ser unitaria?', options: ['por tradición', 'porque si no las probabilidades ya no sumarían 100%', 'para ir más rápido', 'para ahorrar cúbits'], correct: 1,
      why: 'La probabilidad es el cuadrado de la amplitud: si cambiara la longitud de la flecha, la suma de las probabilidades dejaría de ser 1. Unitaria significa exactamente «no cambia las longitudes».' },
    { q: 'Dos puertas aplicadas una tras otra…', options: ['no se pueden combinar', 'equivalen a una sola matriz, su producto', 'siempre se anulan', 'duplican la longitud'], correct: 1,
      why: 'Componer dos máquinas sigue dando una máquina: su tabla es el producto de las dos, y el orden importa.' },
    { q: '¿Qué hace H · Z · H?', options: ['nada, es la identidad', 'lo mismo que la puerta X', 'duplica la amplitud', 'mide el cúbit'], correct: 1,
      why: 'Es el resultado que se descubre jugando con el puzle: las tres puertas seguidas dan exactamente la matriz X. Convertir un cambio de signo en un cambio de respuesta es una jugada que vuelve en todos los algoritmos.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Una matriz es una máquina, las columnas son los destinos, el producto es
          «una después de otra» y unitaria significa «no cambia las longitudes». Con estos cuatro hechos en el bolsillo,
          las puertas del curso dejan de ser símbolos que memorizar y pasan a ser tablas que sabes leer.</div>`,
});
@endsection
