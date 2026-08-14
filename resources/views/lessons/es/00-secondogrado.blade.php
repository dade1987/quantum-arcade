@php($description = 'Ecuaciones de segundo grado explicadas jugando: el discriminante como «cuántas veces la parábola encuentra la recta», la fórmula construida con el método de al-Juarismi en vez de memorizada, y el discriminante negativo que en el siglo XVI abrió la puerta a los números imaginarios.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { parabolaLab, quadratoLab } from '/js/widgets/secondogrado.js';

const L = renderLesson({
  id: '00-secondogrado',
  lead: `La fórmula de las ecuaciones de segundo grado es probablemente lo más memorizado de toda la escuela — y una
         de las cosas menos entendidas. Aquí no te la pido de memoria: te la hago <b>construir</b>, con un dibujo que
         tiene 1200 años. Al final sabrás también por qué en este curso hace falta: el número que está bajo la raíz
         es exactamente lo mismo que, en el nivel <b>18·b</b>, decide si una puerta cuántica tiene direcciones fijas
         o solo fases que giran.`,

  steps: [
    {
      t: 'Qué es una «solución», visto desde fuera',
      html: `<p>Una ecuación de primer grado (nivel 0·7) es una balanza: 2x + 3 = 11, mueves, divides, sale x = 4.
             En el segundo grado aparece la <b>x multiplicada por sí misma</b> — x², un área — y la balanza sola ya no
             basta: no puedes «pasar al otro lado» una x que está dentro de un cuadrado.</p>
             <p>Antes de resolver, sin embargo, miremos <b>qué estamos buscando</b>. Escribe ax² + bx + c y dibuja el
             resultado para cada x: sale una curva en forma de U, la <b>parábola</b>. Las soluciones de
             ax² + bx + c = <b>0</b> son los puntos donde esa curva vale cero, es decir, donde <b>encuentra la
             recta</b>.</p>
             <div class="callout key">Dicho así desaparece el misterio de las «ecuaciones imposibles»: una curva en U
             puede encontrar una recta <b>dos veces</b>, <b>una sola</b> (si la roza) o <b>nunca</b>, si se queda
             entera por encima o por debajo. Tres casos, no uno raro.</div>
             <p>En el juego mueve los tres números e intenta obtener los tres casos. Vigila el número de abajo a la
             izquierda mientras lo haces.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'parabola', title: 'Los tres casos, los tres', text: 'consigue dos soluciones, luego una sola, luego ninguna.', xp: 40 });
        el.appendChild(m.root);
        parabolaLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>El número que cambiaba de color abajo es <b>b² − 4ac</b>, y tiene un nombre famoso: el
              <b>discriminante</b> (porque «discrimina» entre los tres casos). No es una fórmula que memorizar: es la
              cuenta que dice <b>cuántas veces</b> la curva encuentra la recta.</p>
              <table class="table">
                <tr><th>Discriminante</th><th>La curva</th><th>Soluciones</th></tr>
                <tr><td class="mono">&gt; 0</td><td>corta la recta en dos puntos</td><td class="mono">2</td></tr>
                <tr><td class="mono">= 0</td><td>la toca y vuelve a subir</td><td class="mono">1</td></tr>
                <tr><td class="mono">&lt; 0</td><td>no la encuentra nunca</td><td class="mono">0</td></tr>
              </table>
              <p class="mb0">Queda la pregunta de verdad: <b>de dónde sale</b> ese b² − 4ac. No ha caído del cielo.
              Es una pieza de un dibujo, y ahora lo construimos.</p>`,
    },

    {
      t: 'Los diez enanos y la baldosa que sobra',
      html: `<p>Tomemos una ecuación escrita como se escribía hace mil años, sin signos menos:</p>
             <div class="formula">x² + 10x = 39</div>
             <p>y leámosla como un <b>problema de pavimentos</b>. Hay un patio <b>cuadrado</b> de lado x — es decir,
             de área x² — y al lado hay <b>10 enanos</b>, cada uno de un paso de ancho y tan largo como el patio: diez
             tiras de área x cada una. Patio más enanos hacen 39 baldosas en total. ¿Cuánto mide el patio?</p>
             <div class="callout key"><b>El movimiento, y son los enanos quienes lo sugieren:</b> en fila por un solo
             lado, los diez enanos forman un rectángulo largo y torcido. Pero si se <b>reparten en dos filas iguales
             de cinco</b> — cinco a la derecha del patio y cinco debajo — el dibujo se convierte casi en un cuadrado
             grande. Casi: <b>falta la esquina</b>.</div>
             <p>Y la esquina que falta es un cuadradito de 5 × 5, o sea <b>25 baldosas</b>. Añádela — pero entonces,
             por la regla de la balanza del nivel 0·7, hay que añadirla <b>también al otro platillo</b>:
             39 + 25 = 64.</p>
             <p>Ahora a la izquierda hay un cuadrado perfecto de área 64, así que su lado es 8. Y ese lado es
             «x más cinco». Por tanto x = 3. <b>Sin fórmula.</b></p>
             <p>En el juego da los tres pasos con los botones y mira cómo se completa el dibujo. Hazlo en al menos dos
             ecuaciones: lo que tienes que ver no son los números, es que <b>siempre es el mismo dibujo</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'quadrato', title: 'Completa el cuadrado', text: 'termina el dibujo en 2 ecuaciones distintas.', xp: 55 });
        el.appendChild(m.root);
        quadratoLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Quédate solo con dos cosas, y las dos están en el dibujo:</p>
              <ul>
                <li>los enanos se <b>reparten en dos filas iguales</b> → de b sale <b>b/2</b>;</li>
                <li>la <b>baldosa de la esquina</b> es cuadrada → la pieza que hay que añadir es <b>(b/2)²</b>.</li>
              </ul>
              <div class="callout warn">Esto no es un truco para recordar la fórmula: es <b>la</b> demostración de la
              fórmula. Si quitas a los enanos, el paso «se añade (b/2)² a los dos miembros» vuelve a ser un movimiento
              arbitrario que hay que memorizar. Con los enanos es lo único sensato que se puede hacer.</div>`,
    },

    {
      t: 'Los mismos movimientos, con letras: ahí está la fórmula',
      html: `<p>Ahora rehacemos <b>exactamente</b> esos pasos sobre ax² + bx + c = 0, con letras en vez de números.
             De aquí en adelante no hay ninguna idea nueva: solo los mismos gestos, escritos en general.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Primero: quitamos de en medio la a', html: 'El dibujo quiere un patio de lado x, no «a patios». Así que se divide todo por a: <b>x² + (b/a)x + c/a = 0</b>. Es lícito porque a no es cero — si lo fuera, no sería de segundo grado.' },
          { h: 'Segundo: el término independiente al otro lado', html: 'Como en la balanza: <b>x² + (b/a)x = −c/a</b>. A la izquierda quedan el patio y los enanos, a la derecha las baldosas contadas.' },
          { h: 'Tercero: los enanos en dos filas', html: 'La mitad de b/a es <b>b/(2a)</b>. Dos rectángulos iguales, uno por lado.' },
          { h: 'Cuarto: la baldosa de la esquina', html: 'Es cuadrada, de lado b/(2a): vale <b>b²/(4a²)</b>. Se añade a los dos platillos: <b>(x + b/2a)² = b²/(4a²) − c/a</b>.' },
          { h: 'Quinto: se juntan las piezas de la derecha', html: 'Con el mismo denominador: b²/(4a²) − c/a = <b>(b² − 4ac) / (4a²)</b>. Ahí está <b>de dónde nace el discriminante</b>: es el área de la baldosa de la esquina menos lo que ya había. Si sale negativa, el cuadrado no se puede completar — y en efecto la parábola no toca la recta.' },
          { h: 'Sexto: se toma la raíz', html: 'El lado del cuadrado: <b>x + b/(2a) = ±√(b² − 4ac) / (2a)</b>. El <b>±</b> está porque un cuadrado de área conocida se puede hacer con un lado o con su opuesto: son las dos soluciones.' },
          { h: 'Séptimo: se pasa b/(2a)', html: 'Último movimiento de balanza, y la fórmula está terminada:<br><b>x = [ −b ± √(b² − 4ac) ] / (2a)</b>.' },
          { h: 'Relee lo que tienes en la mano', html: 'No una cantinela: <b>−b/2a</b> son los enanos repartidos en dos filas (y es también el punto más bajo de la parábola, el vértice), la <b>raíz</b> es el lado del cuadrado completado, el <b>discriminante</b> es cuánto hacía falta para completarlo.' },
        ], { doneLabel: '¡Construida!' });
      },
      after: `<p>Mira la fórmula pieza por pieza: cada parte suya tiene un sitio en el dibujo.</p>`,
    },

    {
      t: 'La fórmula desmontada',
      html: `<p>Toca las piezas de abajo: son los mismos cuatro elementos del patio.</p>`,
      mount: el => {
        formula(el, {
          title: 'x = [ −b ± √(b² − 4ac) ] / 2a',
          parts: [
            { t: '−b / 2a', id: 'v', color: 'cyan', name: 'los enanos en dos filas', say: 'Es la mitad de b con el signo cambiado: el centro de todo. En el dibujo es el lado que se añade al patio; en la parábola es la x del vértice, el punto más bajo.', ex: 'Las dos soluciones están siempre a la misma distancia de aquí: una a la izquierda y otra a la derecha.' },
            { t: '±' },
            { t: '√(b² − 4ac) / 2a', id: 'r', color: 'green', name: 'cuánto te alejas', say: 'Es el lado del cuadrado completado: dice cuánto te alejas del centro para llegar a las dos soluciones.', ex: 'Si vale cero, las dos soluciones coinciden: la parábola toca la recta sin atravesarla.' },
            { t: '·' },
            { t: 'b² − 4ac', id: 'd', color: 'amber', name: 'el discriminante: la baldosa menos lo que había', say: 'Es lo que está bajo la raíz, y lo decide todo: positivo → dos soluciones, cero → una, negativo → ninguna en la recta de los números.', ex: 'En el juego es el número que cambiaba de color abajo a la izquierda.' },
            { t: '·' },
            { t: '2a', id: 'a', color: 'violet', name: 'la división inicial', say: 'Viene del primerísimo paso, aquel en el que se dividió todo por a para tener un solo patio.', ex: 'Cuando a = 1 casi desaparece: x = −b/2 ± √(b²/4 − c). Es el caso del juego.' },
          ],
        });
      },
      after: `<div class="callout ok">Prueba a rehacer la cuenta de antes con la fórmula: a = 1, b = 10, c = −39.
              Discriminante = 100 + 156 = 256, raíz 16, x = (−10 ± 16)/2 → <b>3</b> y <b>−13</b>. El dibujo daba 3.
              La fórmula da también la otra solución, la negativa: al-Juarismi la habría descartado, porque un patio
              de lado −13 no existe. No es un descuido suyo: los números negativos, en Europa, no se aceptaron como
              soluciones hasta siglos después.</div>`,
    },

    {
      t: 'De dónde viene: al-jabr, y la puerta que quedó abierta',
      html: `<p>Hacia el año <b>820</b>, en Bagdad, <b>Muḥammad ibn Mūsā al-Juarismi</b> escribe un libro cuyo título
             contiene la palabra <i>al-jabr</i> — «recomponer», volver a juntar lo que se ha roto. De <i>al-jabr</i>
             viene <b>álgebra</b>; de su nombre latinizado, <i>Algoritmi</i>, viene <b>algoritmo</b>. Dos palabras que
             usas todos los días, del mismo autor.</p>
             <p>En el libro no hay ninguna fórmula: todavía no existían ni los símbolos ni los números negativos. Hay
             una <b>lista de casos</b> escritos con palabras — y uno de ellos es, literalmente, <i>«un cuadrado y diez
             raíces igual a treinta y nueve»</i>: justo la ecuación del juego. Y la solución es <b>el dibujo</b> que
             has completado: el cuadrado, las dos tiras, la esquina que falta.</p>
             <div class="callout key">Vale la pena decirlo claro: lo que en la escuela parece el punto de llegada — la
             fórmula — es en realidad la <b>abreviatura</b> de un razonamiento geométrico. Primero venía el dibujo, la
             fórmula llegó después, cuando alguien inventó las letras para resumirlo.</div>
             <p>Hay, sin embargo, un caso que el dibujo no sabe hacer: cuando <b>falta demasiado</b> y el cuadrado no
             se puede completar. Discriminante negativo, raíz de un número negativo, «no existe». Durante setecientos
             años la respuesta fue: no existe y punto.</p>
             <p>Luego, en la <b>Italia del siglo XVI</b>, pasa algo raro — y no con las ecuaciones de segundo grado,
             sino con las de <b>tercero</b>. <b>Gerolamo Cardano</b> (1545) publica la fórmula para resolverlas, y se
             descubre que en ciertos casos, para llegar a soluciones <b>perfectamente normales</b> — números enteros,
             visibles a ojo — la fórmula obliga a pasar <b>a través</b> de la raíz de un número negativo. No por
             capricho: no hay otro camino.</p>
             <p><b>Rafael Bombelli</b>, ingeniero hidráulico boloñés, da en <b>1572</b> el paso que hacía falta: se
             toma en serio esos números, establece cómo se suman y se multiplican, y muestra que al final de la cuenta
             las partes «imposibles» se cancelan y queda el número correcto. Los llama <i>«cantidades silvestres»</i>
             (<i>quantità silvestri</i>, expresión que toma de Cardano) e inventa los nombres para trabajar con
             ellos: <i>«más de menos»</i> y <i>«menos de menos»</i>, que son nuestros +i y −i. El nombre
             «imaginarios» llegará después, de Descartes, y era un insulto.</p>
             <div class="callout ok"><b>Lo que le importa a este curso:</b> los números complejos no nacieron como una
             abstracción elegante. Nacieron como un <b>atajo obligado</b>, tapándose la nariz, para resolver problemas
             concretos con respuestas concretas. Trescientos años después se descubrió que son el idioma en el que
             está escrita la mecánica cuántica. Aquel «no existe» del discriminante negativo, en resumen, no era un
             callejón sin salida: era una puerta.</div>`,
    },

    {
      t: 'Para qué sirve todo esto en lo cuántico',
      html: `<p>Parece lejanísimo, y en cambio el segundo grado reaparece en el nivel <b>18·b</b> del modo más directo
             posible. Allí buscas las <b>direcciones fijas</b> de una máquina 2×2: las flechas que la matriz no gira,
             sino que solo alarga o acorta.</p>
             <p>Encontrarlas significa resolver esta ecuación, que se llama <b>polinomio característico</b>:</p>
             <div class="formula">λ² − (traza)·λ + (determinante) = 0</div>
             <p>donde la traza es la suma de los dos números de la diagonal y el determinante es el del nivel 0·6. Es
             una ecuación de segundo grado en λ, y sus soluciones son los <b>autovalores</b>.</p>
             <div class="callout key">Así que el discriminante de esta ecuación dice, con exactitud:
             <ul style="margin:8px 0 0">
               <li><b>discriminante &gt; 0</b> → dos direcciones fijas distintas. Es la puerta H, con autovalores
                   +1 y −1;</li>
               <li><b>discriminante = 0</b> → una sola. Es la máquina «corte» del juego, que en efecto tiene una;</li>
               <li><b>discriminante &lt; 0</b> → <b>ninguna</b> dirección fija real. Es la <b>rotación</b>: lo gira
                   todo, ninguna flecha se queda en línea. Sus autovalores son <b>fases complejas</b>.</li>
             </ul></div>
             <p>Ese tercer caso es exactamente el punto en el que, en el nivel <b>18·b</b>, el curso dice «y aquí hacen
             falta los números complejos». Ahora sabes que no es una elección de comodidad: es el <b>mismo</b>
             discriminante negativo de al-Juarismi, la misma puerta que dejó abierta Bombelli — y esta vez se pasa por
             ella para describir una puerta cuántica que hace girar las fases.</p>
             <p class="mb0">Un segundo uso, más escondido: las <b>probabilidades</b> en mecánica cuántica son
             amplitudes al cuadrado (nivel 0·9). Cada vez que impones «las probabilidades suman 1» estás escribiendo
             una ecuación de segundo grado en las amplitudes — y es el motivo por el que los estados de un cúbit están
             sobre una <b>esfera</b> y no sobre una recta.</p>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego deja quietos b y c y mueve solo <b>a</b> hasta hacerlo negativo: la U se pone
           del revés. ¿Cambia el número de soluciones? ¿Y el discriminante?
           <span class="muted">(mira la fórmula del discriminante: la a aparece dentro de un producto)</span></p>
        <p><b>2.</b> Resuelve a mano <b>x² + 6x = 16</b> con el método de los enanos: seis enanos, ¿dos filas de
           cuántos? ¿Cuánto vale la baldosa? ¿Y el total de la derecha?
           <span class="muted">(luego compruébalo con el juego)</span></p>
        <p><b>3.</b> Una ecuación tiene soluciones 2 y 5. ¿Cuánto valen b y c, si a = 1?
           <span class="muted">(pista: desarrolla (x − 2)(x − 5); y fíjate en que b es −suma y c es ·producto: es la
           misma cuenta que reencontrarás como traza y determinante)</span></p>
        <p><b>4.</b> ¿Por qué la parábola es <b>simétrica</b> respecto al vértice? <span class="muted">(relee la
           fórmula: las dos soluciones son «el centro ± la misma cantidad»)</span></p>
        <p class="mb0"><b>5.</b> De inventor: la puerta <b>H</b> tiene una matriz con traza 0 y determinante −1.
           Escribe su polinomio característico y resuélvelo. <span class="muted">(sale λ² − 1 = 0: y son justamente el
           +1 y el −1 que encontrarás en el nivel 18·b)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué son las soluciones de ax² + bx + c = 0, mirando la parábola?', options: ['el punto más bajo de la curva', 'los puntos donde la curva encuentra la recta del cero', 'la anchura de la curva', 'los puntos donde la curva es más empinada'], correct: 1,
      why: 'La ecuación pregunta «para qué x vale cero esta expresión»: son exactamente los puntos en los que la curva atraviesa (o roza) el eje horizontal. De ahí los tres casos posibles: dos, uno, ninguno.' },
    { q: 'El discriminante vale −7. ¿Cuántas soluciones reales hay?', options: ['dos', 'una', 'ninguna', 'depende del signo de a'], correct: 2,
      why: 'Discriminante negativo significa que el cuadrado no se puede completar: la parábola se queda entera de un lado y no encuentra nunca la recta. Las soluciones existen, pero son números complejos.' },
    { q: 'En la historia de los enanos, ¿por qué se reparten en DOS filas iguales?', options: ['por simetría estética', 'porque así las dos tiras se apoyan en los dos lados del patio y el dibujo se convierte casi en un cuadrado', 'porque los enanos siempre son un número par', 'para hacer la cuenta más rápida'], correct: 1,
      why: 'Es el movimiento que genera el b/2 de la fórmula: una sola tira seguiría siendo un rectángulo torcido, dos tiras iguales en dos lados forman un cuadrado al que solo le falta la esquina.' },
    { q: 'Y la baldosa que sobra en la esquina, ¿en qué se convierte en la fórmula?', options: ['en el término independiente c', 'en el (b/2)² que se añade a los dos miembros — es decir, la pieza de la que nace el discriminante', 'en el denominador 2a', 'en el signo ±'], correct: 1,
      why: 'La esquina que falta es un cuadradito de lado b/2, o sea de área (b/2)². Añadirla a los dos miembros es el paso que completa el cuadrado, y compararla con lo que ya había da b² − 4ac.' },
    { q: '¿De dónde nacen históricamente los números imaginarios?', options: ['de las ecuaciones de segundo grado con discriminante negativo', 'de las ecuaciones de TERCER grado, donde para llegar a soluciones reales hay que pasar por la raíz de un número negativo', 'de la mecánica cuántica', 'de la geometría de al-Juarismi'], correct: 1,
      why: 'Con el segundo grado se podía decir «no existe» y cerrar el asunto. Con el tercer grado (Cardano 1545, Bombelli 1572) el paso por los números imaginarios era obligado incluso cuando la respuesta final era un entero: de ahí ya no se volvió atrás.' },
    { q: '¿Por qué el segundo grado sirve en la computación cuántica?', options: ['no sirve, es solo cultura general', 'porque los autovalores de una matriz 2×2 son las soluciones de una ecuación de segundo grado, y su discriminante dice si hay direcciones fijas o solo fases', 'porque las puertas cuánticas son parábolas', 'porque hace falta para normalizar los cúbits'], correct: 1,
      why: 'El polinomio característico λ² − traza·λ + determinante = 0 es de segundo grado. Discriminante positivo → dos direcciones fijas (como la puerta H); negativo → ninguna dirección fija real, autovalores complejos: es el caso de la rotación.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> El discriminante es «cuántas veces la curva encuentra la recta», la
          fórmula es un patio cuadrado con diez enanos colocados en dos filas y una baldosa en la esquina, y el caso
          «imposible» es la puerta por la que entraron los números complejos. Tres cosas que en la escuela llegan por
          separado, y que aquí son el mismo dibujo visto por tres lados.</div>`,
});
@endsection
