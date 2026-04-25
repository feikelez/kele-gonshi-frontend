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
      <div ref="chartRef" class="chart-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, onBeforeUnmount, nextTick} from 'vue'
import * as echarts from 'echarts'

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

// 模拟数据 - 按项目 + 年月，四周工时
const mockData: Record<number, Record<string, number[]>> = {
  1: {
    '2026-04': [42, 38, 45, 36],
    '2026-03': [40, 35, 42, 38]
  },
  2: {
    '2026-04': [28, 32, 26, 30],
    '2026-03': [26, 28, 30, 24]
  },
  3: {
    '2026-04': [18, 22, 16, 20],
    '2026-03': [15, 18, 14, 16]
  },
  4: {
    '2026-04': [12, 14, 10, 8],
    '2026-03': [10, 12, 8, 6]
  }
}

const weekLabels = ['第1周', '第2周', '第3周', '第4周']

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
  const projectData = mockData[selectedProject.value] || mockData[1]
  const weekData = projectData[selectedMonth.value] || projectData['2026-04']
  renderChart(weekData)
})

onMounted(() => {
  const projectData = mockData[selectedProject.value] || mockData[1]
  const weekData = projectData[selectedMonth.value] || projectData['2026-04']
  renderChart(weekData)
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
}

.chart-container {
  width: 100%;
  height: 280px;
}
</style>