import { create } from 'zustand';
import { Message } from '../types';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentLanguage: string;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  setLanguage: (language: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  currentLanguage: 'en',
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setLanguage: (language) => set({ currentLanguage: language }),
  
  clearMessages: () => set({ messages: [] })
}));