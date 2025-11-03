"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconEye,
  IconCheck,
  IconX,
  IconPhoto,
} from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStaffRoundById,
  getStaffSubmissions,
  acceptStaffSubmission,
  rejectStaffSubmission,
} from "@/apis/staff";
import Image from "next/image";
import { Suspense, useState } from "react";
import { SubmissionDetailDialog } from "@/components/staff/SubmissionDetailDialog";

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

  const [selectedStatus, setSelectedStatus] = useState<
    "ALL" | "PENDING" | "ACCEPTED" | "REJECTED"
  >("ALL");

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
    if (confirm("Are you sure you want to accept this submission?")) {
      acceptMutation.mutate(paintingId);
    }
  };

  const handleQuickReject = (paintingId: string) => {
    if (confirm("Are you sure you want to reject this submission?")) {
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
          <SiteHeader title="Round Detail" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">
              Contest ID and Round ID are required
            </div>
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
          <SiteHeader title="Round Detail" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">Loading round details...</div>
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
          <SiteHeader title="Round Detail" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">Round not found</div>
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
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                {
                  label: "Contest Detail",
                  href: `/dashboard/staff/contests/detail?id=${contestId}`,
                },
                { label: round.name },
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
                      <span className={getStatusColor(round.status)}>
                        {round.status}
                      </span>
                    </div>
                    <p className="text-sm staff-text-secondary mt-1">
                      Round ID: {round.roundId}
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
                          Start Date
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
                          End Date
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
                          Submission Deadline
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
                          Result Announce
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
              <div className="staff-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold staff-text-primary">
                    Submissions
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
                      All ({counts.all})
                    </button>
                    <button
                      onClick={() => setSelectedStatus("PENDING")}
                      className={`px-4 py-2 font-semibold transition-all ${
                        selectedStatus === "PENDING"
                          ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md"
                          : "border-2 border-[#e6e2da] staff-text-secondary hover:bg-[#f7f7f7]"
                      }`}
                    >
                      Pending ({counts.pending})
                    </button>
                    <button
                      onClick={() => setSelectedStatus("ACCEPTED")}
                      className={`px-4 py-2 font-semibold transition-all ${
                        selectedStatus === "ACCEPTED"
                          ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-md"
                          : "border-2 border-[#e6e2da] staff-text-secondary hover:bg-[#f7f7f7]"
                      }`}
                    >
                      Accepted ({counts.accepted})
                    </button>
                    <button
                      onClick={() => setSelectedStatus("REJECTED")}
                      className={`px-4 py-2 font-semibold transition-all ${
                        selectedStatus === "REJECTED"
                          ? "bg-linear-to-r from-red-500 to-rose-500 text-white shadow-md"
                          : "border-2 border-[#e6e2da] staff-text-secondary hover:bg-[#f7f7f7]"
                      }`}
                    >
                      Rejected ({counts.rejected})
                    </button>
                  </div>
                </div>

                {isLoadingSubmissions ? (
                  <div className="text-center py-8 staff-text-secondary">
                    Loading submissions...
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
                                <p className="text-sm">No image</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <span className={getStatusColor(submission.status)}>
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
                            Submitted: {formatDate(submission.submissionDate)}
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
                              View
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
                    No submissions found for this round.
                  </div>
                )}
              </div>
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
