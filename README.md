

# InnerG -web

## 项目简介
- InnerG 是基于 Vue 3 + Vite 的前端单页应用，提供心理/咨询类功能的界面，支持登录、咨询、心情记录与音乐播放等。
- 采用前后端分离架构，前端基于 Vue 3 进行开发，作为个人学习 Vue 框架的实践项目，后端项目：[InnerG-Server](https://github.com/1341292919/InnerG)

## 主要特性
- 用户认证（Email 登录/注册）
- 知识库与文章展示
- 咨询问诊与会话历史
- 心情花园与心情日志
- 音乐播放列表与播放器
- 后台管理与数据页面

## 技术亮点
- **流式 AI 对话**：基于 Server-Sent Events（SSE）实现 AI 响应的流式输出，使用 `@microsoft/fetch-event-source` 封装流式请求，配合动态"正在输入"动画和 `AbortController` 中断控制，用户无需等待完整回复即可逐字查看 AI 的思考过程，大幅提升对话的实时感和交互流畅度。
- **Markdown 实时渲染**：AI 回复内容支持 Markdown 格式实时解析渲染，包括代码块、列表、引用等富文本样式，提升内容可读性。
- **会话状态管理**：使用 Pinia 管理全局会话状态，支持新建会话、历史记录切换、消息缓存等完整对话功能。

## 技术栈
- 框架：Vue 3
- 构建工具：Vite
- UI：Element Plus
- 状态管理：Pinia
- HTTP：Axios

## 快速开始

1. 克隆仓库：

```bash
git clone <仓库地址>
cd InnerG
```

2. 安装依赖：

```bash
	npm install
```

3. 配置后端代理与端口：
   - 请编辑 [config/config.yaml](config/config.yaml) 中的 `server.port` 与 `server.proxyTarget`（例如后端 API 地址）。

4. 本地运行：

   ```bash
   npm run dev
   ```

5. 打包预览：

   ```bash
   npm run build
   npm run preview
   ```

## 配置说明
- vite 的开发服务器端口与代理由 [config/config.yaml](config/config.yaml) 控制，vite 配置读取该文件（见 [vite.config.js](vite.config.js)）。如未正确配置，启动时会提示错误并中止。

## 运行环境
- Node.js（建议 22+ 或更高）

