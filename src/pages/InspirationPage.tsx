import React, { useState, useEffect } from 'react';
import TrendCard from '../components/TrendCard';
import InspirationItemCard from '../components/InspirationItemCard';
import TutorialCard from '../components/TutorialCard';
import type { Trend, Inspiration, Tutorial } from '../types';
import './InspirationPage.css';

const InspirationPage: React.FC = () => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [activeTab, setActiveTab] = useState<'trends' | 'inspiration' | 'tutorials'>('trends');

  // 模拟数据
  useEffect(() => {
    // 模拟热门趋势数据
    const mockTrends: Trend[] = [
      {
        id: '1',
        title: '2024春夏流行色',
        description: '探索本季最热门的颜色趋势',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=2024%20spring%20summer%20fashion%20trends%20colors&size=800x600',
        tags: ['流行色', '春夏', '2024'],
        likes: 1280,
        saves: 890
      },
      {
        id: '2',
        title: '极简主义穿搭',
        description: '少即是多的时尚哲学',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=minimalist%20fashion%20outfit&size=800x600',
        tags: ['极简', '休闲', '百搭'],
        likes: 950,
        saves: 620
      },
      {
        id: '3',
        title: '复古风回归',
        description: '90年代风格重新流行',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=90s%20retro%20fashion%20trend&size=800x600',
        tags: ['复古', '90年代', '潮流'],
        likes: 1560,
        saves: 1020
      }
    ];

    // 模拟灵感库数据
    const mockInspirations: Inspiration[] = [
      {
        id: '1',
        title: '通勤穿搭灵感',
        description: '适合办公室的优雅穿搭',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=office%20workwear%20inspiration&size=800x600',
        style: '通勤',
        occasion: 'office',
        bodyType: '沙漏形',
        likes: 890,
        saves: 560
      },
      {
        id: '2',
        title: '约会穿搭灵感',
        description: '浪漫约会的完美搭配',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=date%20outfit%20inspiration&size=800x600',
        style: '甜美',
        occasion: 'date',
        bodyType: '梨形',
        likes: 1230,
        saves: 890
      },
      {
        id: '3',
        title: '休闲穿搭灵感',
        description: '周末放松的舒适搭配',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=casual%20weekend%20outfit&size=800x600',
        style: '休闲',
        occasion: 'casual',
        bodyType: 'H型',
        likes: 760,
        saves: 430
      }
    ];

    // 模拟穿搭教程数据
    const mockTutorials: Tutorial[] = [
      {
        id: '1',
        title: '春季单品搭配技巧',
        description: '掌握春季必备单品的搭配方法，轻松打造时尚造型',
        category: '搭配技巧',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=spring%20fashion%20outfit%20tutorial&size=800x600',
        views: 1245
      },
      {
        id: '2',
        title: '梨形身材穿搭避坑指南',
        description: '针对梨形身材的穿搭建议，扬长避短展现完美比例',
        category: '身材穿搭',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=pear%20shape%20body%20fashion%20tips&size=800x600',
        views: 892
      },
      {
        id: '3',
        title: '色彩搭配基础法则',
        description: '学习色彩搭配的基本原则，让你的穿搭更加和谐美观',
        category: '搭配技巧',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=color%20matching%20fashion%20guide&size=800x600',
        views: 1567
      },
      {
        id: '4',
        title: '职场穿搭误区大盘点',
        description: '避免职场穿搭常见误区，打造专业又时尚的职场形象',
        category: '穿搭误区',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=office%20fashion%20dos%20and%20donts&size=800x600',
        views: 987
      }
    ];

    setTrends(mockTrends);
    setInspirations(mockInspirations);
    setTutorials(mockTutorials);
  }, []);

  return (
    <div className="inspiration-page">
      <div className="header">
        <div className="header-row">
          <h1 className="text-xl font-bold text-gray-800 mb-6">穿搭灵感</h1>
          <button
            type="button"
            className="prompt-btn"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'prompts' } }))}
            title="AI提示词"
          >
            💡
          </button>
        </div>
        <div className="tabs flex border-b">
          <button 
            className={`flex-1 py-2 text-center ${activeTab === 'trends' ? 'text-pink-500 border-b-2 border-pink-500 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('trends')}
          >
            热门趋势
          </button>
          <button 
            className={`flex-1 py-2 text-center ${activeTab === 'inspiration' ? 'text-pink-500 border-b-2 border-pink-500 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('inspiration')}
          >
            灵感库
          </button>
          <button 
            className={`flex-1 py-2 text-center ${activeTab === 'tutorials' ? 'text-pink-500 border-b-2 border-pink-500 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('tutorials')}
          >
            穿搭教程
          </button>
        </div>
      </div>

      <div className="content">
        {activeTab === 'trends' && (
          <div className="trends-section">
            <div className="section-header flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">当季热门趋势</h2>
              <button className="text-sm text-pink-500">查看更多</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {trends.map((trend) => (
                <TrendCard key={trend.id} trend={trend} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inspiration' && (
          <div className="inspiration-section">
            <div className="section-header flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">穿搭灵感库</h2>
              <div className="filters flex space-x-2">
                <select className="text-sm border rounded-full px-2 py-1">
                  <option>全部风格</option>
                  <option>甜酷风</option>
                  <option>休闲风</option>
                  <option>通勤风</option>
                </select>
                <select className="text-sm border rounded-full px-2 py-1">
                  <option>全部场景</option>
                  <option>通勤</option>
                  <option>约会</option>
                  <option>休闲</option>
                </select>
                <select className="text-sm border rounded-full px-2 py-1">
                  <option>全部身材</option>
                  <option>梨形</option>
                  <option>沙漏形</option>
                  <option>苹果形</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {inspirations.map((inspiration) => (
                <InspirationItemCard key={inspiration.id} inspiration={inspiration} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tutorials' && (
          <div className="tutorials-section">
            <div className="section-header flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">穿搭教程</h2>
              <button className="text-sm text-pink-500">查看更多</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {tutorials.map((tutorial) => (
                <TutorialCard 
                  key={tutorial.id}
                  id={tutorial.id}
                  title={tutorial.title}
                  description={tutorial.description}
                  category={tutorial.category}
                  imageUrl={tutorial.imageUrl}
                  views={tutorial.views}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspirationPage;