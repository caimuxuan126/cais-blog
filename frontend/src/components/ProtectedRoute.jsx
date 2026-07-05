import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * 路由守卫组件
 * 未登录用户访问受保护页面时，重定向到登录页
 */
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
