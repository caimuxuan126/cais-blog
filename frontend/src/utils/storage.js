/**
 * localStorage 数据持久化工具
 * 所有博客数据存储在浏览器 localStorage 中
 */

const KEYS = {
  USERS: 'blog_users',
  ARTICLES: 'blog_articles',
  COMMENTS: 'blog_comments',
  CURRENT_USER: 'blog_currentUser'
};

/** 获取 localStorage 数据，带默认值 */
function getItems(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/** 保存数据到 localStorage */
function setItems(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ==================== 用户相关 ====================

/** 获取所有用户 */
export function getUsers() {
  return getItems(KEYS.USERS);
}

/** 注册新用户 */
export function registerUser(username, password) {
  const users = getUsers();
  if (users.find(u => u.username === username)) {
    return { success: false, message: '用户名已存在' };
  }
  const newUser = {
    id: Date.now().toString(),
    username,
    password,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  setItems(KEYS.USERS, users);
  return { success: true, message: '注册成功', user: { id: newUser.id, username: newUser.username } };
}

/** 登录验证 */
export function loginUser(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return { success: false, message: '用户名或密码错误' };
  }
  const currentUser = { id: user.id, username: user.username };
  setItems(KEYS.CURRENT_USER, currentUser);
  return { success: true, message: '登录成功', user: currentUser };
}

/** 退出登录 */
export function logoutUser() {
  localStorage.removeItem(KEYS.CURRENT_USER);
}

/** 获取当前登录用户 */
export function getCurrentUser() {
  return getItems(KEYS.CURRENT_USER, null);
}

// ==================== 种子数据 ====================

/**
 * 首次访问时初始化默认示例文章（含 Markdown 格式）
 */
export function initSeedData() {
  const articles = getItems(KEYS.ARTICLES);
  const existingIds = new Set(articles.map(a => a.id));

  const seedArticles = [
    {
      id: 'seed-1',
      title: '我的软件实训博客项目记录',
      category: '软件实训',
      tags: ['软件实训', 'React', '项目记录'],
      content: `## 项目背景

这是我在**课余时间**独立开发的博客项目，从零开始搭建一个完整的前端博客网站。

## 核心功能

- 用户注册、登录、退出
- 文章发布（支持 **Markdown** 格式）
- 文章列表与详情展示
- 评论与点赞互动
- 全文搜索
- 阅读量统计与热门排行

## 技术选型

| 技术 | 用途 |
|------|------|
| React 18 | 前端框架 |
| Vite 5 | 构建工具 |
| React Router v6 | 路由管理 |
| react-markdown | Markdown 渲染 |
| localStorage | 数据持久化 |

> 整个项目从初始化、目录结构设计、组件拆分到功能实现，完整地走了一遍前端开发流程。`,
      author: 'Cai',
      likes: [],
      views: 42,
      createdAt: '2026-06-01T10:00:00.000Z'
    },
    {
      id: 'seed-2',
      title: 'React + Vite 项目搭建笔记',
      category: '技术笔记',
      tags: ['React', 'Vite', '前端工程化'],
      content: `## 第一步：初始化项目

使用 \`npm init\` 或手动创建 \`package.json\`，添加核心依赖：

\`\`\`json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
\`\`\`

## 第二步：配置 Vite

创建 \`vite.config.js\`：

\`\`\`js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true }
});
\`\`\`

## 第三步：创建入口文件

- 创建 \`index.html\` 并引入 \`/src/main.jsx\`
- 编写 React 组件，使用**函数组件 + Hooks** 模式

> Vite 的开发体验非常好，热更新几乎是秒级的。`,
      author: 'Cai',
      likes: [],
      views: 35,
      createdAt: '2026-06-03T14:30:00.000Z'
    },
    {
      id: 'seed-3',
      title: '从 0 到 1 做个人博客的思考',
      category: '项目复盘',
      tags: ['个人博客', '项目复盘', '前端项目'],
      content: `## 为什么要做个人博客？

有人说现在是短视频的时代，博客已经过时了。但我不这么认为。

### 个人博客的价值

1. **知识沉淀** —— 把学到的知识用自己的话写出来，是最高效的学习方式
2. **技术成长** —— 博客本身就是一个项目，从设计到开发到部署，全流程实践
3. **个人品牌** —— 持续输出内容，让更多人认识你
4. **思考记录** —— 不只是技术，生活中的思考和感悟也值得记录

### 我的收获

> 这次从 0 到 1 搭建博客，最大的收获不是技术本身，而是 **"我能把一个想法完整地实现出来"** 的自信。

希望这个博客能一直更新下去，见证我的成长。`,
      author: 'Cai',
      likes: [],
      views: 28,
      createdAt: '2026-06-05T20:00:00.000Z'
    },
    {
      id: 'seed-4',
      title: '网络基础与 Web 渲染原理',
      category: '技术笔记',
      tags: ['网络', '浏览器', 'Web渲染', 'DevTools'],
      content: `> 软件团队实训期间整理的前端必备网络知识，从分层模型到浏览器渲染全链路。建议配合 Chrome DevTools 实际操作加深理解。

---

## 一、前置概念

### 网络解决了什么

计算机最初是单机工作。三个核心需求推动了网络发展：

- **数据共享**：将文件从 A 电脑传到 B 电脑
- **资源共享**：多台电脑共用一台打印机
- **通信**：即时消息、联机协作

网络的本质：**让计算机之间能够互相通信**。

### 主机、客户端、服务器

| 概念 | 定义 |
|------|------|
| 主机 (Host) | 任何连入网络的设备 |
| 客户端 (Client) | 主动发起请求的一方（如浏览器） |
| 服务器 (Server) | 被动等待请求、提供服务的一方（是一个**角色**，不是特定硬件） |

### 局域网、广域网、互联网

\`\`\`
两台直连 → 局域网 LAN → 广域网 WAN → 互联网 Internet
\`\`\`

**Internet = Inter + net（网络之间的网络）**。互联网不是单一网络，而是无数网络的互联体。

### IP、端口、域名

| 概念 | 解决的问题 | 类比 |
|------|-----------|------|
| IP 地址 | 在网络中定位一台主机 | 楼宇门牌号 |
| 端口号 | 在一台主机上定位具体程序 | 楼内房间号 |
| 域名 | 让人类可读，代替数字 IP | 给门牌号起个名字 |

\`localhost\` 始终指向本机，等价于 \`127.0.0.1\`（IPv4 回环地址）。

---

## 二、计算机网络分层

### 为什么需要分层

网络通信涉及硬件信号、数据纠错、路径选择、应用协议——如果全部耦合在一起，任何改动都会影响全局。"分层"将复杂问题拆解为多个独立的层，每层只负责自己的职责，类似软件工程中的模块化设计。

### OSI 七层 vs TCP/IP 四层

\`\`\`
OSI 七层（理论）             TCP/IP 四层（实际）        常见协议
──────────────────────────────────────────────────────────────
7. 应用层                                               HTTP, HTTPS
6. 表示层  ────┐                                      FTP, SMTP
5. 会话层  ────┼──→  应用层                            DNS, SSH
              │
4. 传输层  ────┼──→  传输层                            TCP, UDP
              │
3. 网络层  ────┼──→  网络层                            IP, ICMP
              │
2. 链路层  ────┼──→  网络接口层                         Ethernet, Wi-Fi
1. 物理层  ────┘                                      光纤, 无线电
\`\`\`

### 各层职责速查

| 层 | 核心问题 | 关键概念 | 数据单元 |
|----|---------|---------|----------|
| 应用层 | 数据怎么用？ | HTTP, DNS, SMTP, FTP | Message |
| 传输层 | 数据怎么可靠/快速传输？ | TCP, UDP, 端口号 | Segment |
| 网络层 | 数据走哪条路？ | IP, 路由, 路由器 | Packet |
| 链路层+物理层 | 信号怎么发？ | MAC 地址, 帧, 交换机 | Frame / Bit |

### 数据在各层之间如何传递

发送端逐层**封装**（每层加自己的头部），接收端逐层**解封装**，最终应用层拿到原始数据。

---

## 三、传输层：TCP 与 UDP

### TCP 的特点

- **面向连接**：通信前需三次握手建立连接
- **可靠传输**：保证数据按序、完整到达，有确认重传
- **流量控制与拥塞控制**：根据网络状况调整发送速率
- **全双工**：双方可同时收发

### UDP 的特点

- **无连接**：不需要建立连接，直接发送
- **不保证可靠**：可能丢包、乱序
- **速度快**：无连接建立和确认重传的开销
- **支持广播和多播**

### 对比

| 对比维度 | TCP | UDP |
|----------|-----|-----|
| 连接方式 | 面向连接（三次握手） | 无连接 |
| 可靠性 | 保证送达，不丢不乱 | 不保证 |
| 速度 | 较慢 | 快 |
| 适用场景 | 网页、文件下载、邮件 | 视频直播、语音通话、在线游戏 |
| 类比 | 打电话——拨通后确认对方在听 | 发短信——发送即完成 |

> 选择原则：没有绝对优劣，只有场景适配。需要可靠传输用 TCP，需要低延迟用 UDP。

### 三次握手（建立连接）

\`\`\`
客户端                                    服务器
  │──── SYN (seq=x) ──────────────────→  │  第1次：请求建立连接
  │←── SYN+ACK (seq=y, ack=x+1) ──────  │  第2次：服务器同意并确认
  │──── ACK (ack=y+1) ───────────────→  │  第3次：客户端确认收到
  │═══════════ TCP 连接已建立 ════════════│
\`\`\`

**为什么是三次？** 防止已失效的连接请求到达服务器导致资源浪费。

### 四次挥手（断开连接）

\`\`\`
客户端                                    服务器
  │──── FIN ──────────────────────────→  │  第1次：客户端说"我发完了"
  │←── ACK ────────────────────────────  │  第2次：服务器说"知道了"
  │←── FIN ────────────────────────────  │  第3次：服务器说"我也发完了"
  │──── ACK ──────────────────────────→  │  第4次：客户端说"好的，再见"
  │═══════════ TCP 连接已关闭 ════════════│
\`\`\`

**为什么是四次？** TCP 是全双工的，双方各自独立关闭。

---

## 四、应用层：HTTP、HTTPS 与 DNS

### HTTP 请求与响应结构

**请求报文：**

\`\`\`
GET /index.html HTTP/1.1          ← 请求行
Host: www.example.com             ← 请求头
User-Agent: Mozilla/5.0
Accept: text/html
                                  ← 空行
                                  ← 请求体（GET 通常为空）
\`\`\`

**响应报文：**

\`\`\`
HTTP/1.1 200 OK                   ← 状态行
Content-Type: text/html           ← 响应头
Content-Length: 1234
                                  ← 空行
<html>...</html>                   ← 响应体
\`\`\`

### 常见 HTTP 方法

| 方法 | 含义 | 幂等性 |
|------|------|--------|
| GET | 获取资源 | ✅ |
| POST | 创建资源 / 提交数据 | ❌ |
| PUT | 完整更新资源 | ✅ |
| DELETE | 删除资源 | ✅ |

### 常见状态码

| 状态码 | 含义 |
|--------|------|
| 200 | OK — 请求成功 |
| 301 | 永久重定向 |
| 302 | 临时重定向 |
| 304 | 未修改（使用缓存） |
| 400 | 请求错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源未找到 |
| 500 | 服务器内部错误 |

> 记忆：2xx 成功、3xx 重定向、4xx 客户端错误、5xx 服务端错误。

### HTTPS vs HTTP

\`\`\`
HTTP:   [浏览器] ──── 明文传输 ──── [服务器]    ← 可被窃听、篡改
HTTPS:  [浏览器] ──── 加密传输 ──── [服务器]    ← 防窃听、防篡改
                       ↑
                    TLS/SSL
\`\`\`

| 对比 | HTTP | HTTPS |
|------|------|-------|
| 加密 | 无，明文 | TLS/SSL 加密 |
| 默认端口 | 80 | 443 |
| 性能 | 略快 | 略慢（加解密和握手开销） |

> HTTPS = HTTP over TLS。地址栏的小锁图标表示正在使用 HTTPS。

**TLS 握手简化过程：** 客户端发起请求（附加密算法列表） → 服务器返回数字证书（含公钥） → 客户端验证证书 → 协商对称密钥 → 加密通信。

### DNS 解析流程

DNS (Domain Name System) 是互联网的电话本——域名 → IP。

\`\`\`
输入 google.com
      ↓
浏览器 DNS 缓存          命中？→ 返回 IP
      ↓ 未命中
操作系统缓存             命中？→ 返回 IP
      ↓ 未命中
本地 DNS 服务器          命中？→ 返回 IP
      ↓ 未命中
根 DNS 服务器            "去问 .com 的服务器"
      ↓
顶级域 DNS (.com)        "去问 google.com 的服务器"
      ↓
权威 DNS (google.com)    "IP 是 142.250.80.46"
      ↓
结果逐级缓存 → 返回给浏览器
\`\`\`

---

## 五、登录状态：Cookie、Session、Token

HTTP 本身是无状态的——每次请求独立，服务器不记得上次交互。但现代 Web 应用需要保持登录状态。

| 方案 | 存储位置 | 工作原理 | 优缺点 |
|------|---------|---------|--------|
| Cookie | 浏览器 | 服务器通过 Set-Cookie 让浏览器存储数据，后续请求自动携带 | 容量小(4KB)、每次请求都发送、可设 HttpOnly 防 JS 读取 |
| Session | 服务器 | 服务器保存用户数据，只给浏览器一个 session_id | 服务器压力大、分布式需共享 |
| Token (JWT) | 浏览器 | 服务器签发加密令牌，浏览器在请求头中携带 | 无状态、易扩展、需防 XSS |

| 维度 | Cookie | Session | Token |
|------|--------|---------|-------|
| 数据存储 | 浏览器 | 服务器 | 浏览器 |
| 安全性 | 可设 HttpOnly | 较高（数据在服务端） | 依赖 HTTPS + 存储方式 |
| 扩展性 | 单机 OK | 分布式需额外处理 | 天然支持分布式 |
| 典型场景 | 偏好设置 | 传统 Web 登录 | SPA、移动端、API 鉴权 |

> 生产环境常见实践：JWT 存储在 HttpOnly Cookie 中，兼顾安全性和扩展性。

---

## 六、互联网基本认识

### 核心角色

| 角色 | 功能 | 类比 |
|------|------|------|
| 浏览器 | 发送请求、渲染页面 | 用户门户 |
| 服务器 | 存储处理数据、响应请求 | 提供服务 |
| DNS | 域名 → IP 翻译 | 电话本 |
| CDN | 静态资源缓存到边缘节点 | 连锁便利店（就近取货） |
| 路由器 | 不同网络间转发数据包 | 快递中转站 |
| 网关 | 连接不同类型网络，协议转换 | 翻译官 |

### CDN 为什么能加速

将静态资源分发到全球边缘节点，用户请求被引导到地理最近的节点，减少延迟，减轻源站压力。

### 前端、后端、服务器、数据库的关系

\`\`\`
用户浏览器（前端）
    ↓ HTTP 请求
Web 服务器 (Nginx)
    ↓ 转发
应用服务器 (Node.js / Java)
    ↓ 读写
数据库 (MySQL / MongoDB)
    ↓ 返回数据 → 应用处理 → 返回 JSON/HTML → 渲染
\`\`\`

| 角色 | 职责 |
|------|------|
| 前端 | 界面展示和用户交互 |
| 后端 | 业务逻辑和数据处理 |
| 服务器 | 运行前后端代码的软硬件 |
| 数据库 | 持久化存储 |

---

## 七、从输入 URL 到页面展示

完整流程分为两个阶段：**网络阶段**和**渲染阶段**。

### 网络阶段

| 步骤 | 操作 |
|------|------|
| 1. 解析 URL | 分离协议、主机名、路径 |
| 2. 查询缓存 | 浏览器缓存 → Service Worker → 强缓存/协商缓存 |
| 3. DNS 解析 | 域名 → IP 地址 |
| 4. TCP 连接 | 三次握手 |
| 5. TLS 握手 | HTTPS 的加密握手（验证证书 + 协商密钥） |
| 6. 发送请求 | GET /page HTTP/1.1 + 请求头 |
| 7. 服务器处理 | 查数据库、组装响应 |
| 8. 返回响应 | HTTP/1.1 200 OK + HTML |

### 渲染阶段

| 步骤 | 操作 |
|------|------|
| 9. 接收 HTML | 边下载边解析 |
| 10. 解析 HTML | 构建 DOM 树 |
| 11. 加载子资源 | CSS、JS、图片等发起额外请求 |
| 12. 构建 CSSOM | 解析 CSS，构建 CSS 对象模型 |
| 13. 生成 Render Tree | DOM + CSSOM → 可见元素树 |
| 14. Layout | 计算每个节点的精确位置和大小（回流） |
| 15. Paint | 生成像素填充指令 |
| 16. Composite | 图层合并，提交 GPU |
| 17. 展示 | 用户看到完整页面 |

### 整体流程图

\`\`\`
              【网络阶段】
URL → 缓存 → DNS → TCP → TLS → HTTP 请求 → 服务器 → HTTP 响应
                                                         ↓
              【渲染阶段】
         接收 HTML → 解析 HTML ──→ DOM Tree ──┐
                     下载子资源 → CSSOM Tree ─┤
                                              ↓
                                        Render Tree
                                              ↓
                                    Layout (回流)
                                              ↓
                                    Paint (绘制)
                                              ↓
                                    Composite (合成)
                                              ↓
                                    ═══ 页面展示 ═══
\`\`\`

---

## 八、Web 渲染原理

### 三种语言的角色

| 技术 | 角色 | 类比 |
|------|------|------|
| HTML | 定义结构与内容 | 建筑骨架 |
| CSS | 定义样式与布局 | 建筑装修 |
| JavaScript | 定义交互与动态行为 | 电路管道 |

### 关键概念

| 概念 | 定义 |
|------|------|
| DOM | HTML 解析后的树状对象，表示文档内容结构 |
| CSSOM | CSS 解析后的树状对象，表示样式规则 |
| Render Tree | DOM + CSSOM 合并，只含可见元素（display:none 不在其中） |
| Layout | 计算每个可见元素的精确位置和尺寸（单位转换：%→px） |
| Paint | 将布局结果转为像素填充指令 |
| Composite | 将不同图层合并，交给 GPU 输出 |

### 回流 Reflow 与重绘 Repaint

| 类型 | 触发条件 | 代价 | 示例属性 |
|------|---------|------|---------|
| 回流 Reflow | 几何属性改变 | 🔴 高 | width, height, margin, left, top, font-size |
| 重绘 Repaint | 外观属性改变 | 🟡 中 | color, background, box-shadow |
| 仅合成 | transform/opacity | 🟢 低 | transform, opacity |

\`\`\`
修改 width → 回流 → 重绘 → 合成（最慢）
修改 color → 重绘 → 合成
修改 transform → 仅合成（最快）
\`\`\`

> 动画使用 transform 和 opacity，避免用 left/top/width 做动画。

### 为什么频繁操作 DOM 影响性能

- 每次修改 DOM 或 CSS 都可能触发回流或重绘
- 频繁 Layout 计算是高开销操作
- **优化策略**：批量修改 DOM（DocumentFragment）、CSS class 切换代替逐个属性修改、动画元素脱离文档流、React Virtual DOM 减少实际 DOM 操作

### script 标签的阻塞行为

| 写法 | 行为 | 场景 |
|------|------|------|
| \`<script src="a.js">\` | 阻塞解析，下载完立即执行 | 需立即执行的脚本 |
| \`<script async>\` | 异步下载，下载完立即执行，不保证顺序 | 独立脚本（统计、广告） |
| \`<script defer>\` | 异步下载，HTML 解析完再按顺序执行 | 依赖 DOM 的脚本 |

---

## 九、Chrome DevTools 调试

### Network 面板

F12 → Network → 刷新页面，关键指标：

| 指标 | 含义 | 参考值 |
|------|------|--------|
| Queueing | 请求排队时间 | 越小越好 |
| DNS Lookup | DNS 解析耗时 | < 50ms |
| Initial connection | TCP 握手耗时 | < 100ms |
| SSL | TLS 握手耗时 | < 100ms |
| TTFB | 等待服务器响应首字节 | < 200ms（理想） |
| Content Download | 下载响应体耗时 | 取决于资源大小 |

**TTFB (Time To First Byte)** 是衡量服务器响应速度的关键指标。TTFB 过大 = 服务器处理慢或网络延迟高。

### Performance 面板

录制 → 操作 → 停止 → 分析：

- 🔵 蓝色 = HTML 解析
- 🟡 黄色 = JS 执行
- 🟣 紫色 = 样式计算和布局
- 🟢 绿色 = 绘制

关注 **长任务 (Long Tasks)**：超过 50ms 的任务可能造成卡顿。

### 性能瓶颈判断

| 问题 | 可能原因 | 排查方向 |
|------|---------|----------|
| 白屏时间长 | TTFB 高或关键资源慢 | Network 看首字节和关键请求 |
| 页面卡顿 | 频繁回流或 JS 长任务 | Performance 找长任务和 Layout 事件 |
| 动画不流畅 | 触发了回流 | 检查是否用了 left/top 等属性 |
| 首屏慢 | 资源过多 | 考虑懒加载和代码分割 |

---

## 十、扩展方向

在掌握本文内容之后，建议进一步学习：

| 方向 | 内容 |
|------|------|
| HTTP 深入 | 缓存策略（强缓存/协商缓存）、HTTP/2 多路复用、HTTP/3 QUIC |
| Web 安全 | XSS、CSRF、CORS、CSP |
| 前端性能 | 代码分割、懒加载、Prefetch/Preload |
| 网络深入 | WebSocket、CDN 原理、负载均衡 |
| 浏览器原理 | V8 引擎、事件循环、内存管理 |

---

## 核心概念速记

| 概念 | 一句话 |
|------|--------|
| 网络分层 | 把复杂通信拆成多层，每层只做自己的事 |
| TCP | 可靠、面向连接、三次握手、四次挥手 |
| UDP | 快速、无连接、不保证送达 |
| HTTP | 请求-响应、无状态、基于 TCP |
| HTTPS | HTTP + TLS 加密 |
| DNS | 域名 → IP 的翻译系统 |
| DOM / CSSOM | HTML / CSS 的树状对象表示 |
| Render Tree | DOM + CSSOM 合并的可见元素树 |
| 回流 | 几何属性改变 → 重新布局（高开销） |
| 重绘 | 外观属性改变 → 重新填充像素（中开销） |
| 合成 | GPU 图层合并（低开销，动画首选） |

---

> 本文内容参考了 MDN Web Docs、图解 HTTP、计算机网络自顶向下方法。建议配合 Chrome DevTools 实际操作加深理解。`,
      author: 'Cai',
      likes: [],
      views: 56,
      createdAt: '2026-06-10T09:00:00.000Z'
    },
    {
      id: 'seed-5',
      title: 'React 学习与实践',
      category: '技术笔记',
      tags: ['React', 'Vite', '组件化', 'Hooks', 'localStorage', '软件实训'],
      summary: '本篇围绕前端 React 一周学习展开，梳理 JSX、组件、Props、State、Hooks、本地存储和调试方法，并通过文章卡片管理 Demo 串联基础知识。',
      content: `> 软件团队实训期间整理的 React 入门笔记，覆盖从环境搭建到综合实践的全流程。

---

## React 是什么

React 是用于构建用户界面 (UI) 的 JavaScript 库。核心价值：**你只需要描述"这个状态下的 UI 应该长什么样"，React 负责高效更新 DOM**。

\`\`\`
数据 (State) 变化 → React 计算差异 → 高效更新 DOM → 页面变化
\`\`\`

三个核心思想：

- **组件化**：把 UI 拆成独立、可复用的小块
- **声明式**：描述"UI 应该是什么样"而非"如何操作 DOM"
- **状态驱动**：数据改变 → 页面自动更新

---

## 环境搭建

\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
\`\`\`

| 文件 | 作用 |
|------|------|
| \`index.html\` | 唯一 HTML，\`<div id="root">\` 是挂载点 |
| \`main.jsx\` | 引入 ReactDOM，渲染 \`<App />\` |
| \`App.jsx\` | 根组件，放路由和布局 |
| \`vite.config.js\` | Vite 构建配置 |

---

## JSX 语法

JSX 让你在 JS 中写类似 HTML 的标记。

| 规则 | HTML | JSX |
|------|------|-----|
| class 属性 | \`class="title"\` | \`className="title"\` |
| 插入表达式 | 不支持 | \`{变量}\` |
| 标签闭合 | \`<img>\` 可不闭合 | \`<img />\` 必须闭合 |

\`\`\`jsx
function Greeting() {
  const name = 'Cai';
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

---

## 组件化开发

组件是 UI 的"积木块"。拆分原则：**每个组件只做一件事**。

\`\`\`jsx
// Header.jsx
export default function Header({ siteName }) {
  return <header><h1>{siteName}</h1></header>;
}

// ArticleCard.jsx
export default function ArticleCard({ title, summary }) {
  return <div className="card"><h2>{title}</h2><p>{summary}</p></div>;
}
\`\`\`

---

## Props：父传子

Props 是父组件传给子组件的数据，**只读**。

\`\`\`jsx
// 父
<BlogCard title="React学习" summary="入门笔记" />

// 子
function BlogCard({ title, summary }) {
  return <div><h2>{title}</h2><p>{summary}</p></div>;
}
\`\`\`

---

## State：组件内部状态

State 变化 → 组件重新渲染。**不能直接修改**，必须用 \`setState\`。

\`\`\`jsx
const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)}>+1</button>
\`\`\`

---

## 事件与受控组件

\`\`\`jsx
const [text, setText] = useState('');

<input value={text} onChange={(e) => setText(e.target.value)} />

<form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
\`\`\`

> "受控"意味着 input 的值由 React state 控制，而非 DOM 自身。

---

## 条件渲染 & 列表渲染

\`\`\`jsx
// 条件
{articles.length === 0 && <p>暂无文章</p>}
{isLoggedIn ? <Dashboard /> : <Login />}

// 列表
{articles.map(a => <ArticleCard key={a.id} title={a.title} />)}
\`\`\`

**key 的作用**：React 用它追踪每个列表项的身份。应用唯一 ID，不要用数组下标。

---

## useEffect：处理副作用

\`\`\`jsx
// 首次加载读取 localStorage
useEffect(() => {
  const saved = localStorage.getItem('articles');
  if (saved) setArticles(JSON.parse(saved));
}, []); // 空数组 = 只执行一次

// 数据变化时保存
useEffect(() => {
  localStorage.setItem('articles', JSON.stringify(articles));
}, [articles]);
\`\`\`

| 依赖数组 | 执行时机 |
|----------|---------|
| \`[]\` | 仅首次挂载执行一次 |
| \`[count]\` | count 变化时执行 |
| 不传 | 每次渲染都执行（几乎不用） |

---

## 单向数据流 & 状态提升

\`\`\`
父组件 State
    ↓ Props 向下传
子组件（展示）
    ↓ 回调向上通知
父组件更新 State → 重新渲染
\`\`\`

\`\`\`jsx
function App() {
  const [articles, setArticles] = useState([]);
  return (
    <>
      <ArticleForm onAdd={(a) => setArticles([...articles, a])} />
      <ArticleList articles={articles} />
    </>
  );
}
\`\`\`

---

## localStorage 持久化

\`\`\`js
// 保存
localStorage.setItem('key', JSON.stringify(data));
// 读取
const data = JSON.parse(localStorage.getItem('key') || '[]');
\`\`\`

- 只能存字符串（对象需序列化）
- 容量约 5MB
- 存在浏览器本地，不同设备不共享
- 适合实训 Demo，生产环境应迁移到后端数据库

---

## 常见排查方法

| 问题 | 排查方向 |
|------|---------|
| 组件不显示 | \`console.log\` 打印 state，查条件渲染 |
| map 报错 | 数据不是数组 → 给默认值 \`[]\` |
| state 更新后页面没变 | 是否直接修改了 state 而非用 setState |
| useEffect 执行两次 | StrictMode 开发环境正常行为 |

---

## 核心规则速记

- 组件名首字母**必须大写**
- JSX 用 \`className\` 不是 \`class\`
- State 不能直接修改，Props 只读
- 列表渲染**必须写 key**
- 表单用受控组件（\`value\` + \`onChange\`）
- \`useEffect\` 注意依赖数组
- localStorage 只能存字符串
- 组件拆分围绕**职责**，不是随意拆分

---

## 实践 Demo

本篇笔记配套了一个简单的 React 实践 Demo，用来练习组件拆分、Props、State、事件处理、标签输入、分类筛选和 localStorage 本地持久化。

**Demo 目录：**

\`\`\`
examples/react-week1-demo
\`\`\`

**运行方式：**

\`\`\`bash
cd examples/react-week1-demo
npm install
npm run dev
\`\`\`

Demo 包含 6 个组件（App / ArticleForm / ArticleList / ArticleCard / CategoryFilter / TagInput），完整覆盖了本周学习的所有 React 核心概念。`,
      author: 'Cai',
      likes: [],
      views: 0,
      createdAt: '2026-06-13T09:00:00.000Z'
    },
    {
      id: 'seed-6',
      title: '数据库与后端学习实践',
      category: '技术笔记',
      tags: ['数据库', '后端', 'SQL', 'API', 'Node.js', 'Express', 'SQLite', '软件实训'],
      summary: '本篇围绕数据库及后端一周学习展开，梳理数据库基础、SQL 操作、数据建模、后端 API、请求处理流程、数据持久化和调试方法，并通过文章与评论 API Demo 串联数据库和后端基础知识。',
      content: `> 软件团队实训期间整理的数据库和后端入门笔记，覆盖从 SQL 基础到 Express API 的全流程。

---

## 前端、后端、数据库的分工

| 角色 | 职责 |
|------|------|
| 前端 | 界面展示和用户交互 |
| 后端 | 处理业务逻辑，向前端提供数据接口 |
| 数据库 | 长期保存和管理数据 |

当前博客项目用 localStorage 适合本地实训展示。真实上线的多用户项目需要后端 + 数据库。

---

## 后端是什么

后端是运行在服务器上的程序，核心职责：**接收请求 → 处理业务逻辑 → 操作数据库 → 返回响应**。

博客项目中后端的典型作用：文章列表查询、登录验证、评论存储、阅读量更新。

---

## 数据库基础概念

| 概念 | 定义 |
|------|------|
| 表 (Table) | 一类数据的集合 |
| 字段 (Column) | 数据的一个属性 |
| 记录 (Row) | 一条完整数据 |
| 主键 (PK) | 唯一标识一条记录 |
| 外键 (FK) | 关联另一张表 |

**博客数据表示例：**

posts 表：id / title / content / category / created_at

comments 表：id / post_id / content / created_at

\`post_id\` 是外键，指向 \`posts.id\`。

---

## 关系型 vs 非关系型

| 对比 | 关系型 (SQL) | 非关系型 (NoSQL) |
|------|-------------|-----------------|
| 结构 | 表、行、列 | 文档、键值 |
| 查询 | SQL 语言 | 各数据库不同 |
| 适合 | 文章、用户、订单 | 缓存、日志 |
| 代表 | MySQL, PostgreSQL, SQLite | MongoDB, Redis |

初学建议先掌握关系型数据库和 SQL。

---

## SQL 核心操作

\`\`\`sql
-- 建表
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 增
INSERT INTO posts (title, content, category) VALUES ('标题', '内容', '技术笔记');

-- 查
SELECT * FROM posts WHERE category = '技术笔记' ORDER BY created_at DESC;

-- 改
UPDATE posts SET title = '新标题' WHERE id = 1;

-- 删
DELETE FROM posts WHERE id = 1;
\`\`\`

> ⚠️ UPDATE 和 DELETE 必须加 WHERE，否则会影响全表。

---

## RESTful API

| 功能 | 方法 | 路径 |
|------|------|------|
| 文章列表 | GET | /api/posts |
| 文章详情 | GET | /api/posts/:id |
| 新增文章 | POST | /api/posts |
| 更新文章 | PUT | /api/posts/:id |
| 删除文章 | DELETE | /api/posts/:id |
| 评论列表 | GET | /api/posts/:id/comments |
| 新增评论 | POST | /api/posts/:id/comments |

---

## 请求处理流程

用户点击"发布评论"后：

1. 前端收集评论内容 → fetch POST 请求
2. 后端接收 → 解析 JSON → 校验内容
3. 后端执行 \`INSERT INTO comments\`
4. 数据库写入成功 → 后端返回 JSON
5. 前端接收响应 → 更新页面

---

## 数据持久化对比

| 存储方式 | 位置 | 适合场景 |
|----------|------|---------|
| localStorage | 浏览器 | 本地 Demo |
| JSON 文件 | 服务器磁盘 | 简单数据 |
| SQLite | 本地数据库文件 | 学习、小项目 |
| MySQL/PostgreSQL | 数据库服务 | 正式项目 |

---

## 后端安全基础

- 不能信任前端数据，后端必须校验
- 密码不能明文存储（用 bcrypt 等哈希）
- SQL 用参数化查询防注入：\`db.prepare('SELECT * FROM users WHERE name=?').get(name)\`
- 接口需要权限控制
- 错误信息不泄露敏感信息

---

## 调试方法

| 问题 | 排查方向 |
|------|---------|
| 请求不到接口 | 检查后端是否启动、端口是否正确 |
| 404 | 路径或请求方法不匹配 |
| 500 | 后端代码报错，查看终端日志 |
| CORS | 后端需设置 Access-Control-Allow-Origin |
| 数据没更新 | 前端需在响应后更新 state |

---

## 核心规则速记

- 前端负责展示，后端负责业务，数据库负责持久化
- API 是前后端通信约定，HTTP 方法表示动作
- SQL 必须加 WHERE（尤其 UPDATE/DELETE）
- 主键唯一标识数据，外键建立表关系
- 后端必须校验前端传来的数据
- 密码不能明文存储，SQL 需防注入
- localStorage ≠ 数据库
- 正式项目需要后端 + 数据库支撑

---

> 配套 Demo 见 \`examples/database-backend-week1-demo\`，\`npm install && npm run dev\` 启动 Express + SQLite API 服务。`,
      author: 'Cai',
      likes: [],
      views: 0,
      createdAt: '2026-06-13T14:00:00.000Z'
    },
    {
      id: 'docker-cicd-domain-deployment-week1',
      title: 'Docker 部署与 CI/CD 实践',
      category: '技术笔记',
      tags: ['Docker', 'Docker Compose', 'CI/CD', 'GitHub Actions', 'Nginx', '域名', 'DNS', 'HTTPS'],
      content: `## 前言

本篇笔记围绕 Docker 容器化部署、CI/CD 自动化流程、域名与 DNS 解析、Nginx 反向代理及 HTTPS 展开，梳理从"本地运行"到"线上访问"的完整流程。

**学习目标：**

- 建立对应用部署过程的整体认识
- 理解开发环境、测试环境和生产环境的区别
- 掌握 Docker 镜像、容器、Dockerfile 和 Docker Compose 的基础概念
- 理解前端、后端和数据库如何在服务器上协同运行
- 理解 CI/CD 的基本流程及其工程价值
- 掌握域名、DNS 解析、端口、Nginx、反向代理和 HTTPS 的基础知识

> 配套 Demo 见 \`examples/docker-cicd-deployment-week1-demo\`，\`docker compose up --build\` 即可启动完整的容器化部署环境。

---

## 一、从"本地运行"到"线上访问"

### 1.1 三种环境

| 环境 | 用途 | 典型特征 |
|------|------|----------|
| **开发环境** | 日常编写和调试代码 | \`localhost\`、热更新、详细报错 |
| **测试环境** | 验证功能是否正常 | 接近生产的配置、测试数据 |
| **生产环境** | 面向真实用户 | 稳定优先、关闭调试信息、HTTPS |

### 1.2 应用上线需要哪些资源

\`\`\`
源代码 → 构建产物 → 运行环境 → 服务器 → 公网 IP → 端口 → 域名 → DNS → Web 服务器 → HTTPS 证书
\`\`\`

### 1.3 浏览器访问本地项目 vs 线上项目

\`\`\`
本地：浏览器 → localhost:3000 → 本机开发服务器

线上：浏览器 → 域名 → DNS → 公网 IP → 服务器 → Nginx → 应用 → 数据库
\`\`\`

---

## 二、服务器与部署基础

### 2.1 公网 IP 与内网 IP

| 类型 | 范围 | 能否从互联网直接访问 |
|------|------|---------------------|
| **公网 IP** | 全球唯一 | ✅ 能 |
| **内网 IP** | 局域网内唯一 | ❌ 不能 |

### 2.2 localhost、127.0.0.1、0.0.0.0

| 地址 | 含义 | 访问范围 |
|------|------|----------|
| \`localhost\` | 本机主机名 | 仅本机 |
| \`127.0.0.1\` | IPv4 回环地址 | 仅本机 |
| \`0.0.0.0\` | 监听所有网络接口 | 本机 + 局域网 + 公网 |

> Docker 容器中的服务必须监听 \`0.0.0.0\`，否则容器外部无法访问。

### 2.3 常见无法访问的原因

| 原因 | 排查方式 |
|------|----------|
| 应用只监听 \`127.0.0.1\` | 检查监听地址 |
| 云服务器安全组未开放端口 | 检查安全组规则 |
| Docker 容器未做端口映射 | \`docker ps\` 查看 PORTS |
| Nginx 未正确转发 | 检查 Nginx 配置和日志 |

---

## 三、为什么需要 Docker

### 3.1 核心概念

| 概念 | 定义 | 类比 |
|------|------|------|
| **Dockerfile** | 定义镜像构建步骤的文件 | 制作说明书 |
| **镜像 (Image)** | 应用的只读模板 | 程序安装包 |
| **容器 (Container)** | 镜像的运行实例 | 正在运行的程序 |
| **仓库 (Registry)** | 存储和分发镜像 | 应用商店 |
| **数据卷 (Volume)** | 独立于容器的持久存储 | 外接硬盘 |

### 3.2 Docker 与虚拟机的区别

| 对比 | Docker 容器 | 虚拟机 |
|------|------------|--------|
| 虚拟化层级 | 操作系统级 | 硬件级 |
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | MB 级 | GB 级 |
| 内核 | 共享宿主机内核 | 独立内核 |

---

## 四、Docker 镜像与容器

### 4.1 常用命令

| 命令 | 作用 |
|------|------|
| \`docker images\` | 列出本地镜像 |
| \`docker ps\` | 列出运行中的容器 |
| \`docker ps -a\` | 列出所有容器 |
| \`docker pull <镜像>\` | 拉取镜像 |
| \`docker run <镜像>\` | 创建并启动容器 |
| \`docker stop/start/restart\` | 停止/启动/重启容器 |
| \`docker rm <容器>\` | 删除容器 |
| \`docker rmi <镜像>\` | 删除镜像 |
| \`docker logs <容器>\` | 查看容器日志 |
| \`docker exec <容器> <命令>\` | 在容器内执行命令 |

### 4.2 docker run 详解

\`\`\`bash
docker run -d -p 8080:80 --name web-demo nginx
\`\`\`

| 参数 | 含义 |
|------|------|
| \`-d\` | 后台运行 |
| \`-p 8080:80\` | 宿主机 8080 → 容器 80 |
| \`--name\` | 给容器命名 |

> 删除容器 ≠ 删除镜像；停止容器 ≠ 删除容器。排查问题第一反应：\`docker ps\` + \`docker logs\`。

---

## 五、Dockerfile 基础

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
\`\`\`

**关键指令：**

| 指令 | 作用 |
|------|------|
| \`FROM\` | 基础镜像 |
| \`WORKDIR\` | 工作目录 |
| \`COPY\` | 复制文件 |
| \`RUN\` | 构建时执行命令 |
| \`EXPOSE\` | 声明端口（文档性质） |
| \`CMD\` | 容器启动命令 |

**为什么先复制 package.json？** Docker 构建是逐层缓存。如果 \`package.json\` 没变，\`RUN npm install\` 直接命中缓存，大幅缩短构建时间。

**.dockerignore：**

\`\`\`text
node_modules
.git
.env
dist
\`\`\`

---

## 六、前端 React 项目的容器化

多阶段构建——构建用 Node.js，运行用 Nginx：

\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
\`\`\`

**SPA 刷新 404 解决：**

\`\`\`nginx
location / {
  try_files $uri $uri/ /index.html;
}
\`\`\`

---

## 七、后端项目的容器化

\`\`\`bash
docker build -t blog-api .
docker run -d --name blog-api -p 3001:3001 -e PORT=3001 blog-api
\`\`\`

**数据持久化：**

\`\`\`bash
docker run -d --name blog-api -p 3001:3001 -v blog-data:/app/data blog-api
\`\`\`

> Volume 独立于容器生命周期，容器删除后数据仍保留。

---

## 八、Docker Compose 基础

\`\`\`yaml
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
\`\`\`

**关键点：**

- 服务名即为容器网络中的主机名（如 \`backend:3001\`）
- \`depends_on\` 保证启动顺序，不保证服务已就绪
- 不要在配置中写真实密钥，使用 \`.env\` 和 \`.env.example\`

**常用命令：**

| 命令 | 作用 |
|------|------|
| \`docker compose up --build\` | 构建并启动 |
| \`docker compose down\` | 停止并清理（保留 Volume） |
| \`docker compose down -v\` | 同时删除 Volume（⚠️ 数据丢失） |
| \`docker compose logs\` | 查看日志 |
| \`docker compose ps\` | 查看状态 |

---

## 九、Nginx 与反向代理

\`\`\`nginx
server {
  listen 80;

  location / {
    proxy_pass http://frontend;
  }

  location /api/ {
    proxy_pass http://backend:3001;
  }
}
\`\`\`

**请求流转：**

\`\`\`
浏览器访问 /api/posts → Nginx 接收 → 转发给 backend:3001 → JSON 返回
\`\`\`

> 通过 Nginx 代理，前后端使用同一域名，避免跨域问题。

---

## 十、域名基础

\`\`\`
blog.example.com
 ─┬─  ───┬─── ─┬─
  │      │     └─ 顶级域名 (.com)
  │      └─────── 二级域名 (主域名)
  └────────────── 子域名
\`\`\`

不同子域名可以指向不同服务：
- \`blog.example.com\` → 博客
- \`api.example.com\` → 后端 API

> 域名只是访问入口，购买域名、配置 DNS、部署服务器是三个独立步骤。

---

## 十一、DNS 与域名解析

| 记录类型 | 作用 | 填写内容 |
|----------|------|----------|
| **A** | 域名 → IPv4 | IP 地址 |
| **AAAA** | 域名 → IPv6 | IPv6 地址 |
| **CNAME** | 域名 → 另一个域名 | 目标域名 |
| **MX** | 邮件服务器 | 邮件域名 |
| **TXT** | 文本验证 | 验证字符串 |

> DNS 修改后不会立即全球生效，TTL 决定缓存时间。

---

## 十二、完整访问流程

\`\`\`
用户输入 https://blog.example.com
  → DNS 解析 → 获得服务器 IP
    → TCP 连接 → TLS 握手
      → Nginx 接收请求
        → / → 返回前端静态页面
        → /api/ → 转发后端
          → 后端查询数据库 → 返回 JSON
            → 浏览器渲染页面
\`\`\`

---

## 十三、HTTPS 与证书基础

| 对比 | HTTP | HTTPS |
|------|------|-------|
| 加密 | ❌ 明文 | ✅ TLS 加密 |
| 端口 | 80 | 443 |
| 证书 | 不需要 | CA 签发 |

**部署流程：**

\`\`\`
域名解析到服务器 → 开放 80/443 端口 → 申请证书 → 配置 Nginx → HTTP 重定向 HTTPS → 自动续期
\`\`\`

---

## 十四、CI/CD 基础

| 概念 | 含义 |
|------|------|
| **CI（持续集成）** | 代码频繁合并，自动构建和测试 |
| **CD（持续交付）** | 代码随时可以安全部署 |
| **CD（持续部署）** | 通过测试后自动部署到生产 |

**典型流程：**

\`\`\`
提交代码 → 安装依赖 → 代码检查 → 测试 → 构建 → 构建镜像 → 推送镜像 → 部署 → 健康检查
\`\`\`

---

## 十五、GitHub Actions 基础

\`\`\`yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
\`\`\`

---

## 十六、常见部署问题排查

| 问题 | 可能原因 | 排查方式 |
|------|----------|----------|
| 容器启动后立即退出 | 启动命令错误 | \`docker logs\` |
| 浏览器访问不到 | 端口未映射 | \`docker ps\` 检查 PORTS |
| 接口返回 502 | 后端未启动或代理错误 | 检查 Nginx 和后端日志 |
| 前端刷新 404 | SPA 回退未配置 | 检查 \`try_files\` |
| 数据重启后消失 | 未挂载 Volume | 检查 \`volumes\` |
| 域名不生效 | DNS 缓存 | \`nslookup\` |
| 容器间无法通信 | 网络或服务名错误 | 检查 Compose 配置 |

**排查顺序：**

\`\`\`
服务是否启动 → 端口是否监听 → 端口是否映射 → 防火墙是否放行
→ Nginx 是否正常 → 后端是否正常 → DNS 是否正确 → HTTPS 是否正确
\`\`\`

---

## 十七、容易混淆的概念

| 概念 A | 概念 B | 核心区别 |
|--------|--------|----------|
| **镜像** | **容器** | 镜像只读模板，容器运行实例 |
| **Dockerfile** | **Docker Compose** | 单个镜像构建 vs 多服务编排 |
| **EXPOSE** | **ports** | 文档声明 vs 实际映射 |
| **Volume** | **容器内目录** | Volume 独立于容器生命周期 |
| **A 记录** | **CNAME** | 指向 IP vs 指向域名 |
| **正向代理** | **反向代理** | 为客户端服务 vs 为服务端服务 |
| **CI** | **CD** | 集成和检查 vs 交付和部署 |
| **502** | **404** | 网关错误 vs 资源不存在 |

---

## 十八、必须记住的规则

- 本地可运行不代表线上可运行
- 镜像是模板，容器是运行实例
- 容器中的数据需通过 Volume 持久化
- \`EXPOSE\` 不等于端口映射，还需 \`-p\` 参数
- React 生产环境先构建，再由 Nginx 提供静态文件
- Nginx 可提供静态资源，也可反向代理 API
- A 记录指向 IPv4，CNAME 指向另一个域名
- HTTPS 需要域名证书和正确的服务器配置
- CI 自动构建和检查，CD 自动交付和部署
- 敏感信息通过环境变量或 Secrets 管理
- 排查部署问题需同时检查日志、容器状态、端口和网络
- 删除容器 ≠ 删除镜像；删除 Volume 会丢失数据

---

## 十九、Mentor 交流问题

1. 团队实际项目中如何划分开发、测试和生产环境？
2. 项目中 Dockerfile 和 Docker Compose 一般由谁维护？
3. CI 流程中一般会执行哪些检查？
4. 自动部署失败时如何回滚？
5. 生产环境是否应该使用 \`latest\` 镜像？
6. 小型项目什么时候适合 Docker，什么时候可能不需要？
7. AI Coding 生成的 Dockerfile 和 CI 配置需要重点检查什么？

---

> 完整笔记见 \`docs/training-notes/docker-cicd-domain-deployment-week1.md\`，配套 Demo 见 \`examples/docker-cicd-deployment-week1-demo\`。
> \`docker compose up --build\` 启动 Nginx + React + Express + SQLite 容器化部署环境。`,
      author: 'Cai',
      likes: [],
      views: 0,
      createdAt: '2026-07-05T10:00:00.000Z',
      updatedAt: '2026-07-05T10:00:00.000Z'
    },
    {
      id: 'ai-automation-mcp-advanced-week1',
      title: 'AI 自动化、MCP 与进阶实践',
      category: '技术笔记',
      tags: ['AI Coding', 'AI 自动化', 'MCP', 'Agent', 'Workflow', 'React', '小游戏', '软件实训'],
      content: `## 前言

本篇笔记围绕 AI Coding、自动化工作流、Agent/Tool/Workflow 概念、MCP 协议基础及 AI 安全实践展开，帮助建立对 AI 辅助开发的体系化认知。

**学习目标：**

- 理解 AI Coding 和 AI 自动化的基本思路与边界
- 掌握向 AI 提供需求、上下文和约束的方法
- 了解 Agent、Tool、Workflow 和 MCP 的基础概念
- 建立 AI 工具使用中的安全意识
- 通过任务工作流模拟器和反应速度游戏完成综合实践

> 配套 Demo 见 \`examples/ai-mcp-advanced-week1-demo\`，\`npm install && npm run dev\` 启动。

---

## 一、AI Coding 基础

### 1.1 AI Coding vs 代码补全

| 对比 | 代码补全 | AI Coding |
|------|---------|-----------|
| 工作方式 | 模式匹配 | 语义理解 |
| 上下文 | 当前文件 | 多文件、对话历史 |
| 能力 | 变量名建议 | 组件、接口生成 |
| 理解 | 无 | 理解自然语言需求 |

### 1.2 AI 能做什么

- 根据需求生成组件和页面
- 重构代码、提取公共逻辑
- 分析错误信息并提供修复建议
- 生成测试用例
- 整理项目文档和注释
- 检查代码规范和潜在问题

> AI 生成的代码必须经过人工阅读和验证。AI 是辅助工具，不是替代品。

---

## 二、如何写清楚任务指令

完整指令应包含：

| 要素 | 说明 |
|------|------|
| **背景** | 当前项目状态 |
| **目标** | 要实现什么 |
| **文件范围** | 修改哪些文件 |
| **限制条件** | 不能修改什么 |
| **验收标准** | 如何判断完成 |

**❌ 模糊：** "帮我增加评论功能。"

**✅ 清晰：** "请在评论区增加编辑功能，仅作者可编辑，保留创建时间，保存后更新 updatedAt，兼容旧数据。"

---

## 三、上下文管理

| 原则 | 说明 |
|------|------|
| 提供相关文件 | 让 AI 先读取要修改的文件 |
| 提供真实报错 | 完整报错比"运行不了"有效 |
| 限制范围 | 指定文件，不要放开整个项目 |
| 分层提供 | 先结构后细节 |
| 分段执行 | 分析 → 实现 → 检查 → 总结 |

---

## 四、Agent、Tool 与 Workflow

| 概念 | 核心作用 | 灵活性 | 示例 |
|------|----------|--------|------|
| **Agent** | 自主选择步骤 | 高 | "排查错误" |
| **Tool** | 提供具体能力 | — | 读文件、执行命令 |
| **Workflow** | 按固定步骤执行 | 低 | 构建→测试→发布 |

---

## 五、MCP 基础

MCP（Model Context Protocol）是连接 AI 与外部工具的统一协议。

\`\`\`
用户任务 → AI 理解 → MCP 调用工具 → 工具返回结果 → AI 整理 → 最终回答
\`\`\`

| MCP 是... | MCP 不是... |
|-----------|------------|
| AI 与工具的连接协议 | 一个 AI 模型 |
| 统一的工具调用标准 | 数据库 |
| 可连接文件、Git、数据库 | 某种特定工具 |

---

## 六、安全原则

\`\`\`
读文件（低风险）→ 改文件（中风险）→ 执行命令（高风险）→ 部署（极高风险）
\`\`\`

- ✅ 修改前查看 git status
- ✅ 在独立分支上操作
- ✅ 检查 diff 后再提交
- ❌ 不向 AI 提供密码/Token/私钥
- ❌ 不让 AI 直接操作生产数据库
- ❌ 不信任来源不明的 MCP Server

---

## 七、AI 辅助调试

推荐流程：

\`\`\`
复现问题 → 获取完整报错 → 定位文件 → 分析数据流
→ 提出原因 → 小范围修改 → 运行验证
\`\`\`

无效做法：只说"坏了"、一次改大量文件、没看报错就生成代码、改完不检查。

---

## 八、综合实践：Demo 概览

配套 Demo 包含两个模块：

### 模块一：AI 任务工作流模拟器

模拟四步工作流：
\`\`\`
需求分析 → 上下文读取 → 任务执行 → 结果检查
\`\`\`

- 创建任务（名称 + 类型）
- 点击步骤切换状态
- localStorage 持久化

### 模块二：反应速度测试

- 随机延迟后屏幕变绿
- 测试反应时间（毫秒）
- 最佳成绩保存

> 两个模块均不调用真实 AI API，不连接 MCP Server。

---

## 九、容易混淆的概念

| 概念 A | 概念 B | 核心区别 |
|--------|--------|----------|
| **AI Coding** | **代码补全** | 语义理解 vs 模式匹配 |
| **Agent** | **Workflow** | 自主决策 vs 固定步骤 |
| **Tool** | **MCP** | 具体能力 vs 连接协议 |
| **MCP Client** | **MCP Server** | 发起方 vs 提供方 |
| **上下文** | **提示词** | 事实信息 vs 指令 |
| **读权限** | **写权限** | 只读（低风险）vs 可修改（高风险） |

---

## 十、必须记住的规则

- AI Coding 的前提是任务描述清晰、上下文准确
- AI 生成代码必须人工检查
- 复杂任务拆分执行，每次只改 1-2 个文件
- Agent 自主决策，Workflow 固定执行，Tool 是基础
- MCP 是统一连接协议，不是模型或数据库
- 安全层级：读 < 改 < 执行 < 部署
- 不向 AI 暴露敏感信息
- 提供完整报错比简单说"坏了"有效得多

---

## 十一、Mentor 交流问题

1. 团队如何规范 AI Coding 的使用？
2. 哪些代码适合 AI 生成，哪些必须人工完成？
3. AI 修改后如何进行 Code Review？
4. 如何给 AI 提供足够但不过量的上下文？
5. 如何评估第三方 MCP Server 的安全性？
6. AI 自动化任务的日志如何保存？
7. AI Coding 如何影响新人学习基础知识？

---

> 完整笔记见 \`docs/training-notes/ai-automation-mcp-advanced-week1.md\`，配套 Demo 见 \`examples/ai-mcp-advanced-week1-demo\`。`,
      author: 'Cai',
      likes: [],
      views: 0,
      createdAt: '2026-07-05T14:00:00.000Z',
      updatedAt: '2026-07-05T14:00:00.000Z'
    }
  ];

  // 种子文章：新的追加，已存在的用最新内容覆盖
  const updated = articles.map(a => {
    const seed = seedArticles.find(s => s.id === a.id);
    return seed || a;  // 同名 ID 用种子版本替换，否则保留原样
  });
  const newOnes = seedArticles.filter(s => !existingIds.has(s.id));
  setItems(KEYS.ARTICLES, [...updated, ...newOnes]);
}

// ==================== 文章相关 ====================

/** 文章分类列表 */
export const CATEGORIES = [
  '软件实训', '项目复盘', '技术笔记',
  '大学学习', '生活记录', '随笔思考'
];

/** 默认分类（旧文章无 category 时） */
const DEFAULT_CATEGORY = '随笔思考';

/** 获取所有文章（按时间倒序，补全缺失的 category） */
export function getArticles() {
  const articles = getItems(KEYS.ARTICLES);
  return articles
    .map(a => ({ ...a, category: a.category || DEFAULT_CATEGORY, tags: a.tags || [] }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** 按分类筛选文章 */
export function getArticlesByCategory(category) {
  if (!category) return getArticles();
  return getArticles().filter(a => a.category === category);
}

/** 按标签筛选文章 */
export function getArticlesByTag(tag) {
  if (!tag) return getArticles();
  return getArticles().filter(a => (a.tags || []).includes(tag));
}

/** 获取所有已使用的标签 */
export function getAllTags() {
  const articles = getItems(KEYS.ARTICLES);
  const tagSet = new Set();
  articles.forEach(a => (a.tags || []).forEach(t => tagSet.add(t)));
  return [...tagSet].sort();
}

/** 根据 ID 获取单篇文章 */
export function getArticleById(id) {
  const articles = getItems(KEYS.ARTICLES);
  return articles.find(a => a.id === id) || null;
}

/** 创建新文章 */
export function createArticle(title, content, author, category = '随笔思考', tags = []) {
  const articles = getItems(KEYS.ARTICLES);
  const newArticle = {
    id: Date.now().toString(),
    title,
    content,
    author,
    category,
    tags,
    likes: [],
    views: 0,
    createdAt: new Date().toISOString()
  };
  articles.push(newArticle);
  setItems(KEYS.ARTICLES, articles);
  return newArticle;
}

/** 编辑文章 */
export function updateArticle(id, title, content, category, tags) {
  const articles = getItems(KEYS.ARTICLES);
  const article = articles.find(a => a.id === id);
  if (!article) return null;
  article.title = title;
  article.content = content;
  article.category = category;
  article.tags = tags;
  article.updatedAt = new Date().toISOString();
  setItems(KEYS.ARTICLES, articles);
  return article;
}

/** 阅读量 +1 */
export function incrementViews(articleId) {
  const articles = getItems(KEYS.ARTICLES);
  const article = articles.find(a => a.id === articleId);
  if (!article) return 0;
  article.views = (article.views || 0) + 1;
  setItems(KEYS.ARTICLES, articles);
  return article.views;
}

/**
 * 获取热门文章
 * 热度 = 阅读量 + 点赞数 × 3 + 评论数 × 2
 * 返回前 limit 篇，按热度降序
 */
export function getHotArticles(limit = 3) {
  const articles = getItems(KEYS.ARTICLES);
  const comments = getItems(KEYS.COMMENTS);

  return articles
    .map(a => {
      const commentCount = comments.filter(c => c.articleId === a.id).length;
      const likeCount = (a.likes || []).length;
      const viewCount = a.views || 0;
      const hotness = viewCount + likeCount * 3 + commentCount * 2;
      return { ...a, commentCount, hotness };
    })
    .sort((a, b) => b.hotness - a.hotness)
    .slice(0, limit);
}

/** 搜索文章（按标题和内容模糊匹配） */
export function searchArticles(keyword) {
  const articles = getItems(KEYS.ARTICLES);
  if (!keyword || !keyword.trim()) return getArticles();
  const kw = keyword.trim().toLowerCase();
  return articles
    .filter(a =>
      a.title.toLowerCase().includes(kw) ||
      a.content.toLowerCase().includes(kw)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** 点赞/取消点赞文章 */
export function toggleLike(articleId, userId) {
  const articles = getItems(KEYS.ARTICLES);
  const article = articles.find(a => a.id === articleId);
  if (!article) return { success: false, likes: [] };

  const index = article.likes.indexOf(userId);
  if (index === -1) {
    article.likes.push(userId);
  } else {
    article.likes.splice(index, 1);
  }
  setItems(KEYS.ARTICLES, articles);
  return { success: true, likes: article.likes };
}

// ==================== 评论相关 ====================

/** 获取某篇文章的所有评论（按时间正序） */
export function getComments(articleId) {
  const comments = getItems(KEYS.COMMENTS);
  return comments
    .filter(c => c.articleId === articleId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

/** 添加评论（支持文字 + 可选图片 Base64） */
export function addComment(articleId, author, content, imageData = null) {
  const comments = getItems(KEYS.COMMENTS);
  const newComment = {
    id: Date.now().toString(),
    articleId,
    author,
    content,
    image: imageData?.base64 || null,
    imageName: imageData?.name || null,
    imageType: imageData?.type || null,
    createdAt: new Date().toISOString()
  };
  comments.push(newComment);
  setItems(KEYS.COMMENTS, comments);
  return newComment;
}

/** 编辑评论 */
export function updateComment(commentId, content, imageData = null) {
  const comments = getItems(KEYS.COMMENTS);
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return null;
  comment.content = content;
  comment.image = imageData?.base64 || null;
  comment.imageName = imageData?.name || null;
  comment.imageType = imageData?.type || null;
  comment.updatedAt = new Date().toISOString();
  setItems(KEYS.COMMENTS, comments);
  return comment;
}

/**
 * 获取全局统计数据（文章数、评论数、点赞数、总阅读量）
 */
export function getStats() {
  const articles = getItems(KEYS.ARTICLES);
  const comments = getItems(KEYS.COMMENTS);
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalLikes = articles.reduce((sum, a) => sum + (a.likes || []).length, 0);
  return {
    articleCount: articles.length,
    commentCount: comments.length,
    likeCount: totalLikes,
    totalViews
  };
}

/**
 * 去除 Markdown 标记，返回纯文本（用于摘要展示）
 */
export function stripMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/#{1,6}\s/g, '')           // 标题
    .replace(/\*\*(.+?)\*\*/g, '$1')    // 加粗
    .replace(/\*(.+?)\*/g, '$1')        // 斜体
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // 行内代码/代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // 图片
    .replace(/[>|]/g, '')               // 引用和表格
    .replace(/[-*+]\s/g, '')            // 无序列表
    .replace(/\d+\.\s/g, '')            // 有序列表
    .replace(/---/g, '')                // 分割线
    .replace(/\n{2,}/g, '\n')           // 多余空行
    .trim();
}

// ==================== 关注 ====================

const FOLLOWS_KEY = 'blog_follows';

export function getFollows() {
  try { return JSON.parse(localStorage.getItem(FOLLOWS_KEY)) || []; }
  catch { return []; }
}
function setFollows(data) { localStorage.setItem(FOLLOWS_KEY, JSON.stringify(data)); }

/** 关注用户 */
export function followUser(followerId, followingId) {
  if (followerId === followingId) return { success: false, message: '不能关注自己' };
  const follows = getFollows();
  if (follows.find(f => f.followerId === followerId && f.followingId === followingId)) {
    return { success: false, message: '已关注' };
  }
  const f = { id: Date.now().toString(), followerId, followingId, createdAt: new Date().toISOString() };
  follows.push(f);
  setFollows(follows);
  return { success: true, data: f, isMutual: isMutualFollowRaw(follows, followerId, followingId) };
}

/** 取消关注 */
export function unfollowUser(followerId, followingId) {
  let follows = getFollows();
  follows = follows.filter(f => !(f.followerId === followerId && f.followingId === followingId));
  setFollows(follows);
  return { success: true };
}

/** 是否已关注 */
export function isFollowing(followerId, followingId) {
  if (!followerId || !followingId) return false;
  return getFollows().some(f => f.followerId === followerId && f.followingId === followingId);
}

function isMutualFollowRaw(follows, a, b) {
  return follows.some(f => f.followerId === a && f.followingId === b)
      && follows.some(f => f.followerId === b && f.followingId === a);
}

/** 是否互关 */
export function isMutualFollow(userA, userB) {
  return isMutualFollowRaw(getFollows(), userA, userB);
}

/** 获取关注列表 */
export function getFollowing(userId) {
  return getFollows().filter(f => f.followerId === userId).map(f => f.followingId);
}

/** 获取粉丝列表 */
export function getFollowers(userId) {
  return getFollows().filter(f => f.followingId === userId).map(f => f.followerId);
}

// ==================== 通知 ====================

const NOTIF_KEY = 'blog_notifications';

export function getNotifications(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY)) || [];
    return all.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch { return []; }
}

export function getUnreadNotifCount(userId) {
  return getNotifications(userId).filter(n => !n.isRead).length;
}

export function createNotification({ userId, fromUserId, fromName, type, articleId, articleTitle, message }) {
  if (userId === fromUserId) return null; // 不给自己发通知
  try {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY)) || [];
    const n = {
      id: Date.now().toString(),
      userId,
      fromUserId,
      fromName,
      type,           // like | comment | follow | mutual | message
      articleId: articleId || null,
      articleTitle: articleTitle || null,
      message,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    all.push(n);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(all));
    return n;
  } catch { return null; }
}

export function markNotifRead(notifId) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY)) || [];
    const n = all.find(x => x.id === notifId);
    if (n) n.isRead = true;
    localStorage.setItem(NOTIF_KEY, JSON.stringify(all));
  } catch {}
}

export function markAllNotifRead(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY)) || [];
    all.forEach(n => { if (n.userId === userId) n.isRead = true; });
    localStorage.setItem(NOTIF_KEY, JSON.stringify(all));
  } catch {}
}

// ==================== 私信 ====================

const MSG_KEY = 'blog_messages';

export function getMessages(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(MSG_KEY)) || [];
    return all.filter(m => m.senderId === userId || m.receiverId === userId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } catch { return []; }
}

/** 获取会话列表（每个互关好友一条，含最后消息和未读数） */
export function getConversations(userId) {
  const msgs = getMessages(userId);
  const users = JSON.parse(localStorage.getItem('blog_users') || '[]');
  const follows = getFollows();
  const mutualIds = follows
    .filter(f => f.followerId === userId && isMutualFollowRaw(follows, userId, f.followingId))
    .map(f => f.followingId);

  return mutualIds.map(peerId => {
    const peer = users.find(u => u.id === peerId) || { id: peerId, username: '未知用户' };
    const convMsgs = msgs.filter(m =>
      (m.senderId === userId && m.receiverId === peerId) ||
      (m.senderId === peerId && m.receiverId === userId)
    );
    const lastMsg = convMsgs[convMsgs.length - 1] || null;
    const unread = convMsgs.filter(m => m.receiverId === userId && !m.isRead).length;
    return { peerId, peerName: peer.username, lastMsg, unread, messages: convMsgs };
  }).sort((a, b) => {
    const ta = a.lastMsg ? new Date(a.lastMsg.createdAt).getTime() : 0;
    const tb = b.lastMsg ? new Date(b.lastMsg.createdAt).getTime() : 0;
    return tb - ta;
  });
}

