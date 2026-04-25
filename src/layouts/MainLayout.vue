<template>
  <div class="main-layout">
    <div class="paper-texture"></div>

    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-stamp">
            <span>工时</span>
          </div>
          <transition name="fade">
            <span v-if="!sidebarCollapsed" class="logo-text">记录</span>
          </transition>
        </div>
        <button class="collapse-btn" @click="toggleSidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="sidebarCollapsed" d="M9 18l6-6-6-6" />
            <path v-else d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <!-- 工作台菜单 -->
        <div v-if="visibleMainMenus.length > 0" class="nav-section">
          <div v-if="!sidebarCollapsed" class="nav-section-title">工作台</div>
          <router-link
            v-for="item in visibleMainMenus"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActive(item.path) }"
          >
            <div class="nav-icon" v-html="item.icon"></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">{{ item.title }}</span>
            </transition>
          </router-link>
        </div>

        <!-- 系统管理菜单 -->
        <div v-if="visibleAdminMenus.length > 0" class="nav-section">
          <div v-if="!sidebarCollapsed" class="nav-section-title">系统管理</div>
          <router-link
            v-for="item in visibleAdminMenus"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActive(item.path) }"
          >
            <div class="nav-icon" v-html="item.icon"></div>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="nav-text">{{ item.title }}</span>
            </transition>
          </router-link>
        </div>
      </nav>

      <!-- 侧边栏底部用户卡片 -->
      <div class="sidebar-footer">
        <div class="user-card" :class="{ compact: sidebarCollapsed }">
          <div class="user-avatar">
            <span>{{ userStore.realName?.charAt(0) || 'U' }}</span>
          </div>
          <transition name="fade">
            <div v-if="!sidebarCollapsed" class="user-info">
              <div class="user-name">{{ userStore.realName }}</div>
              <div class="user-role">{{ roleText }}</div>
            </div>
          </transition>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="main-container" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- 头部 -->
      <header class="main-header">
        <div class="header-left">
          <button class="menu-toggle" @click="toggleSidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div class="breadcrumb">
            <span class="breadcrumb-item">{{ currentTitle }}</span>
          </div>
        </div>

        <div class="header-right">
          <div class="header-actions">
            <!-- 消息通知 -->
            <el-badge :value="3" :max="99" class="notification-badge">
              <button class="action-btn" title="消息通知">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
            </el-badge>

            <!-- 用户下拉菜单 -->
            <el-dropdown trigger="click" @command="handleCommand">
              <button class="user-btn">
                <div class="avatar">
                  <span>{{ userStore.realName?.charAt(0) || 'U' }}</span>
                </div>
                <span class="username">{{ userStore.realName }}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron-icon">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <template #dropdown>
                <el-dropdown-menu class="user-dropdown-menu">
                  <el-dropdown-item command="profile" divided>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16,17 21,12 16,7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </header>

      <!-- 主内容 -->
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- 底部 Footer -->
      <footer class="main-footer">
        <span>© 2026 工时管理系统 · 作者：kelez</span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const sidebarCollapsed = ref(false)

const mainMenuItems = [
  {
    path: '/dashboard',
    title: '工作台',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
  },
  {
    path: '/project',
    title: '项目管理',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    roles: ['ADMIN', 'MANAGER']
  },
  {
    path: '/project-member',
    title: '项目成员管理',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    roles: ['ADMIN']
  },
  {
    path: '/project-list',
    title: '项目列表',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v4H3zM3 10h18v4H3zM3 16h12v4H3z"/></svg>',
    roles: ['EMPLOYEE']
  },
  {
    path: '/task',
    title: '任务管理',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    roles: ['ADMIN', 'MANAGER']
  },
  {
    path: '/task-list',
    title: '任务列表',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    roles: ['EMPLOYEE']
  },
  {
    path: '/work-record',
    title: '工时填报',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
  },
]

const adminMenuItems = [
  {
    path: '/user',
    title: '用户管理',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    roles: ['ADMIN']
  },
  {
    path: '/role',
    title: '角色管理',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    roles: ['ADMIN']
  }
]

const visibleMainMenus = computed(() =>
  mainMenuItems.filter(item => hasMenuPermission(item.roles))
)

const visibleAdminMenus = computed(() =>
  adminMenuItems.filter(item => hasMenuPermission(item.roles))
)

function hasMenuPermission(roles: string[] | undefined) {
  if (!roles || roles.length === 0) return true
  return roles.some(role => userStore.hasRole(role))
}

const roleText = computed(() => {
  if (userStore.hasRole('ADMIN')) return '管理员'
  if (userStore.hasRole('MANAGER')) return '项目经理'
  return '普通用户'
})

const currentTitle = computed(() => {
  const item = [...mainMenuItems, ...adminMenuItems].find(i => i.path === route.path)
  return item?.title || '工时管理系统'
})

function isActive(path: string) {
  return route.path === path
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

async function handleCommand(command: string) {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm(
        '确定要退出登录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await userStore.logout()
      router.push('/login')
    } catch {
      // 用户取消
    }
  } else if (command === 'profile') {
    router.push('/profile')
  }
}

