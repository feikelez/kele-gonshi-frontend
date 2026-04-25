<template>
  <div class="stats-grid">
    <StatsCard v-for="stat in stats" :key="stat.title" :stat="stat" />
  </div>
</template>

<script setup lang="ts">
import StatsCard from './StatsCard.vue'

interface StatItem {
  title: string
  value: string
  unit: string
  trend: number
  color: string
  icon: string
}

defineProps<{
  stats: StatItem[]
}>()
</script>

<style scoped>
.stats-grid {
  --paper-color: #f7f4ed;
  --ink-dark: #2c2c2c;
  --ink-medium: #5a5a5a;
  --ink-light: #8a8a8a;
  --accent-warm: #c4a77d;
  --accent-rust: #b85c38;
  --border-color: #d4cfc5;
  
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  font-family: 'SimHei', 'Microsoft YaHei', 'PingFang SC', 'Heiti SC', sans-serif;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
