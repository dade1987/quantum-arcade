/* ============================================================
   DSP — trasformata di Fourier discreta, versione didattica.
   Un "segnale" qui è {re: Float64Array, im: Float64Array}.
   ============================================================ */

export function signal(n) {
  return { re: new Float64Array(n), im: new Float64Array(n) };
}

export function fromArray(arr) {
  const s = signal(arr.length);
  arr.forEach((v, i) => {
    if (typeof v === 'number') s.re[i] = v;
    else { s.re[i] = v.re || 0; s.im[i] = v.im || 0; }
  });
  return s;
}

export const N_of = s => s.re.length;

/**
 * DFT diretta (definizione, O(N²)): la usiamo perché è LA formula della lezione.
 *   X(k) = Σ_n x(n) · e^{sign · i · 2π k n / N}
 * sign = -1 → analisi (dal tempo alle frequenze)  [convenzione classica]
 * sign = +1 → sintesi (dalle frequenze al tempo)  [convenzione della QFT]
 * norm: 'none' | 'n' (divide per N) | 'sqrt' (divide per √N, unitaria)
 */
export function dft(x, { sign = -1, norm = 'none' } = {}) {
  const N = N_of(x);
  const out = signal(N);
  const f = norm === 'n' ? 1 / N : norm === 'sqrt' ? 1 / Math.sqrt(N) : 1;
  for (let k = 0; k < N; k++) {
    let sr = 0, si = 0;
    for (let n = 0; n < N; n++) {
      const th = sign * 2 * Math.PI * k * n / N;
      const c = Math.cos(th), s = Math.sin(th);
      sr += x.re[n] * c - x.im[n] * s;
      si += x.re[n] * s + x.im[n] * c;
    }
    out.re[k] = sr * f; out.im[k] = si * f;
  }
  return out;
}

/**
 * I singoli termini della somma per una data frequenza k,
 * più la somma cumulativa: è quello che il gioco disegna come catena di frecce.
 */
export function dftTerms(x, k, { sign = -1 } = {}) {
  const N = N_of(x);
  const terms = [], cum = [];
  let sr = 0, si = 0;
  for (let n = 0; n < N; n++) {
    const th = sign * 2 * Math.PI * k * n / N;
    const c = Math.cos(th), s = Math.sin(th);
    const tr = x.re[n] * c - x.im[n] * s;
    const ti = x.re[n] * s + x.im[n] * c;
    terms.push({ re: tr, im: ti, angle: th, sample: x.re[n] });
    sr += tr; si += ti;
    cum.push({ re: sr, im: si });
  }
  return { terms, cum, total: { re: sr, im: si } };
}

/** FFT radix-2 iterativa (richiede N potenza di 2). Serve per il confronto di costo. */
export function fft(x, { sign = -1 } = {}) {
  const N = N_of(x);
  if ((N & (N - 1)) !== 0) throw new Error('FFT: N deve essere una potenza di 2');
  const re = Float64Array.from(x.re), im = Float64Array.from(x.im);
  // bit reversal
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= N; len <<= 1) {
    const ang = sign * 2 * Math.PI / len;
    const wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < N; i += len) {
      let cwr = 1, cwi = 0;
      for (let j = 0; j < len / 2; j++) {
        const ur = re[i + j], ui = im[i + j];
        const vr = re[i + j + len / 2] * cwr - im[i + j + len / 2] * cwi;
        const vi = re[i + j + len / 2] * cwi + im[i + j + len / 2] * cwr;
        re[i + j] = ur + vr; im[i + j] = ui + vi;
        re[i + j + len / 2] = ur - vr; im[i + j + len / 2] = ui - vi;
        const nwr = cwr * wr - cwi * wi;
        cwi = cwr * wi + cwi * wr; cwr = nwr;
      }
    }
  }
  return { re, im };
}

export function magnitudes(X) {
  const N = N_of(X), m = new Float64Array(N);
  for (let k = 0; k < N; k++) m[k] = Math.hypot(X.re[k], X.im[k]);
  return m;
}
export function phases(X) {
  const N = N_of(X), p = new Float64Array(N);
  for (let k = 0; k < N; k++) p[k] = Math.atan2(X.im[k], X.re[k]);
  return p;
}

/** Somma di sinusoidi: comps = [{amp, freq, phase}] valutata in t. */
export function synth(comps, t) {
  let v = 0;
  for (const c of comps) v += c.amp * Math.cos(2 * Math.PI * c.freq * t + c.phase);
  return v;
}

/** Campiona una funzione continua in N punti su [0,1). */
export function sampleFn(fn, N) {
  const s = signal(N);
  for (let n = 0; n < N; n++) s.re[n] = fn(n / N);
  return s;
}

/** "Avvolgimento" del segnale attorno al cerchio a frequenza f (anche non intera):
 *  centro di massa della curva avvolta = intuizione visiva della trasformata. */
export function winding(fn, f, samples = 500) {
  const pts = [];
  let sr = 0, si = 0;
  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    const v = fn(t);
    const th = -2 * Math.PI * f * t;
    const x = v * Math.cos(th), y = v * Math.sin(th);
    pts.push({ x, y });
    sr += x; si += y;
  }
  return { pts, center: { re: sr / samples, im: si / samples } };
}

/** Conteggio operazioni: DFT ~ N², FFT ~ (N/2)·log2 N farfalle. */
export function costs(N) {
  const log2 = Math.log2(N);
  return {
    dftMul: N * N,
    fftMul: (N / 2) * log2,
    ratio: (N * N) / Math.max(1, (N / 2) * log2),
    qftGates: (log2 * (log2 + 1)) / 2 + Math.floor(log2 / 2), // H + rotazioni controllate + SWAP
  };
}
