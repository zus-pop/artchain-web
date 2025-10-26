"use client";

import { useGetContestById } from "@/apis/contests";
import { useGuardianChildren } from "@/apis/guardian";
import { useAuth } from "@/hooks";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ChildrenParticipationSuspense() {
  return (
    <Suspense>
      <ChildrenParticipation />
    </Suspense>
  );
}

function ChildrenParticipation() {
  const searchParams = useSearchParams();
  const contestId = Number(searchParams.get("contestId"));
  const roundId = Number(searchParams.get("roundId"));

  // State để lưu trữ thông tin người dùng
  const { user } = useAuth();
  // Fetch contest details
  const { data: contest, isLoading: isLoadingContest } =
    useGetContestById(contestId);

  // Fetch guardian children
  const { data: guardianChildren, isLoading: isLoadingChildren } =
    useGuardianChildren(user?.role === "GUARDIAN" ? user.userId : undefined);

  if (isLoadingContest || isLoadingChildren) {
    return (
      <div className="min-h-screen bg-[#faf7f2] pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-[#faf7f2] pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">
            Không tìm thấy cuộc thi
          </p>
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#fffdf9] p-8 border border-[#e6e2da] shadow-md mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chọn con em tham gia
            </h1>
            <p className="text-gray-700">
              Chọn con em để nộp bài dự thi cho cuộc thi{" "}
              <span className="font-semibold text-red-600">
                {contest.title}
              </span>
            </p>
          </div>
          <Link
            href={`/contests/${contestId}`}
            className="bg-[#f9f5ef] hover:bg-[#f9f5ef]/90 text-gray-800 flex items-center space-x-2 px-4 py-2 rounded-full transition-all border border-[#e6e2da]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Quay lại</span>
          </Link>
        </div>

        {/* Contest Info */}
        <div className="bg-[#f8f6f0] p-4 border border-[#ebe7e0] rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 overflow-hidden rounded-lg">
              {contest.bannerUrl ? (
                <Image
                  src={contest.bannerUrl}
                  alt={contest.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-red-200 to-red-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-red-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {contest.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {contest.description}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Số giải: {contest.numOfAward}</span>
                {/* <span>Vòng: {roundId}</span> */}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Children List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-[#fffdf9] p-8 border border-[#e6e2da] shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Danh sách con em
        </h2>

        {guardianChildren && guardianChildren.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guardianChildren.map((child) => (
              <motion.div
                key={child.userId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 border border-[#e6e2da] shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {child.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {child.fullName}
                    </h3>
                    <p className="text-gray-600 text-sm">@{child.username}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span className="font-medium">Trường:</span>
                    <span>{child.schoolName || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Lớp:</span>
                    <span>{child.grade || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="truncate">{child.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Trạng thái:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        child.status === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {child.status === 1 ? "Đã tham gia" : "Chưa tham gia"}
                    </span>
                  </div>
                </div>

                <Link
                  href={{
                    pathname: "/painting-upload",
                    query: {
                      contestId: contest.contestId,
                      roundId: roundId,
                      competitorId: child.userId,
                    },
                  }}
                  className="w-full bg-linear-to-r from-red-600 to-red-500 text-white text-center py-3 px-4 font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-sm flex items-center justify-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Nộp bài cho {child.fullName}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có con em nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có con em nào được đăng ký trong hệ thống
            </p>
            <Link
              href="/me"
              className="inline-block bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition-colors font-medium"
            >
              Quản lý con em
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
