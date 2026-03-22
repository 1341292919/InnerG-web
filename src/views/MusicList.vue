<template>
    <div class = "musiclist-page">
        <div class = "musiclist-inner">
            <h2 class = "title">
                {{ playlistName }}
            </h2>
            <div class = "tip" v-if = "loading">
                Loading...
            </div>
            <div v-else-if="playSongsList.length === 0">
                暂无歌曲
            </div>
            <ul class = "track-list">
                <li 
                    class = "track-item"
                    v-for = "(song, index) in playSongsList"
                    :key = "song.Id"
                    @click = "handleTrackClick(song)"
                >
                    <span class = "track-index">{{ index + 1 }}</span>
                    <div class = "track-main">
                        <span class = "track-name">{{ song.Name }}</span>
                        <span class = "track-artist">{{ song.SingerName }}</span>
                    </div>
                    <div class="track-extra">
                        <span class = "track-album">{{ song.album || "未知专辑" }}</span>
                        <span class = "track-duration">{{ song.duration || "0:00" }}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMusicList, getPlayList, getPlayListDetail } from '../api/music/music'
const route = useRoute()
const router = useRouter()

const playlistId = computed(() => route.query.id)
const loading = ref(false)

// 获取播放列表数据
const playSongsList = ref([])
const playlistName = ref('')

onMounted(() => {
    getPlayListSongsList()
})

const getPlayListSongsList = () =>{
    loading.value = true
    getPlayListDetail(playlistId.value).then(res => {
        if (res.data.code == 10000) {
            playlistName.value = res.data.data.PlaylistDetail.Name
            playSongsList.value = res.data.data.PlaylistDetail.Songs
        }
        loading.value = false
    }).catch(() => {
        loading.value = false
    })
}

// 进入播放
const handleTrackClick = (song) => {
    if (!song.Id) return
    router.push({
        path : 'music-player',
        query : { id: song.Id }
    })
}
</script>

<style scoped >
.musiclist-page {
    padding: 24px 32px;
    box-sizing: border-box;
    min-height: calc(100vh-90px);
    background: linear-gradient(120deg, #fff5f0 0%, #ffffff 100%);
}
.musiclist-inner {
    max-width: 1200px;
    margin: 0 auto;
}
.title {
    font-size: 20px;
    font-weight: 600;
    margin:0 0 16px;
}
.tip {
    margin-top:  16px;
    font-size: 14px;
    color: #777;
}
.track-list {
    margin: 12px 0 0;
    list-style: none;
    padding: 0;
    list-style: none;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.6);
}
.track-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f2f2f2;
    font-size: 13px;
}
.track-item:last-of-type {
    border-bottom: none;
}
.track-item:hover {
    background: #fafafa;
}
.track-index {
    width: 32px;
    text-align: right;
    color: #999;
    margin-right: 12px;
    flex-shrink: 0;
}
.track-main {
    display: flex;
    flex-direction: column;
    max-width: 50%;
}
.track-name{
    font-size: 15px;
    color: #222;
    font-weight: 560;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.track-artist {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #999;
    margin-top: 2px;
}
.track-extra{
    display: flex;
    gap: 16px;
    margin-left: auto;
    max-width: 40%;
    align-items: center;
}
.track-album {
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.track-duration {
    color: #999;
    flex-shrink: 0;
}
</style>