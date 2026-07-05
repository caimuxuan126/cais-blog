import { useState } from 'react';
import './SearchBar.css';

/**
 * 搜索栏组件
 * compact 模式用于卡片内嵌搜索
 */
export default function SearchBar({ onSearch, compact = false }) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <form className={`search-bar ${compact ? 'search-bar--compact' : ''}`} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="搜索文章..."
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="btn-search">搜索</button>
      {keyword && (
        <button type="button" onClick={handleClear} className="btn-clear">✕</button>
      )}
    </form>
  );
}
