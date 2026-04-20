"use client";

import { useGetContestsPaginated } from "@/apis/contests";
import { formatDate } from "@/lib/utils";
import { ContestStatus } from "@/types/contest";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ── Design tokens (mirrors globals.css / existing product tokens) ──────────────
const TOKEN = {
  primary: "#FF6E1A",
  primaryHover: "#FF833B",
  textPrimary: "#423137",
  bg: "#EAE6E0",
};

// ── Status config ──────────────────────────────────────────────────────────────
type StatusKey = "UPCOMING" | "ACTIVE" | "DRAFT" | "ENDED" | "COMPLETED" | "CANCELLED" | "ALL";

const statusConfig: Record<StatusKey, { label: string; dot: string }> = {
  UPCOMING: { label: "Sắp diễn ra", dot: "bg-blue-500" },
  ACTIVE:   { label: "Đang diễn ra", dot: "bg-green-500" },
  DRAFT:    { label: "Bản nháp",     dot: "bg-gray-400" },
  ENDED:    { label: "Đã kết thúc",  dot: "bg-orange-400" },
  COMPLETED:{ label: "Hoàn thành",   dot: "bg-purple-500" },
  CANCELLED:{ label: "Đã hủy",       dot: "bg-gray-500" },
  ALL:      { label: "Tất cả",       dot: "bg-gray-300" },
};

const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/600x400/EAE6E0/423137?text=No+Image";

// ── Skeleton card ──────────────────────────────────────────────────────────────
const SkeletonContestCard = () => (
  <div className="flex flex-col overflow-hidden animate-pulse">
    {/* Banner */}
    <div className="w-full aspect-video bg-[#423137]/10" />
    {/* Body */}
    <div className="pt-3 pb-1">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        <div className="h-3 bg-gray-300 rounded w-20" />
      </div>
      <div className="h-4 bg-gray-300 rounded mb-1.5 w-4/5" />
      <div className="h-4 bg-gray-300 rounded w-3/5" />
      <div className="flex items-center justify-between mt-4">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-300 rounded-sm w-24" />
      </div>
    </div>
  </div>
);

// ── Main page ──────────────────────────────────────────────────────────────────
export default function ContestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<ContestStatus | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: contests, isLoading, error } = useGetContestsPaginated(
    selectedStatus,
    currentPage,
    itemsPerPage
  );

  const filteredContests = contests?.filter((c) => c.status !== "DRAFT") || [];
  const totalPages =
    filteredContests.length === itemsPerPage ? currentPage + 1 : currentPage;

  const filterOptions: { label: string; value: ContestStatus | undefined }[] = [
    { label: "Tất cả",         value: undefined },
    { label: "Đang diễn ra",   value: "ACTIVE" },
    { label: "Sắp diễn ra",    value: "UPCOMING" },
    { label: "Đã kết thúc",    value: "ENDED" },
    { label: "Hoàn thành",     value: "COMPLETED" },
  ];

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="w-full pt-24 min-h-screen bg-[#EAE6E0] px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Filter bar skeleton */}
          <div className="flex gap-2 mb-10 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-[#423137]/10 rounded-sm" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonContestCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="w-full py-24 px-4 bg-[#EAE6E0] flex items-center justify-center min-h-screen">
        <p className="text-sm text-[#423137]/60">Có lỗi xảy ra khi tải dữ liệu cuộc thi.</p>
      </div>
    );
  }

  return (
    <div className="w-full pt-24 pb-16 bg-[#EAE6E0] min-h-screen px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">

        {/* ── Filter bar ── */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Section label — same pattern as homepage News / Campaigns */}
          <p className="text-xs font-semibold tracking-widest text-[#423137]/60 uppercase mb-4">
            Cuộc thi nghệ thuật
          </p>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  setSelectedStatus(option.value);
                  setCurrentPage(1);
                }}
                className={`text-xs font-semibold tracking-wide px-3.5 py-2 rounded-sm transition-colors duration-200 ${
                  selectedStatus === option.value
                    ? "bg-[#FF6E1A] text-white"
                    : "border border-[#423137]/20 text-[#423137]/70 hover:border-[#FF6E1A] hover:text-[#FF6E1A]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Contest Grid ── */}
        <AnimatePresence mode="wait">
          {filteredContests.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredContests.map((contest, index) => {
                const status = statusConfig[contest.status as StatusKey] ?? statusConfig.ALL;

                return (
                  <motion.div
                    key={contest.contestId}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.07 }}
                  >
                    <Link href={`/contests/${contest.contestId}`} className="group block h-full">
                      {/* ── Card ── */}
                      <div className="flex flex-col h-full bg-white border border-[#e6e2da] shadow-sm rounded-md overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]">

                        {/* Banner image */}
                        <div className="w-full aspect-video overflow-hidden border-b border-[#e6e2da]">
                          <Image
                            src={contest.bannerUrl ?? PLACEHOLDER_IMAGE_URL}
                            alt={contest.title}
                            width={600}
                            height={338}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Card body */}
                        <div className="flex flex-col flex-1 p-4">
                          {/* Status dot + label (metadata) */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`} />
                            <span className="text-[10px] font-bold tracking-widest text-[#423137]/60 uppercase">
                              {status.label}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-sm font-bold text-[#423137] leading-snug line-clamp-2 mb-2.5">
                            {contest.title ?? ""}
                          </h3>

                          {/* Footer row: date + CTA */}
                          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                            <span className="text-[10px] text-[#423137]/70 font-semibold">
                              {formatDate({ dateString: contest.startDate })}
                              {contest.numOfAward > 0 && (
                                <> · {contest.numOfAward} giải</>
                              )}
                            </span>
                            <span className="flex-shrink-0 text-xs font-bold text-[#FF6E1A] transition-colors duration-200 group-hover:text-[#FF833B]">
                              Xem chi tiết →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Trophy className="h-10 w-10 text-[#423137]/20 mx-auto mb-4" />
              <p className="text-sm font-semibold text-[#423137]/50">
                {selectedStatus
                  ? `Không có cuộc thi nào với trạng thái "${
                      filterOptions.find((f) => f.value === selectedStatus)?.label
                    }"`
                  : "Hiện tại chưa có cuộc thi nào được tổ chức"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        {filteredContests.length > 0 && (
          <motion.div
            className="flex justify-center items-center gap-2 mt-14"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-sm border border-[#423137]/20 text-[#423137]/60 hover:border-[#FF6E1A] hover:text-[#FF6E1A] transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Trước
            </button>

            <div className="flex items-center gap-1.5">
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                let pageNumber: number;
                if (totalPages <= 5) {
                  pageNumber = idx + 1;
                } else if (currentPage <= 3) {
                  pageNumber = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + idx;
                } else {
                  pageNumber = currentPage - 2 + idx;
                }
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-8 h-8 text-xs font-semibold rounded-sm transition-colors duration-200 ${
                      currentPage === pageNumber
                        ? "bg-[#FF6E1A] text-white"
                        : "border border-[#423137]/20 text-[#423137]/60 hover:border-[#FF6E1A] hover:text-[#FF6E1A]"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={filteredContests.length < itemsPerPage}
              className="flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-sm border border-[#423137]/20 text-[#423137]/60 hover:border-[#FF6E1A] hover:text-[#FF6E1A] transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Sau
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
