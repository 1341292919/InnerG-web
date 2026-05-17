import service from '@/utils/request'

/**
 * 获取分类树
 * GET /api/v1/knowledge/category/tree
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: import('../response-types').CategoryTreeNode[]}>>}
 */
export function categoryTree() {
  return service.get('/knowledge/category/tree')
}

/**
 * 分页查询文章列表
 * GET /api/v1/knowledge/article/page
 * @param {import('../types').ArticlePageParams} params
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: import('../response-types').PageData}>>}
 */
export function articlePage(params) {
  return service.get('/knowledge/article/page', { params })
}

/**
 * 上传文件
 * POST /api/v1/file/upload
 * @param {File} file
 * @param {import('../types').UploadFileBusinessInfo} businessInfo
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').ApiResponse>>}
 */
export function uploadFile(file, businessInfo) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessField', 'cover')
  formData.append('businessId', businessInfo.businessId)
  return service.post('/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 创建文章
 * POST /api/v1/knowledge/article
 * @param {object} data
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').ApiResponse>>}
 */
export function createArticle(data) {
  return service.post('/knowledge/article', data)
}

/**
 * 获取文章详情
 * GET /api/v1/knowledge/article/:id
 * @param {number|string} id
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: object}>>}
 */
export function getArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`)
}

/**
 * 更新文章
 * PUT /api/v1/knowledge/article/:id
 * @param {number|string} id
 * @param {object} data
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').ApiResponse>>}
 */
export function updateArticle(id, data) {
  return service.put(`/knowledge/article/${id}`, data)
}

/**
 * 修改文章状态（发布 / 下线）
 * PUT /api/v1/knowledge/article/:id/status
 * @param {number|string} id
 * @param {import('../types').ChangeStatusParams} data
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').ApiResponse>>}
 */
export function changeArticleStatus(id, data) {
  return service.put(`/knowledge/article/${id}/status`, data)
}

/**
 * 删除文章
 * DELETE /api/v1/knowledge/article/:id
 * @param {number|string} id
 * @returns {Promise<import('axios').AxiosResponse<import('../response-types').ApiResponse>>}
 */
export function deleteArticle(id) {
  return service.delete(`/knowledge/article/${id}`)
}