onMounted(async () => {
  if (userStore.token && !userStore.userInfo) {
    await userStore.fetchUserInfo()
  }
})
</script>

<style scoped>
.main-layout {
  --paper-color: #f7f4ed;
  --paper-dark: #ebe4d6;
  --ink-dark: #2c2c2c;
  --ink-medium: #5a5a5a;
  --ink-light: #8a8a8a;
  --accent-warm: #c4a77d;
  --accent-rust: #b85c38;
  --border-color: #d4cfc5;

  display: flex;
  min-height: 100vh;
  background-color: var(--paper-color);
  font-family: 'SimHei', 'Microsoft YaHei', 'PingFang SC', 'Heiti SC', sans-serif;
  position: relative;
}

.paper-texture {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(0deg,
      transparent,
      transparent 1px,
      rgba(0, 0, 0, 0.015) 1px,
      rgba(0, 0, 0, 0.015) 2px);
  opacity: 0.5;
  z-index: 0;
}

/* ===== 侧边栏 ===== */
.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-warm);
}

.sidebar.collapsed {
  width: 72px;
}

.sidebar-header {
  height: 72px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
}

.logo-stamp {
  width: 40px;
  height: 40px;
  border: 2px solid var(--ink-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transform: rotate(-3deg);
  background: white;
  box-shadow: 1px 1px 0 var(--accent-rust);
}

.logo-stamp span {
  font-size: 12px;
  font-weight: bold;
  color: var(--ink-dark);
  letter-spacing: 1px;
}

.logo-text {
  font-size: 18px;
  font-weight: normal;
  color: var(--ink-dark);
  white-space: nowrap;
  font-style: italic;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-medium);
  transition: all 0.2s ease;
  flex-shrink: 0;
  background: transparent;
  border: none;
  cursor: pointer;
}

.collapse-btn:hover {
  background: var(--paper-color);
  color: var(--ink-dark);
}

.collapse-btn svg {
  width: 18px;
  height: 18px;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-light);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 12px;
  margin-bottom: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: var(--ink-medium);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  border-left: 3px solid transparent;
  background: transparent;
  text-decoration: none;
}

.nav-item:hover {
  background: var(--paper-color);
  color: var(--ink-dark);
  border-left-color: var(--accent-warm);
}

.nav-item.active {
  background: var(--paper-color);
  color: var(--ink-dark);
  border-left-color: var(--accent-rust);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.nav-text {
  white-space: nowrap;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--paper-color);
  border-left: 3px solid var(--accent-warm);
}

.user-card.compact {
  padding: 8px;
  justify-content: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--ink-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.user-info {
  overflow: hidden;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-dark);
  white-space: nowrap;
}

.user-role {
  font-size: 12px;
  color: var(--ink-light);
  font-style: italic;
}

/* ===== 主内容区 ===== */
.main-container {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
}

.main-container.sidebar-collapsed {
  margin-left: 72px;
}

.main-header {
  height: 72px;
  background: white;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

.main-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-warm);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  width: 40px;
  height: 40px;
  display: none;
  align-items: center;
  justify-content: center;
  color: var(--ink-medium);
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
}

.menu-toggle:hover {
  background: var(--paper-color);
  color: var(--ink-dark);
}

.menu-toggle svg {
  width: 22px;
  height: 22px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-item {
  font-size: 18px;
  font-weight: normal;
  color: var(--ink-dark);
}

.header-right {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-medium);
  position: relative;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
}

.action-btn:hover {
  background: var(--paper-color);
  color: var(--ink-dark);
}

.action-btn svg {
  width: 22px;
  height: 22px;
}

.notification-badge :deep(.el-badge__content) {
  background: var(--accent-rust);
  border: none;
}

/* ===== 用户下拉菜单 ===== */
.user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
}

.user-btn:hover {
  background: var(--paper-color);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--ink-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-dark);
}

.chevron-icon {
  width: 16px;
  height: 16px;
  color: var(--ink-light);
}

.user-dropdown-menu {
  min-width: 180px;
}

.user-dropdown-menu :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--ink-medium);
}

.user-dropdown-menu :deep(.el-dropdown-menu__item:hover) {
  background: var(--paper-color);
  color: var(--ink-dark);
}

.user-dropdown-menu :deep(.el-dropdown-menu__item--divided) {
  margin-top: 0;
  border-top: 1px solid var(--border-color);
}

.user-dropdown-menu :deep(.el-dropdown-menu__item svg) {
  width: 18px;
  height: 18px;
}

/* ===== 主内容 ===== */
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* ===== 底部 Footer ===== */
.main-footer {
  height: 48px;
  background: white;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--ink-light);
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .main-container {
    margin-left: 0;
  }

  .sidebar-collapsed {
    margin-left: 0;
  }

  .menu-toggle {
    display: flex;
  }
}

/* ===== 过渡动画 ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
