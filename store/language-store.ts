import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'vi' | 'en';

interface LanguageStore {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      currentLanguage: 'vi',
      setLanguage: (language) => set({ currentLanguage: language }),
    }),
    {
      name: 'language-storage',
    }
  )
);