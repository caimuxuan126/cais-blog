import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUnreadNotifCount, getTotalUnreadMessages } from '../utils/storage';
import './Header.css';

/**
 * 顶部导航栏 —— 浮动卡片风格（博客页面专用）
 * 首页(/home) | 文章 | 关于我 | 写文章 | 登录/注册 或 用户/退出
 */
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifCount, setNotifCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    if (!user) { setNotifCount(0); setMsgCount(0); return; }
    setNotifCount(getUnreadNotifCount(user.id));
    setMsgCount(getTotalUnreadMessages(user.id));
    // 页面路由变化时刷新计数
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/articles' && location.pathname.startsWith('/article')) return true;
    if (path === '/home') return location.pathname === '/home';
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* 左侧：头像 + 站点名 → 博客首页 /home */}
        <Link to="/home" className="header-brand">
          <span className="header-avatar">🏠</span>
          <span className="header-title font-averia">Cai's Blog</span>
        </Link>

        {/* 右侧：导航菜单 */}
        <nav className="header-nav">
          <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
            首页
          </Link>
          <Link to="/articles" className={`nav-link ${isActive('/articles') ? 'active' : ''}`}>
            文章
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            关于我
          </Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
            联系我
          </Link>

          {user && (
            <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>
              收藏
            </Link>
          )}

          {user && (
            <Link to="/notifications" className={`nav-link nav-badge-link ${isActive('/notifications') ? 'active' : ''}`}>
              🔔{notifCount > 0 && <span className="nav-badge">{notifCount > 99 ? '99+' : notifCount}</span>}
            </Link>
          )}

          {user && (
            <Link to="/messages" className={`nav-link nav-badge-link ${isActive('/messages') ? 'active' : ''}`}>
              💬{msgCount > 0 && <span className="nav-badge">{msgCount > 99 ? '99+' : msgCount}</span>}
            </Link>
          )}

          {user ? (
            <>
              <Link to="/new" className="brand-btn" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                写文章
              </Link>
              <span className="user-info">{user.username}</span>
              <button onClick={handleLogout} className="btn-logout">
                退出
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">登录</Link>
              <Link to="/register" className="brand-btn" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                注册
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
