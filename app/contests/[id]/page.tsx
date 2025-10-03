"use client";

import { motion } from "framer-motion";
import { Calendar, Trophy, Clock, ArrowLeft, Users, Star } from "lucide-react";
import { useGetContestById } from "@/apis/contests";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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

export default function ContestDetailPage() {
  const params = useParams();
  const contestId = Number(params.id);
  
  const { data: contest, isLoading, error } = useGetContestById(contestId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Đã kết thúc";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Đang tải thông tin cuộc thi...</p>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">Không tìm thấy cuộc thi</p>
          <p className="text-gray-400 mt-2">Cuộc thi không tồn tại hoặc đã bị xóa</p>
          <Link href="/contests" className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Quay về danh sách cuộc thi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link 
            href="/contests"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay về danh sách cuộc thi</span>
          </Link>
        </motion.div>

        {/* Contest Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contest Banner */}
            <div className="lg:w-1/2">
              <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
                {contest.bannerUrl ? (
                  <Image 
                    src={contest.bannerUrl} 
                    alt={contest.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/50 to-purple-500/50 flex items-center justify-center">
                    <Trophy className="h-24 w-24 text-white/70" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-medium text-white ${statusColors[contest.status]}`}>
                  {statusLabels[contest.status]}
                </div>
              </div>
            </div>

            {/* Contest Info */}
            <div className="lg:w-1/2 space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {contest.title}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {contest.description}
                </p>
              </div>

              {/* Contest Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <span className="text-gray-400 text-sm">Số giải thưởng</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{contest.numOfAward}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-400 text-sm">Trạng thái</span>
                  </div>
                  <p className="text-xl font-semibold text-white">{statusLabels[contest.status]}</p>
                </div>
              </div>

              {/* Time Remaining for Active Contests */}
              {contest.status === "ACTIVE" && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-green-400" />
                    <span className="text-green-300 font-medium">Thời gian còn lại</span>
                  </div>
                  <p className="text-2xl font-bold text-green-300">
                    {getTimeRemaining(contest.endDate)}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {contest.status === "ACTIVE" && (
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                    Tham gia cuộc thi
                  </button>
                )}
                
                <button className="flex-1 bg-white/10 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 border border-white/20">
                  Xem tác phẩm tham dự
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contest Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Thời gian cuộc thi</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-white font-medium">Bắt đầu</span>
                </div>
                <p className="text-gray-300">{formatDate(contest.startDate)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-white font-medium">Kết thúc</span>
                </div>
                <p className="text-gray-300">{formatDate(contest.endDate)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contest Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Thể lệ cuộc thi</h2>
          
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p>Tác phẩm phải là sáng tác gốc của thí sinh, không vi phạm bản quyền</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p>Định dạng file: JPG, PNG, PDF với độ phân giải tối thiểu 300 DPI</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p>Mỗi thí sinh được nộp tối đa 3 tác phẩm</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p>Kết quả sẽ được công bố trong vòng 7 ngày sau khi cuộc thi kết thúc</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p>Ban tổ chức có quyền sử dụng tác phẩm cho mục đích trưng bày và quảng bá</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}