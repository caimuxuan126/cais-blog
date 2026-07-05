# AI 自动化、MCP 与进阶实践 Demo

> 配套《AI 自动化、MCP 与进阶实践》培训笔记的实践项目

## 包含模块

### 模块一：AI 任务工作流模拟器

模拟 AI 自动化任务的四步执行流程：

```
需求分析 → 上下文读取 → 任务执行 → 结果检查
```

功能：
- 创建任务（名称 + 类型）
- 点击步骤切换状态：○ 待分析 → ● 执行中 → ✓ 已完成
- 删除任务
- 数据持久化到 localStorage
- 显示进度和创建时间

### 模块二：反应速度测试

简单交互小游戏：
- 点击开始 → 随机等待 1-5 秒 → 屏幕变绿 → 尽快点击
- 过早点击（红色时）显示提示并重置
- 记录反应时间（毫秒）和最佳成绩
- 最佳成绩保存到 localStorage

## 技术栈

- React 18 + Vite 5
- 函数组件 + Hooks（useState, useEffect, useRef, useCallback）
- localStorage 数据持久化
- 暗色主题 CSS

## 运行方式

```bash
cd examples/ai-mcp-advanced-week1-demo
npm install
npm run dev
```

浏览器打开 `http://localhost:5174`。

## 知识点对照

| Demo 功能 | 对应知识点 |
|-----------|-----------|
| 工作流步骤状态切换 | Agent / Workflow 的分步执行 |
| 任务类型选择 | AI 可以处理不同类型的开发任务 |
| localStorage 持久化 | 数据独立于组件生命周期 |
| 反应速度游戏状态机 | useState 管理多状态切换 |
| setTimeout + useRef | 副作用管理和定时器清理 |
| 最佳成绩保存 | localStorage 与组件状态同步 |

## 为什么只模拟 Workflow 和 MCP 调用过程

本 Demo 的目标是**概念示意**，不是实现真实的 AI 调用：

- **Workflow 模拟器**：展示任务分步执行和状态流转的概念。真实 AI Workflow 中，每个步骤会调用实际的 Tool（读取文件、运行命令等）。
- **MCP**：本 Demo 不连接真实 MCP Server，但任务工作流的设计反映了 MCP 的核心思想——通过统一流程调用不同工具完成不同步骤。
- **游戏模块**：练习 React 状态管理和事件处理，这些是构建任何 AI 交互界面的基础。

## 后续扩展方向

1. 接入真实 AI API，让 Workflow 模拟器真正执行任务
2. 连接 MCP Server，演示 AI 如何调用文件系统和 Git
3. 为反应速度游戏添加排行榜
4. 增加更多游戏类型（记忆卡片、点击得分）

## 注意事项

- 数据存储在浏览器 localStorage 中，清除浏览器数据会丢失
- 不调用真实 AI API，所有任务仅为模拟
- 不连接任何 MCP Server
