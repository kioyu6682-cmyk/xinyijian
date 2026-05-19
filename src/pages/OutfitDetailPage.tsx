import React, { useState } from 'react';
import { HeartIcon, LinkIcon, ClockIcon, ThermometerSunIcon, TagIcon } from '../components/Icons';
import './OutfitDetailPage.css';

interface OutfitDetail {
  id: string;
  title: string;
  description: string;
  image: string;
  items: {
    name: string;
    image: string;
    category: string;
  }[];
  style: string;
  occasion: string;
  season: string;
  temperature: string;
  colorPalette: string[];
  tags: string[];
  savedAt: string;
  likes: number;
  isLiked: boolean;
}

const OUTFIT_DATA: Record<string, OutfitDetail> = {
  '1': {
    id: '1',
    title: '简约通勤风',
    description: '经典的白衬衫搭配深色西裤，简约而不失专业感，适合日常通勤穿着。搭配棕色皮鞋增添成熟稳重气质。',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=minimalist%20business%20outfit%20white%20shirt%20black%20trousers%20brown%20leather%20shoes%20professional%20fashion%20photography%20studio%20lighting&size=800x1000',
    items: [
      { name: '白色棉质衬衫', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=white%20cotton%20business%20shirt%20formal%20wear%20product%20photo%20minimalist%20background&size=400x500', category: '上衣' },
      { name: '深色西装裤', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=black%20business%20trousers%20formal%20pants%20product%20photo%20minimalist%20background&size=400x500', category: '下装' },
      { name: '棕色皮鞋', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=brown%20leather%20oxford%20shoes%20formal%20footwear%20product%20photo%20minimalist%20background&size=400x500', category: '鞋履' },
    ],
    style: '简约',
    occasion: '通勤',
    season: '四季',
    temperature: '15-25°C',
    colorPalette: ['#FFFFFF', '#2C2C2C', '#8B4513'],
    tags: ['通勤', '简约', '商务'],
    savedAt: '2026-04-20',
    likes: 128,
    isLiked: false,
  },
  '2': {
    id: '2',
    title: '周末休闲',
    description: '舒适的T恤搭配牛仔裤，轻松自在的周末穿搭。白色运动鞋增添活力感，适合逛街、咖啡馆休闲。',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=casual%20weekend%20outfit%20white%20oversized%20tshirt%20blue%20jeans%20white%20sneakers%20street%20style%20fashion%20photography&size=800x1000',
    items: [
      { name: '白色宽松T恤', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=white%20oversized%20cotton%20tshirt%20casual%20wear%20product%20photo%20minimalist%20background&size=400x500', category: '上衣' },
      { name: '蓝色牛仔裤', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=blue%20denim%20jeans%20casual%20pants%20product%20photo%20minimalist%20background&size=400x500', category: '下装' },
      { name: '白色运动鞋', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=white%20casual%20sneakers%20athletic%20shoes%20product%20photo%20minimalist%20background&size=400x500', category: '鞋履' },
    ],
    style: '休闲',
    occasion: '日常',
    season: '春夏',
    temperature: '20-30°C',
    colorPalette: ['#FFFFFF', '#4169E1', '#808080'],
    tags: ['休闲', '日常', '舒适'],
    savedAt: '2026-04-18',
    likes: 256,
    isLiked: true,
  },
  '3': {
    id: '3',
    title: '约会甜美风',
    description: '粉色连衣裙搭配高跟鞋，甜美优雅的约会穿搭。配上精致手包，增添女性魅力。',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=feminine%20date%20outfit%20pink%20midi%20dress%20high%20heels%20elegant%20fashion%20photography%20soft%20lighting&size=800x1000',
    items: [
      { name: '粉色连衣裙', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=pink%20midi%20dress%20feminine%20elegant%20product%20photo%20soft%20background&size=400x500', category: '连衣裙' },
      { name: '裸色高跟鞋', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=nude%20high%20heels%20elegant%20pumps%20product%20photo%20minimalist%20background&size=400x500', category: '鞋履' },
      { name: '链条手包', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=gold%20chain%20handbag%20elegant%20clutch%20product%20photo%20minimalist%20background&size=400x500', category: '配饰' },
    ],
    style: '甜美',
    occasion: '约会',
    season: '春夏',
    temperature: '22-32°C',
    colorPalette: ['#FFB6C1', '#D2691E', '#FFD700'],
    tags: ['约会', '甜美', '优雅'],
    savedAt: '2026-04-15',
    likes: 312,
    isLiked: false,
  },
};

interface OutfitDetailPageProps {
  outfitId?: string;
}

export const OutfitDetailPage: React.FC<OutfitDetailPageProps> = ({ outfitId = '1' }) => {
  const outfit = OUTFIT_DATA[outfitId] || OUTFIT_DATA['1'];
  const [liked, setLiked] = useState(outfit.isLiked);
  const [likeCount, setLikeCount] = useState(outfit.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const handleShare = () => {
    alert('分享功能即将开放');
  };

  return (
    <div className="outfit-detail-page">
      <header className="detail-header">
        <button 
          type="button" 
          className="detail-back"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'favorites' } }))}
        >
          ←
        </button>
        <h1 className="detail-title">穿搭详情</h1>
        <div className="detail-actions">
          <button type="button" className="action-btn" onClick={handleShare}>
            <LinkIcon size={20} />
          </button>
        </div>
      </header>

      <div className="detail-content">
        <div className="main-image-wrapper">
          <img src={outfit.image} alt={outfit.title} className="main-image" />
          <button type="button" className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            <HeartIcon size={24} />
            <span>{likeCount}</span>
          </button>
        </div>

        <div className="outfit-info">
          <h2 className="outfit-title">{outfit.title}</h2>
          <p className="outfit-description">{outfit.description}</p>

          <div className="info-tags">
            <div className="info-tag">
              <TagIcon size={14} />
              <span>{outfit.style}</span>
            </div>
            <div className="info-tag">
              <ClockIcon size={14} />
              <span>{outfit.occasion}</span>
            </div>
            <div className="info-tag">
              <ThermometerSunIcon size={14} />
              <span>{outfit.temperature}</span>
            </div>
          </div>

          <div className="color-palette">
            <h4>配色方案</h4>
            <div className="colors">
              {outfit.colorPalette.map((color, index) => (
                <div 
                  key={index} 
                  className="color-chip" 
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="style-tags">
            {outfit.tags.map((tag) => (
              <span key={tag} className="style-tag">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="items-section">
          <h3 className="section-title">穿搭单品</h3>
          <div className="items-grid">
            {outfit.items.map((item, index) => (
              <div key={index} className="item-card">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-info">
                  <span className="item-category">{item.category}</span>
                  <h4 className="item-name">{item.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="button" 
          className="try-on-btn"
          onClick={() => alert('虚拟试穿功能即将开放')}
        >
          虚拟试穿
        </button>
      </div>
    </div>
  );
};