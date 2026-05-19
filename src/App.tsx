import { useState, useEffect } from 'react';
import './App.css';
import { HomePage } from './pages/HomePage';
import { WardrobePage } from './pages/WardrobePage';
import { CommunityPage } from './pages/CommunityPage';
import BodyFitPage from './pages/BodyFitPage';
import CalendarPage from './pages/CalendarPage';
import RatingPage from './pages/RatingPage';
import { WardrobeProvider, useWardrobeContext } from './context/WardrobeContext';
import { AuthProvider } from './context/AuthContext';
import { MatchPage } from './pages/MatchPage';
import { MePage } from './pages/MePage';
import InspirationPage from './pages/InspirationPage';
import { PromptDetailPage } from './pages/PromptDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { MessagesPage } from './pages/MessagesPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { AboutPage } from './pages/AboutPage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import { ClothingDetailPage } from './pages/ClothingDetailPage';
import { OutfitDetailPage } from './pages/OutfitDetailPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { EcoDetailPage } from './pages/EcoDetailPage';
import { StyleDetailPage } from './pages/StyleDetailPage';
import { HomeIcon, WardrobeIcon, CommunityIcon, UserIcon, PlusIcon, CameraIcon, ImageIcon, LinkIcon } from './components/Icons';
import { ChatPanel, ChatButton } from './components/ChatPanel';
import { NetworkStatusBanner } from './components/NetworkStatusBanner';

export type AppPage = 'home' | 'wardrobe' | 'match' | 'community' | 'me' | 'body-fit' | 'calendar' | 'rating' | 'inspiration' | 'prompts' | 'favorites' | 'history' | 'settings' | 'messages' | 'feedback' | 'about' | 'profile-edit' | 'clothing-detail' | 'outfit-detail' | 'post-detail' | 'eco-detail' | 'style-detail';

const COMMUNITY_UNREAD = 5;

