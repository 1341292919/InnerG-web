import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import FrontendLayout from '@/components/layout/FrontendLayout.vue'

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        component: () => import('@/views/auth/Login.vue'),
        meta: { title: '登录' },
      },
      {
        path: 'register',
        component: () => import('@/views/auth/Register.vue'),
        meta: { title: '注册' },
      },
      {
        path: 'login-email',
        component: () => import('@/views/auth/LoginEmail.vue'),
        meta: { title: '邮箱登录' },
      },
    ],
  },
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
        path: 'chat',
        component: () => import('@/views/chat/FriendChat.vue'),
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
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    next()
  } else {
    if (to.path === '/') {
      next()
    } else if (to.path === '/auth/login' || to.path === '/auth/register' || to.path === '/auth/login-email') {
      next()
    } else {
      next('/')
    }
  }
})

export default router
