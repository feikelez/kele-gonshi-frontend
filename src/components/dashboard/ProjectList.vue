<template>
  <div class="card projects-card">
    <div class="card-header">
      <h3>我的项目</h3>
      <router-link :to="viewAllLink" class="view-all">
        查看全部
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </router-link>
    </div>
    <div class="card-content">
      <div class="project-list">
        <div v-for="project in projects" :key="project.id" class="project-item">
          <div class="project-color" :style="{ background: project.color }"></div>
          <div class="project-info">
            <div class="project-name">{{ project.name }}</div>
            <div class="project-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: project.progress + '%', background: project.color }"></div>
              </div>
              <span class="progress-text">{{ project.progress }}%</span>
            </div>
          </div>
          <div class="project-members">
            <div
              v-for="(member, index) in project.members.slice(0, 3)"
              :key="index"
              class="member-avatar"
              :style="{ zIndex: 10 - index }"
            >
              {{ member.charAt(0) }}
            </div>
            <div v-if="project.members.length > 3" class="member-more">
              +{{ project.members.length - 3 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

interface Project {
  id: number
  name: string
  progress: number
  color: string
  members: string[]
}

const props = defineProps<{
  projects: Project[]
}>()

const userStore = useUserStore()

const viewAllLink = computed(() => {
  // ADMIN 或 MANAGER 跳转到 /project，EMPLOYEE 跳转到 /project-list
  if (userStore.hasRole('ADMIN') || userStore.hasRole('MANAGER')) {
    return '/project'
  }
  return '/project-list'
})
</script>

<style scoped>
.card {
  --paper-color: #f7f4ed;
  --ink-dark: #2c2c2c;
  --ink-medium: #5a5a5a;
  --ink-light: #8a8a8a;
  --accent-warm: #c4a77d;
  --accent-rust: #b85c38;
  --border-color: #d4cfc5;
  
  background: white;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  font-family: 'SimHei', 'Microsoft YaHei', 'PingFang SC', 'Heiti SC', sans-serif;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-warm);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-color);
}

.card-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-dark);
}

.view-all {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--accent-rust);
  font-weight: 500;
  transition: gap 0.15s ease;
  text-decoration: none;
}

.view-all:hover {
  gap: 8px;
}

.view-all svg {
  width: 14px;
  height: 14px;
}

.card-content {
  padding: 16px 20px;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed var(--border-color);
}

.project-item:last-child {
  border-bottom: none;
}

.project-color {
  width: 4px;
  height: 36px;
  flex-shrink: 0;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-dark);
  margin-bottom: 6px;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--paper-color);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-light);
  min-width: 32px;
  font-style: italic;
}

.project-members {
  display: flex;
  align-items: center;
}

.member-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--ink-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: 600;
  margin-left: -6px;
  border: 2px solid white;
}

.member-avatar:first-child {
  margin-left: 0;
}

.member-more {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--paper-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-light);
  font-size: 10px;
  font-weight: 600;
  margin-left: -6px;
  border: 2px solid white;
}
</style>
