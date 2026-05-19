import React, { useState } from 'react';
import './CommunityPage.css';
import { HeartIcon, MessageIcon, DressIcon, ShoeIcon, ScarfIcon } from '../components/Icons';

type Tab = 'challenge' | 'bottle' | 'help';
type InteractionUser = {
  id: string;
  name: string;
  avatar: string;
  action: '点赞' | '评论' | '转发';
  postTitle: string;
  postExcerpt: string;
};
type PostItem = {
  id: string;
  author: string;
  avatar: string;
  likes: number;
  comments: number;
  tag: string;
  excerpt: string;
  image: string;
  interactions: InteractionUser[];
};

const POSTS: PostItem[] = [
  {
    id: '1',
    author: '林一',
    avatar: String.fromCodePoint(0x1f469),
    likes: 1204,
    comments: 52,
    tag: '腰带魔法',
    excerpt: '用腰带提高腰线，旧连衣裙有了新比例。',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=woman%20wearing%20dress%20with%20belt%20fashion%20photography%20elegant%20minimalist&size=600x800',
    interactions: [
      {
        id: 'u11',
        name: 'Momo',
        avatar: String.fromCodePoint(0x1f469),
        action: '评论',
        postTitle: '一条腰带三种系法',
        postExcerpt: '同一条腰带，正系、侧系、叠系可以直接改变视觉重心。',
      },
      {
        id: 'u12',
        name: '冉冉',
        avatar: String.fromCodePoint(0x1f469),
        action: '点赞',
        postTitle: '旧裙焕新作战',
        postExcerpt: '把压箱底 A 字裙配短上衣，腰线抬高后比例立刻修正。',
      },
    ],
  },
  {
    id: '2',
    author: '阿木',
    avatar: String.fromCodePoint(0x1f468),
    likes: 982,
    comments: 41,
    tag: '通勤叙事',
    excerpt: '灰蓝 + 燕麦色，会议室与咖啡馆之间无缝切换。',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=professional%20workwear%20grey%20blue%20oatmeal%20color%20block%20fashion%20photography&size=600x800',
    interactions: [
      {
        id: 'u21',
        name: '阿北',
        avatar: String.fromCodePoint(0x1f468),
        action: '转发',
        postTitle: '我的通勤胶囊衣橱',
        postExcerpt: '5 件核心单品循环 10 天，保持专业感与舒适度平衡。',
      },
      {
        id: 'u22',
        name: 'Sia',
        avatar: String.fromCodePoint(0x1f469),
        action: '评论',
        postTitle: '灰蓝配色不沉闷',
        postExcerpt: '在灰蓝基础上加入一点金属配饰，会更有精神亮点。',
      },
    ],
  },
  {
    id: '3',
    author: 'Cici',
    avatar: String.fromCodePoint(0x1f469),
    likes: 2401,
    comments: 128,
    tag: '可持续',
    excerpt: '一季只添一件，其余全部来自衣橱重组。',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=sustainable%20fashion%20wardrobe%20capsule%20minimalist%20style%20fashion%20photography&size=600x800',
    interactions: [
      {
        id: 'u31',
        name: 'Kiki',
        avatar: String.fromCodePoint(0x1f469),
        action: '点赞',
        postTitle: '一年 12 件计划',
        postExcerpt: '给每月新购设置上限，更多预算用于护理和修补旧衣。',
      },
      {
        id: 'u32',
        name: '石头',
        avatar: String.fromCodePoint(0x1f468),
        action: '评论',
        postTitle: '可持续也可以很时髦',
        postExcerpt: '关键是做单品复配矩阵，而不是盲目减少购买数量。',
      },
    ],
  },
  {
    id: '4',
    author: '周周',
    avatar: String.fromCodePoint(0x1f469),
    likes: 756,
    comments: 33,
    tag: '盲盒周末',
    excerpt: '盲盒抽到的撞色袜成了全身点睛。',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=colorful%20socks%20fashion%20detail%20street%20style%20casual%20outfit&size=600x800',
    interactions: [
      {
        id: 'u41',
        name: '七七',
        avatar: String.fromCodePoint(0x1f469),
        action: '转发',
        postTitle: '周末盲盒挑战回放',
        postExcerpt: '随机单品容易出奇效，重点是控制全身颜色不超过三种。',
      },
      {
        id: 'u42',
        name: 'Yao',
        avatar: String.fromCodePoint(0x1f468),
        action: '评论',
        postTitle: '撞色袜的安全区',
        postExcerpt: '把袜子和包袋同色，撞色也能显得整体有秩序。',
      },
    ],
  },
];

