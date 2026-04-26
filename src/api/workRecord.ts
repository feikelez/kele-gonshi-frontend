import { request, type PageResult } from './request'
import type { WorkRecord, WorkRecordPageParams } from './types'

export interface ProjectWeeklyStats {
  projectId: number
  projectName: string
  month: string
  weeks: Array<{ week: number; hours: number }>
}

export interface ProjectTopStats {
  projectId: number
  projectName: string
  totalHours: number
  trend: number
}

export interface TopProjectsStats {
  month: string
  projects: ProjectTopStats[]
}

export const workRecordApi = {
  add(data: WorkRecord) {
    return request.post<WorkRecord>('/work-record', data)
  },

  delete(id: number) {
    return request.delete<void>(`/work-record/${id}`)
  },

  deleteBatch(ids: number[]) {
    return request.delete<void>('/work-record/batch', { data: ids })
  },

  update(data: WorkRecord) {
    return request.put<WorkRecord>('/work-record', data)
  },

  getById(id: number) {
    return request.get<WorkRecord>(`/work-record/${id}`)
  },

  list() {
    return request.get<WorkRecord[]>('/work-record/list')
  },

  getByUserId(userId: number) {
    return request.get<WorkRecord[]>(`/work-record/user/${userId}`)
  },

  getByProjectId(projectId: number) {
    return request.get<WorkRecord[]>(`/work-record/project/${projectId}`)
  },

  getByTaskId(taskId: number) {
    return request.get<WorkRecord[]>(`/work-record/task/${taskId}`)
  },

  getByStatus(status: number) {
    return request.get<WorkRecord[]>(`/work-record/status/${status}`)
  },

  page(params: WorkRecordPageParams) {
    return request.get<PageResult<WorkRecord>>('/work-record/page', { params })
  },

  myPage(params: Omit<WorkRecordPageParams, 'userId'>) {
    return request.get<PageResult<WorkRecord>>('/work-record/my/page', { params })
  },

  getProjectWeeklyStats(params: { projectId: number; month: string }) {
    return request.get<ProjectWeeklyStats>('/work-record/stats/project-weekly', { params })
  },

  getTopProjects(params: { month: string; limit?: number }) {
    return request.get<TopProjectsStats>('/work-record/stats/top-projects', { params })
  },

  export(params: { userId?: number; projectId?: number; startDate?: string; endDate?: string }) {
    return request.get('/work-record/export', { params, responseType: 'blob' })
  },

  getWorkHoursStats(params: { userId: number; startDate: string; endDate: string }) {
    return request.get<Array<{ label: string; hours: number }>>('/work-record/user/stats', { params })
  },
}
