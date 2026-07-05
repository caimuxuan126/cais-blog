import { Link } from 'react-router-dom';
import { stripMarkdown } from '../utils/storage';
import './ArticleCard.css';

/**
 * 文章卡片组件（用于文章列表场景）
 * 显示标题、Markdown 剥离摘要、阅读量、点赞数
 */
export default function ArticleCard({ article }) {
  const { id, title, content, likes, views, createdAt } = article;

  const excerpt = stripMarkdown(content).slice(0, 150);
  const displayExcerpt = excerpt.length < content.replace(/\s/g, '').length
    ? excerpt + '...'
    : excerpt;

  const dateStr = new Date(createdAt).toLocaleDateString('zh-CN');

  return (
    <div className="article-card card">
      <h2 className="card-title">
        <Link to={`/article/${id}`}>{title}</Link>
      </h2>
      <div className="card-meta">
        <span>🕒 {dateStr}</span>
        <span>👁️ {views || 0} 阅读</span>
        <span>❤️ {likes.length} 赞</span>
      </div>
      <p className="card-excerpt">{displayExcerpt}</p>
      <Link to={`/article/${id}`} className="read-more">阅读全文 →</Link>
    </div>
  );
}
