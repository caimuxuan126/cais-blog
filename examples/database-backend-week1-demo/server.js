const express = require('express');
const { getDb } = require('./db');

const app = express();
const PORT = 4000;

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// 初始化数据库后启动
getDb().then(() => {
  const postsRouter = require('./routes/posts');
  const commentsRouter = require('./routes/comments');

  app.get('/', (req, res) => {
    res.json({
      message: 'Blog API Demo',
      endpoints: { posts: '/api/posts', comments: '/api/posts/:id/comments' }
    });
  });

  app.use('/api/posts', postsRouter);
  app.use('/api/posts/:id/comments', commentsRouter);

  app.use((req, res) => {
    res.status(404).json({ success: false, message: '接口不存在' });
  });

  app.listen(PORT, () => {
    console.log(`✅ 后端服务已启动: http://localhost:${PORT}`);
    console.log(`📋 文章列表: http://localhost:${PORT}/api/posts`);
  });
});
