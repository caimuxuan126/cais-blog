# React 学习与实践

> 📅 建议学习周期：1 周 | 🎯 目标读者：软件团队新人 | 📝 类型：培训参考文档

---

## 前言

本文档旨在帮助软件团队新人建立对 React 及其生态的体系化认知。

**学习目标：**

- 建立对前端开发和 React 的整体认识
- 理解 React 为什么使用组件化思想
- 掌握 JSX、组件、Props、State、事件、列表渲染、条件渲染等基础知识
- 初步理解 Hooks，重点掌握 `useState` 和 `useEffect`
- 能够结合一个简单 Demo 完成 React 的基础实践
- 为后续博客项目开发、组件拆分和 AI Coding 实践打基础

> 建议边阅读边动手，每学完一个章节就在本地 Vite 项目中验证。

---

## 一、前置知识

### 1.1 基础三件套

| 技术 | 角色 | 在 React 项目中的体现 |
|------|------|----------------------|
| **HTML** | 页面结构 | JSX 替代手写 HTML，组件最终渲染为 DOM |
| **CSS** | 页面样式 | 同样写 CSS / CSS Modules / Tailwind，React 不替代 CSS |
| **JavaScript** | 交互逻辑 | React 本身就是 JS 库，组件逻辑、事件、状态全用 JS 写 |

> React 不是替代 HTML/CSS/JS，而是帮助你更好地组织 UI 和状态。你仍然需要会写 HTML 标签、CSS 样式和 JS 逻辑。

### 1.2 关键概念速览

| 概念 | 一句话 |
|------|--------|
| **DOM** | 浏览器中的页面结构对象，JS 可以通过 DOM API 操作页面 |
| **npm / pnpm** | 前端包管理工具，用来安装 React、Vite 等依赖 |
| **Vite** | 现代前端构建工具，提供开发服务器、热更新和打包能力 |
| **SPA** | 单页应用 (Single Page Application)，整个应用只有一个 HTML 页面，页面切换由 JS 控制路由实现 |

---

## 二、React 是什么

### 2.1 定义

**React** 是用于构建用户界面 (UI) 的 JavaScript 库，由 Facebook (Meta) 开发和维护。

### 2.2 为什么需要 React

原生 JavaScript 操作 DOM 的问题：

```js
// 传统方式：手动找到 DOM 节点，手动更新内容
document.getElementById('title').textContent = '新标题';
document.getElementById('count').textContent = 5;
```

当页面越来越复杂时，手动管理 DOM 更新会变得极其困难——你需要记住哪些节点在什么状态下应该显示什么内容。

**React 的核心价值**：你只需要描述"这个状态下的 UI 应该长什么样"，React 负责高效地更新 DOM。

### 2.3 核心思想

```
数据 (State) 变化 → React 自动计算差异 → 高效更新 DOM → 页面变化
```

- **组件化**：把 UI 拆成独立、可复用的小块
- **声明式**：描述"UI 应该是什么样"，而不是"如何一步步操作 DOM"
- **状态驱动**：数据改变 → 页面自动更新

### 2.4 React vs Vue vs 原生 HTML

| 维度 | 原生 HTML | React | Vue |
|------|----------|-------|-----|
| UI 描述 | HTML 文件 | JSX (JavaScript + HTML) | SFC (模板语法) |
| 数据绑定 | 手动 DOM 操作 | 单向数据流 + setState | 双向绑定 v-model |
| 组件化 | 无原生支持 | 函数组件 + Hooks | SFC + Composition API |
| 学习曲线 | 低 | 中（需要 JS 基础 + JSX + Hooks） | 中低（模板语法接近 HTML） |

---

## 三、环境搭建与项目启动

### 3.1 必需的软件

| 工具 | 作用 | 验证命令 |
|------|------|----------|
| **Node.js** | JavaScript 运行时（Vite 需要） | `node -v` |
| **npm** | Node 自带包管理器 | `npm -v` |

### 3.2 创建项目

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

