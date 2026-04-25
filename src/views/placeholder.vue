<template>
  <div class="placeholder-page">
    <div class="placeholder-content">
      <div class="placeholder-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
        </svg>
      </div>
      <h2>{{ title }}</h2>
      <p>该功能模块正在开发中，敬请期待...</p>
      <router-link to="/dashboard" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回工作台
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const titleMap: Record<string, string> = {
  '/project': '项目管理',
  '/task': '任务管理',
  '/work-record': '工时填报',
  '/approval': '审批管理',
  '/user': '用户管理',
  '/role': '角色管理',
  '/profile': '个人中心'
}

const title = computed(() => titleMap[route.path] || '页面开发中')
</script>

<style scoped>
.placeholder-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
}

.placeholder-content {
  text-align: center;
  padding: 60px;
}

.placeholder-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 32px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon svg {
  width: 56px;
  height: 56px;
  color: var(--primary-color);
}

.placeholder-content h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.placeholder-content p {
  font-size: 16px;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--primary-gradient);
  color: white;
  font-size: 15px;
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.back-btn svg {
  width: 18px;
  height: 18px;
}
</style>
