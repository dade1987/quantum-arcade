/* Genera la banca domande PHP dell'esame partendo da dati/banca-esame.js.

   La banca sta FUORI da public_html apposta: dentro sarebbe scaricabile da
   chiunque con l'URL, risposte esatte comprese, e l'attestato non varrebbe più
   niente. Qui il browser non può arrivarci; ci arriva solo questo script,
   che gira sul computer di chi sviluppa.
   Così esiste UNA sola fonte di verità: si modifica il file JS e si rilancia
       node tools/sync-exam.mjs
   Le risposte esatte finiscono solo lato server. */

import { EXAM } from '../dati/banca-esame.js';
import { writeFileSync } from 'node:fs';

const esc = s => String(s).replaceAll('\\', '\\\\').replaceAll("'", "\\'");

const lines = [];
lines.push('<?php');
lines.push('');
lines.push('/*');
lines.push(' * GENERATO AUTOMATICAMENTE da tools/sync-exam.mjs — non modificare a mano.');
lines.push(' * Fonte: dati/banca-esame.js (fuori dalla radice web: le soluzioni non sono scaricabili)');
lines.push(' *');
lines.push(" * Le domande stanno qui e non nel browser: se le risposte esatte fossero");
lines.push(' * nel codice della pagina, l\'attestato non dimostrerebbe nulla.');
lines.push(' */');
lines.push('');
lines.push('return [');
lines.push("    'name' => 'Certificates',");
lines.push('');
lines.push("    // Versione del corso, stampata sull'attestato");
lines.push("    'course_version' => '1.0',");
lines.push('');
lines.push("    'questions' => [");

EXAM.forEach((q, i) => {
  lines.push('        [');
  lines.push(`            'id' => ${i + 1},`);
  lines.push(`            'q'  => '${esc(q.q)}',`);
  lines.push(`            'o'  => ['${q.o.map(esc).join("', '")}'],`);
  lines.push(`            'c'  => ${q.c},`);
  lines.push(`            'w'  => '${esc(q.w)}',`);
  lines.push('        ],');
});

lines.push('    ],');
lines.push('];');
lines.push('');

const out = 'Modules/Certificates/config/config.php';
writeFileSync(out, lines.join('\n'));
console.log(`✅ ${EXAM.length} domande scritte in ${out}`);
