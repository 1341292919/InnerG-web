import service from '@/utils/request'

/**
 * 获取歌单列表
 * @param {{ pageNum: number, pageSize: number }} params 分页参数
 * @returns {Promise<import('axios').AxiosResponse>} data.data.PlaylistList 为歌单数组
 */
export function getPlayList(params) {
  return service.get('music/playlist/list', { params })
}

/**
 * 获取歌曲列表
 * @param {{ pageNum: number, pageSize: number }} params 分页参数
 * @returns {Promise<import('axios').AxiosResponse>} data.data.SongList 为歌曲数组
 */
export function getMusicList(params) {
  return service.get('music/song/list', { params })
}

/**
 * 获取歌单详情（含歌曲列表）
 * @param {number|string} playlistId 歌单 ID
 * @returns {Promise<import('axios').AxiosResponse>} data.data.PlaylistDetail 包含 Songs
 */
export function getPlayListDetail(playlistId) {
  return service.get('music/playlist/detail', { params: { playlistId } })
}

/**
 * 获取歌曲详情
 * @param {number|string} songId 歌曲 ID
 * @returns {Promise<import('axios').AxiosResponse>} data.data.SongDetail 为歌曲信息
 */
export function getMusicDetail(songId) {
  return service.get('music/song/detail', { params: { songId } })
}
