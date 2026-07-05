# Docker 部署与 CI/CD Demo

> 配套《Docker 部署与 CI/CD 实践》培训笔记的实践项目

## 技术栈

| 组件 | 技术 | 端口（容器内） | 对外端口 |
|------|------|--------------|---------|
| 前端 | React 18 + Vite 5 | 80 (Nginx) | - |
| 后端 | Express + better-sqlite3 | 3001 | - |
| 反向代理 | Nginx Alpine | 80 | **8080** |
| 数据持久化 | SQLite + Docker Volume | - | - |
| CI | GitHub Actions | - | - |

## 快速启动

### 前置条件

- Docker Desktop 或 Docker Engine
- Docker Compose v2

```bash
# 检查环境
docker version
docker compose version
```

### 启动项目

```bash
cd examples/docker-cicd-deployment-week1-demo
docker compose up --build
```

### 访问

打开浏览器访问 **http://localhost:8080**

### 测试 API

```bash
# 健康检查
curl http://localhost:8080/api/health

# 欢迎消息
curl http://localhost:8080/api/message

# 获取部署记录
curl http://localhost:8080/api/deployments

# 新增部署记录
curl -X POST http://localhost:8080/api/deployments \
  -H "Content-Type: application/json" \
  -d '{"description":"测试部署记录"}'
```

### 查看状态

```bash
# 查看所有服务
docker compose ps

# 查看所有日志
docker compose logs

# 查看指定服务日志
docker compose logs backend
docker compose logs nginx
```

### 停止项目

```bash
# 停止（保留数据卷）
docker compose down

# 停止并删除数据卷（⚠️ 数据会丢失）
docker compose down -v
```

## 测试数据持久化

1. 访问 http://localhost:8080
2. 新增一条部署记录
3. 执行 `docker compose down`
4. 再次执行 `docker compose up`
5. 检查之前的部署记录是否仍然存在

> 普通 `docker compose down` 不删除 Volume，数据会保留。使用 `-v` 参数会删除 Volume。

## 本地开发（不使用 Docker）

```bash
# 终端 1：启动后端
cd backend
npm install
npm run dev

# 终端 2：启动前端
cd frontend
npm install
npm run dev
```

前端开发服务器运行在 http://localhost:5173，请求 `/api/*` 会自动代理到后端 `localhost:3001`。

## 架构说明

```
                    Docker Compose 网络
    ┌──────────────────────────────────────────┐
    │                                          │
    │  浏览器 :8080                             │
    │     │                                    │
    │     ▼                                    │
    │  ┌─────────────────────┐                 │
    │  │ Nginx (:80)         │                 │
    │  │ - / → frontend      │                 │
    │  │ - /api/ → backend   │                 │
    │  └──────┬──────────────┘                 │
    │         │                                  │
    │    ┌────┴──────────┐                      │
    │    │               │                      │
    │    ▼               ▼                      │
    │  ┌──────────┐  ┌──────────────┐           │
    │  │ Frontend │  │ Backend      │           │
    │  │ (Nginx)  │  │ (Express)    │           │
    │  │ :80      │  │ :3001        │           │
    │  └──────────┘  └────┬─────────┘           │
    │                     │                      │
    │                     ▼                      │
    │               ┌──────────────┐           │
    │               │ Volume       │           │
    │               │ blog-data    │           │
    │               │ (SQLite)     │           │
    │               └──────────────┘           │
    │                                          │
    └──────────────────────────────────────────┘
```

## CI/CD

CI 工作流（`.github/workflows/ci.yml`）在以下事件触发：

- 推送到 `main` 分支
- 创建 Pull Request

包含三个 Job：
- **frontend**: 安装依赖 + 构建
- **backend**: 安装依赖 + 启动服务健康检查
- **compose-check**: 校验 `docker-compose.yml` 语法

> CI 只进行构建和校验，不执行真实部署。部署需要在服务器上手动或通过额外的 CD 流程完成。

## 文件结构

```
docker-cicd-deployment-week1-demo
├── frontend/               # React + Vite 前端
│   ├── Dockerfile          # 多阶段构建（Node → Nginx）
│   ├── .dockerignore
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx        # 入口
│       └── App.jsx         # 主组件（调用 /api/health, /api/message, /api/deployments）
├── backend/                # Express + SQLite 后端
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── server.js           # API 服务（health, message, deployments CRUD）
│   └── data/               # SQLite 数据目录（运行时通过 Volume 挂载）
├── nginx/
│   └── default.conf        # 反向代理配置（/ → 前端，/api/ → 后端）
├── .github/workflows/
│   └── ci.yml              # GitHub Actions CI
├── docker-compose.yml      # 服务编排
├── .env.example            # 环境变量示例
├── .gitignore
└── README.md
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | 3001 | 后端服务端口 |
| `DATABASE_PATH` | /app/data/deployments.db | SQLite 数据库路径 |

> 后端启动时如果数据库不存在会自动创建。不要将 `.db` 文件打包进 Docker 镜像。

## 注意事项

- 当前环境未安装 Docker 时，配置文件仍然有效，可在安装 Docker 后按本 README 步骤验证
- `.env` 不应提交到仓库，使用 `.env.example` 展示配置结构
- `docker compose down -v` 会删除所有数据，谨慎使用
- 前端 Vite 开发代理（`/api → localhost:3001`）仅用于本地开发，Docker 环境中由 Nginx 代理
