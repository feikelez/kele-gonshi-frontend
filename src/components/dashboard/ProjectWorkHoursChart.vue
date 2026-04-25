<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">项目工时趋势</h3>
      <div class="chart-controls">
        <el-select v-model="selectedProject" placeholder="选择项目" size="default" class="project-select">
          <el-option
              v-for="project in projects"
              :key="project.id"
              :label="project.name"
              :value="project.id"
          />
        </el-select>
        <el-date-picker
            v-model="selectedMonth"
            type="month"
            placeholder="选择月份"
            size="default"
            class="month-picker"
            format="YYYY年MM月"
            value-format="YYYY-MM"
        />
      </div>
    </div>
    <div class="chart-body">
      <div v-if="loading" class="chart-loading">
        <el-icon class="is-loading">
          <Loading/>
        </el-icon>
        <span>加载中...</span>
      </div>
      <div v-else ref="chartRef" class="chart-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, onBeforeUnmount, nextTick} from 'vue'
import * as echarts from 'echarts'
import {Loading} from '@element-plus/icons-vue'
import {workRecordApi} from '@/api'

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const projects = ref([
  {id: 1, name: 'OA系统重构'},
  {id: 2, name: 'CRM客户管理'},
  {id: 3, name: '移动端APP'},
  {id: 4, name: '数据中台'}
])

const selectedProject = ref(1)
const selectedMonth = ref('2026-04')
const loading = ref(false)

const weekLabels = ['第1周', '第2周', '第3周', '第4周']

async function fetchWeeklyStats() {
  if (!selectedProject.value || !selectedMonth.value) return

  loading.value = true
  try {
    const res = await workRecordApi.getProjectWeeklyStats({
      projectId: selectedProject.value,
      month: selectedMonth.value
    })

    if (res.code === 200 && res.data) {
      const weekData = res.data.weeks.map((w) => w.hours)
      loading.value = false
      await nextTick()
      renderChart(weekData)
    }
  } catch (error) {
    console.error('获取项目工时趋势失败:', error)
    loading.value = false
    renderChart([0, 0, 0, 0])
  }
}

function renderChart(weekData: number[]) {
  if (!chartRef.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#d4cfc5',
      borderWidth: 1,
      textStyle: {
        color: '#5a5a5a',
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: weekLabels,
      axisLine: {
        lineStyle: {color: '#d4cfc5'}
      },
      axisLabel: {
        color: '#5a5a5a',
        fontSize: 13,
        fontWeight: 500,
        margin: 12
      },
      axisTick: {show: false}
    },
    yAxis: {
      type: 'value',
      name: '工时 (h)',
      nameTextStyle: {
        color: '#8a8a8a',
        fontSize: 12,
        padding: [0, 0, 8, 0]
      },
      axisLine: {show: false},
      axisLabel: {
        color: '#8a8a8a',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#ebe4d6',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 3,
          color: '#b85c38',
          shadowColor: 'rgba(184, 92, 56, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#b85c38',
          borderWidth: 3,
          borderColor: '#fff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              {offset: 0, color: 'rgba(184, 92, 56, 0.2)'},
              {offset: 1, color: 'rgba(184, 92, 56, 0.02)'}
            ]
          }
        },
        data: weekData
      }
    ],
    animationDuration: 1200,
    animationEasing: 'cubicOut'
  }

  chartInstance.setOption(option)
}

function handleResize() {
  chartInstance?.resize()
}

watch([selectedProject, selectedMonth], () => {
  fetchWeeklyStats()
})

onMounted(() => {
  fetchWeeklyStats()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.chart-card {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color, #d4cfc5);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-select {
  width: 140px;
}

.month-picker {
  width: 130px;
}

.chart-body {
  width: 100%;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 100%;
  height: 280px;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #8a8a8a;
  font-size: 14px;
  height: 280px;
}

.chart-loading .el-icon {
  font-size: 24px;
}
</style>