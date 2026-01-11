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
})({"QYwq":[function(require,module,exports) {
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// ============================================
// heatmap-toggle.js - 2D/3D热力图切换控制器
// ============================================

(function () {
  var currentMode = '3D'; // 默认3D模式
  var heatmap2DScript = null;
  var heatmap3DScript = null;

  // 切换按钮
  var toggleBtn = document.getElementById('heatmap-toggle');
  if (!toggleBtn) {
    console.error('❌ 找不到切换按钮');
    return;
  }

  // 更新按钮文本
  function updateButtonText() {
    var toggleText = toggleBtn.querySelector('.toggle-text');
    if (toggleText) {
      toggleText.textContent = currentMode;
    }
  }

  // 清除热力图容器
  function clearHeatmap() {
    var container = document.getElementById('heatmap');
    if (container) {
      container.innerHTML = '';
    }
    // 清除tooltip
    d3.select("body").selectAll(".heatmap-tooltip").remove();
  }

  // 移除动态加载的脚本
  function removeDynamicScripts() {
    var dynamic2D = document.getElementById('heatmap-2d-script');
    if (dynamic2D && dynamic2D.parentNode) {
      dynamic2D.parentNode.removeChild(dynamic2D);
      heatmap2DScript = null;
    }
    var dynamic3D = document.getElementById('heatmap-3d-script');
    // 只有当3D脚本是动态加载的时才移除（不是HTML中原始加载的）
    if (dynamic3D && dynamic3D.parentNode) {
      var original3D = document.querySelector('script[src*="heatmap.js"]:not([src*="heatmap-2D"]):not([id])');
      if (dynamic3D !== original3D) {
        dynamic3D.parentNode.removeChild(dynamic3D);
        heatmap3DScript = null;
      }
    }
  }

  // 加载2D热力图
  function load2DHeatmap() {
    return new Promise(function (resolve, reject) {
      // 检查容器是否存在
      var container = document.getElementById('heatmap');
      if (!container) {
        console.error('❌ 找不到heatmap容器');
        reject(new Error('找不到heatmap容器'));
        return;
      }

      // 先清除内容
      clearHeatmap();
      removeDynamicScripts();

      // 从已加载的heatmap.js脚本获取正确路径
      var basePath = '';
      var existingScript = document.querySelector('script[src*="heatmap.js"]:not([src*="heatmap-2D"]):not([id*="heatmap-3d"])');
      if (existingScript && existingScript.src) {
        var scriptPath = existingScript.src;
        var lastSlash = scriptPath.lastIndexOf('/');
        basePath = scriptPath.substring(0, lastSlash + 1);
        console.log('📂 从已加载脚本获取路径:', basePath, '来源:', scriptPath);
      } else {
        // 如果找不到，从toggle脚本获取
        var toggleScript = document.querySelector('script[src*="heatmap-toggle"]');
        if (toggleScript && toggleScript.src) {
          var _scriptPath = toggleScript.src;
          var _lastSlash = _scriptPath.lastIndexOf('/');
          basePath = _scriptPath.substring(0, _lastSlash + 1);
          console.log('📂 从toggle脚本获取路径:', basePath);
        } else {
          basePath = '';
          console.log('📂 使用相对路径');
        }
      }
      var timestamp = new Date().getTime();
      var script = document.createElement('script');
      script.src = "".concat(basePath, "heatmap-2D.js?t=").concat(timestamp);
      script.id = 'heatmap-2d-script';
      script.async = false; // 确保顺序执行

      console.log('📂 加载2D热力图脚本，完整路径:', script.src);
      var resolved = false;
      var timeout = setTimeout(function () {
        if (!resolved) {
          resolved = true;
          console.error('❌ 2D热力图加载超时');
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
          reject(new Error('2D热力图加载超时'));
        }
      }, 10000); // 10秒超时

      script.onload = function () {
        if (resolved) return;
        console.log('✅ 2D热力图脚本加载成功');
        heatmap2DScript = script;

        // 等待一小段时间让脚本执行
        setTimeout(function () {
          // 如果脚本导出了初始化函数，直接调用
          if (typeof window.init2DHeatmap === 'function') {
            console.log('🔄 调用2D热力图初始化函数');
            try {
              window.init2DHeatmap();
            } catch (error) {
              console.error('❌ 调用2D热力图初始化函数失败:', error);
            }
          }

          // 等待渲染完成
          var checkCount = 0;
          var maxChecks = 30; // 最多检查30次，每次200ms，总共6秒

          var _checkRender = function checkRender() {
            var svg = container.querySelector('svg');
            if (svg && svg.children.length > 0) {
              if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                console.log('✅ 2D热力图渲染成功');
                resolve();
              }
            } else if (checkCount < maxChecks) {
              checkCount++;
              setTimeout(_checkRender, 200);
            } else {
              if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                console.warn('⚠️ 2D热力图渲染超时，但脚本已加载');
                // 即使没有SVG，也resolve，可能渲染需要更多时间
                resolve();
              }
            }
          };
          setTimeout(_checkRender, 100);
        }, 100);
      };
      script.onerror = function (error) {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);
        console.error('❌ 2D热力图脚本加载失败:', error);
        console.error('脚本路径:', script.src);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        reject(new Error("2D\u70ED\u529B\u56FE\u811A\u672C\u52A0\u8F7D\u5931\u8D25: ".concat(script.src)));
      };
      document.head.appendChild(script);
    });
  }

  // 加载3D热力图
  function load3DHeatmap() {
    return new Promise(function (resolve, reject) {
      var container = document.getElementById('heatmap');
      if (!container) {
        console.error('❌ 找不到heatmap容器');
        reject(new Error('找不到heatmap容器'));
        return;
      }

      // 先清除内容
      clearHeatmap();
      removeDynamicScripts();

      // 从已加载的heatmap.js脚本获取正确路径
      var basePath = '';
      var existingScript = document.querySelector('script[src*="heatmap.js"]:not([src*="heatmap-2D"]):not([id*="heatmap-3d"])');
      if (existingScript && existingScript.src) {
        var scriptPath = existingScript.src;
        var lastSlash = scriptPath.lastIndexOf('/');
        basePath = scriptPath.substring(0, lastSlash + 1);
        console.log('📂 从已加载脚本获取路径:', basePath, '来源:', scriptPath);
      } else {
        // 如果找不到，从toggle脚本获取
        var toggleScript = document.querySelector('script[src*="heatmap-toggle"]');
        if (toggleScript && toggleScript.src) {
          var _scriptPath2 = toggleScript.src;
          var _lastSlash2 = _scriptPath2.lastIndexOf('/');
          basePath = _scriptPath2.substring(0, _lastSlash2 + 1);
          console.log('📂 从toggle脚本获取路径:', basePath);
        } else {
          basePath = '';
          console.log('📂 使用相对路径');
        }
      }
      var timestamp = new Date().getTime();
      var script = document.createElement('script');
      script.src = "".concat(basePath, "heatmap.js?t=").concat(timestamp);
      script.id = 'heatmap-3d-script';
      script.async = false; // 确保顺序执行

      console.log('📂 加载3D热力图脚本，完整路径:', script.src);
      var resolved = false;
      var timeout = setTimeout(function () {
        if (!resolved) {
          resolved = true;
          console.error('❌ 3D热力图加载超时');
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
          reject(new Error('3D热力图加载超时'));
        }
      }, 15000); // 15秒超时（3D需要加载数据）

      script.onload = function () {
        if (resolved) return;
        console.log('✅ 3D热力图脚本加载成功');
        heatmap3DScript = script;

        // 等待渲染完成（3D热力图有异步数据加载，需要更长时间）
        var checkCount = 0;
        var maxChecks = 50; // 最多检查50次，每次300ms，总共15秒

        var _checkRender2 = function checkRender() {
          var svg = container.querySelector('svg');
          if (svg && svg.children.length > 0) {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              console.log('✅ 3D热力图渲染成功');
              resolve();
            }
          } else if (checkCount < maxChecks) {
            checkCount++;
            setTimeout(_checkRender2, 300);
          } else {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              console.warn('⚠️ 3D热力图渲染超时，但脚本已加载');
              // 即使没有SVG，也resolve，可能渲染需要更多时间
              resolve();
            }
          }
        };
        setTimeout(_checkRender2, 500);
      };
      script.onerror = function (error) {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);
        console.error('❌ 3D热力图脚本加载失败:', error);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        reject(new Error('3D热力图脚本加载失败'));
      };
      document.head.appendChild(script);
    });
  }

  // 切换模式
  function toggleMode() {
    return _toggleMode.apply(this, arguments);
  } // 绑定点击事件
  function _toggleMode() {
    _toggleMode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var originalText, targetMode, _t, _t2;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            if (!toggleBtn.disabled) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            toggleBtn.disabled = true;
            toggleBtn.style.opacity = '0.6';
            originalText = toggleBtn.querySelector('.toggle-text').textContent;
            toggleBtn.querySelector('.toggle-text').textContent = '切换中...';
            _context.p = 2;
            // 先更新模式，再加载
            targetMode = currentMode === '3D' ? '2D' : '3D';
            currentMode = targetMode;
            if (!(targetMode === '2D')) {
              _context.n = 4;
              break;
            }
            _context.n = 3;
            return load2DHeatmap();
          case 3:
            _context.n = 5;
            break;
          case 4:
            _context.n = 5;
            return load3DHeatmap();
          case 5:
            updateButtonText();
            console.log("\u2705 \u6210\u529F\u5207\u6362\u5230".concat(currentMode, "\u6A21\u5F0F"));
            _context.n = 12;
            break;
          case 6:
            _context.p = 6;
            _t = _context.v;
            console.error('切换热力图模式失败:', _t);
            // 恢复原状态
            currentMode = currentMode === '2D' ? '3D' : '2D';
            toggleBtn.querySelector('.toggle-text').textContent = originalText;

            // 尝试重新加载当前模式
            _context.p = 7;
            if (!(currentMode === '3D')) {
              _context.n = 9;
              break;
            }
            _context.n = 8;
            return load3DHeatmap();
          case 8:
            _context.n = 10;
            break;
          case 9:
            _context.n = 10;
            return load2DHeatmap();
          case 10:
            updateButtonText();
            _context.n = 12;
            break;
          case 11:
            _context.p = 11;
            _t2 = _context.v;
            console.error('重新加载失败:', _t2);
            alert('切换失败，请刷新页面重试');
          case 12:
            _context.p = 12;
            toggleBtn.disabled = false;
            toggleBtn.style.opacity = '1';
            return _context.f(12);
          case 13:
            return _context.a(2);
        }
      }, _callee, null, [[7, 11], [2, 6, 12, 13]]);
    }));
    return _toggleMode.apply(this, arguments);
  }
  toggleBtn.addEventListener('click', toggleMode);

  // 初始化按钮文本
  updateButtonText();

  // 检查是否已经有热力图脚本加载（默认3D，从HTML中加载）
  var existing3DScript = document.querySelector('script[src*="heatmap.js"]:not([src*="heatmap-2D"])');
  if (existing3DScript && !existing3DScript.id) {
    existing3DScript.id = 'heatmap-3d-script-original';
    heatmap3DScript = existing3DScript;
    currentMode = '3D';
    console.log('✅ 检测到已加载的3D热力图脚本');
  }
  console.log('✅ 热力图切换控制器初始化完成，当前模式:', currentMode);
})();
},{}]},{},["QYwq"], null)
//# sourceMappingURL=/heatmap-toggle.07811bdf.js.map