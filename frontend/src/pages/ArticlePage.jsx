import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticleById, toggleLike, incrementViews, createNotification, getUsers } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import FollowButton from '../components/FollowButton';
import './ArticlePage.css';

/**
 * 文章详情页 —— react-markdown 渲染 + 阅读量统计
 */
export default function ArticlePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const found = getArticleById(id);
    if (found) {
      // 阅读量 +1
      const newViews = incrementViews(id);
      setArticle({ ...found, views: newViews });
    } else {
      setArticle(null);
    }
  }, [id]);

  const handleLike = () => {
    if (!user) return alert('请先登录再点赞');
    const result = toggleLike(article.id, user.id);
    if (result.success) {
      setArticle(prev => ({ ...prev, likes: result.likes }));
      // 点赞成功时发送通知给文章作者
      const wasLiked = result.likes.includes(user.id);
      if (wasLiked && user.username !== article.author) {
        createNotification({
          userId: getAuthorId(),
          fromUserId: user.id, fromName: user.username,
          type: 'like', articleId: article.id, articleTitle: article.title,
          message: `${user.username} 赞了你的文章《${article.title}》`
        });
      }
    }
  };

  // 根据用户名查找作者 ID
  const getAuthorId = () => {
    const users = getUsers();
    const author = users.find(u => u.username === article.author);
    return author ? author.id : null;
  };

  if (!article) {
    return (
      <div className="article-page">
        <div className="card empty-card">
          <p>文章不存在或已被删除</p>
          <Link to="/home" className="back-link">← 返回首页</Link>
        </div>
      </div>
    );
  }

  const isLiked = user && article.likes.includes(user.id);

  return (
    <div className="article-page">
      <Link to="/home" className="back-link">← 返回首页</Link>

      <article className="article-full card">
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          {article.category && <span className="item-cat-detail">{article.category}</span>}
          <span>✍️ {article.author}</span>
          <FollowButton targetUserId={getAuthorId()} targetName={article.author} />
          <span>🕒 {new Date(article.createdAt).toLocaleString('zh-CN')}</span>
          <span>👁️ {article.views || 0} 阅读</span>
          <span>❤️ {article.likes.length} 赞</span>
        </div>
        {(article.tags || []).length > 0 && (
          <div className="article-detail-tags">
            {article.tags.map(t => <span key={t} className="detail-tag">#{t}</span>)}
          </div>
        )}

        {/* 点赞 + 编辑 */}
        <div className="like-area">
          <button
            onClick={handleLike}
            className={`btn-like ${isLiked ? 'liked' : ''}`}
          >
            {isLiked ? '❤️' : '🤍'} {article.likes.length} 赞
          </button>
          {user && user.username === article.author && (
            <button
              className="btn-edit-article"
              onClick={() => navigate(`/edit/${article.id}`)}
            >
              ✏️ 编辑文章
            </button>
          )}
        </div>

        {/* Markdown 渲染正文 */}
        <div className="article-content prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* 评论区 */}
      <CommentSection articleId={article.id} currentUser={user} articleAuthor={article.author} />
    </div>
  );
}
