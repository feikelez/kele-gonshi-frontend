<template>
  <div class="register-container">
    <div class="paper-texture"></div>
    <div class="top-border"></div>

    <div class="register-content">
      <div class="register-card">
        <router-link to="/login" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回登录
        </router-link>

        <div class="card-header">
          <div class="header-line"></div>
          <h2>创建账户</h2>
          <p>加入我们，开启高效工作之旅</p>
        </div>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          class="register-form"
          @submit.prevent="handleRegister"
        >
          <div class="form-row">
            <el-form-item prop="username">
              <el-input
                v-model="formData.username"
                placeholder="4-20位字母数字"
                size="large"
              >
                <template #prefix>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="realName">
              <el-input
                v-model="formData.realName"
                placeholder="请输入真实姓名"
                size="large"
              >
                <template #prefix>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </template>
              </el-input>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item prop="email">
              <el-input
                v-model="formData.email"
                placeholder="请输入邮箱地址"
                size="large"
              >
                <template #prefix>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="请输入手机号"
                size="large"
              >
                <template #prefix>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                </template>
              </el-input>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                placeholder="6-20位密码"
                size="large"
                show-password
              >
                <template #prefix>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="再次输入密码"
                size="large"
                show-password
              >
                <template #prefix>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </template>
              </el-input>
            </el-form-item>
          </div>

          <div class="form-options">
            <el-checkbox v-model="formData.agree">
              我已阅读并同意 <a href="#">服务条款</a>
            </el-checkbox>
          </div>

          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="register-btn"
            native-type="submit"
          >
            {{ loading ? '注册中...' : '立即注册' }}
          </el-button>

          <el-alert
            v-if="errorMessage"
            type="error"
            :description="errorMessage"
            show-icon
            :closable="false"
            class="error-message"
          />

          <el-alert
            v-if="successMessage"
            type="success"
            :description="successMessage"
            show-icon
            :closable="false"
            class="success-message"
          />
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/api'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()

const formRef = ref<FormInstance>()

const formData = reactive({
  username: '',
  realName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agree: false
})

const validateConfirmPassword = (_rule: any, value: any, callback: any) => {
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '用户名长度为4-20位', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleRegister() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  if (!formData.agree) {
    errorMessage.value = '请阅读并同意服务条款'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const res = await authApi.register({
      username: formData.username,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      realName: formData.realName,
      email: formData.email,
      phone: formData.phone
    })

    if (res.code === 200) {
      successMessage.value = '注册成功！即将跳转到登录页面...'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = res.message || '注册失败，请重试'
    }
  } catch (error: any) {
    errorMessage.value = error.message || '注册失败，请检查网络连接'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  --paper-color: #f7f4ed;
  --paper-dark: #ebe4d6;
  --ink-dark: #2c2c2c;
  --ink-medium: #5a5a5a;
  --ink-light: #8a8a8a;
  --accent-warm: #c4a77d;
  --accent-rust: #b85c38;
  --border-color: #d4cfc5;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--paper-color);
  font-family: 'SimHei', 'Microsoft YaHei', 'PingFang SC', 'Heiti SC', sans-serif;
  position: relative;
  overflow: hidden;
}

.paper-texture {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(0, 0, 0, 0.015) 1px,
      rgba(0, 0, 0, 0.015) 2px
    );
  opacity: 0.5;
}

.top-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    var(--ink-dark) 0px,
    var(--ink-dark) 8px,
    transparent 8px,
    transparent 16px
  );
  opacity: 0.3;
}

.register-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  width: 100%;
}

.register-card {
  width: 100%;
  max-width: 560px;
  background: white;
  padding: 48px 40px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 0 0 1px var(--border-color) inset;
  position: relative;
  animation: fadeSlideUp 0.8s ease-out;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-warm);
}

.card-header {
  text-align: center;
  margin-bottom: 36px;
}

.header-line {
  width: 40px;
  height: 1px;
  background: var(--border-color);
  margin: 0 auto 20px;
}

.card-header h2 {
  font-size: 28px;
  font-weight: normal;
  color: var(--ink-dark);
  margin: 0 0 8px 0;
}

.card-header p {
  font-size: 15px;
  color: var(--ink-light);
  margin: 0;
  font-style: italic;
}

.back-link {
  position: absolute;
  top: 24px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--ink-medium);
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--accent-rust);
}

.back-link svg {
  width: 18px;
  height: 18px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.register-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.register-form :deep(.el-input__wrapper) {
  background: var(--paper-color);
  box-shadow: none;
  border: 1px solid var(--border-color);
  border-radius: 0;
  padding: 12px 16px;
  height: 48px;
}

.register-form :deep(.el-input__inner) {
  font-size: 15px;
  color: var(--ink-dark);
}

.register-form :deep(.el-input__inner::placeholder) {
  color: var(--ink-light);
  font-style: italic;
}

.register-form :deep(.el-input__wrapper:hover) {
  border-color: var(--ink-dark);
}

.register-form :deep(.el-input__wrapper.is-focus) {
  background: white;
  border-color: var(--ink-dark);
  box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.05), 0 0 0 1px var(--ink-dark);
}

.register-form :deep(.el-input__prefix) {
  color: var(--ink-light);
}

.input-icon {
  width: 20px;
  height: 20px;
}

.form-options {
  display: flex;
  align-items: center;
}

.form-options a {
  color: var(--accent-warm);
  text-decoration: none;
}

.form-options a:hover {
  color: var(--accent-rust);
}

.register-btn {
  height: 52px;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--ink-dark);
  border: none;
  color: white;
  margin-top: 8px;
}

.register-btn:hover:not(:disabled) {
  background: var(--accent-rust);
  transform: translateY(-1px);
}

.register-btn:disabled {
  opacity: 0.6;
}

.error-message,
.success-message {
  margin-top: 16px;
  border: none;
  border-left: 3px solid;
}

.error-message {
  background: #fff5f5;
  border-left-color: var(--accent-rust);
}

.error-message :deep(.el-alert__title) {
  color: var(--accent-rust);
}

.success-message {
  background: #f0fff4;
  border-left-color: #48bb78;
}

.success-message :deep(.el-alert__title) {
  color: #48bb78;
}
</style>
