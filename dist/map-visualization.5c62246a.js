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
})({"map-visualization.js":[function(require,module,exports) {
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// map-visualization.js (替换整个文件)
var width = 1000,
  height = 600;
var svg = d3.select("#map");
var tooltip = d3.select("#map-tooltip");
var projection = d3.geoNaturalEarth1().scale(180).translate([width / 2, height / 2]);
var geoPath = d3.geoPath().projection(projection);
var color = d3.scaleOrdinal(d3.schemeTableau10);

// 位置到经纬度（可继续补充）
var regionCoords = {
  Andalusi: [-4.8, 37.9],
  India: [78.96, 20.59],
  Korea: [127.8, 36.5],
  Iran: [53.7, 32.4],
  Turkey: [35, 39],
  "Middle East": [44, 33],
  Africa: [20, 0],
  Europe: [10, 50],
  China: [104, 35],
  Japan: [138, 37],
  "North America": [-100, 40],
  "South America": [-60, -15]
};

// 地区到洲的映射（筛选使用；可按需增补同义/别名）
var locationToContinent = {
  Andalusi: "Europe",
  Spain: "Europe",
  Portugal: "Europe",
  Europe: "Europe",
  India: "Asia",
  China: "Asia",
  Japan: "Asia",
  Korea: "Asia",
  Iran: "Asia",
  Turkey: "Asia",
  "Middle East": "Asia",
  Africa: "Africa",
  "North America": "North America",
  USA: "North America",
  "United States": "North America",
  Canada: "North America",
  "South America": "South America",
  Brazil: "South America",
  Argentina: "South America"
};
function getContinent(region) {
  return locationToContinent[region] || null;
}

// 1) 无论如何先把底图画出来
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (world) {
  svg.append("g").selectAll("path").data(world.features).join("path").attr("d", geoPath).attr("fill", "#e5edf3").attr("stroke", "#888").attr("stroke-width", 0.5);
}).catch(function (err) {
  console.error("加载世界底图失败：", err);
});

// 2) 再加载数据并绘制点和传播线
d3.json("music_genres_full_with_scraped_info.json").then(function (data) {
  var genres = [];
  data.forEach(function (cat) {
    var _cat$subcategories;
    (_cat$subcategories = cat.subcategories) === null || _cat$subcategories === void 0 || _cat$subcategories.forEach(function (sub) {
      var _sub$genres;
      (_sub$genres = sub.genres) === null || _sub$genres === void 0 || _sub$genres.forEach(function (g) {
        var _g$scraped_info;
        var loc = (_g$scraped_info = g.scraped_info) === null || _g$scraped_info === void 0 ? void 0 : _g$scraped_info.location;
        if (loc) {
          var _g$children, _g$scraped_info2;
          var cont = getContinent(loc);
          genres.push({
            name: g.name,
            category: cat.category,
            region: loc,
            continent: cont,
            artist: ((_g$children = g.children) === null || _g$children === void 0 || (_g$children = _g$children[0]) === null || _g$children === void 0 ? void 0 : _g$children.name) || "未知",
            year: ((_g$scraped_info2 = g.scraped_info) === null || _g$scraped_info2 === void 0 || (_g$scraped_info2 = _g$scraped_info2.years) === null || _g$scraped_info2 === void 0 ? void 0 : _g$scraped_info2[0]) || "不详"
          });
        }
      });
    });
  });

  // 主绘制函数
  function drawMap() {
    var continent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "all";
    svg.selectAll(".circle, .route, .empty-tip").remove();
    var filtered = genres.filter(function (g) {
      if (continent === "all") return true;
      return g.continent === continent;
    });
    if (filtered.length === 0) {
      svg.append("text").attr("class", "empty-tip").attr("x", width / 2).attr("y", height / 2).attr("text-anchor", "middle").attr("font-size", 14).attr("fill", "#666").text("没有符合筛选条件的流派（可尝试选择“全部”或补充 location→continent 映射）");
      return;
    }
    filtered.forEach(function (d) {
      var origin = regionCoords[d.region];
      if (!origin) return;
      var _projection = projection(origin),
        _projection2 = _slicedToArray(_projection, 2),
        x1 = _projection2[0],
        y1 = _projection2[1];
      var spread = [x1 + (Math.random() - 0.5) * 100, y1 + (Math.random() - 0.5) * 60];
      svg.append("path").attr("class", "route").attr("d", "M".concat(x1, ",").concat(y1, " Q").concat((x1 + spread[0]) / 2, ",").concat((y1 + spread[1]) / 2 - 30, " ").concat(spread[0], ",").concat(spread[1])).attr("stroke", color(d.category)).attr("stroke-width", 1.5).attr("opacity", 0.6).attr("fill", "none");
      svg.append("circle").attr("class", "circle").attr("cx", x1).attr("cy", y1).attr("r", 5).attr("fill", color(d.category)).attr("stroke", "#222").attr("opacity", 0.85).on("mouseover", function (event) {
        tooltip.transition().duration(150).style("opacity", 1);
        tooltip.html("<b>".concat(d.name, "</b><br>\u5730\u57DF\uFF1A").concat(d.region, "<br>\u827A\u672F\u5BB6\uFF1A").concat(d.artist, "<br>\u5E74\u4EE3\uFF1A").concat(d.year)).style("left", event.pageX + 12 + "px").style("top", event.pageY + "px");
      }).on("mouseout", function () {
        return tooltip.transition().duration(200).style("opacity", 0);
      });
    });
  }

  // 默认显示全部
  drawMap("all");

  // 洲筛选
  d3.select("#continentSelect").on("change", function () {
    drawMap(this.value);
  });
}).catch(function (err) {
  console.error("加载音乐流派数据失败：", err);
  // 给出可视化提示
  svg.append("text").attr("x", width / 2).attr("y", height / 2).attr("text-anchor", "middle").attr("font-size", 14).attr("fill", "#666").text("无法加载 music_genres_full_with_scraped_info.json（请通过本地服务器访问）");
});
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62232" + '/');
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","map-visualization.js"], null)
//# sourceMappingURL=/map-visualization.5c62246a.js.map