@php($description = 'La aritmética del reloj jugando: el resto (mod), el máximo común divisor con el método de Euclides, el periodo de a^x mod N y las fracciones continuas. La matemática clásica que hay dentro del algoritmo de Shor.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { clockLab, euclidLab, periodLab } from '/js/widgets/modmath.js';

const L = renderLesson({
  id: '00-orologio',
  lead: `Este nivel enseña tres cosas que ya sabes a medias: <b>contar dando vueltas</b> (como en el reloj),
         <b>encontrar la pieza que cabe exacta en dos medidas distintas</b> (el máximo común divisor) y
         <b>darte cuenta de que un ritmo se repite</b>. Son cosas de secundaria, y son las tres herramientas con las
         que se desmonta el algoritmo más famoso del curso: el que, en teoría, rompe las contraseñas de medio
         Internet. Shor tiene una sola parte difícil; todo lo demás está aquí dentro.`,

  steps: [
    {
      t: 'Contar dando vueltas: el resto',
      html: `<p>Son las <b>10</b>. ¿Qué hora será dentro de <b>5</b> horas? Las <b>3</b>. No las 15: has contado más allá
             del final de la esfera, has vuelto a pasar por el 12 y has empezado de nuevo.</p>
             <p>Esta manera de contar tiene un nombre y un símbolo:</p>
             <div class="formula">15 mod 12 = <span class="hl-n">3</span></div>
             <p>«mod» se lee «módulo» y significa una sola cosa: <b>toma el resto de la división</b>.
             15 dividido entre 12 da 1 con resto 3, y el resto es donde se para la aguja.</p>
             <div class="callout key">Una esfera puede tener las horas que queramos. Con 7 horas:
             <b>17 mod 7 = 3</b>, porque 17 = 2×7 + 3 — dos vueltas enteras y luego tres pasos.</div>
             <p>En el juego de abajo mueve el número y mira la espiral: <b>cada vuelta dibujada es una vuelta real</b>.
             Cuando llegas al final, lo que sobra es el resto.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'orologio', title: 'Tres caminos, la misma hora', text: 'para la aguja en el objetivo con 3 números distintos.', xp: 30 });
        el.appendChild(m.root);
        clockLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Habrás notado lo más importante: al objetivo llegas con <b>muchos números distintos</b>.
              Con una esfera de 7 horas, los números 3, 10, 17, 24, 31… caen todos en la misma hora, separados
              exactamente por 7.</p>
              <div class="callout key">Para el reloj esos números son <b>la misma cosa</b>. Es la idea que Gauss puso
              por escrito en 1801 y sobre la que hoy se sostiene la criptografía: cuando trabajas «mod N» no existen
              infinitos números, existen solo <b>N</b>.</div>`,
    },

    {
      t: 'El suelo de Euclides: el máximo común divisor',
      html: `<p>Tienes una habitación de <b>48</b> de ancho y <b>18</b> de fondo, y quieres embaldosarla con
             <b>baldosas cuadradas todas iguales</b>, sin cortar ni una. ¿Cómo de grande puede ser la baldosa?</p>
             <p>El lado más grande posible es el <b>máximo común divisor</b> de 48 y 18. Dicho sin fórmulas:
             <b>la regla más larga que cabe un número entero de veces en los dos lados</b>.</p>
             <p>Hay una forma de encontrarlo que no obliga a probar números uno por uno, y tiene unos 2300 años:
             está en los <i>Elementos</i> de Euclides. En el juego lo haces a mano:</p>
             <ol>
               <li>recorta del suelo el <b>cuadrado más grande que quepa</b>;</li>
               <li>mira el rectángulo que sobra;</li>
               <li>vuelve a empezar con él.</li>
             </ol>
             <p>El lado del <b>último</b> cuadrado — aquel tras el cual ya no sobra nada — es la respuesta.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'euclide', title: 'Embaldosa sin cortar', text: 'termina dos suelos distintos.', xp: 30 });
        el.appendChild(m.root);
        euclidLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Escrito en números, el suelo 48 × 18 dice esto:</p>
              <div class="formula mono">48 = 2×18 + 12 &nbsp;·&nbsp; 18 = 1×12 + 6 &nbsp;·&nbsp; 12 = 2×6 + <span class="hl-n">0</span></div>
              <p>En cuanto el resto es cero, el número entre el que estabas dividiendo es el máximo común divisor: <b>6</b>.</p>
              <div class="callout key"><b>Por qué es rapidísimo:</b> en cada paso el número mayor se acorta deprisa, y en
              1844 Gabriel Lamé demostró que los pasos nunca superan cinco veces el número de cifras. Con números de 600
              cifras son unos miles de operaciones: un abrir y cerrar de ojos. Tenlo presente, porque dentro de dos pasos
              será justo lo que cuenta: <b>la última pieza de Shor es gratis</b>.</div>`,
    },

    {
      t: 'El ritmo que vuelve: el periodo',
      html: `<p>Ahora juntemos las dos cosas. Toma una esfera de <b>15</b> horas, parte del <b>1</b> y haz siempre el
             mismo movimiento: <b>multiplica por 7 y toma el resto</b>.</p>
             <div class="formula mono">1 → 7 → 4 → 13 → <span class="hl-n">1</span> → 7 → 4 → 13 → 1 …</div>
             <p>Tras <b>4</b> pasos has vuelto al punto de partida, y a partir de ahí la secuencia se repite igual para
             siempre. Ese número de pasos se llama <b>periodo</b> y se escribe <b>r</b>.</p>
             <p>En el juego el paseo se dibuja solo: cada multiplicación es una cuerda sobre la esfera, y cuando vuelves
             a pasar por el 1 <b>la figura se cierra</b>. Mira la estrella que sale: ese es el ritmo.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'periodo', title: 'Cierra dos estrellas', text: 'encuentra el periodo para dos parejas (N, a) distintas.', xp: 40 });
        el.appendChild(m.root);
        periodLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Surgen dos preguntas naturales, y las dos tienen respuesta:</p>
              <p><b>¿Siempre se vuelve al 1?</b> Sí, siempre que el multiplicador no comparta factores con la esfera,
              es decir, mientras su máximo común divisor sea 1. Es el teorema de Euler (1763), y es la razón por la que
              el juego solo te deja elegir ciertos multiplicadores: con los demás la estrella no se cerraría nunca.</p>
              <p><b>¿Y con números grandes?</b> Ahí se cae todo. En una esfera de 15 el ritmo se ve a simple vista; en
              una esfera de 600 cifras ni todos los ordenadores del planeta, trabajando durante años, logran
              encontrarlo, porque los pasos que habría que probar son más que los granos de arena del universo.</p>
              <div class="callout key"><b>Y ahí está todo el asunto:</b> factorizar un número — partirlo en sus factores
              primos, que es lo que protege las claves RSA — equivale a encontrar este ritmo. El ordenador cuántico no
              prueba los pasos uno por uno: los pone <b>todos en superposición</b> y luego usa la transformada de Fourier
              para hacer emerger el ritmo. El resto — máximo común divisor incluido — es la matemática que acabas de
              jugar.</div>`,
    },

    {
      t: 'Una última herramienta: la fracción más simple',
      html: `<p>Falta una sola pieza, y conviene verla ahora que es fácil. Al final, el ordenador cuántico no te entrega
             el periodo: te entrega un <b>número medido</b> que se le parece mucho. Algo como <b>0,3337</b>. El periodo
             hay que sacarlo de ahí.</p>
             <p>La pregunta pasa a ser: <b>¿cuál es la fracción más simple que está pegadísima a este número?</b> El
             método para responder se llama <b>fracciones continuas</b> y es, otra vez, Euclides disfrazado.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'El número medido', html: 'La máquina ha medido <b>0,3337</b>. Sabemos que está cerca de k/r, donde r es el periodo que buscamos, pero no sabemos ni k ni r.' },
          { h: 'Primer paso', html: '0,3337 es menor que 1: la parte entera es <b>0</b>. Nos quedamos con 0,3337 y lo damos la vuelta: <b>1 / 0,3337 ≈ 2,9967</b>.' },
          { h: 'Segundo paso', html: 'La parte entera de 2,9967 es <b>2</b>… pero sobra 0,9967, que es casi 1. Le damos la vuelta otra vez: <b>1 / 0,9967 ≈ 1,0033</b>, parte entera <b>1</b>.' },
          { h: 'Se recompone', html: 'Al juntar las piezas (0; 2, 1) sale la fracción <b>1/3</b>. Y en efecto 1/3 = 0,3333…, a un pelo de 0,3337.' },
          { h: 'La respuesta', html: 'El denominador es <b>3</b>: <b>el periodo es r = 3</b>. Y ese es el salto: de un decimal sucio, medido una sola vez, se vuelve a un entero exacto.' },
          { h: 'Por qué no basta redondear', html: 'Porque 0,3337 también se parece a 3337/10000, una fracción válida y completamente inútil. Las fracciones continuas buscan la <b>más simple</b>, la de denominador más pequeño: es la única que puede ser un periodo.' },
        ], { doneLabel: '¡Claro!' });
      },
      after: `<div class="callout ok">Ya tienes <b>todas</b> las piezas clásicas del algoritmo de Shor: el resto, el
              periodo, las fracciones continuas y el máximo común divisor. Cuando llegues allí, lo único realmente nuevo
              será la parte cuántica, que es una sola y ocupa tres líneas del circuito.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En una esfera de 12 horas, ¿qué números entre 0 y 50 caen en el <b>7</b>? ¿Qué diferencia hay entre
           un número de la lista y el siguiente?</p>
        <p><b>2.</b> En el suelo de Euclides prueba <b>21 × 13</b>. ¿Qué lado tiene la última baldosa? ¿Qué significa eso
           sobre esos dos números? <span class="muted">(pista: se dice que son «primos entre sí»)</span></p>
        <p><b>3.</b> En la esfera de 15, ¿qué ritmo da el multiplicador 4? ¿Y el 14? Uno de los dos tiene periodo <b>2</b>:
           un periodo tan corto, ¿ayuda o no a quien quiere factorizar?</p>
        <p class="mb0"><b>4.</b> Pregunta de inventor: ¿por qué el juego no te deja elegir el multiplicador <b>3</b> en
           una esfera de 15? Intenta imaginar qué le pasaría al paseo.
           <span class="muted">(y si llegas hasta ahí: ese «fracaso» es en realidad una suerte, porque te regala de
           inmediato un factor de 15)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué significa «17 mod 5»?', options: ['17 multiplicado por 5', 'el resto de dividir 17 entre 5', '17 elevado a 5', 'la mitad de 17'], correct: 1,
      why: '17 = 3×5 + 2, así que 17 mod 5 = 2. Es donde se para la aguja en una esfera de 5 horas.' },
    { q: 'En una esfera de 7 horas, ¿cuáles de estos números caen en la misma hora?', options: ['3 y 5', '4 y 14', '10 y 17', '6 y 8'], correct: 2,
      why: '10 y 17 están separados por 7, una vuelta exacta: 10 mod 7 = 3 y 17 mod 7 = 3. Los números que caen en la misma hora están siempre separados por un múltiplo de N.' },
    { q: 'En el método de Euclides con baldosas, ¿qué representa el último cuadrado recortado?', options: ['el menor de los dos números', 'el máximo común divisor', 'la mitad del rectángulo', 'un número primo'], correct: 1,
      why: 'El lado del último cuadrado cabe un número entero de veces en los dos lados de partida, y es el mayor que lo hace: esa es la definición de máximo común divisor.' },
    { q: '¿Qué es el «periodo r» de la secuencia 1, 7, 4, 13, 1, 7, 4, 13, …?', options: ['el número más grande de la secuencia', 'cuántos pasos hacen falta para volver al 1', 'la suma de los números', 'el resto final'], correct: 1,
      why: 'Tras 4 pasos se vuelve al 1 y todo empieza de nuevo: r = 4. Encontrar este número es el único punto en el que Shor necesita el ordenador cuántico.' },
    { q: '¿Por qué el multiplicador debe tener máximo común divisor 1 con la esfera?', options: ['para hacer el juego más difícil', 'si no, el paseo no vuelve nunca al 1', 'para que cuadren los porcentajes', 'no es cierto: vale cualquier número'], correct: 1,
      why: 'Si comparten un factor, las potencias quedan atrapadas en los múltiplos de ese factor y no vuelven a pasar por el 1: no hay periodo que encontrar. En Shor, sin embargo, descubrirlo es una suerte: ese factor común ya es un factor de N.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Contar dando vueltas, el suelo de Euclides, el ritmo que vuelve y la
          fracción más simple: cuatro herramientas clásicas, sin ninguna fórmula caída del cielo. Cuando llegues al
          algoritmo de Shor no tendrás que aprenderlas allí, con prisa y junto a todo lo demás: las reconocerás.</div>`,
});
@endsection
