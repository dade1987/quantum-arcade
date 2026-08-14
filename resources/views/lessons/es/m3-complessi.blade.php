@php($description = 'Números complejos explicados jugando: multiplicar significa alargar y girar, de ahí sale e^(iθ) sin magia, y las raíces n-ésimas de la unidad que sumadas dan cero — es decir, la interferencia destructiva sobre la que se apoya la transformada de Fourier.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { prodottoLab, radiciLab } from '/js/widgets/complessi.js';

const L = renderLesson({
  id: 'm3-complessi',
  lead: `En el nivel 8 las flechas llegaron porque hacían falta: solo con más y menos ciertas cuentas no salían.
         Desde entonces las has usado bastante. Aquí se ponen en orden, y se llega a las dos cosas sobre las que se
         apoya toda la segunda mitad del curso: <b>por qué se escribe e^(iθ)</b> — que parece una provocación y en
         cambio es la única escritura sensata — y las <b>raíces de la unidad</b>, es decir las flechas con las que
         está hecha la transformada de Fourier. Al final sabrás también por qué el pico de la DFT es un pico.`,

  steps: [
    {
      t: 'El repaso, y la pregunta que nadie hace',
      html: `<p>Un número complejo es <b>una flecha en el plano</b>: dos números, el horizontal y el vertical,
             escritos a + bi. La <b>i</b> no es un número misterioso: es la etiqueta que dice «este segundo número
             está en la otra dirección».</p>
             <p><b>Sumarlos</b> es fácil y lo haces desde hace diez niveles: punta con cola, como las flechas de las
             ondas. Pero hay una pregunta que normalmente nadie hace, y es la que lo abre todo:</p>
             <div class="callout key"><b>¿Qué significa, geométricamente, <i>multiplicar</i> dos flechas?</b> Sumar
             se ve. Multiplicar, mirando a + bi, parece solo un paréntesis que hay que desarrollar. Y en cambio tiene
             un significado preciso, y sorprendentemente sencillo.</div>
             <p>En el juego mueve las dos flechas y mira la tercera, el producto. Busca la regla antes de leerla
             abajo: <b>mira las longitudes, luego mira los ángulos</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'prodotto', title: 'Tres objetivos', text: 'lleva el producto a 3 objetivos distintos.', xp: 45 });
        el.appendChild(m.root);
        prodottoLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Esta es la regla, y son dos líneas:</p>
              <div class="formula">las <b>longitudes</b> se multiplican &nbsp;·&nbsp; los <b>ángulos</b> se suman</div>
              <p>No es una casualidad ni un convenio. Desarrolla el producto de dos flechas de longitud 1:</p>
              <div class="formula">(cos a + i·sin a) × (cos b + i·sin b)</div>
              <p>La parte sin i sale <b>cos a·cos b − sin a·sin b</b>; la parte con la i sale
              <b>sin a·cos b + cos a·sin b</b>. Son, palabra por palabra, las <b>fórmulas de adición</b> del nivel
              M·2 — es decir cos(a+b) y sin(a+b). El producto <b>es</b> la flecha a a+b grados. No podía ser otra
              cosa.</p>
              <div class="callout ok"><b>Y aquí los números imaginarios dejan de ser raros.</b> «i² = −1» parece una
              afirmación arbitraria que hay que aceptar. Pero i es la flecha de longitud 1 a <b>90°</b>: multiplicar
              por i significa <b>girar un cuarto de vuelta</b>. Hacerlo dos veces es girar 180°, es decir acabar en
              −1. Pruébalo en el juego. i² = −1 no es un axioma: es media vuelta.</div>`,
    },

    {
      t: 'Por qué se escribe e^(iθ), y por qué es la escritura correcta',
      html: `<p>Ahora el paso que normalmente se deja caer desde arriba. Hemos descubierto que multiplicar dos
             flechas de longitud 1 <b>suma sus ángulos</b>. Detengámonos un momento en esa frase, porque es
             insólita.</p>
             <p>¿Qué operación conoces que <b>convierta sumas en productos</b>? Solo existe una, y la conoces desde el
             nivel 0·8:</p>
             <div class="formula">x<sup>a</sup> · x<sup>b</sup> = x<sup>a+b</sup></div>
             <p>Los exponentes se suman cuando las potencias se multiplican. Es <b>exactamente el mismo
             comportamiento</b> de nuestras flechas: ángulos que se suman cuando las flechas se multiplican. Si algo
             se comporta como una exponencial, la única escritura honesta es la exponencial.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'El hecho de partida', html: 'La flecha de longitud 1 en el ángulo θ, multiplicada por la del ángulo φ, da la flecha en el ángulo <b>θ + φ</b>. Llamémosla por un momento F(θ).' },
          { h: 'La propiedad que tiene', html: '<b>F(θ) · F(φ) = F(θ + φ)</b>. Es decir: el producto de las F es la F de la suma.' },
          { h: 'Quién más se comporta así', html: 'La exponencial, y esencialmente solo ella: <b>e^a · e^b = e^(a+b)</b>. La estructura es la misma, casilla por casilla.' },
          { h: 'Así que F es una exponencial', html: 'Tiene que ser <b>F(θ) = e^(kθ)</b> para algún número k. Queda por saber cuál.' },
          { h: 'Qué k', html: 'La flecha gira, no crece: su longitud sigue siendo 1 siempre. Una exponencial con k real, en cambio, explota o se apaga. La única forma de tener «crece nada y gira uno» es tomar k <b>imaginario</b>: k = i.' },
          { h: 'La escritura', html: '<b>e^(iθ) = cos θ + i·sin θ</b>. Esta es la fórmula de Euler, y en este curso la tienes desde el nivel 14 como «la flecha girada θ».' },
          { h: 'Honestidad', html: 'Lo que acabas de ver es un <b>argumento de plausibilidad</b>, no una demostración: dice que e^(iθ) es la escritura sensata, no que sea obligada. La demostración de verdad se hace con las series de Taylor, y está en un nivel posterior de la Parte M. Pero el motivo por el que esa escritura existe está todo aquí: <b>los ángulos se suman</b>.' },
          { h: 'El regalo de Euler', html: 'Pon θ = 180°, es decir π: la flecha acaba en −1. Así que <b>e^(iπ) = −1</b>, que suele escribirse <b>e^(iπ) + 1 = 0</b>. Cinco constantes en cinco símbolos. Y es solo la manera elegante de decir «media vuelta te lleva al otro lado».' },
        ], { doneLabel: '¡Ahora tiene sentido!' });
      },
      after: `<div class="callout key"><b>Lo que te llevas, en la práctica:</b> cada vez que en este curso veas
              e^(iθ) — en la fase de una puerta, en la QFT, en la estimación de fase — puedes leerlo simplemente como
              <b>«la flecha de longitud 1 girada θ»</b>. Y multiplicar dos de esas escrituras significa sumar los
              ángulos, que es la razón por la que las cuentas cuánticas se simplifican tan bien.</div>`,
    },

    {
      t: 'Las raíces de la unidad: n flechas que se anulan',
      html: `<p>Pregunta: ¿qué números, elevados a la <b>n</b>, dan 1? Con los números normales la respuesta es
             deprimente: uno, o como mucho dos (1 y −1). Con las flechas se vuelve preciosa.</p>
             <p>Elevar a la n significa multiplicar por sí mismo n veces, es decir — acabamos de descubrirlo —
             <b>sumar el ángulo n veces</b>. Para que el resultado sea 1, o sea la flecha a 0°, el ángulo
             multiplicado por n tiene que dar <b>un número entero de vueltas</b>. Por tanto:</p>
             <div class="formula">los ángulos buenos son 0°, 360/n, 2·360/n, 3·360/n, …</div>
             <p>Son <b>n flechas equidistantes en la circunferencia</b>: los vértices de un polígono regular, con la
             primera en el 1. Se llaman <b>raíces n-ésimas de la unidad</b>.</p>
             <p>En el juego constrúyelas y luego <b>súmalas</b>, punta con cola. Mira dónde acaba la cadena.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'radici', title: 'Cierra tres polígonos', text: 'suma todas las flechas en 3 valores de n distintos.', xp: 55 });
        el.appendChild(m.root);
        radiciLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>La cadena <b>vuelve exactamente al punto de partida</b>: la suma de todas las raíces n-ésimas de la
              unidad es <b>cero</b>, para cualquier n mayor que 1. Y el motivo es de una sencillez desarmante: están
              colocadas de forma perfectamente equilibrada en todas las direcciones, así que se anulan entre sí —
              como mucha gente tirando de una cuerda con la misma fuerza desde todos los lados.</p>
              <div class="callout ok"><b>Ese cero es el motor de la transformada de Fourier.</b> La DFT del nivel 16
              pesa las muestras justo con estas flechas. Cuando la frecuencia que buscas <b>no</b> está, los pesos
              giran en redondo y suman cero: silencio. Cuando está, todas las flechas apuntan en la misma dirección y
              se suman: el <b>pico</b>. La cadena que se cierra ya la habías visto en el nivel 15·b; ahora sabes
              también <b>quiénes son</b> esas flechas y por qué son exactamente n.</div>
              <p class="mb0">Y la QFT (nivel 18) hace lo mismo con n = 2<sup>número de cúbits</sup> flechas a la vez,
              lo que explica por qué se escribe con potencias de 2 y por qué las fases son e^(2πi·jk/N): son las
              raíces de la unidad elevadas a jk.</p>`,
    },

    {
      t: 'De dónde vienen: trescientos años para hacer un dibujo',
      html: `<p>En el nivel 0·7b viste cómo nacen: <b>Cardano</b> (1545) y <b>Bombelli</b> (1572), como atajo obligado
             para resolver las ecuaciones de tercer grado. Es decir, nacen como <b>una cuenta que funciona</b> y que
             nadie sabe explicar.</p>
             <p>Y así se queda durante <b>doscientos cincuenta años</b>. Se usan porque las cuentas salen, pero se
             miran con recelo — hasta el punto de que es <b>Descartes</b>, en 1637, quien los llama
             <i>imaginarios</i>, y no como un cumplido. Leibniz los define como «un anfibio entre el ser y el no
             ser». Euler, que los usa más que nadie y en <b>1748</b> publica precisamente la fórmula
             e^(ix) = cos x + i·sin x, todavía no tiene una imagen para decir <b>dónde están</b>.</p>
             <div class="callout key">El dibujo que has usado en este nivel — la flecha en el plano — llega solo entre
             <b>1799</b> y <b>1806</b>, y llegan a él tres personas por separado: <b>Caspar Wessel</b>, un agrimensor
             noruego que dibujaba mapas (cuya memoria queda ignorada durante un siglo), <b>Jean-Robert Argand</b>, un
             contable parisino, y <b>Carl Friedrich Gauss</b>, que en <b>1831</b> le da la autoridad que hacía
             falta.</div>
             <p>Gauss escribe algo que vale la pena citar casi literalmente: que la oscuridad que rodea a estos
             números se debe en gran parte a <b>una terminología mal elegida</b>, y que si +1, −1 y √−1 se hubieran
             llamado unidades <b>directa, inversa y lateral</b> en vez de positiva, negativa e imaginaria (o
             «imposible»), <i>«de semejante oscuridad no se habría podido hablar»</i>. Tenía razón: el problema no
             eran los números, era el <b>nombre</b>. Llamar «imaginario» a un cuarto de vuelta frenó las matemáticas
             durante dos siglos.</p>
             <div class="callout ok"><b>La moraleja, y te afecta a ti que estás aprendiendo:</b> durante trescientos
             años estos números fueron «difíciles» solo porque faltaba el dibujo adecuado. En cuanto alguien los puso
             en el plano, se volvieron la cosa más natural del mundo — un alargamiento y una rotación. Si un concepto
             te parece imposible, muy a menudo no es el concepto: es el dibujo que todavía no está.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego pon las dos flechas de longitud 1 y a 90°. ¿Dónde acaba el producto? ¿Y qué
           número es? <span class="muted">(i × i: dos cuartos de vuelta hacen media vuelta, es decir −1)</span></p>
        <p><b>2.</b> Sigue en el primer juego, deja una flecha de longitud 1 y cambia solo su ángulo: ¿cambia la
           longitud del producto? <span class="muted">(no: multiplicar por una flecha de longitud 1 solo gira — y es
           exactamente lo que hace una fase cuántica, que de hecho no cambia las probabilidades)</span></p>
        <p><b>3.</b> En el segundo juego coge n = 3 y suma solo <b>dos</b> de las tres flechas. ¿La suma es cero? ¿Y
           cuánto vale? <span class="muted">(no es cero: el cero llega solo cuando están todas — y por eso en la DFT
           hay que sumar sobre todas las muestras)</span></p>
        <p><b>4.</b> Con n = 4 las cuatro raíces son 1, i, −1, −i. Comprueba a mano que i⁴ = 1.
           <span class="muted">(cuatro cuartos de vuelta)</span></p>
        <p class="mb0"><b>5.</b> De inventor: multiplica dos raíces n-ésimas de la unidad entre sí. ¿El resultado
           sigue siendo una raíz n-ésima? <span class="muted">(sí, siempre: los ángulos se suman y siguen siendo
           múltiplos de 360/n. Este hecho tiene un nombre — «forman un grupo» — y volverá cuando hablemos de las
           simetrías de las puertas cuánticas)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué significa, geométricamente, multiplicar dos números complejos?', options: ['sumar las longitudes y los ángulos', 'multiplicar las longitudes y sumar los ángulos', 'multiplicar longitudes y ángulos', 'sumar las longitudes y multiplicar los ángulos'], correct: 1,
      why: 'Al desarrollar (cos a + i sin a)(cos b + i sin b) aparecen exactamente las fórmulas de adición: el resultado es la flecha en el ángulo a+b. Las longitudes, en cambio, se multiplican entre sí.' },
    { q: '¿Por qué i² = −1, mirando las flechas?', options: ['es un axioma que hay que aceptar', 'porque i es la flecha a 90°, y girar dos veces 90° lleva a 180°, es decir a −1', 'porque i es negativo', 'porque la longitud se duplica'], correct: 1,
      why: 'Multiplicar por i es girar un cuarto de vuelta. Dos cuartos de vuelta hacen media vuelta: se acaba en la parte negativa del eje horizontal, es decir en −1. No hay nada que aceptar.' },
    { q: '¿Por qué la flecha girada θ se escribe precisamente como una exponencial, e^(iθ)?', options: ['para abreviar', 'porque al multiplicar las flechas los ángulos se SUMAN, y es el comportamiento de las potencias: x^a · x^b = x^(a+b)', 'porque e vale unos 2,718', 'porque lo decidió Euler'], correct: 1,
      why: 'La exponencial es la operación que convierte sumas de exponentes en productos. Las flechas de longitud 1 hacen lo mismo con los ángulos, así que la escritura exponencial es la que describe su comportamiento.' },
    { q: '¿Qué son las raíces n-ésimas de la unidad?', options: ['los divisores de n', 'n flechas de longitud 1 equidistantes en la circunferencia: elevadas a la n dan todas 1', 'las soluciones de x² = n', 'los primos menores que n'], correct: 1,
      why: 'Elevar a la n suma el ángulo n veces: para que el resultado sea 1 el ángulo tiene que ser múltiplo de 360/n. Salen n, en los vértices de un polígono regular con la primera en el 1.' },
    { q: '¿Cuánto vale la suma de todas las n raíces n-ésimas de la unidad (con n > 1)?', options: ['n', '1', '0', 'depende de n'], correct: 2,
      why: 'Están colocadas de forma perfectamente equilibrada en todas las direcciones, así que se anulan entre sí: la cadena punta-cola vuelve al punto de partida. Es el cero que en la DFT cancela todas las frecuencias equivocadas.' },
    { q: '¿Qué relación hay entre las raíces de la unidad y la transformada de Fourier?', options: ['ninguna', 'la DFT pesa las muestras justo con esas flechas: cuando la frecuencia no está suman cero, cuando está se alinean y hacen el pico', 'solo sirven para la FFT', 'sirven para normalizar los resultados'], correct: 1,
      why: 'Los coeficientes e^(2πi·jk/N) de la DFT son las raíces N-ésimas de la unidad elevadas a jk. El silencio en las frecuencias equivocadas es su suma nula; el pico es el caso en que todas apuntan en la misma dirección.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Multiplicar es alargar y girar; de ahí e^(iθ) se vuelve la escritura
          obvia en vez de una magia, e i² = −1 se vuelve media vuelta. Las raíces n-ésimas de la unidad son n flechas
          equidistantes que sumadas dan cero — y es ese cero, y no otra cosa, el motivo por el que la transformada de
          Fourier tiene un pico y no ruido. De aquí en adelante cada e^(iθ) del curso se lee de un vistazo.</div>`,
});
@endsection
