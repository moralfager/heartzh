import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/app/egg/_lib/constants';

export type ChapterStatus = 'locked' | 'unlocked' | 'completed';

export type ChapterId = 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5';

interface ChapterProgress {
  ch1: ChapterStatus;
  ch2: ChapterStatus;
  ch3: ChapterStatus;
  ch4: ChapterStatus;
  ch5: ChapterStatus;
}

interface ProgressState {
  version: string;
  current: ChapterId;
  chapters: ChapterProgress;
  completedLetters: string[];
  startedAt: number | null;
  lastSaved: number;
  
  // Actions
  unlockChapter: (id: ChapterId) => void;
  completeChapter: (id: ChapterId, letter?: string) => void;
  setCurrentChapter: (id: ChapterId) => void;
  resetProgress: () => void;
  isChapterAccessible: (id: ChapterId) => boolean;
  getNextChapter: () => ChapterId | null;
}

const initialState = {
  version: STORAGE_KEYS.version,
  current: 'ch1' as ChapterId,
  chapters: {
    ch1: 'unlocked' as ChapterStatus,
    ch2: 'locked' as ChapterStatus,
    ch3: 'locked' as ChapterStatus,
    ch4: 'locked' as ChapterStatus,
    ch5: 'locked' as ChapterStatus,
  },
  completedLetters: [] as string[],
  startedAt: null as number | null,
  lastSaved: Date.now(),
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      unlockChapter: (id: ChapterId) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [id]: 'unlocked',
          },
          lastSaved: Date.now(),
        }));
      },

      completeChapter: (id: ChapterId, letter?: string) => {
        set((state) => {
          const newLetters = letter && !state.completedLetters.includes(letter)
            ? [...state.completedLetters, letter]
            : state.completedLetters;

          // Unlock next chapter (only if it's currently locked)
          const chapterOrder: ChapterId[] = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'];
          const currentIndex = chapterOrder.indexOf(id);
          const nextChapterId = chapterOrder[currentIndex + 1];

          const newChapters = {
            ...state.chapters,
            [id]: 'completed' as ChapterStatus,
          };

          // Only unlock next chapter if it's locked (preserve completed/unlocked status)
          if (nextChapterId && state.chapters[nextChapterId] === 'locked') {
            newChapters[nextChapterId] = 'unlocked';
          }

          return {
            chapters: newChapters,
            current: nextChapterId || id,
            completedLetters: newLetters,
            startedAt: state.startedAt || Date.now(),
            lastSaved: Date.now(),
          };
        });
      },

      setCurrentChapter: (id: ChapterId) => {
        set({
          current: id,
          lastSaved: Date.now(),
        });
      },

      resetProgress: () => {
        set(initialState);
      },

      isChapterAccessible: (id: ChapterId) => {
        const state = get();
        return state.chapters[id] !== 'locked';
      },

      getNextChapter: () => {
        const state = get();
        const chapterOrder: ChapterId[] = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'];
        const currentIndex = chapterOrder.indexOf(state.current);
        return chapterOrder[currentIndex + 1] || null;
      },
    }),
    {
      name: STORAGE_KEYS.progress,
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle version migrations if needed
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...initialState,
            ...persistedState,
          };
        }
        return persistedState as ProgressState;
      },
    }
  )
);

// Auto-save every 3 seconds
if (typeof window !== 'undefined') {
  setInterval(() => {
    const state = useProgressStore.getState();
    useProgressStore.setState({
      lastSaved: Date.now(),
    });
  }, 3000);
}

