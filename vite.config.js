import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'
import { load } from 'js-yaml'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

const cfgPath = path.resolve(process.cwd(), 'config', 'config.yaml')
let cfg = {}
try {
  const raw = fs.readFileSync(cfgPath, 'utf8')
  cfg = load(raw) || {}
} catch (e) {
  console.error('\n=== PANIC: 无法读取 config/config.yaml ===')
  console.error('错误信息：', e && e.message)
  console.error('请确保文件存在且格式正确，启动中止。\n')
  throw new Error('PANIC: 无法读取 config/config.yaml: ' + (e && e.message))
}

if (!cfg.server || !cfg.server.port || !cfg.server.proxyTarget) {
  console.error('\n=== PANIC: config/config.yaml 缺少必要字段 ===')
  console.error('需要的字段：server.port 和 server.proxyTarget')
  console.error('当前读取到的内容：', JSON.stringify(cfg, null, 2))
  console.error('请补全配置，启动中止。\n')
  throw new Error('PANIC: config/config.yaml 缺少必要字段: server.port 或 server.proxyTarget')
}

const serverPort = cfg.server.port
const proxyTarget = cfg.server.proxyTarget

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
    }),
    ElementPlus(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: serverPort,
    proxy: {
      '/api/v1': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;\n@use "@/styles/variables.scss" as *;`,
      },
    },
  },
})
