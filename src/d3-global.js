// 将 npm 安装的 d3(v7) 绑定到 window.d3，供现有脚本（tree.js / heatmap.js 等）以全局 d3 方式使用
// 目的：避免部分网络环境拦截 CDN 导致 d3 未加载，从而树图不显示
(function () {
  try {
    // Parcel 1 会把 require('d3') 打包进 bundle
    // eslint-disable-next-line no-undef
    window.d3 = require('d3');
    console.log('✅ 本地 d3 已加载（window.d3）');
  } catch (e) {
    console.error('❌ 本地 d3 加载失败：', e);
  }
})();



