import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'
import { load } from 'js-yaml'

// 读取 config/config.yaml 中的配置（端口和 proxy target）
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: serverPort,
    proxy: {
      '/api/v1':{
        target: proxyTarget, // 目标服务器地址（从 config/config.yaml 读取）
        changeOrigin: true, // 是否改变请求头中的origin字段
      }
    }
  }
})
