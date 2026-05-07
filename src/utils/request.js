import axios from 'axios'
import { ElMessage } from 'element-plus'

/**
 * Axios 实例，预配置 baseURL 和超时时间
 */
const service = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

/**
 * 请求拦截器：自动注入 accessToken
 */
service.interceptors.request.use(
  (config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = accessToken
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

/**
 * 响应拦截器：统一解包与错误处理
 * - code == 10000：正常返回
 * - code == 401/419：清除 token，跳转登录页
 * - 其他错误码：ElMessage 提示错误信息
 */
service.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code == 10000) {
      return response
    }

    ElMessage.error(data.message || '请求失败')

    if (data.code == 401 || data.code == 419) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('userAvatar')
      window.location.href = '/auth/login'
    }

    return Promise.reject(data)
  },
  (error) => {
    console.error('响应错误:', error)
    ElMessage.error('网络异常，请稍后再试')
    return Promise.reject(error)
  },
)

export default service
