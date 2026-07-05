# Docker 部署与 CI/CD 实践

> 📅 建议学习周期：1 周 | 🎯 目标读者：软件团队新人 | 📝 类型：培训参考文档

---

## 前言

本文档围绕 Docker 容器化部署、CI/CD 自动化流程、域名与 DNS 解析、Nginx 反向代理及 HTTPS 展开，帮助软件团队新人建立从"本地开发"到"线上访问"的完整认知。

**学习目标：**

- 建立对应用部署过程的整体认识
- 理解开发环境、测试环境和生产环境的区别
- 掌握 Docker 镜像、容器、Dockerfile 和 Docker Compose 的基础概念
- 理解前端、后端和数据库如何在服务器上协同运行
- 理解 CI/CD 的基本流程及其工程价值
- 掌握域名、DNS 解析、端口、Nginx、反向代理和 HTTPS 的基础知识
- 能够将一个简单的前后端项目容器化并完成本地部署验证
- 为后续博客项目上线和自动化发布打基础

> 建议配合配套 Demo `examples/docker-cicd-deployment-week1-demo` 边看文档边动手验证。

---

## 一、从"本地运行"到"线上访问"

### 1.1 三种环境

软件开发中至少存在三种运行环境：

| 环境 | 用途 | 访问者 | 典型特征 |
|------|------|--------|----------|
| **开发环境** | 开发者日常编写和调试代码 | 开发者本人 | `localhost`、热更新、详细报错 |
| **测试环境** | 验证功能是否正常、是否满足需求 | 测试人员、产品经理 | 接近生产的配置、测试数据 |
| **生产环境** | 面向真实用户提供服务 | 终端用户 | 稳定优先、关闭调试信息、HTTPS |

> **关键理解**：代码在本地能跑通 ≠ 代码能在生产环境稳定运行。三个环境在操作系统、依赖版本、网络条件、数据规模和安全配置上都可能不同。

### 1.2 本地访问 vs 线上访问

```
本地访问：
浏览器 → localhost:3000 → 本机运行的开发服务器

线上访问：
用户浏览器 → 域名 → DNS 解析 → 公网 IP → 服务器 → Web 服务器 → 应用服务 → 数据库
```

本地开发时，所有服务都在同一台机器上，通过 `localhost` 直接通信。线上部署时，每个环节都是独立组件，任何一个出问题都会导致访问失败。

### 1.3 应用上线需要哪些资源

一个典型的 Web 应用上线至少需要以下资源：

```
源代码 → 构建产物 → 运行环境 → 服务器 → 公网 IP → 端口 → 域名 → DNS → Web 服务器 → HTTPS 证书
```

| 资源 | 作用 | 说明 |
|------|------|------|
| 源代码 | 应用的原始代码 | 开发阶段的产物 |
| 构建产物 | 编译、打包后的可部署文件 | React 项目 `npm run build` 后的 `dist/` |
| 运行环境 | Node.js、Python 等运行时 | 服务器上需要安装对应版本 |
| 服务器 | 提供计算和网络资源 | 云服务器或物理服务器 |
| 公网 IP | 让互联网上的用户能够找到服务器 | 云服务器通常会分配一个公网 IP |
| 端口 | 区分同一台服务器上的不同服务 | 80(HTTP)、443(HTTPS)、3000(开发) |
| 域名 | 用可读名称代替 IP 地址 | `example.com` |
| DNS | 将域名解析为 IP 地址 | 互联网的电话簿 |
| Web 服务器 | 接收 HTTP 请求并分发 | Nginx、Apache |
| HTTPS 证书 | 加密通信、验证身份 | 通过 CA 申请 |

### 1.4 以个人博客为例的完整流程

```
用户输入 https://blog.example.com
  → 浏览器查询 DNS：blog.example.com 对应的 IP 是什么？
    → DNS 返回：服务器公网 IP（如 123.45.67.89）
      → 浏览器向 123.45.67.89:443 发起 HTTPS 请求
        → 服务器 Nginx 接收请求
          → / → 返回前端静态页面（React 构建产物）
          → /api/ → 转发给后端服务（Node.js/Python）
            → 后端查询数据库 → 返回 JSON
              → Nginx 将响应返回给浏览器
                → 浏览器渲染页面
```

> 先理解整体流程，再进入具体工具。不要一开始就陷入 Docker 命令的细节。

---

## 二、服务器与部署基础

### 2.1 服务器是什么

服务器本质上是一台持续运行、对外提供服务的计算机。它可以是：

- **物理服务器**：真实的硬件设备，部署在数据中心
- **云服务器**：云厂商通过虚拟化技术提供的虚拟机（如阿里云 ECS、AWS EC2）
- **VPS**：虚拟专用服务器，云服务器的一种形式

对于个人博客或小型项目，租用一台云服务器是常见做法。

### 2.2 公网 IP 与内网 IP

| 类型 | 范围 | 能否从互联网直接访问 |
|------|------|---------------------|
| **公网 IP** | 全球唯一 | ✅ 能 |
| **内网 IP** | 局域网内唯一 | ❌ 不能（需要 NAT/端口映射） |

> 云服务器会同时拥有公网 IP 和内网 IP。部署应用时需要绑定公网 IP 或使用内网 IP 配合负载均衡。

### 2.3 端口的作用

端口号用于在一台主机上区分不同的服务：

```
同一台服务器：
  80 端口   → Nginx（HTTP）
  443 端口  → Nginx（HTTPS）
  3001 端口 → 后端 API 服务
  3306 端口 → MySQL 数据库
```

一台服务器只有一个 IP 地址，但可以有 65535 个端口。每个端口同时只能被一个程序监听。

### 2.4 localhost、127.0.0.1、0.0.0.0

| 地址 | 含义 | 访问范围 |
|------|------|----------|
| `localhost` | 本机主机名，等价于 `127.0.0.1` | 仅本机 |
| `127.0.0.1` | IPv4 回环地址，数据不经过网卡 | 仅本机 |
| `0.0.0.0` | 监听本机所有网络接口 | 本机 + 局域网 + 公网 |

> **常见问题**：应用监听 `127.0.0.1:3001` 时，外部无法访问，因为请求被限制在本机。Docker 容器中的服务需要监听 `0.0.0.0` 才能让宿主机或其他容器访问。

### 2.5 为什么后端启动了但浏览器访问不了

| 原因 | 说明 | 排查方式 |
|------|------|----------|
| 应用只监听 `127.0.0.1` | 外部请求被拒绝 | 检查监听地址 |
| 云服务器安全组未开放端口 | 防火墙拦截 | 检查安全组规则 |
| Docker 容器未做端口映射 | 宿主机端口未绑定 | `docker ps` 查看端口映射 |
| Nginx 未正确转发 | 反向代理配置错误 | 检查 Nginx 配置和日志 |
| 服务实际未启动 | 进程崩溃或端口冲突 | `docker logs` 或直接查看进程 |

