// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"cyber-background.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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

  var THEME = {
    name: 'cyberpunk',
    // used by JS animation colors; base gradient lives in CSS
    colors: {
      purple: 'rgba(124, 58, 237, 1)',
      // violet
      pink: 'rgba(255, 59, 212, 1)',
      // magenta
      blue: 'rgba(50, 167, 255, 1)',
      // electric blue
      cyan: 'rgba(0, 255, 240, 1)' // accent cyan (very low usage)
    }
  };
  var state = {
    enabled: true,
    theme: THEME.name
  };
  var rafId = 0;
  var lastT = 0;
  var cachedSize = {
    w: 0,
    h: 0,
    dpr: 1
  };
  var rootEl = null;
  var grainCanvas = null;
  var grainCtx = null;
  var energyCanvas = null;
  var energyCtx = null;
  var listenersBound = false;
  function ensureRoot() {
    var root = document.getElementById('bg-root');
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
      var base = document.createElement('div');
      base.className = 'bg-base';
      root.appendChild(base);
    }
    rootEl = root;
    return root;
  }
  function createCanvas(id, className, zIndex, opacity) {
    var root = ensureRoot();
    var c = root.querySelector("#".concat(id));
    if (!c) {
      c = document.createElement('canvas');
      c.id = id;
      c.className = "bg-canvas ".concat(className).trim();
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
    var dpr = window.devicePixelRatio || 1;
    var w = window.innerWidth || 1;
    var h = window.innerHeight || 1;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = "".concat(w, "px");
    canvas.style.height = "".concat(h, "px");

    // Important: reset transform to avoid accumulating scale on repeated resize.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cachedSize = {
      w: w,
      h: h,
      dpr: dpr
    };
    return cachedSize;
  }
  function rnd(seed) {
    // deterministic-ish RNG (mulberry32) so grain doesn't "sparkle"
    var t = seed + 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  function drawGrain() {
    if (!grainCtx) return;
    var _cachedSize = cachedSize,
      w = _cachedSize.w,
      h = _cachedSize.h;
    grainCtx.clearRect(0, 0, w, h);

    // Grain: sparse small dots + scanlines (very low alpha)
    // Dots
    var dotCount = Math.floor(w * h / 1400); // density tuned for 1080p-ish screens
    var seed = 1337;
    grainCtx.globalCompositeOperation = 'source-over';
    for (var i = 0; i < dotCount; i++) {
      var r = rnd(seed + i * 97);
      var x = Math.floor(r * w);
      var y = Math.floor(rnd(seed + i * 193) * h);

      // Vary size and alpha slightly
      var size = 0.6 + rnd(seed + i * 7) * 0.9;
      var a = 0.04 + rnd(seed + i * 11) * 0.05;
      var tint = rnd(seed + i * 23);

      // Slightly biased to purple/blue tones
      var c = tint < 0.45 ? "rgba(124,58,237,".concat(a, ")") : tint < 0.85 ? "rgba(50,167,255,".concat(a, ")") : "rgba(255,59,212,".concat(a, ")");
      grainCtx.fillStyle = c;
      grainCtx.fillRect(x, y, size, size);
    }

    // Scanlines (subtle)
    grainCtx.fillStyle = 'rgba(255,255,255,0.018)';
    for (var _y = 0; _y < h; _y += 3) {
      grainCtx.fillRect(0, _y, w, 1);
    }
  }
  function hexToRgba(hex, alpha) {
    // supports #RRGGBB
    var h = (hex || '').replace('#', '');
    if (h.length !== 6) return "rgba(255,255,255,".concat(alpha, ")");
    var r = parseInt(h.slice(0, 2), 16);
    var g = parseInt(h.slice(2, 4), 16);
    var b = parseInt(h.slice(4, 6), 16);
    return "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(alpha, ")");
  }
  function getCssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v || '').trim() || fallback;
  }
  function drawEnergy(t) {
    if (!energyCtx) return;
    var _cachedSize2 = cachedSize,
      w = _cachedSize2.w,
      h = _cachedSize2.h;
    energyCtx.clearRect(0, 0, w, h);
    energyCtx.globalCompositeOperation = 'source-over';

    // Soft vignette to keep focus center-ish
    var vignette = energyCtx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * 0.15, w * 0.5, h * 0.5, Math.min(w, h) * 0.75);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.38)');
    energyCtx.fillStyle = vignette;
    energyCtx.fillRect(0, 0, w, h);

    // Theme colors from CSS vars (so theme switching works)
    var cPurple = getCssVar('--accent-violet', '#7c3aed');
    var cPink = getCssVar('--accent-pink', '#ff3bd4');
    var cBlue = getCssVar('--accent-blue', '#32a7ff');

    // ===== Wave / spectrum lines (slow) =====
    var lines = [{
      y: h * 0.26,
      amp: 22,
      f: 0.012,
      speed: 0.00055,
      color: hexToRgba(cBlue, 0.22)
    }, {
      y: h * 0.40,
      amp: 30,
      f: 0.010,
      speed: 0.00048,
      color: hexToRgba(cPurple, 0.22)
    }, {
      y: h * 0.58,
      amp: 18,
      f: 0.014,
      speed: 0.00062,
      color: hexToRgba(cPink, 0.18)
    }];
    var step = 8; // perf-friendly
    for (var _i = 0, _lines = lines; _i < _lines.length; _i++) {
      var ln = _lines[_i];
      var grad = energyCtx.createLinearGradient(0, ln.y - ln.amp * 1.2, w, ln.y + ln.amp * 1.2);
      grad.addColorStop(0, hexToRgba(cPurple, 0.06));
      grad.addColorStop(0.5, ln.color);
      grad.addColorStop(1, hexToRgba(cBlue, 0.06));
      energyCtx.beginPath();
      for (var x = 0; x <= w; x += step) {
        var p = x / w;
        var slow = Math.sin(t * ln.speed + p * 6.0) * 0.55 + Math.sin(t * ln.speed * 1.7 + p * 2.4) * 0.45;
        var y = ln.y + Math.sin(x * ln.f + t * ln.speed * 40) * ln.amp * slow;
        if (x === 0) energyCtx.moveTo(x, y);else energyCtx.lineTo(x, y);
      }
      energyCtx.strokeStyle = grad;
      energyCtx.lineWidth = 2;
      energyCtx.shadowColor = ln.color;
      energyCtx.shadowBlur = 10;
      energyCtx.stroke();
      energyCtx.shadowBlur = 0;
    }

    // ===== Diagonal flowing light bands (very subtle, slow) =====
    var bandCount = 3;
    for (var i = 0; i < bandCount; i++) {
      var bandW = w * 0.42;
      var bandH = 120;
      var base = (t * 0.018 + i * 0.33) % 1;
      var _x = -bandW + base * (w + bandW * 2);
      var _y2 = h * (0.18 + i * 0.26);
      energyCtx.save();
      energyCtx.translate(_x, _y2);
      energyCtx.rotate(-Math.PI / 12); // ~ -15deg

      var g = energyCtx.createLinearGradient(0, 0, bandW, 0);
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
    var particleN = 26;
    for (var _i2 = 0; _i2 < particleN; _i2++) {
      var pSeed = 9001 + _i2 * 233;
      var px = (rnd(pSeed) * w + t * 0.012 * (30 + _i2)) % w;
      var py = (rnd(pSeed + 17) * h - t * 0.006 * (18 + _i2)) % h;
      var r = 0.6 + rnd(pSeed + 31) * 1.6;
      var a = 0.04 + rnd(pSeed + 47) * 0.08;
      var col = _i2 % 3 === 0 ? hexToRgba(cPink, a) : _i2 % 3 === 1 ? hexToRgba(cPurple, a) : hexToRgba(cBlue, a);
      energyCtx.fillStyle = col;
      energyCtx.beginPath();
      energyCtx.arc(px, py < 0 ? py + h : py, r, 0, Math.PI * 2);
      energyCtx.fill();
    }
  }
  function loop(ts) {
    if (!state.enabled) return;
    if (!lastT) lastT = ts;
    var dt = ts - lastT;
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
  var resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!state.enabled) return;
      if (!grainCanvas || !energyCanvas) return;
      resizeCanvas(grainCanvas, grainCtx);
      resizeCanvas(energyCanvas, energyCtx);
      drawGrain();
    }, 90);
  }
  function onVisibilityChange() {
    if (!state.enabled) return;
    if (document.hidden) stop();else if (!rafId) rafId = requestAnimationFrame(loop);
  }
  function enable(opts) {
    if (opts && _typeof(opts) === 'object') {
      if (typeof opts.enabled === 'boolean') state.enabled = opts.enabled;
      if (typeof opts.theme === 'string') state.theme = opts.theme;
    }
    state.enabled = true;
    document.documentElement.dataset.theme = state.theme;
    var root = ensureRoot();
    root.style.display = '';
    grainCanvas = createCanvas('bg-grain', 'bg-grain', 1, 0.55);
    grainCtx = grainCanvas.getContext('2d', {
      alpha: true
    });
    energyCanvas = createCanvas('bg-energy', 'bg-energy', 2, 0.62);
    energyCtx = energyCanvas.getContext('2d', {
      alpha: true
    });
    resizeCanvas(grainCanvas, grainCtx);
    resizeCanvas(energyCanvas, energyCtx);
    drawGrain();
    if (!listenersBound) {
      window.addEventListener('resize', onResize, {
        passive: true
      });
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
    enable: enable,
    disable: disable,
    setTheme: setTheme,
    isEnabled: isEnabled
  };

  // Auto init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      return enable({
        theme: THEME.name
      });
    });
  } else {
    enable({
      theme: THEME.name
    });
  }
})();
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50038" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","cyber-background.js"], null)
//# sourceMappingURL=/cyber-background.70e797d7.js.map