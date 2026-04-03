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

  const navItems = [
    { label: "Đấu giá", href: "/auction" },
    { label: "Danh sách", href: "/auction/list" },
    { label: "Hướng dẫn", href: "/auction/guide" },
    { label: "Luật", href: "/auction/rules" },
    { label: "Ví", href: "/me/wallet" },
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
          distortionScale={180}
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

            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-sm font-medium text-black hover:text-[#FF6E1A] transition-colors whitespace-nowrap"
              >
                Về trang chủ
              </Link>

              {isAuthenticated ? (
                <div className="relative" ref={userDropdownRef}>
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
                          <Link
                            href="/me/wallet"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <Wallet className="h-4 w-4" />
                            <span>Ví của tôi</span>
                          </Link>

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
                  className="bg-[#FF6E1A] text-white px-3 sm:px-4 lg:px-5 py-2 lg:py-2.5 text-xs sm:text-sm font-medium hover:bg-[#FF833B] inline-flex items-center space-x-2 rounded-sm transition-all duration-200"
                >
                  <span>{t.join}</span>
                </Link>
              )}
            </div>
          </div>
        </GlassSurface>
      </div>
    </>
  );
};

export default AuctionHeader;
