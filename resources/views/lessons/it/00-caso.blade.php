@php($description = 'Probabilità spiegata con monete e dadi: frequenze, percentuali, legge dei grandi numeri. La base per capire la misura quantistica.')

@extends('layouts.lesson')

@section('lesson')
import { renderLesson } from '/js/core/lesson.js';
import { diceLab } from '/js/widgets/basicmath.js';

const L = renderLesson({
  id: '00-caso',
  lead: `Monete e dadi: impariamo a dire quanto è probabile che succeda una cosa, e perché il caso, su tanti lanci, diventa prevedibile.`,

  steps: [
    {
      t: 'Probabilità = quante volte su quante',
      html: `<p>Lanci una moneta: due possibilità, testa o croce. Nessuna è favorita, quindi ognuna ha probabilità
             <b>1 su 2</b> = 1/2 = 0,5 = <b>50%</b> (le tre scritture del livello 0·1!).</p>
             <p>Lanci un dado: sei facce, ognuna <b>1 su 6</b> ≈ 0,167 ≈ <b>16,7%</b>.</p>
             <div class="callout key"><b>Regola che vale sempre:</b> sommando le probabilità di tutte le possibilità
             deve venire <b>1</b> (cioè 100%). Se ti viene di più o di meno, hai dimenticato un caso o ne hai contato uno due volte.</div>
             <p><b>Ma attenzione al malinteso più comune:</b> "50%" non vuol dire che su 10 lanci escono esattamente
             5 teste. Vuol dire che <b>più lanci fai</b>, più la proporzione si avvicina a metà. Provalo:</p>`,
      mount: (el, api) => {
        const m = api.mission({ key: 'lanci', title: 'Mille lanci', text: 'fai almeno 1000 lanci e guarda le barre sistemarsi sulla riga teorica.', xp: 30 });
        el.appendChild(m.root);
        diceLab(el, { onWin: () => m.complete() });
      },
      after: `<p class="dim small">Questo fenomeno si chiama <b>legge dei grandi numeri</b>: il caso, sui numeri grandi,
              diventa incredibilmente prevedibile. È il motivo per cui i casinò non falliscono mai.</p>`,
    },
    {
      t: 'Un po\' di conti facili',
      html: `<p><b>Probabilità di due cose insieme (indipendenti):</b> si <b>moltiplicano</b>.<br>
             Due teste di fila: 1/2 × 1/2 = 1/4 = 25%.<br>
             Tre teste di fila: 1/2 × 1/2 × 1/2 = 1/8 = 12,5%. <span class="muted">(ecco di nuovo le potenze di 2!)</span></p>
             <p><b>Probabilità di "questo oppure quello" (casi diversi):</b> si <b>sommano</b>.<br>
             Con un dado, "esce 1 oppure 6" = 1/6 + 1/6 = 2/6 = 33,3%.</p>
             <div class="callout">Con 3 monete i risultati possibili sono TTT, TTC, TCT, TCC, CTT, CTC, CCT, CCC (T = testa, C = croce): sono <b>8 = 2³</b>.
             Ogni moneta in più raddoppia i risultati.</div>`,
    },
    {
      t: '💡 Prova tu',
      html: `<div class="callout think">
        <p><b>1.</b> Con il dado, quanti lanci servono perché tutte le barre stiano entro l'1% dalla riga teorica? Prova.</p>
        <p><b>2.</b> Se lanci 10 monete, qual è la probabilità che escano <b>tutte</b> teste? <span class="muted">(1/2^10 = 1/1024)</span></p>
        <p class="mb0"><b>3.</b> Un amico dice: "sono uscite 5 croci di fila, adesso è più probabile che esca testa". Ha ragione?
           <span class="muted">(no: la moneta non ha memoria — è la "fallacia del giocatore")</span></p>
      </div>`,
    },
  ],

  quiz: [
    { q: 'Lanciando una moneta 10 volte, escono sempre esattamente 5 teste?',
      options: ['sì, sempre', 'no, ma più lanci fai più la proporzione si avvicina a metà', 'no, escono sempre più croci', 'dipende dalla moneta'], correct: 1,
      why: 'È la legge dei grandi numeri: su pochi lanci le percentuali ballano, su tanti si stabilizzano.' },
    { q: 'Probabilità di fare tre teste di fila?',
      options: ['1/2', '1/6', '1/8', '3/2'], correct: 2,
      why: 'Eventi indipendenti: si moltiplicano. 1/2 × 1/2 × 1/2 = 1/8 = 12,5%.' },
    { q: 'La somma delle probabilità di tutti i risultati possibili vale…',
      options: ['0', '1 (cioè 100%)', 'dipende', 'il numero di risultati'], correct: 1,
      why: 'Qualcosa deve pur succedere: la somma è sempre 1.' },
  ],

  outro: `<div class="callout ok"><b>Fatto!</b> Sai calcolare le probabilità di monete e dadi. Nel prossimo livello:
          l'<b>orologio dei numeri</b>, cioè contare a giri come le ore sull'orologio.</div>`,
});
@endsection
