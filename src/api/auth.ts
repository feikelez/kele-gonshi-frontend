import { request } from './request'
import type { LoginRequest, LoginResponse, RegisterRequest, UserInfoResponse, PasswordChangeRequest } from './types'

export const authApi = {
  login(data: LoginRequest) {
    return request.post<LoginResponse>('/auth/login', data)
  },

  register(data: RegisterRequest) {
    return request.post<void>('/auth/register', data)
  },

  logout() {
    return request.post<void>('/auth/logout')
  },

  getUserInfo() {
    return request.get<UserInfoResponse>('/auth/userinfo')
  },

  changePassword(data: PasswordChangeRequest) {
    return request.put<void>('/auth/password', data)
  },

  getRoles() {
    return request.get<string[]>('/auth/roles')
  },

  hasRole(roleCode: string) {
    return request.get<boolean>(`/auth/hasRole/${roleCode}`)
  },
}
