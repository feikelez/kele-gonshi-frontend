<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑角色' : '新增角色'"
    width="480px"
    class="base-dialog base-dialog--accent"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
    @closed="onClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="角色编码" prop="roleCode">
        <el-input
          v-model="formData.roleCode"
          placeholder="请输入角色编码"
          :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="formData.roleName"
          placeholder="请输入角色名称"
        />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入角色描述"
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
import { reactive, watch, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { SysRole } from '@/api/types'

const props = defineProps<{
  visible: boolean
  isEdit: boolean
  role: SysRole | null
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [data: SysRole]
  'cancel': []
}>()

const formRef = ref<FormInstance>()

const formData = reactive<SysRole>({
  id: 0,
  roleCode: '',
  roleName: '',
  description: '',
  createTime: ''
})

const rules: FormRules = {
  roleCode: [
    { required: true, message: '请输入角色编码', trigger: 'blur' }
  ],
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ]
}

watch(() => props.role, (newRole) => {
  if (newRole) {
    Object.assign(formData, newRole)
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.visible, (visible) => {
  if (!visible) {
    resetForm()
  }
})

function resetForm() {
  formRef.value?.resetFields()
  formData.id = 0
  formData.roleCode = ''
  formData.roleName = ''
  formData.description = ''
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
    emit('submit', { ...formData })
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
