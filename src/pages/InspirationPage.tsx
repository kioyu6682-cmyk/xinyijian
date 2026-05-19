import React, { useState, useEffect } from 'react';
import TrendCard from '../components/TrendCard';
import InspirationItemCard from '../components/InspirationItemCard';
import TutorialCard from '../components/TutorialCard';
import type { StyleTrend, Inspiration, StyleTutorial } from '../types';
import './InspirationPage.css';

const InspirationPage: React.FC = () => {
  const [trends, setTrends] = useState<StyleTrend[]>([]);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [tutorials, setTutorials] = useState<StyleTutorial[]>([]);
  const [activeTab, setActiveTab] = useState<'trends' | 'inspiration' | 'tutorials'>('trends');

  // 模拟数据
  useEffect(() => {
    // 模拟热门趋势数据
    const mockTrends: StyleTrend[] = [
      {
        id: '1',
        title: '2024春夏流行色',
        description: '探索本季最热门的颜色趋势',
        category: '流行趋势',
        images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=2024%20spring%20summer%20fashion%20trends%20colors&size=800x600'],
        outfits: [],
        popularity: 1280,
        source: '时尚杂志',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: '极简主义穿搭',
        description: '少即是多的时尚哲学',
        category: '风格',
        images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=minimalist%20fashion%20outfit&size=800x600'],
        outfits: [],
        popularity: 950,
        source: '时尚杂志',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        title: '复古风回归',
        description: '90年代风格重新流行',
        category: '流行趋势',
        images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=90s%20retro%20fashion%20trend&size=800x600'],
        outfits: [],
        popularity: 1560,
        source: '时尚杂志',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // 模拟灵感库数据
    const mockInspirations: Inspiration[] = [
      {
        id: '1',
        title: '通勤穿搭灵感',
        description: '适合办公室的优雅穿搭',
        images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=office%20workwear%20inspiration&size=800x600'],
        style: ['business'],
        occasion: ['commute'],
        bodyType: ['hourglass'],
        outfits: [],
        isSaved: false,
        createdAt: new Date(),
      },
      {
        id: '2',
        title: '约会穿搭灵感',
        description: '浪漫约会的完美搭配',
        images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=date%20outfit%20inspiration&size=800x600'],
        style: ['sweet'],
        occasion: ['date'],
        bodyType: ['pear'],
        outfits: [],
        isSaved: false,
        createdAt: new Date(),
      },
      {
        id: '3',
        title: '休闲穿搭灵感',
        description: '周末放松的舒适搭配',
        images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=casual%20weekend%20outfit&size=800x600'],
        style: ['casual'],
        occasion: ['home'],
        bodyType: ['rectangle'],
        outfits: [],
        isSaved: false,
        createdAt: new Date(),
      }
    ];

    // 模拟穿搭教程数据
    const mockTutorials: StyleTutorial[] = [
      {
        id: '1',
        title: '春季单品搭配技巧',
        description: '掌握春季必备单品的搭配方法，轻松打造时尚造型',
        category: '搭配技巧',
        content: '教程内容',
        images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=spring%20fashion%20outfit%20tutorial&size=800x600'],
        difficulty: 'beginner',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: '梨形身材穿搭避坑指南',
        description: '针对梨形身材的穿搭建议，扬长避短展现完美比例',
        category: '身材穿搭',
        content: '教程内容',
        images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=pear%20shape%20body%20fashion%20tips&size=800x600'],
        difficulty: 'intermediate',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    setTrends(mockTrends);
    setInspirations(mockInspirations);
    setTutorials(mockTutorials);
  }, []);

  return (
    <div className="inspiration-page">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">灵感与趋势</h1>
        
        {/* 标签切换 */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'trends' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('trends')}
          >
            热门趋势
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'inspiration' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('inspiration')}
          >
            灵感库
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'tutorials' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('tutorials')}
          >
            穿搭教程
          </button>
        </div>

        {/* 内容区域 */}
        {activeTab === 'trends' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trends.map(trend => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        )}

        {activeTab === 'inspiration' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirations.map(inspiration => (
              <InspirationItemCard key={inspiration.id} inspiration={inspiration} />
            ))}
          </div>
        )}

        {activeTab === 'tutorials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map(tutorial => (
              <TutorialCard 
                key={tutorial.id} 
                id={tutorial.id}
                title={tutorial.title}
                description={tutorial.description}
                category={tutorial.category}
                imageUrl={tutorial.images[0] || ''}
                views={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InspirationPage;