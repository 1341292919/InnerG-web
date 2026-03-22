import service from '../../utils/request';

export function getPlayList(params) {
  return service.get('music/playlist/list', { params });
}

export function getMusicList(params) {
  return service.get('music/song/list', { params });
}

export function getPlayListDetail(playlistId) {
  return service.get('music/playlist/detail', { params: {  playlistId } });
}

export function getMusicDetail(songId) {
  return service.get('music/song/detail', { params: { songId } });
}