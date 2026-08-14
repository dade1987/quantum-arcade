@php($description = 'Probabilidad explicada jugando: media y varianza, el error que baja como 1/√n (y por qué un decimal más cuesta cien veces las medidas), el teorema de Bayes con el test casi perfecto para una enfermedad rara, y el test de Bell — el del Nobel 2022 — con el muro del 75% contado a mano.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { mediaLab, bellLab } from '/js/widgets/probabilita.js';

const L = renderLesson({
  id: 'm7-probabilita',
  lead: `En el nivel 0·4 la probabilidad llegó como «lanza y cuenta». Aquí se convierte en una herramienta, y sirve
         para dos cosas que hasta ahora en el curso has tenido que dar por buenas: <b>por qué cada decimal más
         cuesta cien veces las medidas</b> — la línea que encarece los algoritmos variacionales — y <b>por qué el
         75% del desafío de los sobres es un muro y no una estimación</b>. Ese muro se cuenta a mano: las
         estrategias posibles son dieciséis. Y superarlo, en el laboratorio, valió el Nobel de Física de 2022.`,

  steps: [
    {
      t: 'Media, dispersión y la ley que las une',
      html: `<p>Una <b>variable aleatoria</b> es solo un número que no sabes de antemano: el resultado de un
             lanzamiento, la lectura de un cúbit. De ella se dicen dos cosas:</p>
             <ul>
               <li>la <b>media</b> (o valor esperado): dónde está el centro, es decir cuánto sale en promedio si
                   repites muchas veces;</li>
               <li>la <b>desviación típica</b> σ: cuánto se dispersan los valores alrededor de ese centro. Se
                   calcula promediando las <b>desviaciones al cuadrado</b> — la varianza — y luego la raíz, para
                   volver a las unidades de partida.</li>
             </ul>
             <p>Para una moneda que vale 1 con probabilidad p y 0 en otro caso, la desviación típica es
             <b>√(p·(1−p))</b>, y es máxima en p = 0,5: la situación más incierta posible es aquella en la que las
             dos caras están igualadas.</p>
             <div class="callout key">Y ahora la fórmula que lo decide todo. Si estimas la media haciendo <b>n</b>
             medidas, el error que debes esperar sobre la estimación es:
             <p class="mb0" style="margin-top:8px"><b>error ≈ σ / √n</b></p></div>
             <p>En el juego: lanza, mira cómo la curva azul de la media se acerca a la línea verde, y vigila la banda
             verde — es el error que esperas. Luego intenta bajar de los dos objetivos.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'media', title: 'Dos objetivos de precisión', text: 'baja por debajo de ambos umbrales de error.', xp: 45 });
        el.appendChild(m.root);
        mediaLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Habrás notado el esfuerzo. Pasar de un error de 0,05 a uno de 0,01 no cuesta cinco veces los
              lanzamientos: cuesta <b>veinticinco</b>. Y para un decimal más — de 0,01 a 0,001 — hacen falta
              <b>cien veces</b> más.</p>
              <div class="callout warn"><b>La raíz en el denominador es una mala noticia, y no se va.</b> No es una
              limitación de las máquinas de hoy ni un defecto del simulador: es estadística. Vale para las encuestas,
              para los experimentos de física y para los ordenadores cuánticos del futuro, que serán perfectos y
              tendrán exactamente este problema.</div>
              <p class="mb0">Por eso en el nivel 21·b, poniendo 50 tiradas en vez de 5000, el descenso del VQE
              zigzaguea: la pendiente medida es un promedio, y un promedio con pocas tiradas es ruido. La cuenta que
              allí era una frase, ahora sabes rehacerla.</p>`,
    },

    {
      t: 'Bayes: cuando un test casi perfecto no basta',
      html: `<p>Segunda herramienta, y hace falta cada vez que se lee un resultado ruidoso — es decir, siempre, en una
             máquina cuántica real. La pregunta es: <b>tengo un indicio, ¿cuánto debo cambiar de idea?</b></p>
             <p>El caso que rompe la intuición de todo el mundo es este. Algo afecta a <b>una persona de cada
             mil</b>. Hay un test que, cuando la cosa está, la encuentra <b>siempre</b>; y cuando no está, se
             equivoca solo el <b>5%</b> de las veces. El test dice que sí. ¿Qué probabilidad hay de que la cosa esté
             de verdad?</p>
             <div class="callout warn">Responde <b>antes</b> de seguir leyendo. Casi todo el mundo dice «el 95%», y
             también la mayoría de los médicos a los que se les ha planteado en estudios controlados.</div>`,
      mount: el => {
        stepper(el, [
          { h: 'No razones en porcentajes: cuenta personas', html: 'Toma <b>100.000 personas</b>. La cosa afecta a una de cada mil, así que la tienen <b>100</b>.' },
          { h: 'Los verdaderos positivos', html: 'El test las encuentra todas: <b>100 positivos correctos</b>.' },
          { h: 'Los falsos positivos', html: 'Quedan 99.900 personas que no la tienen. El test se equivoca en el 5% de ellas: <b>4.995 positivos equivocados</b>.' },
          { h: 'La cuenta', html: 'Los positivos totales son 100 + 4.995 = <b>5.095</b>. De estos, los verdaderos son 100. Así que la probabilidad de que alguien que ha dado positivo la tenga de verdad es 100 / 5.095 ≈ <b>2%</b>.' },
          { h: 'Por qué falla la intuición', html: 'Porque se mira solo lo bueno que es el test y se olvida <b>lo rara que es la cosa</b>. Si algo es rarísimo, los pocos errores sobre un montón enorme de sanos entierran a los verdaderos positivos. Se llama <b>olvido de la tasa base</b>.' },
          { h: 'La fórmula', html: 'Es el <b>teorema de Bayes</b>: probabilidad verdadera = (cuántos la tienen Y dan positivo) dividido por (todos los positivos). Nada más.' },
          { h: 'Para qué sirve aquí', html: 'En una máquina cuántica cada lectura es ruidosa. Cuando un detector de errores dice «hay un error», cuánto hay que creerle depende de <b>lo frecuentes que son los errores</b> — exactamente como arriba. La corrección de errores del nivel 21 es, por debajo, un razonamiento bayesiano repetido millones de veces por segundo.' },
        ], { doneLabel: '¡Ahora cuadra!' });
      },
      after: `<div class="callout ok"><b>Para llevarse:</b> un indicio no te da la respuesta, te dice <b>cuánto
              desplazar</b> lo que creías. Y el desplazamiento depende siempre de dos cosas: lo fiable que es el
              indicio, y lo plausible que era la cosa <b>antes</b>.</div>`,
    },

    {
      t: 'El juego de Bell: donde lo clásico choca',
      html: `<p>Ahora el experimento más importante de la física del siglo XX, reducido a un juego que se puede jugar
             a mano.</p>
             <p>Las reglas. <b>Ana</b> y <b>Bruno</b> están en dos habitaciones separadas y <b>no pueden
             comunicarse</b>. Un árbitro lanza una moneda para cada uno y le entrega a cada cual una pregunta, 0 o 1.
             Cada uno debe responder 0 o 1. Ganan si:</p>
             <div class="formula">las dos respuestas son <b>iguales</b> — salvo cuando <b>ambas</b> preguntas son 1, y entonces deben ser <b>distintas</b></div>
             <p>Pueden ponerse de acuerdo <b>antes</b> todo lo que quieran. Las cuatro preguntas salen con la misma
             probabilidad. ¿Cuántas ganan?</p>
             <div class="callout key">En el juego, el interruptor de arriba cambia el mundo: a la izquierda Ana y
             Bruno solo tienen un <b>acuerdo tomado antes</b>; a la derecha comparten una <b>pareja entrelazada</b> y
             eligen en qué dirección medirla. Mismas reglas, mismo tablero.</div>
             <p>Empieza por lo clásico: prueba todas las combinaciones que quieras y mira dónde te paras.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'bell', title: 'El muro, y luego más allá', text: 'toca el máximo clásico y luego supéralo con el entrelazamiento.', xp: 70 });
        el.appendChild(m.root);
        bellLab(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>Clásicamente te paras en el <b>75%</b>. Y aquí viene la parte que hace este experimento distinto de
              todos los demás: ese 75% <b>no es una estimación</b>, es una cuenta finita que puedes comprobar tú.</p>
              <div class="callout key"><b>La demostración, entera.</b> Si Ana y Bruno no pueden hablarse, la
              respuesta de Ana depende solo de <b>su</b> pregunta: así que su estrategia es «qué respondo si me
              preguntan 0» y «qué respondo si me preguntan 1». Son dos elecciones binarias: <b>cuatro</b> estrategias
              posibles. Lo mismo para Bruno. En total <b>4 × 4 = 16</b> estrategias, y son <b>todas</b>.
              <p class="mb0" style="margin-top:8px">Pruébalas: ocho ganan 3 preguntas de 4, las otras ocho ganan una
              de 4. Ninguna llega a cuatro de cuatro. Y ni siquiera echándolo a suertes se mejora, porque una
              estrategia aleatoria es un <b>promedio</b> de estas dieciséis, y el promedio de números todos ≤ 75% no
              puede superar el 75%.</p></div>
              <p>Ahora pasa a la derecha. Con una pareja entrelazada y las direcciones correctas — Ana a 0° y 45°,
              Bruno a 22,5° y −22,5° — se llega al <b>85,4%</b>. Que es exactamente <b>cos²(22,5°)</b>: no un número
              mágico, el coseno al cuadrado de un ángulo, el del nivel M·2.</p>`,
    },

    {
      t: 'Qué demuestra de verdad, y qué no',
      html: `<p>Este paso hay que darlo con cuidado, porque es el punto en el que la divulgación suele contar algo
             equivocado.</p>
             <div class="callout key"><b>Qué demuestra.</b> Si las respuestas estuvieran <b>ya decididas</b> antes de
             la medida — es decir, si cada partícula llevara consigo un papelito con el resultado de cada medida
             posible — entonces Ana y Bruno estarían usando una de las dieciséis estrategias, y el techo sería el
             75%. Superarlo en el laboratorio significa que <b>esos papelitos no existen</b>. Las respuestas no
             estaban decididas antes.</div>
             <div class="callout warn"><b>Qué NO demuestra.</b> No demuestra que los dos cúbits se manden señales, y
             no permite mandarlas. Mira las respuestas de Ana por separado: son 0 y 1 al azar, mitad y mitad,
             <b>haga lo que haga Bruno</b>. Ana no puede darse cuenta de nada. La rareza está solo en la
             <b>correlación entre las dos listas</b>, y para verla hay que compararlas — lo que exige hablarse, a la
             velocidad de la luz como todo el mundo. <b>El entrelazamiento no transmite información.</b></div>
             <p>Hay también un techo del otro lado, y el juego lo respeta: ni siquiera con la mecánica cuántica se
             llega al 100%. El máximo es precisamente cos²(22,5°) ≈ 85,36%, y se llama <b>límite de Tsirelson</b>.
             Los tests de este nivel lo comprueban barriendo toda la rejilla de ángulos: si el juego dejara ganar
             siempre, estaría enseñando que el entrelazamiento permite comunicar — lo cual es falso.</p>
             <div class="callout ok"><b>El resumen en una línea:</b> el mundo no es clásico, pero tampoco es mágico.
             Está exactamente entre el 75% y el 85,4%.</div>`,
    },

    {
      t: 'De dónde viene: un artículo escrito en el tiempo libre',
      html: `<p>En <b>1935</b> Einstein, Podolsky y Rosen plantean el problema (nivel M·6): la mecánica cuántica,
             dicen, tiene que estar incompleta, porque si no la realidad no sería «local». Bohr responde. Y ahí la
             cosa se queda <b>treinta años</b>, porque parece una cuestión de filosofía: nadie sabe imaginar un
             experimento que decida quién tiene razón.</p>
             <p>Luego llega <b>John Stewart Bell</b>, norirlandés. De oficio es físico de aceleradores en el
             <b>CERN</b> — diseña imanes, trabaja con haces de partículas. Los fundamentos de la cuántica los
             considera un interés personal, y trabaja en ellos fuera de horario, durante un año sabático. En
             <b>1964</b> publica un artículo de seis páginas en una revista recién nacida y destinada a cerrar tras
             unos pocos números.</p>
             <div class="callout key">En esas seis páginas está lo que nadie había visto: la disputa no es
             filosófica, es <b>numérica</b>. Si las respuestas están decididas de antemano, entonces cierta
             combinación de correlaciones no puede superar cierto número. La mecánica cuántica dice que lo supera.
             <b>Basta medirlo.</b></div>
             <p>Pasaron años hasta que alguien lo hizo de verdad. <b>John Clauser</b> en 1972 (con Stuart Freedman),
             <b>Alain Aspect</b> en 1982 con experimentos que cambiaban las direcciones <b>mientras</b> los fotones
             ya estaban en vuelo, <b>Anton Zeilinger</b> en los años noventa y dos mil cerrando los últimos
             resquicios. El resultado es siempre el mismo: el límite clásico se <b>supera</b>. En <b>2022</b> los
             tres reciben el <b>Nobel de Física</b>.</p>
             <p class="mb0">Bell no lo vio: murió en 1990, a los 62 años. Solía decir que esperaba ser refutado — el
             resultado «incómodo» le parecía demasiado extraño para ser la última palabra. No lo fue: ganó él, contra
             sus propias esperanzas.</p>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego pon la moneda a 0,5 (el caso más incierto) y luego a 0,9. Con el mismo número
           de lanzamientos, ¿cuál da una estimación más precisa? <span class="muted">(σ = √(p(1−p)) es más pequeña
           cuando p está cerca de los extremos)</span></p>
        <p><b>2.</b> ¿Cuántos lanzamientos hacen falta para un error de 0,001 con una moneda justa?
           <span class="muted">(σ = 0,5, así que (0,5/0,001)² = 250.000)</span></p>
        <p><b>3.</b> Rehaz la cuenta de Bayes cambiando la prevalencia: si la cosa afecta a una persona de cada diez
           en vez de una de cada mil, ¿cuánto vale la probabilidad tras un test positivo?
           <span class="muted">(alrededor del 69%: el mismo test, un mundo de diferencia)</span></p>
        <p><b>4.</b> En el juego de Bell, en modo clásico, encuentra <b>dos</b> estrategias distintas que lleguen las
           dos al 75%. Luego cuenta cuántas hay en total. <span class="muted">(ocho de dieciséis)</span></p>
        <p class="mb0"><b>5.</b> De inventor: en modo cuántico pon los cuatro ángulos iguales. ¿Qué porcentaje sale?
           <span class="muted">(75%: la pareja entrelazada por sí sola no basta, hacen falta direcciones
           <b>distintas</b> — el entrelazamiento es la materia prima, la elección de las medidas es la receta)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Si haces n medidas, ¿cómo baja el error sobre la media?', options: ['como 1/n', 'como σ/√n', 'como σ·n', 'no baja'], correct: 1,
      why: 'Para reducir el error a la mitad hacen falta cuatro veces las medidas; para un decimal más, cien veces. Por eso los algoritmos variacionales cuestan tanto — y vale también para máquinas perfectas.' },
    { q: 'Un test encuentra siempre algo que afecta a una persona de cada mil, y da falso positivo el 5% de las veces. Das positivo: ¿qué probabilidad hay de que la tengas?', options: ['alrededor del 95%', 'alrededor del 2%', 'alrededor del 50%', 'alrededor del 5%'], correct: 1,
      why: 'Sobre 100.000 personas: 100 verdaderos positivos frente a 4.995 falsos. 100 de 5.095 es aproximadamente el 2%. Cuando algo es raro, los pocos errores sobre muchísimos sanos entierran a los verdaderos positivos.' },
    { q: 'En el juego de Bell, ¿cuántas estrategias clásicas existen en total?', options: ['infinitas', 'dieciséis, porque cada uno de los dos debe decidir qué responder a dos preguntas', 'cuatro', 'dos'], correct: 1,
      why: 'La respuesta de Ana depende solo de su pregunta: cuatro estrategias posibles. Lo mismo para Bruno. Cuatro por cuatro son dieciséis — y se pueden probar todas a mano.' },
    { q: '¿Por qué el 75% es un muro y no una estimación?', options: ['porque es el promedio de muchas pruebas', 'porque se puede comprobar sobre las dieciséis estrategias posibles, y ninguna lo hace mejor', 'porque lo dice la mecánica cuántica', 'porque el juego está trucado'], correct: 1,
      why: 'Es una cuenta finita y exhaustiva. Y ni echándolo a suertes se mejora, porque un promedio de números todos ≤ 75% no puede superar el 75%.' },
    { q: 'Superar el 75% con una pareja entrelazada demuestra que...', options: ['los dos cúbits se mandan señales', 'las respuestas no estaban ya decididas antes de la medida', 'la información viaja más rápido que la luz', 'la mecánica cuántica es incompleta'], correct: 1,
      why: 'Si cada partícula llevara consigo el resultado de cada medida posible, se caería en una de las dieciséis estrategias y el techo sería el 75%. Superarlo descarta esa descripción — pero no permite transmitir nada: las respuestas de Ana, por sí solas, siguen siendo aleatorias.' },
    { q: '¿Con el entrelazamiento se puede llegar al 100%?', options: ['sí, con los ángulos adecuados', 'no: el máximo es cos²(22,5°) ≈ 85,4%, el límite de Tsirelson', 'sí, pero solo con más de dos cúbits', 'depende del ruido'], correct: 1,
      why: 'Hay un techo también del lado cuántico. Si no lo hubiera, el entrelazamiento permitiría comunicar — cosa que no hace: las respuestas de cada uno, tomadas por separado, son aleatorias haga lo que haga el otro.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> El error sobre una media baja como 1/√n, y esa raíz es la cuenta que
          encarece todos los algoritmos cuánticos de hoy. Bayes dice cuánto desplazar lo que creías, y recuerda que
          un test casi perfecto sobre algo rarísimo no basta. Y el juego de Bell pone un número bajo la frase «el
          mundo no es clásico»: dieciséis estrategias, techo en el 75%, y una pareja entrelazada que llega al 85,4%.
          Ninguna magia — pero tampoco nada clásico.</div>`,
});
@endsection
