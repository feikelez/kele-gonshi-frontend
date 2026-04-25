<template>
  <div class="role-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">角色管理</h1>
        <p class="page-subtitle">管理系统角色信息</p>
      </div>
      <el-button type="primary" @click="openAddModal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        新增角色
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-form :model="searchParams" inline @submit.prevent="handleSearch">
        <el-form-item label="角色名称">
          <el-input
              v-model="searchParams.roleName"
              placeholder="请输入角色名称"
              clearable
              @keyup.enter="handleSearch"
          />
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
        <span class="table-title">角色列表</span>

      </div>

      <el-table :data="roleList" stripe border class="base-table" :max-height="470">
        <el-table-column prop="roleCode" label="角色编码" width="160"/>
        <el-table-column prop="roleName" label="角色名称" min-width="160"/>
        <el-table-column prop="description" label="角色描述" min-width="240"/>
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
            @current-change="fetchRoles"
            @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 角色表单弹窗 -->
    <RoleForm
        v-model:visible="showModal"
        :is-edit="isEdit"
        :role="currentRole"
        :submitting="submitting"
        @submit="handleSubmit"
        @cancel="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {roleApi} from '@/api'
import type {SysRole, RolePageParams} from '@/api/types'
import {ElMessage, ElMessageBox} from 'element-plus'
import RoleForm from './form.vue'

const roleList = ref<SysRole[]>([])
const showModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const currentRole = ref<SysRole | null>(null)

const searchParams = reactive<RolePageParams>({
  roleName: undefined,
  current: 1,
  size: 10
})

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

async function fetchRoles() {
  try {
    const params: RolePageParams = {
      current: pagination.current,
      size: pagination.size,
      roleName: searchParams.roleName || undefined
    }
    const res = await roleApi.page(params)
    roleList.value = res.data.records
    pagination.total = Number(res.data.total)
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

function handleSearch() {
  pagination.current = 1
  fetchRoles()
}

function handleReset() {
  searchParams.roleName = undefined
  pagination.current = 1
  fetchRoles()
}

function handleSizeChange() {
  pagination.current = 1
  fetchRoles()
}

function openAddModal() {
  isEdit.value = false
  currentRole.value = null
  showModal.value = true
}

function openEditModal(role: SysRole) {
  isEdit.value = true
  currentRole.value = {...role}
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  currentRole.value = null
}

async function handleSubmit(data: SysRole) {
  submitting.value = true
  try {
    if (isEdit.value) {
      await roleApi.update(data)
      ElMessage.success('更新成功')
    } else {
      await roleApi.add(data)
      ElMessage.success('新增成功')
    }
    closeModal()
    fetchRoles()
  } catch (error) {
    console.error('保存角色失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(role: SysRole) {
  try {
    await ElMessageBox.confirm(
        `确定要删除角色「${role.roleName}」吗？此操作不可恢复。`,
        '确认删除',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )
    await roleApi.delete(role.id)
    ElMessage.success('删除成功')
    fetchRoles()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除角色失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

onMounted(() => {
  fetchRoles()
})
</script>

<style scoped>
.role-page {
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
