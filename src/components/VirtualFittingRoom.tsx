// src/components/VirtualFittingRoom.tsx
import React, { useState, useCallback } from 'react';
import type { ClothingItem, Outfit, OccasionType, OutfitItem } from '../types';
import { generateId } from '../utils';
import './VirtualFittingRoom.css';

interface VirtualFittingRoomProps {
  items: ClothingItem[];
  currentOutfit: Outfit | null;
  onSaveOutfit: (outfit: Outfit) => void;
  isGenerating: boolean;
  isLoading?: boolean;
}

type SceneType = 'commute' | 'date' | 'casual' | 'sport';

const sceneToOccasion: Record<SceneType, OccasionType> = {
  commute: 'commute',
  date: 'date',
  casual: 'home',
  sport: 'sport',
};

export const VirtualFittingRoom: React.FC<VirtualFittingRoomProps> = ({
  items,
  currentOutfit: _currentOutfit,
  onSaveOutfit,
  isGenerating,
  isLoading = false,
}) => {
  void _currentOutfit;
  const [selectedScene, setSelectedScene] = useState<SceneType>('commute');
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('tops');

  const scenes: { id: SceneType; name: string; gradient: string }[] = [
    { id: 'commute', name: '通勤', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'date', name: '约会', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 'casual', name: '休闲', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 'sport', name: '运动', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  ];

  const categories = [
    { id: 'outerwear', name: '外套', icon: '🧥' },
    { id: 'tops', name: '上衣', icon: '👔' },
    { id: 'bottoms', name: '下装', icon: '👖' },
    { id: 'dresses', name: '连衣裙', icon: '👗' },
    { id: 'shoes', name: '鞋履', icon: '👟' },
    { id: 'bags', name: '包袋', icon: String.fromCodePoint(0x1f45c) },
    { id: 'accessories', name: '配饰', icon: '🎒' },
  ];

  const addToOutfit = useCallback((item: ClothingItem) => {
    setSelectedItems(prev => {
      const filtered = prev.filter(i => i.category !== item.category);
      return [...filtered, item];
    });
  }, []);

  const selectableItems = items.filter((item) => !item.isArchived);

  const getItemsByCategory = (category: string) => {
    return selectableItems.filter((item) => item.category === category);
  };

  return (
    <div className="virtual-fitting-room">
      <div className="canvas-area" style={{ background: scenes.find(s => s.id === selectedScene)?.gradient }}>
        <div className="canvas-model">
          <div className="model-clothes">
            {selectedItems.map(item => (
              <div key={item.id} className={`model-item model-${item.category}`}>
                {item.thumbnail}
              </div>
            ))}
            {selectedItems.length === 0 && <div className="model-placeholder">👩</div>}
          </div>
        </div>

        <div className="scene-switcher">
          {scenes.map(scene => (
            <button
              key={scene.id}
              className={`scene-btn ${selectedScene === scene.id ? 'active' : ''}`}
              onClick={() => setSelectedScene(scene.id)}
            >
              {scene.name}
            </button>
          ))}
        </div>
      </div>

      <div className="category-selector">
        <h3>选择单品</h3>
        <div className="category-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
              disabled={isLoading}
              onClick={() => {
                if (isLoading) return;
                setActiveCategory(cat.id);
                if (getItemsByCategory(cat.id).length === 0) {
                  window.dispatchEvent(
                    new CustomEvent('app-toast', {
                      detail: { message: `「${cat.name}」下暂无单品，可先添加入橱` },
                    }),
                  );
                }
              }}
            >
              <div className="category-icon">{cat.icon}</div>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="items-selector">
        <h4>{categories.find(c => c.id === activeCategory)?.name}</h4>
        <div className="items-scroll">
          {isLoading ? (
            <p className="items-selector__hint">正在载入衣橱单品…</p>
          ) : (
            getItemsByCategory(activeCategory).map((item) => (
              <button
                key={item.id}
                type="button"
                className={`selectable-item ${selectedItems.find((i) => i.id === item.id) ? 'selected' : ''}`}
                onClick={() => addToOutfit(item)}
              >
                <div className="item-thumb">{item.thumbnail}</div>
                <span className="item-name">{item.name}</span>
              </button>
            ))
          )}
        </div>
        {!isLoading && getItemsByCategory(activeCategory).length === 0 && (
          <p className="items-selector__empty">该分类下暂无可选单品</p>
        )}
      </div>

      <div className="outfit-actions">
        <button
          type="button"
          className="save-outfit-btn"
          disabled={selectedItems.length === 0 || isGenerating || isLoading}
          onClick={() => {
            const uid = selectedItems[0]?.userId ?? 'user_001';
            const outfitItems: OutfitItem[] = selectedItems.map((item, index) => ({
              itemId: item.id,
              position: index + 1,
              layer: item.category === 'outerwear' ? 3 : item.category === 'tops' || item.category === 'dresses' ? 2 : 1,
            }));
            const outfit: Outfit = {
              id: generateId('out_'),
              name: `搭配 · ${scenes.find((s) => s.id === selectedScene)?.name ?? ''}`,
              items: outfitItems,
              occasion: sceneToOccasion[selectedScene],
              style: 'minimalist',
              season: 'all',
              isAiGenerated: false,
              thumbnail: selectedItems.map((i) => i.thumbnail).join(''),
              wearCount: 0,
              isFavorite: false,
              tags: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              userId: uid,
              likes: 0,
              isPublic: false,
            };
            onSaveOutfit(outfit);
          }}
        >
          {isGenerating ? '生成中...' : '保存到穿搭日历'}
        </button>
      </div>
    </div>
  );
};
