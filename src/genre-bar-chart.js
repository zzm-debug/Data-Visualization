// genre-bar-chart.js - Cyber style genre bar chart (SVG)
// v2: 将单列 TopN 改为左右双面布局（左 15 + 右 15），避免标签/文字拥挤重叠
// 目标：避免 fetch 静态资源在 Parcel build 后丢失/路径变化导致的“数据加载失败”
// 做法：优先使用 Parcel 的 require 将 JSON 打进 bundle；失败时再 fallback 到 fetch 多路径尝试。

(() => {
  'use strict';

  const SVG_ID = 'genre-bar-svg';

  // 1) 优先：Parcel 在构建时处理 require，把 JSON 内容打包进 JS
  /** @type {any|null} */
  let bundledData = null;
  try {
    // 注意：这里的相对路径以本文件所在目录为基准（src/）
    bundledData = require('./assets/所有歌单_风格统计.json');
    console.log('✅ genre-bar-chart: 通过 require 成功导入 JSON 数据');
  } catch (e) {
    console.warn('⚠️ genre-bar-chart: require 导入失败，将尝试 fetch：', e && e.message ? e.message : e);
    bundledData = null;
  }

  // 2) fetch 兜底：兼容不同部署路径（根目录/子目录/直接访问 src）
  const DATA_URLS = [
    './assets/所有歌单_风格统计.json',
    'assets/所有歌单_风格统计.json',
    '/assets/所有歌单_风格统计.json',
    '/src/assets/所有歌单_风格统计.json'
  ];

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

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function ellipsize(str, maxLen) {
    const s = (str ?? '').toString();
    if (!maxLen || maxLen <= 0) return s;
    if (s.length <= maxLen) return s;
    return s.slice(0, Math.max(0, maxLen - 1)) + '…';
  }

  async function fetchFirstOk(urls) {
    let lastErr = null;
    for (const u of urls) {
      try {
        const url = encodeURI(u);
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return await res.json();
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error('fetch failed');
  }

  async function loadData() {
    if (bundledData) return bundledData;
    return await fetchFirstOk(DATA_URLS);
  }

  function getSize(svgNode) {
    const container = svgNode.closest('.chart-content') || svgNode.parentElement;
    const w = (container && container.clientWidth) || 800;
    const h = (container && container.clientHeight) || 420;
    return { w: Math.max(320, w), h: Math.max(220, h) };
  }

  function render(data) {
    const svgSel = d3.select(`#${SVG_ID}`);
    const svgNode = svgSel.node();
    if (!svgNode) return;

    const { w: cw, h: ch } = getSize(svgNode);
    svgSel.selectAll('*').remove();

    const accentViolet = cssVar('--accent-violet', '#7c3aed');
    const accentPink = cssVar('--accent-pink', '#ff3bd4');
    const accentBlue = cssVar('--accent-blue', '#32a7ff');
    const axisText = cssVar('--axis-text-strong', 'rgba(226, 232, 240, 0.88)');
    const axisLine = cssVar('--axis-line', 'rgba(50, 167, 255, 0.28)');
    const grid = cssVar('--axis-grid', 'rgba(50, 167, 255, 0.12)');

    const entriesAll = Object.entries((data && data.all_genres) || {})
      .map(([k, v]) => ({ name: k, value: +v }))
      .filter(d => d.name && Number.isFinite(d.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, 30);

    if (entriesAll.length === 0) {
      svgSel.append('text')
        .attr('x', 16)
        .attr('y', 28)
        .attr('fill', axisText)
        .style('font', '14px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif')
        .text('数据为空：无法渲染柱状图');
      return;
    }

    // Layout: 两面并排（每面 15 条），各自 y 轴，统一 x 尺度
    const width = cw;
    const height = ch;
    // 小图模式：尽量减少四周留白，让图表“整体大一圈”
    const outer = {
      top: 10,
      right: 10,
      bottom: 26,
      left: 10
    };
    const gutter = clamp(Math.floor(width * 0.04), 12, 24); // 两面之间留白（缩小一点）
    const innerW = Math.max(10, width - outer.left - outer.right);
    const innerH = Math.max(10, height - outer.top - outer.bottom);
    const panelW = Math.max(10, (innerW - gutter) / 2);

    svgSel
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('background', 'transparent');

    // defs: glow + gradient
    const defs = svgSel.append('defs');

    const glow = defs.append('filter').attr('id', 'barGlow');
    glow.append('feGaussianBlur').attr('stdDeviation', '2.2').attr('result', 'blur');
    const m = glow.append('feMerge');
    m.append('feMergeNode').attr('in', 'blur');
    m.append('feMergeNode').attr('in', 'SourceGraphic');

    const grad = defs.append('linearGradient')
      .attr('id', 'barGrad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', accentViolet).attr('stop-opacity', 0.90);
    grad.append('stop').attr('offset', '55%').attr('stop-color', accentBlue).attr('stop-opacity', 0.86);
    grad.append('stop').attr('offset', '100%').attr('stop-color', accentPink).attr('stop-opacity', 0.78);

    // subtle background hint (very low opacity)
    svgSel.append('rect')
      .attr('x', 8).attr('y', 8)
      .attr('width', width - 16).attr('height', height - 16)
      .attr('rx', 12).attr('ry', 12)
      .attr('fill', 'rgba(7, 3, 18, 0.10)')
      .attr('stroke', rgba(accentBlue, 0.14));

    const entriesLeft = entriesAll.slice(0, 15);
    const entriesRight = entriesAll.slice(15, 30);

    const xMax = d3.max(entriesAll, d => d.value) || 1;
    const x = d3.scaleLinear()
      .domain([0, xMax * 1.08])
      .range([0, 1]) // placeholder，下面按 panelInnerW 重新 set range
      .nice();

    // 字体：缩小类别名与数字（x 轴刻度 + 条形数值）
    const axisFontSize = 12;      // x 轴刻度数字
    const categoryFontSize = 10;  // y 轴类别名（流派名）
    const valueFontSize = 11;     // 条形末端数值
    const titleFontSize = 12;     // 面板小标题（前 1–15 / 前 16–30）
    const axisStrokeWidth = 2.4;  // 坐标轴/刻度线更粗
    const tickSize = 12;          // 刻度线更长
    const xTicks = clamp(Math.round(panelW / 120), 3, 6);
    const xAxisFactory = (xScale) => (
      d3.axisBottom(xScale)
        .ticks(xTicks)
        .tickSizeInner(tickSize)
        .tickSizeOuter(0)
        .tickFormat(d3.format('~s'))
    );

    function applyAxisStyle(sel, fontSizePx) {
      sel.selectAll('path, line')
        .attr('stroke', axisLine)
        .attr('stroke-width', axisStrokeWidth);
      sel.selectAll('text')
        .attr('fill', axisText)
        .style('font', `${fontSizePx}px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif`)
        .style('paint-order', 'stroke')
        .style('stroke', 'rgba(7, 3, 18, 0.72)')
        .style('stroke-width', '2px')
        .style('stroke-linejoin', 'round');
    }

    function drawPanel(panelRoot, entries, titleText) {
      const labelMax = clamp(Math.floor(panelW / 16), 6, 10); // 控制 y 轴标签长度，避免挤压
      const margin = {
        top: 10,
        right: 10,
        bottom: 22,
        left: clamp(Math.floor(panelW * 0.38), 100, 160)
      };
      const w = panelW;
      const h = innerH;
      const panelInnerW = Math.max(10, w - margin.left - margin.right);
      const panelInnerH = Math.max(10, h - margin.top - margin.bottom);

      const gx = x.copy().range([0, panelInnerW]);
      const y = d3.scaleBand()
        .domain(entries.map(d => d.name))
        .range([0, panelInnerH])
        .padding(0.22);

      // 标题（可选，不影响交互）
      panelRoot.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', cssVar('--axis-text', 'rgba(226, 232, 240, 0.78)'))
        .style('font', `${titleFontSize}px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif`)
        .style('opacity', 0.85)
        .text(titleText);

      const g = panelRoot.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      // grid
      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisBottom(gx).ticks(xTicks).tickSize(panelInnerH).tickFormat(''))
        .selectAll('line')
        .attr('stroke', grid)
        .attr('stroke-width', 1);
      g.select('.grid').select('path').attr('stroke', 'none');

      // axes
      const xAxis = xAxisFactory(gx);
      const yAxis = d3.axisLeft(y)
        .tickSizeInner(tickSize)
        .tickSizeOuter(0)
        .tickFormat(d => ellipsize(d, labelMax));

      const xAxisG = g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${panelInnerH})`)
        .call(xAxis);

      const yAxisG = g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

      applyAxisStyle(xAxisG, axisFontSize);
      applyAxisStyle(yAxisG, categoryFontSize);

      // bars
      const barH = Math.max(10, y.bandwidth());
      const row = g.selectAll('.row')
        .data(entries, d => d.name)
        .enter()
        .append('g')
        .attr('class', 'row')
        .attr('transform', d => `translate(0,${y(d.name)})`);

      row.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', barH)
        .attr('width', d => gx(d.value))
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('fill', 'url(#barGrad)')
        .attr('opacity', 0.90)
        .attr('filter', 'url(#barGlow)');

      // end-cap highlight
      row.append('rect')
        .attr('x', d => Math.max(0, gx(d.value) - 10))
        .attr('y', 0)
        .attr('height', barH)
        .attr('width', 10)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('fill', rgba(accentPink, 0.22));

      // values
      row.append('text')
        .attr('x', d => clamp(gx(d.value) + 8, 6, panelInnerW - 6))
        .attr('y', barH / 2 + 1)
        .attr('dominant-baseline', 'middle')
        .attr('fill', cssVar('--axis-text', 'rgba(226, 232, 240, 0.78)'))
        .style('font', `${valueFontSize}px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif`)
        .style('paint-order', 'stroke')
        .style('stroke', 'rgba(7, 3, 18, 0.68)')
        .style('stroke-width', '2px')
        .style('stroke-linejoin', 'round')
        .text(d => d3.format(',')(d.value));

      // hover (subtle)
      row.on('mouseenter', function () {
        d3.select(this).select('rect').transition().duration(120).attr('opacity', 1);
      }).on('mouseleave', function () {
        d3.select(this).select('rect').transition().duration(160).attr('opacity', 0.90);
      });
    }

    // 仅移动柱状图整体位置（向左/向下）：按需微调这两个值
    const BAR_SHIFT_X = -10; // <0 向左
    const BAR_SHIFT_Y = 12;  // >0 向下

    const panels = svgSel.append('g')
      .attr('transform', `translate(${outer.left + BAR_SHIFT_X},${outer.top + BAR_SHIFT_Y})`);

    const leftRoot = panels.append('g').attr('transform', `translate(0,0)`);
    const rightRoot = panels.append('g').attr('transform', `translate(${panelW + gutter},0)`);

    drawPanel(leftRoot, entriesLeft, '前 1–15');
    if (entriesRight.length > 0) {
      drawPanel(rightRoot, entriesRight, '前 16–30');
    } else {
      rightRoot.append('text')
        .attr('x', 0)
        .attr('y', 14)
        .attr('fill', axisText)
        .style('font', '12px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif')
        .style('opacity', 0.85)
        .text('前 16–30（数据不足）');
    }
  }

  let timer = 0;
  function scheduleRender(data) {
    clearTimeout(timer);
    timer = setTimeout(() => render(data), 80);
  }

  async function init() {
    const svgNode = document.getElementById(SVG_ID);
    if (!svgNode) return;

    try {
      const data = await loadData();
      render(data);
      window.addEventListener('resize', () => scheduleRender(data), { passive: true });
    } catch (e) {
      console.error('❌ genre-bar-chart 加载失败:', e);
      d3.select(`#${SVG_ID}`).selectAll('*').remove();
      d3.select(`#${SVG_ID}`)
        .append('text')
        .attr('x', 16)
        .attr('y', 28)
        .attr('fill', cssVar('--axis-text-strong', 'rgba(226, 232, 240, 0.88)'))
        .style('font', '14px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif')
        .text('柱状图数据加载失败（请确认 assets/所有歌单_风格统计.json 可访问）');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


