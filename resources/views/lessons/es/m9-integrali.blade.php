@php($description = 'Integrales jugando: el área como límite de rectángulos (y por qué cortarlos por el punto medio hace que el error baje como 1/n² en vez de 1/n), el teorema fundamental del cálculo visto con un velocímetro y un cuentakilómetros, el logaritmo como área bajo 1/x, y la probabilidad que suma 1 para la partícula en una caja.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { areaLab, teoremaLab } from '/js/widgets/integrali.js';

const L = renderLesson({
  id: 'm9-integrali',
  lead: `En el nivel 21·b jugaste con la <b>derivada</b>: cuánto cambia una cosa. Aquí está la otra mitad del
         análisis, que hace la pregunta contraria: <b>si sé cuánto cambia una cosa en cada instante, ¿cuánto ha
         cambiado en total?</b> La respuesta es un área, se calcula a base de rectángulos — es decir, con un
         límite, el del nivel M·8 — y luego llega el giro: hay un atajo que vuelve inútiles los rectángulos, y es
         el teorema más importante que verás en este curso.`,

  steps: [
    {
      t: 'El área a base de rectángulos',
      html: `<p>El problema es viejo: <b>¿cuánta área hay bajo una curva?</b> Bajo una recta es fácil, es un
             triángulo. Bajo una parábola no.</p>
             <p>La idea que funciona es tosca y genial: si no sé medir lo curvo, lo cubro de <b>rectángulos</b>, que
             sí sé medir. Pongo n, cada uno de ancho (b−a)/n, tan altos como la curva. Los sumo. Y luego pongo
             más.</p>
             <div class="callout key">Esto es otra vez el juego del nivel M·8: la suma de los rectángulos es una
             <b>sucesión</b>, y el área es el número al que tiende. «La integral existe» quiere decir exactamente
             «esa sucesión tiene límite».</div>
             <p>En el juego hay una cosa más que probar, y no es un detalle: dónde cortas el rectángulo. En el borde
             izquierdo, en el derecho, o <b>en el punto medio</b>. Prueba los tres con el mismo número de
             rectángulos.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'area', title: 'Dos áreas precisas', text: 'baja el error de 0,001 en dos funciones distintas.', xp: 50 });
        el.appendChild(m.root);
        areaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Si has probado los tres cortes habrás visto una diferencia enorme. En los bordes el error baja como
              <b>1/n</b>: doblas los rectángulos, reduces el error a la mitad. En el punto medio baja como
              <b>1/n²</b>: doblas los rectángulos y el error se divide por <b>cuatro</b>.</p>
              <div class="callout key"><b>Por qué el punto medio es tanto mejor.</b> Cortando en el borde, el
              rectángulo se equivoca siempre en el mismo sentido: si la curva sube, se queda entero por debajo.
              Cortando por la mitad, por encima del punto medio la curva está por encima del rectángulo y por debajo
              está por debajo: los dos errores <b>se comen entre sí</b>. Lo que queda es mucho menos.</div>
              <p>En los tests de este nivel el exponente no se cuenta, se mide. Se doblan los rectángulos y se mira
              por cuánto queda dividido el error — 2 en el borde, 4 en el medio — en tres funciones distintas.</p>
              <p class="mb0">Y hay una última cosa que ver: coge la suma izquierda y la derecha en una función que
              sube. La primera está <b>siempre por debajo</b> del valor verdadero, la segunda <b>siempre por
              encima</b>. La verdad queda atrapada en medio, y al estrechar los rectángulos las dos se acercan hasta
              aplastarla. Este es el <b>método de exhaución</b> de Arquímedes, y tiene 2.200 años.</p>`,
    },

    {
      t: 'El giro: no hace falta ni un rectángulo',
      html: `<p>Ahora lo que lo cambia todo, y que vale la pena presentar en el orden correcto — porque verlo llegar
             hace cierto efecto.</p>
             <p>Imagina que vas en coche. Hay dos instrumentos en el salpicadero:</p>
             <ul>
               <li>el <b>velocímetro</b>, que dice a qué velocidad vas <b>ahora</b>;</li>
               <li>el <b>cuentakilómetros</b>, que dice cuánto camino has hecho <b>en total</b>.</li>
             </ul>
             <p>El camino recorrido es el <b>área bajo la curva de la velocidad</b>: si vas a 100 km/h durante media
             hora haces 50 km, que es el área de un rectángulo de 100 de alto y 0,5 de ancho. Si la velocidad
             cambia, el área queda bajo una curva — y eso es una integral.</p>
             <div class="callout key">Ahora la pregunta al revés: mirando solo el <b>cuentakilómetros</b>, ¿puedes
             saber qué marca el velocímetro? Sí: es la <b>velocidad con que cambia</b> el cuentakilómetros, es decir
             su pendiente. Que es la derivada del nivel 21·b.</div>
             <p>En el juego los dos instrumentos están uno encima del otro. Mueve el cursor y mira el número
             amarillo: la altura de la curva de arriba y la pendiente de la tangente de abajo son <b>el mismo
             número</b>, en cada punto.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'teorema', title: 'El punto más empinado y el llano', text: 'encuentra dónde el camino crece más deprisa, y dónde se para.', xp: 55 });
        el.appendChild(m.root);
        teoremaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<div class="formula">si A(t) es el área acumulada hasta t, entonces <b>A′(t) = f(t)</b></div>
              <p>Este es el <b>teorema fundamental del cálculo</b>, y el nombre no es exagerado. Dice que
              <b>derivar e integrar son operaciones inversas</b>, como multiplicar y dividir. Y da el atajo:</p>
              <div class="formula">área de a a b = <b>F(b) − F(a)</b>, con F una función cuya derivada es f</div>
              <p>Es decir: no cuentes rectángulos. Busca una función que derivada dé la de partida — se llama
              <b>primitiva</b> — y mira cuánto ha crecido entre los dos extremos. El área bajo x² de 0 a 1 es
              1³/3 − 0³/3 = <b>1/3</b>, y no has sumado nada.</p>
              <div class="callout ok"><b>La cuenta que los rectángulos hacían en diez mil pasos, la primitiva la hace
              en dos restas.</b> Por eso en el instituto se pasan meses aprendiendo a encontrar primitivas: son la
              llave que abre todas las áreas.</div>`,
    },

    {
      t: 'Dos áreas que ya tienen nombre',
      html: `<p>Dos integrales que en este curso valen más que las demás, porque son cosas que ya has visto llegar
             por otro camino.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'El logaritmo, otra vez', html: 'En el nivel 0·8 el logaritmo llegó como «el exponente que hace falta»: log₂ 8 = 3 porque 2³ = 8. Hay otra forma de definirlo, y pasa por un área.' },
          { h: 'El área bajo 1/x', html: 'Coge la curva <b>1/x</b> y mide el área desde 1 hasta t. Ese número <b>es</b> ln t, el logaritmo natural. No se le parece: es igual, y los tests de este nivel lo comprueban en cien valores de t.' },
          { h: 'Por qué e es «natural»', html: 'Esa área vale exactamente <b>1</b> cuando t = <b>e</b> = 2,718… Por eso esa base se llama natural: es el punto donde el área bajo 1/x da uno. En el juego puedes comprobarlo: elige 1/x y mira el valor verdadero.' },
          { h: 'La probabilidad que suma 1', html: 'En el curso has repetido mil veces que «la suma de los cuadrados de las amplitudes da 1». Eso vale cuando las posibilidades se pueden contar. Si una partícula puede estar en <b>cualquier punto</b> de un segmento, la suma se convierte en una <b>integral</b>.' },
          { h: 'La partícula en una caja', html: 'La cuarta curva del juego es <b>2·sin²(πx)</b>: es |ψ|² del estado más bajo de una partícula encerrada en una caja entre 0 y 1. Dice dónde es probable encontrarla: nunca contra las paredes, máximo en el centro.' },
          { h: 'Y su área da exactamente 1', html: 'No por suerte: ese 2 de delante está <b>a propósito</b>. Sin él el área daría 1/2 y la función no describiría ninguna probabilidad. Se llama <b>normalización</b>, y es lo primero que se le hace a una función de onda en cuanto se escribe.' },
          { h: 'El valor esperado', html: 'También la media del nivel M·7 se convierte en una integral: en lugar de sumar valor × probabilidad en cada caso, se integra x·|ψ(x)|² sobre todo el segmento. Para la partícula en la caja sale 1/2, el centro — que es donde uno se lo espera.' },
        ], { doneLabel: '¡Ahora vuelve!' });
      },
      after: `<div class="callout ok"><b>Para llevarse:</b> la integral no es una herramienta más, es la forma en que
              «sumar muchas cosas pequeñas» deja de ser una manera de hablar y se convierte en un número. Cada vez
              que en física se lee «la probabilidad total es 1» o «la energía media vale», debajo hay una de
              estas.</div>`,
    },

    {
      t: 'Dos mil años para una S alargada',
      html: `<p><b>Arquímedes</b>, en el siglo III a.C., calcula el área de un segmento de parábola y encuentra que
             es <b>4/3</b> de la del triángulo inscrito. Llega ahí sumando infinitos triángulos cada vez más
             pequeños y apretando el resultado entre dos valores: el <b>método de exhaución</b>, que es justo lo que
             acabas de jugar con los rectángulos. Solo le faltaba la palabra «límite» — y le habría hecho falta,
             pero no existía.</p>
             <p>Pasan 1.800 años. En <b>1635</b> <b>Bonaventura Cavalieri</b>, fraile jesuato milanés y discípulo de
             Galileo, publica su <i>Geometría de los indivisibles</i>: se imagina una superficie hecha de infinitas
             líneas puestas una al lado de otra, y un sólido hecho de infinitas superficies. Es una manera de
             razonar que ya entonces hacía torcer el gesto a los puristas — las líneas tienen grosor cero, ¿cómo van
             a hacer un área? — pero las cuentas salen, y su principio se sigue enseñando hoy.</p>
             <div class="callout key"><b>El 29 de octubre de 1675</b> <b>Leibniz</b>, en un manuscrito que nunca
             publicará, escribe por primera vez el símbolo <b>∫</b>. No es un garabato: es una <b>S alargada</b>, la
             inicial de <i>summa</i>. Antes escribía <i>omn.</i>, por <i>omnia</i>, «todos». Ese signo dice,
             literalmente, «suma de todos los trocitos» — y lleva 350 años ahí recordando que una integral es una
             suma.</div>
             <p>Newton y Leibniz, cada uno por su cuenta, entienden también la pieza gorda: que esa suma es la
             inversa de la derivada. Es el teorema que acabas de jugar. De ahí sale una de las peleas más venenosas
             de la historia de la ciencia sobre quién llegó antes — con la Royal Society nombrando una comisión de
             investigación cuyo informe, se descubrió después, lo había escrito el propio Newton.</p>
             <p class="mb0">Todavía falta la definición limpia, y llega con el siglo XIX de la puntillosidad: en
             <b>1854</b> <b>Bernhard Riemann</b>, en la disertación para poder enseñar en Gotinga, escribe por
             primera vez qué quiere decir <b>exactamente</b> que una función «tiene integral» — con las sumas de
             rectángulos, el límite, y la condición para que ese límite exista. Dos mil años después de Arquímedes,
             y ciento ochenta después de la S de Leibniz.</p>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego pon 10 rectángulos sobre x² y prueba los tres cortes. ¿Cuál error es más
           pequeño, y por cuánto? <span class="muted">(el del centro es casi sesenta veces más preciso)</span></p>
        <p><b>2.</b> Sobre x², ¿cuántos rectángulos hacen falta para un error menor de 0,001 cortando en el borde? ¿Y
           cortando por la mitad? <span class="muted">(500 contra 10)</span></p>
        <p><b>3.</b> Elige 1/x y mira el valor verdadero del área de 1 a e. <span class="muted">(da 1: es ln e, y es
           el motivo por el que e es la base «natural»)</span></p>
        <p><b>4.</b> En el segundo juego elige 2·sin²(πx) y lleva el cursor al 50%. ¿Qué marca el cuentakilómetros?
           <span class="muted">(0,5: la mitad de la probabilidad está en la mitad izquierda de la caja, como exige la
           simetría)</span></p>
        <p class="mb0"><b>5.</b> De inventor: en el segundo juego elige sin x y lleva el cursor al 100%. ¿La tangente
           se vuelve llana o empinada? <span class="muted">(llana: al final sin π = 0, la velocidad es cero y el
           cuentakilómetros deja de subir — aunque ya lleve 2 de camino)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué es una integral, en una línea?', options: ['su pendiente', 'el área bajo su curva, es decir el límite de sumas de rectángulos cada vez más estrechos', 'su valor máximo', 'su inversa'], correct: 1,
      why: 'Es una suma de infinitos trozos pequeños, y «suma de infinitos trozos» solo tiene sentido como límite — el del nivel M·8. El símbolo ∫ es una S alargada precisamente por «summa».' },
    { q: '¿Por qué cortar los rectángulos por el punto medio es tanto más preciso?', options: ['porque los rectángulos son más anchos', 'porque por encima del punto medio la curva está sobre el rectángulo y por debajo está bajo él: los dos errores se compensan', 'porque el cálculo es más rápido', 'no es más preciso, solo más elegante'], correct: 1,
      why: 'En el borde el error va siempre en el mismo sentido y baja como 1/n; en el medio se cancela en gran parte y baja como 1/n². Doblando los rectángulos el error se divide por cuatro en vez de por dos.' },
    { q: '¿Qué dice el teorema fundamental del cálculo?', options: ['que toda función tiene área', 'que la derivada del área acumulada es la función de partida: derivar e integrar son operaciones inversas', 'que el área siempre es positiva', 'que los rectángulos siempre bastan'], correct: 1,
      why: 'Es el velocímetro y el cuentakilómetros: el camino crece a la velocidad que marca el velocímetro. De ahí sale el atajo F(b) − F(a), que hace innecesario contar rectángulos.' },
    { q: '¿Qué es el área bajo 1/x de 1 a t?', options: ['una función sin nombre', 'el logaritmo natural de t', 'la raíz de t', 't al cuadrado'], correct: 1,
      why: 'Es la otra definición del logaritmo, y coincide con la del nivel 0·8. Vale 1 exactamente cuando t = e — por eso esa base se llama natural.' },
    { q: '¿Por qué la curva 2·sin²(πx) lleva ese 2 delante?', options: ['para hacerla más alta', 'porque sin él el área daría 1/2 y no sería una probabilidad: la probabilidad total tiene que ser 1', 'para complicar la cuenta', 'por convenio histórico'], correct: 1,
      why: 'Se llama normalización y es lo primero que se le hace a una función de onda. Es la versión continua de «la suma de los cuadrados de las amplitudes da 1», con una integral en lugar de la suma.' },
    { q: '¿Quién escribió primero el símbolo ∫, y por qué tiene esa forma?', options: ['Newton, y es una I de «infinito»', 'Leibniz en 1675, y es una S alargada por «summa»', 'Arquímedes, y es una espiral', 'Riemann, y es una R estilizada'], correct: 1,
      why: 'Antes Leibniz escribía omn. por omnia, «todos». El signo dice literalmente «suma de todos los trocitos», y lleva 350 años recordando qué es de verdad una integral.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> La integral es la suma de los trocitos, y como toda suma infinita solo
          existe como límite. Los rectángulos la calculan, pero el teorema fundamental la regala: derivar e integrar
          son inversas, así que basta una primitiva y dos restas. Y por el camino han caído dos cosas que el curso
          usaba desde hace rato: el logaritmo es un área, y «la probabilidad total es 1» es una integral que se puede
          calcular a mano.</div>`,
});
@endsection
