<template>
    <div class = "navbar">
        <div class = "flex-box">
            <el-button @click="handleCollapse">
                <el-icon>
                    <Menu />
                </el-icon>
            </el-button>       
            <p class = "page-title">{{route.meta.title }}</p>
        </div>
        <div class = "flex-box">
            <el-dropdown @command = "handleCommand">
                <div class="flex-box">
                    <el-avatar :src="AvatarUrl"></el-avatar>
                    <p class="user-name">username</p>
                    <el-icon><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command = "logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>    
        </div>
    </div>
</template>

<script setup>
import { useAdminStore } from "../stores/admin";
import {useRouter,useRoute} from "vue-router";
import { ElMessageBox } from "element-plus";
import { lo } from "element-plus/es/locales.mjs";

const router = useRouter();
const route = useRoute();

const AvatarUrl = new URL('../assets/avatar.jpeg', import.meta.url).href;
const handleCollapse = () => {
    const adminStore = useAdminStore();
    adminStore.toggleCollapse();
}
const handleCommand = (command) => {
    if (command === 'logout'){
        ElMessageBox.confirm('确定要退出登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            // 确定登出
            // logout 接口
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            router.push('/auth/login');
        })
    }
}
</script>
<style>
.navbar{
    height: 64px;
    display:flex;
    align-items: center;
    justify-content: space-between;
    padding:0 15px;
    background-color: white;
    box-sizing: 0 1px 4px rgba(0, 21, 41, 0.08);
    border-bottom: 1px solid #e5e7eb;
    .flex-box {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .page-title {
        font-size: 26px;
        font-weight: bold;
        color: black;
        margin-left: 20px;
    }
    .user-name {
        margin: 0 10px;
        font-size: 16px;
        font-weight: bold;
        color: #333;
    }
}

</style>