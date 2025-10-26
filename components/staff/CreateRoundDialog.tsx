"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStaffRound } from "@/apis/staff";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { IconX, IconPlus } from "@tabler/icons-react";

interface CreateRoundDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contestId: number;
}

export function CreateRoundDialog({
  isOpen,
  onClose,
  contestId,
}: CreateRoundDialogProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    table: "",
    startDate: "",
    endDate: "",
    submissionDeadline: "",
    resultAnnounceDate: "",
    sendOriginalDeadline: "",
    status: "DRAFT",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: {
      name: string;
      table?: string | null;
      startDate: string;
      endDate: string;
      submissionDeadline?: string;
      resultAnnounceDate?: string;
      sendOriginalDeadline?: string;
      status?: string;
    }) => createStaffRound(contestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contest-detail", String(contestId)],
      });
      handleClose();
    },
  });

  const handleClose = () => {
    setFormData({
      name: "",
      table: "",
      startDate: "",
      endDate: "",
      submissionDeadline: "",
      resultAnnounceDate: "",
      sendOriginalDeadline: "",
      status: "DRAFT",
    });
    setErrors({});
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Round name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const submitData: {
      name: string;
      table?: string | null;
      startDate: string;
      endDate: string;
      submissionDeadline?: string;
      resultAnnounceDate?: string;
      sendOriginalDeadline?: string;
      status?: string;
    } = {
      name: formData.name,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      status: formData.status,
    };

    if (formData.table) {
      submitData.table = formData.table;
    }

    if (formData.submissionDeadline) {
      submitData.submissionDeadline = new Date(
        formData.submissionDeadline
      ).toISOString();
    }

    if (formData.resultAnnounceDate) {
      submitData.resultAnnounceDate = new Date(
        formData.resultAnnounceDate
      ).toISOString();
    }

    if (formData.sendOriginalDeadline) {
      submitData.sendOriginalDeadline = new Date(
        formData.sendOriginalDeadline
      ).toISOString();
    }

    createMutation.mutate(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold staff-text-primary">
            Create New Round
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium staff-text-secondary mb-2 block">
                Round Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`staff-input w-full ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="e.g., ROUND1, ROUND2"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
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
                className="staff-input w-full"
                placeholder="e.g., A, B, C, paintings"
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
              className="staff-input w-full"
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
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className={`staff-input w-full ${
                  errors.startDate ? "border-red-500" : ""
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium staff-text-secondary mb-2 block">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className={`staff-input w-full ${
                  errors.endDate ? "border-red-500" : ""
                }`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
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
                className="staff-input w-full"
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
                className="staff-input w-full"
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
                className="staff-input w-full"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 border-2 border-[#e6e2da] staff-text-primary font-semibold hover:bg-[#f7f7f7] transition-colors"
            disabled={createMutation.isPending}
          >
            <IconX className="h-4 w-4 inline mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-[#d9534f] to-[#e67e73] text-white font-semibold shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
            disabled={createMutation.isPending}
          >
            <IconPlus className="h-4 w-4 inline mr-2" />
            {createMutation.isPending ? "Creating..." : "Create Round"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
