<template>
  <div class="markdown-content" :class="{ 'ai-markdown': isAiMessage }">
    <div v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  isAiMessage: {
    type: Boolean,
    default: false,
  },
})

// 配置 marked
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error('代码高亮失败:', err)
      }
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true, // 支持 GitHub 风格换行
  gfm: true, // 启用 GitHub Flavored Markdown
  pedantic: false,
  headerIds: false,
  mangle: false,
})

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  try {
    return marked.parse(props.content)
  } catch (err) {
    console.error('Markdown 渲染失败:', err)
    // 降级处理：返回纯文本
    return `<p>${props.content}</p>`
  }
})
</script>

<style>
/* 导入 highlight.js github 主题样式 */
@import 'highlight.js/styles/github.css';
</style>

<style scoped>
.markdown-content {
  line-height: 1.6;
  color: inherit;
}

/* 标题样式 */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 1em 0 0.5em 0;
  font-weight: 600;
  line-height: 1.3;
}

.markdown-content :deep(h1) {
  font-size: 1.5em;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.3em;
}

.markdown-content :deep(h2) {
  font-size: 1.3em;
  color: #374151;
}

.markdown-content :deep(h3) {
  font-size: 1.1em;
  color: #4b5563;
}

.markdown-content :deep(h4) {
  font-size: 1em;
  color: #6b7280;
}

/* 段落样式 */
.markdown-content :deep(p) {
  margin: 0.5em 0;
}

/* 列表样式 */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.markdown-content :deep(li) {
  margin: 0.3em 0;
}

/* 任务列表 */
.markdown-content :deep(input[type='checkbox']) {
  margin-right: 0.5em;
}

/* 引用样式 */
.markdown-content :deep(blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1em;
  margin: 1em 0;
  color: #6b7280;
  font-style: italic;
  background: #f9fafb;
  border-radius: 0 0.5em 0.5em 0;
  padding: 0.5em 1em;
}

.ai-markdown :deep(blockquote) {
  border-left-color: #3b82f6;
  background: #eff6ff;
}

/* 分割线 */
.markdown-content :deep(hr) {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 1.5em 0;
}

/* 行内代码 */
.markdown-content :deep(code) {
  background: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-family: 'Consolas', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85em;
  color: #e11d48;
}

.ai-markdown :deep(code) {
  background: #dbeafe;
  color: #1e40af;
}

/* 代码块 */
.markdown-content :deep(pre) {
  background: #f6f8fa;
  padding: 1em;
  border-radius: 0.5em;
  overflow-x: auto;
  margin: 1em 0;
  border: 1px solid #d0d7de;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-family: 'Consolas', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85em;
  line-height: 1.45;
  display: block;
}

/* 表格样式 */
.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
  font-size: 0.9em;
}

.markdown-content :deep(table th),
.markdown-content :deep(table td) {
  border: 1px solid #d0d7de;
  padding: 0.5em 0.75em;
  text-align: left;
}

.markdown-content :deep(table th) {
  background: #f6f8fa;
  font-weight: 600;
}

.markdown-content :deep(table tr:nth-child(even)) {
  background: #f9fafb;
}

/* 链接样式 */
.markdown-content :deep(a) {
  color: #3b82f6;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.markdown-content :deep(a:hover) {
  border-bottom-color: #3b82f6;
}

.ai-markdown :deep(a) {
  color: #1e40af;
}

.ai-markdown :deep(a:hover) {
  border-bottom-color: #1e40af;
}

/* 粗体 */
.markdown-content :deep(strong) {
  font-weight: 600;
  color: #374151;
}

.ai-markdown :deep(strong) {
  color: #1e40af;
}

/* 斜体 */
.markdown-content :deep(em) {
  font-style: italic;
  color: #6b7280;
}

/* 图片 */
.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5em;
  margin: 0.5em 0;
}

/* 删除线 */
.markdown-content :deep(del) {
  text-decoration: line-through;
  color: #9ca3af;
}
</style>
