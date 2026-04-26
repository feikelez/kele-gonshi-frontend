<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">项目工时排行</h3>
      <div class="chart-controls">
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

const selectedMonth = ref('2026-04')
const loading = ref(false)

const projectColors = ['#b85c38', '#c4a77d', '#2d6a4f', '#926c2e', '#5a5a5a']

async function fetchTopProjects() {
  loading.value = true
  try {
    const res = await workRecordApi.getTopProjects({
      month: selectedMonth.value,
      limit: 5
    })

    if (res.code === 200 && res.data && res.data.projects) {
      loading.value = false
      await nextTick()
      renderChart(res.data.projects)
    } else {
      renderChart([])
    }
  } catch (error) {
    console.error('获取项目工时排行失败:', error)
    renderChart([])
  } finally {
    loading.value = false
  }
}

function renderChart(projects: Array<{ projectId: number; projectName: string; totalHours: number; trend: number }>) {

  if (!chartRef.value) {
    return
  }

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: '#fff',
      borderColor: '#d4cfc5',
      borderWidth: 1,
      textStyle: {
        color: '#5a5a5a',
        fontSize: 12
      },
      formatter: (params: any) => {
        const item = params[0]
        const project = projects[item.dataIndex]
        return `
          <div style="padding: 8px 12px;">
            <div style="font-weight: 600; color: #2c2c2c; margin-bottom: 6px;">${item.name}</div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${item.color};"></span>
              <span>累计工时: <strong style="color: #b85c38; font-size: 14px;">${item.value}h</strong></span>
            </div>
            ${project && project.trend !== 0 ? `
              <div style="margin-top: 4px; color: ${project.trend > 0 ? '#2d6a4f' : '#b85c38'}; font-size: 12px;">
                环比 ${project.trend > 0 ? '+' : ''}${project.trend}%
              </div>
            ` : ''}
          </div>
        `
      }
    },
    grid: {
      left: '3%',
      right: '12%',
      bottom: '8%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '',
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
    yAxis: {
      type: 'category',
      data: projects.map(p => p.projectName),
      inverse: true,
      axisLine: {show: false},
      axisTick: {show: false},
      axisLabel: {
        color: '#5a5a5a',
        fontSize: 13,
        fontWeight: 500,
        margin: 12
      }
    },
    series: [
      {
        type: 'bar',
        data: projects.map((p, i) => ({
          value: p.totalHours,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                {offset: 0, color: projectColors[i % projectColors.length]},
                {offset: 1, color: projectColors[i % projectColors.length] + 'aa'}
              ]
            },
            borderRadius: [0, 6, 6, 0]
          },
          emphasis: {
            itemStyle: {
              color: projectColors[i % projectColors.length]
            }
          }
        })),
        barMaxWidth: 32,
        barMinHeight: 20,
        label: {
          show: true,
          position: 'right',
          formatter: '{c}h',
          color: '#8a8a8a',
          fontSize: 12,
          offset: [0, -4]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 8,
            shadowColor: 'rgba(184, 92, 56, 0.2)'
          }
        }
      }
    ],
    animationDuration: 1000,
    animationEasing: 'cubicOut',
    animationDelay: (idx: number) => idx * 100
  }

  chartInstance.setOption(option)
}

function handleResize() {
  chartInstance?.resize()
}

watch(selectedMonth, () => {
  fetchTopProjects()
})

onMounted(() => {
  fetchTopProjects()
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
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0;
}

.month-picker {
  width: 140px;
}

.chart-body {
  width: 100%;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 100%;
  height: 260px;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #8a8a8a;
  font-size: 14px;
  height: 260px;
}

.chart-loading .el-icon {
  font-size: 24px;
}
</style>