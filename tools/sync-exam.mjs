/* Genera la banca domande PHP dell'esame.
   Uso: node tools/sync-exam.mjs   (oppure: npm run exam:sync)

   PERCHÉ CI SONO DUE BANCHE

   Le domande d'esame hanno un problema che nessun altro contenuto del progetto
   ha: se si possono leggere, l'esame non misura più niente. E qui si possono
   leggere in due modi — dall'indirizzo del sito, se il file sta in public_html,
   e da GitHub, se il file sta nel repository, che è pubblico apposta.

   Quindi:

     dati/banca-esame-esempio.js    versionata, pubblica, serve a chi contribuisce
                                    per far girare il sito e i test in locale.
     dati/banca-esame-riservata.js  NON versionata (vedi .gitignore): è l'esame
                                    vero, sta solo sul computer dell'autore e sul
                                    server. Se manca, si usa quella d'esempio.

   Da ciascuna esce un file PHP diverso, e config.php sceglie quale caricare a
   seconda di cosa trova sul server. Chi contribuisce lavora esattamente come
   prima; chi vuole barare, su GitHub, trova solo le domande d'esempio. */

import { existsSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const esc = s => String(s).replaceAll('\\', '\\\\').replaceAll("'", "\\'");

/** Trasforma un elenco di domande nel file PHP che il backend caricherà. */
function scriviPhp(domande, destinazione, provenienza) {
  const righe = [
    '<?php',
    '',
    '/*',
    ' * GENERATO AUTOMATICAMENTE da tools/sync-exam.mjs — non modificare a mano.',
    ` * Fonte: ${provenienza}`,
    ' *',
    ' * Le domande stanno qui e non nel browser: se le risposte esatte fossero',
    " * nel codice della pagina, l'attestato non dimostrerebbe nulla.",
    ' */',
    '',
    'return [',
  ];

  domande.forEach((q, i) => {
    righe.push('    [');
    righe.push(`        'id' => ${i + 1},`);
    righe.push(`        'q'  => '${esc(q.q)}',`);
    righe.push(`        'o'  => ['${q.o.map(esc).join("', '")}'],`);
    righe.push(`        'c'  => ${q.c},`);
    righe.push(`        'w'  => '${esc(q.w)}',`);
    righe.push('    ],');
  });

  righe.push('];', '');
  writeFileSync(destinazione, righe.join('\n'));
  return domande.length;
}

const banche = [
  { js: 'dati/banca-esame-esempio.js',   php: 'Modules/Certificates/config/domande-esempio.php',   etichetta: "d'esempio (pubblica)" },
  { js: 'dati/banca-esame-riservata.js', php: 'Modules/Certificates/config/domande-riservate.php', etichetta: 'riservata (fuori da git)' },
];

let almenoUna = false;

for (const b of banche) {
  if (!existsSync(b.js)) {
    console.log(`•  ${b.etichetta}: assente, salto (${b.js})`);
    continue;
  }
  const { EXAM } = await import(pathToFileURL(resolve(b.js)).href);
  const n = scriviPhp(EXAM, b.php, b.js);
  console.log(`✅ ${n} domande ${b.etichetta} → ${b.php}`);
  almenoUna = true;
}

if (!almenoUna) {
  console.error('❌ Nessuna banca domande trovata: serve almeno dati/banca-esame-esempio.js');
  process.exit(1);
}

if (!existsSync('dati/banca-esame-riservata.js')) {
  console.log('\n   Nota: sul server va caricata anche domande-riservate.php, che non sta in git.');
}
