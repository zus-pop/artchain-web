"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Contest, ContestStatus as DashboardContestStatus } from "@/types/dashboard";
import { ContestStatus } from "@/types/contest";
import { ContestDTO } from "@/types/contest-dto";
import { getAllStaffContests } from "@/apis/staff";
import { useQuery } from "@tanstack/react-query";
import { StatsCards } from "@/components/staff/StatsCards";
import Image from "next/image";
import {
  IconCircleCheck,
  IconCircleX,
  IconEdit,
  IconEye,
  IconFilter,
  IconPlus,
  IconSearch,
  IconTrash,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

// Helper function to convert ContestDTO to Contest
const convertContestDTOToContest = (dto: ContestDTO): Contest => {
  return {
    id: dto.contestId.toString(),
    title: dto.title,
    description: dto.description,
    status: dto.status as DashboardContestStatus,
    startDate: new Date(dto.startDate).toLocaleDateString(),
    endDate: new Date(dto.endDate).toLocaleDateString(),
    maxParticipants: 0,
    currentParticipants: 0,
    category: "General",
    prizePool: `$${dto.numOfAward * 100}`,
    examinersCount: 0,
    submissionsCount: 0,
    createdAt: dto.startDate,
    createdBy: dto.createdBy,
    bannerUrl: dto.bannerUrl,
    numOfAward: dto.numOfAward,
    rounds: dto.rounds,
  };
};

export default function ContestsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ContestStatus | "ALL">(
    "ALL"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Fetch contests from API
  const { data: contestsResponse, isLoading, error } = useQuery({
    queryKey: ["staff-contests", selectedStatus, searchQuery],
    queryFn: () =>
      getAllStaffContests({
        status: selectedStatus !== "ALL" ? (selectedStatus as ContestStatus) : undefined,
        search: searchQuery || undefined,
      }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Convert API data to local Contest type
  const contests = contestsResponse?.data.map(convertContestDTOToContest) || [];
  const totalFromAPI = contestsResponse?.meta.total || 0;

  const statusOptions = ["ALL", "DRAFT", "ACTIVE", "COMPLETED", "CANCELLED"];
  const categoryOptions = [
    "ALL",
    "Mixed Media",
    "Digital Art",
    "Traditional",
    "Sculpture",
    "Photography",
  ];

  // Client-side filter for category (since API doesn't support it)
  const filteredContests = contests.filter((contest) => {
    const matchesCategory =
      selectedCategory === "ALL" || contest.category === selectedCategory;
    return matchesCategory;
  });

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
    (sum, c) => sum + (c.rounds?.length || 0),
    0
  );
  const totalAwards = contests.reduce((sum, c) => sum + (c.numOfAward || 0), 0);

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
        <SiteHeader title="Contest Management" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[{ label: "Contest Management" }]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold staff-text-primary">
                    All Contests ({filteredContests.length})
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    Manage art competitions and contests
                  </p>
                </div>
                <Link
                  href="/dashboard/staff/contests/create"
                  className="staff-btn-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Create Contest
                </Link>
              </div>

              {/* Statistics Cards */}
              <StatsCards
                stats={[
                  {
                    title: "Total Contests",
                    value: totalContests,
                    subtitle: "All competitions",
                    icon: <IconTrophy className="h-6 w-6" />,
                    variant: "info",
                  },
                  {
                    title: "Active Contests",
                    value: activeContests,
                    subtitle: "Currently running",
                    icon: <IconCircleCheck className="h-6 w-6" />,
                    variant: "warning",
                  },
                  {
                    title: "Total Rounds",
                    value: totalRounds,
                    subtitle: "All competition rounds",
                    icon: <IconUsers className="h-6 w-6" />,
                    variant: "success",
                  },
                  {
                    title: "Total Awards",
                    value: totalAwards,
                    subtitle: "Prizes to be awarded",
                    icon: <IconTrophy className="h-6 w-6" />,
                    variant: "primary",
                  },
                ]}
              />

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/dashboard/staff/contests/active"
                  className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-200 transition-all duration-300 group"
                >
                  <div className=" bg-gradient-to-br from-green-500 to-emerald-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <IconCircleCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold staff-text-primary">
                      Active Contests
                    </p>
                    <p className="text-xs staff-text-secondary">
                      Currently running
                    </p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/staff/contests/examiners"
                  className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 group"
                >
                  <div className=" bg-gradient-to-br from-blue-500 to-indigo-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <IconUsers className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold staff-text-primary">
                      Manage Examiners
                    </p>
                    <p className="text-xs staff-text-secondary">
                      Invite judges
                    </p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/staff/contests/awards"
                  className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 hover:border-orange-200 transition-all duration-300 group"
                >
                  <div className=" bg-gradient-to-br from-orange-500 to-amber-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <IconTrophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold staff-text-primary">
                      Awards & Results
                    </p>
                    <p className="text-xs staff-text-secondary">
                      Manage prizes
                    </p>
                  </div>
                </Link>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search contests by title, description, or category..."
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
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
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
                          Contest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Awards
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Rounds
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Actions
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
                            Loading contests...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-red-500"
                          >
                            Error loading contests. Please try again.
                          </td>
                        </tr>
                      ) : filteredContests.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center staff-text-secondary"
                          >
                            No contests found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredContests.map((contest) => {
                          const StatusIcon = getStatusIcon(contest.status);
                          const activeRounds = contest.rounds?.filter((r: { status: string }) => r.status === "ACTIVE").length || 0;
                          const totalRoundCount = contest.rounds?.length || 0;
                          
                          return (
                            <tr key={contest.id} className="hover:bg-gray-50">
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
                                  <span className="text-xs">prizes</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                <div>
                                  <div className="font-medium staff-text-primary">
                                    {totalRoundCount} rounds
                                  </div>
                                  <div className="text-xs">
                                    {activeRounds} active
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                <div>
                                  <div className="text-xs">Start: {contest.startDate}</div>
                                  <div className="text-xs">End: {contest.endDate}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  href={`/dashboard/staff/contests/detail?id=${contest.id}`}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors mr-2 inline-block"
                                  title="View Details"
                                >
                                  <IconEye className="h-4 w-4" />
                                </Link>
                                <Link
                                  href={`/dashboard/staff/contests/detail?id=${contest.id}`}
                                  className="staff-text-secondary hover:staff-text-primary p-1 rounded hover:bg-gray-50 transition-colors mr-2 inline-block"
                                  title="Edit Contest"
                                >
                                  <IconEdit className="h-4 w-4" />
                                </Link>
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
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
