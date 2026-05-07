import service from '@/utils/request'

/**
 * 获取分类树
 * @returns {Promise<import('axios').AxiosResponse>} data.data 为分类树数组
 */
export function categoryTree() {
  return service.get('/knowledge/category/tree')
}

/**
 * 分页查询文章列表
 * @param {{ pageNum?: number, pageSize?: number, title?: string, categoryId?: number, status?: number }} params 查询参数
 * @returns {Promise<import('axios').AxiosResponse>} data.data 包含 records、total
 */
export function articlePage(params) {
  return service.get('/knowledge/article/page', { params })
}

/**
 * 上传文件
 * @param {File} file 文件
 * @param {{ businessId: string|number }} businessInfo 业务信息
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function uploadFile(file, businessInfo) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessField', 'cover')
  formData.append('businessId', businessInfo.businessId)
  return service.post('file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 创建文章
 * @param {object} data 文章数据
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function createArticle(data) {
  return service.post('/knowledge/article', data)
}

/**
 * 获取文章详情
 * @param {number|string} id 文章 ID
 * @returns {Promise<import('axios').AxiosResponse>} data.data 为文章详情
 */
export function getArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`)
}

/**
 * 更新文章
 * @param {number|string} id 文章 ID
 * @param {object} data 更新数据
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function updateArticle(id, data) {
  return service.put(`/knowledge/article/${id}`, data)
}

/**
 * 修改文章状态（发布 / 下线）
 * @param {number|string} id 文章 ID
 * @param {{ status: number }} data 状态值
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function changeArticleStatus(id, data) {
  return service.put(`/knowledge/article/${id}/status`, data)
}

/**
 * 删除文章
 * @param {number|string} id 文章 ID
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function deleteArticle(id) {
  return service.delete(`/knowledge/article/${id}`)
}
