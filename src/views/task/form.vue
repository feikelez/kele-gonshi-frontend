<template>
  <el-dialog
      :model-value="visible"
      :title="isEdit ? '编辑任务' : '新增任务'"
      width="520px"
      class="base-dialog base-dialog--accent"
      :close-on-click-modal="false"
      @update:model-value="$emit('update:visible', $event)"
      @closed="onClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="所属项目" prop="projectId">
        <el-select
            v-model="formData.projectId"
            placeholder="请选择项目"
            :disabled="isEdit"
            style="width: 100%"
            @change="handleProjectChange"
        >
          <el-option
              v-for="project in projectList"
              :key="project.id"
              :value="project.id"
              :label="project.projectName"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="formData.taskName" placeholder="请输入任务名称"/>
      </el-form-item>

      <el-form-item label="任务描述">
        <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务描述"
        />
      </el-form-item>

      <el-form-item label="负责人" prop="assigneeId">
        <el-select v-model="formData.assigneeId" placeholder="请选择负责人" style="width: 100%">
          <el-option
              v-for="user in memberOptions"
              :key="user.userId"
              :value="user.userId"
              :label="user.userName"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="计划工时">
        <el-input-number
            v-model="formData.planHours"
            :min="0"
            :step="0.5"
            placeholder="请输入计划工时"
            style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="任务状态">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option :value="0" label="待开始"/>
          <el-option :value="1" label="进行中"/>
          <el-option :value="2" label="已完成"/>
          <el-option :value="3" label="已取消"/>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ submitting ? '提交中...' : '确定' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive, watch, ref, computed, nextTick} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import type {Task, Project, User} from '@/api/types'

interface ProjectMemberUser {
  userId: number
  userName: string
}

const props = defineProps<{
  visible: boolean
  isEdit: boolean
  task: Task | null
  submitting: boolean
  projectList: Project[]
  userList: User[]
  projectMemberList: ProjectMemberUser[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [data: Task]
  'cancel': []
  'fetch-members': [projectId: number]
}>()

const formRef = ref<FormInstance>()

const formData = reactive<Task>({
  id: '',
  projectId: '',
  taskName: '',
  description: '',
  assigneeId: '',
  status: '',
  planHours: '',
})

const initFormData = reactive<Task>({
  id: '',
  projectId: '',
  taskName: '',
  description: '',
  assigneeId: '',
  status: '',
  planHours: '',
})

// 负责人选项：根据项目成员列表显示
const memberOptions = computed(() => {
  if (props.projectMemberList.length > 0) {
    return props.projectMemberList
  }
  // 如果没有项目成员，回退到全部用户列表
  return props.userList.map(u => ({userId: u.id, userName: u.realName}))
})

const rules: FormRules = {
  projectId: [
    {required: true, message: '请选择项目', trigger: 'change'}
  ],
  taskName: [
    {required: true, message: '请输入任务名称', trigger: 'blur'}
  ],
  assigneeId: [
    {required: true, message: '请选择负责人', trigger: 'change'}
  ]
}

watch(() => props.task, (newTask) => {
  if (newTask) {
    Object.assign(formData, newTask)
  } else {
    resetForm()
  }
}, {immediate: true})

watch(() => props.visible, async (visible) => {
  if (!visible) {
    await nextTick();
    resetForm()
  }
})

function handleProjectChange(projectId: number) {
  // 切换项目时，清空负责人选择
  formData.assigneeId = ''
  // 通知父组件获取该项目成员
  emit('fetch-members', projectId)
}

function resetForm() {
  formRef.value?.resetFields()
  Object.assign(formData, initFormData)
}

function onClosed() {
  formRef.value?.resetFields()
}

function handleCancel() {
  emit('update:visible', false)
  emit('cancel')
}

async function handleSubmit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    emit('submit', {...formData})
  } catch {
    // 验证失败
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
