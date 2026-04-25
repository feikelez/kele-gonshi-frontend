# 屏幕分辨率变化时 Header 和表格显示异常修复方案

## 1. 概述

**问题**：屏幕分辨率改变时，页面 Header 和表格出现宽度显示异常，固定列与表体错位，布局错乱。

**根因**：
- 全局 `#app` 固定 1126px 宽度约束，导致整个应用无法随 viewport 缩放
- MainLayout 响应式断点逻辑不完整，侧边栏状态变化时 margin 不同步
- 页面容器多层 `max-width` 嵌套，导致 Element Plus 表格列宽计算基数错误
- `el-table` 在 resize 时不会自动重新计算列宽

**修复策略**：保守修复，精准改动已知问题点，不做大范围架构调整。

---

## 2. 改动范围

| 文件 | 改动类型 |
|------|----------|
| `src/style.css` | 修改 CSS |
| `src/layouts/MainLayout.vue` | 修改 CSS + 断点补充 |
| 页面容器（task/project/approval 等） | 删除 max-width |
| `src/theme/custom-components.css` | 修改 CSS |
| `src/components/base/BaseTable.vue` | 添加 resize 逻辑 |
| `src/hooks/useTableResize.ts` | 新增文件 |

---

## 3. 详细设计

### 3.1 `style.css` — 解除全局宽度约束

**位置**：style.css:159-169

**现状**：
```css
#app {
  width: 1126px;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  border-inline: 1px solid var(--border);
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
```

**修改为**：
```css
#app {
  width: 100%;
  max-width: 100%;
  margin: 0;
  text-align: left;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
```

**原因**：`width: 1126px` 是核心问题，它强制整个应用固定宽度，使得 viewport 缩放时布局无法自适应。

---

### 3.2 `MainLayout.vue` — 修正响应式 margin 同步

**位置**：MainLayout.vue:753-773

**现状**：
```css
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
```

**修改为**：
```css
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }
  .main-container,
  .main-container.sidebar-collapsed {
    margin-left: 0 !important;
  }
  .menu-toggle {
    display: flex;
  }
}

@media (min-width: 1025px) {
  .main-container {
    margin-left: 260px;
  }
  .main-container.sidebar-collapsed {
    margin-left: 72px;
  }
}
```

**原因**：当从 >1024px 切换到 <=1024px 时，侧边栏隐藏但 `.main-container` 的 `margin-left` 有时被遗留为 260px，导致 header 错位。`!important` 消除 CSS 优先级冲突，补充 `min-width: 1025px` 断点明确大屏下的 margin 取值。

---

### 3.3 页面容器 — 移除 max-width 约束

**涉及文件**：
- `src/views/task/index.vue` — `.task-page { max-width: 1400px }`
- `src/views/project/index.vue`
- `src/views/project/list.vue`
- `src/views/approval/index.vue`
- `src/views/user/index.vue`
- `src/views/role/index.vue`
- `src/views/projectMember/index.vue`
- `src/views/work-record/index.vue`

**统一修改**：删除 `max-width: 1400px`，保留 `width: 100%`。

**原因**：`max-width: 1400px` 导致表格外层容器以 1400px 为宽度计算基数，而非实际可用宽度，导致 Element Plus 列宽计算错误。

---

### 3.4 `custom-components.css` — 强制表格固定布局

**位置**：custom-components.css:4-8

**现状**：
```css
.base-table {
  width: 100%;
  max-height: 470px;
}
```

**修改为**：
```css
.base-table {
  width: 100%;
  max-height: 470px;
  table-layout: fixed;
}
```

**原因**：`table-layout: fixed` 使表格使用固定列宽算法，列宽由表格初始宽度决定，不受单元格内容影响，避免内容撑开导致的列宽抖动。

---

### 3.5 `hooks/useTableResize.ts` — 新增文件

```typescript
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { ElTable } from 'element-plus'

export function useTableResize() {
  const tableRef = ref<InstanceType<typeof ElTable>>()

  let resizeTimer: ReturnType<typeof setTimeout> | null = null

  function handleResize() {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
    resizeTimer = setTimeout(() => {
      nextTick(() => {
        tableRef.value?.doLayout()
      })
    }, 100)
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
  })

  return { tableRef, handleResize }
}
```

---

### 3.6 `BaseTable.vue` — 集成 resize hook

在 `BaseTable.vue` 中：
1. 给 `el-table` 添加 `ref="tableRef"`
2. 引入并使用 `useTableResize()` hook
3. 在 `onMounted` 和 `onBeforeUnmount` 中注册/注销 resize 事件监听

---

## 4. 实施顺序

1. `style.css` — 解除全局宽度约束
2. `MainLayout.vue` — 修正响应式逻辑和断点
3. 页面容器 max-width -> width: 100%（批量处理）
4. `custom-components.css` — 添加 table-layout: fixed
5. 新增 `hooks/useTableResize.ts`
6. 修改 `BaseTable.vue` — 集成 resize hook

---

## 5. 测试要点

- [ ] 窗口从 1920px 缩放到 1366px，Header 宽度是否正确跟随
- [ ] 窗口从 1366px 缩放到 768px，侧边栏隐藏，Header 是否正常
- [ ] 侧边栏折叠/展开，Header margin 是否同步变化
- [ ] 表格列中含长文本时，列宽是否稳定
- [ ] 操作列固定（fixed="right"）是否与表体对齐
- [ ] 窗口最大化/还原，表格列宽是否重算正确
