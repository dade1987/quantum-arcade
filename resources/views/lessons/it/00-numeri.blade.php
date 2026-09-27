@php($description = 'Numeri negativi, doppi e metà, frazioni e percentuali, potenze di 2 e radice quadrata: le basi matematiche per l\'informatica quantistica, spiegate giocando.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { numberLine, percentLab, squareRootLab, powersLab } from '/js/widgets/basicmath.js';

const L = renderLesson({
  id: '00-numeri',
  lead: `Quattro giochi sulle basi: numeri negativi, frazioni e percentuali, quadrati e radici, potenze di 2.
         Ti serviranno in tutto il resto del corso.`,

  steps: [
    {
      t: 'Numeri sopra e sotto lo zero',
      html: `<p>La <b>linea dei numeri</b> ha lo zero in mezzo: i positivi a destra, i <b>negativi</b> a sinistra.</p>
             <p><b>Esempio:</b> un termometro. +5° e −5° sono entrambi a 5 gradi dallo zero, ma da parti opposte.</p>
             <p>Moltiplicare per <b>−1</b> cambia lato ma non la distanza dallo zero: 3 → −3, −7 → 7.</p>
             <p>Nel gioco hai cinque mosse: +1, −1, ×2 (doppio), ÷2 (metà), ×(−1) (cambia lato).
             Raggiungi il bersaglio con meno mosse possibili.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'linea', title: 'Tiro al bersaglio', text: 'raggiungi un bersaglio sulla linea dei numeri.', xp: 20 });
        el.appendChild(m.root);
        numberLine(el, { onWin: () => m.complete() });
      },
    },
    {
      t: 'Da 3/4 a 0,75 a 75%',
      html: `<p>Una <b>frazione</b> come 3/4 vuol dire: dividi in 4 parti uguali e prendine 3.</p>
             <p><b>Da frazione a decimale:</b> fai la divisione. 3/4 = 3 ÷ 4 = 0,75.<br>
             <i>Esempio:</i> 3 euro divisi fra 4 persone fanno 0,75 € a testa, cioè 75 centesimi.</p>
             <p><b>Da decimale a percentuale:</b> moltiplica per 100. 0,75 × 100 = 75 → <b>75%</b>.<br>
             "Percento" vuol dire "su 100": 75% = 75 parti su 100.</p>
             <p><i>Esempio:</i> una pizza tagliata in 4 fette. Ne mangi 3: 3/4 = 0,75 = 75% della pizza.</p>
             <table class="table">
               <tr><th>Frazione</th><th>Decimale</th><th>Percentuale</th><th>A parole</th></tr>
               <tr><td class="mono">1/2</td><td class="mono">0,5</td><td class="mono">50%</td><td>metà</td></tr>
               <tr><td class="mono">1/4</td><td class="mono">0,25</td><td class="mono">25%</td><td>un quarto</td></tr>
               <tr><td class="mono">3/4</td><td class="mono">0,75</td><td class="mono">75%</td><td>tre quarti</td></tr>
               <tr><td class="mono">1/1</td><td class="mono">1</td><td class="mono">100%</td><td>tutto</td></tr>
             </table>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'perc', title: 'Il pasticcere preciso', text: 'centra due bersagli diversi con il cursore.', xp: 20 });
        el.appendChild(m.root);
        percentLab(el, { onWin: () => m.complete() });
      },
    },
    {
      t: 'Quadrato e radice quadrata',
      html: `<p><b>Elevare al quadrato</b> vuol dire moltiplicare un numero per sé stesso: 3² = 3 × 3 = 9.</p>
             <p>La <b>radice quadrata</b> fa il contrario: cerchi il numero che, moltiplicato per sé stesso, dà quello di partenza.</p>
             <p><b>Come si calcola: per tentativi.</b></p>
             <ul>
               <li>√16: 3 × 3 = 9 è poco, 4 × 4 = 16 va bene → <b>√16 = 4</b>.</li>
               <li>√20: 4 × 4 = 16 è poco, 5 × 5 = 25 è troppo, quindi è fra 4 e 5. Provo 4,5 × 4,5 = 20,25: quasi. √20 ≈ 4,47.</li>
               <li>Su una calcolatrice basta il tasto <b>√</b>.</li>
             </ul>
             <p><i>Esempio:</i> una stanza quadrata di 16 m² ha il lato di 4 m, perché 4 × 4 = 16.</p>
             <div class="callout warn"><p><b>Perché 0,5 × 0,5 fa 0,25.</b> Moltiplicare per 0,5 vuol dire <b>prendere la metà</b>.
             Quindi 0,5 × 0,5 = la metà di 0,5 = <b>0,25</b>.</p>
             <ul>
               <li><i>Pizza:</i> metà di mezza pizza = un quarto di pizza.</li>
               <li><i>Soldi:</i> metà di 50 centesimi = 25 centesimi.</li>
             </ul>
             <p>In generale, moltiplicare per un numero minore di 1 vuol dire prenderne solo una parte, quindi il risultato diventa più piccolo.</p>
             <p><b>Come si fa il calcolo:</b> moltiplica senza virgole (5 × 5 = 25). Poi conta le cifre dopo la virgola
             nei due numeri (1 + 1 = 2) e mettine 2 anche nel risultato: <b>0,25</b>.<br>
             <i>Altro esempio:</i> 0,3 × 0,3 → 3 × 3 = 9 → due cifre dopo la virgola → <b>0,09</b>.</p></div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'radice', title: 'Il lato giusto', text: 'trova il lato che produce una certa area (cioè calcola una radice quadrata).', xp: 25 });
        el.appendChild(m.root);
        squareRootLab(el, { onWin: () => m.complete() });
      },
    },
    {
      t: 'Le potenze di 2',
      html: `<p><b>2^n</b> vuol dire: moltiplica 2 per sé stesso n volte. 2³ = 2 × 2 × 2 = 8.</p>
             <p>Ogni volta che n aumenta di 1, moltiplichi per 2 una volta in più, quindi il risultato raddoppia:</p>
             <table class="table">
               <tr><th>n</th><td class="mono">1</td><td class="mono">2</td><td class="mono">3</td><td class="mono">4</td><td class="mono">5</td><td class="mono">6</td><td class="mono">7</td><td class="mono">8</td><td class="mono">9</td><td class="mono">10</td></tr>
               <tr><th>2^n</th><td class="mono">2</td><td class="mono">4</td><td class="mono">8</td><td class="mono">16</td><td class="mono">32</td><td class="mono">64</td><td class="mono">128</td><td class="mono">256</td><td class="mono">512</td><td class="mono"><b>1.024</b></td></tr>
             </table>
             <p><b>n = 10 → circa mille:</b> con 10 raddoppi arrivi a 1.024, cioè circa 1.000.</p>
             <p><b>n = 20 → circa un milione:</b> altri 10 raddoppi moltiplicano ancora per 1.024, cioè circa per 1.000.
             Quindi 1.000 × 1.000 = <b>1.000.000</b>. Il valore esatto è 1.048.576.</p>
             <p><i>Esempio:</i> la leggenda della scacchiera. 1 chicco sulla prima casella, 2 sulla seconda, 4 sulla terza,
             raddoppiando ogni volta. Alla 64ª casella servirebbero più chicchi di quanti ne esistano sulla Terra.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'pow', title: 'Fino a un milione', text: 'porta il cursore a n = 20 e guarda quanti valori diventano.', xp: 20 });
        el.appendChild(m.root);
        powersLab(el, { onWin: () => m.complete() });
      },
    },
    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Nel gioco della linea: partendo da 1, qual è il minor numero di mosse per arrivare a −8?</p>
        <p><b>2.</b> Qual è il lato di un quadrato di area 0,49? E di area 1?</p>
        <p><b>3.</b> Quante volte devi raddoppiare 1 per superare 1.000? E per superare 1.000.000?</p>
        <p class="mb0"><b>4.</b> 0,3 × 0,3 è più grande o più piccolo di 0,3?</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Quanto fa 0,5 × 0,5?', options: ['1', '0,25', '0,5', '2,5'], correct: 1,
      why: 'Moltiplicare per 0,5 vuol dire prendere la metà: la metà di 0,5 è 0,25.' },
    { q: '3/4 corrisponde a quale percentuale?', options: ['34%', '43%', '75%', '30%'], correct: 2,
      why: '3 ÷ 4 = 0,75, e 0,75 × 100 = 75, cioè 75 su 100 = 75%.' },
    { q: 'Quanto fa 2⁵?', options: ['10', '25', '32', '64'], correct: 2,
      why: '2 × 2 × 2 × 2 × 2 = 32.' },
    { q: 'Cosa vuol dire moltiplicare un numero per −1?', options: ['dimezzarlo', 'annullarlo', 'mandarlo dalla parte opposta rispetto allo zero', 'elevarlo al quadrato'], correct: 2,
      why: 'Cambia il lato, non la distanza dallo zero: 5 diventa −5.' },
  ],

  outro: `<div class="callout ok"><b>Fatto.</b> Nel prossimo livello: le <b>coordinate</b> (dove sta un punto)
          e i <b>gradi</b> (di quanto è girato un oggetto).</div>`,
});
@endsection
