<template>
  <div class="project-member-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">项目成员管理</h1>
        <p class="page-subtitle">管理项目成员信息</p>
      </div>
      <el-button type="primary" @click="openAddModal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        新增成员
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-form :model="searchParams" inline @submit.prevent="handleSearch">
        <el-form-item label="项目名称">
          <el-input v-model="searchParams.projectName" placeholder="请输入项目名称" clearable
                    @keyup.enter="handleSearch"/>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchParams.username" placeholder="请输入用户名" clearable @keyup.enter="handleSearch"/>
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
        <span class="table-title">项目成员列表</span>

      </div>

      <el-table :data="memberList" stripe border class="base-table" :max-height="470">
        <el-table-column prop="projectName" label="项目名称" min-width="180"/>
        <el-table-column prop="projectCode" label="项目编号" width="140"/>
        <el-table-column prop="userName" label="成员姓名" width="120"/>
        <el-table-column prop="username" label="用户名" width="120"/>
        <el-table-column prop="joinDate" label="加入日期" width="150"/>
        <el-table-column prop="createTime" label="创建时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
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
            @current-change="fetchMembers"
            @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 项目成员表单弹窗 -->
    <ProjectMemberForm
        v-model:visible="showModal"
        :is-edit="isEdit"
        :member="currentMember"
        :submitting="submitting"
        :project-list="projectList"
        :user-list="userList"
        @submit="handleSubmit"
        @cancel="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {projectMemberApi, projectApi, userApi} from '@/api'
import type {ProjectMember, Project, User} from '@/api/types'
import {ElMessage, ElMessageBox} from 'element-plus'
import ProjectMemberForm from './form.vue'

interface MemberWithNames extends ProjectMember {
  projectName: string
  projectCode: string
  userName: string
  username: string
}

const memberList = ref<MemberWithNames[]>([])
const projectList = ref<Project[]>([])
const userList = ref<User[]>([])
const showModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const currentMember = ref<ProjectMember | null>(null)

const searchParams = reactive({
  projectName: undefined as string | undefined,
  username: undefined as string | undefined,
  current: 1,
  size: 10
})

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

async function fetchMembers() {
  try {
    const res = await projectMemberApi.page({
      current: pagination.current,
      size: pagination.size
    })

    if (projectList.value.length === 0) {
      await fetchProjectsAndUsers()
    }

    let records = res.data.records.map((item: ProjectMember) => {
      const project = projectList.value.find(p => p.id === item.projectId)
      const user = userList.value.find(u => u.id === item.userId)
      return {
        ...item,
        projectName: project?.projectName || '',
        projectCode: project?.projectCode || '',
        userName: user?.realName || '',
        username: user?.username || ''
      }
    })

    if (searchParams.projectName) {
      records = records.filter((m: MemberWithNames) =>
          m.projectName.includes(searchParams.projectName!)
      )
    }
    if (searchParams.username) {
      records = records.filter((m: MemberWithNames) =>
          m.username.includes(searchParams.username!)
      )
    }

    memberList.value = records
    pagination.total = Number(res.data.total)
  } catch (error) {
    console.error('获取项目成员列表失败:', error)
  }
}

async function fetchProjectsAndUsers() {
  try {
    const [projectRes, userRes] = await Promise.all([
      projectApi.list(),
      userApi.list()
    ])
    projectList.value = projectRes.data
    userList.value = userRes.data
  } catch (error) {
    console.error('获取项目和用户列表失败:', error)
  }
}

function handleSearch() {
  pagination.current = 1
  fetchMembers()
}

function handleReset() {
  searchParams.projectName = undefined
  searchParams.username = undefined
  pagination.current = 1
  fetchMembers()
}

function handleSizeChange() {
  pagination.current = 1
  fetchMembers()
}

function openAddModal() {
  isEdit.value = false
  currentMember.value = null
  showModal.value = true
}

function openEditModal(item: MemberWithNames) {
  isEdit.value = true
  currentMember.value = {...item}
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  currentMember.value = null
}

async function handleSubmit(data: ProjectMember) {
  submitting.value = true
  try {
    if (isEdit.value) {
      await projectMemberApi.update(data)
      ElMessage.success('更新成功')
    } else {
      await projectMemberApi.add(data)
      ElMessage.success('新增成功')
    }
    closeModal()
    fetchMembers()
  } catch (error) {
    console.error('保存项目成员失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(item: MemberWithNames) {
  try {
    await ElMessageBox.confirm(
        `确定要删除项目成员「${item.userName}」吗？此操作不可恢复。`,
        '确认删除',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )
    await projectMemberApi.delete(item.id)
    ElMessage.success('删除成功')
    fetchMembers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除项目成员失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return dateStr.split(' ')[0]
}

onMounted(() => {
  fetchMembers()
})
</script>

<style scoped>
.project-member-page {
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
