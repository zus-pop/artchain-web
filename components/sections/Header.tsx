"use client";

import { useAuth } from "@/hooks/useAuth";
import { useMeQuery } from "@/hooks/useMeQuery";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Globe,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import GlassSurface from "@/components/GlassSurface";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store";

interface ArtistNavigationProps {
  children?: React.ReactNode;
  defaultTab?: number;
}

const Header: React.FC<ArtistNavigationProps> = ({
  children,
  defaultTab = 0,
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
  const logout = useAuthStore((state) => state.logout);

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
    return displayUser?.fullName || "User";
  };

  const getAvatarInitial = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const handleNavClick = (
    href: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    router.push(href);
  };

  const languages = [{ code: "vi" }, { code: "en" }];

  const navItems = React.useMemo(
    () => [
      { label: t.home, href: "/", active: true },
      { label: t.contests, href: "/contests" },
      { label: t.gallery, href: "/gallery" },
      { label: t.posts, href: "/posts" },
    ],
    [t]
  );

  // Update active tab based on current route
  // 💡 SỬA ĐỔI CHỦ YẾU Ở ĐÂY: Luôn gọi setActiveTab với currentIndex.
  // Nếu currentIndex là -1 (không khớp), không có tab nào được active.
  useEffect(() => {
    const currentIndex = navItems.findIndex((item) => item.href === pathname);
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
      {/* Header styled as GlassSurface (from news page) but keeping header logic */}
      <div className="fixed top-2 sm:top-5 left-2 sm:left-4 right-2 sm:right-4 lg:left-0 lg:right-0 z-50 flex justify-center">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={50}
          backgroundOpacity={0.58}
          blur={5}
          saturation={3}
          brightness={54}
          opacity={1}
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          className="max-w-7xl w-full overflow-visible"
          style={{ justifyContent: "flex-start" }}
        >
          <div className="w-full px-3 sm:px-6 lg:px-16 flex justify-between items-center gap-2 sm:gap-3">
            <Link href="/" className="flex items-center shrink-0">
              <img src="/images/newlogo.png" alt="Artchain Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain mr-3" />
            </Link>

            <nav className="hidden lg:flex gap-6">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href, e as unknown as React.MouseEvent<HTMLAnchorElement>);
                  }}
                  className={`text-sm font-medium whitespace-nowrap ${
                    activeTab === index
                      ? 'text-black border-b-2 border-black pb-1'
                      : 'text-black hover:text-black'
                  } transition-colors`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button className="lg:hidden p-2 text-black hover:text-black">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              {/* Keep existing right-side actions (auth + language) */}
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
                    <span className="max-w-32 truncate">{getDisplayName()}</span>
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
                        className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-[60]"
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
                            className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-[#FF6E1A] hover:bg-[#FF6E1A]/10 transition-colors duration-150"
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
                  className="bg-[#FF6E1A] text-white px-3 sm:px-4 lg:px-5 py-2 lg:py-2.5 text-xs sm:text-sm font-medium hover:bg-[#FF833B] inline-flex items-center space-x-2 rounded-sm transition-all duration-200"
                >
                  <span>{t.join}</span>
                </Link>
              )}

              {/* Language Dropdown */}
              {/* <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
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
              </div> */}
            </div>
          </div>
        </GlassSurface>
      </div>

      {/* Content area for active tab */}
      {activeContent && <div className="w-full">{activeContent}</div>}
    </>
  );
};

export default Header;