### 3.3 项目结构速查

```
my-react-app/
├── index.html          # 入口 HTML（Vite 从这里开始）
├── package.json        # 项目配置和依赖列表
├── node_modules/       # 安装的第三方依赖（不要手动改）
├── vite.config.js      # Vite 配置
└── src/
    ├── main.jsx        # React 挂载入口
    ├── App.jsx         # 根组件（路由和布局）
    ├── App.css         # 根组件样式
    └── index.css       # 全局样式
```

| 文件 | 作用 |
|------|------|
| `index.html` | 唯一 HTML 页面，`<div id="root">` 是 React 挂载点 |
| `main.jsx` | 引入 ReactDOM，把 `<App />` 渲染到 `#root` |
| `App.jsx` | 应用根组件，通常放路由、全局布局 |
| `vite.config.js` | Vite 构建配置 |
| `package.json` | 记录项目名、脚本命令、依赖版本 |

---

## 四、JSX 语法基础

### 4.1 什么是 JSX

JSX 是 JavaScript 的语法扩展，让你可以在 JS 中直接写类似 HTML 的标记。最终 JSX 会被编译成 `React.createElement` 调用。

### 4.2 核心规则

| 规则 | HTML 写法 | JSX 写法 |
|------|----------|----------|
| class 属性 | `class="title"` | `className="title"` |
| 插入 JS 表达式 | 不支持 | `{变量名}` 或 `{表达式}` |
| 标签闭合 | `<img src="...">` 可省略 | `<img src="..." />` 必须闭合 |
| 多个根节点 | 可以有多个 | 只能有一个根节点（或用 `<></>` Fragment） |

### 4.3 示例

```jsx
function Greeting() {
  const name = 'Cai';
  const hour = new Date().getHours();

  return (
    <div className="greeting-card">
      <h1>Hello, {name}!</h1>
      <p>{hour < 12 ? 'Good Morning' : 'Good Afternoon'}</p>
    </div>
  );
}
```

---

## 五、组件化开发

### 5.1 什么是组件

组件是 UI 的独立、可复用的"积木块"。每个组件管理自己的结构和样式，接收外部数据，渲染出对应的界面。

### 5.2 为什么拆分

- **复用**：同一个 `Button` 可以用在多个地方
- **可读性**：`App.jsx` 不应该有 500 行
- **可维护**：改 Header 的样式只需改 `Header.jsx`
- **可测试**：独立的小组件更容易单独验证

### 5.3 函数组件示例

```jsx
// components/Header.jsx
export default function Header({ siteName }) {
  return <header><h1>{siteName}</h1></header>;
}

// components/ArticleCard.jsx
export default function ArticleCard({ title, summary }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{summary}</p>
    </div>
  );
}
```

### 5.4 拆分原则

- 每个组件只做一件事（单一职责）
- 如果一段 UI 在不同页面中出现两次，就可以考虑抽成组件
- 组件名用 PascalCase（大驼峰），如 `BlogCard`、`UserProfile`

---

## 六、Props：组件之间传递数据

### 6.1 什么是 Props

Props (Properties) 是父组件传递给子组件的数据。Props 是**只读**的，子组件不应该修改它。

```jsx
// 父组件
<BlogCard title="React学习" summary="本周学习React基础" />

// 子组件
function BlogCard({ title, summary }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{summary}</p>
    </div>
  );
}
```

### 6.2 Props 解决什么问题

同一个 `BlogCard` 组件，通过传入不同的 `title` 和 `summary`，可以渲染出不同文章卡片——实现"组件复用但内容不同"。

---

## 七、State：组件内部状态

### 7.1 什么是 State

State 是组件内部**会变化**的数据。当 State 更新时，React 会自动重新渲染该组件。

### 7.2 useState 基础

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // 初始值 0

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

### 7.3 State 关键规则

