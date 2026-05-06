import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

service.interceptors.request.use(
  (config) => {
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
