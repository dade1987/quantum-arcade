/* ============================================================
   GLOSSARIO — fonte unica dei termini del corso.

   Prima queste definizioni esistevano solo dentro la pagina del livello 23,
   scritte tre volte (una per lingua): utilissime a chi era già arrivato in
   fondo, invisibili a chi si stava perdendo al livello 4. Ma una parola non
   spiegata non si dimentica dopo: blocca la frase in cui compare.

   Da qui le legge:
   · il pannello sempre aperto in ogni pagina (widgets/glossario.js);
   · la prima occorrenza di ogni termine nel testo delle lezioni;
   · la tabella A–Z del livello 23, che ora è la stessa in tutte le lingue.

   Il campo `alt` elenca le altre forme con cui la parola compare davvero
   scritta (plurali, sinonimi): serve solo a riconoscerla nel testo, non si
   vede da nessuna parte. È una stringa unica separata da virgole perché ogni
   lingua declina a modo suo — l'inglese aggiunge una «s», l'italiano cambia
   la vocale finale — e chi traduce deve poter mettere le forme della sua
   lingua senza toccare il codice.

   `liv` elenca i livelli in cui il termine si incontra: è il ponte che riporta
   alla spiegazione completa, ed è il motivo per cui questo glossario non è un
   vocabolario ma una mappa. Sono ID di livello, MAI numeri: i numeri scritti a
   mano nella vecchia tabella erano rimasti indietro di uno dopo l'inserimento
   del livello 12 (Simon), e chi cercava «Autostato» finiva sulla QFT invece che
   sulla QPE. Da un id il numero si ricava sempre; da un numero l'id no.
   ============================================================ */

import { t, ROOT, PREFIX } from './i18n.js';
import { levelById } from './levels.js';

