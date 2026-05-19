import React, { useState } from 'react';
import './FeedbackPage.css';

const HELP_TOPICS = [
  {
    id: '1',
    title: '如何添加衣橱单品？',
    content: '点击底部导航「衣橱」→ 点击右下角「+」按钮 → 填写单品信息 → 点击「保存」即可添加到衣橱。',
    expanded: false,
  },
  {
    id: '2',
    title: 'AI穿搭推荐如何使用？',
    content: '点击底部导航「搭配」→ AI会根据您的衣橱自动生成穿搭建议。您也可以在首页点击「AI助手」获取个性化推荐。',
    expanded: false,
  },
  {
    id: '3',
    title: '如何分享穿搭到社区？',
    content: '在搭配页面选择一套穿搭 → 点击「分享」按钮 → 添加描述 → 点击「发布」即可分享到社区。',
    expanded: false,
  },
  {
    id: '4',
    title: '如何设置穿搭提醒？',
    content: '在设置页面开启「推送通知」→ AI会根据天气和日程为您推送穿搭提醒。',
    expanded: false,
  },
  {
    id: '5',
    title: '数据如何同步？',
    content: '登录后数据会自动同步到云端。更换设备时，只需登录同一账号即可恢复数据。',
    expanded: false,
  },
];

export const FeedbackPage: React.FC = () => {
  const [topics, setTopics] = useState(HELP_TOPICS);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'other'>('bug');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleTopic = (id: string) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === id ? { ...topic, expanded: !topic.expanded } : topic
      )
    );
  };

  const submitFeedback = () => {
    if (!feedbackContent.trim()) {
      alert('请输入反馈内容');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackContent('');
    }, 2000);
  };

  return (
    <div className="feedback-page">
      <header className="page-header">
        <button
          type="button"
          className="page-back"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }))}
        >
          ←
        </button>
        <h1 className="page-title">帮助与反馈</h1>
        <div className="page-actions" />
      </header>

      <section className="help-section">
        <h2 className="section-title">常见问题</h2>
        <div className="faq-list">
          {topics.map((topic) => (
            <div key={topic.id} className="faq-item">
              <button
                type="button"
                className="faq-header"
                onClick={() => toggleTopic(topic.id)}
              >
                <span className="faq-icon">{topic.expanded ? '−' : '+'}</span>
                <span className="faq-title">{topic.title}</span>
              </button>
              {topic.expanded && (
                <div className="faq-content">
                  <p>{topic.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="feedback-section">
        <h2 className="section-title">问题反馈</h2>
        <div className="feedback-form">
          <div className="feedback-type">
            <button
              type="button"
              className={`type-btn ${feedbackType === 'bug' ? 'active' : ''}`}
              onClick={() => setFeedbackType('bug')}
            >
              🐛 问题反馈
            </button>
            <button
              type="button"
              className={`type-btn ${feedbackType === 'feature' ? 'active' : ''}`}
              onClick={() => setFeedbackType('feature')}
            >
              ✨ 功能建议
            </button>
            <button
              type="button"
              className={`type-btn ${feedbackType === 'other' ? 'active' : ''}`}
              onClick={() => setFeedbackType('other')}
            >
              💬 其他
            </button>
          </div>
          <textarea
            className="feedback-input"
            placeholder="请详细描述您的问题或建议..."
            value={feedbackContent}
            onChange={(e) => setFeedbackContent(e.target.value)}
          />
          <button
            type="button"
            className={`submit-btn ${submitted ? 'submitted' : ''}`}
            onClick={submitFeedback}
            disabled={submitted}
          >
            {submitted ? '✓ 已提交' : '提交反馈'}
          </button>
        </div>
      </section>

      <section className="contact-section">
        <h2 className="section-title">联系我们</h2>
        <div className="contact-list">
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <div className="contact-info">
              <span className="contact-label">邮箱</span>
              <span className="contact-value">support@xinyijian.app</span>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">💬</span>
            <div className="contact-info">
              <span className="contact-label">客服</span>
              <span className="contact-value">工作时间：9:00-21:00</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
