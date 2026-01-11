// ========== D3 地图绘制脚本（自适应版本） ==========
// 使用立即执行函数防止重复执行
(() => {
  // 防止重复执行：如果已经创建过地图，直接返回
  if (document.getElementById('map') && d3.select("#map svg").size() > 0) {
    console.log("⚠️ 地图已存在，跳过重复创建");
    return;
  }

  // 清空容器，防止重复创建
  d3.select("#map").selectAll("*").remove();

  // 获取容器实际尺寸
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('❌ 找不到地图容器');
    return;
  }

  const width = mapContainer.clientWidth || 400;
  const height = mapContainer.clientHeight || 300;

  console.log(`📐 地图容器尺寸: ${width} x ${height}`);

  const svg = d3
    .select("#map")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // 向上留出空间给图例
  const legendHeight = 80;

  // ====== Aitoff 投影（不依赖 d3-geo-projection，直接用 d3.geoProjection 实现） ======
  // 参考：Aitoff raw
  function aitoffRaw(lambda, phi) {
    // lambda, phi are in radians
    const halfLambda = lambda / 2;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const cosHalfLambda = Math.cos(halfLambda);
    const sinHalfLambda = Math.sin(halfLambda);
    const alpha = Math.acos(Math.max(-1, Math.min(1, cosPhi * cosHalfLambda)));
    // sinc(alpha) = sin(alpha)/alpha，alpha→0 时趋近 1
    const sinc = alpha ? (Math.sin(alpha) / alpha) : 1;
    return [
      2 * cosPhi * sinHalfLambda / sinc,
      sinPhi / sinc
    ];
  }

  const projection = d3.geoProjection(aitoffRaw);
  const path = d3.geoPath().projection(projection);

// ====== 赛博主题配色：从 CSS 变量取色，保证与背景一致 ======
function cssVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name);
  return (v || '').trim() || fallback;
}

