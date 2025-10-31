"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Campaign, CampaignStatus } from "@/types/dashboard";
import {
  IconEdit,
  IconEye,
  IconFilter,
  IconMoneybag,
  IconPlus,
  IconSearch,
  IconTarget,
  IconTrash,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { getStaffCampaigns } from "@/apis/staff";
import Link from "next/link";
import { CampaignsAPIResponse } from "@/types/staff/campaign";

// API Response Types

export default function CampaignsPage() {
  const [campaignsData, setCampaignsData] =
    useState<CampaignsAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatus | "ALL">(
    "ALL"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const statusOptions: (CampaignStatus | "ALL")[] = [
    "ALL",
    "ACTIVE",
    "COMPLETED",
    "PAUSED",
    "DRAFT",
  ];
  const categoryOptions = [
    "ALL",
    "Community Support",
    "Education",
    "Innovation",
    "Events",
    "Cultural Preservation",
  ];

  const fetchCampaigns = async (page = 1, status?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params: {
        page?: number;
        limit?: number;
        status?: "DRAFT" | "ACTIVE" | "CLOSED" | "COMPLETED" | "CANCELLED";
      } = {
        page,
        limit: pageSize,
      };

      if (status && status !== "ALL") {
        // Map frontend status to API status
        const statusMapping: { [key: string]: string } = {
          PAUSED: "CLOSED", // Map PAUSED to CLOSED as per API
        };
        params.status = (statusMapping[status] || status) as
          | "DRAFT"
          | "ACTIVE"
          | "CLOSED"
          | "COMPLETED"
          | "CANCELLED";
      }

      const response = await getStaffCampaigns(params);
      setCampaignsData(response);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(currentPage, selectedStatus);
  }, [currentPage, selectedStatus]);

  // Transform API data to match component expectations
  const transformedCampaigns: Campaign[] =
    campaignsData?.data.map((campaign) => ({
      id: campaign.campaignId.toString(),
      title: campaign.title,
      description: campaign.description,
      sponsor: "Staff", // API doesn't provide sponsor info
      sponsorCompany: "ArtChain", // Default value
      goalAmount: parseFloat(campaign.goalAmount),
      raisedAmount: parseFloat(campaign.currentAmount),
      status:
        campaign.status === "CLOSED"
          ? "PAUSED"
          : (campaign.status as CampaignStatus), // Map back to frontend status
      startDate: new Date(campaign.createdAt).toISOString().split("T")[0],
      endDate: new Date(campaign.deadline).toISOString().split("T")[0],
      participants: 0, // API doesn't provide participant count
      category: "General", // Default category
      progress:
        campaign.goalAmount !== "0.00"
          ? Math.round(
              (parseFloat(campaign.currentAmount) /
                parseFloat(campaign.goalAmount)) *
                100
            )
          : 0,
    })) || [];

  const filteredCampaigns = transformedCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.sponsor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.sponsorCompany.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || campaign.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "ALL" || campaign.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadgeColor = (status: CampaignStatus) => {
    switch (status) {
      case "ACTIVE":
        return "staff-badge-active";
      case "COMPLETED":
        return "staff-badge-active";
      case "PAUSED":
        return "staff-badge-pending";
      case "DRAFT":
        return "staff-badge-neutral";
      default:
        return "staff-badge-neutral";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-blue-500";
    if (progress >= 70) return "bg-green-500";
    if (progress >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const totalRaised = transformedCampaigns.reduce(
    (sum: number, campaign) => sum + campaign.raisedAmount,
    0
  );
  const totalGoal = transformedCampaigns.reduce(
    (sum: number, campaign) => sum + campaign.goalAmount,
    0
  );
  const activeCampaigns = transformedCampaigns.filter(
    (c) => c.status === "ACTIVE"
  ).length;
  //   const _completedCampaigns = campaigns.filter(
  //     (c) => c.status === "COMPLETED"
  //   ).length;

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
              items={[
                { label: "Sponsors", href: "/dashboard/staff/sponsors" },
                { label: "Campaigns" },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    Loading campaigns...
                  </span>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error loading campaigns
                      </h3>
                      <div className="mt-2 text-sm text-red-700">{error}</div>
                      <div className="mt-4">
                        <button
                          onClick={() =>
                            fetchCampaigns(currentPage, selectedStatus)
                          }
                          className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content */}
              {!loading && !error && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold staff-text-primary">
                        Sponsorship Campaigns ({filteredCampaigns.length})
                      </h2>
                      <p className="text-sm staff-text-secondary mt-1">
                        Manage and track all sponsorship campaigns and their
                        progress
                      </p>
                    </div>
                    <Link
                      href="/dashboard/staff/sponsors/campaigns/create"
                      className="staff-btn-primary transition-colors duration-200 flex items-center gap-2"
                    >
                      <IconPlus className="h-4 w-4" />
                      Create Campaign
                    </Link>
                  </div>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Card 1: Total Raised (Chiếm 1 cột) */}
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
                            ${totalRaised.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Campaign Goal (Chiếm 2 cột - Dài hơn) */}
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
                            ${totalGoal.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Total Participants (Chiếm 1 cột) */}
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
                            {transformedCampaigns.reduce(
                              (sum: number, c) => sum + c.participants,
                              0
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      href="/dashboard/staff/sponsors"
                      className="staff-card p-4 hover:shadow-md transition-shadow duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="stat-icon p-3 group-hover:bg-blue-200 transition-colors">
                          <IconMoneybag className="h-6 w-6 " />
                        </div>
                        <div>
                          <h3 className="font-semibold staff-text-primary">
                            All Sponsors
                          </h3>
                          <p className="text-sm staff-text-secondary">
                            View and manage all sponsors
                          </p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/dashboard/staff/sponsors/campaigns"
                      className="staff-card p-4 hover:shadow-md transition-shadow duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="stat-icon p-3 group-hover:bg-green-200 transition-colors">
                          <IconTrendingUp className="h-6 w-6 " />
                        </div>
                        <div>
                          <h3 className="font-semibold staff-text-primary">
                            Sponsorship Campaigns
                          </h3>
                          <p className="text-sm staff-text-secondary">
                            Manage active sponsorship campaigns
                          </p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/dashboard/staff/sponsors/campaigns/create"
                      className="staff-card p-4 hover:shadow-md transition-shadow duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="stat-icon p-3 group-hover:bg-purple-200 transition-colors">
                          <IconPlus className="h-6 w-6 " />
                        </div>
                        <div>
                          <h3 className="font-semibold staff-text-primary">
                            Create Campaign
                          </h3>
                          <p className="text-sm staff-text-secondary">
                            Start a new sponsorship campaign
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by title, description, or sponsor..."
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
                          setSelectedStatus(
                            e.target.value as CampaignStatus | "ALL"
                          )
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
                      <IconTarget className="h-5 w-5 text-gray-400" />
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

                  {/* Campaigns Table */}
                  <div className="staff-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                              Campaign
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                              Sponsor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                              Progress
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                              Participants
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
                          {filteredCampaigns.length === 0 ? (
                            <tr>
                              <td
                                colSpan={7}
                                className="px-6 py-12 text-center staff-text-secondary"
                              >
                                No campaigns found matching your criteria
                              </td>
                            </tr>
                          ) : (
                            filteredCampaigns.map((campaign) => (
                              <tr
                                key={campaign.id}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-6 py-4">
                                  <div>
                                    <div className="text-sm font-medium staff-text-primary">
                                      {campaign.title}
                                    </div>
                                    <div className="text-sm staff-text-secondary line-clamp-2">
                                      {campaign.description}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                      {campaign.category}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium staff-text-primary">
                                    {campaign.sponsor}
                                  </div>
                                  <div className="text-sm staff-text-secondary">
                                    {campaign.sponsorCompany}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="staff-text-secondary">
                                          $
                                          {campaign.raisedAmount.toLocaleString()}{" "}
                                          / $
                                          {campaign.goalAmount.toLocaleString()}
                                        </span>
                                        <span className="staff-text-primary font-medium">
                                          {campaign.progress}%
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                                            campaign.progress
                                          )}`}
                                          style={{
                                            width: `${campaign.progress}%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex  px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                      campaign.status
                                    )}`}
                                  >
                                    {campaign.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                  {campaign.participants}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                  <div>
                                    <div>Start: {campaign.startDate}</div>
                                    <div>End: {campaign.endDate}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end gap-2">
                                    <Link
                                      href={`/dashboard/staff/sponsors/campaigns/${campaign.id}`}
                                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                      title="View Sponsors"
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
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
