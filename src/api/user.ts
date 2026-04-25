import { request, type PageResult } from './request'
import type { User, UserPageParams } from './types'

export const userApi = {
  add(data: User) {
    return request.post<User>('/user', data)
  },

  delete(id: number) {
    return request.delete<void>(`/user/${id}`)
  },

  deleteBatch(ids: number[]) {
    return request.delete<void>('/user/batch', { data: ids })
  },

  update(data: User) {
    return request.put<User>('/user', data)
  },

  getById(id: number) {
    return request.get<User>(`/user/${id}`)
  },

  list() {
    return request.get<User[]>('/user/list')
  },

  getByUsername(username: string) {
    return request.get<User>(`/user/username/${username}`)
  },

  page(params: UserPageParams) {
    return request.get<PageResult<User>>('/user/page', { params })
  },

  listVO() {
    return request.get<User[]>('/user/list/vo')
  },
}
