"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Trophy, Filter, Clock } from "lucide-react";
import { useGetContests } from "@/apis/contests";
import { ContestStatus } from "@/types/contest";
import Link from "next/link";
import Image from "next/image";

const statusColors = {
  UPCOMING: "bg-blue-500",
  ACTIVE: "bg-green-500", 
  DRAFT: "bg-gray-500",
  ENDED: "bg-orange-500",
  COMPLETED: "bg-purple-500",
  ALL: "bg-gray-500",
};

const statusLabels = {
  UPCOMING: "Sắp diễn ra",
  ACTIVE: "Đang diễn ra",
  DRAFT: "Bản nháp", 
  ENDED: "Đã kết thúc",
  COMPLETED: "Hoàn thành",
  ALL: "Tất cả",
};

const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/300x150?text=No+Banner';

export default function ContestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<ContestStatus | undefined>();
  const { data: contests, isLoading, error } = useGetContests(selectedStatus);

  const filterOptions: { label: string; value: ContestStatus | undefined }[] = [
    { label: "Tất cả", value: undefined },
    { label: "Đang diễn ra", value: "ACTIVE" },
    { label: "Sắp diễn ra", value: "UPCOMING" },
    { label: "Đã kết thúc", value: "ENDED" },
    { label: "Hoàn thành", value: "COMPLETED" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
    });
  };
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
      <div className="w-full py-10 px-4 bg-gray-50">
        <div className="mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
              Cuộc Thi <span className="text-red-500">Nghệ Thuật</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="group m-5 flex flex-col justify-between gap-4 min-h-[240px] duration-500 relative rounded-lg p-5 bg-[hsl(2,68%,58%)] shadow-md animate-pulse"
              >
                <div className="absolute duration-700 shadow-md -bottom-10 -right-10 w-1/2 h-1/2 rounded-lg bg-[hsl(2,68%,88%)]" />
                <div className="z-10">
                  <div className="h-6 w-3/4 bg-white/30 rounded mb-4"></div>
                  <div className="h-4 w-full bg-white/20 rounded mb-2"></div>
                  <div className="h-3 w-5/6 bg-white/20 rounded mb-4"></div>
                </div>
                <div className="h-10 w-32 bg-white/30 rounded z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-20 px-4 bg-gray-50">
        <div className="mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
            Cuộc Thi <span className="text-red-500">Nghệ Thuật</span>
          </h2>
          <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu cuộc thi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-20 px-4 bg-gray-50">
      <div className="mx-auto">
        {/* Header */}
        {/* <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
            Cuộc Thi <span className="text-red-500">Nghệ Thuật</span>
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
            <span className="text-gray-700 font-medium">Lọc theo trạng thái:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedStatus === option.value
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contests Grid */}
        <AnimatePresence mode="wait">
          {contests && contests.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {contests.map((contest, index) => (
                <motion.div
                  key={contest.contestId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link href={`/contests/${contest.contestId}`}>
                    <div className="group m-5 flex flex-col justify-between gap-4 min-h-[320px] duration-500 relative rounded-lg p-5 hover:-translate-y-2 hover:shadow-xl bg-[hsl(2,68%,58%)] shadow-md">
                      {/* Khối trang trí ở góc */}
                      <Image src={contest.bannerUrl ?? PLACEHOLDER_IMAGE_URL} alt={contest.title} width={200} height={100} className="absolute duration-700 shadow-md group-hover:-translate-y-4 group-hover:-translate-x-4 -bottom-10 -right-10 w-1/2 h-1/2 rounded-lg bg-[hsl(2,68%,88%)]" />

                      {/* Status Badge */}
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white z-10 ${statusColors[contest.status]}`}>
                        {statusLabels[contest.status]}
                      </div>

                      {/* Nội dung thẻ */}
                      <div className="z-10">
                        <h3 className="text-2xl font-bold mb-2 text-white">
                          {contest.title}
                        </h3>
                        <p className="text-gray-100 line-clamp-3 mb-4">
                          {contest.description}
                        </p>

                        {/* Contest Details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-white/90">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{formatDate(contest.startDate)} - {formatDate(contest.endDate)}</span>
                          </div>
                          
                          <div className="flex items-center text-white/90">
                            <Trophy className="h-4 w-4 mr-2" />
                            <span>{contest.numOfAward} giải thưởng</span>
                          </div>

                          {contest.status === "ACTIVE" && (
                            <div className="flex items-center text-green-200 font-semibold">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{getTimeRemaining(contest.endDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Nút hành động */}
                      <button className="z-10 w-fit text-gray-800 font-semibold rounded p-2 px-6 transition-colors duration-200 bg-white bg-opacity-20 hover:bg-opacity-40">
                        Xem Chi Tiết
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16"
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
                  ? `Không có cuộc thi nào với trạng thái "${filterOptions.find(f => f.value === selectedStatus)?.label}"`
                  : "Hiện tại chưa có cuộc thi nào được tổ chức"
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}