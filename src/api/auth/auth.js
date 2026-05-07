import service from '@/utils/request'

/**
 * 账号密码登录
 * @param {{ account: string, password: string }} data 登录信息
 * @returns {Promise<import('axios').AxiosResponse>} 响应中 headers 包含 access-token、refresh-token
 */
export function login(data) {
  const formData = new FormData()
  formData.append('account', data.account)
  formData.append('password', data.password)
  return service.post('/user/login', formData)
}

/**
 * 获取邮箱验证码
 * @param {string} email 邮箱地址
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function getVerifyCode(email) {
  return service.post('/user/email/code', { email: email }, {})
}

/**
 * 邮箱注册
 * @param {{ email: string, verify_code: string, password: string }} data 注册信息
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function register(data) {
  const formData = new FormData()
  formData.append('email', data.email)
  formData.append('verify_code', data.verify_code)
  formData.append('password', data.password)
  return service.post('/user/register', formData)
}

/**
 * 退出登录
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function logout() {
  return service.post('/user/logout')
}

/**
 * 上传头像
 * @param {File} file 图片文件
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)
  return service.post('/user/avatar', formData)
}

/**
 * 获取当前用户信息
 * @returns {Promise<import('axios').AxiosResponse>} data.data 包含用户信息
 */
export function getUserInfo() {
  return service.get('/user/info')
}

/**
 * 更新账号
 * @param {{ Account: string }} data
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function updateUserAccount(data) {
  return service.post('/user/update/account', data)
}

/**
 * 邮箱验证码登录
 * @param {{ email: string, verify_code: string }} data
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function verifyEmailAndLogin(data) {
  const formData = new FormData()
  formData.append('email', data.email)
  formData.append('verify_code', data.verify_code)
  return service.post('/user/email/login', formData)
}

/**
 * 更新用户名
 * @param {{ username: string }} data
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function updateUserName(data) {
  return service.post('/user/update/username', data)
}

/**
 * 更新性别
 * @param {{ gender: string }} data
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function updateUserGender(data) {
  return service.post('user/update/gender', data)
}
