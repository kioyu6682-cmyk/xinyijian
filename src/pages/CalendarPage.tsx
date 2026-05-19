import React, { useState, useMemo } from 'react';
import Calendar from '../components/Calendar';
import type { Outfit } from '../types';

// 模拟数据
const mockOutfits: Outfit[] = [
  {
    id: '1',
    name: '休闲穿搭',
    items: [
      { itemId: '1', position: 1, layer: 2 },
      { itemId: '2', position: 2, layer: 1 },
      { itemId: '3', position: 3, layer: 3 },
    ],
    occasion: 'home',
    style: 'casual',
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
    season: 'spring',
    isAiGenerated: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    thumbnail: '',
    wearCount: 0,
    isFavorite: false,
    tags: [],
    userId: '1',
    likes: 0,
    isPublic: false,
  },
  {
    id: '2',
    name: '通勤穿搭',
    items: [
      { itemId: '4', position: 1, layer: 2 },
      { itemId: '5', position: 2, layer: 1 },
      { itemId: '6', position: 3, layer: 3 },
    ],
    occasion: 'commute',
    style: 'business',
    temperature: 18,
    weather: { 
      temperature: 18, 
      condition: 'cloudy', 
      humidity: 70, 
      windSpeed: 15,
      feelsLike: 18,
      uvIndex: 3,
      precipitation: 10,
      location: 'Beijing',
      forecast: []
    },
    season: 'spring',
    isAiGenerated: false,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    thumbnail: '',
    wearCount: 0,
    isFavorite: false,
    tags: [],
    userId: '1',
    likes: 0,
    isPublic: false,
  },
  {
    id: '3',
    name: '约会穿搭',
    items: [
      { itemId: '7', position: 1, layer: 2 },
      { itemId: '8', position: 2, layer: 1 },
      { itemId: '9', position: 3, layer: 3 },
    ],
    occasion: 'date',
    style: 'sweet',
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
    season: 'spring',
    isAiGenerated: false,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    thumbnail: '',
    wearCount: 0,
    isFavorite: false,
    tags: [],
    userId: '1',
    likes: 0,
    isPublic: false,
  },
];

