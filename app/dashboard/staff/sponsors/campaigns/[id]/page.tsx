"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconFilter,
  IconSearch,
} from "@tabler/icons-react";
import { useState, useEffect, useCallback, use } from "react";
import { getCampaignSponsors } from "@/apis/staff";
import Link from "next/link";

interface Sponsor {
  sponsorId: number;
  name: string;
  logoUrl: string | null;
  contactInfo: string;
  sponsorshipAmount: string;
  status: "PENDING" | "PAID";
  campaignId: number;
}

interface SponsorsResponse {
  data: Sponsor[];
  meta: {
    total: number;
    page: string;
    limit: string;
    totalPages: number;
  };
}

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [sponsorsData, setSponsorsData] = useState<SponsorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"PENDING" | "PAID" | "ALL">("ALL");

  const statusOptions = ["ALL", "PENDING", "PAID"];

  const fetchSponsors = useCallback(async (page = 1, status?: string) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams: { page?: number; limit?: number; status?: "PENDING" | "PAID" } = {
        page,
        limit: pageSize,
      };

      if (status && status !== "ALL") {
        queryParams.status = status as "PENDING" | "PAID";
      }

      const response = await getCampaignSponsors(parseInt(id), queryParams);
      setSponsorsData(response);
    } catch (err) {
      console.error('Error fetching sponsors:', err);
      setError('Failed to load sponsors');
    } finally {
      setLoading(false);
    }
  }, [id, pageSize]);

  useEffect(() => {
    fetchSponsors(currentPage, selectedStatus);
  }, [currentPage, selectedStatus, fetchSponsors]);

  // Filter sponsors based on search query
  const filteredSponsors = sponsorsData?.data.filter((sponsor) =>
    sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sponsor.contactInfo.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
      <StaffSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Campaign Sponsors" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                { label: "Sponsors", href: "/dashboard/staff/sponsors" },
                { label: "Campaigns", href: "/dashboard/staff/sponsors/campaigns" },
                { label: `Campaign ${id} Sponsors` },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard/staff/sponsors/campaigns"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5" />
                    Back to Campaigns
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold staff-text-primary">
                      Campaign {id} Sponsors ({filteredSponsors.length})
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      View and manage sponsors for this campaign
                    </p>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading sponsors...</span>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error loading sponsors
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {error}
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => fetchSponsors(currentPage, selectedStatus)}
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
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by sponsor name or contact info..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <IconFilter className="h-5 w-5 text-gray-400" />
                      <select
                        value={selectedStatus}
                        onChange={(e) =>
                          setSelectedStatus(
                            e.target.value as "PENDING" | "PAID" | "ALL"
                          )
                        }
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
                              Contact Info
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                              Status
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
                                colSpan={5}
                                className="px-6 py-12 text-center staff-text-secondary"
                              >
                                No sponsors found matching your criteria
                              </td>
                            </tr>
                          ) : (
                            filteredSponsors.map((sponsor) => (
                              <tr key={sponsor.sponsorId} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    {sponsor.logoUrl ? (
                                      <img
                                        src={sponsor.logoUrl}
                                        alt={sponsor.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-600">
                                          {sponsor.name.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-sm font-medium staff-text-primary">
                                        {sponsor.name}
                                      </div>
                                      <div className="text-sm staff-text-secondary">
                                        ID: {sponsor.sponsorId}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm staff-text-secondary">
                                  {sponsor.contactInfo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium staff-text-primary">
                                  ${parseFloat(sponsor.sponsorshipAmount).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                      sponsor.status
                                    )}`}
                                  >
                                    {sponsor.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                      title="View Details"
                                    >
                                      <IconSearch className="h-4 w-4" />
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

                  {/* Pagination */}
                  {sponsorsData && sponsorsData.meta.totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm staff-text-secondary">
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sponsorsData.meta.total)} of {sponsorsData.meta.total} sponsors
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        <span className="text-sm staff-text-secondary">
                          Page {currentPage} of {sponsorsData.meta.totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(Math.min(sponsorsData.meta.totalPages, currentPage + 1))}
                          disabled={currentPage === sponsorsData.meta.totalPages}
                          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
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