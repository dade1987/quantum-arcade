@php($description = 'Producto tensorial y entrelazamiento explicados jugando: por qué dos cúbits dan cuatro amplitudes y no cuatro números cualesquiera, la definición honesta de entrelazado («no se puede escribir como dos cosas separadas») y la cuenta de una línea que lo reconoce: a00·a11 − a01·a10.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { tensoreLab, groviglioLab } from '/js/widgets/tensore.js';

const L = renderLesson({
  id: 'm6-tensore',
  lead: `En el nivel M·4 descubriste <b>que</b> n cúbits viven en un espacio de dimensión 2<sup>n</sup>. Aquí ves
         <b>cómo</b>: hay una operación que junta dos registros, y no suma las dimensiones — las <b>multiplica</b>.
         De esa operación, en tres líneas de cuentas, sale también la definición honesta de la palabra más
         maltratada de la física: <b>entrelazado</b>. Que no significa «los dos cúbits se hablan a distancia».
         Significa algo mucho más preciso, y lo reconocerás con una multiplicación.`,

  steps: [
    {
      t: 'Cómo se juntan dos registros',
      html: `<p>Tienes dos cúbits. El primero se describe con dos amplitudes, el segundo también. Pregunta: ¿con
             cuántos números se describe la <b>pareja</b>?</p>
             <p>La respuesta clásica sería «dos más dos, cuatro números en dos listas». La cuántica es distinta, y es
             la raíz de todo: la pareja tiene <b>cuatro amplitudes en una sola lista</b>, una por cada configuración
             posible — |00⟩, |01⟩, |10⟩, |11⟩ — y cada una se obtiene <b>multiplicando</b>:</p>
             <div class="formula">(a₀ , a₁) ⊗ (b₀ , b₁) = (a₀b₀ , a₀b₁ , a₁b₀ , a₁b₁)</div>
             <p>El símbolo ⊗ se llama <b>producto tensorial</b>. La regla está toda ahí: <b>cada amplitud por cada
             amplitud</b>.</p>
             <div class="callout key">Y aquí está la cuenta que explica el 2<sup>n</sup>. Las dimensiones no se
             suman, se multiplican: 2 × 2 = 4, luego 4 × 2 = 8, luego 16, 32… Cada cúbit añadido <b>duplica</b>,
             mientras que dos registros clásicos de n bits dan simplemente 2n. El nivel M·4 te dio el número; esta
             es la máquina que lo produce.</div>
             <p>En el juego mueve los dos cúbits y mira las cuatro barritas de abajo: son siempre los productos de
             los dos grupos de arriba.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'tensore', title: 'Tres parejas', text: 'construye 3 parejas distintas.', xp: 45 });
        el.appendChild(m.root);
        tensoreLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>Fíjate en la línea verde del fondo del juego: el número <b>a₀₀·a₁₁ − a₀₁·a₁₀</b> se queda en
              <b>cero</b>, siempre, para cualquier pareja que construyas. No es casualidad, y es fácil ver por qué:
              con a₀₀ = a₀b₀ y a₁₁ = a₁b₁, el primer producto vale a₀a₁b₀b₁ — y el segundo, a₀₁·a₁₀ = a₀b₁ · a₁b₀,
              vale exactamente lo mismo. Se cancelan.</p>
              <div class="callout key">Guarda ese número: en este curso se llama <b>cruce</b> y ya lo encontraste en
              el nivel M·4, donde decía si dos flechas eran independientes. Aquí dirá otra cosa, y será la cosa
              importante.</div>`,
    },

    {
      t: 'La pregunta que le da la vuelta a todo',
      html: `<p>Ahora el paso decisivo, y vale la pena plantearlo como pregunta antes de responder.</p>
             <p>El producto tensorial toma dos cúbits y produce cuatro amplitudes. Pero ¿<b>todas</b> las cuaternas
             de cuatro amplitudes se obtienen así? Es decir: <b>dado un estado de dos cúbits, ¿siempre se puede
             decir «el primero está así y el segundo así»?</b></p>
             <div class="callout warn">Párate un momento antes de seguir leyendo. Cuenta los grados de libertad: dos
             cúbits separados son <b>dos</b> números (un ángulo cada uno). Una cuaterna normalizada de amplitudes
             tiene <b>tres</b>. Tres parámetros no caben en dos: <b>tienen</b> que existir estados que no se escriben
             como producto.</div>
             <p>Y existen. El más famoso es este, y en este curso ya lo encontraste en el nivel 4:</p>
             <div class="formula">|00⟩ + |11⟩ &nbsp;(dividido por √2)</div>
             <p>Es decir: las amplitudes son (0,707 ; 0 ; 0 ; 0,707). En el juego que sigue intenta reconstruirlo
             moviendo los dos cúbits. <b>Inténtalo en serio</b>, y luego lee el recuadro.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'groviglio', title: 'Sepáralos (o demuestra que no se puede)', text: 'clasifica correctamente 3 estados.', xp: 60 });
        el.appendChild(m.root);
        groviglioLab(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<p>No lo has conseguido, y no es culpa tuya: <b>es imposible</b>. Aquí está la demostración, que ocupa
              cuatro líneas y que puedes seguir entera:</p>`,
    },

    {
      t: 'Por qué es imposible, demostrado',
      html: `<p>Supongamos que el estado de Bell se pudiera escribir como producto, es decir, que existieran dos
             cúbits (a₀, a₁) y (b₀, b₁) cuyo producto diera (0,707 ; 0 ; 0 ; 0,707). Veamos adónde lleva.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Las cuatro condiciones', html: 'El producto tensorial nos dice que tendría que valer: <b>a₀b₀ = 0,707</b>, <b>a₀b₁ = 0</b>, <b>a₁b₀ = 0</b>, <b>a₁b₁ = 0,707</b>.' },
          { h: 'Lo primero que se deduce', html: 'De <b>a₀b₀ = 0,707</b> se sigue que ni a₀ ni b₀ son cero. De <b>a₁b₁ = 0,707</b> se sigue que ni a₁ ni b₁ son cero. Así que <b>los cuatro</b> números son distintos de cero.' },
          { h: 'La contradicción', html: 'Pero la segunda condición dice <b>a₀b₁ = 0</b>: un producto de dos números no nulos que debería dar cero. Imposible. Fin.' },
          { h: 'Qué hemos demostrado', html: 'No que «no lo hemos conseguido»: que <b>no existe</b> ninguna pareja de cúbits cuyo producto dé el estado de Bell. Es una demostración por absurdo, corta y definitiva.' },
          { h: 'El test de una línea', html: 'El mismo razonamiento, condensado: un estado (a₀₀, a₀₁, a₁₀, a₁₁) se separa <b>si y solo si</b> a₀₀·a₁₁ − a₀₁·a₁₀ = 0. Para Bell esa cuenta da 0,5, no cero — y es el número que ves en la barra del juego.' },
          { h: 'Y cuánto está entrelazado', html: 'El valor absoluto de ese número, multiplicado por dos, va de 0 (separable) a 1 (máximamente entrelazado). Se llama <b>concurrencia</b>. El estado de Bell vale exactamente 1: no se puede más.' },
        ], { doneLabel: '¡Demostrado!' });
      },
      after: `<div class="callout ok"><b>Esta es la definición que vale la pena llevarse:</b>
              <p class="mb0" style="margin-top:8px"><b>Entrelazado = el estado de la pareja no se parte en un estado
              del primero y otro del segundo.</b></p>
              <p class="mb0" style="margin-top:8px">No «los dos cúbits se comunican». No «se influyen a distancia».
              No «uno sabe lo que hace el otro». Simplemente: <b>no hay manera de describirlos por separado</b>,
              porque la descripción completa existe solo para la pareja entera.</p></div>
              <p>Y la consecuencia física que suele contarse como misteriosa se vuelve casi obvia: si el estado es
              (|00⟩ + |11⟩)/√2 y mides el primer cúbit obteniendo 0, el único término que sobrevive es |00⟩ — así
              que el segundo también dará 0. No porque el primero haya «avisado» al segundo: porque nunca hubo una
              descripción separada a la que avisar.</p>`,
    },

    {
      t: 'Quién crea el entrelazamiento: la CNOT',
      html: `<p>Última pregunta práctica: si los estados entrelazados no se escriben como producto, ¿<b>cómo se
             fabrican?</b></p>
             <p>No con dos puertas separadas. También esto se demuestra: aplicar una puerta al primer cúbit y otra al
             segundo significa aplicar el <b>producto tensorial de las dos matrices</b>, y un producto de matrices
             separadas manda estados separables a estados separables. Siempre. Los tests de este nivel lo comprueban
             sobre cientos de combinaciones.</p>
             <div class="callout key">Hace falta una puerta que <b>no sea</b> un producto tensorial — es decir, que
             trate los dos cúbits <b>juntos</b> y no uno cada vez. La más sencilla es la <b>CNOT</b> del nivel 4: «si
             el primero es 1, dale la vuelta al segundo». Esa frase no se puede partir en dos frases separadas, y
             precisamente por eso funciona.</div>
             <p>La receta del estado de Bell, que en el nivel 4 ejecutaste, ahora se lee entera:</p>
             <ol>
               <li>partes de |0⟩⊗|0⟩ — separable, cruce cero;</li>
               <li>una <b>H</b> sobre el primer cúbit: se convierte en (|0⟩+|1⟩)/√2 ⊗ |0⟩ — todavía separable, la H
                   es una puerta de un solo cúbit;</li>
               <li>una <b>CNOT</b>: y el cruce pasa de 0 a 0,5. <b>Ahí</b> nace el entrelazamiento.</li>
             </ol>
             <p class="mb0">Fíjate en el paso 2: la superposición sola <b>no basta</b>. Hace falta la superposición
             <i>y luego</i> una puerta de dos cúbits. Sobre |0⟩⊗|0⟩ la CNOT no hace nada — pruébalo mentalmente, y
             los tests lo confirman.</p>`,
    },

    {
      t: 'De dónde viene: una palabra inventada para una carta',
      html: `<p>La palabra nace en un solo año, <b>1935</b>, y es un año concurrido.</p>
             <p>En primavera <b>Einstein, Podolsky y Rosen</b> publican el artículo que hoy se llama <b>EPR</b>: toman
             dos partículas preparadas juntas y muestran que, según la mecánica cuántica, medir una determina
             inmediatamente lo que se obtendrá de la otra. Su conclusión no es «qué maravilla»: es que la teoría
             tiene que estar <b>incompleta</b>, porque no puede ser que la realidad funcione así.</p>
             <p>Pocos meses después <b>Erwin Schrödinger</b> responde con un artículo largo — aquel en el que aparece
             también el famoso gato — y al hacerlo <b>acuña la palabra</b>. En alemán escribe <i>Verschränkung</i>,
             que significa «entrelazamiento, cruce de los brazos». Y como escribe también una versión inglesa, la
             traduce él mismo: <b>entanglement</b>.</p>
             <div class="callout key">La frase con la que la presenta ha quedado, y es más fuerte de como suele
             citarse: el entrelazamiento no es <i>un</i> rasgo, sino <b>el</b> rasgo característico de la mecánica
             cuántica — el que impone su ruptura total con las líneas de pensamiento clásicas. Y lo describe
             exactamente como lo has visto aquí: cuando dos sistemas interactúan, <b>sus funciones de onda ya no se
             pueden separar</b>.</div>
             <p>Durante treinta años la cuestión sigue siendo filosófica: EPR dice «la teoría es incompleta», Bohr
             dice que no, y no hay manera de decidirlo con un experimento. Luego, en <b>1964</b>, <b>John Bell</b>
             hace lo que nadie esperaba: convierte la disputa en una <b>desigualdad numérica</b> que se puede medir
             en el laboratorio. Desde los años ochenta los experimentos la violan, siempre — y el <b>Nobel de Física
             de 2022</b> va precisamente a <b>Aspect, Clauser y Zeilinger</b> por haberlo hecho de forma
             inatacable.</p>
             <div class="callout ok"><b>Curiosidad sobre la palabra «tensor».</b> No tiene nada que ver con la física
             cuántica: viene del latín <i>tendere</i>, y se introdujo a finales del siglo XIX (<b>Woldemar Voigt</b>)
             para describir las <b>tensiones dentro de un material</b> — cuánto tira un trozo de metal en cada
             dirección. El cálculo tensorial como herramienta general lo construyen dos italianos, <b>Gregorio
             Ricci-Curbastro</b> y su alumno <b>Tullio Levi-Civita</b>, entre 1890 y 1900. Einstein lo usará para la
             relatividad general, y los físicos cuánticos para juntar registros. Una vez más: una herramienta
             construida para un problema que resulta decisiva para otro.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego pon los dos cúbits a 45°: ¿qué cuatro amplitudes salen? ¿Y el cruce?
           <span class="muted">(0,5 cada una, y el cruce es cero: 0,25 − 0,25)</span></p>
        <p><b>2.</b> En el segundo juego, en el estado 3, encuentra los dos ángulos que lo reconstruyen. Sale con 30°
           y 60°: intenta ver por qué mirando los números.</p>
        <p><b>3.</b> En el estado 4 (0 ; 0,707 ; 0,707 ; 0), rehaz tú la demostración por absurdo: ¿cuál de las
           cuatro condiciones se contradice? <span class="muted">(esta vez son a₀b₀ = 0 y a₁b₁ = 0 las que no pueden
           convivir con las otras dos)</span></p>
        <p><b>4.</b> Si n cúbits tienen 2<sup>n</sup> amplitudes, ¿cuántas hacen falta para <b>tres</b> cúbits?
           Escribe la lista de configuraciones. <span class="muted">(ocho: 000, 001, 010, 011, 100, 101, 110,
           111)</span></p>
        <p class="mb0"><b>5.</b> De inventor: si el entrelazamiento solo se crea con puertas de dos cúbits, ¿cuántas
           CNOT hacen falta <b>como mínimo</b> para ligar entre sí n cúbits? <span class="muted">(pista: piensa en
           una cadena — y este número importa de verdad al diseñar un circuito para una máquina real, donde no todas
           las parejas de cúbits están conectadas físicamente)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Cómo se combinan las amplitudes de dos cúbits para describir la pareja?', options: ['se suman', 'se multiplica cada amplitud por cada amplitud: (a₀,a₁) ⊗ (b₀,b₁) = (a₀b₀, a₀b₁, a₁b₀, a₁b₁)', 'se ponen en fila una tras otra', 'se hace la media'], correct: 1,
      why: 'Es el producto tensorial, y la consecuencia es que las dimensiones se multiplican en vez de sumarse: 2 × 2 = 4. De ahí el 2^n para n cúbits.' },
    { q: '¿Qué significa que un estado de dos cúbits esté «entrelazado»?', options: ['que los dos cúbits intercambian señales', 'que el estado de la pareja NO se puede escribir como «el primero está así y el segundo así»', 'que los dos cúbits tienen la misma amplitud', 'que la medida es aleatoria'], correct: 1,
      why: 'Es una imposibilidad de factorización, no una comunicación. La descripción completa existe solo para la pareja entera: no hay descripción separada de las dos piezas.' },
    { q: '¿Cómo se reconoce un entrelazamiento con una sola cuenta?', options: ['sumando las amplitudes', 'calculando a₀₀·a₁₁ − a₀₁·a₁₀: si no es cero, el estado está entrelazado', 'mirando qué amplitud es mayor', 'contando cuántas amplitudes son nulas'], correct: 1,
      why: 'Es el mismo «cruce» que en el nivel M·4 decía si dos flechas eran independientes. Para un producto tensorial da siempre cero; si no da cero, ese producto no existe.' },
    { q: '¿Por qué el estado (|00⟩ + |11⟩)/√2 no se puede separar?', options: ['porque las amplitudes son irracionales', 'porque harían falta a₀, a₁, b₀, b₁ todos distintos de cero y a la vez a₀b₁ = 0: dos condiciones incompatibles', 'porque no está normalizado', 'porque tiene dos términos en vez de uno'], correct: 1,
      why: 'De las amplitudes de |00⟩ y |11⟩ se sigue que ninguno de los cuatro números es cero; pero las amplitudes de |01⟩ y |10⟩ exigen que algunos productos den cero. Contradicción: ninguna pareja de cúbits da ese estado.' },
    { q: '¿Pueden dos puertas separadas, una por cúbit, crear entrelazamiento?', options: ['sí, si son bastante fuertes', 'no: su efecto es un producto tensorial, que manda estados separables a estados separables', 'sí, si se aplican muchas veces', 'solo si son unitarias'], correct: 1,
      why: 'Hace falta una puerta que trate los dos cúbits juntos, como la CNOT: «si el primero es 1, dale la vuelta al segundo» es una frase que no se parte en dos frases separadas.' },
    { q: '¿Quién acuñó la palabra «entanglement», y cuándo?', options: ['Einstein, en 1905', 'Schrödinger en 1935, traduciendo el alemán Verschränkung', 'Bell, en 1964', 'Bohr, en los años veinte'], correct: 1,
      why: 'Schrödinger la introduce respondiendo al artículo EPR, en el mismo trabajo en el que aparece el gato. La llamó el rasgo característico de la mecánica cuántica, el que impone la ruptura con el pensamiento clásico.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> El producto tensorial multiplica las dimensiones en vez de sumarlas, y
          de ahí nace el 2<sup>n</sup>. Un producto tiene siempre cruce cero; así que todo estado con cruce distinto
          de cero <b>no es un producto</b> — y eso es lo que significa «entrelazado», demostrado en cuatro líneas en
          vez de contado. Y la puerta que enciende ese cruce es la CNOT.</div>`,
});
@endsection
