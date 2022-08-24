const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: '../wwwroot',
  pages:{
    Admin:{
      entry: "src/pages/GPMAdminPage/Admin.js",
      template: "public/Admin.html",
      filename: "Admin.html",
      title: "Admin頁面",
    }
  },
  index: {
    entry: 'src/main.js',
    template: 'public/index.html',
    filename: 'index.html',
    title: '裹小递',
    chunks: ['chunk-vendors', 'chunk-common', 'index']
}
})
