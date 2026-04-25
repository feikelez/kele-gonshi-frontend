import { request } from './request'

export const userRoleApi = {
  assignRoles(userId: number, roleIds: number[]) {
    return request.post<void>('/userRole/assign', roleIds, { params: { userId } })
  },

  getRoleIdsByUserId(userId: number) {
    return request.get<number[]>(`/userRole/roleIds/${userId}`)
  },

  removeUserRoles(userId: number) {
    return request.delete<void>(`/userRole/user/${userId}`)
  },

  delete(id: number) {
    return request.delete<void>(`/userRole/${id}`)
  },

  deleteBatch(ids: number[]) {
    return request.delete<void>('/userRole/batch', { data: ids })
  },
}