### 2.6 防火墙与安全组

- **防火墙**：操作系统层面的网络访问控制（如 iptables、ufw）
- **安全组**：云服务商提供的虚拟防火墙，在云服务器外层控制流量

> 部署 Web 应用时，至少需要开放 80（HTTP）和 443（HTTPS）端口。其他端口（如数据库 3306）不应向公网开放。

---

## 三、为什么需要 Docker

### 3.1 Docker 是什么

Docker 是一个容器化平台，可以将应用及其依赖打包成一个标准化的单元（容器），在任何支持 Docker 的环境中运行。

### 3.2 Docker 解决了什么问题

**经典困境**："在我电脑上能运行啊。"

开发环境是 Windows + Node 20，生产服务器是 Ubuntu + Node 18。本地可以运行，部署到服务器后却报错——依赖缺失、版本不兼容、系统库不同……Docker 通过将应用和运行环境一起打包来解决这个问题。

### 3.3 Docker 与虚拟机的区别

| 对比维度 | Docker 容器 | 虚拟机 |
|----------|------------|--------|
| 虚拟化层级 | 操作系统级 | 硬件级 |
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | MB 级 | GB 级 |
| 隔离性 | 进程隔离 | 完全隔离 |
| 内核 | 共享宿主机内核 | 独立内核 |

> Docker 容器不是轻量级虚拟机。容器是宿主机上的隔离进程，共享同一个操作系统内核。

### 3.4 核心概念

| 概念 | 定义 | 类比 |
|------|------|------|
| **Dockerfile** | 定义镜像构建步骤的文本文件 | 制作说明书 / 菜谱 |
| **镜像 (Image)** | 包含应用及其运行环境的只读模板 | 已经打包好的模板 |
| **容器 (Container)** | 镜像的运行实例，拥有可写层 | 模板启动后的运行实例 |
| **仓库 (Registry)** | 存储和分发镜像的服务 | 存放镜像的平台 |
| **数据卷 (Volume)** | 独立于容器生命周期的持久存储 | 外接硬盘 |
| **网络 (Network)** | 容器间的虚拟网络 | 内部局域网 |

> **关键理解**：镜像是只读模板，容器是镜像的运行实例。一个镜像可以启动多个容器，就像同一个程序可以打开多个窗口。

---

## 四、Docker 镜像与容器

### 4.1 常用命令

| 命令 | 作用 | 影响对象 |
|------|------|----------|
| `docker version` | 查看 Docker 版本信息 | 无 |
| `docker images` | 列出本地所有镜像 | 无（只读） |
| `docker ps` | 列出运行中的容器 | 无（只读） |
| `docker ps -a` | 列出所有容器（含已停止） | 无（只读） |
| `docker pull <镜像>` | 从仓库拉取镜像 | 镜像 |
| `docker run <镜像>` | 创建并启动容器 | 容器 |
| `docker stop <容器>` | 停止运行中的容器 | 容器 |
| `docker start <容器>` | 启动已停止的容器 | 容器 |
| `docker restart <容器>` | 重启容器 | 容器 |
| `docker rm <容器>` | 删除容器 | 容器 |
| `docker rmi <镜像>` | 删除镜像 | 镜像 |
| `docker logs <容器>` | 查看容器日志 | 无（只读） |
| `docker exec <容器> <命令>` | 在容器内执行命令 | 容器 |

### 4.2 `docker run` 详解

```bash
docker run -d -p 8080:80 --name web-demo nginx
```

| 参数 | 含义 | 说明 |
|------|------|------|
| `-d` | 后台运行（detach） | 不占用终端 |
| `-p 8080:80` | 端口映射 | 宿主机 8080 → 容器 80 |
| `--name web-demo` | 给容器命名 | 便于后续操作 |
| `nginx` | 使用的镜像 | 从 Docker Hub 拉取 |

> **宿主机端口 vs 容器端口**：`-p 8080:80` 表示将宿主机的 8080 端口映射到容器的 80 端口。外部访问 `localhost:8080` 时，流量会被转发到容器内的 80 端口。

### 4.3 必须记住的规则

- 删除容器 ≠ 删除镜像（`docker rm` 只删容器）
- 停止容器 ≠ 删除容器（`docker stop` 后容器仍存在，可 `docker start` 恢复）
- 同一宿主机端口不能同时绑定多个服务
- 排查问题时第一反应：`docker ps` 看状态，`docker logs` 看日志
- `docker run` 每次都会创建新容器，想重新进入之前的容器用 `docker start` + `docker exec`

---

## 五、Dockerfile 基础

### 5.1 Dockerfile 是什么

Dockerfile 是一个文本文件，包含一系列指令，用于定义如何构建 Docker 镜像。每条指令在镜像中创建一个新的层。

### 5.2 常见指令

| 指令 | 作用 | 示例 |
|------|------|------|
| `FROM` | 指定基础镜像 | `FROM node:20-alpine` |
| `WORKDIR` | 设置工作目录 | `WORKDIR /app` |
| `COPY` | 从宿主机复制文件到镜像 | `COPY . .` |
| `RUN` | 在构建时执行命令 | `RUN npm install` |
| `ENV` | 设置环境变量 | `ENV PORT=3001` |
| `EXPOSE` | 声明容器监听的端口 | `EXPOSE 3001` |
| `CMD` | 容器启动时的默认命令 | `CMD ["npm", "start"]` |
| `ENTRYPOINT` | 容器启动时的入口程序 | `ENTRYPOINT ["node"]` |

### 5.3 一个简单的 Node.js 后端 Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

**逐行解释：**

1. `FROM node:20-alpine` — 以 Node.js 20 的 Alpine 轻量版为基础镜像
2. `WORKDIR /app` — 设置工作目录，后续操作都在 `/app` 下执行
3. `COPY package*.json ./` — 先复制依赖清单文件
4. `RUN npm install` — 安装依赖
5. `COPY . .` — 复制其余源代码
6. `EXPOSE 3001` — 声明容器内服务监听 3001 端口
7. `CMD ["npm", "start"]` — 容器启动时执行的命令

### 5.4 为什么先复制 package.json

Docker 构建镜像是逐层进行的，每一层有缓存。如果 `package.json` 没变，`RUN npm install` 就会命中缓存，跳过安装，大幅缩短构建时间。如果先 `COPY . .` 再 `RUN npm install`，任何代码修改都会导致缓存失效。

### 5.5 `.dockerignore`

类似于 `.gitignore`，告诉 Docker 构建时忽略某些文件：

