@php($description = 'Trigonometría explicada jugando: la identidad fundamental como Pitágoras en la circunferencia, las fórmulas de adición deducidas del producto de dos matrices, la duplicación como caso particular — y el descubrimiento de que cada vuelta de Grover añade 2θ. Con la historia de la palabra «seno», nacida de un error de traducción.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { giostraLab, groverAngoloLab } from '/js/widgets/goniometria.js';

const L = renderLesson({
  id: 'm2-goniometria',
  lead: `En el nivel 0·3 el seno y el coseno se convirtieron en dos sombras de un punto que gira: sin triángulos, sin
         fórmulas que memorizar. Aquí se añade lo único que hace falta saber hacer de verdad con ellos, y es
         <b>girar dos veces</b>. Parece poco; en cambio de ahí salen las fórmulas de adición, la duplicación y —
         con sorpresa — el motivo por el que el algoritmo de Grover en cierto punto <b>deja de mejorar</b>.`,

  steps: [
    {
      t: 'Un repaso de treinta segundos, y una fórmula que ya conoces',
      html: `<p>Un punto gira en una circunferencia de radio 1. El <b>coseno</b> del ángulo es su sombra horizontal,
             el <b>seno</b> es la vertical. Nada más: dos números entre −1 y 1 que dicen <b>dónde está</b> el
             punto.</p>
             <p>Ahora mira las dos sombras y el radio: forman un <b>triángulo rectángulo</b> con catetos de longitud
             cos y sin, e hipotenusa de longitud 1. Pitágoras dice:</p>
             <div class="formula">sin²θ + cos²θ = <span class="hl-n">1</span></div>
             <div class="callout key">Esto se llama <b>identidad fundamental</b> y tiene fama de ser una fórmula que
             hay que estudiar. No lo es: es <b>Pitágoras escrito en la circunferencia de radio 1</b>, y vale para
             cualquier ángulo porque el radio nunca cambia.</div>
             <p>Y si te parece que ya la has visto en este curso, tienes razón: es la misma línea que en el nivel
             0·9 decía <b>«las probabilidades suman 100%»</b>. Las dos amplitudes de un cúbit son las dos sombras, y
             la suma de sus cuadrados es el radio al cuadrado. Visto así, un cúbit es <b>un punto en una
             circunferencia</b>.</p>`,
    },

    {
      t: 'Dos giros hacen un solo giro',
      html: `<p>Una pregunta que parece trivial: si giro <b>a</b> y luego <b>b</b>, ¿dónde acabo? En <b>a + b</b>,
             obviamente. Los ángulos se suman, lo sabe cualquiera que haya girado un mando.</p>
             <p>La pregunta de verdad es otra: <b>¿dónde acaban las sombras?</b> Es decir, conociendo cos a, sin a,
             cos b y sin b, ¿cuánto valen cos(a+b) y sin(a+b)? Las sombras <b>no</b> se suman — y quien escribe
             «cos(a+b) = cos a + cos b» se equivoca de forma espectacular (prueba con a = b = 90°: a la izquierda
             sale −1, a la derecha 0).</p>
             <p>En el juego: mueve los dos giros y lleva la flecha al objetivo. Mira la columna de números mientras
             lo haces.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'giostra', title: 'Tres objetivos', text: 'acierta 3 objetivos sumando los dos giros.', xp: 45 });
        el.appendChild(m.root);
        giostraLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>La respuesta correcta es esta, y se llama <b>fórmula de adición</b>:</p>
              <div class="formula">cos(a + b) = cos a · cos b − sin a · sin b</div>
              <div class="formula">sin(a + b) = sin a · cos b + cos a · sin b</div>
              <p>El juego acaba de comprobarla delante de tus ojos: la fila «con la fórmula» y la fila «girando de
              verdad» dan el mismo número, siempre. Pero <b>comprobar no es entender</b>, y esta fórmula tiene un
              origen que la hace obvia.</p>`,
    },

    {
      t: 'De dónde sale: es el producto de dos matrices, leído en voz alta',
      html: `<p>En el nivel 0·6 descubriste que <b>una rotación es una matriz</b>. Y hacer dos cosas una detrás de
             otra, con matrices, significa <b>multiplicarlas</b>. Junta las dos frases.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'La matriz que gira a', html: 'Sus dos columnas dicen dónde acaban las dos flechas de partida:<br><b>R(a) = [ cos a &nbsp; −sin a ; &nbsp; sin a &nbsp; cos a ]</b>' },
          { h: 'Girar a y luego b', html: 'Aplicar primero R(a) y luego R(b) es la matriz <b>R(b) · R(a)</b>. Pero girar a y luego b es también, simplemente, <b>girar a+b</b>. Así que <b>R(b) · R(a) = R(a+b)</b>. Dos nombres para la misma máquina.' },
          { h: 'Ahora se hace el producto', html: 'Fila por columna, como en el nivel 0·6. La casilla de arriba a la izquierda sale <b>cos b · cos a − sin b · sin a</b>. La de abajo a la izquierda sale <b>sin b · cos a + cos b · sin a</b>.' },
          { h: 'Y se lee la otra cara', html: 'Pero esa misma matriz es R(a+b), y su casilla de arriba a la izquierda es por definición <b>cos(a+b)</b>, la de abajo a la izquierda <b>sin(a+b)</b>.' },
          { h: 'Las dos lecturas tienen que coincidir', html: 'Misma matriz, mismas casillas. Por tanto<br><b>cos(a+b) = cos a cos b − sin a sin b</b><br><b>sin(a+b) = sin a cos b + cos a sin b</b>.<br>Fin: la fórmula no ha caído del cielo, es el producto de dos matrices escrito en palabras.' },
          { h: 'Por qué ese signo menos', html: 'Es la pregunta que se hace todo el mundo. Viene del <b>−sin a</b> de la matriz de rotación, que a su vez está ahí porque al girar en sentido antihorario la primera flecha sube pero la segunda va <b>hacia atrás</b>. El menos es el precio de girar, no un capricho.' },
        ], { doneLabel: '¡Deducida!' });
      },
      after: `<div class="callout ok"><b>Esta es la manera de recordarlas que no se borra:</b> no «coseno coseno
              menos seno seno», sino «<b>dos rotaciones seguidas son una sola rotación</b>». La fórmula es la
              consecuencia. Y si algún día la necesitas y no te acuerdas, multiplicas dos matrices 2×2 y la tienes
              otra vez en un minuto.</div>
              <p>El caso <b>b = a</b> no es una fórmula más, es la misma con el mismo número dos veces:</p>
              <div class="formula">sin 2a = 2 · sin a · cos a &nbsp;&nbsp;&nbsp; cos 2a = cos²a − sin²a</div>
              <p class="mb0">Se llama <b>duplicación</b>, y dentro de dos pasos se descubrirá que es el motor de un
              algoritmo cuántico.</p>`,
    },

    {
      t: 'De dónde viene: una tabla de cuerdas, y un error de traducción',
      html: `<p>La trigonometría no nace en la escuela: nace mirando el cielo. Los astrónomos griegos necesitaban
             ligar los <b>ángulos</b> entre estrellas a las <b>distancias</b> sobre la esfera celeste, y para eso
             construyeron tablas. <b>Hiparco de Nicea</b>, hacia el <b>150 a.C.</b>, compila la primera: no de
             senos, sino de <b>cuerdas</b> — la longitud del segmento que une los dos extremos de un arco.</p>
             <p>Tres siglos después <b>Ptolomeo</b>, en el <i>Almagesto</i>, publica una mucho más precisa y, para
             construirla, demuestra un teorema de geometría que — reescrito en lenguaje moderno — <b>es la fórmula
             de adición</b>. Es decir: la fórmula que acabas de deducir de las matrices, Ptolomeo la deducía de un
             cuadrilátero inscrito en una circunferencia, en el año 150.</p>
             <div class="callout key"><b>La curiosidad que vale el nivel: por qué se llama «seno».</b> Los
             astrónomos indios (Aryabhata, hacia el 500) dejan de tabular la cuerda entera y pasan a la <b>media
             cuerda</b>, que es lo que hoy llamamos seno. En sánscrito la llaman <i>jyā</i>, que significa «cuerda
             del arco» — la cuerda de un arco de tiro. Los árabes la transliteran como <i>jiba</i>, que en árabe no
             significa nada: es solo un sonido, escrito <b>sin vocales</b>, jb.
             <p style="margin:8px 0 0">En el siglo XII los traductores europeos — <b>Gerardo de Cremona</b> y otros
             — leen esas mismas dos consonantes como <i>jaib</i>, que en árabe <b>sí</b> existe y significa
             «ensenada, pliegue del vestido, seno». Y lo traducen al latín como <b>sinus</b>. De ahí: <i>sine</i>,
             <i>seno</i>, <i>Sinus</i>.</p>
             <p class="mb0" style="margin-top:8px">Moraleja: la palabra más usada de la trigonometría significa
             «ensenada» por culpa de un texto sin vocales mal leído hace ochocientos años. El concepto era la cuerda
             de un arco.</p></div>
             <p>Una última curiosidad, y esta es práctica. Antes de los logaritmos (nivel 0·8), los astrónomos usaban
             las fórmulas de adición para <b>convertir multiplicaciones en sumas</b>, dándoles la vuelta así:</p>
             <div class="formula">cos a · cos b = ½ · [ cos(a − b) + cos(a + b) ]</div>
             <p>A la izquierda una multiplicación entre números largos; a la derecha dos lecturas de tabla y una
             suma. El método se llamaba <b>prostaféresis</b> y se usaba en el observatorio de <b>Tycho Brahe</b>.
             Funcionaba tan bien que cuando Napier publicó los logaritmos, en 1614, los presentó como la manera
             <b>mejor</b> de hacer lo mismo. Dos inventos distintos para la misma molestia.</p>`,
    },

    {
      t: 'La sorpresa: Grover es una rotación, y 2θ es la duplicación',
      html: `<p>En el nivel 11 el algoritmo de Grover hace algo que parece magia: repite una vuelta de «marca y
             refleja» y la respuesta correcta se vuelve cada vez más probable. Luego, en cierto punto, si sigues
             <b>empeora</b>. Con la trigonometría en la mano ese comportamiento deja de ser raro y se vuelve
             obvio.</p>
             <p>Este es el cuadro. Pon todas las respuestas equivocadas en un eje y la correcta en el otro. El estado
             de partida — la superposición uniforme — es una flecha <b>casi entera del lado de las equivocadas</b>,
             inclinada un angulito θ dado por:</p>
             <div class="formula">sin θ = √(1 / N)</div>
             <p>Con 4 respuestas θ vale 30°; con 256 vale unos 3,6°. Luego pasa esto:</p>
             <div class="callout key"><b>Cada vuelta de Grover rota la flecha 2θ.</b> No la acerca «un poco más»: la
             <b>rota</b>, siempre el mismo ángulo. Tras k vueltas la flecha está en <b>(2k + 1)·θ</b>, y la
             probabilidad de leer la respuesta correcta es el <b>seno al cuadrado</b> de ese ángulo.</div>
             <p>Pruébalo: sube el número de vueltas y mira la flecha subir hacia los 90°. Luego pasa de los 90° y
             mira qué le pasa a la barra.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'grover', title: 'Acierta dos listas', text: 'encuentra el mejor número de vueltas en 2 listas de tamaño distinto.', xp: 55 });
        el.appendChild(m.root);
        groverAngoloLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Tres cosas encajan a la vez:</p>
              <ul>
                <li><b>por qué empeora.</b> A 90° la flecha apunta entera a la respuesta correcta y la probabilidad
                    es 1. Una vuelta más la lleva a 90° + 2θ, es decir <b>más allá</b>: y el seno, pasados los 90°,
                    vuelve a bajar. Grover no es un algoritmo que «mejora mientras lo dejes correr»: es una aguja que
                    gira, y hay que pararla en el momento justo;</li>
                <li><b>de dónde sale el √N.</b> Hay que cubrir unos 90° a pasos de 2θ, y θ ≈ √(1/N) para N grande.
                    Así que el número de pasos es unos 90° / (2·√(1/N)) — que es <b>π/4 · √N</b>. El famoso √N de
                    Grover no es una estimación: es una división entre ángulos;</li>
                <li><b>por qué justo 2θ.</b> Una vuelta de Grover hace <b>dos reflexiones</b> (marca, luego
                    refleja). Y dos reflexiones seguidas son siempre una <b>rotación del doble</b> del ángulo entre
                    los dos espejos. Es la duplicación de hace dos pasos, aplicada a dos espejos en vez de a un
                    ángulo.</li>
              </ul>
              <div class="callout ok">Así que la respuesta a «¿por qué √N y no N?» es: <b>porque es una rotación, y
              las rotaciones se suman en los ángulos, no en las probabilidades</b>. Si cada vuelta sumara
              probabilidad en vez de ángulo, Grover no serviría de nada.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego pon a = 90° y b = 90°. ¿Cuánto vale cos(a+b)? ¿Y cuánto daría
           «cos a + cos b»? <span class="muted">(0 + 0 = 0, pero la respuesta correcta es −1: por eso las sombras no
           se suman)</span></p>
        <p><b>2.</b> Deduce sin 2a poniendo b = a en la fórmula de adición, a mano, en un papel. ¿Te salen dos
           términos iguales? <span class="muted">(sin a cos a + cos a sin a)</span></p>
        <p><b>3.</b> En el segundo juego coge N = 4: ¿cuántas vueltas hacen falta? ¿Y la probabilidad tras esa
           vuelta? <span class="muted">(una sola, y sale exactamente 100% — es el caso que el nivel 11 enseña a
           mano)</span></p>
        <p><b>4.</b> Sigue en el segundo juego y pasa de N = 16 a N = 256: hay 16 veces más respuestas. ¿Cuántas
           veces más vueltas? <span class="muted">(cuatro: es √16)</span></p>
        <p class="mb0"><b>5.</b> De inventor: si hubiera <b>4 respuestas correctas</b> de 256 en vez de una, ¿θ
           valdría más o menos? ¿Y las vueltas necesarias? <span class="muted">(sin θ = √(M/N): con M = 4 el ángulo
           se duplica y las vueltas se reducen a la mitad — buscar más cosas a la vez es más fácil, no más
           difícil)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué es, en el fondo, la identidad sin²θ + cos²θ = 1?', options: ['una fórmula que hay que memorizar', 'el teorema de Pitágoras aplicado al triángulo de las dos sombras en una circunferencia de radio 1', 'una propiedad solo de los ángulos notables', 'la definición de seno'], correct: 1,
      why: 'Las dos sombras son los catetos, el radio es la hipotenusa y vale 1. Vale para cualquier ángulo porque el radio nunca cambia. En lo cuántico la misma línea se llama «las probabilidades suman 100%».' },
    { q: '¿Cuánto vale cos(a + b)?', options: ['cos a + cos b', 'cos a · cos b − sin a · sin b', 'cos a · cos b + sin a · sin b', '2 · cos a · cos b'], correct: 1,
      why: 'Las sombras no se suman. La forma de no equivocarse es recordar de dónde viene: es la casilla de arriba a la izquierda del producto de las dos matrices de rotación.' },
    { q: '¿Por qué las fórmulas de adición tienen esa forma?', options: ['por convención histórica', 'porque son el producto de dos matrices de rotación: girar a y luego b es girar a+b', 'porque derivan de los logaritmos', 'porque sirven para simplificar los cálculos'], correct: 1,
      why: 'R(b)·R(a) = R(a+b). Al hacer el producto fila por columna, en las casillas ya aparecen cos a cos b − sin a sin b y sin a cos b + cos a sin b. La fórmula es ese producto leído en voz alta.' },
    { q: '¿De dónde viene la palabra «seno»?', options: ['del latín sinus, «ensenada», por una mala lectura del árabe jb', 'del griego «semi»', 'del nombre de un matemático', 'de la forma de la curva'], correct: 0,
      why: 'El sánscrito jyā («cuerda del arco») pasa al árabe como jiba, escrito sin vocales como jb; los traductores latinos del siglo XII lo leen jaib, «ensenada», y traducen sinus. El concepto era la media cuerda de un arco.' },
    { q: '¿Cuánto rota la flecha del estado en cada vuelta de Grover?', options: ['θ', '2θ, porque una vuelta son dos reflexiones y dos reflexiones hacen una rotación doble', '90° dividido por el número de vueltas', 'depende de la respuesta buscada'], correct: 1,
      why: 'Marcar y reflejar son dos reflexiones, y dos reflexiones seguidas son una rotación del doble del ángulo entre los dos espejos. Tras k vueltas la flecha está en (2k+1)·θ.' },
    { q: '¿Por qué seguir dando vueltas de Grover, pasado cierto punto, empeora?', options: ['porque se acumula ruido', 'porque la flecha pasa de los 90° y el seno vuelve a bajar', 'porque aumentan las respuestas equivocadas', 'no empeora, siempre mejora'], correct: 1,
      why: 'La probabilidad es sin² del ángulo. A 90° vale 1; pasados los 90° el seno decrece, así que la flecha se aleja otra vez de la respuesta correcta. Grover es una aguja que gira, y hay que pararla en el momento justo.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> La identidad fundamental es Pitágoras en la circunferencia, las
          fórmulas de adición son el producto de dos matrices leído en voz alta, la duplicación es el caso b = a — y
          con eso en la mano Grover deja de ser magia: es una flecha que rota 2θ cada vez y hay que pararla a 90°.
          Además ahora sabes que «seno» significa «ensenada» por culpa de un texto árabe sin vocales mal leído.</div>`,
});
@endsection
