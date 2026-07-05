import { useState, useEffect } from 'react';
import ArticleForm from './components/ArticleForm';
import ArticleList from './components/ArticleList';
import CategoryFilter from './components/CategoryFilter';

const CATEGORIES = ['全部', '技术笔记', '项目复盘', '大学学习', '生活记录', '随笔思考'];

export default function App() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('全部');

  // 从 localStorage 读取
  useEffect(() => {
    const saved = localStorage.getItem('demo-articles');
    if (saved) setArticles(JSON.parse(saved));
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem('demo-articles', JSON.stringify(articles));
  }, [articles]);

  const addArticle = (article) => {
    setArticles(prev => [{ ...article, id: Date.now().toString() }, ...prev]);
  };

  const deleteArticle = (id) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const filtered = category === '全部'
    ? articles
    : articles.filter(a => a.category === category);

  return (
    <div className="app">
      <h1>📝 React 文章卡片 Demo</h1>

      <ArticleForm onAdd={addArticle} />
      <CategoryFilter categories={CATEGORIES} active={category} onSelect={setCategory} />
      <ArticleList articles={filtered} onDelete={deleteArticle} />
    </div>
  );
}
