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

   LINGUE: l'`id` è lo stesso in tutte le lingue — è la chiave con cui il
   progresso vive sul server, quindi chi ricomincia il corso in inglese
   ritrova i livelli che aveva già superato in italiano. Cambiano solo
   l'indirizzo del file (SLUG) e i testi (t()).
   ============================================================ */

import { t, LOCALE, LESSON_DIR } from './i18n.js';

/* Indirizzi tradotti. In italiano lo slug è l'id stesso: la voce qui sotto
   serve solo alle altre lingue. */
const SLUG = {
  '00-numeri': { en: '00-numbers', es: '00-numeros' },
  '00-griglia': { en: '00-grid', es: '00-cuadricula' },
  '00-seno': { en: '00-sine', es: '00-seno' },
  '00-caso': { en: '00-chance', es: '00-azar' },
  '01-qubit': { en: '01-qubit', es: '01-qubit' },
  '02-bloch': { en: '02-bloch', es: '02-bloch' },
  '03-porte': { en: '03-gates', es: '03-puertas' },
  '04-due-qubit': { en: '04-two-qubits', es: '04-dos-qubits' },
  '05-circuiti': { en: '05-circuits', es: '05-circuitos' },
  '06-teletrasporto': { en: '06-teleportation', es: '06-teletransporte' },
  '07-interferenza': { en: '07-interference', es: '07-interferencia' },
  '08-frecce': { en: '08-arrows', es: '08-flechas' },
  '09-deutsch': { en: '09-deutsch', es: '09-deutsch' },
  '10-bernstein': { en: '10-bernstein', es: '10-bernstein' },
  '11-grover': { en: '11-grover', es: '11-grover' },
  '12-simon': { en: '12-simon', es: '12-simon' },
  '13-onde': { en: '13-waves', es: '13-ondas' },
  '14-fase': { en: '14-phase', es: '14-fase' },
  '15-somma-onde': { en: '15-wave-sum', es: '15-suma-de-ondas' },
  '16-dft': { en: '16-dft', es: '16-dft' },
  '17-fft': { en: '17-fft', es: '17-fft' },
  '18-qft': { en: '18-qft', es: '18-qft' },
  '19-qpe': { en: '19-qpe', es: '19-qpe' },
  '20-shor': { en: '20-shor', es: '20-shor' },
  '21-rumore': { en: '21-noise', es: '21-ruido' },
  '22-officina': { en: '22-workshop', es: '22-taller' },
  '23-glossario': { en: '23-glossary', es: '23-glosario' },
  '24-esame': { en: '24-exam', es: '24-examen' },
};

/** Nome del file di un livello nella lingua data, senza estensione. */
export function slugOf(id, locale = LOCALE) {
  if (locale === 'it') return id;
  return (SLUG[id] && SLUG[id][locale]) || id;
}

export const PARTS = [
  {
    id: '0',
    title: t('Parte 0 — Le basi (per chi parte proprio da zero)'),
    sub: t('Numeri, percentuali, coordinate, gradi, seno e coseno, probabilità. Per chi ha finito le medie. Facoltativa se le sai già.'),
    color: 'green',
  },
  {
    id: 'A',
    title: t('Parte A — Il qubit, subito'),
    sub: t('Sovrapposizione, misura, porte, entanglement, circuiti. Con ampiezze positive e negative: nessuna matematica difficile.'),
    color: 'violet',
  },
  {
    id: 'B',
    title: t('Parte B — Frecce, fasi e primi algoritmi'),
    sub: t('Il segno non basta più: arrivano le frecce (numeri complessi). E i primi algoritmi che battono il computer classico.'),
    color: 'cyan',
  },
  {
    id: 'C',
    title: t('Parte C — Onde e Fourier (l\'attrezzo che ci manca)'),
    sub: t('Ora che sappiamo cosa vogliamo fare, impariamo lo strumento: onde, frequenze, trasformata di Fourier.'),
    color: 'amber',
  },
  {
    id: 'D',
    title: t('Parte D — Il cuore: QFT, Shor e invenzione'),
    sub: t('Tutto si unisce. E alla fine si inventa il proprio algoritmo e si dà l\'esame.'),
    color: 'pink',
  },
];

export const LEVELS = [
  // ---------- PARTE 0 — sempre aperta ----------
  { id: '00-numeri',  part: '0', n: '0·1', open: true,
    title: t('Numeri: negativi, metà, doppi, quadrati'),
    desc: t('Linea dei numeri, percentuali, potenze di 2 e radice quadrata. Tutto giocato.'), xp: 60 },

  { id: '00-griglia', part: '0', n: '0·2', open: true,
    title: t('Griglia, frecce e gradi'),
    desc: t('Coordinate come in battaglia navale e il giro completo di 360°.'), xp: 60 },

  { id: '00-seno',    part: '0', n: '0·3', open: true,
    title: t('Seno e coseno senza triangoli'),
    desc: t('Le due ombre di un punto che gira. Il ponte fra i gradi e le onde.'), xp: 70 },

  { id: '00-caso',    part: '0', n: '0·4', open: true,
    title: t('Il caso: monete, dadi, probabilità'),
    desc: t('Lancia, conta, scopri che le percentuali si sistemano da sole.'), xp: 60 },

  // ---------- PARTE A — il qubit subito ----------
  { id: '01-qubit',   part: 'A', n: 1, open: true,
    title: t('Il qubit: cos\'è davvero'),
    desc: t('Fotoni, filtri polaroid, ampiezze e la differenza vera con una moneta truccata.'), xp: 110 },

  { id: '02-bloch',   part: 'A', n: 2,
    title: t('La sfera di Bloch e la misura'),
    desc: t('Ruota la sfera col mouse, misura, guarda il collasso.'), xp: 100 },

  { id: '03-porte',   part: 'A', n: 3,
    title: t('Le porte: X, Z, H e le rotazioni'),
    desc: t('Ogni porta è una rotazione. E H·Z·H = X è già mezzo algoritmo.'), xp: 100 },

  { id: '04-due-qubit', part: 'A', n: 4,
    title: t('Due qubit, CNOT ed entanglement'),
    desc: t('Da 2 ampiezze a 4. Stati di Bell e correlazioni impossibili.'), xp: 120 },

  { id: '05-circuiti', part: 'A', n: 5,
    title: t('Il laboratorio dei circuiti'),
    desc: t('Sandbox: costruisci circuiti a 3 qubit, simula, misura, sperimenta.'), xp: 110 },

  { id: '06-teletrasporto', part: 'A', n: 6,
    title: t('No-cloning, teletrasporto e dense coding'),
    desc: t('Perché non puoi copiare un qubit, e cosa puoi fare invece.'), xp: 120 },

  // ---------- PARTE B — frecce, fasi, primi algoritmi ----------
  { id: '07-interferenza', part: 'B', n: 7,
    title: t('Interferenza: quando le possibilità si cancellano'),
    desc: t('Il meccanismo unico che sta sotto a ogni algoritmo quantistico.'), xp: 100 },

  { id: '08-frecce', part: 'B', n: 8,
    title: t('Le frecce: numeri complessi ed e^{iθ}'),
    desc: t('Quando il "più o meno" non basta più: fasi intermedie e rotazioni.'), xp: 120 },

  { id: '09-deutsch', part: 'B', n: 9,
    title: t('Oracoli e Deutsch–Jozsa'),
    desc: t('Il primo algoritmo che batte il classico: 1 domanda invece di 2^{n−1}+1.'), xp: 130 },

  { id: '10-bernstein', part: 'B', n: 10,
    title: t('Bernstein–Vazirani: la stringa segreta'),
    desc: t('Indovina n bit segreti con una sola interrogazione.'), xp: 110 },

  { id: '11-grover', part: 'B', n: 11,
    title: t('Grover: amplificare la risposta giusta'),
    desc: t('Guarda le barre delle ampiezze crescere passo dopo passo (e poi ricalare!).'), xp: 130 },

  { id: '12-simon', part: 'B', n: 12,
    title: t('Simon: il periodo nascosto'),
    desc: t('Il primo vantaggio ESPONENZIALE dimostrato. E il ponte diretto verso Shor.'), xp: 150 },

  // ---------- PARTE C — onde e Fourier, just-in-time ----------
  { id: '13-onde', part: 'C', n: 13,
    title: t('L\'onda: ampiezza, periodo, frequenza'),
    desc: t('Ci serve per il passo successivo. Muovi i cursori e senti cosa cambia.'), xp: 80 },

  { id: '14-fase', part: 'C', n: 14,
    title: t('La fase delle onde e i battimenti'),
    desc: t('La stessa onda, spostata: dalla fase del qubit alla fase delle onde.'), xp: 80 },

  { id: '15-somma-onde', part: 'C', n: 15,
    title: t('Ogni segnale è una somma di onde'),
    desc: t('Sfida: ricostruisci il segnale misterioso mescolando onde semplici.'), xp: 90 },

  { id: '16-dft', part: 'C', n: 16,
    title: t('La DFT passo passo: il rilevatore di periodicità'),
    desc: t('La formula smontata pezzo per pezzo, con le frecce che vedi ruotare.'), xp: 140 },

  { id: '17-fft', part: 'C', n: 17,
    title: t('FFT: perché il computer ci mette N·log N'),
    desc: t('Dividi et impera: da N² a N·log N, contato operazione per operazione.'), xp: 80 },

  // ---------- PARTE D — il cuore ----------
  { id: '18-qft', part: 'D', n: 18,
    title: t('QFT: Fourier sulle ampiezze quantistiche'),
    desc: t('Il cuore del corso: dalla DFT al circuito con Hadamard, rotazioni controllate e SWAP.'), xp: 200 },

  { id: '19-qpe', part: 'D', n: 19,
    title: t('Quantum Phase Estimation'),
    desc: t('Leggere una fase nascosta come numero binario: la QFT usata al contrario.'), xp: 150 },

  { id: '20-shor', part: 'D', n: 20, boss: true,
    title: t('BOSS — Shor: dal periodo ai fattori'),
    desc: t('Fattorizza 15 e 21 con le tue mani: periodo, picchi, frazioni continue, MCD.'), xp: 250 },

  { id: '21-rumore', part: 'D', n: 21,
    title: t('Rumore, decoerenza e correzione d\'errore'),
    desc: t('Perché non hai ancora un computer quantistico in tasca. E come si combatte.'), xp: 130 },

  { id: '22-officina', part: 'D', n: 22, boss: true,
    title: t('OFFICINA — inventa il tuo algoritmo'),
    desc: t('Sandbox creativa: monta blocchi, scegli una sfida, misura, batti il tuo record.'), xp: 300 },

  { id: '23-glossario', part: 'D', n: 23,
    title: t('Glossario e mappa completa'),
    desc: t('Tutti i termini in una pagina, con il filo che li collega dall\'inizio alla fine.'), xp: 120 },

  { id: '24-esame', part: 'D', n: 24, boss: true,
    title: t('ESAME FINALE — attestato di completamento'),
    desc: t('Tutte le domande del corso, in una volta sola. Dall\'80% in su generi il tuo attestato.'), xp: 300 },
];

