@php($description = 'Búsqueda sin estructura en √N intentos: el oráculo de fase, el difusor que refleja en torno a la media, el número óptimo de iteraciones y por qué pasarse hace daño.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { stepper } from '/js/core/formula.js';
import { groverLab } from '/js/widgets/algos.js';

const L = renderLesson({
  id: '11-grover',
  lead: `El problema más general que existe: <b>encontrar una aguja en un pajar</b> sin ninguna pista.
         Clásicamente tienes que mirar medio pajar. Grover (1996) lo consigue mirando su <b>raíz cuadrada</b>.
         Y lo bonito es que se ve suceder, barra a barra.`,

  steps: [
    {
      t: 'El problema y el límite clásico',
      html: `<p>Tienes N posibilidades. Solo una es la correcta, y la única manera de reconocerla es probarla
             (el oráculo dice solo <b>sí/no</b>, no da pistas).</p>
             <ul>
               <li><b>Clásico:</b> de media pruebas N/2 veces, en el peor caso N. No hay nada mejor: sin estructura,
                   no hay nada que aprovechar.</li>
               <li><b>Grover:</b> unos <b>√N</b> intentos. Con N = 1.000.000 → mil intentos en vez de medio millón.</li>
             </ul>
             <div class="callout"><b>No es un milagro, es una ganancia "cuadrática".</b> No convierte un problema imposible
             en uno fácil (eso lo hace Shor, en casos muy particulares). Pero vale para <b>cualquier</b> búsqueda sin estructura,
             y está demostrado que <b>mejor que esto no se puede hacer</b> ni siquiera cuánticamente (cota de Bennett–Bernstein–Brassard–Vazirani).</div>`,
    },
    {
      t: 'Los dos movimientos que se repiten',
      html: `<p>Grover parte de todas las posibilidades iguales (una H por cúbit) y luego repite dos movimientos:</p>
             <table class="table">
               <tr><th>Movimiento</th><th>Qué hace</th><th>Cómo se ve</th></tr>
               <tr><td><b>1. Oráculo</b></td><td>pone el signo menos <b>solo</b> en la amplitud correcta</td><td>una barra cambia de color (fase), la altura no</td></tr>
               <tr><td><b>2. Difusor</b></td><td>refleja todas las amplitudes <b>en torno a su media</b></td><td>la barra "por debajo de la media" sale disparada, las demás bajan un poco</td></tr>
             </table>
             <p>El difusor es la parte astuta. Aquí está por qué funciona, en una línea:</p>
             <div class="callout key">Tras el oráculo, la amplitud correcta es <b>negativa</b> y todas las demás positivas.
             La <b>media</b> queda por tanto ligeramente positiva. "Reflejar en torno a la media" significa:
             <code>nuevo = 2·media − viejo</code>. Para la amplitud negativa eso es un <b>salto enorme hacia arriba</b>;
             para las demás, un pequeño paso atrás.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'grover', title: 'Encuentra la aguja', text: 'lleva la probabilidad del elemento marcado por encima del 90%.', xp: 60 });
        el.appendChild(m.root);
        groverLab(el, { n: 4, onWin: () => m.complete() });
      },
    },
    {
      t: 'La cuenta paso a paso (N = 4, para poder hacerla a mano)',
      html: `<p>Con 2 cúbits hay 4 posibilidades. Digamos que la correcta es |11⟩.</p>`,
      mount: el => {
        stepper(el, [
          { h: 'Partida', html: 'Tras las Hadamard todas las amplitudes valen <b>0,5</b> (porque 0,5² = 0,25 = 1/4).<br><code>[0,5 · 0,5 · 0,5 · 0,5]</code> — probabilidad 25% cada una.' },
          { h: 'Oráculo', html: 'Signo menos en la correcta:<br><code>[0,5 · 0,5 · 0,5 · −0,5]</code><br>Las probabilidades siguen siendo todas del 25%: hasta ahora <b>no hemos aprendido nada medible</b>.' },
          { h: 'Media', html: 'media = (0,5 + 0,5 + 0,5 − 0,5)/4 = <b>0,25</b>' },
          { h: 'Reflexión: nuevo = 2·media − viejo', html: 'Para las tres incorrectas: 2(0,25) − 0,5 = <b>0</b><br>Para la correcta: 2(0,25) − (−0,5) = <b>1</b><br>Resultado: <code>[0 · 0 · 0 · 1]</code>' },
          { h: 'Resultado con N = 4', html: 'Probabilidad del resultado correcto: 1² = <b>100%</b>. ¡Una sola iteración, respuesta segura!<br>(Es un caso afortunado: para N = 4 el número óptimo de iteraciones es exactamente 1.)' },
          { h: '¿Y en general?', html: 'Cada iteración rota el estado un ángulo fijo hacia la respuesta. El número óptimo es<br><b>(π/4)·√N</b> iteraciones.<br>Con N = 16 → 3 iteraciones; con N = 1.000.000 → unas 785.' },
          { h: 'La trampa', html: 'Si sigues <b>más allá</b> del óptimo, la rotación continúa y <b>se pasa</b> del objetivo: la probabilidad <b>vuelve a bajar</b>. En el juego pulsa «+3 iteraciones» tras alcanzar el máximo y mira bajar la curva. Por eso en Grover hay que saber <b>cuándo parar</b>.' },
        ], { doneLabel: '¡Cuenta hecha!' });
      },
    },
    {
      t: 'Para qué sirve de verdad',
      html: `<p>Grover es genérico, así que se aplica allí donde haya una búsqueda "por fuerza bruta":</p>
             <ul>
               <li><b>Ciberseguridad:</b> una clave simétrica de 128 bits necesitaría 2¹²⁸ intentos clásicos
                   y "solo" 2⁶⁴ con Grover. Por eso la recomendación poscuántica es sencilla:
                   <b>duplicar la longitud de las claves</b> (AES-256 en vez de AES-128) y el problema queda resuelto.
                   Muy distinto del caso RSA, que Shor demuele (nivel 20).</li>
               <li><b>Optimización y búsqueda en bases de datos no indexadas</b>, con la advertencia práctica de que cargar los datos
                   en el ordenador cuántico puede costar más que la ganancia.</li>
               <li>Como <b>subrutina</b> dentro de algoritmos mayores (recuento cuántico, búsqueda del mínimo…).</li>
             </ul>
             <div class="callout warn"><b>La pregunta incómoda:</b> si el oráculo tiene que "reconocer" la respuesta correcta,
             ¿no será que en el fondo ya la conocemos? No: reconocer una solución es fácil, <b>encontrarla</b> es difícil.
             Es la misma diferencia que hay entre resolver un sudoku y comprobar que un sudoku resuelto está bien —
             y sobre esa diferencia se sostiene media informática teórica.</div>`,
    },
    {
      t: '💡 Pruébalo tú',
      html: `<div class="callout think">
        <p><b>1.</b> Con N = 16, ¿cuántas iteraciones hacen falta? Comprueba que la curva tenga el máximo donde dice la fórmula.</p>
        <p><b>2.</b> ¿Qué pasa si aplicas el oráculo <b>sin</b> el difusor, diez veces seguidas? ¿Por qué?</p>
        <p><b>3.</b> ¿Y si hubiera <b>dos</b> elementos correctos en vez de uno? ¿Cambia el número óptimo de iteraciones?
           <span class="muted">(sí: pasa a ser (π/4)·√(N/2))</span></p>
        <p class="mb0"><b>4.</b> Como inventor: el difusor refleja en torno a la media. ¿Se te ocurre
           una operación distinta que amplifique <b>dos</b> respuestas distintas de forma desigual?
           <i>(Es la rama de investigación de la "amplificación de amplitud" generalizada.)</i></p>
      </div>`,
    },
  ],

  quiz: [
    { q: '¿Cuántas iteraciones necesita Grover sobre N elementos?',
      options: ['unas N', 'unas √N', 'unas log N', 'siempre 1'], correct: 1,
      why: 'Unas (π/4)·√N. Con un millón de elementos: unas 785 iteraciones en vez de 500.000 intentos.' },
    { q: '¿Qué hace el difusor?',
      options: ['mide el estado', 'refleja las amplitudes en torno a su media', 'copia el cúbit correcto', 'añade un cúbit'], correct: 1,
      why: 'nuevo = 2·media − viejo. La amplitud que el oráculo ha vuelto negativa se hace muy grande; las demás bajan ligeramente.' },
    { q: '¿Qué pasa si se hacen demasiadas iteraciones?',
      options: ['la probabilidad sigue subiendo', 'la probabilidad vuelve a bajar', 'el circuito se bloquea', 'se pierde el entrelazamiento'], correct: 1,
      why: 'Es una rotación: pasado el objetivo se vuelve atrás. Hay que parar en el número óptimo.' },
    { q: '¿Qué contramedida basta contra Grover en criptografía simétrica?',
      options: ['cambiar de algoritmo', 'duplicar la longitud de la clave', 'nada, es irreparable', 'usar RSA'], correct: 1,
      why: 'Grover reduce a la mitad el exponente: AES-256 ofrece frente a un atacante cuántico la misma seguridad que AES-128 ofrece frente a uno clásico.' },
  ],

  outro: `<div class="callout ok"><b>Lo que te llevas a casa:</b> cuando no hay ninguna estructura que aprovechar,
          lo mejor que se puede hacer es amplificar: √N intentos en vez de N. Es una ganancia real pero
          <b>cuadrática</b> — y para el golpe gordo no basta.
          Nivel siguiente: ¿y si hubiera una estructura, pero <b>escondida en una repetición</b>?
          Ahí la ganancia se vuelve exponencial.</div>`,
});
@endsection