```text
node_modules
npm-debug.log
.git
.env
data/*.db
dist
```

> `node_modules` 不应打包进镜像——它体积大且可能与容器内的系统环境不兼容。`.env` 可能包含敏感信息，也不应进入镜像。

### 5.6 EXPOSE 与端口映射的区别

- `EXPOSE 3001` — **文档性质**，声明容器可能监听的端口，不实际映射
- `-p 8080:3001` — **实际映射**，将宿主机端口绑定到容器端口

> 即使写了 `EXPOSE 3001`，没有 `-p` 参数，宿主机仍然无法直接访问容器端口。

---

## 六、前端 React 项目的容器化

### 6.1 React 项目的两个阶段

React（Vite）项目部署需要两个阶段：

1. **构建阶段**：使用 Node.js 运行 `npm run build`，生成 `dist/` 目录
2. **运行阶段**：使用 Web 服务器（Nginx）提供静态文件

### 6.2 多阶段构建

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
```

**解释：**

- **第一阶段（builder）**：在 Node.js 环境中安装依赖并构建项目
- **第二阶段（运行）**：使用轻量的 Nginx 镜像，只复制构建产物
- `--from=builder` 从构建阶段提取文件
- 最终镜像只包含 Nginx + 静态文件，不包含 Node.js 和 `node_modules`

> **优势**：最终镜像体积小、攻击面小、启动快。一个完整的 Node.js 开发环境可能几百 MB，Nginx Alpine 只有几十 MB。

### 6.3 SPA 路由刷新 404 问题

React 使用前端路由（如 `/articles`、`/about`），但这些路径在服务器上并不存在对应文件。用户直接访问或刷新 `/articles` 时，Nginx 会尝试查找 `articles` 文件，找不到就返回 404。

**解决方案** — Nginx 配置 SPA 回退：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

当请求的文件不存在时，回退到 `index.html`，由 React Router 接管路由。

---

## 七、后端项目的容器化

### 7.1 Node.js 后端镜像

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### 7.2 启动容器

```bash
docker build -t blog-api .
docker run -d \
  --name blog-api \
  -p 3001:3001 \
  -e PORT=3001 \
  blog-api
```

| 参数 | 作用 |
|------|------|
| `-t blog-api` | 给镜像打标签（名称） |
| `-e PORT=3001` | 注入环境变量 |
| `-p 3001:3001` | 端口映射 |

### 7.3 环境变量管理

后端配置不应该写死在代码中。通过环境变量注入，同一个镜像可以在不同环境使用不同配置：

```javascript
const port = process.env.PORT || 3001;
const dbPath = process.env.DATABASE_PATH || './data/blog.db';
```

### 7.4 数据持久化与 Volume

容器删除后，容器内的所有文件（包括数据库）都会丢失。Volume 将宿主机的目录或 Docker 管理的存储挂载到容器内，使数据独立于容器生命周期。

```bash
docker run -d \
  --name blog-api \
  -p 3001:3001 \
  -v blog-data:/app/data \
  blog-api
```

- `-v blog-data:/app/data` — 将名为 `blog-data` 的 Volume 挂载到容器内的 `/app/data`
- 删除容器后 Volume 仍然保留
- 新容器可以挂载同一个 Volume 恢复数据

> **原则**：容器生命周期和数据生命周期应该分离。容器应该被视为"可丢弃的"，重要数据必须通过 Volume 持久化。

### 7.5 容器中的监听地址

Docker 容器中的服务必须监听 `0.0.0.0`，而不是 `127.0.0.1`：

```javascript
// ✅ 正确：允许容器外部访问
app.listen(port, '0.0.0.0');

// ❌ 错误：仅容器内部本机可访问
app.listen(port, '127.0.0.1');
```

---

## 八、Docker Compose 基础

### 8.1 Docker Compose 是什么

Docker Compose 是一个用于定义和运行多容器 Docker 应用的工具。通过一个 YAML 文件配置所有服务，一条命令即可启动整个应用栈。

### 8.2 为什么需要 Compose

单容器应用用 `docker run` 足够。但当前后端 + 数据库 + Nginx 组合时，手动管理多个容器的网络、卷和启动顺序非常繁琐。Compose 用一个文件描述所有服务的配置和关系。

### 8.3 常用命令

| 命令 | 作用 |
|------|------|
| `docker compose up` | 启动所有服务 |
| `docker compose up --build` | 重新构建镜像并启动 |
| `docker compose up -d` | 后台启动 |
| `docker compose down` | 停止并删除容器和网络 |
| `docker compose down -v` | 同时删除 Volume（⚠️ 会丢失数据） |
| `docker compose logs` | 查看所有服务日志 |
| `docker compose logs <服务名>` | 查看指定服务日志 |
| `docker compose ps` | 查看服务状态 |
| `docker compose restart` | 重启所有服务 |

### 8.4 Compose 文件示例

```yaml
services:
  frontend:
    build: ./frontend

  backend:
    build: ./backend
    environment:
      PORT: 3001
      DATABASE_PATH: /app/data/blog.db
    volumes:
      - blog-data:/app/data

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - frontend
      - backend

volumes:
  blog-data:
```

### 8.5 关键字段解释

| 字段 | 作用 |
|------|------|
| `services` | 定义所有服务 |
| `build` | 从指定目录的 Dockerfile 构建镜像 |
| `image` | 直接使用已有镜像（不从 Dockerfile 构建） |
| `ports` | 宿主机端口:容器端口映射 |
| `environment` | 注入环境变量 |
| `volumes` | 挂载 Volume 或宿主机目录 |
| `depends_on` | 声明启动依赖顺序 |

### 8.6 服务名即主机名

Compose 会为所有服务创建一个默认网络。在这个网络中，**服务名可以直接作为主机名**使用：

```nginx
# Nginx 中使用服务名访问后端
location /api/ {
  proxy_pass http://backend:3001;
}
```

`backend` 不是 IP 地址，是 Compose 中的服务名，Docker 内部 DNS 会自动解析。

### 8.7 注意事项

- `depends_on` 只保证启动顺序，不保证服务已完全就绪（应用可能需要几秒才能接受请求）
- 不要在配置中写入真实密钥，使用 `.env` 文件和环境变量
- 使用 `.env.example` 展示配置结构，不包含真实值
- `docker compose down -v` 会删除 Volume 数据，谨慎使用

---

## 九、Nginx 与反向代理

### 9.1 Nginx 是什么

Nginx 是一个高性能的 HTTP 服务器和反向代理服务器。在 Web 部署中，它通常承担两个角色：

- **静态资源服务器**：直接提供 HTML、CSS、JS 等静态文件
- **反向代理服务器**：将请求转发给后端服务，并将响应返回给客户端

### 9.2 反向代理 vs 正向代理

| 类型 | 为谁服务 | 典型场景 |
|------|----------|----------|
| **正向代理** | 客户端 | 科学上网、企业内网访问外网 |
| **反向代理** | 服务端 | Nginx 转发请求到后端、负载均衡 |

> 反向代理的核心价值：客户端不需要知道后端服务的真实地址，所有请求统一经过 Nginx。

### 9.3 统一入口

通过 Nginx，前端和后端可以使用同一个域名：

```nginx
server {
  listen 80;

  location / {
    proxy_pass http://frontend;
  }

  location /api/ {
    proxy_pass http://backend:3001;
  }
}
```

**请求流转：**

```
浏览器访问 /api/posts
  → Nginx 接收请求（80 端口）
    → 匹配 location /api/
      → 转发给 backend:3001
        → 后端处理并返回 JSON
          → Nginx 将 JSON 返回给浏览器
