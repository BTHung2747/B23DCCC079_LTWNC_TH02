import { create } from 'zustand';
import type { Exercise } from '../../kieuDuLieu';

export interface SessionState {
  queue: Exercise[];
  currentIndex: number;
  isRunning: boolean;
  elapsed: number;
  startSession: (exercises: Exercise[], startIndex?: number) => void;
  toggleRun: () => void;
  next: () => void;
  prev: () => void;
  addToSession: (exercise: Exercise) => void;
  tick: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isRunning: false,
  elapsed: 0,
  startSession: (exercises, startIndex = 0) => {
    const valid = exercises.length > 0 && Number.isInteger(startIndex) && startIndex >= 0 && startIndex < exercises.length;
    set({ queue: [...exercises], currentIndex: valid ? startIndex : -1, isRunning: valid, elapsed: 0 });
  },
  toggleRun: () => {
    const { queue, currentIndex, isRunning, elapsed } = get();
    if (queue.length === 0) return;
    if (currentIndex === -1) {
      set({ currentIndex: 0, elapsed: 0, isRunning: true });
      return;
    }
    const finished = elapsed >= queue[currentIndex].duration;
    set({ isRunning: !isRunning, ...(finished ? { elapsed: 0 } : {}) });
  },
  next: () => {
    const { currentIndex, queue } = get();
    if (currentIndex < 0) return;
    if (currentIndex >= queue.length - 1) {
      set({ isRunning: false });
      return;
    }
    set({ currentIndex: currentIndex + 1, elapsed: 0 });
  },
  prev: () => {
    const { currentIndex, elapsed } = get();
    if (currentIndex < 0) return;
    set({ currentIndex: elapsed > 3 ? currentIndex : Math.max(0, currentIndex - 1), elapsed: 0 });
  },
  addToSession: (exercise) => {
    if (!get().queue.some((item) => item.id === exercise.id)) {
      set((state) => ({ queue: [...state.queue, exercise] }));
    }
  },
  tick: () => {
    const { isRunning, currentIndex, queue, elapsed } = get();
    const exercise = queue[currentIndex];
    if (!isRunning || !exercise) return;
    const nextElapsed = Math.min(elapsed + 1, exercise.duration);
    set({ elapsed: nextElapsed });
    if (nextElapsed >= exercise.duration) get().next();
  },
}));
