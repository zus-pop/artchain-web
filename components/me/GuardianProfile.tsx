"use client";

import { GuardianChild, WhoAmI } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useGetUserAchievements } from "@/apis/achievements";
import { useGetMySubmissions, useGetUserSubmissions, useGetPaintingEvaluations } from "@/apis/paintings";
import { PaintingEvaluation, CompetitorSubmission } from "@/types/painting";

interface GuardianProfileScreenProps {
  authUser: WhoAmI | null;
  guardianChildren: GuardianChild[] | undefined;
  isLoadingChildren: boolean;
}



// GUARDIAN PROFILE SCREEN COMPONENT
export default function GuardianProfileScreen({
  authUser,
  guardianChildren,
  isLoadingChildren,
}: GuardianProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<
    "children" | "competitions" | "progress" | "about"
  >("children");
  const [selectedChild, setSelectedChild] = useState<GuardianChild | null>(
    null
  );
  const [modalActiveTab, setModalActiveTab] = useState<"submitted" | "awards">(
    "submitted"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingPaintingDetail, setViewingPaintingDetail] = useState(false);
  const [selectedPaintingId, setSelectedPaintingId] = useState<string | null>(null);
  const itemsPerPage = 2;

  // Fetch achievements for selected child (hook is safe to call with undefined)
  const { data: childAchievementsResp, isLoading: isLoadingChildAchievements } = useGetUserAchievements(
    selectedChild?.userId,
    modalActiveTab === "awards"
  );

  // Reset page when child or tab changes
  useEffect(() => {
    setCurrentPage(1);
    setViewingPaintingDetail(false);
    setSelectedPaintingId(null);
  }, [selectedChild, modalActiveTab]);

  // Fetch submissions for selected child (guardian API expects competitor UUID)
  const { data: childSubmissions, isLoading: isLoadingChildSubmissions } = useGetUserSubmissions(
    selectedChild?.userId
  );

  // Fetch evaluations for selected painting
  const { data: paintingEvaluations, isLoading: isLoadingEvaluations } = useGetPaintingEvaluations(
    selectedPaintingId || ""
  );

  // Handle viewing painting evaluation details
  const handleViewPaintingDetail = (paintingId: string) => {
    setSelectedPaintingId(paintingId);
    setViewingPaintingDetail(true);
  };

  const handleBackToSubmissions = () => {
    setViewingPaintingDetail(false);
    setSelectedPaintingId(null);
  };

  // Component for displaying painting evaluation details
  function PaintingEvaluationDetail({ 
    evaluations, 
    selectedSubmission, 
    onBack 
  }: { 
    evaluations: PaintingEvaluation[] | null | undefined; 
    selectedSubmission: CompetitorSubmission | undefined;
    onBack: () => void;
  }) {
    if (!selectedSubmission) return null;

    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex cursor-pointer items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại danh sách</span>
          </button>
        </div>

        {/* Painting Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Thông tin tranh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Tên tranh</p>
              <p className="text-black">{selectedSubmission.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Cuộc thi</p>
              <p className="text-black">{selectedSubmission.contestTitle || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ngày nộp</p>
              <p className="text-black">
                {selectedSubmission.submissionDate ? new Date(selectedSubmission.submissionDate).toLocaleDateString("vi-VN") : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Trạng thái</p>
              <span className={`text-xs px-2 py-1 rounded ${
                selectedSubmission.status === 'APPROVED' || selectedSubmission.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                selectedSubmission.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedSubmission.status === 'APPROVED' || selectedSubmission.status === 'ACCEPTED' ? 'Đã duyệt' : 
                 selectedSubmission.status === 'PENDING' ? 'Chờ duyệt' : selectedSubmission.status}
              </span>
            </div>
          </div>
        </div>

        {/* Evaluations */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Đánh giá từ giám khảo</h3>
          {isLoadingEvaluations ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#423137] mx-auto"></div>
              <p className="text-[#423137] mt-2">Đang tải đánh giá...</p>
            </div>
          ) : evaluations && evaluations.length > 0 ? (
            <div className="space-y-4">
              {evaluations.map((evaluation) => (
                <div key={evaluation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-black">{evaluation.examinerName}</p>
                      <p className="text-sm text-gray-600">
                        Đánh giá ngày: {new Date(evaluation.evaluationDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="text-right">
                      {evaluation.scoreRound1 && (
                        <p className="text-lg font-semibold text-blue-600">
                          Điểm vòng 1: {evaluation.scoreRound1}/10
                        </p>
                      )}
                      {evaluation.scoreRound2 && (
                        <p className="text-lg font-semibold text-green-600">
                          Điểm vòng 2: {evaluation.scoreRound2}/10
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Detailed scores for round 2 */}
                  {(evaluation.creativityScore || evaluation.compositionScore || 
                    evaluation.colorScore || evaluation.technicalScore || evaluation.aestheticScore) && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                      {evaluation.creativityScore && (
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Sáng tạo</p>
                          <p className="font-medium">{evaluation.creativityScore}/10</p>
                        </div>
                      )}
                      {evaluation.compositionScore && (
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Bố cục</p>
                          <p className="font-medium">{evaluation.compositionScore}/10</p>
                        </div>
                      )}
                      {evaluation.colorScore && (
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Màu sắc</p>
                          <p className="font-medium">{evaluation.colorScore}/10</p>
                        </div>
                      )}
                      {evaluation.technicalScore && (
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Kỹ thuật</p>
                          <p className="font-medium">{evaluation.technicalScore}/10</p>
                        </div>
                      )}
                      {evaluation.aestheticScore && (
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Thẩm mỹ</p>
                          <p className="font-medium">{evaluation.aestheticScore}/10</p>
                        </div>
                      )}
                    </div>
                  )}

                  {evaluation.feedback && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Nhận xét:</p>
                      <p className="text-black bg-gray-50 p-3 rounded">{evaluation.feedback}</p>
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
    );
  }

  // Xử lý dữ liệu từ authUser, dùng fallback
  const profile = {
    name: authUser?.fullName || "Loading...",
    dob: authUser?.birthday
      ? new Date(authUser.birthday).toLocaleDateString("vi-VN")
      : "Chưa cập nhật",
    ward: authUser?.ward || "Chưa cập nhật",
    avatarUrl:
      authUser?.avatarUrl ||
      "https://images.unsplash.com/photo-1564153943327-fa0006d0f633?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1480",
    bannerUrl:
      "https://plus.unsplash.com/premium_photo-1667502842264-9cdcdac36086?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2022",
  };

  // Child component that renders submission directly (no need for detail fetch since API returns full data)
  function SubmissionItem({ submission, onClick }: { submission: CompetitorSubmission; onClick?: () => void }) {
    const contestTitle = submission.contestTitle || "N/A";

    return (
      <div 
        className={`overflow-hidden border border-gray-200 rounded-lg ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
        onClick={onClick}
      >
        <div className="relative h-48 w-full bg-gray-200">
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                🎨
              </div>
              <p className="text-sm">Hình ảnh</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-black">
            Ngày nộp: {submission.submissionDate ? new Date(submission.submissionDate).toLocaleDateString("vi-VN") : "-"}
          </p>
          <p className="mt-1 font-medium text-black">Cuộc thi: {contestTitle}</p>
          <p className="text-sm text-gray-600 mt-1">{submission.title}</p>
          <div className="flex justify-between items-center mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              submission.status === 'APPROVED' || submission.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
              submission.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {submission.status === 'APPROVED' || submission.status === 'ACCEPTED' ? 'Đã duyệt' : submission.status === 'PENDING' ? 'Chờ duyệt' : submission.status}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAE6E0]">
      {/* === Banner Section === */}
      <div className="relative h-48 w-full sm:h-56">
        <Image
          src={profile.bannerUrl}
          alt="Banner"
          layout="fill"
          objectFit="cover"
          className="bg-gradient-to-r from-blue-100 via-pink-100 to-orange-100"
        />
      </div>

      {/* === Main Content Area === */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* === Profile Info Section === */}
        <div className="relative -mt-24 sm:-mt-28">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8 mt-[7vh]">
            {/* Left side: Avatar và Tên */}
            <div className="flex items-end">
              <div className="relative h-32 w-32 flex-shrink-0 sm:h-40 sm:w-40">
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
                <p className="mt-1 text-sm text-black">Phụ huynh</p>
                <p className="text-sm text-black">
                  Quản lý {guardianChildren?.length || 0} thí sinh
                </p>
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
          </div>
        </div>

        {/* Child modal with tabs */}
        {selectedChild && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSelectedChild(null)}
            />
            <div className="relative z-10 w-full max-w-4xl rounded bg-white shadow-lg max-h-[90vh] overflow-hidden">
              <div className="flex items-start justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">
                  {selectedChild.fullName}
                </h3>
                <button
                  className="text-black cursor-pointer hover:text-gray-600"
                  onClick={() => setSelectedChild(null)}
                >
                  ✕
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setModalActiveTab("submitted")}
                    className={`
                      ${
                        modalActiveTab === "submitted"
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                      whitespace-nowrap cursor-pointer border-b-2 px-6 py-4 text-sm font-medium
                    `}
                  >
                    Tranh đã nộp
                  </button>
                  <button
                    onClick={() => setModalActiveTab("awards")}
                    className={`
                      ${
                        modalActiveTab === "awards"
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                      whitespace-nowrap cursor-pointer border-b-2 px-6 py-4 text-sm font-medium
                    `}
                  >
                    Giải thưởng
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Tab "Tranh đã nộp" */}
                {modalActiveTab === "submitted" && !viewingPaintingDetail && (
                  <div>
                    {isLoadingChildSubmissions ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#423137] mx-auto"></div>
                        <p className="text-[#423137] mt-2">Đang tải tranh đã nộp...</p>
                      </div>
                    ) : childSubmissions && Array.isArray(childSubmissions) && childSubmissions.length > 0 ? (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          {childSubmissions
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((submission: CompetitorSubmission) => (
                              <SubmissionItem 
                                key={submission.paintingId} 
                                submission={submission}
                                onClick={() => handleViewPaintingDetail(submission.paintingId)}
                              />
                            ))}
                        </div>
                        {/* Pagination */}
                        {childSubmissions.length > itemsPerPage && (
                          <div className="flex justify-center items-center space-x-2">
                            <button
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="px-3 cursor-pointer py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                            >
                              Trước
                            </button>
                            <span className="text-sm text-gray-600">
                              Trang {currentPage} / {Math.ceil(childSubmissions.length / itemsPerPage)}
                            </span>
                            <button
                              onClick={() => setCurrentPage(Math.min(Math.ceil(childSubmissions.length / itemsPerPage), currentPage + 1))}
                              disabled={currentPage === Math.ceil(childSubmissions.length / itemsPerPage)}
                              className="px-3 cursor-pointer py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                            >
                              Sau
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-black">Chưa có tranh nào được nộp.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Painting Evaluation Detail View */}
                {modalActiveTab === "submitted" && viewingPaintingDetail && (
                  <PaintingEvaluationDetail
                    evaluations={paintingEvaluations}
                    selectedSubmission={Array.isArray(childSubmissions) ? childSubmissions.find(sub => sub.paintingId === selectedPaintingId) : undefined}
                    onBack={handleBackToSubmissions}
                  />
                )}

                {/* Tab "Giải thưởng" */}
                {modalActiveTab === "awards" && (
                  <div>
                    {isLoadingChildAchievements ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#423137] mx-auto"></div>
                        <p className="text-[#423137] mt-2">Đang tải giải thưởng...</p>
                      </div>
                    ) : childAchievementsResp && childAchievementsResp.data.achievements.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {childAchievementsResp.data.achievements.map((a) => (
                          <div key={a.paintingId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                            <div className="h-20 w-20 relative flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                              {a.paintingImage ? (
                                <Image 
                                  src={a.paintingImage} 
                                  alt={a.paintingTitle} 
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  🎨
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-black">{a.paintingTitle}</div>
                              <div className="text-sm text-[#423137]">Cuộc thi: {a.contest?.title || "-"}</div>
                              <div className="text-sm text-[#423137]">Giải: {a.award?.name || "-"}</div>
                              <div className="text-sm text-[#423137]">Ngày: {a.achievedDate ? new Date(a.achievedDate).toLocaleDateString("vi-VN") : "-"}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-black">Chưa có giải thưởng nào.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Guardian Stats
        <div className="py-10 border-black text-center">
          <div className="flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div className="p-2 pt-3 pb-1.5 flex flex-col rounded-xl bg-gray-50 w-full mx-auto mb-6">
                <div className="flex divide-x divide-black">
                  <div className="flex-1 pr-6">
                    <p className="text-xs font-medium text-black">
                      Quản lý thí sinh
                    </p>
                    <p className="text-xl font-semibold text-black">
                      {guardianChildren?.length || 0}
                    </p>
                  </div>
                  <div className="flex-1 pl-6">
                    <p className="text-xs font-medium text-black">
                      Số bài dự thi
                    </p>
                    <p className="text-xl font-semibold text-black">
                      {guardianChildren?.reduce(
                        (total, child) =>
                          total + (child.status === 1 ? 1 : 0),
                        0
                      ) || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* === Tabs Section === */}
        <div className="mt-10">
          <div className="border-b border-[#B1B1B1]">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {/* Tab Con em */}
              <button
                onClick={() => setActiveTab("children")}
                className={`
                  ${
                    activeTab === "children"
                      ? "border-black text-black"
                      : "border-transparent text-black hover:border-black hover:text-black"
                  }
                  whitespace-nowrap cursor-pointer border-b-2 px-1 py-4 text-base font-medium
                `}
              >
                Thí sinh
              </button>

              {/* Tab Thông tin */}
              <button
                onClick={() => setActiveTab("about")}
                className={`
                  ${
                    activeTab === "about"
                      ? "border-black text-black"
                      : "border-transparent text-black hover:border-black hover:text-black"
                  }
                  whitespace-nowrap cursor-pointer border-b-2 px-1 py-4 text-base font-medium
                `}
              >
                Thông tin
              </button>
            </nav>
          </div>
        </div>

        {/* === Tab Content Section === */}
        <div className="py-8">
          {/* Nội dung tab "Con em" */}
          {activeTab === "children" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div></div>
                <Link
                  href="/add-child"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors flex items-center space-x-2 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm các bé</span>
                </Link>
              </div>
              {isLoadingChildren ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#423137] mx-auto"></div>
                  <p className="text-[#423137] mt-2">
                    Đang tải danh sách con em...
                  </p>
                </div>
              ) : guardianChildren && guardianChildren.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {guardianChildren.map((child) => (
                    <div
                      key={child.userId}
                      className="p-8 border border-[#423137] rounded-sm bg-[#F2F2F2] overflow-hidden aspect-video lg:aspect-[487/251] cursor-pointer"
                      onClick={() => setSelectedChild(child)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div>
                          <h4 className="font-semibold text-3xl text-[#423137]">
                            {child.fullName}
                          </h4>
                          {/* username removed to match provided design - keep styling unchanged */}
                        </div>
                      </div>
                      <div className="space-y-1 text-base text-[#423137]">
                        <p>
                          <span className="font-medium text-black">Email:</span>{" "}
                          {child.email}
                        </p>
                        <p>
                          <span className="font-medium text-black">
                            Trường:
                          </span>{" "}
                          {child.schoolName || "Chưa cập nhật"}
                        </p>
                        <p>
                          <span className="font-medium text-black">Lớp:</span>{" "}
                          {child.grade || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-black">Chưa có con em nào được đăng ký</p>
                  <p className="text-sm text-black mt-1">
                    Hãy thêm con em để bắt đầu tham gia cuộc thi
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Nội dung tab "Cuộc thi" */}
          {activeTab === "competitions" && (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-black bg-gray-50">
              <p className="text-black">Chưa có cuộc thi nào.</p>
            </div>
          )}

          {/* Nội dung tab "Tiến độ" */}
          {activeTab === "progress" && (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-black bg-gray-50">
              <p className="text-black">Chưa có tiến độ nào.</p>
            </div>
          )}

          {/* Nội dung tab "Thông tin" */}
          {activeTab === "about" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">
                  Họ và tên
                </label>
                <p className="text-[#423137]">{authUser?.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Email
                </label>
                <p className="text-[#423137]">{authUser?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Số điện thoại
                </label>
                <p className="text-[#423137]">
                  {authUser?.phone || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}