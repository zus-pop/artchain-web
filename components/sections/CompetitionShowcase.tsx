"use client";

import React from "react";
import Link from "next/link";
import { useGetContests } from "@/apis/contests";
import { Calendar, Trophy, Clock } from "lucide-react";

const ContestShowcase = () => {
  // Get active contests from API
  const { data: contests, isLoading, error } = useGetContests("ACTIVE");

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
    if (days > 0) return `Còn ${days} ngày`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `Còn ${hours} giờ`;
  };

  const getGradientByIndex = (index: number) => {
    const gradients = [
      "from-green-400 to-blue-500",
      "from-purple-400 to-pink-500", 
      "from-yellow-400 to-red-500",
      "from-blue-400 to-indigo-500",
      "from-pink-400 to-rose-500",
      "from-teal-400 to-cyan-500"
    ];
    return gradients[index % gradients.length];
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cuộc Thi <span className="text-blue-400">Đang Diễn Ra</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-4"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cuộc Thi <span className="text-blue-400">Đang Diễn Ra</span>
          </h2>
          <p className="text-red-400">Có lỗi xảy ra khi tải dữ liệu cuộc thi</p>
        </div>
      </div>
    );
  }

  // Show only first 3 contests for showcase
  const displayContests = contests?.slice(0, 3) || [];

  return (
    <div className="w-full py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cuộc Thi <span className="text-blue-400">Đang Diễn Ra</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Tham gia ngay các cuộc thi hấp dẫn và thể hiện tài năng nghệ thuật của bạn
          </p>
        </div>

        {/* Contest Cards */}
        {displayContests.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayContests.map((contest, index) => (
              <div 
                key={contest.contestId}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:scale-105 transition-transform duration-300 hover:border-white/20"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                    Đang diễn ra
                  </span>
                  <div className="text-right">
                    <div className="flex items-center text-yellow-400">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span className="font-bold text-sm">{contest.numOfAward} giải</span>
                    </div>
                  </div>
                </div>

                {/* Contest Info */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {contest.title}
                </h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-2">
                  {contest.description}
                </p>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Kết thúc: {formatDate(contest.endDate)}</span>
                  </div>
                  
                  <div className="flex items-center text-green-400 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{getTimeRemaining(contest.endDate)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getGradientByIndex(index)} rounded-full`}
                      style={{ width: `${Math.min(65 + index * 10, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    Cuộc thi đang thu hút sự quan tâm
                  </p>
                </div>

                {/* Action Button */}
                <Link 
                  href={`/contests/${contest.contestId}`}
                  className={`w-full bg-gradient-to-r ${getGradientByIndex(index)} text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 block text-center`}
                >
                  Xem Chi Tiết
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Chưa có cuộc thi nào đang diễn ra
            </h3>
            <p className="text-gray-400">
              Hãy theo dõi để không bỏ lỡ các cuộc thi sắp tới
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            href="/contests"
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Xem Tất Cả Cuộc Thi
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContestShowcase;