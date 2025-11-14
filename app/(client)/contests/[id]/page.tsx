"use client";

import { useGetContestById } from "@/apis/contests";
import {
  getVotedAward,
  getVotedPaintings,
  useSubmitVote,
  useRemoveVote,
} from "@/apis/vote";
import Loader from "@/components/Loaders";
import { useAuth } from "@/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy, ThumbsUp, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { VotedPaining } from "@/types/vote";

type VotedPainting = VotedPaining["paintings"][0];

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
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const contestId = Number(params.id);
  const { data: contest, isLoading, error } = useGetContestById(contestId);

  // Vote states
  const [selectedAwardId, setSelectedAwardId] = useState<string | null>(null);
  const [votePaintings, setVotePaintings] = useState<VotedPainting[]>([]);
  const [loadingPaintings, setLoadingPaintings] = useState(false);
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  const [selectedPainting, setSelectedPainting] =
    useState<VotedPainting | null>(null);

  // Get awards for voting
  const { data: votedAwardData } = getVotedAward(contestId.toString());

  // Vote mutations
  const submitVoteMutation = useSubmitVote();
  const removeVoteMutation = useRemoveVote();

  // Fetch paintings when award is selected
  useEffect(() => {
    const fetchPaintings = async () => {
      if (!selectedAwardId || !contestId) return;

      try {
        setLoadingPaintings(true);
        const response = await getVotedPaintings({
          contestId: contestId.toString(),
          awardId: selectedAwardId,
          accountId: user?.userId || "",
        });
        // response.data is now a single VotedPaining object, not an array
        const paintingsData = response.data?.paintings || [];
        setVotePaintings(paintingsData);
      } catch (err) {
        console.error("Error fetching paintings:", err);
        setVotePaintings([]);
      } finally {
        setLoadingPaintings(false);
      }
    };

    fetchPaintings();
  }, [selectedAwardId, contestId, user?.userId]);

  const handleVoteClick = (painting: VotedPainting) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để vote!");
      return;
    }
    setSelectedPainting(painting);
    setShowVoteDialog(true);
  };

  const handleConfirmVote = async () => {
    if (!selectedPainting || !selectedAwardId || !user?.userId) return;

    await submitVoteMutation.mutateAsync({
      accountId: user.userId,
      paintingId: selectedPainting.paintingId,
      awardId: selectedAwardId,
      contestId: contestId.toString(),
    });

    setShowVoteDialog(false);
    setSelectedPainting(null);

    // Refetch paintings to update vote counts
    const response = await getVotedPaintings({
      contestId: contestId.toString(),
      awardId: selectedAwardId,
      accountId: user?.userId || "",
    });
    const paintingsData = response.data?.paintings || [];
    setVotePaintings(paintingsData);
  };

  const handleRemoveVote = async (painting: VotedPainting) => {
    if (!user?.userId || !selectedAwardId) return;

    await removeVoteMutation.mutateAsync({
      accountId: user.userId,
      paintingId: painting.paintingId,
      awardId: selectedAwardId,
      contestId: contestId.toString(),
    });

    // Refetch paintings to update vote counts
    if (selectedAwardId && user?.userId) {
      const response = await getVotedPaintings({
        contestId: contestId.toString(),
        awardId: selectedAwardId,
        accountId: user?.userId || "",
      });
      const paintingsData = response.data?.paintings || [];
      setVotePaintings(paintingsData);
    }
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
        <Loader />
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
    <div className="min-h-screen bg-[#EAE6E0] pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-7xl mx-auto py-6 sm:py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-[500px] overflow-hidden rounded-lg shadow-lg">
              {contest.bannerUrl ? (
                <Image
                  src={contest.bannerUrl}
                  alt={contest.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-blue-200 via-blue-100 to-blue-50 flex items-center justify-center">
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
                  (statusPillStyles[contest.status] ||
                    "bg-gray-50 text-gray-600 border-gray-600")
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
            className="flex flex-col justify-between h-[500px] space-y-4 sm:space-y-6"
          >
            <div className="space-y-4 sm:space-y-6">
              <div>
                <p className="text-sm sm:text-base font-semibold text-black mb-2">
                  Chi tiết cuộc thi
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4 leading-tight">
                  {contest.title}
                </h1>
                <p className="text-sm sm:text-base text-black">
                  {contest.description}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
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
                    Thí sinh cần nộp bản cứng tác phẩm trước ngày{" "}
                    {contest.rounds?.[0]?.sendOriginalDeadline
                      ? (() => {
                          const deadline =
                            contest.rounds[0].sendOriginalDeadline;
                          const date = new Date(deadline);
                          const day = date
                            .getUTCDate()
                            .toString()
                            .padStart(2, "0");
                          const month = (date.getUTCMonth() + 1)
                            .toString()
                            .padStart(2, "0");
                          const year = date.getUTCFullYear();
                          return `${day}/${month}/${year}`;
                        })()
                      : "quy định."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {/* Nút Tải quy định thi - chỉ hiển thị khi ACTIVE */}
              {contest.status === "ACTIVE" && (
                <Link
                  href={contest.ruleUrl}
                  target="_blank"
                  className="flex items-center justify-center flex-1 px-4 py-2 bg-transparent border border-[#b8aaaa] text-black font-medium text-base hover:bg-[#FF6E1A]/10 hover:border-[#FF6E1A] transition-colors duration-200 shadow-sm"
                >
                  Tải quy định thi ⬇
                </Link>
              )}

              {/* Nút Tham gia cuộc thi - luôn hiển thị */}
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
                    : user?.role === "GUARDIAN"
                    ? {
                        pathname: "/children-participation",
                        query: {
                          contestId: contest.contestId,
                          roundId: contest.rounds.find(
                            (r) => r.name === "ROUND_1"
                          )?.roundId,
                        },
                      }
                    : "/auth"
                }
                className="flex-1 bg-[#FF6E1A] text-white text-center py-3 px-6 font-medium hover:bg-orange-400 transition-all duration-200 shadow-sm"
              >
                Tham gia cuộc thi
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 sm:mt-12"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
            Lịch trình vòng 1
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Bắt đầu */}
            <div className="space-y-1 lg:pr-6 lg:border-r lg:border-[#B8AAAA] lg:last:border-r-0">
              <p className="text-black font-light text-sm sm:text-base">
                Bắt đầu
              </p>
              <p className="text-black font-semibold text-base sm:text-lg">
                {new Date(contest.startDate).toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Hạn nộp bài */}
            <div className="space-y-1 lg:pr-6 lg:border-r lg:border-[#B8AAAA] lg:last:border-r-0">
              <p className="text-black font-light text-sm sm:text-base">
                Hạn nộp bài
              </p>
              <p className="text-black font-semibold text-base sm:text-lg">
                {new Date(contest.endDate).toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Công bố kết quả */}
            <div className="space-y-1 lg:pr-6 lg:border-r lg:border-[#B8AAAA] lg:last:border-r-0">
              <p className="text-black font-light text-sm sm:text-base">
                Công bố kết quả
              </p>
              <p className="text-black font-semibold text-base sm:text-lg">
                {new Date(contest.endDate).toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Gửi bản gốc */}
            <div className="space-y-1 lg:pr-6 lg:border-r lg:border-[#B8AAAA] lg:last:border-r-0">
              <p className="text-black font-light text-sm sm:text-base">
                Gửi bản gốc
              </p>
              <p className="text-black font-semibold text-base sm:text-lg">
                {contest.rounds?.[0]?.sendOriginalDeadline
                  ? (() => {
                      const deadline = contest.rounds[0].sendOriginalDeadline;
                      const date = new Date(deadline);
                      const day = date.getUTCDate().toString().padStart(2, "0");
                      const month = (date.getUTCMonth() + 1)
                        .toString()
                        .padStart(2, "0");
                      const year = date.getUTCFullYear();
                      return `${day}/${month}/${year}`;
                    })()
                  : "Chưa xác định"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Round 2 Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-12"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
            Lịch trình vòng 2
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Số lượng thí sinh */}
            <div className="space-y-1">
              <p className="text-black font-semibold text-sm sm:text-base">
                Số lượng thí sinh
              </p>
              <p className="text-black font-light text-sm sm:text-base">
                {contest.round2Quantity} thí sinh có bài thi tốt nhất sau vòng 1
              </p>
            </div>

            {/* Ngày thi dự kiến */}
            <div className="space-y-1">
              <p className="text-black font-semibold text-sm sm:text-base">
                Ngày thi dự kiến
              </p>
              <p className="text-black font-light text-sm sm:text-base">
                11-12-2025
              </p>
            </div>
          </div>
        </motion.div>

        {/* Vote Section */}
        {votedAwardData?.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 sm:mt-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-black">
                Vote cho giải thưởng
              </h3>
            </div>

            <p className="text-sm sm:text-base text-black mb-6">
              Chọn giải thưởng và vote cho bức tranh yêu thích của bạn
            </p>

            {/* Award Selection */}
            <div className="mb-6">
              <label className="block text-base font-semibold text-black mb-3">
                Chọn giải thưởng:
              </label>
              {votedAwardData.data.awards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {votedAwardData.data.awards.map((award) => (
                    <button
                      key={award.awardId}
                      onClick={() => setSelectedAwardId(award.awardId)}
                      className={`p-4 cursor-pointer sm:p-5 border-2 text-left transition-all hover:shadow-md ${
                        selectedAwardId === award.awardId
                          ? "border-[#FF6E1A] bg-[#FF6E1A]/10"
                          : "border-[#b8aaaa] hover:border-[#FF6E1A]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-black text-base sm:text-lg">
                          {award.name}
                        </h4>
                        <Trophy
                          className={`w-5 h-5 ${
                            selectedAwardId === award.awardId
                              ? "text-[#FF6E1A]"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {award.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Giải: {award.prize}</span>
                        <span className="font-medium">
                          {award.totalVotes} votes
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">
                  Không có giải thưởng nào được tạo
                </p>
              )}
            </div>

            {/* Paintings Grid */}
            {selectedAwardId && (
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-black mb-4">
                  Các bức tranh tham gia:
                </h4>

                {loadingPaintings ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#FF6E1A]" />
                    <span className="ml-2 text-black">Đang tải tranh...</span>
                  </div>
                ) : votePaintings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {(() => {
                      const hasAlreadyVoted = votePaintings.some(
                        (p) => p.hasVoted
                      );
                      return votePaintings.map((painting) => (
                        <div
                          key={painting.paintingId}
                          className="border border-[#b8aaaa] overflow-hidden hover:shadow-lg transition-all hover:scale-105 duration-300"
                        >
                          <div className="relative h-48 sm:h-56 w-full bg-gray-100">
                            {painting.imageUrl ? (
                              <Image
                                src={painting.imageUrl}
                                alt={painting.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                                <div className="text-center">
                                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                  <p className="text-gray-500 text-sm">
                                    Chưa có ảnh
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h5 className="font-semibold text-black mb-1 line-clamp-1 text-base">
                              {painting.title}
                            </h5>
                            <p className="text-sm text-gray-700 mb-2">
                              {painting.competitorName}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 font-medium">
                                {painting.voteCount} votes
                              </span>
                              {painting.hasVoted ? (
                                <button
                                  onClick={() => handleRemoveVote(painting)}
                                  disabled={removeVoteMutation.isPending}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                  <ThumbsUp className="w-4 h-4 fill-current" />
                                  Bỏ vote
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleVoteClick(painting)}
                                  disabled={
                                    hasAlreadyVoted ||
                                    submitVoteMutation.isPending
                                  }
                                  title={
                                    hasAlreadyVoted
                                      ? "Bạn đã bình chọn rồi"
                                      : undefined
                                  }
                                  className="flex items-center gap-1 px-3 py-1.5 bg-[#FF6E1A] text-white text-sm font-medium hover:bg-[#FF833B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  Vote
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">
                    Chưa có tranh nào cho giải thưởng này
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Vote Confirmation Dialog */}
      <AnimatePresence>
        {showVoteDialog && selectedPainting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-black mb-4">
                Xác nhận vote
              </h3>

              <div className="mb-6">
                {selectedPainting.imageUrl && (
                  <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={selectedPainting.imageUrl}
                      alt={selectedPainting.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Bức tranh:</span>{" "}
                  {selectedPainting.title}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Thí sinh:</span>{" "}
                  {selectedPainting.competitorName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Số votes hiện tại:</span>{" "}
                  {selectedPainting.voteCount}
                </p>
              </div>

              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn vote cho bức tranh này không?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowVoteDialog(false);
                    setSelectedPainting(null);
                  }}
                  className="flex-1 px-4 py-2 border border-[#b8aaaa] text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmVote}
                  disabled={submitVoteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-[#FF6E1A] text-white font-medium hover:bg-[#FF833B] transition-colors disabled:opacity-50"
                >
                  {submitVoteMutation.isPending ? "Đang vote..." : "Xác nhận"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
