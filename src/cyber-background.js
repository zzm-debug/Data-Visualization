// ==============================
// Cyberpunk / Electronic dashboard background (decoupled visual layer)
// Layers:
// 1) Base gradient (CSS: .bg-base)
// 2) Subtle grain / dot texture (canvas)
// 3) Slow energy flow (wave + light bands) (canvas)
// Exposes: window.DashboardBackground.{enable,disable,setTheme,isEnabled}
// ==============================
(function () {
  'use strict';

  const THEME = {
    name: 'cyberpunk',
    // used by JS animation colors; base gradient lives in CSS
    colors: {
      purple: 'rgba(124, 58, 237, 1)',     // violet
      pink: 'rgba(255, 59, 212, 1)',       // magenta
      blue: 'rgba(50, 167, 255, 1)',       // electric blue
      cyan: 'rgba(0, 255, 240, 1)'         // accent cyan (very low usage)
    }
  };

  const state = {
    enabled: true,
    theme: THEME.name
  };

  let rafId = 0;
  let lastT = 0;
  let cachedSize = { w: 0, h: 0, dpr: 1 };

  let rootEl = null;
  let grainCanvas = null;
  let grainCtx = null;
  let energyCanvas = null;
  let energyCtx = null;
  let listenersBound = false;

  function ensureRoot() {
    let root = document.getElementById('bg-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'bg-root';
      document.body.prepend(root);
    }

    // If user provided #bg-root in HTML, this keeps it consistent.
    root.style.position = 'fixed';
    root.style.inset = '0';
    root.style.zIndex = '0';
    root.style.pointerEvents = 'none';

    if (!root.querySelector('.bg-base')) {
      const base = document.createElement('div');
      base.className = 'bg-base';
      root.appendChild(base);
    }

    rootEl = root;
    return root;
  }

  function createCanvas(id, className, zIndex, opacity) {
    const root = ensureRoot();

    let c = root.querySelector(`#${id}`);
    if (!c) {
      c = document.createElement('canvas');
      c.id = id;
      c.className = `bg-canvas ${className}`.trim();
      c.setAttribute('aria-hidden', 'true');
      root.appendChild(c);
    }

    c.style.position = 'absolute';
    c.style.inset = '0';
    c.style.width = '100%';
    c.style.height = '100%';
    c.style.zIndex = String(zIndex);
    c.style.opacity = String(opacity);
    c.style.pointerEvents = 'none';

    return c;
  }

  function resizeCanvas(canvas, ctx) {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    // Important: reset transform to avoid accumulating scale on repeated resize.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cachedSize = { w, h, dpr };
    return cachedSize;
  }

  function rnd(seed) {
    // deterministic-ish RNG (mulberry32) so grain doesn't "sparkle"
    let t = seed + 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function drawGrain() {
    if (!grainCtx) return;
    const { w, h } = cachedSize;

    grainCtx.clearRect(0, 0, w, h);

    // Grain: sparse small dots + scanlines (very low alpha)
    // Dots
    const dotCount = Math.floor((w * h) / 1400); // density tuned for 1080p-ish screens
    const seed = 1337;

    grainCtx.globalCompositeOperation = 'source-over';

    for (let i = 0; i < dotCount; i++) {
      const r = rnd(seed + i * 97);
      const x = Math.floor(r * w);
      const y = Math.floor(rnd(seed + i * 193) * h);

      // Vary size and alpha slightly
      const size = 0.6 + rnd(seed + i * 7) * 0.9;
      const a = 0.04 + rnd(seed + i * 11) * 0.05;
      const tint = rnd(seed + i * 23);

      // Slightly biased to purple/blue tones
      const c =
        tint < 0.45 ? `rgba(124,58,237,${a})` :
        tint < 0.85 ? `rgba(50,167,255,${a})` :
        `rgba(255,59,212,${a})`;

      grainCtx.fillStyle = c;
      grainCtx.fillRect(x, y, size, size);
    }

    // Scanlines (subtle)
    grainCtx.fillStyle = 'rgba(255,255,255,0.018)';
    for (let y = 0; y < h; y += 3) {
      grainCtx.fillRect(0, y, w, 1);
    }
  }

  function hexToRgba(hex, alpha) {
    // supports #RRGGBB
    const h = (hex || '').replace('#', '');
    if (h.length !== 6) return `rgba(255,255,255,${alpha})`;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function getCssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v || '').trim() || fallback;
  }

  function drawEnergy(t) {
    if (!energyCtx) return;
    const { w, h } = cachedSize;

    energyCtx.clearRect(0, 0, w, h);
    energyCtx.globalCompositeOperation = 'source-over';

    // Soft vignette to keep focus center-ish
    const vignette = energyCtx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * 0.15, w * 0.5, h * 0.5, Math.min(w, h) * 0.75);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.38)');
    energyCtx.fillStyle = vignette;
    energyCtx.fillRect(0, 0, w, h);

    // Theme colors from CSS vars (so theme switching works)
    const cPurple = getCssVar('--accent-violet', '#7c3aed');
    const cPink = getCssVar('--accent-pink', '#ff3bd4');
    const cBlue = getCssVar('--accent-blue', '#32a7ff');

    // ===== Wave / spectrum lines (slow) =====
    const lines = [
      { y: h * 0.26, amp: 22, f: 0.012, speed: 0.00055, color: hexToRgba(cBlue, 0.22) },
      { y: h * 0.40, amp: 30, f: 0.010, speed: 0.00048, color: hexToRgba(cPurple, 0.22) },
      { y: h * 0.58, amp: 18, f: 0.014, speed: 0.00062, color: hexToRgba(cPink, 0.18) }
    ];

    const step = 8; // perf-friendly
    for (const ln of lines) {
      const grad = energyCtx.createLinearGradient(0, ln.y - ln.amp * 1.2, w, ln.y + ln.amp * 1.2);
      grad.addColorStop(0, hexToRgba(cPurple, 0.06));
      grad.addColorStop(0.5, ln.color);
      grad.addColorStop(1, hexToRgba(cBlue, 0.06));

      energyCtx.beginPath();
      for (let x = 0; x <= w; x += step) {
        const p = x / w;
        const slow = Math.sin((t * ln.speed) + p * 6.0) * 0.55 + Math.sin((t * ln.speed * 1.7) + p * 2.4) * 0.45;
        const y = ln.y + Math.sin(x * ln.f + t * ln.speed * 40) * ln.amp * slow;
        if (x === 0) energyCtx.moveTo(x, y);
        else energyCtx.lineTo(x, y);
      }
      energyCtx.strokeStyle = grad;
      energyCtx.lineWidth = 2;
      energyCtx.shadowColor = ln.color;
      energyCtx.shadowBlur = 10;
      energyCtx.stroke();
      energyCtx.shadowBlur = 0;
    }

    // ===== Diagonal flowing light bands (very subtle, slow) =====
    const bandCount = 3;
    for (let i = 0; i < bandCount; i++) {
      const bandW = w * 0.42;
      const bandH = 120;
      const base = (t * 0.018 + i * 0.33) % 1;
      const x = -bandW + base * (w + bandW * 2);
      const y = h * (0.18 + i * 0.26);

      energyCtx.save();
      energyCtx.translate(x, y);
      energyCtx.rotate(-Math.PI / 12); // ~ -15deg

      const g = energyCtx.createLinearGradient(0, 0, bandW, 0);
      g.addColorStop(0, hexToRgba(cBlue, 0));
      g.addColorStop(0.35, hexToRgba(cPurple, 0.06));
      g.addColorStop(0.5, hexToRgba(cPink, 0.10));
      g.addColorStop(0.65, hexToRgba(cPurple, 0.06));
      g.addColorStop(1, hexToRgba(cBlue, 0));

      energyCtx.fillStyle = g;
      energyCtx.fillRect(0, -bandH / 2, bandW, bandH);
      energyCtx.restore();
    }

    // ===== Tiny drifting particles (low frequency) =====
    const particleN = 26;
    for (let i = 0; i < particleN; i++) {
      const pSeed = 9001 + i * 233;
      const px = (rnd(pSeed) * w + (t * 0.012 * (30 + i)) ) % w;
      const py = (rnd(pSeed + 17) * h - (t * 0.006 * (18 + i)) ) % h;
      const r = 0.6 + rnd(pSeed + 31) * 1.6;
      const a = 0.04 + rnd(pSeed + 47) * 0.08;
      const col = i % 3 === 0 ? hexToRgba(cPink, a) : (i % 3 === 1 ? hexToRgba(cPurple, a) : hexToRgba(cBlue, a));
      energyCtx.fillStyle = col;
      energyCtx.beginPath();
      energyCtx.arc(px, py < 0 ? py + h : py, r, 0, Math.PI * 2);
      energyCtx.fill();
    }
  }

  function loop(ts) {
    if (!state.enabled) return;

    if (!lastT) lastT = ts;
    const dt = ts - lastT;
    lastT = ts;

    // In case browser throttles / resumes, clamp dt.
    if (dt > 200) {
      // keep motion continuous but avoid big jumps
      lastT = ts - 16;
    }

    drawEnergy(ts);
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    lastT = 0;
  }

  let resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!state.enabled) return;
      if (!grainCanvas || !energyCanvas) return;
      resizeCanvas(grainCanvas, grainCtx);
      resizeCanvas(energyCanvas, energyCtx);
      drawGrain();
    }, 90);
  }

  function onVisibilityChange() {
    if (!state.enabled) return;
    if (document.hidden) stop();
    else if (!rafId) rafId = requestAnimationFrame(loop);
  }

  function enable(opts) {
    if (opts && typeof opts === 'object') {
      if (typeof opts.enabled === 'boolean') state.enabled = opts.enabled;
      if (typeof opts.theme === 'string') state.theme = opts.theme;
    }

    state.enabled = true;
    document.documentElement.dataset.theme = state.theme;

    const root = ensureRoot();
    root.style.display = '';

    grainCanvas = createCanvas('bg-grain', 'bg-grain', 1, 0.55);
    grainCtx = grainCanvas.getContext('2d', { alpha: true });

    energyCanvas = createCanvas('bg-energy', 'bg-energy', 2, 0.62);
    energyCtx = energyCanvas.getContext('2d', { alpha: true });

    resizeCanvas(grainCanvas, grainCtx);
    resizeCanvas(energyCanvas, energyCtx);
    drawGrain();

    if (!listenersBound) {
      window.addEventListener('resize', onResize, { passive: true });
      document.addEventListener('visibilitychange', onVisibilityChange);
      listenersBound = true;
    }

    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  function disable() {
    state.enabled = false;
    stop();
    // Keep listeners bound (cheap) to avoid re-binding mistakes; they early-return when disabled.
    if (rootEl) rootEl.style.display = 'none';
  }

  function setTheme(themeName) {
    state.theme = themeName || THEME.name;
    document.documentElement.dataset.theme = state.theme;
    // re-render once with new vars
    if (state.enabled) {
      drawGrain();
      drawEnergy(performance.now());
    }
  }

  function isEnabled() {
    return !!state.enabled;
  }

  // Public API (for easy on/off / theme replacement)
  window.DashboardBackground = {
    enable,
    disable,
    setTheme,
    isEnabled
  };

  // Auto init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => enable({ theme: THEME.name }));
  } else {
    enable({ theme: THEME.name });
  }
})();


