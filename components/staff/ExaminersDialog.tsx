"use client";

import {
  addStaffContestExaminer,
  createStaffSchedule,
  deleteStaffContestExaminer,
  deleteStaffSchedule,
  getAllStaffExaminers,
  getStaffContestExaminers,
  getStaffSchedulesByExaminer,
  updateStaffSchedule,
} from "@/apis/staff";
import { useTranslation } from "@/lib/i18n";
import { formatDate, formatDateForInput } from "@/lib/utils";
import { useLanguageStore } from "@/store/language-store";
import { RoundResponseItem } from "@/types/staff/contest-dto";
import { AvailableExaminerDTO, ExaminerDTO } from "@/types/staff/examiner-dto";
import { ScheduleDTO } from "@/types/staff/schedule-dto";
import {
  IconCalendar,
  IconMail,
  IconPlus,
  IconSearch,
  IconTag,
  IconTrash,
  IconUser,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ExaminersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contestId: number;
  rounds?: RoundResponseItem[];
}

type ExaminerRole = "ROUND_1" | "ROUND_2";

interface ScheduleDraft {
  date: string;
  round2Table: string;
}

export function ExaminersDialog({
  isOpen,
  onClose,
  contestId,
  rounds = [],
}: ExaminersDialogProps) {
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // State for adding new examiner
  const [selectedExaminerId, setSelectedExaminerId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<ExaminerRole>("ROUND_1");
  const [activeRoleTab, setActiveRoleTab] = useState<ExaminerRole>("ROUND_1");
  const [examinerSearch, setExaminerSearch] = useState("");
  const [showExaminerDropdown, setShowExaminerDropdown] = useState(false);

  // State for delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [examinerToDelete, setExaminerToDelete] = useState<ExaminerDTO | null>(
    null,
  );

  // State for schedule management
  const [examinerSchedules, setExaminerSchedules] = useState<
    Record<string, ScheduleDTO[]>
  >({});
  const [scheduleDrafts, setScheduleDrafts] = useState<
    Record<string, ScheduleDraft>
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

  const contestExaminers = useMemo<ExaminerDTO[]>(
    () => examinersData?.data || [],
    [examinersData?.data],
  );

  const availableExaminers = useMemo<AvailableExaminerDTO[]>(
    () => availableExaminersData?.data || [],
    [availableExaminersData?.data],
  );

  const hasRound2 = useMemo(
    () => rounds.some((round) => round.name === "ROUND_2" || round.isRound2),
    [rounds],
  );

  const round2Round = useMemo(
    () => rounds.find((round) => round.name === "ROUND_2" || round.isRound2),
    [rounds],
  );

  const round2Tables = useMemo(() => {
    const tables =
      round2Round?.tables
        ?.map((table) => table.table)
        .filter((table): table is string => Boolean(table)) || [];
    return Array.from(new Set(tables));
  }, [round2Round]);

  // Number of tables in round 2 — used for equal-distribution validation
  const round2TableCount = round2Tables.length;

  const round1Examiners = useMemo(
    () =>
      contestExaminers.filter(
        (examiner: ExaminerDTO) => examiner.role === "ROUND_1",
      ),
    [contestExaminers],
  );

  const round2Examiners = useMemo(
    () =>
      contestExaminers.filter(
        (examiner: ExaminerDTO) => examiner.role === "ROUND_2",
      ),
    [contestExaminers],
  );

  // Helper to get the round2Table from examinerSchedules inline (used before getContestScheduleForExaminer is declared)
  const getExaminerRound2Table = (examiner: ExaminerDTO): string => {
    const schedules = examinerSchedules[examiner.examinerId] || [];
    const embeddedSchedules = (examiner as any).schedules || [];
    const all = [...schedules, ...embeddedSchedules];
    const found = all.find(
      (s) => s.contestId === contestId && s.task === "Chấm Vòng Chung Khảo",
    );
    return found?.round2Table || (examiner as any).round2Table || "";
  };

  // For ROUND_2 tab: examiners with a table assigned come first, unassigned go to bottom
  const sortedRound2Examiners = useMemo(() => {
    return [...round2Examiners].sort((a, b) => {
      const aHasTable = !!getExaminerRound2Table(a);
      const bHasTable = !!getExaminerRound2Table(b);
      if (aHasTable && !bHasTable) return -1;
      if (!aHasTable && bHasTable) return 1;
      return 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round2Examiners, examinerSchedules, contestId]);

  const filteredContestExaminers =
    activeRoleTab === "ROUND_1" ? round1Examiners : sortedRound2Examiners;

  const getExaminerAssignmentKey = (examiner: ExaminerDTO) =>
    `${examiner.examinerId}-${examiner.role}`;

  // Add examiner mutation
  const addExaminerMutation = useMutation({
    mutationFn: (data: { examinerId: string; role: ExaminerRole }) =>
      addStaffContestExaminer(contestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contest-examiners", contestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contest-detail", contestId.toString()],
      });
      setSelectedExaminerId("");
      setSelectedRole(activeRoleTab);
      setExaminerSearch("");
      toast.success("Thêm giám khảo thành công");
    },
    onError: (error) => {
      console.error("Error adding examiner:", error);
      toast.error("Lỗi khi thêm giám khảo");
    },
  });

  // Delete examiner mutation
  const deleteExaminerMutation = useMutation({
    mutationFn: async (data: { examinerId: string; role: ExaminerRole }) => {
      const assignmentTask = getTaskByRole(data.role);
      const currentSchedules = examinerSchedules[data.examinerId] || [];
      const currentAssignmentSchedule = currentSchedules.find(
        (schedule) =>
          schedule.contestId === contestId && schedule.task === assignmentTask,
      );

      if (currentAssignmentSchedule) {
        try {
          await deleteStaffSchedule(currentAssignmentSchedule.scheduleId);
        } catch (error) {
          // Continue removing assignment even if schedule is already missing.
          console.error("Error removing schedule:", error);
        }
      }

      return deleteStaffContestExaminer(contestId, data.examinerId);
    },
    onSuccess: (_, variables) => {
      const assignmentKey = `${variables.examinerId}-${variables.role}`;

      setExaminerSchedules((prev) => {
        const examinerSchedule = prev[variables.examinerId] || [];
        const filteredSchedule = examinerSchedule.filter(
          (schedule) =>
            !(
              schedule.contestId === contestId &&
              schedule.task === getTaskByRole(variables.role)
            ),
        );

        const nextSchedules = { ...prev };
        if (filteredSchedule.length > 0) {
          nextSchedules[variables.examinerId] = filteredSchedule;
        } else {
          delete nextSchedules[variables.examinerId];
        }

        return nextSchedules;
      });

      setScheduleDrafts((prev) => {
        const nextDrafts = { ...prev };
        delete nextDrafts[assignmentKey];
        return nextDrafts;
      });

      setShowScheduleDropdown((prev) => (prev === assignmentKey ? null : prev));

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
      toast.error("Lỗi khi xóa giám khảo");
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedExaminerId("");
      setSelectedRole("ROUND_1");
      setActiveRoleTab("ROUND_1");
      setExaminerSearch("");
      setShowExaminerDropdown(false);
      setShowScheduleDropdown(null);
      setExaminerSchedules({});
      setScheduleDrafts({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (!hasRound2) {
      if (selectedRole === "ROUND_2") {
        setSelectedRole("ROUND_1");
      }
      if (activeRoleTab === "ROUND_2") {
        setActiveRoleTab("ROUND_1");
      }
    }
  }, [hasRound2, selectedRole, activeRoleTab]);

  // Load schedules when examiners are loaded
  useEffect(() => {
    const uniqueExaminerIds: string[] = Array.from(
      new Set(
        contestExaminers.map(
          (examiner: ExaminerDTO) => examiner.examinerId as string,
        ),
      ),
    );
    const uniqueExaminerIdSet = new Set(uniqueExaminerIds);
    const activeAssignmentKeys = new Set(
      contestExaminers.map((examiner) => getExaminerAssignmentKey(examiner)),
    );

    setExaminerSchedules((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([examinerId]) =>
          uniqueExaminerIdSet.has(examinerId),
        ),
      );
      return next as Record<string, ScheduleDTO[]>;
    });

    setScheduleDrafts((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([assignmentKey]) =>
          activeAssignmentKeys.has(assignmentKey),
        ),
      );
      return next as Record<string, ScheduleDraft>;
    });

    setShowScheduleDropdown((prev) =>
      prev && !activeAssignmentKeys.has(prev) ? null : prev,
    );

    uniqueExaminerIds.forEach((examinerId) => {
      loadExaminerSchedules(examinerId);
    });
  }, [contestExaminers]);

  const handleDeleteExaminer = (examiner: ExaminerDTO) => {
    setExaminerToDelete(examiner);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteExaminer = () => {
    if (!examinerToDelete) return;
    deleteExaminerMutation.mutate(
      {
        examinerId: examinerToDelete.examinerId,
        role: examinerToDelete.role,
      },
      {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setExaminerToDelete(null);
        },
      },
    );
  };

  // Schedule management functions
  const getTaskByRole = (role: ExaminerRole) => {
    switch (role) {
      case "ROUND_1":
        return "Chấm Vòng Sơ Khảo";
      case "ROUND_2":
        return "Chấm Vòng Chung Khảo";
      default:
        return "Chấm Bài";
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

  const getContestScheduleForExaminer = (examiner: ExaminerDTO) => {
    const fetchedSchedules = examinerSchedules[examiner.examinerId] || [];
    const embeddedSchedules = (examiner as any).schedules || [];
    
    // Prefer fetchedSchedules as they are reloaded after updates
    const allSchedules = [...fetchedSchedules, ...embeddedSchedules];

    return allSchedules.find(
      (schedule) =>
        schedule.contestId === contestId &&
        schedule.task === getTaskByRole(examiner.role),
    );
  };

  const updateScheduleDraft = (
    examiner: ExaminerDTO,
    field: keyof ScheduleDraft,
    value: string,
  ) => {
    const assignmentKey = getExaminerAssignmentKey(examiner);
    const currentSchedule = getContestScheduleForExaminer(examiner);

    setScheduleDrafts((prev) => {
      const currentDraft = prev[assignmentKey] || {
        date: formatDateForInput(currentSchedule?.date),
        round2Table: currentSchedule?.round2Table || "",
      };

      const updatedDraft = {
        ...currentDraft,
        [field]: value,
      };

      // Auto-fill date if table is selected for ROUND_2
      if (examiner.role === "ROUND_2" && field === "round2Table" && value) {
        const tableInfo = round2Round?.tables?.find((t) => t.table === value);
        if (tableInfo?.startDate) {
          updatedDraft.date = formatDateForInput(tableInfo.startDate);
        }
      }

      return {
        ...prev,
        [assignmentKey]: updatedDraft,
      };
    });
  };

  const handleToggleScheduleDropdown = (examiner: ExaminerDTO) => {
    const assignmentKey = getExaminerAssignmentKey(examiner);

    if (showScheduleDropdown === assignmentKey) {
      setShowScheduleDropdown(null);
      return;
    }

    const currentSchedule = getContestScheduleForExaminer(examiner);

    // For ROUND_2 auto-suggest: pick the table that currently has the fewest assigned examiners
    let suggestedTable = currentSchedule?.round2Table || "";
    if (examiner.role === "ROUND_2" && !suggestedTable) {
      if (round2Tables.length === 1) {
        suggestedTable = round2Tables[0];
      } else if (round2Tables.length > 1) {
        // Count how many examiners are already assigned to each table
        const tableCountMap: Record<string, number> = {};
        round2Tables.forEach((t) => { tableCountMap[t] = 0; });
        round2Examiners.forEach((ex) => {
          const s = getContestScheduleForExaminer(ex);
          const tbl = s?.round2Table || (ex as any).round2Table || "";
          if (tbl && tableCountMap[tbl] !== undefined) {
            tableCountMap[tbl]++;
          }
        });
        // Pick the table with the minimum count
        const minTable = round2Tables.reduce((prev, curr) =>
          tableCountMap[curr] < tableCountMap[prev] ? curr : prev
        );
        suggestedTable = minTable;
      }
    }

    let initialDate = currentSchedule?.date ? formatDateForInput(currentSchedule.date) : "";

    // If we have a table but no date, try to fetch the date from the table info
    if (examiner.role === "ROUND_2" && suggestedTable && !initialDate) {
      const tableInfo = round2Round?.tables?.find((t) => t.table === suggestedTable);
      if (tableInfo?.startDate) {
        initialDate = formatDateForInput(tableInfo.startDate);
      }
    }

    setScheduleDrafts((prev) => ({
      ...prev,
      [assignmentKey]: {
        date: initialDate,
        round2Table: suggestedTable,
      },
    }));
    setShowScheduleDropdown(assignmentKey);
  };

  const handleScheduleDateChange = async (
    examiner: ExaminerDTO,
    newDate: string,
    round2Table?: string,
  ) => {
    try {
      const existingSchedules = examinerSchedules[examiner.examinerId] || [];
      const existingSchedule = existingSchedules.find(
        (s) =>
          s.contestId === contestId && s.task === getTaskByRole(examiner.role),
      );

      if (examiner.role === "ROUND_2" && !round2Table) {
        toast.error("Vui lòng chọn bảng cho vòng chung khảo");
        return false;
      }

      if (examiner.role === "ROUND_1") {
        const round1 = rounds.find((r) => r.name === "ROUND_1" || !r.isRound2);
        if (round1?.submissionDeadline) {
          const deadline = new Date(round1.submissionDeadline);
          const chosenDate = new Date(newDate);

          deadline.setHours(0, 0, 0, 0);
          chosenDate.setHours(0, 0, 0, 0);

          if (chosenDate <= deadline) {
            toast.error(
              `Ngày chấm bài phải sau ngày hạn nộp bài (${formatDate({
                dateString: round1.submissionDeadline,
                language: currentLanguage,
              })})`,
            );
            return false;
          }
        }
      }

      const schedulePayload = {
        contestId,
        examinerId: examiner.examinerId,
        task: getTaskByRole(examiner.role),
        date: newDate,
        status: "ACTIVE",
        ...(examiner.role === "ROUND_2" && round2Table ? { round2Table } : {}),
      };

      if (existingSchedule) {
        // Update existing schedule
        await updateStaffSchedule(existingSchedule.scheduleId, schedulePayload);
      } else {
        // Create new schedule
        await createStaffSchedule(schedulePayload);
      }

      // Reload schedules and invalidate examiners query to get updated totalCount
      await loadExaminerSchedules(examiner.examinerId);
      queryClient.invalidateQueries({ queryKey: ["contest-examiners", contestId] });
      toast.success(t.scheduleUpdateSuccess);
      return true;
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error(t.scheduleUpdateError);
      return false;
    }
  };

  const handleSaveSchedule = async (examiner: ExaminerDTO) => {
    const assignmentKey = getExaminerAssignmentKey(examiner);
    const scheduleDraft = scheduleDrafts[assignmentKey];

    if (!scheduleDraft?.date) {
      toast.error(t.selectDateFromCalendar);
      return;
    }

    const success = await handleScheduleDateChange(
      examiner,
      scheduleDraft.date,
      scheduleDraft.round2Table,
    );

    if (success) {
      setShowScheduleDropdown(null);
    }
  };

  // Compute per-table examiner counts for ROUND_2 and detect imbalance
  const round2TableAssignments = useMemo(() => {
    const countMap: Record<string, number> = {};
    round2Tables.forEach((tbl) => { countMap[tbl] = 0; });
    round2Examiners.forEach((ex) => {
      const tbl = getExaminerRound2Table(ex);
      if (tbl && countMap[tbl] !== undefined) {
        countMap[tbl]++;
      }
    });
    return countMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round2Examiners, examinerSchedules, round2Tables, contestId]);

  const isRound2Imbalanced = useMemo(() => {
    const counts = Object.values(round2TableAssignments);
    if (counts.length === 0) return false;
    // Only flag imbalance if at least one examiner has been assigned a table
    const totalAssigned = counts.reduce((s, c) => s + c, 0);
    if (totalAssigned === 0) return false;
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    return min !== max;
  }, [round2TableAssignments]);

  // Check if total ROUND_2 examiner count is NOT a multiple of the number of tables
  const isRound2CountInvalid = useMemo(() => {
    if (round2TableCount === 0 || round2Examiners.length === 0) return false;
    return round2Examiners.length % round2TableCount !== 0;
  }, [round2Examiners.length, round2TableCount]);

  const isCloseBlocked = isRound2Imbalanced || isRound2CountInvalid;

  const handleClose = () => {
    if (isRound2CountInvalid) {
      const nextMultiple = Math.ceil(round2Examiners.length / round2TableCount) * round2TableCount;
      const needed = nextMultiple - round2Examiners.length;
      toast.error(
        `Số giám khảo vòng chung khảo (${round2Examiners.length}) chưa phải bội số của số bảng (${round2TableCount}). Cần thêm ${needed} giám khảo nữa để đạt ${nextMultiple} người.`,
        { duration: 5000 },
      );
      return;
    }
    if (isRound2Imbalanced) {
      const details = Object.entries(round2TableAssignments)
        .map(([tbl, cnt]) => `${tbl}: ${cnt} giám khảo`)
        .join(" | ");
      toast.error(
        `Các bảng chung khảo chưa được phân bổ đều. Vui lòng điều chỉnh trước khi đóng.\n${details}`,
        { duration: 5000 },
      );
      return;
    }
    onClose();
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
      toast.error(t.selectExaminerAndRole);
      return;
    }

    if (
      contestExaminers.some(
        (examiner) => examiner.examinerId === selectedExaminerId,
      )
    ) {
      toast.error("Giám khảo này đã được thêm vào cuộc thi");
      return;
    }

    if (selectedRole === "ROUND_2" && !hasRound2) {
      toast.error(
        "Vui lòng tạo vòng chung khảo trước khi thêm giám khảo cho vòng này",
      );
      return;
    }

    addExaminerMutation.mutate({
      examinerId: selectedExaminerId,
      role: selectedRole,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="bg-white shadow-xl max-w-5xl w-full mx-4 max-h-[120vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {t.manageExaminers} ({contestExaminers.length})
          </h2>
          <button
            onClick={handleClose}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                {t.addNewExaminer}
              </h3>
              <button
                onClick={handleAddExaminer}
                disabled={addExaminerMutation.isPending || !selectedExaminerId}
                className="px-6 py-2 bg-linear-to-r from-green-500 to-green-600 text-white font-medium hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <IconPlus className="h-5 w-5" />
                {addExaminerMutation.isPending ? t.adding : t.add}
              </button>
            </div>

            <div className="flex gap-4">
              {/* Search and Role Selection - full width */}
              <div className="flex-1 space-y-4">
                {/* Examiner Search and Role in one row */}
                <div className="flex gap-4">
                  {/* Examiner Search */}
                  <div className="flex-1 relative">
                    <label className="staff-type-label text-gray-700 mb-2 block">
                      {t.selectExaminer}
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
                        placeholder={t.searchExaminers}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>

                    {showExaminerDropdown && (
                      <div className="examiner-dropdown absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto max-w-md">
                        {isLoadingAvailableExaminers ? (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            {t.loadingExaminers}
                          </div>
                        ) : availableExaminers.length > 0 ? (
                          availableExaminers
                            .filter(
                              (examiner: AvailableExaminerDTO) =>
                                !contestExaminers.some(
                                  (e: ExaminerDTO) =>
                                    e.examinerId === examiner.examinerId,
                                ),
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
                                  <div className="text-green-600 text-xs">
                                    {examiner.specialization}
                                  </div>
                                )}
                              </button>
                            ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            {t.noExaminersFound}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div className="w-48">
                    <label className="staff-type-label text-gray-700 mb-2 block">
                      {t.role}
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) =>
                        setSelectedRole(e.target.value as ExaminerRole)
                      }
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="ROUND_1">{t.round1}</option>
                      <option value="ROUND_2" disabled={!hasRound2}>
                        {hasRound2
                          ? t.round2
                          : `${t.round2}`}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Examiners */}
          <div>
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {t.currentExaminers} ({filteredContestExaminers.length})
              </h3>

              <div className="inline-flex border border-gray-200 rounded-sm overflow-hidden self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRoleTab("ROUND_1");
                    setSelectedRole("ROUND_1");
                    setShowScheduleDropdown(null);
                  }}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeRoleTab === "ROUND_1"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t.round1} ({round1Examiners.length})
                </button>
                <button
                  type="button"
                  disabled={!hasRound2}
                  onClick={() => {
                    setActiveRoleTab("ROUND_2");
                    setSelectedRole("ROUND_2");
                    setShowScheduleDropdown(null);
                  }}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeRoleTab === "ROUND_2"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } ${!hasRound2 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {t.round2} ({round2Examiners.length})
                </button>
              </div>
            </div>

            {isLoadingContestExaminers ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span className="ml-2 text-gray-600">{t.loadingExaminers}</span>
              </div>
            ) : filteredContestExaminers.length === 0 ? (
              <div className="text-center py-8">
                <IconUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t.noExaminersAssigned}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContestExaminers.map((examiner: ExaminerDTO) => {
                  const assignmentKey = getExaminerAssignmentKey(examiner);
                  const currentSchedule =
                    getContestScheduleForExaminer(examiner);
                  const scheduleDraft = scheduleDrafts[assignmentKey] || {
                    date: formatDateForInput(currentSchedule?.date),
                    round2Table:
                      examiner.role === "ROUND_2"
                        ? currentSchedule?.round2Table ||
                          (round2Tables.length === 1 ? round2Tables[0] : "")
                        : "",
                  };

                  const round =
                    examiner.role === "ROUND_2"
                      ? round2Round
                      : rounds.find((r) => r.name === "ROUND_1" || !r.isRound2);

                  const availableTables =
                    examiner.role === "ROUND_2"
                      ? Array.from(
                          new Set(
                            (round?.tables || [])
                              .map((table) => table.table)
                              .filter((table): table is string =>
                                Boolean(table),
                              ),
                          ),
                        )
                      : [];

                  const selectedTable =
                    examiner.role === "ROUND_2"
                      ? round?.tables?.find(
                          (table) => table.table === scheduleDraft.round2Table,
                        )
                      : undefined;

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  let roundStartDate: Date | null = null;
                  let roundEndDate: Date | null = null;

                  if (examiner.role === "ROUND_2" && selectedTable) {
                    roundStartDate = selectedTable.startDate
                      ? new Date(selectedTable.startDate)
                      : null;
                    roundEndDate = selectedTable.endDate
                      ? new Date(selectedTable.endDate)
                      : null;
                  } else if (examiner.role === "ROUND_1") {
                    // Use submissionDeadline as the starting point for grading if available
                    if (round?.submissionDeadline) {
                      const deadlineDate = new Date(round.submissionDeadline);
                      // Schedule must be AFTER the submission deadline
                      deadlineDate.setDate(deadlineDate.getDate() + 1);
                      roundStartDate = deadlineDate;
                    } else {
                      roundStartDate = round?.startDate
                        ? new Date(round.startDate)
                        : null;
                    }
                    roundEndDate = round?.endDate
                      ? new Date(round.endDate)
                      : null;
                  }

                  if (roundStartDate) roundStartDate.setHours(0, 0, 0, 0);
                  if (roundEndDate) roundEndDate.setHours(23, 59, 59, 999);

                  const minDate =
                    roundStartDate && roundStartDate > today
                      ? roundStartDate
                      : today;
                  const maxDate = roundEndDate;
                  const isRound2WithoutTable =
                    examiner.role === "ROUND_2" && !scheduleDraft.round2Table;
                  const displayedRound2Table =
                    examiner.role === "ROUND_2"
                      ? currentSchedule?.round2Table ||
                        scheduleDraft.round2Table
                      : "";

                  return (
                    <div
                      key={assignmentKey}
                      className="border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-4 items-center">
                        {/* Column 1: Name and Email */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {examiner.examinerName}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                                examiner.role,
                              )}`}
                            >
                              {examiner.role === "ROUND_1"
                                ? `${t.round1}`
                                : `${t.round2}`}
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

                            {(examiner.role === "ROUND_1" || (examiner.role === "ROUND_2" && currentSchedule)) && (
                              <div className="flex items-center gap-2 mt-1.5 text-[var(--staff-primary)] font-medium">
                                <IconCheck className="h-4 w-4" />
                                <span>
                                  Đã chấm: {(examiner as any).evaluatedCount || 0}/{(examiner as any).totalCount || 0} bài
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Column 3: Delete Icon */}
                        <div className="flex justify-end">
                          {((examiner as any).evaluatedCount !== (examiner as any).totalCount || (examiner as any).totalCount === 0) && (
                            <button
                              onClick={() => handleDeleteExaminer(examiner)}
                              disabled={deleteExaminerMutation.isPending}
                              className="p-2 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove examiner"
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        {/* Column 2: Schedule Management */}
                        <div className="flex justify-center">
                          <div className="relative">
                            <div className="flex items-center gap-2">
                              {examiner.role === "ROUND_1" && (
                                <button
                                  onClick={() =>
                                    handleToggleScheduleDropdown(examiner)
                                  }
                                  className="staff-btn-outline !px-4 !py-2 text-sm text-green-700 border-green-300 hover:bg-green-50 flex items-center gap-2 whitespace-nowrap"
                                >
                                  <IconCalendar className="h-4 w-4" />
                                  {currentSchedule
                                    ? `${t.scheduled}: ${formatDate({
                                        dateString: currentSchedule.date,
                                        language: currentLanguage,
                                      })}`
                                    : `+ ${t.schedule}`}
                                </button>
                              )}

                              {examiner.role === "ROUND_2" && (() => {
                                const hasStartedGrading = ((examiner as any).evaluatedCount || 0) > 0;
                                return (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      !hasStartedGrading && handleToggleScheduleDropdown(examiner)
                                    }
                                    disabled={hasStartedGrading}
                                    title={
                                      hasStartedGrading
                                        ? `Không thể đổi bảng — giám khảo đã chấm ${(examiner as any).evaluatedCount}/${(examiner as any).totalCount} bài`
                                        : undefined
                                    }
                                    className={`staff-btn-outline !px-3 !py-2 text-sm flex items-center gap-2 whitespace-nowrap ${
                                      hasStartedGrading
                                        ? "text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                                        : "text-blue-700 border-blue-300 hover:bg-blue-50"
                                    }`}
                                  >
                                    {hasStartedGrading ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    ) : (
                                      <IconTag className="h-4 w-4" />
                                    )}
                                    {displayedRound2Table
                                      ? `${t.table}: ${displayedRound2Table}`
                                      : "Chọn bảng"}
                                  </button>
                                );
                              })()}
                            </div>

                            {showScheduleDropdown === assignmentKey && (
                              <div className="absolute right-0 bottom-full mb-2 z-50 bg-white border border-gray-200 rounded-sm shadow-lg p-3 min-w-[280px]">
                                {examiner.role === "ROUND_2" && (() => {
                                  const hasStartedGrading = ((examiner as any).evaluatedCount || 0) > 0;
                                  return (
                                    <div className="mb-3">
                                      <label className="staff-type-label text-gray-700 mb-2 block">
                                        {t.table}
                                      </label>
                                      <select
                                        value={scheduleDraft.round2Table}
                                        disabled={hasStartedGrading}
                                        onChange={(e) =>
                                          updateScheduleDraft(
                                            examiner,
                                            "round2Table",
                                            e.target.value,
                                          )
                                        }
                                        className={`staff-select w-full border-gray-300 ${
                                          hasStartedGrading ? "opacity-60 cursor-not-allowed bg-gray-50" : ""
                                        }`}
                                      >
                                      <option value="">
                                        {availableTables.length > 0
                                          ? "Select table"
                                          : "No tables available"}
                                      </option>
                                      {availableTables.map((table) => (
                                        <option key={table} value={table}>
                                          {table}
                                        </option>
                                      ))}
                                    </select>
                                    {hasStartedGrading && (
                                      <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        Đã chấm {(examiner as any).evaluatedCount} bài, không thể đổi bảng
                                      </p>
                                    )}
                                  </div>
                                  );
                                })()}

                                {examiner.role === "ROUND_1" ? (
                                  <input
                                    type="date"
                                    value={scheduleDraft.date}
                                    min={formatDateForInput(minDate)}
                                    max={
                                      maxDate
                                        ? formatDateForInput(maxDate)
                                        : undefined
                                    }
                                    onChange={(e) =>
                                      updateScheduleDraft(
                                        examiner,
                                        "date",
                                        e.target.value,
                                      )
                                    }
                                    className="staff-field border-gray-300"
                                  />
                                ) : (
                                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-600 italic">
                                    {scheduleDraft.date ? (
                                      <div className="flex items-center gap-2">
                                        <IconCalendar className="h-4 w-4 text-[var(--staff-primary)]" />
                                        <span>
                                          {t.date}:{" "}
                                          {formatDate({
                                            dateString: scheduleDraft.date,
                                            language: currentLanguage,
                                          })}
                                        </span>
                                      </div>
                                    ) : (
                                      "Chọn bảng để xem ngày thi"
                                    )}
                                  </div>
                                )}

                                {examiner.role === "ROUND_1" &&
                                  (roundStartDate || roundEndDate) && (
                                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-sm text-xs text-blue-700">
                                      <div className="font-medium mb-1">
                                        {t.availableDatesForRound} {t.round1}:
                                      </div>
                                      <div className="text-xs">
                                        {roundStartDate && roundEndDate
                                          ? `${t.fromDate} ${formatDate({
                                              dateString:
                                                roundStartDate.toISOString(),
                                              language: currentLanguage,
                                            })} - ${t.untilDate} ${formatDate({
                                              dateString:
                                                roundEndDate.toISOString(),
                                              language: currentLanguage,
                                            })}`
                                          : roundStartDate
                                            ? `${t.fromDate} ${formatDate({
                                                dateString:
                                                  roundStartDate.toISOString(),
                                                language: currentLanguage,
                                              })}`
                                            : roundEndDate
                                              ? `${t.untilDate} ${formatDate({
                                                  dateString:
                                                    roundEndDate.toISOString(),
                                                  language: currentLanguage,
                                                })}`
                                              : null}
                                      </div>
                                    </div>
                                  )}

                                <div className="mt-3 flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowScheduleDropdown(null)
                                    }
                                    className="staff-btn-secondary !px-3 !py-1.5"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveSchedule(examiner)}
                                    disabled={
                                      !scheduleDraft.date ||
                                      isRound2WithoutTable
                                    }
                                    className="px-3 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {t.schedule}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200">
          {/* Warning banners */}
          <div className="flex flex-col gap-1.5 flex-1 mr-4">
            {isRound2CountInvalid && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span>
                  Số giám khảo chung khảo ({round2Examiners.length}) chưa phải bội số của số bảng ({round2TableCount}).
                  Cần thêm {Math.ceil(round2Examiners.length / round2TableCount) * round2TableCount - round2Examiners.length} giám khảo nữa.
                </span>
              </div>
            )}
            {isRound2Imbalanced && (
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span>
                  Giám khảo chưa được phân bổ đều:{" "}
                  {Object.entries(round2TableAssignments)
                    .map(([tbl, cnt]) => `Bảng ${tbl}: ${cnt} người`)
                    .join(" - ")}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            disabled={isCloseBlocked}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto shrink-0"
          >
            {t.close}
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setExaminerToDelete(null);
        }}
        onConfirm={confirmDeleteExaminer}
        title="Xác nhận xóa giám khảo"
        description={
          <span>
            Bạn có chắc chắn muốn xóa <b>{examinerToDelete?.examinerName}</b>{" "}
            khỏi cuộc thi này?
          </span>
        }
        confirmText="Xóa giám khảo"
        variant="destructive"
        isLoading={deleteExaminerMutation.isPending}
      />
    </div>
  );
}
