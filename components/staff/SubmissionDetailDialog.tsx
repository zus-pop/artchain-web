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
    .min(2, "Title must be at least 2 character")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
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

  const handleAccept = () => {
    if (confirm("Are you sure you want to accept this submission?")) {
      acceptMutation.mutate();
    }
  };

  const handleReject = () => {
    if (showRejectInput) {
      if (confirm("Are you sure you want to reject this submission?")) {
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

    uploadRound2PaintingMutation.mutate(updateData);
  });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">{t.loading}</DialogTitle>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d9534f]"></div>
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
              {submission.status}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative w-full h-96 bg-gray-100">
            {submission.imageUrl ? (
              <Image
                src={submission.imageUrl}
                alt={submission.title}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <IconPhoto className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">{t.noImageAvailable}</p>
                </div>
              </div>
            )}
          </div>

          {/* Title and Description - Editable */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium staff-text-primary mb-2">
                {t.titleLabel}
              </label>
              <input
                {...form.register("title")}
                className="w-full px-3 py-2 border border-[#e6e2da] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter painting title"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium staff-text-primary mb-2">
                {t.descriptionLabel}
              </label>
              <textarea
                {...form.register("description")}
                rows={4}
                className="w-full px-3 py-2 border border-[#e6e2da] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Enter painting description"
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Round 2 Image Upload - Integrated */}
            {roundName &&
              (roundName.toLowerCase().includes("round 2") ||
                roundName.toLowerCase().includes("round_2") ||
                roundName.toLowerCase().includes(" 2")) &&
              submission.status === "ACCEPTED" && (
                <div className="border border-[#e6e2da] rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <IconPhoto className="h-5 w-5 staff-text-secondary" />
                    <h4 className="font-semibold staff-text-primary">
                      {t.image} {t.rounds} 2
                    </h4>
                  </div>
                  <p className="text-sm staff-text-secondary mb-4">
                    {t.submissionRound2ImageUpload}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium staff-text-primary mb-2 block">
                        {t.selectValidImage}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          form.setValue("round2Image", file);
                        }}
                        className="w-full px-3 py-2 border border-[#e6e2da] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      {round2Image && (
                        <p className="text-xs staff-text-secondary mt-1">
                          {t.selectedFile}: {round2Image.name}
                        </p>
                      )}
                      {form.formState.errors.round2Image && (
                        <p className="text-red-500 text-sm mt-1">
                          {typeof form.formState.errors.round2Image.message ===
                          "string"
                            ? form.formState.errors.round2Image.message
                            : "Invalid file"}
                        </p>
                      )}
                    </div>

                    {/* Image Preview */}
                    {round2Image && previewUrl && (
                      <div className="border border-[#e6e2da] rounded-lg p-4 bg-white">
                        <h5 className="text-sm font-medium staff-text-primary mb-3">
                          {t.previewMode}
                        </h5>
                        <div className="relative w-full h-48 bg-white rounded border">
                          <Image
                            src={previewUrl}
                            alt="Round 2 image preview"
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                        <div className="mt-2 text-xs staff-text-secondary">
                          <p>
                            {t.fileSize}:{" "}
                            {(round2Image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p>
                            {t.fileType}: {round2Image.type}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            <div className="flex justify-end">
              <button
                onClick={handleUpdatePaintingDetails}
                disabled={
                  uploadRound2PaintingMutation.isPending ||
                  (!form.watch("title")?.trim() &&
                    !form.watch("description")?.trim() &&
                    !round2Image) ||
                  !!form.formState.errors.title ||
                  !!form.formState.errors.description ||
                  (roundName &&
                    (roundName.toLowerCase().includes("round 2") ||
                      roundName.toLowerCase().includes("round_2") ||
                      roundName.toLowerCase().includes(" 2")) &&
                    submission.status === "ACCEPTED" &&
                    !!form.formState.errors.round2Image)
                }
                className="staff-btn-primary disabled:opacity-50 flex items-center gap-2"
              >
                <IconCheck className="h-4 w-4" />
                {uploadRound2PaintingMutation.isPending ? t.updating : t.update}
              </button>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#e6e2da] p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconUser className="h-5 w-5 staff-text-secondary" />
                <p className="text-sm font-medium staff-text-secondary">
                  {t.artistLabel}
                </p>
              </div>
              <p className="text-sm staff-text-primary font-semibold break-all">
                {submission.competitor.fullName}
              </p>
            </div>

            <div className="border border-[#e6e2da] p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconTrophy className="h-5 w-5 staff-text-secondary" />
                <p className="text-sm font-medium staff-text-secondary">
                  {t.contest} ID
                </p>
              </div>
              <p className="text-sm staff-text-primary font-semibold">
                {submission.contestId}
              </p>
            </div>

            <div className="border border-[#e6e2da] p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconCalendar className="h-5 w-5 staff-text-secondary" />
                <p className="text-sm font-medium staff-text-secondary">
                  {t.rounds} ID
                </p>
              </div>
              <p className="text-sm staff-text-primary font-semibold">
                {submission.roundId}
              </p>
            </div>

            <div className="border border-[#e6e2da] p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconCalendar className="h-5 w-5 staff-text-secondary" />
                <p className="text-sm font-medium staff-text-secondary">
                  {t.submissionDate}
                </p>
              </div>
              {submission.submissionDate && (
                <p className="text-sm staff-text-primary font-semibold">
                  {formatDate({ dateString: submission.submissionDate })}
                </p>
              )}
            </div>

            {submission.awardId && (
              <div className="border border-[#e6e2da] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconTrophy className="h-5 w-5 staff-text-secondary" />
                  <p className="text-sm font-medium staff-text-secondary">
                    {t.awards} ID
                  </p>
                </div>
                <p className="text-sm staff-text-primary font-semibold">
                  {submission.awardId}
                </p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e6e2da]">
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

          {/* Reject Reason Input */}
          {showRejectInput && (
            <div className="border-2 border-red-300 bg-red-50 p-4">
              <label className="text-sm font-medium text-red-700 mb-2 block">
                Rejection Reason (Optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                rows={3}
                placeholder="Provide a reason for rejection..."
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
                  className="px-4 py-2 border-2 border-[#e6e2da] staff-text-primary font-semibold hover:bg-[#f7f7f7] transition-colors"
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
                  {rejectMutation.isPending ? "Rejecting..." : "Confirm Reject"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border-2 border-[#e6e2da] staff-text-primary font-semibold hover:bg-[#f7f7f7] transition-colors"
                >
                  {t.close}
                </button>
                <button
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
                </button>
              </>
            )}
          </DialogFooter>
        )}

        {submission.status !== "PENDING" && (
          <DialogFooter>
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-[#e6e2da] staff-text-primary font-semibold hover:bg-[#f7f7f7] transition-colors"
            >
              {t.close}
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
