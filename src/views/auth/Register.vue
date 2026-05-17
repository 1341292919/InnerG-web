<template>
  <section class="container">
    <header class="title">
      <div class="title-text">
        <h2>创建您的账户</h2>
        <p>请填写注册信息</p>
      </div>
    </header>
    <main class="form-container">
      <el-form ref="formRef" :model="formData" :rules="rules" aria-label="注册表单">
        <el-form-item label-position="top" label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" size="large"></el-input>
        </el-form-item>
        <el-form-item label-position="top" label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label-position="top" label="确认密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            size="large"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label-position="top" label="验证码" prop="verify_code">
          <div class="verify-code">
            <el-input v-model="formData.verify_code" placeholder="请输入验证码" size="large"></el-input>
            <el-tooltip :content="tooltipText" placement="top">
              <el-button
                :loading="isloading"
                :disabled="isCounting"
                type="primary"
                size="large"
                style="margin-left: 10px"
                @click="handleGetVerifyCode"
                >{{ buttonText }}</el-button
              >
            </el-tooltip>
          </div>
        </el-form-item>
        <div style="align-items: center">
          <el-button class="btn" size="large" type="primary" @click="handleRegister">注册</el-button>
        </div>
      </el-form>
      <div class="footer">
        <p>已有账户？<router-link to="/auth/login">去登录</router-link></p>
      </div>
    </main>
  </section>
</template>
<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { getVerifyCode, register } from '@/api'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const formData = ref({
  email: '',
  verify_code: '',
  password: '',
  confirmPassword: '',
})

const formRef = ref(null) // 添加到 script setup 开头
const rules = reactive({
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: (rule, value) => value === formData.value.password, message: '两次输入的密码不一致', trigger: 'blur' },
  ],
  verify_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

const isloading = ref(false)
const isCounting = ref(false)
const count = ref(60)
let timer = null

const buttonText = computed(() => (isCounting.value ? `${count.value}s后可重试` : '获取验证码'))
const tooltipText = computed(() => (isCounting.value ? `验证码已发送，${count.value}s后可重试` : '点击发送验证码'))

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
    } else {
      isloading.value = true
      getVerifyCode(formData.value.email)
        .then((_res) => {
          isloading.value = false
          ElMessage.success('验证码已发送，请注意查收')
          startCountdown(60)
        })
        .catch((_err) => {
          isloading.value = false
        })
    }
  })
}

const handleRegister = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      ElMessage.error('请检查输入信息是否正确')
      return
    } else {
      register(formData.value).then((_res) => {
        ElMessage.success('注册成功')
        router.push('/auth/login')
      })
    }
  })
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>
<style scoped lang="scss">
.container {
  width: 384px;
  .flex-box {
    display: flex;
    align-items: center;
  }
  .title {
    .title-text {
      text-align: center;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      margin-top: 40px;
      width: 100%;
    }
    .footer {
      padding: 30px;
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
