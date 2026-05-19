import React from 'react';
import './AboutPage.css';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI智能推荐',
    desc: '基于天气、场合和个人风格的智能穿搭建议',
  },
  {
    icon: '👚',
    title: '衣橱管理',
    desc: '轻松管理你的所有衣物，追踪利用率',
  },
  {
    icon: '👥',
    title: '社区互动',
    desc: '分享穿搭灵感，发现更多搭配可能',
  },
  {
    icon: '📊',
    title: '数据洞察',
    desc: '了解你的穿搭习惯，优化购物决策',
  },
];

const TEAM = [
  { name: '设计师', role: 'UI/UX Design', avatar: '🎨' },
  { name: '工程师', role: 'Backend Dev', avatar: '💻' },
  { name: '产品经理', role: 'Product', avatar: '📱' },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <header className="page-header">
        <button
          type="button"
          className="page-back"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }))}
        >
          ←
        </button>
        <h1 className="page-title">关于我们</h1>
        <div className="page-actions" />
      </header>

      <div className="brand-section">
        <div className="brand-icon">💖</div>
        <h2 className="brand-name">心衣间</h2>
        <p className="brand-slogan">让每一天的穿搭都充满灵感</p>
        <p className="brand-desc">
          心衣间是一款智能穿搭助手，帮助你更好地管理衣橱，发现更多搭配可能。
        </p>
      </div>

      <section className="features-section">
        <h3 className="section-title">核心功能</h3>
        <div className="features-grid">
          {FEATURES.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section">
        <h3 className="section-title">团队</h3>
        <div className="team-list">
          {TEAM.map((member, index) => (
            <div key={index} className="team-item">
              <span className="team-avatar">{member.avatar}</span>
              <span className="team-name">{member.name}</span>
              <span className="team-role">{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <div className="info-item">
          <span className="info-label">版本</span>
          <span className="info-value">v1.0.0</span>
        </div>
        <div className="info-item">
          <span className="info-label">更新日期</span>
          <span className="info-value">2026年4月</span>
        </div>
        <div className="info-item">
          <span className="info-label">用户数</span>
          <span className="info-value">10,000+</span>
        </div>
      </section>

      <section className="social-section">
        <h3 className="section-title">关注我们</h3>
        <div className="social-links">
          <button type="button" className="social-btn">📱 微信</button>
          <button type="button" className="social-btn">🐦 微博</button>
          <button type="button" className="social-btn">📸 小红书</button>
        </div>
      </section>

      <footer className="app-footer">
        <p>&copy; 2026 心衣间. All rights reserved.</p>
        <div className="footer-links">
          <button type="button" className="footer-link">隐私政策</button>
          <button type="button" className="footer-link">用户协议</button>
        </div>
      </footer>
    </div>
  );
};
