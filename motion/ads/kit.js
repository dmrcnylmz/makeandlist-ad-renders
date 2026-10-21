// MakeAndList ad kit. Every ad is a pure function of time: window.__seek(t) draws the frame at t seconds, so the
// renderer can take any frame exactly (no wall clock). ?f=9x16 | 4x5 | 16x9 picks the format; the viewport is the
// canvas size, so a composition reads K.W / K.H and lays itself out for each format.
(function () {
  const q = new URLSearchParams(location.search);
  const F = q.get('f') || '9x16';
  const SCREENS = '../../docs/design-v2/screens/';
  const BRAND = '../../frontend/public/brand/';
  const PUB = '../../frontend/public/';
  const CANVAS = '../../docs/design-v2/canvas/';

  const ease = {
    linear: (x) => x,
    outCubic: (x) => 1 - Math.pow(1 - x, 3),
    outQuint: (x) => 1 - Math.pow(1 - x, 5),
    outExpo: (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    inOutExpo: (x) => (x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2),
    inCubic: (x) => x * x * x,
    outBack: (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    spring: (x) => 1 - Math.cos(x * Math.PI * 4.5) * Math.exp(-x * 6),
  };
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, p) => a + (b - a) * p;

  const K = {
    F, ease, clamp, lerp,
    get W() { return window.innerWidth; },
    get H() { return window.innerHeight; },
    v(o) { return o[F] !== undefined ? o[F] : o['9x16']; },
    screen: (name) => SCREENS + name + '.png',
    /** A design-canvas board rendered at 2x (docs/design-v2/canvas/<Board>.png). */
    canvas: (name) => CANVAS + name + '.png',
    brand: (name) => BRAND + name,
    pub: (p) => PUB + p,
    /** Progress 0..1 between a and b, eased. */
    p(T, a, b, e) { return (e || ease.outCubic)(clamp((T - a) / (b - a))); },
    /** Keyframes [[t, v], ...]. */
    k(T, keys, e) {
      const f = e || ease.inOutCubic;
      if (T <= keys[0][0]) return keys[0][1];
      for (let i = 1; i < keys.length; i++) {
        if (T <= keys[i][0]) {
          const a = keys[i - 1], b = keys[i];
          return lerp(a[1], b[1], f(b[0] === a[0] ? 1 : (T - a[0]) / (b[0] - a[0])));
        }
      }
      return keys[keys.length - 1][1];
    },
    /** Visible only between a and b, with fades. */
    win(T, a, b, fade = 0.25) { return Math.min(K.p(T, a, a + fade, ease.linear), 1 - K.p(T, b - fade, b, ease.linear)); },
    el(tag, opts = {}) {
      const n = document.createElement(tag);
      if (opts.cls) n.className = opts.cls;
      if (opts.style) Object.assign(n.style, opts.style);
      if (opts.html !== undefined) n.innerHTML = opts.html;
      if (opts.src) n.src = opts.src;
      (opts.parent || document.getElementById('stage')).appendChild(n);
      return n;
    },
    /** Absolutely positioned box. */
    box(x, y, w, h, opts = {}) {
      return K.el(opts.tag || 'div', { ...opts, cls: 'abs ' + (opts.cls || ''), style: { left: x + 'px', top: y + 'px', width: w + 'px', height: h === null ? 'auto' : h + 'px', ...(opts.style || {}) } });
    },
    /** Split text into word spans (lines split on \n). */
    words(parent, text, wordCls) {
      const spans = [];
      text.split('\n').forEach((line, li) => {
        const mask = K.el('span', { cls: 'line-mask', parent });
        line.split(' ').forEach((w, wi, all) => {
          const s = K.el('span', { cls: 'word ' + (wordCls || ''), parent: mask, html: w + (wi < all.length - 1 ? ' ' : '') });
          spans.push(s);
        });
      });
      return spans;
    },
    /** Word-by-word entrance: up (default), scale, blur, drop. Optional exit at `out`. */
    reveal(spans, T, start, o = {}) {
      const st = o.stagger ?? 0.06, d = o.dur ?? 0.55, kind = o.kind || 'up';
      spans.forEach((s, i) => {
        const p = K.p(T, start + i * st, start + i * st + d, o.ease || ease.outExpo);
        let x = o.out !== undefined ? 1 - K.p(T, o.out + i * 0.02, o.out + 0.3 + i * 0.02, ease.inCubic) : 1;
        const vis = p * x;
        let tr = '';
        if (kind === 'up') tr = `translateY(${(1 - p) * 110}%)`;
        if (kind === 'scale') tr = `scale(${0.6 + 0.4 * ease.outBack(p)})`;
        if (kind === 'drop') tr = `translateY(${-(1 - p) * 60}px) rotate(${(1 - p) * -6}deg)`;
        if (kind === 'blur') { s.style.filter = `blur(${(1 - p) * 18}px)`; tr = `translateY(${(1 - p) * 24}px)`; }
        if (o.out !== undefined) tr += ` translateY(${-(1 - x) * 60}%)`;
        s.style.transform = tr;
        s.style.opacity = kind === 'up' ? (o.out !== undefined ? x : 1) * (p > 0 ? 1 : 0) : vis;
      });
    },
    /** A phone with a screenshot that scrolls. */
    phone(x, y, w, src, opts = {}) {
      const h = opts.h || Math.round(w * 2.05);
      const root = K.box(x, y, w, h, { cls: 'phone', parent: opts.parent });
      const scr = K.el('div', { cls: 'screen', parent: root });
      K.el('div', { cls: 'notch', parent: root });
      const img = K.el('img', { src, parent: scr });
      return { root, img, w, h, scroll(px) { img.style.transform = `translateY(${-px}px)`; },
        /** Scroll as a fraction of what can scroll. */
        scrollTo(f) { const max = Math.max(0, img.getBoundingClientRect().height / (root._s || 1) - (h - 28)); img.style.transform = `translateY(${-max * f}px)`; },
        set(src2) { if (img.getAttribute('src') !== src2) img.src = src2; } };
    },
    /**
     * A phone holding several app screens side by side. draw(pos, scroll) shows screen `pos` (fractional while swiping,
     * with motion blur by speed); scroll[i] is 0..1 of what screen i can scroll. The screen's own tab bar (the last
     * 170 px of a phone shot) stays pinned to the bottom, as on a real phone.
     */
    phoneDeck(x, y, w, srcs, opts = {}) {
      const h = opts.h || Math.round(w * 2.05);
      const root = K.box(x, y, w, h, { cls: 'phone', parent: opts.parent });
      const scr = K.el('div', { cls: 'screen', parent: root });
      K.el('div', { cls: 'notch', parent: root });
      const sw = w - 28, sh = h - 28;
      const BAR = opts.bar ?? 172; // px of the 780-wide shot
      const layers = srcs.map((src) => {
        const wrap = K.el('div', { parent: scr, style: { position: 'absolute', left: 0, top: 0, width: sw + 'px', height: sh + 'px', overflow: 'hidden', background: '#FAF7EE' } });
        const img = K.el('img', { src, parent: wrap, style: { position: 'absolute', left: 0, top: 0, width: sw + 'px', height: 'auto' } });
        const bar = K.el('div', { parent: wrap, style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: (BAR * sw / 780) + 'px',
          backgroundImage: `url("${src}")`, backgroundSize: '100% auto', backgroundPosition: 'bottom', display: opts.noBar ? 'none' : 'block' } });
        return { wrap, img, bar };
      });
      return { root, w, h, sw, sh,
        /** vel: screens per frame (pass posAt(T) - posAt(T - 1/30)), so a still frame is drawn the same as in the film. */
        draw(pos, scroll = [], vel = 0) {
          const v = Math.abs(vel);
          layers.forEach((L, i) => {
            const nh = L.img.naturalHeight * (sw / (L.img.naturalWidth || 780));
            const usable = nh - (opts.noBar ? 0 : BAR * sw / 780);
            const max = Math.max(0, usable - sh + (opts.noBar ? 0 : BAR * sw / 780));
            L.img.style.transform = `translateY(${-max * (scroll[i] || 0)}px)`;
            const off = (i - pos) * sw;
            L.wrap.style.transform = `translateX(${off}px)`;
            L.wrap.style.visibility = Math.abs(i - pos) < 1.02 ? 'visible' : 'hidden';
            L.wrap.style.filter = v > 0.004 ? `blur(${Math.min(14, v * 220)}px)` : 'none';
          });
        } };
    },
    browser(x, y, w, h, src, url, opts = {}) {
      const root = K.box(x, y, w, h, { cls: 'browser', parent: opts.parent });
      K.el('div', { cls: 'bar', parent: root, html: '<i></i><i></i><i></i><span>' + (url || 'makeandlist.com') + '</span>' });
      const view = K.el('div', { cls: 'view', parent: root, style: { height: (h - 46) + 'px' } });
      const img = K.el('img', { src, parent: view });
      return { root, img, view, w, h, scroll(px) { img.style.transform = `translateY(${-px}px)`; },
        scrollTo(f) { const max = Math.max(0, img.naturalHeight * (w / (img.naturalWidth || 1)) - (h - 46)); img.style.transform = `translateY(${-max * f}px)`; },
        set(src2) { if (img.getAttribute('src') !== src2) img.src = src2; } };
    },
    cursor() {
      const c = K.el('div', { cls: 'cursor', html: '<svg viewBox="0 0 24 24" width="46" height="46"><path d="M4 2 L4 20 L9 15 L12.5 22 L15.5 20.6 L12 13.8 L19 13.8 Z" fill="#1F1F1F" stroke="#FFFDF8" stroke-width="1.6" stroke-linejoin="round"/></svg>' });
      const r = K.el('div', { cls: 'ripple' });
      return {
        at(x, y, press) { c.style.transform = `translate(${x}px, ${y}px) scale(${press ? 0.86 : 1})`; },
        hide(o) { c.style.opacity = o; },
        ripple(x, y, T, t0) {
          const p = K.p(T, t0, t0 + 0.55, ease.outCubic);
          const on = T >= t0 && T <= t0 + 0.55;
          r.style.opacity = on ? 1 - p : 0;
          r.style.left = x + 'px'; r.style.top = y + 'px';
          r.style.transform = `scale(${0.3 + p})`;
        },
      };
    },
    /** A countable number. */
    count(T, a, b, from, to, fmt) { const v = lerp(from, to, K.p(T, a, b, ease.outCubic)); return fmt ? fmt(v) : Math.round(v).toLocaleString('en-US'); },
    /** The end card: the stacked logo and the one line to act on. */
    endCard(start, opts = {}) {
      const W = K.W, H = K.H;
      const bg = K.box(0, 0, W, H, { style: { background: opts.dark ? '#1F1F1F' : 'var(--ivory)', zIndex: 90, opacity: 0 } });
      const logoW = Math.min(W * 0.52, 560);
      const logo = K.el('img', { src: K.brand(opts.dark ? 'makeandlist-logo-stacked-ivory.svg' : 'makeandlist-logo-stacked.svg'), parent: bg,
        style: { position: 'absolute', left: (W - logoW) / 2 + 'px', top: H * 0.3 + 'px', width: logoW + 'px' } });
      const line = K.el('div', { parent: bg, cls: 'serif', html: opts.line || 'One idea. More ways to make it real.',
        // The stacked logo is 859 / 1055 as tall as it is wide: the line starts clear of it.
        style: { position: 'absolute', left: '60px', right: '60px', top: H * 0.3 + logoW * 0.814 + 48 + 'px', textAlign: 'center', fontSize: Math.round(W * 0.052) + 'px', lineHeight: 1.15, color: opts.dark ? '#FAF7EE' : '#1F1F1F' } });
      const cta = K.el('div', { parent: bg, cls: 'chip lime', html: opts.cta || 'Start free · makeandlist.com',
        style: { position: 'absolute', left: '50%', top: H * 0.3 + logoW * 0.814 + 48 + Math.round(W * 0.052) * 2.3 + 56 + 'px', fontSize: Math.round(W * 0.036) + 'px', padding: '22px 40px', transform: 'translateX(-50%)' } });
      return (T) => {
        bg.style.opacity = K.p(T, start, start + 0.35, ease.linear);
        const pl = K.p(T, start + 0.1, start + 0.9, ease.outExpo);
        logo.style.transform = `translateY(${(1 - pl) * 40}px) scale(${0.92 + 0.08 * pl})`; logo.style.opacity = pl;
        const p2 = K.p(T, start + 0.45, start + 1.1, ease.outExpo);
        line.style.opacity = p2; line.style.transform = `translateY(${(1 - p2) * 30}px)`;
        const p3 = K.p(T, start + 0.8, start + 1.4, ease.outBack);
        cta.style.opacity = K.p(T, start + 0.8, start + 1.0, ease.linear); cta.style.transform = `translateX(-50%) scale(${0.8 + 0.2 * p3})`;
      };
    },
    /** Story-style progress bar across the top. */
    progress(dur) { const p = K.el('div', { cls: 'progress', html: '<b></b>' }); const b = p.firstChild; return (T) => { b.style.width = (100 * clamp(T / dur)) + '%'; }; },
    demoTag(text, x, y) { return K.box(x, y, null, null, { cls: 'demo', html: text || 'Demo workspace · sample data', style: { width: 'auto', height: 'auto' } }); },

    /** Register the composition. meta: { id, title, dur, cues, bpm, mood, caption, short }. */
    run(meta, draw) {
      window.__meta = { ...meta, format: F };
      const imgs = () => Array.from(document.images);
      window.__ready = (async () => {
        if (document.fonts) {
          await document.fonts.load('700 40px "Playfair Display"');
          await document.fonts.load('700 40px "Archivo"');
          await document.fonts.load('500 20px "IBM Plex Mono"');
          await document.fonts.ready;
        }
        await Promise.all(imgs().map((i) => (i.complete ? null : new Promise((r) => { i.onload = r; i.onerror = r; }))));
        await Promise.all(imgs().map((i) => (i.decode ? i.decode().catch(() => null) : null)));
        return {
          fonts: { playfair: document.fonts.check('700 40px "Playfair Display"'), archivo: document.fonts.check('700 40px "Archivo"'), mono: document.fonts.check('500 20px "IBM Plex Mono"') },
          broken: imgs().filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')),
        };
      })();
      window.__seek = (t) => draw(t);
      const tq = q.get('t');
      window.__ready.then(() => draw(tq !== null ? Number(tq) : 0));
    },
  };
  window.K = K;
})();
