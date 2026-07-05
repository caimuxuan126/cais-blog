const express = require('express');
const router = express.Router({ mergeParams: true });
const { getAll, getOne, run } = require('../db');

// GET /api/posts/:id/comments
router.get('/', (req, res) => {
  const post = getOne('SELECT id FROM posts WHERE id = ?', [req.params.id]);
  if (!post) return res.status(404).json({ success: false, message: '文章不存在' });

  const comments = getAll('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC', [req.params.id]);
  res.json({ success: true, data: comments });
});

// POST /api/posts/:id/comments
router.post('/', (req, res) => {
  const post = getOne('SELECT id FROM posts WHERE id = ?', [req.params.id]);
  if (!post) return res.status(404).json({ success: false, message: '文章不存在' });

  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ success: false, message: '评论内容不能为空' });

  run('INSERT INTO comments (post_id, content) VALUES (?, ?)', [req.params.id, content.trim()]);
  const comment = getOne('SELECT * FROM comments ORDER BY id DESC LIMIT 1');
  res.status(201).json({ success: true, data: comment });
});

// PUT /api/posts/:id/comments/:commentId
router.put('/:commentId', (req, res) => {
  const comment = getOne('SELECT * FROM comments WHERE id = ? AND post_id = ?', [req.params.commentId, req.params.id]);
  if (!comment) return res.status(404).json({ success: false, message: '评论不存在' });

  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ success: false, message: '评论内容不能为空' });

  run("UPDATE comments SET content=?, updated_at=datetime('now','localtime') WHERE id=?", [content.trim(), req.params.commentId]);
  const updated = getOne('SELECT * FROM comments WHERE id = ?', [req.params.commentId]);
  res.json({ success: true, data: updated });
});

// DELETE /api/posts/:id/comments/:commentId
router.delete('/:commentId', (req, res) => {
  const comment = getOne('SELECT * FROM comments WHERE id = ? AND post_id = ?', [req.params.commentId, req.params.id]);
  if (!comment) return res.status(404).json({ success: false, message: '评论不存在' });

  run('DELETE FROM comments WHERE id = ?', [req.params.commentId]);
  res.json({ success: true, message: '已删除' });
});

module.exports = router;
