<template>
  <div class="project-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">项目管理</h1>
        <p class="page-subtitle">管理所有项目信息</p>
      </div>
      <el-button type="primary" @click="openAddModal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        新增项目
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-form :model="searchParams" inline @submit.prevent="handleSearch">
        <el-form-item label="项目名称">
          <el-input
              v-model="searchParams.projectName"
              placeholder="请输入项目名称"
              clearable
              @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="searchParams.status" style="width: 100px" placeholder="全部" clearable>
            <el-option :value="0" label="未开始"/>
            <el-option :value="1" label="进行中"/>
            <el-option :value="2" label="已完成"/>
            <el-option :value="3" label="已暂停"/>
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
        <span class="table-title">项目列表</span>

      </div>

      <el-table :data="projectList" stripe border class="base-table" :max-height="470">
        <el-table-column prop="projectCode" label="项目编号" width="140"/>
        <el-table-column prop="projectName" label="项目名称" min-width="180"/>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="startDate" label="开始日期" width="150"/>
        <el-table-column prop="endDate" label="结束日期" width="150"/>
        <el-table-column label="状态" width="150">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditModal(row)">编辑</el-button>
            <el-button link type="success" @click="openAssignModal(row)">分配</el-button>
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
            @current-change="fetchProjects"
            @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 项目表单弹窗 -->
    <ProjectForm
        v-model:visible="showModal"
        :is-edit="isEdit"
        :project="currentProject"
        :submitting="submitting"
        @submit="handleSubmit"
        @cancel="closeModal"
    />

    <!-- 分配弹窗 -->
    <el-dialog
        v-model="showAssignModal"
        title="分配项目成员"
        width="480px"
        class="base-dialog base-dialog--accent"
    >
      <el-form label-width="80px">
        <el-form-item label="项目名称">
          <el-input :model-value="assignTarget?.projectName" disabled/>
        </el-form-item>
        <el-form-item label="选择用户" required>
          <el-select v-model="selectedUserIds" multiple placeholder="请选择用户" style="width: 100%">
            <el-option
                v-for="user in userList"
                :key="user.id"
                :value="user.id"
                :label="user.realName"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeAssignModal">取消</el-button>
        <el-button type="primary" :loading="assignLoading" :disabled="selectedUserIds.length === 0"
                   @click="confirmAssign">
          确认分配
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {projectApi, userApi, projectMemberApi} from '@/api'
import type {Project, ProjectPageParams, User, ProjectMember} from '@/api/types'
import {useUserStore} from '@/stores/user'
import {ElMessage, ElMessageBox} from 'element-plus'
import ProjectForm from './form.vue'

const projectList = ref<Project[]>([])
const showModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const currentProject = ref<Project | null>(null)

// 分配相关
const showAssignModal = ref(false)
const assignTarget = ref<Project | null>(null)
const userList = ref<User[]>([])
const selectedUserIds = ref<number[]>([])
const assignLoading = ref(false)

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

async function fetchProjects() {
  try {
    const userStore = useUserStore().userInfo;
    console.log("ahh", userStore?.roles)
    if (userStore?.roles.indexOf('ADMIN') !== -1) {
      const params: ProjectPageParams = {
        current: pagination.current,
        size: pagination.size,
        projectName: searchParams.projectName || undefined,
        status: searchParams.status
      }
      const res = await projectApi.page(params)
      projectList.value = res.data.records
      pagination.total = Number(res.data.total)
    } else if (userStore?.roles.indexOf('MANAGER') !== -1) {
      const userId = userStore?.id
      if (!userId) {
        ElMessage.warning('无法获取当前用户信息')
        return
      }
      const res = await projectApi.getByManagerIdPage(
          userId,
          pagination.current,
          pagination.size,
          searchParams.projectName,
          searchParams.status
      )
      projectList.value = res.data.records
      pagination.total = Number(res.data.total)
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
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

function handleSizeChange() {
  pagination.current = 1
  fetchProjects()
}

function openAddModal() {
  isEdit.value = false
  currentProject.value = null
  showModal.value = true
}

function openEditModal(project: Project) {
  currentProject.value = {...project}
  isEdit.value = true
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  currentProject.value = null
}

async function handleSubmit(data: Project) {
  submitting.value = true
  try {
    if (isEdit.value) {
      await projectApi.update(data)
      ElMessage.success('更新成功')
    } else {
      await projectApi.add(data)
      ElMessage.success('新增成功')
    }
    closeModal()
    fetchProjects()
  } catch (error) {
    console.error('保存项目失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(project: Project) {
  try {
    await ElMessageBox.confirm(
        `确定要删除项目「${project.projectName}」吗？此操作不可恢复。`,
        '确认删除',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )
    await projectApi.delete(project.id)
    ElMessage.success('删除成功')
    fetchProjects()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除项目失败:', error)
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

// 分配
async function openAssignModal(project: Project) {
  assignTarget.value = project
  selectedUserIds.value = []
  showAssignModal.value = true
  assignLoading.value = true
  try {
    // 获取项目已有成员并回显
    const membersRes = await projectMemberApi.getByProjectId(project.id)
    if (membersRes.data) {
      selectedUserIds.value = membersRes.data.map(m => m.userId)
    }

    // 获取用户列表
    const res = await userApi.listVO()
    userList.value = res.data
  } catch (error) {
    console.error('获取用户列表失败:', error)
    userList.value = []
  } finally {
    assignLoading.value = false
  }
}

function closeAssignModal() {
  showAssignModal.value = false
  assignTarget.value = null
  selectedUserIds.value = []
}

async function confirmAssign() {
  if (!assignTarget.value || selectedUserIds.value.length === 0) return

  assignLoading.value = true
  try {
    // 调用后端原子接口进行分配
    await projectMemberApi.assign(assignTarget.value.id, selectedUserIds.value)
    ElMessage.success('分配成功')
    closeAssignModal()
  } catch (error) {
    console.error('分配失败:', error)
    ElMessage.error('分配失败，请重试')
  } finally {
    assignLoading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.project-page {
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
