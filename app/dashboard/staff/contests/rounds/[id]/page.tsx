"use client";

import {
  acceptStaffSubmission,
  getStaffRoundById,
  getStaffSubmissions,
  rejectStaffSubmission,
} from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SubmissionDetailDialog } from "@/components/staff/SubmissionDetailDialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
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
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface Submission {
  paintingId: string;
  roundId: string;
  awardId: string | null;
  contestId: number;
  competitorId: string;
  description: string;
  title: string;
  imageUrl: string;
  submissionDate: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

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

  const [selectedPaintingId, setSelectedPaintingId] = useState<string | null>(
    null
  );

  // Fetch round details
  const { data: roundData, isLoading: isLoadingRound } = useQuery({
    queryKey: ["round-detail", contestId, roundId],
    queryFn: () => getStaffRoundById(Number(contestId), roundId),
    enabled: !!contestId && !!roundId,
  });

  const round = roundData?.data;

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

  const submissions = submissionsData?.data || [];

  // Quick accept mutation
  const acceptMutation = useMutation({
    mutationFn: (paintingId: string) => acceptStaffSubmission(paintingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["round-submissions", contestId, roundId, selectedStatus],
      });
    },
  });

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
    if (confirm(t.confirmAcceptSubmission)) {
      acceptMutation.mutate(paintingId);
    }
  };

  const handleQuickReject = (paintingId: string) => {
    if (confirm(t.confirmRejectSubmission)) {
      rejectMutation.mutate(paintingId);
    }
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

  const getStatusCounts = () => {
    const all = submissions.length;
    const pending = submissions.filter(
      (s: Submission) => s.status === "PENDING"
    ).length;
    const accepted = submissions.filter(
      (s: Submission) => s.status === "ACCEPTED"
    ).length;
    const rejected = submissions.filter(
      (s: Submission) => s.status === "REJECTED"
    ).length;

    return { all, pending, accepted, rejected };
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
                        {round.name}
                        {round.table && (
                          <span className="ml-2 text-lg font-normal staff-text-secondary">
                            (Table {round.table})
                          </span>
                        )}
                      </h2>
                      {/* <span className={getStatusColor(round.status)}>
                        {round.status}
                      </span> */}
                    </div>
                    <p className="text-sm staff-text-secondary mt-1">
                      {t.roundIdLabel} {round.roundId}
                    </p>
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
              {round.name.toUpperCase().includes("ROUND_2") ? (
                // ROUND_2 Layout - Show all submissions with status filters
                <div className="staff-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold staff-text-primary">
                      {t.submissions}
                    </h3>

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
                  ) : submissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {submissions.map((submission: Submission) => (
                        <div
                          key={submission.paintingId}
                          className="border border-[#e6e2da] overflow-hidden hover:shadow-lg transition-shadow"
                        >
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
                            <div className="absolute top-2 right-2">
                              <span
                                className={getStatusColor(submission.status)}
                              >
                                {submission.status}
                              </span>
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
                              {formatDate(submission.submissionDate)}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2">
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
                                    disabled={acceptMutation.isPending}
                                    className="px-3 py-2 bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                                    title="Accept"
                                  >
                                    <IconCheck className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleQuickReject(submission.paintingId)
                                    }
                                    disabled={rejectMutation.isPending}
                                    className="px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                    title="Reject"
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
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          {t.pendingReview} ({counts.pending})
                        </h3>
                        <p className="text-sm staff-text-secondary mt-1">
                          {t.submissionsAwaitingReview}
                        </p>
                      </div>
                    </div>

                    {isLoadingSubmissions ? (
                      <div className="text-center py-8 staff-text-secondary">
                        Loading submissions...
                      </div>
                    ) : counts.pending > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {submissions.map((submission: Submission) => (
                          <div
                            key={submission.paintingId}
                            className="border-2 border-orange-200 overflow-hidden hover:shadow-lg transition-all hover:border-orange-300"
                          >
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
                              <div className="absolute top-2 right-2">
                                <span className="bg-orange-500 text-white px-2 py-1 text-xs font-bold rounded">
                                  PENDING
                                </span>
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
                                {formatDate(submission.submissionDate)}
                              </p>

                              {/* Actions */}
                              <div className="flex gap-2">
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
                                  disabled={acceptMutation.isPending}
                                  className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 font-semibold"
                                  title="Accept"
                                >
                                  <IconCheck className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleQuickReject(submission.paintingId)
                                  }
                                  disabled={rejectMutation.isPending}
                                  className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 font-semibold"
                                  title="Reject"
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
