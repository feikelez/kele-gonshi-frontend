<template>
  <div class="task-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">任务管理</h1>
        <p class="page-subtitle">管理所有任务信息</p>
      </div>
      <el-button type="primary" @click="openAddModal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        新增任务
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-form :model="searchParams" inline @submit.prevent="handleSearch">
        <el-form-item label="任务名称">
          <el-input v-model="searchParams.taskName" placeholder="请输入任务名称" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="所属项目">
          <el-select v-model="searchParams.projectId" placeholder="全部" clearable style="width: 180px">
            <el-option
              v-for="project in projectList"
              :key="project.id"
              :value="project.id"
              :label="project.projectName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="searchParams.status" placeholder="全部" clearable style="width: 140px">
            <el-option :value="0" label="待开始" />
            <el-option :value="1" label="进行中" />
            <el-option :value="2" label="已完成" />
            <el-option :value="3" label="已取消" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table-card paper-card">
      <div class="table-header">
        <span class="table-title">任务列表</span>

      </div>

      <el-table :data="taskListData" stripe border class="base-table" :max-height="470">
        <el-table-column prop="taskName" label="任务名称" min-width="180" />
        <el-table-column prop="projectName" label="所属项目" min-width="160" />
        <el-table-column prop="assigneeName" label="负责人" width="120" />
        <el-table-column prop="planHours" label="计划工时" width="100">
          <template #default="{ row }">
            {{ row.planHours }}h
          </template>
        </el-table-column>
        <el-table-column label="任务状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditModal(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="base-pagination" v-if="pagination.total > 0">
        <span class="pagination-info">共 {{ pagination.total }} 条记录</span>
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="prev, pager, next, sizes"
          @current-change="fetchTasks"
          @Size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 任务表单弹窗 -->
    <TaskForm
      v-model:visible="showModal"
      :is-edit="isEdit"
      :task="currentTask"
      :submitting="submitting"
      :project-list="projectList"
      :user-list="userList"
      :project-member-list="projectMemberList"
      @submit="handleSubmit"
      @cancel="closeModal"
      @fetch-members="handleFetchMembers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { taskApi, projectApi, userApi, projectMemberApi } from '@/api'
import type { Task, Project, User } from '@/api/types'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import TaskForm from './form.vue'

interface TaskWithNames extends Task {
  projectName?: string
  assigneeName?: string
}

interface ProjectMemberUser {
  userId: number
  userName: string
}

const taskListData = ref<TaskWithNames[]>([])
const projectList = ref<Project[]>([])
const userList = ref<User[]>([])
const projectMemberList = ref<ProjectMemberUser[]>([])
const showModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const currentTask = ref<Task | null>(null)

const searchParams = reactive({
  taskName: undefined as string | undefined,
  projectId: undefined as number | undefined,
  status: undefined as number | undefined,
  current: 1,
  size: 10
})

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

async function fetchTasks() {
  try {
    const userStore = useUserStore()
    if (userStore.hasRole('ADMIN')) {
      const params: Record<string, any> = {
        current: pagination.current,
        size: pagination.size,
        taskName: searchParams.taskName,
        projectId: searchParams.projectId,
        status: searchParams.status
      }
      const res = await taskApi.page(params)
      taskListData.value = res.data.records.map((item: Task) => {
        const project = projectList.value.find(p => p.id === item.projectId)
        const user = userList.value.find(u => u.id === item.assigneeId)
        return {
          ...item,
          projectName: project?.projectName || '',
          assigneeName: user?.realName || ''
        }
      })
      pagination.total = Number(res.data.total)
    } else if (userStore.hasRole('MANAGER')) {
      const res = await taskApi.getMyTasksPage(
        pagination.current,
        pagination.size,
        searchParams.taskName,
        searchParams.projectId,
        searchParams.status
      )
      taskListData.value = res.data.records.map((item: Task) => {
        const project = projectList.value.find(p => p.id === item.projectId)
        const user = userList.value.find(u => u.id === item.assigneeId)
        return {
          ...item,
          projectName: project?.projectName || '',
          assigneeName: user?.realName || ''
        }
      })
      pagination.total = Number(res.data.total)
    }

    if (projectList.value.length === 0) {
      await fetchProjectsAndUsers()
    }
  } catch (error) {
    console.error('获取任务列表失败:', error)
  }
}

async function fetchProjectsAndUsers() {
  try {
    const userStore = useUserStore()
    const [projectRes, userRes] = await Promise.all([
      projectApi.list(),
      userApi.list()
    ])
    if (userStore.hasRole('MANAGER')) {
      const userId = userStore.userInfo?.id
      projectList.value = projectRes.data.filter(p => p.managerId === userId)
    } else {
      projectList.value = projectRes.data
    }
    userList.value = userRes.data
  } catch (error) {
    console.error('获取项目和用户列表失败:', error)
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

function handleSizeChange() {
  pagination.current = 1
  fetchTasks()
}

async function openAddModal() {
  isEdit.value = false
  currentTask.value = null
  projectMemberList.value = []
  showModal.value = true
}

async function openEditModal(item: TaskWithNames) {
  isEdit.value = true
  currentTask.value = { ...item }
  // 编辑时获取该项目成员
  if (item.projectId) {
    await fetchProjectMembers(item.projectId)
  }
  showModal.value = true
}

async function fetchProjectMembers(projectId: number) {
  try {
    const res = await projectMemberApi.getByProjectId(projectId)
    if (res.data) {
      // 获取成员的用户信息
      const members: ProjectMemberUser[] = []
      for (const member of res.data) {
        const user = userList.value.find(u => u.id === member.userId)
        if (user) {
          members.push({ userId: user.id, userName: user.realName })
        }
      }
      projectMemberList.value = members
    }
  } catch (error) {
    console.error('获取项目成员失败:', error)
    projectMemberList.value = []
  }
}

function handleFetchMembers(projectId: number) {
  fetchProjectMembers(projectId)
}

function closeModal() {
  showModal.value = false
  currentTask.value = null
}

async function handleSubmit(data: Task) {
  submitting.value = true
  try {
    if (isEdit.value) {
      await taskApi.update(data)
      ElMessage.success('更新成功')
    } else {
      await taskApi.add(data)
      ElMessage.success('新增成功')
    }
    closeModal()
    fetchTasks()
  } catch (error) {
    console.error('保存任务失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(item: TaskWithNames) {
  try {
    await ElMessageBox.confirm(
      `确定要删除任务「${item.taskName}」吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await taskApi.delete(item.id)
    ElMessage.success('删除成功')
    fetchTasks()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除任务失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

function getStatusType(status: number) {
  const map: Record<number, string> = {
    0: 'info',
    1: '',
    2: 'success',
    3: 'warning'
  }
  return map[status] || 'info'
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
  fetchTasks()
})
</script>

<style scoped>
.task-page {
  --paper-color: #f7f4ed;
  --paper-dark: #ebe4d6;
  --ink-dark: #2c2c2c;
  --ink-medium: #5a5a5a;
  --ink-light: #8a8a8a;
  --accent-warm: #c4a77d;
  --accent-rust: #b85c38;
  --border-color: #d4cfc5;

  max-width: 1400px;
  margin: 0 auto;
  font-family: 'SimHei', 'Microsoft YaHei', 'PingFang SC', 'Heiti SC', sans-serif;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: normal;
  color: var(--ink-dark);
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--ink-light);
  font-style: italic;
}

.btn-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}

.search-card {
  background: white;
  border: 1px solid var(--border-color);
  padding: 20px 24px;
  margin-bottom: 20px;
  position: relative;
}

.search-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-warm);
}

.table-card {
  overflow: hidden;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.table-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-dark);
}

.table-count {
  font-size: 12px;
  color: var(--ink-light);
  font-style: italic;
}

.pagination-info {
  font-size: 12px;
  color: var(--ink-light);
  font-style: italic;
}
</style>
