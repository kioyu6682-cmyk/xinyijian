import React, { useState } from 'react';
import { VirtualFittingRoom } from '../components/VirtualFittingRoom';
import { useWardrobeContext } from '../context/WardrobeContext';
import type { Outfit } from '../types';
import './MatchPage.css';

const LOOKS = [
  {
    id: 'l1',
    title: '简约通勤',
    sub: '防风外层 + 针织内搭',
    wears: 12,
    grad: 'linear-gradient(145deg, #3d4a5c 0%, #2a3038 100%)',
    detail: '适合微雨与室内外温差，强调利落肩线与垂坠下装。',
  },
  {
    id: 'l2',
    title: '温柔知性',
    sub: '丝质 + 半裙轮廓',
    wears: 6,
    grad: 'linear-gradient(145deg, #8b7355 0%, #5c4d3d 100%)',
    detail: '利用材质对比与收腰线条，适合会议与约会转场。',
  },
  {
    id: 'l3',
    title: '周末冒险',
    sub: '风格盲盒推荐',
    wears: 2,
    grad: 'linear-gradient(145deg, #2d6a4f 0%, #1b4332 100%)',
    detail: '在色相环上试探邻近色，保持一件中性色锚点单品。',
  },
  {
    id: 'l4',
    title: '雨日机能',
    sub: '防风层 + 快干内搭',
    wears: 5,
    grad: 'linear-gradient(145deg, #4a5568 0%, #2d3748 100%)',
    detail: '应对湿滑路面与室内外温差，鞋履优先防滑与易打理材质。',
  },
  {
    id: 'l5',
    title: '约会柔光',
    sub: '针织 + 缎面点缀',
    wears: 4,
    grad: 'linear-gradient(145deg, #b76e79 0%, #6b3d4a 100%)',
    detail: '低饱和粉与灰调金属配饰，保持光线下的柔和反光层次。',
  },
];

export const MatchPage: React.FC = () => {
  const { items, isLoading } = useWardrobeContext();
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSaveOutfit = (outfit: Outfit) => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setToast(`已保存「${outfit.name}」· 实践次数将随穿着记录累加`);
      window.setTimeout(() => setToast(null), 2600);
    }, 400);
  };

  return (
    <div className="match-page">
      <header className="match-header">
        <div className="match-header__row">
          <div>
            <p className="match-kicker">虚拟画板 · 场景试穿</p>
            <h1 className="match-title">搭配室</h1>
            <p className="match-sub">全屏画布中叠穿单品，保存后写入穿搭日历并累计实践勋章。</p>
          </div>
          <button
            type="button"
            className="match-header__btn"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'prompts' } }))}
            title="AI提示词"
          >
            💡
          </button>
        </div>
      </header>

      <VirtualFittingRoom
        items={items}
        currentOutfit={null}
        isGenerating={saving}
        isLoading={isLoading}
        onSaveOutfit={handleSaveOutfit}
      />

      <section className="match-recs">
        <h2 className="match-recs__title">AI 推荐搭配</h2>
        <p className="match-recs__hint">点按卡片查看叙事；向右滑动浏览更多推荐</p>
        <div className="match-recs__strip">
          <div className="match-recs__scroll" aria-label="AI 推荐搭配横向列表">
            {LOOKS.map((look) => (
              <button
                key={look.id}
                type="button"
                className="look-card look-card--btn"
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'outfit-detail', detailId: look.id } }))}
              >
                <div className="look-card__visual" style={{ background: look.grad }}>
                  <span className="look-card__badge">实践 {look.wears} 次</span>
                </div>
                <h3 className="look-card__name">{look.title}</h3>
                <p className="look-card__sub">{look.sub}</p>
              </button>
            ))}
          </div>
          <div className="match-recs__fade" aria-hidden />
        </div>
      </section>

      {toast && <div className="toast toast--match">{toast}</div>}
    </div>
  );
};