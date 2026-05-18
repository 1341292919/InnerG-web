import service from '@/utils/request'

/**
 * 账号密码登录
 * POST /api/v1/user/login
 * @param {import('../types').LoginParams} data
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').LoginResponse, any>>}
 */
export function login(data) {
  const formData = new FormData()
  formData.append('account', data.account)
  formData.append('password', data.password)
  return service.post('/user/login', formData)
}

/**
 * 获取邮箱验证码
 * POST /api/v1/user/email/code
 * @param {string} email
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').EmptyResponse>>}
 */
export function getVerifyCode(email) {
  return service.post('/user/email/code', { email })
}

/**
 * 邮箱注册
 * POST /api/v1/user/register
 * @param {import('../types').RegisterParams} data
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').EmptyResponse>>}
 */
export function register(data) {
  const formData = new FormData()
  formData.append('email', data.email)
  formData.append('verify_code', data.verify_code)
  formData.append('password', data.password)
  return service.post('/user/register', formData)
}

/**
 * 邮箱验证码登录
 * POST /api/v1/user/email/login
 * @param {import('../types').EmailLoginParams} data
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').LoginResponse, any>>}
 */
export function verifyEmailAndLogin(data) {
  const formData = new FormData()
  formData.append('email', data.email)
  formData.append('verify_code', data.verify_code)
  return service.post('/user/email/login', formData)
}

/**
 * 获取当前用户信息
 * GET /api/v1/user/info
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').LoginResponse>>}
 */
export function getUserInfo() {
  return service.get('/user/info')
}

/**
 * 退出登录
 * POST /api/v1/user/logout
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').EmptyResponse>>}
 */
export function logout() {
  return service.post('/user/logout')
}

/**
 * 上传头像
 * POST /api/v1/user/avatar
 * @param {File} file
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').AvatarResponse>>}
 */
export function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)
  return service.post('/user/avatar', formData)
}

/**
 * 更新账号
 * POST /api/v1/user/update/account
 * @param {import('../types').UpdateAccountParams} data
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').EmptyResponse>>}
 */
export function updateUserAccount(data) {
  return service.post('/user/update/account', data)
}

/**
 * 更新用户名
 * POST /api/v1/user/update/username
 * @param {import('../types').UpdateUserNameParams} data
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').EmptyResponse>>}
 */
export function updateUserName(data) {
  return service.post('/user/update/username', data)
}

/**
 * 更新性别
 * POST /api/v1/user/update/gender
 * @param {import('../types').UpdateGenderParams} data
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').EmptyResponse>>}
 */
export function updateUserGender(data) {
  return service.post('/user/update/gender', data)
}

/**
 * 刷新 token
 * GET /api/v1/user/refresh-token
 * 请求头携带 refresh-token，刷新成功会在 response header 返回新的 access-token 和 refresh-token
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string}>>}
 */
export function refreshToken() {
  const token = localStorage.getItem('refreshToken')
  return service.get('/user/refresh-token', {
    headers: { Authorization: token },
  })
}

/**
 * 清理本地登录态
 */
export function clearAuth() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('userAvatar')
}
