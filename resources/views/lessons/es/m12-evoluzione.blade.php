@php($description = 'La exponencial de matriz jugando: e^M como serie de Taylor con una matriz dentro, el atajo de los autovectores, la ecuación de Schrödinger como interés compuesto imaginario — y la fórmula de Trotter, es decir la cuenta real de lo que cuesta simular una molécula en un ordenador cuántico.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { esponenzialeLab, trotterLab } from '/js/widgets/evoluzione.js';

const L = renderLesson({
  id: 'm12-evoluzione',
  lead: `Este es el nivel donde la Parte M se cierra sobre sí misma. La pregunta es: <b>¿cómo se calcula dónde estará
         un sistema físico dentro de un segundo?</b> La respuesta es una sola fórmula — <b>e<sup>−iHt</sup></b> —
         que contiene tres cosas que ya has construido: la serie de Taylor (M·10) dice qué significa elevar e a una
         matriz, los autovectores (M·11) dicen cómo calcularlo sin sumar nada, y el límite (M·8) dice por qué,
         cuando la energía está hecha de piezas que se pelean entre sí, hay que trocear el tiempo.`,

  steps: [
    {
      t: 'Qué significa e elevado a una matriz',
      html: `<p>Parece una pregunta sin sentido: e es un número, la matriz es una tabla. ¿Qué querría decir elevar
             uno a la otra?</p>
             <p>La respuesta es tan simple que decepciona: <b>se usa la misma serie del nivel M·10</b>.</p>
             <div class="formula">e<sup>x</sup> = 1 + x + x²/2! + x³/3! + …<br>e<sup>M</sup> = I + M + M²/2! + M³/3! + …</div>
             <p>Las potencias de una matriz se saben hacer (es solo multiplicarla por sí misma), dividir por un
             número se sabe hacer, sumar dos matrices se sabe hacer. Así que la suma tiene sentido — y converge
             siempre, para cualquier matriz, porque los factoriales del denominador ganan a todo.</p>
             <div class="callout key">No hay ninguna magia que entender: <b>e<sup>M</sup> es una definición</b>, y la
             definición es esa suma. Todo lo demás son maneras astutas de calcularla.</div>
             <p>En el juego: elige un generador, sube el número de términos y mira el camino amarillo — es la suma
             construyéndose, un término cada vez — acercarse al círculo verde, que es el resultado verdadero.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'esponenziale', title: 'Dos exponenciales construidas a mano', text: 'lleva la serie a menos de 0,001 del resultado, en dos generadores distintos.', xp: 55 });
        el.appendChild(m.root);
        esponenzialeLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Dos cosas que notar mientras juegas.</p>
              <p><b>La primera:</b> con el generador «gira», el camino amarillo sale recto y luego se enrolla hasta
              caer sobre el círculo. No es casualidad — esa matriz antisimétrica genera una <b>rotación</b>, y la
              serie está reconstruyendo el seno y el coseno exactamente como en el nivel M·10.</p>
              <p><b>La segunda:</b> sube el tiempo a 6 y mira cuántos términos hacen falta. La serie funciona
              siempre, pero <b>despacio</b> cuando la matriz es grande — es otra vez la pregunta «cuán deprisa» del
              nivel M·8. Y es el motivo por el que nadie calcula de verdad una exponencial de matriz sumando la
              serie.</p>
              <div class="callout key"><b>Cómo se calcula de verdad.</b> Con el atajo del nivel M·11: en la base de
              los autovectores la matriz es diagonal, y la exponencial de una matriz diagonal es <b>solo
              e^(autovalor) en cada dirección</b>. Cero sumas.
              <p class="mb0" style="margin-top:8px"><b>e<sup>M</sup> = P · e<sup>D</sup> · P⁻¹</b></p></div>
              <p class="mb0">Y hay una identidad que vale siempre y que el juego muestra en el recuadro:
              <b>det(e<sup>M</sup>) = e<sup>traza(M)</sup></b>. La traza y el determinante eran las dos cosas que en
              el nivel M·11 no cambiaban con la regla; aquí se descubre que además están ligadas entre sí. Si la
              traza es cero el determinante sale 1 — la transformación no cambia las áreas, y en cuántica significa
              que las probabilidades siguen sumando 1.</p>`,
    },

    {
      t: 'La ecuación de Schrödinger, que es un interés compuesto',
      html: `<p>Ahora el motivo por el que esta cosa existe. En 1926 Schrödinger escribe la ecuación que gobierna
             cualquier sistema cuántico:</p>
             <div class="formula">i·ℏ · dψ/dt = H·ψ</div>
             <p>Escrita así da miedo. Mírala con los ojos del nivel M·8 y se vuelve familiar.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Quita las constantes', html: 'Escribiéndola como <b>dψ/dt = −i·H·ψ</b> queda una sola cosa: <b>la velocidad con que cambia el estado es proporcional al estado mismo</b>. El factor de proporcionalidad es −iH.' },
          { h: 'Dónde la has visto ya', html: 'Es la misma forma del interés compuesto: «cuánto crece» es proporcional a «cuánto hay». Un capital con interés r crece como dC/dt = r·C, y la solución es C(t) = C₀·e^(rt).' },
          { h: 'Así que la solución es', html: '<b>ψ(t) = e^(−iHt)·ψ(0)</b>. Idéntica, con −iH en lugar de r. Solo que r era un número y −iH es una matriz: de ahí este nivel.' },
          { h: 'Y el interés es imaginario', html: '¿Recuerdas el banco del nivel M·8? Con interés imaginario el capital <b>no crece, gira</b>. Por eso un estado cuántico ni explota ni se desvanece: su longitud sigue siendo 1, y rota. Las probabilidades siguen sumando 1 por el mismo motivo por el que |e^(iθ)| = 1.' },
          { h: 'Los estados que no cambian', html: 'Si ψ es un <b>autovector</b> de H con autovalor E, entonces e^(−iHt)ψ = e^(−iEt)·ψ: el estado solo se lleva una fase y sigue siendo él mismo. Se llaman <b>estados estacionarios</b>, y son los niveles de energía del átomo.' },
          { h: 'Y los que oscilan', html: 'Una <b>superposición</b> de dos estados estacionarios con energías distintas sí cambia: las dos fases giran a velocidades distintas, y la diferencia se ve como una oscilación. La frecuencia es proporcional a la <b>diferencia de energía</b> — y es exactamente el color de la luz que ese átomo emite.' },
          { h: 'La conexión con el curso', html: 'Cada puerta cuántica del curso es un e^(−iHt) para algún H y algún t: se enciende un campo durante un tiempo preciso, y el estado rota lo que hace falta. «Aplicar una puerta» en el laboratorio significa <b>esperar el tiempo justo</b>.' },
        ], { doneLabel: '¡Ahora vuelve!' });
      },
      after: `<div class="callout ok"><b>Para llevarse:</b> la ecuación de Schrödinger no dice «qué pasa», dice <b>a
              qué velocidad cambia</b>. Para saber qué pasa hay que integrarla — e integrar esa ecuación significa
              calcular una exponencial de matriz.</div>`,
    },

    {
      t: 'Cuando las piezas se pelean: la fórmula de Trotter',
      html: `<p>Última pieza, y es la que decide si un ordenador cuántico sirve para algo.</p>
             <p>La energía de un sistema real nunca es una sola matriz: es una <b>suma de piezas</b>. La energía
             cinética más la potencial; la interacción entre el primer y el segundo átomo, más la del segundo con el
             tercero. Así que <b>H = A + B</b>.</p>
             <p>Dan ganas de escribir e<sup>A+B</sup> = e<sup>A</sup>·e<sup>B</sup>, como se hace con los números.
             <b>Y no se puede.</b></p>
             <div class="callout warn">Con los números esa regla vale porque a·b = b·a. Con las matrices el orden
             cuenta: en general <b>AB ≠ BA</b>. La diferencia AB − BA se llama <b>conmutador</b>, y cuando no es cero
             la regla se rompe.</div>
             <p>Pero no acaba ahí, y aquí llega la idea. Si troceo el tiempo en <b>n trocitos</b> y alterno medio
             trozo de A y medio de B, el error se hace pequeño — y cuantos más trocitos pongo, más pequeño se
             vuelve.</p>
             <div class="formula">e<sup>A+B</sup> ≈ (e<sup>A/n</sup> · e<sup>B/n</sup>)<sup>n</sup></div>
             <p>En el juego: el camino morado es el troceado, el círculo verde es donde había que llegar. Sube los
             trocitos y mira cómo se cierra la distancia.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'trotter', title: 'Dos simulaciones logradas', text: 'acércate al objetivo en un tiempo corto y en uno largo.', xp: 65 });
        el.appendChild(m.root);
        trotterLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Habrás visto dos cosas, y son <b>la</b> cuenta de este nivel.</p>
              <div class="callout key"><b>1. El error baja como 1/n.</b> Doblas los trocitos, reduces el error a la
              mitad. No es una observación: los tests lo miden comparando el error en n y en 2n, y el cociente sale
              2.</div>
              <div class="callout key"><b>2. Cuanto más tiempo quieras simular, más trocitos hacen falta</b>, en
              proporción. Para la misma precisión relativa, un tiempo tres veces más largo pide más del doble de
              trocitos.</div>
              <p>Ahora tradúcelo: <b>cada trocito es un grupo de puertas que ejecutar</b>. Así que el número de
              puertas — es decir el coste, el tiempo de cálculo, el ruido que se acumula — crece con el tiempo a
              simular y con la precisión que quieras. Esto se llama <b>descomposición de Trotter-Suzuki</b>, y es
              como se hace química cuántica en una máquina de verdad.</p>
              <div class="callout ok"><b>Y aquí la ventaja cuántica es más sólida que en ninguna otra parte.</b> Para
              simular n partículas cuánticas un ordenador normal tiene que guardar 2ⁿ números (nivel M·4): con
              cincuenta partículas no cabe en la memoria del planeta. Un ordenador cuántico usa n, de cúbits, y solo
              paga la cuenta de los trocitos. No es una aceleración astuta como Grover: es la diferencia entre
              «imposible» y «caro».</div>
              <p class="mb0">Una última nota sobre el conmutador, porque es más famoso de lo que parece. Esa misma
              cantidad AB − BA, aplicada a posición y cantidad de movimiento, da el <b>principio de
              indeterminación</b> de Heisenberg. No es una limitación de los instrumentos: es que dos matrices que no
              conmutan no tienen una base común en la que ambas sean diagonales — y sin esa base no existe una regla
              que responda con certeza a las dos preguntas. Es el nivel M·11, leído al revés.</p>`,
    },

    {
      t: 'Un físico que quería un ordenador, en 1981',
      html: `<p>En <b>mayo de 1981</b>, en el MIT, se celebra una conferencia sobre la física del cálculo.
             <b>Richard Feynman</b> da la ponencia inaugural, que se publicará al año siguiente con el título
             <i>Simulating Physics with Computers</i>.</p>
             <p>El razonamiento es el que acabas de hacer. Para simular un sistema cuántico de n partículas hacen
             falta <b>2ⁿ</b> números, y ese número se dobla con cada partícula añadida. No es cuestión de
             ordenadores más rápidos: es una cantidad de información que no cabe.</p>
             <div class="callout key">La conclusión de Feynman se hizo famosa: «<b>La naturaleza no es clásica,
             maldita sea, y si quieres hacer una simulación de la naturaleza más te vale hacerla cuántica — y por
             Dios que es un problema estupendo, porque no parece nada fácil.</b>»</div>
             <p>La idea es simple y le da la vuelta a la mesa: si un sistema cuántico es difícil de simular con una
             máquina clásica, <b>usemos otro sistema cuántico como máquina</b>. En esa charla no hay ningún
             algoritmo: hay una propuesta.</p>
             <p>Hicieron falta años para que se convirtiera en algo concreto. <b>David Deutsch</b>, en <b>1985</b>,
             define qué es una máquina de Turing cuántica — el nivel 9 de este curso lleva su nombre. <b>Seth
             Lloyd</b>, en <b>1996</b>, muestra cómo se simula de verdad un sistema físico en un ordenador cuántico,
             y es exactamente la receta del segundo juego: se trocea el tiempo y se aplican las piezas de la energía
             por turnos.</p>
             <p class="mb0">Vale la pena fijarse en el orden de las cosas. <b>Shor llega en 1994</b> y se lleva todos
             los titulares, pero la simulación — propuesta por Feynman y hecha concreta por Lloyd — nació antes y es
             la aplicación por la que hoy casi todos apuestan más. Romper RSA es espectacular; entender cómo funciona
             una molécula es útil.</p>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego pon «gira» con tiempo ×6 y cuenta cuántos términos hacen falta para llegar a
           0,001. Luego repítelo con tiempo ×1. <span class="muted">(20 contra 6: cuanto más grande es la matriz, más
           lenta es la serie)</span></p>
        <p><b>2.</b> Pon «stira» y mira el determinante en el recuadro. ¿Por qué sale siempre 1?
           <span class="muted">(porque esa matriz tiene traza cero, y det(e^M) = e^(traza): estira por un lado
           exactamente lo que aprieta por el otro)</span></p>
        <p><b>3.</b> En el segundo juego deja los trocitos en 1 y mira dónde acaba el camino morado.
           <span class="muted">(lejísimos: con un solo trocito estás diciendo e^(A+B) = e^A·e^B, que es
           falso)</span></p>
        <p><b>4.</b> Encuentra el número de trocitos que hace falta con tiempo ×1, y luego con tiempo ×3.
           <span class="muted">(94 contra 348: crece en proporción al tiempo, y esa es la cuenta del coste de una
           simulación)</span></p>
        <p class="mb0"><b>5.</b> De inventor: si A y B conmutaran, ¿cuántos trocitos harían falta?
           <span class="muted">(uno: sin conmutador la fórmula e^(A+B) = e^A·e^B es exacta, y los tests lo comprueban
           con dos estiramientos que conmutan)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué significa e elevado a una matriz?', options: ['no tiene sentido', 'la misma serie de Taylor de eˣ, con la matriz en lugar del número: I + M + M²/2! + …', 'el determinante de M', 'la matriz con sus elementos exponenciados'], correct: 1,
      why: 'Es una definición, y converge siempre porque los factoriales del denominador ganan a cualquier matriz. Ojo con la última respuesta: NO se exponencian los elementos uno a uno.' },
    { q: '¿Cómo se calcula e^M sin sumar la serie?', options: ['no se puede', 'en la base de los autovectores: allí la matriz es diagonal y basta hacer e^(autovalor) en cada dirección', 'con el determinante', 'multiplicando M por sí misma'], correct: 1,
      why: 'Es el atajo del nivel M·11: e^M = P·e^D·P⁻¹. La serie dice qué significa, la diagonalización dice cómo se hace.' },
    { q: '¿Qué relación hay entre la ecuación de Schrödinger y el interés compuesto?', options: ['ninguna', 'tienen la misma forma: la velocidad de cambio es proporcional a lo que hay, así que la solución es una exponencial', 'las dos son lineales', 'las dos usan números complejos'], correct: 1,
      why: 'dC/dt = r·C da C(t) = C₀e^(rt); dψ/dt = −iHψ da ψ(t) = e^(−iHt)ψ(0). Y el interés imaginario del nivel M·8 explica por qué el estado gira en vez de crecer.' },
    { q: '¿Por qué e^(A+B) no siempre es e^A·e^B?', options: ['porque las matrices son grandes', 'porque en general AB ≠ BA: la diferencia se llama conmutador', 'porque la suma de matrices no está definida', 'porque e no es un número entero'], correct: 1,
      why: 'Con los números la regla vale porque a·b = b·a. Si el conmutador AB − BA no es cero, la regla se rompe — y ese mismo conmutador da el principio de indeterminación.' },
    { q: '¿Qué dice la fórmula de Trotter?', options: ['que las matrices siempre conmutan', 'que troceando el tiempo en n trocitos y alternando las dos piezas, el error baja como 1/n', 'que la exponencial no se puede calcular', 'que hacen falta más cúbits'], correct: 1,
      why: 'Es cómo un ordenador cuántico simula un sistema físico: no sabe aplicar e^(−iHt) de golpe, pero sabe aplicar las piezas por turnos. Más trocitos, más puertas, menos error.' },
    { q: '¿Por qué simular la física se considera la aplicación más sólida de los ordenadores cuánticos?', options: ['porque es más fácil que Shor', 'porque un ordenador normal necesita 2ⁿ números para n partículas, y con unas decenas ya no cabe en ninguna memoria', 'porque no hace falta corrección de errores', 'porque lo dijo Feynman'], correct: 1,
      why: 'Es la diferencia entre «caro» e «imposible», no una aceleración astuta. Lo propuso Feynman en 1981, y Seth Lloyd mostró cómo hacerlo en 1996.' },
  ],

  outro: `<div class="callout ok"><b>Hecho, y la Parte M se cierra sobre sí misma.</b> e^(matriz) es la serie de Taylor
          del nivel M·10 con una tabla dentro; se calcula con los autovectores del nivel M·11; resuelve la ecuación de
          Schrödinger, que tiene la forma del interés compuesto del nivel M·8 — con el interés imaginario, y por eso
          el estado gira en vez de crecer. Y cuando la energía está hecha de piezas que no conmutan se trocea el
          tiempo, se paga en puertas, y se simula una molécula. Es la aplicación que hizo nacer la idea misma del
          ordenador cuántico, trece años antes de Shor.</div>`,
});
@endsection
