"use client";

import { useGetMySubmissions } from "@/apis/paintings";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Eye, Loader2, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  APPROVED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
  REVIEWING: "bg-blue-100 text-blue-800 border-blue-300",
};

const statusLabels = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  REVIEWING: "Đang xét duyệt",
};

const MySubmission = () => {
  const { data: submissions, isLoading, error } = useGetMySubmissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bài thi của bạn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">!</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không thể tải bài thi
              </h3>
              <p className="text-gray-600">
                Đã có lỗi xảy ra. Vui lòng thử lại sau.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md border-[#e6e2da]">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chưa có bài thi nào
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa nộp bài thi nào. Hãy tham gia cuộc thi để thể hiện tài
                năng của bạn!
              </p>
              <Link
                href="/contests"
                className="inline-block bg-linear-to-r from-red-600 to-red-500 text-white px-6 py-2 font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200"
              >
                Xem cuộc thi
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Bài thi của tôi ({submissions.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {submissions.map((submission, index) => (
          <motion.div
            key={submission.paintingId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border border-[#e6e2da] shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                  src={submission.imageUrl}
                  alt={submission.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge
                    className={`${
                      statusColors[
                        submission.status as keyof typeof statusColors
                      ] || statusColors.PENDING
                    } border`}
                  >
                    {statusLabels[
                      submission.status as keyof typeof statusLabels
                    ] || submission.status}
                  </Badge>
                </div>
                {/* Award Badge if exists */}
                {submission.awardId && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-yellow-400 text-yellow-900 border-yellow-500">
                      <Trophy className="h-3 w-3 mr-1" />
                      Giải thưởng
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                {/* Title */}
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                  {submission.title}
                </h3>

                {/* Description */}
                {submission.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {submission.description}
                  </p>
                )}

                {/* Contest Info */}
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <Link
                    href={`/contests/${submission.contest.contestId}`}
                    className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                  >
                    {submission.contest.title}
                  </Link>
                </div>

                {/* Submission Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Nộp lúc:{" "}
                    {formatDate({ dateString: submission.submissionDate })}
                  </span>
                </div>

                {/* Action Button */}
                <Link
                  href={`/submissions/${submission.paintingId}`}
                  className="w-full flex items-center justify-center gap-2 bg-[#f6f3ee] hover:bg-[#efe9e0] text-gray-800 py-2 px-4 font-medium transition-all duration-200 border border-[#e6e2da]"
                >
                  <Eye className="h-4 w-4" />
                  Xem chi tiết
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MySubmission;