```

### 9.4 为什么前端请求 /api 可以减少跨域配置

如果前端直接请求后端的不同端口（如 `localhost:3001`），浏览器会因为**同源策略**触发跨域限制。通过 Nginx 代理，前端请求 `/api` 时，浏览器认为目标与页面同源，不存在跨域问题。

### 9.5 proxy_pass 路径注意事项

```nginx
# 请求 /api/posts → 转发到 http://backend:3001/api/posts
location /api/ {
  proxy_pass http://backend:3001;
}

# 请求 /api/posts → 转发到 http://backend:3001/posts（注意末尾 /）
location /api/ {
  proxy_pass http://backend:3001/;
}
```

> `proxy_pass` 末尾的 `/` 会影响路径拼接方式，配置时需要特别注意。

### 9.6 修改配置后

```bash
# 检查语法
nginx -t

# 重新加载配置（不中断服务）
nginx -s reload
```

---

## 十、域名基础

### 10.1 域名是什么

域名是 IP 地址的别名，让用户用可读名称访问网站，而不是记忆数字 IP。

### 10.2 域名结构

```
blog.example.com
 ─┬─  ───┬─── ─┬─
  │      │     └─ 顶级域名 (TLD)
  │      └─────── 二级域名（主域名）
  └────────────── 子域名
```

| 层级 | 示例 | 说明 |
|------|------|------|
| 顶级域名 (TLD) | `.com`、`.cn`、`.org` | 最高层级 |
| 二级域名 | `example.com` | 你注册的域名 |
| 子域名 | `blog.example.com` | 自主创建的子域名 |

### 10.3 不同子域名指向不同服务

```
example.com       → 官网首页
blog.example.com  → 个人博客
api.example.com   → 后端 API
admin.example.com → 管理后台
```

### 10.4 重要区分

| 概念 | 是否同一件事 | 说明 |
|------|-------------|------|
| 购买域名 | ❌ ≠ 有服务器 | 域名只是名字，需要在 DNS 中指向服务器 IP |
| 配置 DNS | ❌ ≠ 部署完成 | DNS 指向服务器后，服务器上还需要运行应用 |
| 有服务器 | ❌ ≠ 网站可访问 | 还需要部署应用、配置 Nginx、开放端口 |

> **域名只是访问入口，不会自动部署项目。** 购买域名、配置 DNS、部署服务器是三个独立步骤。

---

## 十一、DNS 与域名解析

### 11.1 DNS 的作用

DNS（Domain Name System）是互联网的"电话簿"，负责将域名转换为 IP 地址。

### 11.2 解析过程

```
用户输入 blog.example.com
  → 浏览器检查本地缓存
    → 操作系统检查 hosts 文件
      → 查询本地 DNS 服务器（路由器/运营商）
        → 递归查询根域名服务器
          → .com 顶级域名服务器
            → example.com 权威 DNS 服务器
              → 返回 blog.example.com 的 IP 地址
```

### 11.3 DNS 记录类型

| 记录类型 | 作用 | 常见场景 | 填写内容 |
|----------|------|----------|----------|
| **A** | 域名指向 IPv4 地址 | 网站服务器 | IP 地址（如 `123.45.67.89`） |
| **AAAA** | 域名指向 IPv6 地址 | IPv6 网站 | IPv6 地址 |
| **CNAME** | 域名指向另一个域名 | CDN、平台托管 | 域名（如 `example.github.io`） |
| **MX** | 邮件服务器记录 | 企业邮箱 | 邮件服务器域名 |
| **TXT** | 文本验证信息 | 域名验证、SPF | 验证字符串 |
| **NS** | 指定权威 DNS 服务器 | DNS 托管 | DNS 服务器域名 |

### 11.4 实际示例

```
博客部署在云服务器（IP: 123.45.67.89）：
  blog.example.com → A 记录 → 123.45.67.89

博客托管在 GitHub Pages：
  www.example.com → CNAME → username.github.io
```

### 11.5 DNS 缓存与 TTL

- **TTL（Time To Live）**：DNS 记录的缓存时间（秒）
- DNS 修改后不会立即在全球生效，最长需要等待 TTL 过期
- 本地 DNS 缓存（浏览器 + 操作系统 + 路由器）可能导致看到旧结果
- `nslookup blog.example.com` 可以查询当前解析结果

> 配置域名后发现不能马上访问是正常现象，等待几分钟到几小时不等。

### 11.6 记录选择建议

- A 记录通常填写 IPv4 地址
- CNAME 通常填写另一个域名
- 根域名（`example.com`）能否使用 CNAME 取决于 DNS 服务商是否支持（如 Cloudflare 的 CNAME Flattening）

---

## 十二、从域名访问到页面展示的完整流程

### 12.1 完整串联

```
用户在浏览器输入 https://blog.example.com
  ┌─ 1. DNS 解析
  │   浏览器缓存 → hosts → 本地 DNS → 根 DNS → 权威 DNS
  │   → 获得服务器 IP：123.45.67.89
  │
  ├─ 2. 建立 TCP 连接
  │   浏览器与 123.45.67.89:443 三次握手
  │
  ├─ 3. TLS 握手
  │   验证证书、协商加密密钥
  │
  ├─ 4. 发送 HTTPS 请求
  │   请求到达服务器 443 端口
  │
  ├─ 5. Nginx 处理
  │   / → 返回前端静态资源（HTML/CSS/JS）
  │   /api/ → 转发给后端服务
  │
  ├─ 6. 后端处理
  │   接收请求 → 查询数据库 → 返回 JSON
  │
  └─ 7. 浏览器渲染
      解析 HTML → 加载 CSS/JS → 渲染页面
