import axios from 'axios'
import { ElMessage } from 'element-plus'
import { ResultEnum, RejectEnum, SuccessCodeList } from '@/api/enum'

const service = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

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

let refreshing = false
let pendingQueue = []

function replayQueue() {
  pendingQueue.forEach(({ resolve, config }) => {
    resolve(service(config))
  })
  pendingQueue = []
}

function rejectQueue(reason) {
  pendingQueue.forEach(({ reject }) => {
    reject(reason)
  })
  pendingQueue = []
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) {
    throw new Error('No refresh token')
  }
  return service.get('/user/refresh-token', {
    headers: { Authorization: refreshToken },
  })
}

service.interceptors.response.use(
  (response) => {
    const { data, config } = response

    if (refreshing && config.url !== '/user/refresh-token') {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ config, resolve, reject })
      })
    }

    if (SuccessCodeList.includes(data.code)) {
      return response
    }

    if (data.code === ResultEnum.AuthAccessExpiredCode) {
      refreshing = true
      return refreshAccessToken()
        .then((res) => {
          const headers = res.headers
          if (headers['access-token']) {
            localStorage.setItem('accessToken', headers['access-token'])
          }
          if (headers['refresh-token']) {
            localStorage.setItem('refreshToken', headers['refresh-token'])
          }
          replayQueue()
          refreshing = false
          return service(config)
        })
        .catch(() => {
          rejectQueue({ type: RejectEnum.AuthFailed })
          refreshing = false
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('userInfo')
          localStorage.removeItem('userAvatar')
          window.location.href = '/auth/login'
          return Promise.reject({ type: RejectEnum.AuthFailed })
        })
    }

    ElMessage.error(data.message || '请求失败')

    if (data.code === ResultEnum.AuthInvalidCode || data.code === ResultEnum.AuthRefreshExpiredCode) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('userAvatar')
      window.location.href = '/auth/login'
    }

    return Promise.reject({ type: RejectEnum.BizFailed, data })
  },
  (error) => {
    console.error('响应错误:', error)
    if (error.message && error.message.includes('timeout')) {
      ElMessage.error('请求超时，请稍后再试')
      return Promise.reject({ type: RejectEnum.Timeout })
    }
    if (error.message && error.message.includes('Network Error')) {
      ElMessage.error('网络异常，请稍后再试')
      return Promise.reject({ type: RejectEnum.NetworkError })
    }
    ElMessage.error('网络异常，请稍后再试')
    return Promise.reject({ type: RejectEnum.InternalFailed, data: error })
  },
)

export default service
