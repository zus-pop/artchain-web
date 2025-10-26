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
import { useState } from "react";

export default function CampaignsPage() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: "1",
      title: "ArtChain Community Fund",
      description: "Supporting emerging artists in the ArtChain community",
      sponsor: "John Smith",
      sponsorCompany: "Art Supplies Co.",
      goalAmount: 50000,
      raisedAmount: 35000,
      status: "ACTIVE",
      startDate: "2025-09-01",
      endDate: "2025-12-31",
      participants: 45,
      category: "Community Support",
      progress: 70,
    },
    {
      id: "2",
      title: "Youth Art Education Initiative",
      description: "Bringing art education to schools across the region",
      sponsor: "Emma Davis",
      sponsorCompany: "Youth Art Initiative",
      goalAmount: 25000,
      raisedAmount: 25000,
      status: "COMPLETED",
      startDate: "2025-06-01",
      endDate: "2025-09-30",
      participants: 28,
      category: "Education",
      progress: 100,
    },
    {
      id: "3",
      title: "Digital Art Innovation Grant",
      description: "Funding innovative digital art projects and research",
      sponsor: "Mike Chen",
      sponsorCompany: "TechArt Solutions",
      goalAmount: 75000,
      raisedAmount: 15000,
      status: "PAUSED",
      startDate: "2025-08-15",
      endDate: "2026-02-15",
      participants: 12,
      category: "Innovation",
      progress: 20,
    },
    {
      id: "4",
      title: "ArtChain Annual Exhibition",
      description: "Annual showcase of the best ArtChain creations",
      sponsor: "Robert Wilson",
      sponsorCompany: "Art Education Corp",
      goalAmount: 100000,
      raisedAmount: 0,
      status: "DRAFT",
      startDate: "2026-03-01",
      endDate: "2026-05-31",
      participants: 0,
      category: "Events",
      progress: 0,
    },
    {
      id: "5",
      title: "Creative Arts Foundation Grant",
      description:
        "Supporting diverse artistic expressions and cultural preservation",
      sponsor: "Sarah Johnson",
      sponsorCompany: "Creative Arts Foundation",
      goalAmount: 40000,
      raisedAmount: 28000,
      status: "ACTIVE",
      startDate: "2025-07-01",
      endDate: "2025-11-30",
      participants: 67,
      category: "Cultural Preservation",
      progress: 70,
    },
  ]);

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

  const filteredCampaigns = campaigns.filter((campaign) => {
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

  const totalRaised = campaigns.reduce(
    (sum, campaign) => sum + campaign.raisedAmount,
    0
  );
  const totalGoal = campaigns.reduce(
    (sum, campaign) => sum + campaign.goalAmount,
    0
  );
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;
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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
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
                <a
                  href="/dashboard/staff/sponsors/campaigns/create"
                  className="staff-btn-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Create Campaign
                </a>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                <div className="staff-card p-4">
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

                <div className="staff-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon p-2">
                      <IconTrendingUp className="h-5 w-5 " />
                    </div>
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Active Campaigns
                      </p>
                      <p className="text-2xl font-bold staff-text-primary">
                        {activeCampaigns}
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
                        {campaigns.reduce((sum, c) => sum + c.participants, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
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
                </a>

                <a
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
                </a>

                <a
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
                </a>
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
                          <tr key={campaign.id} className="hover:bg-gray-50">
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
                                      ${campaign.raisedAmount.toLocaleString()}{" "}
                                      / ${campaign.goalAmount.toLocaleString()}
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
                                      style={{ width: `${campaign.progress}%` }}
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
                                <button
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                  title="View Details"
                                >
                                  <IconEye className="h-4 w-4" />
                                </button>
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
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
