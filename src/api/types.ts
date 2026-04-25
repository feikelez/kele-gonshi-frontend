export interface User {
  id: number
  username: string
  password?: string
  realName: string
  email: string
  phone: string
  status: number
  createTime: string
  updateTime: string
  delFlag: number
}

export interface Project {
  id: number
  projectCode: string
  projectName: string
  description: string
  startDate: string
  endDate: string
  status: number
  managerId: number
  createTime: string
  updateTime: string
  delFlag: number
}

export interface Task {
  id: number
  projectId: number
  taskName: string
  description: string
  assigneeId: number
  status: number
  planHours: number
  createTime: string
  updateTime: string
  delFlag: number
}

export interface WorkRecord {
  id: number
  userId: number
  projectId: number
  taskId: number
  workDate: string
  workType: number
  hours: number
  workContent: string
  status: number
  submitTime: string
  approvalTime: string
  approverId: number
  approvalComment: string
  createTime: string
  updateTime: string
  delFlag: number
}

export interface ProjectMember {
  id: number
  projectId: number
  userId: number
  joinDate: string
  createTime: string
}

export interface SysRole {
  id: number
  roleCode: string
  roleName: string
  description: string
  createTime: string
}

export interface SysConfig {
  id: number
  configKey: string
  configValue: string
  description: string
  createTime: string
  updateTime: string
}

export interface ApprovalConfig {
  id: number
  userId: number
  approverId: number
  createTime: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userId: number
  username: string
  realName: string
  roles: string[]
}

export interface RegisterRequest {
  username: string
  password: string
  confirmPassword: string
  realName: string
  email: string
  phone: string
}

export interface UserInfoResponse {
  id: number
  username: string
  realName: string
  email: string
  phone: string
  status: number
  roles: string[]
  createTime: string
}

export interface PasswordChangeRequest {
  oldPassword: string
  newPassword: string
}

export interface UserPageParams {
  current?: number
  size?: number
  username?: string
  status?: number
}

export interface ProjectPageParams {
  current?: number
  size?: number
  projectName?: string
  status?: number
  managerId?: number
}

export interface TaskPageParams {
  current?: number
  size?: number
  taskName?: string
  projectId?: number
  assigneeId?: number
  status?: number
}

export interface WorkRecordPageParams {
  current?: number
  size?: number
  userId?: number
  projectId?: number
  taskId?: number
  status?: number
  workType?: number
}

export interface ProjectMemberPageParams {
  current?: number
  size?: number
  projectId?: number
  userId?: number
}

export interface ApprovalConfigPageParams {
  current?: number
  size?: number
  userId?: number
  approverId?: number
}

export interface SysConfigPageParams {
  current?: number
  size?: number
  configKey?: string
}

export interface RolePageParams {
  current?: number
  size?: number
  roleName?: string
}
