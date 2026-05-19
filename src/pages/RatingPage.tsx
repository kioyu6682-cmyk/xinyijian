import React, { useState, useEffect } from 'react';
import OutfitRating from '../components/OutfitRating';
import { useWardrobe } from '../hooks/useWardrobe';
import type { Outfit } from '../types';

const RatingPage: React.FC = () => {
  const { items } = useWardrobe();
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [bodyType, setBodyType] = useState<string>('hourglass');

  // 模拟穿搭数据
  useEffect(() => {
    // 生成一些模拟穿搭数据
    const mockOutfits: Outfit[] = [
      {
        id: '1',
        name: '通勤休闲',
        items: [
          { itemId: '1', position: 1, layer: 1 },
          { itemId: '6', position: 2, layer: 2 },
          { itemId: '11', position: 3, layer: 3 },
          { itemId: '16', position: 4, layer: 4 },
        ],
        occasion: 'commute',
        style: 'casual',
        season: 'spring',
        temperature: 22,
        weather: { 
          temperature: 22, 
          condition: 'sunny', 
          humidity: 60, 
          windSpeed: 10,
          feelsLike: 22,
          uvIndex: 5,
          precipitation: 0,
          location: 'Beijing',
          forecast: []
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        thumbnail: '',
        wearCount: 0,
        isAiGenerated: false,
        isFavorite: true,
        tags: ['休闲', '通勤'],
        userId: '1',
        likes: 0,
        isPublic: false,
      },
      {
        id: '2',
        name: '约会穿搭',
        items: [
          { itemId: '2', position: 1, layer: 1 },
          { itemId: '7', position: 2, layer: 2 },
          { itemId: '12', position: 3, layer: 3 },
          { itemId: '17', position: 4, layer: 4 },
        ],
        occasion: 'date',
        style: 'sweet',
        season: 'spring',
        temperature: 25,
        weather: { 
          temperature: 25, 
          condition: 'sunny', 
          humidity: 50, 
          windSpeed: 8,
          feelsLike: 25,
          uvIndex: 6,
          precipitation: 0,
          location: 'Beijing',
          forecast: []
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        thumbnail: '',
        wearCount: 0,
        isAiGenerated: false,
        isFavorite: false,
        tags: ['甜美', '约会'],
        userId: '1',
        likes: 0,
        isPublic: false,
      },
      {
        id: '3',
        name: '运动风格',
        items: [
          { itemId: '3', position: 1, layer: 1 },
          { itemId: '8', position: 2, layer: 2 },
          { itemId: '13', position: 3, layer: 3 },
          { itemId: '18', position: 4, layer: 4 },
        ],
        occasion: 'sport',
        style: 'sporty',
        season: 'summer',
        temperature: 28,
        weather: { 
          temperature: 28, 
          condition: 'sunny', 
          humidity: 70, 
          windSpeed: 12,
          feelsLike: 30,
          uvIndex: 8,
          precipitation: 0,
          location: 'Beijing',
          forecast: []
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        thumbnail: '',
        wearCount: 0,
        isAiGenerated: false,
        isFavorite: false,
        tags: ['运动', '休闲'],
        userId: '1',
        likes: 0,
        isPublic: false,
      }
    ];
    setOutfits(mockOutfits);
    setSelectedOutfit(mockOutfits[0]);
  }, []);

  // 身材类型选项
  const bodyTypes = [
    { value: 'hourglass', label: '沙漏形' },
    { value: 'pear', label: '梨形' },
    { value: 'apple', label: '苹果形' },
    { value: 'rectangle', label: 'H型' },
    { value: 'inverted-triangle', label: '倒三角型' },
  ];

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
                key={type.value}
                className={`px-3 py-1 rounded-full text-sm ${bodyType === type.value ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => setBodyType(type.value)}
              >
                {type.label}
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
              {selectedOutfit.items.slice(0, 4).map((outfitItem) => {
                const item = items.find(i => i.id === outfitItem.itemId);
                return item ? (
                  <div key={outfitItem.itemId} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
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