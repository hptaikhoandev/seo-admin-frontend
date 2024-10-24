const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  optimizeDeps: {
    exclude: [
      'vue3-apexcharts',
      'vue3-perfect-scrollbar',
      'vue-i18n',
      'ant-design-vue'
    ]
  }
});
