"use client";

import { useState } from "react";
import Link from "next/link";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { Contest, ContestStatus } from "@/types/dashboard";
import {
  IconTrophy,
  IconSearch,
  IconFilter,
  IconEye,
  IconPlus,
  IconCalendar,
  IconUsers,
  IconClock,
  IconCircleCheck,
  IconCircleX,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

export default function ContestsManagementPage() {
  const [contests] = useState<Contest[]>([
    {
      id: "1",
      title: "Young Artists Spring Showcase",
      description: "A celebration of creativity for young artists aged 8-16",
      status: "ACTIVE",
      startDate: "2025-10-01",
      endDate: "2025-11-30",
      maxParticipants: 100,
      currentParticipants: 67,
      category: "Mixed Media",
      prizePool: "$2,500",
      examinersCount: 3,
      submissionsCount: 45,
      createdAt: "2025-09-15",
      createdBy: "Sarah Johnson",
    },
    {
      id: "2",
      title: "Digital Art Competition 2025",
      description:
        "Showcase your digital art skills in this modern competition",
      status: "ACTIVE",
      startDate: "2025-09-15",
      endDate: "2025-12-15",
      maxParticipants: 75,
      currentParticipants: 52,
      category: "Digital Art",
      prizePool: "$3,000",
      examinersCount: 4,
      submissionsCount: 38,
      createdAt: "2025-08-20",
      createdBy: "Mike Chen",
    },
    {
      id: "3",
      title: "Traditional Painting Masters",
      description:
        "For aspiring artists who love traditional painting techniques",
      status: "COMPLETED",
      startDate: "2025-07-01",
      endDate: "2025-09-30",
      maxParticipants: 50,
      currentParticipants: 42,
      category: "Traditional",
      prizePool: "$1,800",
      examinersCount: 2,
      submissionsCount: 35,
      createdAt: "2025-06-10",
      createdBy: "Emma Davis",
    },
    {
      id: "4",
      title: "Sculpture & 3D Art Challenge",
      description: "Explore the world of three-dimensional art",
      status: "DRAFT",
      startDate: "2025-11-15",
      endDate: "2026-01-15",
      maxParticipants: 30,
      currentParticipants: 0,
      category: "Sculpture",
      prizePool: "$2,200",
      examinersCount: 0,
      submissionsCount: 0,
      createdAt: "2025-10-01",
      createdBy: "David Wilson",
    },
    {
      id: "5",
      title: "Photography Contest: Nature's Beauty",
      description: "Capture the beauty of nature through your lens",
      status: "ACTIVE",
      startDate: "2025-08-20",
      endDate: "2025-10-20",
      maxParticipants: 80,
      currentParticipants: 71,
      category: "Photography",
      prizePool: "$2,800",
      examinersCount: 3,
      submissionsCount: 58,
      createdAt: "2025-07-25",
      createdBy: "Lisa Brown",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ContestStatus | "ALL">(
    "ALL"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const statusOptions = ["ALL", "DRAFT", "ACTIVE", "COMPLETED", "CANCELLED"];
  const categoryOptions = [
    "ALL",
    "Mixed Media",
    "Digital Art",
    "Traditional",
    "Sculpture",
    "Photography",
  ];

  const filteredContests = contests.filter((contest) => {
    const matchesSearch =
      contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || contest.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "ALL" || contest.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadgeColor = (status: ContestStatus) => {
    const colors = {
      DRAFT: "bg-gray-100 text-gray-800",
      ACTIVE: "bg-green-100 text-green-800",
      COMPLETED: "bg-blue-100 text-blue-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  const getStatusIcon = (status: ContestStatus) => {
    const icons = {
      DRAFT: IconEdit,
      ACTIVE: IconCircleCheck,
      COMPLETED: IconTrophy,
      CANCELLED: IconCircleX,
    };
    return icons[status];
  };

  const totalContests = contests.length;
  const activeContests = contests.filter((c) => c.status === "ACTIVE").length;
  const totalParticipants = contests.reduce(
    (sum, c) => sum + c.currentParticipants,
    0
  );
  const totalPrizePool = contests.reduce((sum, c) => {
    const amount = parseFloat(c.prizePool.replace(/[$,]/g, ""));
    return sum + amount;
  }, 0);

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
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
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
                  <h2 className="text-2xl font-bold text-gray-900">
                    All Contests ({filteredContests.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage art competitions and contests
                  </p>
                </div>
                <Link
                  href="/dashboard/staff/contests/create"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Create Contest
                </Link>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <IconTrophy className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Contests
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalContests}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2">
                      <IconCircleCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Contests
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {activeContests}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <IconUsers className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Participants
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalParticipants}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-yellow-100 p-2">
                      <IconTrophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Prize Pool
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${totalPrizePool.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/dashboard/staff/contests/active"
                  className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-3 group-hover:bg-green-200 transition-colors">
                      <IconCircleCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Active Contests
                      </h3>
                      <p className="text-sm text-gray-600">
                        View currently running competitions
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/staff/contests/examiners"
                  className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-3 group-hover:bg-blue-200 transition-colors">
                      <IconUsers className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Manage Examiners
                      </h3>
                      <p className="text-sm text-gray-600">
                        Invite and manage contest judges
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/staff/contests/awards"
                  className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-yellow-100 p-3 group-hover:bg-yellow-200 transition-colors">
                      <IconTrophy className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Awards & Results
                      </h3>
                      <p className="text-sm text-gray-600">
                        Manage prizes and announce winners
                      </p>
                    </div>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as ContestStatus | "ALL")
                    }
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submissions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prize Pool
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredContests.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No contests found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredContests.map((contest) => {
                          const StatusIcon = getStatusIcon(contest.status);
                          return (
                            <tr key={contest.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {contest.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {contest.category}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    by {contest.createdBy}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                    contest.status
                                  )}`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {contest.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {contest.currentParticipants}/
                                    {contest.maxParticipants}
                                  </div>
                                  <div className="text-xs">
                                    {Math.round(
                                      (contest.currentParticipants /
                                        contest.maxParticipants) *
                                        100
                                    )}
                                    % filled
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {contest.submissionsCount}
                                  </div>
                                  <div className="text-xs">
                                    {contest.examinersCount} examiners
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {contest.prizePool}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>
                                  <div>Start: {contest.startDate}</div>
                                  <div>End: {contest.endDate}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors mr-2"
                                  title="View Details"
                                >
                                  <IconEye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors mr-2"
                                  title="Edit Contest"
                                >
                                  <IconEdit className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                  title="Delete Contest"
                                >
                                  <IconTrash className="h-4 w-4" />
                                </button>
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
