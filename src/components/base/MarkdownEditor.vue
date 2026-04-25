<template>
  <div class="markdown-editor-wrapper">
    <v-md-editor
        v-model="text"
        :height="height"
        :disabled="disabled"
        :placeholder="placeholder"
        @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  height?: string
  disabled?: boolean
  placeholder?: string
}>(), {
  modelValue: '',
  height: '300px',
  disabled: false,
  placeholder: '请输入内容...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const text = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  text.value = val
})

watch(text, (val) => {
  emit('update:modelValue', val)
})

function handleChange(val: string) {
  emit('change', val)
}
</script>

<style scoped>
.markdown-editor-wrapper {
  width: 100%;
  position: relative;
  z-index: 200;
}

.markdown-editor-wrapper :deep(.v-md-editor--fullscreen) {
  z-index: 9999 !important;
}
</style>