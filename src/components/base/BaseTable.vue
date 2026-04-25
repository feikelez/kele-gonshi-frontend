<template>
  <el-table
    :data="data"
    v-bind="$attrs"
    stripe
    border
    class="base-table"
    :row-class-name="tableRowClassName"
  >
    <slot />
    <template #empty>
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <p>{{ emptyText }}</p>
      </div>
    </template>
  </el-table>
</template>

<script setup lang="ts">
defineProps<{
  data: any[]
  emptyText?: string
}>()

function tableRowClassName({ rowIndex }: { rowIndex: number }) {
  return rowIndex % 2 === 0 ? '' : 'el-table__row--striped'
}
</script>
