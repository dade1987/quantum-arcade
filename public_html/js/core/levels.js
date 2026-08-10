/* ============================================================
   MAPPA DEI LIVELLI — unica fonte di verità.

   ORDINE (curriculum a spirale, difficoltà crescente):
   0) basi matematiche          → per chi parte da zero
   A) il qubit SUBITO           → con ampiezze "con il segno" (+/−): niente
                                  numeri complessi, niente onde. Paga subito.
   B) frecce, fasi, algoritmi   → si scopre che il segno non basta: servono
                                  le frecce (numeri complessi). E si usano.
   C) onde e Fourier            → introdotte quando servono davvero, cioè
                                  appena prima della QFT (just-in-time).
   D) QFT, Shor, invenzione     → il cuore, e poi l'officina creativa.

   Principio: nessun attrezzo viene introdotto più di un livello prima
   del punto in cui serve, e ogni concetto torna almeno due volte
   (prima in forma semplice, poi in forma completa).
   ============================================================ */

export const PARTS = [
  {
    id: '0',
    title: 'Parte 0 — Le basi (per chi parte proprio da zero)',
    sub: 'Numeri, percentuali, coordinate, gradi, seno e coseno, probabilità. Per chi ha finito le medie. Facoltativa se le sai già.',
    color: 'green',
  },
  {
    id: 'A',
    title: 'Parte A — Il qubit, subito',
    sub: 'Sovrapposizione, misura, porte, entanglement, circuiti. Con ampiezze positive e negative: nessuna matematica difficile.',
    color: 'violet',
  },
  {
    id: 'B',
    title: 'Parte B — Frecce, fasi e primi algoritmi',
    sub: 'Il segno non basta più: arrivano le frecce (numeri complessi). E i primi algoritmi che battono il computer classico.',
    color: 'cyan',
  },
  {
    id: 'C',
    title: 'Parte C — Onde e Fourier (l\'attrezzo che ci manca)',
    sub: 'Ora che sappiamo cosa vogliamo fare, impariamo lo strumento: onde, frequenze, trasformata di Fourier.',
    color: 'amber',
  },
  {
    id: 'D',
    title: 'Parte D — Il cuore: QFT, Shor e invenzione',
    sub: 'Tutto si unisce. E alla fine si inventa il proprio algoritmo e si dà l\'esame.',
    color: 'pink',
  },
];

