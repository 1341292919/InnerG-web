import service from '@/utils/request'

/**
 * 分页查询情绪日志
 * GET /api/v1/emotion-diary/admin/page
 * @param {import('../types').MoodLogPageParams} params
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: import('../response-types').PageData}>>}
 */
export function moodLogPage(params) {
  return service.get('/emotion-diary/admin/page', { params })
}
