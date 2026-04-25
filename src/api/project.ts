import { request, type PageResult } from './request'
import type { Project, ProjectPageParams } from './types'

export const projectApi = {
  add(data: Project) {
    return request.post<Project>('/project', data)
  },

  delete(id: number) {
    return request.delete<void>(`/project/${id}`)
  },

  deleteBatch(ids: number[]) {
    return request.delete<void>('/project/batch', { data: ids })
  },

  update(data: Project) {
    return request.put<Project>('/project', data)
  },

  getById(id: number) {
    return request.get<Project>(`/project/${id}`)
  },

  list() {
    return request.get<Project[]>('/project/list')
  },

  getByProjectCode(projectCode: string) {
    return request.get<Project>(`/project/code/${projectCode}`)
  },

  getByManagerId(managerId: number) {
    return request.get<Project[]>(`/project/manager/${managerId}`)
  },

  getByManagerIdPage(managerId: number, current: number = 1, size: number = 10, projectName?: string, status?: number) {
    return request.get<PageResult<Project>>(`/project/manager/${managerId}/page`, {
      params: { current, size, projectName, status }
    })
  },

  page(params: ProjectPageParams) {
    return request.get<PageResult<Project>>('/project/page', { params })
  },

  getMyProjectsPage(current: number = 1, size: number = 10) {
    return request.get<PageResult<Project>>('/project/my/page', { params: { current, size } })
  },

  getMyProjects() {
    return request.get<Project[]>('/project/my/page', { params: { current: 1, size: 100 } })
  },
}
