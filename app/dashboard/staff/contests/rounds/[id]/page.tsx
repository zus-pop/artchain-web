"use client";

import {
  acceptMultipleSubmissions,
  getStaffRoundById,
  getStaffSubmissions,
  rejectStaffSubmission,
} from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import CustomCheckbox from "@/components/CustomCheckbox";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SubmissionDetailDialog } from "@/components/staff/SubmissionDetailDialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useTranslation } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { useLanguageStore } from "@/store/language-store";
import { Submission } from "@/types/painting";
import { RoundDTO } from "@/types/staff/contest-dto";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCalendar,
  IconCheck,
  IconClock,
  IconEye,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import { Button } from "../../../../../../components/ui/button";

function RoundDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roundId = params.id as string;
  const contestId = searchParams.get("contestId");
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const [selectedStatus, setSelectedStatus] = useState<
    "ALL" | "PENDING" | "ACCEPTED" | "REJECTED"
  >("PENDING");

  const [reviewTab, setReviewTab] = useState<"NORMAL" | "WARNING">("NORMAL");

  const [selectedPaintingId, setSelectedPaintingId] = useState<string | null>(
    null
  );

  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(
    new Set()
  );

  // Dialog states
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [acceptAllDialogOpen, setAcceptAllDialogOpen] = useState(false);
  const [pendingAcceptId, setPendingAcceptId] = useState<string | null>(null);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);
  const [pendingAcceptAllIds, setPendingAcceptAllIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lasso, setLasso] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Fetch round details
  const { data: roundData, isLoading: isLoadingRound } = useQuery({
    queryKey: ["round-detail", contestId, roundId],
    queryFn: () => getStaffRoundById(Number(contestId), roundId),
    enabled: !!contestId && !!roundId,
  });

  const round: RoundDTO = roundData?.data;

  // Set default status based on round name
  useEffect(() => {
    if (round?.name) {
      if (round.name.toUpperCase().includes("ROUND_2")) {
        setSelectedStatus("ALL");
      } else {
        setSelectedStatus("PENDING");
      }
    }
  }, [round?.name]);

  // Fetch submissions
  const { data: submissionsData, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["round-submissions", contestId, roundId, selectedStatus],
    queryFn: () =>
      getStaffSubmissions({
        contestId: Number(contestId),
        roundId: Number(roundId),
        status: selectedStatus === "ALL" ? undefined : selectedStatus,
        page: 1,
        limit: 100,
      }),
    enabled: !!contestId && !!roundId,
  });

  const submissions: Submission[] = submissionsData?.data || [];

  const displaySubmissions = submissions.filter((s) => {
    if (reviewTab === "WARNING") return s.isFlagged;
    return !s.isFlagged;
  });

  // Accept multiple submissions mutation
  const acceptMultipleMutation = useMutation({
    mutationFn: (paintingIds: string[]) =>
      acceptMultipleSubmissions(paintingIds),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["round-submissions", contestId, roundId, selectedStatus],
      });
      setSelectedSubmissions(new Set());

      // Show detailed toast notification
      const { meta, data } = response;

      if (meta.failureCount === 0) {
        // All successful
        toast.success(
          `Successfully accepted ${meta.successCount} submission${
            meta.successCount > 1 ? "s" : ""
          }!`
        );
      } else if (meta.successCount === 0) {
        // All failed
        toast.error(
          `Failed to accept all ${meta.failureCount} submission${
            meta.failureCount > 1 ? "s" : ""
          }`
        );
      } else {
        // Partial success
        toast.warning(
          `Processed ${meta.total} submissions: ${meta.successCount} accepted, ${meta.failureCount} failed`,
          {
            description:
              data.failed.length > 0
                ? `Failed: ${data.failed.map((f) => f.error).join(", ")}`
                : undefined,
            duration: 5000,
          }
        );
      }
    },
    onError: (error) => {
      toast.error("Failed to accept submissions", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });

  // Lasso Selection Logic
  useEffect(() => {
    if (!lasso) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      setLasso((prev) =>
        prev ? { ...prev, currentX, currentY } : null
      );
    };

    const handleMouseUp = () => {
      if (!lasso || !containerRef.current) {
        setLasso(null);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const x1 = Math.min(lasso.startX, lasso.currentX);
      const x2 = Math.max(lasso.startX, lasso.currentX);
      const y1 = Math.min(lasso.startY, lasso.currentY);
      const y2 = Math.max(lasso.startY, lasso.currentY);

      // We only want to select items that are currently visible and relevant to the selected status
      const items = containerRef.current.querySelectorAll("[data-selectable-id]");
      const newSelected = new Set(selectedSubmissions);

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const relativeItemRect = {
          left: itemRect.left - rect.left,
          right: itemRect.right - rect.left,
          top: itemRect.top - rect.top,
          bottom: itemRect.bottom - rect.top,
        };

        // Check for intersection
        if (
          relativeItemRect.left < x2 &&
          relativeItemRect.right > x1 &&
          relativeItemRect.top < y2 &&
          relativeItemRect.bottom > y1
        ) {
          const id = item.getAttribute("data-selectable-id");
          if (id) {
            newSelected.add(id);
          }
        }
      });

      setSelectedSubmissions(newSelected);
      setLasso(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [lasso, selectedSubmissions]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only handle left click on the container background (not on buttons or cards directly if we want)
    // Actually, allowing it anywhere on the container is fine as long as we don't block other clicks
    if (e.button !== 0) return;
    
    // Don't start lasso if clicking on a button or checkbox
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input") || target.closest(".z-10")) {
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setLasso({
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
    });
  };

  // Quick reject mutation
  const rejectMutation = useMutation({
    mutationFn: (paintingId: string) => rejectStaffSubmission(paintingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["round-submissions", contestId, roundId, selectedStatus],
      });
    },
  });

  const handleQuickAccept = (paintingId: string) => {
    setPendingAcceptId(paintingId);
    setAcceptDialogOpen(true);
  };

  const handleQuickReject = (paintingId: string) => {
    setPendingRejectId(paintingId);
    setRejectDialogOpen(true);
  };

  const handleSelectSubmission = (paintingId: string, checked: boolean) => {
    setSelectedSubmissions((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(paintingId);
      } else {
        newSet.delete(paintingId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Only select submissions that are currently visible (filtered by status)
      const visibleSubmissions = submissions.filter((s: Submission) => {
        if (selectedStatus === "ALL") return true;
        return s.status === selectedStatus;
      });
      setSelectedSubmissions(
        new Set(visibleSubmissions.map((s: Submission) => s.paintingId))
      );
    } else {
      setSelectedSubmissions(new Set());
    }
  };

  const handleConfirmAccept = () => {
    if (pendingAcceptId) {
      acceptMultipleMutation.mutate([pendingAcceptId]);
      setAcceptDialogOpen(false);
      setPendingAcceptId(null);
    }
  };

  const handleConfirmReject = () => {
    if (pendingRejectId) {
      rejectMutation.mutate(pendingRejectId);
      setRejectDialogOpen(false);
      setPendingRejectId(null);
    }
  };

  const handleConfirmAcceptAll = () => {
    if (pendingAcceptAllIds.length > 0) {
      acceptMultipleMutation.mutate(pendingAcceptAllIds);
      setAcceptAllDialogOpen(false);
      setPendingAcceptAllIds([]);
    }
  };

  const handleAcceptAllSelected = () => {
    // Only accept submissions that are still PENDING
    const pendingSelected = Array.from(selectedSubmissions).filter(
      (paintingId) => {
        const submission = submissions.find(
          (s: Submission) => s.paintingId === paintingId
        );
        return submission?.status === "PENDING";
      }
    );

    if (pendingSelected.length === 0) {
      alert(t.noPendingSubmissionsSelected);
      return;
    }

    setPendingAcceptAllIds(pendingSelected);
    setAcceptAllDialogOpen(true);
  };

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
      case "PENDING":
        return "staff-badge-pending";
      case "ACCEPTED":
        return "staff-badge-active";
      case "REJECTED":
        return "staff-badge-rejected";
      case "ORIGINAL_SUBMITTED":
        return "staff-badge-active";
      case "NOT_SUBMITTED_ORIGINAL":
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

  const getStatusCounts = () => {
    const tabFiltered = submissions.filter((s) => 
      reviewTab === "WARNING" ? s.isFlagged : !s.isFlagged
    );
    
    const all = tabFiltered.length;
    const pending = tabFiltered.filter(
      (s: Submission) => s.status === "PENDING"
    ).length;
    const accepted = tabFiltered.filter(
      (s: Submission) => s.status === "ACCEPTED"
    ).length;
    const rejected = tabFiltered.filter(
      (s: Submission) => s.status === "REJECTED"
    ).length;
    const flagged = submissions.filter((s: Submission) => s.isFlagged).length;

    return { all, pending, accepted, rejected, flagged };
  };

  const counts = getStatusCounts();

  if (!contestId || !roundId) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <StaffSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title={t.roundDetailTitle} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">{t.contestIdAndRoundIdRequired}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (isLoadingRound) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <StaffSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title={t.roundDetailTitle} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">{t.roundLoadingRoundDetails}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!round) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <StaffSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title={t.roundDetailTitle} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">{t.roundRoundNotFound}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <StaffSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Round Detail" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: t.contestManagementBreadcrumb,
                  href: "/dashboard/staff/contests",
                },
                {
                  label: t.contestDetailBreadcrumb,
                  href: `/dashboard/staff/contests/detail?id=${contestId}`,
                },
                { label: t.roundDetailBreadcrumb },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/staff/contests/detail?id=${contestId}`}
                    className="border-2 border-[#e6e2da] p-2 hover:bg-[#f9f7f4] transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                  </Link>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold staff-text-primary">
                        {round.name === "ROUND_1"
                          ? `${t.rounds} 1`
                          : `${t.rounds} 2`}
                        {round.name === "ROUND_2" && round.table && (
                          <span className="ml-2 text-lg font-normal staff-text-secondary">
                            ({t.table} {round.table})
                          </span>
                        )}
                      </h2>
                      {/* <span className={getStatusColor(round.status)}>
                        {round.status}
                      </span> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Round Information */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {round.startDate && (
                  <div className="staff-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="stat-icon bg-linear-to-br from-blue-500 to-indigo-500">
                        <IconCalendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium staff-text-secondary">
                          {t.roundStartDateLabel}
                        </p>
                        <p className="text-sm font-bold staff-text-primary">
                          {new Date(round.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {round.endDate && (
                  <div className="staff-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="stat-icon bg-linear-to-br from-red-500 to-rose-500">
                        <IconCalendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium staff-text-secondary">
                          {t.roundEndDateLabel}
                        </p>
                        <p className="text-sm font-bold staff-text-primary">
                          {new Date(round.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {round.submissionDeadline && (
                  <div className="staff-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="stat-icon bg-linear-to-br from-orange-500 to-amber-500">
                        <IconClock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium staff-text-secondary">
                          {t.roundSubmissionDeadlineLabel}
                        </p>
                        <p className="text-sm font-bold staff-text-primary">
                          {new Date(
                            round.submissionDeadline
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {round.resultAnnounceDate && (
                  <div className="staff-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="stat-icon bg-linear-to-br from-green-500 to-emerald-500">
                        <IconCalendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium staff-text-secondary">
                          {t.resultAnnounce}
                        </p>
                        <p className="text-sm font-bold staff-text-primary">
                          {new Date(
                            round.resultAnnounceDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submissions Section */}
              <div className="flex border-b border-[#e6e2da] mb-2">
                <button
                  onClick={() => {
                    setReviewTab("NORMAL");
                    // When switching back to Normal, if not ROUND_2, default to PENDING
                    if (!round?.name?.toUpperCase().includes("ROUND_2")) {
                      setSelectedStatus("PENDING");
                    }
                  }}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    reviewTab === "NORMAL"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <IconClock className={`h-4 w-4 ${reviewTab === "NORMAL" ? "text-blue-600" : "text-gray-400"}`} />
                  {t.normalReview}
                </button>
                <button
                  onClick={() => {
                    setReviewTab("WARNING");
                  }}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    reviewTab === "WARNING"
                      ? "border-red-600 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <IconAlertTriangle className={`h-4 w-4 ${reviewTab === "WARNING" ? "text-red-600" : "text-gray-400"}`} />
                  {t.warningPaintings}
                  {counts.flagged > 0 && (
                    <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full border border-red-200">
                      {counts.flagged}
                    </span>
                  )}
                </button>
              </div>

              {round.name.toUpperCase().includes("ROUND_2") ? (
                // ROUND_2 Layout - Show all submissions with status filters
                <div className="staff-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold staff-text-primary">
                      {t.submissions}
                    </h3>

                    {/* Select All Checkbox */}
                    {/* {submissions.length > 0 && (
                      <div className="flex items-center gap-3">
                        {selectedSubmissions.size > 0 && Array.from(selectedSubmissions).some(paintingId => {
                          const submission = submissions.find((s: Submission) => s.paintingId === paintingId);
                          return submission?.status === "PENDING";
                        }) && (
                          <button
                            onClick={handleAcceptAllSelected}
                            disabled={acceptMultipleMutation.isPending}
                            className="px-3 py-1 bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 text-sm font-semibold rounded"
                          >
                            {acceptMultipleMutation.isPending ? 'Accepting...' : 'Accept All'}
                          </button>
                        )}
                          <CustomCheckbox
                            checked={selectedSubmissions.size === submissions.length && submissions.length > 0}
                            onChange={(checked) => handleSelectAll(checked)}
                            label={selectedSubmissions.size > 0 ? `${t.selected} (${selectedSubmissions.size})` : t.selectAll}
                          />
                      </div>
                    )} */}

                    {/* Status Filter Tabs */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedStatus("ALL")}
                        className={`px-4 py-2 font-semibold transition-all ${
                          selectedStatus === "ALL"
                            ? "bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white shadow-md"
                            : "border-2 border-[#e6e2da] staff-text-secondary hover:bg-[#f7f7f7]"
                        }`}
                      >
                        {t.all} ({counts.all})
                      </button>
                      <button
                        onClick={() => setSelectedStatus("PENDING")}
                        className={`px-4 py-2 font-semibold transition-all ${
                          selectedStatus === "PENDING"
                            ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md"
                            : "border-2 border-[#e6e2da] staff-text-secondary hover:bg-[#f7f7f7]"
                        }`}
                      >
                        {t.pendingReview} ({counts.pending})
                      </button>
                      <button
                        onClick={() => setSelectedStatus("ACCEPTED")}
                        className={`px-4 py-2 font-semibold transition-all ${
                          selectedStatus === "ACCEPTED"
                            ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-md"
                            : "border-2 border-[#e6e2da] staff-text-secondary hover:bg-[#f7f7f7]"
                        }`}
                      >
                        {t.approved} ({counts.accepted})
                      </button>
                      <button
                        onClick={() => setSelectedStatus("REJECTED")}
                        className={`px-4 py-2 font-semibold transition-all ${
                          selectedStatus === "REJECTED"
                            ? "bg-linear-to-r from-red-500 to-rose-500 text-white shadow-md"
                            : "border-2 border-[#e6e2da] staff-text-secondary hover:bg-[#f7f7f7]"
                        }`}
                      >
                        {t.rejected} ({counts.rejected})
                      </button>
                    </div>
                  </div>

                  {isLoadingSubmissions ? (
                    <div className="text-center py-8 staff-text-secondary">
                      {t.roundLoadingSubmissions}
                    </div>
                  ) : displaySubmissions.length > 0 ? (
                    <div 
                      ref={containerRef}
                      onMouseDown={handleMouseDown}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative select-none"
                    >
                      {/* Lasso Selection Box */}
                      {lasso && (
                        <div
                          className="absolute border-2 border-orange-500 bg-orange-500/10 z-50 pointer-events-none transition-none"
                          style={{
                            left: Math.min(lasso.startX, lasso.currentX),
                            top: Math.min(lasso.startY, lasso.currentY),
                            width: Math.abs(lasso.currentX - lasso.startX),
                            height: Math.abs(lasso.currentY - lasso.startY),
                          }}
                        />
                      )}
                      {displaySubmissions.map((submission: Submission) => (
                        <div
                          key={submission.paintingId}
                          data-selectable-id={submission.paintingId}
                          className={`border overflow-hidden hover:shadow-lg transition-shadow relative cursor-pointer ${
                            selectedSubmissions.has(submission.paintingId)
                              ? "border-orange-500 -translate-x-1 -translate-y-1 shadow-lg bg-orange-50/30"
                              : "border-[#B8AAAA] hover:border-orange-500/60"
                          }`}
                          onClick={() => 
                            handleSelectSubmission(
                              submission.paintingId, 
                              !selectedSubmissions.has(submission.paintingId)
                            )
                          }
                        >
                          {/* Checkbox */}
                          <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                            <CustomCheckbox
                              checked={selectedSubmissions.has(
                                submission.paintingId
                              )}
                              onChange={(checked) =>
                                handleSelectSubmission(
                                  submission.paintingId,
                                  checked
                                )
                              }
                            />
                          </div>

                          {/* Image */}
                          <div className="relative h-48 bg-gray-100">
                            {submission.imageUrl ? (
                              <Image
                                src={submission.imageUrl}
                                alt={submission.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <div className="text-center">
                                  <IconPhoto className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">{t.roundNoImage}</p>
                                </div>
                              </div>
                            )}
                              <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
                                <span
                                  className={getStatusColor(submission.status)}
                                >
                                  {getStatusText(submission.status)}
                                </span>
                                {submission.isFlagged && (
                                  <div 
                                    className="bg-red-100 p-1.5 rounded-full shadow-sm border border-red-200"
                                    title="AI flagged: This painting might not meet contest requirements"
                                  >
                                    <IconAlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
                                  </div>
                                )}
                              </div>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <h4 className="font-bold staff-text-primary mb-2 line-clamp-1">
                              {submission.title}
                            </h4>
                            <p className="text-sm staff-text-secondary mb-3 line-clamp-2 min-h-10">
                              {submission.description}
                            </p>
                            <p className="text-sm staff-text-secondary mb-3 line-clamp-2">
                              {t.artistLabel} {submission.competitor.fullName}
                            </p>
                            {submission.submissionDate && (
                              <p className="text-xs staff-text-secondary mb-3">
                                {t.roundSubmitted}{" "}
                                {formatDate({
                                  dateString: submission.submissionDate,
                                })}
                              </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() =>
                                  setSelectedPaintingId(submission.paintingId)
                                }
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[#e6e2da] staff-text-primary hover:bg-[#f7f7f4] transition-colors text-sm font-semibold"
                              >
                                <IconEye className="h-4 w-4" />
                                {t.viewBtn}
                              </button>
                              {submission.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleQuickAccept(submission.paintingId)
                                    }
                                    disabled={acceptMultipleMutation.isPending}
                                    className="px-3 py-2 bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                                    title={t.acceptBtn}
                                  >
                                    <IconCheck className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleQuickReject(submission.paintingId)
                                    }
                                    disabled={rejectMutation.isPending}
                                    className="px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                    title={t.rejectBtn}
                                  >
                                    <IconX className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 staff-text-secondary">
                      {t.noSubmissionsFound}
                    </div>
                  )}
                </div>
              ) : (
                // ROUND_1 Layout - Focus on pending submissions only
                <div className="space-y-6">
                  {/* Pending Submissions - Primary Focus */}
                  <div className="staff-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold staff-text-primary flex items-center gap-2">
                          <div className={`w-3 h-3 ${reviewTab === "WARNING" ? "bg-red-500 animate-pulse" : "bg-orange-500"}`}></div>
                          {reviewTab === "WARNING" ? t.warningPaintings : t.pendingReview} ({reviewTab === "WARNING" ? counts.all : counts.pending})
                        </h3>
                        <p className="text-sm staff-text-secondary mt-1">
                          {reviewTab === "WARNING" 
                            ? (t.flaggedSubmissionsDescription || "Review paintings flagged for potential issues") 
                            : t.submissionsAwaitingReview}
                        </p>
                      </div>

                      {/* Selection Header */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleAcceptAllSelected}
                          disabled={selectedSubmissions.size === 0 || acceptMultipleMutation.isPending}
                          className="px-4 py-2 bg-[#10B981] text-white hover:bg-[#059669] transition-all disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] disabled:cursor-not-allowed text-sm font-bold rounded shadow-sm flex items-center gap-2"
                        >
                          <IconCheck className="h-4 w-4" />
                          {acceptMultipleMutation.isPending ? t.accepting : t.acceptAll}
                        </button>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[#F97316] bg-[#FFF7ED] px-4 py-1.5 rounded-full border border-[#FFEDD5] whitespace-nowrap">
                            {t.selected} ({selectedSubmissions.size})
                          </span>
                          
                          <button
                            onClick={() => handleSelectAll(selectedSubmissions.size === 0)}
                            className="text-sm font-semibold text-[#6B7280] hover:text-[#F97316] transition-colors whitespace-nowrap"
                          >
                            {selectedSubmissions.size > 0 ? (t.deselectAll || "Deselect All") : t.selectAll}
                          </button>
                      </div>
                    </div>
                  </div>

                    {isLoadingSubmissions ? (
                      <div className="text-center py-8 staff-text-secondary">
                        {t.roundLoadingSubmissions}
                      </div>
                    ) : displaySubmissions.length > 0 ? (
                      <div 
                        ref={containerRef}
                        onMouseDown={handleMouseDown}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative select-none"
                      >
                        {/* Lasso Selection Box */}
                        {lasso && (
                          <div
                            className="absolute border-2 border-orange-500 bg-orange-500/10 z-50 pointer-events-none transition-none"
                            style={{
                              left: Math.min(lasso.startX, lasso.currentX),
                              top: Math.min(lasso.startY, lasso.currentY),
                              width: Math.abs(lasso.currentX - lasso.startX),
                              height: Math.abs(lasso.currentY - lasso.startY),
                            }}
                          />
                        )}
                        {displaySubmissions.map((submission: Submission) => (
                          <div
                            key={submission.paintingId}
                            data-selectable-id={submission.paintingId}
                            className={`border-2 overflow-hidden hover:shadow-lg transition-all relative cursor-pointer ${
                              selectedSubmissions.has(submission.paintingId)
                                ? "border-orange-500 -translate-x-1 -translate-y-1 shadow-lg bg-orange-50/30"
                                : "border-[#B8AAAA] hover:border-orange-500/60"
                            }`}
                            onClick={() => 
                              handleSelectSubmission(
                                submission.paintingId, 
                                !selectedSubmissions.has(submission.paintingId)
                              )
                            }
                          >
                            {/* Checkbox */}
                            <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                              <CustomCheckbox
                                checked={selectedSubmissions.has(
                                  submission.paintingId
                                )}
                                onChange={(checked) =>
                                  handleSelectSubmission(
                                    submission.paintingId,
                                    checked
                                  )
                                }
                              />
                            </div>

                            {/* Image */}
                            <div className="relative h-48 bg-gray-100">
                              {submission.imageUrl ? (
                                <Image
                                  src={submission.imageUrl}
                                  alt={submission.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                  <div className="text-center">
                                    <IconPhoto className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">{t.roundNoImage}</p>
                                  </div>
                                </div>
                              )}
                              <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
                                {/* <span className="bg-orange-500 text-white px-2 py-1 text-xs font-bold">
                                  {t.pendingReview}
                                </span> */}
                                {submission.isFlagged && (
                                  <div 
                                    className="bg-red-100 p-1.5 rounded-full shadow-sm border border-red-200"
                                    title="AI flagged: This painting might not meet contest requirements"
                                  >
                                    <IconAlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              <h4 className="font-bold staff-text-primary mb-2 line-clamp-1">
                                {submission.title}
                              </h4>
                              <p className="text-sm staff-text-secondary mb-3 line-clamp-2">
                                {submission.description}
                              </p>
                              <p className="text-xs staff-text-secondary mb-3">
                                {t.roundSubmitted}{" "}
                                {formatDate({
                                  dateString: submission.submissionDate,
                                })}
                              </p>

                              {/* Actions */}
                              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() =>
                                    setSelectedPaintingId(submission.paintingId)
                                  }
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[#e6e2da] staff-text-primary hover:bg-[#f7f7f4] transition-colors text-sm font-semibold"
                                >
                                  <IconEye className="h-4 w-4" />
                                  {t.viewBtn}
                                </button>
                                <button
                                  onClick={() =>
                                    handleQuickAccept(submission.paintingId)
                                  }
                                  disabled={acceptMultipleMutation.isPending}
                                  className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 font-semibold"
                                  title={t.acceptBtn}
                                >
                                  <IconCheck className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleQuickReject(submission.paintingId)
                                  }
                                  disabled={rejectMutation.isPending}
                                  className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 font-semibold"
                                  title={t.rejectBtn}
                                >
                                  <IconX className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 staff-text-secondary">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <p className="text-lg font-medium">
                          {t.roundAllCaughtUp}
                        </p>
                        <p>{t.noPendingSubmissions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Submission Detail Dialog */}
      {selectedPaintingId && (
        <SubmissionDetailDialog
          isOpen={!!selectedPaintingId}
          onClose={() => setSelectedPaintingId(null)}
          paintingId={selectedPaintingId}
          roundName={round.name}
        />
      )}

      {/* Accept Submission Dialog */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.confirmAccept || "Confirm Accept"}</DialogTitle>
            <DialogDescription>{t.confirmAcceptSubmission}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAcceptDialogOpen(false)}
            >
              {t.cancel || "Cancel"}
            </Button>
            <Button
              onClick={handleConfirmAccept}
              disabled={acceptMultipleMutation.isPending}
            >
              {acceptMultipleMutation.isPending
                ? t.accepting
                : t.accept || "Accept"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Submission Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.confirmReject || "Confirm Reject"}</DialogTitle>
            <DialogDescription>{t.confirmRejectSubmission}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              {t.cancel || "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? "Rejecting..." : t.reject || "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Accept All Selected Dialog */}
      <Dialog open={acceptAllDialogOpen} onOpenChange={setAcceptAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{"Confirm Accept All"}</DialogTitle>
            <DialogDescription>
              {t.acceptAllSelectedPending.replace(
                "${count}",
                pendingAcceptAllIds.length.toString()
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAcceptAllDialogOpen(false)}
            >
              {t.cancel || "Cancel"}
            </Button>
            <Button
              onClick={handleConfirmAcceptAll}
              disabled={acceptMultipleMutation.isPending}
            >
              {acceptMultipleMutation.isPending ? t.accepting : t.acceptAll}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

export default function RoundDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d9534f]"></div>
        </div>
      }
    >
      <RoundDetailContent />
    </Suspense>
  );
}
