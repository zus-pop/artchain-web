"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStaffRoundById, updateStaffRound } from "@/apis/staff";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
// Bỏ IconX khỏi imports
import { IconCalendar, IconClock, IconEdit } from "@tabler/icons-react";

interface RoundDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contestId: number;
  roundId: number;
}

export function RoundDetailDialog({
  isOpen,
  onClose,
  contestId,
  roundId,
}: RoundDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch round details
  const { data: roundData, isLoading } = useQuery({
    queryKey: ["round-detail", contestId, roundId],
    queryFn: () => getStaffRoundById(contestId, String(roundId)),
    enabled: isOpen && !!contestId && !!roundId,
  });

  const round = roundData?.data;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    table: "",
    startDate: "",
    endDate: "",
    submissionDeadline: "",
    resultAnnounceDate: "",
    sendOriginalDeadline: "",
    status: "",
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: {
      name?: string;
      table?: string | null;
      startDate?: string;
      endDate?: string;
      submissionDeadline?: string;
      resultAnnounceDate?: string;
      sendOriginalDeadline?: string;
      status?: string;
    }) => updateStaffRound(contestId, String(roundId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["round-detail", contestId, roundId] });
      queryClient.invalidateQueries({ queryKey: ["contest-detail", String(contestId)] });
      setIsEditing(false);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "staff-badge-active";
      case "COMPLETED":
        return "staff-badge-neutral";
      case "DRAFT":
        return "staff-badge-pending";
      case "CANCELLED":
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

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleEdit = () => {
    if (round) {
      setFormData({
        name: round.name || "",
        table: round.table || "",
        startDate: round.startDate ? formatDateForInput(round.startDate) : "",
        endDate: round.endDate ? formatDateForInput(round.endDate) : "",
        submissionDeadline: round.submissionDeadline
          ? formatDateForInput(round.submissionDeadline)
          : "",
        resultAnnounceDate: round.resultAnnounceDate
          ? formatDateForInput(round.resultAnnounceDate)
          : "",
        sendOriginalDeadline: round.sendOriginalDeadline
          ? formatDateForInput(round.sendOriginalDeadline)
          : "",
        status: round.status || "",
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const updateData: {
      name?: string;
      table?: string | null;
      startDate?: string;
      endDate?: string;
      submissionDeadline?: string;
      resultAnnounceDate?: string;
      sendOriginalDeadline?: string;
      status?: string;
    } = {};
    
    // So sánh và chỉ gửi những trường thay đổi
    if (formData.name && formData.name !== round?.name) {
      updateData.name = formData.name;
    }
    if (formData.table !== round?.table) {
      updateData.table = formData.table || null;
    }
    // Chuyển đổi datetime-local string sang ISO string cho backend (chỉ khi giá trị thay đổi)
    if (formData.startDate && formatDateForInput(round?.startDate || "") !== formData.startDate) {
      updateData.startDate = new Date(formData.startDate).toISOString();
    }
    if (formData.endDate && formatDateForInput(round?.endDate || "") !== formData.endDate) {
      updateData.endDate = new Date(formData.endDate).toISOString();
    }
    if (formData.submissionDeadline && formatDateForInput(round?.submissionDeadline || "") !== formData.submissionDeadline) {
      updateData.submissionDeadline = new Date(formData.submissionDeadline).toISOString();
    }
    if (formData.resultAnnounceDate && formatDateForInput(round?.resultAnnounceDate || "") !== formData.resultAnnounceDate) {
      updateData.resultAnnounceDate = new Date(formData.resultAnnounceDate).toISOString();
    }
    if (formData.sendOriginalDeadline && formatDateForInput(round?.sendOriginalDeadline || "") !== formData.sendOriginalDeadline) {
      updateData.sendOriginalDeadline = new Date(formData.sendOriginalDeadline).toISOString();
    }
    if (formData.status && formData.status !== round?.status) {
      updateData.status = formData.status;
    }

    updateMutation.mutate(updateData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d9534f]"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!round) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="text-center py-8 staff-text-secondary">
            Round not found
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto [&>[data-radix-dialog-close]]:hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold staff-text-primary">
            Round Details
          </DialogTitle>
        </DialogHeader>

        {!isEditing ? (
          <div className="space-y-4">
            
            <div className="flex items-start justify-between pb-4 border-b border-[#e6e2da]">
              
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold staff-text-primary">
                  {round.name}
                  {round.table && (
                    <span className="ml-2 text-base font-normal staff-text-secondary">
                      (Table {round.table})
                    </span>
                  )}
                </h3>
                <span className={getStatusColor(round.status)}>{round.status}</span>
              </div>
              
              {/* Cột 2: Nút Edit (Icon) */}
              <button
                onClick={handleEdit}
                className="p-2 border border-[#e6e2da] text-gray-600 rounded-md hover:bg-[#f9f7f4] transition-colors flex-shrink-0"
                aria-label="Edit Round"
              >
                <IconEdit className="h-5 w-5" />
              </button>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {round.startDate && (
                <div className="border border-[#e6e2da] p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <IconCalendar className="h-4 w-4 staff-text-secondary" />
                    <p className="text-sm font-medium staff-text-secondary">
                      Start Date
                    </p>
                  </div>
                  <p className="text-sm staff-text-primary font-semibold">
                    {formatDate(round.startDate)}
                  </p>
                </div>
              )}

              {round.endDate && (
                <div className="border border-[#e6e2da] p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <IconCalendar className="h-4 w-4 staff-text-secondary" />
                    <p className="text-sm font-medium staff-text-secondary">
                      End Date
                    </p>
                  </div>
                  <p className="text-sm staff-text-primary font-semibold">
                    {formatDate(round.endDate)}
                  </p>
                </div>
              )}

              {round.submissionDeadline && (
                <div className="border border-[#e6e2da] p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <IconClock className="h-4 w-4 staff-text-secondary" />
                    <p className="text-sm font-medium staff-text-secondary">
                      Submission Deadline
                    </p>
                  </div>
                  <p className="text-sm staff-text-primary font-semibold">
                    {formatDate(round.submissionDeadline)}
                  </p>
                </div>
              )}

              {round.resultAnnounceDate && (
                <div className="border border-[#e6e2da] p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <IconCalendar className="h-4 w-4 staff-text-secondary" />
                    <p className="text-sm font-medium staff-text-secondary">
                      Result Announce Date
                    </p>
                  </div>
                  <p className="text-sm staff-text-primary font-semibold">
                    {formatDate(round.resultAnnounceDate)}
                  </p>
                </div>
              )}

              {round.sendOriginalDeadline && (
                <div className="border border-[#e6e2da] p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <IconClock className="h-4 w-4 staff-text-secondary" />
                    <p className="text-sm font-medium staff-text-secondary">
                      Original Deadline
                    </p>
                  </div>
                  <p className="text-sm staff-text-primary font-semibold">
                    {formatDate(round.sendOriginalDeadline)}
                  </p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e6e2da]">
              <div>
                <p className="text-xs staff-text-secondary mb-1">Created At</p>
                <p className="text-sm staff-text-primary">
                  {formatDate(round.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs staff-text-secondary mb-1">Updated At</p>
                <p className="text-sm staff-text-primary">
                  {formatDate(round.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium staff-text-secondary mb-2 block">
                  Round Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="staff-input w-full rounded-md"
                  placeholder="e.g., ROUND1"
                />
              </div>

              <div>
                <label className="text-sm font-medium staff-text-secondary mb-2 block">
                  Table
                </label>
                <input
                  type="text"
                  value={formData.table}
                  onChange={(e) =>
                    setFormData({ ...formData, table: e.target.value })
                  }
                  className="staff-input w-full rounded-md"
                  placeholder="e.g., A, B, C"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium staff-text-secondary mb-2 block">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="staff-input w-full rounded-md"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium staff-text-secondary mb-2 block">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="staff-input w-full rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium staff-text-secondary mb-2 block">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="staff-input w-full rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium staff-text-secondary mb-2 block">
                  Submission Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.submissionDeadline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      submissionDeadline: e.target.value,
                    })
                  }
                  className="staff-input w-full rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium staff-text-secondary mb-2 block">
                  Result Announce Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.resultAnnounceDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resultAnnounceDate: e.target.value,
                    })
                  }
                  className="staff-input w-full rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium staff-text-secondary mb-2 block">
                  Original Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.sendOriginalDeadline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sendOriginalDeadline: e.target.value,
                    })
                  }
                  className="staff-input w-full rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <DialogFooter className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border-2 border-[#e6e2da] staff-text-primary font-semibold rounded-md hover:bg-[#f7f7f7] transition-colors"
              disabled={updateMutation.isPending}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-[#d9534f] to-[#e67e73] text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}