export const LEVELS = [
  // ---------- PARTE 0 — sempre aperta ----------
  { id: '00-numeri',  part: '0', n: '0·1', file: 'lezioni/00-numeri.html', open: true,
    title: 'Numeri: negativi, metà, doppi, quadrati',
    desc: 'Linea dei numeri, percentuali, potenze di 2 e radice quadrata. Tutto giocato.', xp: 60 },

  { id: '00-griglia', part: '0', n: '0·2', file: 'lezioni/00-griglia.html', open: true,
    title: 'Griglia, frecce e gradi',
    desc: 'Coordinate come in battaglia navale e il giro completo di 360°.', xp: 60 },

  { id: '00-seno',    part: '0', n: '0·3', file: 'lezioni/00-seno.html', open: true,
    title: 'Seno e coseno senza triangoli',
    desc: 'Le due ombre di un punto che gira. Il ponte fra i gradi e le onde.', xp: 70 },

  { id: '00-caso',    part: '0', n: '0·4', file: 'lezioni/00-caso.html', open: true,
    title: 'Il caso: monete, dadi, probabilità',
    desc: 'Lancia, conta, scopri che le percentuali si sistemano da sole.', xp: 60 },

  // ---------- PARTE A — il qubit subito ----------
  { id: '01-qubit',   part: 'A', n: 1, file: 'lezioni/01-qubit.html', open: true,
    title: 'Il qubit: cos\'è davvero',
    desc: 'Fotoni, filtri polaroid, ampiezze e la differenza vera con una moneta truccata.', xp: 110 },

  { id: '02-bloch',   part: 'A', n: 2, file: 'lezioni/02-bloch.html',
    title: 'La sfera di Bloch e la misura',
    desc: 'Ruota la sfera col mouse, misura, guarda il collasso.', xp: 100 },

  { id: '03-porte',   part: 'A', n: 3, file: 'lezioni/03-porte.html',
    title: 'Le porte: X, Z, H e le rotazioni',
    desc: 'Ogni porta è una rotazione. E H·Z·H = X è già mezzo algoritmo.', xp: 100 },

  { id: '04-due-qubit', part: 'A', n: 4, file: 'lezioni/04-due-qubit.html',
    title: 'Due qubit, CNOT ed entanglement',
    desc: 'Da 2 ampiezze a 4. Stati di Bell e correlazioni impossibili.', xp: 120 },

  { id: '05-circuiti', part: 'A', n: 5, file: 'lezioni/05-circuiti.html',
    title: 'Il laboratorio dei circuiti',
    desc: 'Sandbox: costruisci circuiti a 3 qubit, simula, misura, sperimenta.', xp: 110 },

  { id: '06-teletrasporto', part: 'A', n: 6, file: 'lezioni/06-teletrasporto.html',
    title: 'No-cloning, teletrasporto e dense coding',
    desc: 'Perché non puoi copiare un qubit, e cosa puoi fare invece.', xp: 120 },

  // ---------- PARTE B — frecce, fasi, primi algoritmi ----------
  { id: '07-interferenza', part: 'B', n: 7, file: 'lezioni/07-interferenza.html',
    title: 'Interferenza: quando le possibilità si cancellano',
    desc: 'Il meccanismo unico che sta sotto a ogni algoritmo quantistico.', xp: 100 },

  { id: '08-frecce', part: 'B', n: 8, file: 'lezioni/08-frecce.html',
    title: 'Le frecce: numeri complessi ed e^{iθ}',
    desc: 'Quando il "più o meno" non basta più: fasi intermedie e rotazioni.', xp: 120 },

  { id: '09-deutsch', part: 'B', n: 9, file: 'lezioni/09-deutsch.html',
    title: 'Oracoli e Deutsch–Jozsa',
    desc: 'Il primo algoritmo che batte il classico: 1 domanda invece di 2^{n−1}+1.', xp: 130 },

  { id: '10-bernstein', part: 'B', n: 10, file: 'lezioni/10-bernstein.html',
    title: 'Bernstein–Vazirani: la stringa segreta',
    desc: 'Indovina n bit segreti con una sola interrogazione.', xp: 110 },

  { id: '11-grover', part: 'B', n: 11, file: 'lezioni/11-grover.html',
    title: 'Grover: amplificare la risposta giusta',
    desc: 'Guarda le barre delle ampiezze crescere passo dopo passo (e poi ricalare!).', xp: 130 },

  { id: '12-simon', part: 'B', n: 12, file: 'lezioni/12-simon.html',
    title: 'Simon: il periodo nascosto',
    desc: 'Il primo vantaggio ESPONENZIALE dimostrato. E il ponte diretto verso Shor.', xp: 150 },

  // ---------- PARTE C — onde e Fourier, just-in-time ----------
  { id: '13-onde', part: 'C', n: 13, file: 'lezioni/13-onde.html',
    title: 'L\'onda: ampiezza, periodo, frequenza',
    desc: 'Ci serve per il passo successivo. Muovi i cursori e senti cosa cambia.', xp: 80 },

  { id: '14-fase', part: 'C', n: 14, file: 'lezioni/14-fase.html',
    title: 'La fase delle onde e i battimenti',
    desc: 'La stessa onda, spostata: dalla fase del qubit alla fase delle onde.', xp: 80 },

  { id: '15-somma-onde', part: 'C', n: 15, file: 'lezioni/15-somma-onde.html',
    title: 'Ogni segnale è una somma di onde',
    desc: 'Sfida: ricostruisci il segnale misterioso mescolando onde semplici.', xp: 90 },

  { id: '16-dft', part: 'C', n: 16, file: 'lezioni/16-dft.html',
    title: 'La DFT passo passo: il rilevatore di periodicità',
    desc: 'La formula smontata pezzo per pezzo, con le frecce che vedi ruotare.', xp: 140 },

  { id: '17-fft', part: 'C', n: 17, file: 'lezioni/17-fft.html',
    title: 'FFT: perché il computer ci mette N·log N',
    desc: 'Dividi et impera: da N² a N·log N, contato operazione per operazione.', xp: 80 },

  // ---------- PARTE D — il cuore ----------
  { id: '18-qft', part: 'D', n: 18, file: 'lezioni/18-qft.html',
    title: 'QFT: Fourier sulle ampiezze quantistiche',
    desc: 'Il cuore del corso: dalla DFT al circuito con Hadamard, rotazioni controllate e SWAP.', xp: 200 },

  { id: '19-qpe', part: 'D', n: 19, file: 'lezioni/19-qpe.html',
    title: 'Quantum Phase Estimation',
    desc: 'Leggere una fase nascosta come numero binario: la QFT usata al contrario.', xp: 150 },

  { id: '20-shor', part: 'D', n: 20, file: 'lezioni/20-shor.html', boss: true,
    title: 'BOSS — Shor: dal periodo ai fattori',
    desc: 'Fattorizza 15 e 21 con le tue mani: periodo, picchi, frazioni continue, MCD.', xp: 250 },

  { id: '21-rumore', part: 'D', n: 21, file: 'lezioni/21-rumore.html',
    title: 'Rumore, decoerenza e correzione d\'errore',
    desc: 'Perché non hai ancora un computer quantistico in tasca. E come si combatte.', xp: 130 },

  { id: '22-officina', part: 'D', n: 22, file: 'lezioni/22-officina.html', boss: true,
    title: 'OFFICINA — inventa il tuo algoritmo',
    desc: 'Sandbox creativa: monta blocchi, scegli una sfida, misura, batti il tuo record.', xp: 300 },

  { id: '23-glossario', part: 'D', n: 23, file: 'lezioni/23-glossario.html',
    title: 'Glossario e mappa completa',
    desc: 'Tutti i termini in una pagina, con il filo che li collega dall\'inizio alla fine.', xp: 120 },

  { id: '24-esame', part: 'D', n: 24, file: 'lezioni/24-esame.html', boss: true,
    title: 'ESAME FINALE — attestato di completamento',
    desc: '33 domande su tutto il corso. Dall\'80% in su generi il tuo attestato.', xp: 300 },
];

