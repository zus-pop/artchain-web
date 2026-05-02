"use client";

import { useGetAwardsByContestId } from "@/apis/award";
import {
  useAddPaintingToAuction,
  useGetAuctionById,
  useUpdateAuctionStatus,
  useEndAuction,
} from "@/apis/auction";
import { getAllStaffContests } from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import { AuctionPainting } from "@/types/auction";
import {
  IconArrowLeft,
  IconCalendar,
  IconGavel,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconTrophy,
  IconX,
  IconUsers,
  IconCircleCheck,
  IconSend,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function AuctionDetailContent() {
  const searchParams = useSearchParams();
  const auctionId = searchParams.get("id");
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  const queryClient = useQueryClient();

  // Selected contest for painting source
  const [selectedContestId, setSelectedContestId] = useState<string>("");
  const [selectedPaintingIds, setSelectedPaintingIds] = useState<string[]>([]);
  const [showAddPaintingDialog, setShowAddPaintingDialog] = useState(false);
  const [selectedAuctionPainting, setSelectedAuctionPainting] =
    useState<AuctionPainting | null>(null);
  const [showPaintingDetailDialog, setShowPaintingDetailDialog] =
    useState(false);
  
  // Pricing state for each selected painting
  const [paintingPrices, setPaintingPrices] = useState<Record<string, { basePrice: number; ceilPrice: number; bidStep: number; auctionDurationMinutes: number }>>({});

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "primary" | "destructive" | "warning";
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Fetch auction details
  const { data: auction, isLoading: auctionLoading } = useGetAuctionById(auctionId || "");

  // Fetch contests for selection
  const { data: contestsResponse } = useQuery({
    queryKey: ["staff-contests"],
    queryFn: () => getAllStaffContests({ limit: 100 }),
    enabled: showAddPaintingDialog,
  });

  // Fetch awards for selected contest
  const { data: awardsResponse, isLoading: awardsLoading } = useGetAwardsByContestId(
    selectedContestId || ""
  );

  // Mutation for adding painting to auction
  const addPaintingMutation = useAddPaintingToAuction(auctionId || "");

  // Mutation for updating auction status
  const updateStatusMutation = useUpdateAuctionStatus();

  const handleUpdateStatus = async (newStatus: string, title: string, description: string, variant: "primary" | "destructive" | "warning" = "warning") => {
    setConfirmConfig({
      isOpen: true,
      title,
      description,
      variant,
      onConfirm: async () => {
        try {
          await updateStatusMutation.mutateAsync({ auctionId: auctionId || "", status: newStatus });
        } catch (error) {
          console.error(`Failed to update status to ${newStatus}:`, error);
        }
      },
    });
  };

  // Mutation for ending auction
  const endAuctionMutation = useEndAuction();

  const handleEndAuction = async () => {
    setConfirmConfig({
      isOpen: true,
      title: t.endAuction,
      description: t.confirmEndAuction,
      variant: "destructive",
      onConfirm: async () => {
        try {
          await endAuctionMutation.mutateAsync(auctionId || "");
        } catch (error) {
          console.error("Failed to end auction:", error);
        }
      },
    });
  };

  const handleAddPaintings = async () => {
    if (selectedPaintingIds.length === 0) return;

    try {
      for (const paintingId of selectedPaintingIds) {
        const prices = paintingPrices[paintingId] || { basePrice: 0, ceilPrice: 0, bidStep: 0, auctionDurationMinutes: 15 };
        await addPaintingMutation.mutateAsync({
          paintingId,
          basePrice: prices.basePrice,
          ceilPrice: prices.ceilPrice,
          bidStep: prices.bidStep,
          auctionDurationMinutes: prices.auctionDurationMinutes || 15,
        });
      }
      setSelectedPaintingIds([]);
      setPaintingPrices({});
      setShowAddPaintingDialog(false);
      queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
    } catch (error) {
      console.error("Failed to add paintings:", error);
    }
  };

   const handlePriceChange = (paintingId: string, field: string, value: string) => {
    // For numeric fields, strip all non-digits
    const cleanValue = value.replace(/\D/g, "");
    const numValue = parseInt(cleanValue) || 0;
    
    setPaintingPrices((prev) => ({
      ...prev,
      [paintingId]: {
        ...(prev[paintingId] || { basePrice: 0, ceilPrice: 0, bidStep: 0, auctionDurationMinutes: 15 }),
        [field]: numValue,
      },
    }));
  };

  const formatVND = (value: number | undefined) => {
    if (!value) return "";
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("vi-VN");
  };

  const getPaintingStatusBadge = (status?: string) => {
    switch (status) {
      case "LIVE":
        return "bg-red-100 text-red-700 border-red-200";
      case "WAITING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "END":
      case "ENDED":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const handleOpenPaintingDetail = (auctionPainting: AuctionPainting) => {
    setSelectedAuctionPainting(auctionPainting);
    setShowPaintingDetailDialog(true);
  };

  const handleClosePaintingDetail = () => {
    setShowPaintingDetailDialog(false);
    setSelectedAuctionPainting(null);
  };

  if (auctionLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 staff-text-secondary">{t.loadingAdmin}</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="text-center">
          <p className="staff-text-secondary">{t.noDataAvailable}</p>
          <Link href="/dashboard/staff/auctions" className="staff-btn-primary mt-4 inline-block">
            {t.allAuctions}
          </Link>
        </div>
      </div>
    );
  }

  const canAddPainting = auction.status === "DRAFT";

  const actionButtonBase =
    "inline-flex w-full items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  const compactStats = [
    {
      key: "paintings",
      icon: <IconPhoto className="h-4 w-4" />,
      label: t.totalPaintings,
      value: auction.auctionPaintings?.length || 0,
    },
    {
      key: "participants",
      icon: <IconUsers className="h-4 w-4" />,
      label: t.participants,
      value: auction.participantCount || 0,
    },
    {
      key: "bids",
      icon: <IconGavel className="h-4 w-4" />,
      label: t.totalBids,
      value: auction.bidCount || 0,
    },
  ];


  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "ONGOING":
      case "LIVE":
        return "staff-badge-active";
      case "PENDING":
      case "UPCOMING":
        return "staff-badge-pending";
      case "DRAFT":
        return "staff-badge-neutral";
      case "ENDED":
      case "END":
        return "staff-badge-neutral";
      case "CANCELLED":
        return "staff-badge-rejected";
      default:
        return "staff-badge-neutral";
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="staff-page-header">
        <Breadcrumb
          items={[
            { label: t.auctionManagement, href: "/dashboard/staff/auctions" },
            { label: auction.title },
          ]}
          homeHref="/dashboard/staff"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="@container/main">
          <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-7xl mx-auto">
            <section className="staff-card p-5 lg:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1 space-y-4">
                  <Link
                    href="/dashboard/staff/auctions"
                    className="inline-flex items-center gap-2 text-sm staff-text-secondary transition-colors hover:staff-text-primary"
                  >
                    <IconArrowLeft className="h-4 w-4" />
                    {t.auctionManagement}
                  </Link>

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-blue-100 text-blue-700">
                      <IconGavel className="h-6 w-6" />
                    </div>
                    <h1 className="min-w-0 text-2xl font-semibold leading-tight staff-text-primary break-words">
                      {auction.title}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium ${getStatusColor(auction.status)}`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {auction.status}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm staff-text-secondary">
                      <IconCalendar className="h-4 w-4" />
                      {new Date(auction.startTime).toLocaleString()} - {new Date(auction.endTime).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-gray-600">
                    {auction.description}
                  </p>

                  {/* <div className="flex flex-wrap gap-2 pt-1">
                    {compactStats.map((stat) => (
                      <div
                        key={stat.key}
                        className="inline-flex items-center gap-2 rounded-sm border border-[var(--staff-border)] bg-[var(--staff-surface)] px-3 py-2"
                      >
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-gray-100 text-gray-600">
                          {stat.icon}
                        </span>
                        <span className="text-sm staff-text-secondary">{stat.label}</span>
                        <span className="text-sm font-semibold staff-text-primary">{stat.value}</span>
                      </div>
                    ))}
                  </div> */}
                </div>

                <div className="w-full lg:w-64">
                  <div className="grid gap-2">
                    {canAddPainting && (
                      <button
                        onClick={() => setShowAddPaintingDialog(true)}
                        className={`${actionButtonBase} bg-[var(--staff-primary)] text-white hover:bg-[var(--staff-primary-hover)]`}
                      >
                        <IconPlus className="h-4 w-4" />
                        {t.addPaintingToAuction}
                      </button>
                    )}

                    {auction.status === "DRAFT" && (
                      <button
                        onClick={() => handleUpdateStatus("UPCOMING", t.openUpcomingNow, t.confirmOpenUpcoming, "primary")}
                        disabled={updateStatusMutation.isPending}
                        className={`${actionButtonBase} border border-[var(--staff-border)] bg-[var(--staff-surface)] staff-text-primary hover:bg-gray-50`}
                      >
                        {updateStatusMutation.isPending ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-[var(--staff-primary)]" />
                        ) : (
                          <IconCalendar className="h-4 w-4" />
                        )}
                        {t.openUpcomingNow}
                      </button>
                    )}

                    {auction.status === "UPCOMING" && (
                      <button
                        onClick={() => handleUpdateStatus("LIVE", t.openLiveNow, t.confirmOpenLive, "warning")}
                        disabled={updateStatusMutation.isPending}
                        className={`${actionButtonBase} bg-[var(--staff-primary)] text-white hover:bg-[var(--staff-primary-hover)]`}
                      >
                        {updateStatusMutation.isPending ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                        ) : (
                          <IconGavel className="h-4 w-4" />
                        )}
                        {t.openLiveNow}
                      </button>
                    )}

                    {auction.status === "LIVE" && (
                      <button
                        onClick={handleEndAuction}
                        disabled={endAuctionMutation.isPending}
                        className={`${actionButtonBase} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
                      >
                        {endAuctionMutation.isPending ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-red-700" />
                        ) : (
                          <IconCircleCheck className="h-4 w-4" />
                        )}
                        {t.endAuction}
                      </button>
                    )}

                    {canAddPainting && (
                      <Link
                        href={`/dashboard/staff/auctions/promote?id=${auctionId}`}
                        className={`${actionButtonBase} border border-[var(--staff-border)] bg-[var(--staff-surface)] staff-text-primary hover:bg-gray-50`}
                      >
                        <IconSend className="h-4 w-4" />
                        {t.promoteAuction}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Auction paintings gallery */}
            <div className="staff-card overflow-hidden">
              <div className="bg-[#f8f6f0] px-6 py-4 border-b border-[var(--staff-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconPhoto className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold staff-text-primary uppercase tracking-wider">{t.paintings}</h2>
                </div>
                <div className="text-xs staff-text-secondary uppercase font-bold">
                  {auction.auctionPaintings?.length || 0} Items
                </div>
              </div>

              <div className="p-6">
                {auction.auctionPaintings && auction.auctionPaintings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {auction.auctionPaintings.map((auctionPainting) => {
                      const painting = auctionPainting.painting;
                      return (
                        <div
                          key={auctionPainting.auctionPaintingId}
                          onClick={() => handleOpenPaintingDetail(auctionPainting)}
                          className="group bg-white border border-[var(--staff-border)] hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                        >
                          <div className="aspect-square relative overflow-hidden bg-gray-50 border-b border-[var(--staff-border)]">
                            {painting.imageUrl ? (
                              <Image
                                src={painting.imageUrl}
                                alt={painting.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <IconPhoto className="h-12 w-12 text-gray-200" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1">
                              <button className="staff-btn-danger !px-1.5 !py-1.5 shadow-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                <IconTrash className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleOpenPaintingDetail(auctionPainting);
                                }}
                                className="bg-white text-gray-900 px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors"
                              >
                                {t.viewDetails}
                              </button>
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <h4 className="font-bold staff-text-primary text-sm line-clamp-1 mb-1">
                              {painting.title}
                            </h4>
                            <div className="mt-auto space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.basePrice}</span>
                                <span className="text-xs font-black text-blue-600">
                                  {auctionPainting.basePrice?.toLocaleString()} VND
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.auctionDuration || "Duration"}</span>
                                <span className="text-xs font-black text-gray-600">
                                  {auctionPainting.auctionDurationMinutes || "--"} {t.minutes || "Min"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between border-t border-dashed border-[var(--staff-border)] pt-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.currentBid}</span>
                                <span className="text-sm font-black text-red-500">
                                  {auctionPainting.currentBid?.toLocaleString() || "0"} VND
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 border-2 border-dashed border-[var(--staff-border)]">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <IconPhoto className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold staff-text-secondary uppercase">{t.noPaintingsInAuction}</h3>
                    <p className="text-sm text-gray-400 mt-2 mb-6">{t.selectPaintingsToAdd}</p>
                    {canAddPainting && (
                      <button
                        onClick={() => setShowAddPaintingDialog(true)}
                        className="staff-btn-primary inline-flex items-center gap-2"
                      >
                        <IconPlus className="h-4 w-4" />
                        {t.addPaintingToAuction}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Painting Detail Modal */}
      {showPaintingDetailDialog && selectedAuctionPainting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            className="absolute inset-0"
            onClick={handleClosePaintingDetail}
          />

          <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-sm border border-[var(--staff-border)] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--staff-border)] bg-[#fcfbf9] px-6 py-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wide staff-text-primary">
                  Chi tiet tranh dau gia
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {auction.title} - ID #{selectedAuctionPainting.auctionPaintingId}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClosePaintingDetail}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <div className="relative aspect-square overflow-hidden rounded-sm border border-[var(--staff-border)] bg-gray-50">
                  {selectedAuctionPainting.painting?.imageUrl ? (
                    <Image
                      src={selectedAuctionPainting.painting.imageUrl}
                      alt={selectedAuctionPainting.painting.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <IconPhoto className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6 lg:col-span-3">
                <div className="rounded-sm border border-[var(--staff-border)] bg-[var(--staff-surface)] p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-wider ${getPaintingStatusBadge(selectedAuctionPainting.status)}`}
                    >
                      {selectedAuctionPainting.status || "UNKNOWN"}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[var(--staff-border)] bg-white px-2.5 py-1 text-xs font-black uppercase tracking-wider text-gray-600">
                      {selectedAuctionPainting.isSold ? "Sold" : "Not Sold"}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900">
                    {selectedAuctionPainting.painting?.title || "-"}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedAuctionPainting.painting?.description || "Khong co mo ta"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-sm border border-[var(--staff-border)] p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Base Price
                    </p>
                    <p className="mt-1 text-lg font-black text-blue-700">
                      {(selectedAuctionPainting.basePrice || 0).toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                  <div className="rounded-sm border border-[var(--staff-border)] p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Current Bid
                    </p>
                    <p className="mt-1 text-lg font-black text-red-600">
                      {(selectedAuctionPainting.currentBid || 0).toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                  <div className="rounded-sm border border-[var(--staff-border)] p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Ceil Price
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-800">
                      {(selectedAuctionPainting.ceilPrice || 0).toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                  <div className="rounded-sm border border-[var(--staff-border)] p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Bid Step
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-800">
                      {(selectedAuctionPainting.bidStep || 0).toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                </div>

                <div className="rounded-sm border border-[var(--staff-border)] p-4">
                  <h5 className="mb-3 text-xs font-black uppercase tracking-widest text-gray-500">
                    Thong tin phien dau gia
                  </h5>
                  <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 md:grid-cols-2">
                    <p><span className="font-bold">Auction ID:</span> {selectedAuctionPainting.auctionId}</p>
                    <p><span className="font-bold">Painting ID:</span> {selectedAuctionPainting.paintingId}</p>
                    <p><span className="font-bold">Current Bidder ID:</span> {selectedAuctionPainting.currentBidderId || "-"}</p>
                    <p><span className="font-bold">Revoked:</span> {selectedAuctionPainting.revoked ?? 0}</p>
                    <p><span className="font-bold">Duration:</span> {selectedAuctionPainting.auctionDurationMinutes || 0} minutes</p>
                    <p><span className="font-bold">Painting Status:</span> {selectedAuctionPainting.painting?.status || "-"}</p>
                    <p><span className="font-bold">Auction Start:</span> {formatDateTime(selectedAuctionPainting.auctionStartTime)}</p>
                    <p><span className="font-bold">Auction End:</span> {formatDateTime(selectedAuctionPainting.auctionEndTime)}</p>
                    <p><span className="font-bold">Created At:</span> {formatDateTime(selectedAuctionPainting.createdAt)}</p>
                    <p><span className="font-bold">Updated At:</span> {formatDateTime(selectedAuctionPainting.updatedAt)}</p>
                    <p><span className="font-bold">Contest ID:</span> {selectedAuctionPainting.painting?.contestId ?? "-"}</p>
                    <p><span className="font-bold">Round ID:</span> {selectedAuctionPainting.painting?.roundId ?? "-"}</p>
                    <p><span className="font-bold">Competitor ID:</span> {selectedAuctionPainting.painting?.competitorId || "-"}</p>
                    <p><span className="font-bold">Award ID:</span> {selectedAuctionPainting.painting?.awardId ?? "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Painting Modal / Dialog */}
      {showAddPaintingDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden rounded-sm border border-[var(--staff-border)]">
            <div className="p-6 border-b border-[var(--staff-border)] flex items-center justify-between bg-[#fcfbf9]">
              <div>
                <h3 className="text-xl font-black staff-text-primary uppercase tracking-widest">{t.addPaintingToAuction}</h3>
                <p className="text-xs staff-text-secondary mt-1">{t.selectFromContestWinners}</p>
              </div>
              <button
                onClick={() => setShowAddPaintingDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IconPlus className="h-6 w-6 rotate-45 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              {/* Left Column: Selection */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6 border-r border-[var(--staff-border)]">
                {/* Contest Selection Sidebar */}
                <div className="w-full lg:w-48 flex flex-col gap-4">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest staff-text-secondary">{t.chooseContest}</label>
                    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                      {contestsResponse?.data?.map((contest) => (
                        <button
                          key={contest.contestId}
                          onClick={() => setSelectedContestId(contest.contestId.toString())}
                          className={`w-full text-left p-2 border-l-4 transition-all ${
                            selectedContestId === contest.contestId.toString()
                              ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                              : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200 staff-text-primary"
                          }`}
                        >
                          <p className="text-xs font-black truncate">{contest.title}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Painting Results */}
                <div className="flex-1 space-y-4 pl-0 lg:pl-6">
                  {!selectedContestId ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 grayscale py-12">
                      <IconTrophy className="h-12 w-12 text-gray-200 mb-4" />
                      <p className="text-xs font-bold staff-text-secondary uppercase">{t.selectContestPrompt}</p>
                    </div>
                  ) : awardsLoading ? (
                    <div className="flex items-center justify-center py-12">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : awardsResponse?.data && awardsResponse.data.length > 0 ? (
                    <div className="space-y-6">
                      {awardsResponse.data.map((award) => (
                        <div key={award.awardId} className="space-y-3">
                          <div className="flex items-center gap-2 border-b border-dashed border-[var(--staff-border)] pb-2">
                            <IconTrophy className="h-3 w-3 text-orange-400" />
                            <h4 className="text-xs font-black uppercase tracking-widest staff-text-secondary">{award.name}</h4>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[...(award.paintings || [])].sort((a, b) => {
                        const priority: Record<string, number> = { RE_OPEN: 1, REOPEN: 1, ACCEPTED: 2, INAUCTION: 3, SOLD: 4 };
                        return (priority[a.status || ""] || 99) - (priority[b.status || ""] || 99);
                      }).map((painting) => {
                        const isSelected = selectedPaintingIds.includes(painting.paintingId);
                        const isAlreadyInAuction = auction.auctionPaintings?.some(
                          (ap) => ap.paintingId === painting.paintingId
                        ) || painting.status === "INAUCTION";
                        const isSold = painting.status === "SOLD";
                        const isAddable = !isAlreadyInAuction && !isSold;

                        return (
                          <div
                            key={painting.paintingId}
                            onClick={() => {
                              if (!isAddable) return;
                              if (isSelected) {
                                setSelectedPaintingIds((prev) => prev.filter((id) => id !== painting.paintingId));
                              } else {
                                setSelectedPaintingIds((prev) => [...prev, painting.paintingId]);
                              }
                            }}
                            className={`group relative aspect-square bg-gray-50 border-2 transition-all cursor-pointer overflow-hidden ${
                              !isAddable
                                ? "opacity-40 grayscale cursor-not-allowed border-transparent"
                                : isSelected
                                ? "border-blue-600 ring-2 ring-blue-100 shadow-md"
                                : "border-transparent hover:border-gray-300"
                            }`}
                          >
                            {painting.imageUrl ? (
                              <Image
                                src={painting.imageUrl}
                                alt={painting.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <IconPhoto className="h-6 w-6 text-gray-200" />
                              </div>
                            )}

                            {/* {painting.status && (
                              <div className="absolute top-1 left-1 z-10">
                                <span className={`text-xs font-black text-white px-1.5 py-0.5 uppercase tracking-tighter rounded-sm ${
                                  painting.status === "SOLD" ? "bg-red-500" : 
                                  painting.status === "REOPEN" ? "bg-blue-500" : 
                                  painting.status === "INAUCTION" ? "bg-purple-500" :
                                  painting.status === "ACCEPTED" ? "bg-emerald-500" : "bg-gray-500"
                                } shadow-sm`}>
                                  {painting.status}
                                </span>
                              </div>
                            )} */}
                            
                            {isAlreadyInAuction || painting.status === "INAUCTION" ? (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-black text-xs font-black text-white px-1.5 py-0.5 uppercase tracking-tighter rounded-sm">
                                  {painting.status === "INAUCTION" ? (t as any).inAuction || "IN AUCTION" : t.addedToAuction}
                                </span>
                              </div>
                            ) : isSold ? (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                {/* Visually indicated by opacity and badge */}
                              </div>
                            ) : (
                              <div className={`absolute top-1 right-1 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                isSelected ? "bg-blue-600 border-blue-600 text-white" : "bg-white/80 border-gray-300"
                              }`}>
                                {isSelected && <IconPlus className="h-2 w-2" />}
                              </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 pt-4">
                              <p className="text-xs text-white font-bold truncate">{painting.title}</p>
                            </div>
                          </div>
                        );
                      })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-xs staff-text-secondary">{t.noAwardsFound}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Pricing Configuration */}
              <div className="w-full lg:w-96 flex flex-col bg-[var(--staff-surface)]">
                <div className="p-4 border-b border-[var(--staff-border)] bg-gray-50 flex items-center gap-2">
                   <div className="p-1.5 bg-blue-100 rounded-sm">
                      <IconGavel className="h-4 w-4 text-blue-600" />
                   </div>
                   <h4 className="text-xs font-black uppercase tracking-widest staff-text-primary">{t.pricingConfiguration || "Pricing Config"}</h4>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedPaintingIds.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                      <IconPhoto className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-xs font-bold staff-text-secondary uppercase">{t.selectPaintingsToConfigure || "Select paintings to configure prices"}</p>
                    </div>
                  ) : (
                     <div className="space-y-4">
                        {selectedPaintingIds.map(id => {
                           // Find painting title
                           let title = "Painting";
                           awardsResponse?.data?.forEach(award => {
                              const p = award.paintings?.find(p => p.paintingId === id);
                              if (p) title = p.title;
                           });
                           
                           const prices = paintingPrices[id] || { basePrice: 0, ceilPrice: 0, bidStep: 0 };
                           
                           return (
                              <div key={id} className="p-3 bg-white border border-[var(--staff-border)] rounded-sm shadow-sm space-y-3">
                                 <div className="flex items-center justify-between gap-2 border-b border-dashed border-gray-100 pb-2">
                                    <p className="text-xs font-black staff-text-primary truncate uppercase tracking-tighter">{title}</p>
                                    <button 
                                       onClick={() => setSelectedPaintingIds(prev => prev.filter(pId => pId !== id))}
                                       className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-sm transition-colors"
                                    >
                                       <IconX className="h-3 w-3" />
                                    </button>
                                 </div>
                                 <div className="grid grid-cols-1 gap-2">
                                    <div>
                                       <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5 block">{t.basePrice} (VND)</label>
                                       <input 
                                          type="text"
                                          value={formatVND(prices.basePrice)}
                                          onChange={(e) => handlePriceChange(id, "basePrice", e.target.value)}
                                          className="w-full px-2 py-1 text-xs border border-[var(--staff-border)] rounded-sm focus:ring-1 focus:ring-[var(--staff-primary)] outline-none"
                                          placeholder="1,000,000"
                                       />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                       <div>
                                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5 block">{t.auctionDuration || "Duration"}</label>
                                          <input 
                                             type="number"
                                             value={prices.auctionDurationMinutes || ""}
                                          onChange={(e) => handlePriceChange(id, "auctionDurationMinutes", e.target.value)}
                                             className="w-full px-2 py-1 text-xs border border-[var(--staff-border)] rounded-sm focus:ring-1 focus:ring-[var(--staff-primary)] outline-none"
                                             placeholder="15"
                                          />
                                       </div>
                                       <div>
                                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5 block">{t.bidStep || "Bid Step"}</label>
                                          <input 
                                             type="text"
                                             value={formatVND(prices.bidStep)}
                                             onChange={(e) => handlePriceChange(id, "bidStep", e.target.value)}
                                             className="w-full px-2 py-1 text-xs border border-[var(--staff-border)] rounded-sm focus:ring-1 focus:ring-[var(--staff-primary)] outline-none"
                                             placeholder="100,000"
                                          />
                                       </div>
                                    </div>
                                    <div>
                                       <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5 block">{t.ceilPrice || "Ceil Price"}</label>
                                       <input 
                                          type="text"
                                          value={formatVND(prices.ceilPrice)}
                                             onChange={(e) => handlePriceChange(id, "ceilPrice", e.target.value)}
                                          className="w-full px-2 py-1 text-xs border border-[var(--staff-border)] rounded-sm focus:ring-1 focus:ring-[var(--staff-primary)] outline-none"
                                          placeholder="10,000,000"
                                       />
                                    </div>
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  )}
                </div>

                <div className="p-4 border-t border-[var(--staff-border)] bg-white flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest staff-text-secondary">
                    <span>{t.selectedText}:</span>
                    <span className="text-blue-600">{selectedPaintingIds.length}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAddPaintingDialog(false)}
                      className="flex-1 staff-btn-outline py-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900"
                    >
                      {t.cancel}
                    </button>
                    <button
                      disabled={selectedPaintingIds.length === 0 || addPaintingMutation.isPending}
                      onClick={handleAddPaintings}
                      className="flex-1 staff-btn-primary py-2 flex items-center justify-center gap-2 text-xs"
                    >
                      {addPaintingMutation.isPending ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      ) : (
                        <IconPlus className="h-4 w-4" />
                      )}
                      {t.addText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          confirmConfig.onConfirm();
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }}
        title={confirmConfig.title}
        description={confirmConfig.description}
        variant={confirmConfig.variant}
        isLoading={updateStatusMutation.isPending || endAuctionMutation.isPending}
      />
    </div>
  );
}

export default function AuctionDetailPage() {
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
        <Suspense fallback={<div>Loading...</div>}>
          <AuctionDetailContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
