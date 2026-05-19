import React, { useState, useEffect } from 'react';
import { aiService } from '../services/ai';
import type { Outfit, ClothingItem, OutfitRating as OutfitRatingType, BodyData } from '../types';

interface OutfitRatingProps {
  outfit: Outfit;
  items: ClothingItem[];
  bodyType?: string;
}

const OutfitRating: React.FC<OutfitRatingProps> = ({ outfit, items, bodyType }) => {
  const [rating, setRating] = useState<OutfitRatingType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [styleTags, setStyleTags] = useState<string[]>([]);

  useEffect(() => {
    // 生成穿搭评分
    const generateRating = async () => {
      setIsLoading(true);
      try {
        const bodyData: BodyData | undefined = bodyType ? {
          height: 0,
          weight: 0,
          bodyType: bodyType as BodyData['bodyType'],
        } : undefined;
        
        const result = await aiService.rateOutfit(outfit, items, bodyData);
        setRating({
          ...result,
          id: '',
          outfitId: outfit.id,
          userId: '',
          createdAt: new Date(),
        });
        
        // 生成风格标签
        const diagnosis = await aiService.generateStyleDiagnosis(items, [outfit]);
        setStyleTags(diagnosis.styleTags);
      } catch (error) {
        console.error('生成评分失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateRating();
  }, [outfit, items, bodyType]);

  // 计算总评分
  const getTotalScore = () => {
    if (!rating) return 0;
    return Math.round((rating.colorScore + rating.styleScore + rating.occasionScore + rating.bodyFitScore) / 4);
  };

  // 获取评分等级
  const getScoreLevel = (score: number) => {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '一般';
    return '需要改进';
  };

  // 获取评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return <div className="loading">评分中...</div>;
  }

  return (
    <div className="outfit-rating">
      <h3 className="text-lg font-semibold mb-4">穿搭评分与风格诊断</h3>
      
      {/* 总评分 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center">
        <p className="text-sm text-gray-600 mb-2">总评分</p>
        <div className="text-4xl font-bold mb-2 {getScoreColor(getTotalScore())}">
          {getTotalScore()}
        </div>
        <p className="text-sm {getScoreColor(getTotalScore())}">
          {getScoreLevel(getTotalScore())}
        </p>
      </div>
      
      {/* 维度评分 */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">色彩搭配</span>
            <span className={`text-sm ${getScoreColor(rating?.colorScore || 0)}`}>
              {rating?.colorScore || 0}分
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getScoreColor(rating?.colorScore || 0)}`}
              style={{ width: `${(rating?.colorScore || 0)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">风格统一</span>
            <span className={`text-sm ${getScoreColor(rating?.styleScore || 0)}`}>
              {rating?.styleScore || 0}分
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getScoreColor(rating?.styleScore || 0)}`}
              style={{ width: `${(rating?.styleScore || 0)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">场景适配</span>
            <span className={`text-sm ${getScoreColor(rating?.occasionScore || 0)}`}>
              {rating?.occasionScore || 0}分
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getScoreColor(rating?.occasionScore || 0)}`}
              style={{ width: `${(rating?.occasionScore || 0)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">身材适配</span>
            <span className={`text-sm ${getScoreColor(rating?.bodyFitScore || 0)}`}>
              {rating?.bodyFitScore || 0}分
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getScoreColor(rating?.bodyFitScore || 0)}`}
              style={{ width: `${(rating?.bodyFitScore || 0)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* 优化建议 */}
      {rating?.suggestions && rating.suggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">优化建议</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {rating.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* 风格标签 */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">风格标签</h4>
        <div className="flex flex-wrap gap-2">
          {styleTags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* 穿搭挑战 */}
      <div>
        <h4 className="font-medium mb-3">穿搭挑战</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-500 text-2xl mb-2">📅</div>
            <h5 className="font-medium mb-1">7天风格挑战</h5>
            <p className="text-xs text-gray-600">连续7天尝试不同风格，解锁专属勋章</p>
            <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-xs">
              开始挑战
            </button>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-500 text-2xl mb-2">🎯</div>
            <h5 className="font-medium mb-1">场景穿搭挑战</h5>
            <p className="text-xs text-gray-600">为不同场景准备穿搭，提升搭配能力</p>
            <button className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg text-xs">
              开始挑战
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitRating;