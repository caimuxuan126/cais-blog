import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3001;
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'deployments.db');

// ===== 数据库初始化 =====
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS deployments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// 插入一条初始数据（仅在表为空时）
const count = db.prepare('SELECT COUNT(*) as cnt FROM deployments').get();
if (count.cnt === 0) {
  db.prepare('INSERT INTO deployments (description) VALUES (?)').run('🎉 首次部署成功！Docker Compose 环境已就绪');
}

// ===== 中间件 =====
app.use(express.json());

// ===== 路由 =====

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Service is healthy' });
});

// 欢迎消息
app.get('/api/message', (_req, res) => {
  res.json({
    success: true,
    data: {
      message: '👋 你好！后端服务运行正常。Docker + Nginx + Express + SQLite 已就绪。',
      timestamp: new Date().toISOString()
    }
  });
});

// 获取部署记录列表
app.get('/api/deployments', (_req, res) => {
  const rows = db.prepare('SELECT * FROM deployments ORDER BY id DESC').all();
  res.json({ success: true, data: rows });
});

// 新增部署记录
app.post('/api/deployments', (req, res) => {
  const { description } = req.body;
  if (!description || !description.trim()) {
    return res.status(400).json({ success: false, message: 'description 不能为空' });
  }
  const result = db.prepare('INSERT INTO deployments (description) VALUES (?)').run(description.trim());
  const row = db.prepare('SELECT * FROM deployments WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: row });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// ===== 启动服务 =====
// 监听 0.0.0.0 以允许容器外部访问
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${port}`);
  console.log(`Database: ${dbPath}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  db.close();
  process.exit(0);
});
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
