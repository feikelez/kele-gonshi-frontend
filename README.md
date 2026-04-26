# 工时管理系统前端

基于 Vue 3 + TypeScript + Vite + Element Plus 构建的工时管理系统前端项目，核心设计风格为「松弛治愈、温和无压」，采用低饱和奶咖褐主色调。

## 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 | Composition API + `<script setup>` |
| TypeScript | vue-tsc 类型检查 |
| Vite | 开发构建工具 |
| Element Plus 2.x | UI 组件库 |
| Pinia | 状态管理 |
| Vue Router 4 | 路由管理 |
| Axios | HTTP 请求 |
| ECharts | 图表可视化 |
| @vueuse/core | Composition 工具库 |

## 项目结构

```
gongshi-frontend/
├── src/
│   ├── api/             # API 模块（按业务/实体拆分）
│   ├── components/      # 公共组件
│   │   ├── base/        # BaseTable, BaseDialog, BasePagination
│   │   └── dashboard/   # Dashboard 专属组件
│   ├── layouts/         # 布局组件 (MainLayout)
│   ├── router/          # 路由配置（带权限守卫和角色过滤）
│   ├── stores/          # Pinia store
│   ├── styles/          # 全局样式
│   ├── theme/           # Element Plus 主题定制
│   ├── views/           # 页面组件（按模块分组）
│   └── hooks/           # Composition 逻辑复用
├── index.html
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 开发启动

```bash
pnpm dev
```

访问 http://localhost:5173

### 生产构建

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 主要功能模块

- **工时记录**：提交、查看、管理个人工时
- **任务管理**：查看待办任务、任务进度追踪
- **项目概览**：参与项目列表、项目进度
- **数据统计**：本周工时柱状图、项目工时趋势图、项目工时排行
- **用户管理**：角色权限管理（管理员/经理/员工）

## 接口说明

API 代理配置：开发环境下 `/api` 请求代理到 `http://127.0.0.1:3102`。

所有请求自动携带 `Bearer` token，响应格式为 `{ code, message, data }`。

## 角色权限

| 角色 | 代码 | 说明 |
|------|------|------|
| 管理员 | ADMIN | 系统管理权限 |
| 经理 | MANAGER | 项目管理、数据查看权限 |
| 员工 | EMPLOYEE | 基础工时记录权限 |

## 提交规范

```
feat:     新功能
fix:      修复 bug
refactor: 重构
docs:     文档变更
style:    代码格式（不影响功能）
chore:    构建/工具变更
```