const CalendarPage: React.FC = () => {
  const [outfits] = useState<Outfit[]>(mockOutfits);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showAddOutfitModal, setShowAddOutfitModal] = useState(false);
  const [viewingOutfit, setViewingOutfit] = useState<Outfit | null>(null);

  // 月度统计数据
  const monthlyStats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthOutfits = outfits.filter(outfit => {
      const outfitDate = new Date(outfit.createdAt);
      return outfitDate.getMonth() === currentMonth && outfitDate.getFullYear() === currentYear;
    });
    
    // 计算风格分布
    const styleDistribution = monthOutfits.reduce((acc, outfit) => {
      acc[outfit.style] = (acc[outfit.style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // 计算场合分布
    const occasionDistribution = monthOutfits.reduce((acc, outfit) => {
      acc[outfit.occasion] = (acc[outfit.occasion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalOutfits: monthOutfits.length,
      styleDistribution,
      occasionDistribution,
    };
  }, [outfits]);

  // 处理添加穿搭
  const handleAddOutfit = (date: string) => {
    setSelectedDate(date);
    setShowAddOutfitModal(true);
  };

  // 处理查看穿搭
  const handleViewOutfit = (outfit: Outfit) => {
    setViewingOutfit(outfit);
  };

  // 关闭模态框
  const closeModal = () => {
    setShowAddOutfitModal(false);
    setViewingOutfit(null);
  };

  // 确认添加穿搭
  const confirmAddOutfit = () => {
    // 这里可以实现添加穿搭的逻辑
    setShowAddOutfitModal(false);
  };

  return (
    <div className="calendar-page">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center">穿搭日历与日程规划</h1>
          <button
            type="button"
            className="w-11 h-11 rounded-full border border-gray-200 bg-white shadow-sm text-2xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'prompts' } }))}
            title="AI提示词"
          >
            💡
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 日历视图 */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <Calendar 
              outfits={outfits} 
              onAddOutfit={handleAddOutfit} 
              onViewOutfit={handleViewOutfit} 
            />
          </div>
          
          {/* 月度统计 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">月度统计</h3>
            
            <div className="space-y-4">
              {/* 总穿搭次数 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">总穿搭次数</p>
                <p className="text-2xl font-bold">{monthlyStats.totalOutfits}</p>
              </div>
              
              {/* 风格分布 */}
              <div>
                <p className="text-sm text-gray-600 mb-2">风格分布</p>
                <div className="space-y-2">
                  {Object.entries(monthlyStats.styleDistribution).map(([style, count]) => (
                    <div key={style} className="flex justify-between items-center">
                      <span className="text-sm">
                        {style === 'minimalist' ? '简约' : 
                         style === 'casual' ? '休闲' : 
                         style === 'business' ? '商务' : 
                         style === 'sweet' ? '甜美' : 
                         style === 'edgy' ? '酷感' : style}
                      </span>
                      <span className="text-sm font-medium">{count}次</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 场合分布 */}
              <div>
                <p className="text-sm text-gray-600 mb-2">场合分布</p>
                <div className="space-y-2">
                  {Object.entries(monthlyStats.occasionDistribution).map(([occasion, count]) => (
                    <div key={occasion} className="flex justify-between items-center">
                      <span className="text-sm">
                        {occasion === 'commute' ? '通勤' : 
                         occasion === 'date' ? '约会' : 
                         occasion === 'sport' ? '运动' : 
                         occasion === 'party' ? '聚会' : '休闲'}
                      </span>
                      <span className="text-sm font-medium">{count}次</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 穿搭勋章 */}
              <div>
                <p className="text-sm text-gray-600 mb-2">穿搭勋章</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-yellow-100 p-3 rounded-lg text-center">
                    <div className="text-yellow-500 text-2xl mb-1">🏆</div>
                    <p className="text-xs">穿搭达人</p>
                    <p className="text-xs text-gray-500">{monthlyStats.totalOutfits}/20</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg text-center">
                    <div className="text-blue-500 text-2xl mb-1">🌟</div>
                    <p className="text-xs">风格多变</p>
                    <p className="text-xs text-gray-500">{Object.keys(monthlyStats.styleDistribution).length}/3</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg text-center">
                    <div className="text-green-500 text-2xl mb-1">📅</div>
                    <p className="text-xs">坚持打卡</p>
                    <p className="text-xs text-gray-500">{monthlyStats.totalOutfits}/15</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 添加穿搭模态框 */}
        {showAddOutfitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">添加穿搭计划</h3>
              <p className="text-sm text-gray-600 mb-4">日期: {selectedDate}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">穿搭名称</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="输入穿搭名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">场合</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="commute">通勤</option>
                    <option value="date">约会</option>
                    <option value="sport">运动</option>
                    <option value="party">聚会</option>
                    <option value="casual">休闲</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">风格</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="minimalist">简约</option>
                    <option value="casual">休闲</option>
                    <option value="business">商务</option>
                    <option value="sweet">甜美</option>
                    <option value="edgy">酷感</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  取消
                </button>
                <button 
                  onClick={confirmAddOutfit}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 查看穿搭模态框 */}
        {viewingOutfit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">{viewingOutfit.name}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">场合:</span>
                  <span>{viewingOutfit.occasion === 'commute' ? '通勤' : viewingOutfit.occasion === 'date' ? '约会' : viewingOutfit.occasion === 'sport' ? '运动' : viewingOutfit.occasion === 'party' ? '聚会' : '休闲'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">风格:</span>
                  <span>{viewingOutfit.style === 'minimalist' ? '简约' : viewingOutfit.style === 'casual' ? '休闲' : viewingOutfit.style === 'business' ? '商务' : viewingOutfit.style === 'sweet' ? '甜美' : viewingOutfit.style === 'edgy' ? '酷感' : viewingOutfit.style}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">温度:</span>
                  <span>{viewingOutfit.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">天气:</span>
                  <span>{viewingOutfit.weather?.condition === 'sunny' ? '晴天' : viewingOutfit.weather?.condition === 'cloudy' ? '多云' : viewingOutfit.weather?.condition === 'rainy' ? '雨天' : viewingOutfit.weather?.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">季节:</span>
                  <span>{viewingOutfit.season === 'spring' ? '春季' : viewingOutfit.season === 'summer' ? '夏季' : viewingOutfit.season === 'autumn' ? '秋季' : viewingOutfit.season === 'winter' ? '冬季' : '全年'}</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;