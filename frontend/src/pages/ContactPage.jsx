import { useState } from 'react';
import { profile } from '../data/profile';
import './ContactPage.css';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [copied2, setCopied2] = useState(false);

  const copyEmail = async (email, setFn) => {
    try {
      await navigator.clipboard.writeText(email);
      setFn(true);
      setTimeout(() => setFn(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setFn(true);
      setTimeout(() => setFn(false), 2000);
    }
  };

  // 联系方式卡片列表
  const contacts = [
    {
      icon: '📧',
      title: 'QQ 邮箱',
      desc: profile.email,
      visible: !!profile.email,
      render: () => (
        <div className="contact-card-body">
          <a href={`mailto:${profile.email}`} className="contact-email">{profile.email}</a>
          <div className="contact-card-actions">
            <a href={`mailto:${profile.email}`} className="brand-btn">发送邮件</a>
            <button className="copy-btn" onClick={() => copyEmail(profile.email, setCopied)}>
              {copied ? '✓ 已复制邮箱地址' : '📋 复制邮箱'}
            </button>
          </div>
        </div>
      ),
    },
    {
      icon: '🎓',
      title: 'ZJU 教育邮箱',
      desc: profile.email2,
      visible: !!profile.email2,
      render: () => (
        <div className="contact-card-body">
          <a href={`mailto:${profile.email2}`} className="contact-email">{profile.email2}</a>
          <div className="contact-card-actions">
            <a href={`mailto:${profile.email2}`} className="brand-btn">发送邮件</a>
            <button className="copy-btn" onClick={() => copyEmail(profile.email2, setCopied2)}>
              {copied2 ? '✓ 已复制邮箱地址' : '📋 复制邮箱'}
            </button>
          </div>
        </div>
      ),
    },
    {
      icon: '🐙',
      title: 'GitHub',
      desc: '项目代码、学习 Demo 和实训作品',
      visible: !!profile.githubUrl,
      render: () => (
        <div className="contact-card-body">
          <p className="contact-desc">{profile.github ? `@${profile.github}` : '项目代码、学习 Demo 和实训作品'}</p>
          <div className="contact-card-actions">
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="brand-btn">查看 GitHub</a>
          </div>
        </div>
      ),
    },
    {
      icon: '🌐',
      title: '个人博客',
      desc: '记录学习、项目和思考',
      visible: !!profile.blogUrl,
      render: () => (
        <div className="contact-card-body">
          <div className="contact-card-actions">
            <a href={profile.blogUrl} target="_blank" rel="noopener noreferrer" className="brand-btn">访问博客</a>
          </div>
        </div>
      ),
    },
    {
      icon: '📺',
      title: 'Bilibili',
      desc: '技术分享与学习记录',
      visible: !!profile.bilibiliUrl,
      render: () => (
        <div className="contact-card-body">
          <div className="contact-card-actions">
            <a href={profile.bilibiliUrl} target="_blank" rel="noopener noreferrer" className="brand-btn">访问主页</a>
          </div>
        </div>
      ),
    },
    {
      icon: '💬',
      title: '微信',
      desc: profile.wechat || '',
      visible: !!profile.wechat,
      render: () => (
        <div className="contact-card-body">
          <p className="contact-desc">微信号：{profile.wechat}</p>
        </div>
      ),
    },
  ].filter(c => c.visible);

  return (
    <div className="contact-page">
      {/* 顶部介绍 */}
      <section className="contact-hero card">
        <h1>📬 联系我</h1>
        <p className="contact-hero-desc">
          这里整理了一些可以联系到我的方式，欢迎交流前端学习、软件实训、个人项目和 AI Coding 相关内容。
        </p>
      </section>

      {/* 联系方式卡片 */}
      <div className="contact-grid">
        {contacts.map(c => (
          <div key={c.title} className="contact-card card">
            <div className="contact-card-header">
              <span className="contact-card-icon">{c.icon}</span>
              <div>
                <h3>{c.title}</h3>
                <p className="contact-card-desc">{c.desc}</p>
              </div>
            </div>
            {c.render()}
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <section className="contact-note card">
        <p>
          如果是关于项目代码、学习笔记或实训内容的交流，可以在邮件中简单说明问题背景，方便更快理解。
        </p>
      </section>
    </div>
  );
}
