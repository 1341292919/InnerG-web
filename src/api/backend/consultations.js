import service from '@/utils/request'

/**
 * 分页查询咨询记录
 * @param {{ pageNum?: number, pageSize?: number }} params 分页参数
 * @returns {Promise<import('axios').AxiosResponse>} data 包含 records、total
 */
export function consultationPage(params) {
  return service.get('/psychological-chat/sessions', { params })
}

/**
 * 获取咨询会话消息详情
 * @param {number|string} sessionId 会话 ID
 * @returns {Promise<import('axios').AxiosResponse>} data 为消息数组
 */
export function getSessionDetail(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
