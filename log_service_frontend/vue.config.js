const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,　　//关闭语法检查
  outputDir: '../wwwroot',
  pages:{
    Admin:{
      entry: "src/pages/GPMAdminPage/admin.js",
      template: "public/admin.html",
      filename: "admin.html",
      title: "Admin頁面",
    },
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'GPM IDMS WEB',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  }
})
