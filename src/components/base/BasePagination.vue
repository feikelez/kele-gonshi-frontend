<template>
  <div class="base-pagination">
    <span class="pagination-info">共 {{ total }} 条记录</span>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="pageSizes"
      :small="small"
      layout="prev, pager, next, sizes"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: {
    current: number
    size: number
  }
  total: number
  pageSizes?: number[]
  small?: boolean
}>(), {
  pageSizes: () => [10, 20, 50],
  small: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: { current: number; size: number }): void
  (e: 'change', value: { current: number; size: number }): void
}>()

const currentPage = computed({
  get: () => props.modelValue.current,
  set: (val) => {
    emit('update:modelValue', { ...props.modelValue, current: val })
  }
})

const pageSize = computed({
  get: () => props.modelValue.size,
  set: (val) => {
    emit('update:modelValue', { ...props.modelValue, size: val })
  }
})

function handleCurrentChange(val: number) {
  emit('change', { current: val, size: props.modelValue.size })
}

function handleSizeChange(val: number) {
  emit('change', { current: 1, size: val })
}
</script>

<style scoped>
.base-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 16px 20px;
  border-top: 1px solid #d4cfc5;
}

.pagination-info {
  font-size: 12px;
  color: #8a8a8a;
  font-style: italic;
}
</style>
