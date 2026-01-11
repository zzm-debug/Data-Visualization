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
})({"veD7":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// tree.js ✅ 轻松莫兰迪色系版（奶油白背景 + 绿/紫对调）：清晰 + 不删字 + 可缩放拖拽
(function () {
  // 尝试多个可能的文件路径（按优先级排序）
  // 注意：Parcel 会将文件复制到 dist 目录，路径需要相对于打包后的位置
  var DATA_URLS = ["/assets/music_genres_full_with_scraped_info.json",
  // 绝对路径（从网站根目录）
  "./assets/music_genres_full_with_scraped_info.json",
  // 相对路径
  "assets/music_genres_full_with_scraped_info.json", "/src/assets/music_genres_full_with_scraped_info.json" // 如果文件在 src 目录
  ];
  function getSize() {
    var svgEl = document.getElementById("tree");
    var panel = document.getElementById("panel-tree") || (svgEl === null || svgEl === void 0 ? void 0 : svgEl.parentElement);
    var w = panel !== null && panel !== void 0 && panel.clientWidth ? panel.clientWidth : 800;
    var h = panel !== null && panel !== void 0 && panel.clientHeight ? panel.clientHeight : 600;
    return {
      w: w,
      h: h
    };
  }

  // ✅ 过滤门槛
  var minGrandchildCount = 5;
  var minGrandchildCountClassical = 1;
  var minGrandchildCountElectronic = 8;
  function getThreshold(categoryName, subcategoryName) {
    var name = (subcategoryName || categoryName || "").toLowerCase();
    if (name.includes("electronic") || name.includes("electro")) return minGrandchildCountElectronic;
    if (categoryName === "Classical") return minGrandchildCountClassical;
    return minGrandchildCount;
  }
  function buildHierarchy(raw) {
    var allowedCategories = ["Popular", "Classical"];
    var filteredData = raw.filter(function (d) {
      return allowedCategories.includes(d.category);
    });
    return d3.hierarchy({
      name: "Music Genres",
      children: filteredData.map(function (d) {
        return {
          name: d.category,
          children: (d.subcategories || []).map(function (sc) {
            var threshold = getThreshold(d.category, sc.subcategory);
            var genres = (sc.genres || []).map(function (g) {
              return {
                name: g.name,
                children: g.children || []
              };
            }).filter(function (g) {
              return (g.children || []).length >= threshold;
            });
            if (genres.length < threshold) return null;
            return {
              name: sc.subcategory || "General",
              children: genres
            };
          }).filter(Boolean)
        };
      })
    });
  }
  function getTopCategory(d) {
    var strictNames = ["Rock", "Classical", "Electronic", "Popular"];
    var fuzzyNames = ["Rap", "Jazz", "Folk"];
    var excludeNames = ["Trap"];
    var ancestors = d.ancestors();
    var _iterator = _createForOfIteratorHelper(ancestors),
      _step;
    try {
      var _loop = function _loop() {
          var ancestor = _step.value;
          var name = (ancestor.data.name || "").toLowerCase();
          var strictMatch = strictNames.find(function (k) {
            return name === k.toLowerCase();
          });
          if (strictMatch) return {
            v: strictMatch
          };
          var isExcluded = excludeNames.some(function (k) {
            return name.includes(k.toLowerCase());
          });
          if (isExcluded) return 0; // continue
          var fuzzyMatch = fuzzyNames.find(function (k) {
            return name.includes(k.toLowerCase());
          });
          if (fuzzyMatch) return {
            v: fuzzyMatch
          };
        },
        _ret;
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _ret = _loop();
        if (_ret === 0) continue;
        if (_ret) return _ret.v;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return d.data.name;
  }
  function isTopLevelCategory(d) {
    var name = (d.data.name || "").toLowerCase();
    return name === "popular" || name === "classical";
  }
  function isHighlightedNode(d) {
    var strictNames = ["Rock", "Classical", "Electronic", "Popular"];
    var fuzzyNames = ["Rap", "Jazz", "Folk"];
    var excludeNames = ["Trap"];
    var name = (d.data.name || "").toLowerCase();
    var isExcluded = excludeNames.some(function (k) {
      return name.includes(k.toLowerCase());
    });
    if (isExcluded) return false;
    var isStrictMatch = strictNames.some(function (k) {
      return name === k.toLowerCase();
    });
    var isFuzzyMatch = fuzzyNames.some(function (k) {
      return name.includes(k.toLowerCase());
    });
    return isStrictMatch || isFuzzyMatch;
  }

  // ✅ 方案三：按层级固定圆点半径（更清晰）
  function rByDepth(d) {
    if (d.depth === 0) return 0;
    if (d.depth === 1) return 14;
    if (d.depth === 2) return 9;
    if (d.depth === 3) return 6;
    return 4;
  }
  function stretchRadialDistance(root) {
    root.descendants().forEach(function (d) {
      if (d.depth === 0) d.y = 0;else if (d.depth === 1) d.y *= 1.15;else if (d.depth === 2) d.y *= 1.45;else if (d.depth === 3) d.y *= 1.85;else d.y *= 2.25;
    });
  }

  // ✅ 你要的：背景更“奶油白”
  var CREAM_BG = "#FAF9F6";

  // ✅ 轻松莫兰迪 + “绿/紫对调”
  // 原本：Electronic=绿，Classical=紫
  // 现在：Electronic=紫，Classical=绿（更符合你偏爱紫色）
  var categoryDomain = ["Popular", "Rock", "Electronic", "Classical", "Jazz", "Folk", "Rap", "Other"];
  var morandiSoft = ["#6E8FB2",
  // Popular：灰蓝
  "#d39bacff",
  // Rock：豆沙红
  "#B7A6C9",
  // Electronic：雾紫 ✅（原来的 Classical）
  "#8FB6A3",
  // Classical：鼠尾草绿 ✅（原来的 Electronic）
  "#D2A86D",
  // Jazz：奶杏金
  "#A9B8A6",
  // Folk：灰橄榄
  "#7FA1B6",
  // Rap：蓝灰
  "#B8B1A8" // Other：灰褐
  ];
  var colorScale = d3.scaleOrdinal().domain(categoryDomain).range(morandiSoft);
  function normalizeCategoryName(name) {
    var n = (name || "").toLowerCase();
    if (n.includes("popular")) return "Popular";
    if (n.includes("rock")) return "Rock";
    if (n.includes("electronic") || n.includes("electro")) return "Electronic";
    if (n.includes("classical")) return "Classical";
    if (n.includes("jazz")) return "Jazz";
    if (n.includes("folk")) return "Folk";
    if (n.includes("rap") || n.includes("hip hop") || n.includes("hiphop")) return "Rap";
    return "Other";
  }
  var TEXT_COLOR = "#2F3A45";
  var TEXT_STROKE = "rgba(255,255,255,0.85)";
  var LINK_OPACITY = 0.32;
  var LINK_WIDTH = 1.6;
  var NODE_OPACITY = 0.92;
  function showError(message) {
    var svg = d3.select("#tree");
    svg.selectAll("*").remove();
    var _getSize = getSize(),
      w = _getSize.w,
      h = _getSize.h;
    svg.attr("viewBox", [-w / 2, -h / 2, w, h]);

    // 背景
    svg.append("rect").attr("x", -w / 2).attr("y", -h / 2).attr("width", w).attr("height", h).attr("fill", CREAM_BG);

    // 错误文本组
    var g = svg.append("g");
    g.append("text").attr("text-anchor", "middle").attr("x", 0).attr("y", -30).attr("font-size", 20).attr("font-weight", "bold").attr("fill", "#d62728").text("❌ 数据加载失败");

    // 错误信息（支持多行）
    var lines = message.split('\n');
    lines.forEach(function (line, i) {
      g.append("text").attr("text-anchor", "middle").attr("x", 0).attr("y", i * 20).attr("font-size", 14).attr("fill", "#666").text(line);
    });
    g.append("text").attr("text-anchor", "middle").attr("x", 0).attr("y", lines.length * 20 + 20).attr("font-size", 12).attr("fill", "#888").text("请检查文件路径和网络连接");
  }
  function render(raw) {
    var _getSize2 = getSize(),
      w = _getSize2.w,
      h = _getSize2.h;
    var radius = Math.min(w, h) / 2;
    var svg = d3.select("#tree");
    svg.selectAll("*").remove();
    svg.attr("viewBox", [-w / 2, -h / 2, w, h]).style("font", "11px sans-serif").style("cursor", "grab");

    // ✅ 背景矩形（不跟随 zoom 缩放）
    svg.append("rect").attr("x", -w / 2).attr("y", -h / 2).attr("width", w).attr("height", h).attr("fill", CREAM_BG);

    // ✅ 画布 g（zoom/pan 只作用在这个 g）
    var g = svg.append("g");
    var root = buildHierarchy(raw);
    if (!root.children || root.children.length === 0) {
      svg.append("text").attr("text-anchor", "middle").attr("font-size", 18).attr("fill", "#666").text("Tree: no data after filtering");
      return;
    }
    var tree = d3.tree().size([2 * Math.PI, radius - 60]);
    tree(root);
    stretchRadialDistance(root);

    // ✅ 连线
    g.append("g").attr("fill", "none").attr("stroke-opacity", LINK_OPACITY).attr("stroke-width", LINK_WIDTH).selectAll("path").data(root.links()).join("path").attr("stroke", function (d) {
      return colorScale(normalizeCategoryName(getTopCategory(d.target)));
    }).attr("d", d3.linkRadial().angle(function (d) {
      return d.x;
    }).radius(function (d) {
      return d.y;
    }));

    // ✅ 节点
    var node = g.append("g").selectAll("g").data(root.descendants()).join("g").attr("transform", function (d) {
      return "\n        rotate(".concat(d.x * 180 / Math.PI - 90, ")\n        translate(").concat(d.y, ",0)\n      ");
    });
    node.append("circle").attr("r", rByDepth).attr("fill", function (d) {
      return colorScale(normalizeCategoryName(getTopCategory(d)));
    }).attr("fill-opacity", NODE_OPACITY).attr("stroke", "rgba(255,255,255,0.95)").attr("stroke-width", 1);

    // ✅ 文字（不删字）
    var baseFont = 8;
    var midFont = 11;
    var bigFont = 16;
    node.append("text").attr("dy", "0.31em").attr("x", function (d) {
      var offset = 10 + d.depth * 6;
      return d.x < Math.PI === !d.children ? offset : -offset;
    }).attr("text-anchor", function (d) {
      return d.x < Math.PI === !d.children ? "start" : "end";
    }).attr("transform", function (d) {
      return d.x >= Math.PI ? "rotate(180)" : null;
    }).attr("font-size", function (d) {
      if (isTopLevelCategory(d)) return "".concat(bigFont, "px");
      if (isHighlightedNode(d)) return "".concat(midFont, "px");
      return "".concat(baseFont, "px");
    }).attr("font-weight", function (d) {
      return isTopLevelCategory(d) ? "750" : isHighlightedNode(d) ? "650" : "450";
    }).attr("fill", TEXT_COLOR).text(function (d) {
      return d.depth === 0 ? "" : d.data.name;
    }).clone(true).lower().attr("stroke", TEXT_STROKE).attr("stroke-width", 0.8);

    // ✅ 缩放 + 拖拽
    var zoom = d3.zoom().scaleExtent([0.45, 7]).on("start", function () {
      return svg.style("cursor", "grabbing");
    }).on("end", function () {
      return svg.style("cursor", "grab");
    }).on("zoom", function (event) {
      g.attr("transform", event.transform);
    });
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.scale(0.95));
    console.log("✅ tree 绘制完成（奶油白背景 + 紫色偏好）");
  }

  // 尝试加载数据，支持多个路径
  function loadData() {
    return _loadData.apply(this, arguments);
  } // 开始加载
  function _loadData() {
    _loadData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var lastError, raw, _iterator2, _step2, _loop2, _ret2, errorMessage, _t2, _t3;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            lastError = null; // 首先尝试使用 d3.json（它可能能更好地处理路径）
            _context2.p = 1;
            console.log("\uD83D\uDD04 \u5C1D\u8BD5\u4F7F\u7528 d3.json \u52A0\u8F7D: ./assets/music_genres_full_with_scraped_info.json");
            _context2.n = 2;
            return d3.json("./assets/music_genres_full_with_scraped_info.json");
          case 2:
            raw = _context2.v;
            console.log("✅ tree 数据加载成功 (d3.json)");
            if (!(!raw || !Array.isArray(raw))) {
              _context2.n = 3;
              break;
            }
            throw new Error("数据格式错误：期望数组格式");
          case 3:
            render(raw);
            window.addEventListener("resize", function () {
              return render(raw);
            });
            return _context2.a(2);
          case 4:
            _context2.p = 4;
            _t2 = _context2.v;
            console.warn("\u26A0\uFE0F d3.json \u52A0\u8F7D\u5931\u8D25:", _t2.message);
            lastError = _t2;
            // 如果 d3.json 失败，尝试使用 fetch 和多个路径
            _iterator2 = _createForOfIteratorHelper(DATA_URLS);
            _context2.p = 5;
            _loop2 = /*#__PURE__*/_regenerator().m(function _loop2() {
              var url, response, contentType, text, _raw, _t;
              return _regenerator().w(function (_context) {
                while (1) switch (_context.p = _context.n) {
                  case 0:
                    url = _step2.value;
                    _context.p = 1;
                    console.log("\uD83D\uDD04 \u5C1D\u8BD5\u52A0\u8F7D\u6570\u636E: ".concat(url));
                    _context.n = 2;
                    return fetch(url, {
                      method: 'GET',
                      headers: {
                        'Accept': 'application/json'
                      }
                    });
                  case 2:
                    response = _context.v;
                    if (response.ok) {
                      _context.n = 3;
                      break;
                    }
                    throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
                  case 3:
                    contentType = response.headers.get("content-type");
                    if (!(!contentType || !contentType.includes("application/json"))) {
                      _context.n = 5;
                      break;
                    }
                    _context.n = 4;
                    return response.text();
                  case 4:
                    text = _context.v;
                    console.error("返回的内容（前200字符）：", text.substring(0, 200));
                    throw new Error("\u8FD4\u56DE\u7684\u4E0D\u662F JSON \u683C\u5F0F\uFF0C\u53EF\u80FD\u662F HTML \u9519\u8BEF\u9875\u9762");
                  case 5:
                    _context.n = 6;
                    return response.json();
                  case 6:
                    _raw = _context.v;
                    console.log("✅ tree 数据加载成功:", url);
                    if (!(!_raw || !Array.isArray(_raw))) {
                      _context.n = 7;
                      break;
                    }
                    throw new Error("数据格式错误：期望数组格式");
                  case 7:
                    render(_raw);
                    window.addEventListener("resize", function () {
                      return render(_raw);
                    });
                    return _context.a(2, {
                      v: void 0
                    });
                  case 8:
                    _context.p = 8;
                    _t = _context.v;
                    console.warn("\u26A0\uFE0F \u52A0\u8F7D\u5931\u8D25 (".concat(url, "):"), _t.message);
                    lastError = _t;
                    return _context.a(2, 0);
                }
              }, _loop2, null, [[1, 8]]);
            });
            _iterator2.s();
          case 6:
            if ((_step2 = _iterator2.n()).done) {
              _context2.n = 10;
              break;
            }
            return _context2.d(_regeneratorValues(_loop2()), 7);
          case 7:
            _ret2 = _context2.v;
            if (!(_ret2 === 0)) {
              _context2.n = 8;
              break;
            }
            return _context2.a(3, 9);
          case 8:
            if (!_ret2) {
              _context2.n = 9;
              break;
            }
            return _context2.a(2, _ret2.v);
          case 9:
            _context2.n = 6;
            break;
          case 10:
            _context2.n = 12;
            break;
          case 11:
            _context2.p = 11;
            _t3 = _context2.v;
            _iterator2.e(_t3);
          case 12:
            _context2.p = 12;
            _iterator2.f();
            return _context2.f(12);
          case 13:
            // 所有路径都失败
            console.error("❌ tree 数据加载失败：所有路径都尝试失败");
            console.error("📋 尝试的路径：", DATA_URLS);
            console.error("📋 最后错误：", lastError);
            console.error("💡 提示：如果使用 Parcel，请确保文件在 dist/assets/ 目录，或使用 npm run build 重新构建");
            errorMessage = "\u6587\u4EF6\u672A\u627E\u5230: music_genres_full_with_scraped_info.json\n\u5DF2\u5C1D\u8BD5\u8DEF\u5F84: ".concat(DATA_URLS.join(', '), "\n\u8BF7\u786E\u4FDD\u6587\u4EF6\u5B58\u5728\u4E8E assets \u76EE\u5F55\u4E0B\n\u5982\u679C\u4F7F\u7528 Parcel\uFF0C\u8BF7\u8FD0\u884C npm run build");
            showError(errorMessage);
          case 14:
            return _context2.a(2);
        }
      }, _callee, null, [[5, 11, 12, 13], [1, 4]]);
    }));
    return _loadData.apply(this, arguments);
  }
  loadData();
})();
},{}]},{},["veD7"], null)
//# sourceMappingURL=/tree.2832c7da.js.map