function AppShell() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const { items } = useWardrobeContext();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const pages: AppPage[] = ['home', 'wardrobe', 'match', 'community', 'me', 'body-fit', 'calendar', 'rating', 'inspiration', 'prompts', 'favorites', 'history', 'settings', 'messages', 'feedback', 'about', 'profile-edit', 'clothing-detail', 'outfit-detail', 'post-detail', 'eco-detail', 'style-detail'];
    const handleNavigate = (e: Event) => {
        const ce = e as CustomEvent<{ page?: string; detailId?: string; params?: Record<string, string> }>;
        const p = ce.detail?.page;
        console.log('=== 导航事件 ===');
        console.log('page:', p);
        console.log('params:', ce.detail?.params);
        console.log('detailId:', ce.detail?.detailId);
        if (p && pages.includes(p as AppPage)) {
          console.log('导航到:', p);
          setCurrentPage(p as AppPage);
          // 支持多种参数格式
          const id = ce.detail?.params?.id || ce.detail?.detailId;
          console.log('detailId设置为:', id);
          setDetailId(id ?? null);
        } else {
          console.log('页面不存在:', p);
        }
      };
    const handleOpenModal = (e: Event) => {
      const ce = e as CustomEvent<{ type?: string }>;
      if (ce.detail?.type === 'upload') setShowModal(true);
    };
    const handleAppToast = (e: Event) => {
      const ce = e as CustomEvent<{ message?: string }>;
      if (ce.detail?.message) {
        setGlobalToast(ce.detail.message);
        window.setTimeout(() => setGlobalToast(null), 2600);
      }
    };
    window.addEventListener('navigate', handleNavigate);
    window.addEventListener('openModal', handleOpenModal);
    window.addEventListener('app-toast', handleAppToast);
    return () => {
      window.removeEventListener('navigate', handleNavigate);
      window.removeEventListener('openModal', handleOpenModal);
      window.removeEventListener('app-toast', handleAppToast);
    };
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  const pushToast = (msg: string) => {
    setGlobalToast(msg);
    window.setTimeout(() => setGlobalToast(null), 2600);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'wardrobe':
        return <WardrobePage />;
      case 'match':
        return <MatchPage />;
      case 'community':
        return <CommunityPage />;
      case 'me':
        return <MePage />;
      case 'body-fit':
        return <BodyFitPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'rating':
        return <RatingPage />;
      case 'inspiration':
        return <InspirationPage />;
      case 'prompts':
        return <PromptDetailPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'feedback':
        return <FeedbackPage />;
      case 'about':
        return <AboutPage />;
      case 'profile-edit':
        return <ProfileEditPage />;
      case 'clothing-detail':
        return <ClothingDetailPage itemId={detailId ?? ''} onBack={() => { setCurrentPage('wardrobe'); setDetailId(null); }} />;
      case 'outfit-detail':
        return <OutfitDetailPage outfitId={detailId ?? ''} />;
      case 'post-detail':
        return <PostDetailPage postId={detailId ?? ''} onBack={() => { setCurrentPage('community'); setDetailId(null); }} />;
      case 'eco-detail':
        return <EcoDetailPage onBack={() => { setCurrentPage('home'); setDetailId(null); }} />;
      case 'style-detail':
        return <StyleDetailPage onBack={() => { setCurrentPage('me'); setDetailId(null); }} />;
      default:
        return <HomePage />;
    }
  };

  const wardrobeCount = items.length;

  return (
    <div className="app-container">
      <NetworkStatusBanner />
      <div className="status-bar">
        <span>{formatTime(currentTime)}</span>
        <button
          type="button"
          className="status-bar__me"
          onClick={() => setCurrentPage('me')}
          aria-label="打开我的"
        >
          <span aria-hidden>我的</span>
        </button>
      </div>

      <main className="main-content">{renderPage()}</main>

      <nav className="bottom-nav" aria-label="主导航">
        <button
          type="button"
          className={currentPage === 'home' ? 'active' : ''}
          onClick={() => setCurrentPage('home')}
        >
          <span className="nav-icon" aria-hidden>
            <HomeIcon size={22} />
          </span>
          <span className="nav-label">首页</span>
        </button>
        <button
          type="button"
          className={currentPage === 'wardrobe' ? 'active' : ''}
          onClick={() => setCurrentPage('wardrobe')}
        >
          <span className="nav-icon" aria-hidden>
            <WardrobeIcon size={22} />
          </span>
          <span className="nav-label">衣橱</span>
          {wardrobeCount > 0 && <span className="nav-badge">{wardrobeCount}</span>}
        </button>

        <button
          type="button"
          className="bottom-nav__add"
          onClick={() => setShowModal(true)}
          aria-label="添加入橱"
        >
          <span className="nav-icon nav-icon--add" aria-hidden>
            <PlusIcon size={24} />
          </span>
          <span className="nav-label">入橱</span>
        </button>

        <button
          type="button"
          className={currentPage === 'community' ? 'active' : ''}
          onClick={() => setCurrentPage('community')}
        >
          <span className="nav-icon" aria-hidden>
            <CommunityIcon size={22} />
          </span>
          <span className="nav-label">社区</span>
          {COMMUNITY_UNREAD > 0 && (
            <span className={`nav-badge ${COMMUNITY_UNREAD > 0 ? 'nav-badge--pulse' : ''}`}>{COMMUNITY_UNREAD}</span>
          )}
        </button>
        <button
          type="button"
          className={currentPage === 'me' ? 'active' : ''}
          onClick={() => setCurrentPage('me')}
        >
          <span className="nav-icon" aria-hidden>
            <UserIcon size={22} />
          </span>
          <span className="nav-label">我的</span>
        </button>
      </nav>

      {showModal && (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={() => setShowModal(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowModal(false)}
        >
          <div
            className="modal-content"
            role="dialog"
            aria-labelledby="upload-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="upload-title">添加入橱</h3>
            <p
              style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'var(--xy-ink-muted)',
                marginTop: '-0.75rem',
                marginBottom: '1rem',
              }}
            >
              AI 将识别品类、颜色与材质，并写入你的数字衣橱
            </p>
            <div className="upload-options">
              <button
                type="button"
                className="upload-option"
                onClick={() => {
                  pushToast('已打开相机占位：接入设备后将启动拍摄与抠图');
                  setShowModal(false);
                }}
              >
                <div className="upload-icon"><CameraIcon size={28} color="white" /></div>
                <span>拍照</span>
              </button>
              <button
                type="button"
                className="upload-option"
                onClick={() => {
                  pushToast('已从相册选取（演示）：AI 识别中…');
                  setShowModal(false);
                }}
              >
                <div
                  className="upload-icon"
                  style={{
                    background: 'linear-gradient(145deg, #c45c48 0%, #8b3d35 100%)',
                  }}
                >
                  <ImageIcon size={28} color="white" />
                </div>
                <span>相册</span>
              </button>
              <button
                type="button"
                className="upload-option"
                onClick={() => {
                  pushToast('链接解析已排队：将尝试抓取主图与商品属性');
                  setShowModal(false);
                }}
              >
                <div
                  className="upload-icon"
                  style={{
                    background: 'linear-gradient(145deg, #6b6b70 0%, #3d3d40 100%)',
                  }}
                >
                  <LinkIcon size={28} color="white" />
                </div>
                <span>链接导入</span>
              </button>
            </div>
            <button type="button" className="modal-close" onClick={() => setShowModal(false)}>
              取消
            </button>
          </div>
        </div>
      )}

      {globalToast && (
        <div className="toast toast--global" role="status">
          {globalToast}
        </div>
      )}

      <ChatButton onClick={() => setIsChatOpen(true)} />
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WardrobeProvider>
        <AppShell />
      </WardrobeProvider>
    </AuthProvider>
  );
}

export default App;