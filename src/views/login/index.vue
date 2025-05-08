<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="logo-container">
        <img src="/logo.png" alt="Logo" class="logo" />
      </div>
      <div class="title-container">
        <h3 class="title">研习宝后台系统</h3>
        <p class="subtitle">欢迎回来，请登录您的账号</p>
      </div>

      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="用户名"
          type="text"
          tabindex="1"
          autocomplete="on"
        >
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          :type="passwordVisible ? 'text' : 'password'"
          placeholder="密码"
          tabindex="2"
          autocomplete="on"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
          <template #suffix>
            <el-icon
              class="password-icon"
              @click="passwordVisible = !passwordVisible"
            >
              <component :is="passwordVisible ? 'View' : 'Hide'" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api'

const store = useStore()
const router = useRouter()

const loginFormRef = ref(null)
const loading = ref(false)
const passwordVisible = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = () => {
  loginFormRef.value.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        const response = await userApi.login({
          username: loginForm.username,
          password: loginForm.password
        })
        if (response.data.code === 200) {
          store.commit('SET_TOKEN', response.data.code)
          store.commit('SET_USER_INFO', response.data.data)
          await router.push('/')
          ElMessage.success('登录成功')
        } else {
          ElMessage.error(response.message || '登录失败')
          loginForm.username = ''
          loginForm.password = ''
        }
      } catch (error) {
        ElMessage.error('登录请求失败，请稍后重试')
        loginForm.username = ''
        loginForm.password = ''
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.login-form {
  position: relative;
  width: min(420px, 90vw);
  padding: clamp(20px, 5vw, 40px);
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.6s ease-out;
  z-index: 1;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.logo-container {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: clamp(60px, 10vw, 80px);
  height: clamp(60px, 10vw, 80px);
  margin-bottom: clamp(12px, 2vw, 16px);
}

.title-container {
  position: relative;
  text-align: center;
  margin-bottom: clamp(24px, 5vw, 40px);
}

.title {
  font-size: clamp(24px, 4vw, 28px);
  color: #fff;
  margin: 0;
  font-weight: 600;
  letter-spacing: 1px;
}

.subtitle {
  font-size: clamp(12px, 2vw, 14px);
  color: rgba(255, 255, 255, 0.7);
  margin-top: clamp(6px, 1vw, 8px);
}

:deep(.el-input) {
  --el-input-bg-color: rgba(255, 255, 255, 0.1);
  --el-input-border-color: rgba(255, 255, 255, 0.2);
  --el-input-hover-border-color: rgba(255, 255, 255, 0.4);
  --el-input-focus-border-color: rgba(255, 255, 255, 0.6);
  --el-input-text-color: #fff;
  --el-input-placeholder-color: rgba(255, 255, 255, 0.5);
}

:deep(.el-input .el-input__wrapper) {
  box-shadow: none;
  transition: all 0.3s;
}

:deep(.el-input .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4);
}

:deep(.el-button) {
  border-radius: 4px;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s;
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.password-icon {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s;
}

.password-icon:hover {
  color: #fff;
}
</style>