```

### 12.2 层次划分

| 层次 | 负责的事情 | 相关技术 |
|------|-----------|----------|
| DNS 层 | 域名 → IP | DNS、A 记录、CNAME |
| 网络层 | 数据传输 | TCP/IP、TLS |
| Web 服务层 | 请求分发、静态文件 | Nginx、Apache |
| 应用层 | 业务逻辑 | Node.js、Python、数据库 |
| 渲染层 | 页面展示 | 浏览器、React |

> 此流程与《网络基础与 Web 渲染原理》中的知识形成衔接：DNS 解析对应网络层，浏览器渲染对应渲染层。

---

## 十三、HTTPS 与证书基础

### 13.1 HTTP vs HTTPS

| 对比 | HTTP | HTTPS |
|------|------|-------|
| 加密 | ❌ 明文传输 | ✅ TLS 加密 |
| 端口 | 80 | 443 |
| 证书 | 不需要 | 需要 CA 签发证书 |
| URL 前缀 | `http://` | `https://` |
| 浏览器标识 | 不安全警告 | 🔒 安全锁 |

### 13.2 HTTPS 解决什么问题

- **加密**：防止中间人窃听通信内容
- **身份验证**：确认访问的是真实网站，不是伪造的
- **数据完整性**：防止传输过程中数据被篡改

### 13.3 证书相关概念

| 概念 | 说明 |
|------|------|
| **CA** | 证书颁发机构，受浏览器信任的第三方 |
| **域名证书** | 证明你对某个域名拥有控制权 |
| **证书有效期** | 通常 90 天，到期需要续期 |
| **证书链** | 服务器证书 → 中间证书 → 根证书 |

### 13.4 部署流程

```
域名解析到服务器
  → 确认 80/443 端口可访问
    → 使用 ACME 协议申请证书（如 Certbot）
      → 配置 Nginx 使用证书
        → HTTP 自动重定向到 HTTPS
          → 设置证书自动续期
```

### 13.5 Nginx HTTPS 配置示例

```nginx
server {
  listen 80;
  server_name blog.example.com;

  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl;
  server_name blog.example.com;

  ssl_certificate     /path/to/fullchain.pem;
  ssl_certificate_key /path/to/privkey.pem;

  location / {
    proxy_pass http://frontend;
  }
}
```

> ⚠️ 证书私钥（`privkey.pem`）绝不能提交到代码仓库。实践 Demo 中不要求真实申请证书，了解流程即可。

---

## 十四、CI/CD 基础

### 14.1 什么是 CI/CD

| 概念 | 全称 | 含义 |
|------|------|------|
| **CI** | 持续集成 | 代码频繁合并到主干，自动进行构建和测试 |
| **CD** | 持续交付 | 代码随时可以安全部署到生产环境 |
| **CD** | 持续部署 | 通过测试的代码自动部署到生产环境 |

### 14.2 为什么需要 CI/CD

手动部署的问题：
- 忘记运行测试
- 构建环境不一致
- 手动操作容易出错
- 部署步骤不可追溯
- 回滚困难

CI/CD 让这些步骤自动化、可重复、可追溯。

### 14.3 典型 CI/CD 流程

```
开发者提交代码 (git push)
  → Git 仓库触发工作流
    → 安装依赖 (npm ci)
      → 代码检查 (lint)
        → 运行测试 (test)
          → 构建项目 (build)
            → 构建 Docker 镜像
              → 推送镜像到仓库
                → 部署到服务器
                  → 健康检查
```

> CI/CD 是一个理念和流程，不是某一个具体工具。GitHub Actions、GitLab CI、Jenkins 都是实现 CI/CD 的工具。

### 14.4 关键原则

- 自动部署前必须保证自动测试和构建通过
- 构建失败后不应继续部署
- 生产部署需要权限控制和密钥管理
- 自动化不等于忽略人工审核

---

## 十五、GitHub Actions 基础

### 15.1 核心概念

| 概念 | 说明 |
|------|------|
| **workflow** | 工作流，定义自动化流程的 YAML 文件 |
| **job** | 工作流中的一个任务，包含多个 step |
| **step** | 任务中的一个步骤，执行具体命令 |
| **runner** | 执行工作流的虚拟机 |
| **trigger** | 触发工作流的事件（push、PR 等） |
| **secret** | 加密存储的敏感信息（密钥、Token） |
| **artifact** | 工作流产生的文件（构建产物等） |
| **cache** | 缓存依赖，加速后续运行 |

### 15.2 基础 CI 示例

```yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
```

### 15.3 配置说明

- `on.push.branches: [main]` — 推送到 main 分支时触发
- `on.pull_request` — 创建 PR 时触发
- `runs-on: ubuntu-latest` — 使用最新 Ubuntu 虚拟机
- `uses: actions/checkout@v4` — 检出仓库代码
- `npm ci` — 严格按照 `package-lock.json` 安装依赖（比 `npm install` 更快更严格）

> 如果项目没有 `lint` 脚本，不要生成无法执行的 `npm run lint` 命令。CI 配置必须与实际项目脚本一致。

---

## 十六、Docker 镜像自动构建

### 16.1 CI 中构建 Docker 镜像

```yaml
name: Build and Push Docker Images

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Login to Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_TOKEN }}

      - name: Build and Push Frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ghcr.io/username/blog-frontend:latest

      - name: Build and Push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ghcr.io/username/blog-backend:latest
```

### 16.2 镜像标签建议

| 标签策略 | 示例 | 说明 |
|----------|------|------|
| `latest` | `blog-api:latest` | 最新版本，但不是最可靠 |
| 提交哈希 | `blog-api:abc123` | 精确对应某次提交 |
| 版本号 | `blog-api:v1.2.0` | 对应发布版本 |

> `latest` 标签很方便，但不应在生产环境盲目使用。建议同时使用提交哈希或语义化版本号，以便明确知道部署了哪个版本。

### 16.3 安全要求

- 镜像仓库地址使用占位符，不要写入真实地址
- 用户名和 Token 通过 GitHub Secrets 传入
- Secrets 名称推荐：`REGISTRY_USERNAME`、`REGISTRY_TOKEN`
- 不要在 YAML 中写入真实账号或密码

---

## 十七、自动部署基础与安全边界

### 17.1 自动部署的常见方式

| 方式 | 说明 | 适用场景 |
|------|------|----------|
| 服务器拉取镜像 | CI 推送镜像后，服务器拉取并重启 | 单服务器 |
| SSH 通知更新 | CI 通过 SSH 在服务器上执行更新脚本 | 有 SSH 权限的服务器 |
| 托管平台 | Vercel、Netlify 等平台自动部署 | 前端项目、Serverless |
| 容器编排 | Kubernetes、Docker Swarm | 大规模集群 |

### 17.2 安全边界

> ⚠️ 以下事项必须严格遵守：

