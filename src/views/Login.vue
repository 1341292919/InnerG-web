<template>
    <div class = "container">
        <div class = "title">
            <div class = "back-home" @click = "router.push('/')" style = "cursor: pointer;">
                <el-icon><Back /></el-icon>
                <span >返回首页</span>
            </div>
            <div class = "title-text">
                <h2>登录您的账户</h2>
                <p>请输入您的登录信息</p>
            </div>
        </div>
        <div class = "form-container">
            <el-form
                ref = "ruleFormRef"
                :model = "formData"
                :rules = "rules"
                label-position = "top"
            >
                <el-form-item label="用户名" prop="account">
                    <el-input v-model="formData.account" size = "large" placeholder="使用账号或邮箱登录" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" type="password" show-password size = "large" placeholder="请输入密码" />
                </el-form-item>
                <p>忘记密码?  <router-link to="login-email">使用邮箱验证登录</router-link></p>
                <el-button class = "btn" size = "large" type = "primary" @click = "submitForm">登录</el-button>
            </el-form>
            <div class = "footer">
                <p>还没有账户？<router-link to="register">去注册</router-link></p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Back } from '@element-plus/icons-vue'
import { login } from '../api/auth/auth';
import {useRouter} from 'vue-router'
import { lo } from 'element-plus/es/locales.mjs';

const ruleFormRef = ref(null);

const formData = reactive({
    account: '',
    password: ''
});
const rules = reactive({
    account: [
        { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
});

const router = useRouter();
// 登录
const submitForm = async() => {
    if (!ruleFormRef.value) return;
    await ruleFormRef.value.validate((valid,fields) => {
        if (valid){
            login(formData).then(res => {
                console.log(res.data.code)
                if (res.data.code == 10000) {
                    ElMessage.success('登录成功');
                    const accessToken = res.headers['access-token'];
                    const refreshToken = res.headers['refresh-token'];
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    const userInfo = res.data.data;
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    localStorage.setItem('userAvatar', res.data.data.Avatar);
                    router.push('/');
                } else {
                    console.log(1)
                    ElMessage.error(res.data.message || '登录失败');
                }
            })
        }
    })
};
</script>

<style lang="css" scoped>
    .container {
        width :384px;
        .title{
            .back-home {
                margin-bottom: 60px;
            }
            .title-text {
                text-align: center;
                h2{
                    font-size:36px;
                    margin-bottom: 10px;
                }
                p{
                    font-size: 18px;
                    color: #666;
                }
            }
        }
        .form-container {
            margin-top: 30px;
            .btn {
                width: 100%;
                margin-top: 40px;
            }
            .footer{
                padding:30px ;
                text-align: center;
            }
        }
    }
</style>