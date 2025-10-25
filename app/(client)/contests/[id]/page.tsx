"use client";

import { useGetContestById } from "@/apis/contests";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Star, Trophy, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const statusColors = {
  UPCOMING: "bg-red-400",
  ACTIVE: "bg-red-600",
  DRAFT: "bg-neutral-400",
  ENDED: "bg-orange-500",
  COMPLETED: "bg-purple-600",
  CANCELLED: "bg-gray-600",
  ALL: "bg-gray-500",
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
      <div className="min-h-screen bg-[#faf7f2] pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Đang tải thông tin cuộc thi...</p>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-[#faf7f2] pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">Không tìm thấy cuộc thi</p>
          <p className="text-gray-500 mt-2">
            Cuộc thi không tồn tại hoặc đã bị xóa
          </p>
          <Link
            href="/contests"
            className="mt-4 inline-block bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition-colors"
          >
            Quay về danh sách cuộc thi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf9] pt-20 px-8 text-gray-800">
      {/* Contest Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#fffdf9] p-8 border border-[#e6e2da] shadow-md mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Banner */}
          <div className="lg:w-1/2 relative">
            <div className="relative h-64 lg:h-80 overflow-hidden">
              {contest.bannerUrl ? (
                <Image
                  src={contest.bannerUrl}
                  alt={contest.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-200 to-red-100 flex items-center justify-center">
                  <Trophy className="h-24 w-24 text-red-400" />
                </div>
              )}

              {/* Back button on top of image */}
              <Link
                href="/contests"
                className="absolute top-4 left-4 bg-[#f9f5ef]/70 hover:bg-[#f9f5ef]/90 text-gray-800 flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-md transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Quay lại</span>
              </Link>

              {/* Badge */}
              <div
                className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-medium text-white ${statusColors[contest.status]}`}
              >
                {statusLabels[contest.status]}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {contest.title}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed">
                {contest.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f8f6f0] p-4 border border-[#ebe7e0]">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="h-5 w-5 text-red-500" />
                  <span className="text-gray-600 text-sm">Số giải thưởng</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {contest.numOfAward}
                </p>
              </div>

              <div className="bg-[#f8f6f0] p-4 border border-[#ebe7e0]">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-red-500" />
                  <span className="text-gray-600 text-sm">Trạng thái</span>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {statusLabels[contest.status]}
                </p>
              </div>
            </div>

            {contest.status === "ACTIVE" && (
              <div className="bg-red-50 border border-red-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 font-medium">
                    Thời gian còn lại
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {getTimeRemaining(contest.endDate)}
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              {contest.status === "ACTIVE" && (
                <Link
                  href={`/painting-upload?contestId=${contest.contestId}&roundId=${contest.roundId}`}
                  className="flex-1"
                >
                  <button className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-6 font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-sm">
                    Tham gia cuộc thi
                  </button>
                </Link>
              )}
              <button className="flex-1 bg-[#f6f3ee] text-gray-800 py-3 px-6 font-medium hover:bg-[#efe9e0] transition-all duration-200 border border-[#e6e2da]">
                Xem tác phẩm tham dự
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-[#fffdf9] p-8 border border-[#e6e2da] shadow-sm mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Thời gian cuộc thi
        </h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-800 font-medium">Bắt đầu</span>
              </div>
              <p className="text-gray-600">{formatDate(contest.startDate)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-800 font-medium">Kết thúc</span>
              </div>
              <p className="text-gray-600">{formatDate(contest.endDate)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-[#fffdf9] p-8 border border-[#e6e2da] shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Thể lệ cuộc thi
        </h2>

        <div className="space-y-4 text-gray-700">
          {[
            "Tác phẩm phải là sáng tác gốc của thí sinh, không vi phạm bản quyền",
            "Định dạng file: JPG, PNG, PDF với độ phân giải tối thiểu 300 DPI",
            "Mỗi thí sinh được nộp tối đa 3 tác phẩm",
            "Kết quả sẽ được công bố trong vòng 7 ngày sau khi cuộc thi kết thúc",
            "Ban tổ chức có quyền sử dụng tác phẩm cho mục đích trưng bày và quảng bá",
          ].map((rule, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p>{rule}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
