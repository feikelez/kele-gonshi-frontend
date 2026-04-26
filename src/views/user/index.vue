<template>
  <div class="user-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">用户管理</h1>
        <p class="page-subtitle">管理系统用户信息</p>
      </div>
      <el-button type="primary" @click="openAddModal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        新增用户
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-form :model="searchParams" inline @submit.prevent="handleSearch">
        <el-form-item label="用户名">
          <el-input
              v-model="searchParams.username"
              placeholder="请输入用户名"
              clearable
              @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchParams.status" placeholder="全部" clearable>
            <el-option :value="1" label="启用"/>
            <el-option :value="0" label="禁用"/>
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
        <span class="table-title">用户列表</span>

      </div>

      <el-table
          :data="userList"
          stripe
          border
          class="base-table" :max-height="470"
      >
        <el-table-column prop="username" label="用户名" width="140"/>
        <el-table-column prop="realName" label="真实姓名" min-width="120"/>
        <el-table-column prop="email" label="邮箱" min-width="180"/>
        <el-table-column prop="phone" label="手机号" width="140"/>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditModal(row)">编辑</el-button>
            <el-button link type="warning" @click="openAssignRoleModal(row)">分配角色</el-button>
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
            @current-change="fetchUsers"
            @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 用户表单弹窗 -->
    <UserForm
        v-model:visible="showModal"
        :is-edit="isEdit"
        :user="currentUser"
        :submitting="submitting"
        @submit="handleSubmit"
        @cancel="closeModal"
    />

    <!-- 分配角色弹窗 -->
    <AssignRoleDialog
        v-model="showAssignRoleDialog"
        :user="currentAssignUser"
        @success="fetchUsers"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {userApi} from '@/api'
import type {User, UserPageParams} from '@/api/types'
import {ElMessage, ElMessageBox} from 'element-plus'
import UserForm from './form.vue'
import AssignRoleDialog from './AssignRoleDialog.vue'

const userList = ref<User[]>([])
const showModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const currentUser = ref<User | null>(null)
const showAssignRoleDialog = ref(false)
const currentAssignUser = ref<User | null>(null)

const searchParams = reactive<UserPageParams>({
  username: undefined,
  status: undefined,
  current: 1,
  size: 10
})

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

async function fetchUsers() {
  try {
    const params: UserPageParams = {
      current: pagination.current,
      size: pagination.size,
      username: searchParams.username || undefined,
      status: searchParams.status
    }
    const res = await userApi.page(params)
    userList.value = res.data.records
    pagination.total = Number(res.data.total)
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

function handleSearch() {
  pagination.current = 1
  fetchUsers()
}

function handleReset() {
  searchParams.username = undefined
  searchParams.status = undefined
  pagination.current = 1
  fetchUsers()
}

function handleSizeChange() {
  pagination.current = 1
  fetchUsers()
}

function openAddModal() {
  isEdit.value = false
  currentUser.value = null
  showModal.value = true
}

function openEditModal(user: User) {
  isEdit.value = true
  currentUser.value = {...user}
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  currentUser.value = null
}

function openAssignRoleModal(user: User) {
  currentAssignUser.value = user
  showAssignRoleDialog.value = true
}

async function handleSubmit(data: User) {
  submitting.value = true
  try {
    if (isEdit.value) {
      await userApi.update(data)
      ElMessage.success('更新成功')
    } else {
      await userApi.add(data)
      ElMessage.success('新增成功')
    }
    closeModal()
    fetchUsers()
  } catch (error) {
    console.error('保存用户失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(user: User) {
  try {
    await ElMessageBox.confirm(
        `确定要删除用户「${user.realName}」吗？此操作不可恢复。`,
        '确认删除',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )
    await userApi.delete(user.id)
    ElMessage.success('删除成功')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return dateStr.split(' ')[0]
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-page {
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
