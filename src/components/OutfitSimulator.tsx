import React, { useState } from 'react';
import type { Outfit, BodyData, ClothingItem } from '../types';

interface OutfitSimulatorProps {
  outfit: Outfit;
  items: ClothingItem[];
  bodyData?: BodyData;
}

const OutfitSimulator: React.FC<OutfitSimulatorProps> = ({ outfit, items, bodyData }) => {
  const [lighting, setLighting] = useState<'natural' | 'office' | 'evening'>('natural');
  const [scene, setScene] = useState<'office' | 'date' | 'outdoor'>('office');

  // 根据身材数据计算人体模型比例
  const getBodyRatio = () => {
    if (!bodyData) return { width: '100%', height: '100%' };
    
    // 简单的比例计算，实际应用中可能需要更复杂的算法
    const height = bodyData.height || 160;
    const weight = bodyData.weight || 100;
    const bmi = (weight * 0.5) / (height / 100) ** 2; // 转换为kg和m
    
    let widthRatio = 1;
    if (bmi < 18.5) widthRatio = 0.8;
    if (bmi >= 24 && bmi < 28) widthRatio = 1.1;
    if (bmi >= 28) widthRatio = 1.3;
    
    return {
      width: `${widthRatio * 100}%`,
      height: '100%',
    };
  };

  // 获取搭配中的单品
  const outfitItems = outfit.items
    .map(item => items.find(i => i.id === item.itemId))
    .filter(Boolean) as ClothingItem[];

  return (
    <div className="outfit-simulator">
      <h3 className="text-lg font-semibold mb-4">穿搭效果模拟</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 控制面板 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">光线效果</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setLighting('natural')}
                className={`px-3 py-1 rounded-lg ${lighting === 'natural' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
              >
                自然光
              </button>
              <button
                onClick={() => setLighting('office')}
                className={`px-3 py-1 rounded-lg ${lighting === 'office' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
              >
                办公室
              </button>
              <button
                onClick={() => setLighting('evening')}
                className={`px-3 py-1 rounded-lg ${lighting === 'evening' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
              >
                夜晚
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">场景</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setScene('office')}
                className={`px-3 py-1 rounded-lg ${scene === 'office' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
              >
                办公室
              </button>
              <button
                onClick={() => setScene('date')}
                className={`px-3 py-1 rounded-lg ${scene === 'date' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
              >
                约会
              </button>
              <button
                onClick={() => setScene('outdoor')}
                className={`px-3 py-1 rounded-lg ${scene === 'outdoor' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
              >
                户外
              </button>
            </div>
          </div>
          
          {/* 身材数据展示 */}
          {bodyData && (
            <div className="bg-gray-100 p-3 rounded-lg">
              <h4 className="font-medium mb-2">身材数据</h4>
              <div className="space-y-1 text-sm">
                <p>身高: {bodyData.height} cm</p>
                <p>体重: {bodyData.weight} 斤</p>
                <p>身材类型: {bodyData.bodyType === 'hourglass' ? '沙漏形' : bodyData.bodyType === 'pear' ? '梨形' : bodyData.bodyType === 'apple' ? '苹果形' : bodyData.bodyType === 'rectangle' ? '矩形' : '倒三角形'}</p>
                {bodyData.bust && <p>胸围: {bodyData.bust} cm</p>}
                {bodyData.waist && <p>腰围: {bodyData.waist} cm</p>}
                {bodyData.hips && <p>臀围: {bodyData.hips} cm</p>}
              </div>
            </div>
          )}
        </div>
        
        {/* 穿搭效果展示 */}
        <div className="md:col-span-2">
          <div 
            className={`relative w-full h-[400px] border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${lighting === 'natural' ? 'bg-blue-50' : lighting === 'office' ? 'bg-yellow-50' : 'bg-indigo-900'}`}
          >
            {/* 场景背景 */}
            <div className="absolute inset-0 opacity-30">
              {scene === 'office' && (
                <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="w-3/4 h-1/2 bg-white rounded-lg shadow-md"></div>
                </div>
              )}
              {scene === 'date' && (
                <div className="w-full h-full bg-gradient-to-b from-pink-100 to-pink-200 flex items-center justify-center">
                  <div className="w-1/3 h-1/3 bg-pink-300 rounded-full"></div>
                </div>
              )}
              {scene === 'outdoor' && (
                <div className="w-full h-full bg-gradient-to-b from-blue-300 to-green-200 flex items-end justify-center">
                  <div className="w-full h-1/2 bg-green-400"></div>
                </div>
              )}
            </div>
            
            {/* 人体模型 */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={getBodyRatio()}
            >
              {/* 头部 */}
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
              
              {/* 身体 */}
              <div className="w-24 h-40 bg-gray-200 rounded-t-full relative">
                {/* 穿搭单品 */}
                {outfitItems.map((item, index) => (
                  <div 
                    key={item.id}
                    className="absolute inset-0 rounded-t-full opacity-80"
                    style={{
                      backgroundColor: item.color,
                      zIndex: index + 1,
                      transform: `scale(${1 - index * 0.1})`,
                    }}
                  />
                ))}
              </div>
              
              {/* 腿部 */}
              <div className="flex space-x-4">
                <div className="w-8 h-32 bg-gray-200 rounded-b-full"></div>
                <div className="w-8 h-32 bg-gray-200 rounded-b-full"></div>
              </div>
            </div>
          </div>
          
          {/* 穿搭信息 */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">穿搭信息</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 p-2 rounded-lg">
                <p className="text-sm font-medium">场合</p>
                <p>{outfit.occasion === 'commute' ? '通勤' : outfit.occasion === 'date' ? '约会' : outfit.occasion === 'sport' ? '运动' : outfit.occasion === 'party' ? '聚会' : '休闲'}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <p className="text-sm font-medium">风格</p>
                <p>{outfit.style === 'minimalist' ? '简约' : outfit.style === 'casual' ? '休闲' : outfit.style === 'business' ? '商务' : outfit.style === 'sweet' ? '甜美' : outfit.style === 'edgy' ? '酷感' : '其他'}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <p className="text-sm font-medium">温度</p>
                <p>{outfit.temperature}°C</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <p className="text-sm font-medium">季节</p>
                <p>{outfit.season === 'spring' ? '春季' : outfit.season === 'summer' ? '夏季' : outfit.season === 'autumn' ? '秋季' : outfit.season === 'winter' ? '冬季' : '全年'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitSimulator;