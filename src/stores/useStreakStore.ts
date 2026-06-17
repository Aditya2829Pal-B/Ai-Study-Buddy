import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StreakState {
  streakCount: number;
  lastActiveDate: string | null;
  logActivity: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set) => ({
      streakCount: 0,
      lastActiveDate: null,
      logActivity: () => set((state) => {
        const today = new Date().toDateString();
        
        // If already active today, do nothing
        if (state.lastActiveDate === today) {
          return state;
        }

        // If no previous activity, start at 1
        if (!state.lastActiveDate) {
          return { streakCount: 1, lastActiveDate: today };
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // If active yesterday, increment
        if (state.lastActiveDate === yesterday.toDateString()) {
          return { streakCount: state.streakCount + 1, lastActiveDate: today };
        }

        // Otherwise (streak broken), reset to 1
        return { streakCount: 1, lastActiveDate: today };
      }),
    }),
    {
      name: 'neural-learn-streak',
    }
  )
);
