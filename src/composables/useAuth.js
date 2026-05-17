import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout as logoutApi, getUserInfo } from '@/api'

/**
 * 认证相关组合式函数
 * @returns {{ isLoggedIn: import('vue').Ref<boolean>, userAvatarUrl: import('vue').Ref<string>, checkLoginStatus: () => void, logout: () => Promise<void>, updateUserInfo: () => Promise<void> }}
 */
export function useAuth() {
  const router = useRouter()
  /** 登录状态 */
  const isLoggedIn = ref(false)
  /** 用户头像 URL */
  const userAvatarUrl = ref('')

  /** 检查本地 token 并加载头像 */
  function checkLoginStatus() {
    isLoggedIn.value = localStorage.getItem('accessToken') !== null
    const avatar = localStorage.getItem('userAvatar')
    if (avatar) {
      userAvatarUrl.value = avatar
    } else {
      userAvatarUrl.value = new URL('../assets/brand_icon.svg', import.meta.url).href
    }
  }

  /** 退出登录：清除本地数据并调用退出接口 */
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

  /** 从后端刷新用户信息并更新本地缓存 */
  async function updateUserInfo() {
    const res = await getUserInfo()
    const userInfo = res.data.data
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    if (userInfo.Avatar) {
      userAvatarUrl.value = userInfo.Avatar
      localStorage.setItem('userAvatar', userInfo.Avatar)
    }
  }

  return { isLoggedIn, userAvatarUrl, checkLoginStatus, logout, updateUserInfo }
}
