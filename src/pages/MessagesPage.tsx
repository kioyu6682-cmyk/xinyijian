import React, { useState } from 'react';
import './MessagesPage.css';

const MOCK_MESSAGES = [
  {
    id: '1',
    type: 'system',
    title: '系统通知',
    icon: '🔔',
    unread: 2,
    messages: [
      { id: 'm1', text: '您的衣橱利用率已达到85%！继续保持！', time: '今天 10:30', read: false },
      { id: 'm2', text: '新的穿搭挑战已发布：「春季色彩搭配」', time: '今天 09:00', read: false },
      { id: 'm3', text: '您关注的博主「时尚小美」发布了新动态', time: '昨天 16:45', read: true },
    ],
  },
  {
    id: '2',
    type: 'community',
    title: '社区互动',
    icon: '💬',
    unread: 1,
    messages: [
      { id: 'c1', text: '用户「小明」点赞了您的穿搭分享', time: '今天 14:20', read: false },
      { id: 'c2', text: '用户「时尚达人」评论了您的动态', time: '昨天 20:15', read: true },
    ],
  },
  {
    id: '3',
    type: 'ai',
    title: 'AI助手',
    icon: '🤖',
    unread: 0,
    messages: [
      { id: 'a1', text: '根据您的天气和场合，为您推荐了3套穿搭', time: '昨天 08:30', read: true },
    ],
  },
];

export const MessagesPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const markAllRead = () => {
    setMessages((prev) =>
      prev.map((group) => ({
        ...group,
        unread: 0,
        messages: group.messages.map((msg) => ({ ...msg, read: true })),
      }))
    );
    alert('已标记全部为已读');
  };

  const markGroupRead = (groupId: string) => {
    setMessages((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              unread: 0,
              messages: group.messages.map((msg) => ({ ...msg, read: true })),
            }
          : group
      )
    );
  };

  const filteredMessages =
    selectedTab === 'unread'
      ? messages.filter((group) => group.unread > 0)
      : messages;

  return (
    <div className="messages-page">
      <header className="page-header">
        <button
          type="button"
          className="page-back"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }))}
        >
          ←
        </button>
        <h1 className="page-title">消息</h1>
        <div className="page-actions">
          <button type="button" className="mark-read" onClick={markAllRead}>
            全部已读
          </button>
        </div>
      </header>

      <div className="tabs">
        <button
          type="button"
          className={`tab-btn ${selectedTab === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedTab('all')}
        >
          全部 ({messages.reduce((sum, g) => sum + g.messages.length, 0)})
        </button>
        <button
          type="button"
          className={`tab-btn ${selectedTab === 'unread' ? 'active' : ''}`}
          onClick={() => setSelectedTab('unread')}
        >
          未读 ({messages.reduce((sum, g) => sum + g.unread, 0)})
        </button>
      </div>

      <div className="messages-content">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((group) => (
            <div key={group.id} className="message-group">
              <button
                type="button"
                className="group-header"
                onClick={() => markGroupRead(group.id)}
              >
                <span className="group-icon">{group.icon}</span>
                <span className="group-title">{group.title}</span>
                {group.unread > 0 && (
                  <span className="unread-badge">{group.unread}</span>
                )}
              </button>
              <div className="message-list">
                {group.messages.map((msg) => (
                  <div key={msg.id} className={`message-item ${msg.read ? '' : 'unread'}`}>
                    <p className="message-text">{msg.text}</p>
                    <span className="message-time">{msg.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📬</span>
            <p>暂无消息</p>
          </div>
        )}
      </div>
    </div>
  );
};
