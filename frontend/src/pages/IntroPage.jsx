import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './IntroPage.css';

/**
 * 初始欢迎页 — 极简黑粉开场
 */
export default function IntroPage() {
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const elements = [
      line1Ref.current,
      line2Ref.current,
      line3Ref.current,
      subtitleRef.current,
      btnRef.current
    ];
    elements.forEach((el, i) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-30px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateX(0)';
        }, 200 + i * 180);
      }
    });
  }, []);

  return (
    <div className="intro-page">

      {/* 背景光晕 */}
      <div className="intro-bg" aria-hidden="true">
        <div className="intro-glow glow--tl" />
        <div className="intro-glow glow--br" />
        <div className="intro-glow glow--center" />
      </div>

      {/* 顶部导航 */}
      <nav className="intro-nav">
        <span className="intro-logo">Cai's Blog</span>
        <div className="intro-links">
          <Link to="/home" className="intro-link">HOME</Link>
          <Link to="/articles" className="intro-link">ARTICLES</Link>
          <Link to="/about" className="intro-link">ABOUT</Link>
          <Link to="/contact" className="intro-link">CONTACT</Link>
        </div>
      </nav>

      {/* 主视觉 */}
      <div className="intro-main">
        <h1 className="intro-title">
          <span className="intro-line" ref={line1Ref}>WELCOME</span>
          <span className="intro-line" ref={line2Ref}>
            TO <em>CAI'S</em>
          </span>
          <span className="intro-line" ref={line3Ref}>SPACE</span>
        </h1>
        <p className="intro-sub" ref={subtitleRef}>
          A personal blog about coding, projects and life.
        </p>
        <Link to="/home" className="intro-btn" ref={btnRef}>
          ENTER BLOG
        </Link>
      </div>

      {/* 底部 */}
      <div className="intro-footer">
        <span>© 2026 Cai's Blog</span>
      </div>
    </div>
  );
}
