import { create } from 'zustand';

interface VoiceStore {
  isVoiceActive: boolean;
  setIsVoiceActive: (active: boolean) => void;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  isVoiceActive: false,
  setIsVoiceActive: (active) => set({ isVoiceActive: active })
}));
