import { create } from 'zustand';

export interface AIServiceResponse {
  roadmap: Array<{ title: string; description: string; duration: string; keyTopics: string[] }>;
  flashcards: Array<{ front: string; back: string }>;
  practiceQuestions: Array<{ type: string; question: string; options?: string[]; correctOptionIndex?: number; answer: string }>;
  sources: Array<{ title: string; url: string; description: string }>;
}

export type SummaryLength = 'short' | 'medium' | 'detailed';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type FlashcardFormat = 'term-definition' | 'question-answer';

interface MaterialState {
  topic: string;
  setTopic: (topic: string) => void;
  result: AIServiceResponse | null;
  setResult: (result: AIServiceResponse | null) => void;
  academicLevel: string;
  setAcademicLevel: (level: string) => void;
  
  summaryLength: SummaryLength;
  setSummaryLength: (length: SummaryLength) => void;
  questionDifficulty: QuestionDifficulty;
  setQuestionDifficulty: (difficulty: QuestionDifficulty) => void;
  flashcardFormat: FlashcardFormat;
  setFlashcardFormat: (format: FlashcardFormat) => void;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  topic: '',
  setTopic: (topic) => set({ topic }),
  result: null,
  setResult: (result) => set({ result }),
  academicLevel: 'UG (Undergrad)',
  setAcademicLevel: (academicLevel) => set({ academicLevel }),

  summaryLength: 'medium',
  setSummaryLength: (summaryLength) => set({ summaryLength }),
  questionDifficulty: 'medium',
  setQuestionDifficulty: (questionDifficulty) => set({ questionDifficulty }),
  flashcardFormat: 'term-definition',
  setFlashcardFormat: (flashcardFormat) => set({ flashcardFormat }),
}));
