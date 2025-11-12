"use client";

import {
  useDeleteExhibition,
  useGetExhibitions,
  useUpdateExhibition,
} from "@/apis/exhibition";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { StatsCards } from "@/components/staff/StatsCards";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Exhibition, ExhibitionStatus } from "@/types/exhibition";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEdit,
  IconEye,
  IconFilter,
  IconPalette,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExhibitionsPage() {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    ExhibitionStatus | "ALL"
  >("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const statusOptions: (ExhibitionStatus | "ALL")[] = [
    "ALL",
    "DRAFT",
    "ACTIVE",
    "COMPLETED",
    "CANCEL",
  ];

  // Fetch exhibitions using React Query
  const { data: exhibitionsResponse, isLoading } = useGetExhibitions();

  // Filter exhibitions based on search and status
  const filteredExhibitions =
    exhibitionsResponse?.data?.filter((exhibition) => {
      const matchesSearch =
        exhibition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exhibition.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "ALL" || exhibition.status === selectedStatus;

      return matchesSearch && matchesStatus;
    }) || [];

  // Paginate filtered results
  const totalExhibitions = filteredExhibitions.length;
  const totalPages = Math.ceil(totalExhibitions / pageSize);
  const paginatedExhibitions = filteredExhibitions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Mutations
  const deleteExhibitionMutation = useDeleteExhibition();
  const updateExhibitionMutation = useUpdateExhibition();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchQuery]);

  const getStatusBadgeColor = (status: ExhibitionStatus) => {
    switch (status) {
      case "ACTIVE":
        return "staff-badge-active";
      case "COMPLETED":
        return "staff-badge-active";
      case "DRAFT":
        return "staff-badge-pending";
      case "CANCEL":
        return "staff-badge-rejected";
      default:
        return "staff-badge-neutral";
    }
  };

  const getStatusIcon = (status: ExhibitionStatus) => {
    switch (status) {
      case "ACTIVE":
        return IconCalendar;
      case "COMPLETED":
        return IconPalette;
      case "DRAFT":
        return IconEdit;
      case "CANCEL":
        return IconTrash;
      default:
        return IconCalendar;
    }
  };

  const handleDeleteExhibition = async (exhibitionId: string) => {
    if (!confirm(t.confirmDelete)) return;
    deleteExhibitionMutation.mutate(exhibitionId);
  };

  const handleStatusChange = async (
    exhibitionId: string,
    newStatus: ExhibitionStatus
  ) => {
    updateExhibitionMutation.mutate({
      exhibitionId,
      status: newStatus,
    });
  };

  // Calculate statistics
  const totalExhibitionsCount = exhibitionsResponse?.data?.length || 0;
  const activeExhibitions =
    exhibitionsResponse?.data?.filter((e) => e.status === "ACTIVE").length || 0;
  const totalPaintings =
    exhibitionsResponse?.data?.reduce(
      (sum, e) => sum + e.numberOfPaintings,
      0
    ) || 0;
  const completedExhibitions =
    exhibitionsResponse?.data?.filter((e) => e.status === "COMPLETED").length ||
    0;

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
        <SiteHeader title={t.exhibitionsManagement} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-[#fffdf9]">
            <Breadcrumb
              items={[{ label: t.exhibitionsManagement }]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold staff-text-primary">
                    {t.allExhibitions} ({totalExhibitionsCount})
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    {t.manageExhibitions}
                  </p>
                  <p className="text-xs staff-text-secondary mt-1">
                    {t.exhibitionsTip}
                  </p>
                </div>
                <Link
                  href="/dashboard/staff/exhibitions/create"
                  className="staff-btn-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  {t.createExhibition}
                </Link>
              </div>

              {/* Statistics Cards */}
              <StatsCards
                stats={[
                  {
                    title: t.totalExhibitions,
                    value: totalExhibitionsCount,
                    subtitle: t.allExhibitionsText,
                    icon: <IconPalette className="h-6 w-6" />,
                    variant: "info",
                  },
                  {
                    title: t.activeExhibitions,
                    value: activeExhibitions,
                    subtitle: t.currentlyRunning,
                    icon: <IconCalendar className="h-6 w-6" />,
                    variant: "warning",
                  },
                  {
                    title: t.totalPaintings,
                    value: totalPaintings,
                    subtitle: t.paintingsOnDisplay,
                    icon: <IconPalette className="h-6 w-6" />,
                    variant: "success",
                  },
                  {
                    title: t.completed,
                    value: completedExhibitions,
                    subtitle: t.finishedExhibitions,
                    icon: <IconPalette className="h-6 w-6" />,
                    variant: "primary",
                  },
                ]}
              />

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t.searchExhibitions}
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
                        e.target.value as ExhibitionStatus | "ALL"
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

              {/* Exhibitions Table */}
              <div className="staff-card overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 staff-text-secondary">
                        {t.loadingExhibitions}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                            {t.exhibition}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                            {t.status}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                            {t.paintings}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                            {t.dates}
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium staff-text-secondary uppercase tracking-wider">
                            {t.actions}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#fffdf9] divide-y divide-gray-200">
                        {paginatedExhibitions.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-12 text-center staff-text-secondary"
                            >
                              {t.noExhibitionsFound}
                            </td>
                          </tr>
                        ) : (
                          paginatedExhibitions.map((exhibition: Exhibition) => {
                            const StatusIcon = getStatusIcon(exhibition.status);
                            return (
                              <tr
                                key={exhibition.exhibitionId}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium staff-text-primary line-clamp-1">
                                      {exhibition.name}
                                    </div>
                                    <div className="text-sm staff-text-secondary line-clamp-2">
                                      {exhibition.description}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${getStatusBadgeColor(
                                      exhibition.status
                                    )}`}
                                  >
                                    <StatusIcon className="h-3 w-3" />
                                    {exhibition.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                  <div className="flex items-center gap-2">
                                    <IconPalette className="h-4 w-4" />
                                    {exhibition.numberOfPaintings} {t.paintings}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                  <div>
                                    <div>
                                      {t.start}:{" "}
                                      {new Date(
                                        exhibition.startDate
                                      ).toLocaleDateString()}
                                    </div>
                                    <div>
                                      {t.end}:{" "}
                                      {new Date(
                                        exhibition.endDate
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end gap-2">
                                    <Link
                                      href={`/dashboard/staff/exhibitions/${exhibition.exhibitionId}`}
                                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                      title="View Details"
                                    >
                                      <IconEye className="h-4 w-4" />
                                    </Link>
                                    <Link
                                      href={`/dashboard/staff/exhibitions/${exhibition.exhibitionId}/edit`}
                                      className="staff-text-secondary hover:staff-text-primary p-1 rounded hover:bg-gray-50 transition-colors"
                                      title="Edit"
                                    >
                                      <IconEdit className="h-4 w-4" />
                                    </Link>
                                    {exhibition.status === "DRAFT" && (
                                      <button
                                        onClick={() =>
                                          handleStatusChange(
                                            exhibition.exhibitionId,
                                            "ACTIVE"
                                          )
                                        }
                                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                                        title="Activate"
                                        disabled={
                                          updateExhibitionMutation.isPending
                                        }
                                      >
                                        <IconCalendar className="h-4 w-4" />
                                      </button>
                                    )}
                                    {exhibition.status === "ACTIVE" && (
                                      <button
                                        onClick={() =>
                                          handleStatusChange(
                                            exhibition.exhibitionId,
                                            "COMPLETED"
                                          )
                                        }
                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                        title="Complete"
                                        disabled={
                                          updateExhibitionMutation.isPending
                                        }
                                      >
                                        <IconPalette className="h-4 w-4" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() =>
                                        handleDeleteExhibition(
                                          exhibition.exhibitionId
                                        )
                                      }
                                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                      title="Delete"
                                      disabled={
                                        deleteExhibitionMutation.isPending
                                      }
                                    >
                                      <IconTrash className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm staff-text-secondary">
                      {t.showPerPage}
                    </span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
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
                    {t.showing}{" "}
                    {paginatedExhibitions.length > 0
                      ? (currentPage - 1) * pageSize + 1
                      : 0}{" "}
                    {t.to} {Math.min(currentPage * pageSize, totalExhibitions)}{" "}
                    {t.of} {totalExhibitions} {t.exhibitions}
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
                    {t.page} {currentPage} {t.of} {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next page"
                  >
                    <IconChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Last page"
                  >
                    <IconChevronsRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
