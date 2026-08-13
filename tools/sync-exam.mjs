/* Generates the exam's PHP question bank.
   Usage: node tools/sync-exam.mjs   (or: npm run exam:sync)

   WHY THERE ARE TWO BANKS

   The exam questions have a problem no other content in the project has: if
   they can be read, the exam stops measuring anything. And here they can be
   read two ways — from the site's address, if the file sits in public_html,
   and from GitHub, if the file is in the repository, which is public on
   purpose.

   Hence:

     data/exam-bank-sample.js    versioned, public, there so that contributors
                                    can run the site and the tests locally.
     data/exam-bank-private.js   NOT versioned (see .gitignore): the real exam,
                                    kept only on the author's machine and on the
                                    server. If it is missing, the sample is used.

   Each produces a different PHP file, and config.php picks which one to load
   depending on what it finds on the server. Contributors work exactly as
   before; anyone looking to cheat finds only the sample questions on GitHub. */

import { existsSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const esc = s => String(s).replaceAll('\\', '\\\\').replaceAll("'", "\\'");

/* The languages the exam can be sat in. If a question carries no translation,
   that language falls back to Italian: better a question in one language only
   than a half-translated one, with its options out of order. */
const LOCALES = ['en', 'es'];

/** Turns a list of questions into the PHP file the backend will load. */
function writePhp(questions, destination, source) {
  const lines = [
    '<?php',
    '',
    '/*',
    ' * GENERATED AUTOMATICALLY by tools/sync-exam.mjs — do not edit by hand.',
    ` * Source: ${source}`,
    ' *',
    ' * The questions live here and not in the browser: if the correct answers',
    " * were in the page's code, the certificate would prove nothing.",
    ' */',
    '',
    'return [',
  ];

  questions.forEach((q, i) => {
    lines.push('    [');
    lines.push(`        'id' => ${i + 1},`);
    lines.push(`        'q'  => '${esc(q.q)}',`);
    lines.push(`        'o'  => ['${q.o.map(esc).join("', '")}'],`);
    lines.push(`        'c'  => ${q.c},`);
    lines.push(`        'w'  => '${esc(q.w)}',`);

    // The translations live inside the question, not in lang/*.json: the index
    // of the right answer is a single one for every language, and keeping them
    // together is the only way they cannot drift from the option order.
    for (const locale of LOCALES) {
      const t = q[locale];
      if (!t) continue;
      lines.push(`        '${locale}' => [`);
      lines.push(`            'q' => '${esc(t.q ?? q.q)}',`);
      lines.push(`            'o' => ['${(t.o ?? q.o).map(esc).join("', '")}'],`);
      lines.push(`            'w' => '${esc(t.w ?? q.w)}',`);
      lines.push('        ],');
    }

    lines.push('    ],');
  });

  lines.push('];', '');
  writeFileSync(destination, lines.join('\n'));
  return questions.length;
}

const banks = [
  { js: 'data/exam-bank-sample.js',  php: 'Modules/Certificates/config/exam-questions-sample.php',  label: 'sample (public)' },
  { js: 'data/exam-bank-private.js', php: 'Modules/Certificates/config/exam-questions-private.php', label: 'private (outside git)' },
];

let anyFound = false;

for (const b of banks) {
  if (!existsSync(b.js)) {
    console.log(`•  ${b.label}: absent, skipping (${b.js})`);
    continue;
  }
  const { EXAM } = await import(pathToFileURL(resolve(b.js)).href);
  const n = writePhp(EXAM, b.php, b.js);
  const translated = LOCALES.map(l => `${EXAM.filter(q => q[l]).length}/${n} ${l}`).join(', ');
  console.log(`✅ ${n} ${b.label} questions → ${b.php}   (translated: ${translated})`);
  anyFound = true;
}

if (!anyFound) {
  console.error('❌ No question bank found: at least data/exam-bank-sample.js is needed');
  process.exit(1);
}

if (!existsSync('data/exam-bank-private.js')) {
  console.log('\n   Note: exam-questions-private.php has to be uploaded to the server too; it is not in git.');
}
