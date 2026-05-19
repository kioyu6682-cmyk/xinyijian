import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './SettingsPage.css';

const SETTINGS_GROUPS = [
  {
    title: '账号安全',
    items: [
      { id: 'profile', icon: '👤', label: '个人资料', desc: '修改昵称、头像' },
      { id: 'password', icon: '🔒', label: '修改密码', desc: '更改登录密码' },
      { id: 'phone', icon: '📱', label: '绑定手机', desc: '138****8000' },
    ],
  },
  {
    title: '通知设置',
    items: [
      { id: 'push', icon: '🔔', label: '推送通知', desc: '接收穿搭提醒', toggle: true, default: true },
      { id: 'email', icon: '📧', label: '邮件通知', desc: '接收周报和活动', toggle: true, default: false },
      { id: 'sound', icon: '🔊', label: '声音提示', desc: '操作时播放声音', toggle: true, default: true },
    ],
  },
  {
    title: '隐私设置',
    items: [
      { id: 'share', icon: '👥', label: '分享衣橱', desc: '允许好友查看', toggle: true, default: false },
      { id: 'recommend', icon: '✨', label: '个性化推荐', desc: '基于使用习惯推荐', toggle: true, default: true },
      { id: 'history', icon: '🗑️', label: '清除历史', desc: '删除所有浏览记录' },
    ],
  },
  {
    title: '数据管理',
    items: [
      { id: 'export', icon: '📤', label: '导出数据', desc: '下载个人数据' },
      { id: 'delete', icon: '🗑️', label: '删除账号', desc: '永久删除所有数据', danger: true },
    ],
  },
];

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  const handleToggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout();
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'home' } }));
    }
  };

  const handleItemClick = (id: string) => {
    const actions: Record<string, () => void> = {
      profile: () => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'profile-edit' } })),
      password: () => alert('修改密码功能开发中'),
      phone: () => alert('绑定手机功能开发中'),
      history: () => alert('历史记录已清除'),
      export: () => alert('数据导出功能开发中'),
      delete: () => {
        if (confirm('确定要删除账号吗？此操作不可撤销！')) {
          alert('账号删除功能开发中');
        }
      },
    };
    if (actions[id]) actions[id]();
  };

  return (
    <div className="settings-page">
      <header className="page-header">
        <button 
          type="button" 
          className="page-back"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }))}
        >
          ←
        </button>
        <h1 className="page-title">设置</h1>
        <div className="page-actions" />
      </header>

      {user && (
        <div className="user-card">
          <div className="user-avatar">{user.avatarEmoji}</div>
          <div className="user-info">
            <h2 className="user-name">{user.nickname}</h2>
            <p className="user-phone">{user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</p>
          </div>
          <button type="button" className="edit-btn">编辑 →</button>
        </div>
      )}

      <div className="settings-content">
        {SETTINGS_GROUPS.map((group) => (
          <section key={group.title} className="settings-group">
            <h3 className="group-title">{group.title}</h3>
            <div className="settings-list">
              {group.items.map((item) => {
                const hasToggle = 'toggle' in item && item.toggle;
                const isDanger = 'danger' in item && item.danger;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`settings-item ${isDanger ? 'danger' : ''}`}
                    onClick={() => hasToggle ? handleToggle(item.id) : handleItemClick(item.id)}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <div className="item-content">
                      <span className="item-label">{item.label}</span>
                      {'desc' in item && item.desc && <span className="item-desc">{item.desc}</span>}
                    </div>
                    {hasToggle ? (
                      <div 
                        className={`toggle ${toggles[item.id] ?? ('default' in item && item.default) ? 'on' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(item.id);
                        }}
                      >
                        <div className="toggle-thumb" />
                      </div>
                    ) : (
                      <span className="item-arrow">→</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {user && (
        <div className="logout-section">
          <button type="button" className="logout-btn" onClick={handleLogout}>
            退出登录
          </button>
        </div>
      )}
    </div>
  );
};
