import service from '@/utils/request'

/**
 * 分页查询咨询记录（管理端）
 * GET /api/v1/psychological-chat/sessions
 * @param {import('../types').PageParams} params
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: import('../response-types').PageData}>>}
 */
export function consultationPage(params) {
  return service.get('/psychological-chat/sessions', { params })
}

/**
 * 获取咨询会话消息详情（管理端）
 * GET /api/v1/psychological-chat/sessions/:sessionId/messages
 * @param {number|string} sessionId
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: Array}>>}
 */
export function getSessionMessages(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
