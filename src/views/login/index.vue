<template>
  <div class="login-container">
    <div class="paper-texture"></div>
    <div class="top-border"></div>

    <div class="login-wrapper">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="brand-stamp">
          <span class="stamp-inner">工时</span>
        </div>
        <h1 class="brand-title">工时记录</h1>
        <p class="brand-tagline">记录每一刻的努力</p>

        <div class="decoration-line"></div>

        <div class="brand-note">
          <span class="note-date">2024</span>
          <span class="note-content">开始记录，看见成长</span>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-section">
        <div class="login-paper">
          <div class="paper-header">
            <div class="header-line"></div>
            <h2>登录账户</h2>
            <p class="header-sub">欢迎回来</p>
          </div>

          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="formData.username"
                placeholder="输入您的用户名"
                size="large"
                :prefix-icon="UserIcon"
                autocomplete="username"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="输入您的密码"
                size="large"
                :prefix-icon="LockIcon"
                show-password
                autocomplete="current-password"
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="formData.remember">记住我</el-checkbox>
              <span class="forgot-password">忘记密码?</span>
            </div>

            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="submit-btn"
              native-type="submit"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>

            <div class="form-divider">
              <span>初次使用?</span>
            </div>

            <div class="register-section">
              <router-link to="/register" class="register-link">创建新账户</router-link>
            </div>
          </el-form>

          <el-alert
            v-if="errorMessage"
            type="error"
            :description="errorMessage"
            show-icon
            :closable="false"
            class="error-alert"
          />
        </div>
      </div>
    </div>

    <div class="footer-signature">
      <div class="signature-line"></div>
      <p class="footer-text">工时管理系统 · 让工作有迹可循</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { FormInstance, FormRules } from 'element-plus'
import { User as UserIcon, Lock as LockIcon } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()

const formData = reactive({
  username: '',
  password: '',
  remember: false
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await userStore.login(formData.username, formData.password)
    if (res.code === 200) {
      await userStore.fetchUserInfo()
      const redirect = route.query.redirect as string || '/dashboard'
      router.push(redirect)
    } else {
      errorMessage.value = res.message || '登录失败，请重试'
    }
  } catch (error: any) {
    errorMessage.value = error.message || '登录失败，请检查网络连接'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
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

.login-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  gap: 120px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 1024px) {
  .login-wrapper {
    flex-direction: column;
    gap: 48px;
    padding: 40px 24px;
  }
}

.brand-section {
  max-width: 400px;
  text-align: left;
  animation: fadeSlideLeft 0.8s ease-out;
}

@keyframes fadeSlideLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.brand-stamp {
  width: 80px;
  height: 80px;
  border: 3px solid var(--ink-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transform: rotate(-3deg);
  background: white;
  box-shadow:
    2px 2px 0 var(--accent-rust),
    4px 4px 0 var(--ink-light);
}

.stamp-inner {
  font-size: 20px;
  font-weight: bold;
  color: var(--ink-dark);
  letter-spacing: 4px;
}

.brand-title {
  font-size: 48px;
  font-weight: normal;
  color: var(--ink-dark);
  margin: 0 0 12px 0;
  line-height: 1.1;
  letter-spacing: -1px;
}

.brand-tagline {
  font-size: 18px;
  color: var(--ink-medium);
  font-style: italic;
  margin: 0 0 32px 0;
}

.decoration-line {
  width: 60px;
  height: 2px;
  background: var(--accent-rust);
  margin-bottom: 24px;
}

.brand-note {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  background: white;
  border-left: 3px solid var(--accent-warm);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.note-date {
  font-size: 14px;
  font-weight: bold;
  color: var(--accent-warm);
  min-width: 48px;
}

.note-content {
  font-size: 15px;
  color: var(--ink-medium);
  font-family: 'Georgia', serif;
}

.login-section {
  width: 100%;
  max-width: 420px;
  animation: fadeSlideRight 0.8s ease-out 0.2s backwards;
}

@keyframes fadeSlideRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.login-paper {
  background: white;
  padding: 48px 40px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 0 0 1px var(--border-color) inset;
  position: relative;
}

.login-paper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-warm);
}

.paper-header {
  text-align: center;
  margin-bottom: 36px;
}

.header-line {
  width: 40px;
  height: 1px;
  background: var(--border-color);
  margin: 0 auto 20px;
}

.paper-header h2 {
  font-size: 28px;
  font-weight: normal;
  color: var(--ink-dark);
  margin: 0 0 8px 0;
}

.header-sub {
  font-size: 15px;
  color: var(--ink-light);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Element Plus 表单项覆盖 */
.login-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.login-form :deep(.el-input__wrapper) {
  background: var(--paper-color);
  box-shadow: none;
  border: 1px solid var(--border-color);
  border-radius: 0;
  padding: 12px 16px;
  height: 48px;
}

.login-form :deep(.el-input__inner) {
  font-size: 15px;
  color: var(--ink-dark);
}

.login-form :deep(.el-input__inner::placeholder) {
  color: var(--ink-light);
  font-style: italic;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: var(--ink-dark);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  background: white;
  border-color: var(--ink-dark);
  box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.05), 0 0 0 1px var(--ink-dark);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  font-size: 14px;
  color: var(--accent-warm);
  cursor: pointer;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: var(--accent-rust);
}

.submit-btn {
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

.submit-btn:hover:not(:disabled) {
  background: var(--accent-rust);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
}

.form-divider {
  text-align: center;
  position: relative;
  margin: 24px 0;
}

.form-divider::before,
.form-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 30px);
  height: 1px;
  background: var(--border-color);
}

.form-divider::before {
  left: 0;
}

.form-divider::after {
  right: 0;
}

.form-divider span {
  font-size: 13px;
  color: var(--ink-light);
  font-style: italic;
}

.register-section {
  text-align: center;
}

.register-link {
  font-size: 15px;
  color: var(--ink-dark);
  text-decoration: none;
  border-bottom: 2px solid var(--accent-warm);
  padding-bottom: 2px;
  transition: all 0.2s;
}

.register-link:hover {
  color: var(--accent-rust);
  border-bottom-color: var(--accent-rust);
}

.error-alert {
  margin-top: 24px;
  background: #fff5f5;
  border: none;
  border-left: 3px solid var(--accent-rust);
}

.error-alert :deep(.el-alert__title) {
  font-size: 14px;
  color: var(--accent-rust);
}

.footer-signature {
  padding: 24px;
  text-align: center;
  border-top: 1px solid var(--border-color);
  background: white;
}

.signature-line {
  width: 120px;
  height: 1px;
  background: var(--border-color);
  margin: 0 auto 12px;
}

.footer-text {
  font-size: 13px;
  color: var(--ink-light);
  margin: 0;
  font-style: italic;
}
</style>
