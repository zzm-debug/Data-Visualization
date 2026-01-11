// app.js — 柔和气泡 + 互动率环（进度）+ 字更大 + 图更大（去掉力导向）
(() => {
  const data = {
    "ACG": { "total_plays": 89843048, "total_comments": 95537, "song_count": 50 },
    "Pop": { "total_plays": 3393742080, "total_comments": 12806829, "song_count": 50 },
    "Rock": { "total_plays": 186807824, "total_comments": 5122030, "song_count": 50 },
    "Classical": { "total_plays": 74785024, "total_comments": 383731, "song_count": 50 },
    "Electronic": { "total_plays": 405760640, "total_comments": 185764, "song_count": 50 },
    "Folk": { "total_plays": 44580532, "total_comments": 112595, "song_count": 50 },
    "Jazz": { "total_plays": 28298645, "total_comments": 98685, "song_count": 50 },
    "Rap": { "total_plays": 519658432, "total_comments": 267719, "song_count": 50 }
  };

  // influence（来自 assets/influence_html.csv）：用于“气泡半径”映射
  // CSV 示例：
  // genre,influence
  // Pop,1.0
  let influenceByGenre = new Map();

  // 图表背景：保持透明（背景由独立视觉层 + 面板承载）
  const BG = "transparent";

  const palette = {
    ACG: "#7c3aed",        // 霓虹紫
    Pop: "#ff3bd4",        // 霓虹粉
    Rock: "#00fff0",       // 电青
    Classical: "#F59E0B",  // 琥珀金
    Electronic: "#32a7ff", // 电蓝
    Folk: "#a78bfa",       // 低饱和紫
    Jazz: "#f472b6",       // 柔粉
    Rap: "#94A3B8"         // 冷灰蓝
  };

  const svgSel = d3.select("#bubble-svg");
  const svgNode = svgSel.node();
  if (!svgNode) return;

  // tooltip（复用避免重复）
  let tooltip = d3.select("body").select(".bubble-tooltip");
  if (tooltip.empty()) {
    tooltip = d3.select("body").append("div")
      .attr("class", "bubble-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("padding", "12px 14px")
      .style("border-radius", "12px")
      .style("background", "rgba(30, 41, 59, 0.90)")
      .style("color", "#fff")
      .style("font", "13px/1.4 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif")
      .style("opacity", 0)
      .style("backdrop-filter", "blur(6px)");
  }

  // 避免每次 resize rerender 都重复绑定 scroll listener
  let scrollBound = false;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function formatBig(n) { return d3.format(",")(n); }
  function pct(x) { return `${(x * 100).toFixed(2)}%`; }

  function asNumber(v, fallback = NaN) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  async function loadInfluenceMap() {
    // ✅ Parcel 1.x：用 require 引入静态资源，才能在 build 后把文件打包/复制进 dist
    // require('./assets/influence_html.csv') 返回的是最终可访问的 URL
    const candidates = [];

    try {
      // eslint-disable-next-line no-undef
      if (typeof require !== "undefined") {
        // eslint-disable-next-line no-undef
        const bundledUrl = require("./assets/influence_html.csv");
        if (bundledUrl) candidates.push(bundledUrl);
      }
    } catch (e) {
      // ignore
    }

    // 兼容不同部署/打开方式（例如 src/ 下直接打开，或通过本地 server）
    candidates.push(
      "assets/influence_html.csv",
      "./assets/influence_html.csv",
      "/assets/influence_html.csv",
      "/src/assets/influence_html.csv"
    );

    for (const url of candidates) {
      try {
        const rows = await d3.csv(url);
        if (!rows || rows.length === 0) continue;

        const m = new Map();
        rows.forEach(r => {
          const genre = (r.genre || "").trim();
          const influence = asNumber(r.influence, NaN);
          if (genre && Number.isFinite(influence)) m.set(genre, influence);
        });

        if (m.size > 0) {
          console.log(`✅ influence CSV 加载成功：${url}（${m.size} 条）`);
          return m;
        }
      } catch (e) {
        // 尝试下一个候选路径
      }
    }

    console.warn("⚠️ influence CSV 加载失败：将回退为“气泡=评论数”映射（请确认 src/assets/influence_html.csv 已被打包或可通过 URL 访问）");
    return new Map();
  }

  function render() {
    svgSel.selectAll("*").remove();

    const container = svgNode.closest(".panel-body") || svgNode.parentElement;
    const cw = container?.clientWidth || 1100;
    const ch = container?.clientHeight || 720;

    // ✅ 图更大：上限更高
    const width = Math.max(1100, Math.min(1700, Math.floor(cw * 1.25)));
    const height = Math.max(720, Math.min(1100, Math.floor(ch * 1.18)));

    // ✅ 字更大后，给轴/图例更多空间
    const margin = { top: 72, right: 260, bottom: 110, left: 120 };
    const innerW = Math.max(300, width - margin.left - margin.right);
    const innerH = Math.max(260, height - margin.top - margin.bottom);

    svgSel
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background", BG);

    const g = svgSel.append("g");

    const genres = Object.keys(data);
    const colorOf = (k) => palette[k] || "#94A3B8";

    const playsExtent = d3.extent(genres, k => data[k].total_plays);
    const commentsExtent = d3.extent(genres, k => data[k].total_comments);

    const xMin = Math.max(1, (playsExtent[0] || 1) * 0.75);
    const xMax = (playsExtent[1] || 1) * 1.25;

    const xScale = d3.scaleLog()
      .domain([xMin, xMax])
      .range([margin.left, width - margin.right])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([0, (commentsExtent[1] || 0) * 1.12])
      .range([height - margin.bottom, margin.top])
      .nice();

    // ✅ 气泡半径：优先用 CSV 的 influence；若加载失败/缺失则回退到评论数
    const influenceVals = genres
      .map(g => influenceByGenre.get(g))
      .filter(v => Number.isFinite(v));
    const hasInfluence = influenceVals.length > 0;

    const maxR = Math.max(78, Math.floor(Math.min(innerW, innerH) * 0.16));

    const rScale = hasInfluence
      ? (() => {
          const ext = d3.extent(influenceVals);
          const minV = Math.max(0, ext[0] ?? 0);
          const maxV = Math.max(minV + 1e-9, ext[1] ?? 1);
          return d3.scaleSqrt().domain([minV, maxV]).range([18, maxR]).clamp(true);
        })()
      : d3.scaleSqrt()
          .domain([Math.max(1, commentsExtent[0] || 1), Math.max(2, commentsExtent[1] || 2)])
          .range([18, maxR]);

    // ✅ 互动率：comments/plays -> 相对进度
    const rates = genres.map(k => (data[k].total_comments || 0) / Math.max(1, data[k].total_plays || 1));
    const maxRate = Math.max(...rates, 1e-9);

    // 网格线（更淡，更干净）
    const xGrid = d3.axisBottom(xScale).tickSize(-innerH).tickFormat("");
    const yGrid = d3.axisLeft(yScale).tickSize(-innerW).tickFormat("");

    g.append("g")
      .attr("class", "grid x-grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xGrid);

    g.append("g")
      .attr("class", "grid y-grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yGrid);

    // 深色赛博背景下：网格线不能太“深灰/低透明”，否则新窗口里几乎看不见
    svgSel.selectAll(".grid line")
      .attr("stroke", "rgba(50, 167, 255, 0.14)")
      .attr("stroke-width", 1.2);

    svgSel.selectAll(".grid path").attr("stroke", "none");

    // 坐标轴（字号更大）
    const xAxis = d3.axisBottom(xScale).ticks(10, "~s");
    const yAxis = d3.axisLeft(yScale).ticks(6).tickFormat(d3.format(".2s"));

    const gx = g.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "x-axis")
      .call(xAxis);

    const gy = g.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis")
      .call(yAxis);

    // 深色赛博背景下：轴文字需要更高对比度
    g.selectAll(".x-axis text, .y-axis text")
      .style("font-size", "15px")
      .style("fill", "rgba(226, 232, 240, 0.88)")
      .style("paint-order", "stroke")
      .style("stroke", "rgba(7, 3, 18, 0.72)")
      .style("stroke-width", "2.2px")
      .style("stroke-linejoin", "round");

    g.selectAll(".x-axis path, .y-axis path, .x-axis line, .y-axis line")
      .attr("stroke", "rgba(50, 167, 255, 0.28)");

    // 节点
    const nodes = genres.map(genre => {
      const s = data[genre];
      const influence = hasInfluence ? (influenceByGenre.get(genre) ?? 0) : null;
      const r = hasInfluence ? rScale(influence) : rScale(s.total_comments);
      const rate = (s.total_comments || 0) / Math.max(1, s.total_plays || 1);
      const progress = clamp(rate / maxRate, 0, 1);

      return {
        id: genre,
        total_plays: s.total_plays,
        total_comments: s.total_comments,
        influence,
        x: xScale(s.total_plays),
        y: yScale(s.total_comments),
        r,
        rate,
        progress,
        active: true
      };
    });

    const layer = g.append("g").attr("class", "bubble-layer");

    // ✅ 只保留“柔和气泡”本体
    const bubbles = layer.selectAll(".bubble")
      .data(nodes, d => d.id)
      .enter().append("circle")
      .attr("class", "bubble")
      .attr("r", d => d.r)
      .attr("fill", d => colorOf(d.id))
      .attr("fill-opacity", 0.28)                // 轻盈一点
      .attr("stroke", "rgba(255,255,255,0.95)")  // 干净的描边
      .attr("stroke-width", 2);

    // ✅ 互动率环（保留）：底环 + 进度环
    const ringGap = 10;     // 离气泡更远一点，看起来更优雅
    const ringWidth = 7;    // 更清晰

    const ringBase = layer.selectAll(".ring-base")
      .data(nodes, d => d.id)
      .enter().append("circle")
      .attr("class", "ring-base")
      .attr("fill", "none")
      .attr("r", d => d.r + ringGap)
      .attr("stroke", "rgba(30,41,59,0.10)")
      .attr("stroke-width", ringWidth);

    const ringProg = layer.selectAll(".ring-prog")
      .data(nodes, d => d.id)
      .enter().append("circle")
      .attr("class", "ring-prog")
      .attr("fill", "none")
      .attr("r", d => d.r + ringGap)
      .attr("stroke", d => colorOf(d.id))
      .attr("stroke-opacity", 0.78)
      .attr("stroke-linecap", "round")
      .attr("stroke-width", ringWidth);

    function updateRings() {
      ringProg.each(function (d) {
        const rr = d.r + ringGap;
        const c = 2 * Math.PI * rr;
        const filled = c * d.progress;

        d3.select(this)
          .attr("stroke-dasharray", `${filled} ${c}`)
          .attr("stroke-dashoffset", 0);
      });
    }

    // 让进度从顶部开始（旋转 -90°）
    function ringRotate(d) {
      return `rotate(-90 ${d.x} ${d.y})`;
    }

    // 交互（绑定到气泡）
    bubbles
      .on("mouseenter", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(`
            <div style="font-weight:800;margin-bottom:6px;letter-spacing:.3px">${d.id}</div>
            <div style="opacity:.92">Plays：${formatBig(d.total_plays)}</div>
            <div style="opacity:.92">Comments：${formatBig(d.total_comments)}</div>
            <div style="opacity:.92;margin-top:6px">Influence：${d.influence === null ? "N/A" : d3.format(".4f")(d.influence)}</div>
            <div style="opacity:.92;margin-top:6px">互动率：${pct(d.rate)}</div>
            <div style="opacity:.70;margin-top:6px">气泡=影响力(influence)｜外环=互动率（相对进度）</div>
          `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", (event.pageX + 14) + "px")
          .style("top", (event.pageY + 14) + "px");
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    // —— 轻量级碰撞分离（无力导向）——

// 每个气泡的“有效半径”需要包含外环：r + ringGap + ringWidth
const pad = 6;                   // 额外留白，避免贴边
const extra = ringGap + ringWidth + 3;

function clampNode(d) {
  const bound = d.r + extra;
  d.x = clamp(d.x, margin.left + bound, width - margin.right - bound);
  d.y = clamp(d.y, margin.top + bound,  height - margin.bottom - bound);
}

// 先做一次边界裁剪
nodes.forEach(clampNode);

// 迭代式分离：两两检查，若重叠就沿中心连线各退一半
function resolveCollisions(nodes, maxIter = 80) {
  for (let it = 0; it < maxIter; it++) {
    let moved = 0;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];

        const ra = a.r + extra;
        const rb = b.r + extra;
        const need = ra + rb + pad;

        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.hypot(dx, dy);

        if (dist < 1e-6) {
          const jitter = 0.5 + Math.random();
          dx = jitter;
          dy = jitter * 0.7;
          dist = Math.hypot(dx, dy);
        }

        if (dist < need) {
          const push = (need - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;

          a.x -= nx * push;
          a.y -= ny * push;
          b.x += nx * push;
          b.y += ny * push;

          moved++;
        }
      }
    }

    nodes.forEach(clampNode);

    if (moved === 0) break;
  }
}

// 执行分离
resolveCollisions(nodes);

// 放置到最终位置
bubbles.attr("cx", d => d.x).attr("cy", d => d.y);
ringBase.attr("cx", d => d.x).attr("cy", d => d.y);
ringProg
  .attr("cx", d => d.x).attr("cy", d => d.y)
  .attr("transform", d => `rotate(-90 ${d.x} ${d.y})`);

// 重新计算一次进度环
updateRings();


    // ✅ 轴标题更大
    svgSel.append("text")
      .attr("x", margin.left + innerW / 2)
      .attr("y", height - 42)
      .attr("text-anchor", "middle")
      .style("font", "16px/1 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif")
      .style("fill", "rgba(226, 232, 240, 0.88)")
      .style("paint-order", "stroke")
      .style("stroke", "rgba(7, 3, 18, 0.72)")
      .style("stroke-width", "2.2px")
      .style("stroke-linejoin", "round")
      .text("Total Plays (log)");

    svgSel.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(margin.top + innerH / 2))
      .attr("y", 34)
      .attr("text-anchor", "middle")
      .style("font", "16px/1 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif")
      .style("fill", "rgba(226, 232, 240, 0.88)")
      .style("paint-order", "stroke")
      .style("stroke", "rgba(7, 3, 18, 0.72)")
      .style("stroke-width", "2.2px")
      .style("stroke-linejoin", "round")
      .text("Total Comments");

    // ✅ 注释：右上角加一个“说明”小标签（设计感更强）
    const note = svgSel.append("g")
      .attr("transform", `translate(${margin.left + 10}, ${margin.top - 36})`);

    note.append("rect")
      .attr("width", 320)
      .attr("height", 28)
      .attr("rx", 10)
      .attr("fill", "rgba(18, 8, 42, 0.86)")
      .attr("stroke", "rgba(50, 167, 255, 0.28)");

    note.append("text")
      .attr("x", 14)
      .attr("y", 19)
      .style("font", "14px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif")
      .style("fill", "rgba(226, 232, 240, 0.86)")
      .text("气泡=影响力(influence)  ｜  外环=互动率（相对进度）");

    // ✅ 图例：更大更清晰（不漏）
    const legend = svgSel.append("g").attr("class", "legend-group");

    const legendItem = legend.selectAll(".legend")
      .data(genres)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(${width - margin.right + 20}, ${margin.top + i * 32})`)
      .style("cursor", "pointer")
      .on("click", (event, genre) => {
        const node = nodes.find(n => n.id === genre);
        node.active = !node.active;

        const op = node.active ? 1 : 0.12;

        bubbles.filter(d => d.id === genre).transition().duration(220).attr("opacity", op);
        ringBase.filter(d => d.id === genre).transition().duration(220).attr("opacity", op);
        ringProg.filter(d => d.id === genre).transition().duration(220).attr("opacity", op);

        legendItem.filter(d => d === genre).selectAll("text, rect")
          .transition().duration(180)
          .style("opacity", node.active ? 1 : 0.35);
      });

    legendItem.append("rect")
      .attr("width", 16)
      .attr("height", 16)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("y", -12)
      .style("fill", d => colorOf(d))
      .style("opacity", 0.75);

    legendItem.append("text")
      .attr("x", 26)
      .attr("y", 2)
      .text(d => d)
      .style("font-size", "16px")
      .style("fill", "rgba(226, 232, 240, 0.86)")
      .style("paint-order", "stroke")
      .style("stroke", "rgba(7, 3, 18, 0.72)")
      .style("stroke-width", "2.0px")
      .style("stroke-linejoin", "round")
      .style("font-family", "system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif");

    if (!scrollBound) {
      window.addEventListener("scroll", () => tooltip.style("opacity", 0), { passive: true });
      scrollBound = true;
    }
  }

  // resize 防抖
  let t = null;
  function rerender() {
    clearTimeout(t);
    t = setTimeout(render, 90);
  }

  // 先加载 influence，再渲染（避免第一次渲染仍用评论数）
  (async () => {
    influenceByGenre = await loadInfluenceMap();
    render();
    window.addEventListener("resize", rerender);
  })();
})();
