import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

/**
 * 登录页 —— 卡片居中布局
 */
export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('请填写用户名和密码');
      return;
    }

    const result = login(username.trim(), password.trim());
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1>🔑 登录</h1>
        <p className="auth-subtitle">欢迎回到 Cai 的博客</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              id="username"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              id="password"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-auth">登录</button>
        </form>

        <p className="auth-switch">
          <Link to="/forgot-password">忘记密码？</Link>
        </p>
        <p className="auth-switch">
          还没有账号？<Link to="/register">立即注册</Link>
        </p>
      </div>
    </div>
  );
}
