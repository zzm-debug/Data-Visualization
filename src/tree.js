// tree.js ✅ 轻松莫兰迪色系版（奶油白背景 + 绿/紫对调）：清晰 + 不删字 + 可缩放拖拽 + 完整交互

// 使用 Parcel 的 require 方式导入 JSON（Parcel 会自动处理）
// 注意：在 Parcel 1.x 中，require 在构建时会被处理
let treeData = null;
try {
  // Parcel 会在构建时处理 require，将 JSON 文件内容内联
  treeData = require('./assets/music_genres_full_with_scraped_info.json');
  console.log('✅ 通过 require 成功导入 JSON 数据');
} catch (e) {
  console.warn('⚠️ 无法使用 require 导入 JSON（可能文件不存在或路径错误），将使用 fetch：', e.message);
  treeData = null;
}

(() => {
  // 备用路径列表（按优先级排序）
  const DATA_URLS = [
    "./assets/music_genres_full_with_scraped_info.json",  // 相对路径（推荐）
    "assets/music_genres_full_with_scraped_info.json",     // 无前导斜杠
    "/assets/music_genres_full_with_scraped_info.json",   // 绝对路径
    "../assets/music_genres_full_with_scraped_info.json", // 上一级目录
    "/src/assets/music_genres_full_with_scraped_info.json" // src 目录
  ];

  function getSize() {
    const svgEl = document.getElementById("tree");
    if (!svgEl) {
      console.error("❌ tree.js: 找不到 #tree 元素");
      return { w: 800, h: 600 };
    }
    
    // 优先从 chart-content 获取尺寸
    const chartContent = svgEl.closest(".chart-content");
    let w = 800;
    let h = 600;
    
    if (chartContent) {
      w = chartContent.clientWidth || chartContent.offsetWidth || 800;
      h = chartContent.clientHeight || chartContent.offsetHeight || 600;
    } else {
      // 备用：从 panel-tree 获取
      const panel = document.getElementById("panel-tree");
      if (panel) {
        w = panel.clientWidth || panel.offsetWidth || 800;
        h = panel.clientHeight || panel.offsetHeight || 600;
      } else {
        // 最后备用：从 SVG 自身获取
        w = svgEl.clientWidth || svgEl.offsetWidth || 800;
        h = svgEl.clientHeight || svgEl.offsetHeight || 600;
      }
    }
    
    // 确保最小尺寸（至少要有可见区域）
    if (w < 200) {
      console.warn(`⚠️ tree.js: 宽度太小 (${w})，使用默认值 800`);
      w = 800;
    }
    if (h < 200) {
      console.warn(`⚠️ tree.js: 高度太小 (${h})，使用默认值 600`);
      h = 600;
    }
    
    console.log(`✅ tree.js: 获取尺寸 w=${w}, h=${h}`);
    return { w, h };
  }

  // ✅ 过滤门槛
  const minGrandchildCount = 5;
  const minGrandchildCountClassical = 1;
  const minGrandchildCountElectronic = 8;

  function getThreshold(categoryName, subcategoryName) {
    const name = (subcategoryName || categoryName || "").toLowerCase();
    if (name.includes("electronic") || name.includes("electro")) return minGrandchildCountElectronic;
    if (categoryName === "Classical") return minGrandchildCountClassical;
    return minGrandchildCount;
  }

  // ===== 树图三套视图（主 / 流行 / 民俗）=====
  // 主：pop + classical（你现在那张，仍用原过滤逻辑）
  // 流行：只展示「主树里被过滤掉的 Popular 子类别」，并且【每个子类别单独分配颜色】（不再整棵继承粉色）
  // 民俗：folk + traditional（来自 Traditional folk 分类；之前被“children 数量过滤”筛没了，这里不再用该过滤）
  let treeMode = "main"; // "main" | "pop" | "folkTrad"
  let lastRawData = null;

  // ✅ 顶层类别（用于图例/过滤/配色）
  // 主视图：pop + classical
  // 民俗视图：Traditional folk + Regional（严格与 JSON category 一致）
  const TOP_KEYS = ["pop", "classical", "traditionalFolk", "regional"];
  const TOP_LABEL = {
    pop: "pop",
    classical: "classical",
    traditionalFolk: "Traditional folk",
    regional: "Regional",
  };

  // ===== Popular 子类别专用配色（确定性 hash -> 鲜艳色带）=====
  const REGIONAL_KEEP_RATIO = 0.25;     // ✅ 需求：Regional 再砍一半（在已砍 50% 的基础上，相当于保留 25%）
  const REGIONAL_CHILD_KEEP_RATIO = 0.25;
  function hash01(str) {
    const s = String(str || "");
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    // [0,1)
    return ((h >>> 0) % 1000000) / 1000000;
  }

  function popSubKeyFromNode(d) {
    const sub = d?.ancestors?.().find((a) => a.depth === 2);
    const data = sub?.data || {};
    const key = String(data.__key || data.name || "(none)").trim();
    return key || "(none)";
  }

  function filterKeyFromNode(d) {
    // ✅ 主/民俗：按四大类过滤；流行：按 Popular 子类别过滤
    if (treeMode === "pop") {
      return (d && d.depth >= 2) ? popSubKeyFromNode(d) : "pop";
    }
    return getTopKeyFromNode(d);
  }

  function colorOfNode(d) {
    const topKey = getTopKeyFromNode(d);

    // ✅ 1) 主视图：Popular 下面也按子类别分色（你说的“第一张图颜色没改”就是这里）
    if (treeMode === "main" && topKey === "pop") {
      if (d && d.depth >= 2) return d3.interpolateRainbow(hash01(popSubKeyFromNode(d)));
      return neonPalette.pop;
    }

    // ✅ 2) 流行视图：全树就是 pop；depth>=2 按子类别分色
    if (treeMode === "pop") {
      if (d && d.depth >= 2) return d3.interpolateRainbow(hash01(popSubKeyFromNode(d)));
      return neonPalette.pop;
    }

    // ✅ 3) 民俗视图：如果包含 pop（从流行挪过来），也按子类别分色
    if (treeMode === "folkTrad" && topKey === "pop") {
      if (d && d.depth >= 2) return d3.interpolateRainbow(hash01(popSubKeyFromNode(d)));
      return neonPalette.pop;
    }

    // 其他：四大类固定色
    return colorScale(topKey);
  }

  function isFolkishGenre(g) {
    const name = (g?.name || "").toLowerCase();
    const details = (g?.details || "").toLowerCase();
    const s1 = (g?.scraped_info?.stylistic_origins || "").toLowerCase();
    const s2 = (g?.scraped_info?.cultural_origins || "").toLowerCase();
    // 更宽松：只要出现 folk 关键词就归为 folk
    return (name.includes("folk") || details.includes("folk") || s1.includes("folk") || s2.includes("folk"));
  }

  function getTopKeyFromNode(d) {
    if (!d) return "pop";
    const top = d.ancestors().find((a) => a.depth === 1);
    const name = ((top && top.data && top.data.name) || "").toLowerCase();
    if (name === "pop" || name.includes("popular")) return "pop";
    if (name === "classical") return "classical";
    if (name.includes("traditional folk")) return "traditionalFolk";
    if (name === "regional") return "regional";
    // 兜底：保持可视但归到 pop（不影响其他功能）
    return "pop";
  }

  function isTopLevelCategory(d) {
    return d && d.depth === 1;
  }

  function isHighlightedNode(d) {
    // 只保留最小化高亮：顶层/第二层更醒目
    return d && (d.depth === 1 || d.depth === 2);
  }

  function buildCategorySubtrees(categoryName, subcategories, opts) {
    const filterByChildren = opts?.filterByChildren !== false; // 默认 true（主树保持原过滤）

    const kept = [];
    const dropped = [];

    (subcategories || []).forEach((sc, idx) => {
      const threshold = getThreshold(categoryName, sc.subcategory);
      const subName = (sc.subcategory || "").trim(); // ✅ 空子类别：名称为空即可（不显示）
      // ✅ 关键：空子类别“名字不显示”，但为了分色/图例/过滤必须有稳定唯一 key
      // 仅对 Popular 使用（其他类别不需要）
      const subKey = (categoryName === "Popular")
        ? (subName || `__unnamed_pop_${idx}_${(sc?.genres?.[0]?.name || "x").slice(0, 18)}`)
        : subName;

      // ✅ 主树：保留原过滤逻辑（按 children 数量 + threshold）
      if (filterByChildren) {
        const genres = (sc.genres || [])
          .map((g) => ({
            name: g.name,
            children: g.children || [],
            details: g.details || "",
            scraped_info: g.scraped_info || g.extracted_info || g.extractedInfo || null
          }))
          .filter((g) => (g.children || []).length >= threshold);

        if (genres.length < threshold) {
          dropped.push(sc);
          return;
        }
        kept.push({ name: subName, __key: subKey, children: genres });
        return;
      }

      // ✅ 流行/民俗：不再用 children 数量过滤（否则传统/民俗会被筛没）
      const genresLoose = (sc.genres || [])
        .map((g) => ({
          name: g.name,
          children: g.children || [],
          details: g.details || "",
          scraped_info: g.scraped_info || g.extracted_info || g.extractedInfo || null
        }));
      if (!genresLoose.length) return;
      kept.push({ name: subName, __key: subKey, children: genresLoose });
    });

    return { kept, dropped, categoryName };
  }

  function buildMainHierarchy(raw) {
    const popular = raw.find((d) => d.category === "Popular");
    const classical = raw.find((d) => d.category === "Classical");

    const popSub = buildCategorySubtrees("Popular", popular?.subcategories || [], { filterByChildren: true });
    const classicalSub = buildCategorySubtrees("Classical", classical?.subcategories || [], { filterByChildren: true });

    return {
      root: d3.hierarchy({
        name: "Music Genres",
        children: [
          { name: "pop", children: popSub.kept },
          { name: "classical", children: classicalSub.kept },
        ],
      }),
      droppedPopularSubcategories: popSub.dropped,
    };
  }

  function buildPopularHierarchy(raw) {
    const popular = raw.find((d) => d.category === "Popular");
    // ✅ 第二张（流行）：展示 Popular 子类（但按需求去掉 rock / electronic）
    const subs = (popular?.subcategories || []).filter((sc) => {
      const s = String(sc?.subcategory || "").trim().toLowerCase();
      // 仅过滤“明确叫 rock / electronic/electro”的子类别；空子类别不受影响
      if (!s) return true;
      if (/\brock\b/.test(s)) return false;
      if (/\belectronic\b/.test(s) || /\belectro\b/.test(s)) return false;
      // ✅ 需求：把 folk / country 从第二张移到第三张
      if (/\bfolk\b/.test(s)) return false;
      if (/\bcountry\b/.test(s)) return false;
      return true;
    });
    const popTree = buildCategorySubtrees("Popular", subs, { filterByChildren: false });
    return d3.hierarchy({
      name: "Music Genres",
      children: [{ name: "pop", children: popTree.kept }],
    });
  }

  function buildFolkTradHierarchy(raw) {
    const traditional = raw.find((d) => d.category === "Traditional folk");
    const regional = raw.find((d) => d.category === "Regional");
    const popular = raw.find((d) => d.category === "Popular");

    const traditionalFolkChildren = [];
    const regionalChildren = [];
    const regionalFromRegional = [];
    const movedPopularChildren = [];

    function toSubtreeList(subcategories, originTag) {
      const out = [];
      (subcategories || []).forEach((sc, idx) => {
        const subName = (sc.subcategory || "").trim(); // 空子类仍保留但不显示名称
        const genresLoose = (sc.genres || []).map((g) => ({
          name: g.name,
          children: g.children || [],
          details: g.details || "",
          scraped_info: g.scraped_info || g.extracted_info || g.extractedInfo || null
        }));
        if (!genresLoose.length) return;
        // Regional/Traditional folk 这里不需要 __key；但保持结构一致也无妨
        out.push({ name: subName, __origin: originTag || "", children: genresLoose });
      });
      return out;
    }

    // ✅ 不做会导致缺失的过滤，保证“显示更全”
    traditionalFolkChildren.push(...toSubtreeList(traditional?.subcategories || [], "traditionalFolk"));
    regionalFromRegional.push(...toSubtreeList(regional?.subcategories || [], "regional"));

    // ✅ 需求：把第二张（流行）里的 folk / country 子类移到第三张（民俗）
    const movedSubs = (popular?.subcategories || []).filter((sc) => {
      const s = String(sc?.subcategory || "").trim().toLowerCase();
      if (!s) return false;
      return (/\bfolk\b/.test(s) || /\bcountry\b/.test(s));
    });
    if (movedSubs.length) {
      const moved = buildCategorySubtrees("Popular", movedSubs, { filterByChildren: false });
      movedPopularChildren.push(...(moved.kept || []));
    }

    // ✅ 需求：Regional 太多 → 过滤掉一半（保留“体量”更大的那一半）
    // 仅对真正 Regional 来源做裁剪；从 Popular 挪过来的保持全部保留。
    function subtreeScore(node) {
      const children = node?.children || [];
      let score = 0;
      for (const c of children) {
        score += 1;
        score += (c?.children || []).length;
      }
      // 再加一层：子节点自身数量（让“更深”的子树更容易保留）
      score += children.length * 0.25;
      return score;
    }

    const keepN = Math.max(1, Math.ceil(regionalFromRegional.length * REGIONAL_KEEP_RATIO));
    const keptRegional = regionalFromRegional
      .slice()
      .sort((a, b) => {
        const da = subtreeScore(a);
        const db = subtreeScore(b);
        if (db !== da) return db - da;
        return String(a?.name || "").localeCompare(String(b?.name || ""));
      })
      .slice(0, keepN);

    // ✅ 进一步“砍一半”：如果 Regional 子类别数量不多但每个子类别下流派很多，
    // 就对每个子类别的 children（流派列表）再做一次 50% 裁剪（保留“体量更大”的那半）
    const trimmedRegional = keptRegional.map((node) => {
      const kids = Array.isArray(node.children) ? node.children.slice() : [];
      // 按 children 数量降序，再按名称
      kids.sort((a, b) => {
        const da = (a?.children || []).length;
        const db = (b?.children || []).length;
        if (db !== da) return db - da;
        return String(a?.name || "").localeCompare(String(b?.name || ""));
      });
      const keepK = Math.max(1, Math.ceil(kids.length * REGIONAL_CHILD_KEEP_RATIO));
      return { ...node, children: kids.slice(0, keepK) };
    });

    regionalChildren.push(...trimmedRegional);

    return d3.hierarchy({
      name: "Music Genres",
      children: [
        ...(movedPopularChildren.length ? [{ name: "Popular", children: movedPopularChildren }] : []),
        { name: "Traditional folk", children: traditionalFolkChildren },
        { name: "Regional", children: regionalChildren },
      ],
    });
  }

  // ✅ 方案三：按层级固定圆点半径（更清晰）
  function rByDepth(d) {
    if (d.depth === 0) return 0;
    // pop / folkTrad 两张树更密 → 点略小一点，减少互相压住
    const dense = (treeMode === "pop" || treeMode === "folkTrad");
    if (d.depth === 1) return dense ? 13 : 14;
    if (d.depth === 2) return dense ? 8 : 9;
    // ✅ 关键：第二/第三张外圈点太密，直接把外圈点缩小，避免圆点“压住/堆叠”
    if (d.depth === 3) return dense ? 3.0 : 6;
    return dense ? 1.8 : 4;
  }

  function stretchRadialDistance(root, radius) {
    const clamp = (v) => {
      const cap = Math.max(60, (radius || 0) - 18);
      return Math.min(v, cap);
    };

    root.descendants().forEach((d) => {
      if (d.depth === 0) {
        d.y = 0;
        return;
      }

      // ✅ 第一张（主视图）：不要 clamp / 外推（会把节点拉近导致重叠）
      if (treeMode === "main") {
        if (d.depth === 1) d.y *= 1.15;
        else if (d.depth === 2) d.y *= 1.45;
        else if (d.depth === 3) d.y *= 1.85;
        else d.y *= 2.25;
        return;
      }

      // ✅ 第三张（民俗）：一级/二级节点离中心太近会互相遮挡 → 强制外推
      if (treeMode === "folkTrad") {
        if (d.depth === 1) d.y = clamp(Math.max(d.y * 2.35, 120));
        else if (d.depth === 2) d.y = clamp(Math.max(d.y * 2.05, 185));
        else if (d.depth === 3) d.y = clamp(d.y * 1.9);
        else d.y = clamp(d.y * 2.25);
        return;
      }

      // ✅ 第二张（流行）：二级类很多，中心也会挤 → 适度外推
      if (treeMode === "pop") {
        if (d.depth === 1) d.y = clamp(Math.max(d.y * 1.9, 105));
        else if (d.depth === 2) d.y = clamp(Math.max(d.y * 1.75, 160));
        else if (d.depth === 3) d.y = clamp(d.y * 1.75);
        else d.y = clamp(d.y * 2.05);
        return;
      }

      // 兜底：若未来新增模式，保持保守 clamp
      if (d.depth === 1) d.y = clamp(d.y * 1.15);
      else if (d.depth === 2) d.y = clamp(d.y * 1.45);
      else if (d.depth === 3) d.y = clamp(d.y * 1.85);
      else d.y = clamp(d.y * 2.25);
    });
  }


  // ✅ 深色科技风背景（与页面主题一致）
  // 图表背景：保持透明（背景由独立视觉层 + 面板承载）
  const CREAM_BG = "transparent";

  // ✅ 树图仅保留四类：pop / classical / folk / traditional（与你的图例一致）
  const categoryDomain = TOP_KEYS.slice();
  const neonPalette = {
    pop: "#ff3bd4",        // pop：霓虹粉
    classical: "#F59E0B",  // classical：琥珀金
    // ✅ 民俗两大类：别用灰白，保持赛博高对比
    traditionalFolk: "#a78bfa", // Traditional folk：柔紫（更“民俗/传统”）
    regional: "#32a7ff"        // Regional：电蓝（区分明显）
  };

  const colorScale = d3.scaleOrdinal()
    .domain(categoryDomain)
    .range(categoryDomain.map(k => neonPalette[k] || "#999"));

  // 文字要用到与连线一致的颜色
  function lineColorOf(d) {
    // ✅ pop 视图要跟随子类别分色；其他视图用四大类色
    return colorOfNode(d);
  }

  // 被放大的文字（顶层/高亮）用线色；其余用默认浅色
  function textFill(d) {
    return (isTopLevelCategory(d) || isHighlightedNode(d)) ? lineColorOf(d) : TEXT_COLOR;
  }

  // ✅ 深色主题下的文字颜色（浅色文字，适应深色背景）
  const TEXT_COLOR = "#e2e8f0"; // 浅色文字，与页面主题一致
  const TEXT_STROKE = "rgba(10, 14, 39, 0.85)"; // 深色描边，增强文字可读性
  const LINK_OPACITY = 0.32;
  const LINK_WIDTH = 1.6;
  const NODE_OPACITY = 0.92;

 // ---------- Legend + Filter Utilities (HTML overlay, rebuilt) ----------
const LEGEND_ALPHA_OFF = 0.22;
const disabledCategories = new Set();
const legendCollapsedByMode = { main: false, pop: true, folkTrad: false };

/** 🧮 汇总每个类别在整棵树中的节点总数（包括所有后代） */
function computeCategoryCounts(root) {
  const counts = {};

  if (treeMode === "pop") {
    // ✅ 流行视图：统计 Popular 的子类别（depth>=2）
    root.descendants().forEach((d) => {
      if (!d || d.depth < 2) return;
      const k = popSubKeyFromNode(d);
      counts[k] = (counts[k] || 0) + 1;
    });
    return counts;
  }

  categoryDomain.forEach(k => { counts[k] = 0; });
  root.descendants().forEach((d) => {
    const cat = getTopKeyFromNode(d);
    if (!counts.hasOwnProperty(cat)) counts[cat] = 0;
    counts[cat] += 1;
  });
  return counts;
}

/** 根据禁用集更新节点与连线的可见性 */
function applyCategoryFilter(svg) {
  svg.selectAll('g.node')
    .attr('display', function() {
      const cat = this.getAttribute('data-cat');
      return (cat && disabledCategories.has(cat)) ? 'none' : null;
    });

  svg.selectAll('path.link')
    .attr('display', function() {
      const cat = this.getAttribute('data-cat');
      return (cat && disabledCategories.has(cat)) ? 'none' : null;
    });
}

function popLegendDisplayLabel(k) {
  const key = String(k || "");
  // ✅ 空子类别不显示名称；避免把内部 key（__unnamed_pop_xxx）暴露到图例里
  if (!key || key === "(none)" || key.startsWith("__unnamed_pop_")) return "";
  return key;
}

function ensureTreeLegendEl() {
  const panel = document.getElementById("panel-tree");
  const host = panel?.querySelector?.(".chart-content");
  if (!host) return null;

  let el = host.querySelector(".tree-legend");
  if (!el) {
    el = document.createElement("details");
    el.className = "tree-legend";
    el.setAttribute("data-role", "tree-legend");
    el.innerHTML = `
      <summary class="tree-legend-summary" title="折叠/展开图例">
        <span class="tree-legend-caret">▾</span>
      </summary>
      <div class="tree-legend-body"></div>
    `;
    // ✅ 防止图例点击冒泡到 chart-content（否则会触发“打开新页面”）
    el.addEventListener("click", (e) => e.stopPropagation());
    el.addEventListener("mousedown", (e) => e.stopPropagation());
    el.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: true });
    host.appendChild(el);
  }

  return el;
}

