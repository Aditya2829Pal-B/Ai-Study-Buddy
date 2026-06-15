import { create } from 'zustand';

export interface AIServiceResponse {
  roadmap: Array<{ title: string; description: string; duration: string; keyTopics: string[] }>;
  flashcards: Array<{ front: string; back: string }>;
  practiceQuestions: Array<{ type: string; question: string; options?: string[]; correctOptionIndex?: number; answer: string }>;
  sources: Array<{ title: string; url: string; description: string }>;
}

interface MaterialState {
  topic: string;
  setTopic: (topic: string) => void;
  result: AIServiceResponse | null;
  setResult: (result: AIServiceResponse | null) => void;
  academicLevel: string;
  setAcademicLevel: (level: string) => void;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  topic: '',
  setTopic: (topic) => set({ topic }),
  result: null,
  setResult: (result) => set({ result }),
  academicLevel: 'UG (Undergrad)',
  setAcademicLevel: (academicLevel) => set({ academicLevel }),
}));
