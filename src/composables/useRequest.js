import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export function useRequest(apiFunc) {
  const loading = ref(false)
  const error = ref(null)

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