- SSH 私钥不能写进代码仓库
- 服务器地址和账号应通过 GitHub Secrets 管理
- 自动部署账号应遵循**最小权限原则**
- 生产数据库不能在每次部署时被覆盖
- 部署失败时需要能够快速回滚
- 部署后必须做健康检查
- 自动化部署不等于可以忽略人工审核

### 17.3 实践建议

对于入门阶段，建议：
1. 只构建并推送镜像，不直接连接服务器
2. 提供手动触发的部署工作流模板
3. 使用注释说明需要自行配置的 Secrets
4. 默认关闭真实部署，避免误操作

---

## 十八、环境变量与敏感信息管理

### 18.1 不同环境下的配置管理

| 方式 | 用途 | 安全性 |
|------|------|--------|
| `.env` | 本地开发配置 | ❌ 不应提交到仓库 |
| `.env.example` | 展示配置结构（不含真实值） | ✅ 可以提交 |
| CI Secrets | CI 工作流中的敏感信息 | ✅ 加密存储 |
| 服务器环境变量 | 生产环境的实际配置 | ✅ 由运维管理 |

### 18.2 前端 vs 后端环境变量

| 类型 | 注入时机 | 可见性 |
|------|----------|--------|
| **后端环境变量** | 运行时注入 | 仅服务端可见 |
| **前端环境变量** | 构建时注入 | 可能暴露在浏览器中 |

> ⚠️ 前端构建时注入的变量最终可能被浏览器看到。**绝对不能将数据库密码、私钥或后端密钥放在前端环境变量中。**

### 18.3 .env 示例

```env
# ✅ 可以提交的 .env.example
PORT=3001
DATABASE_PATH=/app/data/blog.db

# ❌ 绝不能提交的 .env
DATABASE_PASSWORD=my_secret_password
JWT_SECRET=super_secret_key
```

### 18.4 日志安全

日志中也不应打印敏感信息：

```javascript
// ❌ 危险
console.log('Connected with password:', password);

// ✅ 安全
console.log('Database connected successfully');
```

---

## 十九、部署后的日志、监控与健康检查

### 19.1 服务启动 ≠ 服务可用

容器状态显示 `running` 不代表应用已完全就绪。应用可能正在初始化数据库连接、加载配置或预热缓存。

### 19.2 日志查看

| 日志类型 | 命令 | 用途 |
|----------|------|------|
| 容器日志 | `docker compose logs <服务名>` | 应用启动和运行日志 |
| Nginx 访问日志 | 容器内 `/var/log/nginx/access.log` | 每个请求的记录 |
| Nginx 错误日志 | 容器内 `/var/log/nginx/error.log` | 代理或配置错误 |
| 系统日志 | `docker stats` | CPU、内存、网络使用 |

### 19.3 健康检查接口

建议后端提供一个轻量级健康检查端点：

```text
GET /api/health
```

返回：

```json
{
  "success": true,
  "message": "Service is healthy"
}
```

**设计原则：**

- 健康检查不应执行耗时操作
- 可以根据实际需要检查数据库连接状态
- 日志不能泄露密码、Token 和用户敏感数据
- 返回状态码 200 表示服务正常

### 19.4 Docker Compose 健康检查

```yaml
backend:
  build: ./backend
  healthcheck:
    test: ["CMD", "wget", "--spider", "http://localhost:3001/api/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```

---

## 二十、常见部署问题与排查方法

### 20.1 问题排查表

| 问题 | 可能原因 | 排查方式 |
|------|----------|----------|
| 容器启动后立即退出 | 启动命令错误或应用崩溃 | `docker logs <容器>` |
| 浏览器访问不到 | 端口未映射 | `docker ps` 检查 PORTS |
| 云服务器无法访问 | 安全组未开放端口 | 检查服务器防火墙/安全组规则 |
| 接口返回 502 | 后端未启动或代理配置错误 | 检查 Nginx 日志和后端状态 |
| 前端刷新后 404 | SPA 回退未配置 | 检查 `try_files` 配置 |
| 数据重启后消失 | 未挂载 Volume | 检查 `volumes` 配置 |
| 域名不生效 | DNS 配置或缓存问题 | `nslookup` 检查记录和 TTL |
| HTTPS 报错 | 证书过期或域名不匹配 | 检查证书配置和有效期 |
| CI 构建失败 | 依赖、脚本或环境不一致 | 查看工作流日志 |
| 镜像过大 | 构建内容过多 | 使用多阶段构建和 `.dockerignore` |
| 修改代码后页面没变化 | 使用了旧镜像或缓存 | 重新构建镜像并确认标签 |
| 容器之间无法通信 | 网络或服务名错误 | 检查 Compose 服务配置 |

### 20.2 排查顺序

```
服务是否启动（docker ps）
  → 端口是否监听（netstat / docker port）
    → 端口是否映射（docker ps PORTS 列）
      → 防火墙是否放行（安全组规则）
        → Nginx 是否正常（docker logs nginx）
          → 后端接口是否正常（curl /api/health）
            → DNS 是否正确（nslookup）
              → HTTPS 是否正确（证书检查）
```

### 20.3 502 与 404 与 500

| 状态码 | 含义 | 常见原因 |
|--------|------|----------|
| **404** | 资源不存在 | 路由问题、SPA 回退未配置 |
| **502** | 网关错误 | 上游服务（后端）未启动或无法连接 |
| **500** | 服务器内部错误 | 应用代码异常、数据库连接失败 |

---

## 二十一、必须记住的规则

- 本地可以运行不代表线上一定可以运行
- 镜像是只读模板，容器是运行实例
- Dockerfile 定义镜像构建过程
- 容器中的重要数据需要通过 Volume 持久化
- `EXPOSE` 不等于完成宿主机端口映射，仍需 `-p` 参数
- React 项目通常需要先构建，再由 Web 服务器提供静态文件
- Nginx 既可以提供静态资源，也可以反向代理 API
- 域名需要通过 DNS 解析到服务器或托管平台
- A 记录指向 IPv4 地址，CNAME 指向另一个域名
- HTTPS 需要域名证书和正确的服务器配置
- CI 用于自动检查和构建，CD 用于自动交付或部署
- 敏感信息必须通过环境变量或 Secrets 管理
- 自动部署前必须保证构建和测试通过
- 排查部署问题时，应同时检查应用日志、容器状态、端口和网络
- 删除容器不等于删除镜像；删除 Volume 会删除数据
- 部署后需要验证：访问页面、测试 API、检查日志

---

## 二十二、容易混淆的概念

