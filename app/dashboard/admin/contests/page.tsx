"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Contest, ContestStatus } from "@/types/contest";
import { useGetContestsPaginated } from "@/apis/contests";
import { useQuery } from "@tanstack/react-query";
import {
  IconSearch,
  IconTrophy,
  IconCalendar,
  IconEye,
  IconPlus,
} from "@tabler/icons-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { useState, useEffect, useCallback } from "react";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import Image from "next/image";
import { getContestStatistics } from "@/apis/admin";
import { ContestStatisticsResponse, ContestStatistics } from "@/types/admin/system";
import Loader from "@/components/Loaders";

export default function AdminContestsPage() {
  // State for filters and infinite scroll
  const [selectedStatus, setSelectedStatus] = useState<ContestStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [contests, setContests] = useState<Contest[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isFiltering, setIsFiltering] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);
  const pageSize = 20; // Fixed page size for infinite scroll

  // Translation
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // Fetch contests with pagination
  const {
    data: contestsResponse,
    isLoading,
    error,
    refetch,
  } = useGetContestsPaginated(
    selectedStatus !== "ALL" ? selectedStatus : undefined,
    page,
    pageSize
  );

  // Also fetch a large first page of all contests to compute stable statistics
  const {
    data: allContestsResponse,
    isLoading: isLoadingAllContests,
  } = useGetContestsPaginated(undefined, 1, 1000);

  // Fetch selected contest stats only when modal is open
  const {
    data: contestStatsResponse,
    isLoading: isLoadingContestStats,
    error: contestStatsError,
  } = useQuery<ContestStatisticsResponse | ContestStatistics | null>({
    queryKey: ["contestStats", selectedContestId],
    queryFn: () => (selectedContestId ? getContestStatistics(selectedContestId) : Promise.resolve(null)),
    enabled: !!selectedContestId && statsModalOpen,
  });

  // Handle infinite scroll
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && contestsResponse) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }, [isLoadingMore, hasMore, contestsResponse]);

  // Update contests list when new data arrives
  useEffect(() => {
    if (contestsResponse) {
      if (page === 1) {
        setContests(contestsResponse);
      } else {
        setContests(prev => [...prev, ...contestsResponse]);
      }
      setHasMore(contestsResponse.length === pageSize);
      setIsLoadingMore(false);
      // data arrived for current filters
      setIsFiltering(false);
    }
  }, [contestsResponse, page, pageSize]);

  // Filter contests locally by search query
  const filteredContests = contests.filter(contest =>
    contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contest.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get contest status statistics. Prefer stats computed from the full dataset
  // if available (so the stat cards stay stable when filtering/pagination
  // changes). Otherwise fall back to the currently-loaded contests.
  const statsSource = (allContestsResponse && allContestsResponse.length > 0)
    ? allContestsResponse
    : contests;

  const statusStats = {
    total: statsSource.length,
    active: statsSource.filter(c => c.status === "ACTIVE").length,
    upcoming: statsSource.filter(c => c.status === "UPCOMING").length,
    ended: statsSource.filter(c => c.status === "ENDED").length,
    completed: statsSource.filter(c => c.status === "COMPLETED").length,
    draft: statsSource.filter(c => c.status === "DRAFT").length,
  };

  // Total used for chart scaling (sum of individual status counts)
  const statusTotal =
    statusStats.active +
    statusStats.upcoming +
    statusStats.ended +
    statusStats.completed +
    statusStats.draft;

  const getStatusBadgeColor = (status: ContestStatus) => {
    const colors: Record<ContestStatus, string> = {
      ACTIVE: "staff-badge-active",
      UPCOMING: "staff-badge-pending",
      ENDED: "staff-badge-neutral",
      COMPLETED: "staff-badge-approved",
      DRAFT: "staff-badge-rejected",
      CANCELLED: "staff-badge-neutral",
      ALL: "staff-badge-neutral",
    };
    return colors[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Contest Management" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-linear-to-r from-red-50 to-orange-50">
            <Breadcrumb
              items={[{ label: "Contest Management" }]}
              homeHref="/dashboard/admin"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Statistics Cards */}
              <div className="">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Contests distribution</h4>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{
                        name: 'Contests',
                        ACTIVE: statusStats.active,
                        UPCOMING: statusStats.upcoming,
                        ENDED: statusStats.ended,
                        COMPLETED: statusStats.completed,
                        DRAFT: statusStats.draft,
                      }]}
                      layout="vertical">
                        <XAxis type="number" hide domain={[0, statusTotal || 1]} />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ACTIVE" stackId="a" fill="#10b981" />
                        <Bar dataKey="UPCOMING" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="ENDED" stackId="a" fill="#6b7280" />
                        <Bar dataKey="COMPLETED" stackId="a" fill="#7c3aed" />
                        <Bar dataKey="DRAFT" stackId="a" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative border-[1.5]">
                <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contests by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="staff-input w-full pl-10 pr-4 py-2"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStatus("ALL")}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedStatus === "ALL"
                      ? "staff-badge-active"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Contests
                </button>
                <button
                  onClick={() => setSelectedStatus("ACTIVE")}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedStatus === "ACTIVE"
                      ? "staff-badge-active"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setSelectedStatus("UPCOMING")}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedStatus === "UPCOMING"
                      ? "staff-badge-pending"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setSelectedStatus("ENDED")}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedStatus === "ENDED"
                      ? "staff-badge-neutral"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Ended
                </button>
                <button
                  onClick={() => setSelectedStatus("COMPLETED")}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedStatus === "COMPLETED"
                      ? "staff-badge-approved"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setSelectedStatus("DRAFT")}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedStatus === "DRAFT"
                      ? "staff-badge-rejected"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Draft
                </button>
              </div>

              {/* Contests List */}
              <div className="space-y-4">
                {isLoading && contests.length === 0 ? (
                  // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="staff-card animate-pulse">
                      <div className="flex items-center space-x-4 p-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-500">Error loading contests</p>
                  </div>
                ) : (!isFiltering && filteredContests.length === 0) ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No contests found</p>
                  </div>
                ) : (
                  filteredContests.map((contest) => (
                    <div key={contest.contestId} className="staff-card hover:shadow-lg transition-shadow">
                      <div className="flex items-center space-x-4 p-4">
                        {/* Contest Image */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          {contest.bannerUrl ? (
                            <Image
                              src={contest.bannerUrl}
                              alt={contest.title}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <IconTrophy className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Contest Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                                    {contest.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {contest.description.length > 120
                                      ? `${contest.description.substring(0, 120)}...`
                                      : contest.description
                                    }
                                  </p>
                                </div>
                                
                                {/* Status Badge removed from here and placed with action buttons */}
                              </div>
                              
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <IconCalendar className="h-4 w-4" />
                                  <span>{formatDate(contest.startDate)} - {formatDate(contest.endDate)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <IconTrophy className="h-4 w-4" />
                                  <span>{contest.numOfAward || 0} awards</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <IconEye className="h-4 w-4" />
                                  <span>{contest.rounds?.length || 0} rounds</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons (status moved here) */}
                        <div className="flex-shrink-0 flex items-center space-x-2">
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(contest.status)}`}>
                            {contest.status}
                          </span>
                            <button
                              onClick={() => {
                                setSelectedContestId(contest.contestId as unknown as number);
                                setStatsModalOpen(true);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <IconEye className="h-5 w-5" />
                            </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Load More Button */}
              {hasMore && !isLoading && (
                <div className="flex justify-center py-4">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="staff-btn-primary disabled:opacity-50"
                  >
                    {isLoadingMore ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}

              {/* Loading indicator for infinite scroll */}
              {isLoadingMore && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#423137]"></div>
                </div>
              )}
              {/* Stats Modal */}
              {statsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white rounded-lg w-[95%] max-w-4xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">Contest statistics</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setStatsModalOpen(false);
                            setSelectedContestId(null);
                          }}
                          className="px-3 py-1 text-sm bg-gray-100 rounded"
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    {isLoadingContestStats ? (
                      <div className="py-12 text-center"><Loader /></div>
                    ) : contestStatsError ? (
                      <div className="py-12 text-center text-red-500"><Loader /></div>
                    ) : (
                      (() => {
                        const payload = (contestStatsResponse as ContestStatisticsResponse)?.data ?? (contestStatsResponse as ContestStatistics) ?? null;
                        // payload expected shape: { contest, submissions, participants, evaluations, votes, awards }
                        if (!payload) return <div className="py-6">No data</div>;
                        const submissions = payload.submissions || {};
                        const byRound = submissions.byRound || {};
                        const roundData = Object.keys(byRound).map(r => ({
                          name: r,
                          value: typeof byRound[r] === 'object' && byRound[r] !== null ? (byRound[r] as { total: number }).total ?? 0 : byRound[r] as number ?? 0
                        }));
                        const submissionStack = [
                          { name: 'Accepted', value: submissions.accepted ?? submissions.approved ?? 0, color: '#10b981' },
                          { name: 'Pending', value: submissions.pending ?? 0, color: '#f59e0b' },
                          { name: 'Rejected', value: submissions.rejected ?? 0, color: '#ef4444' },
                        ];

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Submissions (status)</h4>
                              <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={[{
                                      name: 'Submissions',
                                      Accepted: submissionStack[0].value,
                                      Pending: submissionStack[1].value,
                                      Rejected: submissionStack[2].value,
                                    }]}
                                    layout="vertical"
                                  >
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" hide />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Accepted" stackId="a" fill={submissionStack[0].color} />
                                    <Bar dataKey="Pending" stackId="a" fill={submissionStack[1].color} />
                                    <Bar dataKey="Rejected" stackId="a" fill={submissionStack[2].color} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Submissions by round</h4>
                              <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={roundData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                      formatter={(value, name) => [value, 'Submissions']}
                                      labelFormatter={(label) => `Round: ${label}`}
                                    />
                                    <Bar dataKey="value" fill="#7c3aed" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            <div className="md:col-span-2 grid grid-cols-2 gap-4 mt-2">
                              <div className="p-3 border rounded">
                                <div className="text-sm text-gray-500">Participants</div>
                                <div className="text-2xl font-semibold">{payload.participants?.totalCompetitors ?? '-'}</div>
                              </div>
                              <div className="p-3 border rounded">
                                <div className="text-sm text-gray-500">Votes</div>
                                <div className="text-2xl font-semibold">{payload.votes?.total ?? '-'}</div>
                              </div>
                              <div className="p-3 border rounded">
                                <div className="text-sm text-gray-500">Evaluations</div>
                                <div className="text-2xl font-semibold">{payload.evaluations?.total ?? '-'}</div>
                              </div>
                              <div className="p-3 border rounded">
                                <div className="text-sm text-gray-500">Awards</div>
                                <div className="text-2xl font-semibold">{payload.awards?.total ?? '-'} ({payload.awards?.awarded ?? '-'})</div>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
