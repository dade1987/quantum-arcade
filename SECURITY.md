# Security

## Reporting a vulnerability

**Do not open a public issue.** Write privately via
[LinkedIn](https://www.linkedin.com/in/davidecavallini/) or use
*Security → Report a vulnerability* here on GitHub.

I reply within **72 hours** and keep you posted until it is closed. If you want, your name is
credited in the changelog of the fix.

## What is particularly worth reporting

This project handles **emails, passwords and verifiable certificates**, so the sensitive points
are:

- bypassing the server-side exam marking (getting a certificate without passing);
- access to another user's progress or data;
- injection into the lesson content or into the tutor's answers (prompt injection included);
- exposure of the single-use sign-in links;
- being able to use the tutor as a proxy to the AI model at the operator's expense.

## What the design already accounts for

- Sign-in tokens are stored **as hashes only** (SHA-256), never in the clear.
- The exam's correct answers **never leave the server**.
- Rate limiting on registration, sign-in, link requests and tutor questions.
- The answer to "is this email registered?" is identical either way.
- Sessions with `HttpOnly` cookies and CSRF protection on every writing request.
- `.env`, the database, the logs and the tutor's store live **outside** `public_html`.

## What is NOT a vulnerability

- Being able to edit your own local progress in offline mode: that is by design, and it is the
  reason the exam is marked by the server.
- The certificate is not accredited by a third-party body: this is stated openly, it is not a
  defect.
- The tutor refusing to give away a mission's solution: that is deliberate.

## Supported versions

The project is continuously released: only the version on the `main` branch is ever fixed.