/* Indirizzi: derivati dall'id, così una lingua nuova non può dimenticarsi
   un file a metà elenco. `slug` è il nome nudo (serve alla navigazione fra
   lezioni vicine, che sono nella stessa cartella), `file` è il percorso
   visto dalla home della lingua. */
LEVELS.forEach(l => {
  l.slug = slugOf(l.id);
  l.file = `${LESSON_DIR}/${l.slug}.html`;
});

export const TOTAL_XP = LEVELS.reduce((s, l) => s + l.xp, 0);

/* Prerequisiti: ogni livello del percorso principale richiede la PADRONANZA
   del precedente. Parte 0 e livello 1 sono sempre aperti. */
const MAIN = LEVELS.filter(l => l.part !== '0');
LEVELS.forEach(l => { l.req = null; });
MAIN.forEach((l, i) => { if (i > 0 && !l.open) l.req = MAIN[i - 1].id; });

export function levelById(id) { return LEVELS.find(l => l.id === id) || null; }

/**
 * Il numero mostrato di un livello, a partire dal suo id.
 *
 * Serve ai testi che rimandano ad altri livelli — il glossario ne ha
 * trentasei. Scritti a mano si scollegano al primo riordino: quindici voci
 * puntavano ancora alla numerazione di prima che nascesse Simon, e mandavano
 * chi cercava «QFT» al livello 17, che è la FFT. Scritti così non possono.
 */
export function nOf(id) {
  const lv = levelById(id);
  return lv ? String(lv.n) : '?';
}

export function neighbours(id) {
  const i = LEVELS.findIndex(l => l.id === id);
  return { prev: i > 0 ? LEVELS[i - 1] : null, next: i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null };
}

export const RANKS = [
  { xp: 0,    name: t('Curioso') },
  { xp: 200,  name: t('Domatore di qubit') },
  { xp: 500,  name: t('Signore delle frecce') },
  { xp: 900,  name: t('Cacciatore di interferenze') },
  { xp: 1400, name: t('Analista di Fourier') },
  { xp: 1900, name: t('Ingegnere di circuiti') },
  { xp: 2400, name: t('Cacciatore di periodi') },
  { xp: 2900, name: t('Quantum Wizard') },
  { xp: 3400, name: t('Inventore di algoritmi') },
];

export function rankFor(xp) {
  let r = RANKS[0];
  for (const c of RANKS) if (xp >= c.xp) r = c;
  return r;
}
