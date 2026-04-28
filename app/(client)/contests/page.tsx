"use client";

import { useGetContestsPaginated } from "@/apis/contests";
import { formatDate } from "@/lib/utils";
import { ContestStatus } from "@/types/contest";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trophy, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import GlassSurface from "@/components/GlassSurface";

// ── Design tokens ──────────────
const TOKEN = {
  primary: "#FF6E1A",
  primaryHover: "#FF833B",
  textPrimary: "#423137",
  bg: "#EAE6E0",
};

// ── Status config ────────────────
type StatusKey = "UPCOMING" | "ACTIVE" | "DRAFT" | "ENDED" | "COMPLETED" | "CANCELLED" | "ALL";

const statusConfig: Record<StatusKey, { label: string; color: string; dot: string }> = {
  UPCOMING: { label: "Sắp diễn ra", color: "bg-blue-100 text-blue-600",   dot: "bg-blue-500" },
  ACTIVE:   { label: "Đang diễn ra", color: "bg-green-100 text-green-600", dot: "bg-green-500" },
  DRAFT:    { label: "Bản nháp",     color: "bg-gray-100 text-gray-600",   dot: "bg-gray-400" },
  ENDED:    { label: "Đã kết thúc",  color: "bg-orange-100 text-orange-600", dot: "bg-orange-400" },
  COMPLETED:{ label: "Hoàn thành",   color: "bg-purple-100 text-purple-600", dot: "bg-purple-500" },
  CANCELLED:{ label: "Đã hủy",       color: "bg-gray-100 text-gray-600",   dot: "bg-gray-500" },
  ALL:      { label: "Tất cả",       color: "bg-gray-100 text-gray-600",   dot: "bg-gray-300" },
};

const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/600x400/EAE6E0/423137?text=No+Image";

// ── Helper to strip markdown ────────────────
const cleanMarkdown = (text: string | undefined) => {
  if (!text) return "";
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/(\*\*|\*|__|_)(.*?)\1/g, "$2")
    .replace(/^\s*[->*+]\s/gm, "")
    .replace(/\s+/g, " ")
    .trim();
};

// ── Circular Trajectory Icon Overlay (from InteractivePostCard) ────────────────
const InteractiveOverlay = ({ isGrid = false }: { isGrid?: boolean }) => (
  <div className={`absolute top-0 right-0 ${isGrid ? 'w-32 h-32' : 'w-40 h-40'} pointer-events-none overflow-hidden z-40`}>
    <div className={`absolute ${isGrid ? '-top-16 -right-16 w-32 h-32' : '-top-20 -right-20 w-40 h-40'} origin-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] rotate-[-90deg] group-hover:rotate-0`}>
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <GlassSurface 
          width={isGrid ? 48 : 56} 
          height={isGrid ? 48 : 56} 
          borderRadius={isGrid ? 24 : 28} 
          brightness={120} 
          opacity={0.9}
          blur={8}
          className="items-center justify-center shadow-2xl border border-white/60"
        >
          <div className="flex items-center justify-center w-full h-full text-[var(--site-ink)]">
            <svg 
              className={`${isGrid ? 'w-5 h-5' : 'w-6 h-6'} transition-transform duration-500 group-hover:rotate-12`} 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 4V20M12 4L18 10M12 4L6 10" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="rotate-45 origin-center"
              />
            </svg>
          </div>
        </GlassSurface>
      </div>
    </div>
  </div>
);

// ── Skeleton Components ────────────────
const SkeletonFeatured = ({ reverse = false }: { reverse?: boolean }) => (
  <div className="flex flex-col animate-pulse">
    <div className={`flex flex-col ${reverse ? "md:flex-col-reverse" : ""}`}>
      <div className={`mb-8 ${reverse ? "mt-8 pl-8" : "pr-8"}`}>
        <div className="h-4 w-24 bg-[#423137]/10 rounded-full mb-4" />
        <div className="h-10 bg-[#423137]/20 rounded w-4/5 mb-4" />
        <div className="h-4 bg-[#423137]/10 rounded w-full" />
      </div>
      <div className="aspect-[1.15/1] bg-[#423137]/10 rounded-[2rem]" />
    </div>
  </div>
);

