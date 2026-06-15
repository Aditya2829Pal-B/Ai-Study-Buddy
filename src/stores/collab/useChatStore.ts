import { create } from 'zustand';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: Date | string;
}

interface ChatStore {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
     { id: '1', sender: 'System', text: 'Welcome to the Collab Space! Share the link to invite others.', time: new Date() }
  ],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setMessages: (messages) => set({ messages }),
}));
