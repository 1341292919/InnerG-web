import service from '@/utils/request'

/**
 * 创建新会话
 * POST /api/v1/contact/session/start
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').NewSessionResponse>>}
 */
export function newSession() {
  return service.post('/contact/session/start')
}

/**
 * 分页查询咨询会话列表
 * GET /api/v1/contact/session/list
 * @param {import('../types').PageParams} params
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: import('../response-types').SessionListData}>>}
 */
export function getSessionList(params) {
  return service.get('/contact/session/list', { params })
}

/**
 * 查看会话记录
 * GET /api/v1/contact/session/detail
 * @param {string} sessionId
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: import('../response-types').SessionDetailData}>>}
 */
export function getSessionDetail(sessionId) {
  return service.get('/contact/session/detail', { params: { sessionId } })
}

/**
 * 删除会话
 * POST /api/v1/contact/session/delete
 * @param {string} sessionId
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').EmptyResponse>>}
 */
export function deleteSession(sessionId) {
  return service.post('/contact/session/delete', { sessionId })
}
