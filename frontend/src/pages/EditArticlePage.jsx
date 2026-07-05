import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticleById, updateArticle, CATEGORIES } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import './NewArticlePage.css';

const SUGGESTED_TAGS = ['React', 'Vite', 'JavaScript', 'CSS', '网络', '浏览器', 'DevTools', '项目复盘', '软件实训', '大学学习'];
const MAX_TAGS = 8;
const MAX_TAG_LEN = 12;

export default function EditArticlePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('技术笔记');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('edit');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const article = getArticleById(id);
    if (!article) { navigate('/home', { replace: true }); return; }
    // 只有作者本人能编辑
    if (article.author !== user?.username) { navigate(`/article/${id}`, { replace: true }); return; }
    setTitle(article.title);
    setContent(article.content);
    setCategory(article.category || '随笔思考');
    setTags(article.tags || []);
    setLoaded(true);
  }, [id, user, navigate]);

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

  const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag));

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('请输入文章标题'); return; }
    if (!content.trim()) { setError('请输入文章内容'); return; }
    updateArticle(id, title.trim(), content.trim(), category, tags);
    navigate(`/article/${id}`);
  };

  if (!loaded) return <div className="new-article-page"><p style={{ color: 'var(--secondary)', textAlign: 'center', padding: 60 }}>加载中...</p></div>;

  return (
    <div className="new-article-page">
      <h1>✏️ 编辑文章</h1>

      <form className="article-form card" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">文章标题</label>
          <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-input" maxLength={100} />
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

        {/* 标签 */}
        <div className="form-group">
          <label>文章标签</label>
          <div className="tag-input-row">
            <input type="text" placeholder="输入标签后按 Enter 添加" value={tagInput} onChange={e => { setTagInput(e.target.value); setTagError(''); }} onKeyDown={handleTagKeyDown} className="form-input tag-text-input" maxLength={MAX_TAG_LEN} />
            <button type="button" className="tag-add-btn" onClick={() => addTag(tagInput)}>添加</button>
          </div>
          {tagError && <p className="tag-error">{tagError}</p>}
          {tags.length > 0 && (
            <div className="tag-chips">
              {tags.map(t => (
                <span key={t} className="tag-chip">{t}<button type="button" className="tag-chip-del" onClick={() => removeTag(t)}>×</button></span>
              ))}
            </div>
          )}
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
              <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={mode === 'split' ? 20 : 14} className="form-textarea" />
            )}
            {(mode === 'preview' || mode === 'split') && (
              <div className="markdown-preview">
                {content.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown> : <p className="preview-empty">暂无内容</p>}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="brand-btn" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>保存修改</button>
      </form>
    </div>
  );
}
