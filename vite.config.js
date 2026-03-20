import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/v1':{
        target: 'http://204.152.192.27:20000', // 目标服务器地址
        changeOrigin: true, // 是否改变请求头中的origin字段
      }
    }
  }
})
