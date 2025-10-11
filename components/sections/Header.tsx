"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import {
  ChevronDown,
  Globe,
  User,
  Settings,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutMutation } from "@/hooks/useLogoutMutation";
import { useMeQuery } from "@/hooks/useMeQuery";

interface ArtistNavigationProps {
  children?: React.ReactNode;
  defaultTab?: number;
}

const Header: React.FC<ArtistNavigationProps> = ({ 
  children,
  defaultTab = 0
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  // Khởi tạo activeTab với -1 để mặc định không có tab nào active nếu defaultTab = 0 không khớp
  const [activeTab, setActiveTab] = useState(defaultTab);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { currentLanguage, setLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // Auth hooks
  const { isAuthenticated, user } = useAuth();
  const { data: userData } = useMeQuery();
  const { mutate: logout } = useLogoutMutation();

  // Use userData from API if available, fallback to store user
  const displayUser = userData || user;

  // Handle tab change
  const handleTabChange = (index: number, href: string) => {
    setActiveTab(index);
    // Use Next.js router for client-side navigation
    router.push(href);
  };

  // Get children as array to render based on activeTab
  const childrenArray = React.Children.toArray(children);
  // Sử dụng activeContent chỉ khi activeTab hợp lệ
  const activeContent = activeTab !== -1 ? childrenArray[activeTab] : null;

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper functions for user display
  const getDisplayName = () => {
    return displayUser?.fullName || displayUser?.username || "User";
  };

  const getAvatarInitial = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavClick = (
    href: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    router.push(href);
  };

  const languages = [{ code: "vi" }, { code: "en" }];

  const navItems = React.useMemo(() => [
    { label: t.home, href: "/", active: true },
    { label: t.contests, href: "/contests" },
    { label: t.gallery, href: "/gallery" },
    { label: t.prizes, href: "/prizes" },
  ], [t]);

  // Update active tab based on current route
  // 💡 SỬA ĐỔI CHỦ YẾU Ở ĐÂY: Luôn gọi setActiveTab với currentIndex.
  // Nếu currentIndex là -1 (không khớp), không có tab nào được active.
  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.href === pathname);
    setActiveTab(currentIndex);
  }, [pathname, navItems]);
  
  // Trong ứng dụng thực tế, bạn sẽ lấy giá trị này từ state hoặc context.
  const styles = `
    .nav-wrap {
      --round: 10px;
      --p-x: 8px;
      --p-y: 4px;
      --w-label: 100px;
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
      /* 💡 THÊM: Ẩn slidebar nếu không có radio nào được chọn */
      opacity: 0;
    }

    /* 💡 SỬA ĐỔI: Chỉ hiện slidebar khi có radio button được checked */
    .rd-1:checked ~ .slidebar { transform: translateX(calc(0 * var(--w-label))); opacity: 1; }
    .rd-2:checked ~ .slidebar { transform: translateX(calc(1 * var(--w-label))); opacity: 1; }
    .rd-3:checked ~ .slidebar { transform: translateX(calc(2 * var(--w-label))); opacity: 1; }
    .rd-4:checked ~ .slidebar { transform: translateX(calc(3 * var(--w-label))); opacity: 1; }
  `;

  return (
    <>
      <style>{styles}</style>
      <nav className="bg-white shadow-sm border-t border-gray-200 sticky top-0 z-50">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center flex-shrink-0 cursor-pointer"
            >
              {/* Thêm cursor-pointer để hiển thị đây là một liên kết */}
              <div className="text-red-500 text-2xl font-bold mr-2">✓</div>
              <div>
                <div className="font-bold text-gray-800">Artist</div>
                <div className="text-xs text-gray-500">WORDPRESS THEME</div>
              </div>
            </Link>

            {/* New Navigation Menu */}
            <div className="nav-wrap">
              {navItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  <input
                    checked={activeTab === index}
                    onChange={() => handleTabChange(index, item.href)}
                    type="radio"
                    id={`rd-${index + 1}`}
                    name="radio"
                    className={`rd-${index + 1}`}
                    hidden
                  />
                  <Link href={item.href} onClick={(e) => handleNavClick(item.href, e)}>
                    <label htmlFor={`rd-${index + 1}`} className="nav-label cursor-pointer">
                      <span>{item.label}</span>
                    </label>
                  </Link>
                </React.Fragment>
              ))}
              <div className="slidebar" />
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* User Auth Section */}
              {isAuthenticated ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        displayUser?.role === "GUARDIAN"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {getAvatarInitial()}
                    </div>
                    <span className="max-w-32 truncate">
                      {getDisplayName()}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isUserDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                        className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50"
                      >
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                                displayUser?.role === "GUARDIAN"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            >
                              {getAvatarInitial()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {getDisplayName()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {displayUser?.role === "GUARDIAN"
                                  ? "Guardian"
                                  : "Competitor"}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {displayUser?.email || "email@example.com"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link
                            href="/me"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <User className="h-4 w-4" />
                            <span>Hồ sơ cá nhân</span>
                          </Link>

                          <button
                            onClick={() => {
                              // TODO: Add settings navigation
                              setIsUserDropdownOpen(false);
                            }}
                            className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Cài đặt</span>
                          </button>

                          <div className="border-t border-gray-100 my-1"></div>

                          <button
                            onClick={() => {
                              handleLogout();
                              setIsUserDropdownOpen(false);
                            }}
                            className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth"
                  onClick={(e) => handleNavClick("/auth", e)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 inline-flex items-center space-x-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-200"
                >
                  <span>{t.join}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              {/* Language Dropdown */}
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() =>
                    setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                  }
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  <Globe className="h-4 w-4" />
                  <ChevronDown
                    className={`h-2 w-2 transition-transform duration-200 ${
                      isLanguageDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isLanguageDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      className="absolute right-0 top-full mt-2 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50"
                    >
                      <div className="py-2">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => {
                              setLanguage(language.code as "vi" | "en");
                              setIsLanguageDropdownOpen(false);
                            }}
                            className={`flex w-full items-center space-x-3 px-4 py-3 text-sm transition-colors duration-150 ${
                              currentLanguage === language.code
                                ? "bg-red-50 text-red-600"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-lg">{language.code}</span>
                            {currentLanguage === language.code && (
                              <div className="ml-auto">
                                <div className="h-2 w-2 rounded-full bg-red-600"></div>
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
        </div>
      </nav>
      
      {/* Content area for active tab */}
      {activeContent && (
        <div className="w-full">
          {activeContent}
        </div>
      )}
    </>
  );
};

export default Header;