export const VOCI = [
  { id: 'ampiezza', liv: ['01-qubit'], voce: t('Ampiezza'), alt: t('ampiezze'),
    def: t("Il numero (in generale una freccia complessa) associato a un possibile risultato. Il suo <b>quadrato</b> è la probabilità. Può essere negativa: da qui l'interferenza.") },

  { id: 'ampiezza-onda', liv: ['13-onde'], voce: t("Ampiezza (di un'onda)"),
    def: t("Quanto è alta un'onda; nel suono è il volume.") },

  { id: 'autostato', liv: ['19-qpe'], voce: t('Autostato / autovalore'), alt: t('autostati, autovalore, autovalori'),
    def: t("Stato che un'operazione lascia identico a parte una fase; quella fase è l'autovalore.") },

  { id: 'base-misura', liv: ['02-bloch'], voce: t('Base di misura'), alt: t('basi di misura, base Z, base X'),
    def: t('La "direzione" lungo cui si misura. Misurare in base Z dà 0/1; in base X dà +/−. Non esiste uno stato certo in tutte le basi.') },

  { id: 'bloch', liv: ['02-bloch'], voce: t('Bloch (sfera di)'), alt: t('sfera di Bloch'),
    def: t('Mappa di tutti gli stati di un qubit: nord |0⟩, sud |1⟩, equatore le sovrapposizioni al 50%.') },

  { id: 'born', liv: ['01-qubit'], voce: t('Born (regola di)'), alt: t('regola di Born'),
    def: t('Probabilità = |ampiezza|². Il ponte fra matematica e laboratorio.') },

  { id: 'bra-ket', liv: ['01-qubit'], voce: t('Bra-ket'), alt: t('bra, ket'),
    def: t('Notazione |ψ⟩ per gli stati (ket) e ⟨ψ| per i "duali" (bra). È solo una scatola per dire "questo è uno stato".') },

  { id: 'cnot', liv: ['04-due-qubit'], voce: t('CNOT'),
    def: t('Porta a due qubit: ribalta il bersaglio solo se il controllo vale 1. Su una sovrapposizione crea entanglement.') },

  { id: 'decoerenza', liv: ['21-rumore'], voce: t('Decoerenza'), alt: t('decoerente'),
    def: t("L'ambiente \"misura\" involontariamente il sistema e distrugge le fasi. Il nemico numero uno dell'hardware.") },

  { id: 'dense-coding', liv: ['06-teletrasporto'], voce: t('Dense coding'), alt: t('codifica densa'),
    def: t('Mandare 2 bit classici trasmettendo 1 qubit, sfruttando entanglement già condiviso.') },

  { id: 'dft', liv: ['16-dft'], voce: t('DFT'), alt: t('trasformata di Fourier discreta'),
    def: t('Trasformata di Fourier discreta: "ruota ogni dato e somma" per scoprire le periodicità.') },

  { id: 'diffusore', liv: ['11-grover'], voce: t('Diffusore'),
    def: t('In Grover: riflette le ampiezze attorno alla media, amplificando quella marcata.') },

  { id: 'entanglement', liv: ['04-due-qubit'], voce: t('Entanglement'), alt: t('entangled, entangolati'),
    def: t("Stato di più qubit che non si può descrivere qubit per qubit: l'informazione sta nella relazione.") },

  { id: 'fase', liv: ['01-qubit', '02-bloch', '08-frecce', '14-fase'], voce: t('Fase'), alt: t('fasi'),
    def: t("\"A che punto del giro sei\". Non cambia le probabilità, ma decide cosa si cancellerà. L'ingrediente segreto di tutto.") },

  { id: 'fft', liv: ['17-fft'], voce: t('FFT'),
    def: t('Algoritmo classico che calcola la DFT in N·log N invece di N² (dividi et impera).') },

  { id: 'frequenza', liv: ['13-onde'], voce: t('Frequenza'), alt: t('frequenze'),
    def: t('Quanti cicli al secondo (Hz). Inversa del periodo: f = 1/T.') },

  { id: 'grover', liv: ['11-grover'], voce: t('Grover'),
    def: t('Ricerca in √N tentativi invece di N/2. Guadagno quadratico, valido per qualunque ricerca senza struttura.') },

  { id: 'hadamard', liv: ['01-qubit', '03-porte'], voce: t('Hadamard (H)'), alt: t('Hadamard, porta H'),
    def: t('La porta più importante: crea e disfa le sovrapposizioni. È lei che trasforma le fasi in probabilità osservabili.') },

  { id: 'interferenza', liv: ['07-interferenza'], voce: t('Interferenza'), alt: t('interferenze, interferire, interferiscono'),
    def: t('Le ampiezze si sommano prima del quadrato: quelle concordi si rinforzano, quelle opposte si annullano.') },

  { id: 'misura', liv: ['01-qubit', '02-bloch'], voce: t('Misura'), alt: t('misure, misurare, misurazione'),
    def: t('Operazione irreversibile: sceglie un risultato a caso secondo |ampiezza|² e riscrive lo stato.') },

  { id: 'no-cloning', liv: ['06-teletrasporto'], voce: t('No-cloning'), alt: t('teorema di no-cloning'),
    def: t('Non esiste una macchina che copia uno stato quantistico sconosciuto.') },

  { id: 'numero-complesso', liv: ['08-frecce'], voce: t('Numero complesso'), alt: t('numeri complessi'),
    def: t("Una freccia: lunghezza + angolo. e^{iθ} è la freccia lunga 1 all'angolo θ.") },

  { id: 'oracolo', liv: ['09-deutsch'], voce: t('Oracolo'), alt: t('oracoli'),
    def: t("Scatola nera che marca con un segno meno gli stati che soddisfano una condizione: scrive l'informazione nelle fasi.") },

  { id: 'periodo', liv: ['13-onde'], voce: t('Periodo'), alt: t('periodi, periodicità'),
    def: t('Ogni quanto una cosa si ripete. T = 1/f.') },

  { id: 'phase-kickback', liv: ['09-deutsch', '19-qpe'], voce: t('Phase kickback'), alt: t('kickback'),
    def: t('Il trucco per cui la fase generata da un oracolo "rimbalza" sul registro di controllo.') },

  { id: 'porta', liv: ['03-porte'], voce: t('Porta (gate)'), alt: t('porte, porta quantistica, gate'),
    def: t('Operazione reversibile (unitaria) su uno o più qubit: sulla sfera è sempre una rotazione.') },

  { id: 'post-quantistica', liv: ['20-shor'], voce: t('Post-quantistica (crittografia)'), alt: t('crittografia post-quantistica'),
    def: t('Algoritmi classici resistenti a Shor e Grover; standardizzati dal NIST nel 2024.') },

  { id: 'qft', liv: ['18-qft'], voce: t('QFT'), alt: t('trasformata di Fourier quantistica'),
    def: t('Trasformata di Fourier sulle ampiezze: n²/2 porte, trasforma periodicità in picchi.') },

  { id: 'qpe', liv: ['19-qpe'], voce: t('QPE'), alt: t('stima di fase'),
    def: t('Stima di fase: copia una fase nei qubit di lettura e la rende misurabile con la QFT inversa.') },

  { id: 'qubit', liv: ['01-qubit'], voce: t('Qubit'),
    def: t('Unità elementare: due ampiezze, una per |0⟩ e una per |1⟩.') },

  { id: 'shor', liv: ['20-shor'], voce: t('Shor'), alt: t('algoritmo di Shor'),
    def: t('Fattorizzazione in tempo polinomiale, riducendo il problema alla ricerca di un periodo.') },

  { id: 'sindrome', liv: ['21-rumore'], voce: t('Sindrome (misura di)'), alt: t('misura di sindrome'),
    def: t("Misura che rivela <b>dove</b> è avvenuto un errore senza rivelare l'informazione codificata.") },

  { id: 'sovrapposizione', liv: ['01-qubit'], voce: t('Sovrapposizione'), alt: t('sovrapposizioni'),
    def: t('Stato in cui più risultati hanno ampiezza diversa da zero contemporaneamente.') },

  { id: 'swap', liv: ['05-circuiti', '18-qft'], voce: t('SWAP'),
    def: t('Porta che scambia due qubit; chiude il circuito della QFT.') },

  { id: 'teletrasporto', liv: ['06-teletrasporto'], voce: t('Teletrasporto'), alt: t('teletrasportare'),
    def: t("Trasferire uno stato usando entanglement + 2 bit classici. L'originale viene distrutto.") },

  { id: 'unitaria', liv: ['03-porte'], voce: t('Unitaria (operazione)'), alt: t('unitaria, unitarie, operazione unitaria'),
    def: t('Conserva la probabilità totale ed è reversibile: tutte le porte lo sono, la misura no.') },
];

