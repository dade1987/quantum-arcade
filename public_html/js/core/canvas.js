/* ============================================================
   STAGE — piccolo motore 2D riutilizzabile da tutti i widget.
   - gestisce DPI, resize, loop di animazione (in pausa se fuori schermo)
   - eventi puntatore normalizzati (mouse + touch)
   - helper di disegno: griglia, assi, frecce, testo, barre
   ============================================================ */

export class Stage {
  /**
   * @param {HTMLElement} host contenitore
   * @param {object} opts {height, aspect, draw(ctx, s), onPointer(e)}
   */
  constructor(host, opts = {}) {
    this.opts = opts;
    this.host = host;
    this.el = document.createElement('div');
    this.el.className = 'canvas-host';
    this.canvas = document.createElement('canvas');
    this.el.appendChild(this.canvas);
    host.appendChild(this.el);
    this.ctx = this.canvas.getContext('2d');
    this.w = 0; this.h = 0;
    this.t = 0;           // tempo in secondi dall'avvio
    this.playing = true;
    this.visible = true;
    this._last = 0;
    this._height = opts.height || 260;
    this._aspect = opts.aspect || null;   // se impostato: h = w / aspect
    this.pointer = { x: 0, y: 0, down: false, inside: false };

    this._ro = new ResizeObserver(() => this.resize());
    this._ro.observe(this.el);
    this.resize();

    this._io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; }, { threshold: 0.02 });
    this._io.observe(this.el);

    this._bindPointer();
    this._frame = this._frame.bind(this);
    requestAnimationFrame(this._frame);
  }

  resize() {
    const rect = this.el.getBoundingClientRect();
    const w = Math.max(200, rect.width || this.host.clientWidth || 600);
    const h = this._aspect ? w / this._aspect : this._height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w; this.h = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.dirty = true;
  }

  _bindPointer() {
    const pos = ev => {
      const r = this.canvas.getBoundingClientRect();
      const p = ev.touches ? ev.touches[0] : ev;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    };
    const fire = (type, ev) => {
      const { x, y } = pos(ev);
      this.pointer.x = x; this.pointer.y = y;
      if (type === 'down') this.pointer.down = true;
      if (type === 'up') this.pointer.down = false;
      this.opts.onPointer && this.opts.onPointer({ type, x, y, down: this.pointer.down, ev, stage: this });
      this.dirty = true;
    };
    const c = this.canvas;
    c.addEventListener('mousedown', e => { e.preventDefault(); fire('down', e); });
    window.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      this.pointer.inside = inside;
      if (inside || this.pointer.down) fire('move', e);
    });
    window.addEventListener('mouseup', e => { if (this.pointer.down) fire('up', e); });
    c.addEventListener('mouseleave', () => { this.pointer.inside = false; this.dirty = true; });
    c.addEventListener('touchstart', e => { e.preventDefault(); fire('down', e); }, { passive: false });
    c.addEventListener('touchmove', e => { e.preventDefault(); fire('move', e); }, { passive: false });
    c.addEventListener('touchend', e => { this.pointer.down = false; this.opts.onPointer && this.opts.onPointer({ type: 'up', x: this.pointer.x, y: this.pointer.y, down: false, ev: e, stage: this }); this.dirty = true; }, { passive: false });
  }

  _frame(ts) {
    requestAnimationFrame(this._frame);
    if (!this.visible) { this._last = ts; return; }
    const dt = this._last ? Math.min(0.05, (ts - this._last) / 1000) : 0;
    this._last = ts;
    if (this.playing) this.t += dt;
    else if (!this.dirty) return;
    this.dirty = false;
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.opts.draw && this.opts.draw(this.ctx, this);
  }

  play() { this.playing = true; }
  pause() { this.playing = false; this.dirty = true; }
  toggle() { this.playing = !this.playing; this.dirty = true; return this.playing; }
  redraw() { this.dirty = true; }
  destroy() { this._ro.disconnect(); this._io.disconnect(); }
}

/* ---------------- helper di disegno ---------------- */

export const COL = { bg: '#080e1b' };
COL.grid = '#152238';
COL.gridSoft = '#101a2e';
COL.axis = '#3b4c72';
COL.txt = '#9dabc9';
COL.txtBright = '#e8edf9';
COL.cyan = '#22d3ee';
COL.violet = '#a78bfa';
COL.amber = '#fbbf24';
COL.green = '#34d399';
COL.pink = '#f472b6';
COL.red = '#fb7185';
COL.blue = '#60a5fa';

