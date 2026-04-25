<template>
  <div class="dashboard">
    <WelcomeSection/>

    <StatsGrid :stats="stats"/>

    <!-- 新增图表区域 -->
    <div class="charts-section">
      <div class="charts-row">
        <ProjectWorkHoursChart class="chart-item"/>
        <TopProjectsChart class="chart-item"/>
      </div>
    </div>

    <div class="content-grid">
      <TaskList :tasks="recentTasks"/>

      <WorkHoursChart
          :week-days="weekDays"
          @prev-week="prevWeek"
          @next-week="nextWeek"
      />

      <ProjectList :projects="myProjects"/>

      <QuickActions/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {projectApi, taskApi} from '@/api'
import WelcomeSection from '@/components/dashboard/WelcomeSection.vue'
import StatsGrid from '@/components/dashboard/StatsGrid.vue'
import TaskList from '@/components/dashboard/TaskList.vue'
import WorkHoursChart from '@/components/dashboard/WorkHoursChart.vue'
import ProjectList from '@/components/dashboard/ProjectList.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import ProjectWorkHoursChart from '@/components/dashboard/ProjectWorkHoursChart.vue'
import TopProjectsChart from '@/components/dashboard/TopProjectsChart.vue'

const stats = computed(() => [
  {
    title: '本周工时',
    value: '42.5',
    unit: '小时',
    trend: 12,
    color: '#b85c38',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>'
  },
  {
    title: '可做任务',
    value: String(recentTasks.value.length),
    unit: '项',
    trend: -5,
    color: '#2d6a4f',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
  },
  {
    title: '参与项目',
    value: String(myProjects.value.length),
    unit: '个',
    trend: 0,
    color: '#c4a77d',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>'
  },
  {
    title: '待审批',
    value: '3',
    unit: '条',
    trend: 8,
    color: '#926c2e',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
  }
])

const recentTasks = ref<Array<{
  id: number
  name: string
  project: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}>>([])

const weekDays = ref([
  {label: '周一', hours: 8.5},
  {label: '周二', hours: 7.5},
  {label: '周三', hours: 9},
  {label: '周四', hours: 8},
  {label: '周五', hours: 6.5},
  {label: '周六', hours: 3},
  {label: '周日', hours: 0}
])

// 项目颜色映射
const projectColors = ['#E76F51', '#2A9D8F', '#E9C46A', '#264653', '#F4A261', '#457B9D']

const myProjects = ref<Array<{
  id: number
  name: string
  progress: number
  color: string
  members: string[]
}>>([])

async function fetchMyProjects() {
  try {
    const res = await projectApi.getMyProjectsPage(1, 10)
    if (res.code === 200 && res.data?.records) {
      myProjects.value = res.data.records.map((project, index) => {
        // 根据项目状态计算进度
        const progressMap: Record<number, number> = {
          0: 0,   // 未开始
          1: 50, // 进行中
          2: 100, // 已完成
          3: 30  // 已暂停
        }
        return {
          id: project.id,
          name: project.projectName,
          progress: progressMap[project.status] || 0,
          color: projectColors[index % projectColors.length],
          members: []
        }
      })
    }
  } catch (error) {
    console.error('获取我的项目失败:', error)
    myProjects.value = []
  }
}

async function fetchMyTasks() {
  try {
    const res = await taskApi.getMyTasksPage(1, 10)
    if (res.code === 200 && res.data?.records) {
      recentTasks.value = res.data.records.map(task => {
        // 根据任务状态判断是否完成 (0=未开始, 1=进行中, 2=已完成)
        const completed = task.status === 2
        // 暂时用 medium 作为默认优先级，后端暂无优先级字段
        const priority: 'high' | 'medium' | 'low' = 'medium'
        return {
          id: task.id,
          name: task.taskName,
          project: `项目${task.projectId}`,
          dueDate: task.endDate ? task.endDate.split(' ')[0] : '未设置',
          description: task.description,
          priority,
          completed
        }
      })
    }
  } catch (error) {
    console.error('获取我的任务失败:', error)
    recentTasks.value = []
  }
}

function prevWeek() {
  // Week navigation logic would go here
  console.log('Previous week')
}

function nextWeek() {
  // Week navigation logic would go here
  console.log('Next week')
}

onMounted(() => {
  fetchMyProjects()
  fetchMyTasks()
})
</script>

<style scoped>
.dashboard {
  --paper-color: #f7f4ed;
  --ink-dark: #2c2c2c;
  --ink-medium: #5a5a5a;
  --ink-light: #8a8a8a;
  --accent-warm: #c4a77d;
  --accent-rust: #b85c38;
  --border-color: #d4cfc5;

  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4px;
  position: relative;
  z-index: 1;
  font-family: 'SimHei', 'Microsoft YaHei', 'PingFang SC', 'Heiti SC', sans-serif;
}

.charts-section {
  margin: 24px 0;
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.chart-item {
  min-height: 360px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .charts-row,
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: 0;
  }

  .content-grid {
    gap: 16px;
  }
}
</style>
