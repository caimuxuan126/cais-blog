import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getArticles, searchArticles, getHotArticles, getStats, stripMarkdown
} from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import './HomePage.css';

/**
 * 首页 —— 3 列离散卡片布局的个人博客主页
 *
 * 左列：A.个人介绍  C.关于我
 * 中列：B.最新文章  F.热门文章
 * 右列：D.技术栈    E.项目记录  G.数据统计
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 18) return 'Good Afternoon';
  if (hour >= 18 && hour < 22) return 'Good Evening';
  return 'Good Night';
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [hotArticles, setHotArticles] = useState([]);
  const [stats, setStats] = useState({ articleCount: 0, commentCount: 0, likeCount: 0, totalViews: 0 });
  const [keyword, setKeyword] = useState('');
  const greeting = getGreeting();

  useEffect(() => {
    setArticles(getArticles());
    setHotArticles(getHotArticles(3));
    setStats(getStats());
  }, []);

  const handleSearch = (kw) => {
    setKeyword(kw);
    setArticles(searchArticles(kw));
  };

  const latestArticles = keyword ? articles : articles.slice(0, 3);

  return (
    <div className="home-page">

      {/* ========== 左列 ========== */}
      <div className="home-col home-col--left">

        {/* A. 个人介绍卡片 */}
        <section className="hi-card card">
          <Link to="/about" className="hi-avatar-link">
            <div className="hi-avatar">👨‍💻</div>
          </Link>
          <h1 className="hi-title">
            {greeting}<br />
            I'm <span className="text-linear hi-name">Cai</span>, Nice to<br />
            meet you!
          </h1>
          <p className="hi-subtitle">物理学专业，热爱编程与开源技术</p>
        </section>

        {/* C. 关于我卡片 */}
        <section className="about-card card">
          <h3 className="card-label">🙋 关于我</h3>
          <div className="about-card-body">
            <strong>Cai</strong>
            <span className="about-role">物理学 / 前端开发 / React</span>
            <p className="about-desc">
              热爱学习，正在完成从 0 到 1 的个人博客项目。这里记录我的学习笔记、项目实践和个人思考。
            </p>
          </div>
          <Link to="/about" className="about-link">了解更多 →</Link>
        </section>
      </div>

      {/* ========== 中列 ========== */}
      <div className="home-col home-col--mid">

        {/* B. 最新文章卡片 */}
        <section className="articles-card card">
          <div className="card-header-row">
            <h3 className="card-label">📖 最新文章</h3>
            <SearchBar onSearch={handleSearch} compact />
          </div>

          {keyword && (
            <p className="search-info">搜索 "{keyword}" — {articles.length} 篇</p>
          )}

          {latestArticles.length > 0 ? (
            <ul className="article-mini-list">
              {latestArticles.map((a) => (
                <li key={a.id}>
                  <Link to={`/article/${a.id}`} className="article-mini-item">
                    <span className="ami-title">{a.title}</span>
                    <span className="ami-meta">
                      {a.category && <span className="ami-cat">{a.category}</span>}
                      {new Date(a.createdAt).toLocaleDateString('zh-CN')} ·
                      👁️ {a.views || 0} · ❤️ {a.likes.length} · 💬 {a.commentCount ?? 0}
                    </span>
                    {(a.tags || []).length > 0 && (
                      <span className="ami-tags">{(a.tags || []).slice(0, 3).map(t => <span key={t} className="ami-tag">#{t}</span>)}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-hint">
              {keyword ? '没有找到匹配的文章' : '暂无文章，登录后可以发布第一篇博客'}
            </p>
          )}

          {articles.length > 0 && !keyword && (
            <button className="view-all-btn" onClick={() => navigate('/articles')}>
              查看全部 {articles.length} 篇文章 →
            </button>
          )}
        </section>

        {/* F. 热门文章卡片 */}
        {hotArticles.length > 0 && (
          <section className="hot-card card">
            <h3 className="card-label">🔥 热门文章</h3>
            <p className="card-sublabel">综合阅读量、点赞和评论的热度排行</p>
            <ul className="hot-list">
              {hotArticles.map((a, i) => (
                <li key={a.id}>
                  <Link to={`/article/${a.id}`} className="hot-item">
                    <span className="hot-rank">{['🥇','🥈','🥉'][i]}</span>
                    <span className="hot-item-title">{a.title}</span>
                    <span className="hot-item-score">{a.hotness}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* ========== 右列 ========== */}
      <div className="home-col home-col--right">

        {/* D. 技术栈卡片 */}
        <section className="tech-card card">
          <h3 className="card-label">🛠 技术栈</h3>
          <div className="tech-tags">
            <span className="ttag">HTML</span>
            <span className="ttag">CSS</span>
            <span className="ttag">JavaScript</span>
            <span className="ttag">React</span>
            <span className="ttag">Vite</span>
            <span className="ttag">Git</span>
            <span className="ttag">GitHub</span>
          </div>
        </section>

        {/* E. 项目记录卡片 */}
        <section className="project-card card">
          <h3 className="card-label">📂 项目记录</h3>
          <ul className="project-list">
            <li>从 0 到 1 搭建个人博客网站</li>
            <li>使用 localStorage 实现数据持久化</li>
            <li>实现登录、发文、评论、点赞、搜索</li>
            <li>支持 Markdown 编辑与实时预览</li>
          </ul>
        </section>

        {/* G. 数据统计卡片 */}
        <section className="stats-card card">
          <h3 className="card-label">📊 数据统计</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-num">{stats.articleCount}</span>
              <span className="stat-lbl">文章</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{stats.commentCount}</span>
              <span className="stat-lbl">评论</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{stats.likeCount}</span>
              <span className="stat-lbl">点赞</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{stats.totalViews}</span>
              <span className="stat-lbl">阅读</span>
            </div>
          </div>
        </section>
      </div>

      {/* ===== 底部快捷操作 ===== */}
      <div className="home-actions">
        {user ? (
          <Link to="/new" className="brand-btn">✏️ 写文章</Link>
        ) : (
          <Link to="/login" className="brand-btn">🔑 登录以开始写作</Link>
        )}
      </div>
    </div>
  );
}
