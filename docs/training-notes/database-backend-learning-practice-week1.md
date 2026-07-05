# 数据库与后端学习实践

> 📅 建议学习周期：1 周 | 🎯 目标读者：软件团队新人 | 📝 类型：培训参考文档

---

## 前言

本文档旨在帮助软件团队新人建立对数据库和后端开发的体系化认知。

**学习目标：**

- 建立对数据库和后端开发的整体认识
- 理解前端、后端、数据库在 Web 应用中的关系
- 掌握数据库基础概念、SQL 基本操作和数据建模思路
- 理解后端接口、路由、请求处理、数据持久化的基本流程
- 能够通过一个简单 Demo 实现"前端请求接口，后端操作数据库并返回数据"
- 为后续博客项目接入真实后端和数据库打基础

---

## 一、前置知识

### 1.1 三者分工

| 角色 | 职责 | 在博客项目中的体现 |
|------|------|-------------------|
| **前端** | 界面展示和用户交互 | React 页面、文章卡片、评论框 |
| **后端** | 处理业务逻辑，向前端提供数据接口 | 登录验证、文章 CRUD、评论管理 |
| **数据库** | 长期保存和管理数据 | 存储文章、用户、评论、点赞记录 |

### 1.2 关键概念

| 概念 | 一句话 |
|------|--------|
| **API** | 前端和后端之间约定好的通信方式，通常用 HTTP + JSON |
| **JSON** | 前后端数据交换的通用格式 |
| **localStorage vs 数据库** | localStorage 存浏览器本地，数据库存服务器；前者只适合本地 Demo，后者是正式项目的标配 |

> 当前博客项目用 localStorage，适合本地实训展示。如果要让多用户在不同设备访问同一份数据（如真实上线的博客），就必须使用后端 + 数据库。

---

## 二、后端是什么

后端是运行在服务器上的程序，核心职责：**接收请求 → 处理业务逻辑 → 操作数据库 → 返回响应**。

| 问题 | 解答 |
|------|------|
| 为什么需要后端？ | 前端不能直接操作数据库（安全风险）；登录验证、权限控制需要后端；多人共享数据需要服务端协调 |
| 后端和前端如何通信？ | 通过 HTTP 协议，前端发请求(GET/POST/PUT/DELETE)，后端返回 JSON |
| 后端和数据库如何配合？ | 后端接收请求后，通过 SQL 或其他方式读取/写入数据库，再把结果返回前端 |

博客项目中后端的典型作用：文章列表查询、文章发布、登录验证、评论存储、阅读量更新。

---

## 三、数据库是什么

数据库是用来长期保存和管理数据的系统。相比 localStorage：数据存在服务器而非浏览器、支持多用户同时访问、支持复杂查询、容量更大。

### 3.1 基础概念

| 概念 | 定义 | 类比 Excel |
|------|------|-----------|
| **数据库 (Database)** | 存放所有表的容器 | 一个 Excel 文件 |
| **表 (Table)** | 一类数据的集合 | 一个 Sheet |
| **字段 (Column)** | 数据的一个属性 | 一列 |
| **记录 (Row)** | 一条完整数据 | 一行 |
| **主键 (Primary Key)** | 唯一标识一条记录的字段 | 每行的序号 |
| **外键 (Foreign Key)** | 关联另一张表的字段 | 跨 Sheet 引用的 ID |

### 3.2 博客数据表示例

**posts 表：**

| id | title | content | category | created_at |
|----|-------|---------|----------|------------|
| 1 | React 学习 | ... | 技术笔记 | 2026-06-13 |
| 2 | 博客思考 | ... | 项目复盘 | 2026-06-05 |

**comments 表：**

| id | post_id | content | created_at |
|----|---------|---------|------------|
| 1 | 1 | 写得好 | 2026-06-13 |
| 2 | 1 | 学习了 | 2026-06-13 |

`post_id` 是外键，指向 `posts.id`，表示这条评论属于哪篇文章。

---

## 四、关系型数据库与非关系型数据库

| 对比项 | 关系型 (SQL) | 非关系型 (NoSQL) |
|--------|-------------|-----------------|
| 数据结构 | 表、行、列 | 文档、键值、集合 |
| 查询方式 | SQL 语言 | 各数据库不同 |
| 适合场景 | 文章、用户、订单、评论 | 缓存、日志、灵活文档 |
| 常见代表 | MySQL, PostgreSQL, SQLite | MongoDB, Redis |

**初学建议**：先掌握关系型数据库和 SQL。SQLite 适合学习和小型 Demo，MySQL/PostgreSQL 更常见于真实项目。

---

## 五、SQL 基础

SQL 是操作关系型数据库的语言，核心四类操作：**增删改查 (CRUD)**。

### 5.1 创建表

