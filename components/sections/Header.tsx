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
  User,
  Archive,
  Wallet,
  Gavel,
  X,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import GlassSurface from "@/components/GlassSurface";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
// Avatar will be rendered as an initial-letter circle; no Next/Image needed here

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Khởi tạo activeTab với -1 để mặc định không có tab nào active nếu defaultTab = 0 không khớp
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [menuView, setMenuView] = useState<'main' | 'account'>('main');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
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
      { label: t.posts, href: "/posts" },
      { label: t.campaignTitle, href: "/campaigns" },
      { label: t.gallery, href: "/gallery" },
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

  // Reset menu view when sidebar closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setTimeout(() => setMenuView('main'), 300);
    }
  }, [isMobileMenuOpen]);

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
    .rd-5:checked ~ .slidebar { transform: translateX(calc(4 * var(--w-label))); opacity: 1; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="fixed top-2 sm:top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-7xl pointer-events-auto relative">
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={50}
            backgroundOpacity={0.58}
            blur={5}
            saturation={3}
            brightness={54}
            opacity={1}
            displace={0.5}
            distortionScale={180}
            redOffset={0}
            greenOffset={10}
            blueOffset={20}
            className="w-full max-w-full"
            overflow="visible"
          >
            <div className="w-full px-4 sm:px-6 lg:px-12 py-4 flex justify-between items-center gap-2">
              <Link href="/" className="flex items-center shrink-0">
                <img src="/images/newlogo.png" alt="Artchain Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </Link>

              <nav className="hidden lg:flex gap-6 mx-auto">
                {navItems.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href, e as unknown as React.MouseEvent<HTMLAnchorElement>);
                    }}
                    className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                      activeTab === index
                        ? 'text-black border-b-2 border-black pb-1'
                        : 'text-black hover:text-black'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <div className="hidden lg:flex items-center">
                  {displayUser?.wallet && (
                    <Link 
                      href="/auction"
                      className="text-xs sm:text-sm font-medium text-black hover:text-[#FF6E1A] transition-colors whitespace-nowrap mr-4"
                    >
                      Đấu giá
                    </Link>
                  )}
                </div>

                {isAuthenticated ? (
                  <div className="relative hidden lg:block" ref={userDropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-1 sm:space-x-2 rounded-lg py-1 cursor-pointer"
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
                      <ChevronDown className={`h-4 w-4 text-black transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 z-[60]"
                        >
                          <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                            <p className="text-sm font-bold text-gray-900 truncate">{getDisplayName()}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                              {displayUser?.role === "GUARDIAN" ? "Đại diện" : "Thí sinh"}
                            </p>
                          </div>
                          <div className="py-1">
                            <Link href="/me" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <User className="h-4 w-4" />
                              <span>Hồ sơ</span>
                            </Link>
                            <Link href="/auction" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Gavel className="h-4 w-4" />
                              <span>Đấu giá</span>
                            </Link>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button onClick={handleLogout} className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-[#FF6E1A] hover:bg-red-50">
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
                    className="hidden lg:inline-flex bg-[#FF6E1A] text-white px-3 sm:px-5 py-2 text-xs font-bold hover:bg-[#FF833B] rounded-sm transition-all shadow-md active:scale-95 shrink-0"
                  >
                    Tham Gia
                  </Link>
                )}

                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-1.5 text-black hover:bg-black/5 rounded-full transition-colors shrink-0"
                >
                  {isMobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
                borderRadius={50}
                borderWidth={0.1}
                brightness={54}
                opacity={1}
                blur={5}
                backgroundOpacity={0.58}
                saturation={3}
                distortionScale={180}
                displace={0.5}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
                className="shadow-2xl"
              >
                <div className="w-full px-3 sm:px-6 lg:px-16 flex justify-between items-center gap-2 sm:gap-3">
                  <AnimatePresence mode="wait">
                    {menuView === 'main' ? (
                      <motion.div
                        key="main-menu"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col h-full w-full"
                      >
                        <div className="flex-grow flex flex-col">
                          <div className="flex justify-between items-center mb-10 pb-4 border-b border-black/10 shrink-0">
                            <span className="font-bold text-xl text-black">ArtChain</span>
                            <button 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="p-2 rounded-full hover:bg-black/5 transition-colors"
                            >
                              <X className="h-6 w-6 text-black" />
                            </button>
                          </div>

                          <nav className="flex flex-col space-y-4 overflow-y-auto pr-2 pb-6">
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
                        key="account-menu"
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
                          <div className="flex items-center space-x-4 mb-4 px-4 py-5 rounded-3xl bg-[#FF6E1A] border border-[#FF6E1A] shadow-xl">
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
                            className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-black bg-black/5 border border-black/5 hover:bg-black/10 hover:border-black/10 transition-all font-semibold"
                          >
                            <div className="w-10 h-10 rounded-xl bg-[#FF6E1A] flex items-center justify-center shadow-md">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <span>Hồ sơ cá nhân</span>
                          </Link>
                          <Link 
                            href="/auction" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-black bg-black/5 border border-black/5 hover:bg-black/10 hover:border-black/10 transition-all font-semibold"
                          >
                            <div className="w-10 h-10 rounded-xl bg-[#FF6E1A] flex items-center justify-center shadow-md">
                              <Gavel className="h-5 w-5 text-white" />
                            </div>
                            <span>Đấu giá trực tuyến</span>
                          </Link>
                          <Link 
                            href="/me/wallet" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-black bg-black/5 border border-black/5 hover:bg-black/10 hover:border-black/10 transition-all font-semibold"
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

      {/* Content area for active tab */}
      {activeContent && <div className="w-full">{activeContent}</div>}

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
        confirmText="Đăng xuất"
        variant="destructive"
      />
    </>
  );
};

export default Header;
