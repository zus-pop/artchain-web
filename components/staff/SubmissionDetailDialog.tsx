"use client";

import { useUploadRound2Painting } from "@/apis/paintings";
import {
  acceptStaffSubmission,
  getStaffSubmissionById,
  rejectStaffSubmission,
} from "@/apis/staff";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { useLanguageStore } from "@/store/language-store";
import { Submission } from "@/types/painting";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconCalendar,
  IconCheck,
  IconPhoto,
  IconTrophy,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod schema for form validation
const paintingDetailsSchema = z.object({
  title: z
    .string()
    .min(2, "Tiêu đề phải có ít nhất 2 ký tự")
    .max(200, "Tiêu đề phải ít hơn 200 ký tự")
    .optional(),
  description: z
    .string()
    .max(1000, "Mô tả phải ít hơn 1000 ký tự")
    .optional(),
  round2Image: z.any().optional(),
});

type PaintingDetailsForm = z.infer<typeof paintingDetailsSchema>;

interface SubmissionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paintingId: string;
  roundName: "ROUND_1" | "ROUND_2";
}

export function SubmissionDetailDialog({
  isOpen,
  onClose,
  paintingId,
  roundName,
}: SubmissionDetailDialogProps) {
  const queryClient = useQueryClient();
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  // React Hook Form setup
  const form = useForm<PaintingDetailsForm>({
    resolver: zodResolver(paintingDetailsSchema),
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      round2Image: undefined,
    },
  });

  // Fetch submission details
  const { data: submissionData, isLoading } = useQuery({
    queryKey: ["submission-detail", paintingId],
    queryFn: () => getStaffSubmissionById(paintingId),
    enabled: isOpen && !!paintingId,
  });

  const submission: Submission = submissionData?.data;
  const round2Image = form.watch("round2Image");

  // Create preview URL when round2Image changes
  useEffect(() => {
    if (round2Image && round2Image instanceof File) {
      const url = URL.createObjectURL(round2Image);
      setPreviewUrl(url);

      // Cleanup function
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [round2Image]);

  // Populate form when submission loads
  useEffect(() => {
    if (submission) {
      form.reset({
        title: submission.title || "",
        description: submission.description || "",
        round2Image: undefined,
      });
    }
  }, [submission, form]);

  // Cleanup preview URL when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.setValue("round2Image", undefined);
      setPreviewUrl(null);
      setIsImageRemoved(false);
    }
  }, [isOpen, form]);

  // Upload round 2 image mutation
  const uploadRound2PaintingMutation = useUploadRound2Painting();

  // Accept mutation
  const acceptMutation = useMutation({
    mutationFn: () => acceptStaffSubmission(paintingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["submission-detail", paintingId],
      });
      queryClient.invalidateQueries({ queryKey: ["round-submissions"] });
      onClose();
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (reason?: string) =>
      rejectStaffSubmission(paintingId, reason ? { reason } : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["submission-detail", paintingId],
      });
      queryClient.invalidateQueries({ queryKey: ["round-submissions"] });
      setShowRejectInput(false);
      setRejectReason("");
      onClose();
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "staff-badge-pending";
      case "ACCEPTED":
        return "staff-badge-active";
      case "REJECTED":
        return "staff-badge-rejected";
      default:
        return "staff-badge-neutral";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return t.pendingReview;
      case "ACCEPTED":
        return t.approved;
      case "REJECTED":
        return t.rejected;
      case "ORIGINAL_SUBMITTED":
        return t.originalSubmittedStatus;
      case "NOT_SUBMITTED_ORIGINAL":
        return t.originalNotSubmittedStatus;
      default:
        return status;
    }
  };

  const handleAccept = () => {
    if (confirm("Bạn có chắc chắn muốn chấp nhận bài nộp này không?")) {
      acceptMutation.mutate();
    }
  };

  const handleReject = () => {
    if (showRejectInput) {
      if (confirm("Bạn có chắc chắn muốn từ chối bài nộp này không?")) {
        rejectMutation.mutate(rejectReason || undefined);
      }
    } else {
      setShowRejectInput(true);
    }
  };

  const handleCancelReject = () => {
    setShowRejectInput(false);
    setRejectReason("");
  };

  const handleUpdatePaintingDetails = form.handleSubmit((data) => {
    const updateData: {
      paintingId: string;
      title?: string;
      description?: string;
      image?: File;
    } = {
      paintingId: paintingId,
    };

    if (data.title?.trim()) {
      updateData.title = data.title.trim();
    }

    if (data.description?.trim()) {
      updateData.description = data.description.trim();
    }

    if (data.round2Image instanceof File) {
      updateData.image = data.round2Image;
    }

    // Only proceed if at least one field has content
    if (!updateData.title && !updateData.description && !updateData.image) {
      return;
    }

    uploadRound2PaintingMutation.mutate(updateData, {
      onSuccess: () => {
        onClose();
      },
    });
  });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">{t.loading}</DialogTitle>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--staff-primary)]"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!submission) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogTitle className="sr-only">{t.noSubmissionsFound}</DialogTitle>
          <div className="text-center py-8 staff-text-secondary">
            {t.noSubmissionsFound}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold staff-text-primary">
            {t.submissionDetail}
          </DialogTitle>
          <div className="flex items-center justify-between mt-2">
            <span className={getStatusColor(submission.status)}>
              {getStatusText(submission.status)}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Slot - Integrated Upload */}
          <div className="relative w-full h-96 bg-gray-100 rounded-sm overflow-hidden border-2 border-[var(--staff-border)]">
            {submission.imageUrl && !isImageRemoved ? (
              <div className="relative w-full h-full">
                <Image
                  src={submission.imageUrl}
                  alt={submission.title}
                  fill
                  className="object-contain"
                />
                {roundName?.toUpperCase().includes("ROUND_2") && (
                  <button
                    onClick={() => setIsImageRemoved(true)}
                    className="absolute top-4 right-4 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all group"
                    title="Xóa ảnh hiện tại để thay đổi"
                  >
                    <IconX className="h-5 w-5" />
                    <span className="absolute right-full mr-2 bg-black/80 text-white text-xs px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      Xóa ảnh hiện tại
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50/50">
                {roundName?.toUpperCase().includes("ROUND_2") && submission.status === "ACCEPTED" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    {previewUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                        <button
                          onClick={() => form.setValue("round2Image", undefined)}
                          className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full shadow-md z-10"
                        >
                          <IconX className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-2 rounded-sm text-xs backdrop-blur-sm">
                          <p className="font-bold">Ảnh mới đã chọn:</p>
                          <p className="truncate">{(round2Image as File)?.name}</p>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all w-full h-full border-4 border-dashed border-gray-200 rounded-sm group bg-gray-50/50">
                        <div className="p-6 rounded-full bg-white text-gray-400 group-hover:text-gray-600 group-hover:scale-110 transition-all shadow-sm">
                          <IconPhoto className="h-16 w-16" />
                        </div>
                        <p className="text-xl font-bold text-gray-700 mt-6 mb-2 uppercase tracking-wide">
                          Tải lên hình Vòng Chung Khảo
                        </p>
                        <p className="text-sm text-gray-400 font-medium italic">
                          Nhấp để chọn tệp hoặc kéo thả vào đây
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) form.setValue("round2Image", file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <IconPhoto className="h-20 w-20 mx-auto mb-4 opacity-20" />
                    <p className="text-xl font-bold text-gray-400">
                      {t.noImageAvailable}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title and Description - Editable */}
          <div className="space-y-4">
            <div>
              <label className="staff-type-label staff-text-primary mb-2 block">
                {t.titleLabel}
              </label>
              <input
                {...form.register("title")}
                readOnly={roundName === "ROUND_1"}
                className={`w-full px-3 py-2 border border-[var(--staff-border)] focus:outline-none transition-all duration-200 ${
                  roundName === "ROUND_1"
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-white focus:ring-2 focus:ring-[var(--staff-primary)]"
                }`}
                placeholder="Nhập tiêu đề tranh"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="staff-type-label staff-text-primary mb-2 block">
                {t.descriptionLabel}
              </label>
              <textarea
                {...form.register("description")}
                rows={4}
                readOnly={roundName === "ROUND_1"}
                className={`w-full px-3 py-2 border border-[var(--staff-border)] focus:outline-none transition-all duration-200 resize-none ${
                  roundName === "ROUND_1"
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-white focus:ring-2 focus:ring-[var(--staff-primary)]"
                }`}
                placeholder="Nhập mô tả tranh"
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            </div>

          {/* Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* <div className="border border-[var(--staff-border)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconUser className="h-5 w-5 staff-text-secondary" />
              </div>
              <p className="text-sm staff-text-primary font-semibold break-all">
                {submission.competitor.fullName}
              </p>
            </div> */}

            {/* <div className="border border-[var(--staff-border)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconTrophy className="h-5 w-5 staff-text-secondary" />
                <p className="text-sm font-medium staff-text-secondary">
                  {t.contest} ID
                </p>
              </div>
              <p className="text-sm staff-text-primary font-semibold">
                {submission.contestId}
              </p>
            </div> */}

            {/* <div className="border border-[var(--staff-border)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconCalendar className="h-5 w-5 staff-text-secondary" />
                <p className="text-sm font-medium staff-text-secondary">
                  {t.rounds} ID
                </p>
              </div>
              <p className="text-sm staff-text-primary font-semibold">
                {submission.roundId}
              </p>
            </div> */}
            {/* <div className="border border-[var(--staff-border)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconCalendar className="h-5 w-5 staff-text-secondary" />
              </div>
              {submission.submissionDate && (
                <p className="text-sm staff-text-primary font-semibold">
                  {formatDate({ dateString: submission.submissionDate })}
                </p>
              )}
            </div> */}
          </div>



          {/* Metadata - Hide for Round 2 */}
          {/* {!roundName.toUpperCase().includes("ROUND_2") && (
            <div className=" ">
              <div>
                <p className="text-xs staff-text-secondary mb-1">{t.created}</p>
                <p className="text-sm staff-text-primary">
                  {formatDate({ dateString: submission.createdAt })}
                </p>
              </div>
              <div>
                <p className="text-xs staff-text-secondary mb-1">{t.updated}</p>
                <p className="text-sm staff-text-primary">
                  {formatDate({ dateString: submission.updatedAt })}
                </p>
              </div>
            </div>
          )} */}

          {/* Reject Reason Input */}
          {showRejectInput && (
            <div className="border-2 border-red-300 bg-red-50 p-4">
              <label className="text-sm font-medium text-red-700 mb-2 block">
                Lý do từ chối (Tùy chọn)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-red-300 focus:outline-none focus:ring-2 focus:ring-[var(--staff-primary)] transition-all duration-200"
                rows={3}
                placeholder="Cung cấp lý do từ chối..."
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {submission.status === "PENDING" && (
          <DialogFooter className="flex gap-2">
            {showRejectInput ? (
              <>
                <button
                  onClick={handleCancelReject}
                  className="px-4 py-2 border-2 border-[var(--staff-border)] staff-text-primary font-semibold hover:bg-[#f7f7f7] transition-colors"
                  disabled={rejectMutation.isPending}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
                  disabled={rejectMutation.isPending}
                >
                  <IconX className="h-4 w-4 inline mr-2" />
                  {rejectMutation.isPending ? "Đang từ chối..." : "Xác nhận từ chối"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border-2 border-[var(--staff-border)] staff-text-primary font-semibold hover:bg-[#f7f7f7] transition-colors"
                >
                  {t.close}
                </button>
                {/* <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
                  disabled={acceptMutation.isPending}
                >
                  <IconX className="h-4 w-4 inline mr-2" />
                  {t.reject}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-linear-to-r from-green-500 to-green-600 text-white font-semibold shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
                  disabled={acceptMutation.isPending}
                >
                  <IconCheck className="h-4 w-4 inline mr-2" />
                  {acceptMutation.isPending ? "Accepting..." : "Accept"}
                </button> */}
              </>
            )}
          </DialogFooter>
        )}

        {submission.status !== "PENDING" && (
  <DialogFooter>
    <div className="flex flex-row w-full gap-3 mt-4">
      {/* Nút Đóng - flex-1 để chiếm 1/2 chiều rộng */}
      <button
        onClick={onClose}
        className="flex-1 px-4 py-2.5 border-2 border-[var(--staff-border)] staff-text-primary font-bold hover:bg-[#f7f7f7] transition-all rounded-sm"
      >
        {t.close}
      </button>
      
      {/* Nút Cập nhật - flex-1 để chiếm 1/2 chiều rộng còn lại */}
      {roundName?.toUpperCase().includes("ROUND_2") && submission.status === "ACCEPTED" && (
        <button
          onClick={handleUpdatePaintingDetails}
          disabled={
            uploadRound2PaintingMutation.isPending ||
            (!form.watch("title")?.trim() &&
              !form.watch("description")?.trim() &&
              !round2Image) ||
            !!form.formState.errors.title ||
            !!form.formState.errors.description ||
            !!form.formState.errors.round2Image
          }
          className="flex-1 staff-btn-primary flex items-center justify-center gap-2 py-2.5 rounded-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconCheck className="h-5 w-5" />
          <span className="font-bold uppercase tracking-wider text-sm whitespace-nowrap">
            {uploadRound2PaintingMutation.isPending
              ? t.updating
              : t.update}
          </span>
        </button>
      )}
    </div>
  </DialogFooter>
)}
      </DialogContent>
    </Dialog>
  );
}
