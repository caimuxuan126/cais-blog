import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../utils/storage';

/**
 * 认证上下文
 * 提供全局的用户登录状态和认证方法
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 页面加载时从 localStorage 恢复登录状态
  useEffect(() => {
    const saved = getCurrentUser();
    if (saved) setUser(saved);
  }, []);

  /** 登录 */
  const login = (username, password) => {
    const result = loginUser(username, password);
    if (result.success) setUser(result.user);
    return result;
  };

  /** 注册 */
  const register = (username, password) => {
    const result = registerUser(username, password);
    if (result.success) setUser(result.user);
    return result;
  };

  /** 退出 */
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** 自定义 Hook - 方便组件获取认证状态 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
}
