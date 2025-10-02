"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Trophy, Filter, Clock } from "lucide-react";
import { useGetContests, ContestStatus } from "@/apis/contests";
import Link from "next/link";

const statusColors = {
  UPCOMING: "bg-blue-500",
  ACTIVE: "bg-green-500", 
  DRAFT: "bg-gray-500",
  ENDED: "bg-orange-500",
  COMPLETED: "bg-purple-500",
};

const statusLabels = {
  UPCOMING: "Sắp diễn ra",
  ACTIVE: "Đang diễn ra",
  DRAFT: "Bản nháp", 
  ENDED: "Đã kết thúc",
  COMPLETED: "Hoàn thành",
};

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
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Đang tải cuộc thi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">Có lỗi xảy ra khi tải dữ liệu</p>
          <p className="text-gray-400 mt-2">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Cuộc Thi Nghệ Thuật
          </h1>
          <p className="text-xl text-gray-300">
            Khám phá và tham gia các cuộc thi nghệ thuật hấp dẫn
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-gray-300 font-medium">Lọc theo trạng thái:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedStatus === option.value
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
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
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group">
                      {/* Contest Banner */}
                      <div className="relative h-48 rounded-lg mb-4 overflow-hidden">
                        {contest.bannerUrl ? (
                          <img 
                            src={contest.bannerUrl} 
                            alt={contest.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500/50 to-purple-500/50 flex items-center justify-center">
                            <Trophy className="h-16 w-16 text-white/70" />
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[contest.status]}`}>
                          {statusLabels[contest.status]}
                        </div>
                      </div>

                      {/* Contest Info */}
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {contest.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {contest.description}
                      </p>

                      {/* Contest Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(contest.startDate)} - {formatDate(contest.endDate)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-400">
                          <Trophy className="h-4 w-4 mr-2" />
                          <span>{contest.numOfAward} giải thưởng</span>
                        </div>

                        {contest.status === "ACTIVE" && (
                          <div className="flex items-center text-sm text-green-400">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{getTimeRemaining(contest.endDate)}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-between items-center">
                        <div className="text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                          Xem chi tiết →
                        </div>
                      </div>
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
              <h3 className="text-xl font-semibold text-white mb-2">
                Không có cuộc thi nào
              </h3>
              <p className="text-gray-400">
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