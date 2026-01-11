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
})({"mpVp":[function(require,module,exports) {
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// ========== D3 地图绘制脚本（自适应版本） ==========
// 使用立即执行函数防止重复执行
(function () {
  // 防止重复执行：如果已经创建过地图，直接返回
  if (document.getElementById('map') && d3.select("#map svg").size() > 0) {
    console.log("⚠️ 地图已存在，跳过重复创建");
    return;
  }

  // 清空容器，防止重复创建
  d3.select("#map").selectAll("*").remove();

  // 获取容器实际尺寸
  var mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('❌ 找不到地图容器');
    return;
  }
  var width = mapContainer.clientWidth || 400;
  var height = mapContainer.clientHeight || 300;
  console.log("\uD83D\uDCD0 \u5730\u56FE\u5BB9\u5668\u5C3A\u5BF8: ".concat(width, " x ").concat(height));
  var svg = d3.select("#map").append("svg").attr("width", "100%").attr("height", "100%").attr("viewBox", "0 0 ".concat(width, " ").concat(height)).attr("preserveAspectRatio", "xMidYMid meet");

  // 根据容器尺寸动态计算投影参数
  var scale = Math.min(width / 5.5, height / 2.8);

  // 向上偏移，为底部图例留出空间（约留出 80px 空间给图例）
  var legendHeight = 80;
  var offsetY = height / 2 - legendHeight / 2;
  var projection = d3.geoNaturalEarth1().scale(scale).translate([width / 2, offsetY]);
  var path = d3.geoPath().projection(projection);

  // 🎨 颜色映射表（根据音乐类型）
  // 🎨 颜色映射表（更柔和的莫兰迪配色，适配奶油白背景）
  var colorScale = d3.scaleOrdinal().domain(["ACG", "pop music", "rock music", "classical music", "electronic music", "folk music", "jazz music", "rap music"]).range(["#A79AD9",
  // ACG｜更明亮的柔紫
  "#E1C3A1",
  // pop｜浅杏奶油（更活泼）
  "#9FBEA9",
  // rock｜清新鼠尾草绿
  "#C9B1DE",
  // classical｜浅薰衣草
  "#A7B8E2",
  // electronic｜晴空雾蓝
  "#B5A08C",
  // folk｜暖砂色
  "#E0A9B8",
  // jazz｜柔和玫瑰粉
  "#AEB4BE" // rap｜浅中性灰蓝
  ]);

  // 🧭 提示框（与气泡图tooltip保持一致）
  var tooltip = d3.select("body").select(".map-tooltip");
  if (tooltip.empty()) {
    tooltip = d3.select("body").append("div").attr("class", "map-tooltip").style("position", "absolute").style("pointer-events", "none").style("padding", "12px 14px").style("border-radius", "12px").style("background", "rgba(30, 41, 59, 0.90)").style("color", "#fff").style("font", "13px/1.4 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif").style("opacity", 0).style("backdrop-filter", "blur(6px)").style("z-index", 1000);
  }

  // —— 国家名称归一化（两侧同时归一化，提升匹配率）
  var ALIASES = new Map([["United States of America", "United States"], ["Russian Federation", "Russia"], ["Czech Republic", "Czechia"], ["Côte d'Ivoire", "Côte d'Ivoire"], ["Congo, Democratic Republic of the", "Congo - Kinshasa"], ["Democratic Republic of the Congo", "Congo - Kinshasa"], ["Congo, Republic of the", "Congo - Brazzaville"], ["Republic of the Congo", "Congo - Brazzaville"], ["Korea, Republic of", "South Korea"], ["Korea, Democratic People's Republic of", "North Korea"], ["Syrian Arab Republic", "Syria"], ["Lao People's Democratic Republic", "Laos"], ["Viet Nam", "Vietnam"], ["Eswatini", "Eswatini"], ["Swaziland", "Eswatini"], ["Cabo Verde", "Cape Verde"], ["Myanmar", "Myanmar (Burma)"], ["Macedonia", "North Macedonia"], ["Taiwan, Province of China", "Taiwan"]]);
  var normalize = function normalize(name) {
    if (!name) return name;
    var trimmed = name.trim();
    return ALIASES.get(trimmed) || trimmed;
  };

  // 📦 动态加载 TopoJSON 库（支持多个备选 CDN）
  function loadTopoJSON() {
    if (typeof topojson !== "undefined") {
      return Promise.resolve();
    }
    console.log("🔄 开始加载 TopoJSON 库...");
    var cdnUrls = ["https://unpkg.com/topojson@3", "https://cdn.jsdelivr.net/npm/topojson@3", "https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js", "https://fastly.jsdelivr.net/npm/topojson@3"];
    function tryLoad(index) {
      if (index >= cdnUrls.length) {
        return Promise.reject(new Error("所有 CDN 都加载失败"));
      }
      var url = cdnUrls[index];
      console.log("\uD83D\uDCE1 \u5C1D\u8BD5\u4ECE CDN ".concat(index + 1, "/").concat(cdnUrls.length, " \u52A0\u8F7D: ").concat(url));
      return new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.onload = function () {
          if (typeof topojson !== "undefined") {
            console.log("\u2705 TopoJSON \u52A0\u8F7D\u6210\u529F\uFF08\u6765\u6E90: ".concat(url, "\uFF09"));
            resolve();
          } else {
            console.warn("\u26A0\uFE0F \u811A\u672C\u52A0\u8F7D\u4F46 topojson \u672A\u5B9A\u4E49\uFF0C\u5C1D\u8BD5\u4E0B\u4E00\u4E2A CDN...");
            document.head.removeChild(script);
            tryLoad(index + 1).then(resolve).catch(reject);
          }
        };
        script.onerror = function () {
          console.warn("\u26A0\uFE0F CDN ".concat(index + 1, " \u52A0\u8F7D\u5931\u8D25\uFF0C\u5C1D\u8BD5\u4E0B\u4E00\u4E2A..."));
          document.head.removeChild(script);
          tryLoad(index + 1).then(resolve).catch(reject);
        };
        document.head.appendChild(script);
      });
    }
    return tryLoad(0);
  }

  // 📥 加载 CSV 文件（使用内联数据）
  function loadCSV() {
    console.log("📂 开始加载 CSV 数据...");
    var csvText = "country,top_genre,top_value\nAfghanistan,pop music,94\nAlbania,pop music,40\nAlgeria,pop music,43\nAmerican Samoa,ACG,0\nAndorra,ACG,100\nAngola,rap music,51\nAnguilla,ACG,0\nAntarctica,electronic music,100\nAntigua & Barbuda,rock music,100\nArgentina,rock music,51\nArmenia,rock music,47\nAruba,rock music,100\nAustralia,rock music,47\nAustria,rock music,49\nAzerbaijan,rock music,40\nBahamas,rock music,53\nBahrain,rock music,43\nBangladesh,folk music,57\nBarbados,classical music,100\nBelarus,ACG,63\nBelgium,rock music,48\nBelize,rock music,100\nBenin,jazz music,100\nBermuda,ACG,0\nBhutan,ACG,0\nBolivia,rock music,45\nBosnia & Herzegovina,rock music,52\nBotswana,jazz music,63\nBouvet Island,ACG,0\nBrazil,rock music,54\nBritish Indian Ocean Territory,ACG,0\nBritish Virgin Islands,ACG,0\nBrunei,rock music,55\nBulgaria,rock music,47\nBurkina Faso,rap music,100\nBurundi,ACG,0\nCambodia,pop music,47\nCameroon,rap music,48\nCanada,rock music,48\nCape Verde,ACG,0\nCaribbean Netherlands,ACG,0\nCayman Islands,ACG,100\nCentral African Republic,pop music,100\nChad,ACG,0\nChile,ACG,57\nChina,ACG,81\nChristmas Island,ACG,0\nCocos (Keeling) Islands,ACG,0\nColombia,rock music,46\nComoros,ACG,0\nCongo - Brazzaville,rap music,53\nCongo - Kinshasa,jazz music,97\nCook Islands,ACG,0\nCosta Rica,rock music,52\nCroatia,rock music,50\nCuba,jazz music,94\nCura\xE7ao,ACG,0\nCyprus,pop music,54\nCzechia,rock music,52\nC\xF4te d'Ivoire,rap music,71\nDenmark,rock music,44\nDjibouti,ACG,0\nDominica,ACG,0\nDominican Republic,rock music,44\nEcuador,rock music,44\nEgypt,pop music,44\nEl Salvador,electronic music,41\nEquatorial Guinea,ACG,0\nEritrea,ACG,0\nEstonia,rock music,43\nEswatini,jazz music,54\nEthiopia,classical music,90\nFalkland Islands (Islas Malvinas),ACG,0\nFaroe Islands,ACG,0\nFiji,classical music,100\nFinland,rock music,44\nFrance,ACG,47\nFrench Guiana,ACG,0\nFrench Polynesia,ACG,0\nFrench Southern Territories,ACG,0\nGabon,classical music,100\nGambia,ACG,0\nGeorgia,rock music,47\nGermany,rock music,46\nGhana,pop music,57\nGibraltar,ACG,0\nGreece,ACG,64\nGreenland,electronic music,100\nGrenada,ACG,0\nGuadeloupe,ACG,0\nGuam,classical music,100\nGuatemala,pop music,40\nGuernsey,pop music,100\nGuinea,rap music,100\nGuinea-Bissau,ACG,0\nGuyana,classical music,100\nHaiti,jazz music,100\nHeard & McDonald Islands,ACG,0\nHonduras,rock music,49\nHong Kong,ACG,72\nHungary,rock music,54\nIceland,rock music,59\nIndia,classical music,45\nIndonesia,ACG,60\nIran,rock music,38\nIraq,pop music,42\nIreland,pop music,45\nIsle of Man,classical music,100\nIsrael,ACG,52\nItaly,rock music,50\nJamaica,rock music,43\nJapan,ACG,76\nJersey,classical music,68\nJordan,rock music,44\nKazakhstan,ACG,49\nKenya,pop music,47\nKiribati,ACG,0\nKosovo,rock music,50\nKuwait,rock music,38\nKyrgyzstan,pop music,66\nLaos,pop music,73\nLatvia,rock music,49\nLebanon,pop music,46\nLesotho,jazz music,100\nLiberia,rap music,100\nLibya,rap music,95\nLiechtenstein,ACG,0\nLithuania,rock music,48\nLuxembourg,rock music,48\nMacao,ACG,80\nMadagascar,jazz music,65\nMalawi,pop music,62\nMalaysia,ACG,47\nMaldives,pop music,54\nMali,ACG,100\nMalta,rock music,64\nMarshall Islands,ACG,0\nMartinique,ACG,0\nMauritania,ACG,0\nMauritius,rock music,50\nMayotte,ACG,0\nMexico,rock music,46\nMicronesia,ACG,0\nMoldova,rock music,49\nMonaco,ACG,0\nMongolia,rock music,45\nMontenegro,classical music,54\nMontserrat,ACG,0\nMorocco,rap music,42\nMozambique,jazz music,100\nMyanmar (Burma),pop music,44\nNamibia,classical music,59\nNauru,ACG,0\nNepal,classical music,37\nNetherlands,rock music,44\nNew Caledonia,rock music,100\nNew Zealand,ACG,56\nNicaragua,rock music,56\nNiger,jazz music,100\nNigeria,pop music,44\nNiue,ACG,0\nNorfolk Island,ACG,0\nNorth Korea,ACG,0\nNorth Macedonia,rock music,46\nNorthern Mariana Islands,ACG,0\nNorway,rock music,48\nOman,rock music,52\nPakistan,pop music,49\nPalau,ACG,0\nPalestine,rock music,64\nPanama,rock music,59\nPapua New Guinea,rock music,47\nParaguay,rock music,57\nPeru,rock music,46\nPhilippines,pop music,47\nPitcairn Islands,ACG,0\nPoland,rock music,49\nPortugal,rock music,48\nPuerto Rico,rock music,48\nQatar,rock music,40\nRomania,rock music,47\nRussia,ACG,57\nRwanda,pop music,45\nR\xE9union,classical music,100\nSamoa,ACG,0\nSan Marino,ACG,0\nSaudi Arabia,rock music,39\nSenegal,rap music,54\nSerbia,rock music,50\nSeychelles,ACG,0\nSierra Leone,rock music,54\nSingapore,pop music,53\nSint Maarten,ACG,0\nSlovakia,rock music,47\nSlovenia,rock music,47\nSolomon Islands,ACG,0\nSomalia,ACG,0\nSouth Africa,pop music,42\nSouth Georgia & South Sandwich Islands,ACG,0\nSouth Korea,ACG,56\nSouth Sudan,classical music,100\nSpain,rock music,48\nSri Lanka,rap music,41\nSt. Barth\xE9lemy,ACG,0\nSt. Helena,rock music,44\nSt. Kitts & Nevis,ACG,0\nSt. Lucia,folk music,100\nSt. Martin,ACG,0\nSt. Pierre & Miquelon,ACG,0\nSt. Vincent & Grenadines,ACG,0\nSudan,ACG,0\nSuriname,jazz music,100\nSvalbard & Jan Mayen,ACG,0\nSweden,rock music,49\nSwitzerland,rock music,43\nSyria,pop music,61\nS\xE3o Tom\xE9 & Pr\xEDncipe,ACG,0\nTaiwan,ACG,78\nTajikistan,pop music,100\nTanzania,pop music,48\nThailand,pop music,45\nTimor-Leste,ACG,0\nTogo,rap music,100\nTokelau,ACG,0\nTonga,ACG,0\nTrinidad & Tobago,rock music,46\nTunisia,rap music,41\nTurkmenistan,pop music,59\nTurks & Caicos Islands,ACG,0\nTuvalu,ACG,0\nT\xFCrkiye,rock music,41\nU.S. Outlying Islands,ACG,0\nU.S. Virgin Islands,ACG,0\nUganda,pop music,49\nUkraine,ACG,72\nUnited Arab Emirates,rock music,42\nUnited Kingdom,rock music,47\nUnited States,rock music,49\nUruguay,ACG,74\nUzbekistan,pop music,51\nVanuatu,ACG,0\nVatican City,ACG,0\nVenezuela,pop music,44\nVietnam,pop music,48\nWallis & Futuna,ACG,0\nWestern Sahara,electronic music,100\nYemen,ACG,0\nZambia,pop music,57\nZimbabwe,pop music,43\n\xC5land Islands,rock music,100";
    var data = d3.csvParse(csvText);
    console.log("\u2705 CSV \u6570\u636E\u52A0\u8F7D\u6210\u529F\uFF01\u89E3\u6790\u4E86 ".concat(data.length, " \u884C\u6570\u636E"));
    return Promise.resolve(data);
  }

  // 🗺️ 加载地图与数据
  console.log("🔄 开始加载地图数据...");
  loadTopoJSON().then(function () {
    return Promise.all([d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"), loadCSV()]);
  }).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      world = _ref2[0],
      data = _ref2[1];
    if (typeof topojson === "undefined") {
      console.error("❌ TopoJSON 加载失败，无法继续绘制地图");
      var _mapContainer = d3.select("#map");
      if (!_mapContainer.empty()) {
        _mapContainer.append("div").style("padding", "20px").style("text-align", "center").style("color", "#d62728").html("<h3>❌ TopoJSON 库加载失败</h3><p>请检查网络连接或使用本地 TopoJSON 文件</p>");
      }
      return;
    }
    console.log("✅ 世界地图数据加载成功");
    console.log("✅ CSV 数据加载成功，原始行数：", data.length);
    if (data.length === 0) {
      console.error("❌ CSV 文件为空或格式不正确");
      return;
    }
    console.log("🔍 CSV 数据调试信息：");
    if (data.length > 0) {
      console.log("   第一行数据：", data[0]);
      console.log("   第一行的所有键名：", Object.keys(data[0]));
    }
    var cleanFieldName = function cleanFieldName(name) {
      if (!name) return name;
      return name.replace(/^\uFEFF/, '').trim();
    };
    var countries = topojson.feature(world, world.objects.countries).features;
    console.log("✅ 国家数量（地图）：", countries.length);
    var genreByCountry = {};
    var validRowCount = 0;
    data.forEach(function (d, index) {
      var countryKey = Object.keys(d).find(function (key) {
        return cleanFieldName(key).toLowerCase() === 'country';
      }) || 'country';
      var genreKey = Object.keys(d).find(function (key) {
        return cleanFieldName(key).toLowerCase() === 'top_genre';
      }) || 'top_genre';
      var valueKey = Object.keys(d).find(function (key) {
        return cleanFieldName(key).toLowerCase() === 'top_value';
      }) || 'top_value';
      var countryValue = d[countryKey];
      var genreValue = d[genreKey];
      var valueValue = d[valueKey];
      if (countryValue && genreValue) {
        var normalizedCountry = normalize(String(countryValue).trim());
        var genre = String(genreValue).trim();
        var value = valueValue ? String(valueValue).trim() : "0";
        if (normalizedCountry && genre) {
          genreByCountry[normalizedCountry] = {
            genre: genre,
            value: value
          };
          validRowCount++;
        }
      }
    });
    console.log("✅ 有效数据行数：", validRowCount);
    console.log("✅ 从 CSV 建立的国家映射数量：", Object.keys(genreByCountry).length);

    // 绘制地图
    svg.selectAll("path").data(countries).enter().append("path").attr("d", path).attr("class", "country").attr("fill", function (d) {
      var name = normalize(d.properties.name);
      var data = genreByCountry[name];
      return data ? colorScale(data.genre) : "rgba(88, 101, 242, 0.1)"; // 科技风默认颜色
    }).on("mouseenter", function (event, d) {
      var name = normalize(d.properties.name);
      var data = genreByCountry[name];

      // 将数据存储到 path 元素的 data 属性中，以便在新窗口中使用
      var path = d3.select(event.currentTarget);
      path.attr('data-country-name', name);
      if (data) {
        path.attr('data-genre', data.genre);
        path.attr('data-value', data.value);
        tooltip.style("opacity", 1).html("\n            <div style=\"font-weight:800;margin-bottom:6px;letter-spacing:.3px\">".concat(name, "</div>\n            <div style=\"opacity:.92\">\uD83C\uDFB5 ").concat(data.genre, "</div>\n            <div style=\"opacity:.92;margin-top:6px\">\uD83D\uDCCA \u5206\u6570: ").concat(data.value, "</div>\n          "));
      } else {
        path.attr('data-genre', '');
        path.attr('data-value', '');
        tooltip.style("opacity", 1).html("\n            <div style=\"font-weight:800;margin-bottom:6px;letter-spacing:.3px\">".concat(name, "</div>\n            <div style=\"opacity:.92\">\u6682\u65E0\u6570\u636E</div>\n          "));
      }
    }).on("mousemove", function (event) {
      tooltip.style("left", event.pageX + 14 + "px").style("top", event.pageY + 14 + "px");
    }).on("mouseleave", function () {
      tooltip.style("opacity", 0);
    });
    console.log("✅ 地图绘制完成");

    // 图例
    var legend = d3.select("#legend");
    if (!legend.empty()) {
      colorScale.domain().forEach(function (genre) {
        legend.append("div").attr("class", "legend-item").style("color", "#e2e8f0") // 浅色文字适应深色背景
        .html("<span class=\"legend-color\" style=\"background:".concat(colorScale(genre), "\"></span><span class=\"legend-text\">").concat(genre, "</span>"));
      });
      console.log("✅ 图例创建完成");
    }
  }).catch(function (err) {
    console.error("❌ 资源加载失败：", err);
    var mapContainer = d3.select("#map");
    if (!mapContainer.empty()) {
      mapContainer.selectAll("*").remove();
      mapContainer.append("div").style("padding", "20px").style("text-align", "center").style("color", "#d62728").html("<h3>❌ 数据加载失败</h3><p>请打开浏览器控制台（F12）查看详细错误信息</p>");
    }
  });
})(); // 立即执行函数结束
},{}]},{},["mpVp"], null)
//# sourceMappingURL=/script.e04e050d.js.map