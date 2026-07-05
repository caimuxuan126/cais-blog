const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'blog.db');

// 全局数据库实例（异步初始化）
let db = null;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  // 如果已有数据库文件则读取，否则创建
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // 建表
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      category TEXT DEFAULT '随笔思考',
      tags TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT
    )
  `);

  // 种子数据
  const count = db.exec('SELECT COUNT(*) as c FROM posts');
  const c = count.length > 0 ? count[0].values[0][0] : 0;
  if (c === 0) {
    db.run("INSERT INTO posts (title, content, category, tags, created_at) VALUES (?, ?, ?, ?, '2026-06-10 09:00:00')",
      ['SQL 入门笔记', 'SQL 是操作关系型数据库的标准语言...', '技术笔记', '["SQL","数据库"]']);
    db.run("INSERT INTO posts (title, content, category, tags, created_at) VALUES (?, ?, ?, ?, '2026-06-12 14:00:00')",
      ['博客项目的数据库设计思考', '从 localStorage 到 SQLite 的迁移思路...', '项目复盘', '["数据库","项目复盘"]']);
    db.run("INSERT INTO comments (post_id, content, created_at) VALUES (?, ?, '2026-06-11 10:00:00')",
      [1, '写得很清楚，学习了！']);
    db.run("INSERT INTO comments (post_id, content, created_at) VALUES (?, ?, '2026-06-12 08:00:00')",
      [1, 'SQL 入门确实要先从 SELECT 开始']);
    saveDb();
  }

  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, buffer);
}

// 将 sql.js 查询结果转为对象数组
function toRows(result) {
  if (!result || result.length === 0) return [];
  const [{ columns, values }] = result;
  return values.map(row => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

function getAll(sql, params = []) {
  const result = db.exec(sql, params);
  return toRows(result);
}

function getOne(sql, params = []) {
  const rows = getAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

module.exports = { getDb, saveDb, run, getAll, getOne };
