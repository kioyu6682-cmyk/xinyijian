import React, { useMemo } from 'react';
import { BackIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { useWardrobeContext } from '../context/WardrobeContext';
import './StyleDetailPage.css';

interface Props {
  onBack: () => void;
}

export const StyleDetailPage: React.FC<Props> = ({ onBack }) => {
  const { user } = useAuth();
  const { items, stats } = useWardrobeContext();

  const styleTags = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      item.style?.forEach(s => {
        const key = typeof s === 'string' ? s : '';
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [items]);

  const topColors = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item.color] = (counts[item.color] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [items]);

  const sleepingCount = useMemo(() =>
    items.filter(i => {
      if (!i.lastWorn) return true;
      return (Date.now() - i.lastWorn.getTime()) / (1000 * 60 * 60 * 24) > 30;
    }).length,
  [items]);

  return (
    <div className="style-detail-page">
      <header className="detail-page-header">
        <button className="detail-page-back" onClick={onBack}>
          <BackIcon size={20} /> 我的
        </button>
      </header>

      <div className="style-hero">
        <div className="style-hero-avatar">{user?.avatarEmoji || '👤'}</div>
        <h1 className="style-hero-name">{user?.nickname || '游客'}</h1>
        <p className="style-hero-sub">穿搭风格报告</p>
      </div>

      <div className="style-stats-row">
        <div className="style-stat">
          <span className="style-stat-num">{items.length}</span>
          <span className="style-stat-label">单品数</span>
        </div>
        <div className="style-stat">
          <span className="style-stat-num">{Math.round(stats.utilizationRate * 100)}%</span>
          <span className="style-stat-label">利用率</span>
        </div>
        <div className="style-stat">
          <span className="style-stat-num">{Math.round(stats.totalValue / 1000)}k</span>
          <span className="style-stat-label">衣橱价值</span>
        </div>
        <div className="style-stat">
          <span className="style-stat-num">{sleepingCount}</span>
          <span className="style-stat-label">沉睡单品</span>
        </div>
      </div>

      {styleTags.length > 0 && (
        <section className="detail-section">
          <h2 className="detail-section-title">衣橱风格分布</h2>
          <div className="style-distribution">
            {styleTags.map(([style, count]) => (
              <div key={style} className="style-dist-row">
                <span className="style-dist-label">{style}</span>
                <div className="style-dist-track">
                  <div
                    className="style-dist-fill"
                    style={{ width: `${(count / items.length) * 100}%` }}
                  />
                </div>
                <span className="style-dist-count">{count}件</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {topColors.length > 0 && (
        <section className="detail-section">
          <h2 className="detail-section-title">常用颜色</h2>
          <div className="style-colors">
            {topColors.map(([color, count]) => (
              <span key={color} className="style-color-chip">{color} · {count}件</span>
            ))}
          </div>
        </section>
      )}

      <section className="detail-section">
        <h2 className="detail-section-title">穿搭建议</h2>
        <div className="style-suggestions">
          {sleepingCount > 0 && (
            <div className="style-suggestion">
              <span className="style-sug-icon">💤</span>
              <p>你有 <strong>{sleepingCount}</strong> 件单品超过30天未穿着，试试重新发现它们。</p>
            </div>
          )}
          {stats.utilizationRate < 0.7 && (
            <div className="style-suggestion">
              <span className="style-sug-icon">📈</span>
              <p>衣橱利用率偏低，尝试用现有单品创造新的搭配组合。</p>
            </div>
          )}
          <div className="style-suggestion">
            <span className="style-sug-icon">🎯</span>
            <p>每月尝试一种新风格，拓展穿搭边界。</p>
          </div>
        </div>
      </section>

      <div className="detail-bottom-actions">
        <button className="btn-secondary" onClick={onBack}>返回</button>
      </div>
    </div>
  );
};