| 概念 A | 概念 B | 核心区别 |
|--------|--------|----------|
| **镜像** | **容器** | 镜像是模板（只读），容器是运行实例（可写） |
| **Dockerfile** | **Docker Compose** | Dockerfile 定义单个镜像如何构建；Compose 定义多个服务如何协作 |
| **EXPOSE** | **ports** | EXPOSE 是文档性声明；ports 是实际的端口映射 |
| **Volume** | **容器内部目录** | Volume 独立于容器生命周期；容器内目录随容器删除而消失 |
| **开发环境** | **生产环境** | 开发环境追求便利（热更新、详细报错）；生产环境追求稳定（关闭调试、HTTPS） |
| **公网 IP** | **内网 IP** | 公网 IP 全球唯一、可被互联网访问；内网 IP 仅局域网可见 |
| **域名** | **IP** | 域名是可读的名字；IP 是数字地址。域名通过 DNS 解析为 IP |
| **A 记录** | **CNAME** | A 记录指向 IP 地址；CNAME 指向另一个域名 |
| **DNS 解析** | **Nginx 转发** | DNS 解决"去哪台服务器"的问题；Nginx 解决"到服务器后交给谁"的问题 |
| **正向代理** | **反向代理** | 正向代理为客户端服务（隐藏客户端）；反向代理为服务端服务（隐藏服务端） |
| **HTTP** | **HTTPS** | HTTP 明文传输（80）；HTTPS 加密传输（443），需要证书 |
| **CI** | **CD** | CI 关注代码集成和质量检查；CD 关注软件交付和部署 |
| **持续交付** | **持续部署** | 交付 = 代码随时可部署（手动触发）；部署 = 通过测试后自动上线 |
| **.env** | **CI Secrets** | .env 用于本地开发；Secrets 用于 CI 流程中的加密变量 |
| **构建镜像** | **启动容器** | `docker build` 构建镜像；`docker run` 从镜像启动容器 |
| **502** | **404** | 502 是网关错误（上游服务不可达）；404 是资源不存在 |

---

## 二十三、本周遇到的问题与思考

### 问题 1：为什么本地可以运行，放到服务器后却无法访问？

**当前理解**：本地开发环境与服务器生产环境在操作系统、Node.js 版本、网络配置、依赖库等方面存在差异。此外，服务器有安全组、防火墙等额外限制。解决方法是使用 Docker 统一运行环境，确保"构建一次，到处运行"。

**后续方向**：了解 K8s 如何进一步解决多服务器环境一致性问题。

### 问题 2：Docker 镜像和容器到底有什么区别？

**当前理解**：镜像是一个只读的模板，包含应用代码和运行环境；容器是镜像启动后的运行实例，拥有可写层。类比：镜像是"程序安装包"，容器是"正在运行的程序"。

**后续方向**：理解镜像分层存储和写时复制机制。

### 问题 3：为什么容器删除后数据会消失？

**当前理解**：容器的文件系统是临时的。容器删除时，可写层被销毁，其中的数据随之消失。数据库文件、用户上传等需要持久化的数据，必须通过 Volume 挂载到宿主机。

**后续方向**：了解不同 Volume 类型（bind mount、named volume、tmpfs）的适用场景。

### 问题 4：为什么 React 项目部署后不能直接运行 `npm run dev`？

**当前理解**：`npm run dev` 启动的是 Vite 开发服务器，它包含热更新、源码映射等开发特性，性能不如构建后的静态文件。生产环境应该先 `npm run build` 生成优化的静态文件，再用 Nginx 等 Web 服务器提供。

**后续方向**：了解 Vite 的构建优化策略（代码分割、Tree Shaking）。

### 问题 5：为什么前端页面刷新后会出现 404？

**当前理解**：前端路由（如 `/articles`）只在浏览器端由 JS 处理。直接访问或刷新时，请求发送到服务器，但服务器上并没有对应的文件。配置 Nginx 的 `try_files` 回退到 `index.html` 可以解决。

**后续方向**：了解 SSR（服务端渲染）如何从根本上解决此问题。

### 问题 6：为什么后端容器已经启动，Nginx 仍然返回 502？

**当前理解**："容器已启动"不等于"应用已就绪"。应用可能需要几秒初始化。另外，Nginx 配置中的代理地址（服务名、端口）必须与后端实际监听地址一致。如果后端监听 `127.0.0.1` 而非 `0.0.0.0`，容器外部也无法访问。

**后续方向**：了解如何配置健康检查和启动探针。

### 问题 7：为什么配置了域名后不能马上访问？

**当前理解**：DNS 记录有 TTL 缓存时间。修改记录后，需要等待各级 DNS 服务器缓存过期。此外，本地浏览器和操作系统也有 DNS 缓存。

**后续方向**：了解 DNS 传播的完整机制和 CDN 的 DNS 调度。

### 问题 8：A 记录和 CNAME 应该如何选择？

**当前理解**：A 记录直接指向 IP 地址，适合指向自己可控制 IP 的服务器；CNAME 指向另一个域名，适合托管平台（如 GitHub Pages、Vercel），因为平台的 IP 可能变化。根域名能否使用 CNAME 取决于 DNS 服务商。

**后续方向**：了解 ALIAS 和 ANAME 记录。

### 问题 9：为什么配置 HTTPS 前通常需要先让域名解析正确？

**当前理解**：申请证书时，CA 需要验证你对域名的控制权。如果域名解析不正确，验证会失败。常见验证方式包括 HTTP 验证（CA 访问你的服务器上的特定文件）和 DNS 验证（添加 TXT 记录）。

**后续方向**：了解通配符证书和泛域名证书。

### 问题 10：CI 构建通过是否代表部署一定成功？

**当前理解**：不。CI 构建只验证了代码可以正确编译和通过测试，但部署还涉及网络连通性、服务器配置、数据库迁移、端口开放等运行时因素。CI 通过是部署的必要条件而非充分条件。

**后续方向**：了解蓝绿部署、金丝雀发布等降低部署风险的策略。

### 问题 11：为什么自动部署需要 Secrets？

**当前理解**：自动部署需要访问服务器（SSH 密钥）或镜像仓库（Token），这些凭据如果明文写在仓库中，任何有代码访问权限的人都能看到。Secrets 加密存储这些敏感信息，只在工作流运行时注入。

**后续方向**：了解 OIDC 信任如何在不使用长期 Token 的情况下安全访问云服务。

### 问题 12：为什么生产环境不能一直使用 `latest` 镜像？

**当前理解**：`latest` 标签不指向特定版本，如果推送了新镜像，重启容器可能意外拉取到未测试的版本。生产环境应该使用明确的版本号或提交哈希，确保部署的确定性。

**后续方向**：了解镜像签名和内容信任机制。

### 问题 13：Docker Compose 中服务为什么可以使用服务名互相访问？

