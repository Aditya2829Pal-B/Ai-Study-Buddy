import { create } from 'zustand';
import { DrawLine } from '../../components/collab/types';

interface WhiteboardStore {
  lines: DrawLine[];
  tool: 'pen' | 'eraser';
  color: string;
  setTool: (tool: 'pen' | 'eraser') => void;
  setColor: (color: string) => void;
  addLine: (line: DrawLine) => void;
  setLines: (updater: DrawLine[] | ((prev: DrawLine[]) => DrawLine[])) => void;
  clearCanvas: () => void;
}

export const useWhiteboardStore = create<WhiteboardStore>((set) => ({
  lines: [],
  tool: 'pen',
  color: '#6366f1',
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  addLine: (line) => set((state) => ({ lines: [...state.lines, line] })),
  setLines: (updater) => set((state) => ({ lines: typeof updater === 'function' ? updater(state.lines) : updater })),
  clearCanvas: () => set({ lines: [] }),
}));
