import axios from 'axios';
import { ElMessage } from 'element-plus';
import { el } from 'element-plus/es/locales.mjs';

// 创建实例
const service = axios.create({
  baseURL: '/api/v1', // api 的 base_url
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        const accessToken = localStorage.getItem('accessToken'); 
        if (accessToken) {
            config.headers['Authorization'] = accessToken;
        }
        return config;
    },
    (error) => {
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 在响应数据之前做些什么
        const{data,config} = response;
        // 处理业务状态码 
        if(data.code == '200'){
            return data.data;
        }else{
            // if (data.code == '-1') {
            //     if (!config.url.includes('/auth/login')) {
            //          ElMessage.error('登录失效，请重新登录');
            //          localStorage.removeItem('token');
            //          localStorage.removeItem('userInfo');
            //          window.location.href = '/auth/login'
            //     }else{
            //         ElMessage.error(data.message || '请求失败');
            //         return Promise.reject('网络请求失败...');
            //     }
            // } 
        }
        return response;
    },
    (error) => {
        console.error('响应错误:', error);
        return Promise.reject(error);
    }
)

export default service;