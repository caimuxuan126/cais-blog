import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interactions } from '../utils/api';
import './ArticlesPage.css';

export default function FavoritesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interactions.myFavorites()
      .then(data => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="articles-page">
      <h1>⭐ 我的收藏</h1>
      <p className="articles-subtitle">收藏的文章会在这里集中展示</p>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--secondary)', padding: 40 }}>加载中...</p>
      ) : posts.length === 0 ? (
        <div className="card empty-card"><p>还没有收藏任何文章</p></div>
      ) : (
        <div className="articles-grid">
          {posts.map(a => (
            <Link to={`/article/${a.id}`} key={a.id} className="article-card-link">
              <div className="article-card-item card">
                <h2 className="item-title">{a.title}</h2>
                <div className="item-meta">
                  {a.category && <span className="item-cat">{a.category}</span>}
                  <span>👁️ {a.view_count || 0} 阅读</span>
                  <span>❤️ {a.like_count || 0} 赞</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="articles-back">
        <Link to="/home" className="back-link">← 返回首页</Link>
      </div>
    </div>
  );
}
