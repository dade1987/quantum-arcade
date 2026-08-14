@php($description = 'Cambio de base jugando: medir es proyectar, el mismo estado es aleatorio con una regla y seguro con otra, la puerta de Hadamard es ese cambio de regla escrito como matriz, y en la base de los autovectores una matriz se convierte en un simple estiramiento — el atajo sobre el que está construida la estimación de fase.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { cambioBaseLab, diagonaleLab } from '/js/widgets/base.js';

const L = renderLesson({
  id: 'm11-base',
  lead: `Hay una frase que en este curso vuelve desde el nivel 1: «el mismo estado es aleatorio si lo mides de una
         manera y seguro si lo mides de otra». Suena a paradoja, y en realidad es una trivialidad de geometría — la
         misma por la que tu altura en centímetros y en pulgadas son dos números distintos para la misma persona.
         Aquí se ve, se toca, y se descubre que la <b>puerta de Hadamard</b> no es una puerta misteriosa: es
         literalmente el cambio de regla.`,

  steps: [
    {
      t: 'Dos reglas, una sola flecha',
      html: `<p>En el nivel M·4 una <b>base</b> llegó como «pocas flechas que alcanzan todo». Tomémoslo en serio: una
             base es una <b>regla</b>, es decir, una manera de dar coordenadas.</p>
             <p>En el plano hay infinitas bases ortonormales: basta girar los dos ejes a la vez. La flecha no se
             mueve — lo que cambia son los dos números con que la describes.</p>
             <div class="callout key"><b>Y ahora la parte cuántica.</b> Medir un estado significa <b>proyectarlo</b>
             sobre los ejes de una regla, y la probabilidad de cada resultado es el <b>cuadrado</b> de la proyección.
             Esta es la regla de Born, y es todo lo que hay.</div>
             <p>En el juego: elige un estado, gira la regla y mira las dos flechas de color — son las proyecciones,
             es decir las dos respuestas posibles de la medida. Intenta hacer que la medida sea <b>segura</b>, y
             luego que sea <b>cara o cruz</b>.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'base', title: 'Segura y aleatoria, con la misma flecha', text: 'encuentra una regla que haga la medida segura, y otra que la deje en 50 y 50.', xp: 55 });
        el.appendChild(m.root);
        cambioBaseLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Aquí está el punto, y vale la pena leerlo dos veces: <b>no ha cambiado el estado, ha cambiado la
              regla</b>. La misma flecha exacta da una respuesta segura con una regla y una moneda al aire con
              otra.</p>
              <div class="callout key"><b>De aquí en adelante «aleatorio» hay que decirlo mejor.</b> No existe «un
              estado aleatorio»: existe un estado <b>oblicuo respecto a la regla que estás usando</b>. El azar no
              está en el estado, está en la relación entre el estado y la pregunta que le haces.</div>
              <p class="mb0">Y hay un corolario que explica medio curso: si pones la regla a 45° respecto a |0⟩
              obtienes 50 y 50. Es decir: <b>hacer que un cúbit esté «en superposición» es girar 45°</b>. Nada más
              exótico.</p>`,
    },

    {
      t: 'La puerta de Hadamard, desmontada',
      html: `<p>A estas alturas la puerta H del nivel 3 se puede desmontar y mirar por dentro. Es esta matriz:</p>
             <div class="formula">H = 1/√2 · [ 1 &nbsp; 1 ; &nbsp;1 &nbsp; −1 ]</div>
             <p>y hace exactamente una cosa: <b>reescribe el estado en la regla de 45°</b>.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Qué le hace a |0⟩', html: 'Lo manda a (1, 1)/√2, es decir <b>|+⟩</b>. En la regla recta ese estado es 50 y 50 — ahí está «la superposición».' },
          { h: 'Qué le hace a |1⟩', html: 'Lo manda a (1, −1)/√2, es decir <b>|−⟩</b>. Este también es 50 y 50 a lo largo de Z, pero es un estado <b>distinto</b> de |+⟩: el signo cuenta, y es la fase del nivel 14.' },
          { h: 'Por qué aplicándola dos veces no pasa nada', html: 'Porque cambiar de regla y luego volver a cambiarla igual te devuelve al punto de partida: <b>H·H = identidad</b>. Por eso en los algoritmos las H van siempre por parejas, una a la ida y otra a la vuelta.' },
          { h: 'Por qué la medida cambia igualmente', html: 'Todo el truco de los algoritmos cuánticos está aquí: <b>no cambian la regla del aparato</b> — ese mide siempre a lo largo de Z — sino que giran el estado para que, leído a lo largo de Z, dé la respuesta correcta. Deutsch, Bernstein-Vazirani, Grover: todos hacen esto.' },
          { h: 'La cuenta que lo demuestra', html: 'Los tests de este nivel verifican que los dos números que saca H, <b>al cuadrado</b>, sean exactamente las probabilidades de medir en la base de 45° calculadas por proyección. Los dos caminos dan el mismo número en cada estado del juego.' },
          { h: 'Un detalle honesto', html: 'H tiene determinante <b>−1</b>: no es una rotación, es un <b>espejo</b>. Gira la regla 45° y luego voltea el segundo eje. Para las probabilidades no cambia nada — son cuadrados — pero es justo saberlo.' },
        ], { doneLabel: '¡Ahora vuelve!' });
      },
      after: `<div class="callout ok"><b>Para llevarse:</b> una puerta cuántica no «hace que le pase algo raro al
              estado». Gira el estado, o gira la forma de leerlo. Todo lo demás es consecuencia.</div>`,
    },

    {
      t: 'La base en la que la máquina se simplifica',
      html: `<p>Segunda mitad del nivel, y hace falta para el siguiente. También una <b>matriz</b> — una máquina que
             transforma flechas, como en el nivel 0·6 — se puede mirar desde reglas distintas. Y sus números
             cambian.</p>
             <div class="formula">la misma máquina, otra regla: <b>A′ = P⁻¹ · A · P</b></div>
             <p>Y ahora la pregunta que vale el nivel: <b>¿existe una regla en la que la máquina se vuelva
             simple?</b> Simple quiere decir <b>diagonal</b>: sin números fuera de la diagonal, es decir sin mezcla
             entre las dos direcciones. La máquina se limita a estirar el primer eje un número y el segundo otro.</p>
             <p>En el juego: gira la regla y mira los cuatro números de la derecha. Cuando los dos de fuera de la
             diagonal se van a cero — y las flechas verde y rosa salen <b>rectas</b> en vez de torcidas — ya
             está.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'diagonale', title: 'Dos máquinas domadas', text: 'encuentra la base que las vuelve diagonales.', xp: 60 });
        el.appendChild(m.root);
        diagonaleLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Las direcciones que salen rectas tienen un nombre que conoces: son los <b>autovectores</b> del nivel
              18·b, y los dos números de la diagonal son los <b>autovalores</b>. En el nivel 18·b los encontraste;
              aquí ves <b>para qué sirven</b>.</p>
              <div class="callout key"><b>El regalo.</b> En la base correcta, aplicar la máquina mil veces significa
              elevar <b>dos números</b> a la milésima. Fuera de esa base significaría multiplicar mil matrices.
              <p class="mb0" style="margin-top:8px"><b>A<sup>n</sup> = P · D<sup>n</sup> · P⁻¹</b>, y D<sup>n</sup>
              es solo la diagonal elevada a n.</p></div>
              <p>Los tests lo verifican comparando los dos caminos: A elevado a la treinta calculado a lo bruto y
              calculado con el atajo dan exactamente el mismo resultado, en todas las máquinas del juego.</p>
              <div class="callout ok"><b>Y aquí se entiende la estimación de fase.</b> En el nivel 19 el circuito
              aplica una puerta <b>2, 4, 8, 16… veces</b>. Si tuviera que hacerlo multiplicando matrices sería un
              desastre. Pero en la base de los autovectores esa puerta es solo «multiplica por e^(iθ)», y aplicarla
              2^k veces se convierte en «multiplica por e^(i·2^k·θ)». Todo el algoritmo de Shor se sostiene en
              esto.</div>
              <p class="mb0">Dos cosas que el cambio de base <b>no</b> toca, y los tests lo comprueban: la
              <b>traza</b> (la suma de la diagonal) y el <b>determinante</b>. Son lo que la máquina «es»,
              independientemente de quién la mire — y por eso aparecen en todas las fórmulas.</p>`,
    },

    {
      t: 'Dos teorías que eran la misma, y nadie se daba cuenta',
      html: `<p>La historia de este nivel es la más bonita de la mecánica cuántica, y habla exactamente de cambios de
             base.</p>
             <p>En <b>1925</b> <b>Werner Heisenberg</b>, con veintitrés años, recuperándose de la fiebre del heno en
             la isla de Helgoland, construye una teoría del átomo hecha de <b>tablas de números</b> que se
             multiplican de forma rara — el orden cuenta, A·B ≠ B·A. Born y Jordan reconocen que esas tablas son
             <b>matrices</b>, que los matemáticos conocían desde hacía setenta años pero los físicos no usaban. Nace
             la <b>mecánica de matrices</b>: abstracta, algebraica, sin ninguna imagen.</p>
             <p>Pocos meses después, en <b>1926</b>, <b>Erwin Schrödinger</b> publica una teoría completamente
             distinta: nada de tablas, sino una <b>onda</b> que se propaga por el espacio, con una ecuación
             diferencial. Es intuitiva, se dibuja, y los físicos respiran aliviados.</p>
             <div class="callout warn">Las dos teorías parecen no tener <b>nada</b> en común. Heisenberg detesta las
             ondas de Schrödinger («cuanto más lo pienso, más repugnante me parece», le escribe a Pauli).
             Schrödinger encuentra la mecánica de matrices incomprensible. Y sin embargo dan los <b>mismos
             números</b> para el espectro del hidrógeno.</div>
             <p>En <b>marzo de 1926</b> es el propio Schrödinger quien muestra el vínculo entre ambas — llegando a
             escribir que «desde el punto de vista matemático formal se puede incluso decir que las dos teorías son
             idénticas». La demostración, para los estándares de hoy, era incompleta; el cuadro limpio llega con la
             <b>teoría de las transformaciones</b> de <b>Dirac</b> y <b>Jordan</b> en <b>1927</b>, y luego con el
             libro de <b>von Neumann</b> de 1932.</p>
             <div class="callout key"><b>Y la respuesta es este nivel.</b> Las dos teorías son la <b>misma teoría
             escrita en dos bases distintas</b>. Heisenberg usaba la base de la energía, donde las magnitudes son
             tablas; Schrödinger la de la posición, donde se vuelven funciones. Mismo estado, reglas distintas.
             Exactamente el juego que acabas de hacer — solo que con infinitas dimensiones en vez de dos.</div>
             <p class="mb0">Una última nota, y es sobre el segundo juego. Girar los ejes hasta que los números fuera
             de la diagonal se anulen es un método de verdad, y tiene nombre: lo publicó <b>Carl Gustav Jacob
             Jacobi</b> en <b>1846</b>, y durante un siglo se quedó en curiosidad porque a mano era una tortura.
             Luego llegaron los ordenadores y se convirtió en uno de los algoritmos más usados del cálculo numérico.
             Cuando mueves ese control estás haciendo, a ojo, una <b>rotación de Jacobi</b>.</p>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego pon |0⟩ y lleva la regla a 45°. ¿Cuánto sale? ¿Y a 90°?
           <span class="muted">(50 y 50 a 45°; a 90° vuelve a ser seguro, pero con las dos respuestas
           intercambiadas)</span></p>
        <p><b>2.</b> Pon |+⟩ y busca <b>dos</b> reglas que lo hagan seguro.
           <span class="muted">(45° y 135°: son el mismo eje, leído en los dos sentidos)</span></p>
        <p><b>3.</b> Coge el estado oblicuo (20°) y encuentra la regla que lo deja en cara o cruz.
           <span class="muted">(65°, es decir 20° + 45°: la regla es siempre «a 45° del estado»)</span></p>
        <p><b>4.</b> En el segundo juego elige «aplasta» e intenta adivinar la base correcta <b>antes</b> de girar.
           <span class="muted">(45°: la matriz es simétrica y con los dos diagonales iguales, así que los ejes buenos
           son las dos bisectrices)</span></p>
        <p class="mb0"><b>5.</b> De inventor: en el segundo juego, mientras giras la regla, no pierdas de vista la
           suma de los dos números de la diagonal. ¿Qué observas? <span class="muted">(no cambia nunca: es la traza,
           y no depende de la regla — igual que el determinante)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué significa medir un estado en una base determinada?', options: ['cambiar el estado', 'proyectarlo sobre los ejes de esa base: las probabilidades son los cuadrados de las proyecciones', 'girar el aparato', 'multiplicarlo por una constante'], correct: 1,
      why: 'Es la regla de Born. Por eso el mismo estado puede dar una respuesta segura con una regla y 50 y 50 con otra: no ha cambiado el estado, ha cambiado la dirección sobre la que proyectas.' },
    { q: '¿Qué da |+⟩ medido a lo largo de Z y a lo largo de X?', options: ['seguro en ambos casos', '50 y 50 a lo largo de Z, seguro a lo largo de X', 'aleatorio en ambos casos', 'depende del ruido'], correct: 1,
      why: 'Es la misma flecha: está a 45° de los ejes Z y sobre el eje X. «Aleatorio» no es una propiedad del estado, es la relación entre el estado y la regla que usas.' },
    { q: '¿Qué es la puerta de Hadamard, mirada de cerca?', options: ['una puerta que añade ruido', 'la matriz que reescribe un estado en la regla de 45°: un cambio de base', 'una medida', 'una rotación de 90°'], correct: 1,
      why: 'Los dos números que saca, al cuadrado, son las probabilidades de medir en la base de 45°. Y aplicada dos veces no hace nada, porque cambiar de regla y volver a cambiarla devuelve al punto de partida.' },
    { q: '¿Qué le pasa a una matriz en la base de sus autovectores?', options: ['desaparece', 'se vuelve diagonal: ya no mezcla las direcciones, solo las estira, cada una por su cuenta', 'se convierte en la identidad', 'se duplica'], correct: 1,
      why: 'Los autovectores son las direcciones que la máquina no tuerce, y los autovalores dicen cuánto las estira. En esa base la matriz es solo un par de números.' },
    { q: '¿Por qué la diagonalización hace posible la estimación de fase?', options: ['porque ahorra memoria', 'porque A^n se convierte en D^n, es decir dos números elevados a n en vez de n productos de matrices', 'porque elimina el ruido', 'porque reduce el número de cúbits'], correct: 1,
      why: 'El circuito del nivel 19 aplica una puerta 2, 4, 8, 16… veces. En la base de los autovectores esa puerta es «multiplica por e^(iθ)», así que aplicarla 2^k veces es «multiplica por e^(i·2^k·θ)».' },
    { q: '¿Qué relación hay entre la mecánica de matrices de Heisenberg y la ondulatoria de Schrödinger?', options: ['son teorías rivales, una está equivocada', 'son la misma teoría escrita en dos bases distintas', 'una vale para los átomos y la otra para las moléculas', 'la segunda sustituyó a la primera'], correct: 1,
      why: 'Heisenberg usaba la base de la energía, Schrödinger la de la posición. El vínculo lo muestra el propio Schrödinger en 1926; el cuadro limpio llega con la teoría de las transformaciones de Dirac y Jordan en 1927.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Un cambio de base no cambia nada de la realidad y cambia todos los
          números con los que la describes. De ahí caen tres cosas: «aleatorio» depende de la regla y no del estado,
          la puerta de Hadamard es el cambio de regla escrito como matriz, y en la base de los autovectores una
          máquina se convierte en dos números — el atajo sobre el que se sostienen la estimación de fase y el
          algoritmo de Shor. En el próximo nivel ese mismo atajo servirá para calcular e^(iHt), es decir para hacer
          evolucionar un sistema físico.</div>`,
});
@endsection
