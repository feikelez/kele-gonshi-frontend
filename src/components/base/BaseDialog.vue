<template>
  <el-dialog
    :model-value="visible"
    v-bind="$attrs"
    class="base-dialog base-dialog--accent"
    :show-close="false"
    @update:model-value="$emit('update:visible', $event)"
    @close="$emit('close')"
  >
    <template #header>
      <div class="base-dialog__header">
        <span class="base-dialog__title">{{ title }}</span>
        <button class="base-dialog__close" @click="handleClose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </template>

    <slot />

    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}>()

function handleClose() {
  emit('update:visible', false)
}
</script>

<style scoped>
.base-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.base-dialog__title {
  font-size: 18px;
  font-weight: normal;
  color: #2c2c2c;
}

.base-dialog__close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #8a8a8a;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
}

.base-dialog__close:hover {
  color: #2c2c2c;
}

.base-dialog__close svg {
  width: 18px;
  height: 18px;
}
</style>