export function bg(ctx, s, color = COL.bg) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, s.w, s.h);
}

export function grid(ctx, x, y, w, h, stepX = 40, stepY = 40, color = COL.gridSoft) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let gx = x; gx <= x + w + .5; gx += stepX) { ctx.moveTo(Math.round(gx) + .5, y); ctx.lineTo(Math.round(gx) + .5, y + h); }
  for (let gy = y; gy <= y + h + .5; gy += stepY) { ctx.moveTo(x, Math.round(gy) + .5); ctx.lineTo(x + w, Math.round(gy) + .5); }
  ctx.stroke();
  ctx.restore();
}

export function arrow(ctx, x0, y0, x1, y1, { color = COL.cyan, width = 2.4, head = 9, alpha = 1, dash = null } = {}) {
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.lineWidth = width; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.setLineDash([]);
  if (len > 3) {
    const a = Math.atan2(dy, dx);
    const hh = Math.min(head, len * 0.55);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - hh * Math.cos(a - 0.42), y1 - hh * Math.sin(a - 0.42));
    ctx.lineTo(x1 - hh * Math.cos(a + 0.42), y1 - hh * Math.sin(a + 0.42));
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

export function dot(ctx, x, y, r = 4, color = COL.cyan, glow = true) {
  ctx.save();
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 12; }
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function text(ctx, str, x, y, { color = COL.txt, size = 12, align = 'left', baseline = 'middle', weight = '600', mono = true } = {}) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${mono ? 'ui-monospace, Menlo, Consolas, monospace' : 'system-ui, sans-serif'}`;
  ctx.textAlign = align; ctx.textBaseline = baseline;
  ctx.fillText(str, x, y);
  ctx.restore();
}

export function circle(ctx, cx, cy, r, { stroke = COL.axis, fill = null, width = 1, dash = null, alpha = 1 } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
  ctx.restore();
}

/** Piano cartesiano/complesso: converte coordinate matematiche in pixel. */
export function makePlane(cx, cy, scale) {
  return {
    cx, cy, scale,
    X: x => cx + x * scale,
    Y: y => cy - y * scale,
    inv: (px, py) => ({ x: (px - cx) / scale, y: (cy - py) / scale }),
  };
}

/** Assi del piano complesso con cerchio unitario. */
export function complexAxes(ctx, P, { r = 1, labels = true, unitCircle = true } = {}) {
  const R = r * P.scale;
  ctx.save();
  ctx.strokeStyle = COL.axis; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(P.cx - R * 1.25, P.cy); ctx.lineTo(P.cx + R * 1.25, P.cy);
  ctx.moveTo(P.cx, P.cy - R * 1.25); ctx.lineTo(P.cx, P.cy + R * 1.25);
  ctx.stroke();
  if (unitCircle) circle(ctx, P.cx, P.cy, R, { stroke: '#2a3a5c', dash: [4, 5] });
  if (labels) {
    text(ctx, 'reale →', P.cx + R * 1.28, P.cy + 12, { size: 10, color: '#59688c' });
    text(ctx, '↑ immaginario', P.cx + 6, P.cy - R * 1.28, { size: 10, color: '#59688c' });
    text(ctx, '1', P.X(1) + 4, P.cy + 11, { size: 10, color: '#59688c' });
    text(ctx, 'i', P.cx + 6, P.Y(1) - 2, { size: 10, color: '#59688c' });
  }
  ctx.restore();
}

/** Rettangolo arrotondato. */
export function roundRect(ctx, x, y, w, h, r = 6, { fill = null, stroke = null, width = 1, alpha = 1 } = {}) {
  const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
  ctx.restore();
}

/** Disegna una curva y=f(x) campionata su [x0,x1] in pixel. */
export function plot(ctx, { x, y, w, h }, fn, { color = COL.cyan, width = 2, samples = 400, yMin = -1, yMax = 1, alpha = 1, dash = null, glow = false } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  if (dash) ctx.setLineDash(dash);
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 10; }
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    const v = fn(u);
    const px = x + u * w;
    const py = y + h - ((v - yMin) / (yMax - yMin)) * h;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

export function hsl(i, n, l = 62) { return `hsl(${Math.round((i / Math.max(1, n)) * 320)}, 85%, ${l}%)`; }

/** Colore associato a una fase (0..2π) — utile per le ampiezze quantistiche. */
export function phaseColor(theta, l = 62) {
  const deg = ((theta * 180 / Math.PI) % 360 + 360) % 360;
  return `hsl(${deg.toFixed(0)}, 88%, ${l}%)`;
}

/* ============================================================
   FX — "juice" del videogioco: scintille, lampi, pulsazioni.
   Serve a rendere IMMEDIATAMENTE leggibile "stai andando bene"
   o "ci sei!". Il feedback immediato e multimodale (colore +
   movimento + suono) è quello che rende un'interfaccia
   comprensibile senza dover leggere istruzioni.
   ============================================================ */

export class FX {
  constructor(stage) {
    this.stage = stage;
    this.parts = [];
    this.flashT = 0;
    this.flashCol = '#34d399';
    this.ringT = 0; this.ringX = 0; this.ringY = 0;
  }
  /** Esplosione di scintille (successo). */
  burst(x, y, { n = 26, color = null, speed = 150, life = 0.75 } = {}) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const v = speed * (0.45 + Math.random() * 0.9);
      this.parts.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30,
        life, t: life,
        c: color || `hsl(${Math.floor(Math.random() * 60) + 140}, 90%, ${60 + Math.random() * 20}%)`,
        r: 1.6 + Math.random() * 2.6,
      });
    }
    this.ring(x, y);
    this.stage.play();
  }
  ring(x, y) { this.ringT = 0.55; this.ringX = x; this.ringY = y; }
  flash(color = '#34d399') { this.flashT = 0.32; this.flashCol = color; }
  /** Da chiamare a ogni frame, dopo il disegno principale. */
  draw(ctx, dt = 0.016) {
    const s = this.stage;
    if (this.ringT > 0) {
      const k = 1 - this.ringT / 0.55;
      ctx.save();
      ctx.globalAlpha = (1 - k) * 0.8;
      ctx.strokeStyle = '#7cf0c0'; ctx.lineWidth = 3 * (1 - k) + 1;
      ctx.beginPath(); ctx.arc(this.ringX, this.ringY, 8 + k * 60, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      this.ringT -= dt;
    }
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      p.t -= dt;
      if (p.t <= 0) { this.parts.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.t / p.life);
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    if (this.flashT > 0) {
      ctx.save();
      ctx.globalAlpha = (this.flashT / 0.32) * 0.16;
      ctx.fillStyle = this.flashCol;
      ctx.fillRect(0, 0, s.w, s.h);
      ctx.restore();
      this.flashT -= dt;
    }
    if (!this.parts.length && this.flashT <= 0 && this.ringT <= 0 && !s.opts.keepPlaying) s.pause();
  }
  get busy() { return this.parts.length > 0 || this.flashT > 0 || this.ringT > 0; }
}

/** Barra "quanto sei vicino": verde = ci sei, ambra = vicino, rosso = lontano. */
export function proximityBar(ctx, x, y, w, h, closeness, label = '') {
  const col = closeness > 0.97 ? COL.green : closeness > 0.75 ? COL.amber : COL.red;
  roundRect(ctx, x, y, w, h, h / 2, { fill: '#131f38', stroke: '#22304d' });
  roundRect(ctx, x, y, Math.max(3, w * Math.max(0, closeness)), h, h / 2, { fill: col, alpha: .92 });
  if (label) text(ctx, label, x + w + 8, y + h / 2, { size: 11, color: col });
  return col;
}

/** Suono che sale man mano che ti avvicini (feedback continuo). */
export function makeProximitySound(sfxTick) {
  let last = 0, lastVal = -1;
  return (closeness) => {
    const now = performance.now();
    if (now - last < 110) return;
    if (Math.abs(closeness - lastVal) < 0.02) return;
    last = now; lastVal = closeness;
    sfxTick(closeness);
  };
}

/**
 * Aggancia gli effetti a uno Stage già creato, senza toccarne il codice di disegno:
 * avvolge la funzione draw e ci disegna sopra scintille, lampi e onde d'urto.
 *
 *     const fx = attachFX(stage);
 *     fx.win();              // festeggia al centro
 *     fx.win(x, y);          // festeggia in un punto preciso
 */
export function attachFX(stage) {
  const fx = new FX(stage);
  const original = stage.opts.draw;
  stage.opts.draw = (ctx, s) => {
    original && original(ctx, s);
    fx.draw(ctx);
  };
  fx.win = (x, y, color = null) => {
    fx.burst(x ?? stage.w / 2, y ?? stage.h / 2, color ? { color } : {});
    fx.flash();
  };
  return fx;
}
