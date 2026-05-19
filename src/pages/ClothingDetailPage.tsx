import React from 'react';
import { useWardrobeContext } from '../context/WardrobeContext';
import { BackIcon, HeartIcon } from '../components/Icons';
import { formatPrice, daysBetween } from '../utils';
import './ClothingDetailPage.css';

interface Props {
  itemId: string;
  onBack: () => void;
}

const CAT_LABEL: Record<string, string> = {
  tops: '上衣', bottoms: '下装', dresses: '连衣裙',
  outerwear: '外套', shoes: '鞋履', bags: '包袋', accessories: '配饰', underwear: '内衣',
};

const SEASON_LABEL: Record<string, string> = {
  spring: '春', summer: '夏', autumn: '秋', winter: '冬', all: '四季',
};

const FIT_LABEL: Record<string, string> = {
  tight: '修身', regular: '合身', loose: '宽松', oversized: 'oversized',
};

export const ClothingDetailPage: React.FC<Props> = ({ itemId, onBack }) => {
  const { items, toggleFavorite } = useWardrobeContext();
  const item = items.find(i => i.id === itemId);

  if (!item) {
    return (
      <div className="clothing-detail-page">
        <div className="detail-empty">
          <p>单品未找到</p>
          <button className="btn-primary" onClick={onBack}>返回衣橱</button>
        </div>
      </div>
    );
  }

  return (
    <div className="clothing-detail-page">
      <header className="detail-page-header">
        <button className="detail-page-back" onClick={onBack}>
          <BackIcon size={20} /> 衣橱
        </button>
        <div className="detail-page-actions">
          <button
            className={`detail-page-fav ${item.isFavorite ? 'active' : ''}`}
            onClick={() => toggleFavorite(item.id)}
            aria-label={item.isFavorite ? '取消收藏' : '收藏'}
          >
            <HeartIcon size={20} color={item.isFavorite ? '#e57082' : 'currentColor'} />
          </button>
        </div>
      </header>

      <div className="detail-hero-section">
        <div className="detail-hero-inner">
          <img src={item.thumbnail} alt={item.name} className="detail-hero-image" />
        </div>
        <h1 className="detail-hero-name">{item.name}</h1>
        <p className="detail-hero-sub">{CAT_LABEL[item.category] || item.category} · {item.subCategory}</p>
      </div>

      <div className="detail-stats-row">
        <div className="detail-stat">
          <span className="detail-stat-num">{item.wearCount}</span>
          <span className="detail-stat-label">穿着次数</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-num">{formatPrice(item.price)}</span>
          <span className="detail-stat-label">入手价格</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-num">
            {item.lastWorn ? `${daysBetween(new Date(), item.lastWorn)}天` : '未记录'}
          </span>
          <span className="detail-stat-label">上次穿着</span>
        </div>
      </div>

      <div className="detail-tags">
        {item.tags?.map(tag => <span key={tag} className="detail-tag">{tag}</span>)}
      </div>

      <section className="detail-section">
        <h2 className="detail-section-title">基本信息</h2>
        <div className="detail-info-grid">
          <div className="detail-info-row">
            <span className="detail-info-label">颜色</span>
            <span className="detail-info-value">{item.color}</span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-label">材质</span>
            <span className="detail-info-value">{item.material}</span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-label">品牌</span>
            <span className="detail-info-value">{item.brand || '未知'}</span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-label">版型</span>
            <span className="detail-info-value">{FIT_LABEL[item.fit] || item.fit}</span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-label">尺码</span>
            <span className="detail-info-value">{item.size}</span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-label">季节</span>
            <span className="detail-info-value">{item.season.map(s => SEASON_LABEL[s] || s).join(' / ')}</span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-label">购买渠道</span>
            <span className="detail-info-value">{item.purchaseChannel || '未知'}</span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-label">图案</span>
            <span className="detail-info-value">{item.pattern}</span>
          </div>
        </div>
      </section>

      {item.notes && (
        <section className="detail-section">
          <h2 className="detail-section-title">备注</h2>
          <p className="detail-notes">{item.notes}</p>
        </section>
      )}

      {item.careInstructions && (
        <section className="detail-section">
          <h2 className="detail-section-title">护理说明</h2>
          <p className="detail-notes">{item.careInstructions}</p>
        </section>
      )}

      {item.sustainability && (
        <section className="detail-section">
          <h2 className="detail-section-title">可持续信息</h2>
          <div className="detail-sustainability">
            {item.sustainability.isRecycled && <span className="detail-sus-badge">可回收材料</span>}
            {item.sustainability.carbonFootprint != null && (
              <span className="detail-sus-badge">碳足迹: {item.sustainability.carbonFootprint}kg</span>
            )}
            {item.sustainability.waterUsage != null && (
              <span className="detail-sus-badge">用水量: {item.sustainability.waterUsage}L</span>
            )}
          </div>
        </section>
      )}

      <div className="detail-bottom-actions">
        <button className="btn-primary" onClick={() => {
          onBack();
          window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'match' } }));
        }}>
          用这件去搭配
        </button>
        <button className="btn-secondary" onClick={onBack}>返回</button>
      </div>
    </div>
  );
};
