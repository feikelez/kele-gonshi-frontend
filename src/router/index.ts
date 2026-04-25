import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/login/register.vue'),
    meta: { requiresAuth: false, title: '注册' }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '工作台', icon: 'dashboard', roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'project',
        name: 'Project',
        component: () => import('@/views/project/index.vue'),
        meta: { title: '项目管理', icon: 'project', roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'task',
        name: 'Task',
        component: () => import('@/views/task/index.vue'),
        meta: { title: '任务管理', icon: 'task', roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'project-list',
        name: 'ProjectList',
        component: () => import('@/views/project/list.vue'),
        meta: { title: '项目列表', icon: 'project-list', roles: ['EMPLOYEE'] }
      },
      {
        path: 'task-list',
        name: 'TaskList',
        component: () => import('@/views/task/list.vue'),
        meta: { title: '任务列表', icon: 'task-list', roles: ['EMPLOYEE'] }
      },
      {
        path: 'work-record',
        name: 'WorkRecord',
        component: () => import('@/views/work-record/index.vue'),
        meta: { title: '工时填报', icon: 'work', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] }
      },
      {
        path: 'approval',
        name: 'Approval',
        component: () => import('@/views/approval/index.vue'),
        meta: { title: '审批管理', icon: 'approval', roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理', icon: 'user', roles: ['ADMIN'] }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/role/index.vue'),
        meta: { title: '角色管理', icon: 'role', roles: ['ADMIN'] }
      },
      {
        path: 'project-member',
        name: 'ProjectMember',
        component: () => import('@/views/projectMember/index.vue'),
        meta: { title: '项目成员管理', icon: 'member', roles: ['ADMIN'] }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人中心', icon: 'profile', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, _from, next) => {
  document.title = `${to.meta.title || '工时管理'} - 工时管理系统`

  const userStore = useUserStore()
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth !== false && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // 如果有 token 但没有用户信息，先获取用户信息
  if (token && !userStore.userInfo) {
    await userStore.fetchUserInfo()
  }

  const roles = to.meta.roles as string[] | undefined
  // 只有当用户有角色信息且页面有角色限制时才检查
  if (roles && roles.length > 0 && userStore.roles && userStore.roles.length > 0) {
    const hasRole = roles.some((role: string) => userStore.roles.includes(role))
    if (!hasRole) {
      // 如果用户没有权限访问该页面，尝试跳转到 Dashboard
      // 但要避免重定向到需要权限的页面形成循环
      if (to.name !== 'Dashboard') {
        next({ name: 'Dashboard' })
        return
      }
    }
  }

  if ((to.name === 'Login' || to.name === 'Register') && token) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router
