import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TodayCard, type TodayOutfitPiece } from '../components/TodayCard';
import { weatherService } from '../services/weather';
import { aiService } from '../services/ai';
import { useWardrobeContext } from '../context/WardrobeContext';
import { useAuth } from '../context/AuthContext';
import type { WeatherCondition } from '../types';
import './HomePage.css';

function conditionZh(c: string): string {
  const m: Record<string, string> = {
    sunny: '晴',
    cloudy: '多云',
    rainy: '微雨',
    snowy: '雪',
    windy: '大风',
    foggy: '雾',
    stormy: '暴雨',
  };
  return m[c] ?? c;
}

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { items } = useWardrobeContext();
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [shoeAltIndex, setShoeAltIndex] = useState(0);
  const [recommendation, setRecommendation] = useState<Awaited<
    ReturnType<typeof aiService.generateOutfitRecommendation>
  > | null>(null);
  const [inspireListOpen, setInspireListOpen] = useState(false);
  const [promptDetailOpen, setPromptDetailOpen] = useState(false);

  useEffect(() => {
    weatherService.getCurrentWeather().then(setWeather);
  }, []);

  useEffect(() => {
    if (!weather || items.length === 0) {
      setRecommendation(null);
      return;
    }
    let cancelled = false;
    aiService.generateOutfitRecommendation(items, weather, 'commute', 'minimalist').then((r) => {
      if (!cancelled) setRecommendation(r);
    });
    return () => {
      cancelled = true;
    };
  }, [weather, items]);

  const pieces: TodayOutfitPiece[] = useMemo(() => {
    if (!recommendation?.items?.length) {
      return [
        { id: 'p1', name: '防风夹克', thumbnail: '🧥' },
        { id: 'p2', name: '透气针织', thumbnail: '🧶' },
        { id: 'p3', name: '直筒西裤', thumbnail: '👖' },
        { id: 'p4', name: '小白鞋', thumbnail: '👟' },
      ];
    }
    const ids = recommendation.items.map((x) => x.itemId);
    return ids
      .map((id) => {
        const it = items.find((i) => i.id === id);
        return it ? { id: it.id, name: it.name, thumbnail: it.thumbnail } : null;
      })
      .filter(Boolean) as TodayOutfitPiece[];
  }, [recommendation, items]);

  const shoeAlternates = useMemo(
    () => items.filter((i) => i.category === 'shoes'),
    [items],
  );

  const swapShoePiece = useCallback((): TodayOutfitPiece[] => {
    if (shoeAlternates.length === 0) return pieces;
    const shoe = shoeAlternates[shoeAltIndex % shoeAlternates.length];
    return pieces.map((p) =>
      items.find((i) => i.id === p.id)?.category === 'shoes'
        ? { id: shoe.id, name: shoe.name, thumbnail: shoe.thumbnail }
        : p,
    );
  }, [shoeAlternates, shoeAltIndex, pieces, items]);

  const displayPieces = detailOpen ? swapShoePiece() : pieces;

  const weatherClass =
    weather?.condition === 'rainy'
      ? 'home-hero--rain'
      : weather?.condition === 'sunny'
        ? 'home-hero--sun'
        : 'home-hero--neutral';

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });

  const navigate = (page: 'home' | 'wardrobe' | 'match' | 'community' | 'me' | 'prompts') => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { page } }));
  };

  const displayName = user?.nickname ?? '访客';
  const profileEmoji = user?.avatarEmoji ?? '\u25C9';

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header__row">
          <div>
            <p className="home-kicker">我的穿搭仪表盘</p>
            <h1 className="greeting">
              {new Date().getHours() < 12 ? '早上好' : new Date().getHours() < 18 ? '下午好' : '晚上好'}，{displayName}
            </h1>
            <p className="date">{formatDate(new Date())}</p>
            {!user && (
              <button type="button" className="home-login-hint" onClick={() => navigate('me')}>
                登录账号以同步数据 →
              </button>
            )}
          </div>
          <div className="home-header__actions">
            <button
              className="home-header__btn"
              onClick={() => navigate('prompts')}
              title="AI提示词"
            >
              💡
            </button>
            <button type="button" className="home-profile-chip" onClick={() => navigate('me')} aria-label="我的">
              <span aria-hidden>{profileEmoji}</span>
            </button>
          </div>
        </div>
      </header>

      <div className={`home-hero ${weatherClass}`}>
        {weather?.condition === 'rainy' && (
          <div className="home-hero__rain" aria-hidden>
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="home-hero__drop" style={{ left: `${5 + i * 5.2}%`, animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
        )}
        {weather?.condition === 'sunny' && <div className="home-hero__sun-glow" aria-hidden />}

        <div className="home-hero__glass">
          {weather ? (
            <TodayCard
              weather={weather}
              pieces={displayPieces}
              onConfirm={() => {
                showToast('已记入穿搭日历 · 环保贡献 +1');
                setDetailOpen(false);
              }}
              onAdjust={() => navigate('match')}
              onOpenDetail={() => setDetailOpen((v) => !v)}
            >
              <p className="today-reason">
                <span className="reason-chip">
                  {weather.temperature}°C {conditionZh(weather.condition)}
                </span>
                推荐以衣橱中的防风外层与透气内搭叠穿，适合
                <span className="reason-chip">通勤</span>
                场合，延续你的
                <span className="reason-chip">简约通勤</span>
                风格轴线。
                {recommendation?.reason?.length ? ` ${recommendation.reason.join('；')}。` : ''}
              </p>
            </TodayCard>
          ) : (
            <div className="home-hero__skeleton" aria-busy>
              <div className="sk-line sk-line--w40" />
              <div className="sk-line sk-line--w70" />
              <div className="sk-line sk-line--w90" />
            </div>
          )}
        </div>
      </div>

      {detailOpen && weather && (
        <div className="swap-hint">
          <span>试穿预览 · 点击鞋履轮换</span>
          <button
            type="button"
            className="swap-hint__btn"
            onClick={() => setShoeAltIndex((i) => i + 1)}
          >
            换一双鞋
          </button>
        </div>
      )}

      <div className="quick-actions">
        <button type="button" className="quick-btn" onClick={() => window.dispatchEvent(new CustomEvent('openModal', { detail: { type: 'upload' } }))}>
          <div className="quick-icon">📷</div>
          <span className="quick-label">拍照入橱</span>
        </button>
        <button type="button" className="quick-btn" onClick={() => navigate('match')}>
          <div className="quick-icon quick-icon--accent">✦</div>
          <span className="quick-label">AI 搭配</span>
        </button>
        <button type="button" className="quick-btn" onClick={() => navigate('wardrobe')}>
          <div className="quick-icon">⌘</div>
          <span className="quick-label">智能衣橱</span>
        </button>
        <button type="button" className="quick-btn" onClick={() => navigate('me')}>
          <div className="quick-icon">📈</div>
          <span className="quick-label">穿搭报告</span>
        </button>
      </div>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">灵感速递</h2>
          <button type="button" className="see-all" onClick={() => setInspireListOpen(true)}>
            查看全部 →
          </button>
        </div>
        <div className="inspiration-scroll">
          <article
            className="inspiration-card inspiration-card--mag inspiration-card--click"
            role="button"
            tabIndex={0}
            onClick={() => navigate('match')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('match')}
          >
            <div className="inspiration-type">新衣搭配</div>
            <h3>新牛仔裤的三条故事线</h3>
            <p>检测到高腰直筒牛仔裤入橱，基于现有单品生成通勤 / 约会 / 周末三套叙事。</p>
            <div className="inspiration-visual" aria-hidden>
              <span>👖</span>
            </div>
            <button
              type="button"
              className="inspiration-cta"
              onClick={(e) => {
                e.stopPropagation();
                navigate('match');
              }}
            >
              打开搭配室
            </button>
          </article>
          <article
            className="inspiration-card inspiration-card--amber inspiration-card--click"
            role="button"
            tabIndex={0}
            onClick={() => navigate('wardrobe')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('wardrobe')}
          >
            <div className="inspiration-type">衣橱动态</div>
            <h3>沉睡单品唤醒</h3>
            <p>丝质衬衫已许久未出场，不妨与半裙、细腰带组成「美术馆午后」look。</p>
            <div className="inspiration-visual inspiration-visual--soft" aria-hidden>
              <span>👔</span>
            </div>
            <button
              type="button"
              className="inspiration-cta"
              onClick={(e) => {
                e.stopPropagation();
                navigate('wardrobe');
              }}
            >
              去衣橱看看
            </button>
          </article>
          <article
            className="inspiration-card inspiration-card--green inspiration-card--click"
            role="button"
            tabIndex={0}
            onClick={() => navigate('community')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('community')}
          >
            <div className="inspiration-type">社区挑战</div>
            <h3>本周：腰带魔法</h3>
            <p>用一条腰带重构旧装的轮廓。完成挑战可解锁风格盲盒与环保勋章。</p>
            <div className="inspiration-visual inspiration-visual--green" aria-hidden>
              <span>🏆</span>
            </div>
            <button
              type="button"
              className="inspiration-cta"
              onClick={(e) => {
                e.stopPropagation();
                navigate('community');
              }}
            >
              参与挑战
            </button>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="blindbox-row">
          <button
            type="button"
            className="blindbox-row__text"
            onClick={() => showToast('已为你预生成 3 组周末冒险配色，可在搭配室查看')}
          >
            <h2 className="section-title section-title--inline">风格盲盒</h2>
            <p className="blindbox-desc">打破信息茧房，在安全区内试探新的配色与廓形。</p>
          </button>
          <button type="button" className="blindbox-btn" onClick={() => showToast('周末冒险搭配已加入你的灵感队列')}>
            开启
          </button>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">理性衣橱 · 环保足迹</h2>
        <button type="button" className="eco-card eco-card--btn" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'eco-detail' } }))}>
          <div className="eco-content">
            <div>
              <div className="eco-label">本月少购替代碳排</div>
              <div className="eco-value">12.5 kg</div>
            </div>
            <div className="eco-icon" aria-hidden>
              🌱
            </div>
          </div>
          <p className="eco-desc">通过复用现有单品完成穿搭决策，你本月已减少约 3 件冲动型购入。点按查看明细</p>
        </button>
      </section>

      {inspireListOpen && (
        <div
          className="sheet-overlay sheet-overlay--light"
          role="presentation"
          onClick={() => setInspireListOpen(false)}
        >
          <div
            className="sheet sheet--list"
            role="dialog"
            aria-labelledby="inspire-list-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet__grab" />
            <h2 id="inspire-list-title" className="sheet-list-title">
              灵感速递 · 全部
            </h2>
            <ul className="sheet-inspire-list">
              <li>
                <button type="button" onClick={() => { setInspireListOpen(false); navigate('match'); }}>
                  新牛仔裤的三条故事线
                </button>
              </li>
              <li>
                <button type="button" onClick={() => { setInspireListOpen(false); navigate('wardrobe'); }}>
                  沉睡单品唤醒 · 丝质衬衫
                </button>
              </li>
              <li>
                <button type="button" onClick={() => { setInspireListOpen(false); navigate('community'); }}>
                  社区挑战 · 腰带魔法
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setInspireListOpen(false);
                    showToast('风格盲盒已加入队列');
                  }}
                >
                  周末风格盲盒
                </button>
              </li>
            </ul>
            <button type="button" className="sheet-btn sheet-btn--primary" onClick={() => setInspireListOpen(false)}>
              关闭
            </button>
          </div>
        </div>
      )}

      {promptDetailOpen && (
        <div className="sheet-overlay sheet-overlay--light" role="presentation" onClick={() => setPromptDetailOpen(false)}>
          <div className="sheet sheet--prompt" role="dialog" aria-labelledby="prompt-title" onClick={(e) => e.stopPropagation()}>
            <div className="sheet__grab" />
            <h2 id="prompt-title" className="sheet-list-title">
              AI提示词详情
            </h2>
            <p className="sheet-desc">查看首页模块使用的AI提示词，了解系统如何为你生成穿搭推荐</p>
            <div className="prompt-list">
              <div className="prompt-item">
                <h3 className="prompt-item__title">智能穿搭推荐</h3>
                <p className="prompt-item__desc">根据天气、场合和用户风格偏好，生成个性化穿搭方案</p>
              </div>
              <div className="prompt-item">
                <h3 className="prompt-item__title">天气适配建议</h3>
                <p className="prompt-item__desc">根据天气变化提供穿搭调整建议</p>
              </div>
            </div>
            <button type="button" className="sheet-btn sheet-btn--primary" onClick={() => setPromptDetailOpen(false)}>
              关闭
            </button>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
};