const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' },
      },
      '/oauth2': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        pathRewrite: { '^/oauth2': '/oauth2' },
      },
    },
  },
})
