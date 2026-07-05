import { useState, useRef, useCallback } from 'react';

const BEST_KEY = 'reaction_best';

function loadBest() {
  try { return parseInt(localStorage.getItem(BEST_KEY)) || null; }
  catch { return null; }
}
function saveBest(ms) { localStorage.setItem(BEST_KEY, ms.toString()); }

const STATE = { IDLE: 'idle', WAITING: 'waiting', READY: 'ready', WRONG: 'wrong', RESULT: 'result' };

export default function ReactionGame() {
  const [state, setState] = useState(STATE.IDLE);
  const [message, setMessage] = useState('准备好了就点击"开始测试"');
  const [lastTime, setLastTime] = useState(null);
  const [best, setBest] = useState(loadBest);
  const timerRef = useRef(null);
  const startRef = useRef(0);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState(STATE.IDLE);
    setMessage('准备好了就点击"开始测试"');
    setLastTime(null);
  }, []);

  const start = () => {
    reset();
    setState(STATE.WAITING);
    setMessage('等待屏幕变绿...');
    const delay = 1000 + Math.random() * 4000; // 1-5 秒随机
    timerRef.current = setTimeout(() => {
      setState(STATE.READY);
      setMessage('👆 快点击！');
      startRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === STATE.IDLE || state === STATE.RESULT || state === STATE.WRONG) {
      start();
      return;
    }
    if (state === STATE.WAITING) {
      // 过早点击
      if (timerRef.current) clearTimeout(timerRef.current);
      setState(STATE.WRONG);
      setMessage('⚠️ 太早了！屏幕还没变绿，请等变绿后再点击。点击重新开始。');
      return;
    }
    if (state === STATE.READY) {
      const reaction = Date.now() - startRef.current;
      setLastTime(reaction);
      const newBest = best === null || reaction < best ? reaction : best;
      if (newBest !== best) { setBest(newBest); saveBest(newBest); }
      setState(STATE.RESULT);
      setMessage(`🎯 你的反应时间：${reaction} ms${newBest === reaction ? ' 🏆 新纪录！' : ''}（点击重新开始）`);
    }
  };

  const areaClass = {
    [STATE.IDLE]: 'game-waiting',
    [STATE.WAITING]: 'game-waiting',
    [STATE.READY]: 'game-ready',
    [STATE.WRONG]: 'game-wrong',
    [STATE.RESULT]: 'game-result',
  }[state];

  return (
    <div className="card">
      <div className="card-label">⚡ 模块二：反应速度测试</div>
      <p className="text-muted mb-12">
        点击开始后屏幕会在随机时间变绿，变绿后尽快点击。测试你的反应速度！
      </p>

      {/* 游戏区域 */}
      <div className={`game-area ${areaClass}`} onClick={handleClick}>
        <div>{message}</div>
        {lastTime !== null && (
          <div style={{ fontSize: '1.8rem', marginTop: 8, fontFamily: 'monospace' }}>
            {lastTime} ms
          </div>
        )}
      </div>

      {/* 成绩 */}
      <div className="flex-row mt-8" style={{ justifyContent: 'space-between' }}>
        <div className="text-muted">
          上次：<strong style={{ color: '#c9d1d9' }}>{lastTime !== null ? `${lastTime} ms` : '—'}</strong>
        </div>
        <div className="text-muted">
          🏆 最佳：<strong style={{ color: '#3fb950' }}>{best !== null ? `${best} ms` : '—'}</strong>
        </div>
        <button className="btn btn-sm" style={{ background: '#21262d', color: '#8b949e' }} onClick={reset}>
          重置
        </button>
      </div>

      <div className="text-muted mt-8" style={{ borderTop: '1px solid #21262d', paddingTop: 12 }}>
        💡 这个小游戏展示了 React 状态管理（useState）、副作用（useRef + setTimeout）和 localStorage
        持久化最佳成绩的综合应用。这些技术同样用于 AI Workflow 的状态管理和数据保存。
      </div>
    </div>
  );
}
