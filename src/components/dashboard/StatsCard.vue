<template>
  <div class="stat-card">
    <div class="stat-icon" :style="{ background: stat.color }">
      <div v-html="stat.icon"></div>
    </div>
    <div class="stat-content">
      <div class="stat-value">
        <span class="value">{{ stat.value }}</span>
        <span class="unit">{{ stat.unit }}</span>
      </div>
      <div class="stat-title">{{ stat.title }}</div>
<!--      <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">-->
      <!--        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">-->
      <!--          <path v-if="stat.trend > 0" d="M18 15l-6-6-6 6"/>-->
      <!--          <path v-else d="M6 9l6 6 6-6"/>-->
      <!--        </svg>-->
      <!--        <span>{{ Math.abs(stat.trend) }}%</span>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
interface StatItem {
  title: string
  value: string
  unit: string
  trend: number
  color: string
  icon: string
}

defineProps<{
  stat: StatItem
}>()
</script>

<style scoped>
.stat-card {
  --paper-color: #f7f4ed;
  --ink-dark: #2c2c2c;
  --ink-medium: #5a5a5a;
  --ink-light: #8a8a8a;
  --accent-warm: #c4a77d;
  --accent-rust: #b85c38;
  --border-color: #d4cfc5;
  
  background: white;
  padding: 20px;
  display: flex;
  gap: 14px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  position: relative;
  font-family: 'SimHei', 'Microsoft YaHei', 'PingFang SC', 'Heiti SC', sans-serif;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-warm);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--ink-dark);
  transform: rotate(-3deg);
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.stat-value .value {
  font-size: 26px;
  font-weight: normal;
  color: var(--ink-dark);
}

.stat-value .unit {
  font-size: 13px;
  color: var(--ink-light);
  font-style: italic;
}

.stat-title {
  font-size: 13px;
  color: var(--ink-medium);
  margin-bottom: 6px;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-left: 2px solid;
}

.stat-trend.up {
  color: #2d6a4f;
  border-left-color: #2d6a4f;
  background: rgba(45, 106, 79, 0.08);
}

.stat-trend.down {
  color: var(--accent-rust);
  border-left-color: var(--accent-rust);
  background: rgba(184, 92, 56, 0.08);
}

.stat-trend svg {
  width: 12px;
  height: 12px;
}
</style>
