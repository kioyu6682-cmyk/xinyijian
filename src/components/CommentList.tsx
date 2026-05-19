import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './CommentList.css';

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes: number;
  created_at: string;
  user?: {
    nickname: string;
    avatar_emoji: string;
  };
}

interface CommentListProps {
  postId: string;
  onRefresh?: () => void;
}

export const CommentList: React.FC<CommentListProps> = ({ postId, onRefresh }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    const allComments: Comment[] = [];

    try {
      // 从服务器加载评论
      const { data, error } = await supabase
        .from('comments')
        .select('*, users(nickname, avatar_emoji)')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        allComments.push(...data.map((item: any) => ({
          ...item,
          user: item.users || { nickname: '匿名用户', avatar_emoji: '👤' }
        })));
      }
    } catch (err) {
      console.warn('加载服务器评论失败:', err);
    }

    try {
      // 从本地存储加载评论
      const localComments = JSON.parse(localStorage.getItem('xinyijian_comments') || '[]');
      const postLocalComments = localComments.filter((c: Comment) => c.post_id === postId);
      allComments.push(...postLocalComments);
    } catch (localErr) {
      console.warn('加载本地评论失败:', localErr);
    }

    // 按时间排序，去重
    allComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const uniqueComments = allComments.filter((c, index, self) => 
      index === self.findIndex(other => other.id === c.id)
    );

    setComments(uniqueComments);
    setLoading(false);
  };

  const handleLike = async (commentId: string) => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }));
      return;
    }

    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ likes: comment.likes + 1 })
        .eq('id', commentId);

      if (!error) {
        setComments(prev => prev.map(c => 
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        ));
      }
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN');
  };

  if (loading) {
    return (
      <div className="comment-list">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.length === 0 ? (
        <div className="empty-state">
          <span>暂无评论，快来发表第一条评论吧！</span>
        </div>
      ) : (
        comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="comment-avatar">
              {comment.user?.avatar_emoji || '👤'}
            </div>
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{comment.user?.nickname || '匿名用户'}</span>
                <span className="comment-time">{formatTime(comment.created_at)}</span>
              </div>
              <p className="comment-text">{comment.content}</p>
              <div className="comment-footer">
                <button 
                  className="like-btn"
                  onClick={() => handleLike(comment.id)}
                >
                  <span className="like-icon">❤️</span>
                  <span className="like-count">{comment.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};