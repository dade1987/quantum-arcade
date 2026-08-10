<!doctype html>
<html lang="it">
<body style="margin:0;padding:0;background:#0a1020;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a1020;padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="max-width:520px;background:#0e1526;border:1px solid #23304f;border-radius:16px;padding:32px">
        <tr><td>
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:3px;color:#22d3ee;font-weight:700">QUANTUM ARCADE</p>
          <h1 style="margin:0 0 18px;font-size:24px;color:#e8edf9">
            {{ $isNew ? 'Benvenuto!' : 'Bentornato!' }}
          </h1>

          <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#9dabc9">
            @if($isNew)
              Hai creato un account su Quantum Arcade. Clicca il bottone qui sotto per
              <b style="color:#e8edf9">confermare la tua email</b> ed entrare: non serve nessuna password.
            @else
              Ecco il tuo link di accesso. Nessuna password da ricordare: clicca ed entri.
            @endif
          </p>

          <p style="margin:24px 0">
            <a href="{{ $url }}"
               style="display:inline-block;background:#22d3ee;color:#04121a;text-decoration:none;
                      font-weight:800;font-size:16px;padding:14px 26px;border-radius:12px">
              {{ $isNew ? 'Conferma e entra' : 'Entra in Quantum Arcade' }}
            </a>
          </p>

          <p style="margin:0 0 14px;font-size:13px;line-height:1.6;color:#6c7a9c">
            Il link vale <b>20 minuti</b> e si può usare <b>una sola volta</b>.<br>
            Se il bottone non funziona, copia questo indirizzo nel browser:<br>
            <span style="word-break:break-all;color:#7dd3fc">{{ $url }}</span>
          </p>

          <hr style="border:none;border-top:1px solid #23304f;margin:24px 0">

          <p style="margin:0;font-size:12px;line-height:1.6;color:#6c7a9c">
            Se non hai richiesto tu questo accesso, ignora questa email: senza il click non succede nulla
            e il tuo indirizzo non verrà usato per altro.
          </p>
        </td></tr>
      </table>
      <p style="margin:18px 0 0;font-size:11px;color:#6c7a9c">Quantum Arcade · di Davide Cavallini</p>
    </td></tr>
  </table>
</body>
</html>
