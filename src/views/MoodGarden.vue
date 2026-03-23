<template>
    <div class = "hall-wrapper">
        <div class = "hall-inner">
            <h2 class = "section-title">花园音乐</h2>
            <ul class = "playlist-list">
                <li
                    v-for = "item in playlists"
                    :key = "item.id"
                    class="playlist-item"
                    @click="handlePlaylistClick(item)"
                >
                    <div class = "cover-wrapper">
                        <img :src = "item.CoverUrl" :alt = "item.Name" />
                    </div>
                    <div class = "info">
                        <p class = "title">{{ item.Name }}</p>
                        <p class = "desc">{{ item.Description }}</p>
                    </div>
                </li>
            </ul>
            <!-- 新歌速递 -->
            <h2 class = "section-title section-title--sub">小G新推荐</h2>
            <ul class = "song-list">
                <li class = "song-item"
                v-for = "song in songsList"
                :key = "song.Id"
                @click = "handleTrackClick(song)"
                >
                    <div class = "song-cover">
                        <img :src = "song.CoverUrl" :alt = "song.Name" />
                    </div>
                    <div class = "song-info">
                        <p class = "song-name">{{ song.Name }}</p>
                        <p class = "song-artist">{{ song.SingerName }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getPlayList, getMusicList } from '../api/music/music'
import { useRouter } from 'vue-router'  // 添加这行

const router = useRouter()  // 添加这行
const playlists = ref([])
const songsList = ref([])

const fetchPlaylists = async () => {
    getPlayList({pageNum : 1, pageSize: 5}).then(res => {
        if (res.data.code == 10000) {
            playlists.value = res.data.data.PlaylistList
        }
    })
}

const fetchNewSongs = async () => {
    getMusicList({pageNum : 1, pageSize: 10}).then(res => {
        if (res.data.code == 10000) {
            songsList.value = res.data.data.SongList
        }
    })
}

onMounted(() => {
    fetchPlaylists()
    fetchNewSongs()
})

// 点击歌单项
const handlePlaylistClick = (row) => {
    // 处理播放列表点击事件
    if (!row.Id) return
    router.push({
        path: '/music-list',  // 注意：path 需要完整路径
        query: { id: row.Id }
    })
}


const handleTrackClick = (row) => {
    if (!row.Id) return
    router.push({
        path: '/music-player',  // 注意：path 需要完整路径
        query: { id: row.Id }
    })
}

</script>

<style scoped>
.hall-wrapper {
    display: flex;
    justify-content: center;
    background: linear-gradient(0deg, #ffd8e8 0%, #ffffff 100%);
}
.hall-inner {
    width: 100%;
    max-width: 1200px;
}
.section-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 16px;
    margin-top: 40px;
    color: #333;
}
.section-title--sub {
    margin-top: 40px;
}
.playlist-list {
    display: flex;
    gap: 20px;
    padding: 0;
    margin: 0;
    list-style: none;
}

.playlist-item {
    flex :1;
    max-width: 220px;
    cursor:pointer;
}
.cover-wrapper {
    width: 100%;
    aspect-ratio: 1/1;
    background:#eee;
    cursor: pointer;
    overflow: hidden;
    border-radius: 4px;
}

.cover-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
}
.cover-wrapper:hover img {
    transform: scale(1.08);
}
.info {
    margin-top: 8px;
}
.title {
    font-size: 16px;
    margin: 0 0 4px;
    color: #111;
    font-weight: bolder;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.desc {
    font-size: 13px;
    color: #999;
    margin :0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.song-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 40px;
    padding: 0;
    margin-bottom: 30px;
    list-style: none;
}
.song-item {
    display: flex;
    gap: 12px;
    align-items: center;
    cursor: pointer;
}
.song-cover {
    width: 82px;
    height: 82px;
    background: #eee;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
}
.song-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
}
.song-cover:hover img {
    transform: scale(1.08);
}
.song-info {
    flex: 1;
}
.song-name{
    font-size: 15px;
    margin: 0 0 4px;
    color: #282727;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 400;
    text-overflow: ellipsis;
}
.song-artist {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>