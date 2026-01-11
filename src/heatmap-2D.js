// heatmap-2D.js - 2D热力图（已去除折线趋势图）
// ✅ Inline CSV data (for heatmap)
(() => {
  //#region Heatmap 2D｜主题/装饰层（只保留原图注释，不额外加 2D/3D 徽标）
  /**
   * 说明：
   * - 你的截图里热力图面板有“赛博霓虹渐变 + 玻璃质感卡片 + 左下角可折叠说明 + 右上角 3D/2D 徽标”。
   * - 这里不改整体页面布局（`index.html`），而是通过 JS 运行时注入“装饰层”和样式，
   *   保证 2D/3D 切换时两套图一致，且点击打开的新窗口大图也能复用同一套文案/风格。
   */

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v || "").trim() || fallback;
  }

  /** ✅ 渐变：按你原图的紫白单色系（不混青/粉） */
  function getCyberStops() {
    // ✅ 原图 legend：由浅入深（左浅→右深）
    // 因此：min → 浅色，max → 深色
    return ["#ffffff", "#e9d5ff", "#a855f7", "#6b21a8", "#2e1065"];
  }

  function ensureHeatmapOverlay(container) {
    const stage = container && (container.closest(".heatmap-stage") || container.parentElement);
    if (!stage) return;
    stage.style.position = stage.style.position || "relative";

    // 注入一次样式（主页面）
    const styleId = "heatmap-overlay-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* ✅ 左上角注释：按原图 */
        .hm-anno{
          position:absolute; left:12px; top:12px;
          width: min(340px, 50%);
          border-radius: 12px;
          background: rgba(10, 5, 20, 0.85);
          border: 1px solid rgba(124, 58, 237, 0.3);
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
          color: rgba(226,232,240,0.9);
          backdrop-filter: blur(8px);
          z-index: 6;
          overflow:hidden;
        }
        .hm-anno > summary{
          list-style:none;
          cursor:pointer;
          padding: 6px 8px;
          font: 11px/1.1 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;
          font-weight: 700;
          letter-spacing: .5px;
          user-select:none;
          color: #fff;
        }
        .hm-anno > summary::-webkit-details-marker{ display:none; }
        .hm-anno .hm-anno-body{
          padding: 0 8px 8px 8px;
          font: 10px/1.45 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;
          color: rgba(226,232,240,0.85);
        }
      `;
      document.head.appendChild(style);
    }

    // ✅ 注释文案：严格按原图，不加任何额外说明
    let anno = stage.querySelector(".hm-anno");
    if (!anno) {
      anno = document.createElement("details");
      anno.className = "hm-anno";
      anno.open = true;
      anno.innerHTML = `
        <summary>注释（点击隐藏）</summary>
        <div class="hm-anno-body">
          <div>热力图：世界范围音乐热度变化</div>
          <div>折线图：国内网友听音乐的曲目数量变化</div>
        </div>
      `;
      stage.appendChild(anno);
    }
    // ✅ 关键：阻止点击注释框时冒泡到 `.chart-content`（否则会触发 svg-interaction 的“点击打开大图”）
    try {
      anno.addEventListener("click", (e) => e.stopPropagation());
      anno.addEventListener("pointerdown", (e) => e.stopPropagation());
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
  const init2DHeatmap = () => {
    // 使用 heatmap-2d 容器
    const container = document.getElementById("heatmap-2d") || document.getElementById("heatmap");
    if (!container) {
      console.error('❌ 找不到heatmap容器');
      return;
    }

    // ✅ 装饰层：只保留注释 + 容器质感（不再额外加 2D/3D 徽标）
    ensureHeatmapOverlay(container);
    
    // 使用容器的ID进行选择
    const containerId = container.id;
    d3.select(`#${containerId}`).selectAll("*").remove();
    // ⚠️ 不要全局 remove：3D/2D 共享 tooltip，否则会互相删掉导致“tooltip 没了”

    const csvData = `month,classical,electronic,folk,jazz,pop,rock,ACG,rap
2023-12,35,34,64,47,24,32,37,37
2024-01,35,33,58,46,23,31,32,36
2024-02,34,32,62,48,26,33,34,39
2024-03,35,34,59,48,23,34,37,38
2024-04,31,34,55,47,21,34,31,36
2024-05,32,48,57,46,24,34,32,38
2024-06,32,49,62,48,23,36,31,40
2024-07,31,38,64,49,25,32,31,38
2024-08,30,39,62,46,23,32,32,37
2024-09,32,35,60,45,23,36,33,45
2024-10,31,32,60,49,23,33,31,46
2024-11,35,33,58,45,22,32,32,39
2024-12,35,35,63,48,23,33,37,39
2025-01,32,34,54,47,22,32,32,38
2025-02,33,33,58,48,22,31,29,42
2025-03,33,32,56,48,22,31,31,36
2025-04,31,33,59,45,22,31,30,36
2025-05,30,37,58,46,23,32,30,39
2025-06,29,33,57,46,21,32,31,36
2025-07,29,36,60,48,21,39,31,38
2025-08,31,35,59,46,22,34,31,34
2025-09,30,32,61,46,22,33,30,32
2025-10,33,33,59,44,21,34,31,36
2025-11,31,32,57,46,21,33,30,33
2025-12,33,32,60,45,23,32,33,39
`;

    const data = d3.csvParse(csvData.trim());

    // ✅ Genre keys（与你原逻辑一致）
    const genres = ["ACG", "classical", "electronic", "folk", "jazz", "pop", "rap", "rock"];
    const months = data.map(d => d["month"]);

    const heatmapData = data.flatMap(row =>
      genres.map(genre => ({
        month: row["month"],
        genre,
        value: +row[genre]
      }))
    );

    // === 自适应尺寸计算 ===
    const heatmapContainer = container;
    const containerWidth = heatmapContainer.clientWidth || 900;
    const containerHeight = heatmapContainer.clientHeight || 320;

    const margin = {
      top: Math.max(22, containerHeight * 0.10),
      right: Math.max(18, containerWidth * 0.03),
      bottom: Math.max(46, containerHeight * 0.18),
      left: Math.max(64, containerWidth * 0.10)
    };

    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const root = d3.select(`#${containerId}`)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // ✅ 背景“卡片内衬”
    root.append("rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", containerWidth - 20)
      .attr("height", containerHeight - 20)
      .attr("rx", 14)
      .attr("ry", 14)
      .attr("fill", "rgba(7, 3, 18, 0.18)")
      .attr("stroke", "rgba(50, 167, 255, 0.16)");

    const svg = root.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // === Axes ===
    const x = d3.scaleBand().range([0, width]).domain(months).padding(0.08);
    const y = d3.scaleBand().range([height, 0]).domain(genres).padding(0.10);

    //#region Heatmap 2D｜坐标轴主题色（与整体赛博主题一致）
    const css = getComputedStyle(document.documentElement);
    const axisColor = (css.getPropertyValue("--axis-text-strong") || "").trim() || "rgba(226, 232, 240, 0.88)";
    const gridColor = (css.getPropertyValue("--axis-grid") || "").trim() || "rgba(50, 167, 255, 0.12)";

    //#endregion

    const xAxis = svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    if (months.length > 12 || containerWidth < 560) {
      xAxis.selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-0.45em")
        .attr("dy", "0.55em");
    }

    xAxis.selectAll("path, line").attr("stroke", "rgba(50, 167, 255, 0.26)");
    xAxis.selectAll("text")
      .attr("fill", axisColor)
      .style("font-size", "12px")
      .style("paint-order", "stroke")
      .style("stroke", "rgba(7, 3, 18, 0.72)")
      .style("stroke-width", "2.0px")
      .style("stroke-linejoin", "round");

    const yAxis = svg.append("g")
      .call(d3.axisLeft(y).tickSizeOuter(0));

    yAxis.selectAll("path, line").attr("stroke", "rgba(50, 167, 255, 0.26)");
    yAxis.selectAll("text")
      .attr("fill", axisColor)
      .style("font-size", "12px")
      .style("paint-order", "stroke")
      .style("stroke", "rgba(7, 3, 18, 0.72)")
      .style("stroke-width", "2.0px")
      .style("stroke-linejoin", "round");

    // === ✅ 颜色：赛博霓虹渐变（与 3D 一致） ===
    const vMin = d3.min(heatmapData, d => d.value);
    const vMax = d3.max(heatmapData, d => d.value);

    // ✅ 颜色：按截图的霓虹渐变（深紫 → 紫 → 青 → 粉 → 近白）
    const cyberStops = getCyberStops();
    const cyberInterpolator = d3.interpolateRgbBasis(cyberStops);

    const colorScale = d3.scaleSequential()
      .domain([vMin, vMax])
      .interpolator(cyberInterpolator);

    // === 颜色映射图例（2D/3D 共用容器）===
    (function updateLegend() {
      const legend = document.getElementById("heatmap-color-legend");
      if (!legend) return;
      const fmt = d3.format(",d");
      legend.innerHTML = `
        <div class="legend-title">Score → Color</div>
        <div class="legend-bar" style="background: linear-gradient(90deg, ${cyberStops.join(",")});"></div>
        <div class="legend-labels">
          <span>${fmt(vMin ?? 0)}</span>
          <span>${fmt(vMax ?? 0)}</span>
        </div>
      `;
    })();

    // === Tooltip（2D/3D 复用同一个）===
    let tooltip = d3.select("body").select(".heatmap-tooltip");
    if (tooltip.empty()) {
      tooltip = d3.select("body").append("div").attr("class", "heatmap-tooltip");
    }
    tooltip
      .style("position", "fixed")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("padding", "10px 12px")
      .style("border-radius", "12px")
      .style("background", "rgba(30,41,59,0.92)")
      .style("color", "#fff")
      .style("font", '13px/1.35 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif')
      .style("box-shadow", "0 10px 24px rgba(0,0,0,0.16)")
      .style("z-index", 1000);

    // === Heatmap cells（仅保留方块，无任何折线/点/光晕）===
    svg.selectAll("rect.cell")
      .data(heatmapData)
      .enter()
      .append("rect")
      .attr("class", "cell")
      // ✅ 重要：把数据写进 DOM 属性，便于 `svg-interaction.js` 复制到新窗口大图后继续可交互
      .attr("data-genre", d => d.genre)
      .attr("data-month", d => d.month)
      .attr("data-value", d => d.value)
      .attr("x", d => x(d.month))
      .attr("y", d => y(d.genre))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", d => colorScale(d.value))
      .attr("stroke", gridColor)
      .attr("stroke-width", 1)
      .on("mousemove", (event, d) => {
        tooltip.style("opacity", 1).html(`<b>${d.genre}</b><br/>${d.month}<br/>Value: ${d.value}`);
        const cx = (event && typeof event.clientX === "number") ? event.clientX : (event && typeof event.pageX === "number" ? event.pageX : 0);
        const cy = (event && typeof event.clientY === "number") ? event.clientY : (event && typeof event.pageY === "number" ? event.pageY : 0);
        const node = tooltip.node();
        const w = node ? (node.offsetWidth || 0) : 0;
        const h = node ? (node.offsetHeight || 0) : 0;
        const pad = 10;
        let tx = cx + 12;
        let ty = cy - 18;
        tx = Math.max(pad, Math.min(tx, (window.innerWidth || 0) - w - pad));
        ty = Math.max(pad, Math.min(ty, (window.innerHeight || 0) - h - pad));
        tooltip.style("left", `${tx}px`).style("top", `${ty}px`);
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    console.log("✅ 2D Heatmap rendered (pure heatmap, trend lines removed)");
  };
  
  // 导出初始化函数，允许外部调用
  window.init2DHeatmap = init2DHeatmap;
  
  // 等待容器有尺寸后再执行（若容器隐藏则使用默认尺寸继续）
  const waitForContainer = () => {
    const container = document.getElementById("heatmap-2d") || document.getElementById("heatmap");
    if (!container) {
      console.error('❌ 找不到heatmap容器');
      return;
    }
    const width = container.offsetWidth || container.clientWidth;
    const height = container.offsetHeight || container.clientHeight;
    if (width > 0 && height > 0) {
      init2DHeatmap();
    } else if (container.style.display === 'none') {
      console.log('⚠️ 容器被隐藏，使用默认尺寸继续');
      init2DHeatmap();
    } else {
      setTimeout(waitForContainer, 100);
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(waitForContainer, 100);
    });
  } else {
    setTimeout(waitForContainer, 100);
  }
})();
