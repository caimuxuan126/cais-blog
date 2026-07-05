import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initSeedData, initSocialSeedData } from './utils/storage';
import App from './App';
import './index.css';

// 首次访问时写入默认示例文章和社交演示数据（已有则跳过）
initSeedData();
initSocialSeedData();

/**
 * 应用入口 —— Cai's Blog
 * BrowserRouter: 前端路由
 * AuthProvider: 全局认证状态
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