```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### 5.2 新增数据 (INSERT)

```sql
INSERT INTO posts (title, content, category)
VALUES ('React 学习笔记', '文章内容...', '技术笔记');
```

### 5.3 查询数据 (SELECT)

```sql
-- 查全部
SELECT * FROM posts;

-- 按分类筛选
SELECT * FROM posts WHERE category = '技术笔记';

-- 按时间倒序
SELECT * FROM posts ORDER BY created_at DESC;
```

### 5.4 更新数据 (UPDATE)

```sql
UPDATE posts SET title = '新标题' WHERE id = 1;
```

### 5.5 删除数据 (DELETE)

```sql
DELETE FROM posts WHERE id = 1;
```

> ⚠️ WHERE 条件极其重要。`DELETE FROM posts` 不加 WHERE 会删除整个表的所有数据。

---

## 六、数据建模基础

数据建模是把业务对象设计成数据库表。博客项目常见模型：

### 6.1 用户与文章（一对多）

一个用户写多篇文章 → `posts` 表加 `user_id` 外键。

### 6.2 文章与评论（一对多）

一篇文章有多条评论 → `comments` 表加 `post_id` 外键。

### 6.3 文章与标签（多对多）

一篇文章有多个标签，一个标签下有多篇文章 → 需要中间表：

```text
posts       post_tags       tags
──────      ─────────       ────
id          post_id         id
title       tag_id          name
```

> 不要把所有数据塞进一张表：会造成大量冗余、更新困难和数据不一致。

---

## 七、后端 API 基础

API 是前后端约定的通信方式。RESTful 风格将 URL 视为资源，HTTP 方法表示动作。

| 功能 | 方法 | 路径 | 含义 |
|------|------|------|------|
| 获取文章列表 | GET | /api/posts | 读取全部 |
| 获取文章详情 | GET | /api/posts/:id | 读取单篇 |
| 新增文章 | POST | /api/posts | 创建新资源 |
| 更新文章 | PUT | /api/posts/:id | 完整更新 |
| 删除文章 | DELETE | /api/posts/:id | 删除 |
| 获取评论 | GET | /api/posts/:id/comments | 读取某文章评论 |
| 新增评论 | POST | /api/posts/:id/comments | 发表评论 |

---

## 八、请求处理流程

用户点击"发布评论"后发生了什么？

```
1. 前端收集评论内容和文章 ID
2. 前端 fetch POST /api/posts/:id/comments
3. 后端接收请求 → 解析 JSON 请求体
4. 后端校验内容是否为空
5. 后端执行 INSERT INTO comments
6. SQLite 写入数据
7. 后端返回 { success: true, data: 新评论 }
8. 前端接收响应 → 更新页面
```

---

## 九、后端项目结构

```text
backend-demo/
├── package.json      # 项目配置
├── server.js         # 启动服务器
├── db.js             # 初始化数据库 + 建表
├── routes/
│   ├── posts.js      # 文章接口
│   └── comments.js   # 评论接口
└── data/
    └── blog.db       # SQLite 数据库文件
```

| 文件 | 职责 |
|------|------|
| server.js | 启动 Express，挂载路由，监听端口 |
| db.js | 连接/创建 SQLite 文件，执行建表语句 |
| routes/*.js | 定义接口路径和请求处理逻辑 |

---

## 十、Node.js 后端基础示例

```js
// server.js
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello Backend' });
});

app.listen(3000, () => console.log('http://localhost:3000'));
```

- `express.json()`：解析请求中的 JSON 数据
- `app.get(path, handler)`：定义 GET 接口
- `req`：请求对象（含 params、query、body）
- `res.json()`：返回 JSON 响应

---

## 十一、数据持久化对比

| 存储方式 | 位置 | 适合场景 | 局限 |
|----------|------|---------|------|
| localStorage | 浏览器 | 本地小数据 | 仅当前浏览器，不跨设备 |
| JSON 文件 | 服务器磁盘 | 简单 Demo | 并发差，查询弱 |
| SQLite | 本地数据库文件 | 学习、小项目 | 不适合高并发大服务 |
| MySQL/PostgreSQL | 数据库服务 | 正式项目 | 需要安装和维护 |

---

## 十二、后端安全与数据校验

初学阶段必须注意：

| 规则 | 说明 |
|------|------|
| 不能信任前端数据 | 后端必须校验所有输入（空值、类型、长度） |
| 密码不能明文存储 | 使用 bcrypt 等哈希算法 |
| 防止 SQL 注入 | 用参数化查询，不要拼接 SQL 字符串 |
| 限制上传 | 图片大小和类型限制 |
| 错误不泄露 | 不要返回数据库结构等敏感信息 |

**SQL 注入示例：**

```js
// ❌ 危险写法
const sql = `SELECT * FROM users WHERE name = '${name}'`;

