/**
 * Markdown 工具函数
 * 用于处理 markdown 文本的各种场景
 */

/**
 * 移除 markdown 标记，提取纯文本
 * 用于会话列表预览等不需要格式化的场景
 * 
 * @param {string} markdown - 原始 markdown 文本
 * @returns {string} 纯文本内容
 */
export function stripMarkdown(markdown) {
  if (!markdown) return ''
  
  let text = markdown
  
  // 移除代码块
  text = text.replace(/```[\s\S]*?```/g, '[代码]')
  
  // 移除行内代码
  text = text.replace(/`([^`]+)`/g, '$1')
  
  // 移除图片，保留 alt 文本
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, (match, alt) => alt || '[图片]')
  
  // 移除链接，保留文本
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  
  // 移除标题标记
  text = text.replace(/^#{1,6}\s+/gm, '')
  
  // 移除粗体和斜体
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '$1') // 粗斜体
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1') // 粗体
  text = text.replace(/\*([^*]+)\*/g, '$1') // 斜体
  text = text.replace(/___([^_]+)___/g, '$1') // 粗斜体
  text = text.replace(/__([^_]+)__/g, '$1') // 粗体
  text = text.replace(/_([^_]+)_/g, '$1') // 斜体
  
  // 移除删除线
  text = text.replace(/~~([^~]+)~~/g, '$1')
  
  // 移除列表标记
  text = text.replace(/^[-*+]\s+/gm, '')
  text = text.replace(/^\d+\.\s+/gm, '')
  
  // 移除任务列表标记
  text = text.replace(/^-?\s*\[[ x]\]\s+/gm, '')
  
  // 移除引用标记
  text = text.replace(/^>\s+/gm, '')
  
  // 移除分割线
  text = text.replace(/^[-*_]{3,}$/gm, '')
  
  // 移除表格分隔符
  text = text.replace(/\|/g, ' ')
  
  // 清理多余空白
  text = text.replace(/\n{3,}/g, '\n\n')
  text = text.replace(/\n/g, ' ')
  text = text.replace(/\s{2,}/g, ' ')
  text = text.trim()
  
  return text
}

/**
 * 截断文本并添加省略号
 * 
 * @param {string} text - 要截断的文本
 * @param {number} maxLength - 最大长度（默认 100）
 * @param {string} ellipsis - 省略号（默认 '...'）
 * @returns {string} 截断后的文本
 */
export function truncateText(text, maxLength = 100, ellipsis = '...') {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + ellipsis
}

/**
 * 格式化会话预览文本
 * 移除 markdown 标记并截断到指定长度
 * 
 * @param {string} markdown - 原始 markdown 文本
 * @param {number} maxLength - 最大长度（默认 60）
 * @returns {string} 格式化后的预览文本
 */
export function formatSessionPreview(markdown, maxLength = 60) {
  const plainText = stripMarkdown(markdown)
  return truncateText(plainText, maxLength)
}

/**
 * 配置常量
 * 可以在此统一管理各种长度限制
 */
export const MARKDOWN_CONFIG = {
  // 会话列表预览长度
  SESSION_PREVIEW_LENGTH: 60,
  
  // 通知消息预览长度
  NOTIFICATION_PREVIEW_LENGTH: 50,
  
  // 搜索结果预览长度
  SEARCH_RESULT_PREVIEW_LENGTH: 100,
  
  // 省略号样式
  ELLIPSIS: '...',
}
