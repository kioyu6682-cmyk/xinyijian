import React, { useState } from 'react';
import { useWardrobeContext } from '../context/WardrobeContext';
import { useAuth } from '../context/AuthContext';
import './FavoritesPage.css';

const MOCK_OUTFITS = [
  {
    id: '1',
    title: '简约通勤风',
    items: ['👔', '👖', '👞'],
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=minimalist%20business%20outfit%20shirt%20trousers%20professional&size=600x800',
    savedAt: '2026-04-20',
  },
  {
    id: '2',
    title: '周末休闲',
    items: ['👕', '👖', '👟'],
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=casual%20weekend%20outfit%20tshirt%20jeans%20sneakers&size=600x800',
    savedAt: '2026-04-18',
  },
  {
    id: '3',
    title: '约会甜美风',
    items: ['👗', '👠', '👜'],
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=feminine%20date%20outfit%20dress%20heels%20elegant&size=600x800',
    savedAt: '2026-04-15',
  },
];

export const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const { items } = useWardrobeContext();
  const [activeTab, setActiveTab] = useState<'outfits' | 'items'>('outfits');
  
  const favoriteItems = items.filter(item => item.isFavorite);

  return (
    <div className="favorites-page">
      <header className="page-header">
        <button 
          type="button" 
          className="page-back"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }))}
        >
          ←
        </button>
        <h1 className="page-title">我的收藏</h1>
        <div className="page-actions">
          <span className="page-count">{activeTab === 'outfits' ? MOCK_OUTFITS.length : favoriteItems.length} 个收藏</span>
        </div>
      </header>

      <div className="tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'outfits' ? 'active' : ''}`}
          onClick={() => setActiveTab('outfits')}
        >
          穿搭灵感
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          衣橱单品
        </button>
      </div>

      {activeTab === 'outfits' ? (
        <div className="outfits-grid">
          {MOCK_OUTFITS.length > 0 ? (
            MOCK_OUTFITS.map((outfit) => (
              <div 
                key={outfit.id} 
                className="outfit-card"
                onClick={() => {
                  console.log('=== 点击穿搭卡片 ===');
                  console.log('outfitId:', outfit.id);
                  window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'outfit-detail', params: { id: outfit.id } } }));
                }}
              >
                <div className="outfit-image-wrapper">
                  <img src={outfit.image} alt={outfit.title} className="outfit-image" />
                  <button type="button" className="outfit-fav active">❤️</button>
                </div>
                <div className="outfit-info">
                  <h3 className="outfit-title">{outfit.title}</h3>
                  <div className="outfit-items">{outfit.items.join(' ')}</div>
                  <span className="outfit-date">收藏于 {outfit.savedAt}</span>
                </div>
                <div className="outfit-arrow">→</div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>还没有收藏任何穿搭灵感</p>
              <button 
                type="button" 
                className="empty-action"
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'inspiration' } }))}
              >
                去发现灵感
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="items-list">
          {favoriteItems.length > 0 ? (
            favoriteItems.map((item) => (
              <div key={item.id} className="item-row">
                <div className="item-thumbnail">{item.thumbnail}</div>
                <div className="item-info">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-meta">{item.brand} · {item.color}</p>
                </div>
                <button type="button" className="item-fav active">❤️</button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <span className="empty-icon">👚</span>
              <p>还没有收藏任何衣橱单品</p>
              <button 
                type="button" 
                className="empty-action"
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'wardrobe' } }))}
              >
                去衣橱看看
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
