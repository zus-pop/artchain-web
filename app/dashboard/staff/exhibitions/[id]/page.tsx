"use client";

import { useDeleteExhibition, useGetExhibitionById } from "@/apis/exhibition";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ExhibitionStatus } from "@/types/exhibition";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconEdit,
  IconEye,
  IconPalette,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { formatDate } from "../../../../../lib/utils";

export default function ExhibitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // Fetch exhibition details
  const { data: exhibitionResponse, isLoading } = useGetExhibitionById(id);
  const exhibition = exhibitionResponse?.data;

  // Delete mutation
  const deleteExhibitionMutation = useDeleteExhibition();

  const handleDeleteExhibition = async () => {
    if (!confirm("Are you sure you want to delete this exhibition?")) return;
    deleteExhibitionMutation.mutate(id, {
      onSuccess: () => {
        // Redirect to exhibitions list
        window.location.href = "/dashboard/staff/exhibitions";
      },
    });
  };

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

  if (isLoading) {
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
          <SiteHeader title={t.exhibitionDetail} />
          <div className="flex flex-1 flex-col items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 staff-text-secondary">{t.loadingExhibition}</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!exhibition) {
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
          <SiteHeader title={t.exhibitionDetail} />
          <div className="flex flex-1 flex-col items-center justify-center py-12">
            <div className="text-center">
              <p className="staff-text-secondary">{t.exhibitionNotFound}</p>
              <Link
                href="/dashboard/staff/exhibitions"
                className="staff-btn-primary mt-4 inline-block"
              >
                {t.backToExhibitions}
              </Link>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
        <SiteHeader title={t.exhibitionDetail} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-[#fffdf9]">
            <Breadcrumb
              items={[
                {
                  label: t.exhibitionsManagement,
                  href: "/dashboard/staff/exhibitions",
                },
                { label: exhibition.name },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="@container/main">
              <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100">
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
                  <div className="relative p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <Link
                            href="/dashboard/staff/exhibitions"
                            className="p-2 hover:bg-white/80 rounded-lg transition-colors"
                            title={t.backToExhibitions}
                          >
                            <IconArrowLeft className="h-5 w-5 text-gray-600" />
                          </Link>
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100">
                              <IconPalette className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h1 className="text-3xl font-bold staff-text-primary">
                                {exhibition.name}
                              </h1>
                              <p className="text-sm staff-text-secondary mt-1">
                                {t.exhibitionDetailsManagement}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${getStatusBadgeColor(
                              exhibition.status
                            )}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                exhibition.status === "ACTIVE"
                                  ? "bg-green-500"
                                  : exhibition.status === "COMPLETED"
                                  ? "bg-blue-500"
                                  : exhibition.status === "DRAFT"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            {exhibition.status}
                          </span>
                          <div className="flex items-center gap-2 text-sm staff-text-secondary">
                            <IconCalendar className="h-4 w-4" />
                            {formatDate({
                              dateString: exhibition.startDate,
                              language: currentLanguage,
                            })}{" "}
                            -{" "}
                            {formatDate({
                              dateString: exhibition.endDate,
                              language: currentLanguage,
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-sm staff-text-secondary">
                            <IconPhoto className="h-4 w-4" />
                            {exhibition.numberOfPaintings} {t.paintingsText}
                          </div>
                        </div>

                        <p className="text-gray-600 max-w-2xl">
                          {exhibition.description}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/dashboard/staff/exhibitions/${exhibition.exhibitionId}/edit`}
                          className="staff-btn-secondary flex items-center gap-2"
                        >
                          <IconEdit className="h-4 w-4" />
                          {t.editExhibition}
                        </Link>
                        <button
                          onClick={handleDeleteExhibition}
                          className="staff-btn-danger flex items-center gap-2"
                          disabled={deleteExhibitionMutation.isPending}
                        >
                          <IconTrash className="h-4 w-4" />
                          {t.deleteExhibition}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="staff-card p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100">
                        <IconPhoto className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold staff-text-primary">
                          {exhibition.numberOfPaintings}
                        </p>
                        <p className="text-sm staff-text-secondary">
                          {t.totalPaintings}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="staff-card p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100">
                        <IconClock className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold staff-text-primary">
                          {Math.ceil(
                            (new Date(exhibition.endDate).getTime() -
                              new Date(exhibition.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}
                        </p>
                        <p className="text-sm staff-text-secondary">
                          {t.daysDuration}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="staff-card p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100">
                        <IconCalendar className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold staff-text-primary">
                          {new Date(exhibition.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm staff-text-secondary">
                          {t.exhibitionStarts}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="staff-card p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100">
                        <IconTrophy className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold staff-text-primary">
                          {new Date(exhibition.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm staff-text-secondary">
                          {t.exhibitionEnds}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Exhibition Paintings Gallery */}
                    <div className="staff-card p-3">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100">
                            <IconPhoto className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold staff-text-primary">
                              {t.exhibitionPaintingsGallery}
                            </h2>
                            <p className="text-sm staff-text-secondary">
                              {exhibition.exhibitionPaintings?.length || 0}{" "}
                              {t.paintingsCurated}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/dashboard/staff/exhibitions/${exhibition.exhibitionId}/paintings`}
                          className="staff-btn-primary flex items-center gap-2"
                        >
                          <IconPlus className="h-4 w-4" />
                          {t.managePaintings}
                        </Link>
                      </div>

                      {exhibition.exhibitionPaintings &&
                      exhibition.exhibitionPaintings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                          {exhibition.exhibitionPaintings.map(
                            (exhibitionPainting) => (
                              <div
                                key={exhibitionPainting.paintingId}
                                className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                              >
                                <div className="aspect-square relative overflow-hidden">
                                  {exhibitionPainting.imageUrl &&
                                  exhibitionPainting.imageUrl.trim() !== "" ? (
                                    <Image
                                      src={exhibitionPainting.imageUrl}
                                      alt={exhibitionPainting.title}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                      <div className="text-center">
                                        <IconPhoto className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">
                                          {t.noImageAvailable}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {/* <div className="absolute top-3 right-3">
                                    <span
                                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        exhibitionPainting.status === "ACCEPTED"
                                          ? "bg-green-100 text-green-800"
                                          : exhibitionPainting.status ===
                                            "PENDING"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {exhibitionPainting.status}
                                    </span>
                                  </div> */}
                                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                                    <Link
                                      href={`/dashboard/staff/competitors/paintings/${exhibitionPainting.paintingId}`}
                                      className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-white transition-all duration-200 flex items-center gap-2"
                                    >
                                      <IconEye className="h-4 w-4" />
                                      View Details
                                    </Link>
                                  </div>
                                </div>
                                <div className="p-4">
                                  <h4 className="font-semibold staff-text-primary text-sm line-clamp-2 mb-2">
                                    {exhibitionPainting.title}
                                  </h4>
                                  <p className="text-xs staff-text-secondary line-clamp-2 mb-3">
                                    {exhibitionPainting.description}
                                  </p>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="staff-text-secondary">
                                      {t.added}{" "}
                                      {formatDate({
                                        dateString: exhibitionPainting.addedAt,
                                        language: currentLanguage,
                                      })}
                                    </span>
                                    <span className="text-blue-600 hover:text-blue-800 font-medium">
                                      {t.viewPainting}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <IconPhoto className="h-12 w-12 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold staff-text-primary mb-2">
                            {t.noPaintingsYet}
                          </h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {t.addPaintingsFromWinners}
                          </p>
                          <Link
                            href={`/dashboard/staff/exhibitions/${exhibition.exhibitionId}/paintings`}
                            className="staff-btn-primary inline-flex items-center gap-2"
                          >
                            <IconPlus className="h-4 w-4" />
                            {t.managePaintings}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                    {/* Exhibition Timeline */}
                    <div className="staff-card p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100">
                          <IconCalendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold staff-text-primary">
                          {t.exhibitionTimeline}
                        </h3>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                new Date() >= new Date(exhibition.startDate)
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <div className="w-0.5 h-16 bg-blue-200 mt-2"></div>
                          </div>
                          <div className="flex-1 pb-6">
                            <h4 className="font-semibold staff-text-primary text-sm">
                              {t.exhibitionStarts}
                            </h4>
                            <p className="text-sm staff-text-secondary mt-1">
                              {formatDate({
                                dateString: exhibition.startDate,
                                language: currentLanguage,
                              })}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              {new Date() < new Date(exhibition.startDate)
                                ? t.openingDayPreparations
                                : t.currentlyRunning}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                new Date() > new Date(exhibition.endDate)
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold staff-text-primary text-sm">
                              {t.exhibitionEnds}
                            </h4>
                            <p className="text-sm staff-text-secondary mt-1">
                              {formatDate({
                                dateString: exhibition.endDate,
                                language: currentLanguage,
                              })}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              {new Date() > new Date(exhibition.endDate)
                                ? t.completedText
                                : t.ongoingExhibition}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="staff-card p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100">
                          <IconTrophy className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold staff-text-primary">
                          {t.quickActions}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <Link
                          href={`/dashboard/staff/exhibitions/${exhibition.exhibitionId}/edit`}
                          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <IconEdit className="h-4 w-4" />
                          {t.editExhibitionDetailsText}
                        </Link>
                        <Link
                          href={`/dashboard/staff/exhibitions/${exhibition.exhibitionId}/paintings`}
                          className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <IconPlus className="h-4 w-4" />
                          {t.managePaintings}
                        </Link>
                        <button
                          onClick={handleDeleteExhibition}
                          className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                          disabled={deleteExhibitionMutation.isPending}
                        >
                          <IconTrash className="h-4 w-4" />
                          {deleteExhibitionMutation.isPending
                            ? t.deleting
                            : t.deleteExhibitionText}
                        </button>
                      </div>
                    </div>

                    {/* Exhibition Status */}
                    <div className="staff-card p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-100">
                          <IconUsers className="h-5 w-5 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold staff-text-primary">
                          {t.exhibitionStatus}
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm staff-text-secondary">
                            {t.currentStatus}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                              exhibition.status
                            )}`}
                          >
                            {exhibition.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm staff-text-secondary">
                            {t.paintingsCount}
                          </span>
                          <span className="font-semibold staff-text-primary">
                            {exhibition.numberOfPaintings}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm staff-text-secondary">
                            {t.daysRemaining}
                          </span>
                          <span className="font-semibold staff-text-primary">
                            {Math.max(
                              0,
                              Math.ceil(
                                (new Date(exhibition.endDate).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
