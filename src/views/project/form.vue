<template>
  <el-dialog
      :model-value="visible"
      :title="isEdit ? '编辑项目' : '新增项目'"
      width="520px"
      class="base-dialog base-dialog--accent"
      :close-on-click-modal="false"
      @update:model-value="$emit('update:visible', $event)"
      @closed="onClosed"
  >

    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="项目编号" prop="projectCode">
        <el-input
            v-model="formData.projectCode"
            placeholder="请输入项目编号"
            :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
            v-model="formData.projectName"
            placeholder="请输入项目名称"
        />
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入项目描述"
        />
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker
            v-model="formData.startDate"
            type="date"
            placeholder="选择开始日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker
            v-model="formData.endDate"
            type="date"
            placeholder="选择结束日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="项目状态">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option :value="0" label="未开始"/>
          <el-option :value="1" label="进行中"/>
          <el-option :value="2" label="已完成"/>
          <el-option :value="3" label="已暂停"/>
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
import {reactive, watch, ref, nextTick} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import type {Project} from '@/api/types'
import {useUserStore} from "@/stores";

const props = defineProps<{
  visible: boolean
  isEdit: boolean
  project: Project | null
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [data: Project]
  'cancel': []
}>()

const formRef = ref<FormInstance>()
const userId = useUserStore().userInfo.id;

const formData = reactive<Project>({
  id: 0,
  projectCode: '',
  projectName: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 0,
  managerId: userId,
  createTime: '',
  updateTime: '',
})

const initFormData = reactive<Project>({
  id: 0,
  projectCode: '',
  projectName: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 0,
  managerId: userId,
  createTime: '',
  updateTime: '',
})

const rules: FormRules = {
  projectCode: [
    {required: true, message: '请输入项目编号', trigger: 'blur'}
  ],
  projectName: [
    {required: true, message: '请输入项目名称', trigger: 'blur'}
  ]
}

watch(() => props.visible, async (visible) => {
  if (!visible) {
    await nextTick()
    Object.assign(formData, initFormData)
    resetForm()
  }
})

function resetForm() {
  formRef.value?.resetFields()
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
