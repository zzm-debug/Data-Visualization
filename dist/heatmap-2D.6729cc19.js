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
// heatmap-2D.js - 2D热力图
// ✅ Inline CSV data (for heatmap)
(function () {
  // 等待DOM加载完成
  var init2DHeatmap = function init2DHeatmap() {
    // 使用 heatmap-2d 容器
    var container = document.getElementById("heatmap-2d") || document.getElementById("heatmap");
    if (!container) {
      console.error('❌ 找不到heatmap容器');
      return;
    }

    // 使用容器的ID进行选择
    var containerId = container.id;
    d3.select("#".concat(containerId)).selectAll("*").remove();
    d3.select("body").selectAll(".heatmap-tooltip").remove();
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
    // 使用与上面相同的容器
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

    // ✅ 背景“卡片内衬”（深色赛博主题下保持克制，不抢色块）
    root.append("rect").attr("x", 10).attr("y", 10).attr("width", containerWidth - 20).attr("height", containerHeight - 20).attr("rx", 14).attr("ry", 14).attr("fill", "rgba(7, 3, 18, 0.18)").attr("stroke", "rgba(50, 167, 255, 0.16)");
    var svg = root.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));

    // === Axes ===
    var x = d3.scaleBand().range([0, width]).domain(months).padding(0.08);
    var y = d3.scaleBand().range([height, 0]).domain(genres).padding(0.10);
    var css = getComputedStyle(document.documentElement);
    var axisColor = (css.getPropertyValue("--axis-text-strong") || "").trim() || "rgba(226, 232, 240, 0.88)";
    var gridColor = (css.getPropertyValue("--axis-grid") || "").trim() || "rgba(50, 167, 255, 0.12)";
    var cssVar = function cssVar(name, fallback) {
      return (css.getPropertyValue(name) || "").trim() || fallback;
    };
    var accentBlue = cssVar("--accent-blue", "#32a7ff");
    var accentViolet = cssVar("--accent-violet", "#7c3aed");
    var accentPink = cssVar("--accent-pink", "#ff3bd4");
    var accentCyan = cssVar("--accent-cyan", "#00fff0");
    var xAxis = svg.append("g").attr("transform", "translate(0, ".concat(height, ")")).call(d3.axisBottom(x).tickSizeOuter(0));
    if (months.length > 12 || containerWidth < 560) {
      xAxis.selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end").attr("dx", "-0.45em").attr("dy", "0.55em");
    }
    xAxis.selectAll("path, line").attr("stroke", "rgba(50, 167, 255, 0.26)");
    xAxis.selectAll("text").attr("fill", axisColor).style("font-size", "12px").style("paint-order", "stroke").style("stroke", "rgba(7, 3, 18, 0.72)").style("stroke-width", "2.0px").style("stroke-linejoin", "round");
    var yAxis = svg.append("g").call(d3.axisLeft(y).tickSizeOuter(0));
    yAxis.selectAll("path, line").attr("stroke", "rgba(50, 167, 255, 0.26)");
    yAxis.selectAll("text").attr("fill", axisColor).style("font-size", "12px").style("paint-order", "stroke").style("stroke", "rgba(7, 3, 18, 0.72)").style("stroke-width", "2.0px").style("stroke-linejoin", "round");

    // === ✅ 颜色：赛博霓虹渐变（与页面主题色一致） ===
    var vMin = d3.min(heatmapData, function (d) {
      return d.value;
    });
    var vMax = d3.max(heatmapData, function (d) {
      return d.value;
    });

    // 赛博渐变：进一步提亮下界，并降低粉色段强度（避免 pop 行过于突出）
    // 渐变段数收敛到 4 段：整体更“连续”，同时保持低值不黑、高值端带一点粉
    var cyberStops = ["#3a2a6d",
    // 更亮的深紫底（低值不黑）
    accentBlue,
    // 霓虹蓝（中低值主色）
    accentCyan,
    // 电青（中高值）
    "#ff5adf" // 柔粉（仅最高值端出现）
    ];
    var cyberInterpolator = d3.interpolateRgbBasis(cyberStops);
    var colorScale = d3.scaleSequential().domain([vMin, vMax]).interpolator(cyberInterpolator);

    // === 颜色映射图例（2D/3D 共用容器）===
    (function updateLegend() {
      var legend = document.getElementById("heatmap-color-legend");
      if (!legend) return;
      var fmt = d3.format(",d");
      legend.innerHTML = "\n      <div class=\"legend-title\">Score \u2192 Color</div>\n      <div class=\"legend-bar\" style=\"background: linear-gradient(90deg, ".concat(cyberStops.join(","), ");\"></div>\n      <div class=\"legend-labels\">\n        <span>").concat(fmt(vMin !== null && vMin !== void 0 ? vMin : 0), "</span>\n        <span>").concat(fmt(vMax !== null && vMax !== void 0 ? vMax : 0), "</span>\n      </div>\n    ");
    })();

    // === Tooltip ===
    var tooltip = d3.select("body").append("div").attr("class", "heatmap-tooltip").style("position", "absolute").style("pointer-events", "none").style("opacity", 0).style("padding", "10px 12px").style("border-radius", "12px").style("background", "rgba(30,41,59,0.92)").style("color", "#fff").style("font", '13px/1.35 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif').style("box-shadow", "0 10px 24px rgba(0,0,0,0.16)");

    // === Heatmap cells ===
    svg.selectAll("rect.cell").data(heatmapData).enter().append("rect").attr("class", "cell").attr("x", function (d) {
      return x(d.month);
    }).attr("y", function (d) {
      return y(d.genre);
    }).attr("width", x.bandwidth()).attr("height", y.bandwidth()).attr("rx", 8).attr("ry", 8).attr("fill", function (d) {
      return colorScale(d.value);
    }).attr("stroke", gridColor).attr("stroke-width", 1).on("mousemove", function (event, d) {
      tooltip.style("opacity", 1).html("<b>".concat(d.genre, "</b><br/>").concat(d.month, "<br/>Value: ").concat(d.value)).style("left", "".concat(event.pageX + 12, "px")).style("top", "".concat(event.pageY - 18, "px"));
    }).on("mouseout", function () {
      return tooltip.style("opacity", 0);
    });

    // === ✅ 折线更柔和：颜色统一、线更细、轻微光晕，点用“空心描边”避免白点突兀 ===
    // Glow filter
    var defs = root.append("defs");
    var glow = defs.append("filter").attr("id", "heatmapGlow");
    glow.append("feGaussianBlur").attr("stdDeviation", "1.8").attr("result", "coloredBlur");
    var feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    var genreCenter = function genreCenter(d) {
      return y(d.genre) + y.bandwidth() / 2;
    };
    var line = d3.line().x(function (d) {
      return x(d.month) + x.bandwidth() / 2;
    }).y(function (d) {
      return genreCenter(d);
    }).curve(d3.curveMonotoneX);

    // 数据保持你的原始逻辑（只是换颜色/样式）
    var lineData1 = [{
      "part": 1,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 2,
      "top_genre": "pop",
      "count": 8
    }, {
      "part": 3,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 4,
      "top_genre": "pop",
      "count": 8
    }, {
      "part": 5,
      "top_genre": "pop",
      "count": 8
    }, {
      "part": 6,
      "top_genre": "pop",
      "count": 8
    }, {
      "part": 7,
      "top_genre": "pop",
      "count": 8
    }, {
      "part": 8,
      "top_genre": "pop",
      "count": 8
    }, {
      "part": 9,
      "top_genre": "pop",
      "count": 8
    }, {
      "part": 10,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 11,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 12,
      "top_genre": "pop",
      "count": 5
    }, {
      "part": 13,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 14,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 15,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 16,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 17,
      "top_genre": "pop",
      "count": 5
    }, {
      "part": 18,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 19,
      "top_genre": "pop",
      "count": 8
    }, {
      "part": 20,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 21,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 22,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 23,
      "top_genre": "pop",
      "count": 5
    }, {
      "part": 24,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 25,
      "top_genre": "pop",
      "count": 6
    }];
    var lineData2 = [{
      "part": 1,
      "top_genre": "rap",
      "count": 5
    }, {
      "part": 2,
      "top_genre": "rap",
      "count": 6
    }, {
      "part": 3,
      "top_genre": "rap",
      "count": 7
    }, {
      "part": 4,
      "top_genre": "rap",
      "count": 6
    }, {
      "part": 5,
      "top_genre": "rap",
      "count": 7
    }, {
      "part": 6,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 7,
      "top_genre": "pop",
      "count": 8
    }, {
      "part": 8,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 9,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 10,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 11,
      "top_genre": "pop",
      "count": 5
    }, {
      "part": 12,
      "top_genre": "pop",
      "count": 5
    }, {
      "part": 13,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 14,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 15,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 16,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 17,
      "top_genre": "pop",
      "count": 5
    }, {
      "part": 18,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 19,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 20,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 21,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 22,
      "top_genre": "pop",
      "count": 7
    }, {
      "part": 23,
      "top_genre": "pop",
      "count": 6
    }, {
      "part": 24,
      "top_genre": "pop",
      "count": 5
    }, {
      "part": 25,
      "top_genre": "pop",
      "count": 5
    }];
    var linePoints1 = lineData1.map(function (d, i) {
      return {
        month: months[i],
        genre: d.top_genre,
        count: +d.count
      };
    });
    var linePoints2 = lineData2.map(function (d, i) {
      return {
        month: months[i],
        genre: d.top_genre,
        count: +d.count
      };
    });
    var theme = {
      ink: "rgba(36,52,71,0.70)",
      // 参考图二：蓝灰 + 豆沙（更统一）
      lineA: "#5B7AA6",
      lineB: "#C97A6E",
      dotFill: "#F7F4EC"
    };
    function drawTrend(points, color, cls) {
      svg.append("path").datum(points).attr("class", cls).attr("fill", "none").attr("stroke", color).attr("stroke-width", 2.2).attr("stroke-linejoin", "round").attr("stroke-linecap", "round").attr("opacity", 0.95).attr("filter", "url(#heatmapGlow)").attr("d", line);
      svg.selectAll("circle.".concat(cls, "-pt")).data(points).enter().append("circle").attr("class", "".concat(cls, "-pt")).attr("cx", function (d) {
        return x(d.month) + x.bandwidth() / 2;
      }).attr("cy", function (d) {
        return genreCenter(d);
      }).attr("r", function (d) {
        return 3.2 + d.count / 6;
      }) // 更克制
      .attr("fill", theme.dotFill) // 空心效果更干净
      .attr("stroke", color).attr("stroke-width", 2).attr("opacity", 0.95).on("mousemove", function (event, d) {
        tooltip.style("opacity", 1).html("\uD83C\uDFB5 Genre: <b>".concat(d.genre, "</b><br/>").concat(d.month, "<br/>Count: ").concat(d.count)).style("left", "".concat(event.pageX + 12, "px")).style("top", "".concat(event.pageY - 18, "px"));
      }).on("mouseout", function () {
        return tooltip.style("opacity", 0);
      });
    }
    drawTrend(linePoints1, theme.lineA, "trendA");
    drawTrend(linePoints2, theme.lineB, "trendB");
    console.log("✅ 2D Heatmap rendered (Morandi cool-warm + softer trends)");
  };

  // 导出初始化函数，允许外部调用
  window.init2DHeatmap = init2DHeatmap;

  // 等待容器有尺寸后再执行
  // 简化：如果容器被隐藏，使用默认尺寸继续
  var _waitForContainer = function waitForContainer() {
    var container = document.getElementById("heatmap-2d") || document.getElementById("heatmap");
    if (!container) {
      console.error('❌ 找不到heatmap容器');
      return;
    }
    var width = container.offsetWidth || container.clientWidth;
    var height = container.offsetHeight || container.clientHeight;

    // 如果容器有尺寸，或者容器被隐藏（使用默认尺寸）
    if (width > 0 && height > 0) {
      init2DHeatmap();
    } else if (container.style.display === 'none') {
      // 如果容器被隐藏，使用默认尺寸继续
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
//# sourceMappingURL=/heatmap-2D.6729cc19.js.map