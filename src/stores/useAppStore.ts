import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CookieSettings } from '../lib/schemas';

interface AppState {
  hasAcceptedCookies: boolean;
  cookieSettings: CookieSettings;
  isCookieModalOpen: boolean;
  isPremium: boolean;
  isPremiumModalOpen: boolean;
  isDeveloperProfileOpen: boolean;
  setCookieSettings: (settings: CookieSettings) => void;
  acceptAllCookies: () => void;
  setCookieModalOpen: (isOpen: boolean) => void;
  setIsPremium: (isPremium: boolean) => void;
  setIsPremiumModalOpen: (isOpen: boolean) => void;
  setDeveloperProfileOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasAcceptedCookies: false,
      cookieSettings: { essential: true, analytics: false, marketing: false },
      isCookieModalOpen: false,
      isPremium: false,
      isPremiumModalOpen: false,
      isDeveloperProfileOpen: false,
      setCookieSettings: (settings) => set({ cookieSettings: settings, hasAcceptedCookies: true }),
      acceptAllCookies: () => set({ 
        cookieSettings: { essential: true, analytics: true, marketing: true },
        hasAcceptedCookies: true,
        isCookieModalOpen: false
      }),
      setCookieModalOpen: (isOpen) => set({ isCookieModalOpen: isOpen }),
      setIsPremium: (isPremium) => set({ isPremium }),
      setIsPremiumModalOpen: (isOpen) => set({ isPremiumModalOpen: isOpen }),
      setDeveloperProfileOpen: (isOpen) => set({ isDeveloperProfileOpen: isOpen })
    }),
    {
      name: 'app-storage',
    }
  )
);
