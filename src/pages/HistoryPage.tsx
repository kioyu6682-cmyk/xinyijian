import React, { useState } from 'react';
import './HistoryPage.css';

const MOCK_HISTORY = [
  {
    id: '1',
    type: 'view',
    title: '浏览记录',
    items: [
      { id: 'v1', name: '丝质白衬衫', thumbnail: '👔', time: '10分钟前' },
      { id: 'v2', name: '卡其色风衣', thumbnail: '🧥', time: '30分钟前' },
      { id: 'v3', name: '高腰牛仔裤', thumbnail: '👖', time: '1小时前' },
    ],
  },
  {
    id: '2',
    type: 'outfit',
    title: '穿搭记录',
    items: [
      { 
        id: 'o1', 
        name: '简约通勤', 
        thumbnail: '👔👖👞', 
        time: '今天 08:30',
        image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=minimalist%20business%20outfit%20shirt%20trousers%20professional&size=600x800'
      },
      { 
        id: 'o2', 
        name: '休闲周末', 
        thumbnail: '👕👖👟', 
        time: '昨天 14:20',
        image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=casual%20weekend%20outfit%20tshirt%20jeans%20sneakers&size=600x800'
      },
      { 
        id: 'o3', 
        name: '约会穿搭', 
        thumbnail: '👗👠👜', 
        time: '前天 19:00',
        image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=feminine%20date%20outfit%20dress%20heels%20elegant&size=600x800'
      },
    ],
  },
];

export const HistoryPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'all' | 'view' | 'outfit'>('all');

  return (
    <div className="history-page">
      <header className="page-header">
        <button 
          type="button" 
          className="page-back"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }))}
        >
          ←
        </button>
        <h1 className="page-title">浏览历史</h1>
        <div className="page-actions">
          <button type="button" className="page-clear" onClick={() => alert('已清除所有历史记录')}>
            清空
          </button>
        </div>
      </header>

      <div className="filter-bar">
        <button
          type="button"
          className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedType('all')}
        >
          全部
        </button>
        <button
          type="button"
          className={`filter-btn ${selectedType === 'view' ? 'active' : ''}`}
          onClick={() => setSelectedType('view')}
        >
          浏览
        </button>
        <button
          type="button"
          className={`filter-btn ${selectedType === 'outfit' ? 'active' : ''}`}
          onClick={() => setSelectedType('outfit')}
        >
          穿搭
        </button>
      </div>

      <div className="history-content">
        {MOCK_HISTORY.map((section) => {
          if (selectedType !== 'all' && section.type !== selectedType) return null;
          
          return (
            <section key={section.id} className="history-section">
              <h2 className="section-title">{section.title}</h2>
              {section.type === 'view' ? (
                <div className="view-list">
                  {section.items.map((item) => (
                    <div key={item.id} className="view-item">
                      <span className="view-thumbnail">{item.thumbnail}</span>
                      <span className="view-name">{item.name}</span>
                      <span className="view-time">{item.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="outfit-grid">
                  {section.items.map((item) => {
                    const outfitItem = item as { id: string; name: string; thumbnail: string; time: string; image: string };
                    return (
                      <div key={outfitItem.id} className="outfit-item">
                        <div className="outfit-image-wrapper">
                          <img src={outfitItem.image} alt={outfitItem.name} className="outfit-image" />
                        </div>
                        <div className="outfit-info">
                          <span className="outfit-thumbnails">{outfitItem.thumbnail}</span>
                          <span className="outfit-name">{outfitItem.name}</span>
                          <span className="outfit-time">{outfitItem.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}

        {MOCK_HISTORY.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>还没有浏览记录</p>
          </div>
        )}
      </div>
    </div>
  );
};
