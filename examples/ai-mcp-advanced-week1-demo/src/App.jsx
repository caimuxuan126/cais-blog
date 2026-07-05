import WorkflowSimulator from './components/WorkflowSimulator';
import ReactionGame from './components/ReactionGame';

export default function App() {
  return (
    <>
      <h1>🧠 AI 自动化、MCP 与进阶实践</h1>
      <p className="subtitle">
        Agent · Workflow · MCP · React 综合练习
      </p>

      <WorkflowSimulator />
      <ReactionGame />

      <div style={{ textAlign: 'center', marginTop: 32, color: '#484f58', fontSize: '0.78rem' }}>
        AI & MCP Advanced Demo · 软件团队内训实践
      </div>
    </>
  );
}
