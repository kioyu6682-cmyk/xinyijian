import React, { useState, useRef, useEffect } from 'react';
import './ChatPanel.css';
import type { ChatMessage, ChatStatus } from '../types/chat';
import { sendMessage, generateId } from '../services/aiService';
import { SendIcon, BotIcon, UserIcon, XIcon } from './Icons';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好呀！我是你的AI穿搭小助手，有什么穿搭问题想问我吗？',
      timestamp: new Date(),
      status: 'received',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<ChatStatus>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || status === 'typing') return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setStatus('typing');

    try {
      const response = await sendMessage(userMessage);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '抱歉，我现在有点忙，请稍后再试。',
        timestamp: new Date(),
        status: 'error',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setStatus('idle');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-panel">
      <div className="chat-panel__backdrop" onClick={onClose} />
      <div className="chat-panel__container">
        <div className="chat-panel__header">
          <div className="chat-panel__header-left">
            <div className="chat-panel__avatar">
              <BotIcon size={24} color="#e8b4b8" />
            </div>
            <div className="chat-panel__info">
              <h3 className="chat-panel__title">AI穿搭小助手</h3>
              <span className="chat-panel__status">
                {status === 'typing' ? '正在思考...' : '在线'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="chat-panel__close"
            onClick={onClose}
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="chat-panel__messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-panel__message chat-panel__message--${message.role}`}
            >
              <div className="chat-panel__message-avatar">
                {message.role === 'user' ? (
                  <UserIcon size={18} color="#8b6b6f" />
                ) : (
                  <BotIcon size={18} color="#e8b4b8" />
                )}
              </div>
              <div className="chat-panel__message-content">
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          {status === 'typing' && (
            <div className="chat-panel__message chat-panel__message--assistant">
              <div className="chat-panel__message-avatar">
                <BotIcon size={18} color="#e8b4b8" />
              </div>
              <div className="chat-panel__message-content chat-panel__message-content--typing">
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-panel__input-container">
          <div className="chat-panel__input-wrapper">
            <input
              type="text"
              className="chat-panel__input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题..."
              disabled={status === 'typing'}
            />
            <button
              type="button"
              className="chat-panel__send"
              onClick={handleSend}
              disabled={!inputValue.trim() || status === 'typing'}
            >
              <SendIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button type="button" className="chat-button" onClick={onClick}>
      <div className="chat-button__icon">
        <BotIcon size={24} color="white" />
      </div>
      <span className="chat-button__badge">
        <span className="chat-button__badge-dot" />
      </span>
    </button>
  );
};
