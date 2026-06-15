import { create } from 'zustand';

interface DashboardState {
  view: 'studio' | 'library' | 'history';
  setView: (view: 'studio' | 'library' | 'history') => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  view: 'studio',
  setView: (view) => set({ view }),
}));
