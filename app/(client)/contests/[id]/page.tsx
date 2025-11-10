"use client";

import { useGetContestById } from "@/apis/contests";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Star, Trophy, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks";

const statusColors = {
  UPCOMING: "bg-red-400",
  ACTIVE: "bg-red-600",
  DRAFT: "bg-neutral-400",
  ENDED: "bg-orange-500",
  COMPLETED: "bg-purple-600",
  CANCELLED: "bg-black",
  ALL: "bg-black",
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

// pill style for status badges (pale background, colored text and border)
const statusPillStyles: Record<string, string> = {
  UPCOMING: "bg-yellow-50 text-yellow-600 border-yellow-600",
  ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-600",
  DRAFT: "bg-neutral-50 text-neutral-600 border-neutral-600",
  ENDED: "bg-orange-50 text-orange-600 border-orange-600",
  COMPLETED: "bg-purple-50 text-purple-600 border-purple-600",
  CANCELLED: "bg-gray-50 text-gray-600 border-gray-600",
  ALL: "bg-gray-50 text-gray-600 border-gray-600",
};

export default function ContestDetailPage() {
  const { user } = useAuth();
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
          <p className="text-black">Đang tải thông tin cuộc thi...</p>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-[#faf7f2] pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">
            Không tìm thấy cuộc thi
          </p>
          <p className="text-black mt-2">
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
    <div className="h-full bg-[#e8e3d9] pt-20 px-4 lg:px-8 text-black">
      <div className="max-w-7xl mx-auto py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-[400px] overflow-hidden rounded-lg shadow-lg">
              {contest.bannerUrl ? (
                <Image
                  src={contest.bannerUrl}
                  alt={contest.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 flex items-center justify-center">
                  <Trophy className="h-32 w-32 text-blue-300" />
                </div>
              )}

              <Link
                href="/contests"
                className="absolute top-4 left-4 bg-[#f9f5ef]/70 hover:bg-[#f9f5ef]/90 text-gray-800 flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-md transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Quay lại</span>
              </Link>

              {/* Badge on image (pill style) */}
              <div
                className={
                  "absolute top-6 right-6 rounded-full text-xs px-4 py-2 font-semibold shadow-sm border-2 " +
                  (statusPillStyles[contest.status] || "bg-gray-50 text-gray-600 border-gray-600")
                }
              >
                {statusLabels[contest.status]}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between h-[400px]"
          >
            <div className="space-y-6">
              <div>
                <p className="text-base font-semibold text-black mb-2">
                  Chi tiết cuộc thi
                </p>
                <h1 className="text-4xl lg:text-4xl font-bold text-black mb-4 leading-tight">
                  {contest.title}
                </h1>
                <p className="text-black text-base">
                  {contest.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-baseline gap-3">
                  <p className="text-base font-semibold text-black mb-0">
                    Thời gian:
                  </p>
                  <p className="text-black font-normal mb-0">
                    {new Date(contest.startDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    đến{" "}
                    {new Date(contest.endDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-base font-semibold text-black mb-1">
                    Lưu ý:
                  </p>
                  <p className="text-black">
                    Thí sinh cần nộp bản cứng tác phẩm trước ngày 30-4-1974
                  </p>
                </div>
              </div>
            </div>

            {contest.status === "ACTIVE" && (
              <Link
                href={
                  user?.role === "COMPETITOR"
                    ? {
                        pathname: "/painting-upload",
                        query: {
                          contestId: contest.contestId,
                          roundId: contest.rounds.find(
                            (r) => r.name === "ROUND_1"
                          )?.roundId,
                          competitorId: user.userId,
                        },
                      }
                    : {
                        pathname: "/children-participation",
                        query: {
                          contestId: contest.contestId,
                          roundId: contest.rounds.find(
                            (r) => r.name === "ROUND_1"
                          )?.roundId,
                        },
                      }
                }
                className="inline-block w-full lg:w-auto bg-[#ff6b35] hover:bg-[#ff5722] text-white text-center px-8 py-3 font-medium transition-colors duration-200 shadow-md"
              >
                Tải quy định thi ⬇
              </Link>
            )}
          </motion.div>
        </div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-black mb-6">
            Lịch trình vòng 1
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bắt đầu */}
            <div className="space-y-1 lg:pr-6 lg:border-r lg:border-[#B8AAAA] lg:last:border-r-0">
              <p className="text-black font-light text-base">Bắt đầu</p>
              <p className="text-black font-semibold text-lg">
                {new Date(contest.startDate).toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Hạn nộp bài */}
            <div className="space-y-1 lg:pr-6 lg:border-r lg:border-[#B8AAAA] lg:last:border-r-0">
              <p className="text-black font-light text-base">Hạn nộp bài</p>
              <p className="text-black font-semibold text-lg">
                {new Date(contest.endDate).toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Công bố kết quả */}
            <div className="space-y-1 lg:pr-6 lg:border-r lg:border-[#B8AAAA] lg:last:border-r-0">
              <p className="text-black font-light text-base">Công bố kết quả</p>
              <p className="text-black font-semibold text-lg">
                {new Date(contest.endDate).toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Gửi bản gốc */}
            <div className="space-y-1 lg:pr-6 lg:border-r lg:border-[#B8AAAA] lg:last:border-r-0">
              <p className="text-black font-light text-base">Gửi bản gốc</p>
              <p className="text-black font-semibold text-lg">
                {new Date(contest.endDate).toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Round 2 Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-black mb-6">
            Lịch trình vòng 2
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Số lượng thí sinh */}
            <div className="space-y-1">
              <p className="text-black font-semibold text-base">Số lượng thí sinh</p>
              <p className="text-black font-light">
                20 thí sinh có bài thi tốt nhất sau vòng 1
              </p>
            </div>

            {/* Ngày thi dự kiến */}
            <div className="space-y-1">
              <p className="text-black font-semibold text-base">Ngày thi dự kiến</p>
              <p className="text-black font-light">11-12-2025</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
