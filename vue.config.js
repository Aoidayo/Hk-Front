const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //关闭语法检查
  lintOnSave:false,
  // webpack-dev-server-client-overlay报错
  devServer:{
    client:{
      overlay:false
    }
  }
  })
