@php($description = 'Polinomios y regla de Ruffini explicados jugando: por qué las raíces enteras se esconden solo entre los divisores del término independiente, por qué el relevo de Ruffini es también la forma más rápida de calcular un polinomio (Horner), y por qué a partir del quinto grado no existe fórmula — Ruffini, Abel, Galois.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { sospettatiLab, staffettaLab } from '/js/widgets/polinomi.js';

const L = renderLesson({
  id: 'm1-polinomi',
  lead: `En el nivel 0·7b construiste la fórmula de segundo grado en vez de memorizarla. Quedaba una pregunta en el
         aire, y es la más bonita de las matemáticas: <b>¿y para el tercer grado? ¿y para el quinto?</b> La respuesta
         sorprende — para el tercero y el cuarto sí hay fórmula, y es una historia de duelos; del <b>quinto en
         adelante no existe</b>, y no porque nadie fuera lo bastante listo. Pero antes hacen falta las herramientas,
         y son dos: cómo se encuentran las raíces de un polinomio, y la regla que lleva el nombre de <b>Paolo
         Ruffini</b>.`,

  steps: [
    {
      t: 'Qué es factorizar, y por qué compensa',
      html: `<p>Un <b>polinomio</b> es una suma de potencias de x con números delante: x³ − 7x + 6. Nada más. El
             <b>grado</b> es la potencia más alta que aparece — aquí 3.</p>
             <p><b>Factorizar</b> significa reescribirlo como un <b>producto</b>: x³ − 7x + 6 = (x − 1)(x − 2)(x + 3).
             Las dos escrituras valen el mismo número para cada x, pero la segunda dice algo que la primera esconde:
             <b>cuándo vale cero</b>.</p>
             <div class="callout key">Un producto vale cero si y solo si <b>uno de los factores</b> vale cero. Así
             que en cuanto el polinomio está escrito como producto, las soluciones se leen a ojo: 1, 2, −3.
             Factorizar es <b>convertir un problema difícil en una lectura</b>.</div>
             <p>Pero ¿cómo se encuentran esos factores? Probando entre todos los enteros se tarda una vida. Por
             suerte los candidatos son poquísimos, y hay un motivo preciso.</p>`,
    },

    {
      t: 'Los sospechosos: por qué la caza es cortísima',
      html: `<p>Imagina un interrogatorio. El polinomio es x³ − 7x + 6 y buscamos un número entero que lo anule.
             Sospechosos potenciales: <b>infinitos</b>. Pero casi todos tienen una <b>coartada automática</b>, y este
             es el razonamiento que se la da.</p>
             <p>Supongamos que un entero <b>r</b> lo anula: r³ − 7r + 6 = 0. Paso el 6 al otro lado (la balanza del
             nivel 0·7):</p>
             <div class="formula">r³ − 7r = −6 &nbsp;&nbsp;→&nbsp;&nbsp; r · (r² − 7) = −6</div>
             <p>A la izquierda hay <b>r multiplicado por algo entero</b>. Para que la cuenta salga, <b>r tiene que
             dividir a 6 exacto</b>. Fin del interrogatorio: los sospechosos son solo <b>±1, ±2, ±3, ±6</b>. Ocho
             números en vez de infinitos.</p>
             <div class="callout key">Esto se llama <b>teorema de las raíces racionales</b> y vale siempre: cuando el
             coeficiente delante de la potencia más alta es 1, <b>toda raíz entera divide al término
             independiente</b>. El término independiente es el bote común: quien no entra exacto, no estaba.</div>
             <p>En el juego interroga a los sospechosos uno a uno. Al culpable se le <b>saca</b> del polinomio, que
             baja de grado; el que tiene coartada te enseña el resto que lo exculpa. Factoriza al menos dos hasta el
             final.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'sospettati', title: 'Interrogatorio completo', text: 'factoriza 2 polinomios hasta donde se pueda.', xp: 45 });
        el.appendChild(m.root);
        sospettatiLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Dos cosas que el juego enseña y que conviene fijar:</p>
              <ul>
                <li>cada raíz sacada <b>baja el grado en uno</b>: de cúbico a cuadrático a lineal. Por eso, una vez
                    encontrada una raíz, el resto se vuelve fácil;</li>
                <li>el tercer polinomio se <b>para</b>: tras sacar el 2 queda x² + 1, que no tiene raíces enteras —
                    de hecho no tiene ninguna, porque su discriminante es −4. No es un fallo del método: es
                    exactamente el caso «imposible» del nivel 0·7b, del que nacieron los números complejos.</li>
              </ul>
              <div class="callout warn"><b>Cuidado con una trampa común:</b> «no tiene raíces enteras» no significa
              «no tiene raíces». x² − 2 no tiene raíces enteras, pero tiene ±√2. El teorema de los sospechosos
              encuentra las raíces <b>racionales</b>: las demás existen, y para sacarlas hacen falta otras
              herramientas.</div>`,
    },

    {
      t: 'El relevo de Ruffini (y lo que se ahorra)',
      html: `<p>¿Cómo se «saca» una raíz? Con una división: si r es raíz, el polinomio es divisible por (x − r). La
             división entre polinomios se puede hacer en columna, como la de los números — larga y llena de ocasiones
             para equivocarse — o con la <b>regla de Ruffini</b>, que es lo mismo escrito en una sola fila.</p>
             <p>La forma más clara de verla es como un <b>relevo</b>:</p>
             <ul>
               <li>los corredores son los <b>coeficientes</b>, en fila desde el grado más alto;</li>
               <li>el primero sale con su número y ya está;</li>
               <li>cada corredor coge el testigo del anterior, lo <b>multiplica por r</b>, lo suma a su propio
                   coeficiente y pasa el resultado;</li>
               <li>el último número del relevo es el <b>resto</b>.</li>
             </ul>
             <div class="callout key">Si el resto es <b>cero</b>, r era una raíz y los demás números del relevo son
             los coeficientes de lo que queda. Si el resto <b>no</b> es cero, no has perdido el tiempo: ese número es
             <b>P(r)</b>, el valor del polinomio en r. Se llama <b>teorema del resto</b>, y son dos resultados al
             precio de uno.</div>
             <p>Haz correr el relevo al menos dos veces, y mira el contador de multiplicaciones de abajo.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'staffetta', title: 'Lleva el testigo hasta el final', text: 'completa 2 relevos.', xp: 50 });
        el.appendChild(m.root);
        staffettaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Ese contador es el motivo por el que esta regla vive también fuera de la escuela. Calcular
              x³ − 7x + 6 «al pie de la letra» significa hacer x·x·x, luego x·x, luego las multiplicaciones por los
              coeficientes: <b>nueve</b> multiplicaciones. El relevo hace <b>tres</b>.</p>
              <div class="callout ok"><b>Curiosidad que cambia la perspectiva:</b> esto no es un atajo para los
              deberes. Es el <b>esquema de Horner</b>, la forma más rápida que se conoce de calcular un polinomio en
              un punto, y está dentro de las librerías matemáticas, las tarjetas gráficas y las calculadoras de
              bolsillo. Ruffini lo publica en 1804 para dividir; Horner en 1819 para calcular; y es la misma fila de
              números. <span class="muted">(y los matemáticos chinos ya lo usaban en el siglo XIII — Qin Jiushao,
              1247)</span></div>`,
    },

    {
      t: 'Por qué la fórmula de segundo grado es así — y por qué se detiene',
      html: `<p>Ahora la pregunta que quedaba en el aire. En el nivel 0·7b la fórmula salió de un dibujo: completar el
             cuadrado. La pregunta natural es: <b>¿y para los grados más altos?</b></p>`,
      mount: el => {
        stepper(el, [
          { h: 'Grado 2: se completa el cuadrado', html: 'El truco es <b>convertir la ecuación en un cuadrado perfecto</b>, que se sabe abrir con una raíz. De ahí la fórmula: x = [−b ± √(b² − 4ac)] / 2a. Al-Juarismi lo hacía con un dibujo, en el año 820.' },
          { h: 'Grado 3: se descubre en el siglo XVI, entre peleas', html: '<b>Scipione del Ferro</b> (Bolonia, ~1515) encuentra cómo resolver las cúbicas y no se lo cuenta a nadie: en aquella época la cátedra se defendía con <b>desafíos públicos</b> a golpe de problemas, y un método secreto era un sueldo.' },
          { h: 'El duelo', html: '<b>Niccolò Tartaglia</b> llega solo en 1535 y gana un desafío en Venecia. <b>Gerolamo Cardano</b> lo convence de revelarle el método jurando no publicarlo — y en <b>1545</b> lo publica en el <i>Ars Magna</i>, citándolo, pero publicándolo. Sigue una de las peleas más venenosas de la historia de la ciencia.' },
          { h: 'Grado 4: justo después', html: '<b>Ludovico Ferrari</b>, alumno de Cardano, resuelve el cuarto grado con una idea parecida: se reduce a una cúbica. La fórmula existe, es enorme, y también está en el <i>Ars Magna</i>.' },
          { h: 'Grado 5: dos siglos y medio de silencio', html: 'En este punto parece cuestión de tiempo. Y en cambio nadie lo consigue. Durante <b>dos siglos y medio</b> los mejores matemáticos de Europa lo intentan y fracasan.' },
          { h: 'Ruffini, 1799: quizá no se puede', html: '<b>Paolo Ruffini</b>, médico y matemático en Módena, publica una demostración de que una fórmula general para el quinto grado <b>no puede existir</b>. Casi nadie la lee: son más de 500 páginas, y hay un paso que queda incompleto.' },
          { h: 'Abel, 1824: se demuestra', html: 'El noruego <b>Niels Henrik Abel</b>, con 21 años, completa la demostración. La imprime por su cuenta y, para que quepa en el dinero que tiene, la comprime en <b>seis páginas</b>. Muere de tuberculosis a los 26, pobre. El resultado se llama hoy <b>teorema de Abel–Ruffini</b>.' },
          { h: 'Galois, 1832: se entiende POR QUÉ', html: '<b>Évariste Galois</b>, francés, explica no solo que la fórmula no está, sino <b>qué</b> ecuaciones se pueden resolver con raíces y cuáles no: depende de las <b>simetrías</b> de las soluciones entre sí. Escribe sus ideas la noche antes de un duelo, y al día siguiente muere. Tenía <b>20 años</b>. De ahí nace la <b>teoría de grupos</b>.' },
          { h: 'Qué significa de verdad', html: 'No «todavía no la hemos encontrado». Significa que una fórmula hecha de +, −, ×, ÷ y raíces <b>no existe</b>, demostrado. Las soluciones están ahí — un polinomio de grado 5 tiene 5 raíces complejas — pero para tenerlas hay que <b>calcularlas</b>, no escribirlas.' },
        ], { doneLabel: '¡Vaya historia!' });
      },
      after: `<div class="callout key">Guarda las palabras <b>grupos</b> y <b>simetrías</b>: nacieron aquí, de un
              chico de veinte años que intentaba entender una ecuación, y en este curso volverán para describir las
              puertas cuánticas. Es uno de los casos más claros de matemática inventada por un motivo y útil para
              otro, ciento cincuenta años después.</div>`,
    },

    {
      t: 'Para qué sirve todo esto en lo cuántico',
      html: `<p>La conexión es directa y merece verse entera.</p>
             <p>En el nivel 18·b se buscan las <b>direcciones fijas</b> de una matriz 2×2, y se encuentran resolviendo
             λ² − (traza)·λ + (determinante) = 0: una ecuación de segundo grado. Para una matriz <b>n×n</b> esa
             cuenta se convierte en un <b>polinomio de grado n</b>, el polinomio característico, y sus ceros son los
             <b>autovalores</b>.</p>
             <div class="callout warn">Junta las dos cosas y sale un hecho incómodo: para una matriz <b>5×5 o más
             grande</b> el polinomio característico tiene grado ≥ 5, así que por Abel–Ruffini <b>no existe ninguna
             fórmula</b> que dé los autovalores. No para una matriz difícil: <b>en general</b>.</div>
             <p>Por eso ningún programa «resuelve» los autovalores: los <b>persigue</b>, con métodos que se acercan
             paso a paso. Y un sistema cuántico interesante tiene matrices con millones de filas.</p>
             <div class="callout ok"><b>Y aquí la estimación de fase (nivel 19) cambia de registro.</b> No resuelve
             ningún polinomio: prepara el autovector, aplica la puerta duplicando, y <b>lee</b> el autovalor de la
             fase. Rodea por completo el problema que Abel y Galois habían cerrado. Dicho así, «medir un autovalor en
             vez de calcularlo» deja de ser un detalle técnico y se convierte en el punto.</div>
             <p>Una segunda conexión, más escondida pero igual de fuerte, tiene que ver con el <b>relevo</b>.
             Calcular un polinomio en un punto cuesta n multiplicaciones con Horner. La <b>DFT</b> del nivel 16 es
             exactamente eso, repetido: coger un polinomio y calcularlo en <b>n puntos especiales</b> — las raíces
             n-ésimas de la unidad, es decir las flechas del nivel 8 puestas en círculo.</p>
             <div class="formula">DFT = calcular un polinomio en las n raíces de la unidad</div>
             <p class="mb0">n puntos × n multiplicaciones = n² operaciones, que es justo el coste de la DFT ingenua.
             Y la <b>FFT</b> (nivel 17) es el truco de partir ese polinomio en dos — términos pares e impares — y
             reutilizar la mitad del trabajo. La misma idea del «parte por la mitad» del nivel K·4, aplicada al
             relevo.</p>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego coge <b>x³ − 4x² + x + 6</b>: ¿quiénes son los sospechosos? Interrógalos en
           orden y cuenta cuántas coartadas encuentras antes del primer culpable.
           <span class="muted">(y fíjate: cambiar el orden cambia el esfuerzo, no el resultado)</span></p>
        <p><b>2.</b> En el relevo elige una r que <b>no</b> sea raíz y mira el último número. Luego calcula P(r) a
           mano, al pie de la letra. ¿Salen iguales? <span class="muted">(tienen que salir: es el teorema del
           resto)</span></p>
        <p><b>3.</b> ¿Cuántas multiplicaciones cuesta un polinomio de grado 7 con el relevo? ¿Y al pie de la letra?
           <span class="muted">(7 contra 35: la diferencia crece como el cuadrado)</span></p>
        <p><b>4.</b> ¿Por qué el teorema de los sospechosos no encuentra ±√2 como raíz de x² − 2?
           <span class="muted">(relee el razonamiento: ¿dónde se usó que r es entero?)</span></p>
        <p class="mb0"><b>5.</b> De inventor: si para una matriz 5×5 no existe una fórmula para los autovalores,
           ¿cómo hace un ordenador para dibujarte el espectro de una molécula?
           <span class="muted">(pista: la misma respuesta por la que existe el nivel 21·b — se baja, no se
           resuelve)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Por qué conviene factorizar un polinomio en un producto?', options: ['porque es más corto de escribir', 'porque un producto vale cero solo si un factor vale cero: las soluciones se leen a ojo', 'porque el grado disminuye', 'porque elimina los números negativos'], correct: 1,
      why: 'Escrito como (x−1)(x−2)(x+3), el polinomio declara sus raíces: 1, 2, −3. La forma suma las esconde, la forma producto las expone.' },
    { q: 'Si el término independiente es 6 y el coeficiente de grado máximo es 1, ¿qué enteros pueden ser raíces?', options: ['todos los números enteros', 'solo ±1, ±2, ±3, ±6', 'solo 1 y 6', 'solo los números pares'], correct: 1,
      why: 'Sacando factor r de todos los términos con x, queda el término independiente por repartir: así que r tiene que dividirlo exacto. De infinitos candidatos a ocho.' },
    { q: 'En la regla de Ruffini, ¿qué es el último número de la fila?', options: ['el coeficiente de grado cero del cociente', 'el resto de la división, que es también P(r)', 'la raíz buscada', 'el grado del polinomio'], correct: 1,
      why: 'Es el teorema del resto: dividir por (x − r) deja como resto exactamente el valor del polinomio en r. Si sale cero, r es raíz; si no sale cero, has calculado P(r) igualmente.' },
    { q: '¿Por qué el relevo de Ruffini/Horner es rápido?', options: ['porque se salta términos', 'porque cada coeficiente entra con una sola multiplicación, en vez de recalcular todas las potencias', 'porque usa números más pequeños', 'porque aproxima el resultado'], correct: 1,
      why: 'El resultado es exacto: solo cambia el orden de las cuentas. Un polinomio de grado n cuesta n multiplicaciones en vez de unas n²/2 — y por eso lo usan las librerías matemáticas.' },
    { q: '¿Existe una fórmula resolutiva para las ecuaciones de quinto grado?', options: ['sí, pero es demasiado larga de escribir', 'no, y está demostrado que no puede existir (Abel–Ruffini)', 'todavía no, pero se busca', 'sí, la encontró Galois'], correct: 1,
      why: 'Ruffini (1799) y Abel (1824) demuestran que ninguna fórmula hecha de operaciones y raíces puede dar las soluciones generales del grado 5 en adelante. Galois (1832) explica por qué, y de paso funda la teoría de grupos. Las raíces existen: se calculan, no se escriben.' },
    { q: '¿Qué consecuencia tiene todo esto sobre los autovalores de una matriz grande?', options: ['ninguna, los autovalores siempre se pueden obtener con una fórmula', 'el polinomio característico tiene grado n: de n=5 en adelante no hay fórmula, así que los autovalores se persiguen numéricamente — o se leen con la estimación de fase', 'significa que las matrices grandes no tienen autovalores', 'significa que hacen falta matrices reales'], correct: 1,
      why: 'El polinomio característico de una matriz n×n tiene grado n. Para n ≥ 5 Abel–Ruffini cierra el camino de la fórmula. La estimación de fase cuántica lo rodea: no resuelve el polinomio, mide la fase.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Los sospechosos son los divisores del término independiente, el relevo
          de Ruffini divide y calcula a la vez y es la forma más rápida que se conoce, y del quinto grado en adelante
          la fórmula no existe — demostrado por un médico de Módena, un noruego muerto a los 26 y un francés muerto a
          los 20. De esa historia salieron los grupos, que reencontrarás entre las puertas cuánticas; y de aquel «no
          existe» se entiende por qué la estimación de fase, que <b>mide</b> el autovalor, es una noticia.</div>`,
});
@endsection
