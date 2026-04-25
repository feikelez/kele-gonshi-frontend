import { request, type PageResult } from './request'
import type { ApprovalConfig, ApprovalConfigPageParams } from './types'

export const approvalConfigApi = {
  add(data: ApprovalConfig) {
    return request.post<ApprovalConfig>('/approval-config', data)
  },

  delete(id: number) {
    return request.delete<void>(`/approval-config/${id}`)
  },

  deleteBatch(ids: number[]) {
    return request.delete<void>('/approval-config/batch', { data: ids })
  },

  update(data: ApprovalConfig) {
    return request.put<ApprovalConfig>('/approval-config', data)
  },

  getById(id: number) {
    return request.get<ApprovalConfig>(`/approval-config/${id}`)
  },

  list() {
    return request.get<ApprovalConfig[]>('/approval-config/list')
  },

  getByUserId(userId: number) {
    return request.get<ApprovalConfig[]>(`/approval-config/user/${userId}`)
  },

  getByApproverId(approverId: number) {
    return request.get<ApprovalConfig[]>(`/approval-config/approver/${approverId}`)
  },

  page(params: ApprovalConfigPageParams) {
    return request.get<PageResult<ApprovalConfig>>('/approval-config/page', { params })
  },
}
