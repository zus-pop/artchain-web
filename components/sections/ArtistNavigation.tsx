"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Giả lập dữ liệu từ file i18n của bạn

const ArtistNavigation = () => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentLanguage, setLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: 'vi' },
    { code: 'en' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const navItems = [
    { label: t.home, href: "/", active: true },
    { label: t.contests, href: "/contests" },
    { label: t.gallery, href: "/gallery" },
    { label: t.prizes, href: "/prizes" }
  ];
  // Trong ứng dụng thực tế, bạn sẽ lấy giá trị này từ state hoặc context.
const styles = `
    .nav-wrap {
      --round: 10px;
      --p-x: 8px;
      --p-y: 4px;
      --w-label: 150px;
      display: flex;
      align-items: center;
      padding: var(--p-y) var(--p-x);
      position: relative;
      border-radius: var(--round);
      max-width: 100%;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      z-index: 1;
    }

    .nav-wrap input {
      height: 0;
      width: 0;
      position: absolute;
      overflow: hidden;
      display: none;
      visibility: hidden;
    }

    .nav-label {
      cursor: pointer;
      outline: none;
      font-size: 0.875rem;
      letter-spacing: initial;
      font-weight: 500;
      color: #212121;
      background: transparent;
      padding: 12px 20px;
      width: var(--w-label);
      min-width: var(--w-label);
      text-decoration: none;
      -webkit-user-select: none;
      user-select: none;
      transition: color 0.25s ease;
      outline-offset: -6px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
      -webkit-tap-highlight-color: transparent;
      white-space: nowrap;
    }
    
    .nav-label span {
      overflow: visible;
      display: block;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nav-wrap input[class*="rd-"]:checked + a > .nav-label {
      color: #000;
    }

    .slidebar {
      position: absolute;
      height: calc(100% - (var(--p-y) * 2));
      width: var(--w-label);
      border-radius: calc(var(--round) - var(--p-y));
      background: #b8b8b8;
      transform-origin: 0 0 0;
      z-index: 1;
      transition: transform 0.5s cubic-bezier(0.33, 0.83, 0.99, 0.98);
    }

    .rd-1:checked ~ .slidebar { transform: translateX(calc(0 * var(--w-label))); }
    .rd-2:checked ~ .slidebar { transform: translateX(calc(1 * var(--w-label))); }
    .rd-3:checked ~ .slidebar { transform: translateX(calc(2 * var(--w-label))); }
    .rd-4:checked ~ .slidebar { transform: translateX(calc(3 * var(--w-label))); }
  `;


  return (
    <>
      <style>{styles}</style>
      <nav className="bg-white shadow-sm border-t border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-red-500 text-2xl font-bold mr-2">✓</div>
              <div>
                <div className="font-bold text-gray-800">Artist</div>
                <div className="text-xs text-gray-500">WORDPRESS THEME</div>
              </div>
            </div>

            {/* New Navigation Menu */}
            <div className="nav-wrap">
              {navItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  <input
                    defaultChecked={item.active}
                    type="radio"
                    id={`rd-${index + 1}`}
                    name="radio"
                    className={`rd-${index + 1}`}
                    hidden
                  />
                  <a href={item.href}>
                    <label htmlFor={`rd-${index + 1}`} className="nav-label">
                      <span>{item.label}</span>
                    </label>
                  </a>
                </React.Fragment>
              ))}
              <div className="slidebar" />
            </div>

            {/* Language Dropdown instead of Search Icon */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                <Globe className="h-4 w-4" />
                {/* <span className="hidden sm:block">
                  {currentLang.code} 
                </span> */}
                <ChevronDown className={`h-2 w-2 transition-transform duration-200 ${
                  isLanguageDropdownOpen ? "rotate-180" : ""
                }`} />
              </button>

              <AnimatePresence>
                {isLanguageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute right-0 top-full mt-2 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50"
                  >
                    <div className="py-2">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => {
                            setLanguage(language.code as 'vi' | 'en');
                            setIsLanguageDropdownOpen(false);
                          }}
                          className={`flex w-full items-center space-x-3 px-4 py-3 text-sm transition-colors duration-150 ${
                            currentLanguage === language.code
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-lg">{language.code}</span>
                          {currentLanguage === language.code && (
                            <div className="ml-auto">
                              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default ArtistNavigation;

