<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="profile-avatar">
        <span>{{ userStore.realName?.charAt(0) || 'U' }}</span>
      </div>
      <div class="profile-info">
        <h1>{{ userStore.realName }}</h1>
        <p class="profile-role">{{ roleText }}</p>
        <p class="profile-username">@{{ userStore.username }}</p>
      </div>
    </div>
    
    <div class="profile-content">
      <div class="profile-card">
        <h3>个人信息</h3>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">用户名</span>
            <span class="info-value">{{ userStore.username }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">真实姓名</span>
            <span class="info-value">{{ userStore.realName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">邮箱</span>
            <span class="info-value">{{ userStore.userInfo?.email || '未设置' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">手机号</span>
            <span class="info-value">{{ userStore.userInfo?.phone || '未设置' }}</span>
          </div>
        </div>
      </div>
      
      <div class="profile-card">
        <h3>安全设置</h3>
        <div class="security-actions">
          <button class="security-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            修改密码
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const roleText = computed(() => {
  if (userStore.hasRole('ADMIN')) return '管理员'
  if (userStore.hasRole('MANAGER')) return '项目经理'
  return '普通用户'
})
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 32px;
  background: white;
  border-radius: var(--radius-xl);
  margin-bottom: 24px;
  box-shadow: var(--shadow-md);
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.profile-info h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.profile-role {
  font-size: 16px;
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 4px;
}

.profile-username {
  font-size: 14px;
  color: var(--text-muted);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-md);
}

.profile-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--bg-secondary);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
}

.info-label {
  font-size: 14px;
  color: var(--text-muted);
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.security-actions {
  display: flex;
  gap: 16px;
}

.security-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.security-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.security-btn svg {
  width: 18px;
  height: 18px;
}
</style>
