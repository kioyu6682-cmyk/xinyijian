import React from 'react';
import type { WeatherCondition } from '../types';
import './TodayCard.css';

export interface TodayOutfitPiece {
  id: string;
  name: string;
  thumbnail: string;
}

interface TodayCardProps {
  weather: WeatherCondition;
  pieces: TodayOutfitPiece[];
  onConfirm: () => void;
  onAdjust: () => void;
  onOpenDetail?: () => void;
  children?: React.ReactNode;
}

export const TodayCard: React.FC<TodayCardProps> = ({
  weather,
  pieces,
  onConfirm,
  onAdjust,
  onOpenDetail,
  children,
}) => {
  const conditionZh: Record<string, string> = {
    sunny: '晴',
    cloudy: '多云',
    rainy: '微雨',
    snowy: '雪',
    windy: '大风',
    foggy: '雾',
    stormy: '暴雨',
  };

  const getWeatherIcon = (condition: string) => {
    const icons: Record<string, string> = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      snowy: '❄️',
      windy: '💨',
      stormy: '⛈️',
      foggy: '🌫️',
    };
    return icons[condition] || '🌤️';
  };

  return (
    <article className="today-card today-card--interactive" onClick={onOpenDetail} role="region" aria-label="今日着装">
      <div className="today-card__top">
        <div className="weather-badge">
          <span className="weather-icon" aria-hidden>
            {getWeatherIcon(weather.condition)}
          </span>
          <span>
            {weather.temperature}°C {conditionZh[weather.condition] ?? weather.condition}
          </span>
          <span className="weather-loc">· {weather.location}</span>
        </div>
        <span className="today-card__hint">{onOpenDetail ? '点按调整单品' : ''}</span>
      </div>

      <h2 className="today-title">今日着装</h2>
      {children}

      <div className="ar-preview">
        <div className="avatar-3d" aria-hidden>
          <div className="avatar-3d__ring" />
          <span className="avatar-3d__emoji">👩</span>
        </div>
        <div className="outfit-items">
          {pieces.map((p) => (
            <span key={p.id} className="outfit-item-tag">
              <span className="outfit-item-tag__emoji">{p.thumbnail}</span>
              {p.name}
            </span>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button type="button" className="btn btn-primary" onClick={(e) => { e.stopPropagation(); onConfirm(); }}>
          确认穿搭
        </button>
        <button type="button" className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); onAdjust(); }}>
          调整搭配
        </button>
      </div>
    </article>
  );
};