const SkeletonGridCard = () => (
  <div className="flex flex-col bg-white border border-[#e6e2da] rounded-md overflow-hidden animate-pulse">
    <div className="aspect-video bg-[#423137]/10" />
    <div className="p-6 space-y-4">
      <div className="h-6 w-32 bg-[#423137]/10 rounded-full" />
      <div className="h-6 bg-[#423137]/20 rounded w-full" />
    </div>
  </div>
);

// ── Animated Image Component ────────────────
const ZoomImage = ({ src, alt, className = "", isGrid = false }: { src: string; alt: string; className?: string; isGrid?: boolean }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <motion.div
      initial={{ scale: 1.2 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="w-full h-full"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:blur-[2px]"
      />
    </motion.div>
    
    <InteractiveOverlay isGrid={isGrid} />
    
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none z-30" />
  </div>
);

// ── Main page ────────────────
export default function ContestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<ContestStatus | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; 

  // Fetch ALL contests once
  const { data: contests, isLoading, error } = useGetContestsPaginated(
    undefined, 
    currentPage,
    itemsPerPage
  );

  const { featuredContests, gridContests, totalAvailable } = useMemo(() => {
    if (!contests) return { featuredContests: [], gridContests: [], totalAvailable: 0 };
    
    const all = contests
      .filter((c) => c.status !== "DRAFT")
      .sort((a, b) => {
        if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
        if (a.status !== "ACTIVE" && b.status === "ACTIVE") return 1;
        return 0;
      });

    // Top 2 are always shown here
    const featured = all.slice(0, 2);
    
    // Grid includes EVERYTHING from the list, filtered by status
    let grid = [...all];
    if (selectedStatus) {
      grid = grid.filter((c) => c.status === selectedStatus);
    }

    return { featuredContests: featured, gridContests: grid, totalAvailable: all.length };
  }, [contests, selectedStatus]);

  const filterOptions: { label: string; value: ContestStatus | undefined }[] = [
    { label: "Tất cả",         value: undefined },
    { label: "Đang diễn ra",   value: "ACTIVE" },
    { label: "Sắp diễn ra",    value: "UPCOMING" },
    { label: "Đã kết thúc",    value: "ENDED" },
    { label: "Hoàn thành",     value: "COMPLETED" },
  ];

  if (isLoading) {
    return (
      <div className="w-full pt-32 px-4 sm:px-8 lg:px-16 min-h-screen bg-[#EAE6E0]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-24">
             <SkeletonFeatured />
             <SkeletonFeatured reverse />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonGridCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-32 px-4 flex items-center justify-center min-h-screen bg-[#EAE6E0]">
        <p className="text-sm text-gray-500">Có lỗi xảy ra khi tải dữ liệu cuộc thi.</p>
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-24 bg-[#EAE6E0] min-h-screen px-4 sm:px-8 lg:px-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#423137] leading-[1.1] tracking-tight">
              Khơi nguồn sáng tạo, <br />
              kết nối những tâm hồn.
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              href="/gallery" 
              className="group flex items-center gap-2 text-sm font-bold text-[#423137] hover:text-[#FF6E1A] transition-colors"
            >
              Xem triển lãm tranh
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ── Featured Section ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {featuredContests[0] && (
            <Link href={`/contests/${featuredContests[0].contestId}`} className="group flex flex-col">
              <div className="mb-8 pr-8">
                 <div className="flex items-center gap-3 mb-4">
                   <span className={`text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase ${statusConfig[featuredContests[0].status as StatusKey]?.color || 'bg-gray-100'}`}>
                     {statusConfig[featuredContests[0].status as StatusKey]?.label}
                   </span>
                   <span className="text-[12px] font-medium text-[#423137]/40">
                     {formatDate({ dateString: featuredContests[0].startDate })}
                   </span>
                 </div>
                 <h2 className="text-3xl lg:text-4xl font-bold text-[#423137] leading-[1.15] mb-4 group-hover:text-[#FF6E1A] transition-colors">
                   {featuredContests[0].title}
                 </h2>
                 <p className="text-sm text-[#423137]/60 leading-relaxed line-clamp-2">
                   {cleanMarkdown(featuredContests[0].description)}
                 </p>
              </div>
              <ZoomImage 
                src={featuredContests[0].bannerUrl ?? PLACEHOLDER_IMAGE_URL}
                alt={featuredContests[0].title}
                className="aspect-[1.15/1] rounded-[2rem] shadow-xl border border-white/20"
              />
            </Link>
          )}

          {featuredContests[1] && (
            <Link href={`/contests/${featuredContests[1].contestId}`} className="group flex flex-col">
              <ZoomImage 
                src={featuredContests[1].bannerUrl ?? PLACEHOLDER_IMAGE_URL}
                alt={featuredContests[1].title}
                className="aspect-[1.15/1] rounded-[2rem] shadow-xl border border-white/20 mb-8"
              />
              <div className="pl-8">
                 <div className="flex items-center gap-3 mb-4">
                   <span className={`text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase ${statusConfig[featuredContests[1].status as StatusKey]?.color || 'bg-gray-100'}`}>
                     {statusConfig[featuredContests[1].status as StatusKey]?.label}
                   </span>
                   <span className="text-[12px] font-medium text-[#423137]/40">
                     {formatDate({ dateString: featuredContests[1].startDate })}
                   </span>
                 </div>
                 <h2 className="text-3xl lg:text-4xl font-bold text-[#423137] leading-[1.15] mb-4 group-hover:text-[#FF6E1A] transition-colors">
                   {featuredContests[1].title}
                 </h2>
                 <p className="text-sm text-[#423137]/60 leading-relaxed line-clamp-2">
                   {cleanMarkdown(featuredContests[1].description)}
                 </p>
              </div>
            </Link>
          )}
        </div>

        {/* ── Filter bar ── */}
        <div className="mb-12 mt-12">
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#423137]/40 uppercase mb-5">
            Tất cả cuộc thi
          </p>
          <div className="flex flex-wrap gap-2.5">
            {filterOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  setSelectedStatus(option.value);
                  setCurrentPage(1);
                }}
                className={`text-[11px] font-bold tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 ${
                  selectedStatus === option.value
                    ? "bg-[#423137] text-white shadow-lg shadow-[#423137]/20"
                    : "bg-white/50 border border-[#423137]/10 text-[#423137]/60 hover:bg-white hover:text-[#423137]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid Section (Shows ALL contests including featured ones) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStatus || "all"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {gridContests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridContests.map((contest, index) => {
                  const status = statusConfig[contest.status as StatusKey] ?? statusConfig.ALL;

                  return (
                    <motion.div
                      key={contest.contestId}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/contests/${contest.contestId}`} className="group block h-full">
                        <div className="flex flex-col h-full bg-white border border-[#e6e2da] shadow-sm rounded-md overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                          <div className="relative w-full aspect-video overflow-hidden border-b border-[#e6e2da]">
                            <ZoomImage
                              src={contest.bannerUrl ?? PLACEHOLDER_IMAGE_URL}
                              alt={contest.title}
                              className="w-full h-full"
                              isGrid
                            />
                          </div>
                          <div className="flex flex-col flex-1 p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <span className={`text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase ${status.color}`}>
                                {status.label}
                              </span>
                              <span className="text-[10px] font-semibold text-[#423137]/40">
                                {formatDate({ dateString: contest.startDate })}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-[#423137] leading-tight group-hover:text-[#FF6E1A] transition-colors line-clamp-2">
                              {contest.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-32 bg-white/10 rounded-3xl border border-dashed border-[#423137]/10">
                <Trophy className="h-12 w-12 text-[#423137]/10 mx-auto mb-6" />
                <p className="text-base font-semibold text-[#423137]/30">Không tìm thấy cuộc thi nào</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Pagination ── */}
        {totalAvailable > itemsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-14">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-sm border border-[#423137]/20 text-[#423137]/60 hover:border-[#FF6E1A] hover:text-[#FF6E1A] transition-colors duration-200 disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Trước
            </button>
            <span className="text-sm font-bold text-[#423137] px-4">{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={totalAvailable <= currentPage * itemsPerPage}
              className="flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-sm border border-[#423137]/20 text-[#423137]/60 hover:border-[#FF6E1A] hover:text-[#FF6E1A] transition-colors duration-200 disabled:opacity-30"
            >
              Sau <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
