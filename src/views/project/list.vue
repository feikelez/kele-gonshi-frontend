<template>
  <div class="project-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">项目列表</h1>
        <p class="page-subtitle">查看所有项目信息</p>
      </div>
    </div>

    <div class="search-card">
      <div class="search-form">
        <div class="form-item">
          <label>项目名称</label>
          <input
            v-model="searchParams.projectName"
            type="text"
            placeholder="请输入项目名称"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="form-item">
          <label>项目状态</label>
          <select v-model="searchParams.status">
            <option :value="undefined">全部</option>
            <option :value="0">未开始</option>
            <option :value="1">进行中</option>
            <option :value="2">已完成</option>
            <option :value="3">已暂停</option>
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
        <span class="table-title">项目列表</span>

      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>项目编号</th>
              <th>项目名称</th>
              <th>描述</th>
              <th>开始日期</th>
              <th>结束日期</th>
              <th>状态</th>
              <th>创建时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projectList" :key="project.id">
              <td class="code-cell">{{ project.projectCode }}</td>
              <td class="name-cell">{{ project.projectName }}</td>
              <td class="desc-cell">{{ project.description || '-' }}</td>
              <td>{{ project.startDate || '-' }}</td>
              <td>{{ project.endDate || '-' }}</td>
              <td>
                <span class="status-tag" :class="getStatusClass(project.status)">
                  {{ getStatusText(project.status) }}
                </span>
              </td>
              <td>{{ formatDate(project.createTime) }}</td>
            </tr>
            <tr v-if="projectList.length === 0">
              <td colspan="7" class="empty-cell">
                <div class="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p>暂无项目数据</p>
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
import { projectApi } from '@/api'
import { useUserStore } from '@/stores/user'
import type { Project, ProjectPageParams } from '@/api/types'
import '../project/project.css'

const userStore = useUserStore()

const projectList = ref<Project[]>([])
const loading = ref(false)

const searchParams = reactive<ProjectPageParams>({
  projectName: undefined,
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

async function fetchProjects() {
  loading.value = true
  try {
    // ADMIN 和 MANAGER 可以看到所有项目，其他角色只看自己参与的项目
    const isAdminOrManager = userStore.hasRole('ADMIN') || userStore.hasRole('MANAGER')

    if (isAdminOrManager) {
      const params: ProjectPageParams = {
        current: pagination.current,
        size: pagination.size,
        projectName: searchParams.projectName || undefined,
        status: searchParams.status
      }
      const res = await projectApi.page(params)
      projectList.value = res.data.records
      pagination.total = Number(res.data.total)
    } else {
      const res = await projectApi.getMyProjectsPage(pagination.current, pagination.size)
      projectList.value = res.data.records
      pagination.total = Number(res.data.total)
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.current = 1
  fetchProjects()
}

function handleReset() {
  searchParams.projectName = undefined
  searchParams.status = undefined
  pagination.current = 1
  fetchProjects()
}

function changePage(page: number) {
  pagination.current = page
  fetchProjects()
}

function handleSizeChange() {
  pagination.current = 1
  fetchProjects()
}

function getStatusClass(status: number) {
  const map: Record<number, string> = {
    0: 'pending',
    1: 'active',
    2: 'completed',
    3: 'paused'
  }
  return map[status] || 'pending'
}

function getStatusText(status: number) {
  const map: Record<number, string> = {
    0: '未开始',
    1: '进行中',
    2: '已完成',
    3: '已暂停'
  }
  return map[status] || '未知'
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return dateStr.split(' ')[0]
}

onMounted(() => {
  fetchProjects()
})
</script>
