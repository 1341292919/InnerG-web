import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";
import { createRouter,createWebHistory } from "vue-router";
import BackendLayout from "../components/BackendLayout.vue";
import AuthLayout from "../components/AuthLayout.vue";
import FrontendLayout from "../components/FrontendLayout.vue";

// 路由配置
const backendRoutes = [
    {
        path :'/back',
        redirect: '/back/dashboard',
        component: BackendLayout,
        children:[
            {
                path: 'dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta:{
                    title: '数据分析',
                    icon: 'PieChart',
                }
            },
            {
                path:'knowledge',
                component: () => import('../views/Knowledge.vue'),
                meta:{
                    title: '知识文章',
                    icon: 'ChatLineRound',
                }
            },
            {
                path:'consultations',
                component: () => import('../views/Consultations.vue'),
                meta:{
                    title: '咨询管理',
                    icon: 'ChatLineRound',
                }
            },
            {
                path:'mood-log',
                component: () => import('../views/MoodLog.vue'),
                meta:{
                    title: '情绪日志',
                    icon: 'Document',
                }
            }
        ]
    },
    {
        path: '/auth',
        component: AuthLayout,
        children:[
            {
                path: 'login',
                component: () => import('../views/Login.vue'),
                meta:{
                    title: '登录',
                }    
            },
            {
                path : 'register',
                component: () => import('../views/Register.vue'),
                meta:{
                    title: '注册',
                }
            }
        ]
    }
]
const frontendRoutes = [
    {
        path :'/',
        component : FrontendLayout,
        children:[
            {
                path :'',
                component :  () => import('../views/Home.vue'),
            },
            {
                path :'consult',
                component :  () => import('../views/Consult.vue'),
            },
            {
                path :'emotion-diary',
                component :  () => import('../views/MoodGarden.vue'),
            },
            {
                path :'knowledge',
                component :  () => import('../views/Know.vue'),
            },
            {
                path : 'music-list',
                component : () => import('../views/MusicList.vue'),
            },
            {
                path : 'music-player',
                component : () => import('../views/MusicPlayer.vue'),
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: [...backendRoutes, ...frontendRoutes]
})

// 路由前置守卫
// 登录时直接访问置后台
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('accessToken');
    if (token){
        next();
    }else{
        if (to.path === '/') {
            next();
        } else {
            if (to.path =='/auth/login') {
                next();
            }else if (to.path == '/auth/register') {
                next();
            }else{
                next('/');
            }
        }
    }
})
export default router;