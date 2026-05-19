// src/components/ClothesGrid.tsx
import React from 'react';
import type { ClothingItem, ClothingCategory } from '../types';
import './ClothesGrid.css';

const CAT_LABEL: Record<ClothingCategory, string> = {
  tops: '上衣',
  bottoms: '下装',
  dresses: '连衣裙',
  outerwear: '外套',
  shoes: '鞋履',
  bags: '包袋',
  accessories: '配饰',
  underwear: '内衣',
};

interface ClothesGridProps {
  items: ClothingItem[];
  onItemClick: (item: ClothingItem) => void;
  onToggleFavorite: (id: string) => void;
}

export const ClothesGrid: React.FC<ClothesGridProps> = ({
  items,
  onItemClick,
  onToggleFavorite
}) => {
  const getSleepingDays = (lastWorn?: Date) => {
    if (!lastWorn) return 999;
    const days = Math.floor((Date.now() - new Date(lastWorn).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="clothes-grid">
      {items.map(item => {
        const sleepingDays = getSleepingDays(item.lastWorn);
        const isSleeping = sleepingDays > 30;

        return (
          <div 
            key={item.id} 
            className="clothes-item"
            onClick={() => onItemClick(item)}
          >
            {isSleeping && (
              <div className="sleep-badge">沉睡{sleepingDays}天</div>
            )}
            <div className="clothes-image">
              <img 
                src={item.thumbnail} 
                alt={item.name}
                className="clothes-image__img"
                loading="lazy"
              />
            </div>
            <div className="clothes-info">
              <h4 className="clothes-name">{item.name}</h4>
              <div className="clothes-meta">
                <span>{CAT_LABEL[item.category]} · {item.size}</span>
                <span className="wear-count">穿过{item.wearCount}次</span>
              </div>
            </div>
            <button 
              className={`favorite-btn ${item.isFavorite ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
            >
              {item.isFavorite ? '❤️' : '🤍'}
            </button>
          </div>
        );
      })}
    </div>
  );
};
