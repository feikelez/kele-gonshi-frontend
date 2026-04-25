import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { ElTable } from 'element-plus'

export function useTableResize() {
  const tableRef = ref<InstanceType<typeof ElTable>>()

  let resizeTimer: ReturnType<typeof setTimeout> | null = null

  function handleResize() {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
    resizeTimer = setTimeout(() => {
      nextTick(() => {
        tableRef.value?.doLayout()
      })
    }, 100)
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
  })

  return { tableRef, handleResize }
}
