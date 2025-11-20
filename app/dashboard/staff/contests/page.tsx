"use client";

import { getAllStaffContests } from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { StatsCards } from "@/components/staff/StatsCards";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ContestStatus } from "@/types/contest";
import {
  Contest,
  ContestStatus as DashboardContestStatus,
} from "@/types/dashboard";
import { ContestDTO } from "@/types/staff/contest-dto";
import {
  IconCircleCheck,
  IconCircleX,
  IconEdit,
  IconEye,
  IconFilter,
  IconPlus,
  IconSearch,
  IconTrophy,
  IconUsers,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";

// Helper function to convert ContestDTO to Contest
const convertContestDTOToContest = (dto: ContestDTO): Contest => {
  return {
    contestId: dto.contestId.toString(),
    title: dto.title,
    description: dto.description,
    status: dto.status as DashboardContestStatus,
    startDate: new Date(dto.startDate).toLocaleDateString(),
    endDate: new Date(dto.endDate).toLocaleDateString(),
    createdAt: dto.startDate,
    createdBy: dto.createdBy,
    bannerUrl: dto.bannerUrl,
    ruleUrl: dto.ruleUrl,
    isScheduleEnforced: dto.isScheduleEnforcement,
    numOfAward: dto.numOfAward,
    rounds: dto.rounds,
    round2Quantity: dto.round2Quantity,
    numberOfTablesRound2: dto.numberOfTablesRound2,
  };
};

export default function ContestsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ContestStatus | "ALL">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // Fetch contests from API
  const {
    data: contestsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "staff-contests",
      selectedStatus,
      searchQuery,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      getAllStaffContests({
        status:
          selectedStatus !== "ALL"
            ? (selectedStatus as ContestStatus)
            : undefined,
        search: searchQuery || undefined,
        page: currentPage,
        limit: pageSize,
      }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Convert API data to local Contest type
  const contests = contestsResponse?.data.map(convertContestDTOToContest) || [];
  const totalFromAPI = contestsResponse?.meta.total || 0;
  const totalPages = contestsResponse?.meta.totalPages || 1;

  const statusOptions: ContestStatus[] = [
    "ALL",
    "DRAFT",
    "ACTIVE",
    "COMPLETED",
    "CANCELLED",
  ];

  const getStatusBadgeColor = (status: DashboardContestStatus) => {
    const colors = {
      DRAFT: "staff-badge-neutral",
      ACTIVE: "staff-badge-active",
      COMPLETED: "staff-badge-active",
      CANCELLED: "staff-badge-rejected",
    };
    return colors[status];
  };

  const getStatusIcon = (status: DashboardContestStatus) => {
    const icons = {
      DRAFT: IconEdit,
      ACTIVE: IconCircleCheck,
      COMPLETED: IconTrophy,
      CANCELLED: IconCircleX,
    };
    return icons[status] ?? IconEdit;
  };

  const totalContests = totalFromAPI;
  const activeContests = contests.filter((c) => c.status === "ACTIVE").length;
  const totalRounds = contests.reduce(
    (sum, c) =>
      sum + (c.rounds ? new Set(c.rounds.map((r) => r.name)).size : 0),
    0
  );
  const totalAwards = contests.reduce((sum, c) => sum + (c.numOfAward || 0), 0);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchQuery]);

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
        <SiteHeader title={t.contestManagement} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[{ label: t.contestManagement }]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold staff-text-primary">
                    {t.allContestsCount} ({totalFromAPI})
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    {t.manageArtCompetitions}
                  </p>
                </div>
                <Link
                  href="/dashboard/staff/contests/create"
                  className="staff-btn-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  {t.createNewContest}
                </Link>
              </div>

              {/* Statistics Cards */}
              <StatsCards
                stats={[
                  {
                    title: t.totalContests,
                    value: totalContests,
                    subtitle: t.allCompetitions,
                    icon: <IconTrophy className="h-6 w-6" />,
                    variant: "info",
                  },
                  {
                    title: t.activeContests,
                    value: activeContests,
                    subtitle: t.currentlyRunning,
                    icon: <IconCircleCheck className="h-6 w-6" />,
                    variant: "warning",
                  },
                ]}
              />

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t.searchContestsPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as ContestStatus | "ALL")
                    }
                    className="px-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status === "ALL" ? t.allStatus : status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contests Table */}
              <div className="staff-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          {t.contestTable}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          {t.statusTable}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          {t.awardsTable}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          {t.roundsTable}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          {t.datesTable}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          {t.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center staff-text-secondary"
                          >
                            {t.loadingContests}
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-red-500"
                          >
                            {t.errorLoadingContests}
                          </td>
                        </tr>
                      ) : contests.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center staff-text-secondary"
                          >
                            {t.noContestsFound}
                          </td>
                        </tr>
                      ) : (
                        contests.map((contest) => {
                          const StatusIcon = getStatusIcon(contest.status);
                          const activeRounds =
                            contest.rounds?.filter(
                              (r: { status: string }) => r.status === "OPEN"
                            ).length || 0;
                          const totalRoundCount = contest.rounds
                            ? new Set(contest.rounds.map((r) => r.name)).size
                            : 0;

                          return (
                            <tr
                              key={contest.contestId}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-start gap-3">
                                  {contest.bannerUrl && (
                                    <Image
                                      src={contest.bannerUrl}
                                      alt={contest.title}
                                      width={64}
                                      height={64}
                                      className="w-16 h-16 object-cover rounded"
                                    />
                                  )}
                                  <div>
                                    <div className="text-sm font-medium staff-text-primary">
                                      {contest.title}
                                    </div>
                                    <div className="text-xs staff-text-secondary mt-1 max-w-xs truncate">
                                      {contest.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                    contest.status
                                  )}`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {contest.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium staff-text-primary">
                                    {contest.numOfAward || 0}
                                  </span>
                                  {/* <IconTrophy className="h-4 w-4 text-yellow-500" /> */}
                                  <span className="text-xs">
                                    {t.prizesText}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                <div>
                                  <div className="font-medium staff-text-primary">
                                    {totalRoundCount}{" "}
                                    {t.roundsTable.toLowerCase()}
                                  </div>
                                  <div className="text-xs">
                                    {activeRounds} {t.activeText}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                <div>
                                  <div className="text-xs">
                                    {t.startText}: {contest.startDate}
                                  </div>
                                  <div className="text-xs">
                                    {t.endText}: {contest.endDate}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  href={`/dashboard/staff/contests/detail?id=${contest.contestId}`}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors mr-2 inline-block"
                                  title="View Details"
                                >
                                  <IconEye className="h-4 w-4" />
                                </Link>
                                {/* <Link
                                  href={`/dashboard/staff/contests/edit?id=${contest.contestId}`}
                                  className="staff-text-secondary hover:staff-text-primary p-1 rounded hover:bg-gray-50 transition-colors mr-2 inline-block"
                                  title="Edit Contest"
                                >
                                  <IconEdit className="h-4 w-4" />
                                </Link> */}
                                {/* <button
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors mr-2 inline-block"
                                  title="Delete Contest"
                                >
                                  <IconTrash className="h-4 w-4" />
                                </button> */}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm staff-text-secondary">
                  <span>{t.show}</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>{t.entriesPerPage}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm staff-text-secondary">
                    {t.showingEntries}{" "}
                    {contests.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}{" "}
                    {t.toText} {Math.min(currentPage * pageSize, totalFromAPI)}{" "}
                    {t.ofText} {totalFromAPI} {t.entriesText}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="First page"
                    >
                      <IconChevronsLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Previous page"
                    >
                      <IconChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="px-3 py-1 text-sm staff-text-primary">
                      {t.pageText} {currentPage} {t.ofText} {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Next page"
                    >
                      <IconChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Last page"
                    >
                      <IconChevronsRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
