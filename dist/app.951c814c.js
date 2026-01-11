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
})({"NhbH":[function(require,module,exports) {
module.exports = "/influence_html.8a477144.csv";
},{}],"A2T1":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// app.js — 柔和气泡 + 互动率环（进度）+ 字更大 + 图更大（去掉力导向）
(function () {
  var data = {
    "ACG": {
      "total_plays": 89843048,
      "total_comments": 95537,
      "song_count": 50
    },
    "Pop": {
      "total_plays": 3393742080,
      "total_comments": 12806829,
      "song_count": 50
    },
    "Rock": {
      "total_plays": 186807824,
      "total_comments": 5122030,
      "song_count": 50
    },
    "Classical": {
      "total_plays": 74785024,
      "total_comments": 383731,
      "song_count": 50
    },
    "Electronic": {
      "total_plays": 405760640,
      "total_comments": 185764,
      "song_count": 50
    },
    "Folk": {
      "total_plays": 44580532,
      "total_comments": 112595,
      "song_count": 50
    },
    "Jazz": {
      "total_plays": 28298645,
      "total_comments": 98685,
      "song_count": 50
    },
    "Rap": {
      "total_plays": 519658432,
      "total_comments": 267719,
      "song_count": 50
    }
  };

  // influence（来自 assets/influence_html.csv）：用于“气泡半径”映射
  // CSV 示例：
  // genre,influence
  // Pop,1.0
  var influenceByGenre = new Map();

  // 图表背景：保持透明（背景由独立视觉层 + 面板承载）
  var BG = "transparent";
  var palette = {
    ACG: "#7c3aed",
    // 霓虹紫
    Pop: "#ff3bd4",
    // 霓虹粉
    Rock: "#00fff0",
    // 电青
    Classical: "#F59E0B",
    // 琥珀金
    Electronic: "#32a7ff",
    // 电蓝
    Folk: "#a78bfa",
    // 低饱和紫
    Jazz: "#f472b6",
    // 柔粉
    Rap: "#94A3B8" // 冷灰蓝
  };
  var svgSel = d3.select("#bubble-svg");
  var svgNode = svgSel.node();
  if (!svgNode) return;

  // tooltip（复用避免重复）
  var tooltip = d3.select("body").select(".bubble-tooltip");
  if (tooltip.empty()) {
    tooltip = d3.select("body").append("div").attr("class", "bubble-tooltip").style("position", "absolute").style("pointer-events", "none").style("padding", "12px 14px").style("border-radius", "12px").style("background", "rgba(30, 41, 59, 0.90)").style("color", "#fff").style("font", "13px/1.4 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif").style("opacity", 0).style("backdrop-filter", "blur(6px)");
  }

  // 避免每次 resize rerender 都重复绑定 scroll listener
  var scrollBound = false;
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function formatBig(n) {
    return d3.format(",")(n);
  }
  function pct(x) {
    return "".concat((x * 100).toFixed(2), "%");
  }
  function asNumber(v) {
    var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NaN;
    var n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  function loadInfluenceMap() {
    return _loadInfluenceMap.apply(this, arguments);
  }
  function _loadInfluenceMap() {
    _loadInfluenceMap = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var candidates, bundledUrl, _loop, _ret, _i, _candidates;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            // ✅ Parcel 1.x：用 require 引入静态资源，才能在 build 后把文件打包/复制进 dist
            // require('./assets/influence_html.csv') 返回的是最终可访问的 URL
            candidates = [];
            try {
              // eslint-disable-next-line no-undef
              if (typeof require !== "undefined") {
                // eslint-disable-next-line no-undef
                bundledUrl = require("./assets/influence_html.csv");
                if (bundledUrl) candidates.push(bundledUrl);
              }
            } catch (e) {
              // ignore
            }

            // 兼容不同部署/打开方式（例如 src/ 下直接打开，或通过本地 server）
            candidates.push("assets/influence_html.csv", "./assets/influence_html.csv", "/assets/influence_html.csv", "/src/assets/influence_html.csv");
            _loop = /*#__PURE__*/_regenerator().m(function _loop() {
              var url, rows, m, _t;
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.p = _context2.n) {
                  case 0:
                    url = _candidates[_i];
                    _context2.p = 1;
                    _context2.n = 2;
                    return d3.csv(url);
                  case 2:
                    rows = _context2.v;
                    if (!(!rows || rows.length === 0)) {
                      _context2.n = 3;
                      break;
                    }
                    return _context2.a(2, 0);
                  case 3:
                    m = new Map();
                    rows.forEach(function (r) {
                      var genre = (r.genre || "").trim();
                      var influence = asNumber(r.influence, NaN);
                      if (genre && Number.isFinite(influence)) m.set(genre, influence);
                    });
                    if (!(m.size > 0)) {
                      _context2.n = 4;
                      break;
                    }
                    console.log("\u2705 influence CSV \u52A0\u8F7D\u6210\u529F\uFF1A".concat(url, "\uFF08").concat(m.size, " \u6761\uFF09"));
                    return _context2.a(2, {
                      v: m
                    });
                  case 4:
                    _context2.n = 6;
                    break;
                  case 5:
                    _context2.p = 5;
                    _t = _context2.v;
                  case 6:
                    return _context2.a(2);
                }
              }, _loop, null, [[1, 5]]);
            });
            _i = 0, _candidates = candidates;
          case 1:
            if (!(_i < _candidates.length)) {
              _context3.n = 5;
              break;
            }
            return _context3.d(_regeneratorValues(_loop()), 2);
          case 2:
            _ret = _context3.v;
            if (!(_ret === 0)) {
              _context3.n = 3;
              break;
            }
            return _context3.a(3, 4);
          case 3:
            if (!_ret) {
              _context3.n = 4;
              break;
            }
            return _context3.a(2, _ret.v);
          case 4:
            _i++;
            _context3.n = 1;
            break;
          case 5:
            console.warn("⚠️ influence CSV 加载失败：将回退为“气泡=评论数”映射（请确认 src/assets/influence_html.csv 已被打包或可通过 URL 访问）");
            return _context3.a(2, new Map());
        }
      }, _callee2);
    }));
    return _loadInfluenceMap.apply(this, arguments);
  }
  function render() {
    svgSel.selectAll("*").remove();
    var container = svgNode.closest(".panel-body") || svgNode.parentElement;
    var cw = (container === null || container === void 0 ? void 0 : container.clientWidth) || 1100;
    var ch = (container === null || container === void 0 ? void 0 : container.clientHeight) || 720;

    // ✅ 图更大：上限更高
    var width = Math.max(1100, Math.min(1700, Math.floor(cw * 1.25)));
    var height = Math.max(720, Math.min(1100, Math.floor(ch * 1.18)));

    // ✅ 字更大后，给轴/图例更多空间
    var margin = {
      top: 72,
      right: 260,
      bottom: 110,
      left: 120
    };
    var innerW = Math.max(300, width - margin.left - margin.right);
    var innerH = Math.max(260, height - margin.top - margin.bottom);
    svgSel.attr("width", "100%").attr("height", "100%").attr("viewBox", "0 0 ".concat(width, " ").concat(height)).attr("preserveAspectRatio", "xMidYMid meet").style("background", BG);
    var g = svgSel.append("g");
    var genres = Object.keys(data);
    var colorOf = function colorOf(k) {
      return palette[k] || "#94A3B8";
    };
    var playsExtent = d3.extent(genres, function (k) {
      return data[k].total_plays;
    });
    var commentsExtent = d3.extent(genres, function (k) {
      return data[k].total_comments;
    });
    var xMin = Math.max(1, (playsExtent[0] || 1) * 0.75);
    var xMax = (playsExtent[1] || 1) * 1.25;
    var xScale = d3.scaleLog().domain([xMin, xMax]).range([margin.left, width - margin.right]).nice();
    var yScale = d3.scaleLinear().domain([0, (commentsExtent[1] || 0) * 1.12]).range([height - margin.bottom, margin.top]).nice();

    // ✅ 气泡半径：优先用 CSV 的 influence；若加载失败/缺失则回退到评论数
    var influenceVals = genres.map(function (g) {
      return influenceByGenre.get(g);
    }).filter(function (v) {
      return Number.isFinite(v);
    });
    var hasInfluence = influenceVals.length > 0;
    var maxR = Math.max(78, Math.floor(Math.min(innerW, innerH) * 0.16));
    var rScale = hasInfluence ? function (_ext$, _ext$2) {
      var ext = d3.extent(influenceVals);
      var minV = Math.max(0, (_ext$ = ext[0]) !== null && _ext$ !== void 0 ? _ext$ : 0);
      var maxV = Math.max(minV + 1e-9, (_ext$2 = ext[1]) !== null && _ext$2 !== void 0 ? _ext$2 : 1);
      return d3.scaleSqrt().domain([minV, maxV]).range([18, maxR]).clamp(true);
    }() : d3.scaleSqrt().domain([Math.max(1, commentsExtent[0] || 1), Math.max(2, commentsExtent[1] || 2)]).range([18, maxR]);

    // ✅ 互动率：comments/plays -> 相对进度
    var rates = genres.map(function (k) {
      return (data[k].total_comments || 0) / Math.max(1, data[k].total_plays || 1);
    });
    var maxRate = Math.max.apply(Math, _toConsumableArray(rates).concat([1e-9]));

    // 网格线（更淡，更干净）
    var xGrid = d3.axisBottom(xScale).tickSize(-innerH).tickFormat("");
    var yGrid = d3.axisLeft(yScale).tickSize(-innerW).tickFormat("");
    g.append("g").attr("class", "grid x-grid").attr("transform", "translate(0,".concat(height - margin.bottom, ")")).call(xGrid);
    g.append("g").attr("class", "grid y-grid").attr("transform", "translate(".concat(margin.left, ",0)")).call(yGrid);

    // 深色赛博背景下：网格线不能太“深灰/低透明”，否则新窗口里几乎看不见
    svgSel.selectAll(".grid line").attr("stroke", "rgba(50, 167, 255, 0.14)").attr("stroke-width", 1.2);
    svgSel.selectAll(".grid path").attr("stroke", "none");

    // 坐标轴（字号更大）
    var xAxis = d3.axisBottom(xScale).ticks(10, "~s");
    var yAxis = d3.axisLeft(yScale).ticks(6).tickFormat(d3.format(".2s"));
    var gx = g.append("g").attr("transform", "translate(0,".concat(height - margin.bottom, ")")).attr("class", "x-axis").call(xAxis);
    var gy = g.append("g").attr("transform", "translate(".concat(margin.left, ",0)")).attr("class", "y-axis").call(yAxis);

    // 深色赛博背景下：轴文字需要更高对比度
    g.selectAll(".x-axis text, .y-axis text").style("font-size", "15px").style("fill", "rgba(226, 232, 240, 0.88)").style("paint-order", "stroke").style("stroke", "rgba(7, 3, 18, 0.72)").style("stroke-width", "2.2px").style("stroke-linejoin", "round");
    g.selectAll(".x-axis path, .y-axis path, .x-axis line, .y-axis line").attr("stroke", "rgba(50, 167, 255, 0.28)");

    // 节点
    var nodes = genres.map(function (genre) {
      var _influenceByGenre$get;
      var s = data[genre];
      var influence = hasInfluence ? (_influenceByGenre$get = influenceByGenre.get(genre)) !== null && _influenceByGenre$get !== void 0 ? _influenceByGenre$get : 0 : null;
      var r = hasInfluence ? rScale(influence) : rScale(s.total_comments);
      var rate = (s.total_comments || 0) / Math.max(1, s.total_plays || 1);
      var progress = clamp(rate / maxRate, 0, 1);
      return {
        id: genre,
        total_plays: s.total_plays,
        total_comments: s.total_comments,
        influence: influence,
        x: xScale(s.total_plays),
        y: yScale(s.total_comments),
        r: r,
        rate: rate,
        progress: progress,
        active: true
      };
    });
    var layer = g.append("g").attr("class", "bubble-layer");

    // ✅ 只保留“柔和气泡”本体
    var bubbles = layer.selectAll(".bubble").data(nodes, function (d) {
      return d.id;
    }).enter().append("circle").attr("class", "bubble").attr("r", function (d) {
      return d.r;
    }).attr("fill", function (d) {
      return colorOf(d.id);
    }).attr("fill-opacity", 0.28) // 轻盈一点
    .attr("stroke", "rgba(255,255,255,0.95)") // 干净的描边
    .attr("stroke-width", 2);

    // ✅ 互动率环（保留）：底环 + 进度环
    var ringGap = 10; // 离气泡更远一点，看起来更优雅
    var ringWidth = 7; // 更清晰

    var ringBase = layer.selectAll(".ring-base").data(nodes, function (d) {
      return d.id;
    }).enter().append("circle").attr("class", "ring-base").attr("fill", "none").attr("r", function (d) {
      return d.r + ringGap;
    }).attr("stroke", "rgba(30,41,59,0.10)").attr("stroke-width", ringWidth);
    var ringProg = layer.selectAll(".ring-prog").data(nodes, function (d) {
      return d.id;
    }).enter().append("circle").attr("class", "ring-prog").attr("fill", "none").attr("r", function (d) {
      return d.r + ringGap;
    }).attr("stroke", function (d) {
      return colorOf(d.id);
    }).attr("stroke-opacity", 0.78).attr("stroke-linecap", "round").attr("stroke-width", ringWidth);
    function updateRings() {
      ringProg.each(function (d) {
        var rr = d.r + ringGap;
        var c = 2 * Math.PI * rr;
        var filled = c * d.progress;
        d3.select(this).attr("stroke-dasharray", "".concat(filled, " ").concat(c)).attr("stroke-dashoffset", 0);
      });
    }

    // 让进度从顶部开始（旋转 -90°）
    function ringRotate(d) {
      return "rotate(-90 ".concat(d.x, " ").concat(d.y, ")");
    }

    // 交互（绑定到气泡）
    bubbles.on("mouseenter", function (event, d) {
      tooltip.style("opacity", 1).html("\n            <div style=\"font-weight:800;margin-bottom:6px;letter-spacing:.3px\">".concat(d.id, "</div>\n            <div style=\"opacity:.92\">Plays\uFF1A").concat(formatBig(d.total_plays), "</div>\n            <div style=\"opacity:.92\">Comments\uFF1A").concat(formatBig(d.total_comments), "</div>\n            <div style=\"opacity:.92;margin-top:6px\">Influence\uFF1A").concat(d.influence === null ? "N/A" : d3.format(".4f")(d.influence), "</div>\n            <div style=\"opacity:.92;margin-top:6px\">\u4E92\u52A8\u7387\uFF1A").concat(pct(d.rate), "</div>\n            <div style=\"opacity:.70;margin-top:6px\">\u6C14\u6CE1=\u5F71\u54CD\u529B(influence)\uFF5C\u5916\u73AF=\u4E92\u52A8\u7387\uFF08\u76F8\u5BF9\u8FDB\u5EA6\uFF09</div>\n          "));
    }).on("mousemove", function (event) {
      tooltip.style("left", event.pageX + 14 + "px").style("top", event.pageY + 14 + "px");
    }).on("mouseleave", function () {
      return tooltip.style("opacity", 0);
    });

    // —— 轻量级碰撞分离（无力导向）——

    // 每个气泡的“有效半径”需要包含外环：r + ringGap + ringWidth
    var pad = 6; // 额外留白，避免贴边
    var extra = ringGap + ringWidth + 3;
    function clampNode(d) {
      var bound = d.r + extra;
      d.x = clamp(d.x, margin.left + bound, width - margin.right - bound);
      d.y = clamp(d.y, margin.top + bound, height - margin.bottom - bound);
    }

    // 先做一次边界裁剪
    nodes.forEach(clampNode);

    // 迭代式分离：两两检查，若重叠就沿中心连线各退一半
    function resolveCollisions(nodes) {
      var maxIter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 80;
      for (var it = 0; it < maxIter; it++) {
        var moved = 0;
        for (var i = 0; i < nodes.length; i++) {
          for (var j = i + 1; j < nodes.length; j++) {
            var a = nodes[i],
              b = nodes[j];
            var ra = a.r + extra;
            var rb = b.r + extra;
            var need = ra + rb + pad;
            var dx = b.x - a.x;
            var dy = b.y - a.y;
            var dist = Math.hypot(dx, dy);
            if (dist < 1e-6) {
              var jitter = 0.5 + Math.random();
              dx = jitter;
              dy = jitter * 0.7;
              dist = Math.hypot(dx, dy);
            }
            if (dist < need) {
              var push = (need - dist) / 2;
              var nx = dx / dist;
              var ny = dy / dist;
              a.x -= nx * push;
              a.y -= ny * push;
              b.x += nx * push;
              b.y += ny * push;
              moved++;
            }
          }
        }
        nodes.forEach(clampNode);
        if (moved === 0) break;
      }
    }

    // 执行分离
    resolveCollisions(nodes);

    // 放置到最终位置
    bubbles.attr("cx", function (d) {
      return d.x;
    }).attr("cy", function (d) {
      return d.y;
    });
    ringBase.attr("cx", function (d) {
      return d.x;
    }).attr("cy", function (d) {
      return d.y;
    });
    ringProg.attr("cx", function (d) {
      return d.x;
    }).attr("cy", function (d) {
      return d.y;
    }).attr("transform", function (d) {
      return "rotate(-90 ".concat(d.x, " ").concat(d.y, ")");
    });

    // 重新计算一次进度环
    updateRings();

    // ✅ 轴标题更大
    svgSel.append("text").attr("x", margin.left + innerW / 2).attr("y", height - 42).attr("text-anchor", "middle").style("font", "16px/1 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif").style("fill", "rgba(226, 232, 240, 0.88)").style("paint-order", "stroke").style("stroke", "rgba(7, 3, 18, 0.72)").style("stroke-width", "2.2px").style("stroke-linejoin", "round").text("Total Plays (log)");
    svgSel.append("text").attr("transform", "rotate(-90)").attr("x", -(margin.top + innerH / 2)).attr("y", 34).attr("text-anchor", "middle").style("font", "16px/1 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif").style("fill", "rgba(226, 232, 240, 0.88)").style("paint-order", "stroke").style("stroke", "rgba(7, 3, 18, 0.72)").style("stroke-width", "2.2px").style("stroke-linejoin", "round").text("Total Comments");

    // ✅ 注释：右上角加一个“说明”小标签（设计感更强）
    var note = svgSel.append("g").attr("transform", "translate(".concat(margin.left + 10, ", ").concat(margin.top - 36, ")"));
    note.append("rect").attr("width", 320).attr("height", 28).attr("rx", 10).attr("fill", "rgba(18, 8, 42, 0.86)").attr("stroke", "rgba(50, 167, 255, 0.28)");
    note.append("text").attr("x", 14).attr("y", 19).style("font", "14px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif").style("fill", "rgba(226, 232, 240, 0.86)").text("气泡=影响力(influence)  ｜  外环=互动率（相对进度）");

    // ✅ 图例：更大更清晰（不漏）
    var legend = svgSel.append("g").attr("class", "legend-group");
    var legendItem = legend.selectAll(".legend").data(genres).enter().append("g").attr("class", "legend").attr("transform", function (d, i) {
      return "translate(".concat(width - margin.right + 20, ", ").concat(margin.top + i * 32, ")");
    }).style("cursor", "pointer").on("click", function (event, genre) {
      var node = nodes.find(function (n) {
        return n.id === genre;
      });
      node.active = !node.active;
      var op = node.active ? 1 : 0.12;
      bubbles.filter(function (d) {
        return d.id === genre;
      }).transition().duration(220).attr("opacity", op);
      ringBase.filter(function (d) {
        return d.id === genre;
      }).transition().duration(220).attr("opacity", op);
      ringProg.filter(function (d) {
        return d.id === genre;
      }).transition().duration(220).attr("opacity", op);
      legendItem.filter(function (d) {
        return d === genre;
      }).selectAll("text, rect").transition().duration(180).style("opacity", node.active ? 1 : 0.35);
    });
    legendItem.append("rect").attr("width", 16).attr("height", 16).attr("rx", 5).attr("ry", 5).attr("y", -12).style("fill", function (d) {
      return colorOf(d);
    }).style("opacity", 0.75);
    legendItem.append("text").attr("x", 26).attr("y", 2).text(function (d) {
      return d;
    }).style("font-size", "16px").style("fill", "rgba(226, 232, 240, 0.86)").style("paint-order", "stroke").style("stroke", "rgba(7, 3, 18, 0.72)").style("stroke-width", "2.0px").style("stroke-linejoin", "round").style("font-family", "system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif");
    if (!scrollBound) {
      window.addEventListener("scroll", function () {
        return tooltip.style("opacity", 0);
      }, {
        passive: true
      });
      scrollBound = true;
    }
  }

  // resize 防抖
  var t = null;
  function rerender() {
    clearTimeout(t);
    t = setTimeout(render, 90);
  }

  // 先加载 influence，再渲染（避免第一次渲染仍用评论数）
  _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return loadInfluenceMap();
        case 1:
          influenceByGenre = _context.v;
          render();
          window.addEventListener("resize", rerender);
        case 2:
          return _context.a(2);
      }
    }, _callee);
  }))();
})();
},{"./assets/influence_html.csv":"NhbH"}]},{},["A2T1"], null)
//# sourceMappingURL=/app.951c814c.js.map