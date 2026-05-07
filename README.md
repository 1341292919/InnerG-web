# InnerG - Web

## 项目简介

InnerG 是基于 Vue 3 + Vite 的前端单页应用，提供心理/咨询类功能的界面，支持登录、AI 咨询对话、心情记录与音乐播放等。

采用前后端分离架构，作为个人学习 Vue 框架的实践项目。后端项目：[InnerG-Server](https://github.com/1341292919/InnerG)

## 主要特性

- 用户认证（账号密码登录 / 邮箱验证码登录 / 注册）
- AI 心理咨询（流式 SSE 对话）
- 心情花园与情绪日志
- 知识库与文章管理
- 音乐播放列表与播放器
- 后台管理（数据面板、文章管理、咨询管理、情绪日志）

## 技术栈

| 类别     | 技术                         |
| -------- | ---------------------------- |
| 框架     | Vue 3.5 + Vite 7             |
| 语言     | JavaScript（`.js` / `.vue`） |
| UI 库    | Element Plus（按需自动导入） |
| 状态管理 | Pinia                        |
| 路由     | Vue Router 4                 |
| HTTP     | Axios                        |
| CSS      | SCSS                         |
| 代码规范 | ESLint + Prettier            |

## 项目结构

```
InnerG/
├── config/                    # 配置文件
│   └── config.yaml           # 后端代理与端口配置
├── src/
│   ├── api/                   # API 接口层
│   │   ├── auth/             # 认证相关接口
│   │   ├── backend/          # 后台管理接口
│   │   ├── consult/          # 咨询相关接口
│   │   └── music/            # 音乐相关接口
│   ├── components/            # 公共组件
│   │   ├── business/         # 业务组件（ArticleDialog、RichTextEditor）
│   │   ├── common/           # 通用组件（EmptyState、LoadingSpinner、PageHead、TableSearch 等）
│   │   └── layout/           # 布局组件（AuthLayout、BackendLayout、FrontendLayout）
│   ├── composables/           # 组合式函数
│   │   ├── useAuth.js        # 认证状态管理
│   │   └── useRequest.js     # 请求状态管理（loading / error）
│   ├── router/                # 路由配置
│   │   └── index.js          # 路由定义与导航守卫
│   ├── stores/                # Pinia 状态管理
│   │   └── admin.js          # 后台管理全局状态
│   ├── styles/                # 全局样式
│   │   ├── element/          # Element Plus 主题覆盖
│   │   ├── variables.scss    # SCSS 变量
│   │   └── global.scss       # CSS 自定义属性
│   ├── utils/                 # 工具函数
│   │   └── request.js        # Axios 实例与拦截器
│   ├── views/                 # 页面
│   │   ├── auth/             # 登录 / 注册
│   │   ├── consult/          # 咨询
│   │   ├── home/             # 首页 / 面板
│   │   ├── knowledge/        # 知识库
│   │   ├── mood/             # 心情花园 / 日志
│   │   └── music/            # 音乐列表 / 播放器
│   ├── App.vue
│   └── main.js
├── vite.config.js             # Vite 配置
├── eslint.config.js           # ESLint 配置
├── .prettierrc                # Prettier 配置
└── package.json
```

## 开发规范

### 路径别名

- `@` → `src/`（如 `@/components/common/PageHead.vue`）
- `~` → 项目根目录

### 组件分层

| 目录                   | 用途                                                                   |
| ---------------------- | ---------------------------------------------------------------------- |
| `components/common/`   | 通用 UI 组件（EmptyState、LoadingSpinner、PageHead、TableSearch 等）   |
| `components/business/` | 业务组件（ArticleDialog、RichTextEditor）                              |
| `components/layout/`   | 布局组件（AuthLayout、BackendLayout、FrontendLayout、Navbar、Sidebar） |

### 代码风格

- 使用 `<script setup>` 组合式 API
- 组件样式使用 `<style scoped>`
- 单引号、无分号、2 空格缩进、尾逗号
- 所有 API 调用通过 `@/utils/request` 实例发起

## 可用脚本

```bash
npm run dev       # 启动开发服务器
npm run build     # 构建生产版本
npm run preview   # 预览构建产物
npm run lint      # ESLint 检查并自动修复
npm run format    # Prettier 格式化代码
```

## 快速开始

1. 克隆仓库并安装依赖：

```bash
git clone <仓库地址>
cd InnerG
npm install
```

2. 编辑 `config/config.yaml`，配置后端 API 地址（`server.proxyTarget`）和开发端口（`server.port`）。

3. 启动开发服务器：

```bash
npm run dev
```

4. 打包预览：

```bash
npm run build
npm run preview
```

## 配置说明

- 开发服务器端口与 API 代理由 `config/config.yaml` 控制，Vite 配置读取该文件（见 `vite.config.js`）。
- 如未正确配置，启动时会提示错误并中止。

## 运行环境

- Node.js 22+
