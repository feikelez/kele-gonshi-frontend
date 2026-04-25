<template>
  <el-dialog
      :model-value="visible"
      :title="isEdit ? '编辑项目成员' : '新增项目成员'"
      width="480px"
      class="base-dialog base-dialog--accent"
      :close-on-click-modal="false"
      @update:model-value="$emit('update:visible', $event)"
      @closed="onClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="选择项目" prop="projectId">
        <el-select
            v-model="formData.projectId"
            placeholder="请选择项目"
            :disabled="isEdit"
            style="width: 100%"
        >
          <el-option
              v-for="project in projectList"
              :key="project.id"
              :value="project.id"
              :label="`${project.projectName} (${project.projectCode})`"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="选择用户" prop="userId">
        <el-select
            v-model="formData.userId"
            placeholder="请选择用户"
            :disabled="isEdit"
            style="width: 100%"
        >
          <el-option
              v-for="user in userList"
              :key="user.id"
              :value="user.id"
              :label="`${user.realName} (${user.username})`"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="加入日期">
        <el-date-picker
            v-model="formData.joinDate"
            type="date"
            placeholder="选择加入日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
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
import {reactive, watch, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import type {ProjectMember, Project, User} from '@/api/types'

const props = defineProps<{
  visible: boolean
  isEdit: boolean
  member: ProjectMember | null
  submitting: boolean
  projectList: Project[]
  userList: User[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [data: ProjectMember]
  'cancel': []
}>()

const formRef = ref<FormInstance>()

const formData = reactive<ProjectMember>({
  id: 0,
  projectId: 0,
  userId: 0,
  joinDate: '',
  createTime: ''
})

const rules: FormRules = {
  projectId: [
    {required: true, message: '请选择项目', trigger: 'change'}
  ],
  userId: [
    {required: true, message: '请选择用户', trigger: 'change'}
  ]
}

watch(() => props.member, (newMember) => {
  if (newMember) {
    Object.assign(formData, newMember)
  } else {
    resetForm()
  }
}, {immediate: true})

watch(() => props.visible, (visible) => {
  if (!visible) {
    resetForm()
  }
})

function resetForm() {
  formRef.value?.resetFields()
  formData.id = 0
  formData.projectId = 0
  formData.userId = 0
  formData.joinDate = ''
  formData.createTime = ''
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
