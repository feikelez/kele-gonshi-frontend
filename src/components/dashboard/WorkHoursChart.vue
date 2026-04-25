<template>
  <div class="card work-hours-card">
    <div class="card-header">
      <h3>本周工时</h3>
      <div class="week-selector">
        <button class="week-btn" @click="prevWeek">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span class="week-label">{{ weekLabel }}</span>
        <button class="week-btn" @click="nextWeek">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="card-content">
      <div class="hours-chart">
        <div class="chart-bars">
          <div
            v-for="day in weekDays"
            :key="day.label"
            class="chart-bar-wrapper"
          >
            <div class="chart-bar-container">
              <div
                class="chart-bar"
                :style="{ height: barHeight(day.hours) + '%' }"
              >
                <span class="bar-value">{{ day.hours }}h</span>
              </div>
            </div>
            <span class="chart-label">{{ day.label }}</span>
          </div>
        </div>
      </div>
      <div class="hours-summary">
        <div class="summary-item">
          <span class="summary-label">本周总计</span>
          <span class="summary-value highlight">{{ totalWeekHours }}h</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">日均工时</span>
          <span class="summary-value">{{ avgDailyHours }}h</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface WeekDay {
  label: string
  hours: number
}

const props = defineProps<{
  weekDays: WeekDay[]
}>()

const emit = defineEmits<{
  prevWeek: []
  nextWeek: []
}>()

const weekLabel = computed(() => {
  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - start.getDay() + 1)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
})

const totalWeekHours = computed(() => {
  return props.weekDays.reduce((sum, day) => sum + day.hours, 0)
})

const avgDailyHours = computed(() => {
  const daysWithHours = props.weekDays.filter(d => d.hours > 0).length
  return daysWithHours > 0 ? (totalWeekHours.value / daysWithHours).toFixed(1) : '0'
})

function barHeight(hours: number) {
  const maxHours = 12
  return Math.min((hours / maxHours) * 100, 100)
}

function prevWeek() {
  emit('prevWeek')
}

function nextWeek() {
  emit('nextWeek')
}
</script>

<style scoped>
.card {
  --paper-color: #f7f4ed;
  --ink-dark: #2c2c2c;
  --ink-medium: #5a5a5a;
  --ink-light: #8a8a8a;
  --accent-warm: #c4a77d;
  --accent-rust: #b85c38;
  --border-color: #d4cfc5;
  
  background: white;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  font-family: 'SimHei', 'Microsoft YaHei', 'PingFang SC', 'Heiti SC', sans-serif;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-warm);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-color);
}

.card-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-dark);
}

.week-selector {
  display: flex;
  align-items: center;
  gap: 6px;
}

.week-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-light);
  transition: all 0.15s ease;
  background: transparent;
  border: none;
  cursor: pointer;
}

.week-btn:hover {
  background: var(--paper-color);
  color: var(--ink-dark);
}

.week-btn svg {
  width: 14px;
  height: 14px;
}

.week-label {
  font-size: 12px;
  color: var(--ink-medium);
  min-width: 90px;
  text-align: center;
  font-style: italic;
}

.card-content {
  padding: 16px 20px;
}

.hours-chart {
  margin-bottom: 18px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 150px;
  padding-top: 20px;
}

.chart-bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.chart-bar-container {
  width: 100%;
  max-width: 36px;
  height: 110px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.chart-bar {
  width: 100%;
  background: var(--accent-rust);
  position: relative;
  transition: height 0.3s ease;
  min-height: 3px;
  border: 1px solid var(--ink-dark);
}

.bar-value {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 600;
  color: var(--accent-rust);
  white-space: nowrap;
}

.chart-label {
  font-size: 11px;
  color: var(--ink-light);
}

.hours-summary {
  display: flex;
  justify-content: space-around;
  padding-top: 14px;
  border-top: 1px dashed var(--border-color);
}

.summary-item {
  text-align: center;
}

.summary-label {
  font-size: 11px;
  color: var(--ink-light);
  display: block;
  margin-bottom: 3px;
  font-style: italic;
}

.summary-value {
  font-size: 18px;
  font-weight: normal;
  color: var(--ink-dark);
}

.summary-value.highlight {
  color: var(--accent-rust);
}
</style>
