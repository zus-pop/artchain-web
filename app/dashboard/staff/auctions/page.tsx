"use client";

import { useGetAuctions, useEndAuction } from "@/apis/auction";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { StatsCards } from "@/components/staff/StatsCards";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Auction, AuctionStatus } from "@/types/auction";
import {
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconEye,
  IconFilter,
  IconHammer,
  IconPlus,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";

export default function AuctionsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<AuctionStatus | "ALL">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // Fetch auctions from API
  const {
    data: auctions = [],
    isLoading,
    error,
  } = useGetAuctions();

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "primary" | "destructive" | "warning";
  }>({
    isOpen: false,
    title: t.endAuction,
    description: t.confirmEndAuction,
    onConfirm: () => {},
    variant: "destructive",
  });

  const endAuctionMutation = useEndAuction();

  const handleEndAuction = async (auctionId: string | number) => {
    setConfirmConfig((prev) => ({
      ...prev,
      isOpen: true,
      onConfirm: async () => {
        try {
          await endAuctionMutation.mutateAsync(String(auctionId));
        } catch (error) {
          console.error("Failed to end auction:", error);
        }
      },
    }));
  };

  // Client-side filtering and search
  const filteredAuctions = auctions.filter((auction: Auction) => {
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (auction.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "ALL" || auction.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalEntries = filteredAuctions.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedAuctions = filteredAuctions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statusOptions: (AuctionStatus | "ALL")[] = [
    "ALL",
    "DRAFT",
    "PENDING",
    "UPCOMING",
    "ACTIVE",
    "ONGOING",
    "LIVE",
    "ENDED",
    "END",
    "CANCELLED",
  ];

  const getStatusBadgeColor = (status: AuctionStatus) => {
    switch (status) {
      case "DRAFT":
        return "staff-badge-neutral";
      case "PENDING":
        return "staff-badge-neutral";
      case "UPCOMING":
        return "staff-badge-pending";
      case "ACTIVE":
      case "ONGOING":
      case "LIVE":
        return "staff-badge-active";
      case "ENDED":
      case "END":
        return "staff-badge-approved";
      case "CANCELLED":
        return "staff-badge-rejected";
      default:
        return "staff-badge-neutral";
    }
  };

  const getStatusIcon = (status: AuctionStatus) => {
    switch (status) {
      case "PENDING":
        return IconClock;
      case "UPCOMING":
        return IconClock;
      case "ACTIVE":
      case "ONGOING":
      case "LIVE":
        return IconHammer;
      case "ENDED":
      case "END":
        return IconCircleCheck;
      case "CANCELLED":
        return IconCircleX;
      default:
        return IconClock;
    }
  };

  const activeAuctionsCount = auctions.filter((a: Auction) => ["ACTIVE", "ONGOING", "LIVE"].includes(a.status)).length;
  const upcomingAuctionsCount = auctions.filter((a: Auction) => a.status === "UPCOMING").length;
  const endedAuctionsCount = auctions.filter((a: Auction) => ["ENDED", "END"].includes(a.status)).length;
  const pendingAuctionsCount = auctions.filter((a: Auction) => a.status === "DRAFT").length;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchQuery]);

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
        <SiteHeader title={t.auctionManagement} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[{ label: t.auctionManagement }]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold staff-heading">
                    {t.allAuctions} ({totalEntries})
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    {t.manageArtCompetitions} {/* Fallback translation */}
                  </p>
                </div>
                <Link
                  href="/dashboard/staff/auctions/create"
                  className="staff-btn-primary flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  {t.createAuction}
                </Link>
              </div>

              {/* Statistics Cards */}
              <StatsCards
                stats={[
                  {
                    title: t.totalAuctions,
                    value: auctions.length,
                    subtitle: t.allAuctions,
                    icon: <IconHammer className="h-6 w-6" />,
                    variant: "info",
                  },
                  {
                    title: t.pendingAuctions,
                    value: pendingAuctionsCount,
                    subtitle: t.pending,
                    icon: <IconClock className="h-6 w-6" />,
                    variant: "warning",
                  },
                  {
                    title: t.upcomingAuctions,
                    value: upcomingAuctionsCount,
                    subtitle: t.upcoming,
                    icon: <IconClock className="h-6 w-6" />,
                    variant: "purple",
                  },
                  {
                    title: t.activeAuctions,
                    value: activeAuctionsCount,
                    subtitle: t.currentlyRunning,
                    icon: <IconCircleCheck className="h-6 w-6" />,
                    variant: "success",
                  },
                  {
                    title: t.completedAuctions,
                    value: endedAuctionsCount,
                    subtitle: t.ended,
                    icon: <IconCircleCheck className="h-6 w-6" />,
                    variant: "destructive",
                  },
                ]}
              />

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t.searchAuctionsPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as AuctionStatus | "ALL")
                    }
                    className="px-4 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status === "ALL" ? t.allStatus : status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Auctions Table */}
              <div className="staff-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#f8f6f0]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold staff-text-secondary uppercase tracking-wider">
                          {t.auctionTitle}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold staff-text-secondary uppercase tracking-wider">
                          {t.auctionStatus}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold staff-text-secondary uppercase tracking-wider">
                          {t.paintings}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold staff-text-secondary uppercase tracking-wider">
                          {t.datesTable}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold staff-text-secondary uppercase tracking-wider">
                          {t.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center staff-text-secondary">
                            {t.loadingAdmin}
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                            {t.errorLoadingContests}
                          </td>
                        </tr>
                      ) : paginatedAuctions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center staff-text-secondary">
                            {t.noDataAvailable}
                          </td>
                        </tr>
                      ) : (
                        paginatedAuctions.map((auction: Auction) => {
                          const StatusIcon = getStatusIcon(auction.status);
                          return (
                            <tr key={auction.auctionId} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4">
                                <div className="text-sm font-bold staff-text-primary">
                                  {auction.title}
                                </div>
                                <div className="text-xs staff-text-secondary mt-1 max-w-xs truncate">
                                  {auction.description}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase font-black tracking-wider ${getStatusBadgeColor(auction.status)}`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {auction.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold staff-text-primary">
                                    {auction.auctionPaintings?.length || 0}
                                  </span>
                                  <span className="text-xs uppercase font-semibold text-gray-400">
                                    {t.paintingsText}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs staff-text-secondary">
                                <div>
                                  <div className="font-medium text-blue-600">
                                    {t.startText}: {new Date(auction.startTime).toLocaleString()}
                                  </div>
                                  <div className="font-medium text-red-500">
                                    {t.endText}: {new Date(auction.endTime).toLocaleString()}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  href={`/dashboard/staff/auctions/detail?id=${auction.auctionId}`}
                                  className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-all inline-block mr-2"
                                  title={t.viewDetails}
                                >
                                  <IconEye className="h-5 w-5" />
                                </Link>
                                {auction.status === "ONGOING" && (
                                  <button
                                    onClick={() => handleEndAuction(auction.auctionId)}
                                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-all inline-block"
                                    title={t.endAuction}
                                    disabled={endAuctionMutation.isPending}
                                  >
                                    {endAuctionMutation.isPending ? (
                                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                    ) : (
                                      <IconCircleCheck className="h-5 w-5" />
                                    )}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="flex items-center gap-3 text-sm staff-text-secondary">
                  <span>{t.show}</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm font-bold"
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span>{t.entriesPerPage}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <span className="text-xs font-bold staff-text-secondary uppercase tracking-widest">
                    {t.showingEntries} {totalEntries > 0 ? (currentPage - 1) * pageSize + 1 : 0} {t.toText} {Math.min(currentPage * pageSize, totalEntries)} {t.ofText} {totalEntries} {t.entriesText}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-2 border-2 border-[#e6e2da] hover:bg-red-50 hover:border-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <IconChevronsLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border-2 border-[#e6e2da] hover:bg-red-50 hover:border-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <IconChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="px-4 py-2 border-2 border-[#e6e2da] bg-white text-xs font-black staff-text-primary uppercase tracking-widest">
                      {t.pageText} {currentPage} / {totalPages}
                    </div>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border-2 border-[#e6e2da] hover:bg-red-50 hover:border-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <IconChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 border-2 border-[#e6e2da] hover:bg-red-50 hover:border-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <IconChevronsRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        variant={confirmConfig.variant}
        isLoading={endAuctionMutation.isPending}
      />
    </SidebarProvider>
  );
}
