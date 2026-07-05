import { useState } from 'react';
import TagInput from './TagInput';

export default function ArticleForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('技术笔记');
  const [tags, setTags] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), summary: summary.trim(), category, tags });
    setTitle(''); setSummary(''); setTags([]);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>标题</label>
        <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="文章标题" />
      </div>
      <div className="form-group">
        <label>摘要</label>
        <textarea className="form-textarea" value={summary} onChange={e => setSummary(e.target.value)} placeholder="简短摘要" />
      </div>
      <div className="form-group">
        <label>分类</label>
        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
          {['技术笔记', '项目复盘', '大学学习', '生活记录', '随笔思考'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>标签</label>
        <TagInput tags={tags} onChange={setTags} />
      </div>
      <button type="submit" className="brand-btn">添加文章</button>
    </form>
  );
}
