import React from 'react';
import { BackIcon } from '../components/Icons';
import './EcoDetailPage.css';

interface Props {
  onBack: () => void;
}

interface EcoEntry {
  label: string;
  value: string;
  unit: string;
  icon: string;
  detail: string;
}

const ECO_DATA: EcoEntry[] = [
  { label: '少购替代碳排', value: '12.5', unit: 'kg', icon: '🌱', detail: '通过复用现有搭配替代新购产生的碳排放节约量，相当于驾车 62 公里的排放量。' },
  { label: '节水', value: '2,100', unit: 'L', icon: '💧', detail: '减少因生产新衣物所消耗的水资源。约等于 70 次淋浴用水量。' },
  { label: '减少包装废弃物', value: '1.2', unit: 'kg', icon: '♻️', detail: '避免因购买新衣产生的塑料、纸箱等包装废弃物。' },
  { label: '少买快时尚', value: '3', unit: '件', icon: '👕', detail: '通过衣橱重组替代冲动消费，本月少购入约 3 件快时尚单品。' },
];

export const EcoDetailPage: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="eco-detail-page">
      <header className="detail-page-header">
        <button className="detail-page-back" onClick={onBack}>
          <BackIcon size={20} /> 首页
        </button>
      </header>

      <div className="eco-hero">
        <div className="eco-hero-icon">🌍</div>
        <h1 className="eco-hero-title">环保足迹</h1>
        <p className="eco-hero-sub">本月通过衣橱复用减少的环境影响</p>
        <div className="eco-hero-total">
          <span className="eco-hero-num">12.5</span>
          <span className="eco-hero-unit">kg CO₂</span>
        </div>
        <p className="eco-hero-desc">相当于驾车 62 公里的碳排放量</p>
      </div>

      <section className="detail-section">
        <h2 className="detail-section-title">详细数据</h2>
        <div className="eco-list">
          {ECO_DATA.map((entry, i) => (
            <div key={i} className="eco-card-item">
              <div className="eco-card-header">
                <span className="eco-card-icon">{entry.icon}</span>
                <div className="eco-card-info">
                  <span className="eco-card-label">{entry.label}</span>
                  <span className="eco-card-value">
                    {entry.value} <small>{entry.unit}</small>
                  </span>
                </div>
              </div>
              <p className="eco-card-detail">{entry.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h2 className="detail-section-title">环保小贴士</h2>
        <div className="eco-tips">
          <div className="eco-tip">
            <span className="eco-tip-icon">🔄</span>
            <p>每次穿着前先检查衣橱，尝试新的搭配组合再决定是否购买新衣</p>
          </div>
          <div className="eco-tip">
            <span className="eco-tip-icon">🧹</span>
            <p>定期整理衣橱，发现沉睡单品并重新纳入日常搭配</p>
          </div>
          <div className="eco-tip">
            <span className="eco-tip-icon">🤝</span>
            <p>参与社区衣物漂流瓶，让闲置衣物找到新的主人</p>
          </div>
        </div>
      </section>

      <div className="detail-bottom-actions">
        <button className="btn-secondary" onClick={onBack}>返回</button>
      </div>
    </div>
  );
};
