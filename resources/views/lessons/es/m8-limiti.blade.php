@php($description = 'Sucesiones y límites jugando: el juego del pasillo (la definición de Weierstrass disfrazada), por qué «cuántas tiradas hacen falta» ya era un límite, el banco de Bernoulli del que nace e — y el banco que paga intereses imaginarios, que es la demostración de e^(iθ) = cos θ + i·sin θ.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { corridoioLab, bancaLab } from '/js/widgets/limiti.js';

const L = renderLesson({
  id: 'm8-limiti',
  lead: `Esta es la palabra más usada de todo el análisis, y casi siempre mal explicada: «la sucesión <b>tiende</b>
         a cero». ¿Tiende cómo? ¿Llega o no llega? Aquí la respuesta llega en forma de juego — porque la definición
         de verdad <b>es</b> un juego, con dos jugadores y una jugada cada uno. Y luego se descubre una cosa: ya has
         jugado a ese juego en el nivel M·7, cuando preguntaste «cuántas tiradas hacen falta para quedar por debajo
         de cierto error». Misma pregunta, mismo número.`,

  steps: [
    {
      t: 'El juego del pasillo: la definición, sin fórmulas',
      html: `<p>Una <b>sucesión</b> es una fila infinita de números, uno para cada n: a₁, a₂, a₃, … Por ejemplo
             1/√n, que hace 1 · 0,707 · 0,577 · 0,5 … Se ve que baja hacia cero. Pero «se ve» no es una definición,
             y durante dos siglos nadie consiguió escribir una que se sostuviera.</p>
             <p>La que funcionó es esta, y es un juego entre dos jugadores:</p>
             <div class="callout key">
               <p><b>Yo</b> elijo un pasillo: una franja de <b>±ε</b> de ancho alrededor del número L.</p>
               <p><b>Tú</b> tienes que responder con una <b>N</b>: de ahí en adelante la sucesión se queda dentro
                  del pasillo, y <b>no sale nunca más</b>.</p>
               <p class="mb0">Si tienes respuesta para <b>cada</b> pasillo, por estrecho que yo lo haga, entonces la
                  sucesión <b>tiende</b> a L. Si no, no.</p>
             </div>
             <p>Fíjate en la forma: nunca se dice «llega». Solo se dice que, tan cerca como quieras, tarde o
             temprano se mete y se queda. La sucesión 1 + 1/2ⁿ nunca vale 1 — y sin embargo tiende a 1, porque para
             cualquier pasillo alrededor de 1 sabes responder con una N.</p>
             <p>Juega. Empieza por el pasillo ancho, luego apriétalo — y mira qué le pasa a la N.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'corridoio', title: 'Tres pasillos, cada vez más estrechos', text: 'encuentra una N que gane los tres.', xp: 50 });
        el.appendChild(m.root);
        corridoioLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Si has intentado ganar el pasillo más estrecho quedándote en 1/√n, has chocado contra un muro: la N
              existe, pero vale <b>10.000</b> y no cabe en el gráfico. Con 1 + 1/2ⁿ bastan <b>7</b>.</p>
              <div class="callout key"><b>Esto es lo que enseña el juego y esconden las fórmulas.</b> «Tiende a
              cero» no es una sola propiedad: hay un abismo entre tender <b>deprisa</b> y tender despacio. Las dos
              sucesiones tienden a cero; una tarda siete términos, la otra diez mil.</div>
              <p>¿Y las dos que no tienden a nada? Con <b>(−1)ⁿ</b> es obvio: rebota entre −1 y 1 para siempre. Pero
              mira la quinta, <b>Grover sobre 16 casillas</b>: esa es la probabilidad de encontrar la casilla buena
              después de n vueltas, la misma curva del nivel 11. Sube, casi toca 1 en la tercera vuelta — y luego
              <b>vuelve a bajar hasta casi cero</b>. Tampoco esa tiende a nada.</p>
              <div class="callout warn"><b>Por eso Grover tiene un número de vueltas y no «cuantas más mejor».</b>
              Es el único algoritmo del curso donde insistir <b>empeora</b>, y ahora tienes la palabra para decirlo
              con precisión: esa sucesión no converge, oscila.</div>`,
    },

    {
      t: 'Aquiles y la tortuga, o la primera vez que alguien lo intentó',
      html: `<p>El problema tiene 2.500 años, y en la forma en que lo planteó <b>Zenón de Elea</b> sonaba a
             demostración de que el movimiento es imposible.</p>
             <p>Aquiles corre diez veces más rápido que la tortuga, que sale 100 metros por delante. Cuando Aquiles
             llega a 100, la tortuga está en 110. Cuando llega a 110, ella está en 111. Y así <b>para siempre</b>:
             cada vez que él llega donde estaba ella, ella se ha movido un poco. Así que — concluía Zenón — no la
             alcanza nunca.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Dónde está la trampa', html: 'No en los números: esos pasos son <b>de verdad</b> infinitos. La trampa está en la última palabra: «nunca». Zenón está suponiendo que infinitos pasos requieren un tiempo infinito. Y eso es justo lo que hay que comprobar, no dar por bueno.' },
          { h: 'Contemos el tiempo, no los pasos', html: 'Si Aquiles va a 10 m/s, el primer tramo le cuesta <b>10 s</b>. El segundo (10 metros) le cuesta <b>1 s</b>. El tercero (1 metro) <b>0,1 s</b>. Cada tramo dura una décima parte del anterior.' },
          { h: 'La suma', html: 'El tiempo total es 10 + 1 + 0,1 + 0,01 + … Esto es una <b>serie geométrica</b> de razón 1/10, la del nivel 15·b. Su suma no es infinita: da <b>11,111… = 100/9</b> segundos.' },
          { h: 'La respuesta a Zenón', html: 'La alcanza a los <b>11,11 segundos</b>, en el metro 111,11. Infinitos pasos, en un tiempo finito. No hay ninguna paradoja: solo había una suma infinita, y nadie antes sabía que pudiera dar un número.' },
          { h: 'Qué tiene que ver con el pasillo', html: 'Las sumas parciales — 10 · 11 · 11,1 · 11,11 — son una <b>sucesión</b>. Y tiende a 100/9 en el sentido preciso del juego: pongas el pasillo que pongas alrededor de 100/9, a partir de cierto paso las sumas están dentro.' },
          { h: 'Por qué nos importa en este curso', html: 'Porque la <b>transformada de Fourier</b> está hecha de sumas de flechas, la serie geométrica es el motor que hace que se cancelen o se sumen (nivel 15·b), y cada vez que se escribe «=» entre una suma infinita y un número, detrás está este juego.' },
        ], { doneLabel: '¡Ahora vuelve!' });
      },
      after: `<div class="callout ok"><b>Para llevarse:</b> «infinitos trozos» no quiere decir «total infinito». Si
              los trozos se hacen pequeños lo bastante deprisa, la suma es un número — y ese número es un
              límite.</div>`,
    },

    {
      t: 'El banco de Bernoulli: de dónde sale e de verdad',
      html: `<p>En <b>1683</b> Jakob Bernoulli se hace una pregunta de contable, no de filósofo. Pon 1 en el banco
             al <b>100% de interés</b> al año.</p>
             <ul>
               <li>Pagado todo al final: acabas con <b>2</b>.</li>
               <li>Pagado en <b>dos plazos</b> del 50%: 1 → 1,5 → 2,25. Mejor, porque la primera mitad del interés
                   también renta.</li>
               <li>Pagado en <b>doce</b> plazos mensuales: 2,613. En <b>365</b> diarios: 2,7146.</li>
             </ul>
             <div class="formula">capital con n plazos = (1 + 1/n)<sup>n</sup></div>
             <p>Cuanto más se parte, más se gana. La pregunta de verdad es: <b>¿hasta dónde?</b> Si los plazos se
             hacen infinitos, ¿el capital explota o se para?</p>
             <p>En el juego, sube los plazos y mira la curva azul. Y luego — esta es la parte que hay que ver —
             cambia el tipo de interés.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'banca', title: 'Dos bancos', text: 'acércate a e, luego lleva la flecha al círculo.', xp: 55 });
        el.appendChild(m.root);
        bancaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>No explota: se para en <b>2,718281828…</b>, es decir <b>e</b>. Bernoulli no logró calcularlo, pero
              demostró con el binomio de Newton que tenía que estar <b>entre 2 y 3</b>. Y es el primer número de la
              historia definido así: no con una cuenta que termina, sino con un <b>dónde acaba</b>.</p>
              <div class="callout key"><b>Ahora el segundo banco, el absurdo.</b> Misma historia, pero el interés es
              <b>imaginario</b>: i·θ. Cada plazo multiplica por (1 + iθ/n), y multiplicar por un número complejo
              significa <b>estirar y girar</b> (nivel M·3).
              <p class="mb0" style="margin-top:8px">Solo que aquí la parte que estira es casi cero — la flecha
              1 + iθ/n mide √(1 + θ²/n²), apenas más de 1 — mientras que la que gira no. Resultado: <b>el capital no
              crece, gira</b>. Con infinitos plazos acaba exactamente sobre el círculo de radio 1, en el punto
              (cos θ, sin θ).</p></div>
              <div class="formula">lim<sub>n→∞</sub> (1 + iθ/n)<sup>n</sup> = cos θ + i·sin θ = e<sup>iθ</sup></div>
              <p>En los niveles 14 y M·3 la fórmula de Euler llegó así: «multiplicar flechas suma los ángulos, y las
              potencias hacen lo mismo, así que se escribe como una exponencial». Cierto, y es una buena intuición —
              pero es un <b>parecido</b>, no una demostración. La demostración es esa línea de arriba, y es un
              límite. <b>e<sup>iθ</sup> es una flecha girada θ porque es ahí donde va ese límite, y no hay otro
              sitio al que pueda ir.</b></p>
              <p class="mb0">Hay también un detalle que el juego señala solo: cuanto más grande es θ, más plazos
              hacen falta para la misma precisión. Tenlo presente para el punto siguiente.</p>`,
    },

    {
      t: 'Para qué sirve todo esto, aquí dentro',
      html: `<p>Tres deudas que este nivel salda, por orden de tamaño.</p>
             <div class="callout key"><b>1. El coste de cada medida.</b> En el nivel M·7 la pregunta era: ¿cuántas
             tiradas hacen falta para estimar una probabilidad con error ε? Respuesta (σ/ε)². Pues bien: eso <b>es</b>
             la N del juego del pasillo, para la sucesión σ/√n. No se le parece — es el mismo número, y en los tests
             de este nivel las dos cuentas se comparan directamente. Cuando dices «el error tiende a cero» estás
             diciendo algo cierto e inútil; lo útil es <b>cuán deprisa</b>, y es lento.</div>
             <div class="callout key"><b>2. La fórmula de Euler, demostrada.</b> La de arriba. De aquí en adelante,
             cada vez que en el curso aparezca e<sup>iθ</sup> — en las fases, en la QFT, en los autovalores de la
             estimación de fase — sabes de dónde viene.</div>
             <div class="callout key"><b>3. Cómo se simula un sistema físico.</b> Esto es un adelanto, pero merece
             la pena verlo ahora que tienes el banco en la cabeza. Un sistema físico evoluciona según
             e<sup>iHt</sup>, donde H es una matriz (la energía) y t el tiempo. Un ordenador cuántico no sabe
             aplicar esa cosa de golpe: solo sabe aplicar puertas sencillas. Así que hace <b>exactamente lo que hace
             el banco</b>:</div>
             <div class="formula">e<sup>iHt</sup> ≈ (1 + iHt/n)<sup>n</sup>, con n grande</div>
             <p>parte el tiempo en n trocitos y aplica n veces una puerta que es casi la identidad. Se llama
             <b>descomposición de Trotter</b>, y es como se hace química cuántica en una máquina de verdad. Y el
             detalle de antes se convierte en la cuenta del coste: <b>cuanto más largo es el tiempo a simular, más
             trocitos hacen falta</b> para la misma precisión. En el juego lo has visto con θ; allí es con t.</p>
             <div class="callout ok">Tres cosas completamente distintas — cuántas veces repetir una medida, por qué
             e<sup>iθ</sup> gira, cómo se simula una molécula — y debajo está <b>el mismo límite</b>.</div>`,
    },

    {
      t: 'Dos siglos sin saber qué es un límite',
      html: `<p>La parte histórica de este tema es embarazosa, y vale la pena contarla bien: deja claro que la
             definición rigurosa nunca llega <b>antes</b>, llega después, cuando las cuentas ya llevan generaciones
             funcionando.</p>
             <p><b>Arquímedes</b>, en el siglo III a.C., calcula áreas y volúmenes con el <b>método de
             exhaución</b>: inscribe polígonos con cada vez más lados y aprieta el resultado entre dos valores. Es
             un límite en todo menos en el nombre, y solo le faltaba permiso para decir «y ahora me voy al
             infinito».</p>
             <p><b>Newton</b> y <b>Leibniz</b>, en el siglo XVII, inventan el cálculo infinitesimal y construyen
             encima la física moderna. Hablan de cantidades «evanescentes» y de infinitesimales: números más
             pequeños que cualquier número pero distintos de cero. Funciona de maravilla y no se sostiene. El obispo
             <b>Berkeley</b>, en 1734, se ríe de ellos sin piedad llamándolos «fantasmas de cantidades difuntas» — y
             tiene razón.</p>
             <p><b>Bernoulli</b>, como has visto, define e con un límite en 1683: es la primera vez que un número se
             define por un proceso en lugar de por una cuenta. <b>Euler</b> le pone el nombre y en 1748 publica
             e<sup>ix</sup> = cos x + i·sin x, usando series infinitas con una soltura que hoy suspendería a
             cualquiera — y equivocándose casi nunca.</p>
             <div class="callout key"><b>La definición que acabas de jugar llega solo en el siglo XIX.</b>
             <b>Bolzano</b> la escribe primero en <b>1817</b>, pero publica en una revista prácticamente desconocida
             y no le lee nadie. <b>Cauchy</b>, en 1821-1823, introduce los símbolos ε y δ pero sigue razonando con
             infinitesimales. Y es <b>Weierstrass</b>, en sus clases de Berlín hacia <b>1861</b>, quien le da la
             forma definitiva: la de los dos jugadores, el pasillo y la N.</div>
             <p class="mb0">Haz la cuenta: del cálculo de Newton a la definición de límite pasan <b>casi dos
             siglos</b>. Mientras tanto ya se habían calculado las órbitas de los planetas. Si has tenido la
             sensación de que el juego del pasillo era una manía de matemáticos, que sepas que lo pensó mucha gente
             — hasta que se descubrió que sin esa manía ciertas series dan resultados distintos según el orden en
             que las sumas, y entonces la cosa se puso seria.</p>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el juego del pasillo, con ε = 0,05: ¿cuánto vale la N para 1/√n? ¿Y para (−1)ⁿ/n?
           <span class="muted">(400 contra 20: la primera es veinte veces más lenta)</span></p>
        <p><b>2.</b> Comprueba la fórmula de cabeza: para 1/√n, ¿cuándo baja 1/√n por debajo de ε?
           <span class="muted">(cuando n ≥ 1/ε². Con ε = 0,01 son 10.000, y es la misma cuenta del nivel M·7)</span></p>
        <p><b>3.</b> En el banco de verdad, ¿cuántos plazos hacen falta para quedar a 0,01 de e?
           <span class="muted">(135: aquí también el error baja como 1/n, así que un decimal más cuesta diez veces
           los plazos)</span></p>
        <p><b>4.</b> En el banco imaginario pon θ = 180°. ¿Dónde debería acabar la flecha?
           <span class="muted">(en −1: es e^(iπ) = −1, el regalo de Euler del nivel M·3 — y ahora lo has
           demostrado)</span></p>
        <p class="mb0"><b>5.</b> De inventor: con θ = 180° intenta bajar el error de 0,02 subiendo los plazos al
           máximo. ¿Lo consigues? <span class="muted">(no: el juego llega a 200 plazos y harían falta 250. El giro
           es el doble de ancho y los plazos hacen falta en proporción — es exactamente el coste de la
           descomposición de Trotter)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Qué quiere decir que una sucesión «tiende a L»?', options: ['que tarde o temprano vale exactamente L', 'que para cada pasillo ±ε alrededor de L existe una N a partir de la cual la sucesión se queda dentro', 'que se acerca cada vez más sin pararse nunca', 'que sus términos se hacen pequeños'], correct: 1,
      why: 'Nunca se dice «llega»: 1 + 1/2ⁿ nunca vale 1, y sin embargo tiende a 1. La definición es el juego: tú aprietas el pasillo, yo encuentro la N, para cada pasillo posible.' },
    { q: 'Para la sucesión 1/√n, ¿cuánto vale la N que gana el pasillo ±ε?', options: ['1/ε', '1/ε², es decir el mismo número de tiradas del nivel M·7', '√ε', 'no existe'], correct: 1,
      why: '1/√n ≤ ε cuando n ≥ 1/ε². Es la misma cuenta que en el nivel M·7 dice cuántas tiradas hacen falta para estimar una probabilidad con ese error: la definición de límite y el coste de una medida son la misma cosa.' },
    { q: '¿La probabilidad de Grover tiende a 1 al crecer el número de vueltas?', options: ['sí, cada vez más cerca de 1', 'no: oscila, y después de la vuelta óptima vuelve a bajar', 'sí, pero solo con muchos cúbits', 'tiende a 1/2'], correct: 1,
      why: 'Es una sucesión que no converge. Por eso Grover tiene un número preciso de vueltas: seguir girando empeora, y esta es la palabra correcta para decirlo.' },
    { q: '¿De dónde nace el número e?', options: ['de la longitud de una circunferencia', 'del límite de (1 + 1/n)ⁿ, es decir de un interés del 100% partido en infinitos plazos', 'de una raíz cuadrada', 'lo eligió Euler al azar'], correct: 1,
      why: 'Jakob Bernoulli, 1683, problema de interés compuesto. Es el primer número de la historia definido por un límite en vez de por una cuenta que termina, y él solo consiguió encajarlo entre 2 y 3.' },
    { q: '¿Por qué e^(iθ) es una flecha de longitud 1?', options: ['por convenio', 'porque el límite de (1 + iθ/n)ⁿ tiene longitud (1 + θ²/n²)^(n/2), que tiende a 1: el interés imaginario no hace crecer el capital, lo hace girar', 'porque θ es un ángulo', 'porque i vale √(−1)'], correct: 1,
      why: 'Cada plazo multiplica por 1 + iθ/n, que mide poco más de 1 y gira poco. Elevado a la n, los giros se suman y los estiramientos desaparecen: se acaba exactamente sobre el círculo, en (cos θ, sin θ).' },
    { q: '¿Qué tiene que ver el banco de Bernoulli con simular una molécula?', options: ['nada, es solo una historia', 'e^(iHt) se calcula como (1 + iHt/n)ⁿ: se parte el tiempo en n trocitos, como los plazos. Es la descomposición de Trotter', 'porque hace falta dinero para construir ordenadores cuánticos', 'porque las moléculas crecen de forma exponencial'], correct: 1,
      why: 'Una máquina cuántica solo sabe aplicar puertas sencillas, no e^(iHt) de golpe. Lo parte en n pasos casi idénticos a la identidad, exactamente como los plazos — y cuanto más largo es el tiempo a simular, más pasos hacen falta.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> «Tiende a» ahora es un juego con reglas precisas: tú aprietas el
          pasillo, yo encuentro la N. De ahí caen tres cosas que el curso usaba a crédito: cuántas tiradas cuesta una
          medida (es la N de 1/√n), por qué e<sup>iθ</sup> gira en vez de crecer (es el banco con interés imaginario)
          y cómo se simula un sistema físico partiendo el tiempo en trocitos. Y un premio: la próxima vez que alguien
          diga «tiende a cero», puedes preguntar <b>cuán deprisa</b> — que es siempre la pregunta que
          importa.</div>`,
});
@endsection
