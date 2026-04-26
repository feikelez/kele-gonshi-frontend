<template>
  <el-dialog
      v-model="visible"
      title="分配角色"
      width="600px"
      :close-on-click-modal="false"
      @closed="onClosed"
  >
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <div v-else class="dialog-content">
      <div class="user-info">
        <span class="label">用户：</span>
        <span class="value">{{ user?.realName }}</span>
        <span class="username">({{ user?.username }})</span>
      </div>

      <el-divider />

      <div class="role-section">
        <div class="section-title">选择角色</div>
        <el-radio-group v-model="selectedRoleId" class="role-radio-group">
          <el-radio value="1" :disabled="isSelf">管理员</el-radio>
          <el-radio value="2" :disabled="isSelf">经理</el-radio>
          <el-radio value="3" :disabled="isSelf">员工</el-radio>
        </el-radio-group>
        <div v-if="isSelf" class="self-hint">无法为自己分配角色</div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="isSelf" @click="handleSubmit">
        确认分配
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {Loading} from '@element-plus/icons-vue'
import {userRoleApi} from '@/api'
import {useUserStore} from '@/stores/user'
import type {User} from '@/api/types'
import {ElMessage} from 'element-plus'

interface Props {
  modelValue: boolean
  user: User | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const userStore = useUserStore()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const submitting = ref(false)
const currentRoleId = ref<number | null>(null)
const selectedRoleId = ref<number | null>(null)

const isSelf = computed(() => props.user?.id === userStore.userInfo?.id)

const roleNameMap: Record<number, string> = {
  1: '管理员',
  2: '经理',
  3: '员工'
}

watch(visible, async (val) => {
  if (val && props.user) {
    await fetchCurrentRole()
  }
})

async function fetchCurrentRole() {
  if (!props.user) return
  loading.value = true
  try {
    const res = await userRoleApi.getRoleIdsByUserId(props.user.id)
    if (res.code === 200 && res.data && res.data.length > 0) {
      currentRoleId.value = res.data[0]
      selectedRoleId.value = res.data[0]
    } else {
      currentRoleId.value = null
      selectedRoleId.value = null
    }
  } catch (error) {
    console.error('获取用户角色失败:', error)
    ElMessage.error('获取角色信息失败')
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!props.user || selectedRoleId.value === null) {
    ElMessage.warning('请选择角色')
    return
  }

  if (selectedRoleId.value === currentRoleId.value) {
    handleCancel()
    return
  }

  submitting.value = true
  try {
    await userRoleApi.assignRoles(props.user.id, [selectedRoleId.value])
    ElMessage.success('角色分配成功')
    emit('success')
    handleCancel()
  } catch (error) {
    console.error('分配角色失败:', error)
    ElMessage.error('分配失败，请重试')
  } finally {
    submitting.value = false
  }
}

function handleCancel() {
  visible.value = false
}

function onClosed() {
  currentRoleId.value = null
  selectedRoleId.value = null
}
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 0;
  color: #8a8a8a;
}

.dialog-content {
  padding: 8px 0;
}

.user-info {
  font-size: 14px;
  color: #2c2c2c;
}

.user-info .label {
  color: #8a8a8a;
}

.user-info .username {
  color: #8a8a8a;
  margin-left: 4px;
}

.role-section {
  padding: 8px 0;
}

.section-title {
  font-size: 14px;
  color: #5a5a5a;
  margin-bottom: 16px;
}

.role-radio-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.role-radio-group :deep(.el-radio) {
  height: 36px;
  line-height: 36px;
  padding: 0 12px;
  border: 1px solid #d4cfc5;
  border-radius: 8px;
  margin-right: 0;
}

.role-radio-group :deep(.el-radio.is-checked) {
  border-color: #b85c38;
  background-color: rgba(184, 92, 56, 0.05);
}

.role-radio-group :deep(.el-radio.is-disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

.self-hint {
  margin-top: 12px;
  font-size: 12px;
  color: #b85c38;
}
</style>