**当前理解**：Compose 会为所有服务创建一个默认的 Docker 网络，并内置 DNS 解析。每个服务的服务名在容器网络中可作为主机名使用，Docker 内部的 DNS 服务会自动解析为容器 IP。

**后续方向**：了解 Docker 网络的 bridge、host 和 overlay 模式。

### 问题 14：为什么修改代码后必须重新构建镜像？

**当前理解**：镜像是构建时的快照，代码修改发生在宿主机上，不会自动反映到已有镜像中。需要重新 `docker build` 生成新镜像，然后重新启动容器。

**后续方向**：了解开发时的 bind mount 和热更新方案。

### 问题 15：小型博客项目是否一定需要 Docker 和 CI/CD？

**当前理解**：不一定。Docker 和 CI/CD 的价值随项目规模和团队人数增长。个人小博客直接部署在 Vercel/Netlify 等平台可能更简单。但学习 Docker 和 CI/CD 有助于理解标准化的部署流程，为参与大型项目做准备。

**后续方向**：根据实际需求选择技术方案，避免为用而用。

---

## 二十四、Mentor 交流问题

以下是适合与 Mentor 交流的工程实践问题：

1. 团队实际项目中如何划分开发、测试和生产环境？配置管理用什么工具？
2. 项目中 Dockerfile 和 Docker Compose 一般由谁维护？是前端、后端还是 DevOps？
3. 前端、后端和数据库通常如何进行容器化部署？有没有统一的最佳实践？
4. 团队如何管理环境变量和敏感信息？.env 文件如何在不同环境中分发？
5. CI 流程中一般会执行哪些检查？lint、test、build 的耗时如何平衡？
6. 自动部署失败时如何回滚？有没有一键回滚的机制？
7. 生产环境是否应该使用 `latest` 镜像？团队使用什么标签策略？
8. 项目中 Nginx 通常承担哪些职责？除了反向代理还有哪些用法？
9. 域名、证书和服务器配置通常由哪个角色负责？开发者需要了解多少？
10. 如何判断部署问题出在 DNS、Nginx、Docker 还是应用本身？有没有标准化的排查流程？
11. 实际项目中如何保存和查看部署日志？使用什么监控工具？
12. 小型项目什么时候适合 Docker，什么时候可能不需要？
13. 数据库升级和应用部署如何避免影响已有数据？
14. AI Coding 生成的 Dockerfile 和 CI 配置需要重点检查什么？

---

## 二十五、综合实战：博客部署与 CI/CD Demo

### 25.1 项目概述

配套 Demo 位于 `examples/docker-cicd-deployment-week1-demo`，实现了一个简单的前后端应用容器化部署，通过 Nginx 统一访问。

### 25.2 目录结构

```text
examples/docker-cicd-deployment-week1-demo
├── frontend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── index.html
│   └── src
│       ├── main.jsx
│       └── App.jsx
├── backend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── server.js
│   └── data
├── nginx
│   └── default.conf
├── .github
│   └── workflows
│       └── ci.yml
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

### 25.3 功能要求

**前端（React + Vite）：**
- 显示项目标题和部署状态
- 显示后端健康状态（调用 `/api/health`）
- 显示从后端加载的消息（调用 `/api/message`）
- 展示部署记录列表（调用 `/api/deployments`）

**后端（Node.js + Express + SQLite）：**
- `GET /api/health` — 健康检查
- `GET /api/message` — 返回欢迎消息
- `GET /api/deployments` — 获取部署记录列表
- `POST /api/deployments` — 新增部署记录
- 统一 JSON 格式：`{ success: true, data: ... }`
- 监听 `0.0.0.0`

**数据持久化：**
- 使用 SQLite，通过 Docker Volume 挂载 `/app/data`

**Dockerfile：**
- 前端：多阶段构建（Node.js 构建 + Nginx 运行）
- 后端：Node.js 轻量镜像，生产模式启动

**Docker Compose：**
- 前端服务（内部端口 80）
- 后端服务（内部端口 3001，不暴露到宿主机）
- Nginx 服务（对外 8080，反向代理 / 和 /api/）
- 数据卷持久化
- 同一 Compose 网络

**Nginx 配置：**
- 前端静态资源访问
- SPA 回退
- `/api/` 反向代理到后端
- 必要的代理请求头

**CI 工作流：**
- Checkout 代码
- 安装依赖
- 前端构建检查
- 后端基础验证
- Docker Compose 配置校验

---

## 二十六、实践验证步骤

详见 `examples/docker-cicd-deployment-week1-demo/README.md`，核心步骤：

```bash
# 1. 检查环境
docker version
docker compose version

# 2. 启动项目
cd examples/docker-cicd-deployment-week1-demo
docker compose up --build

# 3. 访问页面
# 浏览器打开 http://localhost:8080

# 4. 测试 API
curl http://localhost:8080/api/health
curl http://localhost:8080/api/message

# 5. 查看服务状态
docker compose ps

# 6. 查看日志
docker compose logs backend

# 7. 停止项目（保留数据）
docker compose down

# 8. 测试数据持久化
# 新增加一条记录 → docker compose down → docker compose up → 检查数据仍在

# ⚠️ 删除数据
docker compose down -v
```

> 普通 `docker compose down` 保留 Volume；`docker compose down -v` 会删除 Volume 数据，谨慎使用。

---

## 核心概念速记

- 部署是把应用放到可被用户访问的运行环境中
- 镜像是只读模板，容器是镜像的运行实例
- Dockerfile 定义镜像构建过程
- Docker Compose 用于管理多个服务
- Volume 用于持久化容器数据
- 端口映射连接宿主机和容器端口
- React 生产环境先构建，再由 Nginx 提供静态文件
- Nginx 可以提供静态资源并反向代理 API
- 域名需要通过 DNS 解析到服务器
- A 记录指向 IPv4，CNAME 指向另一个域名
- HTTPS 通过 TLS 加密通信并验证身份
- CI 自动进行检查、测试和构建
- CD 自动进行交付或部署
- Secrets 用于存储 CI/CD 中的敏感配置
- 自动部署前需要构建、测试、版本管理和回滚思路
- 部署排错需要同时检查 DNS、网络、端口、容器、Nginx 和应用日志
- 容器中的数据需要 Volume 持久化；删除 Volume 意味着数据彻底消失
- `EXPOSE` 只是文档声明，端口映射需要 `-p` 参数
- `depends_on` 只保证启动顺序，不保证服务已就绪
- 环境变量和敏感信息分层管理：.env（本地）、.env.example（参考）、CI Secrets（自动化）

---

> 配套 Demo 见 `examples/docker-cicd-deployment-week1-demo`，`docker compose up --build` 即可启动完整的 Nginx + React + Express + SQLite 容器化部署环境。
