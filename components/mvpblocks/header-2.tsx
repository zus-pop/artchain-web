"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LanguageDropdown from "@/components/LanguageDropdown";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useGetUserInfo } from "@/apis/auth";

interface NavItem {
  name: string;
  href: string;
  key: string;
}

export default function Header2() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  const { isAuthenticated, user, logout: authLogout } = useAuth();
  const userInfoQuery = useGetUserInfo();
  
  // Safe destructuring to avoid hydration issues
  const userInfo = userInfoQuery?.data;
  
  // Use API user info if available, fallback to store user
  // If API fails, still show user from store
  const displayUser = userInfo || user;
  
  // Get display name with fallbacks
  const getDisplayName = () => {
    if (displayUser?.fullName) return displayUser.fullName;
    if (displayUser?.username) return displayUser.username;
    if (isAuthenticated) return "User"; // Default name if authenticated but no user data
    return null;
  };
  
  const getAvatarInitial = () => {
    const name = getDisplayName();
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  const handleLogout = () => {
    authLogout();
    router.push("/");
  };

  const navItems: NavItem[] = [
    { name: t.home, href: "/", key: "home" },
    { name: t.contests, href: "/contests", key: "contests" },
    { name: t.gallery, href: "/gallery", key: "gallery" },
    { name: t.prizes, href: "/prizes", key: "prizes" },
  ];

  // Aggressive prefetching - preload all routes immediately
  useEffect(() => {
    const prefetchRoutes = async () => {
      const routes = ["/", "/contests", "/gallery", "/prizes", "/auth"];
      routes.forEach(route => {
        if (route !== pathname) {
          router.prefetch(route);
        }
      });
    };
    
    // Prefetch after a short delay to not block initial render
    const timer = setTimeout(prefetchRoutes, 100);
    return () => clearTimeout(timer);
  }, [pathname, router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Instant navigation handler
  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (href !== pathname) {
      router.push(href);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
        staggerChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "border-border/50 bg-background/80 border-b shadow-sm backdrop-blur-md"
            : "bg-transparent"
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                href="/"
                className="flex items-center space-x-3"
                onClick={(e) => handleNavClick("/", e)}
              >
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L3.09 8.26L12 22L20.91 8.26L12 2ZM12 4.44L18.18 9L12 19.56L5.82 9L12 4.44Z"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
                </div>
                <div className="flex flex-col">
                  <span className={`text-lg font-bold transition-colors duration-500 ${
                    isScrolled ? "text-gray-900" : "text-white"
                  }`}>
                    ArtChain
                  </span>
                  <span className={`-mt-1 text-xs transition-colors duration-500 ${
                    isScrolled ? "text-gray-600" : "text-gray-300"
                  }`}>
                    Cuộc thi nghệ thuật
                  </span>
                </div>
              </Link>
            </motion.div>

            <nav className="hidden items-center space-x-1 lg:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.key}
                    variants={itemVariants}
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.key)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(item.href, e)}
                      className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500 ${
                        isActive
                          ? isScrolled
                            ? "text-blue-600 bg-blue-50"
                            : "text-white bg-white/20"
                          : isScrolled 
                            ? "text-gray-700 hover:text-gray-900" 
                            : "text-gray-200 hover:text-white"
                      }`}
                    >
                      {(hoveredItem === item.key && !isActive) && (
                        <motion.div
                          className="bg-white/10 absolute inset-0 rounded-lg"
                          layoutId="navbar-hover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      {isActive && (
                        <motion.div
                          className={`absolute inset-0 rounded-lg ${
                            isScrolled ? "bg-blue-50" : "bg-white/20"
                          }`}
                          layoutId="navbar-active"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              className="hidden items-center space-x-3 lg:flex"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isAuthenticated ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        isScrolled 
                          ? "text-gray-700 hover:bg-gray-100" 
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        displayUser?.role === "GUARDIAN" ? "bg-green-500" : "bg-blue-500"
                      }`}>
                        {getAvatarInitial()}
                      </div>
                      <span className="max-w-32 truncate">
                        {getDisplayName() || "User"}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                        isUserDropdownOpen ? "rotate-180" : ""
                      }`} />
                    </button>

                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50"
                        >
                          <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                                displayUser?.role === "GUARDIAN" ? "bg-green-500" : "bg-blue-500"
                              }`}>
                                {getAvatarInitial()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {getDisplayName() || "User"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {displayUser?.role === "GUARDIAN" ? "Guardian" : "Competitor"}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                  {displayUser?.email || "email@example.com"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="py-2">
                            <button
                              onClick={() => {
                                // TODO: Add profile navigation
                                setIsUserDropdownOpen(false);
                              }}
                              className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                            >
                              <User className="h-4 w-4" />
                              <span>Hồ sơ cá nhân</span>
                            </button>
                            
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
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 inline-flex items-center space-x-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-200"
                  >
                    <span>{t.join}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </motion.div>
              
              <LanguageDropdown isScrolled={isScrolled} />
            </motion.div>

            <div className="flex items-center space-x-2 lg:hidden">
              <LanguageDropdown isScrolled={isScrolled} />
              <motion.button
                className={`rounded-lg p-2 transition-colors duration-500 ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variants={itemVariants}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="bg-gray-900/95 backdrop-blur-md border border-white/20 fixed top-16 right-4 z-50 w-80 overflow-hidden rounded-2xl shadow-2xl lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="space-y-6 p-6">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div key={item.key} variants={mobileItemVariants}>
                        <Link
                          href={item.href}
                          onClick={(e) => {
                            handleNavClick(item.href, e);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`block rounded-lg px-4 py-3 font-medium transition-colors duration-200 ${
                            isActive
                              ? "text-blue-300 bg-blue-500/20"
                              : "text-white hover:bg-white/10"
                          }`}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  className="border-white/20 space-y-3 border-t pt-6"
                  variants={mobileItemVariants}
                >
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className="text-white font-medium">
                          {getDisplayName() || "User"}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {displayUser?.role === "GUARDIAN" ? "Guardian" : "Competitor"}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 block w-full rounded-lg py-3 text-center font-medium transition-all duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth"
                      onClick={(e) => {
                        handleNavClick("/auth", e);
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 block w-full rounded-lg py-3 text-center font-medium transition-all duration-200"
                    >
                      {t.login}
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
