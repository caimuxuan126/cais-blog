import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * 管理员路由守卫
 * 仅 Cai 可以访问（写文章、编辑文章）
 */
export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.username !== 'Cai') {
    return <Navigate to="/home" replace />;
  }

  return children;
}
