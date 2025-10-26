"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAllStaffContests } from "@/apis/staff";
import { useQuery } from "@tanstack/react-query";
import {
  IconAward,
  IconCurrencyDollar,
  IconEye,
  IconFilter,
  IconMedal,
  IconPlus,
  IconSearch,
  IconStar,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type AwardType = "GOLD" | "SILVER" | "BRONZE" | "HONORABLE_MENTION" | "SPECIAL";

interface Award {
  id: string;
  contestId: string;
  contestTitle: string;
  winnerName: string;
  winnerEmail: string;
  winnerAge: number;
  awardType: AwardType;
  prizeAmount: string;
  description: string;
  awardedDate: string;
  status: "ANNOUNCED" | "PENDING_ANNOUNCEMENT";
  artworkTitle: string;
  category: string;
}

export default function AwardsManagementPage() {
  // Fetch contests from API
  const { data: contestsResponse, isLoading } = useQuery({
    queryKey: ["staff-contests-for-awards"],
    queryFn: () => getAllStaffContests({}),
    staleTime: 2 * 60 * 1000,
  });

  // Generate awards from contests data
  const generateAwardsFromContests = (): Award[] => {
    if (!contestsResponse?.data) return [];
    
    const awards: Award[] = [];
    
    contestsResponse.data.forEach((contest) => {
      // Generate awards based on numOfAward
      const numOfAwards = Math.min(contest.numOfAward, 3); // Max 3 awards per contest for display
      
      const awardTypes: AwardType[] = ["GOLD", "SILVER", "BRONZE"];
      const prizeAmounts = ["$500", "$300", "$200"];
      
      for (let i = 0; i < numOfAwards; i++) {
        awards.push({
          id: `${contest.contestId}-${i + 1}`,
          contestId: contest.contestId.toString(),
          contestTitle: contest.title,
          winnerName: `Winner ${i + 1}`,
          winnerEmail: `winner${i + 1}@example.com`,
          winnerAge: 12 + i,
          awardType: awardTypes[i] || "SPECIAL",
          prizeAmount: prizeAmounts[i] || "$100",
          description: contest.description,
          awardedDate: contest.endDate,
          status: contest.status === "COMPLETED" ? "ANNOUNCED" : "PENDING_ANNOUNCEMENT",
          artworkTitle: `Artwork ${i + 1}`,
          category: "General",
        });
      }
    });
    
    return awards;
  };

  const awards = generateAwardsFromContests();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContest, setSelectedContest] = useState<string>("ALL");
  const [selectedAwardType, setSelectedAwardType] = useState<AwardType | "ALL">(
    "ALL"
  );

  const awardTypeOptions = [
    "ALL",
    "GOLD",
    "SILVER",
    "BRONZE",
    "HONORABLE_MENTION",
    "SPECIAL",
  ];
  const contestOptions = [
    "ALL",
    ...Array.from(new Set(awards.map((a) => a.contestTitle))),
  ];

  const filteredAwards = awards.filter((award) => {
    const matchesSearch =
      award.winnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      award.contestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      award.artworkTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContest =
      selectedContest === "ALL" || award.contestTitle === selectedContest;
    const matchesAwardType =
      selectedAwardType === "ALL" || award.awardType === selectedAwardType;
    return matchesSearch && matchesContest && matchesAwardType;
  });

  const getAwardTypeBadgeColor = (type: AwardType) => {
    const colors = {
      GOLD: "bg-yellow-100 text-yellow-800 border-yellow-300",
      SILVER: "bg-gray-100 text-gray-800 border-gray-300",
      BRONZE: "bg-orange-100 text-orange-800 border-orange-300",
      HONORABLE_MENTION: "bg-blue-100 text-blue-800 border-blue-300",
      SPECIAL: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colors[type];
  };

  const getAwardTypeIcon = (type: AwardType) => {
    const icons = {
      GOLD: IconTrophy,
      SILVER: IconMedal,
      BRONZE: IconAward,
      HONORABLE_MENTION: IconStar,
      SPECIAL: IconStar,
    };
    return icons[type];
  };

  const getStatusBadgeColor = (status: string) => {
    return status === "ANNOUNCED"
      ? "staff-badge-active"
      : "staff-badge-pending";
  };

  const totalAwards = awards.length;
  const announcedAwards = awards.filter((a) => a.status === "ANNOUNCED").length;
  const totalPrizeMoney = awards.reduce((sum, award) => {
    const amount = parseFloat(award.prizeAmount.replace(/[$,]/g, ""));
    return sum + amount;
  }, 0);
  const uniqueWinners = new Set(awards.map((a) => a.winnerEmail)).size;

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
        <SiteHeader title="Awards Management" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                { label: "Awards" },
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
                    All Awards ({filteredAwards.length})
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    Manage contest prizes and recognize winners
                  </p>
                </div>
                <Link
                  href="/dashboard/staff/contests/awards/announce"
                  className="staff-btn-primary transition-colors flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Announce Results
                </Link>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="staff-card p-4">
                  <div className="flex items-center gap-3">
                    <div className=" bg-yellow-100 p-2">
                      <IconTrophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Total Awards
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">
                        {totalAwards}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="staff-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon p-2">
                      <IconTrophy className="h-5 w-5 " />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Announced
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">
                        {announcedAwards}
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
                        Unique Winners
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">
                        {uniqueWinners}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="staff-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon p-2">
                      <IconCurrencyDollar className="h-5 w-5 " />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Total Prizes
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">
                        ${totalPrizeMoney.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/dashboard/staff/contests/awards/collections"
                  className="staff-card p-4 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="stat-icon p-3 group-hover:bg-blue-200 transition-colors">
                      <IconAward className="h-6 w-6 " />
                    </div>
                    <div>
                      <h3 className="font-semibold staff-text-primary">
                        Award Collections
                      </h3>
                      <p className="text-sm staff-text-secondary">
                        Manage award templates and designs
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/staff/contests/awards/announce"
                  className="staff-card p-4 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="stat-icon p-3 group-hover:bg-green-200 transition-colors">
                      <IconTrophy className="h-6 w-6 " />
                    </div>
                    <div>
                      <h3 className="font-semibold staff-text-primary">
                        Announce Winners
                      </h3>
                      <p className="text-sm staff-text-secondary">
                        Publish contest results and prizes
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="staff-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon p-3">
                      <IconStar className="h-6 w-6 " />
                    </div>
                    <div>
                      <h3 className="font-semibold staff-text-primary">
                        Certificates
                      </h3>
                      <p className="text-sm staff-text-secondary">
                        Generate winner certificates
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by winner name, contest, or artwork..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedContest}
                    onChange={(e) => setSelectedContest(e.target.value)}
                    className="px-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {contestOptions.map((contest) => (
                      <option key={contest} value={contest}>
                        {contest}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedAwardType}
                    onChange={(e) =>
                      setSelectedAwardType(e.target.value as AwardType | "ALL")
                    }
                    className="px-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {awardTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Awards Table */}
              <div className="staff-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Winner & Artwork
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Award
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Contest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Prize
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Date
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
                            colSpan={7}
                            className="px-6 py-12 text-center staff-text-secondary"
                          >
                            Loading awards...
                          </td>
                        </tr>
                      ) : filteredAwards.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-12 text-center staff-text-secondary"
                          >
                            No awards found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredAwards.map((award) => {
                          const AwardIcon = getAwardTypeIcon(award.awardType);
                          return (
                            <tr key={award.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                    {award.winnerName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .slice(0, 2)}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium staff-text-primary">
                                      {award.winnerName}
                                    </div>
                                    <div className="text-sm staff-text-secondary">
                                      &ldquo;{award.artworkTitle}&rdquo;
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      Age {award.winnerAge} • {award.category}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-2  px-3 py-1 text-sm font-semibold border ${getAwardTypeBadgeColor(
                                    award.awardType
                                  )}`}
                                >
                                  <AwardIcon className="h-4 w-4" />
                                  {award.awardType.replace("_", " ")}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm staff-text-primary">
                                  {award.contestTitle}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                {award.prizeAmount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex  px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                    award.status
                                  )}`}
                                >
                                  {award.status.replace("_", " ")}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                {award.awardedDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors mr-2"
                                  title="View Details"
                                >
                                  <IconEye className="h-4 w-4" />
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
