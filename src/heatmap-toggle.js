// ============================================
// heatmap-toggle.js - 2D/3D热力图切换控制器（最简单版本：只切换显示/隐藏）
// ============================================

(() => {
  let currentMode = '3D';
  
  const toggleBtn = document.getElementById('heatmap-toggle');
  if (!toggleBtn) {
    console.error('❌ 找不到切换按钮');
    return;
  }
  
  const container3D = document.getElementById('heatmap-3d');
  const container2D = document.getElementById('heatmap-2d');
  
  if (!container3D || !container2D) {
    console.error('❌ 找不到热力图容器');
    return;
  }
  
  function updateButtonText() {
    const toggleText = toggleBtn.querySelector('.toggle-text');
    if (toggleText) {
      toggleText.textContent = currentMode;
    }
  }
  
  function toggleMode() {
    if (currentMode === '3D') {
      currentMode = '2D';
      container3D.style.display = 'none';
      container2D.style.display = 'block';
    } else {
      currentMode = '3D';
      container2D.style.display = 'none';
      container3D.style.display = 'block';
    }
    updateButtonText();
    console.log(`✅ 切换到${currentMode}模式`);
  }
  
  toggleBtn.addEventListener('click', toggleMode);
  updateButtonText();
  
  // 确保初始状态正确
  container3D.style.display = 'block';
  container2D.style.display = 'none';
  
  console.log('✅ 热力图切换控制器初始化完成');
})();
