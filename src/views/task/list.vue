<template>
  <div class="task-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">任务列表</h1>
        <p class="page-subtitle">查看所有任务信息</p>
      </div>
    </div>

    <div class="search-card">
      <div class="search-form">
        <div class="form-item">
          <label>任务名称</label>
          <input
            v-model="searchParams.taskName"
            type="text"
            placeholder="请输入任务名称"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="form-item">
          <label>所属项目</label>
          <select v-model="searchParams.projectId">
            <option :value="undefined">全部</option>
            <option v-for="project in projectList" :key="project.id" :value="project.id">
              {{ project.projectName }}
            </option>
          </select>
        </div>
        <div class="form-item">
          <label>任务状态</label>
          <select v-model="searchParams.status">
            <option :value="undefined">全部</option>
            <option :value="0">待开始</option>
            <option :value="1">进行中</option>
            <option :value="2">已完成</option>
            <option :value="3">已取消</option>
          </select>
        </div>
        <div class="search-actions">
          <button class="search-btn" @click="handleSearch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            查询
          </button>
          <button class="reset-btn" @click="handleReset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            重置
          </button>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <span class="table-title">任务列表</span>

      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>任务名称</th>
              <th>所属项目</th>
              <th>描述</th>
              <th>负责人</th>
              <th>计划工时</th>
              <th>状态</th>
              <th>创建时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in taskList" :key="task.id">
              <td class="name-cell">{{ task.taskName }}</td>
              <td class="project-cell">{{ getProjectName(task.projectId) }}</td>
              <td class="desc-cell">{{ task.description || '-' }}</td>
              <td>{{ getUserName(task.assigneeId) }}</td>
              <td class="hours-cell">{{ task.planHours || 0 }}h</td>
              <td>
                <span class="status-tag" :class="getStatusClass(task.status)">
                  {{ getStatusText(task.status) }}
                </span>
              </td>
              <td>{{ formatDate(task.createTime) }}</td>
            </tr>
            <tr v-if="taskList.length === 0">
              <td colspan="7" class="empty-cell">
                <div class="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  <p>暂无任务数据</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" v-if="pagination.total > 0">
        <button class="page-btn" :disabled="pagination.current === 1" @click="changePage(pagination.current - 1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span class="page-info">第 {{ pagination.current }} / {{ totalPages }} 页</span>
        <button class="page-btn" :disabled="pagination.current >= totalPages" @click="changePage(pagination.current + 1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
        <select v-model="pagination.size" class="size-select" @change="handleSizeChange">
          <option :value="10">10条/页</option>
          <option :value="20">20条/页</option>
          <option :value="50">50条/页</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { taskApi, projectApi, userApi } from '@/api'
import { useUserStore } from '@/stores/user'
import type { Task, TaskPageParams, Project, User } from '@/api/types'
import '../task/task.css'

const userStore = useUserStore()

const taskList = ref<Task[]>([])
const projectList = ref<Project[]>([])
const userList = ref<User[]>([])
const loading = ref(false)

const searchParams = reactive<TaskPageParams>({
  taskName: undefined,
  projectId: undefined,
  assigneeId: undefined,
  status: undefined,
  current: 1,
  size: 10
})

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const totalPages = computed(() => Math.ceil(pagination.total / pagination.size) || 1)

async function fetchTasks() {
  loading.value = true
  try {
    // ADMIN 和 MANAGER 可以看到所有任务，其他角色只看自己参与项目相关的任务
    const isAdminOrManager = userStore.hasRole('ADMIN') || userStore.hasRole('MANAGER')

    if (isAdminOrManager) {
      const params: TaskPageParams = {
        current: pagination.current,
        size: pagination.size,
        taskName: searchParams.taskName || undefined,
        projectId: searchParams.projectId,
        status: searchParams.status
      }
      const res = await taskApi.page(params)
      taskList.value = res.data.records
      pagination.total = Number(res.data.total)
    } else {
      const res = await taskApi.getMyTasksPage(
        pagination.current,
        pagination.size,
        searchParams.taskName || undefined,
        searchParams.projectId,
        searchParams.status
      )
      taskList.value = res.data.records
      pagination.total = Number(res.data.total)
    }
  } catch (error) {
    console.error('获取任务列表失败:', error)
  } finally {
    loading.value = false
  }
}

async function fetchProjects() {
  try {
    const res = await projectApi.list()
    projectList.value = res.data
  } catch (error) {
    console.error('获取项目列表失败:', error)
  }
}

async function fetchUsers() {
  try {
    const res = await userApi.list()
    userList.value = res.data
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

function handleSearch() {
  pagination.current = 1
  fetchTasks()
}

function handleReset() {
  searchParams.taskName = undefined
  searchParams.projectId = undefined
  searchParams.status = undefined
  pagination.current = 1
  fetchTasks()
}

function changePage(page: number) {
  pagination.current = page
  fetchTasks()
}

function handleSizeChange() {
  pagination.current = 1
  fetchTasks()
}

function getProjectName(projectId: number): string {
  const project = projectList.value.find(p => p.id === projectId)
  return project?.projectName || '-'
}

function getUserName(assigneeId: number): string {
  const user = userList.value.find(u => u.id === assigneeId)
  return user?.realName || '-'
}

function getStatusClass(status: number) {
  const map: Record<number, string> = {
    0: 'pending',
    1: 'in-progress',
    2: 'completed',
    3: 'cancelled'
  }
  return map[status] || 'pending'
}

function getStatusText(status: number) {
  const map: Record<number, string> = {
    0: '待开始',
    1: '进行中',
    2: '已完成',
    3: '已取消'
  }
  return map[status] || '未知'
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return dateStr.split(' ')[0]
}

onMounted(() => {
  fetchProjects()
  fetchUsers()
  fetchTasks()
})
</script>
