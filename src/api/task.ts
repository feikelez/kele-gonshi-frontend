import { request, type PageResult } from './request'
import type { Task, TaskPageParams } from './types'

export const taskApi = {
  add(data: Task) {
    return request.post<Task>('/task', data)
  },

  delete(id: number) {
    return request.delete<void>(`/task/${id}`)
  },

  deleteBatch(ids: number[]) {
    return request.delete<void>('/task/batch', { data: ids })
  },

  update(data: Task) {
    return request.put<Task>('/task', data)
  },

  getById(id: number) {
    return request.get<Task>(`/task/${id}`)
  },

  list() {
    return request.get<Task[]>('/task/list')
  },

  getByProjectId(projectId: number) {
    return request.get<Task[]>(`/task/project/${projectId}`)
  },

  getByAssigneeId(assigneeId: number) {
    return request.get<Task[]>(`/task/assignee/${assigneeId}`)
  },

  page(params: TaskPageParams) {
    return request.get<PageResult<Task>>('/task/page', { params })
  },

  getMyTasksPage(current: number = 1, size: number = 10, taskName?: string, projectId?: number, status?: number) {
    return request.get<PageResult<Task>>('/task/my/page', {
      params: { current, size, taskName, projectId, status }
    })
  },

  getMyTasks() {
    return request.get<Task[]>('/task/my/page', { params: { current: 1, size: 100 } })
  },
}
