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
})({"svg-interaction.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// ==============================
// SVG 交互功能：hover 放大 + 点击新窗口打开（保留交互功能）
// ==============================
(function () {
  'use strict';

  // 等待 DOM 加载完成
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupInteractions);
    } else {
      setupInteractions();
    }
  }
  function setupInteractions() {
    // 为所有图表面板添加交互功能
    var chartPanels = [{
      id: 'panel-tree',
      svgSelector: '#tree',
      title: 'Genre Hierarchy',
      type: 'tree'
    }, {
      id: 'panel-bubble',
      svgSelector: '#bubble-svg',
      title: 'Impact Bubbles',
      type: 'bubble'
    }, {
      id: 'panel-map',
      svgSelector: '#map svg',
      title: 'Geographic Distribution',
      type: 'map'
    }, {
      id: 'panel-heatmap',
      svgSelector: '#heatmap-3d svg, #heatmap-2d svg',
      title: 'Trend Heatmap',
      type: 'heatmap'
    },
    // 词云由 JS 渲染为 SVG（不再是 IMG）
    {
      id: 'panel-img-1',
      svgSelector: '#wordcloud svg',
      title: 'Word Cloud Analysis',
      type: 'wordcloud'
    },
    // 原本是图片柱状图，现改为 SVG（支持点击放大/新窗口）
    {
      id: 'panel-img-2',
      svgSelector: '#genre-bar-svg',
      title: 'Statistical Ranking',
      type: 'bar'
    }];
    chartPanels.forEach(function (panel) {
      // 延迟设置，等待 SVG/图片加载完成
      if (panel.type === 'image') {
        // 图片需要等待加载完成
        var panelEl = document.getElementById(panel.id);
        if (panelEl) {
          var img = panelEl.querySelector('img');
          if (img) {
            if (img.complete) {
              // 图片已加载
              setTimeout(function () {
                setupImagePanelInteraction(panel.id, panel.imgSelector, panel.title);
              }, 100);
            } else {
              // 等待图片加载完成
              img.addEventListener('load', function () {
                setTimeout(function () {
                  setupImagePanelInteraction(panel.id, panel.imgSelector, panel.title);
                }, 100);
              });
              // 如果加载失败，也尝试设置（可能图片路径有问题）
              img.addEventListener('error', function () {
                setTimeout(function () {
                  setupImagePanelInteraction(panel.id, panel.imgSelector, panel.title);
                }, 100);
              });
            }
          } else {
            // 如果找不到图片，延迟后重试
            setTimeout(function () {
              setupImagePanelInteraction(panel.id, panel.imgSelector, panel.title);
            }, 1000);
          }
        }
      } else {
        setTimeout(function () {
          setupPanelInteraction(panel.id, panel.svgSelector, panel.title, panel.type);
        }, 500);
      }
    });

    // 添加全局样式
    addGlobalStyles();

    // 监听动态添加的 SVG（如热力图切换）
    observeSvgChanges();
  }
  function observeSvgChanges() {
    // 使用 MutationObserver 监听 SVG 的变化
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length) {
          // 检查是否有新的 SVG 被添加
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === 1) {
              // Element node
              var svg = node.tagName === 'svg' ? node : node.querySelector('svg');
              if (svg) {
                var panel = svg.closest('.chart-panel');
                if (panel) {
                  var chartContent = panel.querySelector('.chart-content');
                  if (chartContent && !chartContent.hasAttribute('data-interaction-setup')) {
                    var _panel$querySelector;
                    var panelId = panel.id;
                    var title = ((_panel$querySelector = panel.querySelector('.panel-header')) === null || _panel$querySelector === void 0 || (_panel$querySelector = _panel$querySelector.textContent) === null || _panel$querySelector === void 0 ? void 0 : _panel$querySelector.trim()) || 'Chart';
                    var type = 'default';
                    // ✅ 先检查更具体的类型（heatmap 包含 'map'，所以要先检查）
                    if (panelId.includes('heatmap')) type = 'heatmap';else if (panelId.includes('tree')) type = 'tree';else if (panelId.includes('bubble')) type = 'bubble';else if (panelId.includes('map')) type = 'map';
                    setupPanelInteraction(panelId, "#".concat(panelId, " svg"), title, type);
                  }
                }
              }
            }
          });
        }
      });
    });

    // 观察所有图表面板
    document.querySelectorAll('.chart-panel').forEach(function (panel) {
      observer.observe(panel, {
        childList: true,
        subtree: true
      });
    });
  }
  function setupPanelInteraction(panelId, svgSelector, title, type) {
    var panel = document.getElementById(panelId);
    if (!panel) return;
    var chartContent = panel.querySelector('.chart-content');
    if (!chartContent) return;

    // 避免重复设置
    if (chartContent.hasAttribute('data-interaction-setup')) return;
    chartContent.setAttribute('data-interaction-setup', 'true');

    // 添加 hover 放大效果
    chartContent.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    chartContent.style.cursor = 'pointer';
    chartContent.style.position = 'relative';
    chartContent.style.zIndex = '1';

    // Hover 效果
    chartContent.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 8px 32px rgba(88, 101, 242, 0.4)';
      this.style.zIndex = '100';
    });
    chartContent.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
      this.style.zIndex = '1';
    });

    // 点击在新窗口打开 SVG
    chartContent.addEventListener('click', function (e) {
      var _e$target$closest, _e$target, _e$target$closest2, _e$target2;
      // 如果点击的是按钮或其他交互元素，不触发
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
      }
      // ✅ 热力图注释：属于面板内交互控件，禁止触发“点击打开大图”
      // 典型命中：<details class="hm-anno"> / <summary>
      if ((_e$target$closest = (_e$target = e.target).closest) !== null && _e$target$closest !== void 0 && _e$target$closest.call(_e$target, '.hm-anno') || (_e$target$closest2 = (_e$target2 = e.target).closest) !== null && _e$target$closest2 !== void 0 && _e$target$closest2.call(_e$target2, '.tree-legend') || e.target.tagName === 'DETAILS' || e.target.tagName === 'SUMMARY') {
        return;
      }
      openSvgInNewWindow(svgSelector, title, type);
    });

    // 添加提示文字
    addHintText(chartContent, title);
  }
  function setupImagePanelInteraction(panelId, imgSelector, title) {
    var panel = document.getElementById(panelId);
    if (!panel) {
      console.warn("\u672A\u627E\u5230\u9762\u677F: ".concat(panelId));
      return;
    }
    var chartContent = panel.querySelector('.chart-content');
    if (!chartContent) {
      console.warn("\u672A\u627E\u5230 chart-content: ".concat(panelId));
      return;
    }

    // 查找图片元素（使用更通用的选择器）
    var img = chartContent.querySelector('img.chart-img') || chartContent.querySelector('img');
    if (!img) {
      console.warn("\u672A\u627E\u5230\u56FE\u7247\u5143\u7D20: ".concat(panelId));
      return;
    }

    // 避免重复设置
    if (chartContent.hasAttribute('data-interaction-setup')) {
      console.log("\u56FE\u7247\u4EA4\u4E92\u5DF2\u8BBE\u7F6E: ".concat(panelId));
      return;
    }
    chartContent.setAttribute('data-interaction-setup', 'true');
    console.log("\u2705 \u8BBE\u7F6E\u56FE\u7247\u4EA4\u4E92: ".concat(panelId, ", \u56FE\u7247: ").concat(img.src));

    // 添加 hover 放大效果
    chartContent.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    chartContent.style.cursor = 'pointer';
    chartContent.style.position = 'relative';
    chartContent.style.zIndex = '1';
    chartContent.style.overflow = 'hidden';

    // Hover 效果
    chartContent.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 8px 32px rgba(88, 101, 242, 0.4)';
      this.style.zIndex = '100';
    });
    chartContent.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
      this.style.zIndex = '1';
    });

    // 点击在新窗口打开图片
    chartContent.addEventListener('click', function (e) {
      var _e$target$closest3, _e$target3, _e$target$closest4, _e$target4;
      // 如果点击的是按钮或其他交互元素，不触发
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
      }
      // ✅ 防止未来图片面板也加类似注释控件后误触发打开
      if ((_e$target$closest3 = (_e$target3 = e.target).closest) !== null && _e$target$closest3 !== void 0 && _e$target$closest3.call(_e$target3, '.hm-anno') || (_e$target$closest4 = (_e$target4 = e.target).closest) !== null && _e$target$closest4 !== void 0 && _e$target$closest4.call(_e$target4, '.tree-legend') || e.target.tagName === 'DETAILS' || e.target.tagName === 'SUMMARY') {
        return;
      }

      // 获取图片的实际路径（处理相对路径）
      var imageSrc = img.src;
      // 如果是相对路径，转换为绝对路径
      if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('data:')) {
        // 已经是绝对路径或 data URL
      } else {
        // 相对路径，使用当前页面的 base URL
        var baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
        if (!imageSrc.startsWith('/')) {
          imageSrc = baseUrl + imageSrc;
        } else {
          imageSrc = window.location.origin + imageSrc;
        }
      }
      openImageInNewWindow(imageSrc, title);
    });

    // 添加提示文字
    addHintText(chartContent, title);
  }
  function addHintText(container, title) {
    // 检查是否已经添加了提示
    if (container.querySelector('.svg-hint')) return;
    var hint = document.createElement('div');
    hint.className = 'svg-hint';
    hint.innerHTML = '💡 悬停放大 | 点击查看大图';
    hint.style.cssText = "\n      position: absolute;\n      top: 8px;\n      right: 8px;\n      background: rgba(15, 23, 42, 0.9);\n      color: #e2e8f0;\n      padding: 6px 12px;\n      border-radius: 4px;\n      font-size: 11px;\n      pointer-events: none;\n      z-index: 10;\n      border: 1px solid rgba(88, 101, 242, 0.5);\n      opacity: 0;\n      transition: opacity 0.3s ease;\n    ";
    container.appendChild(hint);

    // 鼠标悬停时显示提示
    container.addEventListener('mouseenter', function () {
      hint.style.opacity = '1';
    });
    container.addEventListener('mouseleave', function () {
      hint.style.opacity = '0';
    });
  }
  function openSvgInNewWindow(svgSelector, title, type) {
    // ✅ 调试：确认 type 参数
    console.log('📝 [openSvgInNewWindow] 接收到的类型:', type, '选择器:', svgSelector);

    // 查找 SVG 元素（支持多个选择器，取第一个存在的）
    var selectors = svgSelector.split(',').map(function (s) {
      return s.trim();
    });
    var svgElement = null;

    // ✅ 热力图：必须按“当前可见”的容器优先选择（否则 querySelector 会先命中隐藏的 3D SVG）
    if (type === 'heatmap') {
      var container3D = document.querySelector('#heatmap-3d');
      var container2D = document.querySelector('#heatmap-2d');
      var isVisible = function isVisible(el) {
        if (!el) return false;
        var style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        var rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      };
      var is2DVisible = isVisible(container2D);
      var is3DVisible = isVisible(container3D);
      console.log('📊 容器可见性检查(用于新窗口打开):', {
        '2D容器存在': !!container2D,
        '2D容器显示': is2DVisible,
        '3D容器存在': !!container3D,
        '3D容器显示': is3DVisible
      });
      var pickSvgIf2D = function pickSvgIf2D(container) {
        if (!container) return null;
        var svg = container.querySelector('svg');
        if (!svg) return null;
        var rectCells = svg.querySelectorAll('rect.cell');
        var cellGroups = svg.querySelectorAll('g[class*="cell-group"]');
        return rectCells.length > 0 && cellGroups.length === 0 ? svg : null;
      };
      var pickSvgIf3D = function pickSvgIf3D(container) {
        if (!container) return null;
        var svg = container.querySelector('svg');
        if (!svg) return null;
        var cellGroups = svg.querySelectorAll('g[class*="cell-group"]');
        return cellGroups.length > 0 ? svg : null;
      };

      // 当前显示的优先
      if (is2DVisible) svgElement = pickSvgIf2D(container2D);
      if (!svgElement && is3DVisible) svgElement = pickSvgIf3D(container3D);
      // 兜底：按内容类型
      if (!svgElement) svgElement = pickSvgIf2D(container2D) || pickSvgIf3D(container3D);
    }

    // 非热力图（或热力图未找到）才用选择器兜底
    if (!svgElement) {
      var _iterator = _createForOfIteratorHelper(selectors),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var selector = _step.value;
          svgElement = document.querySelector(selector);
          if (svgElement && svgElement.tagName && svgElement.tagName.toUpperCase() === 'SVG') {
            console.log("\u2705 \u627E\u5230 SVG: ".concat(selector));
            break;
          } else if (svgElement) {
            // 如果不是SVG，继续查找
            svgElement = null;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    // 如果没找到，尝试在热力图容器中查找
    if (!svgElement && type === 'heatmap') {
      console.log('🔍 热力图：在选择器中未找到SVG，尝试在容器中查找...');
      var _container3D = document.querySelector('#heatmap-3d');
      var _container2D = document.querySelector('#heatmap-2d');

      // ✅ 优先查找当前显示的容器（2D优先，因为用户可能切换到了2D）
      // 使用 getComputedStyle 检查实际显示状态（包括CSS类设置的display）
      var _is2DVisible = _container2D && window.getComputedStyle(_container2D).display !== 'none';
      var _is3DVisible = _container3D && window.getComputedStyle(_container3D).display !== 'none';
      console.log('📊 容器状态检查:', {
        '2D容器存在': !!_container2D,
        '2D容器显示': _is2DVisible,
        '2D容器内联样式': _container2D ? _container2D.style.display : 'N/A',
        '2D容器计算样式': _container2D ? window.getComputedStyle(_container2D).display : 'N/A',
        '3D容器存在': !!_container3D,
        '3D容器显示': _is3DVisible,
        '3D容器内联样式': _container3D ? _container3D.style.display : 'N/A',
        '3D容器计算样式': _container3D ? window.getComputedStyle(_container3D).display : 'N/A'
      });

      // ✅ 修复：严格按照显示状态和内容类型选择SVG
      if (_is2DVisible) {
        var svg2D = _container2D.querySelector('svg');
        if (svg2D) {
          // ✅ 严格验证：必须是2D热力图（有rect.cell且没有cell-group）
          var rectCells = svg2D.querySelectorAll('rect.cell');
          var cellGroups = svg2D.querySelectorAll('g[class*="cell-group"]');
          var isActually2D = rectCells.length > 0 && cellGroups.length === 0;
          console.log('📊 2D容器验证:', {
            'rect.cell数量': rectCells.length,
            'cell-group数量': cellGroups.length,
            '是真正的2D热力图': isActually2D
          });
          if (isActually2D) {
            svgElement = svg2D;
            console.log('✅ 选择2D热力图SVG（当前显示）');
          } else {
            console.warn('⚠️ 2D容器中的SVG不是2D热力图，跳过');
          }
        } else {
          console.warn('⚠️ heatmap-2d容器中没有SVG元素');
        }
      }

      // ✅ 只有在2D不可用或不是真正的2D时，才选择3D
      if (!svgElement && _is3DVisible) {
        var svg3D = _container3D.querySelector('svg');
        if (svg3D) {
          // ✅ 验证：必须是3D热力图（有cell-group）
          var _cellGroups = svg3D.querySelectorAll('g[class*="cell-group"]');
          if (_cellGroups.length > 0) {
            svgElement = svg3D;
            console.log('✅ 选择3D热力图SVG（当前显示）');
          } else {
            console.warn('⚠️ 3D容器中的SVG不是3D热力图');
          }
        } else {
          console.warn('⚠️ heatmap-3d容器中没有SVG元素');
        }
      }

      // ✅ 如果当前显示的容器都没有合适的SVG，尝试查找隐藏的容器
      if (!svgElement) {
        // 先尝试2D（隐藏的）
        if (_container2D) {
          var _svg2D = _container2D.querySelector('svg');
          if (_svg2D) {
            var _rectCells = _svg2D.querySelectorAll('rect.cell');
            var _cellGroups2 = _svg2D.querySelectorAll('g[class*="cell-group"]');
            if (_rectCells.length > 0 && _cellGroups2.length === 0) {
              svgElement = _svg2D;
              console.log('✅ 选择2D热力图SVG（隐藏容器）');
            }
          }
        }

        // 再尝试3D（隐藏的）
        if (!svgElement && _container3D) {
          var _svg3D = _container3D.querySelector('svg');
          if (_svg3D) {
            var _cellGroups3 = _svg3D.querySelectorAll('g[class*="cell-group"]');
            if (_cellGroups3.length > 0) {
              svgElement = _svg3D;
              console.log('✅ 选择3D热力图SVG（隐藏容器）');
            }
          }
        }
      }
    }
    if (!svgElement) {
      console.error("\u274C \u672A\u627E\u5230 SVG: ".concat(svgSelector, ", type: ").concat(type));
      // 输出调试信息
      selectors.forEach(function (sel) {
        var el = document.querySelector(sel);
        console.log("  - \u9009\u62E9\u5668 \"".concat(sel, "\": ").concat(el ? el.tagName || '未知' : '未找到'));
      });
      return;
    }

    // 在克隆前，将数据存储到 data 属性中
    // 对于地图，先触发一次所有元素的 mouseenter 以确保数据被存储
    if (type === 'map') {
      d3.select(svgElement).selectAll('path').each(function () {
        var path = d3.select(this);
        var d = path.datum();
        if (d && d.properties) {
          // 触发一次 mouseenter 事件，让 script.js 存储数据
          var event = new MouseEvent('mouseenter', {
            bubbles: true
          });
          this.dispatchEvent(event);
        }
      });
      // 等待事件处理完成
      setTimeout(function () {
        storeDataInAttributes(svgElement, type);
        proceedWithNewWindow();
      }, 100);
      return;
    } else if (type === 'heatmap') {
      // 热力图需要等待数据存储完成
      console.log('🔍 开始存储热力图数据...');
      storeDataInAttributes(svgElement, type);
      // 给一点时间确保数据属性被设置
      setTimeout(function () {
        console.log('✅ 热力图数据存储完成，准备打开新窗口');
        proceedWithNewWindow();
      }, 100);
    } else {
      storeDataInAttributes(svgElement, type);
      proceedWithNewWindow();
    }
    function proceedWithNewWindow() {
      // 克隆 SVG（深拷贝，包含所有子元素和属性）
      var clonedSvg = svgElement.cloneNode(true);

      // 确保 SVG 有正确的尺寸和命名空间（重要：防止被识别为图片）
      var svgWidth = svgElement.getAttribute('width') || svgElement.clientWidth || 1200;
      var svgHeight = svgElement.getAttribute('height') || svgElement.clientHeight || 800;
      var viewBox = svgElement.getAttribute('viewBox');

      // 确保 SVG 有正确的命名空间（防止被识别为图片）
      // 重要：必须在克隆后立即设置，否则可能被浏览器识别为图片
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

      // 移除可能被误识别为图片的属性
      clonedSvg.removeAttribute('content-type');
      clonedSvg.removeAttribute('content');
      clonedSvg.removeAttribute('type');

      // 设置克隆 SVG 的尺寸
      if (viewBox) {
        clonedSvg.setAttribute('viewBox', viewBox);
        clonedSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      } else {
        clonedSvg.setAttribute('width', svgWidth);
        clonedSvg.setAttribute('height', svgHeight);
      }

      // 确保 SVG 可以接收事件（不是图片）
      clonedSvg.style.pointerEvents = 'auto';

      // ✅ 对于热力图，确保所有子元素也可以接收事件
      if (type === 'heatmap') {
        var allElements = clonedSvg.querySelectorAll('*');
        allElements.forEach(function (el) {
          // 确保所有元素都可以接收事件
          el.style.pointerEvents = 'auto';
          // 移除可能阻止事件的样式
          if (el.style.pointerEvents === 'none') {
            el.style.pointerEvents = 'auto';
          }
        });
        console.log("\u2705 \u70ED\u529B\u56FE\uFF1A\u5DF2\u4E3A ".concat(allElements.length, " \u4E2A\u5143\u7D20\u8BBE\u7F6E pointer-events"));
      }

      // ✅ 移除可能被误识别为图片的属性
      clonedSvg.removeAttribute('role');
      clonedSvg.removeAttribute('aria-label');

      // ✅ 使用 XMLSerializer 确保 SVG 正确序列化（保持命名空间）
      var serializer = new XMLSerializer();
      var svgString = serializer.serializeToString(clonedSvg);

      // 地图图例在主页面是独立的 #legend（不在 SVG 内），新窗口需要额外注入
      var mapLegendHTML = '';
      if (type === 'map') {
        var legendEl = document.getElementById('legend');
        if (legendEl) mapLegendHTML = legendEl.innerHTML || '';
      }

      // ✅ 热力图图例同理：主页面在 #heatmap-color-legend（不在 SVG 内）
      var heatmapLegendHTML = '';
      if (type === 'heatmap') {
        var _legendEl = document.getElementById('heatmap-color-legend');
        if (_legendEl) heatmapLegendHTML = _legendEl.innerHTML || '';
      }

      // ✅ 树图图例：主页面是 HTML overlay（.tree-legend），新窗口需要额外注入
      var treeLegendHTML = '';
      if (type === 'tree') {
        var treeLegendEl = document.querySelector('#panel-tree .tree-legend') || document.querySelector('.tree-legend');
        if (treeLegendEl) treeLegendHTML = treeLegendEl.outerHTML || '';
      }

      // 新窗口的 D3：优先用主页面已经加载的本地 d3 脚本 URL（Parcel 往往会带 hash）
      // 这样就算新窗口禁用 opener 或网络拦截 CDN，交互也能正常初始化
      var d3LocalUrl = '';
      var d3LocalScript = document.querySelector('script[src*="d3-global"]');
      if (d3LocalScript && d3LocalScript.src) d3LocalUrl = d3LocalScript.src;

      // 创建新窗口的 HTML，包含必要的脚本和交互功能
      var html = createNewWindowHTML(svgString, title, type, mapLegendHTML, d3LocalUrl, heatmapLegendHTML, treeLegendHTML);

      // 打开新窗口
      var newWindow = window.open('', '_blank', 'width=1400,height=900,resizable=yes,scrollbars=yes');
      if (newWindow) {
        // ✅ 使用更现代的方式写入HTML，避免document.write的警告
        newWindow.document.open('text/html', 'replace');
        newWindow.document.write(html);
        newWindow.document.close();

        // 等待DOM加载完成后，确保脚本执行
        newWindow.addEventListener('load', function () {
          console.log('✅ 新窗口加载完成');
          // 确保在新窗口中重新初始化交互
          if (type === 'heatmap') {
            console.log('🔧 在新窗口中重新初始化热力图交互...');
            // 脚本已经在 HTML 中，这里只是确认
          }
        });
      } else {
        alert('无法打开新窗口，请检查浏览器弹窗设置');
      }
    }
  }
  function storeDataInAttributes(svgElement, type) {
    // 将 D3 数据绑定存储到 data-* 属性中，以便在新窗口中恢复
    try {
      if (type === 'tree') {
        // 树图：存储节点数据
        var circles = d3.select(svgElement).selectAll('circle');
        circles.each(function () {
          var circle = d3.select(this);
          var d = circle.datum();
          if (d && d.data) {
            var data = d.data;
            var scrapedInfo = data.scraped_info || {};

            // 存储关键信息到 data 属性
            if (data.name) circle.attr('data-name', data.name);
            if (scrapedInfo && Object.keys(scrapedInfo).length > 0) {
              try {
                circle.attr('data-scraped-info', JSON.stringify(scrapedInfo));
              } catch (e) {
                console.warn('无法序列化 scraped_info:', e);
              }
            }
            if (d.depth !== undefined) circle.attr('data-depth', d.depth);
            if (d.children && d.children.length) {
              circle.attr('data-children-count', d.children.length);
            }

            // 存储祖先信息（通过遍历获取）
            try {
              var ancestors = d.ancestors ? d.ancestors() : [];
              if (ancestors.length > 1 && ancestors[1].data) {
                circle.attr('data-category', ancestors[1].data.name || '');
              }
              if (ancestors.length > 2 && ancestors[2].data) {
                circle.attr('data-subcategory', ancestors[2].data.name || '');
              }
            } catch (e) {
              // 如果 ancestors 不可用，跳过
            }
          }
        });
      } else if (type === 'bubble') {
        // 气泡图：存储气泡数据
        var _circles = d3.select(svgElement).selectAll('circle');
        _circles.each(function () {
          var circle = d3.select(this);
          var d = circle.datum();
          if (d && d.id) {
            circle.attr('data-id', d.id);
            if (d.total_plays !== undefined) circle.attr('data-plays', d.total_plays);
            if (d.total_comments !== undefined) circle.attr('data-comments', d.total_comments);
            if (d.rate !== undefined) circle.attr('data-rate', d.rate);
            if (d.influence !== undefined && d.influence !== null) circle.attr('data-influence', d.influence);
          }
        });
      } else if (type === 'map') {
        // 地图：国家数据（script.js 已经在 mouseenter 时存储了数据）
        // 这里只需要确保所有 path 都有国家名称
        var paths = d3.select(svgElement).selectAll('.country, path');
        paths.each(function () {
          var path = d3.select(this);
          var d = path.datum();
          if (d && d.properties) {
            var name = d.properties.name;
            if (name && !path.attr('data-country-name')) {
              path.attr('data-country-name', name);
            }
          }
        });
      } else if (type === 'heatmap') {
        // 热力图：存储单元格数据（3D和2D都支持）
        console.log('🔍 开始存储热力图数据...');

        // 3D热力图：立方体组（g.cell-group）
        var cellGroups = d3.select(svgElement).selectAll('g[class*="cell-group"]');
        var storedCount = 0;
        cellGroups.each(function () {
          var group = d3.select(this);
          var d = group.datum();

          // 尝试从datum获取数据，如果失败则从class名解析
          var genre, month, value, genreIdx, monthIdx;
          if (d && d.genre && d.month) {
            // 从datum获取
            genre = d.genre;
            month = d.month;
            value = d.value !== undefined ? d.value : 0;
            genreIdx = d.genreIdx;
            monthIdx = d.monthIdx;
          } else {
            // 从class名解析：cell-group cell-{monthIdx}-{genreIdx}
            var classAttr = group.attr('class') || '';
            var match = classAttr.match(/cell-(\d+)-(\d+)/);
            if (match) {
              monthIdx = parseInt(match[1]);
              genreIdx = parseInt(match[2]);

              // 定义月份和风格数组（与heatmap.js保持一致）
              var months = ['2023-12', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];
              var allGenres = ["ACG", "classical", "electronic", "folk", "jazz", "pop", "rap", "rock"];

              // 从数组获取genre和month
              if (monthIdx >= 0 && monthIdx < months.length) month = months[monthIdx];
              if (genreIdx >= 0 && genreIdx < allGenres.length) genre = allGenres[genreIdx];

              // 尝试从datum获取value，如果没有则设为0
              value = d && d.value !== undefined ? d.value : 0;
            }
          }

          // 如果仍然没有数据，跳过
          if (!genre || !month) {
            return;
          }

          // 存储到group和所有子元素上
          group.attr('data-genre', genre);
          group.attr('data-month', month);
          group.attr('data-value', value);
          if (genreIdx !== undefined) group.attr('data-genre-idx', genreIdx);
          if (monthIdx !== undefined) group.attr('data-month-idx', monthIdx);

          // 为group内的所有path元素存储数据（特别是顶面）
          group.selectAll('path').each(function () {
            var path = d3.select(this);
            path.attr('data-genre', genre);
            path.attr('data-month', month);
            path.attr('data-value', value);
            // 存储曲目数量（如果有的话，使用 value 的整数部分作为后备）
            var trackCount = Math.round(value);
            path.attr('data-track-count', trackCount);
          });
          storedCount++;
        });
        console.log("\u2705 3D\u70ED\u529B\u56FE\uFF1A\u5B58\u50A8\u4E86 ".concat(storedCount, " \u4E2A\u5355\u5143\u683C\u7EC4\u7684\u6570\u636E"));

        // 2D热力图：矩形单元格（rect.cell）
        var cells = d3.select(svgElement).selectAll('rect.cell');
        var cellCount = 0;
        cells.each(function () {
          var cell = d3.select(this);
          var d = cell.datum();
          if (d && d.genre && d.month) {
            cell.attr('data-genre', d.genre);
            cell.attr('data-month', d.month);
            if (d.value !== undefined) cell.attr('data-value', d.value);
            cellCount++;
          }
        });
        console.log("\u2705 2D\u70ED\u529B\u56FE\uFF1A\u5B58\u50A8\u4E86 ".concat(cellCount, " \u4E2A\u5355\u5143\u683C\u7684\u6570\u636E"));

        // ✅ 折线图：存储折线数据（line-path 和 area-path）
        var linePaths = d3.select(svgElement).selectAll('path.line-path, path.area-path');
        var lineCount = 0;
        linePaths.each(function () {
          try {
            var path = d3.select(this);
            var d = path.datum();
            if (d && d.month) {
              // 存储月份信息
              path.attr('data-month', d.month);
              if (d.monthIdx !== undefined) {
                path.attr('data-month-idx', d.monthIdx);
              }

              // 如果有 lineData，存储数据点的值（用于 tooltip）
              if (d.lineData && Array.isArray(d.lineData) && d.lineData.length > 0) {
                var allGenres = ["ACG", "classical", "electronic", "folk", "jazz", "pop", "rap", "rock"];

                // 存储所有数据点的值（JSON格式）
                try {
                  var values = d.lineData.map(function (p, idx) {
                    if (p && _typeof(p) === 'object') {
                      return {
                        genre: allGenres[idx] || "Genre".concat(idx),
                        value: p.value || 0
                      };
                    }
                    return {
                      genre: allGenres[idx] || "Genre".concat(idx),
                      value: 0
                    };
                  }).filter(function (v) {
                    return v !== null;
                  });
                  if (values.length > 0) {
                    path.attr('data-line-values', JSON.stringify(values));
                  }
                } catch (e) {
                  console.warn('无法序列化折线数据:', e);
                }
              }
              lineCount++;
            }
          } catch (e) {
            console.warn('处理折线路径时出错:', e);
          }
        });
        console.log("\u2705 \u6298\u7EBF\u56FE\uFF1A\u5B58\u50A8\u4E86 ".concat(lineCount, " \u6761\u6298\u7EBF\u7684\u6570\u636E"));

        // 如果存储的数据很少，尝试直接从原始热力图数据中恢复
        if (storedCount === 0 && cellCount === 0) {
          console.warn('⚠️ 未找到热力图数据，尝试从SVG结构推断...');
          // 这里可以添加备用逻辑，比如从坐标位置推断genre和month
        }
      }
    } catch (e) {
      console.warn('存储数据到属性时出错:', e);
    }
  }

  // 辅助函数：规范化国家名称（与 script.js 中的 normalize 函数保持一致）
  function normalizeCountryName(name) {
    if (!name) return name;
    var ALIASES = new Map([["United States of America", "United States"], ["Russian Federation", "Russia"], ["Czech Republic", "Czechia"], ["Korea, Republic of", "South Korea"], ["Korea, Democratic People's Republic of", "North Korea"], ["Syrian Arab Republic", "Syria"], ["Lao People's Democratic Republic", "Laos"], ["Viet Nam", "Vietnam"], ["Eswatini", "Eswatini"], ["Swaziland", "Eswatini"], ["Cabo Verde", "Cape Verde"], ["Myanmar", "Myanmar (Burma)"], ["Macedonia", "North Macedonia"], ["Taiwan, Province of China", "Taiwan"]]);
    var trimmed = name.trim();
    return ALIASES.get(trimmed) || trimmed;
  }

  //#region 新窗口大图模板（SVG 复制 + 交互恢复 + 热力图注释/图例）
  function createNewWindowHTML(svgString, title, type) {
    var mapLegendHTML = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var d3LocalUrl = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    var heatmapLegendHTML = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
    var treeLegendHTML = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';
    // 根据类型生成不同的交互脚本
    var interactionScript = '';

    // ✅ 生成热力图初始化代码字符串（在函数作用域中生成，避免模板字符串中的条件判断问题）
    var heatmapInitCode = type === 'heatmap' ? "\n      console.log('\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25 \u70ED\u529B\u56FE\u521D\u59CB\u5316\u4EE3\u7801\u5DF2\u6267\u884C\uFF01');\n      console.log('\uD83D\uDD25 \u5F00\u59CB\u521D\u59CB\u5316\u70ED\u529B\u56FE\u4EA4\u4E92...');\n      const svg = document.querySelector('#svg-container-main svg') || document.querySelector('svg');\n      if (!svg) {\n        console.warn('\u26A0\uFE0F \u672A\u627E\u5230 SVG\uFF0C\u65E0\u6CD5\u521D\u59CB\u5316\u70ED\u529B\u56FE\u4EA4\u4E92');\n        return;\n      }\n      const svgD3 = d3.select(svg);\n      const tooltip = d3.select(\"body\").append(\"div\")\n        .attr(\"class\", \"heatmap-tooltip\")\n        .style(\"position\", \"fixed\")\n        .style(\"pointer-events\", \"none\")\n        .style(\"opacity\", 0)\n        .style(\"padding\", \"10px 12px\")\n        .style(\"border-radius\", \"12px\")\n        .style(\"background\", \"rgba(30, 41, 59, 0.92)\")\n        .style(\"color\", \"#fff\")\n        .style(\"font\", \"13px/1.35 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif\")\n        .style(\"box-shadow\", \"0 10px 24px rgba(0,0,0,0.16)\")\n        .style(\"z-index\", 10000)\n        .style(\"backdrop-filter\", \"blur(6px)\")\n        .style(\"border\", \"1px solid rgba(88, 101, 242, 0.5)\");\n      \n      // \u4E3A\u6240\u6709 path \u5143\u7D20\u7ED1\u5B9A\u4E8B\u4EF6\uFF083D\u70ED\u529B\u56FE\uFF09\n      const cellGroupPaths = svgD3.selectAll('g[class*=\"cell-group\"] path');\n      console.log('\uD83D\uDD0D \u627E\u5230 ' + cellGroupPaths.size() + ' \u4E2A cell-group path \u5143\u7D20');\n      \n      cellGroupPaths.each(function() {\n        const path = d3.select(this);\n        const genre = path.attr('data-genre') || path.node().parentElement?.getAttribute('data-genre');\n        const month = path.attr('data-month') || path.node().parentElement?.getAttribute('data-month');\n        const value = path.attr('data-value') || path.node().parentElement?.getAttribute('data-value') || '0';\n        \n        if (genre && month) {\n          const pathNode = path.node();\n          pathNode.style.pointerEvents = 'auto';\n          pathNode.style.cursor = 'pointer';\n          \n          path\n            .on(\"mouseover\", function(event) {\n              d3.select(this.parentNode).selectAll(\"path\")\n                .attr(\"opacity\", 1)\n                .attr(\"stroke-width\", 1.5);\n              \n              tooltip\n                .style(\"opacity\", 0.95)\n                .html('<b>' + genre + '</b><br/>' + month + '<br/>\u5206\u503C: ' + parseFloat(value).toFixed(2))\n                .style(\"left\", (event.pageX + 12) + \"px\")\n                .style(\"top\", (event.pageY - 18) + \"px\");\n            })\n            .on(\"mouseout\", function() {\n              d3.select(this.parentNode).selectAll(\"path\")\n                .attr(\"opacity\", 0.9)\n                .attr(\"stroke-width\", 0.5);\n              tooltip.style(\"opacity\", 0);\n            });\n        }\n      });\n      \n      // \u4E3A\u6240\u6709 rect.cell \u7ED1\u5B9A\u4E8B\u4EF6\uFF082D\u70ED\u529B\u56FE\uFF09\n      const cells = svgD3.selectAll('rect.cell');\n      console.log('\uD83D\uDD0D \u627E\u5230 ' + cells.size() + ' \u4E2A rect.cell \u5143\u7D20');\n      \n      cells.each(function() {\n        const cell = d3.select(this);\n        const genre = cell.attr('data-genre');\n        const month = cell.attr('data-month');\n        const value = cell.attr('data-value');\n        \n        if (genre && month) {\n          const cellNode = cell.node();\n          cellNode.style.pointerEvents = 'auto';\n          cellNode.style.cursor = 'pointer';\n          \n          cell\n            .on(\"mousemove\", function(event) {\n              tooltip\n                .style(\"opacity\", 1)\n                .html('<b>' + genre + '</b><br/>' + month + '<br/>Value: ' + value)\n                .style(\"left\", (event.pageX + 12) + \"px\")\n                .style(\"top\", (event.pageY - 18) + \"px\");\n            })\n            .on(\"mouseout\", function() {\n              tooltip.style(\"opacity\", 0);\n            });\n        }\n      });\n      \n      // \u6DFB\u52A0\u7F29\u653E\u529F\u80FD\n      const g = svgD3.select('g');\n      if (!g.empty()) {\n        const zoom = d3.zoom()\n          .scaleExtent([0.5, 3])\n          .on(\"zoom\", (event) => {\n            g.attr(\"transform\", event.transform);\n          });\n        svgD3.call(zoom);\n        console.log('\u2705 \u7F29\u653E\u529F\u80FD\u5DF2\u542F\u7528');\n      }\n      \n      console.log('\u2705 \u70ED\u529B\u56FE\u4EA4\u4E92\u521D\u59CB\u5316\u5B8C\u6210');\n    " : '';
    if (type === 'tree') {
      // 树图的缩放和拖拽功能
      interactionScript = "\n        <script>\n          (function() {\n            if (typeof d3 === 'undefined') return;\n            const svg = d3.select('svg');\n            const g = svg.select('g');\n            \n            if (g.empty()) return;\n            \n            // \u521B\u5EFA tooltip\n            let tooltip = d3.select(\"body\").select(\".tree-tooltip\");\n            if (tooltip.empty()) {\n              tooltip = d3.select(\"body\")\n                .append(\"div\")\n                .attr(\"class\", \"tree-tooltip\")\n                .style(\"position\", \"absolute\")\n                .style(\"pointer-events\", \"none\")\n                .style(\"padding\", \"12px 14px\")\n                .style(\"border-radius\", \"12px\")\n                .style(\"background\", \"rgba(15, 23, 42, 0.95)\")\n                .style(\"color\", \"#e2e8f0\")\n                .style(\"font\", \"13px/1.4 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif\")\n                .style(\"opacity\", 0)\n                .style(\"backdrop-filter\", \"blur(6px)\")\n                .style(\"z-index\", 1000)\n                .style(\"border\", \"1px solid rgba(88, 101, 242, 0.5)\");\n            }\n            \n            // \u7F29\u653E\u548C\u62D6\u62FD\u529F\u80FD\n            const zoom = d3.zoom()\n              .scaleExtent([0.45, 7])\n              .on(\"start\", () => svg.style(\"cursor\", \"grabbing\"))\n              .on(\"end\", () => svg.style(\"cursor\", \"grab\"))\n              .on(\"zoom\", (event) => {\n                g.attr(\"transform\", event.transform);\n              });\n            \n            svg.call(zoom);\n            svg.call(zoom.transform, d3.zoomIdentity.scale(0.95));\n            \n            // \u91CD\u65B0\u7ED1\u5B9A tooltip \u4E8B\u4EF6\uFF08\u4ECE data \u5C5E\u6027\u8BFB\u53D6\u6570\u636E\uFF09\n            svg.selectAll('circle').each(function() {\n              const circle = d3.select(this);\n              const name = circle.attr('data-name');\n              const depth = parseInt(circle.attr('data-depth') || '0');\n              const category = circle.attr('data-category') || '';\n              const subcategory = circle.attr('data-subcategory') || '';\n              const scrapedInfoStr = circle.attr('data-scraped-info');\n              const childrenCount = circle.attr('data-children-count');\n              \n              if (!name) return;\n              \n              let scrapedInfo = {};\n              if (scrapedInfoStr) {\n                try {\n                  scrapedInfo = JSON.parse(scrapedInfoStr);\n                } catch(e) {}\n              }\n              \n              const location = scrapedInfo.location || null;\n              const years = scrapedInfo.years || [];\n              const culturalOrigins = scrapedInfo.cultural_origins || null;\n              const stylisticOrigins = scrapedInfo.stylistic_origins || null;\n              \n              circle\n                .on(\"mouseenter\", function(event) {\n                  let html = '<div style=\"font-weight:800;margin-bottom:6px;letter-spacing:.3px\">' + name + '</div>';\n                  \n                  if (depth === 1) {\n                    html += '<div style=\"opacity:.92\">\u7C7B\u522B\uFF1A' + category + '</div>';\n                  } else if (depth === 2) {\n                    html += '<div style=\"opacity:.92\">\u7C7B\u522B\uFF1A' + category + '</div>';\n                    html += '<div style=\"opacity:.92\">\u5B50\u7C7B\u522B\uFF1A' + subcategory + '</div>';\n                  } else if (depth >= 3) {\n                    html += '<div style=\"opacity:.92\">\u7C7B\u522B\uFF1A' + category + '</div>';\n                    if (subcategory) {\n                      html += '<div style=\"opacity:.92\">\u5B50\u7C7B\u522B\uFF1A' + subcategory + '</div>';\n                    }\n                    html += '<div style=\"opacity:.92\">\u6D41\u6D3E\uFF1A' + name + '</div>';\n                  }\n                  \n                  if (years && years.length > 0) {\n                    const yearStr = years.length === 1 ? years[0] : \n                                   years.length === 2 ? years[0] + ' - ' + years[1] : \n                                   years[0] + ' - ' + years[years.length - 1];\n                    html += '<div style=\"opacity:.92;margin-top:6px\">\u65F6\u95F4\uFF1A' + yearStr + '</div>';\n                  } else if (culturalOrigins) {\n                    const yearMatch = culturalOrigins.match(/\\b(1[0-9]{3}|20[0-2][0-9])\\b/);\n                    if (yearMatch) {\n                      html += '<div style=\"opacity:.92;margin-top:6px\">\u65F6\u95F4\uFF1A' + culturalOrigins + '</div>';\n                    }\n                  }\n                  \n                  if (location) {\n                    html += '<div style=\"opacity:.92\">\u5730\u70B9\uFF1A' + location + '</div>';\n                  }\n                  \n                  if (culturalOrigins && !years.length) {\n                    html += '<div style=\"opacity:.92\">\u6587\u5316\u8D77\u6E90\uFF1A' + culturalOrigins + '</div>';\n                  }\n                  \n                  if (stylisticOrigins) {\n                    html += '<div style=\"opacity:.92\">\u98CE\u683C\u8D77\u6E90\uFF1A' + stylisticOrigins + '</div>';\n                  }\n                  \n                  if (childrenCount && parseInt(childrenCount) > 0) {\n                    html += '<div style=\"opacity:.70;margin-top:6px\">\u5B50\u8282\u70B9\u6570\uFF1A' + childrenCount + '</div>';\n                  }\n                  \n                  tooltip.style(\"opacity\", 1).html(html);\n                })\n                .on(\"mousemove\", function(event) {\n                  tooltip\n                    .style(\"left\", (event.pageX + 14) + \"px\")\n                    .style(\"top\", (event.pageY + 14) + \"px\");\n                })\n                .on(\"mouseleave\", function() {\n                  tooltip.style(\"opacity\", 0);\n                });\n            });\n\n            // \u2705 \u65B0\u7A97\u53E3\u6811\u56FE\u56FE\u4F8B\uFF1A\u70B9\u51FB\u9690\u85CF/\u663E\u793A\uFF08\u57FA\u4E8E data-cat\uFF09\uFF0C\u5E76\u652F\u6301\u53CC\u51FB\u53EA\u663E\u793A\u67D0\u4E00\u7C7B\n            (function initTreeLegendFilter() {\n              const legend = document.querySelector('.tree-legend');\n              if (!legend) return;\n\n              // \u8BA9\u56FE\u4F8B\u53EF\u70B9\u51FB\uFF08\u4E0D\u6321\u4F4F svg \u7684\u5176\u4ED6 hover\uFF09\n              legend.style.pointerEvents = 'auto';\n\n              const caret = legend.querySelector('.tree-legend-caret');\n              const syncCaret = () => { if (caret) caret.textContent = legend.open ? '\u25BE' : '\u25B8'; };\n              syncCaret();\n              legend.addEventListener('toggle', syncCaret);\n\n              const body = legend.querySelector('.tree-legend-body');\n              if (!body) return;\n\n              const disabled = new Set();\n\n              function apply() {\n                // g.node + path.link \u90FD\u5E26 data-cat\uFF08\u6765\u81EA\u4E3B\u9875\u9762 tree.js \u6E32\u67D3\uFF09\n                document.querySelectorAll('g.node, path.link').forEach((el) => {\n                  const cat = el.getAttribute('data-cat');\n                  if (cat && disabled.has(cat)) el.setAttribute('display', 'none');\n                  else el.removeAttribute('display');\n                });\n              }\n\n              body.addEventListener('click', (e) => {\n                const btn = e.target.closest?.('.tree-legend-item');\n                if (!btn) return;\n                e.preventDefault();\n                e.stopPropagation();\n                const key = btn.getAttribute('data-key');\n                if (!key) return;\n                if (disabled.has(key)) disabled.delete(key);\n                else disabled.add(key);\n                btn.classList.toggle('is-off', disabled.has(key));\n                apply();\n              });\n\n              body.addEventListener('dblclick', (e) => {\n                const btn = e.target.closest?.('.tree-legend-item');\n                if (!btn) return;\n                e.preventDefault();\n                e.stopPropagation();\n                const key = btn.getAttribute('data-key');\n                if (!key) return;\n                const items = Array.from(body.querySelectorAll('.tree-legend-item'));\n                const keys = items.map((b) => b.getAttribute('data-key')).filter(Boolean);\n                const onlyThis = (disabled.size === (keys.length - 1)) && !disabled.has(key);\n                if (onlyThis) disabled.clear();\n                else {\n                  disabled.clear();\n                  keys.forEach((k) => { if (k !== key) disabled.add(k); });\n                }\n                items.forEach((b) => {\n                  const k = b.getAttribute('data-key');\n                  b.classList.toggle('is-off', !!(k && disabled.has(k)));\n                });\n                apply();\n              });\n            })();\n          })();\n        </script>\n      ";
    } else if (type === 'bubble') {
      // 气泡图的 tooltip 功能
      interactionScript = "\n        <script>\n          (function() {\n            if (typeof d3 === 'undefined') return;\n            let tooltip = d3.select(\"body\").select(\".bubble-tooltip\");\n            if (tooltip.empty()) {\n              tooltip = d3.select(\"body\").append(\"div\")\n                .attr(\"class\", \"bubble-tooltip\")\n                .style(\"position\", \"absolute\")\n                .style(\"pointer-events\", \"none\")\n                .style(\"padding\", \"12px 14px\")\n                .style(\"border-radius\", \"12px\")\n                .style(\"background\", \"rgba(15, 23, 42, 0.95)\")\n                .style(\"color\", \"#e2e8f0\")\n                .style(\"font\", \"13px/1.4 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif\")\n                .style(\"opacity\", 0)\n                .style(\"backdrop-filter\", \"blur(6px)\")\n                .style(\"z-index\", 1000)\n                .style(\"border\", \"1px solid rgba(88, 101, 242, 0.5)\");\n            }\n            \n            function formatBig(n) {\n              return n ? n.toLocaleString() : '0';\n            }\n            function pct(x) {\n              return x ? (x * 100).toFixed(2) + '%' : '0%';\n            }\n            \n            d3.select('svg').selectAll('circle').each(function() {\n              const circle = d3.select(this);\n              const id = circle.attr('data-id');\n              const plays = circle.attr('data-plays');\n              const comments = circle.attr('data-comments');\n              const rate = circle.attr('data-rate');\n              const influence = circle.attr('data-influence');\n              \n              if (!id) return;\n              \n              circle\n                .on(\"mouseenter\", function(event) {\n                  const inf = (influence !== null && influence !== undefined && influence !== '') ? Number(influence) : NaN;\n                  const infText = Number.isFinite(inf) ? inf.toFixed(4) : 'N/A';\n                  const html = '<div style=\"font-weight:800;margin-bottom:6px;letter-spacing:.3px\">' + id + '</div>' +\n                               '<div style=\"opacity:.92\">Plays\uFF1A' + formatBig(plays) + '</div>' +\n                               '<div style=\"opacity:.92\">Comments\uFF1A' + formatBig(comments) + '</div>' +\n                               '<div style=\"opacity:.92;margin-top:6px\">Influence\uFF1A' + infText + '</div>' +\n                               (rate ? '<div style=\"opacity:.92;margin-top:6px\">\u4E92\u52A8\u7387\uFF1A' + pct(rate) + '</div>' : '') +\n                               '<div style=\"opacity:.70;margin-top:6px\">\u6C14\u6CE1=\u5F71\u54CD\u529B(influence)\uFF5C\u5916\u73AF=\u4E92\u52A8\u7387\uFF08\u76F8\u5BF9\u8FDB\u5EA6\uFF09</div>';\n                  \n                  tooltip.style(\"opacity\", 1).html(html);\n                })\n                .on(\"mousemove\", function(event) {\n                  tooltip\n                    .style(\"left\", (event.pageX + 14) + \"px\")\n                    .style(\"top\", (event.pageY + 14) + \"px\");\n                })\n                .on(\"mouseleave\", function() {\n                  tooltip.style(\"opacity\", 0);\n                });\n            });\n          })();\n        </script>\n      ";
    } else if (type === 'map') {
      // 地图的 tooltip 功能
      interactionScript = "\n        <script>\n          (function() {\n            if (typeof d3 === 'undefined') return;\n            let tooltip = d3.select(\"body\").select(\".map-tooltip\");\n            if (tooltip.empty()) {\n              tooltip = d3.select(\"body\").append(\"div\")\n                .attr(\"class\", \"map-tooltip\")\n                .style(\"position\", \"absolute\")\n                .style(\"pointer-events\", \"none\")\n                .style(\"padding\", \"12px 14px\")\n                .style(\"border-radius\", \"12px\")\n                .style(\"background\", \"rgba(15, 23, 42, 0.95)\")\n                .style(\"color\", \"#e2e8f0\")\n                .style(\"font\", \"13px/1.4 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif\")\n                .style(\"opacity\", 0)\n                .style(\"backdrop-filter\", \"blur(6px)\")\n                .style(\"z-index\", 1000)\n                .style(\"border\", \"1px solid rgba(88, 101, 242, 0.5)\");\n            }\n            \n            // \u4E3A\u6240\u6709\u8DEF\u5F84\u5143\u7D20\u7ED1\u5B9A\u4E8B\u4EF6\uFF08\u5305\u62EC .country \u548C\u666E\u901A path\uFF09\n            d3.select('svg').selectAll('path').each(function() {\n              const path = d3.select(this);\n              const countryName = path.attr('data-country-name');\n              const genre = path.attr('data-genre');\n              const value = path.attr('data-value');\n              const d = path.datum();\n              \n              // \u4ECE data \u5C5E\u6027\u6216 datum \u83B7\u53D6\u56FD\u5BB6\u540D\u79F0\n              let name = countryName;\n              if (!name && d && d.properties) {\n                name = d.properties.name;\n              }\n              \n              if (name) {\n                path\n                  .on(\"mouseenter\", function(event) {\n                    let html = '<div style=\"font-weight:800;margin-bottom:6px;letter-spacing:.3px\">' + name + '</div>';\n                    if (genre && value) {\n                      html += '<div style=\"opacity:.92\">\uD83C\uDFB5 ' + genre + '</div>';\n                      html += '<div style=\"opacity:.92;margin-top:6px\">\uD83D\uDCCA \u5206\u6570: ' + value + '</div>';\n                    } else {\n                      html += '<div style=\"opacity:.92\">\u6682\u65E0\u6570\u636E</div>';\n                    }\n                    tooltip.style(\"opacity\", 1).html(html);\n                  })\n                  .on(\"mousemove\", function(event) {\n                    tooltip\n                      .style(\"left\", (event.pageX + 14) + \"px\")\n                      .style(\"top\", (event.pageY + 14) + \"px\");\n                  })\n                  .on(\"mouseleave\", function() {\n                    tooltip.style(\"opacity\", 0);\n                  });\n              }\n            });\n          })();\n        </script>\n      ";
    } else if (type === 'heatmap') {
      // 热力图：交互统一由主脚本中的 initHeatmapInteractions 处理（避免重复绑定/zoom 抢事件）
      interactionScript = '';
    }

    // ✅ 调试：确认热力图代码是否生成
    console.log('📝 [createNewWindowHTML] 图表类型:', type);
    if (type === 'heatmap') {
      console.log('📝 [createNewWindowHTML] 热力图类型检测:', type);
      console.log('📝 [createNewWindowHTML] heatmapInitCode 长度:', heatmapInitCode ? heatmapInitCode.length : 0);
      console.log('📝 [createNewWindowHTML] heatmapInitCode 是否为空:', !heatmapInitCode || heatmapInitCode.length === 0);
    }
    return "\n<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>".concat(title, " - \u8BE6\u7EC6\u89C6\u56FE</title>\n  <style>\n    * {\n      margin: 0;\n      padding: 0;\n      box-sizing: border-box;\n    }\n    :root{\n      /* \u65B0\u7A97\u53E3\u80CC\u666F\uFF1A\u6BD4\u4E3B\u9875\u9762\u66F4\u6D45\u4E00\u6863\uFF0C\u907F\u514D\u201C\u592A\u9ED1\u201D */\n      --bg: #0b0624;\n      --bg-0: #0b0624;\n      --bg-1: #140a35;\n      --bg-2: #1c0c44;\n      --bg-3: #0b1230;\n      --text: #e2e8f0;\n      --muted: #94a3b8;\n      --accent-violet: #7c3aed;\n      --accent-pink: #ff3bd4;\n      --accent-blue: #32a7ff;\n    }\n    html, body {\n      width: 100%;\n      height: 100%;\n      overflow: hidden;\n      background:\n        radial-gradient(circle at 18% 28%, rgba(255, 59, 212, 0.12) 0%, transparent 54%),\n        radial-gradient(circle at 82% 68%, rgba(50, 167, 255, 0.11) 0%, transparent 56%),\n        linear-gradient(135deg, var(--bg-0) 0%, var(--bg-1) 28%, var(--bg-2) 58%, var(--bg-3) 100%);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n    .svg-container {\n      width: 100%;\n      height: 100%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 20px;\n    }\n    /* \u5730\u56FE\u56FE\u4F8B\uFF1A\u65B0\u7A97\u53E3\u56FA\u5B9A\u5728\u5DE6\u4E0B\u89D2 */\n    .map-legend{\n      position: fixed;\n      left: 20px;\n      bottom: 20px;\n      display: flex;\n      flex-wrap: wrap;\n      gap: 10px 12px;\n      max-width: min(680px, 72vw);\n      padding: 12px 14px;\n      border-radius: 10px;\n      background: rgba(18, 8, 42, 0.86);\n      border: 1px solid rgba(50, 167, 255, 0.28);\n      color: var(--text);\n      backdrop-filter: blur(10px);\n      box-shadow: 0 0 18px rgba(255, 59, 212, 0.16), 0 0 24px rgba(50, 167, 255, 0.12);\n      z-index: 1200;\n      pointer-events: none; /* \u4E0D\u6321\u4F4F\u5730\u56FE hover \u4EA4\u4E92 */\n    }\n    /* \u70ED\u529B\u56FE\u56FE\u4F8B\uFF1A\u65B0\u7A97\u53E3\u56FA\u5B9A\u5728\u5E95\u90E8\uFF08\u4E0E\u4E3B\u9875\u9762\u4E00\u81F4\uFF1A\u7EBF\u6027\u6E10\u53D8\u6761 + \u4E24\u7AEF\u6570\u503C\uFF09 */\n    .heatmap-legend{\n      position: fixed;\n      left: 50%;\n      transform: translateX(-50%);\n      bottom: 20px;\n      width: min(520px, 76vw);\n      padding: 10px 12px;\n      border-radius: 12px;\n      background: rgba(18, 8, 42, 0.70);\n      border: 1px solid rgba(50, 167, 255, 0.26);\n      box-shadow: 0 0 18px rgba(255, 59, 212, 0.12), 0 0 24px rgba(50, 167, 255, 0.10);\n      color: rgba(226, 232, 240, 0.88);\n      backdrop-filter: blur(10px);\n      z-index: 1200;\n      pointer-events: none; /* \u4E0D\u6321\u4F4F\u70ED\u529B\u56FE hover */\n    }\n    /* \u2705 \u5927\u56FE\u9875\u70ED\u529B\u56FE\u56FE\u4F8B\u5185\u90E8\u7ED3\u6784\uFF08\u6765\u81EA\u4E3B\u9875\u9762 innerHTML\uFF09\uFF0C\u9700\u8981\u8865\u9F50 bar/labels \u7684\u6837\u5F0F */\n    .heatmap-legend .legend-title{\n      font-size: 12px;\n      color: rgba(226, 232, 240, 0.78);\n      margin-bottom: 6px;\n      letter-spacing: 0.2px;\n    }\n    .heatmap-legend .legend-bar{\n      height: 10px;\n      border-radius: 999px;\n      border: 1px solid rgba(255,255,255,0.18);\n      box-shadow: 0 0 10px rgba(50,167,255,0.12), 0 0 14px rgba(255,59,212,0.10);\n    }\n    .heatmap-legend .legend-labels{\n      display: flex;\n      justify-content: space-between;\n      margin-top: 6px;\n      font-size: 12px;\n      color: rgba(226, 232, 240, 0.82);\n      font-variant-numeric: tabular-nums;\n    }\n\n    /* \u6811\u56FE\u56FE\u4F8B\uFF1A\u590D\u7528\u4E3B\u9875\u9762\u7684 HTML overlay\uFF08.tree-legend\uFF09\uFF0C\u65B0\u7A97\u53E3\u56FA\u5B9A\u5728\u5DE6\u4E0A\u89D2\uFF08\u907F\u5F00\u6807\u9898\uFF09 */\n    .tree-legend{\n      position: fixed;\n      left: 20px;\n      top: 64px;\n      z-index: 1200;\n      width: min(320px, 40vw);\n      max-width: 92%;\n      background: rgba(2, 6, 23, 0.72);\n      border: 1px solid rgba(88, 101, 242, 0.45);\n      border-radius: 10px;\n      padding: 6px 8px;\n      color: var(--text);\n      box-shadow: 0 0 18px rgba(124, 58, 237, 0.18), inset 0 1px 0 rgba(255,255,255,0.06);\n      backdrop-filter: blur(10px);\n      user-select: none;\n      pointer-events: auto;\n    }\n    .tree-legend > summary{\n      list-style: none;\n      cursor: pointer;\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      padding: 2px 2px;\n      outline: none;\n    }\n    .tree-legend > summary::-webkit-details-marker{ display:none; }\n    .tree-legend-caret{\n      font-size: 12px;\n      font-weight: 900;\n      color: var(--text);\n      line-height: 1;\n    }\n    .tree-legend-body{\n      margin-top: 6px;\n      display: flex;\n      flex-direction: column;\n      gap: 6px;\n      max-height: min(52vh, 420px);\n      overflow: auto;\n      padding-right: 2px;\n    }\n    .tree-legend-item{\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      width: 100%;\n      padding: 6px 8px;\n      border-radius: 9px;\n      border: 1px solid rgba(255,255,255,0.10);\n      background: rgba(255,255,255,0.02);\n      color: var(--text);\n      cursor: pointer;\n      font: 12px/1.1 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif;\n      text-align: left;\n      transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;\n    }\n    .tree-legend-item:hover{\n      background: rgba(255,255,255,0.06);\n      border-color: rgba(50, 167, 255, 0.22);\n      transform: translateY(-1px);\n    }\n    .tree-legend-item:active{ transform: translateY(0); }\n    .tree-legend-item.is-off{ opacity: 0.22; }\n    .tree-legend-swatch{\n      width: 10px;\n      height: 10px;\n      border-radius: 999px;\n      flex: 0 0 auto;\n      box-shadow: 0 0 10px rgba(255,255,255,0.18);\n      border: 1px solid rgba(226,232,240,0.35);\n    }\n    .tree-legend-label{\n      flex: 1;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n      color: var(--text);\n      opacity: 0.95;\n    }\n    .tree-legend-label-empty{ min-height: 1em; }\n    .tree-legend-count{\n      flex: 0 0 auto;\n      color: var(--muted);\n      font-variant-numeric: tabular-nums;\n      opacity: 0.9;\n    }\n    /* \u70ED\u529B\u56FE\uFF1A\u53EA\u4FDD\u7559\u539F\u56FE\u6CE8\u91CA\uFF08\u4E0D\u989D\u5916\u52A0 3D/2D \u5FBD\u6807\uFF0C\u907F\u514D\u201C\u5957\u5A03\u201D\uFF09 */\n    .hm-anno{\n      position: fixed;\n      left: 20px;\n      top: 20px; /* \u2705 \u65B0\u7A97\u53E3\u4E5F\u6539\u4E3A\u3010\u5DE6\u4E0A\u89D2\u3011\uFF0C\u4FDD\u6301\u4E00\u81F4\uFF0C\u4E14\u907F\u5F00\u5E95\u90E8\u56FE\u4F8B */\n      width: min(340px, 46vw);\n      border-radius: 12px;\n      background: rgba(10, 5, 20, 0.85); /* \u66F4\u9ED1\u7684\u80CC\u666F */\n      border: 1px solid rgba(124, 58, 237, 0.3);\n      box-shadow: 0 4px 16px rgba(0,0,0,0.4);\n      color: rgba(226,232,240,0.9);\n      backdrop-filter: blur(8px);\n      z-index: 1200;\n      overflow: hidden;\n      pointer-events: auto; /* \u5141\u8BB8\u6298\u53E0/\u5C55\u5F00 */\n    }\n    .hm-anno > summary{\n      list-style: none;\n      cursor: pointer;\n      padding: 6px 8px;\n      font: 11px/1.1 system-ui,-apple-system,\"Segoe UI\",\"Microsoft YaHei\",sans-serif;\n      font-weight: 700;\n      letter-spacing: .5px;\n      user-select: none;\n      color: #fff;\n    }\n    .hm-anno > summary::-webkit-details-marker{ display:none; }\n    .hm-anno .hm-anno-body{\n      padding: 0 8px 8px 8px;\n      font: 10px/1.45 system-ui,-apple-system,\"Segoe UI\",\"Microsoft YaHei\",sans-serif;\n      color: rgba(226,232,240,0.85);\n    }\n    .hm-anno .hm-anno-body div {\n      margin-bottom: 2px;\n    }\n    .hm-anno .hm-anno-body b{\n      color: rgba(226,232,240,0.92);\n      font-weight: 700;\n    }\n    .map-legend .legend-item{\n      display:flex;\n      align-items:center;\n      gap:8px;\n      white-space:nowrap;\n      font-size:12px;\n      color: var(--text);\n    }\n    .map-legend .legend-color{\n      width:14px;\n      height:14px;\n      border-radius:3px;\n      border:1px solid rgba(255,255,255,0.2);\n      box-shadow: 0 0 4px rgba(0,0,0,0.35);\n      display:inline-block;\n    }\n    .map-legend .legend-text{\n      color: var(--text);\n      font-weight: 500;\n      text-shadow: 0 1px 2px rgba(0,0,0,0.5);\n    }\n    svg {\n      max-width: 100%;\n      max-height: 100%;\n      background: transparent;\n    }\n    .close-btn {\n      position: fixed;\n      top: 20px;\n      right: 20px;\n      background: rgba(18, 8, 42, 0.82);\n      color: var(--text);\n      border: 1px solid rgba(50, 167, 255, 0.32);\n      padding: 8px 16px;\n      border-radius: 4px;\n      cursor: pointer;\n      font-size: 14px;\n      z-index: 1000;\n      transition: all 0.3s ease;\n    }\n    .close-btn:hover {\n      background: rgba(255, 59, 212, 0.14);\n      border-color: rgba(255, 59, 212, 0.42);\n    }\n    .title {\n      position: fixed;\n      top: 20px;\n      left: 20px;\n      color: var(--text);\n      font-size: 18px;\n      font-weight: 600;\n      z-index: 1000;\n      text-shadow: 0 0 12px rgba(255, 59, 212, 0.25), 0 0 22px rgba(50, 167, 255, 0.18);\n    }\n    .tooltip, .map-tooltip, .tree-tooltip, .bubble-tooltip, .heatmap-tooltip {\n      position: fixed;\n      background: rgba(18, 8, 42, 0.92) !important;\n      color: var(--text) !important;\n      box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255, 59, 212, 0.18), 0 0 26px rgba(50, 167, 255, 0.12);\n      border: 1px solid rgba(50, 167, 255, 0.32);\n      padding: 6px 10px; \n      border-radius: 4px; \n      pointer-events: none;\n      font-size: 13px;\n      z-index: 1000;\n      backdrop-filter: blur(10px);\n    }\n  </style>\n</head>\n<body>\n  <div class=\"title\">").concat(title, "</div>\n  <button class=\"close-btn\" onclick=\"window.close()\">\u5173\u95ED\u7A97\u53E3</button>\n  <div class=\"svg-container\" id=\"svg-container-main\">\n    ").concat(svgString, "\n  </div>\n  ").concat(type === 'tree' && treeLegendHTML ? "".concat(treeLegendHTML) : "", "\n  ").concat(type === 'map' && mapLegendHTML ? "<div class=\"map-legend\" id=\"map-legend\">".concat(mapLegendHTML, "</div>") : "", "\n  ").concat(type === 'heatmap' && heatmapLegendHTML ? "<div class=\"heatmap-legend\" id=\"heatmap-legend\">".concat(heatmapLegendHTML, "</div>") : "", "\n  ").concat(type === 'heatmap' ? "\n    <details class=\"hm-anno\" id=\"hm-anno\" open>\n      <summary>\u6CE8\u91CA\uFF08\u70B9\u51FB\u9690\u85CF\uFF09</summary>\n      <div class=\"hm-anno-body\">\n        <div>\u70ED\u529B\u56FE\uFF1A\u4E16\u754C\u8303\u56F4\u97F3\u4E50\u70ED\u5EA6\u53D8\u5316</div>\n        <div>\u6298\u7EBF\u56FE\uFF1A\u56FD\u5185\u7F51\u53CB\u542C\u97F3\u4E50\u7684\u66F2\u76EE\u6570\u91CF\u53D8\u5316</div>\n      </div>\n    </details>\n  " : "", "\n\n  ").concat(d3LocalUrl ? "<script src=\"".concat(d3LocalUrl, "\"></script>") : "", "\n  ").concat(!d3LocalUrl ? "<script src=\"https://d3js.org/d3.v7.min.js\"></script>" : "", "\n  <script>\n    // \u2705 \u786E\u4FDD D3 \u52A0\u8F7D\u5B8C\u6210\u540E\u518D\u6267\u884C\u4EA4\u4E92\u811A\u672C\n    (function() {\n      function waitForD3(callback, maxAttempts = 50) {\n        if (typeof d3 !== 'undefined') {\n          callback();\n        } else if (maxAttempts > 0) {\n          setTimeout(() => waitForD3(callback, maxAttempts - 1), 100);\n        } else {\n          console.error('\u274C D3 \u52A0\u8F7D\u8D85\u65F6');\n        }\n      }\n      \n      waitForD3(function() {\n        console.log('\u2705 D3 \u5DF2\u52A0\u8F7D\uFF0C\u5F00\u59CB\u521D\u59CB\u5316\u4EA4\u4E92...');\n        \n        // \u652F\u6301 ESC \u952E\u5173\u95ED\n        document.addEventListener('keydown', function(e) {\n          if (e.key === 'Escape') {\n            window.close();\n          }\n        });\n        \n        // \u786E\u4FDD SVG \u5143\u7D20\u88AB\u6B63\u786E\u8BC6\u522B\uFF08\u4E0D\u662F\u56FE\u7247\uFF09\n        (function ensureSvgIsInteractive() {\n          // \u2705 \u521B\u5EFA\u72EC\u7ACB\u7684\u70ED\u529B\u56FE\u521D\u59CB\u5316\u51FD\u6570\n          function initHeatmapInteractions(svg) {\n            console.log('\uD83D\uDD25 \u5F00\u59CB\u521D\u59CB\u5316\u70ED\u529B\u56FE\u4EA4\u4E92...');\n            if (!svg || typeof d3 === 'undefined') {\n              console.warn('\u26A0\uFE0F SVG \u6216 D3 \u672A\u627E\u5230\uFF0C\u65E0\u6CD5\u521D\u59CB\u5316\u70ED\u529B\u56FE\u4EA4\u4E92');\n              return;\n            }\n            \n            const svgD3 = d3.select(svg);\n            \n            // \u2705 \u68C0\u6D4B\u662F2D\u8FD8\u662F3D\u70ED\u529B\u56FE\n            const cellGroups = svgD3.selectAll('g[class*=\"cell-group\"]');\n            const cells = svgD3.selectAll('rect.cell');\n            const is3DHeatmap = cellGroups.size() > 0;\n            const is2DHeatmap = cells.size() > 0 && cellGroups.size() === 0;\n\n            // \u2705 \u539F\u56FE\u4E0D\u9700\u8981\u5728\u5927\u56FE\u9875\u989D\u5916\u663E\u793A 2D/3D \u5FBD\u6807\uFF1A\u8FD9\u91CC\u4E0D\u518D\u6CE8\u5165/\u66F4\u65B0\u5FBD\u6807\n            \n            console.log('\uD83D\uDCCA \u70ED\u529B\u56FE\u7C7B\u578B\u68C0\u6D4B:', {\n              '3D\u70ED\u529B\u56FE': is3DHeatmap,\n              '2D\u70ED\u529B\u56FE': is2DHeatmap,\n              'cell-group\u6570\u91CF': cellGroups.size(),\n              'rect.cell\u6570\u91CF': cells.size()\n            });\n            \n            // \u521B\u5EFA tooltip\n            let tooltip = d3.select(\"body\").select(\".heatmap-tooltip\");\n            if (tooltip.empty()) {\n              tooltip = d3.select(\"body\").append(\"div\")\n                .attr(\"class\", \"heatmap-tooltip\")\n                .style(\"position\", \"fixed\")\n                .style(\"pointer-events\", \"none\")\n                .style(\"opacity\", 0)\n                .style(\"padding\", \"10px 12px\")\n                .style(\"border-radius\", \"12px\")\n                .style(\"background\", \"rgba(30, 41, 59, 0.92)\")\n                .style(\"color\", \"#fff\")\n                .style(\"font\", \"13px/1.35 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif\")\n                .style(\"box-shadow\", \"0 10px 24px rgba(0,0,0,0.16)\")\n                .style(\"z-index\", 10000)\n                .style(\"backdrop-filter\", \"blur(6px)\")\n                .style(\"border\", \"1px solid rgba(88, 101, 242, 0.5)\");\n            }\n            \n            // \u2705 \u53EA\u4E3A3D\u70ED\u529B\u56FE\u7ED1\u5B9A3D\u5355\u5143\u683C\u4E8B\u4EF6\n            if (is3DHeatmap) {\n              // \u4E3A\u6240\u6709 path \u5143\u7D20\u7ED1\u5B9A\u4E8B\u4EF6\uFF083D\u70ED\u529B\u56FE\uFF09\n              const cellGroupPaths = svgD3.selectAll('g[class*=\"cell-group\"] path');\n              console.log('\uD83D\uDD0D \u627E\u5230 ' + cellGroupPaths.size() + ' \u4E2A cell-group path \u5143\u7D20');\n            \n            cellGroupPaths.each(function() {\n              const path = d3.select(this);\n              const genre = path.attr('data-genre') || path.node().parentElement?.getAttribute('data-genre');\n              const month = path.attr('data-month') || path.node().parentElement?.getAttribute('data-month');\n              const value = path.attr('data-value') || path.node().parentElement?.getAttribute('data-value') || '0';\n              \n              if (genre && month) {\n                const pathNode = path.node();\n                pathNode.style.pointerEvents = 'auto';\n                pathNode.style.cursor = 'pointer';\n                \n                path\n                  .on(\"mouseover\", function(event) {\n                    d3.select(this.parentNode).selectAll(\"path\")\n                      .attr(\"opacity\", 1)\n                      .attr(\"stroke-width\", 1.5);\n                    \n                    // \u83B7\u53D6\u66F2\u76EE\u6570\u91CF\n                    const trackCount = path.attr('data-track-count') || Math.round(parseFloat(value));\n                    \n                  tooltip\n                    .style(\"opacity\", 0.95)\n                    .html('<b>' + genre + '</b><br/>' + month + '<br/>\u5206\u503C: ' + parseFloat(value).toFixed(2) + '<br/>\u66F2\u76EE\u6570\u91CF: ' + trackCount);\n                  // fixed tooltip: use clientX/Y to avoid scaling/scroll offset\n                  const cx = (event && typeof event.clientX === \"number\") ? event.clientX : (event && typeof event.pageX === \"number\" ? event.pageX : 0);\n                  const cy = (event && typeof event.clientY === \"number\") ? event.clientY : (event && typeof event.pageY === \"number\" ? event.pageY : 0);\n                  const node = tooltip.node();\n                  const w = node ? (node.offsetWidth || 0) : 0;\n                  const h = node ? (node.offsetHeight || 0) : 0;\n                  const pad = 10;\n                  let x = cx + 12;\n                  let y = cy - 18;\n                  x = Math.max(pad, Math.min(x, (window.innerWidth || 0) - w - pad));\n                  y = Math.max(pad, Math.min(y, (window.innerHeight || 0) - h - pad));\n                  tooltip.style(\"left\", x + \"px\").style(\"top\", y + \"px\");\n                  })\n                  .on(\"mouseout\", function() {\n                    d3.select(this.parentNode).selectAll(\"path\")\n                      .attr(\"opacity\", 0.9)\n                      .attr(\"stroke-width\", 0.5);\n                    tooltip.style(\"opacity\", 0);\n                  });\n              }\n            });\n            \n            }\n            \n            // \u2705 \u53EA\u4E3A2D\u70ED\u529B\u56FE\u7ED1\u5B9A2D\u5355\u5143\u683C\u4E8B\u4EF6\n            if (is2DHeatmap) {\n              console.log('\uD83D\uDD0D \u627E\u5230 ' + cells.size() + ' \u4E2A rect.cell \u5143\u7D20');\n              \n              cells.each(function() {\n              const cell = d3.select(this);\n              const genre = cell.attr('data-genre');\n              const month = cell.attr('data-month');\n              const value = cell.attr('data-value');\n              \n              if (genre && month) {\n                const cellNode = cell.node();\n                cellNode.style.pointerEvents = 'auto';\n                cellNode.style.cursor = 'pointer';\n                \n                cell\n                  .on(\"mousemove\", function(event) {\n                    tooltip\n                      .style(\"opacity\", 1)\n                      .html('<b>' + genre + '</b><br/>' + month + '<br/>Value: ' + value);\n                    const cx = (event && typeof event.clientX === \"number\") ? event.clientX : (event && typeof event.pageX === \"number\" ? event.pageX : 0);\n                    const cy = (event && typeof event.clientY === \"number\") ? event.clientY : (event && typeof event.pageY === \"number\" ? event.pageY : 0);\n                    const node = tooltip.node();\n                    const w = node ? (node.offsetWidth || 0) : 0;\n                    const h = node ? (node.offsetHeight || 0) : 0;\n                    const pad = 10;\n                    let x = cx + 12;\n                    let y = cy - 18;\n                    x = Math.max(pad, Math.min(x, (window.innerWidth || 0) - w - pad));\n                    y = Math.max(pad, Math.min(y, (window.innerHeight || 0) - h - pad));\n                    tooltip.style(\"left\", x + \"px\").style(\"top\", y + \"px\");\n                  })\n                  .on(\"mouseout\", function() {\n                    tooltip.style(\"opacity\", 0);\n                  });\n              }\n            });\n            \n            // \u2705 \u4E3A\u6298\u7EBF\u56FE\u7ED1\u5B9A\u4E8B\u4EF6\uFF08line-path \u548C area-path\uFF09\n            const linePaths = svgD3.selectAll('path.line-path, path.area-path');\n            console.log('\uD83D\uDD0D \u627E\u5230 ' + linePaths.size() + ' \u4E2A\u6298\u7EBF\u56FE path \u5143\u7D20');\n            \n            linePaths.each(function() {\n              const path = d3.select(this);\n              const month = path.attr('data-month');\n              const lineValuesStr = path.attr('data-line-values');\n              \n              if (month) {\n                try {\n                  const pathNode = path.node();\n                  if (!pathNode) return;\n                  \n                  pathNode.style.pointerEvents = 'auto';\n                  pathNode.style.cursor = 'pointer';\n                  \n                  let lineValues = null;\n                  if (lineValuesStr) {\n                    try {\n                      lineValues = JSON.parse(lineValuesStr);\n                    } catch(e) {\n                      console.warn('\u65E0\u6CD5\u89E3\u6790\u6298\u7EBF\u6570\u636E JSON:', e);\n                    }\n                  }\n                  \n                  // \u7B80\u5316\u7248\u672C\uFF1A\u5982\u679C\u9F20\u6807\u5728\u8DEF\u5F84\u4E0A\uFF0C\u663E\u793A\u6708\u4EFD\u4FE1\u606F\n                  path\n                    .on(\"mouseover\", function(event) {\n                      let tooltipHtml = '<b>\u6298\u7EBF\u56FE</b><br/>' + month;\n                      \n                      // \u5982\u679C\u6709\u6570\u636E\uFF0C\u663E\u793A\u5E73\u5747\u503C\u548C\u5E73\u5747\u66F2\u76EE\u6570\u91CF\n                      if (lineValues && lineValues.length > 0) {\n                        const avgValue = lineValues.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0) / lineValues.length;\n                        const avgTrackCount = Math.round(avgValue);\n                        tooltipHtml += '<br/>\u5E73\u5747\u5206\u503C: ' + avgValue.toFixed(2) + '<br/>\u5E73\u5747\u66F2\u76EE\u6570\u91CF: ' + avgTrackCount;\n                      }\n                      \n                      tooltip\n                        .style(\"opacity\", 0.95)\n                        .html(tooltipHtml);\n                      const cx = (event && typeof event.clientX === \"number\") ? event.clientX : (event && typeof event.pageX === \"number\" ? event.pageX : 0);\n                      const cy = (event && typeof event.clientY === \"number\") ? event.clientY : (event && typeof event.pageY === \"number\" ? event.pageY : 0);\n                      const node = tooltip.node();\n                      const w = node ? (node.offsetWidth || 0) : 0;\n                      const h = node ? (node.offsetHeight || 0) : 0;\n                      const pad = 10;\n                      let x = cx + 12;\n                      let y = cy - 18;\n                      x = Math.max(pad, Math.min(x, (window.innerWidth || 0) - w - pad));\n                      y = Math.max(pad, Math.min(y, (window.innerHeight || 0) - h - pad));\n                      tooltip.style(\"left\", x + \"px\").style(\"top\", y + \"px\");\n                    })\n                    .on(\"mousemove\", function(event) {\n                      // \u66F4\u65B0 tooltip \u4F4D\u7F6E\uFF08fixed + clientX/Y\uFF09\n                      const cx = (event && typeof event.clientX === \"number\") ? event.clientX : (event && typeof event.pageX === \"number\" ? event.pageX : 0);\n                      const cy = (event && typeof event.clientY === \"number\") ? event.clientY : (event && typeof event.pageY === \"number\" ? event.pageY : 0);\n                      const node = tooltip.node();\n                      const w = node ? (node.offsetWidth || 0) : 0;\n                      const h = node ? (node.offsetHeight || 0) : 0;\n                      const pad = 10;\n                      let x = cx + 12;\n                      let y = cy - 18;\n                      x = Math.max(pad, Math.min(x, (window.innerWidth || 0) - w - pad));\n                      y = Math.max(pad, Math.min(y, (window.innerHeight || 0) - h - pad));\n                      tooltip.style(\"left\", x + \"px\").style(\"top\", y + \"px\");\n                    })\n                    .on(\"mouseout\", function() {\n                      tooltip.style(\"opacity\", 0);\n                    });\n                } catch(e) {\n                  console.warn('\u6298\u7EBF\u56FE\u4E8B\u4EF6\u7ED1\u5B9A\u51FA\u9519:', e);\n                }\n              }\n            });\n            \n            }\n            \n            // \u2705 \u53EA\u4E3A3D\u70ED\u529B\u56FE\u6DFB\u52A03D\u6295\u5F71\u65CB\u8F6C\u529F\u80FD\uFF08\u5B8C\u5168\u6309\u7167\u539F\u59CB\u4EE3\u7801\u91CD\u5199\uFF09\n            if (is3DHeatmap) {\n              const g = svgD3.select('g');\n              if (!g.empty()) {\n              // \u5750\u6807\u8F74/\u6807\u7B7E\u4E0D\u8981\u5403\u6389 hover\uFF08\u5426\u5219\u6298\u7EBF hover \u5F88\u96BE\u89E6\u53D1\uFF09\n              g.selectAll('.axis-line, .axis-arrow, .axis-label').style('pointer-events', 'none');\n              // 3D\u6295\u5F71\u53C2\u6570\n              const cellWidth = 50;\n              const cellDepth = 25;\n              const maxHeight = 120;\n              const cellThickness = 6;\n              const allGenres = [\"ACG\", \"classical\", \"electronic\", \"folk\", \"jazz\", \"pop\", \"rap\", \"rock\"];\n              const months = ['2023-12', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',\n                '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',\n                '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',\n                '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];\n              const numGenres = allGenres.length;\n              const numMonths = months.length;\n              const totalWidth = numGenres * cellWidth;\n              const totalDepth = numMonths * cellDepth;\n              \n              // \u65CB\u8F6C\u89D2\u5EA6\uFF08\u5168\u5C40\u53D8\u91CF\uFF0C\u652F\u6301\u9F20\u6807\u62D6\u52A8\u65CB\u8F6C\uFF09\n              let rotationAngle = Math.PI / 6; // \u9ED8\u8BA430\u5EA6\n              \n              // \u7B49\u8F74\u6D4B\u6295\u5F71\u51FD\u6570\uFF08\u652F\u6301\u65CB\u8F6C\uFF09\n              function isometricProjection(x, y, z) {\n                // \u7B49\u8F74\u6D4B\u6295\u5F71\uFF1Ax\u8F74\u5411\u53F3\uFF0Cy\u8F74\u5411\u524D\uFF08\u6DF1\u5EA6\uFF09\uFF0Cz\u8F74\u5411\u4E0A\n                // \u652F\u6301\u6C34\u5E73\u65CB\u8F6C\uFF08\u7ED5Z\u8F74\uFF09\n                const angle = Math.PI / 6; // \u57FA\u7840\u7B49\u8F74\u6D4B\u89D2\u5EA630\u5EA6\n                const scale = 1.2; // \u7A0D\u5FAE\u653E\u5927\u4E00\u70B9\uFF0C\u8BA93D\u6548\u679C\u66F4\u660E\u663E\n                \n                // \u5E94\u7528\u6C34\u5E73\u65CB\u8F6C\n                const cosR = Math.cos(rotationAngle);\n                const sinR = Math.sin(rotationAngle);\n                const rotatedX = x * cosR - y * sinR;\n                const rotatedY = x * sinR + y * cosR;\n                \n                // \u7B49\u8F74\u6D4B\u6295\u5F71\n                const isoX = (rotatedX - rotatedY) * Math.cos(angle) * scale;\n                const isoY = (rotatedX + rotatedY) * Math.sin(angle) * scale - z * scale;\n                return { x: isoX, y: isoY };\n              }\n              \n              // \u2705 \u4ECESVG\u4E2D\u63D0\u53D6\u5355\u5143\u683C\u6570\u636E\n              const cellDataArray = [];\n              const cellGroups = g.selectAll('g[class*=\"cell-group\"]');\n              \n              console.log('\uD83D\uDD0D \u627E\u5230 ' + cellGroups.size() + ' \u4E2A cell-group \u5143\u7D20');\n              \n              // \u5982\u679C\u627E\u4E0D\u5230\uFF0C\u5C1D\u8BD5\u5176\u4ED6\u9009\u62E9\u5668\n              let actualGroups = cellGroups;\n              if (cellGroups.size() === 0) {\n                actualGroups = g.selectAll('g').filter(function() {\n                  const group = d3.select(this);\n                  const classAttr = group.attr('class') || '';\n                  return classAttr.includes('cell-group') || classAttr.match(/cell-d+-d+/);\n                });\n                console.log('\uD83D\uDD0D \u4F7F\u7528\u5907\u7528\u9009\u62E9\u5668\u627E\u5230 ' + actualGroups.size() + ' \u4E2A\u5143\u7D20');\n              }\n              \n              actualGroups.each(function() {\n                const group = d3.select(this);\n                const classAttr = group.attr('class') || '';\n                const monthIdxAttr = group.attr('data-month-idx');\n                const genreIdxAttr = group.attr('data-genre-idx');\n                \n                let monthIdx = null;\n                let genreIdx = null;\n                \n                // \u4F18\u5148\u4ECEdata\u5C5E\u6027\u83B7\u53D6\n                if (monthIdxAttr !== null && genreIdxAttr !== null) {\n                  monthIdx = parseInt(monthIdxAttr);\n                  genreIdx = parseInt(genreIdxAttr);\n                } else {\n                  // \u4ECEclass\u4E2D\u63D0\u53D6\n                  const match = classAttr.match(/cell-(d+)-(d+)/);\n                  if (match) {\n                    monthIdx = parseInt(match[1]);\n                    genreIdx = parseInt(match[2]);\n                  }\n                }\n                \n                if (monthIdx !== null && genreIdx !== null && !isNaN(monthIdx) && !isNaN(genreIdx)) {\n                  const value = parseFloat(group.attr('data-value') || '0');\n                  \n                  // \u8BA1\u7B973D\u5750\u6807\n                  const x = genreIdx * cellWidth;\n                  const y = monthIdx * cellDepth;\n                  const zBottom = 0;\n                  const zTop = cellThickness;\n                  \n                  // \u83B7\u53D6\u989C\u8272\uFF08\u4ECE\u7B2C\u4E00\u4E2Apath\u5143\u7D20\uFF09\n                  const firstPath = group.select('path').node();\n                  const fillColor = firstPath ? firstPath.getAttribute('fill') : '#ccc';\n                  \n                  cellDataArray.push({\n                    monthIdx: monthIdx,\n                    genreIdx: genreIdx,\n                    x: x,\n                    y: y,\n                    zBottom: zBottom,\n                    zTop: zTop,\n                    value: value,\n                    fillColor: fillColor,\n                    group: group\n                  });\n                } else {\n                  // \u8C03\u8BD5\uFF1A\u8F93\u51FA\u524D\u51E0\u4E2A\u65E0\u6CD5\u5339\u914D\u7684\u5143\u7D20\n                  if (cellDataArray.length < 3) {\n                    console.warn('\u26A0\uFE0F \u65E0\u6CD5\u63D0\u53D6\u6570\u636E - class:', classAttr, 'data-month-idx:', monthIdxAttr, 'data-genre-idx:', genreIdxAttr);\n                  }\n                }\n              });\n              \n              console.log('\uD83D\uDCCA \u63D0\u53D6\u4E86 ' + cellDataArray.length + ' \u4E2A\u5355\u5143\u683C\u76843D\u6570\u636E');\n              \n              if (cellDataArray.length === 0) {\n                console.error('\u274C \u672A\u80FD\u63D0\u53D6\u4EFB\u4F55\u5355\u5143\u683C\u6570\u636E\uFF01\u8BF7\u68C0\u67E5\u6570\u636E\u5C5E\u6027\u662F\u5426\u6B63\u786E\u5B58\u50A8\u3002');\n              }\n              \n              // \u2705 \u4ECESVG\u4E2D\u63D0\u53D6\u6298\u7EBF\u56FE\u6570\u636E\n              const lineDataArray = [];\n              const linePaths = g.selectAll('path.line-path');\n              \n              linePaths.each(function() {\n                const path = d3.select(this);\n                const monthIdxStr = path.attr('data-month-idx');\n                const lineValuesStr = path.attr('data-line-values');\n                \n                if (monthIdxStr !== null && lineValuesStr) {\n                  try {\n                    const monthIdx = parseInt(monthIdxStr);\n                    const lineValues = JSON.parse(lineValuesStr);\n                    const monthY = monthIdx * cellDepth + cellDepth / 2;\n                    \n                    // \u91CD\u5EFA\u6298\u7EBF\u76843D\u5750\u6807\u6570\u636E\n                    const lineData = [];\n                    let minLineHeight = Infinity;\n                    let maxLineHeight = -Infinity;\n                    \n                    // \u5148\u627E\u5230\u6700\u5C0F\u548C\u6700\u5927\u503C\n                    lineValues.forEach(function(d) {\n                      const val = parseFloat(d.value || 0);\n                      if (val < minLineHeight) minLineHeight = val;\n                      if (val > maxLineHeight) maxLineHeight = val;\n                    });\n                    \n                    if (minLineHeight === Infinity) minLineHeight = 0;\n                    if (maxLineHeight === 0) maxLineHeight = 1;\n                    const lineHeightRange = maxLineHeight - minLineHeight || 1;\n                    const maxLineZ = maxHeight * 1.2;\n                    \n                    // \u91CD\u5EFA\u6BCF\u4E2A\u6570\u636E\u70B9\n                    lineValues.forEach(function(d, genreIdx) {\n                      const value = parseFloat(d.value || 0);\n                      const normalizedValue = lineHeightRange > 0 ? (value - minLineHeight) / lineHeightRange : 0;\n                      const z = cellThickness + (isNaN(normalizedValue) ? 0 : normalizedValue) * maxLineZ;\n                      const genreX = genreIdx * cellWidth + cellWidth / 2;\n                      \n                      if (!isNaN(genreX) && !isNaN(monthY) && !isNaN(z)) {\n                        lineData.push({\n                          x: genreX,\n                          y: monthY,\n                          z: z,\n                          value: value,\n                          monthIdx: monthIdx,\n                          genreIdx: genreIdx\n                        });\n                      }\n                    });\n                    \n                    if (lineData.length > 0) {\n                      lineDataArray.push({\n                        monthIdx: monthIdx,\n                        lineData: lineData,\n                        linePath: path,\n                        areaPath: g.select('.area-path.area-' + monthIdx)\n                      });\n                    }\n                  } catch(e) {\n                    console.warn('\u65E0\u6CD5\u89E3\u6790\u6298\u7EBF\u6570\u636E:', e);\n                  }\n                }\n              });\n              \n              console.log('\uD83D\uDCCA \u63D0\u53D6\u4E86 ' + lineDataArray.length + ' \u6761\u6298\u7EBF\u76843D\u6570\u636E');\n              \n              // \u5750\u6807\u8F74\u76F8\u5173\u53D8\u91CF\uFF08\u4E0E\u539F\u59CB\u4EE3\u7801\u4E00\u81F4\uFF09\n              const axisOffset = 8;\n              const labelOffset = 40;\n              let origin = isometricProjection(-axisOffset, -axisOffset, 0);\n              let xAxisEnd = isometricProjection(totalWidth + axisOffset, -axisOffset, 0);\n              let yAxisEnd = isometricProjection(-axisOffset, totalDepth + axisOffset, 0);\n              let zAxisEnd = isometricProjection(-axisOffset, -axisOffset, maxHeight + axisOffset);\n              let zLabelPos = isometricProjection(-10, 0, maxHeight + 25);\n              \n              // \u2705 \u66F4\u65B0\u6295\u5F71\u51FD\u6570\uFF08\u91CD\u65B0\u8BA1\u7B97\u6240\u6709\u5143\u7D20\u7684\u4F4D\u7F6E\uFF09\n              function updateProjection() {\n                // \u91CD\u65B0\u8BA1\u7B97\u8FB9\u754C\n                const corners = [\n                  isometricProjection(0, 0, 0),\n                  isometricProjection(totalWidth, 0, 0),\n                  isometricProjection(0, totalDepth, 0),\n                  isometricProjection(totalWidth, totalDepth, 0),\n                  isometricProjection(0, 0, maxHeight),\n                  isometricProjection(totalWidth, 0, maxHeight)\n                ];\n                \n                const minX = d3.min(corners, d => d.x);\n                const maxX = d3.max(corners, d => d.x);\n                const minY = d3.min(corners, d => d.y);\n                const maxY = d3.max(corners, d => d.y);\n                \n                const projectedWidth = maxX - minX;\n                const projectedHeight = maxY - minY;\n                \n                // \u66F4\u65B0 viewBox\n                const padding = 50;\n                const viewBoxMinX = minX - padding;\n                const viewBoxMinY = minY - padding;\n                const viewBoxWidth = projectedWidth + padding * 2;\n                const viewBoxHeight = projectedHeight + padding * 2;\n                \n                svgD3.attr(\"viewBox\", viewBoxMinX + ' ' + viewBoxMinY + ' ' + viewBoxWidth + ' ' + viewBoxHeight);\n                \n                // \u66F4\u65B0\u6240\u6709\u5355\u5143\u683C\n                cellDataArray.forEach(cellData => {\n                  const { x, y, zBottom, zTop, monthIdx, genreIdx } = cellData;\n                  \n                  // \u91CD\u65B0\u8BA1\u7B978\u4E2A\u9876\u70B9\n                  const bottom1 = isometricProjection(x, y, zBottom);\n                  const bottom2 = isometricProjection(x + cellWidth, y, zBottom);\n                  const bottom3 = isometricProjection(x + cellWidth, y + cellDepth, zBottom);\n                  const bottom4 = isometricProjection(x, y + cellDepth, zBottom);\n                  const top1 = isometricProjection(x, y, zTop);\n                  const top2 = isometricProjection(x + cellWidth, y, zTop);\n                  const top3 = isometricProjection(x + cellWidth, y + cellDepth, zTop);\n                  const top4 = isometricProjection(x, y + cellDepth, zTop);\n                  \n                  // \u66F4\u65B0\u5355\u5143\u683C\u7EC4\u7684\u6240\u6709\u9762\n                  const cellGroup = g.select('.cell-' + monthIdx + '-' + genreIdx);\n                  if (!cellGroup.empty()) {\n                    const paths = cellGroup.selectAll(\"path\");\n                    const faces = [\n                      [bottom1, bottom2, bottom3, bottom4], // \u5E95\u9762\n                      [bottom2, top2, top3, bottom3], // \u53F3\u4FA7\u9762\n                      [bottom4, bottom3, top3, top4], // \u80CC\u9762\n                      [top1, top2, top3, top4] // \u9876\u9762\n                    ];\n                    \n                    paths.each(function(d, i) {\n                      if (i < faces.length) {\n                        const path = d3.path();\n                        path.moveTo(faces[i][0].x, faces[i][0].y);\n                        for (let j = 1; j < faces[i].length; j++) {\n                          path.lineTo(faces[i][j].x, faces[i][j].y);\n                        }\n                        path.closePath();\n                        d3.select(this).attr(\"d\", path.toString());\n                      }\n                    });\n                  }\n                });\n                \n                // \u66F4\u65B0\u6240\u6709\u6298\u7EBF\n                lineDataArray.forEach(({ monthIdx, lineData, darkerLineColor }) => {\n                  // \u91CD\u65B0\u751F\u6210\u6298\u7EBF\u8DEF\u5F84\uFF08\u4F7F\u7528\u4E0E\u521D\u59CB\u5316\u65F6\u76F8\u540C\u7684lineGenerator\u903B\u8F91\uFF09\n                  // \u6CE8\u610F\uFF1A\u9700\u8981\u6309\u7167\u6295\u5F71\u540E\u7684X\u5750\u6807\u6392\u5E8F\uFF0C\u786E\u4FDD\u66F2\u7EBF\u65B9\u5411\u6B63\u786E\n                  const sortedLineData = [...lineData].sort((a, b) => {\n                    const projA = isometricProjection(a.x, a.y, a.z);\n                    const projB = isometricProjection(b.x, b.y, b.z);\n                    return projA.x - projB.x;\n                  });\n                  \n                  const lineGeneratorUpdate = d3.line()\n                    .curve(d3.curveMonotoneX)\n                    .x(function(d) {\n                      const projected = isometricProjection(d.x, d.y, d.z);\n                      return projected.x;\n                    })\n                    .y(function(d) {\n                      const projected = isometricProjection(d.x, d.y, d.z);\n                      return projected.y;\n                    });\n                  \n                  // \u66F4\u65B0\u6298\u7EBF\uFF08\u4F7F\u7528\u6B63\u786E\u7684\u9009\u62E9\u5668\uFF0Cclass\u662F \"line-path line-monthIdx\"\uFF09\n                  const lineElement = g.select(\".line-path.line-\" + monthIdx);\n                  if (!lineElement.empty()) {\n                    const newPath = lineGeneratorUpdate(sortedLineData);\n                    if (newPath && !newPath.includes('NaN')) {\n                      lineElement.attr(\"d\", newPath);\n                    }\n                  }\n                  \n                  // \u66F4\u65B0\u9762\u79EF\u586B\u5145\uFF08\u91CD\u65B0\u521B\u5EFAareaGenerator\uFF0C\u56E0\u4E3A\u6295\u5F71\u51FD\u6570\u5DF2\u66F4\u65B0\uFF09\n                  // \u4F7F\u7528\u6392\u5E8F\u540E\u7684\u6570\u636E\uFF0C\u786E\u4FDD\u4E0E\u6298\u7EBF\u4E00\u81F4\n                  const areaGeneratorUpdate = d3.area()\n                    .curve(d3.curveMonotoneX)\n                    .x(function(d) {\n                      const projected = isometricProjection(d.x, d.y, d.z);\n                      return projected.x;\n                    })\n                    .y0(function(d) {\n                      const projected = isometricProjection(d.x, d.y, cellThickness);\n                      return projected.y;\n                    })\n                    .y1(function(d) {\n                      const projected = isometricProjection(d.x, d.y, d.z);\n                      return projected.y;\n                    });\n                  \n                  const areaElement = g.select(\".area-\" + monthIdx);\n                  if (!areaElement.empty()) {\n                    areaElement.attr(\"d\", areaGeneratorUpdate(sortedLineData));\n                  }\n                  \n                  // \u66F4\u65B0\u6700\u9AD8\u70B9\u6807\u8BB0\n                  let maxZ = -Infinity;\n                  let maxPoint = null;\n                  lineData.forEach(point => {\n                    if (point.z > maxZ) {\n                      maxZ = point.z;\n                      maxPoint = point;\n                    }\n                  });\n                  \n                  if (maxPoint) {\n                    const maxProjected = isometricProjection(maxPoint.x, maxPoint.y, maxPoint.z);\n                    g.select('.max-point-outer-' + monthIdx)\n                      .attr(\"cx\", maxProjected.x)\n                      .attr(\"cy\", maxProjected.y);\n                    g.select('.max-point-inner-' + monthIdx)\n                      .attr(\"cx\", maxProjected.x)\n                      .attr(\"cy\", maxProjected.y);\n                  }\n                });\n                \n                // \u66F4\u65B0\u5750\u6807\u8F74\uFF08\u4F7F\u7528\u5916\u90E8\u5B9A\u4E49\u7684axisOffset\u548ClabelOffset\uFF09\n                \n                // \u66F4\u65B0\u539F\u70B9\n                origin = isometricProjection(-axisOffset, -axisOffset, 0);\n                \n                // \u66F4\u65B0X\u8F74\n                xAxisEnd = isometricProjection(totalWidth + axisOffset, -axisOffset, 0);\n                g.select(\".x-axis.axis-line\")\n                  .attr(\"x1\", origin.x)\n                  .attr(\"y1\", origin.y)\n                  .attr(\"x2\", xAxisEnd.x)\n                  .attr(\"y2\", xAxisEnd.y);\n                \n                const xAxisAngle = Math.atan2(xAxisEnd.y - origin.y, xAxisEnd.x - origin.x);\n                const xArrowLength = 8;\n                const xArrowPath = d3.path();\n                xArrowPath.moveTo(xAxisEnd.x, xAxisEnd.y);\n                xArrowPath.lineTo(\n                  xAxisEnd.x - xArrowLength * Math.cos(xAxisAngle - Math.PI / 6),\n                  xAxisEnd.y - xArrowLength * Math.sin(xAxisAngle - Math.PI / 6)\n                );\n                xArrowPath.lineTo(\n                  xAxisEnd.x - xArrowLength * Math.cos(xAxisAngle + Math.PI / 6),\n                  xAxisEnd.y - xArrowLength * Math.sin(xAxisAngle + Math.PI / 6)\n                );\n                xArrowPath.closePath();\n                g.select(\".x-axis.axis-arrow\").attr(\"d\", xArrowPath.toString());\n                \n                // \u66F4\u65B0Y\u8F74\n                yAxisEnd = isometricProjection(-axisOffset, totalDepth + axisOffset, 0);\n                g.select(\".y-axis.axis-line\")\n                  .attr(\"x1\", origin.x)\n                  .attr(\"y1\", origin.y)\n                  .attr(\"x2\", yAxisEnd.x)\n                  .attr(\"y2\", yAxisEnd.y);\n                \n                const yAxisAngle = Math.atan2(yAxisEnd.y - origin.y, yAxisEnd.x - origin.x);\n                const yArrowLength = 8;\n                const yArrowPath = d3.path();\n                yArrowPath.moveTo(yAxisEnd.x, yAxisEnd.y);\n                yArrowPath.lineTo(\n                  yAxisEnd.x - yArrowLength * Math.cos(yAxisAngle - Math.PI / 6),\n                  yAxisEnd.y - yArrowLength * Math.sin(yAxisAngle - Math.PI / 6)\n                );\n                yArrowPath.lineTo(\n                  yAxisEnd.x - yArrowLength * Math.cos(yAxisAngle + Math.PI / 6),\n                  yAxisEnd.y - yArrowLength * Math.sin(yAxisAngle + Math.PI / 6)\n                );\n                yArrowPath.closePath();\n                g.select(\".y-axis.axis-arrow\").attr(\"d\", yArrowPath.toString());\n                \n                // \u66F4\u65B0Z\u8F74\n                zAxisEnd = isometricProjection(-axisOffset, -axisOffset, maxHeight + axisOffset);\n                g.select(\".z-axis.axis-line\")\n                  .attr(\"x1\", origin.x)\n                  .attr(\"y1\", origin.y)\n                  .attr(\"x2\", zAxisEnd.x)\n                  .attr(\"y2\", zAxisEnd.y);\n                \n                const zAxisAngle = Math.atan2(zAxisEnd.y - origin.y, zAxisEnd.x - origin.x);\n                const zArrowLength = 8;\n                const zArrowPath = d3.path();\n                zArrowPath.moveTo(zAxisEnd.x, zAxisEnd.y);\n                zArrowPath.lineTo(\n                  zAxisEnd.x - zArrowLength * Math.cos(zAxisAngle - Math.PI / 6),\n                  zAxisEnd.y - zArrowLength * Math.sin(zAxisAngle - Math.PI / 6)\n                );\n                zArrowPath.lineTo(\n                  zAxisEnd.x - zArrowLength * Math.cos(zAxisAngle + Math.PI / 6),\n                  zAxisEnd.y - zArrowLength * Math.sin(zAxisAngle + Math.PI / 6)\n                );\n                zArrowPath.closePath();\n                g.select(\".z-axis.axis-arrow\").attr(\"d\", zArrowPath.toString());\n                \n                // \u66F4\u65B0X\u8F74\u6807\u7B7E\n                allGenres.forEach((genre, idx) => {\n                  const x = idx * cellWidth + cellWidth / 2;\n                  const y = -labelOffset;\n                  const projected = isometricProjection(x, y, 0);\n                  g.select('.x-label-' + idx)\n                    .attr(\"x\", projected.x)\n                    .attr(\"y\", projected.y);\n                });\n                \n                // \u66F4\u65B0Y\u8F74\u6807\u7B7E\n                months.forEach((month, idx) => {\n                  if (idx % 3 === 0) {\n                    const x = 0;\n                    const y = idx * cellDepth + cellDepth / 2;\n                    const projected = isometricProjection(x - labelOffset, y, 0);\n                    g.select('.y-label-' + idx)\n                      .attr(\"x\", projected.x)\n                      .attr(\"y\", projected.y);\n                  }\n                });\n                \n                // \u66F4\u65B0Z\u8F74\u6807\u7B7E\n                zLabelPos = isometricProjection(-10, 0, maxHeight + 25);\n                g.select(\".z-label\")\n                  .attr(\"x\", zLabelPos.x)\n                  .attr(\"y\", zLabelPos.y);\n                \n              }\n              \n              // \u9F20\u6807\u62D6\u52A8\u65CB\u8F6C\u76F8\u5173\u53D8\u91CF\uFF08\u4E0E\u539F\u59CB heatmap.js \u4E00\u81F4\uFF09\n              let isDragging = false;\n              let lastMouseX = 0;\n\n              // ========== \u9F20\u6807\u62D6\u52A8\u65CB\u8F6C\u4E8B\u4EF6 ==========\n              svgD3.on(\"mousedown\", function(event) {\n                isDragging = true;\n                lastMouseX = event.clientX;\n                svgD3.style(\"cursor\", \"grabbing\");\n                event.preventDefault();\n                event.stopPropagation();\n              });\n\n              svgD3.on(\"mousemove\", function(event) {\n                if (isDragging) {\n                  const deltaX = event.clientX - lastMouseX;\n                  rotationAngle += deltaX * 0.01; // \u65CB\u8F6C\u901F\u5EA6\n                  \n                  // \u66F4\u65B0\u6295\u5F71\uFF08\u540C\u6B65\uFF0C\u907F\u514D mouseup \u540E\u4ECD\u6709\u5F02\u6B65\u66F4\u65B0\u5BFC\u81F4\u201C\u677E\u5F00\u8FD8\u5728\u8F6C\u201D\uFF09\n                  updateProjection();\n                  \n                  lastMouseX = event.clientX;\n                  event.preventDefault();\n                  event.stopPropagation();\n                } else {\n                  // \u2705 \u515C\u5E95\uFF1A\u5927\u7A97\u91CC\u4E0D\u4F9D\u8D56\u547D\u4E2D\u6298\u7EBF\u672C\u4F53\uFF0C\u9760\u8FD1\u6298\u7EBF\u70B9\u5C31\u663E\u793A tooltip\n                  try {\n                    const gNode = g.node();\n                    if (!gNode) return;\n                    const m = d3.pointer(event, gNode);\n                    const mouseX = m[0], mouseY = m[1];\n\n                    let best = null;\n                    for (let mi = 0; mi < lineDataArray.length; mi++) {\n                      const series = lineDataArray[mi];\n                      if (!series || !series.lineData) continue;\n                      for (let gi = 0; gi < series.lineData.length; gi++) {\n                        const p = series.lineData[gi];\n                        const proj = isometricProjection(p.x, p.y, p.z);\n                        const dx = mouseX - proj.x;\n                        const dy = mouseY - proj.y;\n                        const dist = Math.sqrt(dx * dx + dy * dy);\n                        if (!best || dist < best.dist) {\n                          const monthLabel = (typeof months !== 'undefined' && months && months[p.monthIdx] !== undefined) ? months[p.monthIdx] : (series.month || '');\n                          best = { month: monthLabel, genre: allGenres[p.genreIdx], value: p.value, dist };\n                        }\n                      }\n                    }\n\n                    if (best && best.dist < 22) {\n                      tooltip.style(\"opacity\", 0.95).html('<b>' + best.genre + '</b><br/>' + best.month + '<br/>\u66F2\u76EE\u6570\u91CF: ' + Math.round(best.value));\n                      const cx = (event && typeof event.clientX === \"number\") ? event.clientX : (event && typeof event.pageX === \"number\" ? event.pageX : 0);\n                      const cy = (event && typeof event.clientY === \"number\") ? event.clientY : (event && typeof event.pageY === \"number\" ? event.pageY : 0);\n                      const node = tooltip.node();\n                      const w = node ? (node.offsetWidth || 0) : 0;\n                      const h = node ? (node.offsetHeight || 0) : 0;\n                      const pad = 10;\n                      let x = cx + 12;\n                      let y = cy - 18;\n                      x = Math.max(pad, Math.min(x, (window.innerWidth || 0) - w - pad));\n                      y = Math.max(pad, Math.min(y, (window.innerHeight || 0) - h - pad));\n                      tooltip.style(\"left\", x + \"px\").style(\"top\", y + \"px\");\n                    } else {\n                      // \u4E0D\u9760\u8FD1\u6298\u7EBF\u65F6\u4E0D\u5F3A\u884C\u9690\u85CF\uFF0C\u907F\u514D\u548C\u65B9\u5757 tooltip \u6253\u67B6\n                    }\n                  } catch (e) {}\n                }\n              });\n\n              svgD3.on(\"mouseup\", function(event) {\n                isDragging = false;\n                svgD3.style(\"cursor\", \"grab\");\n                event.preventDefault();\n                event.stopPropagation();\n              });\n\n              svgD3.on(\"mouseleave\", function(event) {\n                isDragging = false;\n                svgD3.style(\"cursor\", \"grab\");\n                event.preventDefault();\n                event.stopPropagation();\n              });\n              \n              // \u5168\u5C40 mouseup \u76D1\u542C\uFF0C\u786E\u4FDD\u5373\u4F7F\u9F20\u6807\u79FB\u51FA SVG \u4E5F\u80FD\u505C\u6B62\u62D6\u52A8\n              d3.select(document).on(\"mouseup.heatmap-rotate\", function(event) {\n                if (isDragging) {\n                  isDragging = false;\n                  svgD3.style(\"cursor\", \"grab\");\n                }\n              });\n              }\n            } else if (is2DHeatmap) {\n              // \u2705 2D\u70ED\u529B\u56FE\uFF1A\u53EA\u6DFB\u52A0\u7B80\u5355\u7684\u7F29\u653E\u529F\u80FD\uFF08\u4E0D\u65CB\u8F6C\uFF09\n              const g = svgD3.select('g');\n              if (!g.empty()) {\n                const zoom = d3.zoom()\n                  .scaleExtent([0.5, 3])\n                  .on(\"zoom\", function(event) {\n                    g.attr(\"transform\", event.transform);\n                  });\n                \n                svgD3.call(zoom);\n                console.log('\u2705 2D\u70ED\u529B\u56FE\u7F29\u653E\u529F\u80FD\u5DF2\u542F\u7528');\n              }\n            }\n            \n            console.log('\u2705 \u70ED\u529B\u56FE\u4EA4\u4E92\u521D\u59CB\u5316\u5B8C\u6210');\n          }\n          \n          function checkSvg() {\n            const svg = document.querySelector('#svg-container-main svg') || document.querySelector('svg');\n            if (svg) {\n              console.log('\u2705 SVG \u5143\u7D20\u5DF2\u627E\u5230:', svg.tagName, svg.namespaceURI);\n              // \u786E\u4FDD SVG \u6709\u6B63\u786E\u7684\u547D\u540D\u7A7A\u95F4\uFF08\u5173\u952E\uFF01\uFF09\n              svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');\n              svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');\n              \n              // \u79FB\u9664\u53EF\u80FD\u88AB\u8BEF\u8BC6\u522B\u4E3A\u56FE\u7247\u7684\u5C5E\u6027\n              svg.removeAttribute('content-type');\n              svg.removeAttribute('content');\n              svg.removeAttribute('type');\n              \n              // \u786E\u4FDD SVG \u53EF\u4EE5\u63A5\u6536\u4E8B\u4EF6\uFF08\u4E0D\u662F\u56FE\u7247\uFF09\n              svg.style.pointerEvents = 'auto';\n              \n              // \u786E\u4FDD\u6240\u6709\u5B50\u5143\u7D20\u4E5F\u53EF\u4EE5\u63A5\u6536\u4E8B\u4EF6\n              const allElements = svg.querySelectorAll('*');\n              allElements.forEach(el => {\n                el.style.pointerEvents = 'auto';\n              });\n              \n              console.log('\u2705 SVG \u5DF2\u8BBE\u7F6E\u4E3A\u53EF\u4EA4\u4E92\u6A21\u5F0F');\n              \n              // \u2705 \u5982\u679C\u662F\u70ED\u529B\u56FE\uFF0C\u76F4\u63A5\u5728\u8FD9\u91CC\u521D\u59CB\u5316\n              const chartType = '").concat(type, "';\n              console.log('\uD83D\uDCDD \u56FE\u8868\u7C7B\u578B:', chartType);\n              if (chartType === 'heatmap') {\n                console.log('\uD83D\uDD25 \u68C0\u6D4B\u5230\u70ED\u529B\u56FE\u7C7B\u578B\uFF0C\u5F00\u59CB\u521D\u59CB\u5316...');\n                // \u5EF6\u8FDF\u4E00\u70B9\u65F6\u95F4\u786E\u4FDD\u6240\u6709\u5143\u7D20\u90FD\u5DF2\u6E32\u67D3\n                setTimeout(function() {\n                  initHeatmapInteractions(svg);\n                }, 100);\n              }\n              \n              return true;\n            } else {\n              console.warn('\u26A0\uFE0F \u672A\u627E\u5230 SVG \u5143\u7D20\uFF0C\u7B49\u5F85...');\n              return false;\n            }\n          }\n          \n          // \u5EF6\u8FDF\u6267\u884C\uFF0C\u786E\u4FDD DOM \u5B8C\u5168\u6E32\u67D3\n          setTimeout(function() {\n            const svgFound = checkSvg();\n            if (!svgFound) {\n              // \u5982\u679C\u6CA1\u627E\u5230\uFF0C\u7B49\u5F85 DOM \u52A0\u8F7D\u5B8C\u6210\n              if (document.readyState === 'loading') {\n                document.addEventListener('DOMContentLoaded', function() {\n                  setTimeout(function() {\n                    checkSvg();\n                  }, 200);\n                });\n              } else {\n                setTimeout(function() {\n                  checkSvg();\n                }, 200);\n              }\n            }\n          }, 500);\n          \n          // \u70ED\u529B\u56FE\u4E0D\u518D\u505A\u201C\u5EF6\u8FDF\u4FDD\u969C\u201D\u4E8C\u6B21\u521D\u59CB\u5316\uFF1A\u907F\u514D\u91CD\u590D\u7ED1\u5B9A\u4E8B\u4EF6/zoom \u62A2\u4E8B\u4EF6\u5BFC\u81F4\u65CB\u8F6C\u903B\u8F91\u9519\u4E71\n        })();\n      });\n    })();\n  </script>\n  ").concat(interactionScript ? interactionScript.replace('<script>', '<script data-type="' + type + '">') : '', "\n</body>\n</html>\n    ");
  }
  //#endregion

  function initInteractionsInNewWindow(newWindow, type) {
    // 在新窗口中初始化交互功能
    // 这个函数会在窗口加载完成后被调用
    // 具体的交互逻辑已经在 HTML 的 script 标签中
  }
  function openImageInNewWindow(imageSrc, title) {
    // 创建新窗口的 HTML，显示图片
    var html = "\n<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>".concat(title, " - \u8BE6\u7EC6\u89C6\u56FE</title>\n  <style>\n    * {\n      margin: 0;\n      padding: 0;\n      box-sizing: border-box;\n    }\n    :root{\n      /* \u65B0\u7A97\u53E3\u80CC\u666F\uFF1A\u6BD4\u4E3B\u9875\u9762\u66F4\u6D45\u4E00\u6863\uFF0C\u907F\u514D\u201C\u592A\u9ED1\u201D */\n      --bg: #0b0624;\n      --bg-0: #0b0624;\n      --bg-1: #140a35;\n      --bg-2: #1c0c44;\n      --bg-3: #0b1230;\n      --text: #e2e8f0;\n      --muted: #94a3b8;\n      --accent-violet: #7c3aed;\n      --accent-pink: #ff3bd4;\n      --accent-blue: #32a7ff;\n    }\n    html, body {\n      width: 100%;\n      height: 100%;\n      overflow: auto;\n      background:\n        radial-gradient(circle at 18% 28%, rgba(255, 59, 212, 0.12) 0%, transparent 54%),\n        radial-gradient(circle at 82% 68%, rgba(50, 167, 255, 0.11) 0%, transparent 56%),\n        linear-gradient(135deg, var(--bg-0) 0%, var(--bg-1) 28%, var(--bg-2) 58%, var(--bg-3) 100%);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n    .image-container {\n      width: 100%;\n      height: 100%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 20px;\n    }\n    img {\n      max-width: 100%;\n      max-height: 100%;\n      object-fit: contain;\n      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);\n      border-radius: 8px;\n    }\n    .close-btn {\n      position: fixed;\n      top: 20px;\n      right: 20px;\n      background: rgba(18, 8, 42, 0.82);\n      color: var(--text);\n      border: 1px solid rgba(50, 167, 255, 0.32);\n      padding: 8px 16px;\n      border-radius: 4px;\n      cursor: pointer;\n      font-size: 14px;\n      z-index: 1000;\n      transition: all 0.3s ease;\n    }\n    .close-btn:hover {\n      background: rgba(255, 59, 212, 0.14);\n      border-color: rgba(255, 59, 212, 0.42);\n    }\n    .title {\n      position: fixed;\n      top: 20px;\n      left: 20px;\n      color: var(--text);\n      font-size: 18px;\n      font-weight: 600;\n      z-index: 1000;\n      text-shadow: 0 0 12px rgba(255, 59, 212, 0.25), 0 0 22px rgba(50, 167, 255, 0.18);\n    }\n  </style>\n</head>\n<body>\n  <div class=\"title\">").concat(title, "</div>\n  <button class=\"close-btn\" onclick=\"window.close()\">\u5173\u95ED\u7A97\u53E3</button>\n  <div class=\"image-container\">\n    <img src=\"").concat(imageSrc, "\" alt=\"").concat(title, "\">\n  </div>\n  <script>\n    // \u652F\u6301 ESC \u952E\u5173\u95ED\n    document.addEventListener('keydown', function(e) {\n      if (e.key === 'Escape') {\n        window.close();\n      }\n    });\n    \n    // \u56FE\u7247\u52A0\u8F7D\u9519\u8BEF\u5904\u7406\n    document.querySelector('img').addEventListener('error', function() {\n      this.alt = '\u56FE\u7247\u52A0\u8F7D\u5931\u8D25';\n      this.style.border = '2px solid rgba(220, 38, 38, 0.5)';\n    });\n  </script>\n</body>\n</html>\n    ");

    // 打开新窗口
    var newWindow = window.open('', '_blank', 'width=1400,height=900,resizable=yes,scrollbars=yes');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    } else {
      alert('无法打开新窗口，请检查浏览器弹窗设置');
    }
  }
  function addGlobalStyles() {
    var styleId = 'svg-interaction-styles';
    if (document.getElementById(styleId)) return;
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = "\n      .chart-content[data-interaction-setup] {\n        transform-origin: center center;\n        will-change: transform;\n      }\n      .chart-panel {\n        overflow: visible !important;\n      }\n      .chart-content[data-interaction-setup]:hover {\n        z-index: 100 !important;\n      }\n    ";
    document.head.appendChild(style);
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","svg-interaction.js"], null)
//# sourceMappingURL=/svg-interaction.32e1ddb0.js.map