import { request, type PageResult } from './request'
import type { SysConfig, SysConfigPageParams } from './types'

export const sysConfigApi = {
  add(data: SysConfig) {
    return request.post<SysConfig>('/sys-config', data)
  },

  delete(id: number) {
    return request.delete<void>(`/sys-config/${id}`)
  },

  deleteBatch(ids: number[]) {
    return request.delete<void>('/sys-config/batch', { data: ids })
  },

  update(data: SysConfig) {
    return request.put<SysConfig>('/sys-config', data)
  },

  getById(id: number) {
    return request.get<SysConfig>(`/sys-config/${id}`)
  },

  list() {
    return request.get<SysConfig[]>('/sys-config/list')
  },

  getByConfigKey(configKey: string) {
    return request.get<SysConfig>(`/sys-config/key/${configKey}`)
  },

  page(params: SysConfigPageParams) {
    return request.get<PageResult<SysConfig>>('/sys-config/page', { params })
  },
}
