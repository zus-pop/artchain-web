"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStaffSubmissionById,
  acceptStaffSubmission,
  rejectStaffSubmission,
} from "@/apis/staff";
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
} from "@tabler/icons-react";
import Image from "next/image";

interface SubmissionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paintingId: string;
}

export function SubmissionDetailDialog({
  isOpen,
  onClose,
  paintingId,
}: SubmissionDetailDialogProps) {
  const queryClient = useQueryClient();
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Fetch submission details
  const { data: submissionData, isLoading } = useQuery({
    queryKey: ["submission-detail", paintingId],
    queryFn: () => getStaffSubmissionById(paintingId),
    enabled: isOpen && !!paintingId,
  });

  const submission = submissionData?.data;

  // Accept mutation
  const acceptMutation = useMutation({
    mutationFn: () => acceptStaffSubmission(paintingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission-detail", paintingId] });
      queryClient.invalidateQueries({ queryKey: ["round-submissions"] });
      onClose();
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (reason?: string) =>
      rejectStaffSubmission(paintingId, reason ? { reason } : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission-detail", paintingId] });
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
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold staff-text-primary">
              Submission Details
            </DialogTitle>
            <span className={getStatusColor(submission.status)}>
              {submission.status}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative w-full h-96 bg-gray-100">
            <Image
              src={submission.imageUrl}
              alt={submission.title}
              fill
              className="object-contain"
            />
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
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
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
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
                  disabled={acceptMutation.isPending}
                >
                  <IconX className="h-4 w-4 inline mr-2" />
                  Reject
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
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
