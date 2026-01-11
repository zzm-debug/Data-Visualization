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
})({"D9VS":[function(require,module,exports) {
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
  d3.select("body").selectAll(".heatmap-tooltip").remove();
  var genreData = null;
  var surfaceData = null;
  var months = ['2023-12', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];
  var allGenres = ["ACG", "classical", "electronic", "folk", "jazz", "pop", "rap", "rock"];
  function loadData() {
    console.log('✅ 开始加载JSON数据');
    d3.json("/assets/歌单_2314343014_genre分布统计_归类后.json").then(function (data) {
      console.log('✅ JSON数据加载成功，共', data.length, '条记录');
      genreData = data;
      processData();
      init3DHeatmap();
    }).catch(function (err) {
      console.error("❌ 加载JSON数据失败:", err);
      console.log("使用默认数据初始化");
      processData();
      init3DHeatmap();
    });
  }
  function processData() {
    surfaceData = [];
    if (!genreData || genreData.length === 0) {
      console.warn('genreData为空，使用默认数据');
      for (var monthIdx = 0; monthIdx < 25; monthIdx++) {
        var row = [];
        for (var genreIdx = 0; genreIdx < allGenres.length; genreIdx++) {
          row.push(Math.random() * 50 + 20);
        }
        surfaceData.push(row);
      }
      return;
    }
    for (var _monthIdx = 0; _monthIdx < 25; _monthIdx++) {
      var chunk = genreData[_monthIdx];
      if (!chunk) {
        surfaceData.push(Array(allGenres.length).fill(0));
        continue;
      }
      var _row = [];
      for (var _genreIdx = 0; _genreIdx < allGenres.length; _genreIdx++) {
        var genre = allGenres[_genreIdx];
        var value = chunk.genre_distribution && chunk.genre_distribution[genre] ? chunk.genre_distribution[genre] : 0;
        _row.push(value);
      }
      surfaceData.push(_row);
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

    // Morandi颜色方案
    var morandiColors = [{
      r: 110,
      g: 134,
      b: 166
    },
    // #6E86A6
    {
      r: 201,
      g: 214,
      b: 229
    },
    // #C9D6E5
    {
      r: 247,
      g: 244,
      b: 236
    },
    // #F7F4EC
    {
      r: 241,
      g: 197,
      b: 183
    },
    // #F1C5B7
    {
      r: 201,
      g: 122,
      b: 110
    } // #C97A6E
    ];
    function getColor(value) {
      var normalized = (value - minValue) / valueRange;
      var color;
      if (normalized < 0.25) {
        var t = normalized * 4;
        color = {
          r: morandiColors[0].r + (morandiColors[1].r - morandiColors[0].r) * t,
          g: morandiColors[0].g + (morandiColors[1].g - morandiColors[0].g) * t,
          b: morandiColors[0].b + (morandiColors[1].b - morandiColors[0].b) * t
        };
      } else if (normalized < 0.5) {
        var _t = (normalized - 0.25) * 4;
        color = {
          r: morandiColors[1].r + (morandiColors[2].r - morandiColors[1].r) * _t,
          g: morandiColors[1].g + (morandiColors[2].g - morandiColors[1].g) * _t,
          b: morandiColors[1].b + (morandiColors[2].b - morandiColors[1].b) * _t
        };
      } else if (normalized < 0.75) {
        var _t2 = (normalized - 0.5) * 4;
        color = {
          r: morandiColors[2].r + (morandiColors[3].r - morandiColors[2].r) * _t2,
          g: morandiColors[2].g + (morandiColors[3].g - morandiColors[2].g) * _t2,
          b: morandiColors[2].b + (morandiColors[3].b - morandiColors[2].b) * _t2
        };
      } else {
        var _t3 = (normalized - 0.75) * 4;
        color = {
          r: morandiColors[3].r + (morandiColors[4].r - morandiColors[3].r) * _t3,
          g: morandiColors[3].g + (morandiColors[4].g - morandiColors[3].g) * _t3,
          b: morandiColors[3].b + (morandiColors[4].b - morandiColors[3].b) * _t3
        };
      }
      return "rgb(".concat(Math.round(color.r), ", ").concat(Math.round(color.g), ", ").concat(Math.round(color.b), ")");
    }

    // 创建tooltip
    var tooltip = d3.select("body").append("div").attr("class", "heatmap-tooltip").style("position", "absolute").style("pointer-events", "none").style("opacity", 0).style("padding", "10px 12px").style("border-radius", "12px").style("background", "rgba(30,41,59,0.92)").style("color", "#fff").style("font", '13px/1.35 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif').style("box-shadow", "0 10px 24px rgba(0,0,0,0.16)").style("z-index", 1000);

    // 创建SVG，先不设置viewBox，等计算完内容尺寸后再设置
    var svg = d3.select(container).append("svg").attr("width", "100%").attr("height", "100%").style("cursor", "grab");

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
      for (var _i = 1; _i < points.length; _i++) {
        path.lineTo(points[_i].x, points[_i].y);
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
        drawFace(cellGroup, [bottom1, bottom2, bottom3, bottom4], baseColor, "rgba(255,255,255,0.3)", 0.9);

        // 2. 右侧面
        drawFace(cellGroup, [bottom2, top2, top3, bottom3], darkColor, "rgba(255,255,255,0.2)", 0.9);

        // 3. 背面
        drawFace(cellGroup, [bottom4, bottom3, top3, top4], darkerColor, "rgba(255,255,255,0.2)", 0.85);

        // 4. 顶面（最后绘制，确保在最上层）
        var topFace = drawFace(cellGroup, [top1, top2, top3, top4], baseColor, "rgba(255,255,255,0.4)", 1);

        // 将顶面添加到交互元素（用于tooltip）
        interactiveElements.push(topFace);
      }
    }

    // ========== 添加交互事件 ==========
    interactiveElements.forEach(function (element) {
      element.on("mouseover", function (event, d) {
        // 高亮整个立方体组（找到父组）
        var parentGroup = d3.select(this.parentNode);
        parentGroup.selectAll("path").attr("opacity", 1).attr("stroke-width", 1.5);

        // 从JSON文件的genre_distribution获取曲目数量
        var trackCount = 0;
        if (genreData && genreData[d.monthIdx]) {
          var chunk = genreData[d.monthIdx];
          var genre = allGenres[d.genreIdx];
          if (chunk.genre_distribution && chunk.genre_distribution[genre] !== undefined) {
            trackCount = chunk.genre_distribution[genre];
          }
        } else {
          // 如果genreData未加载，使用d.value作为后备
          trackCount = Math.round(d.value);
        }
        tooltip.transition().duration(150).style("opacity", 0.95);
        tooltip.html("<b>".concat(d.genre, "</b><br/>").concat(d.month, "<br/>\u5206\u503C: ").concat(d.value.toFixed(2), "<br/>\u66F2\u76EE\u6570\u91CF: ").concat(trackCount)).style("left", "".concat(event.pageX + 12, "px")).style("top", "".concat(event.pageY - 18, "px"));
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
        tooltip.transition().duration(200).style("opacity", 0);
      });
    });

    // ========== 添加折线趋势图（每个月份一条，沿X轴延伸，Z轴表示高度） ==========
    // 计算折线高度的范围
    var minLineHeight = Infinity;
    var maxLineHeight = 0;
    if (genreData && genreData.length > 0) {
      for (var _i2 = 0; _i2 < genreData.length; _i2++) {
        var chunk = genreData[_i2];
        if (chunk && chunk.genre_distribution) {
          for (var _i3 = 0, _allGenres = allGenres; _i3 < _allGenres.length; _i3++) {
            var genre = _allGenres[_i3];
            var val = chunk.genre_distribution[genre] || 0;
            minLineHeight = Math.min(minLineHeight, val);
            maxLineHeight = Math.max(maxLineHeight, val);
          }
        }
      }
    }

    // 如果genreData为空，使用surfaceData的数据
    if (!genreData || genreData.length === 0 || minLineHeight === Infinity) {
      minLineHeight = Infinity;
      maxLineHeight = 0;
      for (var _i4 = 0; _i4 < surfaceData.length; _i4++) {
        for (var _j = 0; _j < surfaceData[_i4].length; _j++) {
          var _val = surfaceData[_i4][_j] || 0;
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
    var _loop = function _loop(_monthIdx2) {
      var month = months[_monthIdx2];
      var monthY = _monthIdx2 * cellDepth + cellDepth / 2; // 月份的中心Y坐标

      // 生成折线的数据点（沿X轴：从genre 0到genre 7）
      var lineData = [];
      for (var _genreIdx2 = 0; _genreIdx2 < numGenres; _genreIdx2++) {
        var _value = 0;
        if (genreData && genreData[_monthIdx2] && genreData[_monthIdx2].genre_distribution) {
          var _genre = allGenres[_genreIdx2];
          _value = genreData[_monthIdx2].genre_distribution[_genre] || 0;
        } else if (surfaceData && surfaceData[_monthIdx2]) {
          // 如果genreData为空，使用surfaceData
          _value = surfaceData[_monthIdx2][_genreIdx2] || 0;
        }

        // 归一化高度，确保不会出现NaN
        var normalizedValue = lineHeightRange > 0 ? (_value - minLineHeight) / lineHeightRange : 0;
        var z = cellThickness + (isNaN(normalizedValue) ? 0 : normalizedValue) * maxLineZ; // 从热力图顶部开始

        var genreX = _genreIdx2 * cellWidth + cellWidth / 2; // genre的中心X坐标

        // 验证坐标不是NaN
        if (!isNaN(genreX) && !isNaN(monthY) && !isNaN(z)) {
          lineData.push({
            x: genreX,
            y: monthY,
            z: z,
            value: _value,
            monthIdx: _monthIdx2,
            genreIdx: _genreIdx2
          });
        }
      }

      // 获取该月份的平均颜色（使用热力图的颜色方案，但加深颜色使其更明显）
      var avgValue = lineData.reduce(function (sum, d) {
        return sum + d.value;
      }, 0) / lineData.length;
      var lineColor = getColor(avgValue);
      // 加深颜色，使折线更明显
      var darkerLineColor = darkenColor(lineColor, 0.6);

      // 存储折线数据（用于旋转时更新）
      if (lineData.length > 0) {
        lineDataArray.push({
          monthIdx: _monthIdx2,
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
          var areaElement = g.append("path").attr("class", "area-path area-".concat(_monthIdx2)).attr("d", areaPath).attr("fill", darkerLineColor).attr("fill-opacity", 0.4).attr("stroke", "none").datum({
            lineData: lineData,
            month: month,
            monthIdx: _monthIdx2
          }) // 存储数据
          .style("cursor", "pointer");

          // 为面积填充也添加鼠标事件（确保tooltip能显示）
          areaElement.on("mousemove", function (event) {
            // 获取鼠标在SVG中的坐标
            var _d3$pointer = d3.pointer(event, g.node()),
              _d3$pointer2 = _slicedToArray(_d3$pointer, 2),
              mouseX = _d3$pointer2[0],
              mouseY = _d3$pointer2[1];

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

            // 增加距离阈值，确保tooltip能显示
            if (nearestPoint && minDistance < 100) {
              // 从JSON获取曲目数量
              var trackCount = 0;
              if (genreData && genreData[_monthIdx2]) {
                var _chunk = genreData[_monthIdx2];
                var _genre2 = allGenres[nearestGenreIdx];
                if (_chunk.genre_distribution && _chunk.genre_distribution[_genre2] !== undefined) {
                  trackCount = _chunk.genre_distribution[_genre2];
                }
              } else {
                trackCount = Math.round(nearestPoint.value);
              }
              tooltip.transition().duration(150).style("opacity", 0.95);
              tooltip.html("<b>".concat(allGenres[nearestGenreIdx], "</b><br/>").concat(month, "<br/>\u5206\u503C: ").concat(nearestPoint.value.toFixed(2), "<br/>\u66F2\u76EE\u6570\u91CF: ").concat(trackCount)).style("left", "".concat(event.pageX + 12, "px")).style("top", "".concat(event.pageY - 18, "px"));
            }
          }).on("mouseout", function () {
            tooltip.transition().duration(200).style("opacity", 0);
          });
        }

        // 创建折线（确保在最上层显示，使用深色使其更明显）
        var linePath = lineGenerator(lineData);
        if (linePath && !linePath.includes('NaN')) {
          var lineElement = g.append("path").attr("class", "line-path line-".concat(_monthIdx2)).attr("d", linePath).attr("fill", "none").attr("stroke", darkerLineColor).attr("stroke-width", 3.5).attr("opacity", 1).datum({
            lineData: lineData,
            month: month,
            monthIdx: _monthIdx2
          }) // 存储数据
          .style("cursor", "pointer");

          // 为折线图添加鼠标事件
          lineElement.on("mousemove", function (event) {
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

            // 增加距离阈值，确保tooltip能显示
            if (nearestPoint && minDistance < 100) {
              // 100像素范围内显示tooltip
              // 从JSON获取曲目数量
              var trackCount = 0;
              if (genreData && genreData[_monthIdx2]) {
                var _chunk2 = genreData[_monthIdx2];
                var _genre3 = allGenres[nearestGenreIdx];
                if (_chunk2.genre_distribution && _chunk2.genre_distribution[_genre3] !== undefined) {
                  trackCount = _chunk2.genre_distribution[_genre3];
                }
              } else {
                trackCount = Math.round(nearestPoint.value);
              }
              tooltip.transition().duration(150).style("opacity", 0.95);
              tooltip.html("<b>".concat(allGenres[nearestGenreIdx], "</b><br/>").concat(month, "<br/>\u5206\u503C: ").concat(nearestPoint.value.toFixed(2), "<br/>\u66F2\u76EE\u6570\u91CF: ").concat(trackCount)).style("left", "".concat(event.pageX + 12, "px")).style("top", "".concat(event.pageY - 18, "px"));
            }
          }).on("mouseout", function () {
            tooltip.transition().duration(200).style("opacity", 0);
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
            g.append("circle").attr("class", "max-point-outer max-point-outer-".concat(_monthIdx2)).attr("cx", maxProjected.x).attr("cy", maxProjected.y).attr("r", 6).attr("fill", "#ffffff").attr("stroke", darkerLineColor).attr("stroke-width", 2).attr("opacity", 1).style("pointer-events", "none"); // 允许鼠标事件穿透到折线

            // 绘制内圈（折线颜色，更小）
            g.append("circle").attr("class", "max-point-inner max-point-inner-".concat(_monthIdx2)).attr("cx", maxProjected.x).attr("cy", maxProjected.y).attr("r", 3.5).attr("fill", darkerLineColor).attr("stroke", "none").attr("opacity", 1).style("pointer-events", "none"); // 允许鼠标事件穿透到折线
          }
          console.log("\u2705 \u5DF2\u7ED8\u5236".concat(month, "\u7684\u6298\u7EBF\u56FE\uFF0C\u989C\u8272: ").concat(darkerLineColor, ", \u6570\u636E\u70B9: ").concat(lineData.length));
        } else {
          console.warn("\u26A0\uFE0F ".concat(month, "\u7684\u6298\u7EBF\u8DEF\u5F84\u751F\u6210\u5931\u8D25\uFF0C\u8DEF\u5F84: ").concat(linePath));
        }
      } else {
        console.warn("\u26A0\uFE0F ".concat(month, "\u6CA1\u6709\u6709\u6548\u7684\u6570\u636E\u70B9"));
      }
    };
    for (var _monthIdx2 = 0; _monthIdx2 < numMonths; _monthIdx2++) {
      _loop(_monthIdx2);
    }
    console.log('🎉 折线趋势图绘制完成！');
    // ========== 添加坐标轴线（原点与第一个方格左上角对齐） ==========
    var axisOffset = 8; // 坐标轴往外偏移的距离（增加，更往外）

    // 辅助函数：绘制带箭头的轴线
    function drawAxisWithArrow(start, end) {
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#555";
      var axisClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
      var line = g.append("line").attr("class", "axis-line ".concat(axisClass)).attr("x1", start.x).attr("y1", start.y).attr("x2", end.x).attr("y2", end.y).attr("stroke", color).attr("stroke-width", 2).attr("opacity", 0.7);

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
      g.append("path").attr("class", "axis-arrow ".concat(axisClass)).attr("d", arrowPath.toString()).attr("fill", color).attr("opacity", 0.7);
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

      g.append("text").attr("class", "axis-label x-label x-label-".concat(idx)).attr("x", projected.x).attr("y", projected.y).attr("text-anchor", "middle").attr("fill", AXIS_TEXT).attr("font-size", "11px").attr("font-weight", "500").style("font-family", "system-ui, -apple-system, sans-serif").style("paint-order", "stroke").style("stroke", AXIS_STROKE).style("stroke-width", "2.2px").style("stroke-linejoin", "round").text(genre);
    });

    // Y轴标签（months）- 在左侧
    months.forEach(function (month, idx) {
      if (idx % 3 === 0) {
        // 只显示部分月份，避免太密集
        var _x = 0;
        var _y = idx * cellDepth + cellDepth / 2;
        var projected = isometricProjection(_x - labelOffset, _y, 0);
        g.append("text").attr("class", "axis-label y-label y-label-".concat(idx)).attr("x", projected.x).attr("y", projected.y).attr("text-anchor", "end").attr("fill", AXIS_TEXT).attr("font-size", "10px").style("font-family", "system-ui, -apple-system, sans-serif").style("paint-order", "stroke").style("stroke", AXIS_STROKE).style("stroke-width", "2.2px").style("stroke-linejoin", "round").text(month);
      }
    });

    // Z轴标签（乐曲数量）- 再往上移
    var zLabelPos = isometricProjection(-10, 0, maxHeight + 25); // 增加Z坐标，让标签更往上
    g.append("text").attr("class", "axis-label z-label").attr("x", zLabelPos.x).attr("y", zLabelPos.y).attr("text-anchor", "middle").attr("fill", AXIS_TEXT).attr("font-size", "10px").attr("font-weight", "500").style("font-family", "system-ui, -apple-system, sans-serif").style("paint-order", "stroke").style("stroke", AXIS_STROKE).style("stroke-width", "2.2px").style("stroke-linejoin", "round").text("乐曲数量");
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
          lineData = _ref.lineData,
          darkerLineColor = _ref.darkerLineColor;
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
},{}]},{},["D9VS"], null)
//# sourceMappingURL=/heatmap.b5ba7b49.js.map