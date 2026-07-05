import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import IntroPage from './pages/IntroPage';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticlePage from './pages/ArticlePage';
import NewArticlePage from './pages/NewArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FavoritesPage from './pages/FavoritesPage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RegisterPage from './pages/RegisterPage';
import BubblesBackground from './components/BubblesBackground';
import './App.css';

/**
 * 应用根组件 —— Cai's Blog
 * 路由结构：
 *   /            → 初始欢迎页（IntroPage）
 *   /home        → 博客首页（卡片式个人主页）
 *   /articles    → 全部文章列表
 *   /article/:id → 文章详情页
 *   /new         → 撰写新文章（需登录）
 *   /about       → 关于我
 *   /login       → 登录页
 *   /register    → 注册页
 */
export default function App() {
  const location = useLocation();
  const isIntro = location.pathname === '/';

  return (
    <div className="app">
      {/* 博客页面才显示气泡背景和导航栏，IntroPage 自带全屏样式 */}
      {!isIntro && <BubblesBackground />}
      {!isIntro && <Header />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route
            path="/new"
            element={
              <AdminRoute>
                <NewArticlePage />
              </AdminRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <AdminRoute>
                <EditArticlePage />
              </AdminRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}
