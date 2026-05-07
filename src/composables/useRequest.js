import { ref } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 通用请求组合式函数：管理 loading / error 状态
 * @template T
 * @param {(...args: any[]) => Promise<T>} apiFunc API 请求函数
 * @returns {{ loading: import('vue').Ref<boolean>, error: import('vue').Ref<Error|null>, execute: (...args: any[]) => Promise<T> }}
 */
export function useRequest(apiFunc) {
  /** 加载状态 */
  const loading = ref(false)
  /** 错误信息 */
  const error = ref(null)

  /**
   * 执行请求
   * @param {...any} args 传递给 apiFunc 的参数
   * @returns {Promise<T>} 请求结果
   */
  async function execute(...args) {
    loading.value = true
    error.value = null
    try {
      const result = await apiFunc(...args)
      return result
    } catch (err) {
      error.value = err
      ElMessage.error(err.message || '请求失败')
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, error, execute }
}
