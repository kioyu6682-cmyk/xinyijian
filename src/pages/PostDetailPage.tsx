import React, { useState } from 'react';
import { BackIcon, HeartIcon, MessageIcon } from '../components/Icons';
import { CommentEditor } from '../components/CommentEditor';
import { CommentList } from '../components/CommentList';
import './PostDetailPage.css';

interface PostData {
  id: string;
  author: string;
  avatar: string;
  likes: number;
  comments: number;
  tag: string;
  excerpt: string;
  image: string;
  content?: string;
  images?: string[];
}

interface Props {
  postId: string;
  onBack: () => void;
}

const ALL_POSTS: PostData[] = [
  { id: '1', author: '林一', avatar: '\u{1F469}', likes: 1204, comments: 52, tag: '腰带魔法', excerpt: '用腰带提高腰线，旧连衣裙有了新比例。', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=woman%20wearing%20dress%20with%20belt%20fashion%20photography%20elegant%20minimalist&size=600x800', content: '今天试了用腰带改造旧连衣裙，效果出奇的好！高腰线真的能拉长比例，建议大家都试试这个穿搭技巧。' },
  { id: '2', author: '阿木', avatar: '\u{1F468}', likes: 982, comments: 41, tag: '通勤叙事', excerpt: '灰蓝 + 燕麦色，会议室与咖啡馆之间无缝切换。', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=professional%20workwear%20grey%20blue%20oatmeal%20color%20block%20fashion%20photography&size=600x800', content: '灰蓝与燕麦色的搭配真的是通勤天花板，既专业又温柔。分享我的本周通勤穿搭～' },
  { id: '3', author: 'Cici', avatar: '\u{1F469}', likes: 2401, comments: 128, tag: '可持续', excerpt: '一季只添一件，其余全部来自衣橱重组。', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=sustainable%20fashion%20wardrobe%20capsule%20minimalist%20style%20fashion%20photography&size=600x800', content: '坚持可持续时尚已经一年了，每个季度只买一件新衣服，其他搭配都靠衣橱里现有单品的重组。' },
  { id: '4', author: '周周', avatar: '\u{1F469}', likes: 756, comments: 33, tag: '盲盒周末', excerpt: '盲盒抽到的撞色袜成了全身点睛。', image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=colorful%20socks%20fashion%20detail%20street%20style%20casual%20outfit&size=600x800', content: '周末盲盒给了我一个惊喜！撞色袜真的好有意思，让全身搭配瞬间有了亮点。' },
];

export const PostDetailPage: React.FC<Props> = ({ postId, onBack }) => {
  const [liked, setLiked] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const post = ALL_POSTS.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="post-detail-page">
        <div className="detail-empty">
          <p>帖子未找到</p>
          <button className="btn-primary" onClick={onBack}>返回社区</button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <header className="detail-page-header">
        <button className="detail-page-back" onClick={onBack}>
          <BackIcon size={20} /> 社区
        </button>
      </header>

      <div className="post-detail-hero">
        <img src={post.image} alt={post.excerpt} className="post-detail-img" loading="lazy" />
        <div className="post-detail-tag">{post.tag}</div>
      </div>

      <div className="post-detail-body">
        <div className="post-detail-author-row">
          <span className="post-detail-avatar">{post.avatar}</span>
          <span className="post-detail-author">{post.author}</span>
        </div>

        <p className="post-detail-excerpt">{post.excerpt}</p>
        {post.content && <p className="post-detail-content">{post.content}</p>}

        <div className="post-detail-actions">
          <button
            className={`post-action-btn ${liked ? 'active' : ''}`}
            onClick={() => setLiked(v => !v)}
          >
            <HeartIcon size={18} color={liked ? '#e57082' : 'currentColor'} />
            <span>{post.likes + (liked ? 1 : 0)}</span>
          </button>
          <button className="post-action-btn">
            <MessageIcon size={18} />
            <span>{post.comments}</span>
          </button>
          <button className="post-action-btn post-action-btn--share" onClick={() => {
            window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: '已复制分享链接' } }));
          }}>
            分享
          </button>
        </div>
      </div>

      <div className="post-detail-comments">
        <h3 className="post-comments-title">评论 ({post.comments})</h3>
        <CommentEditor postId={post.id} onCommentAdded={() => setRefreshCount(prev => prev + 1)} />
        <CommentList postId={post.id} key={`${post.id}_${refreshCount}`} />
      </div>

      <div className="detail-bottom-actions">
        <button className="btn-secondary" onClick={onBack}>返回</button>
      </div>
    </div>
  );
};