const BOTTLES = [
  {
    id: 'b1',
    icon: 'dress',
    name: '碎花连衣裙',
    status: '漂流中',
    carbon: 2.1,
    water: 480,
    waste: 0.4,
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=vintage%20floral%20midi%20dress%20fashion%20product%20photo%20elegant%20soft%20pink%20background&size=600x800',
  },
  {
    id: 'b2',
    icon: 'shoe',
    name: '高跟鞋',
    status: '已匹配',
    carbon: 1.6,
    water: 320,
    waste: 0.3,
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=elegant%20high%20heels%20pumps%20fashion%20product%20photo%20luxury%20minimalist%20background&size=600x800',
  },
  {
    id: 'b3',
    icon: 'scarf',
    name: '丝巾',
    status: '待认领',
    carbon: 0.5,
    water: 90,
    waste: 0.1,
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=silk%20scarf%20fashion%20accessory%20product%20photo%20elegant%20soft%20background&size=600x800',
  },
];

const getBottleIcon = (iconType: string) => {
  switch (iconType) {
    case 'dress': return <DressIcon size={20} />;
    case 'shoe': return <ShoeIcon size={20} />;
    case 'scarf': return <ScarfIcon size={20} />;
    default: return <DressIcon size={20} />;
  }
};

export const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('challenge');
  const [toast, setToast] = useState<string | null>(null);
  const [interactionDetail, setInteractionDetail] = useState<{ user: InteractionUser; sourceTag: string } | null>(null);
  const [bottleId, setBottleId] = useState<string | null>(null);

  const show = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const selectedBottle = BOTTLES.find((b) => b.id === bottleId);



  return (
    <div className="community-page">
      <header className="comm-header">
        <div className="comm-header__row">
          <div>
            <p className="comm-kicker">可持续时尚沙龙</p>
            <h1 className="comm-title">社区</h1>
            <p className="comm-sub">灵感挑战、衣物漂流与搭配求助，在同一空间完成流转与共创。</p>
          </div>
          <button
            type="button"
            className="comm-header__btn"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'prompts' } }))}
            title="AI提示词"
          >
            💡
          </button>
        </div>
      </header>

      <div className="community-tabs" role="tablist">
        {(
          [
            { id: 'challenge' as const, label: '灵感挑战' },
            { id: 'bottle' as const, label: '衣物漂流' },
            { id: 'help' as const, label: '搭配求助' },
          ]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`community-tabs__btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'challenge' && (
        <>
          <button
            type="button"
            className="challenge-card challenge-card--btn"
            onClick={() => show('已打开挑战详情：规则与奖励可在活动页持续更新')}
          >
            <p className="challenge-eyebrow">本周主题</p>
            <h2>腰带魔法</h2>
            <p className="challenge-lead">用一条腰带重构轮廓与比例，让旧装产生新的建筑感。</p>
            <ul className="challenge-rules">
              <li>至少 1 件入橱超过 90 天的单品</li>
              <li>发布时带上 #腰带魔法 标签</li>
              <li>完成可获得环保勋章与风格盲盒券</li>
            </ul>
            <span className="join-btn join-btn--inline">了解详情</span>
          </button>
          <button type="button" className="join-btn join-btn--full" onClick={() => show('已加入挑战 · 灵感队列已更新')}>
            立即参与
          </button>

          <h3 className="comm-section-title">热门分享</h3>
          <div className="post-grid">
            {POSTS.map((p) => (
              <article key={p.id} className="post-card">
                <button type="button" className="post-card__main post-card--btn" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'post-detail', detailId: p.id } }))}>
                  <div className="post-image">
                    <img src={p.image} alt={p.excerpt} className="post-image__img" loading="lazy" />
                  </div>
                  <div className="post-tag">{p.tag}</div>
                  <div className="post-info">
                    <div className="post-author">
                      <span className="author-avatar">{p.avatar}</span>
                      <span>{p.author}</span>
                    </div>
                    <div className="post-stats">
                      <span>
                        <HeartIcon size={14} /> {p.likes}
                      </span>
                      <span>
                        <MessageIcon size={14} /> {p.comments}
                      </span>
                    </div>
                  </div>
                </button>
                <div className="post-interactors">
                  {p.interactions.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className="post-interactor-btn"
                      onClick={() => setInteractionDetail({ user, sourceTag: p.tag })}
                    >
                      <span className="author-avatar">{user.avatar}</span>
                      <span>
                        {user.name} · {user.action}
                      </span>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {activeTab === 'bottle' && (
        <div className="bottle-panel">
          <button
            type="button"
            className="bottle-panel__head bottle-panel__head--btn"
            onClick={() => show('累计减碳数据来自你参与的每一次漂流匹配（演示）')}
          >
            <div className="bottle-panel__head-text">
              <h3>衣物漂流瓶</h3>
              <p className="bottle-lead">闲置流转替代丢弃，每一次匹配都在量化环境收益。</p>
            </div>
            <span className="eco-pill">累计减碳 12.4 kg</span>
          </button>
          <div className="bottle-list">
            {BOTTLES.map((b) => (
              <button key={b.id} type="button" className="bottle-card bottle-card--btn" onClick={() => setBottleId(b.id)}>
                <div className="bottle-card__icon">{getBottleIcon(b.icon)}</div>
                <div className="bottle-card__body">
                  <h4>{b.name}</h4>
                  <span className={`bottle-status bottle-status--${b.status === '已匹配' ? 'ok' : 'float'}`}>
                    {b.status}
                  </span>
                  <dl className="bottle-metrics">
                    <div>
                      <dt>减碳</dt>
                      <dd>{b.carbon} kg</dd>
                    </div>
                    <div>
                      <dt>节水</dt>
                      <dd>{b.water} L</dd>
                    </div>
                    <div>
                      <dt>减废</dt>
                      <dd>{b.waste} kg</dd>
                    </div>
                  </dl>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'help' && (
        <div className="help-panel">
          <div className="help-card">
            <h3>搭配求助区</h3>
            <p>上传单品照片与场合标签，由认证搭配师与社区达人共同应答，形成可执行的方案卡片。</p>
            <button type="button" className="ask-help-btn" onClick={() => show('已为你预留发布位 · 即将开放上传')}>
              发布求助
            </button>
            <div className="help-actions">
              <button type="button" className="help-link" onClick={() => show('已展示「通勤」筛选下的公开求助')}>
                浏览公开求助
              </button>
              <button type="button" className="help-link" onClick={() => show('达人应答通知已开启（演示）')}>
                成为应答达人
              </button>
            </div>
          </div>
          <p className="help-foot">云端众创 · 回复可被收录进你的「灵感手册」</p>
        </div>
      )}

      {selectedBottle && (
        <div className="comm-sheet-overlay" role="presentation" onClick={() => setBottleId(null)}>
          <div className="comm-sheet" role="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="comm-sheet__grab" />
            <h2 className="comm-sheet__title">
              {selectedBottle.icon} {selectedBottle.name}
            </h2>
            <p className="comm-sheet__excerpt">状态：{selectedBottle.status}。环境贡献为估算值，成交后更新。</p>
            <div className="comm-sheet__actions">
              {selectedBottle.status === '待认领' && (
                <button
                  type="button"
                  className="comm-sheet__btn comm-sheet__btn--primary"
                  onClick={() => {
                    setBottleId(null);
                    show('认领请求已发送（演示）');
                  }}
                >
                  认领漂流瓶
                </button>
              )}
              {selectedBottle.status === '漂流中' && (
                <button
                  type="button"
                  className="comm-sheet__btn comm-sheet__btn--primary"
                  onClick={() => {
                    setBottleId(null);
                    show('已发起匹配，系统将为你寻找同城接收方（演示）');
                  }}
                >
                  发起匹配
                </button>
              )}
              {selectedBottle.status === '已匹配' && (
                <button type="button" className="comm-sheet__btn comm-sheet__btn--primary" onClick={() => setBottleId(null)}>
                  查看物流（演示）
                </button>
              )}
              <button type="button" className="comm-sheet__btn" onClick={() => setBottleId(null)}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {interactionDetail && (
        <div className="comm-sheet-overlay" role="presentation" onClick={() => setInteractionDetail(null)}>
          <div className="comm-sheet" role="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="comm-sheet__grab" />
            <h2 className="comm-sheet__title">
              {interactionDetail.user.name} · {interactionDetail.user.action}
            </h2>
            <p className="comm-sheet__meta">来源话题：{interactionDetail.sourceTag}</p>
            <p className="comm-sheet__excerpt">{interactionDetail.user.postTitle}</p>
            <p className="comm-sheet__excerpt">{interactionDetail.user.postExcerpt}</p>
            <div className="comm-sheet__actions">
              <button
                type="button"
                className="comm-sheet__btn comm-sheet__btn--primary"
                onClick={() => show(`已打开 ${interactionDetail.user.name} 的发布详情（演示）`)}
              >
                查看完整发布
              </button>
              <button type="button" className="comm-sheet__btn" onClick={() => setInteractionDetail(null)}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

