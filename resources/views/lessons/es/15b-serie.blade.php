@php($description = 'La serie geométrica aprendida jugando: trozos que se encogen y flechas que se cierran en círculo. Es la fórmula que hace nacer el pico de la transformada de Fourier y que sostiene la QFT, la estimación de fase y Shor.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { serieReale, serieFrecce } from '/js/widgets/serie.js';

const L = renderLesson({
  id: '15b-serie',
  lead: `Dentro de un nivel verás a la transformada de Fourier hacer algo que parece magia: en todas las frecuencias
         equivocadas la suma da <b>cero</b>, y en la correcta salta un <b>pico</b>. ¿Por qué cero, y no un número
         cualquiera? La respuesta es una sola fórmula, de hace cuatro siglos, y se juega en diez minutos. Aprenderla
         ahora significa llegar a Fourier sabiendo <b>por qué</b> funciona, en vez de verla funcionar.`,

  steps: [
    {
      t: 'Trozos que se encogen',
      html: `<p>Empieza con un trozo de longitud <b>1</b>. Luego añade un trozo que es <b>la mitad</b> del anterior. Luego
             otro que es la mitad de ese. Y así, para siempre.</p>
             <div class="formula">1 + ½ + ¼ + ⅛ + … = <span class="hl-n">2</span></div>
             <p>Infinitos trozos, y el total <b>nunca llega a 2</b>: solo se acerca. No es un truco, es lo que ves pasar
             en el juego: los trozos se hacen tan pequeños tan deprisa que el total choca contra un muro.</p>
             <div class="callout key">La regla general, para trozos que cada vez se multiplican por <b>r</b>
             (con r entre 0 y 1):
             <div class="formula" style="margin:8px 0 0">1 + r + r² + r³ + … = <span class="hl-n">1 / (1 − r)</span></div></div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'pezzi', title: 'Acierta dos totales', text: 'lleva el total a los objetivos pedidos moviendo la fracción y el número de trozos.', xp: 35 });
        el.appendChild(m.root);
        serieReale(el, { need: 2, onWin: () => m.complete() });
      },
      after: `<p>El juego enseña también la otra fórmula, la de un número <b>finito</b> de trozos:</p>
              <div class="formula">1 + r + … + r<sup>n−1</sup> = <span class="hl-n">(1 − rⁿ) / (1 − r)</span></div>
              <p>Vale siempre, no solo para r pequeñas. Y es esta — no la infinita — la que dentro de dos pasos hará todo
              el trabajo.</p>`,
    },

    {
      t: 'Los mismos trozos, pero girados',
      html: `<p>Ahora el salto. En vez de trozos que se <b>acortan</b>, tomemos flechas que <b>giran</b>: todas igual de
             largas, cada una rotada un paso fijo respecto a la anterior.</p>
             <p>Es exactamente la misma suma de antes — cada trozo se obtiene del anterior multiplicándolo siempre por lo
             mismo — solo que ese «lo mismo» ahora es una <b>rotación</b> en vez de una fracción.</p>
             <p>Y pasa algo que merece la pena mirar con calma:</p>
             <ul>
               <li>si el paso es <b>cero</b> (o una vuelta entera), todas las flechas apuntan en la misma dirección y se
                   suman: la suma es tan larga como el número de flechas. <b>Ese es el pico.</b></li>
               <li>si el paso es <b>una vuelta dividida entre el número de flechas</b> (o un múltiplo suyo), la cadena se
                   cierra sobre sí misma: vuelves al punto de partida y la suma es <b>cero exacto</b>.</li>
               <li>para todos los demás pasos la suma es un número intermedio, ni grande ni nulo.</li>
             </ul>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'catena', title: 'Cierra la cadena y luego alinéala', text: 'acierta 3 objetivos entre «suma cero» y «suma máxima».', xp: 45 });
        el.appendChild(m.root);
        serieFrecce(el, { need: 3, onWin: () => m.complete() });
      },
      after: `<div class="callout key">Fíjate bien en el caso «suma cero»: las flechas dibujan un <b>polígono cerrado</b>.
              Salir y volver exactamente al punto de partida es la razón por la que la suma es cero <b>exacto</b> y no
              «poco»: no es una aproximación, es geometría.</div>`,
    },

    {
      t: 'De aquí nace el pico',
      html: `<p>Juntemos las piezas. La transformada de Fourier, para cada frecuencia de prueba, hace <b>exactamente</b> lo
             que acabas de hacer con el cursor: gira cada dato un paso fijo y suma las flechas.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'La pregunta', html: 'Le pregunto a la señal: «¿contienes la frecuencia k?». Para responder, giro el dato número n un paso proporcional a <b>k·n</b> y lo sumo todo.' },
          { h: 'Si la frecuencia es equivocada', html: 'El paso de rotación es una vuelta dividida entre N (o un múltiplo): la cadena se cierra, la suma es <b>cero exacto</b>. La señal responde «no» de forma tajante, sin medias tintas.' },
          { h: 'Si la frecuencia es la correcta', html: 'Las rotaciones de la señal y las de la pregunta <b>se anulan entre sí</b>: el paso pasa a ser cero, todas las flechas apuntan igual y se suman. <b>Nace el pico.</b>' },
          { h: 'La cuenta, entera', html: 'La suma de las flechas vale <b>|sin(N·Δ/2) / sin(Δ/2)|</b>: es la fórmula (1 − rⁿ)/(1 − r) del primer juego, escrita con rotaciones. Vale N cuando Δ = 0 y cero cuando Δ es un múltiplo de una vuelta dividida entre N.' },
          { h: 'Por qué nos importa tanto', html: 'Porque es el mecanismo con el que el ordenador cuántico <b>lee</b>: la QFT hace interferir las amplitudes de modo que todas las respuestas equivocadas se cancelan y solo queda la buena. Misma fórmula, otro escenario.' },
        ], { doneLabel: '¡Claro!' });
      },
      after: `<div class="callout ok">De aquí en adelante, cada vez que veas aparecer un pico en un gráfico de Fourier — en
              la DFT, en la QFT, en la estimación de fase, en Shor — sabrás que debajo hay una cadena de flechas que se ha
              alineado, y muchas otras cadenas que se han cerrado.</div>`,
    },

    {
      t: 'De dónde viene',
      html: `<p>La pregunta «¿pueden infinitos trozos tener un total finito?» tiene dos mil quinientos años. La planteó
             <b>Zenón de Elea</b>, en el siglo V a.C., con la paradoja de Aquiles y la tortuga: para alcanzarla, Aquiles
             tiene que cubrir primero la mitad de la distancia, luego la mitad de lo que queda, luego otra mitad…
             infinitos pasos, así que — concluía Zenón — no la alcanza nunca.</p>
             <p>El juego que acabas de hacer es la respuesta: <b>½ + ¼ + ⅛ + … = 1</b>. Infinitos pasos, distancia
             finita, tiempo finito. La paradoja no está en la carrera: está en suponer que «infinitas cosas» tengan que
             dar «una cosa infinita».</p>
             <p><b>Arquímedes</b>, en el siglo III a.C., fue el primero en sumar una de verdad: en la <i>Cuadratura de la
             parábola</i> calcula 1 + ¼ + 1/16 + … = 4/3 y la usa para medir un área curva. No tenía límites — faltaban
             dos mil años — y lo resolvió por exhausción, demostrando que el total no puede ser ni mayor ni menor que
             4/3.</p>
             <div class="callout key">La misma fórmula, con una rotación en lugar de una fracción, es la que hace el pico
             de la transformada de Fourier. Dos mil años después, la misma cuenta.</div>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el primer juego pon la fracción a <b>0,9</b>: ¿dónde acaba el muro? ¿Y con 0,99? ¿Sabes decir por
           qué una fracción cercana a 1 hace enorme el total?</p>
        <p><b>2.</b> Con 8 flechas, ¿cuántos pasos distintos entre 1° y 359° dan suma cero? Pruébalos:
           <span class="muted">(son 7, y no es casualidad)</span></p>
        <p><b>3.</b> Con 4 flechas y paso 90°, ¿qué figura dibuja la cadena? ¿Y con 8 flechas y 45°?</p>
        <p class="mb0"><b>4.</b> Pregunta de inventor: si las flechas fueran <b>muchísimas</b> y el paso pequeñísimo, ¿qué
           figura dibujaría la cadena? <span class="muted">(pista: un círculo, y por eso la integral de Fourier se parece
           tanto a su versión discreta)</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Cuánto da 1 + ½ + ¼ + ⅛ + … (infinitos trozos)?', options: ['infinito', '2', '1,5', 'depende de cuántos trozos tomes'], correct: 1,
      why: 'Con r = ½ la suma infinita vale 1/(1 − ½) = 2. El total se acerca cada vez más sin superarlo nunca.' },
    { q: 'Ocho flechas de longitud 1, cada una girada 45° más que la anterior. ¿Cuánto mide la suma?', options: ['8', '4', '0', 'depende de la primera flecha'], correct: 2,
      why: '45° es una vuelta entera dividida entre 8: la cadena se cierra sobre sí misma y la suma es cero exacto. Esa cancelación es la que da picos nítidos en la transformada de Fourier.' },
    { q: '¿Cuándo es máxima la suma de las flechas?', options: ['cuando el paso es 180°', 'cuando el paso es cero o una vuelta entera', 'cuando hay muchas flechas', 'cuando el paso es aleatorio'], correct: 1,
      why: 'Con paso nulo todas las flechas apuntan igual y se suman: la longitud es igual al número de flechas. Es justo lo que ocurre en la frecuencia correcta.' },
    { q: '¿Por qué en la transformada de Fourier las frecuencias equivocadas dan cero y no un número pequeño cualquiera?', options: ['por los redondeos', 'porque la cadena de flechas se cierra, y cerrarse es una propiedad exacta', 'porque la señal está limpia', 'porque se descartan los valores bajos'], correct: 1,
      why: 'El cero no es una aproximación: es geometría. Las flechas a paso constante forman un polígono cerrado, y salir y volver al mismo punto significa suma nula.' },
    { q: 'La fórmula (1 − rⁿ)/(1 − r) sirve…', options: ['solo para las fracciones', 'tanto para los trozos que se acortan como para las flechas que giran', 'solo para los números enteros', 'solo en lo cuántico'], correct: 1,
      why: 'Es la misma suma: solo cambia qué es r. Una fracción encoge los trozos, una rotación los gira, y en el segundo caso la fórmula se convierte en el núcleo que produce los picos.' },
  ],

  outro: `<div class="callout ok"><b>Hecho.</b> Sumar muchas cosas que se multiplican siempre por el mismo número: si ese
          número es una fracción, el total choca contra un muro; si es una rotación, o se acumula todo o se anula todo.
          Ahora la transformada de Fourier está lista para entenderse, no solo para mirarse.</div>`,
});
@endsection
