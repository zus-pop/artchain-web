"use client";

import { useState } from "react";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { StatsCards } from "@/components/staff/StatsCards";
import {
  IconMoneybag,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconBuilding,
  IconSearch,
  IconFilter,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Sponsor, SponsorStatus } from "@/types/dashboard";

export default function SponsorsPage() {
  const [sponsors] = useState<Sponsor[]>([
    {
      id: "1",
      name: "John Smith",
      company: "Art Supplies Co.",
      email: "john@artsupplies.com",
      phone: "+1 (555) 123-4567",
      status: "ACTIVE",
      joinedDate: "2025-01-15",
      totalSponsored: 25000,
      activeCampaigns: 2,
      lastActivity: "2025-10-05",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      company: "Creative Arts Foundation",
      email: "sarah@creativearts.org",
      phone: "+1 (555) 234-5678",
      status: "ACTIVE",
      joinedDate: "2025-03-20",
      totalSponsored: 15000,
      activeCampaigns: 1,
      lastActivity: "2025-10-08",
    },
    {
      id: "3",
      name: "Mike Chen",
      company: "TechArt Solutions",
      email: "mike@techart.com",
      phone: "+1 (555) 345-6789",
      status: "INACTIVE",
      joinedDate: "2025-06-10",
      totalSponsored: 5000,
      activeCampaigns: 0,
      lastActivity: "2025-09-15",
    },
    {
      id: "4",
      name: "Emma Davis",
      company: "Youth Art Initiative",
      email: "emma@youthart.org",
      phone: "+1 (555) 456-7890",
      status: "PENDING",
      joinedDate: "2025-10-01",
      totalSponsored: 0,
      activeCampaigns: 0,
      lastActivity: "2025-10-01",
    },
    {
      id: "5",
      name: "Robert Wilson",
      company: "Art Education Corp",
      email: "robert@arteducation.com",
      phone: "+1 (555) 567-8901",
      status: "ACTIVE",
      joinedDate: "2024-11-05",
      totalSponsored: 35000,
      activeCampaigns: 3,
      lastActivity: "2025-10-07",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<SponsorStatus | "ALL">(
    "ALL"
  );

  const statusOptions: (SponsorStatus | "ALL")[] = [
    "ALL",
    "ACTIVE",
    "INACTIVE",
    "PENDING",
  ];

  const filteredSponsors = sponsors.filter((sponsor) => {
    const matchesSearch =
      sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sponsor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sponsor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || sponsor.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: SponsorStatus) => {
    switch (status) {
      case "ACTIVE":
        return "staff-badge-active";
      case "INACTIVE":
        return "staff-badge-neutral";
      case "PENDING":
        return "staff-badge-pending";
      default:
        return "staff-badge-neutral";
    }
  };

  const totalSponsored = sponsors.reduce(
    (sum, sponsor) => sum + sponsor.totalSponsored,
    0
  );
  const activeSponsors = sponsors.filter((s) => s.status === "ACTIVE").length;
  const totalCampaigns = sponsors.reduce(
    (sum, sponsor) => sum + sponsor.activeCampaigns,
    0
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
        <SiteHeader title="Sponsors Management" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[{ label: "Sponsors Management" }]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold staff-text-primary">
                    All Sponsors ({filteredSponsors.length})
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    Manage sponsorship relationships and track contributions to
                    ArtChain
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
              <StatsCards
                stats={[
                  {
                    title: "Total Sponsored",
                    value: `$${totalSponsored.toLocaleString()}`,
                    subtitle: "All contributions",
                    icon: <IconMoneybag className="h-6 w-6" />,
                    variant: "info",
                  },
                  {
                    title: "Active Sponsors",
                    value: activeSponsors,
                    subtitle: "Currently supporting",
                    icon: <IconBuilding className="h-6 w-6" />,
                    variant: "warning",
                  },
                  {
                    title: "Active Campaigns",
                    value: totalCampaigns,
                    subtitle: "Running programs",
                    icon: <IconTrendingUp className="h-6 w-6" />,
                    variant: "success",
                  },
                  {
                    title: "Avg. per Sponsor",
                    value: `$${
                      activeSponsors > 0
                        ? Math.round(
                            totalSponsored / activeSponsors
                          ).toLocaleString()
                        : 0
                    }`,
                    subtitle: "Average contribution",
                    icon: <IconCalendar className="h-6 w-6" />,
                    variant: "primary",
                  },
                ]}
              />

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/dashboard/staff/sponsors"
                  className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 group"
                >
                  <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <IconBuilding className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold staff-text-primary">
                      All Sponsors
                    </p>
                    <p className="text-xs staff-text-secondary">
                      View and manage
                    </p>
                  </div>
                </a>

                <a
                  href="/dashboard/staff/sponsors/campaigns"
                  className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-200 transition-all duration-300 group"
                >
                  <div className=" bg-linear-to-br from-green-500 to-emerald-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <IconTrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold staff-text-primary">
                      Campaigns
                    </p>
                    <p className="text-xs staff-text-secondary">
                      Manage active
                    </p>
                  </div>
                </a>

                <a
                  href="/dashboard/staff/sponsors/campaigns/create"
                  className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-red-50 hover:to-pink-50 hover:border-red-200 transition-all duration-300 group"
                >
                  <div className=" bg-linear-to-br from-[#d9534f] to-[#e67e73] p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <IconPlus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold staff-text-primary">
                      Create Campaign
                    </p>
                    <p className="text-xs staff-text-secondary">Start new</p>
                  </div>
                </a>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, company, or email..."
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
                      setSelectedStatus(e.target.value as SponsorStatus | "ALL")
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
              </div>

              {/* Sponsors Table */}
              <div className="staff-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Sponsor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Sponsored
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Campaigns
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Last Activity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSponsors.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-12 text-center staff-text-secondary"
                          >
                            No sponsors found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredSponsors.map((sponsor) => (
                          <tr key={sponsor.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                  {sponsor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium staff-text-primary">
                                    {sponsor.name}
                                  </div>
                                  <div className="text-sm staff-text-secondary">
                                    {sponsor.company}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm staff-text-primary">
                                {sponsor.email}
                              </div>
                              <div className="text-sm staff-text-secondary">
                                {sponsor.phone}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex  px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                  sponsor.status
                                )}`}
                              >
                                {sponsor.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                              ${sponsor.totalSponsored.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                              {sponsor.activeCampaigns}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                              {sponsor.lastActivity}
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
