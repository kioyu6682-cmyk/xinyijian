import React, { useMemo, useState } from 'react';
import type { ClothingCategory } from '../types';
import { ClothesGrid } from '../components/ClothesGrid';
import { useWardrobeContext } from '../context/WardrobeContext';
import { formatPrice, daysBetween } from '../utils';
import './WardrobePage.css';

type ViewMode = 'grid' | 'timeline' | 'value';

const CAT_FILTER: { id: ClothingCategory | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'tops', label: '上衣' },
  { id: 'bottoms', label: '下装' },
  { id: 'outerwear', label: '外套' },
  { id: 'dresses', label: '连衣裙' },
  { id: 'shoes', label: '鞋履' },
  { id: 'bags', label: '包袋' },
  { id: 'accessories', label: '配饰' },
];

export const WardrobePage: React.FC = () => {
  const {
    items,
    filteredItems,
    selectedCategory,
    setSelectedCategory,
    stats,
    toggleFavorite,
    isLoading,
  } = useWardrobeContext();
  const [view, setView] = useState<ViewMode>('grid');

  const sortedTimeline = useMemo(
    () =>
      [...items].sort((a, b) => {
        const ta = a.lastWorn?.getTime() ?? 0;
        const tb = b.lastWorn?.getTime() ?? 0;
        return tb - ta;
      }),
    [items],
  );

  const sortedValue = useMemo(() => [...items].sort((a, b) => b.price - a.price), [items]);

  const totalValueLabel =
    stats.totalValue >= 10000
      ? `¥${(stats.totalValue / 10000).toFixed(1)}w`
      : `¥${Math.round(stats.totalValue / 1000)}k`;

  return (
    <div className="wardrobe-page">
      <header className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-title">智能衣橱</h1>
            <p className="page-subtitle">
              {isLoading ? '同步中…' : `共 ${stats.totalItems} 件单品 · 估值约 ${totalValueLabel}`}
            </p>
          </div>
          <button
            type="button"
            className="page-header__btn"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'prompts' } }))}
            title="AI提示词"
          >
            💡
          </button>
        </div>
      </header>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-number">{stats.totalItems}</div>
          <div className="stat-label">总衣物</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalValueLabel}</div>
          <div className="stat-label">衣橱价值</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Math.round(stats.utilizationRate * 100)}%</div>
          <div className="stat-label">活跃利用率</div>
        </div>
      </div>

      <div className="view-toggle" role="tablist" aria-label="衣橱视图">
        {(
          [
            { id: 'grid' as const, label: '网格' },
            { id: 'timeline' as const, label: '时间线' },
            { id: 'value' as const, label: '价值' },
          ]
        ).map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={view === v.id}
            className={`view-toggle__btn ${view === v.id ? 'active' : ''}`}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="inspire-strip">
        <div>
          <h2 className="inspire-strip__title">灵感碰撞</h2>
          <p className="inspire-strip__desc">从沉睡单品中抽取一件，与今日天气生成一组安全区外的试探搭配。</p>
        </div>
        <button
          type="button"
          className="inspire-strip__btn"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'match' } }))}
        >
          去碰撞
        </button>
      </div>

      <div className="filter-tabs">
        {CAT_FILTER.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`filter-tab ${selectedCategory === tab.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === 'grid' && (
        <ClothesGrid
          items={filteredItems}
          onItemClick={(item) => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'clothing-detail', detailId: item.id } }))}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {view === 'timeline' && (
        <ul className="timeline-list">
          {sortedTimeline.map((item) => (
            <li key={item.id}>
              <button type="button" className="timeline-row" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'clothing-detail', detailId: item.id } }))}>
                <img src={item.thumbnail} alt={item.name} className="timeline-thumb" />
                <div className="timeline-body">
                  <div className="timeline-name">{item.name}</div>
                  <div className="timeline-meta">
                    {item.lastWorn
                      ? `上次穿着 · ${daysBetween(new Date(), item.lastWorn)} 天前`
                      : '尚未记录穿着'}
                  </div>
                </div>
                <span className="timeline-chev">→</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {view === 'value' && (
        <ul className="value-list">
          {sortedValue.map((item, index) => (
            <li key={item.id}>
              <button type="button" className="value-row" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'clothing-detail', detailId: item.id } }))}>
                <span className="value-rank">{index + 1}</span>
                <img src={item.thumbnail} alt={item.name} className="value-thumb" />
                <div className="value-body">
                  <div className="value-name">{item.name}</div>
                  <div className="value-sub">{item.subCategory}</div>
                </div>
                <span className="value-price">{formatPrice(item.price)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};