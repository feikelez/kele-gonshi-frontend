<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    width="520px"
    class="base-dialog base-dialog--accent"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
    @closed="onClosed"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      class="user-form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="formData.username"
          placeholder="请输入用户名"
          :disabled="isEdit"
        />
      </el-form-item>

      <el-form-item v-if="!isEdit" label="密码" prop="password">
        <el-input
          v-model="formData.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>

      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model="formData.realName"
          placeholder="请输入真实姓名"
        />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="formData.email"
          placeholder="请输入邮箱"
        />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="formData.phone"
          placeholder="请输入手机号"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option :value="1" label="启用" />
          <el-option :value="0" label="禁用" />
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
import { reactive, watch, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { User } from '@/api/types'

const props = defineProps<{
  visible: boolean
  isEdit: boolean
  user: User | null
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [data: User]
  'cancel': []
}>()

const formRef = ref<FormInstance>()

const formData = reactive<User>({
  id: 0,
  username: '',
  password: '',
  realName: '',
  email: '',
  phone: '',
  status: 1,
  createTime: '',
  updateTime: '',
  delFlag: 0
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' }
  ]
}

watch(() => props.user, (newUser) => {
  if (newUser) {
    Object.assign(formData, newUser)
    formData.password = ''
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
  formData.username = ''
  formData.password = ''
  formData.realName = ''
  formData.email = ''
  formData.phone = ''
  formData.status = 1
  formData.createTime = ''
  formData.updateTime = ''
  formData.delFlag = 0
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
.user-form {
  padding: 8px 0;
}

.user-form :deep(.el-select) {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
