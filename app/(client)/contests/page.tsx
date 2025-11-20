"use client";

import { useGetContestsPaginated } from "@/apis/contests";
import { formatDate } from "@/lib/utils";
import { ContestStatus } from "@/types/contest";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, Filter, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const statusColors = {
  UPCOMING: "bg-blue-500",
  ACTIVE: "bg-green-500",
  DRAFT: "bg-[#EAE6E0]0",
  ENDED: "bg-orange-500",
  COMPLETED: "bg-purple-500",
  CANCELLED: "bg-gray-600",
  ALL: "bg-[#EAE6E0]0",
};

const statusLabels = {
  UPCOMING: "Sắp diễn ra",
  ACTIVE: "Đang diễn ra",
  DRAFT: "Bản nháp",
  ENDED: "Đã kết thúc",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  ALL: "Tất cả",
};

const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/300x150?text=No+Banner";

export default function ContestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<
    ContestStatus | undefined
  >();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: contests, isLoading, error } = useGetContestsPaginated(
    selectedStatus,
    currentPage,
    itemsPerPage
  );

  // Filter out draft contests
  const filteredContests = contests?.filter(contest => contest.status !== 'DRAFT') || [];

  // Calculate total pages (assuming we have all data, adjust if API returns total count)
  const totalPages = filteredContests && filteredContests.length === itemsPerPage ? currentPage + 1 : currentPage;

  const filterOptions: { label: string; value: ContestStatus | undefined }[] = [
    { label: "Tất cả", value: undefined },
    { label: "Đang diễn ra", value: "ACTIVE" },
    { label: "Sắp diễn ra", value: "UPCOMING" },
    { label: "Đã kết thúc", value: "ENDED" },
    { label: "Hoàn thành", value: "COMPLETED" },
  ];

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Đã kết thúc";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `Còn ${days} ngày`;
    return `Còn ${hours} giờ`;
  };

  if (isLoading) {
    return (
      <div className="w-full pt-25 min-h-screen bg-[#EAE6E0]">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="group relative rounded-md overflow-hidden shadow-xl flex flex-col animate-pulse bg-white"
              >
                {/* Banner skeleton with date/status placeholders */}
                <div className="relative w-full h-48 md:h-56 lg:h-44 bg-gray-200">
                  <div className="absolute left-4 top-4 h-4 w-28 bg-gray-300 rounded" />
                  <div className="absolute right-4 top-4 h-3 w-16 bg-gray-300 rounded-full" />
                </div>

                {/* Content skeleton */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="h-5 md:h-6 w-3/4 bg-gray-300 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-200 rounded mb-4" />

                  <div className="mt-auto flex items-center justify-between">
                    <div className="h-10 w-28 bg-gray-300 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-14 bg-gray-300 rounded" />
                      <div className="h-5 w-5 bg-gray-300 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-25 px-4 bg-[#EAE6E0]">
        <div className="mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
            Cuộc Thi <span className="text-[#FF6E1A]">Nghệ Thuật</span>
          </h2>
          <p className="text-[#FF6E1A]">Có lỗi xảy ra khi tải dữ liệu cuộc thi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-25 px-4 bg-[#EAE6E0]">
      <div className="mx-auto">
        {/* Header */}
        {/* <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
            Cuộc Thi <span className="text-[#FF6E1A]">Nghệ Thuật</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá và tham gia các cuộc thi nghệ thuật hấp dẫn
          </p>
        </motion.div> */}

        {/* Filter Bar */}
        <motion.div
          className="mb-12 ml-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700 font-medium">
              Lọc theo trạng thái:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  setSelectedStatus(option.value);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedStatus === option.value
                    ? "bg-[#FF6E1A] text-white shadow-md"
                    : "bg-[#EAE6E0] text-black border border-primary hover:bg-gray-100 shadow-sm"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contests Grid */}
        <AnimatePresence mode="wait">
          {filteredContests && filteredContests.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {filteredContests.map((contest, index) => (
                <motion.div
                  key={contest.contestId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link href={`/contests/${contest.contestId}`}>
                    <div className="group min-h-80 relative rounded-md overflow-hidden shadow-xl flex flex-col">
                      {/* Banner image */}
                      <div className="relative w-full h-48 md:h-56 lg:h-44">
                        <Image
                          src={contest.bannerUrl ?? PLACEHOLDER_IMAGE_URL}
                          alt={contest.title}
                          fill
                          className="object-cover w-full h-full"
                        />

                        {/* Date pill (top-left) */}
                        <div className="absolute left-4 top-4 bg-white/95 text-gray-800 rounded-md px-3 py-1 flex items-center gap-2 text-sm shadow">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate({ dateString: contest.startDate })}</span>
                        </div>

                        {/* Status badge (top-right) */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white z-10 ${statusColors[contest.status]}`}>
                          {statusLabels[contest.status]}
                        </div>

                        {/* Dark gradient overlay (kept for visual) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      </div>

                      {/* Content moved below the banner image and anchored to bottom */}
                      <div className="p-4 bg-transparent text-gray-800 flex flex-col flex-1">
                        {/* Title area: reserve space even if title is empty */}
                        <h3 className="text-xl md:text-2xl font-bold leading-tight min-h-[3rem]">
                          {contest.title ?? ""}
                        </h3>

                        {/* Bottom actions always stay at the bottom */}
                        <div className="mt-auto flex items-center justify-between gap-3">
                          <button className="flex items-center gap-2 bg-[#FF6E1A] hover:bg-[#ff7f35] text-white px-4 py-2 rounded-lg font-semibold shadow">
                            Chi tiết
                            <span className="sr-only">Chi tiết {contest.title}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{contest.numOfAward} giải</span>
                            {/* <Trophy className="h-4 w-4 text-gray-600" /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16 min-h-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Không có cuộc thi nào
              </h3>
              <p className="text-gray-600">
                {selectedStatus
                  ? `Không có cuộc thi nào với trạng thái "${
                      filterOptions.find((f) => f.value === selectedStatus)
                        ?.label
                    }"`
                  : "Hiện tại chưa có cuộc thi nào được tổ chức"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {filteredContests && filteredContests.length > 0 && (
          <motion.div
            className="flex justify-center items-center gap-2 mt-12 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#EAE6E0] text-black border border-gray-300 hover:bg-gray-100 shadow-sm"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </button>

            <div className="flex items-center gap-2">
              {/* Show page numbers */}
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                let pageNumber;
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
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === pageNumber
                        ? "bg-[#FF6E1A] text-white shadow-md"
                        : "bg-[#EAE6E0] text-black border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={filteredContests.length < itemsPerPage}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filteredContests.length < itemsPerPage
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#EAE6E0] text-black border border-gray-300 hover:bg-gray-100 shadow-sm"
              }`}
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
