import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotifRead, markAllNotifRead } from '../utils/storage';
import './NotificationsPage.css';

const TYPE_ICON = {
  like: '❤️',
  comment: '💬',
  follow: '👤',
  mutual: '🤝',
  message: '📩'
};
const TYPE_LABEL = {
  like: '赞了你的文章',
  comment: '评论了你的文章',
  follow: '关注了你',
  mutual: '成为互关好友',
  message: '发来私信'
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (user) setNotifs(getNotifications(user.id));
  }, [user]);

  const handleClick = (n) => {
    if (!n.isRead) {
      markNotifRead(n.id);
      setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
    }
  };

  const handleMarkAll = () => {
    if (!user) return;
    markAllNotifRead(user.id);
    setNotifs(prev => prev.map(x => ({ ...x, isRead: true })));
  };

  if (!user) {
    return (
      <div className="notif-page">
        <div className="card empty-card">
          <p>请先登录</p>
          <Link to="/login" className="back-link">前往登录</Link>
        </div>
      </div>
    );
  }

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <div className="notif-page">
      <div className="notif-header card">
        <h1>🔔 通知中心</h1>
        <div className="notif-actions">
          {unreadCount > 0 && (
            <span className="notif-badge-count">{unreadCount} 条未读</span>
          )}
          <button className="brand-btn" onClick={handleMarkAll} disabled={unreadCount === 0}>
            全部标为已读
          </button>
        </div>
      </div>

      <div className="notif-list">
        {notifs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <p style={{ color: 'var(--secondary)', fontSize: '1rem' }}>📭 暂无通知</p>
            <p style={{ color: 'var(--secondary)', fontSize: '0.82rem', opacity: 0.6 }}>
              当有人点赞、评论、关注你或发来私信时，通知会出现在这里
            </p>
          </div>
        ) : (
          notifs.map(n => (
            <div
              key={n.id}
              className={`notif-item card ${!n.isRead ? 'notif-unread' : ''}`}
              onClick={() => handleClick(n)}
            >
              <div className="notif-icon">{TYPE_ICON[n.type] || '📌'}</div>
              <div className="notif-body">
                <div className="notif-text">
                  <strong>{n.fromName}</strong>
                  <span>{TYPE_LABEL[n.type] || n.type}</span>
                  {n.articleTitle && (
                    <span className="notif-article-title">《{n.articleTitle}》</span>
                  )}
                </div>
                <div className="notif-message">{n.message}</div>
                <div className="notif-time">{new Date(n.createdAt).toLocaleString('zh-CN')}</div>
              </div>
              <div className="notif-tail">
                {!n.isRead && <span className="notif-dot" />}
                {n.articleId && (
                  <Link
                    to={`/article/${n.articleId}`}
                    className="notif-goto"
                    onClick={e => e.stopPropagation()}
                  >
                    查看 →
                  </Link>
                )}
                {n.type === 'message' && (
                  <Link
                    to="/messages"
                    className="notif-goto"
                    onClick={e => e.stopPropagation()}
                  >
                    回复 →
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
