<template>
  <div class="welcome-section">
    <div class="welcome-content">
      <h1 class="welcome-title">
        <span class="greeting">{{ greeting }}</span>
        <span class="name">{{ userStore.realName }}</span>
      </h1>
      <p class="welcome-subtitle">今天也要元气满满地工作哦～</p>
    </div>
    <div class="welcome-illustration">
      <div class="illustration-stamp">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="36" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M28 40L36 48L52 32" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了，'
  if (hour < 9) return '早上好，'
  if (hour < 12) return '上午好，'
  if (hour < 14) return '中午好，'
  if (hour < 18) return '下午好，'
  if (hour < 22) return '晚上好，'
  return '夜深了，'
})
</script>

<style scoped>
.welcome-section {
  --paper-color: #f7f4ed;
  --ink-dark: #2c2c2c;
  --ink-medium: #5a5a5a;
  --ink-light: #8a8a8a;
  --accent-warm: #c4a77d;
  --accent-rust: #b85c38;
  --border-color: #d4cfc5;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  background: white;
  margin-bottom: 24px;
  position: relative;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  font-family: 'SimHei', 'Microsoft YaHei', 'PingFang SC', 'Heiti SC', sans-serif;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-warm);
}

.welcome-content {
  position: relative;
  z-index: 1;
}

.welcome-title {
  font-size: 32px;
  font-weight: normal;
  margin-bottom: 8px;
  font-family: 'SimHei', 'Microsoft YaHei', 'PingFang SC', 'Heiti SC', sans-serif;
}

.greeting {
  color: var(--ink-medium);
}

.name {
  margin-left: 8px;
  color: var(--accent-rust);
  font-style: italic;
}

.welcome-subtitle {
  font-size: 16px;
  color: var(--ink-light);
  font-weight: 400;
  font-style: italic;
}

.welcome-illustration {
  position: relative;
  z-index: 1;
}

.illustration-stamp {
  width: 80px;
  height: 80px;
  border: 2px solid var(--ink-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-5deg);
  color: var(--accent-rust);
  animation: float 6s ease-in-out infinite;
}

.illustration-stamp svg {
  width: 60px;
  height: 60px;
}

@keyframes float {
  0%, 100% { transform: rotate(-5deg) translateY(0px); }
  50% { transform: rotate(-5deg) translateY(-8px); }
}
</style>
