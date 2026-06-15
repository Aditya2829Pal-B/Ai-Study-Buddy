import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIServiceResponse } from './useMaterialStore';

export interface HistorySession {
  id: string;
  topic: string;
  academicLevel: string;
  date: string;
  result: AIServiceResponse;
}

interface HistoryState {
  sessions: HistorySession[];
  addSession: (session: Omit<HistorySession, 'id' | 'date'>) => void;
  removeSession: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      sessions: [],
      addSession: (session) => set((state) => ({
        sessions: [
          {
            ...session,
            id: Math.random().toString(36).substring(7),
            date: new Date().toISOString(),
          },
          ...state.sessions,
        ],
      })),
      removeSession: (id) => set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
      })),
      clearHistory: () => set({ sessions: [] }),
    }),
    {
      name: 'neural-learn-history',
    }
  )
);
