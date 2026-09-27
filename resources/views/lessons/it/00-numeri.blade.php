@php($description = 'Numeri negativi, frazioni e percentuali, quadrato e radice, potenze di 2: le basi matematiche per l\'informatica quantistica, spiegate giocando.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { numberLine, percentLab, squareRootLab, powersLab } from '/js/widgets/basicmath.js';

const L = renderLesson({
  id: '00-numeri',
  lead: `Qui ripassiamo quattro cose sui numeri. Sono le uniche che servono per il resto del corso.
         Ogni cosa ha un piccolo gioco. Niente di nuovo: sono cose delle medie.`,

  steps: [
    {
      t: 'I numeri negativi',
      html: `<p>Immagina una strada dritta. In mezzo c'è lo <b>0</b>.</p>
             <p>A destra ci sono i numeri <b>positivi</b>: 1, 2, 3…<br>
             A sinistra ci sono i numeri <b>negativi</b>: −1, −2, −3…</p>
             <p>Esempio: −3 e 3 sono lontani dallo 0 allo stesso modo. Solo che stanno <b>da parti opposte</b>.</p>
             <p>Una mossa ti porta dall'altra parte: <b>moltiplicare per −1</b>.<br>
             3 × (−1) = −3. &nbsp; −3 × (−1) = 3. La distanza dallo 0 resta uguale. Cambia solo il lato.</p>
             <p>Nel gioco hai queste mosse: <b>+1</b>, <b>−1</b>, <b>×2</b> (doppio), <b>÷2</b> (metà) e
             <b>×(−1)</b> (cambia lato). Porta il razzo sul bersaglio.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'linea', title: 'Tiro al bersaglio', text: 'porta il razzo sul bersaglio.', xp: 20 });
        el.appendChild(m.root);
        numberLine(el, { onWin: () => m.complete() });
      },
      after: `<div class="callout key"><b>Da ricordare:</b> ×(−1) vuol dire "vai dall'altra parte dello 0".</div>`,
    },
    {
      t: 'Metà, 0,5 e 50% sono la stessa cosa',
      html: `<p>Prendi una pizza e tagliala in 4 fette uguali. Ne mangi 3.</p>
             <p>Hai mangiato <b>3/4</b> della pizza. Si può scrivere in tre modi:</p>
             <ul>
               <li>come <b>frazione</b>: 3/4</li>
               <li>come <b>numero con la virgola</b>: 0,75</li>
               <li>come <b>percentuale</b>: 75%</li>
             </ul>
             <p>Sono tre modi di dire <b>la stessa quantità</b>.</p>
             <table class="table">
               <tr><th>Frazione</th><th>Con la virgola</th><th>Percentuale</th><th>A parole</th></tr>
               <tr><td class="mono">1/2</td><td class="mono">0,5</td><td class="mono">50%</td><td>metà</td></tr>
               <tr><td class="mono">1/4</td><td class="mono">0,25</td><td class="mono">25%</td><td>un quarto</td></tr>
               <tr><td class="mono">3/4</td><td class="mono">0,75</td><td class="mono">75%</td><td>tre quarti</td></tr>
               <tr><td class="mono">1/1</td><td class="mono">1</td><td class="mono">100%</td><td>tutto</td></tr>
             </table>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'perc', title: 'Il bicchiere giusto', text: 'riempi il bicchiere fino alla riga, per tre volte.', xp: 20 });
        el.appendChild(m.root);
        percentLab(el, { onWin: () => m.complete() });
      },
      after: `<div class="callout key"><b>Da ricordare:</b> 1 vuol dire "tutto", cioè 100%. 0,5 vuol dire "metà", cioè 50%.</div>`,
    },
    {
      t: 'Il quadrato e la radice quadrata',
      html: `<p><b>Quadrato</b> di un numero = il numero moltiplicato per sé stesso.<br>
             Esempio: il quadrato di 3 è 3 × 3 = <b>9</b>. Si scrive 3² = 9.</p>
             <p><b>Radice quadrata</b> = la domanda al contrario: "quale numero, moltiplicato per sé stesso, fa 9?".<br>
             Risposta: 3. Si scrive √9 = 3.</p>
             <p>Pensa a un quadrato disegnato: il <b>lato</b> è il numero, l'<b>area</b> è il suo quadrato.</p>
             <div class="callout warn"><b>Attenzione, sembra strano:</b> se il numero è più piccolo di 1, il suo quadrato
             è <b>ancora più piccolo</b>.<br>
             Esempio: 0,5 × 0,5 = 0,25. Metà di metà è un quarto.</div>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'radice', title: 'Il lato giusto', text: 'trova il lato del quadrato quando conosci l\'area.', xp: 25 });
        el.appendChild(m.root);
        squareRootLab(el, { onWin: () => m.complete() });
      },
      after: `<div class="callout key"><b>Da ricordare:</b> quadrato = numero × numero. Radice = il numero di partenza.</div>`,
    },
    {
      t: 'Le potenze di 2: raddoppiare tante volte',
      html: `<p>Parti da 1 e raddoppia: 1, 2, 4, 8, 16, 32…</p>
             <p>Sembra poco. Ma dopo 10 raddoppi sei già a <b>1.024</b>. Dopo 20 raddoppi sei a più di <b>un milione</b>.</p>
             <p>"Raddoppiare 3 volte" si scrive <b>2³</b> e vuol dire 2 × 2 × 2 = 8.<br>
             Il numerino in alto dice quante volte moltiplichi per 2.</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'pow', title: 'Fino a un milione', text: 'porta il cursore a 20 raddoppi.', xp: 20 });
        el.appendChild(m.root);
        powersLab(el, { onWin: () => m.complete() });
      },
      after: `<div class="callout key"><b>Da ricordare:</b> ogni raddoppio in più fa crescere il numero tantissimo.
              Questa idea tornerà spesso nel corso.</div>`,
    },
    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Quanto fa 5 × (−1)? E −5 × (−1)?</p>
        <p><b>2.</b> Scrivi 1/4 come percentuale.</p>
        <p><b>3.</b> Qual è la radice quadrata di 16? E di 0,25?</p>
        <p class="mb0"><b>4.</b> Quanto fa 2⁴, cioè 2 × 2 × 2 × 2?</p>
        <p class="muted mb0">Soluzioni: 1) −5 e 5 · 2) 25% · 3) 4 e 0,5 · 4) 16</p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Quanto fa 0,5 × 0,5?', options: ['1', '0,25', '0,5', '2,5'], correct: 1,
      why: 'Metà di metà è un quarto: 0,25. Un numero più piccolo di 1, moltiplicato per sé stesso, diventa ancora più piccolo.' },
    { q: '3/4 a quale percentuale corrisponde?', options: ['34%', '43%', '75%', '30%'], correct: 2,
      why: '3 diviso 4 fa 0,75, cioè 75 su 100: 75%.' },
    { q: 'Quanto fa 2³?', options: ['6', '8', '9', '23'], correct: 1,
      why: '2³ vuol dire 2 × 2 × 2 = 8.' },
    { q: 'Cosa succede se moltiplichi un numero per −1?', options: ['diventa la metà', 'diventa 0', 'va dall\'altra parte dello 0', 'diventa il suo quadrato'], correct: 2,
      why: 'La distanza dallo 0 resta uguale. Cambia solo il lato: 4 diventa −4.' },
  ],

  outro: `<div class="callout ok"><b>Fatto!</b> Sai usare numeri negativi, percentuali, quadrati, radici e raddoppi.
          Nel prossimo livello impari a dire <b>dove sta un punto</b> (le coordinate) e <b>quanto è girata una freccia</b> (i gradi).</div>`,
});
@endsection
