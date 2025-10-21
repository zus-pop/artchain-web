"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconClock,
  IconEye,
  IconFileText,
  IconSearch,
  IconTrendingUp,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

interface ActiveContest {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  currentParticipants: number;
  maxParticipants: number;
  submissionsReceived: number;
  daysRemaining: number;
  progressPercentage: number;
  examinersCount: number;
  prizePool: string;
}

export default function ActiveContestsPage() {
  const [activeContests] = useState<ActiveContest[]>([
    {
      id: "1",
      title: "Young Artists Spring Showcase",
      category: "Mixed Media",
      startDate: "2025-10-01",
      endDate: "2025-11-30",
      currentParticipants: 67,
      maxParticipants: 100,
      submissionsReceived: 45,
      daysRemaining: 45,
      progressPercentage: 67,
      examinersCount: 3,
      prizePool: "$2,500",
    },
    {
      id: "2",
      title: "Digital Art Competition 2025",
      category: "Digital Art",
      startDate: "2025-09-15",
      endDate: "2025-12-15",
      currentParticipants: 52,
      maxParticipants: 75,
      submissionsReceived: 38,
      daysRemaining: 75,
      progressPercentage: 69,
      examinersCount: 4,
      prizePool: "$3,000",
    },
    {
      id: "5",
      title: "Photography Contest: Nature's Beauty",
      category: "Photography",
      startDate: "2025-08-20",
      endDate: "2025-10-20",
      currentParticipants: 71,
      maxParticipants: 80,
      submissionsReceived: 58,
      daysRemaining: 15,
      progressPercentage: 89,
      examinersCount: 3,
      prizePool: "$2,800",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredContests = activeContests.filter(
    (contest) =>
      contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalActiveContests = activeContests.length;
  const totalParticipants = activeContests.reduce(
    (sum, c) => sum + c.currentParticipants,
    0
  );
  const totalSubmissions = activeContests.reduce(
    (sum, c) => sum + c.submissionsReceived,
    0
  );
  const averageProgress = Math.round(
    activeContests.reduce((sum, c) => sum + c.progressPercentage, 0) /
      activeContests.length
  );

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
        <SiteHeader title="Active Contests" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                { label: "Active Contests" },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold staff-text-primary">
                    Active Contests ({filteredContests.length})
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    Monitor ongoing art competitions and their progress
                  </p>
                </div>
                <Link
                  href="/dashboard/staff/contests"
                  className="staff-btn-primary transition-colors"
                >
                  View All Contests
                </Link>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="staff-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon p-2">
                      <IconTrophy className="h-5 w-5 " />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Active Contests
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">
                        {totalActiveContests}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="staff-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon p-2">
                      <IconUsers className="h-5 w-5 " />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Total Participants
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">
                        {totalParticipants}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="staff-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon p-2">
                      <IconFileText className="h-5 w-5 " />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Submissions Received
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">
                        {totalSubmissions}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="staff-card p-4">
                  <div className="flex items-center gap-3">
                    <div className=" bg-yellow-100 p-2">
                      <IconTrendingUp className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Avg. Progress
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">
                        {averageProgress}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search active contests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Active Contests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContests.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <IconTrophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium staff-text-primary mb-2">
                      No active contests found
                    </h3>
                    <p className="staff-text-secondary">
                      There are currently no active contests matching your
                      search.
                    </p>
                  </div>
                ) : (
                  filteredContests.map((contest) => (
                    <div
                      key={contest.id}
                      className="staff-card p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Contest Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold staff-text-primary mb-1">
                            {contest.title}
                          </h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {contest.category}
                          </span>
                        </div>
                        <button className="text-gray-400 hover:staff-text-secondary p-1">
                          <IconEye className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm staff-text-secondary mb-1">
                          <span>Participants</span>
                          <span>
                            {contest.currentParticipants}/
                            {contest.maxParticipants}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${contest.progressPercentage}%` }}
                          />
                        </div>
                        <div className="text-xs staff-text-secondary mt-1">
                          {contest.progressPercentage}% capacity filled
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold staff-text-primary">
                            {contest.submissionsReceived}
                          </div>
                          <div className="text-xs staff-text-secondary">
                            Submissions
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold staff-text-primary">
                            {contest.examinersCount}
                          </div>
                          <div className="text-xs staff-text-secondary">Examiners</div>
                        </div>
                      </div>

                      {/* Prize Pool */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm staff-text-secondary">
                          Prize Pool
                        </span>
                        <span className="font-semibold text-green-600">
                          {contest.prizePool}
                        </span>
                      </div>

                      {/* Time Remaining */}
                      <div className="flex items-center gap-2 mb-4">
                        <IconClock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm staff-text-secondary">
                          {contest.daysRemaining} days remaining
                        </span>
                      </div>

                      {/* Dates */}
                      <div className="text-xs staff-text-secondary border-t border-gray-100 pt-3">
                        <div className="flex justify-between">
                          <span>Started: {contest.startDate}</span>
                          <span>Ends: {contest.endDate}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 staff-btn-primary transition-colors">
                          View Details
                        </button>
                        <button className="flex-1 border border-[#e6e2da] text-gray-700 px-3 py-2  text-sm font-medium hover:bg-gray-50 transition-colors">
                          Manage
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
