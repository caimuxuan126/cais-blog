import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

/**
 * 忘记密码页 —— 从 localStorage 找回或重置密码
 */
export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null); // { type: 'found'|'notfound', password: '', username: '' }
  const [newPassword, setNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setResetMsg('');
    if (!username.trim()) return;

    try {
      const users = JSON.parse(localStorage.getItem('blog_users') || '[]');
      const user = users.find(u => u.username === username.trim());
      if (user) {
        setResult({ type: 'found', password: user.password, username: user.username });
      } else {
        setResult({ type: 'notfound', password: '', username: username.trim() });
      }
    } catch {
      setResult({ type: 'notfound', password: '', username: username.trim() });
    }
  };

  const handleReset = () => {
    if (!newPassword.trim()) return;
    try {
      const users = JSON.parse(localStorage.getItem('blog_users') || '[]');
      const user = users.find(u => u.username === result.username);
      if (user) {
        user.password = newPassword.trim();
        localStorage.setItem('blog_users', JSON.stringify(users));
        setResult({ ...result, password: newPassword.trim() });
        setResetMsg('✅ 密码已更新！');
        setNewPassword('');
      }
    } catch {
      setResetMsg('❌ 重置失败，请重试');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card" style={{ maxWidth: 420 }}>
        <h1>🔍 找回密码</h1>
        <p className="auth-subtitle">输入用户名查找你的账号</p>

        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              id="username"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={e => { setUsername(e.target.value); setResult(null); }}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-auth" disabled={!username.trim()}>
            查找
          </button>
        </form>

        {result?.type === 'found' && (
          <div style={{
            marginTop: 20, padding: '16px 20px', borderRadius: 12,
            background: 'rgba(63,185,80,0.08)', border: '1px solid rgba(63,185,80,0.2)'
          }}>
            <p style={{ margin: 0, color: '#3fb950', fontSize: '0.92rem' }}>
              ✅ 找到账号 <strong>{result.username}</strong>
            </p>
            <p style={{ margin: '8px 0 0', color: '#c9d1d9', fontSize: '0.88rem', wordBreak: 'break-all' }}>
              密码：<code style={{
                background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 4,
                fontSize: '0.92rem', color: '#58a6ff'
              }}>{result.password}</code>
            </p>

            <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
              <p style={{ margin: '0 0 8px', color: '#8b949e', fontSize: '0.85rem' }}>
                或者直接设置新密码：
              </p>
              <div className="form-group" style={{ marginBottom: 10 }}>
                <input
                  type="text"
                  placeholder="输入新密码"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="form-input"
                />
              </div>
              <button
                className="brand-btn"
                onClick={handleReset}
                disabled={!newPassword.trim()}
                style={{ width: '100%', padding: '10px', fontSize: '0.9rem', cursor: 'pointer', border: 'none', borderRadius: 8 }}
              >
                重置密码
              </button>
              {resetMsg && (
                <p style={{
                  margin: '10px 0 0', fontSize: '0.85rem',
                  color: resetMsg.includes('✅') ? '#3fb950' : '#f85149'
                }}>
                  {resetMsg}
                </p>
              )}
            </div>
          </div>
        )}

        {result?.type === 'notfound' && (
          <div style={{
            marginTop: 20, padding: '14px 20px', borderRadius: 12,
            background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.2)'
          }}>
            <p style={{ margin: 0, color: '#f85149', fontSize: '0.9rem' }}>
              ❌ 用户名 <strong>{result.username}</strong> 不存在
            </p>
          </div>
        )}

        <p className="auth-switch">
          <Link to="/login">← 返回登录</Link>
        </p>
      </div>
    </div>
  );
}
