import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfileEditPage.css';

const AVATAR_OPTIONS = [
  '👤', '👩', '👨', '👧', '👦', '👵', '👴', '🧑',
  '👸', '🤴', '🧛', '🧟', '👽', '🤖', '👻', '🎭',
  '🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁',
  '🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🍀', '🌙'
];

export const ProfileEditPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarEmoji || '👤');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return (
      <div className="profile-edit-page">
        <div className="empty-state">
          <span className="empty-icon">🔒</span>
          <p>请先登录</p>
          <button 
            type="button" 
            className="empty-action"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }))}
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!nickname.trim()) {
      setMessage('请输入昵称');
      return;
    }

    setIsSaving(true);
    try {
      const savedToServer = await updateProfile({ nickname: nickname.trim(), avatarEmoji: selectedAvatar });
      
      if (savedToServer) {
        setMessage('✅ 保存成功！');
      } else {
        setMessage('⚠️ 已保存到本地，网络恢复后将自动同步');
      }
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }));
      }, savedToServer ? 1500 : 2000);
    } catch (error) {
      console.error('保存失败:', error);
      setMessage('❌ 保存失败，请重试');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }));
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-edit-page">
      <header className="page-header">
        <button 
          type="button" 
          className="page-back"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'settings' } }))}
        >
          ←
        </button>
        <h1 className="page-title">编辑资料</h1>
        <div className="page-actions">
          <button 
            type="button" 
            className="save-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </header>

      <div className="edit-content">
        <section className="avatar-section">
          <h3 className="section-title">选择头像</h3>
          <div className="current-avatar">
            <span className="avatar-large">{selectedAvatar}</span>
            <span className="avatar-label">当前头像</span>
          </div>
          <div className="avatar-grid">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar}
                type="button"
                className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <span className="avatar-emoji">{avatar}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="nickname-section">
          <h3 className="section-title">昵称</h3>
          <input
            type="text"
            className="nickname-input"
            placeholder="请输入昵称"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
          />
          <span className="input-hint">{nickname.length}/20</span>
        </section>

        {message && (
          <div className={`message ${message.includes('成功') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};