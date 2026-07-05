import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getConversations, sendMessage, markMessagesRead, createNotification } from '../utils/storage';
import './MessagesPage.css';

export default function MessagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activePeer, setActivePeer] = useState(null);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (user) setConversations(getConversations(user.id));
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activePeer]);

  if (!user) {
    return (
      <div className="msg-page">
        <div className="card empty-card">
          <p>请先登录</p>
          <Link to="/login" className="back-link">前往登录</Link>
        </div>
      </div>
    );
  }

  const activeConv = conversations.find(c => c.peerId === activePeer);

  const handleSelectPeer = (peerId) => {
    setActivePeer(peerId);
    markMessagesRead(peerId, user.id);
    // 刷新会话列表以更新未读数
    setConversations(prev => prev.map(c =>
      c.peerId === peerId ? { ...c, unread: 0 } : c
    ));
  };

  const handleSend = () => {
    if (!text.trim() || !activePeer) return;
    const activeConv = conversations.find(c => c.peerId === activePeer);
    const msg = sendMessage(user.id, activePeer, text.trim());
    if (msg) {
      const peerName = activeConv?.peerName || '对方';
      createNotification({
        userId: activePeer, fromUserId: user.id, fromName: user.username,
        type: 'message', message: `${user.username}：${text.trim().slice(0, 30)}${text.trim().length > 30 ? '...' : ''}`
      });
      setText('');
      setConversations(getConversations(user.id));
    }
  };

  return (
    <div className="msg-page">
      <div className="msg-container card">
        {/* 左侧会话列表 */}
        <div className="msg-sidebar">
          <div className="msg-sidebar-header">
            <h2>💬 私信</h2>
          </div>
          {conversations.length === 0 ? (
            <div className="msg-empty-sidebar">
              <p>暂无好友会话</p>
              <p className="text-muted">互关好友才能发送私信</p>
              <p className="text-muted">去文章页关注其他用户吧</p>
            </div>
          ) : (
            conversations.map(c => (
              <div
                key={c.peerId}
                className={`msg-peer ${activePeer === c.peerId ? 'active' : ''}`}
                onClick={() => handleSelectPeer(c.peerId)}
              >
                <div className="msg-peer-avatar">👤</div>
                <div className="msg-peer-info">
                  <div className="msg-peer-name">
                    {c.peerName}
                    {c.unread > 0 && <span className="msg-peer-badge">{c.unread}</span>}
                  </div>
                  <div className="msg-peer-preview">
                    {c.lastMsg ? c.lastMsg.content.slice(0, 25) + (c.lastMsg.content.length > 25 ? '...' : '') : '暂无消息'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 右侧聊天区 */}
        <div className="msg-chat">
          {!activePeer ? (
            <div className="msg-chat-empty">
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>💬</div>
              <p>选择一个好友开始聊天</p>
              <p className="text-muted">仅互关好友可以发送私信</p>
            </div>
          ) : activeConv ? (
            <>
              <div className="msg-chat-header">
                <span>👤 {activeConv.peerName}</span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>🤝 互关好友</span>
              </div>
              <div className="msg-chat-body">
                {activeConv.messages.map(m => {
                  const isMe = m.senderId === user.id;
                  return (
                    <div key={m.id} className={`msg-bubble-row ${isMe ? 'msg-me' : 'msg-other'}`}>
                      <div className={`msg-bubble ${isMe ? 'bubble-me' : 'bubble-other'}`}>
                        {m.content}
                      </div>
                      <div className="msg-time">
                        {new Date(m.createdAt).toLocaleString('zh-CN')}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <div className="msg-chat-input">
                <input
                  className="input"
                  placeholder="输入消息..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button className="brand-btn" onClick={handleSend} disabled={!text.trim()}>
                  发送
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
