<template>
    <div class = "player-page">
        <div class = "player-inner">
            <div class = "player-main">
                <!-- 只保留左侧内容，并居中显示 -->
                <div class = "player-left">
                    <div class = "cover-wrap">
                        <div class = "cover-disc">
                            <img class = "cover-img" :src="songDetail.CoverUrl" :alt="songDetail.Name">
                        </div>
                    </div>
                    <div class = "song-meta">
                        <h2 class = "song-title">{{ songDetail.Name }}</h2>
                        <p class = "song-artist">{{ songDetail.SingerName }}</p>
                        <p class = "song-album">{{ songDetail.Description }}</p>
                    </div>
                </div>
            </div>
            <div class = "player-controls">
                <div class = "controls-main" style="justify-content: center;">
                    <button class = "btn-circle btn-large" @click = "handleTogglePlay">
                        {{ isPlaying ? '⏸' : '▶' }}
                    </button>
                </div>
                <div class = "progress-wrap">
                    <span class = "time-label">{{ formatTime(currentTime) }}</span>
                    <div class = "progress-bar" @click = "handleProgressBarClick">
                       <div class = "progress-inner" :style = "{width:duration?`${(currentTime/duration)*100}%`:'0%'}"></div>
                    </div>
                    <span class = "time-label">{{ formatTime(duration) }}</span>    
                </div>
                <audio
                    ref="audioRef"
                    :src="songDetail.SourceUrl"
                    class = "audio-hidden"
                    v-if = "songDetail.SourceUrl"
                    @loadedmetadata="handleLoadedMetadata"
                    @timeupdate = "handleTimeUpdate"
                    @ended = "handlePlayerEnded"
                ></audio>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMusicDetail } from '../api/music/music'

const route = useRoute()

const songId = computed(() => route.query.id)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// 音频元素引用
const audioRef = ref(null)

onMounted(() => {
    if (songId.value) {
        fetchSongDetail()
    }
})

// 获取歌曲详情数据
const fetchSongDetail = async () => {
    getMusicDetail(songId.value).then((response) => {
        if (response.data.code == 10000){
            songDetail.value = response.data.data.SongDetail
            console.log('歌曲详情数据:', songDetail)
        }
    }).catch((error) => {
        console.error('获取歌曲详情失败:', error)
    })
}
const songDetail = ref({
})

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 加载歌曲源数据
const handleLoadedMetadata = (event) => {
    const audio = event.target
    if (audio) {
        duration.value = audio.duration
        console.log('歌曲时长:', formatTime(duration.value))
    }
}
// 播放
const handleTogglePlay = () => {
    const audio = audioRef.value
    if (!audio || !songDetail.value.SourceUrl) return
    
    if (audio.paused) {
        audio.play().then(() => {
            isPlaying.value = true
        }).catch((error) => {
            console.error('播放失败:', error)
        })
    } else {
        audio.pause()
        isPlaying.value = false
    }
}
// 播放结束
const handlePlayerEnded = () => {
    isPlaying.value = false
    currentTime.value = 0
}

// 歌曲播放时间更新
const handleTimeUpdate= () => {
    const audio = audioRef.value
    currentTime.value = audio.currentTime || 0
    if (audio.duration){
        duration.value = audio.duration
    }
}

// 进度条点击事件
const handleProgressBarClick = (event) => {
    const bar = event.currentTarget
    const rect = bar.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    const audio = audioRef.value
    if (audio && songDetail.value.SourceUrl) {
        audio.currentTime = ratio * audio.duration
        currentTime.value = audio.currentTime
    }
}
</script>

<style scoped>
.player-page {
    min-height: 758px;
    background: radial-gradient(circle at top left, #3a2a30, #1a1215);
    color: #f5f5f5;
    display: flex;
    justify-content: center;
    padding: 40px 0;
    box-sizing: border-box;
}
.player-inner{
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    justify-content:space-between;
    gap:32px;
}
.player-main {
    width:100%;
    display: flex;
    justify-content: center;
}
.player-left {
    width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.cover-wrap {
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: radial-gradient(circle,#444,#111);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.7);
}

.cover-disc {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    overflow: hidden;
}
.cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.song-meta {
    margin-top: 20px;
    text-align: center;
}
.song-title {
    font-size: 24px;
    font-weight: bold;
    margin:0;
}
.song-artist, .song-album {
    margin:0;
    font-size: 13px;
    color: #cfcfcf;
}
.player-controls{
    width: 100%;
    padding: 16px 24px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 30px;
}
.audio-hidden {
    display: none;
}
.controls-main{
    display: flex;
    align-items: center;
    gap: 24px;
}
.btn-circle {
    border: none;
    border-radius: 50%;
    cursor: pointer;
    background :#fff;
}
.btn-large{
    width: 56px;
    height: 56px;
    font-size:22px;
}
.btn-small {
    width: 40px;
    height: 40px;
    font-size: 18px;
}
.btn-circle:hover{
    transform:translateY(-1px)
}
.progress-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
}
.time-label {
    font-size: 12px;
    color: #c0c0c0;
}
.progress-bar{
    flex:1;
    height:4px;
    border-radius:999px;
    background:rgba(255,255,255,0.2);
    overflow: hidden;
    cursor: pointer;
}
.progress-inner{
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg,#ff4b2b,#ff416c);
}
.controls-extra{
    display: none;
}
.extra-left, .extra-right {
    display :none;
}
.btn-text{
    display: none;
}
.btn-text:hover{
    color: #fff;
}

@media (max-width: 960px) {
    .player-inner {
        flex-direction: column;
    }
    .player-main {
        flex-direction: column;
        align-items: center;
    }
    .player-left {
        width:auto;
    }
}
</style>