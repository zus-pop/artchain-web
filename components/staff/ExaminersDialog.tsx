"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IconX,
  IconUser,
  IconMail,
  IconCalendar,
  IconTag,
  IconSearch,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { ExaminerDTO, AvailableExaminerDTO } from "@/types/staff/examiner-dto";
import { ScheduleDTO } from "@/types/staff/schedule-dto";
import {
  getStaffContestExaminers,
  getAllStaffExaminers,
  addStaffContestExaminer,
  deleteStaffContestExaminer,
  getStaffSchedulesByExaminer,
  createStaffSchedule,
  updateStaffSchedule,
} from "@/apis/staff";

interface ExaminersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contestId: number;
}

export function ExaminersDialog({
  isOpen,
  onClose,
  contestId,
}: ExaminersDialogProps) {
  const queryClient = useQueryClient();

  // State for adding new examiner
  const [selectedExaminerId, setSelectedExaminerId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("ROUND_1");
  const [examinerSearch, setExaminerSearch] = useState("");
  const [showExaminerDropdown, setShowExaminerDropdown] = useState(false);

  // State for schedule management
  const [examinerSchedules, setExaminerSchedules] = useState<
    Record<string, ScheduleDTO[]>
  >({});
  const [showScheduleDropdown, setShowScheduleDropdown] = useState<
    string | null
  >(null);

  // Fetch examiners for this contest
  const { data: examinersData, isLoading: isLoadingContestExaminers } =
    useQuery({
      queryKey: ["contest-examiners", contestId],
      queryFn: () => getStaffContestExaminers(contestId),
      enabled: isOpen && !!contestId,
    });

  // Fetch all available examiners for name mapping and search
  const {
    data: availableExaminersData,
    isLoading: isLoadingAvailableExaminers,
  } = useQuery({
    queryKey: ["available-examiners", examinerSearch],
    queryFn: () => getAllStaffExaminers({ search: examinerSearch, limit: 20 }),
    enabled: isOpen,
  });

  const contestExaminers = useMemo(
    () => examinersData?.data || [],
    [examinersData?.data]
  );
  const availableExaminers = availableExaminersData?.data || [];

  // Add examiner mutation
  const addExaminerMutation = useMutation({
    mutationFn: (data: { examinerId: string; role: string }) =>
      addStaffContestExaminer(contestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contest-examiners", contestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contest-detail", contestId.toString()],
      });
      setSelectedExaminerId("");
      setSelectedRole("ROUND_1");
      setExaminerSearch("");
      toast.success("Thêm giám khảo thành công");
    },
    onError: (error) => {
      console.error("Error adding examiner:", error);
      toast.error("Xảy ra lỗi khi thêm giám khảo.");
    },
  });

  // Delete examiner mutation
  const deleteExaminerMutation = useMutation({
    mutationFn: (examinerId: string) =>
      deleteStaffContestExaminer(contestId, examinerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contest-examiners", contestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contest-detail", contestId.toString()],
      });
      toast.success("Gỡ giám khảo thành công");
    },
    onError: (error) => {
      console.error("Error removing examiner:", error);
      toast.error("Có lỗi khi gỡ giám khảo");
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedExaminerId("");
      setSelectedRole("ROUND_1");
      setExaminerSearch("");
      setShowExaminerDropdown(false);
      setShowScheduleDropdown(null);
    }
  }, [isOpen]);

  // Load schedules when examiners are loaded
  useEffect(() => {
    if (contestExaminers.length > 0) {
      contestExaminers.forEach((examiner: ExaminerDTO) => {
        loadExaminerSchedules(examiner.examinerId);
      });
    }
  }, [contestExaminers]);

  const handleDeleteExaminer = (examinerId: string, examinerName: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${examinerName} from this contest?`
      )
    ) {
      deleteExaminerMutation.mutate(examinerId);
    }
  };

  // Schedule management functions
  const getTaskByRole = (role: string) => {
    switch (role) {
      case "ROUND_1":
        return "Chấm bài vòng sơ khảo";
      case "ROUND_2":
        return "Chấm bài vòng chung kết";
      default:
        return "Chấm bài";
    }
  };

  const loadExaminerSchedules = async (examinerId: string) => {
    try {
      const response = await getStaffSchedulesByExaminer(examinerId);
      setExaminerSchedules((prev) => ({
        ...prev,
        [examinerId]: response.data || [],
      }));
    } catch (error) {
      console.error("Error loading schedules:", error);
    }
  };

  const handleScheduleDateChange = async (
    examiner: ExaminerDTO,
    newDate: string
  ) => {
    try {
      const existingSchedules = examinerSchedules[examiner.examinerId] || [];
      const existingSchedule = existingSchedules.find(
        (s) => s.contestId === contestId
      );

      if (existingSchedule) {
        // Update existing schedule
        await updateStaffSchedule(existingSchedule.scheduleId, {
          contestId,
          examinerId: examiner.examinerId,
          task: getTaskByRole(examiner.role),
          date: newDate,
          status: "ACTIVE",
        });
      } else {
        // Create new schedule
        await createStaffSchedule({
          contestId,
          examinerId: examiner.examinerId,
          task: getTaskByRole(examiner.role),
          date: newDate,
          status: "ACTIVE",
        });
      }

      // Reload schedules
      await loadExaminerSchedules(examiner.examinerId);
      toast.success("Cập nhật lịch chấm thành công!");
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Có lỗi khi cập nhật lịch chấm");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ROUND_1":
        return "bg-blue-100 text-blue-800";
      case "ROUND_2":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectExaminer = (examiner: AvailableExaminerDTO) => {
    setSelectedExaminerId(examiner.examinerId);
    setExaminerSearch(examiner.fullName);
    setShowExaminerDropdown(false);
  };

  const handleAddExaminer = () => {
    if (!selectedExaminerId || !selectedRole) {
      toast.error("Please select an examiner and role");
      return;
    }
    addExaminerMutation.mutate({
      examinerId: selectedExaminerId,
      role: selectedRole,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
      <div className="bg-white shadow-xl max-w-4xl w-full mx-4 max-h-[120vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Manage Examiners ({contestExaminers.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IconX className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Add Examiner Section */}
          <div className="mb-6 p-4 border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Examiner
              </h3>
              <button
                onClick={handleAddExaminer}
                disabled={addExaminerMutation.isPending || !selectedExaminerId}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <IconPlus className="h-5 w-5" />
                {addExaminerMutation.isPending ? "Adding..." : "Add"}
              </button>
            </div>

            <div className="flex gap-4">
              {/* Search and Role Selection - full width */}
              <div className="flex-1 space-y-4">
                {/* Examiner Search and Role in one row */}
                <div className="flex gap-4">
                  {/* Examiner Search */}
                  <div className="flex-1 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Examiner
                    </label>
                    <div className="relative">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={examinerSearch}
                        onChange={(e) => {
                          setExaminerSearch(e.target.value);
                          setShowExaminerDropdown(true);
                        }}
                        onFocus={() => setShowExaminerDropdown(true)}
                        placeholder="Search examiners..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    {showExaminerDropdown && (
                      <div className="examiner-dropdown absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto max-w-md">
                        {isLoadingAvailableExaminers ? (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            Loading examiners...
                          </div>
                        ) : availableExaminers.length > 0 ? (
                          availableExaminers
                            .filter(
                              (examiner: AvailableExaminerDTO) =>
                                !contestExaminers.some(
                                  (e: ExaminerDTO) =>
                                    e.examinerId === examiner.examinerId
                                )
                            )
                            .map((examiner: AvailableExaminerDTO) => (
                              <button
                                key={examiner.examinerId}
                                type="button"
                                onClick={() => handleSelectExaminer(examiner)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                              >
                                <div className="font-medium">
                                  {examiner.fullName}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {examiner.email}
                                </div>
                                {examiner.specialization && (
                                  <div className="text-blue-600 text-xs">
                                    {examiner.specialization}
                                  </div>
                                )}
                              </button>
                            ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No examiners found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div className="w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="ROUND_1">Round 1</option>
                      <option value="ROUND_2">Round 2</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Examiners */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Current Examiners ({contestExaminers.length})
            </h3>

            {isLoadingContestExaminers ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d9534f]"></div>
                <span className="ml-2 text-gray-600">Loading examiners...</span>
              </div>
            ) : contestExaminers.length === 0 ? (
              <div className="text-center py-8">
                <IconUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No examiners assigned to this contest yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {contestExaminers.map((examiner: ExaminerDTO) => (
                  <div
                    key={examiner.examinerId}
                    className="border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-3 gap-4 items-center">
                      {/* Column 1: Name and Email */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {examiner.examinerName}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                              examiner.role
                            )}`}
                          >
                            {examiner.role}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-2 mb-1">
                            <IconMail className="h-4 w-4" />
                            <span>{examiner.examinerEmail}</span>
                          </div>

                          {examiner.examiner.specialization && (
                            <div className="flex items-center gap-2">
                              <IconTag className="h-4 w-4" />
                              <span>
                                Specialization:{" "}
                                {examiner.examiner.specialization}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Column 2: Schedule Management */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowScheduleDropdown(
                                showScheduleDropdown === examiner.examinerId
                                  ? null
                                  : examiner.examinerId
                              )
                            }
                            className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <IconCalendar className="h-4 w-4" />
                            {examinerSchedules[examiner.examinerId]?.find(
                              (s) => s.contestId === contestId
                            )
                              ? `Scheduled: ${new Date(
                                  examinerSchedules[examiner.examinerId]?.find(
                                    (s) => s.contestId === contestId
                                  )?.date || ""
                                ).toLocaleDateString()}`
                              : "+ Schedule"}
                          </button>

                          {showScheduleDropdown === examiner.examinerId && (
                            <div className="absolute bottom-full mb-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
                              <div className="p-2">
                                <button
                                  onClick={() => {
                                    // Toggle calendar visibility
                                    setShowScheduleDropdown(
                                      examiner.examinerId + "_calendar"
                                    );
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors rounded flex items-center gap-2"
                                >
                                  <IconCalendar className="h-4 w-4" />
                                  Chọn ngày từ lịch
                                </button>
                              </div>
                            </div>
                          )}

                          {showScheduleDropdown ===
                            examiner.examinerId + "_calendar" && (
                            <div className="absolute bottom-full mb-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                              <Calendar
                                mode="single"
                                captionLayout="dropdown"
                                selected={(() => {
                                  const schedule = examinerSchedules[
                                    examiner.examinerId
                                  ]?.find((s) => s.contestId === contestId);
                                  return schedule?.date
                                    ? new Date(schedule.date)
                                    : undefined;
                                })()}
                                onSelect={(date) => {
                                  if (date) {
                                    const dateString = date
                                      .toISOString()
                                      .split("T")[0]; // YYYY-MM-DD format
                                    handleScheduleDateChange(
                                      examiner,
                                      dateString
                                    );
                                    setShowScheduleDropdown(null); // Close dropdown after selection
                                  }
                                }}
                                disabled={(date) => date < new Date()}
                                className="rounded-md border-0 shadow-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Column 3: Delete Icon */}
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            handleDeleteExaminer(
                              examiner.examinerId,
                              examiner.examinerName
                            )
                          }
                          disabled={deleteExaminerMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove examiner"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
