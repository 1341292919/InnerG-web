import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/layout/BackendLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import FrontendLayout from '@/components/layout/FrontendLayout.vue'

// 路由配置
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/home/Dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart',
        },
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge/Knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineRound',
        },
      },
      {
        path: 'consultations',
        component: () => import('@/views/consult/Consultations.vue'),
        meta: {
          title: '咨询管理',
          icon: 'ChatLineRound',
        },
      },
      {
        path: 'mood-log',
        component: () => import('@/views/mood/MoodLog.vue'),
        meta: {
          title: '情绪日志',
          icon: 'Document',
        },
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        component: () => import('@/views/auth/Login.vue'),
        meta: {
          title: '登录',
        },
      },
      {
        path: 'register',
        component: () => import('@/views/auth/Register.vue'),
        meta: {
          title: '注册',
        },
      },
      {
        path: 'login-email',
        component: () => import('@/views/auth/LoginEmail.vue'),
        meta: {
          title: '邮箱登录',
        },
      },
    ],
  },
]
const frontendRoutes = [
  {
    path: '/',
    component: FrontendLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/home/Home.vue'),
      },
      {
        path: 'consult',
        component: () => import('@/views/consult/Consult.vue'),
      },
      {
        path: 'emotion-diary',
        component: () => import('@/views/mood/MoodGarden.vue'),
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge/Know.vue'),
      },
      {
        path: 'music-list',
        component: () => import('@/views/music/MusicList.vue'),
      },
      {
        path: 'music-player',
        component: () => import('@/views/music/MusicPlayer.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes],
})

// 路由前置守卫
// 登录时直接访问置后台
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')

  // 检查是否是以 /back 开头的路由
  const isBackRoute = to.path.startsWith('/back')

  // 如果是后台路由，无论是否有 token 都跳转到首页
  if (isBackRoute) {
    next('/')
    return
  }
  if (to.path.startsWith('/knowledge')) {
    next('/')
    return
  }

  if (token) {
    next()
  } else {
    if (to.path === '/') {
      next()
    } else {
      if (to.path == '/auth/login') {
        next()
      } else if (to.path == '/auth/register') {
        next()
      } else if (to.path == '/auth/login-email') {
        next()
      } else {
        next('/')
      }
    }
  }
})
export default router
