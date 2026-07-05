import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createArticle, CATEGORIES } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import './NewArticlePage.css';

const SUGGESTED_TAGS = ['React', 'Vite', 'JavaScript', 'CSS', '网络', '浏览器', 'DevTools', '项目复盘', '软件实训', '大学学习'];
const MAX_TAGS = 8;
const MAX_TAG_LEN = 12;

export default function NewArticlePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('edit');
  const [category, setCategory] = useState('技术笔记');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState('');

  const addTag = (tag) => {
    const t = tag.trim();
    if (!t) return;
    if (t.length > MAX_TAG_LEN) { setTagError(`标签最多 ${MAX_TAG_LEN} 个字`); return; }
    if (tags.includes(t)) { setTagError('该标签已存在'); return; }
    if (tags.length >= MAX_TAGS) { setTagError(`最多添加 ${MAX_TAGS} 个标签`); return; }
    setTags(prev => [...prev, t]);
    setTagInput('');
    setTagError('');
  };

  const removeTag = (tag) => { setTags(prev => prev.filter(t => t !== tag)); };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('请输入文章标题'); return; }
    if (!content.trim()) { setError('请输入文章内容'); return; }
    const article = createArticle(title.trim(), content.trim(), user.username, category, tags);
    navigate(`/article/${article.id}`);
  };

  return (
    <div className="new-article-page">
      <h1>✏️ 撰写新文章</h1>

      <form className="article-form card" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">文章标题</label>
          <input id="title" type="text" placeholder="请输入文章标题" value={title} onChange={e => setTitle(e.target.value)} className="form-input" maxLength={100} />
        </div>

        <div className="form-group">
          <label htmlFor="author">作者</label>
          <input id="author" type="text" value={user.username} disabled className="form-input disabled" />
        </div>

        <div className="form-group">
          <label htmlFor="category">板块分类</label>
          <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="form-select">
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* 标签输入 */}
        <div className="form-group">
          <label>文章标签</label>
          <div className="tag-input-row">
            <input
              type="text"
              placeholder="输入标签后按 Enter 添加"
              value={tagInput}
              onChange={e => { setTagInput(e.target.value); setTagError(''); }}
              onKeyDown={handleTagKeyDown}
              className="form-input tag-text-input"
              maxLength={MAX_TAG_LEN}
            />
            <button type="button" className="tag-add-btn" onClick={() => addTag(tagInput)}>添加</button>
          </div>
          {tagError && <p className="tag-error">{tagError}</p>}

          {/* 已添加的标签 */}
          {tags.length > 0 && (
            <div className="tag-chips">
              {tags.map(t => (
                <span key={t} className="tag-chip">
                  {t}
                  <button type="button" className="tag-chip-del" onClick={() => removeTag(t)}>×</button>
                </span>
              ))}
            </div>
          )}

          {/* 推荐标签 */}
          <div className="tag-suggestions">
            <span className="tag-sug-label">推荐：</span>
            {SUGGESTED_TAGS.filter(t => !tags.includes(t)).map(t => (
              <button type="button" key={t} className="tag-sug-btn" onClick={() => addTag(t)}>{t}</button>
            ))}
          </div>
          <p className="tag-info">最多 {MAX_TAGS} 个 · 已添加 {tags.length} 个</p>
        </div>

        {/* Markdown 编辑器 */}
        <div className="form-group">
          <div className="editor-header">
            <label>文章内容（支持 Markdown）</label>
            <div className="mode-tabs">
              <button type="button" className={`mode-tab ${mode === 'edit' ? 'active' : ''}`} onClick={() => setMode('edit')}>编辑</button>
              <button type="button" className={`mode-tab ${mode === 'preview' ? 'active' : ''}`} onClick={() => setMode('preview')}>预览</button>
              <button type="button" className={`mode-tab ${mode === 'split' ? 'active' : ''}`} onClick={() => setMode('split')}>分屏</button>
            </div>
          </div>
          <div className={`editor-area ${mode === 'split' ? 'editor-area--split' : ''}`}>
            {(mode === 'edit' || mode === 'split') && (
              <textarea id="content" placeholder={`使用 Markdown 语法编写文章内容...\n\n## 二级标题\n\n**加粗文字**\n\n- 列表项 1\n- 列表项 2\n\n> 引用文字\n\n\`\`\`js\nconsole.log('代码块');\n\`\`\``} value={content} onChange={e => setContent(e.target.value)} rows={mode === 'split' ? 20 : 14} className="form-textarea" />
            )}
            {(mode === 'preview' || mode === 'split') && (
              <div className="markdown-preview">
                {content.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown> : <p className="preview-empty">在左侧输入 Markdown 内容，这里将显示预览</p>}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="brand-btn" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>发布</button>
      </form>
    </div>
  );
}
