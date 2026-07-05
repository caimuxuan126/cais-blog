# Cai's Blog — 从0到1的全栈个人博客

> 软件团队实训项目 — React + FastAPI + SQLite + Docker 全栈博客

## 功能模块

| 模块 | 功能 |
|------|------|
| 用户 | 注册、登录、JWT鉴权、个人信息 |
| 文章 | 发布、列表、详情、编辑、删除、搜索、分类、标签 |
| 互动 | 点赞/取消、收藏/取消、评论 |
| 统计 | 阅读量、点赞数、收藏数、热门排行 |
| 个人主页 | 个人介绍、技术栈、项目经历 |
| 收藏 | 我的收藏页面 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite 5 + React Router v6 |
| 后端 | FastAPI + SQLAlchemy + SQLite |
| 鉴权 | JWT (python-jose) + bcrypt |
| 容器 | Docker + docker-compose |
| CI/CD | GitHub Actions |

## 项目结构

```
├── frontend/                # React + Vite 前端
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   ├── components/      # 通用组件
│   │   ├── utils/           # API + localStorage 工具
│   │   ├── context/         # AuthContext
│   │   └── data/            # 个人信息配置
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                 # FastAPI 后端
│   ├── main.py              # 应用入口
│   ├── database.py          # 数据库连接
│   ├── models.py            # ORM 模型
│   ├── schemas.py           # Pydantic 模式
│   ├── auth.py              # JWT 鉴权
│   ├── routers/             # API 路由
│   │   ├── users.py         # 注册/登录
│   │   ├── posts.py         # 文章 CRUD + 搜索 + 热门 + 统计
│   │   ├── comments.py      # 评论
│   │   └── interactions.py  # 点赞、收藏
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml       # 一键启动前后端
├── .github/workflows/ci.yml # CI 流水线
└── README.md
```

## 本地运行

### 前端

```bash
cd frontend
npm install
npm run dev       # → http://localhost:3000
```

### 后端

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000/docs  (Swagger API文档)
```

前端 Vite 已配置 proxy，`/api/*` 请求自动转发到 `http://127.0.0.1:8000`。

## Docker 运行

```bash
docker compose up --build
```

- 前端: http://localhost (端口 80)
- 后端: http://localhost:8000

## CI/CD

GitHub Actions 在每次 push/PR 时自动执行：前端 `npm ci` → `build`，后端 `pip install` → 数据库初始化检查。

配置文件：`.github/workflows/ci.yml`

## 域名部署说明

1. 准备一台服务器，安装 Docker
2. 将项目推送到服务器
3. 修改 `frontend/nginx.conf` 中的 `server_name` 为域名
4. 运行 `docker compose up -d --build`
5. 配置 DNS 将域名指向服务器 IP

## API 接口一览

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | /api/auth/register | 注册 | 无 |
| POST | /api/auth/login | 登录 | 无 |
| GET | /api/auth/me | 当前用户 | JWT |
| GET | /api/posts | 文章列表 | 无 |
| GET | /api/posts/hot | 热门文章 | 无 |
| GET | /api/posts/stats | 统计数据 | 无 |
| GET | /api/posts/:id | 文章详情 | 无 |
| POST | /api/posts | 创建文章 | JWT |
| PUT | /api/posts/:id | 更新文章 | JWT |
| DELETE | /api/posts/:id | 删除文章 | JWT |
| GET | /api/posts/:id/comments | 评论列表 | 无 |
| POST | /api/posts/:id/comments | 发表评论 | JWT |
| DELETE | /api/posts/:id/comments/:cid | 删除评论 | JWT |
| POST | /api/posts/:id/like | 点赞/取消 | JWT |
| POST | /api/posts/:id/favorite | 收藏/取消 | JWT |
| GET | /api/favorites | 我的收藏 | JWT |

## 作业验收对应表

| 作业要求 | 实现情况 |
|---------|---------|
| 博客文章上传和存储 | ✅ FastAPI + SQLite 持久化 |
| 个人介绍/照片/兴趣/经历 | ✅ AboutPage + ContactPage |
| 评论区 | ✅ 评论 CRUD |
| 域名访问 | ✅ Docker + Nginx 部署方案 |
| CI/CD | ✅ GitHub Actions |
| 容器打包 | ✅ Dockerfile + docker-compose |
| 一键迁移部署 | ✅ docker compose up --build |
| 登录鉴权 | ✅ JWT |
| 点赞/收藏 | ✅ interactions 模块 |
| 文章搜索 | ✅ 关键词搜索 title + content |
| 数据统计 | ✅ 阅读量/点赞/收藏/热门排行 |
