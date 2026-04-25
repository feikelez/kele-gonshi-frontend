<template>
  <div class="card tasks-card">
    <div class="card-header">
      <h3>可做任务</h3>
      <router-link :to="viewAllLink" class="view-all">
        查看全部
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </router-link>
    </div>
    <div class="card-content">
      <div class="task-list">
        <div
            v-for="task in tasks"
            :key="task.id"
            class="task-item"
            :class="'priority-' + task.priority"
        >
          <!--          <div class="task-checkbox">-->
          <!--            <input type="checkbox" :checked="task.completed" />-->
          <!--            <span class="checkmark"></span>-->
          <!--          </div>-->
          <div class="task-content">
            <div class="task-name">{{ task.name }}</div>
            <div class="task-meta">
              <span class="task-project">{{ task.project }}</span>
              <span class="task-due">{{ task.description }}</span>
            </div>
          </div>
          <div class="task-priority" :class="'priority-' + task.priority">
            {{ priorityText(task.priority) }}
          </div>
        </div>
      </div>
      <div v-if="tasks.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          <path d="M9 14l2 2 4-4"/>
        </svg>
        <p>暂无可做任务</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

interface Task {
  id: number
  name: string
  project: string
  dueDate: string
  description: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

defineProps<{
  tasks: Task[]
}>()

const userStore = useUserStore()

const viewAllLink = computed(() => {
  // ADMIN 或 MANAGER 跳转到 /task，EMPLOYEE 跳转到 /task-list
  if (userStore.hasRole('ADMIN') || userStore.hasRole('MANAGER')) {
    return '/task'
  }
  return '/task-list'
})

function priorityText(priority: string) {
  const map: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return map[priority] || priority
}
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

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--paper-color);
  border-left: 3px solid transparent;
  transition: all 0.15s ease;
}

.task-item:hover {
  border-left-color: var(--accent-warm);
}

.task-item.priority-high {
  border-left-color: var(--accent-rust);
}

.task-item.priority-medium {
  border-left-color: var(--accent-warm);
}

.task-item.priority-low {
  border-left-color: #2d6a4f;
}

.task-checkbox {
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.task-checkbox input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.task-checkbox .checkmark {
  position: absolute;
  inset: 0;
  border: 2px solid var(--border-color);
  transition: all 0.15s ease;
}

.task-checkbox input:checked + .checkmark {
  background: var(--ink-dark);
  border-color: var(--ink-dark);
}

.task-checkbox input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  left: 2px;
  top: -1px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-dark);
  margin-bottom: 4px;
}

.task-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: var(--ink-light);
  font-style: italic;
}

.task-priority {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-left: 2px solid;
}

.task-priority.priority-high {
  color: var(--accent-rust);
  border-left-color: var(--accent-rust);
  background: rgba(184, 92, 56, 0.08);
}

.task-priority.priority-medium {
  color: #926c2e;
  border-left-color: var(--accent-warm);
  background: rgba(196, 167, 125, 0.15);
}

.task-priority.priority-low {
  color: #2d6a4f;
  border-left-color: #2d6a4f;
  background: rgba(45, 106, 79, 0.08);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px;
  color: var(--ink-light);
}

.empty-state svg {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 13px;
  font-style: italic;
}
</style>
