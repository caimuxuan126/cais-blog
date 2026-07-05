import { useState, useEffect, useRef } from 'react';
import { getComments, addComment, updateComment, createNotification, getUsers } from '../utils/storage';
import './CommentSection.css';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export default function CommentSection({ articleId, currentUser, articleAuthor }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // 编辑状态
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editError, setEditError] = useState('');
  const editFileRef = useRef(null);

  useEffect(() => {
    setComments(getComments(articleId));
  }, [articleId]);

  // ============ 新建评论 ============

  const processImageFile = (file, setPreview, setImg, setErr) => {
    setErr('');
    if (!file.type.startsWith('image/')) { setErr('请选择图片文件'); return; }
    if (file.size > MAX_IMAGE_SIZE) { setErr('图片过大，请选择 2MB 以内的图片'); return; }
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    const reader = new FileReader();
    reader.onload = () => setImg({ base64: reader.result, name: file.name, type: file.type });
    reader.readAsDataURL(file);
  };

  const clearImage = (preview, setPreview, setImg) => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setImg(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processImageFile(file, setImagePreview, setImage, setError);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!text.trim() && !image) { setError('请输入评论内容或选择一张图片'); return; }
    const nc = addComment(articleId, currentUser.username, text.trim(), image);
    setComments(prev => [...prev, nc]);
    setText('');
    clearImage(imagePreview, setImagePreview, setImage);

    // 评论通知文章作者
    if (articleAuthor && currentUser.username !== articleAuthor) {
      const users = getUsers();
      const author = users.find(u => u.username === articleAuthor);
      if (author) {
        createNotification({
          userId: author.id, fromUserId: currentUser.id, fromName: currentUser.username,
          type: 'comment', articleId, articleTitle: null,
          message: `${currentUser.username} 评论了你的文章：${text.trim().slice(0, 40)}${text.trim().length > 40 ? '...' : ''}`
        });
      }
    }
  };

  // ============ 编辑评论 ============

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditText(c.content || '');
    setEditImage(c.image ? { base64: c.image, name: c.imageName, type: c.imageType } : null);
    setEditPreview(c.image || null);
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    clearImage(editPreview, setEditPreview, setEditImage);
    setEditError('');
  };

  const handleEditImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // 清除旧预览 URL
    if (editPreview && !editPreview.startsWith('data:')) URL.revokeObjectURL(editPreview);
    processImageFile(file, setEditPreview, setEditImage, setEditError);
    e.target.value = '';
  };

  const removeEditImage = () => {
    clearImage(editPreview, setEditPreview, setEditImage);
  };

  const saveEdit = () => {
    setEditError('');
    if (!editText.trim() && !editImage) { setEditError('评论内容不能为空'); return; }
    const updated = updateComment(editingId, editText.trim(), editImage);
    if (updated) {
      setComments(prev => prev.map(c => c.id === editingId ? updated : c));
    }
    cancelEdit();
  };

  // ============ 渲染 ============

  return (
    <div className="comment-section card">
      <h3>💬 评论 ({comments.length})</h3>

      {/* ---- 新评论表单 ---- */}
      {currentUser ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea placeholder="写下你的评论..." value={text} onChange={e => setText(e.target.value)} rows={3} className="comment-input" />
          {imagePreview && (
            <div className="img-preview">
              <img src={imagePreview} alt="预览" />
              <button type="button" className="img-remove-btn" onClick={() => clearImage(imagePreview, setImagePreview, setImage)}>✕ 移除图片</button>
            </div>
          )}
          {error && <p className="comment-error">{error}</p>}
          <div className="comment-actions">
            <button type="button" className="img-upload-btn" onClick={() => fileInputRef.current?.click()}>🖼️ 添加图片</button>
            <input ref={fileInputRef} type="file" accept="image/*" className="img-file-input" onChange={handleImageSelect} />
            <button type="submit" className="brand-btn" style={{ fontSize: '0.85rem' }}>发表评论</button>
          </div>
        </form>
      ) : (
        <p className="comment-hint">请先登录后再发表评论</p>
      )}

      {/* ---- 评论列表 ---- */}
      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="no-comment">暂无评论，来抢沙发吧~</p>
        ) : (
          comments.map(c => (
            <div key={c.id} className="comment-item">
              {editingId === c.id ? (
                /* ===== 编辑模式 ===== */
                <div className="edit-area">
                  <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={3} className="comment-input" placeholder="编辑评论..." />
                  {editPreview && (
                    <div className="img-preview">
                      <img src={editPreview} alt="编辑预览" />
                      <button type="button" className="img-remove-btn" onClick={removeEditImage}>✕ 移除图片</button>
                    </div>
                  )}
                  {editError && <p className="comment-error">{editError}</p>}
                  <div className="comment-actions">
                    <button type="button" className="img-upload-btn" onClick={() => editFileRef.current?.click()}>🖼️ 换图片</button>
                    <input ref={editFileRef} type="file" accept="image/*" className="img-file-input" onChange={handleEditImage} />
                    <button type="button" className="brand-btn" style={{ fontSize: '0.82rem' }} onClick={saveEdit}>保存</button>
                    <button type="button" className="cancel-btn" onClick={cancelEdit}>取消</button>
                  </div>
                </div>
              ) : (
                /* ===== 展示模式 ===== */
                <>
                  <div className="comment-meta">
                    <div className="comment-meta-left">
                      <strong>{c.author}</strong>
                      {c.updatedAt && <span className="edited-badge">已编辑</span>}
                    </div>
                    <div className="comment-meta-right">
                      <span>{new Date(c.createdAt).toLocaleString('zh-CN')}</span>
                      {currentUser && currentUser.username === c.author && (
                        <button className="edit-btn" onClick={() => startEdit(c)}>编辑</button>
                      )}
                    </div>
                  </div>
                  {c.content && <p className="comment-content">{c.content}</p>}
                  {c.image && (
                    <div className="comment-image">
                      <img src={c.image} alt={c.imageName || '评论图片'} />
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
