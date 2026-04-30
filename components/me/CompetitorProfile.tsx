"use client";

import { useGetUserAchievements } from "@/apis/achievements";
import {
  useGetMySubmissions,
  useGetPaintingEvaluations,
} from "@/apis/paintings";
import CertificateViewer from "@/components/award/CertificateViewer";
import { Lang } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";
import { WhoAmI } from "@/types";
import { AchievementItem } from "@/types/achievement";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import WonPaintings from "./WonPaintings";
import { UpdateUserRequest } from "@/apis/user";
import { useUpdateUserMutation } from "@/hooks/useUpdateUserMutation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface CompetitorProfileScreenProps {
  authUser: WhoAmI | null;
  t: Lang; // Giữ prop 't' nhưng code này sẽ không dùng vì text trong ảnh là cố định
}

export default function CompetitorProfileScreen({
  authUser,
}: CompetitorProfileScreenProps) {
  // State để quản lý tab đang active
  const [activeTab, setActiveTab] = useState<"submitted" | "awards" | "orders">(
    "submitted",
  );

  // State for evaluation detail dialog
  const [selectedPaintingId, setSelectedPaintingId] = useState<string | null>(
    null,
  );
  const [isEvaluationDialogOpen, setIsEvaluationDialogOpen] = useState(false);

  // State for award detail dialog
  const [selectedAchievement, setSelectedAchievement] =
    useState<AchievementItem | null>(null);
  const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false);
  const [isCertificateViewerOpen, setIsCertificateViewerOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const updateUserMutation = useUpdateUserMutation();

  // Initialize form data when authUser is available
  useEffect(() => {
    if (authUser && isEditDialogOpen) {
      setEditFormData({
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
      });
    }
  }, [authUser, isEditDialogOpen]);

  // Fetch submissions data
  const { data: submissions } = useGetMySubmissions();

  // Fetch achievements for this competitor only when awards tab is active
  const { data: achievementsResp, isLoading: isLoadingAchievements } =
    useGetUserAchievements(authUser?.userId, activeTab === "awards");

  // Fetch evaluations for selected painting
  const { data: paintingEvaluations, isLoading: isLoadingEvaluations } =
    useGetPaintingEvaluations(selectedPaintingId || "");

  // Handle viewing painting evaluation details
  const handleViewPaintingDetail = (paintingId: string) => {
    setSelectedPaintingId(paintingId);
    setIsEvaluationDialogOpen(true);
  };

  const handleCloseEvaluationDialog = () => {
    setIsEvaluationDialogOpen(false);
    setSelectedPaintingId(null);
  };

  const handleViewAwardDetail = (achievement: AchievementItem) => {
    setSelectedAchievement(achievement);
    setIsAwardDialogOpen(true);
  };

  const handleCloseAwardDialog = () => {
    setIsAwardDialogOpen(false);
    setSelectedAchievement(null);
  };

  const handleOpenCertificateViewer = () => {
    setIsCertificateViewerOpen(true);
  };

  const handleCloseCertificateViewer = () => {
    setIsCertificateViewerOpen(false);
  };

  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.userId) return;

    try {
      await updateUserMutation.mutateAsync({
        id: authUser.userId,
        data: editFormData,
      });
      toast.success("Cập nhật thông tin thành công!");
      handleCloseEditDialog();
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại sau.");
    }
  };

  // Map submissions data to the required format
  const submittedArtworks = submissions
    ? submissions.map((painting) => ({
        id: painting.paintingId,
        imageUrl: painting.imageUrl,
        submissionDate: painting.updatedAt,
        competitionName: painting.contest.title,
      }))
    : [];

  // Xử lý dữ liệu từ authUser, dùng fallback là dữ liệu trong ảnh
  // LƯU Ý: Kiểu WhoAmI của bạn có thể không có 'class', bạn cần thêm vào nếu muốn dùng
  const profile = {
    name: authUser?.fullName || "Việt Hoàng",
    school: authUser?.schoolName || "Trường THCS Nha Trang",
    class: authUser?.grade ? `Lớp ${authUser.grade}` : "Lớp 6",
    dob: authUser?.birthday
      ? new Date(authUser.birthday).toLocaleDateString("vi-VN")
      : "15/10/2012",
    ward: authUser?.ward || "Phường Sài Gòn",
    avatarUrl:
      authUser?.avatarUrl ||
      "https://images.unsplash.com/photo-1564153943327-fa0006d0f633?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1480", // <-- THAY BẰNG AVATAR THẬT
    bannerUrl:
      "https://plus.unsplash.com/premium_photo-1667502842264-9cdcdac36086?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2022", // <-- THAY BẰNG BANNER THẬT
  };

  return (
    <>
      <div className="min-h-screen bg-[#EAE6E0]">
      {/* === Banner Section === */}
      {/* Lấy banner có style giống ảnh (watercolor) */}
      <div className="relative h-48 w-full sm:h-56">
        <Image
          src={profile.bannerUrl}
          alt="Banner"
          layout="fill"
          objectFit="cover"
          className="bg-linear-to-r from-blue-100 via-pink-100 to-orange-100" // Placeholder
        />
      </div>

      {/* === Main Content Area === */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* === Profile Info Section === */}
        {/* Dùng margin âm để kéo phần info này đè lên banner */}
        <div className="relative -mt-24 sm:-mt-28">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8 mt-[7vh]">
            {/* Left side: Avatar và Tên/Trường/Lớp */}
            <div className="flex items-end">
              <div className="relative h-32 w-32 shrink-0 sm:h-40 sm:w-40">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full border-4 border-white shadow-lg bg-black"
                />
              </div>
              <div className="ml-4 sm:ml-6">
                <h1 className="text-2xl font-bold text-black sm:text-3xl">
                  {profile.name}
                </h1>
                <p className="mt-1 text-sm text-black">{profile.school}</p>
                <p className="text-sm text-black">{profile.class}</p>
              </div>
            </div>

            {/* Right side: Thông tin Ngày sinh / Phường */}
            <div className="flex w-full justify-start gap-8 sm:w-auto sm:justify-end">
              <div>
                <p className="text-sm font-bold text-black">Ngày sinh</p>
                <p className="mt-1 text-base font-regular text-black">
                  {profile.dob}
                </p>
              </div>
            </div>
            <div className="mr-15">
              <p className="text-sm font-bold text-black">Phường</p>
              <p className="mt-1 text-base font-regular text-black">
                {profile.ward}
              </p>
            </div>

            {/* Edit Button */}
            <div className="flex items-center pb-1">
              <button
                onClick={handleOpenEditDialog}
                className="flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
              >
                <Edit className="h-4 w-4" />
                Sửa hồ sơ
              </button>
            </div>
          </div>
        </div>

        {/* === Tabs Section === */}
        {/* Thay thế Tabs của ShadCN bằng tab-nav đơn giản */}
        <div className="mt-10">
          <div className="border-b border-[#B1B1B1]">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {/* Tab Đã nộp */}
              <button
                onClick={() => setActiveTab("submitted")}
                className={`
                  ${
                    activeTab === "submitted"
                      ? "border-black text-black"
                      : "border-transparent text-black"
                  }
                  whitespace-nowrap cursor-pointer border-b-2 px-1 py-4 text-base font-medium
                `}
              >
                Đã nộp
              </button>

              {/* Tab Giải thưởng */}
              <button
                onClick={() => setActiveTab("awards")}
                className={`
                  ${
                    activeTab === "awards"
                      ? "border-black text-black"
                      : "border-transparent text-black hover:border-black hover:text-black"
                  }
                  whitespace-nowrap cursor-pointer border-b-2 px-1 py-4 text-base font-medium
                `}
              >
                Giải thưởng
              </button>

              {/* Tab Đơn hàng */}
              <button
                onClick={() => setActiveTab("orders")}
                className={`
                  ${
                    activeTab === "orders"
                      ? "border-black text-black"
                      : "border-transparent text-black hover:border-black hover:text-black"
                  }
                  whitespace-nowrap cursor-pointer border-b-2 px-1 py-4 text-base font-medium
                `}
              >
                Tranh sở hữu
              </button>
            </nav>
          </div>
        </div>

        {/* === Tab Content Section === */}
        <div className="py-8">
          {/* Nội dung tab "Đã nộp" */}
          {activeTab === "submitted" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {submittedArtworks.map((art) => (
                <div
                  key={art.id}
                  className="overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleViewPaintingDetail(art.id)}
                >
                  <div className="relative h-56 w-full">
                    <Image
                      src={art.imageUrl}
                      alt={art.competitionName}
                      layout="fill"
                      objectFit="cover"
                      className="bg-black rounded-md" // Placeholder
                    />
                  </div>
                  <div className="py-2">
                    <p className="text-sm text-black">
                      Ngày nộp:{" "}
                      {new Date(art.submissionDate).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="mt-1 font-medium text-black">
                      Cuộc thi: {art.competitionName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Nội dung tab "Giải thưởng" */}
          {activeTab === "awards" && (
            <div>
              {isLoadingAchievements ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#423137] mx-auto"></div>
                  <p className="text-[#423137] mt-2">Đang tải giải thưởng...</p>
                </div>
              ) : (
                <div>
                  {achievementsResp &&
                  achievementsResp.data.achievements.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {achievementsResp.data.achievements.map((a) => (
                        <div
                          key={a.paintingId}
                          className="overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleViewAwardDetail(a)}
                        >
                          <div className="relative h-56 w-full">
                            <Image
                              src={a.paintingImage || ""}
                              alt={a.paintingTitle}
                              layout="fill"
                              objectFit="cover"
                              className="bg-black rounded-md"
                            />
                          </div>
                          <div className="py-2">
                            <p className="text-sm text-black">
                              Cuộc thi: {a.contest?.title || "-"}
                            </p>
                            <p className="mt-1 font-medium text-black">
                              {a.paintingTitle}
                            </p>
                            <p className="text-sm text-black">
                              Giải: {a.award?.name || "-"}
                            </p>
                            <p className="text-sm text-black">
                              Ngày:{" "}
                              {a.achievedDate
                                ? new Date(a.achievedDate).toLocaleDateString(
                                    "vi-VN",
                                  )
                                : "-"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-black bg-gray-50">
                      <p className="text-black">Chưa có giải thưởng nào.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Nội dung tab "Đơn hàng" */}
          {activeTab === "orders" && <WonPaintings userId={authUser?.userId} />}
        </div>

        {/* Evaluation Detail Dialog */}
        {isEvaluationDialogOpen && selectedPaintingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={handleCloseEvaluationDialog}
            />
            <div className="relative z-10 w-full max-w-4xl rounded bg-white shadow-lg max-h-[90vh] overflow-hidden">
              <div className="flex items-start justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">
                  Đánh giá tranh
                </h3>
                <button
                  className="text-black cursor-pointer hover:text-gray-600"
                  onClick={handleCloseEvaluationDialog}
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {/* Painting Info */}
                {submissions && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-black mb-4">
                      Thông tin tranh
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(() => {
                        const painting = submissions.find(
                          (s) => s.paintingId === selectedPaintingId,
                        );
                        if (!painting) return null;
                        return (
                          <>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Tên tranh
                              </p>
                              <p className="text-black">{painting.title}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Cuộc thi
                              </p>
                              <p className="text-black">
                                {painting.contest?.title || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Ngày nộp
                              </p>
                              <p className="text-black">
                                {painting.updatedAt
                                  ? new Date(
                                      painting.updatedAt,
                                    ).toLocaleDateString("vi-VN")
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Trạng thái
                              </p>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  painting.status === "APPROVED" ||
                                  painting.status === "ACCEPTED"
                                    ? "bg-green-100 text-green-800"
                                    : painting.status === "ORIGINAL_SUBMITTED"
                                      ? "bg-blue-100 text-blue-800"
                                      : painting.status ===
                                          "NOT_SUBMITTED_ORIGINAL"
                                        ? "bg-orange-100 text-orange-800"
                                        : painting.status === "PENDING"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : painting.status === "REJECTED"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {painting.status === "APPROVED" ||
                                painting.status === "ACCEPTED"
                                  ? "Đã duyệt"
                                  : painting.status === "ORIGINAL_SUBMITTED"
                                    ? "Đã nộp bản gốc"
                                    : painting.status ===
                                        "NOT_SUBMITTED_ORIGINAL"
                                      ? "Chưa nộp bản gốc"
                                      : painting.status === "PENDING"
                                        ? "Chờ xử lý"
                                        : painting.status === "REJECTED"
                                          ? "Từ chối"
                                          : painting.status}
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Evaluations */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">
                    Đánh giá từ giám khảo
                  </h3>
                  {isLoadingEvaluations ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#423137] mx-auto"></div>
                      <p className="text-[#423137] mt-2">
                        Đang tải đánh giá...
                      </p>
                    </div>
                  ) : paintingEvaluations && paintingEvaluations.length > 0 ? (
                    <div className="space-y-4">
                      {paintingEvaluations.map((evaluation) => (
                        <div
                          key={evaluation.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-medium text-black">
                                {evaluation.examinerName}
                              </p>
                              <p className="text-sm text-gray-600">
                                Đánh giá ngày:{" "}
                                {new Date(
                                  evaluation.evaluationDate,
                                ).toLocaleDateString("vi-VN")}
                              </p>
                            </div>
                            <div className="text-right">
                              {evaluation.scoreRound1 && (
                                <p className="text-lg font-semibold text-blue-600">
                                  Điểm vòng sơ khảo: {evaluation.scoreRound1}/10
                                </p>
                              )}
                              {evaluation.scoreRound2 && (
                                <p className="text-lg font-semibold text-green-600">
                                  Điểm vòng chung khảo: {evaluation.scoreRound2}/10
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Detailed scores for round 2 */}
                          {(evaluation.creativityScore ||
                            evaluation.compositionScore ||
                            evaluation.colorScore ||
                            evaluation.technicalScore ||
                            evaluation.aestheticScore) && (
                            <div className="mb-3 flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-100">
                              <span className="text-sm font-medium text-gray-600">
                                Tổng điểm:
                              </span>
                              <span className="font-bold text-[#FF6E1A] text-lg">
                                {(evaluation.creativityScore || 0) +
                                  (evaluation.compositionScore || 0) +
                                  (evaluation.colorScore || 0) +
                                  (evaluation.technicalScore || 0) +
                                  (evaluation.aestheticScore || 0)}
                                /100
                              </span>
                            </div>
                          )}

                          {evaluation.feedback && (
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                Nhận xét:
                              </p>
                              <p className="text-black bg-gray-50 p-3 rounded">
                                {evaluation.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có đánh giá nào cho tranh này.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Award Detail Dialog */}
        {isAwardDialogOpen && selectedAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={handleCloseAwardDialog}
            />
            <div className="relative z-10 w-full max-w-4xl rounded bg-white shadow-lg max-h-[90vh] overflow-hidden">
              <div className="flex items-start justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">
                  Chi tiết giải thưởng
                </h3>
                <button
                  className="text-black cursor-pointer hover:text-gray-600"
                  onClick={handleCloseAwardDialog}
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {/* Painting Info */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-black">
                      Thông tin tranh
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenCertificateViewer}
                        className="inline-flex cursor-pointer items-center rounded bg-[#423137] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                      >
                        Xem chứng chỉ
                      </button>

                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Tên tranh
                      </p>
                      <p className="text-black">
                        {selectedAchievement.paintingTitle}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Cuộc thi
                      </p>
                      <p className="text-black">
                        {selectedAchievement.contest?.title || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Ngày đạt giải
                      </p>
                      <p className="text-black">
                        {selectedAchievement.achievedDate
                          ? new Date(
                              selectedAchievement.achievedDate,
                            ).toLocaleDateString("vi-VN")
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Giải thưởng
                      </p>
                      <p className="text-black">
                        {selectedAchievement.award?.name || "-"}
                      </p>
                    </div>
                  </div>
                  {selectedAchievement.paintingImage && (
                    <div className="mt-4">
                      <img
                        src={selectedAchievement.paintingImage}
                        alt={selectedAchievement.paintingTitle}
                        className="w-full max-h-64 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Award Details */}
                {selectedAchievement.award && (
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-4">
                      Chi tiết giải thưởng
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Tên giải
                          </p>
                          <p className="text-black">
                            {selectedAchievement.award.name}
                          </p>
                        </div>
                        {selectedAchievement.award.rank && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Hạng
                            </p>
                            <p className="text-black">
                              {selectedAchievement.award.rank}
                            </p>
                          </div>
                        )}
                        {selectedAchievement.award.prize && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Giải thưởng
                            </p>
                            <p className="text-black">
                              {formatCurrency(
                                Number(selectedAchievement.award.prize),
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                      {selectedAchievement.award.description && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Mô tả
                          </p>
                          <p className="text-black bg-gray-50 p-3 rounded">
                            {selectedAchievement.award.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isCertificateViewerOpen && selectedAchievement && (
          <div className="fixed inset-0 z-60 flex items-center justify-center px-4 py-8 md:py-10">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={handleCloseCertificateViewer}
            />
            <div className="relative z-10 w-full max-w-6xl max-h-full overflow-y-auto rounded bg-white p-4 shadow-lg">
              <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-lg font-semibold text-black">Chứng chỉ</h3>
                <button
                  className="cursor-pointer text-black hover:text-gray-600"
                  onClick={handleCloseCertificateViewer}
                >
                  ✕
                </button>
              </div>
              <CertificateViewer
                backgroundImage="/certificate.png"
                data={{
                  userName: authUser?.fullName || "Học sinh",
                  awardName: selectedAchievement.award?.name || "Giải thưởng",
                  awardRank: selectedAchievement.award?.rank,
                  contestName: selectedAchievement.contest?.title || "Cuộc thi",
                  date: selectedAchievement.achievedDate
                    ? new Date(
                        selectedAchievement.achievedDate,
                      ).toLocaleDateString("vi-VN")
                    : "-",
                  certificateId: `${selectedAchievement.paintingId}-${selectedAchievement.award?.awardId ?? "N/A"}`,
                  description: selectedAchievement.award?.description,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Chỉnh sửa hồ sơ</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Họ và tên</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={editFormData.fullName}
                  onChange={handleEditFormChange}
                  className="rounded-md border-gray-300 focus:border-black focus:ring-black"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  className="rounded-md border-gray-300 focus:border-black focus:ring-black"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditFormChange}
                  className="rounded-md border-gray-300 focus:border-black focus:ring-black"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseEditDialog}
                disabled={updateUserMutation.isPending}
                className="rounded-md"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="bg-black text-white hover:bg-gray-800 rounded-md"
              >
                {updateUserMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
