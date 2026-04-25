<template>
  <el-dialog
      :model-value="visible"
      :title="isEdit ? '编辑工时' : '填报工时'"
      width="560px"
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

      <el-form-item label="所属任务" prop="taskId">
        <el-select
            v-model="formData.taskId"
            placeholder="请先选择项目"
            :disabled="!formData.projectId"
            style="width: 100%"
        >
          <el-option
              v-for="task in filteredTaskList"
              :key="task.id"
              :value="task.id"
              :label="task.taskName"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="工作日期" prop="workDate">
        <el-date-picker
            v-model="formData.workDate"
            type="date"
            placeholder="选择工作日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="工作类型" prop="workType">
        <el-select v-model="formData.workType" placeholder="请选择工作类型" style="width: 100%">
          <el-option :value="0" label="开发"/>
          <el-option :value="1" label="测试"/>
          <el-option :value="2" label="设计"/>
          <el-option :value="3" label="会议"/>
          <el-option :value="4" label="文档"/>
          <el-option :value="5" label="其他"/>
        </el-select>
      </el-form-item>

      <el-form-item label="工时" prop="hours">
        <el-input-number
            v-model="formData.hours"
            :min="0.5"
            :max="24"
            :step="0.5"
            placeholder="请输入工时"
            style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="工作内容" prop="workContent">
        <el-input
            v-model="formData.workContent"
            type="textarea"
            :rows="4"
            placeholder="请详细描述工作内容"
        />
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
import type {WorkRecord, Project, Task} from '@/api/types'
import {useUserStore} from "@/stores";

const props = defineProps<{
  visible: boolean
  isEdit: boolean
  record: WorkRecord | null
  submitting: boolean
  projectList: Project[]
  taskList: Task[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [data: WorkRecord]
  'cancel': []
}>()

const formRef = ref<FormInstance>()
const userStore = useUserStore()
const userId = userStore.userInfo?.id  // number 类型

const formData = reactive<WorkRecord>({
  id: '',
  userId: '',
  projectId: '',
  taskId: '',
  workDate: '',
  workType: '',
  hours: '',
  workContent: '',
  status: '',
  submitTime: '',
  approvalTime: '',
  approverId: '',
  approvalComment: '',
})

const initFormData = reactive<WorkRecord>({
  id: '',
  userId: userId,
  projectId: '',
  taskId: '',
  workDate: '',
  workType: '',
  hours: '',
  workContent: '',
  status: '',
  submitTime: '',
  approvalTime: '',
  approverId: '',
  approvalComment: '',
})

const filteredTaskList = computed(() => {
  if (!formData.projectId) return []
  return props.taskList.filter(task => task.projectId === formData.projectId)
})

const rules: FormRules = {
  projectId: [
    {required: true, message: '请选择项目', trigger: 'change'}
  ],
  taskId: [
    {required: true, message: '请选择任务', trigger: 'change'}
  ],
  workDate: [
    {required: true, message: '请选择工作日期', trigger: 'change'}
  ],
  hours: [
    {required: true, message: '请输入工时', trigger: 'blur'}
  ],
  workContent: [
    {required: true, message: '请输入工作内容', trigger: 'blur'}
  ]
}

watch(() => props.record, (newRecord) => {
  if (newRecord) {
    Object.assign(formData, newRecord)
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

function resetForm() {
  formRef.value?.resetFields()
  Object.assign(formData, initFormData)
}

function handleProjectChange() {
  formData.taskId = ''
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
