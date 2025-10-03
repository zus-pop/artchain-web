'use client'

import { useState } from 'react';

interface LanguageToggleProps {
  onLanguageChange?: (language: 'vi' | 'en') => void;
}

export default function LanguageToggle({ onLanguageChange }: LanguageToggleProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'vi' | 'en'>('vi');

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'vi' ? 'en' : 'vi';
    setCurrentLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1 hover:bg-white/20 transition-all duration-300"
    >
      {/* Toggle slider */}
      <div className="relative w-16 h-8 flex items-center">
        <div
          className={`absolute w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow-lg transform transition-transform duration-300 ${
            currentLanguage === 'vi' ? 'translate-x-0' : 'translate-x-8'
          }`}
        />
        
        {/* Language labels */}
        <div className="w-full flex justify-between items-center px-1 text-xs font-medium">
          <span className={`transition-colors duration-300 ${
            currentLanguage === 'vi' ? 'text-white' : 'text-white/60'
          }`}>
            VI
          </span>
          <span className={`transition-colors duration-300 ${
            currentLanguage === 'en' ? 'text-white' : 'text-white/60'
          }`}>
            EN
          </span>
        </div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}