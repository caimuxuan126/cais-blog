/**
 * 前端 API 工具 — 统一管理所有后端请求
 */
const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || '请求失败');
  return data;
}

// ---- Auth ----
export const auth = {
  register: (username, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }),
  login: async (username, password) => {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    localStorage.setItem('token', data.access_token);
    return data;
  },
  me: () => request('/auth/me'),
  logout: () => { localStorage.removeItem('token'); },
  isLoggedIn: () => !!getToken(),
};

// ---- Posts ----
export const posts = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/posts${q ? '?' + q : ''}`);
  },
  hot: () => request('/posts/hot'),
  stats: () => request('/posts/stats'),
  get: (id) => request(`/posts/${id}`),
  create: (data) => request('/posts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
};

// ---- Comments ----
export const comments = {
  list: (postId) => request(`/posts/${postId}/comments`),
  create: (postId, content) => request(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
  delete: (postId, commentId) => request(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' }),
};

// ---- Interactions ----
export const interactions = {
  like: (postId) => request(`/posts/${postId}/like`, { method: 'POST' }),
  favorite: (postId) => request(`/posts/${postId}/favorite`, { method: 'POST' }),
  myFavorites: () => request('/favorites'),
};