function rgba(hex, a) {
  const h = (hex || '').replace('#', '');
  if (h.length !== 6) return `rgba(255,255,255,${a})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const accentViolet = cssVar('--accent-violet', '#7c3aed');
const accentPink = cssVar('--accent-pink', '#ff3bd4');
const accentBlue = cssVar('--accent-blue', '#32a7ff');
const accentCyan = cssVar('--accent-cyan', '#00fff0');

// 海洋/外轮廓（赛博深色）
const oceanFill = "rgba(7, 3, 18, 0.22)";
const oceanStroke = rgba(accentBlue, 0.45);
const oceanStrokeGlow = rgba(accentPink, 0.18);

const colorScale = d3.scaleOrdinal()
  .domain([
    "ACG", "pop music", "rock music", "classical music",
    "electronic music", "folk music", "jazz music", "rap music"
  ])
  .range([
    rgba(accentViolet, 0.55), // ACG：霓虹紫
    rgba(accentPink, 0.48),   // pop：霓虹粉
    rgba(accentCyan, 0.40),   // rock：电青
    "rgba(245, 158, 11, 0.55)", // classical：琥珀金
    rgba(accentBlue, 0.55),   // electronic：电蓝
    rgba(accentViolet, 0.30), // folk：低饱和紫（贴合背景）
    rgba(accentPink, 0.32),   // jazz：柔粉
    "rgba(148, 163, 184, 0.35)" // rap：冷灰蓝
  ]);




// 🧭 提示框（与气泡图tooltip保持一致）
let tooltip = d3.select("body").select(".map-tooltip");
if (tooltip.empty()) {
  tooltip = d3.select("body").append("div")
    .attr("class", "map-tooltip")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("padding", "12px 14px")
    .style("border-radius", "12px")
    .style("background", "rgba(30, 41, 59, 0.90)")
    .style("color", "#fff")
    .style("font", "13px/1.4 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif")
    .style("opacity", 0)
    .style("backdrop-filter", "blur(6px)")
    .style("z-index", 1000);
}

// —— 国家名称归一化（两侧同时归一化，提升匹配率）
const ALIASES = new Map([
  ["United States of America", "United States"],
  ["Russian Federation", "Russia"],
  ["Czech Republic", "Czechia"],
  ["Côte d'Ivoire", "Côte d'Ivoire"],
  ["Congo, Democratic Republic of the", "Congo - Kinshasa"],
  ["Democratic Republic of the Congo", "Congo - Kinshasa"],
  ["Congo, Republic of the", "Congo - Brazzaville"],
  ["Republic of the Congo", "Congo - Brazzaville"],
  ["Korea, Republic of", "South Korea"],
  ["Korea, Democratic People's Republic of", "North Korea"],
  ["Syrian Arab Republic", "Syria"],
  ["Lao People's Democratic Republic", "Laos"],
  ["Viet Nam", "Vietnam"],
  ["Eswatini", "Eswatini"],
  ["Swaziland", "Eswatini"],
  ["Cabo Verde", "Cape Verde"],
  ["Myanmar", "Myanmar (Burma)"],
  ["Macedonia", "North Macedonia"],
  ["Taiwan, Province of China", "Taiwan"]
]);

const normalize = (name) => {
  if (!name) return name;
  const trimmed = name.trim();
  return ALIASES.get(trimmed) || trimmed;
};

// 📦 动态加载 TopoJSON 库（支持多个备选 CDN）
function loadTopoJSON() {
  if (typeof topojson !== "undefined") {
    return Promise.resolve();
  }

  console.log("🔄 开始加载 TopoJSON 库...");
  
  const cdnUrls = [
    "https://unpkg.com/topojson@3",
    "https://cdn.jsdelivr.net/npm/topojson@3",
    "https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js",
    "https://fastly.jsdelivr.net/npm/topojson@3"
  ];

  function tryLoad(index) {
    if (index >= cdnUrls.length) {
      return Promise.reject(new Error("所有 CDN 都加载失败"));
    }

    const url = cdnUrls[index];
    console.log(`📡 尝试从 CDN ${index + 1}/${cdnUrls.length} 加载: ${url}`);

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      
      script.onload = () => {
        if (typeof topojson !== "undefined") {
          console.log(`✅ TopoJSON 加载成功（来源: ${url}）`);
          resolve();
        } else {
          console.warn(`⚠️ 脚本加载但 topojson 未定义，尝试下一个 CDN...`);
          document.head.removeChild(script);
          tryLoad(index + 1).then(resolve).catch(reject);
        }
      };
      
      script.onerror = () => {
        console.warn(`⚠️ CDN ${index + 1} 加载失败，尝试下一个...`);
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
  
  const csvText = `country,top_genre,top_value
Afghanistan,pop music,94
Albania,pop music,40
Algeria,pop music,43
American Samoa,ACG,0
Andorra,ACG,100
Angola,rap music,51
Anguilla,ACG,0
Antarctica,electronic music,100
Antigua & Barbuda,rock music,100
Argentina,rock music,51
Armenia,rock music,47
Aruba,rock music,100
Australia,rock music,47
Austria,rock music,49
Azerbaijan,rock music,40
Bahamas,rock music,53
Bahrain,rock music,43
Bangladesh,folk music,57
Barbados,classical music,100
Belarus,ACG,63
Belgium,rock music,48
Belize,rock music,100
Benin,jazz music,100
Bermuda,ACG,0
Bhutan,ACG,0
Bolivia,rock music,45
Bosnia & Herzegovina,rock music,52
Botswana,jazz music,63
Bouvet Island,ACG,0
Brazil,rock music,54
British Indian Ocean Territory,ACG,0
British Virgin Islands,ACG,0
Brunei,rock music,55
Bulgaria,rock music,47
Burkina Faso,rap music,100
Burundi,ACG,0
Cambodia,pop music,47
Cameroon,rap music,48
Canada,rock music,48
Cape Verde,ACG,0
Caribbean Netherlands,ACG,0
Cayman Islands,ACG,100
Central African Republic,pop music,100
Chad,ACG,0
Chile,ACG,57
China,ACG,81
Christmas Island,ACG,0
Cocos (Keeling) Islands,ACG,0
Colombia,rock music,46
Comoros,ACG,0
Congo - Brazzaville,rap music,53
Congo - Kinshasa,jazz music,97
Cook Islands,ACG,0
Costa Rica,rock music,52
Croatia,rock music,50
Cuba,jazz music,94
Curaçao,ACG,0
Cyprus,pop music,54
Czechia,rock music,52
Côte d'Ivoire,rap music,71
Denmark,rock music,44
Djibouti,ACG,0
Dominica,ACG,0
Dominican Republic,rock music,44
Ecuador,rock music,44
Egypt,pop music,44
El Salvador,electronic music,41
Equatorial Guinea,ACG,0
Eritrea,ACG,0
Estonia,rock music,43
Eswatini,jazz music,54
Ethiopia,classical music,90
Falkland Islands (Islas Malvinas),ACG,0
Faroe Islands,ACG,0
Fiji,classical music,100
Finland,rock music,44
France,ACG,47
French Guiana,ACG,0
French Polynesia,ACG,0
French Southern Territories,ACG,0
Gabon,classical music,100
Gambia,ACG,0
Georgia,rock music,47
Germany,rock music,46
Ghana,pop music,57
Gibraltar,ACG,0
Greece,ACG,64
Greenland,electronic music,100
Grenada,ACG,0
Guadeloupe,ACG,0
Guam,classical music,100
Guatemala,pop music,40
Guernsey,pop music,100
Guinea,rap music,100
Guinea-Bissau,ACG,0
Guyana,classical music,100
Haiti,jazz music,100
Heard & McDonald Islands,ACG,0
Honduras,rock music,49
Hong Kong,ACG,72
Hungary,rock music,54
Iceland,rock music,59
India,classical music,45
Indonesia,ACG,60
Iran,rock music,38
Iraq,pop music,42
Ireland,pop music,45
Isle of Man,classical music,100
Israel,ACG,52
Italy,rock music,50
Jamaica,rock music,43
Japan,ACG,76
Jersey,classical music,68
Jordan,rock music,44
Kazakhstan,ACG,49
Kenya,pop music,47
Kiribati,ACG,0
Kosovo,rock music,50
Kuwait,rock music,38
Kyrgyzstan,pop music,66
Laos,pop music,73
Latvia,rock music,49
Lebanon,pop music,46
Lesotho,jazz music,100
Liberia,rap music,100
Libya,rap music,95
Liechtenstein,ACG,0
Lithuania,rock music,48
Luxembourg,rock music,48
Macao,ACG,80
Madagascar,jazz music,65
Malawi,pop music,62
Malaysia,ACG,47
Maldives,pop music,54
Mali,ACG,100
Malta,rock music,64
Marshall Islands,ACG,0
Martinique,ACG,0
Mauritania,ACG,0
Mauritius,rock music,50
Mayotte,ACG,0
Mexico,rock music,46
Micronesia,ACG,0
Moldova,rock music,49
Monaco,ACG,0
Mongolia,rock music,45
Montenegro,classical music,54
Montserrat,ACG,0
Morocco,rap music,42
Mozambique,jazz music,100
Myanmar (Burma),pop music,44
Namibia,classical music,59
Nauru,ACG,0
Nepal,classical music,37
Netherlands,rock music,44
New Caledonia,rock music,100
New Zealand,ACG,56
Nicaragua,rock music,56
Niger,jazz music,100
Nigeria,pop music,44
Niue,ACG,0
Norfolk Island,ACG,0
North Korea,ACG,0
North Macedonia,rock music,46
Northern Mariana Islands,ACG,0
Norway,rock music,48
Oman,rock music,52
Pakistan,pop music,49
Palau,ACG,0
Palestine,rock music,64
Panama,rock music,59
Papua New Guinea,rock music,47
Paraguay,rock music,57
Peru,rock music,46
Philippines,pop music,47
Pitcairn Islands,ACG,0
Poland,rock music,49
Portugal,rock music,48
Puerto Rico,rock music,48
Qatar,rock music,40
Romania,rock music,47
Russia,ACG,57
Rwanda,pop music,45
Réunion,classical music,100
Samoa,ACG,0
San Marino,ACG,0
Saudi Arabia,rock music,39
Senegal,rap music,54
Serbia,rock music,50
Seychelles,ACG,0
Sierra Leone,rock music,54
Singapore,pop music,53
Sint Maarten,ACG,0
Slovakia,rock music,47
Slovenia,rock music,47
Solomon Islands,ACG,0
Somalia,ACG,0
South Africa,pop music,42
South Georgia & South Sandwich Islands,ACG,0
South Korea,ACG,56
South Sudan,classical music,100
Spain,rock music,48
Sri Lanka,rap music,41
St. Barthélemy,ACG,0
St. Helena,rock music,44
St. Kitts & Nevis,ACG,0
St. Lucia,folk music,100
St. Martin,ACG,0
St. Pierre & Miquelon,ACG,0
St. Vincent & Grenadines,ACG,0
Sudan,ACG,0
Suriname,jazz music,100
Svalbard & Jan Mayen,ACG,0
Sweden,rock music,49
Switzerland,rock music,43
Syria,pop music,61
São Tomé & Príncipe,ACG,0
Taiwan,ACG,78
Tajikistan,pop music,100
Tanzania,pop music,48
Thailand,pop music,45
Timor-Leste,ACG,0
Togo,rap music,100
Tokelau,ACG,0
Tonga,ACG,0
Trinidad & Tobago,rock music,46
Tunisia,rap music,41
Turkmenistan,pop music,59
Turks & Caicos Islands,ACG,0
Tuvalu,ACG,0
Türkiye,rock music,41
U.S. Outlying Islands,ACG,0
U.S. Virgin Islands,ACG,0
Uganda,pop music,49
Ukraine,ACG,72
United Arab Emirates,rock music,42
United Kingdom,rock music,47
United States,rock music,49
Uruguay,ACG,74
Uzbekistan,pop music,51
Vanuatu,ACG,0
Vatican City,ACG,0
Venezuela,pop music,44
Vietnam,pop music,48
Wallis & Futuna,ACG,0
Western Sahara,electronic music,100
Yemen,ACG,0
Zambia,pop music,57
Zimbabwe,pop music,43
Åland Islands,rock music,100`;

  const data = d3.csvParse(csvText);
  console.log(`✅ CSV 数据加载成功！解析了 ${data.length} 行数据`);
  return Promise.resolve(data);
}

// 🗺️ 加载地图与数据
console.log("🔄 开始加载地图数据...");

loadTopoJSON().then(() => {
  return Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
    loadCSV()
  ]);
}).then(([world, data]) => {
  if (typeof topojson === "undefined") {
    console.error("❌ TopoJSON 加载失败，无法继续绘制地图");
    const mapContainer = d3.select("#map");
    if (!mapContainer.empty()) {
      mapContainer.append("div")
        .style("padding", "20px")
        .style("text-align", "center")
        .style("color", "#d62728")
        .html("<h3>❌ TopoJSON 库加载失败</h3><p>请检查网络连接或使用本地 TopoJSON 文件</p>");
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

  const cleanFieldName = (name) => {
    if (!name) return name;
    return name.replace(/^\uFEFF/, '').trim();
  };

  const countries = topojson.feature(world, world.objects.countries).features;
  console.log("✅ 国家数量（地图）：", countries.length);

  // Aitoff 投影自适应：把地图拟合到“除去图例”的可用区域
  try {
    projection.fitExtent(
      [[8, 8], [width - 8, Math.max(120, height - legendHeight - 8)]],
      { type: "FeatureCollection", features: countries }
    );
  } catch (e) {
    console.warn("⚠️ Aitoff projection.fitExtent 失败，使用默认投影参数：", e);
    projection
      .scale(Math.min(width / 5.0, (height - legendHeight) / 2.4))
      .translate([width / 2, (height - legendHeight) / 2]);
  }

  // ====== 先画海洋（Sphere）+ 外轮廓（Aitoff 椭圆边界） ======
  const defs = svg.append("defs");
  const glow = defs.append("filter").attr("id", "oceanGlow");
  glow.append("feGaussianBlur").attr("stdDeviation", "2.4").attr("result", "blur");
  const merge = glow.append("feMerge");
  merge.append("feMergeNode").attr("in", "blur");
  merge.append("feMergeNode").attr("in", "SourceGraphic");

  // 海洋底板（填充）
  svg.append("path")
    .datum({ type: "Sphere" })
    .attr("d", path)
    .attr("fill", oceanFill)
    .attr("stroke", "none");

  // 外轮廓 + 微光
  svg.append("path")
    .datum({ type: "Sphere" })
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", oceanStroke)
    .attr("stroke-width", 1.4)
    .attr("filter", "url(#oceanGlow)");

  // 可选：经纬网（很淡，增加“海洋感/投影感”）
  const graticule = d3.geoGraticule10();
  svg.append("path")
    .datum(graticule)
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", "rgba(50, 167, 255, 0.10)")
    .attr("stroke-width", 0.8);

  const genreByCountry = {};
  let validRowCount = 0;
  
  data.forEach((d, index) => {
    const countryKey = Object.keys(d).find(key => 
      cleanFieldName(key).toLowerCase() === 'country'
    ) || 'country';
    
    const genreKey = Object.keys(d).find(key => 
      cleanFieldName(key).toLowerCase() === 'top_genre'
    ) || 'top_genre';

    const valueKey = Object.keys(d).find(key => 
      cleanFieldName(key).toLowerCase() === 'top_value'
    ) || 'top_value';

    const countryValue = d[countryKey];
    const genreValue = d[genreKey];
    const valueValue = d[valueKey];

    if (countryValue && genreValue) {
      const normalizedCountry = normalize(String(countryValue).trim());
      const genre = String(genreValue).trim();
      const value = valueValue ? String(valueValue).trim() : "0";
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
  svg.selectAll("path")
    .data(countries)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "country")
    .attr("fill", d => {
      const name = normalize(d.properties.name);
      const data = genreByCountry[name];
      return data ? colorScale(data.genre) : "rgba(88, 101, 242, 0.1)"; // 科技风默认颜色
    })
    .on("mouseenter", (event, d) => {
      const name = normalize(d.properties.name);
      const data = genreByCountry[name];
      
      // 将数据存储到 path 元素的 data 属性中，以便在新窗口中使用
      const path = d3.select(event.currentTarget);
      path.attr('data-country-name', name);
      if (data) {
        path.attr('data-genre', data.genre);
        path.attr('data-value', data.value);
        tooltip
          .style("opacity", 1)
          .html(`
            <div style="font-weight:800;margin-bottom:6px;letter-spacing:.3px">${name}</div>
            <div style="opacity:.92">🎵 ${data.genre}</div>
            <div style="opacity:.92;margin-top:6px">📊 分数: ${data.value}</div>
          `);
      } else {
        path.attr('data-genre', '');
        path.attr('data-value', '');
        tooltip
          .style("opacity", 1)
          .html(`
            <div style="font-weight:800;margin-bottom:6px;letter-spacing:.3px">${name}</div>
            <div style="opacity:.92">暂无数据</div>
          `);
      }
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left", (event.pageX + 14) + "px")
        .style("top", (event.pageY + 14) + "px");
    })
    .on("mouseleave", () => {
      tooltip.style("opacity", 0);
    });

  console.log("✅ 地图绘制完成");

  // 图例
  const legend = d3.select("#legend");
  if (!legend.empty()) {
    colorScale.domain().forEach(genre => {
      legend.append("div")
        .attr("class", "legend-item")
        .style("color", "#e2e8f0") // 浅色文字适应深色背景
        .html(`<span class="legend-color" style="background:${colorScale(genre)}"></span><span class="legend-text">${genre}</span>`);
    });
    console.log("✅ 图例创建完成");
  }
}).catch(err => {
    console.error("❌ 资源加载失败：", err);
    const mapContainer = d3.select("#map");
    if (!mapContainer.empty()) {
      mapContainer.selectAll("*").remove();
      mapContainer.append("div")
        .style("padding", "20px")
        .style("text-align", "center")
        .style("color", "#d62728")
        .html("<h3>❌ 数据加载失败</h3><p>请打开浏览器控制台（F12）查看详细错误信息</p>");
    }
  });
})(); // 立即执行函数结束

// ==============================
// Word Cloud (D3 render, lightweight layout)
// Data: src/assets/词云词频统计.json -> all_words
// ==============================
(function () {
  'use strict';

  const CONTAINER_ID = 'wordcloud';
  const DATA_URLS = [
    'assets/词云词频统计.json',
    './assets/词云词频统计.json',
  ];

  // 词条数量：会在 render 时根据面板面积动态计算，这里作为“最低保底”
  const MIN_WORDS = 180;
  const MAX_WORDS_CAP = 380;

  // 布局参数：调小间距/旋转概率以塞入更多词
  // 注意：padding 可以是小数（碰撞盒计算支持），有利于“多塞一点点”
  const PADDING = 0.6;
  const ROTATE_PROB = 0.10; // 旋转会显著增加碰撞概率，稍微降一点

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v || '').trim() || fallback;
  }

  function getContainer() {
    return document.getElementById(CONTAINER_ID);
  }

  function getSize(el) {
    const width = el.clientWidth || 420;
    const height = el.clientHeight || 260;
    return { width, height };
  }

  async function fetchJsonWithFallback(urls) {
    let lastErr;
    for (const u of urls) {
      try {
        const res = await fetch(u, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${u}`);
        return await res.json();
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error('Failed to load wordcloud json');
  }

  function normalizeWords(allWordsObj, limit) {
    const entries = Object.entries(allWordsObj || {});
    entries.sort((a, b) => (b[1] || 0) - (a[1] || 0));
    return entries.slice(0, limit).map(([text, value]) => ({
      text,
      value: +value || 0,
    }));
  }

  function createMeasurer(fontFamily) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return function measure(text, fontSize) {
      ctx.font = `${fontSize}px ${fontFamily}`;
      const m = ctx.measureText(text);
      // 近似高度：按字体大小估计；中文/英文都够用
      const w = m.width;
      const h = fontSize * 1.05;
      return { w, h };
    };
  }

  function boxesOverlap(a, b) {
    return !(
      a.x2 < b.x1 ||
      a.x1 > b.x2 ||
      a.y2 < b.y1 ||
      a.y1 > b.y2
    );
  }

  function placeWords(words, width, height, fontScale, fontFamily) {
    const measure = createMeasurer(fontFamily);
    const placed = [];
    const boxes = [];
    const cx = width / 2;
    const cy = height / 2;

    // 轻微留白，避免贴边
    const safeW = width - 8;
    const safeH = height - 8;

    for (const w of words) {
      const fontSize = fontScale(w.value);
      const rotate = Math.random() < ROTATE_PROB ? 90 : 0;
      const { w: tw, h: th } = measure(w.text, fontSize);
      const bw = rotate ? th : tw;
      const bh = rotate ? tw : th;

      let placedOne = false;
      // 螺旋搜索
      // 尝试次数越多，越有机会把更多词塞进来（成本：渲染更慢一点点）
      const maxTries = 1800;
      for (let t = 0; t < maxTries; t++) {
        const angle = 0.35 * t;
        const radius = 0.45 * Math.sqrt(t) * 8;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        const x1 = x - bw / 2 - PADDING;
        const x2 = x + bw / 2 + PADDING;
        const y1 = y - bh / 2 - PADDING;
        const y2 = y + bh / 2 + PADDING;

        // 边界检查
        if (x1 < (width - safeW) / 2 || x2 > width - (width - safeW) / 2) continue;
        if (y1 < (height - safeH) / 2 || y2 > height - (height - safeH) / 2) continue;

        const box = { x1, y1, x2, y2 };
        let collide = false;
        for (const b of boxes) {
          if (boxesOverlap(box, b)) {
            collide = true;
            break;
          }
        }
        if (collide) continue;

        boxes.push(box);
        placed.push({
          text: w.text,
          value: w.value,
          x: x - cx,
          y: y - cy,
          fontSize,
          rotate,
        });
        placedOne = true;
        break;
      }

      // 放不下就跳过（通常是最后几个最小/最长的词）
      if (!placedOne) continue;
    }

    return placed;
  }

  function renderWordcloud(allWords) {
    const el = getContainer();
    if (!el) return;
    if (!window.d3) {
      el.innerHTML = '<div style="color: rgba(226,232,240,0.85); font-size:12px;">❌ d3 未加载，无法渲染词云</div>';
      return;
    }

    const { width, height } = getSize(el);
    el.innerHTML = '';

    // 动态确定词条数量：面板越大，显示越多
    // 经验值：每 ~5200px² 放 1 个词（上限 MAX_WORDS_CAP）
    const area = Math.max(1, width * height);
    const maxWords = Math.max(
      MIN_WORDS,
      Math.min(MAX_WORDS_CAP, Math.floor(area / 5200))
    );

    const words = normalizeWords(allWords, maxWords);
    if (!words.length) {
      el.innerHTML = '<div style="color: rgba(226,232,240,0.85); font-size:12px;">暂无词频数据</div>';
      return;
    }

    const maxV = words[0].value || 1;
    const minV = words[words.length - 1].value || 0;

    // 为了让词条更多：允许更小的最小字号，同时略收敛最大字号
    const fontMinBase = 7;
    // 最大字号再降一些：减少“巨词”，让画面更密、更容易塞下更多词
    const fontMaxBase = Math.max(24, Math.min(56, Math.floor(Math.min(width, height) / 4.6)));

    // 二次布局策略：如果放入词条太少，自动降低 fontMax 重排（最多 3 轮）
    const desiredCount = Math.min(words.length, maxWords);
    const minAcceptRatio = 0.82;
    const maxAttempts = 3;

    function layoutOnce(attemptIndex) {
      const shrink = Math.pow(0.88, attemptIndex); // 0:1.0, 1:0.88, 2:0.77
      const fontMin = Math.max(6, fontMinBase - attemptIndex); // 7,6,6
      const fontMax = Math.max(fontMin + 6, Math.floor(fontMaxBase * shrink));

      const fontScale = d3.scaleSqrt()
        .domain([Math.max(1, minV), Math.max(1, maxV)])
        .range([fontMin, fontMax]);

      const placed = placeWords(words, width, height, fontScale, fontFamily);
      return { placed, fontMin, fontMax };
    }

    const accentPink = cssVar('--accent-pink', '#ff3bd4');
    const accentCyan = cssVar('--accent-cyan', '#00fff0');
    const accentViolet = cssVar('--accent-violet', '#7c3aed');

    const fontFamily = '"Segoe UI","Microsoft YaHei",system-ui,sans-serif';

    // 选择“最好的一次布局”（词条最多），同时若达到阈值则提前停止
    let best = layoutOnce(0);
    for (let i = 1; i < maxAttempts; i++) {
      if (best.placed.length >= desiredCount * minAcceptRatio) break;
      const cand = layoutOnce(i);
      if (cand.placed.length > best.placed.length) best = cand;
    }

    const color = d3.scaleLinear()
      .domain([best.fontMin, (best.fontMin + best.fontMax) / 2, best.fontMax])
      .range([accentViolet, accentPink, accentCyan])
      .clamp(true);

    const placed = best.placed;

    const svg = d3.select(el)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // tooltip（复用 body 上的简单 tooltip）
    let tip = d3.select('body').select('.wordcloud-tooltip');
    if (tip.empty()) {
      tip = d3.select('body')
        .append('div')
        .attr('class', 'wordcloud-tooltip')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('padding', '10px 12px')
        .style('border-radius', '10px')
        .style('background', 'rgba(15, 23, 42, 0.92)')
        .style('color', '#e2e8f0')
        .style('font', '12px/1.4 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif')
        .style('border', '1px solid rgba(88, 101, 242, 0.5)')
        .style('backdrop-filter', 'blur(6px)')
        .style('opacity', 0)
        .style('z-index', 1200);
    }

    g.selectAll('text')
      .data(placed)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .style('font-family', fontFamily)
      .style('font-size', d => `${d.fontSize}px`)
      .style('fill', d => color(d.fontSize))
      .style('opacity', 0.95)
      .style('cursor', 'default')
      .style('paint-order', 'stroke')
      .style('stroke', 'rgba(7, 3, 18, 0.55)')
      .style('stroke-width', '2px')
      .text(d => d.text)
      .on('mousemove', function (event, d) {
        tip
          .style('opacity', 1)
          .html(`<div style="font-weight:600; margin-bottom:2px;">${d.text}</div><div>词频：${d.value}</div>`)
          .style('left', `${event.pageX + 12}px`)
          .style('top', `${event.pageY + 12}px`);
      })
      .on('mouseleave', function () {
        tip.style('opacity', 0);
      });
  }

  let cachedAllWords = null;
  let resizeTimer = null;

  async function ensureDataAndRender() {
    const el = getContainer();
    if (!el) return;
    if (!cachedAllWords) {
      el.innerHTML = '<div style="color: rgba(226,232,240,0.85); font-size:12px;">加载词云数据中...</div>';
      // 优先尝试 bundler（如 Parcel）打包 JSON：避免 file:// 下 fetch 被浏览器拦截
      let json = null;
      try {
        // eslint-disable-next-line no-undef
        if (typeof require === 'function') {
          // eslint-disable-next-line no-undef
          json = require('./assets/词云词频统计.json');
        }
      } catch (e) {
        json = null;
      }

      if (!json) {
        json = await fetchJsonWithFallback(DATA_URLS);
      }

      cachedAllWords = json && json.all_words ? json.all_words : {};
    }
    renderWordcloud(cachedAllWords);
  }

  function scheduleRender() {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      try {
        if (cachedAllWords) renderWordcloud(cachedAllWords);
      } catch (e) {
        console.error('❌ 词云重绘失败：', e);
      }
    }, 120);
  }

  function initWordcloud() {
    const el = getContainer();
    if (!el) return;

    ensureDataAndRender().catch((e) => {
      console.error('❌ 词云初始化失败：', e);
      el.innerHTML = '<div style="color: rgba(226,232,240,0.85); font-size:12px;">❌ 词云数据加载失败</div>';
    });

    // ResizeObserver：panel 尺寸变化时重绘（比 window.resize 更准）
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => scheduleRender());
      ro.observe(el);
    } else {
      window.addEventListener('resize', scheduleRender);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWordcloud);
  } else {
    initWordcloud();
  }
})();