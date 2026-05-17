import service from '@/utils/request'

/**
 * 获取歌单列表
 * GET /api/v1/music/playlist/list
 * @param {import('../types').PageParams} params
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: import('../response-types').PlaylistListData}>>}
 */
export function getPlayList(params) {
  return service.get('/music/playlist/list', { params })
}

/**
 * 获取歌单详情（含歌曲列表）
 * GET /api/v1/music/playlist/detail
 * @param {number|string} playlistId
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: import('../response-types').PlaylistDetailData}>>}
 */
export function getPlayListDetail(playlistId) {
  return service.get('/music/playlist/detail', { params: { playlistId } })
}

/**
 * 分页查询歌曲
 * GET /api/v1/music/song/list
 * @param {import('../types').PageParams} params
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: import('../response-types').SongListData}>>}
 */
export function getMusicList(params) {
  return service.get('/music/song/list', { params })
}

/**
 * 获取歌曲详情
 * GET /api/v1/music/song/detail
 * @param {number|string} songId
 * @returns {Promise<import('axios').AxiosResponse<{code: string, message: string, data: import('../response-types').SongDetailData}>>}
 */
export function getMusicDetail(songId) {
  return service.get('/music/song/detail', { params: { songId } })
}