/** Una voce dal suo id, o null. */
export function voceById(id) {
  return VOCI.find(v => v.id === id) || null;
}

/**
 * Ricerca: senza accenti e senza maiuscole, sul termine e sulla definizione.
 * Il numero di livello è cercabile ("2" trova cosa si impara al livello 2),
 * perché la domanda vera di chi ripassa non è sempre "cosa vuol dire X" ma
 * anche "cos'era che avevo visto in quel livello".
 */
export function cercaVoci(query) {
  const q = piatto(query || '').trim();
  if (!q) return VOCI;
  return VOCI.filter(v =>
    piatto(v.voce).includes(q) ||
    piatto(v.def).includes(q) ||
    piatto(v.alt || '').includes(q) ||
    livelliDellaVoce(v).some(l => String(l.n) === q));
}

/** Minuscole, senza accenti e senza tag: la forma con cui si confronta il testo. */
export function piatto(s) {
  return String(s)
    .replace(/<[^>]*>/g, '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** I livelli citati da una voce, come oggetti di LEVELS (quelli che esistono). */
export function livelliDellaVoce(v) {
  return v.liv.map(id => levelById(id)).filter(Boolean);
}

/** Indirizzo di un livello valido dalla pagina corrente, qualunque sia la lingua. */
export function hrefLivello(l) {
  return ROOT + PREFIX + l.file;
}

/**
 * Le forme da riconoscere nel testo, dalla più lunga alla più corta —
 * così "trasformata di Fourier quantistica" vince su "trasformata di Fourier
 * discreta" e nessuna delle due viene spezzata a metà da un termine più corto.
 *
 * Si scartano le forme sotto i tre caratteri: una «H» maiuscola in mezzo a una
 * formula non è la porta di Hadamard, e marcarla non aiuta nessuno.
 */
export function formeDaCollegare() {
  const forme = [];
  /* Due voci possono ridursi alla stessa parola: "Ampiezza" e "Ampiezza (di
     un'onda)" sono la stessa parola in due contesti. Marcarla due volte
     mostrerebbe due definizioni diverse per la stessa scritta, che è peggio
     di non marcarla: vince la prima voce, e la seconda si trova nel pannello. */
  const viste = new Set();
  for (const v of VOCI) {
    const grezze = [v.voce, ...(v.alt ? v.alt.split(',') : [])];
    // "Bloch (sfera di)" nel testo si scrive "sfera di Bloch": la parte fra
    // parentesi è un chiarimento per il glossario, non una forma da cercare.
    for (const g of grezze) {
      const forma = g.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
      const chiave = piatto(forma);
      if (forma.length < 3 || viste.has(chiave)) continue;
      viste.add(chiave);
      forme.push({ id: v.id, forma });
    }
  }
  forme.sort((a, b) => b.forma.length - a.forma.length);
  return forme;
}
