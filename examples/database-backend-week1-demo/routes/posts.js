const express = require('express');
const router = express.Router();
const { getAll, getOne, run } = require('../db');

// GET /api/posts — 文章列表（支持 ?category=）
router.get('/', (req, res) => {
  const { category } = req.query;
  let posts;
  if (category) {
    posts = getAll('SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC', [category]);
  } else {
    posts = getAll('SELECT * FROM posts ORDER BY created_at DESC');
  }
  posts = posts.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') }));
  res.json({ success: true, data: posts });
});

// GET /api/posts/:id — 文章详情
router.get('/:id', (req, res) => {
  const post = getOne('SELECT * FROM posts WHERE id = ?', [req.params.id]);
  if (!post) return res.status(404).json({ success: false, message: '文章不存在' });
  post.tags = JSON.parse(post.tags || '[]');
  res.json({ success: true, data: post });
});

// POST /api/posts — 新增文章
router.post('/', (req, res) => {
  const { title, content, category, tags } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ success: false, message: '标题不能为空' });
  if (!content || !content.trim()) return res.status(400).json({ success: false, message: '内容不能为空' });

  run('INSERT INTO posts (title, content, category, tags) VALUES (?, ?, ?, ?)',
    [title.trim(), content.trim(), category || '随笔思考', JSON.stringify(tags || [])]);

  const post = getOne('SELECT * FROM posts ORDER BY id DESC LIMIT 1');
  post.tags = JSON.parse(post.tags || '[]');
  res.status(201).json({ success: true, data: post });
});

// PUT /api/posts/:id — 更新文章
router.put('/:id', (req, res) => {
  const post = getOne('SELECT * FROM posts WHERE id = ?', [req.params.id]);
  if (!post) return res.status(404).json({ success: false, message: '文章不存在' });

  const { title, content, category, tags } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ success: false, message: '标题不能为空' });

  run("UPDATE posts SET title=?, content=?, category=?, tags=?, updated_at=datetime('now','localtime') WHERE id=?",
    [title.trim(), (content || '').trim(), category || post.category, JSON.stringify(tags || []), req.params.id]);

  const updated = getOne('SELECT * FROM posts WHERE id = ?', [req.params.id]);
  updated.tags = JSON.parse(updated.tags || '[]');
  res.json({ success: true, data: updated });
});

// DELETE /api/posts/:id — 删除文章（级联删评论）
router.delete('/:id', (req, res) => {
  const post = getOne('SELECT * FROM posts WHERE id = ?', [req.params.id]);
  if (!post) return res.status(404).json({ success: false, message: '文章不存在' });

  run('DELETE FROM comments WHERE post_id = ?', [req.params.id]);
  run('DELETE FROM posts WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '已删除' });
});

module.exports = router;