// ✅ 安全写法
const sql = 'SELECT * FROM users WHERE name = ?';
db.prepare(sql).get(name);
```

---

## 十三、后端调试方法

| 方法 | 用途 |
|------|------|
| `console.log` | 查看请求参数和中间变量 |
| Chrome DevTools Network | 查看请求状态码、响应体、耗时 |
| Postman / curl | 独立测试 API，不依赖前端 |
| 直接查看数据库文件 | 确认数据是否真的写入 |
| 检查端口占用 | `netstat -ano` 或 `lsof -i :3000` |

**常见问题排查：**

| 问题 | 排查方向 |
|------|---------|
| 请求不到接口 | 检查后端是否启动、端口是否正确 |
| 404 | 路径写错或请求方法不匹配 |
| 500 | 后端代码报错，查看终端日志 |
| CORS 报错 | 后端需设置 Access-Control-Allow-Origin |
| 数据写入了但前端没更新 | 前端需在响应后更新 state |

---

## 十四、必须记住的规则

- ✅ 前端负责展示，后端负责业务和数据
- ✅ 数据库负责长期保存数据
- ✅ API 是前后端通信的约定
- ✅ GET 查、POST 增、PUT 改、DELETE 删
- ✅ SQL 操作必加 WHERE 条件（尤其是 DELETE 和 UPDATE）
- ✅ 主键唯一标识数据，外键建立表关系
- ✅ 后端必须校验前端传来的数据
- ✅ 密码不能明文存储
- ✅ localStorage ≠ 数据库
- ✅ 正式项目需要后端接口和数据库支撑

---

## 十五、容易混淆的概念

| 概念 A | 概念 B | 区别 |
|--------|--------|------|
| 前端 | 后端 | 前端管界面，后端管业务和数据 |
| 后端 | 数据库 | 后端处理逻辑，数据库存数据 |
| localStorage | 数据库 | localStorage 在浏览器，数据库在服务器 |
| 表 | 字段 | 表是一类数据的集合，字段是表中的一个属性 |
| 主键 | 外键 | 主键标识自己，外键关联别人 |
| GET | POST | GET 获取数据（幂等），POST 创建数据（不幂等） |
| SQL 注入 | 参数化查询 | 拼接字符串危险，占位符安全 |
| 404 | 500 | 404 资源未找到，500 服务器内部错误 |

---

## 十六、本周遇到的问题与思考

1. **为什么前端项目还需要后端？** — 前端不能安全地直接操作数据库；需要后端做权限验证、数据校验和业务逻辑。
2. **localStorage 能存数据，为什么还要数据库？** — localStorage 仅当前浏览器有效，不跨设备，容量有限。数据库是唯一的真实数据源。
3. **为什么删除和更新必须写 WHERE？** — 不加 WHERE 会影响全表，造成数据灾难。
4. **为什么后端不能相信前端数据？** — 任何人都可以伪造 HTTP 请求。所有校验必须在后端再做一次。
5. **为什么密码不能明文存？** — 数据库泄露时，明文密码会直接暴露用户密码。哈希后的密码即使泄露也难以还原。
6. **为什么会出现 CORS 问题？** — 浏览器同源策略阻止不同源的请求。后端需设置 Access-Control-Allow-Origin 头。

---

## 十七、Mentor 交流问题

| # | 问题 |
|---|------|
| 1 | 实际项目中如何设计数据库表结构？是先画 ER 图还是先写代码？ |
| 2 | 什么情况下需要拆表，什么情况下多几个字段就够了？ |
| 3 | 团队中前后端如何约定接口格式？是用文档还是工具？ |
| 4 | 博客项目如果要上线，文章、评论、用户、图片应该如何存储？ |
| 5 | 什么时候该用 ORM，什么时候该直接写 SQL？ |
| 6 | Controller、Service、Model 分别适合放什么逻辑？ |

---

## 十八、综合实战：文章与评论后端 API Demo

详见 `examples/database-backend-week1-demo/`。

**运行方式：**

```bash
cd examples/database-backend-week1-demo
npm install
npm run dev
```

**功能：** Express + SQLite API 服务，支持文章 CRUD 和评论管理。

**对应知识点：** SQL 建表/增删改查、Express 路由、RESTful API、参数校验、JSON 响应、数据持久化。

---

## 核心概念速记

- 后端负责业务逻辑和数据处理，数据库负责长期保存数据
- API 是前后端通信的约定，通常用 HTTP + JSON
- SQL 用于操作关系型数据库：SELECT/INSERT/UPDATE/DELETE
- 主键唯一标识数据，外键建立表关系
- GET/POST/PUT/DELETE 对应不同数据操作
- 后端必须做参数校验，不能信任前端数据
- 密码不能明文存储，SQL 需防注入
- SQLite 适合学习 Demo，MySQL/PostgreSQL 适合正式项目
- 数据建模要围绕业务对象和数据关系
- 调试结合 Network 面板、终端日志和数据库数据

---

> 📝 *本文档为软件团队内部培训参考资料，建议配合 `examples/database-backend-week1-demo` 动手实践。*