export function sendMessage(senderId, receiverId, content) {
  if (!content || !content.trim()) return null;
  const all = JSON.parse(localStorage.getItem(MSG_KEY) || '[]');
  const msg = {
    id: Date.now().toString(),
    senderId,
    receiverId,
    content: content.trim(),
    isRead: false,
    createdAt: new Date().toISOString()
  };
  all.push(msg);
  localStorage.setItem(MSG_KEY, JSON.stringify(all));
  return msg;
}

export function markMessagesRead(senderId, receiverId) {
  try {
    const all = JSON.parse(localStorage.getItem(MSG_KEY) || '[]');
    all.forEach(m => {
      if (m.senderId === senderId && m.receiverId === receiverId && !m.isRead) {
        m.isRead = true;
      }
    });
    localStorage.setItem(MSG_KEY, JSON.stringify(all));
  } catch {}
}

export function getTotalUnreadMessages(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(MSG_KEY) || '[]');
    return all.filter(m => m.receiverId === userId && !m.isRead).length;
  } catch { return 0; }
}

// ==================== 社交种子数据 ====================

export function initSocialSeedData() {
  const users = JSON.parse(localStorage.getItem('blog_users') || '[]');
  if (users.length === 0) return; // 没有注册用户则跳过

  // 如果已有关注数据则跳过
  const existingFollows = getFollows();
  if (existingFollows.length > 0) return;

  // 查找或创建演示用户
  let cai = users.find(u => u.username === 'Cai');
  let demoUser = users.find(u => u.username === 'DemoUser');

  if (!demoUser) {
    demoUser = { id: 'demo-user-001', username: 'DemoUser', password: 'demo123', createdAt: new Date().toISOString() };
    users.push(demoUser);
    localStorage.setItem('blog_users', JSON.stringify(users));
  }

  if (cai && cai.id !== demoUser.id) {
    // 双向关注形成互关
    const now = new Date().toISOString();
    const follows = [
      { id: 'seed-f1', followerId: cai.id, followingId: demoUser.id, createdAt: now },
      { id: 'seed-f2', followerId: demoUser.id, followingId: cai.id, createdAt: now }
    ];
    setFollows(follows);

    // 示例私信
    const msgs = [
      { id: 'seed-m1', senderId: demoUser.id, receiverId: cai.id, content: '👋 你好！看了你的博客，写得很好！', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'seed-m2', senderId: cai.id, receiverId: demoUser.id, content: '谢谢！欢迎交流 🤝', isRead: true, createdAt: new Date(Date.now() - 1800000).toISOString() }
    ];
    localStorage.setItem(MSG_KEY, JSON.stringify(msgs));

    // 示例通知
    const notifs = [
      { id: 'seed-n1', userId: cai.id, fromUserId: demoUser.id, fromName: 'DemoUser', type: 'follow', articleId: null, articleTitle: null, message: 'DemoUser 关注了你', isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
      { id: 'seed-n2', userId: cai.id, fromUserId: demoUser.id, fromName: 'DemoUser', type: 'mutual', articleId: null, articleTitle: null, message: '你和 DemoUser 成为互关好友，可以开始聊天了！', isRead: false, createdAt: new Date(Date.now() - 7000000).toISOString() }
    ];
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
  }
}
