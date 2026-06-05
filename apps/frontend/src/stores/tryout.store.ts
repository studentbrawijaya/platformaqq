import { create } from 'zustand';

interface TryoutStore {
  sessionId: string | null;
  answers: Record<string, string[]>;
  flagged: Set<string>;
  currentIndex: number;
  saveAnswer: (questionId: string, answer: string[]) => void;
  clearSession: () => void;
}

export const useTryoutStore = create<TryoutStore>((set) => ({
  sessionId: null,
  answers: {},
  flagged: new Set<string>(),
  currentIndex: 0,
  saveAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  clearSession: () =>
    set({
      sessionId: null,
      answers: {},
      flagged: new Set<string>(),
      currentIndex: 0,
    }),
}));
