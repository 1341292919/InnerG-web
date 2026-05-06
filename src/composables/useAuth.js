import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout as logoutApi, getUserInfo } from '@/api/auth/auth'

export function useAuth() {
  const router = useRouter()
  const isLoggedIn = ref(false)
  const userAvatarUrl = ref('')

  function checkLoginStatus() {
    isLoggedIn.value = localStorage.getItem('accessToken') !== null
    const avatar = localStorage.getItem('userAvatar')
    if (avatar) {
      userAvatarUrl.value = avatar
    } else {
      userAvatarUrl.value = new URL('../assets/brand_icon.svg', import.meta.url).href
    }
  }

  async function logout() {
    router.push('/')
    isLoggedIn.value = false
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userAvatar')
    await logoutApi()
    userAvatarUrl.value = new URL('../assets/brand_icon.svg', import.meta.url).href
  }

  async function updateUserInfo() {
    const res = await getUserInfo()
    if (res.data.code == 10000) {
      const userInfo = res.data.data
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      if (userInfo.Avatar) {
        userAvatarUrl.value = userInfo.Avatar
        localStorage.setItem('userAvatar', userInfo.Avatar)
      }
    }
  }

  return { isLoggedIn, userAvatarUrl, checkLoginStatus, logout, updateUserInfo }
}
