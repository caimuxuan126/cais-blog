import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api';

export default function App() {
  const [health, setHealth] = useState(null);
  const [message, setMessage] = useState('');
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 加载数据
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [hRes, mRes, dRes] = await Promise.all([
        fetch(`${API_BASE}/health`),
        fetch(`${API_BASE}/message`),
        fetch(`${API_BASE}/deployments`)
      ]);
      const hData = await hRes.json();
      const mData = await mRes.json();
      const dData = await dRes.json();
      setHealth(hData);
      setMessage(mData.data?.message || '');
      setDeployments(dData.data || []);
    } catch (e) {
      setError('无法连接后端服务，请检查容器是否正常运行');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // 新增部署记录
  const addDeployment = async (e) => {
    e.preventDefault();
    if (!desc.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/deployments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setDesc('');
        setDeployments(prev => [data.data, ...prev]);
      }
    } catch {
      setError('提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>
      {/* 标题 */}
      <h1 style={{ color: '#58a6ff', fontSize: '1.8rem', marginBottom: 8 }}>
        🚀 Docker 部署与 CI/CD Demo
      </h1>
      <p style={{ color: '#8b949e', marginBottom: 24, fontSize: '0.92rem' }}>
        Docker Compose · Nginx · React · Express · SQLite
      </p>

      {/* 状态卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* 部署状态 */}
        <div style={cardStyle}>
          <div style={cardLabel}>部署状态</div>
          <div style={{ fontSize: '1.6rem' }}>
            {loading ? '⏳' : error ? '❌' : '✅'}
          </div>
          <div style={{ color: '#8b949e', fontSize: '0.85rem' }}>
            {loading ? '加载中...' : error ? '异常' : '运行中'}
          </div>
        </div>

        {/* 后端健康 */}
        <div style={cardStyle}>
          <div style={cardLabel}>后端健康</div>
          <div style={{ fontSize: '1.6rem' }}>
            {health?.success ? '✅' : loading ? '⏳' : '❌'}
          </div>
          <div style={{ color: '#8b949e', fontSize: '0.85rem' }}>
            {health?.message || '检查中...'}
          </div>
        </div>
      </div>

      {/* 后端消息 */}
      {message && (
        <div style={{ ...cardStyle, marginBottom: 24, borderLeft: '3px solid #3fb950' }}>
          <div style={cardLabel}>📬 后端消息</div>
          <div style={{ fontSize: '1rem' }}>{message}</div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div style={{ ...cardStyle, marginBottom: 24, borderLeft: '3px solid #f85149', background: 'rgba(248,81,73,0.1)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* 新增部署记录 */}
      <form onSubmit={addDeployment} style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={cardLabel}>📝 新增部署记录</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="描述本次部署..."
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 8,
              border: '1px solid #30363d', background: '#0d1117', color: '#c9d1d9',
              fontSize: '0.9rem', outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={submitting || !desc.trim()}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: submitting ? '#30363d' : '#238636', color: '#fff',
              cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {submitting ? '提交中...' : '提交'}
          </button>
        </div>
      </form>

      {/* 部署记录列表 */}
      <div style={cardStyle}>
        <div style={cardLabel}>📋 部署记录 ({deployments.length})</div>
        {deployments.length === 0 ? (
          <div style={{ color: '#8b949e', fontSize: '0.88rem', padding: '16px 0' }}>
            暂无记录，添加一条部署记录测试数据持久化
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {deployments.map((d, i) => (
              <div key={d.id || i} style={{
                padding: '12px 16px', borderRadius: 8,
                background: 'rgba(255,255,255,0.03)', border: '1px solid #21262d',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span>{d.description}</span>
                <span style={{ color: '#8b949e', fontSize: '0.78rem' }}>
                  {d.createdAt ? new Date(d.createdAt).toLocaleString('zh-CN') : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部 */}
      <div style={{ textAlign: 'center', marginTop: 32, color: '#484f58', fontSize: '0.78rem' }}>
        Docker CI/CD Deployment Demo · 软件团队内训实践
      </div>
    </div>
  );
}

const cardStyle = {
  padding: '20px 24px',
  borderRadius: 12,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid #21262d'
};

const cardLabel = {
  color: '#8b949e',
  fontSize: '0.82rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 8
};