export const TOTAL_XP = LEVELS.reduce((s, l) => s + l.xp, 0);

/* Prerequisiti: ogni livello del percorso principale richiede la PADRONANZA
   del precedente. Parte 0 e livello 1 sono sempre aperti. */
const MAIN = LEVELS.filter(l => l.part !== '0');
LEVELS.forEach(l => { l.req = null; });
MAIN.forEach((l, i) => { if (i > 0 && !l.open) l.req = MAIN[i - 1].id; });

export function levelById(id) { return LEVELS.find(l => l.id === id) || null; }

export function neighbours(id) {
  const i = LEVELS.findIndex(l => l.id === id);
  return { prev: i > 0 ? LEVELS[i - 1] : null, next: i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null };
}

export const RANKS = [
  { xp: 0,    name: 'Curioso' },
  { xp: 200,  name: 'Domatore di qubit' },
  { xp: 500,  name: 'Signore delle frecce' },
  { xp: 900,  name: 'Cacciatore di interferenze' },
  { xp: 1400, name: 'Analista di Fourier' },
  { xp: 1900, name: 'Ingegnere di circuiti' },
  { xp: 2400, name: 'Cacciatore di periodi' },
  { xp: 2900, name: 'Quantum Wizard' },
  { xp: 3400, name: 'Inventore di algoritmi' },
];

export function rankFor(xp) {
  let r = RANKS[0];
  for (const c of RANKS) if (xp >= c.xp) r = c;
  return r;
}
