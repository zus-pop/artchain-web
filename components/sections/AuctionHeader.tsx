"use client";

import { useAuth } from "@/hooks/useAuth";
import { useMeQuery } from "@/hooks/useMeQuery";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LogOut,
  User,
  Wallet,
  X,
  Gavel,
  ArrowLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import GlassSurface from "@/components/GlassSurface";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store";

const AuctionHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // Auth hooks
  const { isAuthenticated, user } = useAuth();
  const { data: userData } = useMeQuery();
  const logout = useAuthStore((state) => state.logout);

  // Use userData from API if available, fallback to store user
  const displayUser = userData || user;

  // Track active tab using the same logic as the main Header
  const [activeTab, setActiveTab] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<'main' | 'account'>('main');

  const navItems = [
    { label: "Đấu giá", href: "/auction" },
    { label: "Danh sách", href: "/auction/list" },
    { label: "Hướng dẫn", href: "/auction/guide" },
    { label: "Luật", href: "/auction/rules" },
    ...(displayUser?.wallet ? [{ label: "Ví", href: "/me/wallet" }] : []),
  ];

  useEffect(() => {
    // Exact match first, then partial match for sub-paths
    const exactIndex = navItems.findIndex((item) => item.href === pathname);
    if (exactIndex !== -1) {
      setActiveTab(exactIndex);
    } else {
      // Partial match (e.g. /auction/1 matches /auction)
      const partialIndex = navItems.findIndex((item) => 
        item.href !== "/" && pathname.startsWith(item.href)
      );
      setActiveTab(partialIndex);
    }
  }, [pathname]);

  // Reset menu view when sidebar closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setTimeout(() => setMenuView('main'), 300);
    }
  }, [isMobileMenuOpen]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const getDisplayName = () => {
    return displayUser?.fullName || "User";
  };

  const getAvatarInitial = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const getWalletBalance = () => {
    const rawBalance =
      (displayUser as any)?.walletBalance ??
      (displayUser as any)?.balance ??
      (displayUser as any)?.wallet?.balance ??
      0;
    const parsed = typeof rawBalance === "number" ? rawBalance : Number(rawBalance);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const walletBalanceText = `${new Intl.NumberFormat("vi-VN").format(getWalletBalance())}đ`;

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

  return (
    <>
      <div className="fixed top-2 sm:top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-7xl pointer-events-auto relative">
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={50}
            borderWidth={0.1}
            brightness={90}
            opacity={0.4}
            blur={20}
            backgroundOpacity={0.2}
            saturation={2}
            distortionScale={180}
            overflow="visible"
            className="w-full max-w-full"
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
                  className={`text-sm font-medium whitespace-nowrap mb-[-2px] ${
                    activeTab === index
                      ? 'text-black border-b-2 border-black pb-1'
                      : 'text-black hover:text-[#FF6E1A]'
                  } transition-colors`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <Link 
                href="/"
                className="hidden lg:inline-flex text-sm font-medium text-black hover:text-[#FF6E1A] transition-colors whitespace-nowrap"
              >
                Về trang chủ
              </Link>

              {isAuthenticated ? (
                <div className="relative hidden lg:block" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 rounded-lg px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                        displayUser?.role === "GUARDIAN"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {getAvatarInitial()}
                    </div>
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
                              className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                                displayUser?.role === "GUARDIAN"
                                  ? "bg-green-600"
                                  : "bg-red-600"
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
                                  ? "Người đại diện"
                                  : "Thí sinh"}
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
                          {displayUser?.wallet && (
                            <Link
                              href="/me/wallet"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                            >
                              <Wallet className="h-4 w-4" />
                              <span>Ví của tôi</span>
                            </Link>
                          )}

                          <div className="border-t border-gray-100 my-1"></div>
 
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsUserDropdownOpen(false);
                            }}
                            className="flex cursor-pointer w-full items-center space-x-3 px-4 py-2 text-sm text-[#FF6E1A] hover:bg-[#FF6E1A]/10 transition-colors duration-150"
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
                  className="hidden lg:inline-flex bg-[#FF6E1A] text-white px-3 sm:px-4 lg:px-5 py-2 lg:py-2.5 text-xs sm:text-sm font-medium hover:bg-[#FF833B] items-center space-x-2 rounded-sm transition-all duration-200"
                >
                  <span>{t.join}</span>
                </Link>
              )}

              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 text-black hover:bg-black/5 rounded-full transition-colors shrink-0"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </GlassSurface>

        {/* Mobile menu content - Sidebar version */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
              />
              
              {/* Sidebar */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] z-[110] lg:hidden flex flex-col"
              >
                <GlassSurface
                  width="100%"
                  height="100vh"
                  borderRadius={0}
                  borderWidth={0.1}
                  brightness={95}
                  opacity={1}
                  blur={30}
                  backgroundOpacity={0.4}
                  saturation={2}
                  distortionScale={180}
                  className="shadow-2xl"
                >
                  <div className="flex flex-col h-full w-full p-6 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {menuView === 'main' ? (
                        <motion.div
                          key="auction-main-menu"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col h-full w-full"
                        >
                          <div className="flex-grow flex flex-col">
                            <div className="flex justify-between items-center mb-10 pb-4 border-b border-black/10 shrink-0">
                              <span className="font-bold text-xl text-black">Đấu giá</span>
                              <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-black/5 transition-colors"
                              >
                                <X className="h-6 w-6 text-black" />
                              </button>
                            </div>

                            <nav className="flex flex-col space-y-3 overflow-y-auto pr-2 pb-6">
                              <Link 
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-black bg-black/5 border border-black/5 hover:bg-black/10 transition-all font-semibold shrink-0"
                              >
                                <span>Về trang chủ</span>
                              </Link>

                              <div className="py-2 opacity-30 text-[10px] font-bold uppercase tracking-widest pl-2 shrink-0">Điều hướng</div>

                              {navItems.map((item, index) => (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setIsMobileMenuOpen(false);
                                    handleNavClick(item.href, e as unknown as React.MouseEvent<HTMLAnchorElement>);
                                  }}
                                  className={`px-5 py-4 rounded-2xl text-lg font-semibold transition-all border shrink-0 ${
                                    activeTab === index
                                      ? 'bg-[#FF6E1A] text-white shadow-xl scale-[1.02] border-[#FF6E1A]'
                                      : 'text-black bg-black/5 border-black/5 hover:bg-black/10 hover:border-black/10'
                                  }`}
                                >
                                  {item.label}
                                </a>
                              ))}
                            </nav>
                          </div>
                          
                          <div className="mt-auto pt-6 border-t border-black/10 shrink-0">
                            {isAuthenticated ? (
                              <button 
                                onClick={() => setMenuView('account')}
                                className="flex items-center justify-between w-full px-4 py-4 rounded-3xl bg-[#FF6E1A] border border-[#FF6E1A] hover:bg-[#FF833B] transition-all cursor-pointer group shadow-xl scale-[1.01]"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 text-white font-bold text-lg shadow-inner">
                                    {getAvatarInitial()}
                                  </div>
                                  <div className="min-w-0 text-left">
                                    <p className="font-bold text-base text-white truncate">{getDisplayName()}</p>
                                    <p className="text-[10px] text-white/80 uppercase tracking-widest font-medium">
                                      {displayUser?.role === "GUARDIAN" ? "Đại diện" : "Thí sinh"}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                  <ChevronRight className="h-5 w-5 text-white" />
                                </div>
                              </button>
                            ) : (
                              <Link
                                href="/auth"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full px-4 py-5 rounded-2xl text-lg font-bold bg-[#FF6E1A] text-white text-center shadow-lg active:scale-95 transition-transform"
                              >
                                <span>Tham Gia Ngay</span>
                                <ArrowRight className="h-5 w-5" />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="auction-account-menu"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col h-full w-full"
                        >
                          <div className="flex items-center mb-8 pb-4 border-b border-black/10 shrink-0">
                            <button 
                              onClick={() => setMenuView('main')}
                              className="p-2 mr-3 rounded-full hover:bg-black/5 transition-colors"
                            >
                              <ArrowLeft className="h-6 w-6 text-black" />
                            </button>
                            <span className="font-bold text-xl text-black">Tài khoản</span>
                          </div>

                          <div className="flex flex-col space-y-3 overflow-y-auto pr-2 pb-6">
                            <div className="flex items-center space-x-4 mb-4 px-4 py-5 rounded-3xl bg-[#FF6E1A] border border-[#FF6E1A] shadow-xl shrink-0">
                              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/20 text-white font-bold text-xl shadow-inner">
                                {getAvatarInitial()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-lg text-white truncate">{getDisplayName()}</p>
                                <p className="text-xs text-white/80 uppercase tracking-widest font-medium">
                                  {displayUser?.role === "GUARDIAN" ? "Đại diện" : "Thí sinh"}
                                </p>
                              </div>
                            </div>

                            <Link 
                              href="/me" 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-black bg-black/5 border border-black/5 hover:bg-black/10 hover:border-black/10 transition-all font-semibold shrink-0"
                            >
                              <div className="w-10 h-10 rounded-xl bg-[#FF6E1A] flex items-center justify-center shadow-md">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <span>Hồ sơ cá nhân</span>
                            </Link>
                            <Link 
                              href="/me/wallet" 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-black bg-black/5 border border-black/5 hover:bg-black/10 hover:border-black/10 transition-all font-semibold shrink-0"
                            >
                              <div className="w-10 h-10 rounded-xl bg-[#FF6E1A] flex items-center justify-center shadow-md">
                                <Wallet className="h-5 w-5 text-white" />
                              </div>
                              <span>Ví tiền của tôi</span>
                            </Link>
                          </div>
                          
                          <div className="mt-auto pt-6 border-t border-black/10 shrink-0">
                            <button 
                              onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                              }}
                              className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-[#FF6E1A] bg-[#FF6E1A]/5 border border-[#FF6E1A]/10 hover:bg-[#FF6E1A]/10 transition-all font-bold"
                            >
                              <div className="w-10 h-10 rounded-xl bg-[#FF6E1A] flex items-center justify-center shadow-md">
                                <LogOut className="h-5 w-5 text-white" />
                              </div>
                              <span>Đăng xuất tài khoản</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </GlassSurface>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
};

export default AuctionHeader;
