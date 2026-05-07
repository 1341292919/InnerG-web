import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 后台管理全局状态
 * - isCollapse：侧边栏是否折叠
 * - toggleCollapse：切换折叠状态
 */
export const useAdminStore = defineStore('admin', () => {
  /** 侧边栏折叠状态 */
  const isCollapse = ref(false)

  /** 切换侧边栏折叠状态 */
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  return {
    isCollapse,
    toggleCollapse,
  }
})