| 规则 | 说明 |
|------|------|
| **不能直接修改** | `count = 5` 不会触发渲染，必须用 `setCount(5)` |
| **更新是异步的** | 调用 `setState` 后不会立即拿到新值 |
| **每次 setState 都会重新渲染** | React 比较新旧状态，决定是否需要更新 DOM |

---

## 八、事件处理与表单

### 8.1 React 事件

```jsx
<button onClick={() => setCount(count + 1)}>+1</button>
<input onChange={(e) => setName(e.target.value)} />
<form onSubmit={(e) => { e.preventDefault(); addItem(); }}>
```

- 事件名用驼峰：`onClick`（不是 `onclick`）、`onChange`
- 事件处理函数通常用箭头函数或单独定义

### 8.2 受控组件

表单元素（input、textarea、select）的 `value` 由 React state 控制：

```jsx
const [text, setText] = useState('');

<input
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

> 为什么叫"受控"？因为 input 的值不是由 DOM 自己管理的，而是由 React state 控制的。每次输入 → onChange → setState → 重新渲染 → 显示新值。

### 8.3 表单提交示例

```jsx
const [title, setTitle] = useState('');

const handleSubmit = (e) => {
  e.preventDefault();
  if (!title.trim()) return;
  addArticle({ title });
  setTitle('');
};

<form onSubmit={handleSubmit}>
  <input value={title} onChange={(e) => setTitle(e.target.value)} />
  <button type="submit">添加</button>
</form>
```

---

## 九、条件渲染与列表渲染

### 9.1 条件渲染

```jsx
// 三元表达式
{isLoggedIn ? <Dashboard /> : <LoginPage />}

// && 短路
{articles.length === 0 && <p>暂无文章</p>}
```

### 9.2 列表渲染

```jsx
{articles.map(a => (
  <ArticleCard key={a.id} title={a.title} />
))}
```

### 9.3 key 的作用

React 使用 `key` 来追踪列表中每个元素的身份。列表更新（增删改排序）时，React 根据 key 判断哪些元素需要更新/添加/移除。

| key 选择 | 评价 |
|----------|------|
| 数据库 ID | ✅ 最佳 |
| 唯一业务字段 | ✅ 好 |
| 数组下标 (index) | ⚠️ 列表不会重新排序时可用 |
| 随机数 | ❌ 每次渲染 key 都变，性能最差 |

---

## 十、Hooks 基础：useState 与 useEffect

### 10.1 useState

```jsx
const [value, setValue] = useState(initialValue);
```

用于在函数组件中声明和管理状态。

### 10.2 useEffect

```jsx
useEffect(() => {
  // 副作用代码：请求数据、操作 localStorage、设置定时器等
  console.log('组件挂载或依赖变化');

  return () => {
    // 清理函数（可选）：清除定时器、取消订阅等
    console.log('组件卸载或依赖变化前清理');
  };
}, [依赖数组]);
```

### 10.3 依赖数组的行为

| 依赖数组 | 执行时机 |
|----------|---------|
| `[]` (空数组) | 只在组件**首次挂载**时执行一次 |
| `[count]` | `count` 变化时执行 |
| 不传 | 每次渲染都执行（几乎不用） |

### 10.4 典型用例

```jsx
// 首次加载从 localStorage 读取数据
useEffect(() => {
  const saved = localStorage.getItem('articles');
  if (saved) setArticles(JSON.parse(saved));
}, []);

// 数据变化时保存到 localStorage
useEffect(() => {
  localStorage.setItem('articles', JSON.stringify(articles));
}, [articles]);
```

---

## 十一、React 中的数据流

### 11.1 单向数据流

```
父组件 State
    │ 通过 Props 向下传递
    ▼
子组件 (展示数据)
    │ 通过回调函数向上通知
    ▼
