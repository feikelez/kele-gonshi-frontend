import { request, type PageResult } from './request'
import type { SysRole, RolePageParams } from './types'

export const roleApi = {
  add(data: SysRole) {
    return request.post<void>('/role', data)
  },

  update(data: SysRole) {
    return request.put<void>('/role', data)
  },

  delete(id: number) {
    return request.delete<void>(`/role/${id}`)
  },

  deleteBatch(ids: number[]) {
    return request.delete<void>('/role/batch', { data: ids })
  },

  getById(id: number) {
    return request.get<SysRole>(`/role/${id}`)
  },

  list() {
    return request.get<SysRole[]>('/role/list')
  },

  page(params: RolePageParams) {
    return request.get<PageResult<SysRole>>('/role/page', { params })
  },
}
