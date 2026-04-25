import { request, type PageResult } from './request'
import type { ProjectMember, ProjectMemberPageParams } from './types'

export const projectMemberApi = {
  add(data: ProjectMember) {
    return request.post<ProjectMember>('/project-member', data)
  },

  delete(id: number) {
    return request.delete<void>(`/project-member/${id}`)
  },

  deleteBatch(ids: number[]) {
    return request.delete<void>('/project-member/batch', { data: ids })
  },

  update(data: ProjectMember) {
    return request.put<ProjectMember>('/project-member', data)
  },

  getById(id: number) {
    return request.get<ProjectMember>(`/project-member/${id}`)
  },

  list() {
    return request.get<ProjectMember[]>('/project-member/list')
  },

  getByProjectId(projectId: number) {
    return request.get<ProjectMember[]>(`/project-member/project/${projectId}`)
  },

  getByUserId(userId: number) {
    return request.get<ProjectMember[]>(`/project-member/user/${userId}`)
  },

  page(params: ProjectMemberPageParams) {
    return request.get<PageResult<ProjectMember>>('/project-member/page', { params })
  },

  assign(projectId: number, userIds: number[]) {
    return request.post<void>('/project-member/assign', { projectId, userIds })
  },
}