父组件 (更新 State → 重新渲染)
```

### 11.2 状态提升

当两个子组件需要共享同一份数据时，把 State 提升到它们共同的父组件中：

```jsx
function App() {
  const [articles, setArticles] = useState([]);

  return (
    <>
      <ArticleForm onAdd={(a) => setArticles([...articles, a])} />
      <ArticleList articles={articles} />
    </>
  );
}
```

- `ArticleForm` 通过 `onAdd` 回调把新文章传给 App
- `ArticleList` 通过 `articles` props 接收数据展示
- App 是 State 的"唯一数据源"

---

## 十二、React 与 localStorage

### 12.1 基本用法

```js
// 保存
localStorage.setItem('key', JSON.stringify(data));

// 读取
const data = JSON.parse(localStorage.getItem('key') || '[]');

// 删除
localStorage.removeItem('key');
```

### 12.2 注意要点

- localStorage 只能存**字符串**，对象/数组必须 `JSON.stringify`
- 容量限制约 **5MB**
- 数据存储在浏览器中，不同浏览器/设备不共享
- **不适合存敏感信息**（密码、Token 等）

### 12.3 博客项目为什么先用 localStorage

- 前端实训阶段不需要后端
- 数据持久化，刷新不丢失
- 后续上线可按相同数据结构迁移到后端 API

---

## 十三、React 项目中的调试方法

### 13.1 工具

| 工具 | 用途 |
|------|------|
| 浏览器 Console | 查看报错和 `console.log` 输出 |
| React Developer Tools | 查看组件树、Props、State |
| Network 面板 | 检查 API 请求 |
| Application → Local Storage | 检查 localStorage 数据 |

### 13.2 常见问题排查

| 问题 | 可能原因 | 排查方向 |
|------|---------|----------|
| 组件不显示 | 条件渲染为 false / State 为空 | `console.log` 打印 state 值 |
| `map` 报错 | 数据不是数组 | 检查 `Array.isArray(data)`，给默认值 `[]` |
| key 警告 | 列表没写 key 或 key 不唯一 | 使用唯一 ID 作为 key |
| state 更新后页面没变化 | 直接修改了 state | 必须用 `setState` |
| `useEffect` 执行多次 | StrictMode 下会执行两次 | 正常现象，生产环境只执行一次 |
| localStorage 读取为空 | 第一次访问没有数据 | `JSON.parse(getItem('key') \|\| '[]')` |

---

## 十四、必须记住的规则

- ✅ 组件名首字母**必须大写**（React 通过大小写区分组件和 HTML 标签）
- ✅ JSX 中使用 `className` 而不是 `class`
- ✅ JSX 中使用 `{}` 插入表达式
- ✅ State **不能直接修改**，必须通过 `setState`
- ✅ Props 是**只读**的
- ✅ 列表渲染**必须写 key**
- ✅ 表单通常使用**受控组件**
- ✅ `useEffect` **注意依赖数组**
- ✅ localStorage 只能存**字符串**
- ✅ 组件拆分要围绕**职责**，不是随意拆分

---

## 十五、容易混淆的概念

| 概念 A | 概念 B | 区别 |
|--------|--------|------|
| **HTML** | **JSX** | HTML 直接在浏览器解析；JSX 会被编译成 `React.createElement`，`class` → `className` |
| **Props** | **State** | Props 父传子、只读；State 组件内部管理、可修改 |
| **State** | **普通变量** | State 变化触发重渲染；普通变量 `let x = 1` 不会 |
| **受控组件** | **非受控组件** | 受控：value 由 React state 控制；非受控：用 ref 直接读 DOM |
| **useState** | **useEffect** | useState 管理数据；useEffect 处理副作用（请求、存储、定时器） |
| **组件复用** | **组件拆分** | 复用：同一组件在多处使用；拆分：把大组件拆小提升可读性 |
| **localStorage** | **后端数据库** | localStorage 存浏览器本地；后端数据库存服务器，多设备共享 |
| **SPA** | **多页面应用** | SPA 一个 HTML + JS 路由切换；多页面每次跳转刷新整个页面 |

---

## 十六、本周遇到的问题与思考

### 1. 为什么 React 组件名必须大写？

React 通过首字母大小写区分"自定义组件"和"原生 HTML 标签"。小写 `<div>` 渲染为 HTML 元素，大写 `<BlogCard>` 渲染为自定义组件。

### 2. 为什么不能直接修改 state？

React 需要"知道"state 变了才能触发重渲染。如果直接 `count = 5`，React 无法感知变化。必须通过 `setCount(5)` 通知 React。

### 3. 为什么列表渲染必须写 key？

React 用 key 追踪列表项的身份。没有 key（或用 index 不稳定时），增删改操作可能导致渲染错乱或性能浪费。

### 4. 为什么 useEffect 有时候会执行多次？

React 18 的 StrictMode 在开发环境下会故意执行两次 effect（挂载→卸载→重新挂载），用于帮你发现副作用清理问题。生产环境只执行一次。

### 5. 为什么组件拆分后反而有时更难理解？

拆分过度或拆分方式不合理（比如把不相关的逻辑硬塞到一个组件里）。好的拆分是围绕"职责"——一个组件做好一件事。

### 6. 什么时候应该把状态放到父组件？

当两个或多个子组件需要共享同一份数据时，把 state 提升到共同的父组件。如果数据只有一个组件关心，就放在那个组件内部。

---

## 十七、Mentor 交流问题

| # | 问题 |
|---|------|
| 1 | 实际项目中如何判断组件应该怎么拆分？是以 UI 区域为标准还是以数据职责为标准？ |
| 2 | 什么状态应该放在父组件，什么状态应该放在子组件？有没有通用原则？ |
| 3 | React 项目中什么时候需要引入状态管理库（Redux/Zustand）？小项目用 Context 够吗？ |
| 4 | 团队项目中如何组织 `components`、`pages`、`hooks`、`utils` 等目录？ |
| 5 | localStorage 方案适合哪些场景，不适合哪些场景？生产环境迁移到后端数据库需要注意什么？ |
| 6 | 如何排查 React 页面重复渲染或性能问题？React DevTools Profiler 怎么用？ |
| 7 | AI Coding 生成的 React 代码应该重点检查哪些地方？（state 管理、副作用、组件拆分） |

---

## 十八、综合实战：React 文章卡片 Demo

详见 `examples/react-week1-demo/` 目录。

### 运行方式

```bash
cd examples/react-week1-demo
npm install
npm run dev
```

### Demo 功能

| 功能 | 对应知识点 |
|------|-----------|
| 新增文章 | useState、受控组件、表单 onSubmit |
| 删除文章 | setState 更新数组 |
| 分类筛选 | 条件渲染、filter |
| 标签输入 | 数组操作、受控组件 |
| localStorage 持久化 | useEffect 读取/保存 |
| 空状态展示 | 条件渲染 |
| 组件拆分 | 6 个组件各司其职 |
| 暗色主题 | CSS 变量 + 粉色点缀 |

### 组件通信

```
App (state: articles, category, tags)
 ├─ ArticleForm    ← onAdd 回调 → App 更新 articles
 ├─ CategoryFilter ← onSelect 回调 → App 更新 category
 └─ ArticleList    ← articles props
      └─ ArticleCard × N  ← title/summary/category/tags props
```

---

## 核心概念速记

- React 是构建 UI 的 JavaScript 库，核心思想是**组件化**
- JSX 是 JavaScript 中描述 UI 的语法，`{}` 插入表达式，`className` 替代 `class`
- **Props** 父传子、只读；**State** 管理组件内部变化
- State 更新 → 组件重新渲染，**不能直接修改** state
- **useState** 管理状态，**useEffect** 处理副作用（请求、存储）
- 列表渲染用 `map`，**必须写 key**
- 表单常用**受控组件**（value + onChange）
- localStorage 可本地持久化，**只能存字符串**
- 组件拆分围绕**职责**，状态提升共享数据
- 调试用 Console + React DevTools + Network 面板

---

> 📝 *本文档为软件团队内部培训参考资料，建议配合 `examples/react-week1-demo` 动手实践。*
