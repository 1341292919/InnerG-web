<template>
    <div class = "frontend-layout">
        <div class ="navbar-container" :style="{ background: navbarGradient }">
            <div class = "brand-section">
                <el-image style = "width:50px;height:50px" :src ="iconUrl" alt = "品牌logo" class = "brand-logo" />
                <h1 class= "brand-name">INNERG</h1>
            </div>
            <div class = "nav-section">
                <router-link to = "/" class = "nav-link">首页</router-link>
                <router-link to = "/consult" class = "nav-link" v-if = "isLoggedIn">咨询小G</router-link>
                <router-link to = "/emotion-diary" class = "nav-link" v-if = "isLoggedIn">情绪花园</router-link>
                <router-link to = "/knowledge" class = "nav-link">知识库</router-link>
                <el-dropdown 
                    v-if="isLoggedIn" 
                    trigger="hover" 
                    @command="handleDropdownCommand"
                >
                    <el-avatar :src="userAvatarUrl" class="user-avatar" />
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="profile" >个人信息</el-dropdown-item>
                            <el-dropdown-item command="logout" divided >退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

                <template v-else>
                    <router-link to = '/auth/login' class = "nav-link">登录</router-link>
                    <router-link to ='/auth/register' class = "nav-link">
                        <el-button type = "primary">注册</el-button>
                    </router-link>
                </template>
            </div>
        </div>
        <div class ="main-content">
            <router-view></router-view>
        </div>
        <div class ="footer-container">
            <div class = "footer-bottom">
                <p>&copy; 2026 INNERG . All rights reserved</p>
            </div>
        </div>
        <UserInfo v-if="showProfile" @close="showProfile = false" @update="UserInfoUpdate" />
    </div>
</template>



<script setup>
import { lo, ro } from 'element-plus/es/locales.mjs'
import{ref,onMounted,computed} from 'vue'
import { useRouter,useRoute } from 'vue-router' 
import { logout,getUserInfo } from '../api/auth/auth.js'
import UserInfo from './UserInfo.vue'
const iconUrl = new URL('../assets/dog.svg',import.meta.url).href

const isLoggedIn = ref(false)
const router = useRouter()
const route = useRoute()
// 根据当前路由返回对应的渐变样式
const navbarGradient = computed(() => {
    const path = route.path
    
    switch (path) {
        case '/':
            return 'linear-gradient(180deg, #c5fbf4 0%, #ffffff 100%)'  // 首页 - 清新绿
        case '/consult':
            return  'linear-gradient(180deg, #fff0d4 0%, #ffffff 100%)'  // AI咨询 - 暖黄
        case '/emotion-diary':
            return 'linear-gradient(180deg, #ffe0f0 0%, #ffffff 100%)'  // 情绪日记 - 粉嫩
        case '/knowledge':
            return 'linear-gradient(180deg, #e0e7ff 0%, #ffffff 100%)'  // 知识库 - 淡紫
        case '/music-player':
            return 'linear-gradient(180deg, #c5b0b3 0%, #ffffff 100%)' // 音乐播放器 
        case '/music-list':
            return 'linear-gradient(180deg, #ffe0f0 0%, #ffffff 100%)'  // 音乐列表 - 清新绿
        default:
            return 'linear-gradient(180deg, #c5fbf4 0%, #ffffff 100%)'
    }
})

const userAvatarUrl = ref('') 
onMounted(()=>{
    isLoggedIn.value = localStorage.getItem('accessToken') !== null
    const avatar = localStorage.getItem('userAvatar')
    if (avatar) {
        userAvatarUrl.value = avatar
    } else {
        userAvatarUrl.value = new URL('../assets/brand_icon.svg', import.meta.url).href
    }
    UserInfoUpdate()
})

const handleLogout = () => {
    router.push('/')
    isLoggedIn.value = false
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userAvatar')
    logout().then(() => {
        userAvatarUrl.value = new URL('../assets/brand_icon.svg', import.meta.url).href
    })
}

// 处理下拉菜单命令
// 处理下拉菜单点击
const handleDropdownCommand = (command) => {
    if (command === 'profile') {
        // 打开个人信息弹窗
        // 这里需要你添加控制弹窗显示的状态
        showProfile.value = true
    } else if (command === 'logout') {
        handleLogout()
    }
}
// 查看个人信息
const showProfile = ref(false)
const UserInfoUpdate = () => {
    getUserInfo().then((res) => {
        if (res.data.code == 10000) {
            console.log('用户信息已更新，刷新数据')
            const userInfo = res.data.data
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            if (userInfo.Avatar) {
                userAvatarUrl.value = userInfo.Avatar
                localStorage.setItem('userAvatar', userInfo.Avatar)
            }
        }
    })
}
</script>

<style lang = "scss" scoped>
.frontend-layout {
        background-color: #fff;
        .navbar-container {
            margin: 0 auto;
            padding: 10px;
            display: flex;
            width: 98%;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            .brand-section {
                display: flex;
                align-items: center;
                margin-left: 250px;
                .brand-name {
                    margin-left: 10px;
                    font-size: 24px;
                    font-weight: 600;
                    color: #333;
                }
            }
            .nav-section {
                display: flex;
                align-items: center;
                gap: 40px;
                margin-right: 230px;
                .nav-link {
                    color: #4b5563;
                    font-size: 16px;
                    font-weight: 500;
                    &:hover {
                        color: #4A90E2;
                    }
                } 
            }
        }

        .footer-container {
            background: #1f2937;
            color: white;
            padding: 15px 0;
            margin-top: auto;
            .footer-bottom {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 10px;
                text-align: center;
            }
        }
    }
</style>

<style lang="scss">
.el-dropdown-menu__item {
    color: #4b5563 !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    
    &:hover {
        color: #4A90E2 !important;
        background-color: transparent !important;
    }
}
</style>