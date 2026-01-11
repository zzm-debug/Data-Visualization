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
})({"A2T1":[function(require,module,exports) {
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// app.js — 柔和气泡 + 互动率环（进度）+ 字更大 + 图更大
(function () {
  var data = {
    "Folk": {
      "total_plays": 44580532,
      "total_comments": 112595,
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
    "Rap": {
      "total_plays": 519658432,
      "total_comments": 267719,
      "song_count": 50
    },
    "Electronic": {
      "total_plays": 405760640,
      "total_comments": 185764,
      "song_count": 50
    },
    "Classical": {
      "total_plays": 74785024,
      "total_comments": 383731,
      "song_count": 50
    },
    "Jazz": {
      "total_plays": 28298645,
      "total_comments": 98685,
      "song_count": 50
    },
    "ACG": {
      "total_plays": 89843048,
      "total_comments": 95537,
      "song_count": 50
    }
  };
  var BG = "#FAF9F6";

  // 轻盈莫兰迪（你后续想再调我也可以继续帮你微调）
  var palette = {
    Folk: "#6F8697",
    Pop: "#B79AD6",
    Rock: "#88A68D",
    Rap: "#D79AA8",
    Electronic: "#9AA9D6",
    Classical: "#C8A98C",
    Jazz: "#D8B49B",
    ACG: "#9AA3AF"
  };
  var svgSel = d3.select("#bubble-svg");
  var svgNode = svgSel.node();
  if (!svgNode) return;

  // tooltip（复用避免重复）
  var tooltip = d3.select("body").select(".bubble-tooltip");
  if (tooltip.empty()) {
    tooltip = d3.select("body").append("div").attr("class", "bubble-tooltip").style("position", "absolute").style("pointer-events", "none").style("padding", "12px 14px").style("border-radius", "12px").style("background", "rgba(30, 41, 59, 0.90)").style("color", "#fff").style("font", "13px/1.4 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif").style("opacity", 0).style("backdrop-filter", "blur(6px)");
  }
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function formatBig(n) {
    return d3.format(",")(n);
  }
  function pct(x) {
    return "".concat((x * 100).toFixed(2), "%");
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
    svgSel.append("rect").attr("x", 0).attr("y", 0).attr("width", width).attr("height", height).attr("fill", BG);
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

    // ✅ 气泡半径：用评论数（更有区分度）
    // 你如果想“差异更明显”，把 range 的上限再加大即可
    var rScale = d3.scaleSqrt().domain([Math.max(1, commentsExtent[0] || 1), Math.max(2, commentsExtent[1] || 2)]).range([18, Math.max(78, Math.floor(Math.min(innerW, innerH) * 0.16))]);

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
    svgSel.selectAll(".grid line").attr("stroke", "rgba(15, 23, 42, 0.07)").attr("stroke-width", 1);
    svgSel.selectAll(".grid path").attr("stroke", "none");

    // 坐标轴（字号更大）
    var xAxis = d3.axisBottom(xScale).ticks(10, "~s");
    var yAxis = d3.axisLeft(yScale).ticks(6).tickFormat(d3.format(".2s"));
    var gx = g.append("g").attr("transform", "translate(0,".concat(height - margin.bottom, ")")).attr("class", "x-axis").call(xAxis);
    var gy = g.append("g").attr("transform", "translate(".concat(margin.left, ",0)")).attr("class", "y-axis").call(yAxis);
    g.selectAll(".x-axis text, .y-axis text").style("font-size", "15px").style("fill", "rgba(30, 41, 59, 0.74)");
    g.selectAll(".x-axis path, .y-axis path, .x-axis line, .y-axis line").attr("stroke", "rgba(30, 41, 59, 0.35)");

    // 节点
    var nodes = genres.map(function (genre) {
      var s = data[genre];
      var r = rScale(s.total_comments);
      var rate = (s.total_comments || 0) / Math.max(1, s.total_plays || 1);
      var progress = clamp(rate / maxRate, 0, 1);
      return {
        id: genre,
        total_plays: s.total_plays,
        total_comments: s.total_comments,
        x: xScale(s.total_plays),
        y: yScale(s.total_comments),
        r: r,
        rate: rate,
        progress: progress,
        active: true
      };
    });
    var layer = g.append("g").attr("class", "bubble-layer");

    // ✅ 只保留“柔和气泡”本体（你不喜欢的内外环全部删除）
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

    // 交互（绑定到气泡和环都行，这里绑定气泡）
    bubbles.on("mouseenter", function (event, d) {
      tooltip.style("opacity", 1).html("\n            <div style=\"font-weight:800;margin-bottom:6px;letter-spacing:.3px\">".concat(d.id, "</div>\n            <div style=\"opacity:.92\">Plays\uFF1A").concat(formatBig(d.total_plays), "</div>\n            <div style=\"opacity:.92\">Comments\uFF1A").concat(formatBig(d.total_comments), "</div>\n            <div style=\"opacity:.92;margin-top:6px\">\u4E92\u52A8\u7387\uFF1A").concat(pct(d.rate), "</div>\n            <div style=\"opacity:.70;margin-top:6px\">\u6C14\u6CE1=\u8BC4\u8BBA\u6570\uFF5C\u5916\u73AF=\u4E92\u52A8\u7387\uFF08\u76F8\u5BF9\u8FDB\u5EA6\uFF09</div>\n          "));
    }).on("mousemove", function (event) {
      tooltip.style("left", event.pageX + 14 + "px").style("top", event.pageY + 14 + "px");
    }).on("mouseleave", function () {
      return tooltip.style("opacity", 0);
    });

    // 力导向（考虑环的碰撞）
    var simulation = d3.forceSimulation(nodes).force("x", d3.forceX(function (d) {
      return xScale(d.total_plays);
    }).strength(1)).force("y", d3.forceY(function (d) {
      return yScale(d.total_comments);
    }).strength(1)).force("collide", d3.forceCollide(function (d) {
      return d.r + ringGap + ringWidth + 6;
    })).alpha(1).alphaDecay(0.05).on("tick", function () {
      nodes.forEach(function (d) {
        var bound = d.r + ringGap + ringWidth + 3;
        d.x = clamp(d.x, margin.left + bound, width - margin.right - bound);
        d.y = clamp(d.y, margin.top + bound, height - margin.bottom - bound);
      });
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
        return ringRotate(d);
      });
      updateRings();
    });

    // ✅ 轴标题更大
    svgSel.append("text").attr("x", margin.left + innerW / 2).attr("y", height - 42).attr("text-anchor", "middle").style("font", "16px/1 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif").style("fill", "rgba(30, 41, 59, 0.74)").text("Total Plays (log)");
    svgSel.append("text").attr("transform", "rotate(-90)").attr("x", -(margin.top + innerH / 2)).attr("y", 34).attr("text-anchor", "middle").style("font", "16px/1 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif").style("fill", "rgba(30, 41, 59, 0.74)").text("Total Comments");

    // ✅ 注释：右上角加一个“说明”小标签（设计感更强）
    var note = svgSel.append("g").attr("transform", "translate(".concat(margin.left + 10, ", ").concat(margin.top - 36, ")"));
    note.append("rect").attr("width", 320).attr("height", 28).attr("rx", 10).attr("fill", "rgba(255,255,255,0.55)").attr("stroke", "rgba(30,41,59,0.10)");
    note.append("text").attr("x", 14).attr("y", 19).style("font", "14px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif").style("fill", "rgba(30,41,59,0.70)").text("气泡=评论数  ｜  外环=互动率（相对进度）");

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
    }).style("font-size", "16px").style("fill", "rgba(30, 41, 59, 0.78)").style("font-family", "system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif");

    // 初始放置
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
      return ringRotate(d);
    });
    updateRings();
    window.addEventListener("scroll", function () {
      return tooltip.style("opacity", 0);
    }, {
      passive: true
    });
    setTimeout(function () {
      return simulation.alphaTarget(0);
    }, 2800);
  }

  // resize 防抖
  var t = null;
  function rerender() {
    clearTimeout(t);
    t = setTimeout(render, 90);
  }
  render();
  window.addEventListener("resize", rerender);
})();
},{}]},{},["A2T1"], null)
//# sourceMappingURL=/app.ea0f9ff4.js.map