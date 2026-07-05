import { useState, useEffect } from 'react';

const STEPS = ['需求分析', '上下文读取', '任务执行', '结果检查'];
const TYPES = ['代码生成', '调试', '重构', '文档'];
const STORAGE_KEY = 'ai_demo_tasks';

function loadTasks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveTasks(tasks) { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }

export default function WorkflowSimulator() {
  const [tasks, setTasks] = useState(loadTasks);
  const [name, setName] = useState('');
  const [type, setType] = useState('代码生成');

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  const addTask = () => {
    if (!name.trim()) return;
    const newTask = {
      id: Date.now(),
      name: name.trim(),
      type,
      steps: STEPS.map((label, i) => ({ label, status: i === 0 ? 'active' : 'pending' })),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    setName('');
  };

  const toggleStep = (taskId, stepIdx) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const steps = t.steps.map((s, i) => {
        if (i !== stepIdx) return s;
        const next = s.status === 'pending' ? 'active' : s.status === 'active' ? 'done' : 'pending';
        return { ...s, status: next };
      });
      return { ...t, steps };
    }));
  };

  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const statusIcon = (s) => s === 'done' ? '✓' : s === 'active' ? '●' : '○';
  const statusClass = (s) => s === 'done' ? 'done' : s === 'active' ? 'active' : '';

  return (
    <div className="card">
      <div className="card-label">🤖 模块一：AI 任务工作流模拟器</div>
      <p className="text-muted mb-12">
        模拟 AI 自动化任务的四步执行流程。点击步骤切换状态：○ 待分析 → ● 执行中 → ✓ 已完成。
      </p>

      {/* 新增任务 */}
      <div className="flex-row mb-12">
        <input
          className="input"
          placeholder="输入任务名称，如：检查文章分类..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
        />
        <select className="select" value={type} onChange={e => setType(e.target.value)}>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="btn btn-primary" onClick={addTask} disabled={!name.trim()}>
          + 新建
        </button>
      </div>

      {/* 任务列表 */}
      {tasks.length === 0 ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>
          暂无任务，添加一个任务体验 AI 工作流模拟。
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tasks.map(t => {
            const doneCount = t.steps.filter(s => s.status === 'done').length;
            const allDone = doneCount === STEPS.length;
            return (
              <div key={t.id} style={{
                padding: '16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid #21262d'
              }}>
                <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                  <div className="flex-row">
                    <strong style={{ fontSize: '0.92rem' }}>{t.name}</strong>
                    <span className="tag">{t.type}</span>
                    {allDone && <span style={{ color: '#3fb950', fontSize: '0.8rem' }}>✅ 完成</span>}
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteTask(t.id)}>删除</button>
                </div>
                <div className="steps-row">
                  {t.steps.map((s, i) => (
                    <div key={i} className="flex-row" style={{ gap: 4 }}>
                      <div
                        className={`step-dot ${statusClass(s.status)}`}
                        onClick={() => toggleStep(t.id, i)}
                        title={`${s.label}：${s.status === 'pending' ? '待分析' : s.status === 'active' ? '执行中' : '已完成'}（点击切换）`}
                      >
                        {statusIcon(s.status)}
                      </div>
                      <span style={{ fontSize: '0.73rem', color: '#8b949e' }}>{s.label}</span>
                      {i < STEPS.length - 1 && <span className="step-arrow">→</span>}
                    </div>
                  ))}
                </div>
                <div className="text-muted mt-8">
                  进度：{doneCount}/{STEPS.length} · 创建于 {new Date(t.createdAt).toLocaleString('zh-CN')}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 底部说明 */}
      <div className="text-muted mt-8" style={{ borderTop: '1px solid #21262d', paddingTop: 12 }}>
        💡 这是对 AI 自动化 Workflow 的概念模拟。真实场景中，Agent 会根据目标自动调用 Tool 执行每个步骤。
        此处不接入真实 AI API，仅示意 Workflow 的分步执行思路。
      </div>
    </div>
  );
}
