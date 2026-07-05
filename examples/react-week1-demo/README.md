# React Week 1 Demo — 文章卡片管理

## 运行方式

```bash
cd examples/react-week1-demo
npm install
npm run dev
```

浏览器打开 `http://localhost:3001`

## 功能

| 功能 | 实现 |
|------|------|
| 新增文章 | 填写标题、摘要、分类、标签 → 点击"添加文章" |
| 删除文章 | 点击文章卡片右上角"删除"按钮 |
| 分类筛选 | 顶部标签栏选择分类过滤 |
| 标签管理 | 输入标签 → Enter 或点"添加"→ 显示 chip → 可删除 |
| localStorage 持久化 | 刷新页面数据不丢失 |
| 空状态 | 无文章时显示提示 |
| 暗色主题 | 黑底 + 粉色点缀 |

## 组件结构

```
App
├── ArticleForm      (useState: title, summary, category, tags)
│   └── TagInput     (useState: input, props: tags, onChange)
├── CategoryFilter   (props: categories, active, onSelect)
└── ArticleList      (props: articles, onDelete)
    └── ArticleCard  (props: article, onDelete)
```

## 对应知识点

| React 概念 | 体现位置 |
|-----------|---------|
| **JSX** | 所有组件的 return 部分 |
| **组件化** | 6 个独立组件文件 |
| **Props** | ArticleCard 接收 article 和 onDelete |
| **useState** | App 管理 articles/category；ArticleForm 管理表单字段 |
| **useEffect** | App 中读取和保存 localStorage |
| **事件处理** | onSubmit、onClick、onChange、onKeyDown |
| **受控组件** | input/textarea/select 的 value + onChange |
| **条件渲染** | 空状态 vs 文章列表；分类筛选 |
| **列表渲染** | ArticleList 用 map 渲染 ArticleCard |
| **状态提升** | App 持有 articles state，通过 props 和回调与子组件通信 |
| **单向数据流** | 数据从 App → ArticleList → ArticleCard；事件从子组件回调到 App |
