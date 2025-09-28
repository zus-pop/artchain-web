import { create } from 'zustand';

export type Language = 'vi' | 'en';

interface LanguageStore {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  currentLanguage: 'vi',
  setLanguage: (language) => set({ currentLanguage: language }),
}));