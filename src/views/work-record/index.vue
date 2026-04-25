<template>
  <div class="work-record-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">工时填报</h1>
        <p class="page-subtitle">记录每日工作工时</p>
      </div>
      <el-button type="primary" @click="openAddModal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        填报工时
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-form :model="searchParams" inline @submit.prevent="handleSearch">
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
        <el-form-item label="工作类型">
          <el-select v-model="searchParams.workType" placeholder="全部" clearable style="width: 140px">
            <el-option :value="0" label="开发"/>
            <el-option :value="1" label="测试"/>
            <el-option :value="2" label="设计"/>
            <el-option :value="3" label="会议"/>
            <el-option :value="4" label="文档"/>
            <el-option :value="5" label="其他"/>
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
        <span class="table-title">工时记录</span>

      </div>

      <el-table :data="recordList" stripe border class="base-table" :max-height="470">
        <el-table-column prop="workDate" label="工作日期" width="120"/>
        <el-table-column label="所属项目" min-width="160">
          <template #default="{ row }">
            {{ getProjectName(row.projectId) }}
          </template>
        </el-table-column>
        <el-table-column label="所属任务" min-width="160">
          <template #default="{ row }">
            {{ getTaskName(row.taskId) }}
          </template>
        </el-table-column>
        <el-table-column label="工作类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ getWorkTypeText(row.workType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hours" label="工时" width="80">
          <template #default="{ row }">
            {{ row.hours }}h
          </template>
        </el-table-column>
        <el-table-column prop="workContent" label="工作内容" min-width="200" show-overflow-tooltip/>
        <el-table-column label="操作" width="140" fixed="right">
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
            @current-change="fetchRecords"
            @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 工时表单弹窗 -->
    <WorkRecordForm
        v-model:visible="showModal"
        :is-edit="isEdit"
        :record="currentRecord"
        :submitting="submitting"
        :project-list="projectList"
        :task-list="taskList"
        @submit="handleSubmit"
        @cancel="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {workRecordApi, projectApi, taskApi} from '@/api'
import type {WorkRecord, WorkRecordPageParams, Project, Task} from '@/api/types'
import {ElMessage, ElMessageBox} from 'element-plus'
import WorkRecordForm from './form.vue'

const recordList = ref<WorkRecord[]>([])
const projectList = ref<Project[]>([])
const taskList = ref<Task[]>([])
const showModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const currentRecord = ref<WorkRecord | null>(null)

const searchParams = reactive<WorkRecordPageParams>({
  projectId: undefined,
  workType: undefined,
  current: 1,
  size: 10
})

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

async function fetchRecords() {
  try {
    const params: Record<string, any> = {
      current: pagination.current,
      size: pagination.size,
      projectId: searchParams.projectId,
      workType: searchParams.workType
    }
    const res = await workRecordApi.myPage(params)
    recordList.value = res.data.records
    pagination.total = Number(res.data.total)
  } catch (error) {
    console.error('获取工时记录失败:', error)
  }
}

async function fetchProjectsAndTasks() {
  try {
    const [projectRes, taskRes] = await Promise.all([
      projectApi.getMyProjects(),
      taskApi.getMyTasks()
    ])
    projectList.value = projectRes.data.records
    taskList.value = taskRes.data.records
  } catch (error) {
    console.error('获取项目列表失败:', error)
  }
}

function handleSearch() {
  pagination.current = 1
  fetchRecords()
}

function handleReset() {
  searchParams.projectId = undefined
  searchParams.workType = undefined
  pagination.current = 1
  fetchRecords()
}

function handleSizeChange() {
  pagination.current = 1
  fetchRecords()
}

function openAddModal() {
  isEdit.value = false
  currentRecord.value = null
  showModal.value = true
}

function openEditModal(record: WorkRecord) {
  isEdit.value = true
  currentRecord.value = {...record}
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  currentRecord.value = null
}

async function handleSubmit(data: WorkRecord) {
  submitting.value = true
  try {
    if (isEdit.value) {
      await workRecordApi.update(data)
      ElMessage.success('更新成功')
    } else {
      await workRecordApi.add(data)
      ElMessage.success('新增成功')
    }
    closeModal()
    fetchRecords()
  } catch (error) {
    console.error('保存工时记录失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(record: WorkRecord) {
  try {
    await ElMessageBox.confirm(
        '确定要删除该工时记录吗？此操作不可恢复。',
        '确认删除',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )
    await workRecordApi.delete(record.id)
    ElMessage.success('删除成功')
    fetchRecords()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除工时记录失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

function getProjectName(projectId: number): string {
  const project = projectList.value.find(p => p.id === projectId)
  return project?.projectName || '-'
}

function getTaskName(taskId: number): string {
  const task = taskList.value.find(t => t.id === taskId)
  return task?.taskName || '-'
}

function getWorkTypeText(workType: number): string {
  const map: Record<number, string> = {
    0: '开发',
    1: '测试',
    2: '设计',
    3: '会议',
    4: '文档',
    5: '其他'
  }
  return map[workType] || '未知'
}

function getStatusType(status: number) {
  const map: Record<number, string> = {
    0: 'info',
    1: 'warning',
    2: 'success',
    3: 'danger'
  }
  return map[status] || 'info'
}

function getStatusText(status: number) {
  const map: Record<number, string> = {
    0: '草稿',
    1: '待审批',
    2: '已通过',
    3: '已驳回'
  }
  return map[status] || '未知'
}

onMounted(() => {
  fetchProjectsAndTasks()
  fetchRecords()
})
</script>

<style scoped>
.work-record-page {
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

.no-action {
  color: var(--ink-light);
  font-size: 12px;
}
</style>
