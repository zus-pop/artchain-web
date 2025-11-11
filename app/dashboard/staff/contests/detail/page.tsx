"use client";

import {
  createStaffRound2,
  deleteStaffRound,
  getStaffContestById,
  getStaffRounds,
  publishStaffContest,
  toggleExaminerScheduleEnforcement,
} from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { ExaminersDialog } from "@/components/staff/ExaminersDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useTranslation } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { useLanguageStore } from "@/store/language-store";
import { Contest } from "@/types/dashboard";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconEdit,
  IconEye,
  IconFileText,
  IconPlus,
  IconSettings,
  IconTrophy,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNotifyContest } from "../../../../../apis/email";

function ContestDetailContent() {
  const searchParams = useSearchParams();
  const contestId = searchParams.get("id");
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const [isExaminersDialogOpen, setIsExaminersDialogOpen] = useState(false);
  const [showEmbeddedPdf, setShowEmbeddedPdf] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showCreateRound2Confirm, setShowCreateRound2Confirm] = useState(false);
  const [round2NumberOfTables, setRound2NumberOfTables] = useState<number>(0);

  // Fetch contest details
  const { data: contestData, isLoading } = useQuery({
    queryKey: ["contest-detail", contestId],
    queryFn: () => getStaffContestById(Number(contestId)),
    enabled: !!contestId,
    staleTime: 1 * 60 * 1000,
  });

  // Fetch rounds
  const { data: roundsData } = useQuery({
    queryKey: ["contest-rounds", contestId],
    queryFn: () => getStaffRounds(Number(contestId)),
    enabled: !!contestId,
    staleTime: 1 * 60 * 1000,
  });
  const notifyContest = useNotifyContest();

  const contest = contestData?.data as Contest;
  const rounds = roundsData?.data || [];

  // Set default number of tables when contest loads
  useEffect(() => {
    if (contest?.numberOfTablesRound2) {
      setRound2NumberOfTables(contest.numberOfTablesRound2);
    }
  }, [contest?.numberOfTablesRound2]);

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
      queryClient.invalidateQueries({
        queryKey: ["contest-rounds", contestId],
      });
    },
  });

  // Create round 2 mutation
  const createRound2Mutation = useMutation({
    mutationFn: ({
      contestId,
      numberOfTables,
    }: {
      contestId: number;
      numberOfTables: number;
    }) =>
      createStaffRound2(contestId, {
        date: new Date().toISOString(),
        numberOfTables,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contest-rounds", contestId],
      });
      toast.success("Tạo vòng 2 thành công");
      setShowCreateRound2Confirm(false);
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      toast.error(message);
    },
  });

  // Publish contest mutation
  const publishContestMutation = useMutation({
    mutationFn: (contestId: string) => publishStaffContest(contestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contest-detail", contestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contest-rounds", contestId],
      });
      toast.success("Contest published successfully");
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      toast.error(message);
    },
  });

  // Toggle schedule enforcement mutation
  const toggleScheduleEnforcementMutation = toggleExaminerScheduleEnforcement();

  const handleDeleteRound = (roundId: number) => {
    if (confirm(t.confirmDeleteRoundDetail)) {
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
          <SiteHeader title={t.contestDetailTitle} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">{t.contestIdRequiredDetail}</div>
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
          <SiteHeader title={t.contestDetailTitle} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">{t.loadingContestDetailsDetail}</div>
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
          <SiteHeader title={t.contestDetailTitle} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">{t.contestNotFoundDetail}</div>
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
        <SiteHeader title={t.contestDetailTitle} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: t.contestManagementBreadcrumb,
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
                      {t.contestIdLabelDetail} {contest.contestId}
                    </p>
                  </div>
                </div>
                {contest.status === "DRAFT" && (
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/staff/contests/edit?id=${contest.contestId}`}
                      className="bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white px-4 py-2.5 font-bold shadow-md flex items-center gap-2 hover:shadow-lg transition-shadow"
                    >
                      <IconEdit className="h-4 w-4" />
                      {t.editContestDetail}
                    </Link>
                    <button
                      onClick={() => setShowPublishConfirm(true)}
                      className="bg-linear-to-r from-green-500 to-green-600 text-white px-4 py-2.5 font-bold shadow-md flex items-center gap-2 hover:shadow-lg transition-shadow"
                    >
                      <IconTrophy className="h-4 w-4" />
                      {t.publishContestDetail}
                    </button>
                  </div>
                )}
              </div>

              {/* Banner Image */}
              {contest.bannerUrl && (
                <div className="staff-card p-0 overflow-hidden">
                  <Image
                    src={contest.bannerUrl}
                    alt={contest.title}
                    width={1200}
                    height={400}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Contest Details */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Description */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    {t.descriptionDetail}
                  </h3>
                  <p className="staff-text-secondary whitespace-pre-wrap">
                    {contest.description}
                  </p>
                </div>

                {/* Contest Information */}
                <div className="staff-card p-6 space-y-4">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    {t.contestInformationDetail}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 pb-3 border-b border-[#e6e2da]">
                      <IconCalendar className="h-5 w-5 staff-text-secondary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium staff-text-secondary">
                          {t.startDateDetail}
                        </p>
                        <p className="text-sm staff-text-primary font-semibold">
                          {formatDate({
                            dateString: contest.startDate,
                            language: currentLanguage,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pb-3 border-b border-[#e6e2da]">
                      <IconCalendar className="h-5 w-5 staff-text-secondary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium staff-text-secondary">
                          {t.endDateDetail}
                        </p>
                        <p className="text-sm staff-text-primary font-semibold">
                          {formatDate({
                            dateString: contest.endDate,
                            language: currentLanguage,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pb-3 border-b border-[#e6e2da]">
                      <IconTrophy className="h-5 w-5 staff-text-secondary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium staff-text-secondary">
                          {t.numberOfAwardsDetail}
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
                          {t.currentStatusDetail}
                        </p>
                        <span
                          className={`${getStatusColor(contest.status)} mt-1`}
                        >
                          {contest.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Enforcement Toggle */}
                  <div className="pt-4 border-t border-[#e6e2da]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconSettings className="h-5 w-5 staff-text-secondary" />
                        <div>
                          <p className="text-sm font-medium staff-text-primary">
                            {t.scheduleEnforcementDetail}
                          </p>
                          <p className="text-xs staff-text-secondary">
                            {t.controlExaminerScheduleDetail}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          toggleScheduleEnforcementMutation.mutate(contestId)
                        }
                        disabled={toggleScheduleEnforcementMutation.isPending}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          contest.isScheduleEnforced
                            ? "bg-green-600"
                            : "bg-gray-200"
                        } ${
                          toggleScheduleEnforcementMutation.isPending
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            contest.isScheduleEnforced
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="staff-card staff-stat-info p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon">
                      <IconTrophy className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        {t.awardsDetail}
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
                        {t.participantsDetail}
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
                        {t.examinersDetail}
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
                        {t.statusDetail}
                      </p>
                      <p className="text-sm font-bold staff-text-primary">
                        {contest.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rules PDF */}
              {contest.ruleUrl && (
                <div className="staff-card p-0 overflow-hidden">
                  {/* PDF Header */}
                  <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-[#e6e2da]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <IconFileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold staff-text-primary">
                            {t.contestRulesAndRegulationsDetail}
                          </h3>
                          <p className="text-sm staff-text-secondary">
                            {t.officialContestGuidelinesDetail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowEmbeddedPdf(!showEmbeddedPdf)}
                          className="bg-linear-to-r from-gray-500 to-gray-600 text-white px-4 py-2 font-semibold shadow-md flex items-center gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          <IconFileText className="h-4 w-4" />
                          {showEmbeddedPdf ? t.hideDetail : t.showDetail}{" "}
                          {t.embeddedViewDetail}
                        </button>
                        <a
                          href={contest.ruleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white px-4 py-2 font-semibold shadow-md flex items-center gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          <IconEye className="h-4 w-4" />
                          {t.viewPDFDetail}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* PDF Viewer */}
                  {showEmbeddedPdf && (
                    <div className="relative">
                      <div className="bg-gray-50 px-6 py-3 border-b border-[#e6e2da]">
                        <div className="flex items-center gap-2 text-sm staff-text-secondary">
                          <IconFileText className="h-4 w-4" />
                          <span>{t.pdfDocumentViewerDetail}</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            Embedded View
                          </span>
                        </div>
                      </div>
                      <div className="relative bg-white">
                        <iframe
                          src={contest.ruleUrl}
                          className="w-full h-[600px] md:h-[700px] lg:h-[800px] border-0"
                          title="Contest Rules PDF"
                          loading="lazy"
                        />
                        {/* Loading overlay */}
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none">
                          <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-sm staff-text-secondary">
                              {t.loadingPDFDetail}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  // onClick={() => setIsExaminersDialogOpen(true)} // Hàm mở dialog
                  className="flex items-center space-x-3 border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 group w-full"
                >
                  {/* Icon Section */}
                  <div className=" bg-linear-to-br from-blue-500 to-indigo-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <IconUsers className="h-5 w-5 text-white" />
                  </div>
                  {/* Text Section */}
                  <div>
                    <p className="text-sm font-bold staff-text-primary text-left">
                      {t.manageParticipantDetail}
                    </p>
                    <p className="text-xs staff-text-secondary text-left">
                      {t.inviteJudgesDetail}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExaminersDialogOpen(true)}
                  className="flex items-center space-x-3 border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 group w-full"
                >
                  {/* Icon Section */}
                  <div className=" bg-linear-to-br from-blue-500 to-indigo-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <IconUsers className="h-5 w-5 text-white" />
                  </div>
                  {/* Text Section */}
                  <div>
                    <p className="text-sm font-bold staff-text-primary text-left">
                      {t.manageExaminersDetail} (
                      {contest.examiners?.length || 0})
                    </p>
                    <p className="text-xs staff-text-secondary text-left">
                      {t.inviteAndManageJudgesDetail}
                    </p>
                  </div>
                </button>
                <Link
                  href={`/dashboard/staff/contests/awards?id=${contest.contestId}`}
                  className="flex items-center space-x-3 border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 group w-full"
                >
                  {/* Icon Section */}
                  <div className=" bg-linear-to-br from-blue-500 to-indigo-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <IconTrophy className="h-5 w-5 text-white" />
                  </div>
                  {/* Text Section */}
                  <div>
                    <p className="text-sm font-bold staff-text-primary text-left">
                      {t.manageAwardsDetail} ({contest.numOfAward || 0})
                    </p>
                    <p className="text-xs staff-text-secondary text-left">
                      {t.assignPrizesToWinnersDetail}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Contest Rounds */}
              <div className="staff-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold staff-text-primary">
                    {t.contestRoundsDetail}
                  </h3>
                  {!rounds.some((round) => round.isRound2) && (
                    <button
                      onClick={() => setShowCreateRound2Confirm(true)}
                      disabled={createRound2Mutation.isPending}
                      className="bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white px-4 py-2 font-semibold shadow-md flex items-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50"
                    >
                      <IconPlus className="h-4 w-4" />
                      {t.round2Detail}
                    </button>
                  )}
                </div>

                {rounds && rounds.length > 0 ? (
                  <div className="space-y-4">
                    {rounds.map((round) => (
                      <div
                        key={round.name}
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
                            {/* {round.status && (
                              <span className={getStatusColor(round.status)}>
                                {round.status}
                              </span>
                            )} */}
                          </div>
                          {!round.isRound2 && round.roundId && (
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/dashboard/staff/contests/rounds/${round.roundId}?contestId=${contest.contestId}`}
                                className="p-2 border border-[#e6e2da] hover:bg-[#f9f7f4] transition-colors"
                                title={t.viewRoundDetailsDetail}
                              >
                                <IconEye className="h-4 w-4 staff-text-secondary" />
                              </Link>
                              {/* <button
                                onClick={() =>
                                  round.roundId &&
                                  handleDeleteRound(round.roundId)
                                }
                                className="p-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                                title={t.deleteRoundDetail}
                                disabled={
                                  deleteMutation.isPending || !round.roundId
                                }
                              >
                                <IconTrash className="h-4 w-4" />
                              </button> */}
                            </div>
                          )}
                        </div>

                        {!round.isRound2 ? (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {round.startDate && (
                              <div>
                                <p className="staff-text-secondary">
                                  {t.startDateDetail}
                                </p>
                                <p className="staff-text-primary font-semibold">
                                  {formatDate({
                                    dateString: round.startDate,
                                    language: currentLanguage,
                                  })}
                                </p>
                              </div>
                            )}
                            {round.endDate && (
                              <div>
                                <p className="staff-text-secondary">End Date</p>
                                <p className="staff-text-primary font-semibold">
                                  {formatDate({
                                    dateString: round.endDate,
                                    language: currentLanguage,
                                  })}
                                </p>
                              </div>
                            )}
                            {round.submissionDeadline && (
                              <div>
                                <p className="staff-text-secondary">
                                  {t.submissionDeadlineDetail}
                                </p>
                                <p className="staff-text-primary font-semibold">
                                  {formatDate({
                                    dateString: round.submissionDeadline,
                                    language: currentLanguage,
                                  })}
                                </p>
                              </div>
                            )}
                            {round.resultAnnounceDate && (
                              <div>
                                <p className="staff-text-secondary">
                                  {t.resultAnnounceDetail}
                                </p>
                                <p className="staff-text-primary font-semibold">
                                  {formatDate({
                                    dateString: round.resultAnnounceDate,
                                    language: currentLanguage,
                                  })}
                                </p>
                              </div>
                            )}
                            {round.sendOriginalDeadline && (
                              <div>
                                <p className="staff-text-secondary">
                                  {t.originalDeadlineDetail}
                                </p>
                                <p className="staff-text-primary font-semibold">
                                  {formatDate({
                                    dateString: round.sendOriginalDeadline,
                                    language: currentLanguage,
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm staff-text-secondary mb-3">
                              {t.totalTablesDetail} {round.totalTables}
                            </p>
                            <div className="space-y-2">
                              {round.tables?.map((table) => (
                                <div
                                  key={table.roundId}
                                  className="border border-[#e6e2da] p-3 rounded"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <h5 className="font-semibold staff-text-primary">
                                        Table {table.table}
                                      </h5>
                                      <span
                                        className={getStatusColor(table.status)}
                                      >
                                        {table.status}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Link
                                        href={`/dashboard/staff/contests/rounds/${table.roundId}?contestId=${contest.contestId}`}
                                        className="p-1 border border-[#e6e2da] hover:bg-[#f9f7f4] transition-colors"
                                        title={t.viewTableDetailsDetail}
                                      >
                                        <IconEye className="h-3 w-3 staff-text-secondary" />
                                      </Link>
                                      {/* <button
                                        onClick={() =>
                                          handleDeleteRound(table.roundId)
                                        }
                                        className="p-1 border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                                        title={t.deleteTableDetail}
                                        disabled={deleteMutation.isPending}
                                      >
                                        <IconTrash className="h-3 w-3" />
                                      </button> */}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                                    {table.startDate && (
                                      <div>
                                        <p className="staff-text-secondary">
                                          {t.startDetail}
                                        </p>
                                        <p className="staff-text-primary font-semibold">
                                          {formatDate({
                                            dateString: table.startDate,
                                            language: currentLanguage,
                                          })}
                                        </p>
                                      </div>
                                    )}
                                    {table.endDate && (
                                      <div>
                                        <p className="staff-text-secondary">
                                          {t.endDetail}
                                        </p>
                                        <p className="staff-text-primary font-semibold">
                                          {formatDate({
                                            dateString: table.endDate,
                                            language: currentLanguage,
                                          })}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 staff-text-secondary">
                    {t.noRoundsCreatedYetDetail}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <ExaminersDialog
        isOpen={isExaminersDialogOpen}
        onClose={() => setIsExaminersDialogOpen(false)}
        contestId={Number(contestId)}
      />

      {/* Publish Confirmation Dialog */}
      <Dialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="bg-[#d9534f]/10 p-2 rounded-full">
                <IconTrophy className="h-6 w-6 text-[#d9534f]" />
              </div>
              {t.publishContestDetail}
            </DialogTitle>
            <DialogDescription>
              {t.publishContestConfirmDetail}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setShowPublishConfirm(false)}
              className="px-4 py-2 border border-[#e6e2da] text-staff-text-secondary hover:bg-gray-50 transition-colors"
            >
              {t.cancelDetail}
            </button>
            <button
              onClick={() => {
                publishContestMutation.mutate(contest.contestId.toString(), {
                  onSuccess: () => {
                    notifyContest.mutate();
                  },
                });
                setShowPublishConfirm(false);
              }}
              disabled={publishContestMutation.isPending}
              className="bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white px-4 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publishContestMutation.isPending
                ? t.publishingDetail
                : t.publishDetail}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Round 2 Confirmation Dialog */}
      <Dialog
        open={showCreateRound2Confirm}
        onOpenChange={setShowCreateRound2Confirm}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="bg-[#d9534f]/10 p-2 rounded-full">
                <IconPlus className="h-6 w-6 text-[#d9534f]" />
              </div>
              {t.createRound2Detail}
            </DialogTitle>
            <DialogDescription>{t.createRound2ConfirmDetail}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium staff-text-primary mb-2">
                  {t.numberOfTablesDetail}
                </label>
                <p className="text-xs staff-text-secondary mb-3">
                  {t.currentContestSettingDetail} {contest.numberOfTablesRound2}{" "}
                  {t.tablesDetail}
                </p>
                <input
                  type="number"
                  min="1"
                  value={round2NumberOfTables}
                  onChange={(e) =>
                    setRound2NumberOfTables(Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-[#e6e2da] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9534f] focus:border-transparent"
                  placeholder={t.enterNumberOfTablesDetail}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowCreateRound2Confirm(false)}
              className="px-4 py-2 border border-[#e6e2da] text-staff-text-secondary hover:bg-gray-50 transition-colors"
            >
              {t.cancelDetail}
            </button>
            <button
              onClick={() => {
                createRound2Mutation.mutate({
                  contestId: Number(contestId),
                  numberOfTables: round2NumberOfTables,
                });
              }}
              disabled={
                createRound2Mutation.isPending || round2NumberOfTables < 1
              }
              className="bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white px-4 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createRound2Mutation.isPending
                ? t.creatingDetail
                : t.createRound2BtnDetail}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
