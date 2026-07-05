import './AboutPage.css';

/**
 * 关于我页面 —— 卡片式布局
 */
export default function AboutPage() {
  return (
    <div className="about-page">
      {/* 头部卡片 */}
      <section className="about-hero card">
        <div className="about-hero-avatar">👨‍💻</div>
        <h1 className="font-averia">
          Hi, I'm <span className="text-linear">Cai</span>
        </h1>
        <p className="about-hero-role">物理学专业 · 编程爱好者</p>
      </section>

      {/* 个人简介 */}
      <section className="about-section card">
        <h2>🙋 个人简介</h2>
        <p>
          大家好，我是 Cai，物理学专业，课余自学前端开发与编程技术。
          通过软件团队实训，以个人博客为载体，系统性地实践了前端工程化开发的完整流程。
        </p>
        <p>
          我相信 <strong>"做是最好的学"</strong>，所以选择从零开始搭建这个个人博客。
          这不仅是一个课程作业，更是我技术成长的见证。
        </p>
      </section>

      {/* 技术栈 */}
      <section className="about-section card">
        <h2>🛠 技术栈</h2>
        <div className="tech-grid">
          {[
            { icon: '⚛️', name: 'React 18', desc: '前端框架' },
            { icon: '⚡', name: 'Vite 5', desc: '构建工具' },
            { icon: '🧭', name: 'React Router', desc: '路由管理' },
            { icon: '🎨', name: 'CSS', desc: '样式方案' },
            { icon: '💾', name: 'localStorage', desc: '数据存储' },
            { icon: '📦', name: 'npm', desc: '包管理' },
          ].map(tech => (
            <div key={tech.name} className="tech-item">
              <span className="tech-icon">{tech.icon}</span>
              <strong>{tech.name}</strong>
              <span>{tech.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 项目目标 */}
      <section className="about-section card">
        <h2>🎯 项目目标</h2>
        <ul className="goal-list">
          <li>以个人博客项目为载体，完整体验从需求拆解、项目初始化、页面开发到功能完善的前端开发流程</li>
          <li>掌握前端基础技术在项目中的实际使用，包括 HTML、CSS、JavaScript、React、路由和状态管理</li>
          <li>建立工程化开发意识，熟悉 Git 版本管理、目录组织、代码规范、README 文档和项目维护方式</li>
          <li>理解浏览器运行机制，能够结合 Chrome DevTools 观察网络请求、页面渲染和基础性能问题</li>
          <li>学会借助 AI Coding / Vibe Coding 辅助开发，在实践中提升问题拆解、代码理解和调试能力</li>
        </ul>
      </section>

      {/* 实训收获 */}
      <section className="about-section card">
        <h2>📝 实训收获</h2>
        <div className="gain-cards">
          {[
            { icon: '🔧', title: '工程实践能力', desc: '通过个人博客项目，熟悉了前端项目从 0 到 1 的搭建流程，包括项目初始化、目录设计、组件拆分、路由配置、数据管理和页面展示。' },
            { icon: '⚛️', title: '前端基础理解', desc: '进一步理解了 HTML、CSS、JavaScript 与 React 在项目中的分工，掌握了组件化开发、Props 传递、状态变化和页面更新的基本模式。' },
            { icon: '📐', title: '工程规范意识', desc: '在开发过程中逐步养成了使用 Git 管理代码、编写 README、补充必要注释、保持目录清晰和代码可维护的习惯。' },
            { icon: '🌐', title: '浏览器与网络认知', desc: '结合博客项目和 Chrome DevTools，理解了页面访问过程中涉及的网络请求、资源加载、DOM 更新和浏览器渲染流程。' },
            { icon: '🐛', title: '问题解决能力', desc: '在开发过程中遇到样式、路由、数据持久化、组件状态等问题，通过查阅文档、分析报错、调试代码和借助 AI 工具逐步解决。' },
            { icon: '🤖', title: 'AI 辅助开发能力', desc: '尝试使用 Claude Code 等工具辅助完成需求拆解、代码生成、问题排查和文档整理，初步建立了 Vibe Coding 的实践方式。' },
          ].map(g => (
            <div key={g.title} className="gain-card">
              <h3>{g.icon} {g.title}</h3>
              <p>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
