@php($description = 'La fase de una onda: desfase, retardo temporal e interferencia entre dos ondas, con simulador interactivo.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { formula, stepper } from '/js/core/formula.js';
import { waveLab } from '/js/widgets/wave.js';
import { twoWaves } from '/js/widgets/twowaves.js';

const L = renderLesson({
  id: '14-fase',
  lead: `La fase ya te la has encontrado dos veces: como <b>longitud</b> en la esfera de Bloch (nivel 2) y como
         <b>dirección de la flecha</b> (nivel 8). Aquí la vemos en su tercera forma: el <b>desplazamiento de una onda</b>.
         Es siempre lo mismo — y está a punto de convertirse en el corazón de la transformada de Fourier.`,

  steps: [
    {
      t: 'Qué es la fase, en palabras llanísimas',
      html: `
        <p>Imagina a dos amigos en el columpio. Van a la misma velocidad y llegan a la misma altura:
        misma <b>frecuencia</b>, misma <b>amplitud</b>. Pero uno va <b>por delante</b> del otro: mientras uno sube, el otro baja.</p>
        <p>Esa diferencia se llama <b>fase</b>. La fase responde a una sola pregunta:</p>
        <div class="callout key"><b>«¿En qué punto de la vuelta estás?»</b><br>
        No "cómo de alto estás" (eso es la amplitud), no "cómo de rápido vas" (eso es la frecuencia).
        Solo: <b>en qué punto del ciclo</b>.</div>
        <p>Como un ciclo es una vuelta completa, la fase se mide en <b>grados</b> (0° … 360°) o en <b>radianes</b>
        (0 … 2π, donde 2π = una vuelta). Son dos unidades de medida para lo mismo, como kilómetros y millas.</p>
        <table class="table">
          <tr><th>Fase</th><th>En radianes</th><th>Dónde estás en la vuelta</th><th>Qué efecto tiene</th></tr>
          <tr><td class="mono">0°</td><td class="mono">0</td><td>en el punto de partida (arriba del todo)</td><td>onda "normal"</td></tr>
          <tr><td class="mono">90°</td><td class="mono">π/2</td><td>un cuarto de vuelta por delante</td><td>la onda se ha deslizado ¼ de ciclo</td></tr>
          <tr><td class="mono">180°</td><td class="mono">π</td><td>media vuelta por delante</td><td>la onda está <b>del revés</b></td></tr>
          <tr><td class="mono">270°</td><td class="mono">3π/2</td><td>tres cuartos de vuelta</td><td>deslizada ¾</td></tr>
          <tr><td class="mono">360°</td><td class="mono">2π</td><td>vuelta completa</td><td><b>idéntica a 0°</b>: has vuelto a la salida</td></tr>
        </table>`,
      mount: el => {
        waveLab(el, {
          A: 1, f: 1, phi: 0, showPeriod: false,
          title: 'Mueve SOLO la fase', subtitle: 'mira: la onda resbala, pero no cambia de forma',
        });
      },
    },

    {
      t: 'Fase = retardo en el tiempo (la fórmulita que las conecta)',
      html: `
        <p>Desplazar la fase equivale a hacer que la onda arranque un poco <b>antes</b> o un poco <b>después</b>.
        El vínculo entre las dos maneras de decirlo es sencillo:</p>
        <div class="formula">retardo Δt = <span class="hl-k">φ</span> / (360° · <span class="hl-n">f</span>)
        &nbsp;&nbsp;&nbsp;o bien&nbsp;&nbsp;&nbsp; <span class="hl-k">φ</span> = 360° · <span class="hl-n">f</span> · Δt</div>
        <p>Ejemplo con números de verdad: onda de <b>f = 2 Hz</b> (un ciclo dura 0,5 s) desfasada <b>90°</b>.
        Noventa grados son un cuarto de vuelta, así que el retardo es un cuarto de 0,5 s, es decir <b>0,125 s</b>.
        Con la fórmula: 90/(360·2) = 0,125 s. Cuadra.</p>
        <div class="callout"><b>Por qué es importante:</b> la fase no es una información "de más" y opcional.
        Es la información sobre <b>cuándo</b> pasan las cosas. Dos sonidos con las mismas frecuencias pero fases distintas
        pueden ser dos palabras distintas.</div>`,
      mount: el => {
        stepper(el, [
          { h: 'Ejercicio guiado', html: 'Onda a <b>f = 4 Hz</b>. ¿Cuánto dura un ciclo entero?' },
          { h: 'Paso 1', html: 'T = 1/f = 1/4 = <b>0,25 s</b>. Este es el tiempo de UNA vuelta completa, es decir, de 360°.' },
          { h: 'Paso 2', html: 'Si la desfaso <b>180°</b>, es decir <b>media</b> vuelta, el retardo es medio periodo: 0,25/2 = <b>0,125 s</b>.' },
          { h: 'Paso 3', html: 'Comprueba con la fórmula: Δt = φ/(360·f) = 180/(360·4) = 180/1440 = <b>0,125 s</b>. ✔' },
          { h: 'Moraleja', html: 'La fase es un <b>reloj</b>: 360° = una vuelta = un periodo. Convertir fase↔tiempo es solo una proporción.' },
        ]);
      },
    },

    {
      t: 'Dos ondas desfasadas: lo más importante del curso',
      html: `
        <p>Ahora lo gordo. Tomemos <b>dos</b> ondas idénticas y cambiemos solo la fase de una.
        Luego las <b>sumamos</b> (es lo que pasa físicamente cuando dos sonidos llegan juntos a tu oído,
        o dos ondas luminosas al mismo punto).</p>
        <ul>
          <li>Diferencia de fase <b>0°</b> → las dos se ayudan: la onda resultante es <b>el doble</b>. Es la <b>interferencia constructiva</b>.</li>
          <li>Diferencia de fase <b>180°</b> → una empuja hacia arriba mientras la otra empuja hacia abajo: resultado <b>cero</b>, silencio total.
              Es la <b>interferencia destructiva</b>.</li>
          <li>En medio → algo intermedio.</li>
        </ul>
        <p>En el panel de abajo están las <b>flechas</b>: cada onda se dibuja como una flecha tan larga como su amplitud
        e inclinada tanto como su fase. Sumar dos ondas = <b>pegar las dos flechas punta con cola</b>. Tenlo presente:
        es literalmente el mismo dibujo que usaremos para los cúbits.</p>`,
      mount: el => {
        const m = L.mission({ key: 'cancella', title: '¡Silencio!', text: 'encuentra la combinación que hace desaparecer del todo la suma (barra por debajo de 0,06).', xp: 45 });
        el.appendChild(m.root);
        twoWaves(el, {
          A1: 1, p1: 0, A2: 0.6, p2: 40,
          onChange: s => { if (s.mag < 0.06) m.complete(); },
        });
      },
    },

    {
      t: 'Por qué harán falta los números complejos (adelanto)',
      html: `
        <p>Para describir del todo una onda a una cierta frecuencia hacen falta <b>dos</b> números:
        <b>cómo de grande es</b> (amplitud) y <b>en qué punto de la vuelta está</b> (fase).</p>
        <p>Llevar dos números por separado es incómodo: cuando sumas dos ondas tienes que hacer cuentas de trigonometría pesadas.
        Pero si dibujas cada onda como una <b>flecha</b> — longitud = amplitud, inclinación = fase —
        entonces sumar dos ondas se vuelve trivial: <b>pegas las flechas</b>.</p>
        <div class="callout key">Un <b>número complejo</b> no es más que el nombre matemático de esa flecha.
        No es "imaginario" en el sentido de "falso": es una pareja (longitud, ángulo) escrita de forma cómoda.
        (Lo construiste en el nivel 8.)</div>
        <p class="dim">Curiosidad: en los auriculares con cancelación de ruido hay exactamente esto.
        El micrófono escucha el ruido, la electrónica genera la misma onda desfasada <b>180°</b>, y la suma da… silencio.
        Interferencia destructiva aplicada, vendida a 300 euros.</p>`,
    },

    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> En el widget de las dos ondas, pon A = 1 y B = 1 con diferencia de fase de 120°. ¿Cuánto vale la suma?
        (No es ni 2 ni 0: hay un valor preciso y hay un motivo geométrico.)</p>
        <p><b>2.</b> ¿Consigues hacer desaparecer la suma si las dos amplitudes son <b>distintas</b>? ¿Por qué?</p>
        <p><b>3.</b> Si tuvieras <b>tres</b> ondas iguales, ¿con qué fases harías que se cancelaran todas juntas?
        <span class="muted">(pista: piensa en tres flechas que cierran un triángulo)</span></p>
        <p class="mb0"><b>4.</b> Esta cancelación a tres es exactamente el truco que usará la QFT para hacer desaparecer
        las respuestas equivocadas. Guárdatelo.</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Dos ondas idénticas desfasadas 180° se suman. ¿Qué se obtiene?',
      options: ['Una onda doble', 'Cero (se cancelan)', 'Una onda con frecuencia doble', 'La misma onda de antes'],
      correct: 1,
      why: 'Media vuelta de desfase significa que una está del revés respecto a la otra: donde una sube la otra baja, y la suma es <b>cero</b>. Es la interferencia destructiva.' },
    { q: 'Una onda de 5 Hz se desfasa 90°. ¿Cuánto va "con retraso" en el tiempo?',
      options: ['0,05 s', '0,25 s', '0,5 s', '90 s'],
      correct: 0,
      why: 'T = 1/5 = 0,2 s. Noventa grados son un cuarto de vuelta: 0,2/4 = <b>0,05 s</b>. Con la fórmula: 90/(360·5) = 0,05 s.' },
    { q: '¿Por qué para describir una onda a una frecuencia dada hacen falta DOS números?',
      options: ['Porque hacen falta amplitud y fase', 'Porque hacen falta seno y coseno por separado', 'Porque el tiempo es bidimensional', 'No es verdad: basta con uno'],
      correct: 0,
      why: 'Amplitud (cómo de grande es) y fase (en qué punto del ciclo está). Dos números = una flecha = un <b>número complejo</b>. El hecho de que también se pueda escribir como "tanto de coseno + tanto de seno" es el mismo concepto visto desde otro ángulo.' },
  ],

  outro: `<div class="callout ok"><b>Lo que te llevas a casa:</b> la fase dice <b>en qué punto de la vuelta</b> estás;
          360° = una vuelta entera = un periodo; dos ondas en fase se suman, dos ondas en oposición se cancelan.
          Amplitud + fase = una flecha. Próximo nivel: cómo se construye una señal complicada sumando ondas simples.</div>`,
});
@endsection
