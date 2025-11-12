"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconFilter,
  IconSearch,
  IconEdit,
} from "@tabler/icons-react";
import { useState, use } from "react";
import { getCampaignSponsors } from "@/apis/staff";
import { getCampaign } from "@/apis/campaign";
import { CampaignAPIResponse } from "@/types/campaign";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "PENDING" | "PAID" | "ALL"
  >("ALL");

  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const statusOptions = ["ALL", "PENDING", "PAID"];

  // React Query for campaign data
  const {
    data,
    isLoading: campaignLoading,
    error: campaignError,
    refetch: refetchCampaign,
  } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => getCampaign(id),
    enabled: !!id,
  });
  const campaignData = data?.data;
  // React Query for sponsors data
  const {
    data: sponsorsResponse,
    isLoading: sponsorsLoading,
    error: sponsorsError,
    refetch: refetchSponsors,
  } = useQuery({
    queryKey: ["campaign-sponsors", id, currentPage, selectedStatus],
    queryFn: () => {
      const queryParams: {
        page?: number;
        limit?: number;
        status?: "PENDING" | "PAID";
      } = {
        page: currentPage,
        limit: pageSize,
      };

      if (selectedStatus && selectedStatus !== "ALL") {
        queryParams.status = selectedStatus;
      }

      return getCampaignSponsors(parseInt(id), queryParams);
    },
    enabled: !!id,
  });

  // Filter sponsors based on search query
  const filteredSponsors =
    sponsorsResponse?.data.filter(
      (sponsor: Sponsor) =>
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
        <SiteHeader title={t.campaignSponsors} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: t.campaignsManagement,
                  href: "/dashboard/staff/campaigns",
                },
                {
                  label: `${campaignData?.title || `Campaign ${id}`}`,
                },
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
                    href="/dashboard/staff/campaigns"
                    className="border border-[#e6e2da] p-2 hover:bg-gray-50 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold staff-text-primary">
                      {campaignData?.title || `Campaign ${id}`} | {t.sponsor} (
                      {filteredSponsors.length})
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      {t.viewManageSponsors}
                    </p>
                  </div>
                </div>
                {campaignData && (
                  <Link
                    href={`/dashboard/staff/campaigns/${id}/edit`}
                    className="staff-btn-primary flex items-center gap-2"
                  >
                    <IconEdit className="h-4 w-4" />
                    {t.editCampaignTitle}
                  </Link>
                )}
              </div>

              {/* Campaign Information */}
              <div className="bg-white border border-[#e6e2da] p-6">
                {campaignLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">
                      {t.loadingCampaign}
                    </span>
                  </div>
                ) : campaignError ? (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {t.errorLoadingCampaign}
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          {campaignError.message || t.failedLoadCampaignDetails}
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => refetchCampaign()}
                            className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            {t.tryAgain}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : campaignData ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold staff-text-primary mb-2">
                          {campaignData.title}
                        </h3>
                        <p className="text-sm staff-text-secondary mb-4">
                          {campaignData.description}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {t.goalAmount}
                            </p>
                            <p className="text-lg font-semibold staff-text-primary">
                              {Math.round(
                                parseFloat(campaignData.goalAmount)
                              ).toLocaleString()}{" "}
                              VND
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {t.currentAmount}
                            </p>
                            <p className="text-lg font-semibold text-green-600">
                              {Math.round(
                                parseFloat(campaignData.currentAmount)
                              ).toLocaleString()}{" "}
                              VND
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {t.deadline}
                            </p>
                            <p className="text-sm font-medium staff-text-primary">
                              {new Date(
                                campaignData.deadline
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {t.status}
                            </p>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                campaignData.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800"
                                  : campaignData.status === "COMPLETED"
                                  ? "bg-blue-100 text-blue-800"
                                  : campaignData.status === "CLOSED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {campaignData.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Campaign Image */}
                      {campaignData.image && (
                        <div className="ml-6 shrink-0">
                          <div className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <img
                              src={campaignData.image}
                              alt={campaignData.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{t.progress}</span>
                        <span>
                          {Math.round(
                            (parseFloat(campaignData.currentAmount) /
                              parseFloat(campaignData.goalAmount)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              (parseFloat(campaignData.currentAmount) /
                                parseFloat(campaignData.goalAmount)) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{t.campaignNotFound}</p>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {sponsorsLoading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    {t.loadingSponsors}
                  </span>
                </div>
              )}

              {/* Error State */}
              {sponsorsError && !sponsorsLoading && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {t.errorLoadingSponsors}
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {sponsorsError.message || t.failedLoadSponsors}
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => refetchSponsors()}
                          className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {t.tryAgain}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content */}
              {!sponsorsLoading && !sponsorsError && (
                <>
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t.searchSponsorsPlaceholder}
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
                              {t.sponsor}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                              {t.contactInfo}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                              {t.amount}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                              {t.status}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium staff-text-secondary uppercase tracking-wider">
                              {t.actions}
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
                                {t.noSponsorsFound}
                              </td>
                            </tr>
                          ) : (
                            filteredSponsors.map((sponsor: Sponsor) => (
                              <tr
                                key={sponsor.sponsorId}
                                className="hover:bg-gray-50"
                              >
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
                                        {t.sponsorId} {sponsor.sponsorId}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm staff-text-secondary">
                                  {sponsor.contactInfo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium staff-text-primary">
                                  {Math.round(
                                    parseFloat(sponsor.sponsorshipAmount)
                                  ).toLocaleString()}{" "}
                                  VND
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
                                      title={t.view}
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
                  {sponsorsResponse && sponsorsResponse.meta.totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm staff-text-secondary">
                        {t.showingSponsors} {(currentPage - 1) * pageSize + 1}{" "}
                        {t.to}{" "}
                        {Math.min(
                          currentPage * pageSize,
                          sponsorsResponse.meta.total
                        )}{" "}
                        {t.of} {sponsorsResponse.meta.total} {t.sponsors}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          {t.previous}
                        </button>
                        <span className="text-sm staff-text-secondary">
                          {t.page} {currentPage} {t.of}{" "}
                          {sponsorsResponse.meta.totalPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(
                                sponsorsResponse.meta.totalPages,
                                currentPage + 1
                              )
                            )
                          }
                          disabled={
                            currentPage === sponsorsResponse.meta.totalPages
                          }
                          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          {t.next}
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
