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
})({"PAEX":[function(require,module,exports) {
// heatmap-2D.js - 2D热力图（已去除折线趋势图）
// ✅ Inline CSV data (for heatmap)
(function () {
  //#region Heatmap 2D｜主题/装饰层（只保留原图注释，不额外加 2D/3D 徽标）
  /**
   * 说明：
   * - 你的截图里热力图面板有“赛博霓虹渐变 + 玻璃质感卡片 + 左下角可折叠说明 + 右上角 3D/2D 徽标”。
   * - 这里不改整体页面布局（`index.html`），而是通过 JS 运行时注入“装饰层”和样式，
   *   保证 2D/3D 切换时两套图一致，且点击打开的新窗口大图也能复用同一套文案/风格。
   */

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v || "").trim() || fallback;
  }

  /** ✅ 渐变：按你原图的紫白单色系（不混青/粉） */
  function getCyberStops() {
    // ✅ 原图 legend：由浅入深（左浅→右深）
    // 因此：min → 浅色，max → 深色
    return ["#ffffff", "#e9d5ff", "#a855f7", "#6b21a8", "#2e1065"];
  }
  function ensureHeatmapOverlay(container) {
    var stage = container && (container.closest(".heatmap-stage") || container.parentElement);
    if (!stage) return;
    stage.style.position = stage.style.position || "relative";

    // 注入一次样式（主页面）
    var styleId = "heatmap-overlay-style";
    if (!document.getElementById(styleId)) {
      var style = document.createElement("style");
      style.id = styleId;
      style.textContent = "\n        /* \u2705 \u5DE6\u4E0A\u89D2\u6CE8\u91CA\uFF1A\u6309\u539F\u56FE */\n        .hm-anno{\n          position:absolute; left:12px; top:12px;\n          width: min(340px, 50%);\n          border-radius: 12px;\n          background: rgba(10, 5, 20, 0.85);\n          border: 1px solid rgba(124, 58, 237, 0.3);\n          box-shadow: 0 4px 16px rgba(0,0,0,0.4);\n          color: rgba(226,232,240,0.9);\n          backdrop-filter: blur(8px);\n          z-index: 6;\n          overflow:hidden;\n        }\n        .hm-anno > summary{\n          list-style:none;\n          cursor:pointer;\n          padding: 6px 8px;\n          font: 11px/1.1 system-ui,-apple-system,\"Segoe UI\",\"Microsoft YaHei\",sans-serif;\n          font-weight: 700;\n          letter-spacing: .5px;\n          user-select:none;\n          color: #fff;\n        }\n        .hm-anno > summary::-webkit-details-marker{ display:none; }\n        .hm-anno .hm-anno-body{\n          padding: 0 8px 8px 8px;\n          font: 10px/1.45 system-ui,-apple-system,\"Segoe UI\",\"Microsoft YaHei\",sans-serif;\n          color: rgba(226,232,240,0.85);\n        }\n      ";
      document.head.appendChild(style);
    }

    // ✅ 注释文案：严格按原图，不加任何额外说明
    var anno = stage.querySelector(".hm-anno");
    if (!anno) {
      anno = document.createElement("details");
      anno.className = "hm-anno";
      anno.open = true;
      anno.innerHTML = "\n        <summary>\u6CE8\u91CA\uFF08\u70B9\u51FB\u9690\u85CF\uFF09</summary>\n        <div class=\"hm-anno-body\">\n          <div>\u70ED\u529B\u56FE\uFF1A\u4E16\u754C\u8303\u56F4\u97F3\u4E50\u70ED\u5EA6\u53D8\u5316</div>\n          <div>\u6298\u7EBF\u56FE\uFF1A\u56FD\u5185\u7F51\u53CB\u542C\u97F3\u4E50\u7684\u66F2\u76EE\u6570\u91CF\u53D8\u5316</div>\n        </div>\n      ";
      stage.appendChild(anno);
    }
    // ✅ 关键：阻止点击注释框时冒泡到 `.chart-content`（否则会触发 svg-interaction 的“点击打开大图”）
    try {
      anno.addEventListener("click", function (e) {
        return e.stopPropagation();
      });
      anno.addEventListener("pointerdown", function (e) {
        return e.stopPropagation();
      });
    } catch (e) {}

    // 容器“卡片内衬”质感（截图是玻璃/霓虹边框）
    try {
      container.style.borderRadius = "14px";
      container.style.overflow = "hidden";
      container.style.background = "rgba(7, 3, 18, 0.18)";
      container.style.border = "1px solid rgba(50, 167, 255, 0.16)";
      container.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.03), 0 0 18px rgba(255,59,212,0.10), 0 0 24px rgba(50,167,255,0.08)";
    } catch (e) {
      // 不影响图表渲染
    }
  }
  //#endregion

  // 等待DOM加载完成
  var init2DHeatmap = function init2DHeatmap() {
    // 使用 heatmap-2d 容器
    var container = document.getElementById("heatmap-2d") || document.getElementById("heatmap");
    if (!container) {
      console.error('❌ 找不到heatmap容器');
      return;
    }

    // ✅ 装饰层：只保留注释 + 容器质感（不再额外加 2D/3D 徽标）
    ensureHeatmapOverlay(container);

    // 使用容器的ID进行选择
    var containerId = container.id;
    d3.select("#".concat(containerId)).selectAll("*").remove();
    // ⚠️ 不要全局 remove：3D/2D 共享 tooltip，否则会互相删掉导致“tooltip 没了”

    var csvData = "month,classical,electronic,folk,jazz,pop,rock,ACG,rap\n2023-12,35,34,64,47,24,32,37,37\n2024-01,35,33,58,46,23,31,32,36\n2024-02,34,32,62,48,26,33,34,39\n2024-03,35,34,59,48,23,34,37,38\n2024-04,31,34,55,47,21,34,31,36\n2024-05,32,48,57,46,24,34,32,38\n2024-06,32,49,62,48,23,36,31,40\n2024-07,31,38,64,49,25,32,31,38\n2024-08,30,39,62,46,23,32,32,37\n2024-09,32,35,60,45,23,36,33,45\n2024-10,31,32,60,49,23,33,31,46\n2024-11,35,33,58,45,22,32,32,39\n2024-12,35,35,63,48,23,33,37,39\n2025-01,32,34,54,47,22,32,32,38\n2025-02,33,33,58,48,22,31,29,42\n2025-03,33,32,56,48,22,31,31,36\n2025-04,31,33,59,45,22,31,30,36\n2025-05,30,37,58,46,23,32,30,39\n2025-06,29,33,57,46,21,32,31,36\n2025-07,29,36,60,48,21,39,31,38\n2025-08,31,35,59,46,22,34,31,34\n2025-09,30,32,61,46,22,33,30,32\n2025-10,33,33,59,44,21,34,31,36\n2025-11,31,32,57,46,21,33,30,33\n2025-12,33,32,60,45,23,32,33,39\n";
    var data = d3.csvParse(csvData.trim());

    // ✅ Genre keys（与你原逻辑一致）
    var genres = ["ACG", "classical", "electronic", "folk", "jazz", "pop", "rap", "rock"];
    var months = data.map(function (d) {
      return d["month"];
    });
    var heatmapData = data.flatMap(function (row) {
      return genres.map(function (genre) {
        return {
          month: row["month"],
          genre: genre,
          value: +row[genre]
        };
      });
    });

    // === 自适应尺寸计算 ===
    var heatmapContainer = container;
    var containerWidth = heatmapContainer.clientWidth || 900;
    var containerHeight = heatmapContainer.clientHeight || 320;
    var margin = {
      top: Math.max(22, containerHeight * 0.10),
      right: Math.max(18, containerWidth * 0.03),
      bottom: Math.max(46, containerHeight * 0.18),
      left: Math.max(64, containerWidth * 0.10)
    };
    var width = containerWidth - margin.left - margin.right;
    var height = containerHeight - margin.top - margin.bottom;
    var root = d3.select("#".concat(containerId)).append("svg").attr("width", "100%").attr("height", "100%").attr("viewBox", "0 0 ".concat(containerWidth, " ").concat(containerHeight)).attr("preserveAspectRatio", "xMidYMid meet");

    // ✅ 背景“卡片内衬”
    root.append("rect").attr("x", 10).attr("y", 10).attr("width", containerWidth - 20).attr("height", containerHeight - 20).attr("rx", 14).attr("ry", 14).attr("fill", "rgba(7, 3, 18, 0.18)").attr("stroke", "rgba(50, 167, 255, 0.16)");
    var svg = root.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));

    // === Axes ===
    var x = d3.scaleBand().range([0, width]).domain(months).padding(0.08);
    var y = d3.scaleBand().range([height, 0]).domain(genres).padding(0.10);

    //#region Heatmap 2D｜坐标轴主题色（与整体赛博主题一致）
    var css = getComputedStyle(document.documentElement);
    var axisColor = (css.getPropertyValue("--axis-text-strong") || "").trim() || "rgba(226, 232, 240, 0.88)";
    var gridColor = (css.getPropertyValue("--axis-grid") || "").trim() || "rgba(50, 167, 255, 0.12)";

    //#endregion

    var xAxis = svg.append("g").attr("transform", "translate(0, ".concat(height, ")")).call(d3.axisBottom(x).tickSizeOuter(0));
    if (months.length > 12 || containerWidth < 560) {
      xAxis.selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end").attr("dx", "-0.45em").attr("dy", "0.55em");
    }
    xAxis.selectAll("path, line").attr("stroke", "rgba(50, 167, 255, 0.26)");
    xAxis.selectAll("text").attr("fill", axisColor).style("font-size", "12px").style("paint-order", "stroke").style("stroke", "rgba(7, 3, 18, 0.72)").style("stroke-width", "2.0px").style("stroke-linejoin", "round");
    var yAxis = svg.append("g").call(d3.axisLeft(y).tickSizeOuter(0));
    yAxis.selectAll("path, line").attr("stroke", "rgba(50, 167, 255, 0.26)");
    yAxis.selectAll("text").attr("fill", axisColor).style("font-size", "12px").style("paint-order", "stroke").style("stroke", "rgba(7, 3, 18, 0.72)").style("stroke-width", "2.0px").style("stroke-linejoin", "round");

    // === ✅ 颜色：赛博霓虹渐变（与 3D 一致） ===
    var vMin = d3.min(heatmapData, function (d) {
      return d.value;
    });
    var vMax = d3.max(heatmapData, function (d) {
      return d.value;
    });

    // ✅ 颜色：按截图的霓虹渐变（深紫 → 紫 → 青 → 粉 → 近白）
    var cyberStops = getCyberStops();
    var cyberInterpolator = d3.interpolateRgbBasis(cyberStops);
    var colorScale = d3.scaleSequential().domain([vMin, vMax]).interpolator(cyberInterpolator);

    // === 颜色映射图例（2D/3D 共用容器）===
    (function updateLegend() {
      var legend = document.getElementById("heatmap-color-legend");
      if (!legend) return;
      var fmt = d3.format(",d");
      legend.innerHTML = "\n        <div class=\"legend-title\">Score \u2192 Color</div>\n        <div class=\"legend-bar\" style=\"background: linear-gradient(90deg, ".concat(cyberStops.join(","), ");\"></div>\n        <div class=\"legend-labels\">\n          <span>").concat(fmt(vMin !== null && vMin !== void 0 ? vMin : 0), "</span>\n          <span>").concat(fmt(vMax !== null && vMax !== void 0 ? vMax : 0), "</span>\n        </div>\n      ");
    })();

    // === Tooltip（2D/3D 复用同一个）===
    var tooltip = d3.select("body").select(".heatmap-tooltip");
    if (tooltip.empty()) {
      tooltip = d3.select("body").append("div").attr("class", "heatmap-tooltip");
    }
    tooltip.style("position", "fixed").style("pointer-events", "none").style("opacity", 0).style("padding", "10px 12px").style("border-radius", "12px").style("background", "rgba(30,41,59,0.92)").style("color", "#fff").style("font", '13px/1.35 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif').style("box-shadow", "0 10px 24px rgba(0,0,0,0.16)").style("z-index", 1000);

    // === Heatmap cells（仅保留方块，无任何折线/点/光晕）===
    svg.selectAll("rect.cell").data(heatmapData).enter().append("rect").attr("class", "cell")
    // ✅ 重要：把数据写进 DOM 属性，便于 `svg-interaction.js` 复制到新窗口大图后继续可交互
    .attr("data-genre", function (d) {
      return d.genre;
    }).attr("data-month", function (d) {
      return d.month;
    }).attr("data-value", function (d) {
      return d.value;
    }).attr("x", function (d) {
      return x(d.month);
    }).attr("y", function (d) {
      return y(d.genre);
    }).attr("width", x.bandwidth()).attr("height", y.bandwidth()).attr("rx", 8).attr("ry", 8).attr("fill", function (d) {
      return colorScale(d.value);
    }).attr("stroke", gridColor).attr("stroke-width", 1).on("mousemove", function (event, d) {
      tooltip.style("opacity", 1).html("<b>".concat(d.genre, "</b><br/>").concat(d.month, "<br/>Value: ").concat(d.value));
      var cx = event && typeof event.clientX === "number" ? event.clientX : event && typeof event.pageX === "number" ? event.pageX : 0;
      var cy = event && typeof event.clientY === "number" ? event.clientY : event && typeof event.pageY === "number" ? event.pageY : 0;
      var node = tooltip.node();
      var w = node ? node.offsetWidth || 0 : 0;
      var h = node ? node.offsetHeight || 0 : 0;
      var pad = 10;
      var tx = cx + 12;
      var ty = cy - 18;
      tx = Math.max(pad, Math.min(tx, (window.innerWidth || 0) - w - pad));
      ty = Math.max(pad, Math.min(ty, (window.innerHeight || 0) - h - pad));
      tooltip.style("left", "".concat(tx, "px")).style("top", "".concat(ty, "px"));
    }).on("mouseout", function () {
      return tooltip.style("opacity", 0);
    });
    console.log("✅ 2D Heatmap rendered (pure heatmap, trend lines removed)");
  };

  // 导出初始化函数，允许外部调用
  window.init2DHeatmap = init2DHeatmap;

  // 等待容器有尺寸后再执行（若容器隐藏则使用默认尺寸继续）
  var _waitForContainer = function waitForContainer() {
    var container = document.getElementById("heatmap-2d") || document.getElementById("heatmap");
    if (!container) {
      console.error('❌ 找不到heatmap容器');
      return;
    }
    var width = container.offsetWidth || container.clientWidth;
    var height = container.offsetHeight || container.clientHeight;
    if (width > 0 && height > 0) {
      init2DHeatmap();
    } else if (container.style.display === 'none') {
      console.log('⚠️ 容器被隐藏，使用默认尺寸继续');
      init2DHeatmap();
    } else {
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
},{}]},{},["PAEX"], null)
//# sourceMappingURL=/heatmap-2D.f23e399f.js.map