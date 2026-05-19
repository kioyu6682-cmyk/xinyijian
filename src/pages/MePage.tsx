import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWardrobeContext } from '../context/WardrobeContext';
import './MePage.css';

const AVATAR_OPTIONS = ['😀', '😊', '👤', '👩', '👨', '😺'];

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

function maskPhone(phone: string) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

export const MePage: React.FC = () => {
  const { user, login, register, logout, updateProfile, isHydrated } = useAuth();
  const { items, stats } = useWardrobeContext();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const show = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const submitLogin = async () => {
    setFormError(null);
    setBusy(true);
    const r = await login(phone, password);
    setBusy(false);
    if (!r.ok) setFormError(r.message ?? '登录失败');
    else {
      setShowLoginModal(false);
      show('欢迎回来');
    }
  };

  const submitRegister = async () => {
    setFormError(null);
    setBusy(true);
    const r = await register(phone, password, nickname);
    setBusy(false);
    if (!r.ok) setFormError(r.message ?? '注册失败');
    else {
      setShowLoginModal(false);
      show('注册成功，已自动登录');
    }
  };

  const handleMenuClick = (action: () => void) => {
    if (!user) {
      setShowLoginModal(true);
      show('请先登录后使用此功能');
    } else {
      action();
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'style-report',
      label: '风格报告',
      icon: '📊',
      action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'style-detail' } })),
    },
    {
      id: 'favorites',
      label: '收藏',
      icon: '❤️',
      action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'favorites' } })),
    },
    {
      id: 'history',
      label: '历史',
      icon: '📜',
      action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'history' } })),
    },
    {
      id: 'settings',
      label: '设置',
      icon: '⚙️',
      action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'settings' } })),
    },
    {
      id: 'messages',
      label: '消息',
      icon: '💬',
      action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'messages' } })),
    },
    {
      id: 'feedback',
      label: '帮助反馈',
      icon: '💡',
      action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feedback' } })),
    },
    {
      id: 'about',
      label: '关于我们',
      icon: '👋',
      action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'about' } })),
    },
  ];

  if (!isHydrated) {
    return (
      <div className="me-page">
        <div className="me-skeleton" aria-busy>
          <div className="me-skeleton__line" />
          <div className="me-skeleton__line me-skeleton__line--short" />
        </div>
      </div>
    );
  }

  return (
    <div className="me-page">
      <header className="me-header">
        <div className="me-header__row">
          <div>
            <p className="me-kicker">个人中心</p>
            <h1 className="me-title">我的</h1>
          </div>
          <button
            type="button"
            className="me-header__btn"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'prompts' } }))}
            title="AI提示词"
          >
            💡
          </button>
        </div>
      </header>

      {/* 头像昵称区 */}
      <section className="me-profile-card">
        <div className="me-profile-top">
          <div className="me-avatar" aria-hidden>
            {user ? user.avatarEmoji : '👤'}
          </div>
          <div>
            <h2 className="me-nickname">{user ? user.nickname : '游客'}</h2>
            <p className="me-phone">{user ? maskPhone(user.phone) : '登录后享受更多功能'}</p>
          </div>
          {user ? (
            <button
              type="button"
              className="me-logout"
              onClick={() => {
                logout();
                show('已退出登录');
              }}
            >
              退出
            </button>
          ) : (
            <button
              type="button"
              className="me-login-btn"
              onClick={() => setShowLoginModal(true)}
            >
              登录
            </button>
          )}
        </div>

        {user && (
          <div className="me-avatar-picker">
            <span className="me-avatar-picker__label">头像心情</span>
            <div className="me-avatar-picker__grid">
              {AVATAR_OPTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  className={`me-emoji-btn ${user.avatarEmoji === em ? 'active' : ''}`}
                  onClick={() => {
                    updateProfile({ avatarEmoji: em });
                    show('头像已更新');
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="me-stats">
          <button
            type="button"
            className="me-stat"
            onClick={() =>
              handleMenuClick(() =>
                window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'wardrobe' } }))
              )
            }
          >
            <span className="me-stat__num">{user ? items.length : '--'}</span>
            <span className="me-stat__label">衣橱单品</span>
          </button>
          <button
            type="button"
            className="me-stat"
            onClick={() =>
              handleMenuClick(() =>
                window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'match' } }))
              )
            }
          >
            <span className="me-stat__num">{user ? Math.round(stats.utilizationRate * 100) + '%' : '--'}</span>
            <span className="me-stat__label">利用率</span>
          </button>
          <button
            type="button"
            className="me-stat"
            onClick={() => handleMenuClick(() => show('穿搭日历：本周已记录 4 天'))}
          >
            <span className="me-stat__num">{user ? '4' : '--'}</span>
            <span className="me-stat__label">本周穿搭</span>
          </button>
        </div>
      </section>

      {/* 功能菜单 */}
      <nav className="me-menu" aria-label="个人中心菜单">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="me-menu__row"
            onClick={() => handleMenuClick(item.action)}
          >
            <span className="me-menu__icon">{item.icon}</span>
            <span className="me-menu__label">{item.label}</span>
            <span className="me-menu__chev">→</span>
          </button>
        ))}
      </nav>

      {/* 登录/注册弹窗 */}
      {showLoginModal && (
        <div className="me-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="me-modal" onClick={(e) => e.stopPropagation()}>
            <div className="me-modal-header">
              <h3>登录/注册</h3>
              <button type="button" className="me-modal-close" onClick={() => setShowLoginModal(false)}>
                ✕
              </button>
            </div>
            
            <div className="me-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={`me-tabs__btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setMode('login');
                  setFormError(null);
                }}
              >
                登录
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                className={`me-tabs__btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setMode('register');
                  setFormError(null);
                }}
              >
                注册
              </button>
            </div>

            <label className="me-field">
              <span>手机号</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="11 位手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            {mode === 'register' && (
              <label className="me-field">
                <span>昵称</span>
                <input
                  type="text"
                  autoComplete="nickname"
                  placeholder="心衣间里的称呼"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </label>
            )}
            <label className="me-field">
              <span>密码</span>
              <input
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="至少 6 位"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {formError && (
              <p className="me-error" role="alert">
                {formError}
              </p>
            )}

            <button
              type="button"
              className="me-submit"
              disabled={busy}
              onClick={() => (mode === 'login' ? submitLogin() : submitRegister())}
            >
              {busy ? '请稍候…' : mode === 'login' ? '登录' : '注册并登录'}
            </button>

            <p className="me-hint">首次使用请先「注册」。忘记密码功能将在接入服务端后开放。</p>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};
