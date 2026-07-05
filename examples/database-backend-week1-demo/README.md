# 数据库与后端 Week 1 Demo — 文章与评论 API

## 运行方式

```bash
cd examples/database-backend-week1-demo
npm install
npm run dev
```

服务启动在 `http://localhost:4000`

## 接口一览

| 功能 | 方法 | 路径 | 请求体 |
|------|------|------|--------|
| 文章列表 | GET | /api/posts | — |
| 文章列表(分类) | GET | /api/posts?category=技术笔记 | — |
| 文章详情 | GET | /api/posts/:id | — |
| 新增文章 | POST | /api/posts | `{title, content, category, tags}` |
| 更新文章 | PUT | /api/posts/:id | `{title, content, category, tags}` |
| 删除文章 | DELETE | /api/posts/:id | — |
| 文章评论列表 | GET | /api/posts/:id/comments | — |
| 新增评论 | POST | /api/posts/:id/comments | `{content}` |
| 更新评论 | PUT | /api/posts/:id/comments/:commentId | `{content}` |
| 删除评论 | DELETE | /api/posts/:id/comments/:commentId | — |

## 测试示例

```bash
# 获取文章列表
curl http://localhost:4000/api/posts

# 新增文章
curl -X POST http://localhost:4000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"测试文章","content":"这是内容","category":"技术笔记","tags":["测试","API"]}'

# 新增评论
curl -X POST http://localhost:4000/api/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{"content":"写得很清楚！"}'
```

## 技术栈

| 技术 | 用途 |
|------|------|
| Express | Node.js Web 框架，定义路由和中间件 |
| better-sqlite3 | SQLite 数据库驱动，同步 API，学习友好 |
| SQLite | 嵌入式关系型数据库，数据存在 blog.db 文件中 |

## 对应知识点

| 知识点 | 体现在哪里 |
|--------|-----------|
| SQL 建表 | db.js 中的 CREATE TABLE |
| SQL 增删改查 | routes/posts.js 和 routes/comments.js |
| RESTful API | 接口路径设计 |
| 参数校验 | 空值检查、404 检查 |
| JSON 响应 | 统一 `{success, data/message}` 格式 |
| 外键关联 | comments.post_id → posts.id |
| 级联删除 | 删除文章时同时删除其评论 |
| CORS | server.js 中的跨域头设置 |
| 数据持久化 | SQLite 文件存储，重启服务数据不丢失 |