function renderHtmlLegend(svg, root) {
  const el = ensureTreeLegendEl();
  if (!el) return;

  const collapsed = !!legendCollapsedByMode[treeMode];
  el.open = !collapsed;

  // 记忆折叠状态（details 原生 toggle）
  if (!el.__legendToggleBound) {
    el.__legendToggleBound = true;
    el.addEventListener("toggle", () => {
      legendCollapsedByMode[treeMode] = !el.open;
      const caret = el.querySelector(".tree-legend-caret");
      if (caret) caret.textContent = el.open ? "▾" : "▸";
    });
  }

  const caret = el.querySelector(".tree-legend-caret");
  if (caret) caret.textContent = el.open ? "▾" : "▸";

  const body = el.querySelector(".tree-legend-body");
  if (!body) return;

  const counts = computeCategoryCounts(root);
  let legendItems = [];

  if (treeMode === "pop") {
    const keys = Object.keys(counts);
    keys.sort((a, b) => (counts[b] || 0) - (counts[a] || 0));
    legendItems = keys.map((k) => ({
      key: k,
      label: popLegendDisplayLabel(k),
      color: d3.interpolateRainbow(hash01(k)),
      count: counts[k] || 0,
    }));
  } else {
    legendItems = categoryDomain
      .filter((k) => (counts[k] || 0) > 0)
      .map((k) => ({
        key: k,
        label: (treeMode === "folkTrad" && k === "pop") ? "Popular" : (TOP_LABEL[k] || k),
        color: colorScale(k),
        count: counts[k] || 0,
      }));
  }

  // 渲染 items
  body.innerHTML = legendItems.map((it) => {
    const off = disabledCategories.has(it.key);
    const labelText = it.label ? it.label : "";
    const textPart = labelText ? `<span class="tree-legend-label">${labelText}</span>` : `<span class="tree-legend-label tree-legend-label-empty"></span>`;
    return `
      <button type="button" class="tree-legend-item ${off ? "is-off" : ""}" data-key="${String(it.key).replace(/"/g, "&quot;")}" title="点击隐藏/显示；双击只显示此项">
        <span class="tree-legend-swatch" style="background:${it.color}"></span>
        ${textPart}
        <span class="tree-legend-count">(${it.count})</span>
      </button>
    `;
  }).join("");

  // 事件委托（避免每次 render 绑一堆 handler）
  if (!body.__legendBound) {
    body.__legendBound = true;
    body.addEventListener("click", (e) => {
      const btn = e.target.closest?.(".tree-legend-item");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const key = btn.getAttribute("data-key");
      if (!key) return;

      if (disabledCategories.has(key)) disabledCategories.delete(key);
      else disabledCategories.add(key);

      btn.classList.toggle("is-off", disabledCategories.has(key));
      applyCategoryFilter(svg);
    });

    body.addEventListener("dblclick", (e) => {
      const btn = e.target.closest?.(".tree-legend-item");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const key = btn.getAttribute("data-key");
      if (!key) return;

      const items = Array.from(body.querySelectorAll(".tree-legend-item"));
      const keys = items.map((b) => b.getAttribute("data-key")).filter(Boolean);
      const onlyThis = (disabledCategories.size === (keys.length - 1)) && !disabledCategories.has(key);
      if (onlyThis) disabledCategories.clear();
      else {
        disabledCategories.clear();
        keys.forEach((k) => { if (k !== key) disabledCategories.add(k); });
      }

      items.forEach((b) => {
        const k = b.getAttribute("data-key");
        b.classList.toggle("is-off", !!(k && disabledCategories.has(k)));
      });
      applyCategoryFilter(svg);
    });
  }
}


  function render(raw) {
    const svgEl = document.getElementById("tree");
    if (!svgEl) {
      console.error("❌ tree.js: render 时找不到 #tree 元素");
      return;
    }
    
    const { w, h } = getSize();
    const radius = Math.min(w, h) / 2;
    
    if (radius < 50) {
      console.error(`❌ tree.js: 尺寸太小，无法渲染 (w=${w}, h=${h}, radius=${radius})`);
      return;
    }

    const svg = d3.select("#tree");
    if (svg.empty()) {
      console.error("❌ tree.js: d3.select('#tree') 返回空");
      return;
    }
    
    svg.selectAll("*").remove();

    svg
      .attr("width", w)
      .attr("height", h)
      .attr("viewBox", `${-w / 2} ${-h / 2} ${w} ${h}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("font", "11px sans-serif")
      .style("cursor", "grab")
      .style("display", "block")
      .style("min-width", "200px")
      .style("min-height", "200px")
      .style("background", CREAM_BG);

    // ✅ 画布 g（zoom/pan 只作用在这个 g）
    const g = svg.append("g");

    // 记录 raw，方便按钮切换时复用
    lastRawData = raw;

    // 主树负责决定“哪些 Popular 子类别被过滤掉”，流行视图要复用这份 dropped 列表
    const mainBuild = buildMainHierarchy(raw);
    const droppedPopular = mainBuild.droppedPopularSubcategories || [];

    const root =
      (treeMode === "main")
        ? mainBuild.root
        : (treeMode === "pop")
          ? buildPopularHierarchy(raw)
          : buildFolkTradHierarchy(raw);

    // 同步按钮状态
    const treeBtn = document.getElementById("tree-toggle");
    if (treeBtn) {
      const textEl = treeBtn.querySelector(".toggle-text") || treeBtn;
      textEl.textContent =
        (treeMode === "main") ? "主" :
        (treeMode === "pop") ? "流行" :
        "民俗";
      treeBtn.title =
        (treeMode === "main") ? "切换到流行树" :
        (treeMode === "pop") ? "切换到民俗树" :
        "切换到主树";
    }

    if (!root.children || root.children.length === 0) {
      svg.append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", 18)
        .attr("fill", "#666")
        .text("Tree: no data after filtering");
      return;
    }

    // ✅ 第三张（民俗）外圈“更均匀”：用 cluster 让叶子角度更均匀分配；主/流行保持 tree
    const layout = (treeMode === "folkTrad") ? d3.cluster() : d3.tree();
    const tree = layout
      .size([2 * Math.PI, radius - 60])
      .separation((a, b) => {
        // 民俗：不要用过大的 separation（会制造大空隙），保持更均匀
        if (treeMode === "folkTrad") return (a.parent === b.parent) ? 1.15 : 1.55;
        // 流行：保留你之前的分散程度
        if (treeMode === "pop") {
          if (a.depth <= 2 && b.depth <= 2) return 3.0;
          return (a.parent === b.parent) ? 1.5 : 2.1;
        }
        return (a.parent === b.parent) ? 1.0 : 1.6;
      });
    tree(root);
    stretchRadialDistance(root, radius);

    // ✅ 连线
    g.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", LINK_OPACITY)
      .attr("stroke-width", LINK_WIDTH)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("data-cat", (d) => filterKeyFromNode(d.target))
      .attr("stroke", (d) => colorOfNode(d.target))
      .attr("d", d3.linkRadial().angle((d) => d.x).radius((d) => d.y));

    // ✅ 节点
    const node = g.append("g")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("data-cat", (d) => filterKeyFromNode(d))
      .attr("transform", (d) => `
        rotate(${(d.x * 180) / Math.PI - 90})
        translate(${d.y},0)
      `);

    // ✅ 创建 tooltip
    let tooltip = d3.select("body").select(".tree-tooltip");
    if (tooltip.empty()) {
      tooltip = d3.select("body")
        .append("div")
        .attr("class", "tree-tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("padding", "12px 14px")
        .style("border-radius", "12px")
        .style("background", "rgba(15, 23, 42, 0.95)")
        .style("color", "#e2e8f0")
        .style("font", "13px/1.4 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif")
        .style("opacity", 0)
        .style("backdrop-filter", "blur(6px)")
        .style("z-index", 1000)
        .style("border", "1px solid rgba(88, 101, 242, 0.5)");
    }

    // ✅ 节点 hover 交互 - 绑定到整个node组，这样circle和text都能响应
    node
      .style("cursor", "pointer")
      .on("mouseenter", function(event, d) {
        if (d.depth === 0) return;
        
        const ancestors = d.ancestors();
        const category = ancestors.length > 1 ? ancestors[1].data.name : "";
        const subcategory = ancestors.length > 2 ? ancestors[2].data.name : "";
        const scrapedInfo = d.data.scraped_info || {};
        const location = scrapedInfo.location || null;
        const years = scrapedInfo.years || [];
        const culturalOrigins = scrapedInfo.cultural_origins || null;
        const stylisticOrigins = scrapedInfo.stylistic_origins || null;
        
        let html = `<div style="font-weight:800;margin-bottom:6px;letter-spacing:.3px">${d.data.name}</div>`;
        
        if (d.depth === 1) {
          html += `<div style="opacity:.92">类别：${category}</div>`;
        } else if (d.depth === 2) {
          html += `<div style="opacity:.92">类别：${category}</div>`;
          // ✅ 子类别为空时不展示“子类别：”
          if (subcategory) html += `<div style="opacity:.92">子类别：${subcategory}</div>`;
        } else if (d.depth >= 3) {
          html += `<div style="opacity:.92">类别：${category}</div>`;
          if (subcategory) {
            html += `<div style="opacity:.92">子类别：${subcategory}</div>`;
          }
          html += `<div style="opacity:.92">流派：${d.data.name}</div>`;
        }
        
        if (years && years.length > 0) {
          const yearStr = years.length === 1 ? years[0] : 
                         years.length === 2 ? `${years[0]} - ${years[1]}` : 
                         `${years[0]} - ${years[years.length - 1]}`;
          html += `<div style="opacity:.92;margin-top:6px">时间：${yearStr}</div>`;
        } else if (culturalOrigins) {
          const yearMatch = culturalOrigins.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/);
          if (yearMatch) {
            html += `<div style="opacity:.92;margin-top:6px">时间：${culturalOrigins}</div>`;
          }
        }
        
        if (location) {
          html += `<div style="opacity:.92">地点：${location}</div>`;
        }
        
        if (culturalOrigins && !years.length) {
          html += `<div style="opacity:.92">文化起源：${culturalOrigins}</div>`;
        }
        
        if (stylisticOrigins) {
          html += `<div style="opacity:.92">风格起源：${stylisticOrigins}</div>`;
        }
        
        if (d.children && d.children.length > 0) {
          html += `<div style="opacity:.70;margin-top:6px">子节点数：${d.children.length}</div>`;
        }
        
        // 高亮当前节点
        d3.select(this).select("circle")
          .attr("stroke-width", 2.5)
          .attr("stroke", "#5865f2");
        
        tooltip
          .style("opacity", 1)
          .html(html);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 14) + "px")
          .style("top", (event.pageY + 14) + "px");
      })
      .on("mouseleave", function(event, d) {
        // 恢复原始样式
        d3.select(this).select("circle")
          .attr("stroke-width", 1)
          .attr("stroke", "rgba(226, 232, 240, 0.6)"); // 浅色描边，适应深色背景
        tooltip.style("opacity", 0);
      });

    node.append("circle")
      .attr("r", rByDepth)
      .attr("fill", (d) => colorOfNode(d))
      .attr("fill-opacity", NODE_OPACITY)
      .attr("stroke", "rgba(226, 232, 240, 0.6)") // 浅色描边，适应深色背景
      .attr("stroke-width", 1);

    // ✅ 文字：恢复为“全名显示”（撤销上一步的隐藏/截断）
    const baseFont = 8;
    const midFont = 13;
    const bigFont = 16;

    node.append("text")
  .attr("class", "genre-label")
  .attr("dy", "0.31em")
  .attr("x", (d) => {
    const offset = 10 + d.depth * 6;
    return d.x < Math.PI === !d.children ? offset : -offset;
  })
  .attr("text-anchor", (d) =>
    d.x < Math.PI === !d.children ? "start" : "end"
  )
  .attr("transform", (d) =>
    d.x >= Math.PI ? "rotate(180)" : null
  )
  .attr("font-size", (d) => {
    if (isTopLevelCategory(d)) return `${bigFont}px`;
    if (isHighlightedNode(d)) return `${midFont}px`;
    return `${baseFont}px`;
  })
  .attr("font-weight", (d) =>
    isTopLevelCategory(d) ? "750" : (isHighlightedNode(d) ? "650" : "450")
  )
  // 关键：用行内样式并加 !important，避免被外部 CSS 覆盖
  .attr("style", (d) => `fill: ${textFill(d)} !important;`)
  .text((d) => (d.depth === 0 ? "" : d.data.name))
  // 克隆一份做描边阴影
  .clone(true)
  .lower()
  .attr("stroke", TEXT_STROKE)
  .attr("stroke-width", 0.8)
  // 再保险：把克隆文本的填充也锁定（防止某些全局样式影响）
  .attr("style", (d) => `fill: ${textFill(d)} !important;`);

    // ✅ 缩放 + 拖拽
    const zoom = d3.zoom()
      .scaleExtent([0.45, 7])
      .on("start", () => svg.style("cursor", "grabbing"))
      .on("end", () => svg.style("cursor", "grab"))
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.scale(0.95));

    // ✅ 图例（重做）：使用 HTML overlay（不再画 SVG legend，避免“点图例也打开新页面”）
    renderHtmlLegend(svg, root);

    console.log("✅ tree 绘制完成（奶油白背景 + 紫色偏好）");
  }

  // 尝试加载数据的函数（支持多个备用路径）
  function loadData() {
    // 如果已经有通过 require 导入的数据，直接使用
    if (treeData && Array.isArray(treeData)) {
      console.log("✅ tree 数据加载成功（通过 require），数据条数：", treeData.length);
      return Promise.resolve(treeData);
    }
    
    // 否则尝试 fetch
    return tryFetchData();
  }
  
  // 尝试多个路径加载数据
  function tryFetchData() {
    console.log("✅ tree.js: 开始尝试加载数据...");
    
    function tryUrl(index) {
      if (index >= DATA_URLS.length) {
        throw new Error("所有路径都尝试失败");
      }
      
      const url = DATA_URLS[index];
      console.log(`📡 尝试路径 ${index + 1}/${DATA_URLS.length}: ${url}`);
      
      return d3.json(url)
        .then(raw => {
          // 检查返回的是否是 HTML（404 页面）
          if (typeof raw === 'string' || (raw && raw.documentElement)) {
            throw new Error(`路径 ${url} 返回了 HTML 而不是 JSON`);
          }
          
          if (!raw || !Array.isArray(raw)) {
            throw new Error(`路径 ${url} 返回的数据格式错误`);
          }
          
          console.log(`✅ tree 数据加载成功（路径: ${url}），数据条数：`, raw.length);
          return raw;
        })
        .catch(err => {
          console.warn(`❌ 路径 ${url} 失败:`, err.message);
          // 尝试下一个路径
          return tryUrl(index + 1);
        });
    }
    
    return tryUrl(0);
  }
  
  // 等待 DOM 加载完成
  function init() {
    const svgEl = document.getElementById("tree");
    if (!svgEl) {
      console.warn("⚠️ tree.js: DOM 未就绪，等待 100ms 后重试...");
      setTimeout(init, 100);
      return;
    }
    
    loadData()
      .then((raw) => {
        render(raw);

        // ✅ 树图切换按钮（两张树）
        const treeBtn = document.getElementById("tree-toggle");
        if (treeBtn && !treeBtn.__treeBound) {
          treeBtn.__treeBound = true;
          treeBtn.addEventListener("click", (e) => {
            e?.stopPropagation?.();
            treeMode = (treeMode === "main") ? "pop" : (treeMode === "pop") ? "folkTrad" : "main";
            // ✅ 切换视图时清空过滤状态，避免“看起来少了一截”
            disabledCategories.clear();
            if (lastRawData) render(lastRawData);
          });
        }

        window.addEventListener("resize", () => {
          setTimeout(() => render(raw), 100);
        });
      })
      .catch((err) => {
        console.error("❌ tree 数据加载失败：所有路径都尝试失败", err);
        const svg = d3.select("#tree");
        if (!svg.empty()) {
          svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", 0)
            .attr("font-size", 14)
            .attr("fill", "#ff4444")
            .text(`数据加载失败，请检查文件路径`);
        }
      });
  }
  
  // 如果 DOM 已加载，立即执行；否则等待
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // DOM 已加载，但可能 SVG 元素还没创建，延迟一下
    setTimeout(init, 50);
  }
})();

  
