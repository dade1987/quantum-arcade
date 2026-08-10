/* ============================================================
   NUMERI COMPLESSI — il minimo indispensabile, tutto commentato.
   Un numero complesso qui è semplicemente una coppia {re, im}:
   la parte "orizzontale" e quella "verticale" di una freccia.
   ============================================================ */

export const C = (re = 0, im = 0) => ({ re, im });

export const add = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });
export const sub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im });

/** Moltiplicare due complessi = moltiplicare le lunghezze e SOMMARE gli angoli. */
export const mul = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });

export const scale = (a, s) => ({ re: a.re * s, im: a.im * s });
export const conj = a => ({ re: a.re, im: -a.im });

/** Lunghezza della freccia (modulo). */
export const abs = a => Math.hypot(a.re, a.im);
export const abs2 = a => a.re * a.re + a.im * a.im;

/** Angolo della freccia in radianti (fase), da -π a π. */
export const arg = a => Math.atan2(a.im, a.re);

/** e^{iθ} = cos θ + i sin θ  →  la freccia di lunghezza 1 che punta all'angolo θ. */
export const expi = theta => ({ re: Math.cos(theta), im: Math.sin(theta) });

/** Freccia da modulo e fase. */
export const polar = (r, theta) => ({ re: r * Math.cos(theta), im: r * Math.sin(theta) });

export const eq = (a, b, tol = 1e-9) => Math.abs(a.re - b.re) < tol && Math.abs(a.im - b.im) < tol;

/** Stringa leggibile tipo "0.71 + 0.71i" oppure "i", "-1", "0". */
export function str(a, d = 2) {
  const r = Math.abs(a.re) < 5e-4 ? 0 : a.re;
  const i = Math.abs(a.im) < 5e-4 ? 0 : a.im;
  if (i === 0) return r.toFixed(d);
  if (r === 0) return (i === 1 ? '' : i === -1 ? '−' : i.toFixed(d)) + 'i';
  return `${r.toFixed(d)} ${i < 0 ? '−' : '+'} ${Math.abs(i).toFixed(d)}i`;
}

/** Gradi (0..360) della fase — comodo per l'orologio delle frecce. */
export const deg = a => ((Math.atan2(a.im, a.re) * 180 / Math.PI) % 360 + 360) % 360;
