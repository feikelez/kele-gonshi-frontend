<template>
  <div class="approval-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">审批管理</h1>
        <p class="page-subtitle">管理工时审批流程</p>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-form :model="searchParams" inline @submit.prevent="handleSearch">
        <el-form-item label="项目名称">
          <el-input v-model="searchParams.projectName" placeholder="请输入项目名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="searchParams.status" placeholder="全部" clearable>
            <el-option :value="0" label="待审批" />
            <el-option :value="1" label="已通过" />
            <el-option :value="2" label="已驳回" />
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
        <span class="table-title">审批列表</span>

      </div>

      <el-table :data="approvalList" stripe border class="base-table" :max-height="470">
        <el-table-column prop="projectName" label="项目名称" min-width="160" />
        <el-table-column prop="taskName" label="任务名称" min-width="160" />
        <el-table-column prop="userName" label="填报人" width="120" />
        <el-table-column prop="workDate" label="工作日期" width="120" />
        <el-table-column prop="hours" label="工时" width="80" />
        <el-table-column label="工作类型" width="100">
          <template #default="{ row }">
            {{ getWorkTypeText(row.workType) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.submitTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
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
          @current-change="fetchApprovals"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { workRecordApi } from '@/api'
import type { WorkRecord } from '@/api/types'

interface ApprovalRecord extends WorkRecord {
  projectName?: string
  taskName?: string
  userName?: string
}

const approvalList = ref<ApprovalRecord[]>([])

const searchParams = reactive({
  projectName: undefined as string | undefined,
  status: undefined as number | undefined,
  current: 1,
  size: 10
})

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

async function fetchApprovals() {
  try {
    const params: Record<string, any> = {
      current: pagination.current,
      size: pagination.size,
      status: searchParams.status
    }
    const res = await workRecordApi.page(params)
    approvalList.value = res.data.records
    pagination.total = Number(res.data.total)
  } catch (error) {
    console.error('获取审批列表失败:', error)
  }
}

function handleSearch() {
  pagination.current = 1
  fetchApprovals()
}

function handleReset() {
  searchParams.projectName = undefined
  searchParams.status = undefined
  pagination.current = 1
  fetchApprovals()
}

function handleSizeChange() {
  pagination.current = 1
  fetchApprovals()
}

function getStatusType(status: number) {
  const map: Record<number, string> = {
    0: 'warning',
    1: 'success',
    2: 'danger'
  }
  return map[status] || 'info'
}

function getStatusText(status: number) {
  const map: Record<number, string> = {
    0: '待审批',
    1: '已通过',
    2: '已驳回'
  }
  return map[status] || '未知'
}

function getWorkTypeText(type: number) {
  const map: Record<number, string> = {
    0: '开发',
    1: '测试',
    2: '设计',
    3: '会议',
    4: '文档',
    5: '其他'
  }
  return map[type] || '其他'
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return '-'
  return dateStr.replace('T', ' ').split('.')[0]
}

onMounted(() => {
  fetchApprovals()
})
</script>

<style scoped>
.approval-page {
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
