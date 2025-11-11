"use client";

import { getStaffContestById, updateStaffContest } from "@/apis/staff";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { ContestStatus } from "@/types/contest";
import { IconCalendar, IconEdit, IconTrophy } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { Contest } from "../../types";

interface ContestDetailDialogProps {
  contestId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContestDetailDialog({
  contestId,
  open,
  onOpenChange,
}: ContestDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch contest details
  const { data: contestData, isLoading } = useQuery({
    queryKey: ["contest-detail", contestId],
    queryFn: () => getStaffContestById(Number(contestId)),
    enabled: !!contestId && open,
    staleTime: 1 * 60 * 1000,
  });

  const contest: Contest = contestData?.data;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bannerUrl: "",
    numOfAward: 0,
    startDate: "",
    endDate: "",
    status: "DRAFT" as ContestStatus,
  });

  // Update form data when contest data is loaded
  useState(() => {
    if (contest) {
      setFormData({
        title: contest.title,
        description: contest.description,
        bannerUrl: contest.bannerUrl || "",
        numOfAward: contest.numOfAward ?? 0,
        startDate: contest.startDate,
        endDate: contest.endDate,
        status: contest.status,
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      updateStaffContest({
        contestId: contestId!,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-contests"] });
      queryClient.invalidateQueries({
        queryKey: ["contest-detail", contestId],
      });
      setIsEditing(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      DRAFT: "bg-gray-100 text-gray-800 border-gray-300",
      ACTIVE: "bg-green-100 text-green-800 border-green-300",
      COMPLETED: "bg-blue-100 text-blue-800 border-blue-300",
      CANCELLED: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  const getRoundStatusBadge = (status: string) => {
    const colors = {
      DRAFT: "bg-gray-100 text-gray-700",
      ACTIVE: "bg-green-100 text-green-700",
      COMPLETED: "bg-blue-100 text-blue-700",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>Contest Details</span>
            {!isEditing && contest && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setFormData({
                    title: contest.title,
                    description: contest.description,
                    bannerUrl: contest.bannerUrl || "",
                    numOfAward: contest.numOfAward ?? 0,
                    startDate: contest.startDate,
                    endDate: contest.endDate,
                    status: contest.status,
                  });
                }}
                className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50"
              >
                <IconEdit className="h-5 w-5" />
              </button>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit contest information"
              : "View contest information and rounds"}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading contest details...
          </div>
        ) : !contest ? (
          <div className="py-8 text-center text-red-500">
            Failed to load contest details
          </div>
        ) : (
          <div className="space-y-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Banner URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Banner URL
                  </label>
                  <input
                    type="text"
                    value={formData.bannerUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, bannerUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.bannerUrl && (
                    <div className="mt-2">
                      <Image
                        src={formData.bannerUrl}
                        alt="Banner preview"
                        width={400}
                        height={200}
                        className="rounded object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Number of Awards */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Awards *
                  </label>
                  <input
                    type="number"
                    value={formData.numOfAward}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numOfAward: Number(e.target.value),
                      })
                    }
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate.slice(0, 16)}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate.slice(0, 16)}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as ContestStatus,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {updateMutation.isError && (
                  <div className="text-red-600 text-sm">
                    Failed to update contest. Please try again.
                  </div>
                )}
              </form>
            ) : (
              <>
                {/* Banner */}
                {contest.bannerUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={contest.bannerUrl}
                      alt={contest.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Contest Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {contest.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{contest.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <IconTrophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm text-gray-600">
                        <strong>{contest.numOfAward}</strong> Awards
                      </span>
                    </div>
                    <div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(
                          contest.status
                        )}`}
                      >
                        {contest.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                    <div>
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <IconCalendar className="h-4 w-4" />
                        Start Date
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate({ dateString: contest.startDate })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <IconCalendar className="h-4 w-4" />
                        End Date
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate({ dateString: contest.endDate })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rounds Section */}
                {contest.rounds && contest.rounds.length > 0 && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-bold mb-4">
                      Rounds ({contest.rounds.length})
                    </h4>
                    <div className="space-y-3">
                      {contest.rounds.map(
                        (round: {
                          roundId: number;
                          contestId: number;
                          table: string | null;
                          name: string;
                          startDate: string | null;
                          endDate: string | null;
                          submissionDeadline: string | null;
                          resultAnnounceDate: string | null;
                          sendOriginalDeadline: string | null;
                          status: string;
                          createdAt: string;
                          updatedAt: string;
                        }) => (
                          <div
                            key={round.roundId}
                            className="border rounded-lg p-4 hover:bg-gray-50"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h5 className="font-semibold text-gray-900">
                                    {round.name}
                                    {round.table && (
                                      <span className="ml-2 text-sm text-gray-500">
                                        (Table {round.table})
                                      </span>
                                    )}
                                  </h5>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${getRoundStatusBadge(
                                      round.status
                                    )}`}
                                  >
                                    {round.status}
                                  </span>
                                </div>

                                {round.startDate && round.endDate && (
                                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mt-2">
                                    <div>
                                      <span className="font-medium">
                                        Start:
                                      </span>{" "}
                                      {formatDate({
                                        dateString: round.startDate,
                                      })}
                                    </div>
                                    <div>
                                      <span className="font-medium">End:</span>{" "}
                                      {formatDate({
                                        dateString: round.endDate,
                                      })}
                                    </div>
                                  </div>
                                )}

                                {round.submissionDeadline && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    <span className="font-medium">
                                      Submission Deadline:
                                    </span>{" "}
                                    {formatDate({
                                      dateString: round.submissionDeadline,
                                    })}
                                  </div>
                                )}

                                {round.resultAnnounceDate && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    <span className="font-medium">
                                      Result Announce:
                                    </span>{" "}
                                    {formatDate({
                                      dateString: round.resultAnnounceDate,
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
