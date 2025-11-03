"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStaffSubmissionById,
  acceptStaffSubmission,
  rejectStaffSubmission,
} from "@/apis/staff";
import { useUploadRound2Image } from "@/apis/paintings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  IconCalendar,
  IconCheck,
  IconX,
  IconUser,
  IconTrophy,
  IconUpload,
  IconPhoto,
} from "@tabler/icons-react";
import Image from "next/image";

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
  const [round2Image, setRound2Image] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch submission details
  const { data: submissionData, isLoading } = useQuery({
    queryKey: ["submission-detail", paintingId],
    queryFn: () => getStaffSubmissionById(paintingId),
    enabled: isOpen && !!paintingId,
  });

  const submission = submissionData?.data;
  // Create preview URL when round2Image changes
  useEffect(() => {
    if (round2Image) {
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

  // Cleanup preview URL when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setRound2Image(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  // Upload round 2 image mutation
  const uploadRound2ImageMutation = useUploadRound2Image();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const handleRound2ImageUpload = () => {
    if (round2Image && paintingId) {
      const formData = new FormData();
      formData.append("image", round2Image);

      uploadRound2ImageMutation.mutate(
        {
          paintingId,
          image: round2Image,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
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
          <div className="text-center py-8 staff-text-secondary">
            Submission not found
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
            Submission Details
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
                  <p className="text-lg">No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="text-2xl font-bold staff-text-primary mb-2">
              {submission.title}
            </h3>
            <p className="staff-text-secondary whitespace-pre-wrap">
              {submission.description}
            </p>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#e6e2da] p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconUser className="h-5 w-5 staff-text-secondary" />
                <p className="text-sm font-medium staff-text-secondary">
                  Competitor ID
                </p>
              </div>
              <p className="text-sm staff-text-primary font-semibold break-all">
                {submission.competitorId}
              </p>
            </div>

            <div className="border border-[#e6e2da] p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconTrophy className="h-5 w-5 staff-text-secondary" />
                <p className="text-sm font-medium staff-text-secondary">
                  Contest ID
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
                  Round ID
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
                  Submission Date
                </p>
              </div>
              <p className="text-sm staff-text-primary font-semibold">
                {formatDate(submission.submissionDate)}
              </p>
            </div>

            {submission.awardId && (
              <div className="border border-[#e6e2da] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconTrophy className="h-5 w-5 staff-text-secondary" />
                  <p className="text-sm font-medium staff-text-secondary">
                    Award ID
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
              <p className="text-xs staff-text-secondary mb-1">Created At</p>
              <p className="text-sm staff-text-primary">
                {formatDate(submission.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs staff-text-secondary mb-1">Updated At</p>
              <p className="text-sm staff-text-primary">
                {formatDate(submission.updatedAt)}
              </p>
            </div>
          </div>

          {/* Round 2 Image Upload */}
          {roundName &&
            (roundName.toLowerCase().includes("round 2") ||
              roundName.toLowerCase().includes("round_2") ||
              roundName.toLowerCase().includes(" 2")) &&
            submission.status === "ACCEPTED" && (
              <div className="staff-card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <IconPhoto className="h-5 w-5 staff-text-secondary" />
                  <h4 className="font-semibold staff-text-primary">
                    Round 2 Image
                  </h4>
                </div>
                <p className="text-sm staff-text-secondary mb-4">
                  Upload the final artwork image for round 2 evaluation.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium staff-text-primary mb-2 block">
                      Select Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setRound2Image(e.target.files?.[0] || null)
                      }
                      className="w-full px-3 py-2 border border-[#e6e2da] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    {round2Image && (
                      <p className="text-xs staff-text-secondary mt-1">
                        Selected: {round2Image.name}
                      </p>
                    )}
                  </div>

                  {/* Image Preview */}
                  {round2Image && previewUrl && (
                    <div className="border border-[#e6e2da] rounded-lg p-4 bg-gray-50">
                      <h5 className="text-sm font-medium staff-text-primary mb-3">
                        Preview
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
                          File size:{" "}
                          {(round2Image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p>Type: {round2Image.type}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleRound2ImageUpload}
                    disabled={
                      !round2Image || uploadRound2ImageMutation.isPending
                    }
                    className="staff-btn-primary disabled:opacity-50 flex items-center gap-2"
                  >
                    <IconUpload className="h-4 w-4" />
                    {uploadRound2ImageMutation.isPending
                      ? "Uploading..."
                      : "Upload Round 2 Image"}
                  </button>
                </div>
              </div>
            )}

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
                  Cancel
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
                  Close
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
                  disabled={acceptMutation.isPending}
                >
                  <IconX className="h-4 w-4 inline mr-2" />
                  Reject
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
              Close
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
