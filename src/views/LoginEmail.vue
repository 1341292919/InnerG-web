<template>
    <div class = "container">
        <div class = "title">
            <div class = "back-home">
                <el-icon><Back /></el-icon>
                <span>返回首页</span>
            </div>
            <div class = "title-text">
                <h2>登录您的账户</h2>
                <p>请输入您的登录信息</p>
            </div>
        </div>
        <div class = "form-container">
            <el-form
                :model = "formData"
                :rules = "rules"
                label-position = "top"
                ref = "formRef" 
            >
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" size = "large" placeholder="使用邮箱登录" />
                </el-form-item>
                <el-form-item label-position="top" label="验证码" prop="verify_code">
                    <div class = "verify-code">
                        <el-input v-model="formData.verify_code" placeholder="请输入验证码" size = "large"></el-input>
                        <el-tooltip :content="tooltipText" placement="top">
                            <el-button :loading ="isloading" :disabled="isCounting" @click="handleGetVerifyCode" type="primary" size="large" style="margin-left: 10px;">{{ buttonText }}</el-button>
                        </el-tooltip>
                    </div>
                </el-form-item>
                <p><router-link to="login">使用密码登录</router-link></p> 
                <el-button class = "btn" size = "large" type = "primary" @click = "submitForm">登录</el-button>
            </el-form>
            <div class = "footer">
                <p>还没有账户？<router-link to="register">去注册</router-link></p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive ,computed} from 'vue'
import { ElMessage } from 'element-plus'
import { Back } from '@element-plus/icons-vue'
import { verifyEmailAndLogin,getVerifyCode } from '../api/auth/auth';
import {useRouter} from 'vue-router'
import { lo } from 'element-plus/es/locales.mjs';

const router = useRouter();


const formData = reactive({
    email: '',
    verify_code: ''
});
const rules = reactive({
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
    verify_code: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
});
const formRef = ref(null) 
const isloading = ref(false)
const isCounting = ref(false)
const count = ref(60)
let timer = null

const buttonText = computed(() => isCounting.value ? `${count.value}s后可重试` : '获取验证码')
const tooltipText = computed(() => isCounting.value ? `验证码已发送，${count.value}s后可重试` : '点击发送验证码')

const startCountdown = (seconds = 60) => {
    isCounting.value = true
    count.value = seconds
    timer = setInterval(() => {
        count.value -= 1
        if (count.value <= 0) {
            clearInterval(timer)
            timer = null
            isCounting.value = false
        }
    }, 1000)
}
const handleGetVerifyCode = () => {
    if (isCounting.value) return
    formRef.value.validateField('email', (valid) => {
        if (!valid) {
            ElMessage.error('请先输入有效的邮箱地址')
            return
        }else{
            isloading.value = true
            getVerifyCode(formData.email).then(res => {
                isloading.value = false
                if (res.data.code == "10000"){
                    ElMessage.success('验证码已发送，请注意查收');
                    startCountdown(60)
                } else {
                    ElMessage.error('发送失败，请检查后重试');
                }
            }).catch(err => {
                isloading.value = false
                ElMessage.error('服务器繁忙，请稍后再试');
            })
        }
    })
}

// 登录
const submitForm = async() => {
    if (!formRef.value) return;
    await formRef.value.validate((valid,fields) => {
        if (valid){
            verifyEmailAndLogin(formData).then(res => {
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
                    ElMessage.error(res.data.message || '登录失败');
                }
            }).catch(err => {
        ElMessage.error( '服务器繁忙，请稍后再试');
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
            .verify-code {
                display: flex;
                align-items: center;
                width: 100%;
                .el-input {
                flex: 1;
                }
                .el-button {
                margin-left: 10px;
            }
        }
        }
    }
</style>