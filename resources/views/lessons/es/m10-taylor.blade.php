@php($description = 'Series de Taylor jugando: el polinomio que persigue a la curva y se despega al alejarse, el radio de convergencia tocado con la mano, la fórmula de Euler leída en el papel separando los términos pares de los impares — y el descubrimiento de que el √N de Grover es sin x ≈ x, una serie parada en el primer término.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { taylorLab, piccoliAngoliLab } from '/js/widgets/taylor.js';

const L = renderLesson({
  id: 'm10-taylor',
  lead: `Un ordenador no sabe calcular <b>sin x</b>. Sabe sumar y multiplicar, y nada más. Y sin embargo cuando
         escribes «sin 1» te responde en un microsegundo. ¿Cómo? Hace una suma: <b>x − x³/6 + x⁵/120 − …</b> Esto es
         una serie de Taylor, y es el truco por el que cualquier curva se puede sustituir por un <b>polinomio</b>,
         siempre que no te alejes demasiado. Al final del nivel descubrirás que el √N de Grover — la ventaja
         cuántica más famosa del curso — no es otra cosa que esta serie <b>parada en el primer término</b>.`,

  steps: [
    {
      t: 'El polinomio que persigue a la curva',
      html: `<p>La idea es esta. Cojo una curva y un punto — digamos x = 0 — e intento construir un polinomio que se
             le parezca <b>ahí</b>. No en todas partes: ahí.</p>
             <ul>
               <li>Grado 0: un polinomio constante, que al menos pase por el mismo punto.</li>
               <li>Grado 1: le pido también la <b>misma pendiente</b> — es decir, la misma derivada del nivel 21·b.
                   Es la recta tangente.</li>
               <li>Grado 2: también la misma <b>curvatura</b>. Grado 3: también cómo cambia la curvatura. Y así.</li>
             </ul>
             <div class="callout key">Cada término más obliga a que coincida <b>una derivada más</b>. De esa
             exigencia sale sola la fórmula de los coeficientes:
             <p class="mb0" style="margin-top:8px">el término de grado k vale <b>f⁽ᵏ⁾(0) / k!</b></p></div>
             <p>En el juego: elige una curva, sube el grado y mira al polinomio amarillo perseguir al azul. Empieza
             por el seno.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'taylor', title: 'Dos curvas perseguidas', text: 'baja el error de 0,01 en todo el tramo, en dos curvas distintas.', xp: 55 });
        el.appendChild(m.root);
        taylorLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>El comportamiento es siempre el mismo, y vale la pena decirlo con palabras: <b>el polinomio arranca
              pegado en cero y se despega al alejarse</b>. Cada término más empuja el punto de despegue más lejos,
              pero no lo elimina.</p>
              <div class="callout key"><b>Lo que hay que llevarse.</b> «La serie converge» no es la pregunta útil. La
              pregunta útil — como desde hace tres niveles — es <b>cuán deprisa</b>. Para cubrir el seno de −7 a 7
              con un error menor de 0,01 hace falta el grado <b>19</b>. Para cubrirlo solo cerca de cero basta el
              grado 3.</div>
              <p class="mb0">Mira también el primer término del seno: es <b>x</b>. Quiere decir que para ángulos
              pequeños <b>sin x ≈ x</b>. Tenlo ahí: dentro de dos apartados será el corazón del nivel.</p>`,
    },

    {
      t: 'El muro: donde la serie deja de funcionar',
      html: `<p>Ahora elige la última curva, <b>1/(1−x)</b>, y sube el grado al máximo. Mira los bordes.</p>
             <p>Su serie es la más simple de todas: <b>1 + x + x² + x³ + …</b> — es la serie geométrica del nivel
             15·b. Y dentro de la franja verde funciona de maravilla. Fuera <b>explota</b>: añadir términos no
             mejora nada, empeora.</p>
             <div class="callout warn"><b>No es un defecto del juego.</b> Con x = 2 la serie se convierte en
             1 + 2 + 4 + 8 + 16 + … que crece sin parar nunca, mientras que 1/(1−2) vale simplemente −1. Ningún
             número de términos puede llevar una suma que explota a valer −1.</div>
             <p>Esa franja se llama <b>radio de convergencia</b>, y aquí vale 1. Toda serie tiene uno: para el seno,
             el coseno y la exponencial es infinito — funcionan en todas partes — para esta es 1.</p>
             <div class="callout key"><b>¿Por qué justo 1?</b> Porque en x = 1 la función <b>explota de verdad</b>:
             1/(1−1) es una división por cero. Una serie de potencias no puede pasar más allá de un punto donde la
             función se vuelve loca, ni siquiera de lejos. Su alcance es la distancia al problema más cercano.</div>
             <p class="mb0">Los tests de este nivel lo comprueban de la forma más directa: fuera del radio se
             verifica que el error <b>crezca</b> al subir el grado, y que en grado 40 esté por encima de 100.</p>`,
    },

    {
      t: 'La fórmula de Euler, leída en el papel',
      html: `<p>En el nivel M·8 demostraste que e^(iθ) = cos θ + i·sin θ con un límite: el banco que paga intereses
             imaginarios. Aquí está la segunda demostración, y es la que hizo de verdad Euler en 1748. Solo hace
             falta saber escribir tres series y mirarlas.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Las tres series', html: '<b>eˣ</b> = 1 + x + x²/2! + x³/3! + x⁴/4! + …<br><b>cos x</b> = 1 − x²/2! + x⁴/4! − …<br><b>sin x</b> = x − x³/3! + x⁵/5! − …' },
          { h: 'Mira los grados', html: 'El coseno usa <b>solo las potencias pares</b>. El seno <b>solo las impares</b>. La exponencial las usa <b>todas</b>. Parece una curiosidad: es la clave.' },
          { h: 'Pon ix en lugar de x', html: 'En la serie de la exponencial escribe ix. El término de grado k se convierte en (ix)^k/k! = i^k · x^k/k!. Y i^k gira en redondo: <b>1, i, −1, −i, 1, i, …</b>' },
          { h: 'Separa', html: 'Los términos de grado <b>par</b> tienen i^k = ±1: son <b>reales</b>. Los de grado <b>impar</b> tienen i^k = ±i: son <b>imaginarios</b>. La serie se parte en dos mitades que no se mezclan.' },
          { h: 'Lee las dos mitades', html: 'La mitad real es 1 − x²/2! + x⁴/4! − … es decir <b>exactamente cos x</b>. La mitad imaginaria es i·(x − x³/3! + x⁵/5! − …) es decir <b>i·sin x</b>.' },
          { h: 'La fórmula', html: '<b>e^(ix) = cos x + i·sin x</b>. No hay ningún paso escondido: son las mismas cifras, reordenadas. Y por eso esa fórmula, la primera vez que se ve, parece un milagro y después parece obvia.' },
          { h: 'En el test', html: 'El test de este nivel no se limita a comprobar el total: verifica que la <b>mitad par</b> de la serie de e^(ix) coincida término a término con la serie del coseno, y la mitad impar con la del seno.' },
        ], { doneLabel: '¡Ahora vuelve!' });
      },
      after: `<div class="callout ok"><b>Dos demostraciones independientes de la misma fórmula.</b> En el nivel M·8
              por límite, aquí por serie. No es redundancia: son dos maneras de ver lo mismo, y quien ha visto dos ya
              no la olvida.</div>`,
    },

    {
      t: 'Y ahora el golpe: el √N de Grover es una serie truncada',
      html: `<p>Aquí llega la pieza que hace que este nivel no sea opcional en espíritu, aunque lo sea de hecho.</p>
             <p>En el nivel M·2 viste que cada vuelta de Grover gira la flecha <b>2θ</b>, donde</p>
             <div class="formula">θ = arcsin(√(1/N))</div>
             <p>y que las vueltas útiles son las que llevan la flecha cerca de 90°, es decir unas <b>(π/4)/θ</b>.
             Hasta aquí es exacto. Ahora mira qué pasa cuando N es grande.</p>
             <div class="callout key">La serie de Taylor del arcoseno empieza con <b>arcsin(u) = u + u³/6 + …</b> Con
             u = 1/√N, el segundo término es mil veces más pequeño que el primero ya para listas de unos cientos de
             casillas. Así que <b>θ ≈ 1/√N</b>, y las vueltas se convierten en <b>(π/4)·√N</b>.</div>
             <p>De ahí viene el √N. No es una ley de la naturaleza escrita aparte: es
             <b>una aproximación de Taylor parada en el primer término</b>.</p>
             <p>En el juego: mueve la longitud de la lista y mira cómo las dos curvas — sin x y la recta x — se
             separan cuando el ángulo crece, y se superponen cuando es pequeño. Y compara las vueltas que de verdad
             funcionan con las que dice la fórmula.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'piccoli', title: 'Dónde aguanta la aproximación y dónde no', text: 'encuentra una lista donde la diferencia baje del 1%, y otra donde pase del 4%.', xp: 60 });
        el.appendChild(m.root);
        piccoliAngoliLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>En una lista de un millón de casillas la diferencia entre el ángulo verdadero y su aproximación es
              <b>menos de una diezmilésima</b>. En una lista de cuatro casillas es el <b>4,5%</b>, y en una de dos el
              <b>10%</b>.</p>
              <div class="callout key"><b>¿Y el número de vueltas?</b> Aguanta casi siempre, porque se redondea a un
              entero y el redondeo perdona. Los tests lo comprueban en <b>dos mil</b> longitudes de lista comparando
              la fórmula (π/4)·√N con el número de vueltas que de verdad lleva más arriba la probabilidad: coinciden
              casi siempre, fallan <b>una docena de veces</b>, y cuando fallan es siempre por <b>una sola
              vuelta</b>.</div>
              <p class="mb0">Esta es la forma honesta de contar una aproximación: no «es igual», sino «se equivoca en
              esto, y te cuesta aquello». La primera lista en la que la fórmula resbala es la de <b>dos
              casillas</b> — justo el caso en que sin x ≈ x falla un 10%.</p>`,
    },

    {
      t: 'Seiscientos años, y un nombre equivocado',
      html: `<p>La historia de estas series es un caso de manual de cómo los nombres en matemáticas cuentan la
             geografía más que la cronología.</p>
             <p>Hacia el <b>1400</b>, en Kerala, en el sur de la India, <b>Mādhava de Sangamagrāma</b> escribe las
             series del <b>seno</b>, del <b>coseno</b> y del <b>arcotangente</b>. Con esta última calcula π con
             <b>trece cifras decimales</b>. Funda una escuela — la escuela de Kerala — que sigue trabajando en ello
             durante dos siglos.</p>
             <div class="callout key">Son las mismas series que dibuja el juego. Newton las reencuentra en
             <b>1669</b>, James Gregory reencuentra la del arcotangente en <b>1671</b>, Leibniz en <b>1673</b> — y de
             hecho esa serie hoy se llama «serie de Gregory». Doscientos cincuenta, trescientos años después.</div>
             <p><b>Brook Taylor</b>, inglés, enuncia el teorema general en <b>1712</b> y lo publica en <b>1715</b> en
             el <i>Methodus incrementorum directa et inversa</i>. El libro pasa casi inadvertido: solo en <b>1772</b>
             <b>Lagrange</b> lo llama «el principio fundamental del cálculo diferencial», y de ahí queda el
             nombre.</p>
             <p><b>Euler</b>, en <b>1748</b>, usa las series con una soltura que hoy haría temblar a cualquiera — las
             suma, las reordena, las multiplica como si fueran polinomios finitos — y saca de ahí
             e^(ix) = cos x + i·sin x. Tenía razón, pero el permiso para hacer esas jugadas llegaría solo un siglo
             después, con la puntillosidad del XIX que encontraste en el nivel M·8.</p>
             <div class="callout warn"><b>Un último aviso, y no es teórico.</b> En el siglo XIX <b>Cauchy</b>
             encuentra una función a la que le pasa algo desagradable: todas sus derivadas en cero valen cero, así
             que su serie de Taylor es <b>todo ceros</b> — y sin embargo la función no es cero. La serie converge
             estupendamente, y converge a lo que no es. Por eso «la serie existe» y «la serie reconstruye la función»
             son dos afirmaciones distintas, y la segunda hay que demostrarla.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego, sobre el seno, sube de grado de uno en uno: 1, 3, 5, 7. ¿Qué pasa en los
           grados pares? <span class="muted">(nada: el seno solo tiene potencias impares, y los términos pares valen
           cero)</span></p>
        <p><b>2.</b> Sobre el seno, con grado 3, ¿hasta dónde aguanta la copia a ojo?
           <span class="muted">(hasta x = 1 más o menos, es decir 57°: por eso «ángulo pequeño» en física significa
           aproximadamente hasta ahí)</span></p>
        <p><b>3.</b> Elige 1/(1−x) y prueba x = 2 mentalmente: ¿cuánto da la función, y cuánto la suma
           1+2+4+8+…? <span class="muted">(−1 contra infinito: por eso fuera del radio no hay esperanza)</span></p>
        <p><b>4.</b> En el segundo juego lleva la lista a 2^20. ¿Cuántas vueltas hacen falta, y cuánto tardaría una
           búsqueda normal? <span class="muted">(804 vueltas contra medio millón de intentos de media)</span></p>
        <p class="mb0"><b>5.</b> De inventor: en el segundo juego baja a listas cortas y mira cuándo se separan las
           «vueltas mejores» y la fórmula. <span class="muted">(en la lista de 2: la fórmula dice 1 vuelta, la cima
           real está en 0 — el único caso en que la aproximación cuesta algo de verdad)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué es el polinomio de Taylor de una función en un punto?', options: ['una función que se le parece en todas partes', 'el polinomio que en ese punto tiene el mismo valor, la misma pendiente, la misma curvatura, y así sucesivamente', 'su derivada', 'la recta que la corta en dos puntos'], correct: 1,
      why: 'Cada término más obliga a que coincida una derivada más, y de esa exigencia sale la fórmula de los coeficientes f⁽ᵏ⁾(0)/k!. Por eso la copia es perfecta en el punto y empeora al alejarse.' },
    { q: '¿Por qué la serie de 1/(1−x) no funciona para x = 2?', options: ['porque 2 es demasiado grande', 'porque la suma 1+2+4+8+… explota mientras la función vale −1: fuera del radio de convergencia ningún número de términos basta', 'porque faltan los términos impares', 'porque el ordenador no puede'], correct: 1,
      why: 'El radio de convergencia es 1, y es la distancia al punto donde la función se vuelve loca de verdad: x = 1, una división por cero. Una serie de potencias no consigue saltar ese problema.' },
    { q: '¿Cómo se lee la fórmula de Euler a partir de las series?', options: ['se suman cos y sin', 'se pone ix en la serie de eˣ: los términos pares siguen reales y dan cos x, los impares se vuelven imaginarios y dan i·sin x', 'se deriva dos veces', 'se usa el teorema de Pitágoras'], correct: 1,
      why: 'i^k gira en redondo — 1, i, −1, −i — así que la serie se parte en dos mitades que no se mezclan, y esas mitades son exactamente las series del coseno y del seno. Es la demostración de Euler de 1748.' },
    { q: '¿De dónde viene el √N en el número de vueltas de Grover?', options: ['de una ley de la física cuántica', 'de sin x ≈ x: el ángulo arcsin(√(1/N)) vale aproximadamente 1/√N, y las vueltas son unas (π/4)/θ', 'del número de cúbits', 'de la transformada de Fourier'], correct: 1,
      why: 'Es una serie de Taylor parada en el primer término. La ventaja cuántica más famosa del curso nace de la aproximación más común de la física.' },
    { q: '¿Cómo de fiable es la fórmula (π/4)·√N para el número de vueltas?', options: ['siempre exacta', 'casi siempre correcta: en dos mil longitudes de lista falla una docena de veces, y siempre por una sola vuelta', 'equivocada casi siempre', 'correcta solo para listas pequeñas'], correct: 1,
      why: 'El redondeo a un entero perdona casi todo el error de la aproximación. La primera lista en la que resbala es la de dos casillas, donde sin x ≈ x falla un 10%.' },
    { q: '¿Quién escribió primero las series del seno y del coseno?', options: ['Brook Taylor en 1715', 'Mādhava de Sangamagrāma en Kerala, hacia 1400 — dos siglos y medio antes de que Newton las reencontrara', 'Euler en 1748', 'Newton en 1669'], correct: 1,
      why: 'Con la serie del arcotangente Mādhava calculó π con trece cifras decimales. Newton las reencontró en 1669 y Gregory en 1671: esa serie lleva hoy el nombre de Gregory.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Cualquier curva, vista de cerca, es un polinomio — y cada término más
          ensancha el «de cerca». De aquí salen tres cosas: cómo calcula de verdad un ordenador el seno, la segunda
          demostración de la fórmula de Euler (la primera, por límite, estaba en el nivel M·8) y el √N de Grover, que
          es la serie del arcoseno parada en el primer término. Y un aviso: toda serie tiene un radio, y fuera de él
          añadir términos empeora.</div>`,
});
@endsection
