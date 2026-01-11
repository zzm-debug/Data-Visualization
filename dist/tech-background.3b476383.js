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
})({"tech-background.js":[function(require,module,exports) {
// ==============================
// 科技风数据大屏背景效果
// 第2层：点阵纹理生成
// 第3层：动态波纹/流光动画
// ==============================

(function () {
  'use strict';

  // ==============================
  // 第2层：点阵纹理生成
  // ==============================
  function initDotPattern() {
    var canvas = document.getElementById('dot-pattern');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'dot-pattern';
      canvas.className = 'bg-layer';
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;opacity:0.6;';
      document.body.appendChild(canvas);
    }
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width = window.innerWidth;
    var height = window.innerHeight;
    function draw() {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      var spacing = 20; // 点间距
      var dotSize = 1.5; // 点大小
      var opacity = 0.08; // 透明度

      ctx.fillStyle = "rgba(139, 92, 246, ".concat(opacity, ")"); // 紫色点

      for (var x = 0; x < width; x += spacing) {
        for (var y = 0; y < height; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    draw();

    // 窗口大小改变时重新绘制
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        width = window.innerWidth;
        height = window.innerHeight;
        draw();
      }, 100);
    });
  }

  // ==============================
  // 第3层：动态波纹/流光动画
  // ==============================
  function initWaveAnimation() {
    var canvas = document.getElementById('wave-animation');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'wave-animation';
      canvas.className = 'bg-layer';
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;opacity:0.4;';
      document.body.appendChild(canvas);
    }
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var time = 0;
    var animationId = null;
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    }
    resize();
    window.addEventListener('resize', function () {
      resize();
    });
    function drawWave() {
      ctx.clearRect(0, 0, width, height);

      // 创建多个波形层
      var waves = [{
        amplitude: 30,
        frequency: 0.01,
        speed: 0.02,
        color: 'rgba(88, 101, 242, 0.3)',
        offset: 0
      }, {
        amplitude: 40,
        frequency: 0.008,
        speed: 0.015,
        color: 'rgba(139, 92, 246, 0.25)',
        offset: Math.PI / 3
      }, {
        amplitude: 25,
        frequency: 0.012,
        speed: 0.025,
        color: 'rgba(59, 130, 246, 0.2)',
        offset: Math.PI / 2
      }];
      waves.forEach(function (wave, index) {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        var yBase = height * (0.3 + index * 0.2);
        for (var x = 0; x < width; x += 2) {
          var y = yBase + Math.sin(x * wave.frequency + time * wave.speed + wave.offset) * wave.amplitude + Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * wave.amplitude * 0.5;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // 添加渐变填充
        var gradient = ctx.createLinearGradient(0, yBase - wave.amplitude, 0, yBase + wave.amplitude);
        gradient.addColorStop(0, wave.color.replace('0.3', '0.1').replace('0.25', '0.08').replace('0.2', '0.06'));
        gradient.addColorStop(1, wave.color.replace('0.3', '0').replace('0.25', '0').replace('0.2', '0'));
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // 横向流动的光带
      var lightBands = 3;
      for (var i = 0; i < lightBands; i++) {
        var bandY = height / (lightBands + 1) * (i + 1);
        var bandWidth = width * 0.3;
        var bandX = (time * 100 + i * width * 0.3) % (width + bandWidth) - bandWidth;
        var bandGradient = ctx.createLinearGradient(bandX, bandY - 20, bandX + bandWidth, bandY + 20);
        bandGradient.addColorStop(0, 'rgba(88, 101, 242, 0)');
        bandGradient.addColorStop(0.5, 'rgba(88, 101, 242, 0.15)');
        bandGradient.addColorStop(1, 'rgba(88, 101, 242, 0)');
        ctx.fillStyle = bandGradient;
        ctx.fillRect(bandX, bandY - 20, bandWidth, 40);
      }
      time += 0.016; // 约60fps
      animationId = requestAnimationFrame(drawWave);
    }
    drawWave();

    // 页面可见性API，隐藏时暂停动画
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      } else {
        if (!animationId) {
          drawWave();
        }
      }
    });
  }

  // ==============================
  // 初始化
  // ==============================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        initDotPattern();
        initWaveAnimation();
      });
    } else {
      initDotPattern();
      initWaveAnimation();
    }
  }
  init();
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64438" + '/');
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","tech-background.js"], null)
//# sourceMappingURL=/tech-background.3b476383.js.map