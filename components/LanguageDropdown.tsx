'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguageStore, Language } from '@/store/language-store';

const languages = [
  { code: 'vi' as Language, name: 'Tiếng Việt'},
  { code: 'en' as Language, name: 'English' }
];

interface LanguageDropdownProps {
  isScrolled?: boolean;
}

export default function LanguageDropdown({ isScrolled = false }: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage } = useLanguageStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (languageCode: Language) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-500 ${
          isScrolled
            ? "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Change Language"
      >
        <Globe className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-16 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50"
          >
                        <div className="py-1">
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center justify-center px-2 py-2 text-center hover:bg-white/10 transition-colors duration-150 ${
                    currentLanguage === language.code 
                      ? 'bg-white/10 text-blue-400' 
                      : 'text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="text-xs font-medium">{language.code.toUpperCase()}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}