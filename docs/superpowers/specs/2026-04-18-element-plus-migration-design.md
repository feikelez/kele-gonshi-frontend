# Element Plus 迁移设计方案

## 背景

工时管理系统前端目前无 UI 框架，所有组件（表格、表单、弹窗、分页等）均为手写 CSS 实现。
为提升开发效率、便于维护，同时保持产品「纸质感」视觉调性，计划引入 Element Plus 并通过深度主题定制实现。

## 目标

- 引入 Element Plus 组件库
- 通过 CSS 变量覆盖实现「纸质感」主题
- 按依赖顺序分阶段迁移页面
- 保留现有业务逻辑不变

## 设计原则

- **一处定义，全局生效** — 所有主题变量集中管理
- **按依赖顺序迁移** — 先基础设施，再布局层，最后业务页面
- **渐进式替换** — 迁移期间系统正常运行

---

## 核心设计：纸质感主题映射

### CSS 变量映射表

| 现有变量 | 值 | Element Plus 变量 | 用途 |
|---------|-----|------------------|------|
| `--paper-color` | `#f7f4ed` | `--el-bg-color` | 主背景色 |
| `--paper-dark` | `#ebe4d6` | `--el-fill-color-light` | 深色背景 |
| `--ink-dark` | `#2c2c2c` | `--el-text-color-primary` | 主文字色 |
| `--ink-medium` | `#5a5a5a` | `--el-text-color-regular` | 常规文字 |
| `--ink-light` | `#8a8a8a` | `--el-text-color-secondary` | 次要文字 |
| `--accent-warm` | `#c4a77d` | `--el-color-primary` | 主色调/品牌色 |
| `--accent-rust` | `#b85c38` | `--el-color-danger` | 危险/强调色 |
| `--border-color` | `#d4cfc5` | `--el-border-color` | 边框色 |
| `--success-color` | `#2d6a4f` | `--el-color-success` | 成功色 |
| `--warning-color` | `#926c2e` | `--el-color-warning` | 警告色 |

### 字体

- 中文优先：`'Noto Serif SC', 'SimHei', 'Microsoft YaHei'`
- 等宽字符：`'Courier New', monospace`

---

## 迁移阶段

### Phase 1：基础设施

**目标：** 完成 Element Plus 安装、主题配置、基础组件封装

**文件变更：**

| 操作 | 文件路径 | 说明 |
|-----|---------|------|
| 修改 | `package.json` | 添加依赖 |
| 修改 | `src/main.ts` | 引入 Element Plus |
| 新增 | `src/theme/index.css` | 主题入口 |
| 新增 | `src/theme/element-variables.css` | Element Plus CSS 变量覆盖 |
| 新增 | `src/theme/custom-components.css` | 复用组件样式 |
| 新增 | `src/theme/transition.css` | 过渡动画 |
| 新增 | `src/components/base/BaseTable.vue` | 表格封装 |
| 新增 | `src/components/base/BaseDialog.vue` | 弹窗封装 |
| 新增 | `src/components/base/BasePagination.vue` | 分页封装 |
| 新增 | `src/components/base/index.ts` | 组件导出 |

**依赖安装：**
```bash
npm install element-plus @element-plus/icons-vue
```

---

### Phase 2：布局层

**目标：** 用 Element Plus 组件替换 MainLayout 框架结构

**涉及文件：**
- `src/layouts/MainLayout.vue`

**替换策略：**
- `el-menu` 替换手写侧边栏导航
- `el-dropdown` 替换用户下拉菜单
- `el-badge` 替换消息通知徽标
- `el-container` / `el-aside` / `el-header` 优化整体布局结构

---

### Phase 3：基础管理页面

**目标：** 替换用户、角色、项目管理页面

**涉及文件：**
- `src/views/user/index.vue` + `src/views/user/form.vue`
- `src/views/role/index.vue` + `src/views/role/form.vue`
- `src/views/project/index.vue` + `src/views/project/form.vue`

**替换策略：**
- `el-table` 替换手写 table
- `el-form` + `el-input`/`el-select` 替换手写表单
- `el-dialog` 替换手写弹窗
- `el-pagination` 替换手写分页
- `el-message-box` 替换确认删除弹窗
- `el-button` 替换所有按钮

---

### Phase 4：业务页面

**目标：** 替换任务、工时、审批、仪表盘等页面

**涉及文件：**
- `src/views/task/index.vue` + `src/views/task/form.vue`
- `src/views/projectMember/index.vue` + `src/views/projectMember/form.vue`
- `src/views/work-record/index.vue` + `src/views/work-record/form.vue`
- `src/views/approval/index.vue`
- `src/views/dashboard/index.vue` + dashboard 组件

---

### Phase 5：登录/注册

**目标：** 替换登录注册页面

**涉及文件：**
- `src/views/login/index.vue`
- `src/views/login/register.vue`

---

## 复用组件封装

### BaseTable

统一表格样式，包括：
- 纸质感边框
- 表头背景色
- 斑马纹
- 空状态插槽

### BaseDialog

统一弹窗样式，包括：
- 顶部 accent-warm 色条
- 圆角 2px
- 阴影

### BasePagination

统一分页样式，包括：
- 简化的按钮样式
- 与整体设计一致的色调

---

## 过渡动画

保留现有过渡效果：
- `fade` — 透明度渐变（用于文字显示/隐藏）
- `slide` — 左右滑动（用于页面切换）

新增 Element Plus 过渡：
- `el-fade-in-linear`
- `el-zoom-in-top`

---

## 验收标准

1. Element Plus 组件在所有页面可正常使用
2. 纸质感配色在所有组件上保持一致
3. 无样式冲突或覆盖遗漏
4. 所有原有功能保持不变
5. 分页、搜索、增删改查流程正常
