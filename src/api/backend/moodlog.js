import service from '@/utils/request'

/**
 * 分页查询情绪日志
 * @param {{ pageNum?: number, pageSize?: number, userId?: string, moodScoreRange?: string }} params 查询参数
 * @returns {Promise<import('axios').AxiosResponse>} data.data 包含 records、total
 */
export function moodLogPage(params) {
  return service.get('/emotion-diary/admin/page', { params })
}
