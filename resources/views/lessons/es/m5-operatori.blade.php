@php($description = 'Operadores explicados jugando: unitaria significa «no cambia las longitudes» (las puertas), hermítica significa «autovalores reales» (los observables), proyector significa «rehacerlo no cambia nada» (la medida). Con el adjunto explicado por lo que es y el colapso como idempotencia.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { operatoreLab, proiettoreLab } from '/js/widgets/operatori.js';

const L = renderLesson({
  id: 'm5-operatori',
  lead: `Si abres un libro de mecánica cuántica encuentras tres palabras repetidas en cada página: <b>unitario</b>,
         <b>hermítico</b>, <b>proyector</b>. Parecen tres tecnicismos que hay que tragar. Son en cambio tres maneras
         muy distintas en que una máquina puede tratar las flechas — y en veinte minutos las construyes las tres con
         cuatro mandos, descubriendo de paso por qué una puerta cuántica <b>no puede</b> hacerse al azar y por qué
         volver a medir nunca cambia la respuesta.`,

  steps: [
    {
      t: 'Primera palabra: el adjunto (y no es lo que parece)',
      html: `<p>En el nivel 0·6 una matriz es la <b>máquina que transforma las flechas</b>. Antes de clasificarlas
             hace falta una sola herramienta, y tiene un nombre feo: el <b>adjunto</b>, que se escribe con una cruz
             — M†.</p>
             <p>La receta es sencilla: se <b>voltea la matriz alrededor de la diagonal</b> (la casilla de arriba a la
             derecha va abajo a la izquierda y viceversa). Con los números complejos se hace algo más: se <b>gira
             cada flecha</b> — es decir, se toma el conjugado. En este nivel trabajamos con números reales, así que
             «adjunto» significa solo «volteada», y los dos nombres técnicos que encontrarás son <i>ortogonal</i>
             (para unitaria) y <i>simétrica</i> (para hermítica).</p>
             <div class="callout key">Pero la definición de verdad del adjunto no es la receta: es <b>para qué
             sirve</b>. El adjunto es la máquina que «pasa M al otro lado» dentro de un producto escalar:
             <p class="mb0" style="margin-top:8px"><b>⟨M v , w⟩ = ⟨v , M† w⟩</b></p>
             <p class="mb0" style="margin-top:8px">Es decir: transformar la primera flecha con M y luego hacer la
             sombra da el mismo número que dejar la primera flecha como está y transformar la segunda con M†. Es lo
             único que hay que recordar, y es lo que sobrevive también con los números complejos.</p></div>`,
    },

    {
      t: 'Las tres familias, construidas a mano',
      html: `<p>Ahora los cuatro mandos. Muévelos y mira encenderse las tres etiquetas de abajo. El dibujo ayuda: los
             puntitos grises son <b>flechas de longitud 1</b> puestas en círculo, y los de color son dónde acaban
             tras la máquina.</p>
             <div class="callout key">Busca estas tres cosas, en este orden:
             <ul style="margin:8px 0 0">
               <li>una máquina en la que el círculo de puntos <b>siga siendo un círculo</b>: es <b>unitaria</b>;</li>
               <li>una en la que la matriz sea <b>igual a su volteada</b>: es <b>hermítica</b>;</li>
               <li>una que sea <b>las dos a la vez</b> — y cuando la encuentres, mira lo que hace.</li>
             </ul></div>
             <p>Las máquinas listas de arriba son las puertas que ya conoces: empezar por ahí es lo más rápido.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'famiglie', title: 'Las tres familias', text: 'construye una unitaria, una hermítica y una que sea ambas.', xp: 55 });
        el.appendChild(m.root);
        operatoreLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Esto es lo que acabas de descubrir, traducido a lo cuántico:</p>
              <table class="table">
                <tr><th>Familia</th><th>La regla</th><th>Qué es, en el curso</th></tr>
                <tr><td><b>unitaria</b></td><td>M†M = I<br>no cambia longitudes ni ángulos</td><td>una <b>puerta</b></td></tr>
                <tr><td><b>hermítica</b></td><td>M† = M<br>autovalores siempre reales</td><td>un <b>observable</b></td></tr>
                <tr><td><b>proyector</b></td><td>P·P = P<br>rehacerlo no cambia nada</td><td>una <b>medida</b></td></tr>
              </table>
              <p>Y las dos cosas que el juego enseña y que las palabras solas no transmiten:</p>
              <ul>
                <li><b>la rotación no tiene autovalores reales.</b> Su discriminante es negativo — es el caso
                    «imposible» del nivel 0·7b — y en efecto ninguna flecha se queda quieta. Por eso las fases
                    cuánticas son números complejos: no había alternativa;</li>
                <li><b>X, Z y H son unitarias <i>y</i> hermíticas a la vez.</b> Significa que son <b>reflexiones</b>:
                    sus autovalores son +1 y −1, y aplicándolas dos veces se vuelve exactamente al punto de partida.
                    Pruébalo: por eso en un circuito esa pareja se cancela.</li>
              </ul>`,
    },

    {
      t: 'Por qué una puerta DEBE ser unitaria',
      html: `<p>Esto no es un convenio: es una obligación, y tiene dos motivos independientes que llevan al mismo
             sitio.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Motivo 1: las probabilidades', html: 'La longitud al cuadrado del estado es la suma de las probabilidades, y tiene que dar <b>1</b> siempre. Si una puerta alargara aunque fuera un poco una flecha, tras diez puertas las probabilidades sumarían 3 — y una probabilidad del 300% no significa nada.' },
          { h: 'Motivo 2: se puede volver atrás', html: 'Una máquina unitaria siempre tiene inversa, y es su adjunto: <b>U† deshace U</b>. Así que todo circuito cuántico se puede <b>releer al revés</b>. Es la reversibilidad del nivel K·6, y no es un lujo: la física de debajo (la ecuación de Schrödinger) es reversible, así que las puertas también deben serlo.' },
          { h: 'Qué excluye', html: 'Entre las puertas no hay nada que <b>borre</b>. El AND clásico tira información — de 1 y 0 sale 0, y ya no sabes de dónde venías. Una puerta cuántica no puede hacerlo: por eso en el nivel K·6 la suma lógica hay que reescribirla de forma reversible antes de poder traerla aquí.' },
          { h: 'Y los ángulos también', html: 'Una unitaria conserva el producto escalar, no solo las longitudes. Así que dos estados <b>perpendiculares siguen siendo perpendiculares</b>: dos respuestas distinguibles con certeza siguen siéndolo. Una puerta no puede «confundir» dos posibilidades.' },
          { h: 'La consecuencia práctica', html: 'Cuando en el nivel 22 inventes tu propio algoritmo, no puedes escribir una matriz cualquiera: tiene que ser unitaria. Es la restricción que hace el oficio difícil — e interesante.' },
        ], { doneLabel: '¡Tiene sentido!' });
      },
    },

    {
      t: 'Por qué un observable DEBE ser hermítico',
      html: `<p>Aquí el razonamiento es aún más corto, y cabe en una frase: <b>los números que lees en un instrumento
             son números reales</b>. No existe un voltímetro que marque 3 + 2i.</p>
             <p>En mecánica cuántica el valor que sale de una medida es un <b>autovalor</b> del operador que
             representa la magnitud (nivel 18·b). Así que hace falta una familia de matrices cuyos autovalores estén
             <b>garantizados reales</b>, siempre, no por suerte.</p>
             <div class="callout key">Y esa familia es exactamente la de las <b>hermíticas</b>. El test lo comprueba
             sobre dos mil matrices simétricas tomadas al azar: el discriminante del polinomio característico no es
             nunca negativo, ni una sola vez. No es una tendencia: es un teorema.</div>
             <p>Hay más, y completa el cuadro: los <b>autovectores</b> de una matriz hermítica con autovalores
             distintos son automáticamente <b>perpendiculares</b> entre sí. Es decir: forman una base ortonormal
             (nivel M·4). Juntando las dos cosas:</p>
             <div class="callout ok"><b>Un observable es: un conjunto de direcciones perpendiculares, con un número
             real escrito en cada una.</b> Las direcciones son los resultados posibles, los números son los valores
             que lees. Eso es todo lo que significa «observable» — y se llama <b>teorema espectral</b>.</div>
             <p class="mb0">De aquí se lee también por qué ciertas parejas de magnitudes no se pueden medir juntas:
             si dos observables tienen <b>bases de autovectores distintas</b>, preguntar por uno significa proyectar
             en una base, y preguntar por el otro, en otra. Las dos preguntas no se pueden hacer en el mismo idioma.
             Es el origen del principio de indeterminación, y es geometría.</p>`,
    },

    {
      t: 'El proyector: por qué releer no cambia la respuesta',
      html: `<p>La tercera familia es la que explica el <b>colapso</b>, que suele presentarse como un postulado
             misterioso.</p>
             <p>Un <b>proyector</b> es la máquina que aplasta cada flecha sobre una dirección: la sombra del nivel
             0·9, hecha matriz. Su propiedad cabe entera en tres símbolos:</p>
             <div class="formula">P · P = <span class="hl-n">P</span></div>
             <p>Aplicarlo dos veces es como aplicarlo una. Tiene sentido: una vez que una flecha ya está aplastada
             sobre la recta, aplastarla otra vez no la mueve.</p>
             <p>En el juego: elige una dirección de medida, coloca el estado, pulsa «medir» — y luego vuelve a
             medir.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'proiettore', title: 'Relee y vuelve a mirar', text: 'mide dos veces seguidas en 2 direcciones distintas.', xp: 50 });
        el.appendChild(m.root);
        proiettoreLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>El primer resultado sale al azar, con las probabilidades que dan las sombras al cuadrado. El segundo
              <b>no</b>: ya está decidido, y es igual al primero. Siempre.</p>
              <div class="callout key"><b>El colapso no es una hipótesis de más.</b> Es la cara física de P·P = P.
              Decir «una vez medido, el estado es ese» y decir «aplicar el proyector dos veces es como aplicarlo una»
              son la misma frase en dos idiomas.</div>
              <p>Y la otra propiedad que el juego enseña abajo: los dos proyectores sobre direcciones perpendiculares,
              <b>sumados, dan la identidad</b>. Traducido: los resultados posibles cubren todos los casos, y las
              probabilidades suman 100%. También eso, que parecía una imposición, es una propiedad de matrices.</p>
              <div class="callout warn"><b>Honestidad sobre lo que hace el juego:</b> aquí el colapso se simula con un
              número al azar, como en una máquina real se observaría repitiendo el experimento. El juego no toma
              posición sobre <i>por qué</i> la naturaleza se comporta así — es una cuestión abierta de interpretación
              — sino sobre <i>cómo</i> se comporta, y sobre cómo se escribe.</div>`,
    },

    {
      t: 'De dónde viene: alguien que no aprobaba los exámenes',
      html: `<p><b>Charles Hermite</b>, francés, demuestra en <b>1855</b> que las matrices iguales a su propia
             volteada-y-conjugada tienen <b>siempre autovalores reales</b> — la misma propiedad que tenían las
             simétricas de coeficientes reales. Las llamamos hermíticas por eso. Estamos <b>setenta años antes</b> de
             que alguien lo necesite para describir un átomo.</p>
             <div class="callout key"><b>La curiosidad, y vale para cualquiera que se sienta lento:</b> Hermite fue un
             estudiante <b>desastroso</b> en los exámenes. Entró en la École Polytechnique con una nota casi al final
             de la lista, y tras <b>un solo año</b> la escuela no le dejó continuar: la pierna derecha, con la que
             caminaba mal desde el nacimiento, le impedía obtener el despacho militar para el que preparaba el
             Polytechnique, y eso bastó. Le ofrecieron reingresar con condiciones duras; se negó, y se marchó <b>sin
             título</b>. Tardó años en recomponer una carrera académica, presentándose a exámenes que seguía
             aprobando mal. Mientras tanto escribía a Jacobi cartas con resultados que sus examinadores no habrían
             sabido valorar.</div>
             <p>Luego la carrera: demuestra que <b>e es trascendente</b> (1873) — es decir, que no es solución de
             ninguna ecuación polinómica de coeficientes enteros, lo que cierra un problema abierto durante siglos —
             y abre el camino al mismo resultado para π, que Lindemann completará nueve años después. Y acaba de
             profesor precisamente en aquella École Polytechnique que lo había echado, y en la Sorbona.</p>
             <p>El resto de la historia lo conoces del nivel M·4: <b>Hilbert</b> ordena los espacios con producto
             escalar, y <b>von Neumann</b> en <b>1932</b> escribe el libro que traduce toda la mecánica cuántica a
             este idioma. Es él quien fija, de forma definitiva, el diccionario que ahora tienes en la mano:</p>
             <table class="table">
               <tr><th>Física</th><th>Matemáticas</th></tr>
               <tr><td>estado</td><td>vector de longitud 1</td></tr>
               <tr><td>evolución, puerta</td><td>operador <b>unitario</b></td></tr>
               <tr><td>magnitud observable</td><td>operador <b>hermítico</b></td></tr>
               <tr><td>valor que lees</td><td><b>autovalor</b> (real)</td></tr>
               <tr><td>medida, colapso</td><td><b>proyector</b> (P·P = P)</td></tr>
             </table>
             <div class="callout ok">Vale la pena detenerse un momento en esta tabla. No es una traducción
             aproximada: es <b>exacta</b>, y es el motivo por el que la mecánica cuántica, que es difícil de
             imaginar, es en cambio fácil de <b>calcular</b>. Toda la rareza está en la columna de la izquierda; la de
             la derecha son matrices, y las matrices sabes moverlas desde hace diez niveles.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego carga la puerta <b>H</b>: ¿es unitaria? ¿hermítica? ¿Qué autovalores tiene? ¿Y
           qué pasa si la aplicas dos veces? <span class="muted">(+1 y −1, y H·H = identidad: es una
           reflexión)</span></p>
        <p><b>2.</b> Carga «estira» (2 y 0.5): ¿por qué no puede ser una puerta cuántica?
           <span class="muted">(mira qué le hace al círculo de puntos)</span></p>
        <p><b>3.</b> Carga la <b>rotación</b>: ¿por qué el recuadro dice «autovalores complejos»? Recuerda el
           discriminante del nivel 0·7b. <span class="muted">(traza 0, determinante 1 → λ² + 1 = 0)</span></p>
        <p><b>4.</b> En el segundo juego pon el estado a 45° y mide en la dirección 0°: ¿qué probabilidades salen?
           Ahora mide en la dirección 45°: ¿y ahora? <span class="muted">(50/50 frente a certeza: es el mismo estado,
           cambia la pregunta — nivel M·4)</span></p>
        <p class="mb0"><b>5.</b> De inventor: un proyector es hermítico pero <b>no</b> unitario. ¿Qué dice eso sobre si
           la medida es reversible? <span class="muted">(no lo es: al aplastar se pierde información, y es el único
           punto de toda la mecánica cuántica en el que eso ocurre)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué es el adjunto de una matriz, en una línea?', options: ['su inversa', 'la máquina que pasa M al otro lado de un producto escalar: ⟨Mv, w⟩ = ⟨v, M†w⟩', 'la matriz multiplicada por −1', 'la matriz de sus autovalores'], correct: 1,
      why: 'La receta (voltear, y con los complejos conjugar) es solo la forma de calcularlo. La definición es esa propiedad, y es lo único que hace falta recordar.' },
    { q: '¿Por qué una puerta cuántica tiene que ser unitaria?', options: ['por convenio', 'porque no debe cambiar las longitudes (las probabilidades siguen sumando 100%) y debe ser reversible', 'porque así es más rápida', 'porque si no, no tiene autovalores'], correct: 1,
      why: 'Dos motivos independientes que llevan a la misma restricción: la suma de las probabilidades debe seguir siendo 1, y la evolución física de debajo es reversible — la inversa de una unitaria es su adjunto.' },
    { q: '¿Por qué un observable tiene que ser hermítico?', options: ['por simetría estética', 'porque sus autovalores están garantizados reales, y un valor leído en un instrumento es un número real', 'porque es más fácil de calcular', 'porque conserva las longitudes'], correct: 1,
      why: 'El valor que sale de una medida es un autovalor. Las matrices hermíticas son exactamente las que siempre los tienen reales — y además sus autovectores son perpendiculares, o sea forman una base de medida.' },
    { q: '¿Qué significa P·P = P?', options: ['que P es la identidad', 'que aplicar el proyector dos veces es como aplicarlo una: volver a medir da el mismo resultado', 'que P es invertible', 'que P no tiene autovalores'], correct: 1,
      why: 'Una flecha ya aplastada sobre la recta no se mueve si la aplastas otra vez. Es la idempotencia, y el colapso cuántico es su cara física.' },
    { q: 'Las puertas X, Z y H son unitarias y también hermíticas. ¿Qué implica?', options: ['que no hacen nada', 'que son reflexiones: autovalores +1 y −1, y aplicadas dos veces vuelven a la identidad', 'que tienen autovalores complejos', 'que no son invertibles'], correct: 1,
      why: 'Unitaria dice que la inversa es el adjunto; hermítica dice que el adjunto es ella misma. Así que es su propia inversa: aplicarla dos veces no hace nada. En un circuito esa pareja se cancela.' },
    { q: '¿Por qué dos observables con autovectores distintos no se pueden medir juntos?', options: ['porque los instrumentos se molestan', 'porque medir significa proyectar sobre una base, y las dos preguntas usan bases distintas', 'porque una de las dos no es hermítica', 'porque el tiempo de medida es demasiado largo'], correct: 1,
      why: 'Cada observable lleva consigo su propia base de autovectores. Preguntar por uno significa proyectar en esa base; por el otro, en otra. Es el origen geométrico del principio de indeterminación.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Unitaria = no cambia las longitudes, así que es una puerta. Hermítica =
          autovalores reales sobre direcciones perpendiculares, así que es un observable. Proyector = rehacerlo no
          cambia nada, así que es una medida. Tres familias de matrices, tres palabras de la física — y el colapso,
          que parecía un misterio, es la línea P·P = P.</div>`,
});
@endsection
