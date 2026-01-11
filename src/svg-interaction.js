// ==============================
// SVG 交互功能：hover 放大 + 点击新窗口打开（保留交互功能）
// ==============================
(function() {
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
    const chartPanels = [
      { id: 'panel-tree', svgSelector: '#tree', title: 'Genre Hierarchy', type: 'tree' },
      { id: 'panel-bubble', svgSelector: '#bubble-svg', title: 'Impact Bubbles', type: 'bubble' },
      { id: 'panel-map', svgSelector: '#map svg', title: 'Geographic Distribution', type: 'map' },
      { id: 'panel-heatmap', svgSelector: '#heatmap-3d svg, #heatmap-2d svg', title: 'Trend Heatmap', type: 'heatmap' },
      // 词云由 JS 渲染为 SVG（不再是 IMG）
      { id: 'panel-img-1', svgSelector: '#wordcloud svg', title: 'Word Cloud Analysis', type: 'wordcloud' },
      // 原本是图片柱状图，现改为 SVG（支持点击放大/新窗口）
      { id: 'panel-img-2', svgSelector: '#genre-bar-svg', title: 'Statistical Ranking', type: 'bar' }
    ];

    chartPanels.forEach(panel => {
      // 延迟设置，等待 SVG/图片加载完成
      if (panel.type === 'image') {
        // 图片需要等待加载完成
        const panelEl = document.getElementById(panel.id);
        if (panelEl) {
          const img = panelEl.querySelector('img');
          if (img) {
            if (img.complete) {
              // 图片已加载
              setTimeout(() => {
                setupImagePanelInteraction(panel.id, panel.imgSelector, panel.title);
              }, 100);
            } else {
              // 等待图片加载完成
              img.addEventListener('load', function() {
                setTimeout(() => {
                  setupImagePanelInteraction(panel.id, panel.imgSelector, panel.title);
                }, 100);
              });
              // 如果加载失败，也尝试设置（可能图片路径有问题）
              img.addEventListener('error', function() {
                setTimeout(() => {
                  setupImagePanelInteraction(panel.id, panel.imgSelector, panel.title);
                }, 100);
              });
            }
          } else {
            // 如果找不到图片，延迟后重试
            setTimeout(() => {
              setupImagePanelInteraction(panel.id, panel.imgSelector, panel.title);
            }, 1000);
          }
        }
      } else {
        setTimeout(() => {
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
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          // 检查是否有新的 SVG 被添加
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              const svg = node.tagName === 'svg' ? node : node.querySelector('svg');
              if (svg) {
                const panel = svg.closest('.chart-panel');
                if (panel) {
                  const chartContent = panel.querySelector('.chart-content');
                  if (chartContent && !chartContent.hasAttribute('data-interaction-setup')) {
                    const panelId = panel.id;
                    const title = panel.querySelector('.panel-header')?.textContent?.trim() || 'Chart';
                    let type = 'default';
                    // ✅ 先检查更具体的类型（heatmap 包含 'map'，所以要先检查）
                    if (panelId.includes('heatmap')) type = 'heatmap';
                    else if (panelId.includes('tree')) type = 'tree';
                    else if (panelId.includes('bubble')) type = 'bubble';
                    else if (panelId.includes('map')) type = 'map';
                    setupPanelInteraction(panelId, `#${panelId} svg`, title, type);
                  }
                }
              }
            }
          });
        }
      });
    });

    // 观察所有图表面板
    document.querySelectorAll('.chart-panel').forEach(panel => {
      observer.observe(panel, { childList: true, subtree: true });
    });
  }

  function setupPanelInteraction(panelId, svgSelector, title, type) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const chartContent = panel.querySelector('.chart-content');
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
    chartContent.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 8px 32px rgba(88, 101, 242, 0.4)';
      this.style.zIndex = '100';
    });

    chartContent.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
      this.style.zIndex = '1';
    });

    // 点击在新窗口打开 SVG
    chartContent.addEventListener('click', function(e) {
      // 如果点击的是按钮或其他交互元素，不触发
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
      }
      // ✅ 热力图注释：属于面板内交互控件，禁止触发“点击打开大图”
      // 典型命中：<details class="hm-anno"> / <summary>
      if (
        e.target.closest?.('.hm-anno') ||
        e.target.closest?.('.tree-legend') ||
        e.target.tagName === 'DETAILS' ||
        e.target.tagName === 'SUMMARY'
      ) {
        return;
      }

      openSvgInNewWindow(svgSelector, title, type);
    });

    // 添加提示文字
    addHintText(chartContent, title);
  }

  function setupImagePanelInteraction(panelId, imgSelector, title) {
    const panel = document.getElementById(panelId);
    if (!panel) {
      console.warn(`未找到面板: ${panelId}`);
      return;
    }

    const chartContent = panel.querySelector('.chart-content');
    if (!chartContent) {
      console.warn(`未找到 chart-content: ${panelId}`);
      return;
    }

    // 查找图片元素（使用更通用的选择器）
    const img = chartContent.querySelector('img.chart-img') || chartContent.querySelector('img');
    if (!img) {
      console.warn(`未找到图片元素: ${panelId}`);
      return;
    }

    // 避免重复设置
    if (chartContent.hasAttribute('data-interaction-setup')) {
      console.log(`图片交互已设置: ${panelId}`);
      return;
    }
    chartContent.setAttribute('data-interaction-setup', 'true');

    console.log(`✅ 设置图片交互: ${panelId}, 图片: ${img.src}`);

    // 添加 hover 放大效果
    chartContent.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    chartContent.style.cursor = 'pointer';
    chartContent.style.position = 'relative';
    chartContent.style.zIndex = '1';
    chartContent.style.overflow = 'hidden';

    // Hover 效果
    chartContent.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 8px 32px rgba(88, 101, 242, 0.4)';
      this.style.zIndex = '100';
    });

    chartContent.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
      this.style.zIndex = '1';
    });

    // 点击在新窗口打开图片
    chartContent.addEventListener('click', function(e) {
      // 如果点击的是按钮或其他交互元素，不触发
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
      }
      // ✅ 防止未来图片面板也加类似注释控件后误触发打开
      if (
        e.target.closest?.('.hm-anno') ||
        e.target.closest?.('.tree-legend') ||
        e.target.tagName === 'DETAILS' ||
        e.target.tagName === 'SUMMARY'
      ) {
        return;
      }

      // 获取图片的实际路径（处理相对路径）
      let imageSrc = img.src;
      // 如果是相对路径，转换为绝对路径
      if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('data:')) {
        // 已经是绝对路径或 data URL
      } else {
        // 相对路径，使用当前页面的 base URL
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
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

    const hint = document.createElement('div');
    hint.className = 'svg-hint';
    hint.innerHTML = '💡 悬停放大 | 点击查看大图';
    hint.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(15, 23, 42, 0.9);
      color: #e2e8f0;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 11px;
      pointer-events: none;
      z-index: 10;
      border: 1px solid rgba(88, 101, 242, 0.5);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    container.appendChild(hint);

    // 鼠标悬停时显示提示
    container.addEventListener('mouseenter', function() {
      hint.style.opacity = '1';
    });

    container.addEventListener('mouseleave', function() {
      hint.style.opacity = '0';
    });
  }

  function openSvgInNewWindow(svgSelector, title, type) {
    // ✅ 调试：确认 type 参数
    console.log('📝 [openSvgInNewWindow] 接收到的类型:', type, '选择器:', svgSelector);
    
    // 查找 SVG 元素（支持多个选择器，取第一个存在的）
    const selectors = svgSelector.split(',').map(s => s.trim());
    let svgElement = null;

    // ✅ 热力图：必须按“当前可见”的容器优先选择（否则 querySelector 会先命中隐藏的 3D SVG）
    if (type === 'heatmap') {
      const container3D = document.querySelector('#heatmap-3d');
      const container2D = document.querySelector('#heatmap-2d');

      const isVisible = (el) => {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      };

      const is2DVisible = isVisible(container2D);
      const is3DVisible = isVisible(container3D);

      console.log('📊 容器可见性检查(用于新窗口打开):', {
        '2D容器存在': !!container2D,
        '2D容器显示': is2DVisible,
        '3D容器存在': !!container3D,
        '3D容器显示': is3DVisible
      });

      const pickSvgIf2D = (container) => {
        if (!container) return null;
        const svg = container.querySelector('svg');
        if (!svg) return null;
        const rectCells = svg.querySelectorAll('rect.cell');
        const cellGroups = svg.querySelectorAll('g[class*="cell-group"]');
        return rectCells.length > 0 && cellGroups.length === 0 ? svg : null;
      };

      const pickSvgIf3D = (container) => {
        if (!container) return null;
        const svg = container.querySelector('svg');
        if (!svg) return null;
        const cellGroups = svg.querySelectorAll('g[class*="cell-group"]');
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
      for (const selector of selectors) {
        svgElement = document.querySelector(selector);
        if (svgElement && svgElement.tagName && svgElement.tagName.toUpperCase() === 'SVG') {
          console.log(`✅ 找到 SVG: ${selector}`);
          break;
        } else if (svgElement) {
          // 如果不是SVG，继续查找
          svgElement = null;
        }
      }
    }
    
    // 如果没找到，尝试在热力图容器中查找
    if (!svgElement && type === 'heatmap') {
      console.log('🔍 热力图：在选择器中未找到SVG，尝试在容器中查找...');
      const container3D = document.querySelector('#heatmap-3d');
      const container2D = document.querySelector('#heatmap-2d');
      
      // ✅ 优先查找当前显示的容器（2D优先，因为用户可能切换到了2D）
      // 使用 getComputedStyle 检查实际显示状态（包括CSS类设置的display）
      const is2DVisible = container2D && window.getComputedStyle(container2D).display !== 'none';
      const is3DVisible = container3D && window.getComputedStyle(container3D).display !== 'none';
      
      console.log('📊 容器状态检查:', {
        '2D容器存在': !!container2D,
        '2D容器显示': is2DVisible,
        '2D容器内联样式': container2D ? container2D.style.display : 'N/A',
        '2D容器计算样式': container2D ? window.getComputedStyle(container2D).display : 'N/A',
        '3D容器存在': !!container3D,
        '3D容器显示': is3DVisible,
        '3D容器内联样式': container3D ? container3D.style.display : 'N/A',
        '3D容器计算样式': container3D ? window.getComputedStyle(container3D).display : 'N/A'
      });
      
      // ✅ 修复：严格按照显示状态和内容类型选择SVG
      if (is2DVisible) {
        const svg2D = container2D.querySelector('svg');
        if (svg2D) {
          // ✅ 严格验证：必须是2D热力图（有rect.cell且没有cell-group）
          const rectCells = svg2D.querySelectorAll('rect.cell');
          const cellGroups = svg2D.querySelectorAll('g[class*="cell-group"]');
          const isActually2D = rectCells.length > 0 && cellGroups.length === 0;
          
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
      if (!svgElement && is3DVisible) {
        const svg3D = container3D.querySelector('svg');
        if (svg3D) {
          // ✅ 验证：必须是3D热力图（有cell-group）
          const cellGroups = svg3D.querySelectorAll('g[class*="cell-group"]');
          if (cellGroups.length > 0) {
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
        if (container2D) {
          const svg2D = container2D.querySelector('svg');
          if (svg2D) {
            const rectCells = svg2D.querySelectorAll('rect.cell');
            const cellGroups = svg2D.querySelectorAll('g[class*="cell-group"]');
            if (rectCells.length > 0 && cellGroups.length === 0) {
              svgElement = svg2D;
              console.log('✅ 选择2D热力图SVG（隐藏容器）');
            }
          }
        }
        
        // 再尝试3D（隐藏的）
        if (!svgElement && container3D) {
          const svg3D = container3D.querySelector('svg');
          if (svg3D) {
            const cellGroups = svg3D.querySelectorAll('g[class*="cell-group"]');
            if (cellGroups.length > 0) {
              svgElement = svg3D;
              console.log('✅ 选择3D热力图SVG（隐藏容器）');
            }
          }
        }
      }
    }
    
    if (!svgElement) {
      console.error(`❌ 未找到 SVG: ${svgSelector}, type: ${type}`);
      // 输出调试信息
      selectors.forEach(sel => {
        const el = document.querySelector(sel);
        console.log(`  - 选择器 "${sel}": ${el ? (el.tagName || '未知') : '未找到'}`);
      });
      return;
    }

    // 在克隆前，将数据存储到 data 属性中
    // 对于地图，先触发一次所有元素的 mouseenter 以确保数据被存储
    if (type === 'map') {
      d3.select(svgElement).selectAll('path').each(function() {
        const path = d3.select(this);
        const d = path.datum();
        if (d && d.properties) {
          // 触发一次 mouseenter 事件，让 script.js 存储数据
          const event = new MouseEvent('mouseenter', { bubbles: true });
          this.dispatchEvent(event);
        }
      });
      // 等待事件处理完成
      setTimeout(() => {
        storeDataInAttributes(svgElement, type);
        proceedWithNewWindow();
      }, 100);
      return;
    } else if (type === 'heatmap') {
      // 热力图需要等待数据存储完成
      console.log('🔍 开始存储热力图数据...');
      storeDataInAttributes(svgElement, type);
      // 给一点时间确保数据属性被设置
      setTimeout(() => {
        console.log('✅ 热力图数据存储完成，准备打开新窗口');
        proceedWithNewWindow();
      }, 100);
    } else {
      storeDataInAttributes(svgElement, type);
      proceedWithNewWindow();
    }
    
    function proceedWithNewWindow() {

      // 克隆 SVG（深拷贝，包含所有子元素和属性）
      const clonedSvg = svgElement.cloneNode(true);
      
      // 确保 SVG 有正确的尺寸和命名空间（重要：防止被识别为图片）
      const svgWidth = svgElement.getAttribute('width') || svgElement.clientWidth || 1200;
      const svgHeight = svgElement.getAttribute('height') || svgElement.clientHeight || 800;
      const viewBox = svgElement.getAttribute('viewBox');

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
        const allElements = clonedSvg.querySelectorAll('*');
        allElements.forEach(el => {
          // 确保所有元素都可以接收事件
          el.style.pointerEvents = 'auto';
          // 移除可能阻止事件的样式
          if (el.style.pointerEvents === 'none') {
            el.style.pointerEvents = 'auto';
          }
        });
        console.log(`✅ 热力图：已为 ${allElements.length} 个元素设置 pointer-events`);
      }
      
      // ✅ 移除可能被误识别为图片的属性
      clonedSvg.removeAttribute('role');
      clonedSvg.removeAttribute('aria-label');
      
      // ✅ 使用 XMLSerializer 确保 SVG 正确序列化（保持命名空间）
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);

      // 地图图例在主页面是独立的 #legend（不在 SVG 内），新窗口需要额外注入
      let mapLegendHTML = '';
      if (type === 'map') {
        const legendEl = document.getElementById('legend');
        if (legendEl) mapLegendHTML = legendEl.innerHTML || '';
      }

      // ✅ 热力图图例同理：主页面在 #heatmap-color-legend（不在 SVG 内）
      let heatmapLegendHTML = '';
      if (type === 'heatmap') {
        const legendEl = document.getElementById('heatmap-color-legend');
        if (legendEl) heatmapLegendHTML = legendEl.innerHTML || '';
      }

      // ✅ 树图图例：主页面是 HTML overlay（.tree-legend），新窗口需要额外注入
      let treeLegendHTML = '';
      if (type === 'tree') {
        const treeLegendEl =
          document.querySelector('#panel-tree .tree-legend') ||
          document.querySelector('.tree-legend');
        if (treeLegendEl) treeLegendHTML = treeLegendEl.outerHTML || '';
      }

      // 新窗口的 D3：优先用主页面已经加载的本地 d3 脚本 URL（Parcel 往往会带 hash）
      // 这样就算新窗口禁用 opener 或网络拦截 CDN，交互也能正常初始化
      let d3LocalUrl = '';
      const d3LocalScript = document.querySelector('script[src*="d3-global"]');
      if (d3LocalScript && d3LocalScript.src) d3LocalUrl = d3LocalScript.src;

      // 创建新窗口的 HTML，包含必要的脚本和交互功能
      const html = createNewWindowHTML(svgString, title, type, mapLegendHTML, d3LocalUrl, heatmapLegendHTML, treeLegendHTML);

      // 打开新窗口
      const newWindow = window.open('', '_blank', 'width=1400,height=900,resizable=yes,scrollbars=yes');
      if (newWindow) {
        // ✅ 使用更现代的方式写入HTML，避免document.write的警告
        newWindow.document.open('text/html', 'replace');
        newWindow.document.write(html);
        newWindow.document.close();
        
        // 等待DOM加载完成后，确保脚本执行
        newWindow.addEventListener('load', function() {
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
        const circles = d3.select(svgElement).selectAll('circle');
        circles.each(function() {
          const circle = d3.select(this);
          const d = circle.datum();
          
          if (d && d.data) {
            const data = d.data;
            const scrapedInfo = data.scraped_info || {};
            
            // 存储关键信息到 data 属性
            if (data.name) circle.attr('data-name', data.name);
            if (scrapedInfo && Object.keys(scrapedInfo).length > 0) {
              try {
                circle.attr('data-scraped-info', JSON.stringify(scrapedInfo));
              } catch(e) {
                console.warn('无法序列化 scraped_info:', e);
              }
            }
            if (d.depth !== undefined) circle.attr('data-depth', d.depth);
            if (d.children && d.children.length) {
              circle.attr('data-children-count', d.children.length);
            }
            
            // 存储祖先信息（通过遍历获取）
            try {
              const ancestors = d.ancestors ? d.ancestors() : [];
              if (ancestors.length > 1 && ancestors[1].data) {
                circle.attr('data-category', ancestors[1].data.name || '');
              }
              if (ancestors.length > 2 && ancestors[2].data) {
                circle.attr('data-subcategory', ancestors[2].data.name || '');
              }
            } catch(e) {
              // 如果 ancestors 不可用，跳过
            }
          }
        });
      } else if (type === 'bubble') {
        // 气泡图：存储气泡数据
        const circles = d3.select(svgElement).selectAll('circle');
        circles.each(function() {
          const circle = d3.select(this);
          const d = circle.datum();
          
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
        const paths = d3.select(svgElement).selectAll('.country, path');
        paths.each(function() {
          const path = d3.select(this);
          const d = path.datum();
          
          if (d && d.properties) {
            const name = d.properties.name;
            if (name && !path.attr('data-country-name')) {
              path.attr('data-country-name', name);
            }
          }
        });
      } else if (type === 'heatmap') {
        // 热力图：存储单元格数据（3D和2D都支持）
        console.log('🔍 开始存储热力图数据...');
        
        // 3D热力图：立方体组（g.cell-group）
        const cellGroups = d3.select(svgElement).selectAll('g[class*="cell-group"]');
        let storedCount = 0;
        
        cellGroups.each(function() {
          const group = d3.select(this);
          const d = group.datum();
          
          // 尝试从datum获取数据，如果失败则从class名解析
          let genre, month, value, genreIdx, monthIdx;
          
          if (d && d.genre && d.month) {
            // 从datum获取
            genre = d.genre;
            month = d.month;
            value = d.value !== undefined ? d.value : 0;
            genreIdx = d.genreIdx;
            monthIdx = d.monthIdx;
          } else {
            // 从class名解析：cell-group cell-{monthIdx}-{genreIdx}
            const classAttr = group.attr('class') || '';
            const match = classAttr.match(/cell-(\d+)-(\d+)/);
            if (match) {
              monthIdx = parseInt(match[1]);
              genreIdx = parseInt(match[2]);
              
              // 定义月份和风格数组（与heatmap.js保持一致）
              const months = ['2023-12', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
                '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
                '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
                '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];
              const allGenres = ["ACG", "classical", "electronic", "folk", "jazz", "pop", "rap", "rock"];
              
              // 从数组获取genre和month
              if (monthIdx >= 0 && monthIdx < months.length) month = months[monthIdx];
              if (genreIdx >= 0 && genreIdx < allGenres.length) genre = allGenres[genreIdx];
              
              // 尝试从datum获取value，如果没有则设为0
              value = (d && d.value !== undefined) ? d.value : 0;
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
          group.selectAll('path').each(function() {
            const path = d3.select(this);
            path.attr('data-genre', genre);
            path.attr('data-month', month);
            path.attr('data-value', value);
            // 存储曲目数量（如果有的话，使用 value 的整数部分作为后备）
            const trackCount = Math.round(value);
            path.attr('data-track-count', trackCount);
          });
          
          storedCount++;
        });
        
        console.log(`✅ 3D热力图：存储了 ${storedCount} 个单元格组的数据`);
        
        // 2D热力图：矩形单元格（rect.cell）
        const cells = d3.select(svgElement).selectAll('rect.cell');
        let cellCount = 0;
        
        cells.each(function() {
          const cell = d3.select(this);
          const d = cell.datum();
          
          if (d && d.genre && d.month) {
            cell.attr('data-genre', d.genre);
            cell.attr('data-month', d.month);
            if (d.value !== undefined) cell.attr('data-value', d.value);
            cellCount++;
          }
        });
        
        console.log(`✅ 2D热力图：存储了 ${cellCount} 个单元格的数据`);
        
        // ✅ 折线图：存储折线数据（line-path 和 area-path）
        const linePaths = d3.select(svgElement).selectAll('path.line-path, path.area-path');
        let lineCount = 0;
        
        linePaths.each(function() {
          try {
            const path = d3.select(this);
            const d = path.datum();
            
            if (d && d.month) {
              // 存储月份信息
              path.attr('data-month', d.month);
              if (d.monthIdx !== undefined) {
                path.attr('data-month-idx', d.monthIdx);
              }
              
              // 如果有 lineData，存储数据点的值（用于 tooltip）
              if (d.lineData && Array.isArray(d.lineData) && d.lineData.length > 0) {
                const allGenres = ["ACG", "classical", "electronic", "folk", "jazz", "pop", "rap", "rock"];
                
                // 存储所有数据点的值（JSON格式）
                try {
                  const values = d.lineData.map((p, idx) => {
                    if (p && typeof p === 'object') {
                      return {
                        genre: allGenres[idx] || `Genre${idx}`,
                        value: p.value || 0
                      };
                    }
                    return {
                      genre: allGenres[idx] || `Genre${idx}`,
                      value: 0
                    };
                  }).filter(v => v !== null);
                  
                  if (values.length > 0) {
                    path.attr('data-line-values', JSON.stringify(values));
                  }
                } catch(e) {
                  console.warn('无法序列化折线数据:', e);
                }
              }
              
              lineCount++;
            }
          } catch(e) {
            console.warn('处理折线路径时出错:', e);
          }
        });
        
        console.log(`✅ 折线图：存储了 ${lineCount} 条折线的数据`);
        
        // 如果存储的数据很少，尝试直接从原始热力图数据中恢复
        if (storedCount === 0 && cellCount === 0) {
          console.warn('⚠️ 未找到热力图数据，尝试从SVG结构推断...');
          // 这里可以添加备用逻辑，比如从坐标位置推断genre和month
        }
      }
    } catch(e) {
      console.warn('存储数据到属性时出错:', e);
    }
  }

  // 辅助函数：规范化国家名称（与 script.js 中的 normalize 函数保持一致）
  function normalizeCountryName(name) {
    if (!name) return name;
    const ALIASES = new Map([
      ["United States of America", "United States"],
      ["Russian Federation", "Russia"],
      ["Czech Republic", "Czechia"],
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
    const trimmed = name.trim();
    return ALIASES.get(trimmed) || trimmed;
  }

  //#region 新窗口大图模板（SVG 复制 + 交互恢复 + 热力图注释/图例）
  function createNewWindowHTML(svgString, title, type, mapLegendHTML = '', d3LocalUrl = '', heatmapLegendHTML = '', treeLegendHTML = '') {
    // 根据类型生成不同的交互脚本
    let interactionScript = '';
    
    // ✅ 生成热力图初始化代码字符串（在函数作用域中生成，避免模板字符串中的条件判断问题）
    const heatmapInitCode = type === 'heatmap' ? `
      console.log('🔥🔥🔥 热力图初始化代码已执行！');
      console.log('🔥 开始初始化热力图交互...');
      const svg = document.querySelector('#svg-container-main svg') || document.querySelector('svg');
      if (!svg) {
        console.warn('⚠️ 未找到 SVG，无法初始化热力图交互');
        return;
      }
      const svgD3 = d3.select(svg);
      const tooltip = d3.select("body").append("div")
        .attr("class", "heatmap-tooltip")
        .style("position", "fixed")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("padding", "10px 12px")
        .style("border-radius", "12px")
        .style("background", "rgba(30, 41, 59, 0.92)")
        .style("color", "#fff")
        .style("font", "13px/1.35 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif")
        .style("box-shadow", "0 10px 24px rgba(0,0,0,0.16)")
        .style("z-index", 10000)
        .style("backdrop-filter", "blur(6px)")
        .style("border", "1px solid rgba(88, 101, 242, 0.5)");
      
      // 为所有 path 元素绑定事件（3D热力图）
      const cellGroupPaths = svgD3.selectAll('g[class*="cell-group"] path');
      console.log('🔍 找到 ' + cellGroupPaths.size() + ' 个 cell-group path 元素');
      
      cellGroupPaths.each(function() {
        const path = d3.select(this);
        const genre = path.attr('data-genre') || path.node().parentElement?.getAttribute('data-genre');
        const month = path.attr('data-month') || path.node().parentElement?.getAttribute('data-month');
        const value = path.attr('data-value') || path.node().parentElement?.getAttribute('data-value') || '0';
        
        if (genre && month) {
          const pathNode = path.node();
          pathNode.style.pointerEvents = 'auto';
          pathNode.style.cursor = 'pointer';
          
          path
            .on("mouseover", function(event) {
              d3.select(this.parentNode).selectAll("path")
                .attr("opacity", 1)
                .attr("stroke-width", 1.5);
              
              tooltip
                .style("opacity", 0.95)
                .html('<b>' + genre + '</b><br/>' + month + '<br/>分值: ' + parseFloat(value).toFixed(2))
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 18) + "px");
            })
            .on("mouseout", function() {
              d3.select(this.parentNode).selectAll("path")
                .attr("opacity", 0.9)
                .attr("stroke-width", 0.5);
              tooltip.style("opacity", 0);
            });
        }
      });
      
      // 为所有 rect.cell 绑定事件（2D热力图）
      const cells = svgD3.selectAll('rect.cell');
      console.log('🔍 找到 ' + cells.size() + ' 个 rect.cell 元素');
      
      cells.each(function() {
        const cell = d3.select(this);
        const genre = cell.attr('data-genre');
        const month = cell.attr('data-month');
        const value = cell.attr('data-value');
        
        if (genre && month) {
          const cellNode = cell.node();
          cellNode.style.pointerEvents = 'auto';
          cellNode.style.cursor = 'pointer';
          
          cell
            .on("mousemove", function(event) {
              tooltip
                .style("opacity", 1)
                .html('<b>' + genre + '</b><br/>' + month + '<br/>Value: ' + value)
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 18) + "px");
            })
            .on("mouseout", function() {
              tooltip.style("opacity", 0);
            });
        }
      });
      
      // 添加缩放功能
      const g = svgD3.select('g');
      if (!g.empty()) {
        const zoom = d3.zoom()
          .scaleExtent([0.5, 3])
          .on("zoom", (event) => {
            g.attr("transform", event.transform);
          });
        svgD3.call(zoom);
        console.log('✅ 缩放功能已启用');
      }
      
      console.log('✅ 热力图交互初始化完成');
    ` : '';
    
    if (type === 'tree') {
      // 树图的缩放和拖拽功能
      interactionScript = `
        <script>
          (function() {
            if (typeof d3 === 'undefined') return;
            const svg = d3.select('svg');
            const g = svg.select('g');
            
            if (g.empty()) return;
            
            // 创建 tooltip
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
            
            // 缩放和拖拽功能
            const zoom = d3.zoom()
              .scaleExtent([0.45, 7])
              .on("start", () => svg.style("cursor", "grabbing"))
              .on("end", () => svg.style("cursor", "grab"))
              .on("zoom", (event) => {
                g.attr("transform", event.transform);
              });
            
            svg.call(zoom);
            svg.call(zoom.transform, d3.zoomIdentity.scale(0.95));
            
            // 重新绑定 tooltip 事件（从 data 属性读取数据）
            svg.selectAll('circle').each(function() {
              const circle = d3.select(this);
              const name = circle.attr('data-name');
              const depth = parseInt(circle.attr('data-depth') || '0');
              const category = circle.attr('data-category') || '';
              const subcategory = circle.attr('data-subcategory') || '';
              const scrapedInfoStr = circle.attr('data-scraped-info');
              const childrenCount = circle.attr('data-children-count');
              
              if (!name) return;
              
              let scrapedInfo = {};
              if (scrapedInfoStr) {
                try {
                  scrapedInfo = JSON.parse(scrapedInfoStr);
                } catch(e) {}
              }
              
              const location = scrapedInfo.location || null;
              const years = scrapedInfo.years || [];
              const culturalOrigins = scrapedInfo.cultural_origins || null;
              const stylisticOrigins = scrapedInfo.stylistic_origins || null;
              
              circle
                .on("mouseenter", function(event) {
                  let html = '<div style="font-weight:800;margin-bottom:6px;letter-spacing:.3px">' + name + '</div>';
                  
                  if (depth === 1) {
                    html += '<div style="opacity:.92">类别：' + category + '</div>';
                  } else if (depth === 2) {
                    html += '<div style="opacity:.92">类别：' + category + '</div>';
                    html += '<div style="opacity:.92">子类别：' + subcategory + '</div>';
                  } else if (depth >= 3) {
                    html += '<div style="opacity:.92">类别：' + category + '</div>';
                    if (subcategory) {
                      html += '<div style="opacity:.92">子类别：' + subcategory + '</div>';
                    }
                    html += '<div style="opacity:.92">流派：' + name + '</div>';
                  }
                  
                  if (years && years.length > 0) {
                    const yearStr = years.length === 1 ? years[0] : 
                                   years.length === 2 ? years[0] + ' - ' + years[1] : 
                                   years[0] + ' - ' + years[years.length - 1];
                    html += '<div style="opacity:.92;margin-top:6px">时间：' + yearStr + '</div>';
                  } else if (culturalOrigins) {
                    const yearMatch = culturalOrigins.match(/\\b(1[0-9]{3}|20[0-2][0-9])\\b/);
                    if (yearMatch) {
                      html += '<div style="opacity:.92;margin-top:6px">时间：' + culturalOrigins + '</div>';
                    }
                  }
                  
                  if (location) {
                    html += '<div style="opacity:.92">地点：' + location + '</div>';
                  }
                  
                  if (culturalOrigins && !years.length) {
                    html += '<div style="opacity:.92">文化起源：' + culturalOrigins + '</div>';
                  }
                  
                  if (stylisticOrigins) {
                    html += '<div style="opacity:.92">风格起源：' + stylisticOrigins + '</div>';
                  }
                  
                  if (childrenCount && parseInt(childrenCount) > 0) {
                    html += '<div style="opacity:.70;margin-top:6px">子节点数：' + childrenCount + '</div>';
                  }
                  
                  tooltip.style("opacity", 1).html(html);
                })
                .on("mousemove", function(event) {
                  tooltip
                    .style("left", (event.pageX + 14) + "px")
                    .style("top", (event.pageY + 14) + "px");
                })
                .on("mouseleave", function() {
                  tooltip.style("opacity", 0);
                });
            });

            // ✅ 新窗口树图图例：点击隐藏/显示（基于 data-cat），并支持双击只显示某一类
            (function initTreeLegendFilter() {
              const legend = document.querySelector('.tree-legend');
              if (!legend) return;

              // 让图例可点击（不挡住 svg 的其他 hover）
              legend.style.pointerEvents = 'auto';

              const caret = legend.querySelector('.tree-legend-caret');
              const syncCaret = () => { if (caret) caret.textContent = legend.open ? '▾' : '▸'; };
              syncCaret();
              legend.addEventListener('toggle', syncCaret);

              const body = legend.querySelector('.tree-legend-body');
              if (!body) return;

              const disabled = new Set();

              function apply() {
                // g.node + path.link 都带 data-cat（来自主页面 tree.js 渲染）
                document.querySelectorAll('g.node, path.link').forEach((el) => {
                  const cat = el.getAttribute('data-cat');
                  if (cat && disabled.has(cat)) el.setAttribute('display', 'none');
                  else el.removeAttribute('display');
                });
              }

              body.addEventListener('click', (e) => {
                const btn = e.target.closest?.('.tree-legend-item');
                if (!btn) return;
                e.preventDefault();
                e.stopPropagation();
                const key = btn.getAttribute('data-key');
                if (!key) return;
                if (disabled.has(key)) disabled.delete(key);
                else disabled.add(key);
                btn.classList.toggle('is-off', disabled.has(key));
                apply();
              });

              body.addEventListener('dblclick', (e) => {
                const btn = e.target.closest?.('.tree-legend-item');
                if (!btn) return;
                e.preventDefault();
                e.stopPropagation();
                const key = btn.getAttribute('data-key');
                if (!key) return;
                const items = Array.from(body.querySelectorAll('.tree-legend-item'));
                const keys = items.map((b) => b.getAttribute('data-key')).filter(Boolean);
                const onlyThis = (disabled.size === (keys.length - 1)) && !disabled.has(key);
                if (onlyThis) disabled.clear();
                else {
                  disabled.clear();
                  keys.forEach((k) => { if (k !== key) disabled.add(k); });
                }
                items.forEach((b) => {
                  const k = b.getAttribute('data-key');
                  b.classList.toggle('is-off', !!(k && disabled.has(k)));
                });
                apply();
              });
            })();
          })();
        </script>
      `;
    } else if (type === 'bubble') {
      // 气泡图的 tooltip 功能
      interactionScript = `
        <script>
          (function() {
            if (typeof d3 === 'undefined') return;
            let tooltip = d3.select("body").select(".bubble-tooltip");
            if (tooltip.empty()) {
              tooltip = d3.select("body").append("div")
                .attr("class", "bubble-tooltip")
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
            
            function formatBig(n) {
              return n ? n.toLocaleString() : '0';
            }
            function pct(x) {
              return x ? (x * 100).toFixed(2) + '%' : '0%';
            }
            
            d3.select('svg').selectAll('circle').each(function() {
              const circle = d3.select(this);
              const id = circle.attr('data-id');
              const plays = circle.attr('data-plays');
              const comments = circle.attr('data-comments');
              const rate = circle.attr('data-rate');
              const influence = circle.attr('data-influence');
              
              if (!id) return;
              
              circle
                .on("mouseenter", function(event) {
                  const inf = (influence !== null && influence !== undefined && influence !== '') ? Number(influence) : NaN;
                  const infText = Number.isFinite(inf) ? inf.toFixed(4) : 'N/A';
                  const html = '<div style="font-weight:800;margin-bottom:6px;letter-spacing:.3px">' + id + '</div>' +
                               '<div style="opacity:.92">Plays：' + formatBig(plays) + '</div>' +
                               '<div style="opacity:.92">Comments：' + formatBig(comments) + '</div>' +
                               '<div style="opacity:.92;margin-top:6px">Influence：' + infText + '</div>' +
                               (rate ? '<div style="opacity:.92;margin-top:6px">互动率：' + pct(rate) + '</div>' : '') +
                               '<div style="opacity:.70;margin-top:6px">气泡=影响力(influence)｜外环=互动率（相对进度）</div>';
                  
                  tooltip.style("opacity", 1).html(html);
                })
                .on("mousemove", function(event) {
                  tooltip
                    .style("left", (event.pageX + 14) + "px")
                    .style("top", (event.pageY + 14) + "px");
                })
                .on("mouseleave", function() {
                  tooltip.style("opacity", 0);
                });
            });
          })();
        </script>
      `;
    } else if (type === 'map') {
      // 地图的 tooltip 功能
      interactionScript = `
        <script>
          (function() {
            if (typeof d3 === 'undefined') return;
            let tooltip = d3.select("body").select(".map-tooltip");
            if (tooltip.empty()) {
              tooltip = d3.select("body").append("div")
                .attr("class", "map-tooltip")
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
            
            // 为所有路径元素绑定事件（包括 .country 和普通 path）
            d3.select('svg').selectAll('path').each(function() {
              const path = d3.select(this);
              const countryName = path.attr('data-country-name');
              const genre = path.attr('data-genre');
              const value = path.attr('data-value');
              const d = path.datum();
              
              // 从 data 属性或 datum 获取国家名称
              let name = countryName;
              if (!name && d && d.properties) {
                name = d.properties.name;
              }
              
              if (name) {
                path
                  .on("mouseenter", function(event) {
                    let html = '<div style="font-weight:800;margin-bottom:6px;letter-spacing:.3px">' + name + '</div>';
                    if (genre && value) {
                      html += '<div style="opacity:.92">🎵 ' + genre + '</div>';
                      html += '<div style="opacity:.92;margin-top:6px">📊 分数: ' + value + '</div>';
                    } else {
                      html += '<div style="opacity:.92">暂无数据</div>';
                    }
                    tooltip.style("opacity", 1).html(html);
                  })
                  .on("mousemove", function(event) {
                    tooltip
                      .style("left", (event.pageX + 14) + "px")
                      .style("top", (event.pageY + 14) + "px");
                  })
                  .on("mouseleave", function() {
                    tooltip.style("opacity", 0);
                  });
              }
            });
          })();
        </script>
      `;
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

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 详细视图</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    :root{
      /* 新窗口背景：比主页面更浅一档，避免“太黑” */
      --bg: #0b0624;
      --bg-0: #0b0624;
      --bg-1: #140a35;
      --bg-2: #1c0c44;
      --bg-3: #0b1230;
      --text: #e2e8f0;
      --muted: #94a3b8;
      --accent-violet: #7c3aed;
      --accent-pink: #ff3bd4;
      --accent-blue: #32a7ff;
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background:
        radial-gradient(circle at 18% 28%, rgba(255, 59, 212, 0.12) 0%, transparent 54%),
        radial-gradient(circle at 82% 68%, rgba(50, 167, 255, 0.11) 0%, transparent 56%),
        linear-gradient(135deg, var(--bg-0) 0%, var(--bg-1) 28%, var(--bg-2) 58%, var(--bg-3) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .svg-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    /* 地图图例：新窗口固定在左下角 */
    .map-legend{
      position: fixed;
      left: 20px;
      bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px 12px;
      max-width: min(680px, 72vw);
      padding: 12px 14px;
      border-radius: 10px;
      background: rgba(18, 8, 42, 0.86);
      border: 1px solid rgba(50, 167, 255, 0.28);
      color: var(--text);
      backdrop-filter: blur(10px);
      box-shadow: 0 0 18px rgba(255, 59, 212, 0.16), 0 0 24px rgba(50, 167, 255, 0.12);
      z-index: 1200;
      pointer-events: none; /* 不挡住地图 hover 交互 */
    }
    /* 热力图图例：新窗口固定在底部（与主页面一致：线性渐变条 + 两端数值） */
    .heatmap-legend{
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20px;
      width: min(520px, 76vw);
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(18, 8, 42, 0.70);
      border: 1px solid rgba(50, 167, 255, 0.26);
      box-shadow: 0 0 18px rgba(255, 59, 212, 0.12), 0 0 24px rgba(50, 167, 255, 0.10);
      color: rgba(226, 232, 240, 0.88);
      backdrop-filter: blur(10px);
      z-index: 1200;
      pointer-events: none; /* 不挡住热力图 hover */
    }
    /* ✅ 大图页热力图图例内部结构（来自主页面 innerHTML），需要补齐 bar/labels 的样式 */
    .heatmap-legend .legend-title{
      font-size: 12px;
      color: rgba(226, 232, 240, 0.78);
      margin-bottom: 6px;
      letter-spacing: 0.2px;
    }
    .heatmap-legend .legend-bar{
      height: 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.18);
      box-shadow: 0 0 10px rgba(50,167,255,0.12), 0 0 14px rgba(255,59,212,0.10);
    }
    .heatmap-legend .legend-labels{
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
      font-size: 12px;
      color: rgba(226, 232, 240, 0.82);
      font-variant-numeric: tabular-nums;
    }

    /* 树图图例：复用主页面的 HTML overlay（.tree-legend），新窗口固定在左上角（避开标题） */
    .tree-legend{
      position: fixed;
      left: 20px;
      top: 64px;
      z-index: 1200;
      width: min(320px, 40vw);
      max-width: 92%;
      background: rgba(2, 6, 23, 0.72);
      border: 1px solid rgba(88, 101, 242, 0.45);
      border-radius: 10px;
      padding: 6px 8px;
      color: var(--text);
      box-shadow: 0 0 18px rgba(124, 58, 237, 0.18), inset 0 1px 0 rgba(255,255,255,0.06);
      backdrop-filter: blur(10px);
      user-select: none;
      pointer-events: auto;
    }
    .tree-legend > summary{
      list-style: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 2px 2px;
      outline: none;
    }
    .tree-legend > summary::-webkit-details-marker{ display:none; }
    .tree-legend-caret{
      font-size: 12px;
      font-weight: 900;
      color: var(--text);
      line-height: 1;
    }
    .tree-legend-body{
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: min(52vh, 420px);
      overflow: auto;
      padding-right: 2px;
    }
    .tree-legend-item{
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 6px 8px;
      border-radius: 9px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.02);
      color: var(--text);
      cursor: pointer;
      font: 12px/1.1 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif;
      text-align: left;
      transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
    }
    .tree-legend-item:hover{
      background: rgba(255,255,255,0.06);
      border-color: rgba(50, 167, 255, 0.22);
      transform: translateY(-1px);
    }
    .tree-legend-item:active{ transform: translateY(0); }
    .tree-legend-item.is-off{ opacity: 0.22; }
    .tree-legend-swatch{
      width: 10px;
      height: 10px;
      border-radius: 999px;
      flex: 0 0 auto;
      box-shadow: 0 0 10px rgba(255,255,255,0.18);
      border: 1px solid rgba(226,232,240,0.35);
    }
    .tree-legend-label{
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--text);
      opacity: 0.95;
    }
    .tree-legend-label-empty{ min-height: 1em; }
    .tree-legend-count{
      flex: 0 0 auto;
      color: var(--muted);
      font-variant-numeric: tabular-nums;
      opacity: 0.9;
    }
    /* 热力图：只保留原图注释（不额外加 3D/2D 徽标，避免“套娃”） */
    .hm-anno{
      position: fixed;
      left: 20px;
      top: 20px; /* ✅ 新窗口也改为【左上角】，保持一致，且避开底部图例 */
      width: min(340px, 46vw);
      border-radius: 12px;
      background: rgba(10, 5, 20, 0.85); /* 更黑的背景 */
      border: 1px solid rgba(124, 58, 237, 0.3);
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      color: rgba(226,232,240,0.9);
      backdrop-filter: blur(8px);
      z-index: 1200;
      overflow: hidden;
      pointer-events: auto; /* 允许折叠/展开 */
    }
    .hm-anno > summary{
      list-style: none;
      cursor: pointer;
      padding: 6px 8px;
      font: 11px/1.1 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;
      font-weight: 700;
      letter-spacing: .5px;
      user-select: none;
      color: #fff;
    }
    .hm-anno > summary::-webkit-details-marker{ display:none; }
    .hm-anno .hm-anno-body{
      padding: 0 8px 8px 8px;
      font: 10px/1.45 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;
      color: rgba(226,232,240,0.85);
    }
    .hm-anno .hm-anno-body div {
      margin-bottom: 2px;
    }
    .hm-anno .hm-anno-body b{
      color: rgba(226,232,240,0.92);
      font-weight: 700;
    }
    .map-legend .legend-item{
      display:flex;
      align-items:center;
      gap:8px;
      white-space:nowrap;
      font-size:12px;
      color: var(--text);
    }
    .map-legend .legend-color{
      width:14px;
      height:14px;
      border-radius:3px;
      border:1px solid rgba(255,255,255,0.2);
      box-shadow: 0 0 4px rgba(0,0,0,0.35);
      display:inline-block;
    }
    .map-legend .legend-text{
      color: var(--text);
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    svg {
      max-width: 100%;
      max-height: 100%;
      background: transparent;
    }
    .close-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(18, 8, 42, 0.82);
      color: var(--text);
      border: 1px solid rgba(50, 167, 255, 0.32);
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      z-index: 1000;
      transition: all 0.3s ease;
    }
    .close-btn:hover {
      background: rgba(255, 59, 212, 0.14);
      border-color: rgba(255, 59, 212, 0.42);
    }
    .title {
      position: fixed;
      top: 20px;
      left: 20px;
      color: var(--text);
      font-size: 18px;
      font-weight: 600;
      z-index: 1000;
      text-shadow: 0 0 12px rgba(255, 59, 212, 0.25), 0 0 22px rgba(50, 167, 255, 0.18);
    }
    .tooltip, .map-tooltip, .tree-tooltip, .bubble-tooltip, .heatmap-tooltip {
      position: fixed;
      background: rgba(18, 8, 42, 0.92) !important;
      color: var(--text) !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255, 59, 212, 0.18), 0 0 26px rgba(50, 167, 255, 0.12);
      border: 1px solid rgba(50, 167, 255, 0.32);
      padding: 6px 10px; 
      border-radius: 4px; 
      pointer-events: none;
      font-size: 13px;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }
  </style>
</head>
<body>
  <div class="title">${title}</div>
  <button class="close-btn" onclick="window.close()">关闭窗口</button>
  <div class="svg-container" id="svg-container-main">
    ${svgString}
  </div>
  ${type === 'tree' && treeLegendHTML ? `${treeLegendHTML}` : ``}
  ${type === 'map' && mapLegendHTML ? `<div class="map-legend" id="map-legend">${mapLegendHTML}</div>` : ``}
  ${type === 'heatmap' && heatmapLegendHTML ? `<div class="heatmap-legend" id="heatmap-legend">${heatmapLegendHTML}</div>` : ``}
  ${type === 'heatmap' ? `
    <details class="hm-anno" id="hm-anno" open>
      <summary>注释（点击隐藏）</summary>
      <div class="hm-anno-body">
        <div>热力图：世界范围音乐热度变化</div>
        <div>折线图：国内网友听音乐的曲目数量变化</div>
      </div>
    </details>
  ` : ``}

  ${d3LocalUrl ? `<script src="${d3LocalUrl}"></script>` : ``}
  ${!d3LocalUrl ? `<script src="https://d3js.org/d3.v7.min.js"></script>` : ``}
  <script>
    // ✅ 确保 D3 加载完成后再执行交互脚本
    (function() {
      function waitForD3(callback, maxAttempts = 50) {
        if (typeof d3 !== 'undefined') {
          callback();
        } else if (maxAttempts > 0) {
          setTimeout(() => waitForD3(callback, maxAttempts - 1), 100);
        } else {
          console.error('❌ D3 加载超时');
        }
      }
      
      waitForD3(function() {
        console.log('✅ D3 已加载，开始初始化交互...');
        
        // 支持 ESC 键关闭
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            window.close();
          }
        });
        
        // 确保 SVG 元素被正确识别（不是图片）
        (function ensureSvgIsInteractive() {
          // ✅ 创建独立的热力图初始化函数
          function initHeatmapInteractions(svg) {
            console.log('🔥 开始初始化热力图交互...');
            if (!svg || typeof d3 === 'undefined') {
              console.warn('⚠️ SVG 或 D3 未找到，无法初始化热力图交互');
              return;
            }
            
            const svgD3 = d3.select(svg);
            
            // ✅ 检测是2D还是3D热力图
            const cellGroups = svgD3.selectAll('g[class*="cell-group"]');
            const cells = svgD3.selectAll('rect.cell');
            const is3DHeatmap = cellGroups.size() > 0;
            const is2DHeatmap = cells.size() > 0 && cellGroups.size() === 0;

            // ✅ 原图不需要在大图页额外显示 2D/3D 徽标：这里不再注入/更新徽标
            
            console.log('📊 热力图类型检测:', {
              '3D热力图': is3DHeatmap,
              '2D热力图': is2DHeatmap,
              'cell-group数量': cellGroups.size(),
              'rect.cell数量': cells.size()
            });
            
            // 创建 tooltip
            let tooltip = d3.select("body").select(".heatmap-tooltip");
            if (tooltip.empty()) {
              tooltip = d3.select("body").append("div")
                .attr("class", "heatmap-tooltip")
                .style("position", "fixed")
                .style("pointer-events", "none")
                .style("opacity", 0)
                .style("padding", "10px 12px")
                .style("border-radius", "12px")
                .style("background", "rgba(30, 41, 59, 0.92)")
                .style("color", "#fff")
                .style("font", "13px/1.35 system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif")
                .style("box-shadow", "0 10px 24px rgba(0,0,0,0.16)")
                .style("z-index", 10000)
                .style("backdrop-filter", "blur(6px)")
                .style("border", "1px solid rgba(88, 101, 242, 0.5)");
            }
            
            // ✅ 只为3D热力图绑定3D单元格事件
            if (is3DHeatmap) {
              // 为所有 path 元素绑定事件（3D热力图）
              const cellGroupPaths = svgD3.selectAll('g[class*="cell-group"] path');
              console.log('🔍 找到 ' + cellGroupPaths.size() + ' 个 cell-group path 元素');
            
            cellGroupPaths.each(function() {
              const path = d3.select(this);
              const genre = path.attr('data-genre') || path.node().parentElement?.getAttribute('data-genre');
              const month = path.attr('data-month') || path.node().parentElement?.getAttribute('data-month');
              const value = path.attr('data-value') || path.node().parentElement?.getAttribute('data-value') || '0';
              
              if (genre && month) {
                const pathNode = path.node();
                pathNode.style.pointerEvents = 'auto';
                pathNode.style.cursor = 'pointer';
                
                path
                  .on("mouseover", function(event) {
                    d3.select(this.parentNode).selectAll("path")
                      .attr("opacity", 1)
                      .attr("stroke-width", 1.5);
                    
                    // 获取曲目数量
                    const trackCount = path.attr('data-track-count') || Math.round(parseFloat(value));
                    
                  tooltip
                    .style("opacity", 0.95)
                    .html('<b>' + genre + '</b><br/>' + month + '<br/>分值: ' + parseFloat(value).toFixed(2) + '<br/>曲目数量: ' + trackCount);
                  // fixed tooltip: use clientX/Y to avoid scaling/scroll offset
                  const cx = (event && typeof event.clientX === "number") ? event.clientX : (event && typeof event.pageX === "number" ? event.pageX : 0);
                  const cy = (event && typeof event.clientY === "number") ? event.clientY : (event && typeof event.pageY === "number" ? event.pageY : 0);
                  const node = tooltip.node();
                  const w = node ? (node.offsetWidth || 0) : 0;
                  const h = node ? (node.offsetHeight || 0) : 0;
                  const pad = 10;
                  let x = cx + 12;
                  let y = cy - 18;
                  x = Math.max(pad, Math.min(x, (window.innerWidth || 0) - w - pad));
                  y = Math.max(pad, Math.min(y, (window.innerHeight || 0) - h - pad));
                  tooltip.style("left", x + "px").style("top", y + "px");
                  })
                  .on("mouseout", function() {
                    d3.select(this.parentNode).selectAll("path")
                      .attr("opacity", 0.9)
                      .attr("stroke-width", 0.5);
                    tooltip.style("opacity", 0);
                  });
              }
            });
            
            }
            
            // ✅ 只为2D热力图绑定2D单元格事件
            if (is2DHeatmap) {
              console.log('🔍 找到 ' + cells.size() + ' 个 rect.cell 元素');
              
              cells.each(function() {
              const cell = d3.select(this);
              const genre = cell.attr('data-genre');
              const month = cell.attr('data-month');
              const value = cell.attr('data-value');
              
              if (genre && month) {
                const cellNode = cell.node();
                cellNode.style.pointerEvents = 'auto';
                cellNode.style.cursor = 'pointer';
                
                cell
                  .on("mousemove", function(event) {
                    tooltip
                      .style("opacity", 1)
                      .html('<b>' + genre + '</b><br/>' + month + '<br/>Value: ' + value);
                    const cx = (event && typeof event.clientX === "number") ? event.clientX : (event && typeof event.pageX === "number" ? event.pageX : 0);
                    const cy = (event && typeof event.clientY === "number") ? event.clientY : (event && typeof event.pageY === "number" ? event.pageY : 0);
                    const node = tooltip.node();
                    const w = node ? (node.offsetWidth || 0) : 0;
                    const h = node ? (node.offsetHeight || 0) : 0;
                    const pad = 10;
                    let x = cx + 12;
                    let y = cy - 18;
                    x = Math.max(pad, Math.min(x, (window.innerWidth || 0) - w - pad));
                    y = Math.max(pad, Math.min(y, (window.innerHeight || 0) - h - pad));
                    tooltip.style("left", x + "px").style("top", y + "px");
                  })
                  .on("mouseout", function() {
                    tooltip.style("opacity", 0);
                  });
              }
            });
            
            // ✅ 为折线图绑定事件（line-path 和 area-path）
            const linePaths = svgD3.selectAll('path.line-path, path.area-path');
            console.log('🔍 找到 ' + linePaths.size() + ' 个折线图 path 元素');
            
            linePaths.each(function() {
              const path = d3.select(this);
              const month = path.attr('data-month');
              const lineValuesStr = path.attr('data-line-values');
              
              if (month) {
                try {
                  const pathNode = path.node();
                  if (!pathNode) return;
                  
                  pathNode.style.pointerEvents = 'auto';
                  pathNode.style.cursor = 'pointer';
                  
                  let lineValues = null;
                  if (lineValuesStr) {
                    try {
                      lineValues = JSON.parse(lineValuesStr);
                    } catch(e) {
                      console.warn('无法解析折线数据 JSON:', e);
                    }
                  }
                  
                  // 简化版本：如果鼠标在路径上，显示月份信息
                  path
                    .on("mouseover", function(event) {
                      let tooltipHtml = '<b>折线图</b><br/>' + month;
                      
                      // 如果有数据，显示平均值和平均曲目数量
                      if (lineValues && lineValues.length > 0) {
                        const avgValue = lineValues.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0) / lineValues.length;
                        const avgTrackCount = Math.round(avgValue);
                        tooltipHtml += '<br/>平均分值: ' + avgValue.toFixed(2) + '<br/>平均曲目数量: ' + avgTrackCount;
                      }
                      
                      tooltip
                        .style("opacity", 0.95)
                        .html(tooltipHtml);
                      const cx = (event && typeof event.clientX === "number") ? event.clientX : (event && typeof event.pageX === "number" ? event.pageX : 0);
                      const cy = (event && typeof event.clientY === "number") ? event.clientY : (event && typeof event.pageY === "number" ? event.pageY : 0);
                      const node = tooltip.node();
                      const w = node ? (node.offsetWidth || 0) : 0;
                      const h = node ? (node.offsetHeight || 0) : 0;
                      const pad = 10;
                      let x = cx + 12;
                      let y = cy - 18;
                      x = Math.max(pad, Math.min(x, (window.innerWidth || 0) - w - pad));
                      y = Math.max(pad, Math.min(y, (window.innerHeight || 0) - h - pad));
                      tooltip.style("left", x + "px").style("top", y + "px");
                    })
                    .on("mousemove", function(event) {
                      // 更新 tooltip 位置（fixed + clientX/Y）
                      const cx = (event && typeof event.clientX === "number") ? event.clientX : (event && typeof event.pageX === "number" ? event.pageX : 0);
                      const cy = (event && typeof event.clientY === "number") ? event.clientY : (event && typeof event.pageY === "number" ? event.pageY : 0);
                      const node = tooltip.node();
                      const w = node ? (node.offsetWidth || 0) : 0;
                      const h = node ? (node.offsetHeight || 0) : 0;
                      const pad = 10;
                      let x = cx + 12;
                      let y = cy - 18;
                      x = Math.max(pad, Math.min(x, (window.innerWidth || 0) - w - pad));
                      y = Math.max(pad, Math.min(y, (window.innerHeight || 0) - h - pad));
                      tooltip.style("left", x + "px").style("top", y + "px");
                    })
                    .on("mouseout", function() {
                      tooltip.style("opacity", 0);
                    });
                } catch(e) {
                  console.warn('折线图事件绑定出错:', e);
                }
              }
            });
            
            }
            
            // ✅ 只为3D热力图添加3D投影旋转功能（完全按照原始代码重写）
            if (is3DHeatmap) {
              const g = svgD3.select('g');
              if (!g.empty()) {
              // 坐标轴/标签不要吃掉 hover（否则折线 hover 很难触发）
              g.selectAll('.axis-line, .axis-arrow, .axis-label').style('pointer-events', 'none');
              // 3D投影参数
              const cellWidth = 50;
              const cellDepth = 25;
              const maxHeight = 120;
              const cellThickness = 6;
              const allGenres = ["ACG", "classical", "electronic", "folk", "jazz", "pop", "rap", "rock"];
              const months = ['2023-12', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
                '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
                '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
                '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];
              const numGenres = allGenres.length;
              const numMonths = months.length;
              const totalWidth = numGenres * cellWidth;
              const totalDepth = numMonths * cellDepth;
              
              // 旋转角度（全局变量，支持鼠标拖动旋转）
              let rotationAngle = Math.PI / 6; // 默认30度
              
              // 等轴测投影函数（支持旋转）
              function isometricProjection(x, y, z) {
                // 等轴测投影：x轴向右，y轴向前（深度），z轴向上
                // 支持水平旋转（绕Z轴）
                const angle = Math.PI / 6; // 基础等轴测角度30度
                const scale = 1.2; // 稍微放大一点，让3D效果更明显
                
                // 应用水平旋转
                const cosR = Math.cos(rotationAngle);
                const sinR = Math.sin(rotationAngle);
                const rotatedX = x * cosR - y * sinR;
                const rotatedY = x * sinR + y * cosR;
                
                // 等轴测投影
                const isoX = (rotatedX - rotatedY) * Math.cos(angle) * scale;
                const isoY = (rotatedX + rotatedY) * Math.sin(angle) * scale - z * scale;
                return { x: isoX, y: isoY };
              }
              
              // ✅ 从SVG中提取单元格数据
              const cellDataArray = [];
              const cellGroups = g.selectAll('g[class*="cell-group"]');
              
              console.log('🔍 找到 ' + cellGroups.size() + ' 个 cell-group 元素');
              
              // 如果找不到，尝试其他选择器
              let actualGroups = cellGroups;
              if (cellGroups.size() === 0) {
                actualGroups = g.selectAll('g').filter(function() {
                  const group = d3.select(this);
                  const classAttr = group.attr('class') || '';
                  return classAttr.includes('cell-group') || classAttr.match(/cell-\d+-\d+/);
                });
                console.log('🔍 使用备用选择器找到 ' + actualGroups.size() + ' 个元素');
              }
              
              actualGroups.each(function() {
                const group = d3.select(this);
                const classAttr = group.attr('class') || '';
                const monthIdxAttr = group.attr('data-month-idx');
                const genreIdxAttr = group.attr('data-genre-idx');
                
                let monthIdx = null;
                let genreIdx = null;
                
                // 优先从data属性获取
                if (monthIdxAttr !== null && genreIdxAttr !== null) {
                  monthIdx = parseInt(monthIdxAttr);
                  genreIdx = parseInt(genreIdxAttr);
                } else {
                  // 从class中提取
                  const match = classAttr.match(/cell-(\d+)-(\d+)/);
                  if (match) {
                    monthIdx = parseInt(match[1]);
                    genreIdx = parseInt(match[2]);
                  }
                }
                
                if (monthIdx !== null && genreIdx !== null && !isNaN(monthIdx) && !isNaN(genreIdx)) {
                  const value = parseFloat(group.attr('data-value') || '0');
                  
                  // 计算3D坐标
                  const x = genreIdx * cellWidth;
                  const y = monthIdx * cellDepth;
                  const zBottom = 0;
                  const zTop = cellThickness;
                  
                  // 获取颜色（从第一个path元素）
                  const firstPath = group.select('path').node();
                  const fillColor = firstPath ? firstPath.getAttribute('fill') : '#ccc';
                  
                  cellDataArray.push({
                    monthIdx: monthIdx,
                    genreIdx: genreIdx,
                    x: x,
                    y: y,
                    zBottom: zBottom,
                    zTop: zTop,
                    value: value,
                    fillColor: fillColor,
                    group: group
                  });
                } else {
                  // 调试：输出前几个无法匹配的元素
                  if (cellDataArray.length < 3) {
                    console.warn('⚠️ 无法提取数据 - class:', classAttr, 'data-month-idx:', monthIdxAttr, 'data-genre-idx:', genreIdxAttr);
                  }
                }
              });
              
              console.log('📊 提取了 ' + cellDataArray.length + ' 个单元格的3D数据');
              
              if (cellDataArray.length === 0) {
                console.error('❌ 未能提取任何单元格数据！请检查数据属性是否正确存储。');
              }
              
              // ✅ 从SVG中提取折线图数据
              const lineDataArray = [];
              const linePaths = g.selectAll('path.line-path');
              
              linePaths.each(function() {
                const path = d3.select(this);
                const monthIdxStr = path.attr('data-month-idx');
                const lineValuesStr = path.attr('data-line-values');
                
                if (monthIdxStr !== null && lineValuesStr) {
                  try {
                    const monthIdx = parseInt(monthIdxStr);
                    const lineValues = JSON.parse(lineValuesStr);
                    const monthY = monthIdx * cellDepth + cellDepth / 2;
                    
                    // 重建折线的3D坐标数据
                    const lineData = [];
                    let minLineHeight = Infinity;
                    let maxLineHeight = -Infinity;
                    
                    // 先找到最小和最大值
                    lineValues.forEach(function(d) {
                      const val = parseFloat(d.value || 0);
                      if (val < minLineHeight) minLineHeight = val;
                      if (val > maxLineHeight) maxLineHeight = val;
                    });
                    
                    if (minLineHeight === Infinity) minLineHeight = 0;
                    if (maxLineHeight === 0) maxLineHeight = 1;
                    const lineHeightRange = maxLineHeight - minLineHeight || 1;
                    const maxLineZ = maxHeight * 1.2;
                    
                    // 重建每个数据点
                    lineValues.forEach(function(d, genreIdx) {
                      const value = parseFloat(d.value || 0);
                      const normalizedValue = lineHeightRange > 0 ? (value - minLineHeight) / lineHeightRange : 0;
                      const z = cellThickness + (isNaN(normalizedValue) ? 0 : normalizedValue) * maxLineZ;
                      const genreX = genreIdx * cellWidth + cellWidth / 2;
                      
                      if (!isNaN(genreX) && !isNaN(monthY) && !isNaN(z)) {
                        lineData.push({
                          x: genreX,
                          y: monthY,
                          z: z,
                          value: value,
                          monthIdx: monthIdx,
                          genreIdx: genreIdx
                        });
                      }
                    });
                    
                    if (lineData.length > 0) {
                      lineDataArray.push({
                        monthIdx: monthIdx,
                        lineData: lineData,
                        linePath: path,
                        areaPath: g.select('.area-path.area-' + monthIdx)
                      });
                    }
                  } catch(e) {
                    console.warn('无法解析折线数据:', e);
                  }
                }
              });
              
              console.log('📊 提取了 ' + lineDataArray.length + ' 条折线的3D数据');
              
              // 坐标轴相关变量（与原始代码一致）
              const axisOffset = 8;
              const labelOffset = 40;
              let origin = isometricProjection(-axisOffset, -axisOffset, 0);
              let xAxisEnd = isometricProjection(totalWidth + axisOffset, -axisOffset, 0);
              let yAxisEnd = isometricProjection(-axisOffset, totalDepth + axisOffset, 0);
              let zAxisEnd = isometricProjection(-axisOffset, -axisOffset, maxHeight + axisOffset);
              let zLabelPos = isometricProjection(-10, 0, maxHeight + 25);
              
              // ✅ 更新投影函数（重新计算所有元素的位置）
              function updateProjection() {
                // 重新计算边界
                const corners = [
                  isometricProjection(0, 0, 0),
                  isometricProjection(totalWidth, 0, 0),
                  isometricProjection(0, totalDepth, 0),
                  isometricProjection(totalWidth, totalDepth, 0),
                  isometricProjection(0, 0, maxHeight),
                  isometricProjection(totalWidth, 0, maxHeight)
                ];
                
                const minX = d3.min(corners, d => d.x);
                const maxX = d3.max(corners, d => d.x);
                const minY = d3.min(corners, d => d.y);
                const maxY = d3.max(corners, d => d.y);
                
                const projectedWidth = maxX - minX;
                const projectedHeight = maxY - minY;
                
                // 更新 viewBox
                const padding = 50;
                const viewBoxMinX = minX - padding;
                const viewBoxMinY = minY - padding;
                const viewBoxWidth = projectedWidth + padding * 2;
                const viewBoxHeight = projectedHeight + padding * 2;
                
                svgD3.attr("viewBox", viewBoxMinX + ' ' + viewBoxMinY + ' ' + viewBoxWidth + ' ' + viewBoxHeight);
                
                // 更新所有单元格
                cellDataArray.forEach(cellData => {
                  const { x, y, zBottom, zTop, monthIdx, genreIdx } = cellData;
                  
                  // 重新计算8个顶点
                  const bottom1 = isometricProjection(x, y, zBottom);
                  const bottom2 = isometricProjection(x + cellWidth, y, zBottom);
                  const bottom3 = isometricProjection(x + cellWidth, y + cellDepth, zBottom);
                  const bottom4 = isometricProjection(x, y + cellDepth, zBottom);
                  const top1 = isometricProjection(x, y, zTop);
                  const top2 = isometricProjection(x + cellWidth, y, zTop);
                  const top3 = isometricProjection(x + cellWidth, y + cellDepth, zTop);
                  const top4 = isometricProjection(x, y + cellDepth, zTop);
                  
                  // 更新单元格组的所有面
                  const cellGroup = g.select('.cell-' + monthIdx + '-' + genreIdx);
                  if (!cellGroup.empty()) {
                    const paths = cellGroup.selectAll("path");
                    const faces = [
                      [bottom1, bottom2, bottom3, bottom4], // 底面
                      [bottom2, top2, top3, bottom3], // 右侧面
                      [bottom4, bottom3, top3, top4], // 背面
                      [top1, top2, top3, top4] // 顶面
                    ];
                    
                    paths.each(function(d, i) {
                      if (i < faces.length) {
                        const path = d3.path();
                        path.moveTo(faces[i][0].x, faces[i][0].y);
                        for (let j = 1; j < faces[i].length; j++) {
                          path.lineTo(faces[i][j].x, faces[i][j].y);
                        }
                        path.closePath();
                        d3.select(this).attr("d", path.toString());
                      }
                    });
                  }
                });
                
                // 更新所有折线
                lineDataArray.forEach(({ monthIdx, lineData, darkerLineColor }) => {
                  // 重新生成折线路径（使用与初始化时相同的lineGenerator逻辑）
                  // 注意：需要按照投影后的X坐标排序，确保曲线方向正确
                  const sortedLineData = [...lineData].sort((a, b) => {
                    const projA = isometricProjection(a.x, a.y, a.z);
                    const projB = isometricProjection(b.x, b.y, b.z);
                    return projA.x - projB.x;
                  });
                  
                  const lineGeneratorUpdate = d3.line()
                    .curve(d3.curveMonotoneX)
                    .x(function(d) {
                      const projected = isometricProjection(d.x, d.y, d.z);
                      return projected.x;
                    })
                    .y(function(d) {
                      const projected = isometricProjection(d.x, d.y, d.z);
                      return projected.y;
                    });
                  
                  // 更新折线（使用正确的选择器，class是 "line-path line-monthIdx"）
                  const lineElement = g.select(".line-path.line-" + monthIdx);
                  if (!lineElement.empty()) {
                    const newPath = lineGeneratorUpdate(sortedLineData);
                    if (newPath && !newPath.includes('NaN')) {
                      lineElement.attr("d", newPath);
                    }
                  }
                  
                  // 更新面积填充（重新创建areaGenerator，因为投影函数已更新）
                  // 使用排序后的数据，确保与折线一致
                  const areaGeneratorUpdate = d3.area()
                    .curve(d3.curveMonotoneX)
                    .x(function(d) {
                      const projected = isometricProjection(d.x, d.y, d.z);
                      return projected.x;
                    })
                    .y0(function(d) {
                      const projected = isometricProjection(d.x, d.y, cellThickness);
                      return projected.y;
                    })
                    .y1(function(d) {
                      const projected = isometricProjection(d.x, d.y, d.z);
                      return projected.y;
                    });
                  
                  const areaElement = g.select(".area-" + monthIdx);
                  if (!areaElement.empty()) {
                    areaElement.attr("d", areaGeneratorUpdate(sortedLineData));
                  }
                  
                  // 更新最高点标记
                  let maxZ = -Infinity;
                  let maxPoint = null;
                  lineData.forEach(point => {
                    if (point.z > maxZ) {
                      maxZ = point.z;
                      maxPoint = point;
                    }
                  });
                  
                  if (maxPoint) {
                    const maxProjected = isometricProjection(maxPoint.x, maxPoint.y, maxPoint.z);
                    g.select('.max-point-outer-' + monthIdx)
                      .attr("cx", maxProjected.x)
                      .attr("cy", maxProjected.y);
                    g.select('.max-point-inner-' + monthIdx)
                      .attr("cx", maxProjected.x)
                      .attr("cy", maxProjected.y);
                  }
                });
                
                // 更新坐标轴（使用外部定义的axisOffset和labelOffset）
                
                // 更新原点
                origin = isometricProjection(-axisOffset, -axisOffset, 0);
                
                // 更新X轴
                xAxisEnd = isometricProjection(totalWidth + axisOffset, -axisOffset, 0);
                g.select(".x-axis.axis-line")
                  .attr("x1", origin.x)
                  .attr("y1", origin.y)
                  .attr("x2", xAxisEnd.x)
                  .attr("y2", xAxisEnd.y);
                
                const xAxisAngle = Math.atan2(xAxisEnd.y - origin.y, xAxisEnd.x - origin.x);
                const xArrowLength = 8;
                const xArrowPath = d3.path();
                xArrowPath.moveTo(xAxisEnd.x, xAxisEnd.y);
                xArrowPath.lineTo(
                  xAxisEnd.x - xArrowLength * Math.cos(xAxisAngle - Math.PI / 6),
                  xAxisEnd.y - xArrowLength * Math.sin(xAxisAngle - Math.PI / 6)
                );
                xArrowPath.lineTo(
                  xAxisEnd.x - xArrowLength * Math.cos(xAxisAngle + Math.PI / 6),
                  xAxisEnd.y - xArrowLength * Math.sin(xAxisAngle + Math.PI / 6)
                );
                xArrowPath.closePath();
                g.select(".x-axis.axis-arrow").attr("d", xArrowPath.toString());
                
                // 更新Y轴
                yAxisEnd = isometricProjection(-axisOffset, totalDepth + axisOffset, 0);
                g.select(".y-axis.axis-line")
                  .attr("x1", origin.x)
                  .attr("y1", origin.y)
                  .attr("x2", yAxisEnd.x)
                  .attr("y2", yAxisEnd.y);
                
                const yAxisAngle = Math.atan2(yAxisEnd.y - origin.y, yAxisEnd.x - origin.x);
                const yArrowLength = 8;
                const yArrowPath = d3.path();
                yArrowPath.moveTo(yAxisEnd.x, yAxisEnd.y);
                yArrowPath.lineTo(
                  yAxisEnd.x - yArrowLength * Math.cos(yAxisAngle - Math.PI / 6),
                  yAxisEnd.y - yArrowLength * Math.sin(yAxisAngle - Math.PI / 6)
                );
                yArrowPath.lineTo(
                  yAxisEnd.x - yArrowLength * Math.cos(yAxisAngle + Math.PI / 6),
                  yAxisEnd.y - yArrowLength * Math.sin(yAxisAngle + Math.PI / 6)
                );
                yArrowPath.closePath();
                g.select(".y-axis.axis-arrow").attr("d", yArrowPath.toString());
                
                // 更新Z轴
                zAxisEnd = isometricProjection(-axisOffset, -axisOffset, maxHeight + axisOffset);
                g.select(".z-axis.axis-line")
                  .attr("x1", origin.x)
                  .attr("y1", origin.y)
                  .attr("x2", zAxisEnd.x)
                  .attr("y2", zAxisEnd.y);
                
                const zAxisAngle = Math.atan2(zAxisEnd.y - origin.y, zAxisEnd.x - origin.x);
                const zArrowLength = 8;
                const zArrowPath = d3.path();
                zArrowPath.moveTo(zAxisEnd.x, zAxisEnd.y);
                zArrowPath.lineTo(
                  zAxisEnd.x - zArrowLength * Math.cos(zAxisAngle - Math.PI / 6),
                  zAxisEnd.y - zArrowLength * Math.sin(zAxisAngle - Math.PI / 6)
                );
                zArrowPath.lineTo(
                  zAxisEnd.x - zArrowLength * Math.cos(zAxisAngle + Math.PI / 6),
                  zAxisEnd.y - zArrowLength * Math.sin(zAxisAngle + Math.PI / 6)
                );
                zArrowPath.closePath();
                g.select(".z-axis.axis-arrow").attr("d", zArrowPath.toString());
                
                // 更新X轴标签
                allGenres.forEach((genre, idx) => {
                  const x = idx * cellWidth + cellWidth / 2;
                  const y = -labelOffset;
                  const projected = isometricProjection(x, y, 0);
                  g.select('.x-label-' + idx)
                    .attr("x", projected.x)
                    .attr("y", projected.y);
                });
                
                // 更新Y轴标签
                months.forEach((month, idx) => {
                  if (idx % 3 === 0) {
                    const x = 0;
                    const y = idx * cellDepth + cellDepth / 2;
                    const projected = isometricProjection(x - labelOffset, y, 0);
                    g.select('.y-label-' + idx)
                      .attr("x", projected.x)
                      .attr("y", projected.y);
                  }
                });
                
                // 更新Z轴标签
                zLabelPos = isometricProjection(-10, 0, maxHeight + 25);
                g.select(".z-label")
                  .attr("x", zLabelPos.x)
                  .attr("y", zLabelPos.y);
                
              }
              
              // 鼠标拖动旋转相关变量（与原始 heatmap.js 一致）
              let isDragging = false;
              let lastMouseX = 0;

              // ========== 鼠标拖动旋转事件 ==========
              svgD3.on("mousedown", function(event) {
                isDragging = true;
                lastMouseX = event.clientX;
                svgD3.style("cursor", "grabbing");
                event.preventDefault();
                event.stopPropagation();
              });

              svgD3.on("mousemove", function(event) {
                if (isDragging) {
                  const deltaX = event.clientX - lastMouseX;
                  rotationAngle += deltaX * 0.01; // 旋转速度
                  
                  // 更新投影（同步，避免 mouseup 后仍有异步更新导致“松开还在转”）
                  updateProjection();
                  
                  lastMouseX = event.clientX;
                  event.preventDefault();
                  event.stopPropagation();
                } else {
                  // ✅ 兜底：大窗里不依赖命中折线本体，靠近折线点就显示 tooltip
                  try {
                    const gNode = g.node();
                    if (!gNode) return;
                    const m = d3.pointer(event, gNode);
                    const mouseX = m[0], mouseY = m[1];

                    let best = null;
                    for (let mi = 0; mi < lineDataArray.length; mi++) {
                      const series = lineDataArray[mi];
                      if (!series || !series.lineData) continue;
                      for (let gi = 0; gi < series.lineData.length; gi++) {
                        const p = series.lineData[gi];
                        const proj = isometricProjection(p.x, p.y, p.z);
                        const dx = mouseX - proj.x;
                        const dy = mouseY - proj.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (!best || dist < best.dist) {
                          const monthLabel = (typeof months !== 'undefined' && months && months[p.monthIdx] !== undefined) ? months[p.monthIdx] : (series.month || '');
                          best = { month: monthLabel, genre: allGenres[p.genreIdx], value: p.value, dist };
                        }
                      }
                    }

                    if (best && best.dist < 22) {
                      tooltip.style("opacity", 0.95).html('<b>' + best.genre + '</b><br/>' + best.month + '<br/>曲目数量: ' + Math.round(best.value));
                      const cx = (event && typeof event.clientX === "number") ? event.clientX : (event && typeof event.pageX === "number" ? event.pageX : 0);
                      const cy = (event && typeof event.clientY === "number") ? event.clientY : (event && typeof event.pageY === "number" ? event.pageY : 0);
                      const node = tooltip.node();
                      const w = node ? (node.offsetWidth || 0) : 0;
                      const h = node ? (node.offsetHeight || 0) : 0;
                      const pad = 10;
                      let x = cx + 12;
                      let y = cy - 18;
                      x = Math.max(pad, Math.min(x, (window.innerWidth || 0) - w - pad));
                      y = Math.max(pad, Math.min(y, (window.innerHeight || 0) - h - pad));
                      tooltip.style("left", x + "px").style("top", y + "px");
                    } else {
                      // 不靠近折线时不强行隐藏，避免和方块 tooltip 打架
                    }
                  } catch (e) {}
                }
              });

              svgD3.on("mouseup", function(event) {
                isDragging = false;
                svgD3.style("cursor", "grab");
                event.preventDefault();
                event.stopPropagation();
              });

              svgD3.on("mouseleave", function(event) {
                isDragging = false;
                svgD3.style("cursor", "grab");
                event.preventDefault();
                event.stopPropagation();
              });
              
              // 全局 mouseup 监听，确保即使鼠标移出 SVG 也能停止拖动
              d3.select(document).on("mouseup.heatmap-rotate", function(event) {
                if (isDragging) {
                  isDragging = false;
                  svgD3.style("cursor", "grab");
                }
              });
              }
            } else if (is2DHeatmap) {
              // ✅ 2D热力图：只添加简单的缩放功能（不旋转）
              const g = svgD3.select('g');
              if (!g.empty()) {
                const zoom = d3.zoom()
                  .scaleExtent([0.5, 3])
                  .on("zoom", function(event) {
                    g.attr("transform", event.transform);
                  });
                
                svgD3.call(zoom);
                console.log('✅ 2D热力图缩放功能已启用');
              }
            }
            
            console.log('✅ 热力图交互初始化完成');
          }
          
          function checkSvg() {
            const svg = document.querySelector('#svg-container-main svg') || document.querySelector('svg');
            if (svg) {
              console.log('✅ SVG 元素已找到:', svg.tagName, svg.namespaceURI);
              // 确保 SVG 有正确的命名空间（关键！）
              svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
              svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
              
              // 移除可能被误识别为图片的属性
              svg.removeAttribute('content-type');
              svg.removeAttribute('content');
              svg.removeAttribute('type');
              
              // 确保 SVG 可以接收事件（不是图片）
              svg.style.pointerEvents = 'auto';
              
              // 确保所有子元素也可以接收事件
              const allElements = svg.querySelectorAll('*');
              allElements.forEach(el => {
                el.style.pointerEvents = 'auto';
              });
              
              console.log('✅ SVG 已设置为可交互模式');
              
              // ✅ 如果是热力图，直接在这里初始化
              const chartType = '${type}';
              console.log('📝 图表类型:', chartType);
              if (chartType === 'heatmap') {
                console.log('🔥 检测到热力图类型，开始初始化...');
                // 延迟一点时间确保所有元素都已渲染
                setTimeout(function() {
                  initHeatmapInteractions(svg);
                }, 100);
              }
              
              return true;
            } else {
              console.warn('⚠️ 未找到 SVG 元素，等待...');
              return false;
            }
          }
          
          // 延迟执行，确保 DOM 完全渲染
          setTimeout(function() {
            const svgFound = checkSvg();
            if (!svgFound) {
              // 如果没找到，等待 DOM 加载完成
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  setTimeout(function() {
                    checkSvg();
                  }, 200);
                });
              } else {
                setTimeout(function() {
                  checkSvg();
                }, 200);
              }
            }
          }, 500);
          
          // 热力图不再做“延迟保障”二次初始化：避免重复绑定事件/zoom 抢事件导致旋转逻辑错乱
        })();
      });
    })();
  </script>
  ${interactionScript ? interactionScript.replace('<script>', '<script data-type="' + type + '">') : ''}
</body>
</html>
    `;
  }
  //#endregion

  function initInteractionsInNewWindow(newWindow, type) {
    // 在新窗口中初始化交互功能
    // 这个函数会在窗口加载完成后被调用
    // 具体的交互逻辑已经在 HTML 的 script 标签中
  }

  function openImageInNewWindow(imageSrc, title) {
    // 创建新窗口的 HTML，显示图片
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 详细视图</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    :root{
      /* 新窗口背景：比主页面更浅一档，避免“太黑” */
      --bg: #0b0624;
      --bg-0: #0b0624;
      --bg-1: #140a35;
      --bg-2: #1c0c44;
      --bg-3: #0b1230;
      --text: #e2e8f0;
      --muted: #94a3b8;
      --accent-violet: #7c3aed;
      --accent-pink: #ff3bd4;
      --accent-blue: #32a7ff;
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow: auto;
      background:
        radial-gradient(circle at 18% 28%, rgba(255, 59, 212, 0.12) 0%, transparent 54%),
        radial-gradient(circle at 82% 68%, rgba(50, 167, 255, 0.11) 0%, transparent 56%),
        linear-gradient(135deg, var(--bg-0) 0%, var(--bg-1) 28%, var(--bg-2) 58%, var(--bg-3) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .image-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      border-radius: 8px;
    }
    .close-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(18, 8, 42, 0.82);
      color: var(--text);
      border: 1px solid rgba(50, 167, 255, 0.32);
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      z-index: 1000;
      transition: all 0.3s ease;
    }
    .close-btn:hover {
      background: rgba(255, 59, 212, 0.14);
      border-color: rgba(255, 59, 212, 0.42);
    }
    .title {
      position: fixed;
      top: 20px;
      left: 20px;
      color: var(--text);
      font-size: 18px;
      font-weight: 600;
      z-index: 1000;
      text-shadow: 0 0 12px rgba(255, 59, 212, 0.25), 0 0 22px rgba(50, 167, 255, 0.18);
    }
  </style>
</head>
<body>
  <div class="title">${title}</div>
  <button class="close-btn" onclick="window.close()">关闭窗口</button>
  <div class="image-container">
    <img src="${imageSrc}" alt="${title}">
  </div>
  <script>
    // 支持 ESC 键关闭
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        window.close();
      }
    });
    
    // 图片加载错误处理
    document.querySelector('img').addEventListener('error', function() {
      this.alt = '图片加载失败';
      this.style.border = '2px solid rgba(220, 38, 38, 0.5)';
    });
  </script>
</body>
</html>
    `;

    // 打开新窗口
    const newWindow = window.open('', '_blank', 'width=1400,height=900,resizable=yes,scrollbars=yes');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    } else {
      alert('无法打开新窗口，请检查浏览器弹窗设置');
    }
  }

  function addGlobalStyles() {
    const styleId = 'svg-interaction-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .chart-content[data-interaction-setup] {
        transform-origin: center center;
        will-change: transform;
      }
      .chart-panel {
        overflow: visible !important;
      }
      .chart-content[data-interaction-setup]:hover {
        z-index: 100 !important;
      }
    `;
    document.head.appendChild(style);
  }

  init();
})();
