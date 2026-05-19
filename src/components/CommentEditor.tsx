import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './CommentEditor.css';

interface CommentEditorProps {
  postId: string;
  onCommentAdded?: () => void;
}

export const CommentEditor: React.FC<CommentEditorProps> = ({ postId, onCommentAdded }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== 提交评论 ===');
    console.log('内容:', content);
    console.log('用户:', user);
    console.log('帖子ID:', postId);
    
    if (!content.trim()) {
      console.log('❌ 内容为空');
      setMessage('请输入评论内容');
      return;
    }

    if (!user) {
      console.log('❌ 用户未登录');
      setMessage('请先登录');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    let savedToServer = false;

    try {
      console.log('尝试保存到服务器...');
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
          created_at: new Date().toISOString()
        });

      if (!error) {
        savedToServer = true;
        console.log('✅ 服务器保存成功');
      } else {
        console.log('⚠️ 服务器保存失败:', error.message);
      }
    } catch (err) {
      console.log('⚠️ 服务器保存异常:', err);
    }

    // 保存到本地存储作为后备
    if (!savedToServer) {
      try {
        console.log('尝试保存到本地存储...');
        const localComments = JSON.parse(localStorage.getItem('xinyijian_comments') || '[]');
        const newComment = {
          id: `local_${Date.now()}`,
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
          likes: 0,
          created_at: new Date().toISOString(),
          user: {
            nickname: user.nickname,
            avatar_emoji: user.avatarEmoji
          }
        };
        localComments.push(newComment);
        localStorage.setItem('xinyijian_comments', JSON.stringify(localComments));
        console.log('✅ 本地存储成功');
      } catch (localErr) {
        console.error('❌ 本地存储失败:', localErr);
      }
    }

    setContent('');
    const msg = savedToServer ? '✅ 评论成功！' : '⚠️ 已保存到本地，网络恢复后将自动同步';
    console.log('显示消息:', msg);
    setMessage(msg);
    
    if (onCommentAdded) {
      console.log('触发评论添加回调');
      onCommentAdded();
    }

    setTimeout(() => setMessage(''), savedToServer ? 2000 : 3000);
    setIsSubmitting(false);
  };

  return (
    <div className="comment-editor">
      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="comment-input-wrapper">
            <textarea
              className="comment-input"
              placeholder="写下你的评论..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              rows={3}
              disabled={isSubmitting}
            />
            <span className="char-count">{content.length}/500</span>
          </div>
          <div className="comment-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? '发送中...' : '发送'}
            </button>
          </div>
        </form>
      ) : (
        <div className="login-prompt">
          <span>请先登录才能发表评论</span>
          <button
            type="button"
            className="login-btn"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }))}
          >
            去登录
          </button>
        </div>
      )}
      
      {message && (
        <div className={`message ${message.includes('成功') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};