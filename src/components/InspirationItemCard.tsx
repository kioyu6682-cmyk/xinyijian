import React from 'react';
import type { Inspiration } from '../types';

interface InspirationItemCardProps {
  inspiration: Inspiration;
}

const InspirationItemCard: React.FC<InspirationItemCardProps> = ({ inspiration }) => {
  const getOccasionLabel = (occasion: string) => {
    const occasionMap: Record<string, string> = {
      commute: '通勤',
      date: '约会',
      party: '聚会',
      sport: '运动',
      travel: '旅行',
      home: '居家',
      interview: '面试',
    };
    return occasionMap[occasion] || occasion;
  };

  const getBodyTypeLabel = (bodyType: string) => {
    const bodyTypeMap: Record<string, string> = {
      hourglass: '沙漏形',
      pear: '梨形',
      apple: '苹果形',
      rectangle: '矩形',
      'inverted-triangle': '倒三角',
    };
    return bodyTypeMap[bodyType] || bodyType;
  };

  return (
    <div className="inspiration-card bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative">
        <img 
          src={inspiration.images[0] || 'https://neeko-copilot.bytedance.net/api/text2image?prompt=fashion%20outfit%20inspiration%20elegant%20minimalist&size=600x400'} 
          alt={inspiration.title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <button className="bg-white bg-opacity-80 rounded-full p-1 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button className="bg-white bg-opacity-80 rounded-full p-1 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1">{inspiration.title}</h3>
        <p className="text-xs text-gray-600 mb-2">{inspiration.description}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
            {inspiration.style[0]}
          </span>
          {inspiration.occasion[0] && (
            <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs">
              {getOccasionLabel(inspiration.occasion[0])}
            </span>
          )}
          {inspiration.bodyType[0] && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">
              {getBodyTypeLabel(inspiration.bodyType[0])}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex space-x-3">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              128
            </span>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              56
            </span>
          </div>
          <button className="px-2 py-1 bg-pink-500 text-white rounded-full text-xs">
            查看详情
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspirationItemCard;