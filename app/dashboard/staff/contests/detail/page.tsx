"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconEdit,
  IconCalendar,
  IconTrophy,
  IconUsers,
  IconClock,
  IconEye,
  IconPlus,
  IconTrash,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStaffContestById, deleteStaffRound } from "@/apis/staff";
import Image from "next/image";
import { Suspense, useState } from "react";
import { CreateRoundDialog } from "@/components/staff/CreateRoundDialog";
import { ExaminersDialog } from "@/components/staff/ExaminersDialog";

interface Round {
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
}

function ContestDetailContent() {
  const searchParams = useSearchParams();
  const contestId = searchParams.get("id");
  const queryClient = useQueryClient();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isExaminersDialogOpen, setIsExaminersDialogOpen] = useState(false);

  // Fetch contest details
  const { data: contestData, isLoading } = useQuery({
    queryKey: ["contest-detail", contestId],
    queryFn: () => getStaffContestById(Number(contestId)),
    enabled: !!contestId,
    staleTime: 1 * 60 * 1000,
  });

  const contest = contestData?.data;

  // Delete round mutation
  const deleteMutation = useMutation({
    mutationFn: ({
      contestId,
      roundId,
    }: {
      contestId: number;
      roundId: string;
    }) => deleteStaffRound(contestId, roundId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contest-detail", contestId],
      });
    },
  });

  const handleDeleteRound = (roundId: number) => {
    if (
      confirm(
        "Are you sure you want to delete this round? This action cannot be undone."
      )
    ) {
      deleteMutation.mutate({
        contestId: Number(contestId),
        roundId: String(roundId),
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "staff-badge-active";
      case "COMPLETED":
      case "CLOSED": // Thêm trường hợp CLOSED nếu có
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

  if (!contestId) {
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
          <SiteHeader title="Contest Detail" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">Contest ID is required</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (isLoading) {
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
          <SiteHeader title="Contest Detail" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">Loading contest details...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!contest) {
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
          <SiteHeader title="Contest Detail" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">Contest not found</div>
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
        <SiteHeader title="Contest Detail" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                { label: contest.title },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Thay đổi: Bỏ rounded-full, dùng */}
                  <Link
                    href="/dashboard/staff/contests"
                    className="border-2 border-[#e6e2da] p-2 hover:bg-[#f9f7f4] transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                  </Link>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold staff-text-primary">
                        {contest.title}
                      </h2>
                      <span className={getStatusColor(contest.status)}>
                        {contest.status}
                      </span>
                    </div>
                    <p className="text-sm staff-text-secondary mt-1">
                      Contest ID: {contest.id}
                    </p>
                  </div>
                </div>
                {/* Thay đổi: Bỏ rounded-full, dùng */}
                <Link
                  href={`/dashboard/staff/contests/edit?id=${contest.id}`}
                  className="bg-gradient-to-r from-[#d9534f] to-[#e67e73] text-white px-4 py-2.5 font-bold shadow-md flex items-center gap-2 hover:shadow-lg transition-shadow"
                >
                  <IconEdit className="h-4 w-4" />
                  Edit Contest
                </Link>
              </div>

              {/* Banner Image */}
              {contest.bannerUrl && (
                <div className="staff-card p-0 overflow-hidden">
                  <Image
                    src={contest.bannerUrl}
                    alt={contest.title}
                    width={1200}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="staff-card staff-stat-info p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon">
                      <IconTrophy className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Awards
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">
                        {contest.numOfAward}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="staff-card staff-stat-success p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon">
                      <IconUsersGroup className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Participants
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">0</p>
                    </div>
                  </div>
                </div>

                <div className="staff-card staff-stat-secondary p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon">
                      <IconUsers className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Examiners
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">
                        {contest.examiners?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="staff-card staff-stat-primary p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon">
                      <IconClock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Status
                      </p>
                      <p className="text-sm font-bold staff-text-primary">
                        {contest.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  // onClick={() => setIsExaminersDialogOpen(true)} // Hàm mở dialog
                  className="flex items-center space-x-3 border-2 border-[#e6e2da] p-4 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 group w-full"
                >
                  {/* Icon Section */}
                  <div className=" bg-gradient-to-br from-blue-500 to-indigo-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <IconUsers className="h-5 w-5 text-white" />
                  </div>
                  {/* Text Section */}
                  <div>
                    <p className="text-sm font-bold staff-text-primary text-left">
                      Manage Paticipant
                    </p>
                    <p className="text-xs staff-text-secondary text-left">
                      Invite judges
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExaminersDialogOpen(true)}
                  className="flex items-center space-x-3 border-2 border-[#e6e2da] p-4 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 group w-full"
                >
                  {/* Icon Section */}
                  <div className=" bg-gradient-to-br from-blue-500 to-indigo-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <IconUsers className="h-5 w-5 text-white" />
                  </div>
                  {/* Text Section */}
                  <div>
                    <p className="text-sm font-bold staff-text-primary text-left">
                      Manage Examiners ({contest.examiners?.length || 0})
                    </p>
                    <p className="text-xs staff-text-secondary text-left">
                      Invite and manage judges
                    </p>
                  </div>
                </button>
              </div>

              {/* Contest Details */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Description */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    Description
                  </h3>
                  <p className="staff-text-secondary whitespace-pre-wrap">
                    {contest.description}
                  </p>
                </div>

                {/* Contest Information */}
                <div className="staff-card p-6 space-y-4">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    Contest Information
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 pb-3 border-b border-[#e6e2da]">
                      <IconCalendar className="h-5 w-5 staff-text-secondary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium staff-text-secondary">
                          Start Date
                        </p>
                        <p className="text-sm staff-text-primary font-semibold">
                          {formatDate(contest.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pb-3 border-b border-[#e6e2da]">
                      <IconCalendar className="h-5 w-5 staff-text-secondary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium staff-text-secondary">
                          End Date
                        </p>
                        <p className="text-sm staff-text-primary font-semibold">
                          {formatDate(contest.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pb-3 border-b border-[#e6e2da]">
                      <IconTrophy className="h-5 w-5 staff-text-secondary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium staff-text-secondary">
                          Number of Awards
                        </p>
                        <p className="text-sm staff-text-primary font-semibold">
                          {contest.numOfAward} prizes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <IconClock className="h-5 w-5 staff-text-secondary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium staff-text-secondary">
                          Current Status
                        </p>
                        <span
                          className={`${getStatusColor(contest.status)} mt-1`}
                        >
                          {contest.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contest Rounds */}
              <div className="staff-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold staff-text-primary">
                    Contest Rounds
                  </h3>
                  <button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-[#d9534f] to-[#e67e73] text-white px-4 py-2 font-semibold shadow-md flex items-center gap-2 hover:shadow-lg transition-shadow"
                  >
                    <IconPlus className="h-4 w-4" />
                    Create Round
                  </button>
                </div>

                {contest.rounds && contest.rounds.length > 0 ? (
                  <div className="space-y-4">
                    {contest.rounds.map((round: Round) => (
                      <div
                        key={round.roundId}
                        className="border border-[#e6e2da] p-4 rounded-md"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold staff-text-primary">
                              {round.name}
                              {round.table && (
                                <span className="ml-2 text-sm font-normal staff-text-secondary">
                                  (Table {round.table})
                                </span>
                              )}
                            </h4>
                            <span className={getStatusColor(round.status)}>
                              {round.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/staff/contests/rounds/${round.roundId}?contestId=${contest.contestId}`}
                              className="p-2 border border-[#e6e2da] hover:bg-[#f9f7f4] transition-colors"
                              title="View round details"
                            >
                              <IconEye className="h-4 w-4 staff-text-secondary" />
                            </Link>
                            <button
                              onClick={() => handleDeleteRound(round.roundId)}
                              className="p-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete round"
                              disabled={deleteMutation.isPending}
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {round.startDate && (
                            <div>
                              <p className="staff-text-secondary">Start Date</p>
                              <p className="staff-text-primary font-semibold">
                                {formatDate(round.startDate)}
                              </p>
                            </div>
                          )}
                          {round.endDate && (
                            <div>
                              <p className="staff-text-secondary">End Date</p>
                              <p className="staff-text-primary font-semibold">
                                {formatDate(round.endDate)}
                              </p>
                            </div>
                          )}
                          {round.submissionDeadline && (
                            <div>
                              <p className="staff-text-secondary">
                                Submission Deadline
                              </p>
                              <p className="staff-text-primary font-semibold">
                                {formatDate(round.submissionDeadline)}
                              </p>
                            </div>
                          )}
                          {round.resultAnnounceDate && (
                            <div>
                              <p className="staff-text-secondary">
                                Result Announce
                              </p>
                              <p className="staff-text-primary font-semibold">
                                {formatDate(round.resultAnnounceDate)}
                              </p>
                            </div>
                          )}
                          {round.sendOriginalDeadline && (
                            <div>
                              <p className="staff-text-secondary">
                                Original Deadline
                              </p>
                              <p className="staff-text-primary font-semibold">
                                {formatDate(round.sendOriginalDeadline)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 staff-text-secondary">
                    No rounds created yet. Click &quot;Create Round&quot; to add
                    one.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Create Round Dialog */}
      <CreateRoundDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        contestId={Number(contestId)}
      />

      {/* Examiners Dialog */}
      <ExaminersDialog
        isOpen={isExaminersDialogOpen}
        onClose={() => setIsExaminersDialogOpen(false)}
        contestId={Number(contestId)}
      />
    </SidebarProvider>
  );
}

export default function ContestDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d9534f]"></div>
        </div>
      }
    >
      <ContestDetailContent />
    </Suspense>
  );
}
