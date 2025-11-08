"use client";

import { getStaffCampaigns } from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { formatCurrency } from "@/lib/utils";
import { CampaignStatus } from "@/types/dashboard";
import { CampaignAPIResponse } from "@/types/staff/campaign";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEdit,
  IconEye,
  IconFilter,
  IconMoneybag,
  IconPlus,
  IconTarget,
  IconTrash,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

// API Response Types

export default function CampaignsPage() {
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatus | "ALL">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const statusOptions: (CampaignStatus | "ALL")[] = [
    "ALL",
    "ACTIVE",
    "COMPLETED",
    "PAUSED",
    "DRAFT",
  ];

  // Fetch campaigns using React Query
  const {
    data: campaignsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["staff-campaigns", selectedStatus, currentPage, pageSize],
    queryFn: () =>
      getStaffCampaigns({
        page: currentPage,
        limit: pageSize,
        ...(selectedStatus !== "ALL" && {
          status: selectedStatus === "PAUSED" ? "CLOSED" : selectedStatus,
        }),
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const campaigns = campaignsResponse?.data || [];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "staff-badge-active";
      case "COMPLETED":
        return "staff-badge-active";
      case "CLOSED":
      case "PAUSED":
        return "staff-badge-pending";
      case "DRAFT":
        return "staff-badge-neutral";
      case "CANCELLED":
        return "staff-badge-rejected";
      default:
        return "staff-badge-neutral";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-red-500"; // Completed - use primary red
    if (progress >= 70) return "bg-green-500"; // Good progress - green
    if (progress >= 30) return "bg-yellow-500"; // Moderate progress - yellow
    return "bg-red-300"; // Low progress - light red
  };

  // Calculate statistics
  const totalRaised = campaigns.reduce(
    (sum: number, campaign: CampaignAPIResponse) =>
      sum + parseFloat(campaign.currentAmount || "0"),
    0
  );
  const totalGoal = campaigns.reduce(
    (sum: number, campaign: CampaignAPIResponse) =>
      sum + parseFloat(campaign.goalAmount || "0"),
    0
  );
  const activeCampaigns = campaigns.filter(
    (campaign: CampaignAPIResponse) => campaign.status === "ACTIVE"
  ).length;

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
        <SiteHeader title="Sponsorship Campaigns" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[{ label: "Campaigns" }]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error loading campaigns
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {error.message || "Failed to load campaigns"}
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => refetch()}
                          className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content - Always Visible */}
              {!error && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold staff-text-primary">
                        Sponsorship Campaigns (
                        {campaignsResponse?.meta?.total || campaigns.length})
                      </h2>
                      <p className="text-sm staff-text-secondary mt-1">
                        Manage and track all sponsorship campaigns and their
                        progress
                      </p>
                    </div>
                    <Link
                      href="/dashboard/staff/campaigns/create"
                      className="staff-btn-primary transition-colors duration-200 flex items-center gap-2"
                    >
                      <IconPlus className="h-4 w-4" />
                      Create Campaign
                    </Link>
                  </div>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Card 1: Total Raised */}
                    <div className="staff-card p-4">
                      <div className="flex items-center gap-3">
                        <div className="stat-icon p-2">
                          <IconMoneybag className="h-5 w-5 " />
                        </div>
                        <div>
                          <p className="text-sm font-medium staff-text-secondary">
                            Total Raised
                          </p>
                          <p className="text-2xl font-bold staff-text-primary">
                            {formatCurrency(totalRaised)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Campaign Goal */}
                    <div className="staff-card p-4 md:col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="stat-icon p-2">
                          <IconTarget className="h-5 w-5 " />
                        </div>
                        <div>
                          <p className="text-sm font-medium staff-text-secondary">
                            Campaign Goal
                          </p>
                          <p className="text-2xl font-bold staff-text-primary">
                            {formatCurrency(totalGoal)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Active Campaigns */}
                    <div className="staff-card p-4">
                      <div className="flex items-center gap-3">
                        <div className="stat-icon p-2">
                          <IconTrendingUp className="h-5 w-5 " />
                        </div>
                        <div>
                          <p className="text-sm font-medium staff-text-secondary">
                            Active
                          </p>
                          <p className="text-2xl font-bold staff-text-primary">
                            {activeCampaigns}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <IconFilter className="h-5 w-5 text-gray-400" />
                      <select
                        value={selectedStatus}
                        onChange={(e) => {
                          setSelectedStatus(
                            e.target.value as CampaignStatus | "ALL"
                          );
                          setCurrentPage(1); // Reset to first page when changing status filter
                        }}
                        className="px-4 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Campaigns Table - Loading State */}
                  {isLoading ? (
                    <div className="staff-card p-12">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">
                          Loading campaigns...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="staff-card overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                                  Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                                  Campaign
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                                  Progress
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                                  Deadline
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium staff-text-secondary uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {campaigns.length === 0 ? (
                                <tr>
                                  <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center staff-text-secondary"
                                  >
                                    No campaigns found
                                  </td>
                                </tr>
                              ) : (
                                campaigns.map(
                                  (campaign: CampaignAPIResponse) => {
                                    const currentAmount = parseFloat(
                                      campaign.currentAmount || "0"
                                    );
                                    const goalAmount = parseFloat(
                                      campaign.goalAmount || "0"
                                    );
                                    const progress =
                                      goalAmount > 0
                                        ? (currentAmount / goalAmount) * 100
                                        : 0;

                                    return (
                                      <tr
                                        key={campaign.campaignId}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            {campaign.image ? (
                                              <img
                                                src={campaign.image}
                                                alt={campaign.title}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                No Image
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4">
                                          <div>
                                            <div className="text-sm font-medium staff-text-primary">
                                              {campaign.title}
                                            </div>
                                            <div className="text-sm staff-text-secondary line-clamp-2">
                                              {campaign.description}
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="staff-text-secondary">
                                                  {formatCurrency(
                                                    currentAmount
                                                  )}{" "}
                                                  / {formatCurrency(goalAmount)}
                                                </span>
                                              </div>
                                              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                                <div
                                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                                                    progress
                                                  )}`}
                                                  style={{
                                                    width: `${Math.min(
                                                      progress,
                                                      100
                                                    )}%`,
                                                  }}
                                                ></div>
                                              </div>
                                              <div className="text-xs text-center staff-text-primary font-medium">
                                                {Math.min(
                                                  progress,
                                                  100
                                                ).toFixed(1)}
                                                %
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                              campaign.status
                                            )}`}
                                          >
                                            {campaign.status}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                          <div>
                                            <div>
                                              Deadline:{" "}
                                              {new Date(
                                                campaign.deadline
                                              ).toLocaleDateString()}
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                          <div className="flex items-center justify-end gap-2">
                                            <Link
                                              href={`/dashboard/staff/campaigns/${campaign.campaignId}`}
                                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                              title="View Details"
                                            >
                                              <IconEye className="h-4 w-4" />
                                            </Link>
                                            <button
                                              className="staff-text-secondary hover:staff-text-primary p-1 rounded hover:bg-gray-50 transition-colors"
                                              title="Edit"
                                            >
                                              <IconEdit className="h-4 w-4" />
                                            </button>
                                            <button
                                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                              title="Delete"
                                            >
                                              <IconTrash className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Pagination */}
                      {campaignsResponse?.meta && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm staff-text-secondary">
                                Show per page:
                              </span>
                              <select
                                value={pageSize}
                                onChange={(e) => {
                                  setPageSize(Number(e.target.value));
                                  setCurrentPage(1); // Reset to first page when changing page size
                                }}
                                className="px-2 py-1 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                              </select>
                            </div>
                            <div className="text-sm staff-text-secondary">
                              Showing{" "}
                              {campaigns.length > 0
                                ? (currentPage - 1) * pageSize + 1
                                : 0}{" "}
                              to{" "}
                              {Math.min(
                                currentPage * pageSize,
                                campaignsResponse.meta.total
                              )}{" "}
                              of {campaignsResponse.meta.total} campaigns
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                              className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="First page"
                            >
                              <IconChevronsLeft className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              disabled={currentPage === 1}
                              className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Previous page"
                            >
                              <IconChevronLeft className="h-4 w-4" />
                            </button>

                            <span className="px-3 py-1 text-sm staff-text-primary">
                              Page {currentPage} of{" "}
                              {campaignsResponse.meta.totalPages}
                            </span>

                            <button
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(
                                    campaignsResponse.meta.totalPages,
                                    prev + 1
                                  )
                                )
                              }
                              disabled={
                                currentPage ===
                                campaignsResponse.meta.totalPages
                              }
                              className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Next page"
                            >
                              <IconChevronRight className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                setCurrentPage(
                                  campaignsResponse.meta.totalPages
                                )
                              }
                              disabled={
                                currentPage ===
                                campaignsResponse.meta.totalPages
                              }
                              className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Last page"
                            >
                              <IconChevronsRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
