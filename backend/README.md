# Cai's Blog Backend API

基于 FastAPI + SQLite + JWT 的后端服务。

## 技术栈

- Python 3.10+
- FastAPI
- SQLAlchemy + SQLite
- JWT (python-jose + passlib)

## 快速启动

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

## API 文档

启动后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 目录结构

```
backend/
├── main.py              # FastAPI 入口
├── database.py           # SQLAlchemy 配置
├── models.py             # ORM 模型
├── schemas.py            # Pydantic 模型
├── auth.py               # JWT 鉴权
├── requirements.txt
├── .env.example
├── README.md
└── routers/
    ├── users.py          # 注册/登录/当前用户
    ├── posts.py          # 文章 CRUD + 搜索/热门/统计
    ├── comments.py       # 评论
    ├── interactions.py   # 点赞/收藏/关注
    ├── notifications.py  # 通知
    └── messages.py       # 私信
```

## 数据模型

| 模型 | 表 | 说明 |
|------|-----|------|
| User | users | 用户 |
| Post | posts | 文章 |
| Comment | comments | 评论 |
| Like | likes | 点赞 |
| Favorite | favorites | 收藏 |
| Follow | follows | 关注关系 |
| Notification | notifications | 通知 |
| Message | messages | 私信 |

## API 端点概览

### 认证
- `POST /api/auth/register` — 注册
- `POST /api/auth/login` — 登录，返回 JWT
- `GET  /api/auth/me` — 当前用户

### 文章
- `GET    /api/posts` — 列表（?keyword=&category=&tag=）
- `GET    /api/posts/hot` — 热门文章
- `GET    /api/posts/stats` — 统计
- `GET    /api/posts/{id}` — 详情（阅读量+1）
- `POST   /api/posts` — 发布
- `PUT    /api/posts/{id}` — 编辑
- `DELETE /api/posts/{id}` — 删除

### 评论
- `GET    /api/posts/{id}/comments` — 列表
- `POST   /api/posts/{id}/comments` — 发表
- `DELETE /api/posts/{id}/comments/{cid}` — 删除

### 互动
- `POST /api/posts/{id}/like` — 点赞/取消
- `POST /api/posts/{id}/favorite` — 收藏/取消
- `GET  /api/favorites` — 我的收藏
- `POST /api/users/{id}/follow` — 关注/取消
- `GET  /api/users/{id}/follow-status` — 关注状态
- `GET  /api/users/{id}/followers` — 粉丝列表
- `GET  /api/users/{id}/following` — 关注列表

### 通知
- `GET /api/notifications` — 列表
- `PUT /api/notifications/{id}/read` — 标记已读
- `PUT /api/notifications/read-all` — 全部已读

### 私信
- `GET  /api/messages/conversations` — 会话列表
- `GET  /api/messages/{peer_id}` — 聊天记录
- `POST /api/messages/{peer_id}` — 发送消息

## 前端迁移说明

当前前端使用 localStorage，替换为后端 API 时：

1. **首先替换**：登录/注册 → `POST /api/auth/register` + `POST /api/auth/login`
2. **然后替换**：文章列表/详情/发布 → `/api/posts/*`
3. **再替换**：评论 → `/api/posts/{id}/comments`
4. **最后替换**：通知/关注/私信 → `/api/notifications`、`/api/users/{id}/follow`、`/api/messages`

请求时在 Header 中携带：`Authorization: Bearer <token>`

## 注意事项

- 不要提交 `.env` 和 `data/*.db` 文件
- SQLite 数据库文件在首次启动时自动创建
- CORS 允许所有来源，生产环境应限制
