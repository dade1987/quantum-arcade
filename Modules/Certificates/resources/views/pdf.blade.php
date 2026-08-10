<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<style>
  /* dompdf non gestisce height:100% né flexbox: si lavora con misure fisse
     (A4 orizzontale = 297×210 mm) e con position:fixed per la fascia in basso. */
  @page { margin: 0; }
  body { margin: 0; padding: 0; font-family: DejaVu Sans, sans-serif; color: #10203a; }

  .frame {
    position: absolute; top: 10mm; left: 12mm; width: 273mm; height: 190mm;
    border: 2.5pt solid #0e7490; border-radius: 6pt;
  }
  .inner {
    position: absolute; top: 3mm; left: 3mm; width: 271mm; height: 184mm;
    border: 0.6pt solid #a5b4fc; border-radius: 4pt;
  }
  .pad { position: absolute; top: 12mm; left: 14mm; width: 245mm; }

  .brand { font-size: 9pt; letter-spacing: 4pt; color: #0e7490; font-weight: bold; }
  .kicker { font-size: 8pt; letter-spacing: 1.5pt; color: #64748b; margin-top: 2mm; text-transform: uppercase; }
  .name { font-size: 30pt; font-weight: bold; color: #0f172a; margin: 9mm 0 1mm; }
  .born { font-size: 9pt; color: #64748b; margin: 0 0 7mm; }
  .body { font-size: 10.5pt; line-height: 1.6; color: #334155; width: 195mm; }
  .body b { color: #0f172a; }

  /* un solo blocco in fondo: dompdf gestisce male due elementi fixed sovrapposti */
  .footer { position: fixed; bottom: 14mm; left: 24mm; width: 249mm; }
  .meta { width: 100%; border-collapse: collapse; }
  .meta td { font-size: 8pt; color: #334155; padding: 0 9mm 3mm 0; vertical-align: top; }
  .lab { font-size: 6.5pt; color: #94a3b8; letter-spacing: 0.8pt; text-transform: uppercase; }
  .code { font-family: DejaVu Sans Mono, monospace; font-size: 9pt; color: #0f172a; }
  .note { font-size: 6.8pt; color: #94a3b8; line-height: 1.5; width: 210mm; margin: 0; }
  .seal {
    position: fixed; right: 26mm; top: 30mm; width: 30mm; height: 30mm;
    border: 1.2pt solid #0e7490; border-radius: 15mm; text-align: center; color: #0e7490;
  }
  .seal .q { font-size: 20pt; font-weight: bold; margin-top: 6mm; }
  .seal .t { font-size: 5.5pt; letter-spacing: 0.6pt; }
</style>
</head>
<body>
  <div class="frame"><div class="inner"></div></div>

  <div class="seal">
    <div class="q">Q</div>
    <div class="t">QUANTUM<br>ARCADE</div>
  </div>

  <div class="pad">
    <div class="brand">QUANTUM ARCADE</div>
    <div class="kicker">Attestato di completamento del corso</div>

    <div class="name">{{ $c->holder_name }}</div>
    @if($user?->birth_date)
      <div class="born">nato/a il {{ $user->birth_date->format('d/m/Y') }}</div>
    @endif

    <div class="body">
      ha completato il percorso <b>&laquo;Informatica quantistica giocando&raquo;</b>: 27 livelli interattivi
      che coprono onde e trasformata di Fourier, qubit e misura, porte quantistiche ed entanglement,
      no-cloning e teletrasporto, gli algoritmi di Deutsch&ndash;Jozsa, Bernstein&ndash;Vazirani e Grover,
      la trasformata di Fourier quantistica, la stima di fase e l'algoritmo di Shor.
      <br><br>
      Ha superato l'esame finale a risposta multipla, <b>corretto dal server</b>, con
      <b>{{ $c->percent }}%</b> di risposte esatte
      ({{ $attempt?->score ?? '—' }} su {{ $attempt?->total ?? 30 }} domande).
    </div>
  </div>

  <div class="footer">
  <table class="meta">
    <tr>
      <td><span class="lab">Rilasciato il</span><br>{{ $c->issued_at->format('d/m/Y') }}</td>
      <td><span class="lab">Codice attestato</span><br><span class="code">{{ $c->code }}</span></td>
      <td><span class="lab">Versione corso</span><br>{{ $c->course_version }}</td>
      <td><span class="lab">Autore del corso</span><br>Davide Cavallini</td>
      <td><span class="lab">Verifica pubblica</span><br>{{ $verifyUrl }}</td>
    </tr>
  </table>

  <p class="note">
    Attestato di completamento rilasciato dall'autore del corso e verificabile pubblicamente all'indirizzo indicato sopra.
    Non costituisce una certificazione accreditata da un ente terzo né un titolo di studio.
  </p>
  </div>
</body>
</html>
