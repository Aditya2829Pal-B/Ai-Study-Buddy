import { create } from 'zustand';

interface RoomStore {
  roomId: string;
  text: string;
  setRoomId: (id: string) => void;
  setText: (text: string) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  roomId: 'global-collab-room',
  text: '',
  setRoomId: (id) => set({ roomId: id }),
  setText: (text) => set({ text }),
}));
