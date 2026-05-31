import create from 'zustand';
import api from '../services/api';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'file';
  timestamp: number;
  isRead: boolean;
  reactions: { [key: string]: string[] };
  editedAt?: number;
  deletedAt?: number;
  replyTo?: string;
}

export interface Chat {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  isGroupChat: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: number;
  updatedAt: number;
}

interface ChatStore {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, message: Partial<Message>) => Promise<void>;
  editMessage: (chatId: string, messageId: string, text: string) => Promise<void>;
  deleteMessage: (chatId: string, messageId: string) => Promise<void>;
  addReaction: (chatId: string, messageId: string, emoji: string) => Promise<void>;
  markAsRead: (chatId: string, messageId: string) => Promise<void>;
  createGroupChat: (groupName: string, participantIds: string[], groupAvatar?: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: {},

  loadChats: async () => {
    try {
      const response = await api.get('/chats');
      set({ chats: response.data.chats });
    } catch (error) {
      throw error;
    }
  },

  loadMessages: async (chatId: string) => {
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      const { messages } = get();
      set({ messages: { ...messages, [chatId]: response.data.messages } });
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (chatId: string, message: Partial<Message>) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, message);
      const messages = get().messages[chatId] || [];
      set({
        messages: {
          ...get().messages,
          [chatId]: [...messages, response.data.message],
        },
      });
    } catch (error) {
      throw error;
    }
  },

  editMessage: async (chatId: string, messageId: string, text: string) => {
    try {
      await api.put(`/chats/${chatId}/messages/${messageId}`, { text });
      const messages = get().messages[chatId] || [];
      const updatedMessages = messages.map((m) =>
        m.id === messageId ? { ...m, text, editedAt: Date.now() } : m
      );
      set({ messages: { ...get().messages, [chatId]: updatedMessages } });
    } catch (error) {
      throw error;
    }
  },

  deleteMessage: async (chatId: string, messageId: string) => {
    try {
      await api.delete(`/chats/${chatId}/messages/${messageId}`);
      const messages = get().messages[chatId] || [];
      const updatedMessages = messages.map((m) =>
        m.id === messageId ? { ...m, deletedAt: Date.now() } : m
      );
      set({ messages: { ...get().messages, [chatId]: updatedMessages } });
    } catch (error) {
      throw error;
    }
  },

  addReaction: async (chatId: string, messageId: string, emoji: string) => {
    try {
      await api.post(`/chats/${chatId}/messages/${messageId}/reactions`, { emoji });
      const messages = get().messages[chatId] || [];
      const updatedMessages = messages.map((m) => {
        if (m.id === messageId) {
          const reactions = { ...m.reactions };
          if (!reactions[emoji]) reactions[emoji] = [];
          reactions[emoji].push('');
          return { ...m, reactions };
        }
        return m;
      });
      set({ messages: { ...get().messages, [chatId]: updatedMessages } });
    } catch (error) {
      throw error;
    }
  },

  markAsRead: async (chatId: string, messageId: string) => {
    try {
      await api.put(`/chats/${chatId}/messages/${messageId}/read`);
      const messages = get().messages[chatId] || [];
      const updatedMessages = messages.map((m) =>
        m.id === messageId ? { ...m, isRead: true } : m
      );
      set({ messages: { ...get().messages, [chatId]: updatedMessages } });
    } catch (error) {
      throw error;
    }
  },

  createGroupChat: async (groupName: string, participantIds: string[], groupAvatar?: string) => {
    try {
      const response = await api.post('/chats/group', { groupName, participantIds, groupAvatar });
      const chats = get().chats;
      set({ chats: [...chats, response.data.chat] });
    } catch (error) {
      throw error;
    }
  },
}));
