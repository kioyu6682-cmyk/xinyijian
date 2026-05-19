import React, { useState, useEffect } from 'react';
import OutfitRating from '../components/OutfitRating';
import { useWardrobe } from '../hooks/useWardrobe';
import type { Outfit, ClothingItem } from '../types';

const RatingPage: React.FC = () => {
  const { items } = useWardrobe();
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [bodyType, setBodyType] = useState<string>('沙漏形');

  // 模拟穿搭数据
  useEffect(() => {
    // 生成一些模拟穿搭数据
    const mockOutfits: Outfit[] = [
      {
        id: '1',
        name: '通勤休闲',
        items: ['1', '6', '11', '16'],
        occasion: 'commute',
        weather: 'sunny',
        createdAt: new Date().toISOString(),
        tags: ['休闲', '通勤'],
        isFavorite: true
      },
      {
        id: '2',
        name: '约会穿搭',
        items: ['2', '7', '12', '17'],
        occasion: 'date',
        weather: 'sunny',
        createdAt: new Date().toISOString(),
        tags: ['甜美', '约会'],
        isFavorite: false
      },
      {
        id: '3',
        name: '运动风格',
        items: ['3', '8', '13', '18'],
        occasion: 'sports',
        weather: 'sunny',
        createdAt: new Date().toISOString(),
        tags: ['运动', '休闲'],
        isFavorite: false
      }
    ];
    setOutfits(mockOutfits);
    setSelectedOutfit(mockOutfits[0]);
  }, []);

  // 身材类型选项
  const bodyTypes = ['沙漏形', '梨形', '苹果形', 'H型', '倒三角型'];

  if (!selectedOutfit) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="rating-page">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">穿搭评分与风格诊断</h2>
          <button
            type="button"
            className="w-11 h-11 rounded-full border border-gray-200 bg-white shadow-sm text-2xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'prompts' } }))}
            title="AI提示词"
          >
            💡
          </button>
        </div>
        
        {/* 选择穿搭 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">选择穿搭</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={selectedOutfit.id}
            onChange={(e) => {
              const outfit = outfits.find(o => o.id === e.target.value);
              if (outfit) setSelectedOutfit(outfit);
            }}
          >
            {outfits.map(outfit => (
              <option key={outfit.id} value={outfit.id}>
                {outfit.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* 选择身材类型 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">选择身材类型</label>
          <div className="flex flex-wrap gap-2">
            {bodyTypes.map(type => (
              <button
                key={type}
                className={`px-3 py-1 rounded-full text-sm ${bodyType === type ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => setBodyType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        {/* 评分组件 */}
        <OutfitRating 
          outfit={selectedOutfit} 
          items={items} 
          bodyType={bodyType} 
        />
        
        {/* 分享穿搭卡片 */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">分享穿搭卡片</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">{selectedOutfit.name}</h4>
              <span className="text-sm bg-pink-100 text-pink-600 px-2 py-1 rounded">
                评分: {Math.round((70 + 85 + 90 + 80) / 4)}分
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {selectedOutfit.items.slice(0, 4).map(itemId => {
                const item = items.find(i => i.id === itemId);
                return item ? (
                  <div key={itemId} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">👕</span>
                  </div>
                ) : null;
              })}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-600">
                风格: {selectedOutfit.tags.join(', ')}
              </div>
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm">
                生成分享卡片
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingPage;