import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles, getArticlesByCategory, getArticlesByTag, searchArticles, CATEGORIES, stripMarkdown } from '../utils/storage';
import SearchBar from '../components/SearchBar';
import './ArticlesPage.css';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [activeCat, setActiveCat] = useState('');
  const [activeTag, setActiveTag] = useState('');

  useEffect(() => { setArticles(getArticles()); }, []);

  const handleSearch = (kw) => {
    setKeyword(kw);
    setActiveCat(''); setActiveTag('');
    setArticles(searchArticles(kw));
  };

  const handleCategory = (cat) => {
    setActiveCat(cat); setActiveTag(''); setKeyword('');
    setArticles(getArticlesByCategory(cat));
  };

  const handleTagClick = (tag) => {
    setActiveTag(tag); setActiveCat(''); setKeyword('');
    setArticles(getArticlesByTag(tag));
  };

  const clearFilters = () => {
    setActiveCat(''); setActiveTag(''); setKeyword('');
    setArticles(getArticles());
  };

  return (
    <div className="articles-page">
      <h1>📖 全部文章</h1>
      <p className="articles-subtitle">这里记录我的学习笔记、项目实践和个人思考</p>

      {/* 板块筛选 */}
      <div className="cat-filter">
        <button className={`cat-tab ${activeCat === '' && !activeTag ? 'active' : ''}`} onClick={clearFilters}>全部</button>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`cat-tab ${activeCat === cat ? 'active' : ''}`} onClick={() => handleCategory(cat)}>{cat}</button>
        ))}
      </div>

      <SearchBar onSearch={handleSearch} />

      {/* 当前筛选提示 */}
      {(activeTag || keyword) && (
        <div className="filter-info">
          {activeTag && <span>🏷️ 标签：{activeTag}</span>}
          {keyword && <span>🔍 搜索：{keyword}</span>}
          <span className="filter-count">— {articles.length} 篇</span>
          <button className="filter-clear" onClick={clearFilters}>✕ 清除筛选</button>
        </div>
      )}

      {articles.length === 0 ? (
        <div className="card empty-card">
          <p>{keyword ? '没有找到匹配的文章' : activeCat ? `"${activeCat}" 板块暂时还没有文章` : activeTag ? `没有找到标签为 "${activeTag}" 的文章` : '暂无文章'}</p>
        </div>
      ) : (
        <div className="articles-grid">
          {articles.map(a => {
            const excerpt = stripMarkdown(a.content).slice(0, 180);
            const displayExcerpt = excerpt.length < stripMarkdown(a.content).length ? excerpt + '...' : excerpt;
            const safeTags = a.tags || [];
            return (
              <Link to={`/article/${a.id}`} key={a.id} className="article-card-link">
                <div className="article-card-item card">
                  <h2 className="item-title">{a.title}</h2>
                  <div className="item-meta">
                    {a.category && <span className="item-cat">{a.category}</span>}
                    <span>🕒 {new Date(a.createdAt).toLocaleDateString('zh-CN')}</span>
                    <span>👁️ {a.views || 0} 阅读</span>
                    <span>❤️ {a.likes.length} 赞</span>
                  </div>
                  <p className="item-excerpt">{displayExcerpt}</p>
                  {safeTags.length > 0 && (
                    <div className="item-tags" onClick={e => e.preventDefault()}>
                      {safeTags.map(t => (
                        <span key={t} className={`item-tag ${activeTag === t ? 'item-tag--active' : ''}`} onClick={() => handleTagClick(t)}>#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="articles-back">
        <Link to="/home" className="back-link">← 返回首页</Link>
      </div>
    </div>
  );
}
