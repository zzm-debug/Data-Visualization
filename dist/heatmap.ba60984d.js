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
})({"uQWi":[function(require,module,exports) {
module.exports = [{
  "chunk": 1,
  "start_index": 1,
  "end_index": 34,
  "song_count": 34,
  "songs_with_genre": 33,
  "songs_without_genre": 1,
  "genre_distribution": {
    "rap": 65,
    "pop": 7,
    "ACG": 4
  }
}, {
  "chunk": 2,
  "start_index": 35,
  "end_index": 68,
  "song_count": 34,
  "songs_with_genre": 34,
  "songs_without_genre": 0,
  "genre_distribution": {
    "rap": 66,
    "pop": 9,
    "ACG": 4,
    "folk": 2
  }
}, {
  "chunk": 3,
  "start_index": 69,
  "end_index": 101,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "rap": 53,
    "pop": 10,
    "ACG": 10,
    "folk": 2
  }
}, {
  "chunk": 4,
  "start_index": 102,
  "end_index": 134,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "rap": 55,
    "pop": 26,
    "ACG": 8,
    "folk": 1,
    "electronic": 1
  }
}, {
  "chunk": 5,
  "start_index": 135,
  "end_index": 167,
  "song_count": 33,
  "songs_with_genre": 32,
  "songs_without_genre": 1,
  "genre_distribution": {
    "pop": 52,
    "rap": 7,
    "electronic": 6,
    "ACG": 4,
    "rock": 2,
    "jazz": 2,
    "classical": 2,
    "folk": 1
  }
}, {
  "chunk": 6,
  "start_index": 168,
  "end_index": 200,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 47,
    "electronic": 7,
    "rap": 6,
    "ACG": 4,
    "classical": 2,
    "rock": 1
  }
}, {
  "chunk": 7,
  "start_index": 201,
  "end_index": 233,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 46,
    "rap": 12,
    "ACG": 8,
    "rock": 3,
    "electronic": 2,
    "jazz": 2,
    "classical": 1
  }
}, {
  "chunk": 8,
  "start_index": 234,
  "end_index": 266,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 42,
    "electronic": 11,
    "rap": 9,
    "ACG": 3,
    "jazz": 1,
    "folk": 1
  }
}, {
  "chunk": 9,
  "start_index": 267,
  "end_index": 299,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 45,
    "ACG": 10,
    "folk": 6,
    "rap": 3,
    "rock": 2,
    "electronic": 1,
    "jazz": 1
  }
}, {
  "chunk": 10,
  "start_index": 300,
  "end_index": 332,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 51,
    "ACG": 8,
    "electronic": 5,
    "rap": 3,
    "rock": 2,
    "classical": 2
  }
}, {
  "chunk": 11,
  "start_index": 333,
  "end_index": 365,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 44,
    "electronic": 15,
    "rap": 12,
    "ACG": 6,
    "rock": 2
  }
}, {
  "chunk": 12,
  "start_index": 366,
  "end_index": 398,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 50,
    "electronic": 9,
    "ACG": 8,
    "rock": 8,
    "rap": 3
  }
}, {
  "chunk": 13,
  "start_index": 399,
  "end_index": 431,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 41,
    "ACG": 15,
    "rap": 8,
    "electronic": 6,
    "rock": 4,
    "classical": 3
  }
}, {
  "chunk": 14,
  "start_index": 432,
  "end_index": 464,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 40,
    "ACG": 10,
    "rock": 10,
    "electronic": 7,
    "rap": 6
  }
}, {
  "chunk": 15,
  "start_index": 465,
  "end_index": 497,
  "song_count": 33,
  "songs_with_genre": 32,
  "songs_without_genre": 1,
  "genre_distribution": {
    "pop": 36,
    "rock": 14,
    "ACG": 11,
    "electronic": 10,
    "rap": 2,
    "folk": 1
  }
}, {
  "chunk": 16,
  "start_index": 498,
  "end_index": 530,
  "song_count": 33,
  "songs_with_genre": 32,
  "songs_without_genre": 1,
  "genre_distribution": {
    "pop": 43,
    "ACG": 10,
    "electronic": 9,
    "rock": 5,
    "rap": 4,
    "jazz": 1,
    "folk": 1
  }
}, {
  "chunk": 17,
  "start_index": 531,
  "end_index": 563,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 37,
    "electronic": 20,
    "ACG": 8,
    "rock": 7,
    "rap": 5,
    "folk": 5,
    "jazz": 1
  }
}, {
  "chunk": 18,
  "start_index": 564,
  "end_index": 596,
  "song_count": 33,
  "songs_with_genre": 32,
  "songs_without_genre": 1,
  "genre_distribution": {
    "pop": 36,
    "electronic": 13,
    "ACG": 11,
    "folk": 6,
    "rock": 4
  }
}, {
  "chunk": 19,
  "start_index": 597,
  "end_index": 629,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 44,
    "ACG": 17,
    "electronic": 8,
    "rap": 6,
    "rock": 5,
    "folk": 2,
    "classical": 1
  }
}, {
  "chunk": 20,
  "start_index": 630,
  "end_index": 662,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 47,
    "rock": 12,
    "rap": 6,
    "electronic": 5,
    "ACG": 2,
    "folk": 1
  }
}, {
  "chunk": 21,
  "start_index": 663,
  "end_index": 695,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 35,
    "electronic": 18,
    "rock": 8,
    "ACG": 8,
    "rap": 3
  }
}, {
  "chunk": 22,
  "start_index": 696,
  "end_index": 728,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 50,
    "electronic": 14,
    "rap": 3,
    "ACG": 2,
    "folk": 1
  }
}, {
  "chunk": 23,
  "start_index": 729,
  "end_index": 761,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "electronic": 40,
    "pop": 22,
    "rap": 8,
    "ACG": 4,
    "rock": 2
  }
}, {
  "chunk": 24,
  "start_index": 762,
  "end_index": 794,
  "song_count": 33,
  "songs_with_genre": 32,
  "songs_without_genre": 1,
  "genre_distribution": {
    "pop": 47,
    "rock": 13,
    "electronic": 10,
    "rap": 4,
    "folk": 2,
    "ACG": 2
  }
}, {
  "chunk": 25,
  "start_index": 795,
  "end_index": 827,
  "song_count": 33,
  "songs_with_genre": 33,
  "songs_without_genre": 0,
  "genre_distribution": {
    "pop": 56,
    "electronic": 6,
    "rap": 5,
    "rock": 4,
    "jazz": 1
  }
}];
},{}],"D9VS":[function(require,module,exports) {
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// ============================================
// heatmap.js - D3伪3D热力图（等轴测投影）
// ============================================
// X轴：风格（genres），Y轴：时间（months），Z轴：乐曲数量
console.log('🎨 D3伪3D热力图脚本开始加载...');
(function () {
  // 优先使用 heatmap-3d 容器
  var container = document.getElementById("heatmap-3d") || document.getElementById("heatmap");
  if (!container) {
    console.error('❌ 找不到heatmap容器');
    return;
  }
  container.innerHTML = '';
  // ⚠️ 不要在这里全局 remove tooltip：2D/3D 会互相删掉导致“tooltip 消失”

  //#region Heatmap 3D｜主题/装饰层（只保留原图注释，不额外加 3D/2D 徽标）
  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v || "").trim() || fallback;
  }

  /**
   * ✅ 赛博霓虹渐变（按截图：深紫 → 紫 → 青 → 粉 → 近白高光）
   * - 低值不落到纯黑
   * - 高值略带近白“高光”，更像你截图里的发光质感
   */
  function getCyberStops() {
    // ✅ 修正颜色：严格对齐截图的【单色系】紫白渐变
    // 截图特征：低值是深紫，中值是正紫，高值是发光的亮紫/白
    // 绝无粉色、青色杂质
    return [
    // ✅ 原图 legend：由浅入深（左浅→右深）
    // 因此：min → 浅色，max → 深色
    "#ffffff",
    // 1. 纯白（浅）
    "#e9d5ff",
    // 2. 极亮紫
    "#a855f7",
    // 3. 亮紫
    "#6b21a8",
    // 4. 中紫
    "#2e1065" // 5. 深邃紫（深）
    ];
  }
  function ensureHeatmapOverlay() {
    var stage = container && (container.closest(".heatmap-stage") || container.parentElement);
    if (!stage) return;
    stage.style.position = stage.style.position || "relative";

    // 主页面样式由 2D 脚本也会注入；这里兜底（避免只跑 3D 时缺样式）
    var styleId = "heatmap-overlay-style";
    if (!document.getElementById(styleId)) {
      var style = document.createElement("style");
      style.id = styleId;
      style.textContent = "\n        /* \u2705 \u5DE6\u4E0A\u89D2\u6CE8\u91CA\uFF1A\u6837\u5F0F\u5FAE\u8C03\uFF0C\u5BF9\u9F50\u622A\u56FE */\n        .hm-anno{\n          position:absolute; left:12px; top:12px;\n          width: min(340px, 50%);\n          border-radius: 12px;\n          background: rgba(10, 5, 20, 0.85); /* \u66F4\u9ED1\u7684\u80CC\u666F */\n          border: 1px solid rgba(124, 58, 237, 0.3); /* \u7D2B\u8272\u8FB9\u6846\u5FAE\u5149 */\n          box-shadow: 0 4px 16px rgba(0,0,0,0.4);\n          color: rgba(226,232,240,0.9);\n          backdrop-filter: blur(8px);\n          z-index: 6;\n          overflow:hidden;\n        }\n        .hm-anno > summary{\n          list-style:none;\n          cursor:pointer;\n          padding: 6px 8px;\n          font: 11px/1.1 system-ui,-apple-system,\"Segoe UI\",\"Microsoft YaHei\",sans-serif;\n          font-weight: 700; /* \u52A0\u7C97\u6807\u9898 */\n          letter-spacing: .5px;\n          user-select:none;\n          color: #fff;\n        }\n        .hm-anno > summary::-webkit-details-marker{ display:none; }\n        .hm-anno .hm-anno-body{\n          padding: 0 8px 8px 8px;\n          font: 10px/1.45 system-ui,-apple-system,\"Segoe UI\",\"Microsoft YaHei\",sans-serif;\n          color: rgba(226,232,240,0.85);\n        }\n        .hm-anno .hm-anno-body div {\n          margin-bottom: 2px;\n        }\n      ";
      document.head.appendChild(style);
    }

    // ✅ 注释文案：严格对齐原图（不要额外加说明）
    var anno = stage.querySelector(".hm-anno");
    if (!anno) {
      anno = document.createElement("details");
      anno.className = "hm-anno";
      anno.open = true;
      // 截图文案
      anno.innerHTML = "\n        <summary>\u6CE8\u91CA\uFF08\u70B9\u51FB\u9690\u85CF\uFF09</summary>\n        <div class=\"hm-anno-body\">\n          <div>\u70ED\u529B\u56FE\uFF1A\u4E16\u754C\u8303\u56F4\u97F3\u4E50\u70ED\u5EA6\u53D8\u5316</div>\n          <div>\u6298\u7EBF\u56FE\uFF1A\u56FD\u5185\u7F51\u53CB\u542C\u97F3\u4E50\u7684\u66F2\u76EE\u6570\u91CF\u53D8\u5316</div>\n        </div>\n      ";
      stage.appendChild(anno);
    }
    // ✅ 关键：阻止点击注释框时冒泡到 `.chart-content`
    try {
      anno.addEventListener("click", function (e) {
        return e.stopPropagation();
      });
      anno.addEventListener("pointerdown", function (e) {
        return e.stopPropagation();
      });
    } catch (e) {}

    // 容器“玻璃卡片”质感
    try {
      container.style.borderRadius = "14px";
      container.style.overflow = "hidden";
      container.style.background = "rgba(7, 3, 18, 0.18)";
      container.style.border = "1px solid rgba(50, 167, 255, 0.16)";
      container.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.03), 0 0 18px rgba(255,59,212,0.10), 0 0 24px rgba(50,167,255,0.08)";
    } catch (e) {}
  }

  //#endregion

  var genreData = null;
  var surfaceData = null;
  // ✅ 3D 折线/曲目数量：使用该 JSON 的 genre_distribution（你说“之前是对的”的那套映射）
  var lineGenreData = null;
  try {
    lineGenreData = require('./assets/歌单_2314343014_genre分布统计_归类后.json');
    console.log('✅ 3D折线：通过 require 成功导入 genre_distribution JSON');
  } catch (e) {
    console.warn('⚠️ 3D折线：require 导入 JSON 失败，将回退到 2D CSV 数据：', e && e.message ? e.message : e);
    lineGenreData = null;
  }
  var months = ['2023-12', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];
  var allGenres = ["ACG", "classical", "electronic", "folk", "jazz", "pop", "rap", "rock"];

  // ✅ 与 2D 热力图保持一致的数据源（避免 3D 使用 JSON 失败后随机数导致“XOY 平面数据不一致”）
  var CSV_DATA_2D = "month,classical,electronic,folk,jazz,pop,rock,ACG,rap\n2023-12,35,34,64,47,24,32,37,37\n2024-01,35,33,58,46,23,31,32,36\n2024-02,34,32,62,48,26,33,34,39\n2024-03,35,34,59,48,23,34,37,38\n2024-04,31,34,55,47,21,34,31,36\n2024-05,32,48,57,46,24,34,32,38\n2024-06,32,49,62,48,23,36,31,40\n2024-07,31,38,64,49,25,32,31,38\n2024-08,30,39,62,46,23,32,32,37\n2024-09,32,35,60,45,23,36,33,45\n2024-10,31,32,60,49,23,33,31,46\n2024-11,35,33,58,45,22,32,32,39\n2024-12,35,35,63,48,23,33,37,39\n2025-01,32,34,54,47,22,32,32,38\n2025-02,33,33,58,48,22,31,29,42\n2025-03,33,32,56,48,22,31,31,36\n2025-04,31,33,59,45,22,31,30,36\n2025-05,30,37,58,46,23,32,30,39\n2025-06,29,33,57,46,21,32,31,36\n2025-07,29,36,60,48,21,39,31,38\n2025-08,31,35,59,46,22,34,31,34\n2025-09,30,32,61,46,22,33,30,32\n2025-10,33,33,59,44,21,34,31,36\n2025-11,31,32,57,46,21,33,30,33\n2025-12,33,32,60,45,23,32,33,39";
  function buildFrom2DCsv() {
    var rows = d3.csvParse(CSV_DATA_2D.trim());
    // 统一成 heatmap.js 原来的 genreData 结构：[{month, genre_distribution:{...}}]
    genreData = months.map(function (m) {
      var row = rows.find(function (r) {
        return r.month === m;
      });
      var dist = {};
      for (var _i = 0, _allGenres = allGenres; _i < _allGenres.length; _i++) {
        var g = _allGenres[_i];
        dist[g] = row ? +row[g] || 0 : 0;
      }
      return {
        month: m,
        genre_distribution: dist
      };
    });

    // 同时生成 surfaceData（monthIdx x genreIdx）
    surfaceData = months.map(function (m) {
      var chunk = genreData.find(function (d) {
        return d.month === m;
      });
      return allGenres.map(function (g) {
        return chunk && chunk.genre_distribution ? chunk.genre_distribution[g] || 0 : 0;
      });
    });
  }
  function loadData() {
    // 直接使用与 2D 一致的 CSV 数据，保证 XOY 平面一致
    console.log('✅ 3D热力图使用与2D一致的CSV数据源');
    buildFrom2DCsv();
    processData();
    init3DHeatmap();
  }
  function processData() {
    // surfaceData 已在 buildFrom2DCsv 中生成；这里兜底确保结构正确
    if (!surfaceData || surfaceData.length !== months.length) {
      buildFrom2DCsv();
    }
    console.log('✅ 数据处理完成');
  }

  // 旋转角度（全局变量，支持鼠标拖动旋转）
  var rotationAngle = Math.PI / 6; // 默认30度

  // 等轴测投影函数（支持旋转）
  function isometricProjection(x, y, z) {
    // 等轴测投影：x轴向右，y轴向前（深度），z轴向上
    // 支持水平旋转（绕Z轴）
    var angle = Math.PI / 6; // 基础等轴测角度30度
    var scale = 1.2; // 稍微放大一点，让3D效果更明显

    // 应用水平旋转
    var cosR = Math.cos(rotationAngle);
    var sinR = Math.sin(rotationAngle);
    var rotatedX = x * cosR - y * sinR;
    var rotatedY = x * sinR + y * cosR;

    // 等轴测投影
    var isoX = (rotatedX - rotatedY) * Math.cos(angle) * scale;
    var isoY = (rotatedX + rotatedY) * Math.sin(angle) * scale - z * scale;
    return {
      x: isoX,
      y: isoY
    };
  }
  function init3DHeatmap() {
    if (!surfaceData || surfaceData.length === 0) {
      console.warn('surfaceData为空，创建默认数据');
      surfaceData = Array(25).fill(null).map(function () {
        return Array(allGenres.length).fill(10);
      });
    }

    // ✅ 装饰层：模式徽标 + 可折叠注释 + 容器质感
    ensureHeatmapOverlay();

    // 获取容器尺寸的函数 - 使用实际容器尺寸
    var getContainerSize = function getContainerSize() {
      // 获取实际容器尺寸，如果为0则使用默认值
      var actualWidth = container.clientWidth || container.offsetWidth || 1600;
      var actualHeight = container.clientHeight || container.offsetHeight || 800;
      return {
        width: actualWidth > 0 ? actualWidth : 1600,
        height: actualHeight > 0 ? actualHeight : 800
      };
    };
    var containerSize = getContainerSize();
    // 使用实际容器尺寸，不强制最小值
    var containerWidth = containerSize.width;
    var containerHeight = containerSize.height;

    // 计算数据范围
    var minValue = Infinity;
    var maxValue = 0;
    for (var i = 0; i < surfaceData.length; i++) {
      for (var j = 0; j < surfaceData[i].length; j++) {
        minValue = Math.min(minValue, surfaceData[i][j]);
        maxValue = Math.max(maxValue, surfaceData[i][j]);
      }
    }
    if (maxValue === 0) maxValue = 1;
    var valueRange = maxValue - minValue || 1;

    // ✅ 赛博霓虹渐变（与 2D 使用同一套主题色），保证 2D/3D 颜色映射一致
    function cssVar(name, fallback) {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name);
      return (v || "").trim() || fallback;
    }
    // ✅ 赛博霓虹渐变：对齐 2D 与截图风格
    // ✅ 热力图本体：使用“紫白”渐变（按你原图/legend）
    var heatmapStops = getCyberStops();
    var heatmapInterpolator = d3.interpolateRgbBasis(heatmapStops);
    var heatmapColorScale = d3.scaleSequential().domain([minValue, maxValue]).interpolator(heatmapInterpolator);
    function getColor(value) {
      return heatmapColorScale(value || 0);
    }

    // ✅ 折线/半透明填充：恢复到你原来的配色体系（不要跟着热力图改）
    // 说明：之前折线颜色来自旧的“赛博渐变”（蓝→紫→青→粉），你说“别动折线图”就用这套固定给折线。
    var lineStops = ["#2a4e8f", cssVar("--accent-violet", "#7c3aed"), cssVar("--accent-cyan", "#00fff0"), "#ff5adf"];
    var lineInterpolator = d3.interpolateRgbBasis(lineStops);
    var lineColorScale = d3.scaleSequential().domain([minValue, maxValue]).interpolator(lineInterpolator);

    // === 颜色映射图例（2D/3D 共用容器）===
    (function updateLegend() {
      var legend = document.getElementById("heatmap-color-legend");
      if (!legend) return;
      var fmt = d3.format(",d");
      legend.innerHTML = "\n        <div class=\"legend-title\">Score \u2192 Color</div>\n        <div class=\"legend-bar\" style=\"background: linear-gradient(90deg, ".concat(heatmapStops.join(","), ");\"></div>\n        <div class=\"legend-labels\">\n          <span>").concat(fmt(minValue !== null && minValue !== void 0 ? minValue : 0), "</span>\n          <span>").concat(fmt(maxValue !== null && maxValue !== void 0 ? maxValue : 0), "</span>\n        </div>\n      ");
    })();

    // === Tooltip（2D/3D 复用同一个）===
    var tooltip = d3.select("body").select(".heatmap-tooltip");
    if (tooltip.empty()) {
      tooltip = d3.select("body").append("div").attr("class", "heatmap-tooltip");
    }
    tooltip
    // ⚠️ 统一用 fixed + clientX/clientY，避免页面缩放/滚动导致 tooltip “跑到屏幕外”
    .style("position", "fixed").style("pointer-events", "none").style("opacity", 0).style("padding", "10px 12px").style("border-radius", "12px").style("background", "rgba(30,41,59,0.92)").style("color", "#fff").style("font", '13px/1.35 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif').style("box-shadow", "0 10px 24px rgba(0,0,0,0.16)").style("z-index", 1000);
    function placeTooltip(evt) {
      var offsetX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;
      var offsetY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -18;
      var e = evt && evt.sourceEvent ? evt.sourceEvent : evt;
      var cx = e && typeof e.clientX === "number" ? e.clientX : e && typeof e.pageX === "number" ? e.pageX : 0;
      var cy = e && typeof e.clientY === "number" ? e.clientY : e && typeof e.pageY === "number" ? e.pageY : 0;

      // 基于 tooltip 当前尺寸做边界夹紧
      var node = tooltip.node();
      var w = node ? node.offsetWidth || 0 : 0;
      var h = node ? node.offsetHeight || 0 : 0;
      var pad = 10;
      var x = cx + offsetX;
      var y = cy + offsetY;
      var maxX = (window.innerWidth || 0) - w - pad;
      var maxY = (window.innerHeight || 0) - h - pad;
      x = Math.max(pad, Math.min(x, maxX));
      y = Math.max(pad, Math.min(y, maxY));
      tooltip.style("left", "".concat(x, "px")).style("top", "".concat(y, "px"));
    }

    // 创建SVG，先不设置viewBox，等计算完内容尺寸后再设置
    var svg = d3.select(container).append("svg").attr("width", "100%").attr("height", "100%").style("cursor", "grab");

    //#region Heatmap 3D｜SVG 滤镜（微弱霓虹光晕，贴近截图质感）
    // 注意：滤镜对性能有一点影响，所以做“轻量版”（更像截图的柔光而非强发光）
    var defs = svg.append("defs");
    var glow = defs.append("filter").attr("id", "hm-glow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
    glow.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "1.6").attr("result", "blur");
    var merge = glow.append("feMerge");
    merge.append("feMergeNode").attr("in", "blur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    // 折线/面积保持原样式：不额外加滤镜（避免改变你原来的折线图观感）
    //#endregion

    // 鼠标拖动旋转相关变量
    var isDragging = false;
    var lastMouseX = 0;

    // 3D空间参数（放大）
    var cellWidth = 50; // 每个单元格的宽度（X轴：genre方向）
    var cellDepth = 25; // 每个单元格的深度（Y轴：month方向）
    var maxHeight = 120; // 最大高度（Z轴）
    var numGenres = allGenres.length;
    var numMonths = months.length;

    // 计算3D空间的边界
    var totalWidth = numGenres * cellWidth;
    var totalDepth = numMonths * cellDepth;

    // 计算投影后的边界，用于居中
    var corners = [isometricProjection(0, 0, 0), isometricProjection(totalWidth, 0, 0), isometricProjection(0, totalDepth, 0), isometricProjection(totalWidth, totalDepth, 0), isometricProjection(0, 0, maxHeight), isometricProjection(totalWidth, 0, maxHeight)];
    var minX = d3.min(corners, function (d) {
      return d.x;
    });
    var maxX = d3.max(corners, function (d) {
      return d.x;
    });
    var minY = d3.min(corners, function (d) {
      return d.y;
    });
    var maxY = d3.max(corners, function (d) {
      return d.y;
    });
    var projectedWidth = maxX - minX;
    var projectedHeight = maxY - minY;

    // 添加边距，确保内容不会被裁剪
    var padding = 50;
    var viewBoxMinX = minX - padding;
    var viewBoxMinY = minY - padding;
    var viewBoxWidth = projectedWidth + padding * 2;
    var viewBoxHeight = projectedHeight + padding * 2;

    // 使用内容尺寸作为 viewBox，让 SVG 自动缩放适应容器
    // preserveAspectRatio="xMidYMid meet" 会自动居中内容
    svg.attr("viewBox", "".concat(viewBoxMinX, " ").concat(viewBoxMinY, " ").concat(viewBoxWidth, " ").concat(viewBoxHeight)).attr("preserveAspectRatio", "xMidYMid meet");

    // 不需要 transform，内容使用原始坐标
    // viewBox 已经包含了所有内容，preserveAspectRatio 会自动居中
    var g = svg.append("g");

    // 存储所有交互元素
    var interactiveElements = [];

    // 存储所有单元格数据，用于旋转时重新渲染
    var cellDataArray = [];
    // 存储所有折线数据
    var lineDataArray = [];

    // 辅助函数：绘制立方体的一个面
    function drawFace(svgGroup, points, fillColor, strokeColor) {
      var opacity = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var path = d3.path();
      path.moveTo(points[0].x, points[0].y);
      for (var _i2 = 1; _i2 < points.length; _i2++) {
        path.lineTo(points[_i2].x, points[_i2].y);
      }
      path.closePath();
      return svgGroup.append("path").attr("d", path.toString()).attr("fill", fillColor).attr("stroke", strokeColor).attr("stroke-width", 0.5).attr("opacity", opacity);
    }

    // 辅助函数：使颜色变暗（用于侧面）
    function darkenColor(rgb, factor) {
      var match = rgb.match(/\d+/g);
      if (!match) return rgb;
      var r = Math.max(0, Math.round(parseInt(match[0]) * factor));
      var g = Math.max(0, Math.round(parseInt(match[1]) * factor));
      var b = Math.max(0, Math.round(parseInt(match[2]) * factor));
      return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
    }

    // ========== 第一步：绘制3D热力图（带厚度的立方体） ==========
    var cellThickness = 6; // 每个单元格的厚度（Z轴高度），参考图看起来约6像素

    for (var genreIdx = 0; genreIdx < numGenres; genreIdx++) {
      for (var monthIdx = 0; monthIdx < numMonths; monthIdx++) {
        var value = surfaceData[monthIdx][genreIdx];
        var baseColor = getColor(value);
        var darkColor = darkenColor(baseColor, 0.85); // 侧面颜色（稍微暗一点，不要太深）
        var darkerColor = darkenColor(baseColor, 0.75); // 背面颜色（稍微更暗一点）

        // 3D坐标（X=genre, Y=month, Z=0为底部，Z=thickness为顶部）
        var x = genreIdx * cellWidth;
        var y = monthIdx * cellDepth;
        var zBottom = 0;
        var zTop = cellThickness;

        // 计算立方体的8个顶点
        // 底部四个角
        var bottom1 = isometricProjection(x, y, zBottom);
        var bottom2 = isometricProjection(x + cellWidth, y, zBottom);
        var bottom3 = isometricProjection(x + cellWidth, y + cellDepth, zBottom);
        var bottom4 = isometricProjection(x, y + cellDepth, zBottom);

        // 顶部四个角
        var top1 = isometricProjection(x, y, zTop);
        var top2 = isometricProjection(x + cellWidth, y, zTop);
        var top3 = isometricProjection(x + cellWidth, y + cellDepth, zTop);
        var top4 = isometricProjection(x, y + cellDepth, zTop);

        // 创建单元格组
        var cellGroup = g.append("g").attr("class", "cell-group cell-".concat(monthIdx, "-").concat(genreIdx)).datum({
          month: months[monthIdx],
          genre: allGenres[genreIdx],
          value: value,
          monthIdx: monthIdx,
          genreIdx: genreIdx,
          x: x,
          y: y,
          z: zBottom
        }).style("cursor", "pointer");

        // 存储单元格数据
        cellDataArray.push({
          monthIdx: monthIdx,
          genreIdx: genreIdx,
          x: x,
          y: y,
          zBottom: zBottom,
          zTop: zTop,
          value: value,
          baseColor: baseColor,
          darkColor: darkColor,
          darkerColor: darkerColor,
          cellGroup: cellGroup
        });

        // 绘制立方体的各个面（从后往前，确保正确的遮挡）
        // 1. 底面
        drawFace(cellGroup, [bottom1, bottom2, bottom3, bottom4], baseColor, "rgba(50,167,255,0.14)", 0.90);

        // 2. 右侧面
        drawFace(cellGroup, [bottom2, top2, top3, bottom3], darkColor, "rgba(50,167,255,0.10)", 0.92);

        // 3. 背面
        drawFace(cellGroup, [bottom4, bottom3, top3, top4], darkerColor, "rgba(50,167,255,0.10)", 0.88);

        // 4. 顶面（最后绘制，确保在最上层）
        var topFace = drawFace(cellGroup, [top1, top2, top3, top4], baseColor, "rgba(255,255,255,0.22)", 1);
        topFace.attr("filter", "url(#hm-glow)");

        // 将顶面添加到交互元素（用于tooltip）
        interactiveElements.push(topFace);
      }
    }

    // ========== 添加交互事件 ==========
    // 折线/曲目数量的数据源：优先 JSON（lineGenreData），否则回退到 CSV（genreData）
    var lineSource = lineGenreData && Array.isArray(lineGenreData) && lineGenreData.length ? lineGenreData : genreData;
    interactiveElements.forEach(function (element) {
      element.on("mouseover", function (event) {
        // ⚠️ 关键修复：面(path)本身没绑定 datum，数据在父级 cellGroup 上
        var parentGroup = d3.select(this.parentNode);
        var d = parentGroup.datum();
        if (!d) return;

        // 高亮整个立方体组
        parentGroup.selectAll("path").attr("opacity", 1).attr("stroke-width", 1.5);

        // 从 JSON/CSV 的 genre_distribution 获取曲目数量
        var trackCount = 0;
        if (lineSource && lineSource[d.monthIdx]) {
          var chunk = lineSource[d.monthIdx];
          var genreKey = allGenres[d.genreIdx];
          if (chunk && chunk.genre_distribution && chunk.genre_distribution[genreKey] !== undefined) {
            trackCount = chunk.genre_distribution[genreKey];
          }
        } else {
          trackCount = Math.round(d.value);
        }

        // 直接设置（不走 transition，避免在切换/重绘时被打断导致“tooltip 不显示”）
        tooltip.style("opacity", 0.95);
        tooltip.html("<b>".concat(d.genre, "</b><br/>").concat(d.month, "<br/>\u5206\u503C: ").concat((+d.value).toFixed(2), "<br/>\u66F2\u76EE\u6570\u91CF: ").concat(trackCount));
        placeTooltip(event);
      }).on("mousemove", function (event) {
        // tooltip 跟随鼠标（不重新算内容，减少抖动）
        placeTooltip(event);
      }).on("mouseout", function () {
        // 恢复整个立方体组的原始样式
        var parentGroup = d3.select(this.parentNode);
        parentGroup.selectAll("path").attr("opacity", function () {
          // 根据面的类型恢复不同的透明度
          var fill = d3.select(this).attr("fill");
          if (fill && fill.includes("rgb")) {
            var match = fill.match(/\d+/g);
            if (match) {
              var r = parseInt(match[0]);
              var _g = parseInt(match[1]);
              var b = parseInt(match[2]);
              // 根据亮度判断是顶面、侧面还是底面
              var brightness = (r + _g + b) / 3;
              if (brightness > 200) return 1; // 顶面
              if (brightness > 150) return 0.85; // 侧面
              return 0.8; // 背面/底面
            }
          }
          return 0.9;
        }).attr("stroke-width", 0.5);
        tooltip.style("opacity", 0);
      });
    });

    // ========== 添加折线趋势图（每个月份一条，沿X轴延伸，Z轴表示高度） ==========
    // 计算折线高度的范围
    var minLineHeight = Infinity;
    var maxLineHeight = 0;
    if (lineSource && lineSource.length > 0) {
      for (var _i3 = 0; _i3 < lineSource.length; _i3++) {
        var chunk = lineSource[_i3];
        if (chunk && chunk.genre_distribution) {
          for (var _i4 = 0, _allGenres2 = allGenres; _i4 < _allGenres2.length; _i4++) {
            var genre = _allGenres2[_i4];
            var val = chunk.genre_distribution[genre] || 0;
            minLineHeight = Math.min(minLineHeight, val);
            maxLineHeight = Math.max(maxLineHeight, val);
          }
        }
      }
    }

    // 如果genreData为空，使用surfaceData的数据
    if (!lineSource || lineSource.length === 0 || minLineHeight === Infinity) {
      minLineHeight = Infinity;
      maxLineHeight = 0;
      for (var _i5 = 0; _i5 < surfaceData.length; _i5++) {
        for (var _j = 0; _j < surfaceData[_i5].length; _j++) {
          var _val = surfaceData[_i5][_j] || 0;
          minLineHeight = Math.min(minLineHeight, _val);
          maxLineHeight = Math.max(maxLineHeight, _val);
        }
      }
    }

    // 确保有有效的数据范围
    if (minLineHeight === Infinity) minLineHeight = 0;
    if (maxLineHeight === 0) maxLineHeight = 1;
    var lineHeightRange = maxLineHeight - minLineHeight || 1;
    var maxLineZ = maxHeight * 1.2; // 折线最大高度，降低高度

    console.log('📊 折线图数据范围:', {
      minLineHeight: minLineHeight,
      maxLineHeight: maxLineHeight,
      lineHeightRange: lineHeightRange,
      maxLineZ: maxLineZ
    });

    // D3的平滑曲线生成器（沿X轴延伸，所以用curveMonotoneX）
    var lineGenerator = d3.line().curve(d3.curveMonotoneX) // 平滑曲线，沿X轴
    .x(function (d) {
      var projected = isometricProjection(d.x, d.y, d.z);
      return projected.x;
    }).y(function (d) {
      var projected = isometricProjection(d.x, d.y, d.z);
      return projected.y;
    });

    // D3的面积生成器（用于填充）
    var areaGenerator = d3.area().curve(d3.curveMonotoneX) // 沿X轴
    .x(function (d) {
      var projected = isometricProjection(d.x, d.y, d.z);
      return projected.x;
    }).y0(function (d) {
      // 底部（热力图顶部）
      var projected = isometricProjection(d.x, d.y, cellThickness);
      return projected.y;
    }).y1(function (d) {
      // 顶部（折线高度）
      var projected = isometricProjection(d.x, d.y, d.z);
      return projected.y;
    });

    // 为每个月份绘制折线（沿X轴：风格方向）
    var _loop = function _loop(_monthIdx) {
      var month = months[_monthIdx];
      var monthY = _monthIdx * cellDepth + cellDepth / 2; // 月份的中心Y坐标

      // 生成折线的数据点（沿X轴：从genre 0到genre 7）
      var lineData = [];
      for (var _genreIdx = 0; _genreIdx < numGenres; _genreIdx++) {
        var _value = 0;
        if (lineSource && lineSource[_monthIdx] && lineSource[_monthIdx].genre_distribution) {
          var _genre = allGenres[_genreIdx];
          _value = lineSource[_monthIdx].genre_distribution[_genre] || 0;
        } else if (surfaceData && surfaceData[_monthIdx]) {
          // 如果genreData为空，使用surfaceData
          _value = surfaceData[_monthIdx][_genreIdx] || 0;
        }

        // 归一化高度，确保不会出现NaN
        var normalizedValue = lineHeightRange > 0 ? (_value - minLineHeight) / lineHeightRange : 0;
        var z = cellThickness + (isNaN(normalizedValue) ? 0 : normalizedValue) * maxLineZ; // 从热力图顶部开始

        var genreX = _genreIdx * cellWidth + cellWidth / 2; // genre的中心X坐标

        // 验证坐标不是NaN
        if (!isNaN(genreX) && !isNaN(monthY) && !isNaN(z)) {
          lineData.push({
            x: genreX,
            y: monthY,
            z: z,
            value: _value,
            monthIdx: _monthIdx,
            genreIdx: _genreIdx
          });
        }
      }

      // 获取该月份的平均颜色（使用热力图的颜色方案——保持你原来的折线图逻辑）
      var avgValue = lineData.reduce(function (sum, d) {
        return sum + d.value;
      }, 0) / lineData.length;
      // ✅ 折线用“旧配色”（不跟随热力图紫白渐变）
      var lineColor = lineColorScale(avgValue);
      // 原逻辑：折线/面积使用更深的颜色以凸显（不要改你的观感）
      var darkerLineColor = darkenColor(lineColor, 0.16);

      // 存储折线数据（用于旋转时更新）
      if (lineData.length > 0) {
        lineDataArray.push({
          monthIdx: _monthIdx,
          month: month,
          lineData: [].concat(lineData),
          // 复制数组
          darkerLineColor: darkerLineColor,
          lineColor: lineColor
        });
      }

      // 只有当有有效数据点时才绘制
      if (lineData.length > 0) {
        // 创建面积填充（半透明）
        var areaPath = areaGenerator(lineData);
        if (areaPath && !areaPath.includes('NaN')) {
          var areaElement = g.append("path").attr("class", "area-path area-".concat(_monthIdx)).attr("d", areaPath).attr("fill", darkerLineColor).attr("fill-opacity", 0.28).attr("stroke", "none").datum({
            lineData: lineData,
            month: month,
            monthIdx: _monthIdx
          }) // 存储数据
          .style("cursor", "pointer")
          // ✅ 关键：确保面积能接收鼠标事件（避免被 SVG 默认/父层样式影响）
          .style("pointer-events", "fill");

          // 为面积填充也添加鼠标事件（确保tooltip能显示）
          areaElement.on("mousemove", function (event) {
            // 获取鼠标在SVG中的坐标
            var _d3$pointer3 = d3.pointer(event, g.node()),
              _d3$pointer4 = _slicedToArray(_d3$pointer3, 2),
              mouseX = _d3$pointer4[0],
              mouseY = _d3$pointer4[1];

            // 找到最近的数据点
            var minDistance = Infinity;
            var nearestPoint = null;
            var nearestGenreIdx = -1;
            lineData.forEach(function (point, idx) {
              var projected = isometricProjection(point.x, point.y, point.z);
              var distance = Math.sqrt(Math.pow(mouseX - projected.x, 2) + Math.pow(mouseY - projected.y, 2));
              if (distance < minDistance) {
                minDistance = distance;
                nearestPoint = point;
                nearestGenreIdx = idx;
              }
            });

            // ✅ 放宽阈值：面积本身就很大，只要能算出最近点就显示
            if (nearestPoint) {
              // 曲目数量：优先 lineSource(JSON)，否则回退
              var trackCount = 0;
              var _chunk2 = lineSource && lineSource[_monthIdx] ? lineSource[_monthIdx] : null;
              var _genre2 = allGenres[nearestGenreIdx];
              if (_chunk2 && _chunk2.genre_distribution && _chunk2.genre_distribution[_genre2] !== undefined) {
                trackCount = _chunk2.genre_distribution[_genre2];
              } else {
                trackCount = Math.round(nearestPoint.value);
              }
              tooltip.style("opacity", 0.95);
              tooltip.html("<b>".concat(allGenres[nearestGenreIdx], "</b><br/>").concat(month, "<br/>\u5206\u503C: ").concat(nearestPoint.value.toFixed(2), "<br/>\u66F2\u76EE\u6570\u91CF: ").concat(trackCount));
              placeTooltip(event);
            }
          }).on("mouseout", function () {
            tooltip.style("opacity", 0);
          });
        }

        // 创建折线（确保在最上层显示，使用深色使其更明显）
        var linePath = lineGenerator(lineData);
        if (linePath && !linePath.includes('NaN')) {
          var lineElement = g.append("path").attr("class", "line-path line-".concat(_monthIdx)).attr("d", linePath).attr("fill", "none").attr("stroke", darkerLineColor).attr("stroke-width", 3.0).attr("opacity", 1).datum({
            lineData: lineData,
            month: month,
            monthIdx: _monthIdx
          }) // 存储数据
          .style("cursor", "pointer")
          // ✅ 关键：折线只用 stroke 命中，更好点到线
          .style("pointer-events", "stroke");

          // ✅ 给折线加“隐形粗命中层”，解决“线太细很难 hover 到”
          var hitLine = g.append("path").attr("class", "line-hit line-hit-".concat(_monthIdx)).attr("d", linePath).attr("fill", "none")
          // ⚠️ 不要用完全 transparent：部分浏览器下会导致 pointer hit 失效
          .attr("stroke", "#ffffff").attr("stroke-opacity", 0.001).attr("stroke-width", 14) // 命中更容易
          .attr("opacity", 1).datum({
            lineData: lineData,
            month: month,
            monthIdx: _monthIdx
          }).style("cursor", "pointer").style("pointer-events", "stroke");

          // 为折线图添加鼠标事件（绑定到 hitLine；视觉线保留原样）
          var onLineMove = function onLineMove(event) {
            // 获取鼠标在SVG中的坐标
            var _d3$pointer5 = d3.pointer(event, g.node()),
              _d3$pointer6 = _slicedToArray(_d3$pointer5, 2),
              mouseX = _d3$pointer6[0],
              mouseY = _d3$pointer6[1];

            // 找到最近的数据点
            var minDistance = Infinity;
            var nearestPoint = null;
            var nearestGenreIdx = -1;
            lineData.forEach(function (point, idx) {
              var projected = isometricProjection(point.x, point.y, point.z);
              var distance = Math.sqrt(Math.pow(mouseX - projected.x, 2) + Math.pow(mouseY - projected.y, 2));
              if (distance < minDistance) {
                minDistance = distance;
                nearestPoint = point;
                nearestGenreIdx = idx;
              }
            });

            // ✅ 放宽阈值：折线 hover 体验要“容易命中”，不做严格距离门槛
            if (nearestPoint) {
              // 曲目数量：优先 lineSource(JSON)，否则回退
              var trackCount = 0;
              var _chunk3 = lineSource && lineSource[_monthIdx] ? lineSource[_monthIdx] : null;
              var _genre3 = allGenres[nearestGenreIdx];
              if (_chunk3 && _chunk3.genre_distribution && _chunk3.genre_distribution[_genre3] !== undefined) {
                trackCount = _chunk3.genre_distribution[_genre3];
              } else {
                trackCount = Math.round(nearestPoint.value);
              }
              tooltip.style("opacity", 0.95);
              tooltip.html("<b>".concat(allGenres[nearestGenreIdx], "</b><br/>").concat(month, "<br/>\u5206\u503C: ").concat(nearestPoint.value.toFixed(2), "<br/>\u66F2\u76EE\u6570\u91CF: ").concat(trackCount));
              placeTooltip(event);
            }
          };
          hitLine.on("mousemove", onLineMove).on("mouseout", function () {
            tooltip.style("opacity", 0);
          });

          // 视觉线也绑定同样逻辑（双保险）
          lineElement.on("mousemove", onLineMove).on("mouseout", function () {
            tooltip.style("opacity", 0);
          });

          // ========== 添加最高点标记 ==========
          // 找到最高点（z值最大的点）
          var maxZ = -Infinity;
          var maxPoint = null;
          lineData.forEach(function (point) {
            if (point.z > maxZ) {
              maxZ = point.z;
              maxPoint = point;
            }
          });
          if (maxPoint) {
            var maxProjected = isometricProjection(maxPoint.x, maxPoint.y, maxPoint.z);

            // 绘制外圈（白色，更大）
            g.append("circle").attr("class", "max-point-outer max-point-outer-".concat(_monthIdx)).attr("cx", maxProjected.x).attr("cy", maxProjected.y).attr("r", 6).attr("fill", "#ffffff").attr("stroke", darkerLineColor).attr("stroke-width", 2).attr("opacity", 1).style("pointer-events", "none"); // 允许鼠标事件穿透到折线

            // 绘制内圈（折线颜色，更小）
            g.append("circle").attr("class", "max-point-inner max-point-inner-".concat(_monthIdx)).attr("cx", maxProjected.x).attr("cy", maxProjected.y).attr("r", 3.5).attr("fill", darkerLineColor).attr("stroke", "none").attr("opacity", 1).style("pointer-events", "none"); // 允许鼠标事件穿透到折线
          }
          console.log("\u2705 \u5DF2\u7ED8\u5236".concat(month, "\u7684\u6298\u7EBF\u56FE\uFF0C\u6570\u636E\u70B9: ").concat(lineData.length));
        } else {
          console.warn("\u26A0\uFE0F ".concat(month, "\u7684\u6298\u7EBF\u8DEF\u5F84\u751F\u6210\u5931\u8D25\uFF0C\u8DEF\u5F84: ").concat(linePath));
        }
      } else {
        console.warn("\u26A0\uFE0F ".concat(month, "\u6CA1\u6709\u6709\u6548\u7684\u6570\u636E\u70B9"));
      }
    };
    for (var _monthIdx = 0; _monthIdx < numMonths; _monthIdx++) {
      _loop(_monthIdx);
    }
    console.log('🎉 折线趋势图绘制完成！');
    // ========== 添加坐标轴线（原点与第一个方格左上角对齐） ==========
    var axisOffset = 8; // 坐标轴往外偏移的距离（增加，更往外）

    // 辅助函数：绘制带箭头的轴线
    function drawAxisWithArrow(start, end) {
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#555";
      var axisClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
      var line = g.append("line").attr("class", "axis-line ".concat(axisClass)).attr("x1", start.x).attr("y1", start.y).attr("x2", end.x).attr("y2", end.y).attr("stroke", color).attr("stroke-width", 2).attr("opacity", 0.7)
      // ✅ 坐标轴只显示，不要拦截折线/方块 hover
      .style("pointer-events", "none");

      // 计算箭头方向
      var dx = end.x - start.x;
      var dy = end.y - start.y;
      var angle = Math.atan2(dy, dx);
      var arrowLength = 8;

      // 绘制箭头
      var arrowPath = d3.path();
      arrowPath.moveTo(end.x, end.y);
      arrowPath.lineTo(end.x - arrowLength * Math.cos(angle - Math.PI / 6), end.y - arrowLength * Math.sin(angle - Math.PI / 6));
      arrowPath.lineTo(end.x - arrowLength * Math.cos(angle + Math.PI / 6), end.y - arrowLength * Math.sin(angle + Math.PI / 6));
      arrowPath.closePath();
      g.append("path").attr("class", "axis-arrow ".concat(axisClass)).attr("d", arrowPath.toString()).attr("fill", color).attr("opacity", 0.7).style("pointer-events", "none");
      return {
        line: line,
        start: start,
        end: end
      };
    }

    // 坐标原点在 (0, 0, 0)，即第一个方格的左上角
    var origin = isometricProjection(-axisOffset, -axisOffset, 0);

    // 赛博深色主题：轴线/箭头用浅色系，避免发灰看不清
    var AXIS_LINE = "rgba(50, 167, 255, 0.30)";
    var AXIS_TEXT = "rgba(226, 232, 240, 0.88)";
    var AXIS_STROKE = "rgba(7, 3, 18, 0.72)";

    // X轴（genres方向）- 从原点沿X轴延伸
    var xAxisEnd = isometricProjection(totalWidth + axisOffset, -axisOffset, 0);
    drawAxisWithArrow(origin, xAxisEnd, AXIS_LINE, "x-axis");

    // Y轴（months方向）- 从原点沿Y轴延伸
    var yAxisEnd = isometricProjection(-axisOffset, totalDepth + axisOffset, 0);
    drawAxisWithArrow(origin, yAxisEnd, AXIS_LINE, "y-axis");

    // Z轴（高度方向）- 从原点向上延伸
    var zAxisEnd = isometricProjection(-axisOffset, -axisOffset, maxHeight + axisOffset);
    drawAxisWithArrow(origin, zAxisEnd, AXIS_LINE, "z-axis");

    // ========== 添加坐标轴标签 ==========
    var labelOffset = 40; // X轴标签往外偏移的距离（增加，确保在方格外面）

    // X轴标签（genres）- 在底部前方（y<0的部分）
    allGenres.forEach(function (genre, idx) {
      var x = idx * cellWidth + cellWidth / 2;
      var y = -labelOffset; // y<0，在底部前方
      var projected = isometricProjection(x, y, 0); // 在y<0的位置

      g.append("text").attr("class", "axis-label x-label x-label-".concat(idx)).attr("x", projected.x).attr("y", projected.y).attr("text-anchor", "middle").attr("fill", AXIS_TEXT).attr("font-size", "11px").attr("font-weight", "500").style("font-family", "system-ui, -apple-system, sans-serif").style("paint-order", "stroke").style("stroke", AXIS_STROKE).style("stroke-width", "2.2px").style("stroke-linejoin", "round").style("pointer-events", "none").text(genre);
    });

    // Y轴标签（months）- 在左侧
    months.forEach(function (month, idx) {
      if (idx % 3 === 0) {
        // 只显示部分月份，避免太密集
        var _x = 0;
        var _y = idx * cellDepth + cellDepth / 2;
        var projected = isometricProjection(_x - labelOffset, _y, 0);
        g.append("text").attr("class", "axis-label y-label y-label-".concat(idx)).attr("x", projected.x).attr("y", projected.y).attr("text-anchor", "end").attr("fill", AXIS_TEXT).attr("font-size", "10px").style("font-family", "system-ui, -apple-system, sans-serif").style("paint-order", "stroke").style("stroke", AXIS_STROKE).style("stroke-width", "2.2px").style("stroke-linejoin", "round").style("pointer-events", "none").text(month);
      }
    });

    // Z轴标签（乐曲数量）- 再往上移
    var zLabelPos = isometricProjection(-10, 0, maxHeight + 25); // 增加Z坐标，让标签更往上
    g.append("text").attr("class", "axis-label z-label").attr("x", zLabelPos.x).attr("y", zLabelPos.y).attr("text-anchor", "middle").attr("fill", AXIS_TEXT).attr("font-size", "10px").attr("font-weight", "500").style("font-family", "system-ui, -apple-system, sans-serif").style("paint-order", "stroke").style("stroke", AXIS_STROKE).style("stroke-width", "2.2px").style("stroke-linejoin", "round").style("pointer-events", "none").text("乐曲数量");
    console.log('🎉 D3伪3D热力图初始化完成！');

    // ========== 更新函数：重新渲染所有元素（用于旋转） ==========
    function updateProjection() {
      // 重新计算边界
      var corners = [isometricProjection(0, 0, 0), isometricProjection(totalWidth, 0, 0), isometricProjection(0, totalDepth, 0), isometricProjection(totalWidth, totalDepth, 0), isometricProjection(0, 0, maxHeight), isometricProjection(totalWidth, 0, maxHeight)];
      var minX = d3.min(corners, function (d) {
        return d.x;
      });
      var maxX = d3.max(corners, function (d) {
        return d.x;
      });
      var minY = d3.min(corners, function (d) {
        return d.y;
      });
      var maxY = d3.max(corners, function (d) {
        return d.y;
      });
      var projectedWidth = maxX - minX;
      var projectedHeight = maxY - minY;

      // 更新 viewBox
      var padding = 50;
      var viewBoxMinX = minX - padding;
      var viewBoxMinY = minY - padding;
      var viewBoxWidth = projectedWidth + padding * 2;
      var viewBoxHeight = projectedHeight + padding * 2;
      svg.attr("viewBox", "".concat(viewBoxMinX, " ").concat(viewBoxMinY, " ").concat(viewBoxWidth, " ").concat(viewBoxHeight));

      // 更新所有单元格
      cellDataArray.forEach(function (cellData) {
        var x = cellData.x,
          y = cellData.y,
          zBottom = cellData.zBottom,
          zTop = cellData.zTop,
          monthIdx = cellData.monthIdx,
          genreIdx = cellData.genreIdx,
          baseColor = cellData.baseColor,
          darkColor = cellData.darkColor,
          darkerColor = cellData.darkerColor;

        // 重新计算8个顶点
        var bottom1 = isometricProjection(x, y, zBottom);
        var bottom2 = isometricProjection(x + cellWidth, y, zBottom);
        var bottom3 = isometricProjection(x + cellWidth, y + cellDepth, zBottom);
        var bottom4 = isometricProjection(x, y + cellDepth, zBottom);
        var top1 = isometricProjection(x, y, zTop);
        var top2 = isometricProjection(x + cellWidth, y, zTop);
        var top3 = isometricProjection(x + cellWidth, y + cellDepth, zTop);
        var top4 = isometricProjection(x, y + cellDepth, zTop);

        // 更新单元格组的所有面
        var cellGroup = g.select(".cell-".concat(monthIdx, "-").concat(genreIdx));
        if (!cellGroup.empty()) {
          var paths = cellGroup.selectAll("path");
          var faces = [[bottom1, bottom2, bottom3, bottom4],
          // 底面
          [bottom2, top2, top3, bottom3],
          // 右侧面
          [bottom4, bottom3, top3, top4],
          // 背面
          [top1, top2, top3, top4] // 顶面
          ];
          paths.each(function (d, i) {
            if (i < faces.length) {
              var path = d3.path();
              path.moveTo(faces[i][0].x, faces[i][0].y);
              for (var _j2 = 1; _j2 < faces[i].length; _j2++) {
                path.lineTo(faces[i][_j2].x, faces[i][_j2].y);
              }
              path.closePath();
              d3.select(this).attr("d", path.toString());
            }
          });
        }
      });

      // 更新所有折线
      lineDataArray.forEach(function (_ref) {
        var monthIdx = _ref.monthIdx,
          lineData = _ref.lineData;
        // 重新生成折线路径（使用与初始化时相同的lineGenerator逻辑）
        // 注意：需要按照投影后的X坐标排序，确保曲线方向正确
        var sortedLineData = _toConsumableArray(lineData).sort(function (a, b) {
          var projA = isometricProjection(a.x, a.y, a.z);
          var projB = isometricProjection(b.x, b.y, b.z);
          return projA.x - projB.x;
        });
        var lineGeneratorUpdate = d3.line().curve(d3.curveMonotoneX).x(function (d) {
          var projected = isometricProjection(d.x, d.y, d.z);
          return projected.x;
        }).y(function (d) {
          var projected = isometricProjection(d.x, d.y, d.z);
          return projected.y;
        });

        // 更新折线（使用正确的选择器，class是 "line-path line-${monthIdx}"）
        var lineElement = g.select(".line-path.line-".concat(monthIdx));
        if (!lineElement.empty()) {
          var newPath = lineGeneratorUpdate(sortedLineData);
          if (newPath && !newPath.includes('NaN')) {
            lineElement.attr("d", newPath);
          }
        }

        // 更新面积填充（重新创建areaGenerator，因为投影函数已更新）
        // 使用排序后的数据，确保与折线一致
        var areaGeneratorUpdate = d3.area().curve(d3.curveMonotoneX).x(function (d) {
          var projected = isometricProjection(d.x, d.y, d.z);
          return projected.x;
        }).y0(function (d) {
          var projected = isometricProjection(d.x, d.y, cellThickness);
          return projected.y;
        }).y1(function (d) {
          var projected = isometricProjection(d.x, d.y, d.z);
          return projected.y;
        });
        var areaElement = g.select(".area-".concat(monthIdx));
        if (!areaElement.empty()) {
          areaElement.attr("d", areaGeneratorUpdate(sortedLineData));
        }

        // 更新最高点标记
        var maxZ = -Infinity;
        var maxPoint = null;
        lineData.forEach(function (point) {
          if (point.z > maxZ) {
            maxZ = point.z;
            maxPoint = point;
          }
        });
        if (maxPoint) {
          var maxProjected = isometricProjection(maxPoint.x, maxPoint.y, maxPoint.z);
          g.select(".max-point-outer-".concat(monthIdx)).attr("cx", maxProjected.x).attr("cy", maxProjected.y);
          g.select(".max-point-inner-".concat(monthIdx)).attr("cx", maxProjected.x).attr("cy", maxProjected.y);
        }
      });

      // 更新坐标轴（使用外部定义的axisOffset和labelOffset）

      // 更新原点
      origin = isometricProjection(-axisOffset, -axisOffset, 0);

      // 更新X轴
      xAxisEnd = isometricProjection(totalWidth + axisOffset, -axisOffset, 0);
      g.select(".x-axis.axis-line").attr("x1", origin.x).attr("y1", origin.y).attr("x2", xAxisEnd.x).attr("y2", xAxisEnd.y);
      var xAxisAngle = Math.atan2(xAxisEnd.y - origin.y, xAxisEnd.x - origin.x);
      var xArrowLength = 8;
      var xArrowPath = d3.path();
      xArrowPath.moveTo(xAxisEnd.x, xAxisEnd.y);
      xArrowPath.lineTo(xAxisEnd.x - xArrowLength * Math.cos(xAxisAngle - Math.PI / 6), xAxisEnd.y - xArrowLength * Math.sin(xAxisAngle - Math.PI / 6));
      xArrowPath.lineTo(xAxisEnd.x - xArrowLength * Math.cos(xAxisAngle + Math.PI / 6), xAxisEnd.y - xArrowLength * Math.sin(xAxisAngle + Math.PI / 6));
      xArrowPath.closePath();
      g.select(".x-axis.axis-arrow").attr("d", xArrowPath.toString());

      // 更新Y轴
      yAxisEnd = isometricProjection(-axisOffset, totalDepth + axisOffset, 0);
      g.select(".y-axis.axis-line").attr("x1", origin.x).attr("y1", origin.y).attr("x2", yAxisEnd.x).attr("y2", yAxisEnd.y);
      var yAxisAngle = Math.atan2(yAxisEnd.y - origin.y, yAxisEnd.x - origin.x);
      var yArrowLength = 8;
      var yArrowPath = d3.path();
      yArrowPath.moveTo(yAxisEnd.x, yAxisEnd.y);
      yArrowPath.lineTo(yAxisEnd.x - yArrowLength * Math.cos(yAxisAngle - Math.PI / 6), yAxisEnd.y - yArrowLength * Math.sin(yAxisAngle - Math.PI / 6));
      yArrowPath.lineTo(yAxisEnd.x - yArrowLength * Math.cos(yAxisAngle + Math.PI / 6), yAxisEnd.y - yArrowLength * Math.sin(yAxisAngle + Math.PI / 6));
      yArrowPath.closePath();
      g.select(".y-axis.axis-arrow").attr("d", yArrowPath.toString());

      // 更新Z轴
      zAxisEnd = isometricProjection(-axisOffset, -axisOffset, maxHeight + axisOffset);
      g.select(".z-axis.axis-line").attr("x1", origin.x).attr("y1", origin.y).attr("x2", zAxisEnd.x).attr("y2", zAxisEnd.y);
      var zAxisAngle = Math.atan2(zAxisEnd.y - origin.y, zAxisEnd.x - origin.x);
      var zArrowLength = 8;
      var zArrowPath = d3.path();
      zArrowPath.moveTo(zAxisEnd.x, zAxisEnd.y);
      zArrowPath.lineTo(zAxisEnd.x - zArrowLength * Math.cos(zAxisAngle - Math.PI / 6), zAxisEnd.y - zArrowLength * Math.sin(zAxisAngle - Math.PI / 6));
      zArrowPath.lineTo(zAxisEnd.x - zArrowLength * Math.cos(zAxisAngle + Math.PI / 6), zAxisEnd.y - zArrowLength * Math.sin(zAxisAngle + Math.PI / 6));
      zArrowPath.closePath();
      g.select(".z-axis.axis-arrow").attr("d", zArrowPath.toString());

      // 更新X轴标签
      allGenres.forEach(function (genre, idx) {
        var x = idx * cellWidth + cellWidth / 2;
        var y = -labelOffset;
        var projected = isometricProjection(x, y, 0);
        g.select(".x-label-".concat(idx)).attr("x", projected.x).attr("y", projected.y);
      });

      // 更新Y轴标签
      months.forEach(function (month, idx) {
        if (idx % 3 === 0) {
          var _x2 = 0;
          var _y2 = idx * cellDepth + cellDepth / 2;
          var projected = isometricProjection(_x2 - labelOffset, _y2, 0);
          g.select(".y-label-".concat(idx)).attr("x", projected.x).attr("y", projected.y);
        }
      });

      // 更新Z轴标签
      zLabelPos = isometricProjection(-10, 0, maxHeight + 25);
      g.select(".z-label").attr("x", zLabelPos.x).attr("y", zLabelPos.y);
    }

    // ========== 鼠标拖动旋转事件 ==========
    svg.on("mousedown", function (event) {
      isDragging = true;
      lastMouseX = event.clientX;
      svg.style("cursor", "grabbing");
      event.preventDefault();
    });
    svg.on("mousemove", function (event) {
      if (isDragging) {
        var deltaX = event.clientX - lastMouseX;
        rotationAngle += deltaX * 0.01; // 旋转速度

        // 更新投影
        updateProjection();
        lastMouseX = event.clientX;
        event.preventDefault();
      } else {
        // ✅ 折线 tooltip 的“兜底”逻辑：不依赖命中折线本体
        // 原因：不同浏览器对透明 stroke 的命中行为不一致，导致“挪到折线也不触发”
        // 策略：鼠标移动时，计算离鼠标最近的折线点；只要靠近折线就显示 tooltip。
        try {
          // 如果鼠标在热力图方块上（cell-group），优先让方块 tooltip 生效
          var t = event && event.target ? event.target : null;
          if (t && t.closest && t.closest(".cell-group")) return;

          // 鼠标在 g 内部坐标
          var _d3$pointer = d3.pointer(event, g.node()),
            _d3$pointer2 = _slicedToArray(_d3$pointer, 2),
            mouseX = _d3$pointer2[0],
            mouseY = _d3$pointer2[1];
          var best = null; // {monthIdx, genreIdx, month, genre, value, dist}
          for (var mi = 0; mi < lineDataArray.length; mi++) {
            var series = lineDataArray[mi];
            if (!series || !series.lineData) continue;
            for (var gi = 0; gi < series.lineData.length; gi++) {
              var p = series.lineData[gi];
              var projected = isometricProjection(p.x, p.y, p.z);
              var dx = mouseX - projected.x;
              var dy = mouseY - projected.y;
              var dist = Math.sqrt(dx * dx + dy * dy);
              if (!best || dist < best.dist) {
                best = {
                  monthIdx: p.monthIdx,
                  genreIdx: p.genreIdx,
                  month: series.month,
                  genre: allGenres[p.genreIdx],
                  value: p.value,
                  dist: dist
                };
              }
            }
          }

          // 命中阈值：比折线/点更宽松，确保“靠近就弹”
          if (best && best.dist < 22) {
            var trackCount = 0;
            var _chunk = lineSource && lineSource[best.monthIdx] ? lineSource[best.monthIdx] : null;
            if (_chunk && _chunk.genre_distribution && _chunk.genre_distribution[best.genre] !== undefined) {
              trackCount = _chunk.genre_distribution[best.genre];
            } else {
              trackCount = Math.round(best.value);
            }
            tooltip.style("opacity", 0.95);
            tooltip.html("<b>".concat(best.genre, "</b><br/>").concat(best.month, "<br/>\u66F2\u76EE\u6570\u91CF: ").concat(trackCount));
            placeTooltip(event);
          } else {
            // 远离折线时隐藏（避免一直黏着）
            tooltip.style("opacity", 0);
          }
        } catch (e) {
          // 不影响拖拽/绘制
        }
      }
    });
    svg.on("mouseup", function () {
      isDragging = false;
      svg.style("cursor", "grab");
    });
    svg.on("mouseleave", function () {
      isDragging = false;
      svg.style("cursor", "grab");
    });

    // 监听窗口大小变化，SVG的viewBox会自动处理缩放
    // 不需要手动更新，因为viewBox基于内容尺寸，preserveAspectRatio会自动适应容器
    var resizeTimer;
    var handleResize = function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        // viewBox 基于内容尺寸，不需要更新
        // preserveAspectRatio 会自动处理缩放
        console.log('📐 容器尺寸变化，SVG自动适应');
      }, 150);
    };
    window.addEventListener('resize', handleResize);
  }

  // 等待容器有尺寸后再加载数据
  // 简化：如果容器被隐藏，使用默认尺寸继续
  var _waitForContainer = function waitForContainer() {
    var width = container.offsetWidth || container.clientWidth;
    var height = container.offsetHeight || container.clientHeight;

    // 如果容器有尺寸，或者容器被隐藏（使用默认尺寸）
    if (width > 0 && height > 0) {
      console.log('✅ 容器已准备好，开始加载数据');
      loadData();
    } else if (container.style.display === 'none') {
      // 如果容器被隐藏，使用默认尺寸继续
      console.log('⚠️ 容器被隐藏，使用默认尺寸继续');
      loadData();
    } else {
      console.log('⏳ 等待容器尺寸...', width, height);
      setTimeout(_waitForContainer, 100);
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(_waitForContainer, 100);
    });
  } else {
    setTimeout(_waitForContainer, 100);
  }
})();
console.log('✅ D3伪3D热力图脚本加载完成');
},{"./assets/歌单_2314343014_genre分布统计_归类后.json":"uQWi"}]},{},["D9VS"], null)
//# sourceMappingURL=/heatmap.ba60984d.js.map