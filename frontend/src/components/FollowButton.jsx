import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isFollowing, isMutualFollow, followUser, unfollowUser, createNotification } from '../utils/storage';

/**
 * 关注/取消关注按钮
 * targetUserId  : 要被关注的人
 * targetName    : 被关注者用户名
 * onUpdate      : 状态更新回调（可选，父组件刷新）
 */
export default function FollowButton({ targetUserId, targetName, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(() => user ? isFollowing(user.id, targetUserId) : false);
  const [mutual, setMutual] = useState(() => user ? isMutualFollow(user.id, targetUserId) : false);

  if (!user) {
    return (
      <button className="follow-btn" onClick={() => navigate('/login')}>
        + 关注
      </button>
    );
  }

  if (user.id === targetUserId) return null; // 不能关注自己

  const handleFollow = () => {
    const result = followUser(user.id, targetUserId);
    if (result.success) {
      setFollowing(true);
      setMutual(result.isMutual);
      // 发送关注通知
      createNotification({
        userId: targetUserId, fromUserId: user.id, fromName: user.username,
        type: 'follow', message: `${user.username} 关注了你`
      });
      if (result.isMutual) {
        createNotification({
          userId: targetUserId, fromUserId: user.id, fromName: user.username,
          type: 'mutual', message: `你和 ${user.username} 成为互关好友，可以开始聊天了！`
        });
        createNotification({
          userId: user.id, fromUserId: targetUserId, fromName: targetName,
          type: 'mutual', message: `你和 ${targetName} 成为互关好友，可以开始聊天了！`
        });
      }
      if (onUpdate) onUpdate({ following: true, mutual: result.isMutual });
    } else {
      alert(result.message);
    }
  };

  const handleUnfollow = () => {
    if (!window.confirm('确定取消关注？')) return;
    unfollowUser(user.id, targetUserId);
    setFollowing(false);
    setMutual(false);
    if (onUpdate) onUpdate({ following: false, mutual: false });
  };

  if (mutual) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span className="follow-btn mutual" style={{ borderColor: '#3fb950', color: '#3fb950', cursor: 'default' }}>
          🤝 已互关
        </span>
        <button className="follow-btn unfollow" onClick={handleUnfollow}>取消关注</button>
      </span>
    );
  }

  if (following) {
    return (
      <button className="follow-btn unfollow" onClick={handleUnfollow}>
        ✓ 已关注
      </button>
    );
  }

  return (
    <button className="follow-btn" onClick={handleFollow}>
      + 关注
    </button>
  );
}
