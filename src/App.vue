<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo, refreshToken, clearAuth } from '@/api'
import { ElMessage } from 'element-plus'

const router = useRouter()

onMounted(async () => {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) return

  try {
    await getUserInfo()
  } catch {
    try {
      const res = await refreshToken()
      localStorage.setItem('accessToken', res.headers['access-token'])
      if (res.headers['refresh-token']) {
        localStorage.setItem('refreshToken', res.headers['refresh-token'])
      }
    } catch {
      clearAuth()
      router.push('/auth/login')
      ElMessage.warning('登录已过期，请重新登录')
    }
  }
})
</script>
