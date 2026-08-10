# Sicurezza

## Segnalare una vulnerabilità

**Non aprire una issue pubblica.** Scrivi in privato tramite
[LinkedIn](https://www.linkedin.com/in/davidecavallini/) oppure usa
*Security → Report a vulnerability* qui su GitHub.

Rispondo entro **72 ore** e ti tengo aggiornato fino alla chiusura. Se vuoi, il tuo nome
viene citato nel changelog della correzione.

## Cosa è particolarmente interessante segnalare

Questo progetto tratta **email, password e attestati verificabili**: i punti sensibili sono

- aggiramento della correzione dell'esame lato server (ottenere un attestato senza superarlo);
- accesso ai progressi o ai dati di un altro utente;
- iniezione nei contenuti delle lezioni o nelle risposte del tutor (prompt injection compresa);
- esposizione dei link di accesso monouso;
- possibilità di usare il tutor come proxy per il modello AI a spese del gestore.

## Cosa è già previsto per progetto

- I token di accesso sono salvati **solo come hash** (SHA-256), mai in chiaro.
- Le risposte esatte dell'esame **non escono mai dal server**.
- Rate limiting su registrazione, accesso, richiesta link e domande al tutor.
- La risposta a "questa email è registrata?" è identica in entrambi i casi.
- Sessioni con cookie `HttpOnly` e protezione CSRF su tutte le richieste che scrivono.
- `.env`, database, log e archivio del tutor stanno **fuori** da `public_html`.

## Cosa NON è una vulnerabilità

- Poter modificare i propri progressi locali in modalità offline: è previsto, ed è il motivo
  per cui l'esame è corretto dal server.
- L'attestato non è accreditato da un ente terzo: è dichiarato apertamente, non è un difetto.
- Il tutor che rifiuta di dare la soluzione di una missione: è voluto.

## Versioni supportate

Il progetto è a rilascio continuo: viene corretta sempre e solo la versione sul ramo `main`.
