import { create } from 'zustand';

export interface ActivePeer {
  id: string;
  name: string;
  avatar: string;
  isSpeaking: boolean;
}

interface PresenceStore {
  activePeers: ActivePeer[];
  setActivePeers: (peers: ActivePeer[]) => void;
  updatePeerAudio: (peerId: string, isSpeaking: boolean) => void;
}

export const usePresenceStore = create<PresenceStore>((set) => ({
  activePeers: [],
  setActivePeers: (peers) => set({ activePeers: peers }),
  updatePeerAudio: (peerId, isSpeaking) => set((state) => ({
    activePeers: state.activePeers.map(p => p.id === peerId ? { ...p, isSpeaking } : p)
  }))
}));
