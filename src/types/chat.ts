export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'received' | 'error';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastMessageTime: Date;
}

export type ChatStatus = 'idle' | 'typing' | 'thinking' | 'error';
