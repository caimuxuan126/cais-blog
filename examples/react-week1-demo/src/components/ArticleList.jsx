import ArticleCard from './ArticleCard';

export default function ArticleList({ articles, onDelete }) {
  if (articles.length === 0) {
    return <div className="empty card">暂无文章，请先添加一篇</div>;
  }

  return (
    <div>
      {articles.map(a => (
        <ArticleCard key={a.id} article={a} onDelete={onDelete} />
      ))}
    </div>
  );
}
