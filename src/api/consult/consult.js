import service from '@/utils/request'

/**
 * 创建新会话
 * @returns {Promise<import('axios').AxiosResponse>} data.data.SessionId 为新会话 ID
 */
export function newSession() {
  return service.post('contact/session/start')
}

/**
 * 获取会话列表
 * @param {{ pageNum: number, pageSize: number }} params 分页参数
 * @returns {Promise<import('axios').AxiosResponse>} data.data.SessionList 为会话数组
 */
export function getSessionList(params) {
  return service.get('contact/session/list', { params })
}

/**
 * 获取会话详情
 * @param {string} sessionId 会话 ID
 * @returns {Promise<import('axios').AxiosResponse>} data.data.SessionDetail 包含 Messages
 */
export function getSessionDetail(sessionId) {
  return service.get('contact/session/detail', { params: { sessionId } })
}

/**
 * 删除会话
 * @param {string} sessionId 会话 ID
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function deleteSession(sessionId) {
  return service.post('contact/session/delete', { sessionId })
}
