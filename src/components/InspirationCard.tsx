// src/components/InspirationCard.tsx
import React from 'react';
import { AIRecommendation } from '../types';
import './InspirationCard.css';

interface InspirationCardProps {
  recommendation: AIRecommendation;
  onClick: () => void;
}

export const InspirationCard: React.FC<InspirationCardProps> = ({
  recommendation,
  onClick
}) => {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      'new-item': { text: '新衣搭配', color: '#FF7675' },
      'sleeping-item': { text: '衣橱提醒', color: '#FDCB6E' },
      'challenge': { text: '社区挑战', color: '#00B894' },
      'style-discovery': { text: '风格盲盒', color: '#A29BFE' },
    };
    return labels[type] || { text: '推荐', color: '#74B9FF' };
  };

  const typeInfo = getTypeLabel(recommendation.type);

  return (
    <div className="inspiration-card" onClick={onClick}>
      <div 
        className="inspiration-type" 
        style={{ color: typeInfo.color }}
      >
        {typeInfo.text}
      </div>
      <h3 className="inspiration-title">{recommendation.title}</h3>
      <p className="inspiration-desc">{recommendation.description}</p>
      <div className="inspiration-image">
        {recommendation.type === 'new-item' && '👖✨'}
        {recommendation.type === 'sleeping-item' && '👔💫'}
        {recommendation.type === 'challenge' && '🏆🎨'}
        {recommendation.type === 'style-discovery' && '🎲🌟'}
      </div>
    </div>
  );
};
