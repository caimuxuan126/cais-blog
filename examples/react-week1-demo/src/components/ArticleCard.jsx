export default function ArticleCard({ article, onDelete }) {
  const { id, title, summary, category, tags } = article;

  return (
    <div className="article-card card">
      <div className="article-card-header">
        <h3>{title}</h3>
        <button className="danger-btn" onClick={() => onDelete(id)}>删除</button>
      </div>
      <div className="article-meta">
        {category && <span className="article-cat">{category}</span>}
      </div>
      {summary && <p className="article-summary">{summary}</p>}
      {tags && tags.length > 0 && (
        <div className="article-tags">
          {tags.map(t => <span key={t} className="article-tag">#{t}</span>)}
        </div>
      )}
    </div>
  );
}
