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
import {
  IconArrowLeft,
  IconCalendar,
  IconGavel,
  IconPhoto,
  IconPlus,
  IconSettings,
  IconTrash,
  IconTrophy,
  IconX,
  IconUsers,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

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
      <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-[#fffdf9]">
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
            {/* Header / Hero Section */}
            <div className="relative overflow-hidden bg-white border border-[#e6e2da] p-6 lg:p-8 rounded-lg shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <Link
                      href="/dashboard/staff/auctions"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <IconArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <IconGavel className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold staff-text-primary">{auction.title}</h1>
                        <p className="text-sm staff-text-secondary mt-1">{t.auctionDetail}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs uppercase font-black tracking-widest ${getStatusColor(auction.status)}`}>
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                      {auction.status}
                    </span>
                    <div className="flex items-center gap-2 text-sm staff-text-secondary border-l border-[#e6e2da] pl-4">
                      <IconCalendar className="h-4 w-4" />
                      <span className="font-bold">
                        {new Date(auction.startTime).toLocaleString()} - {new Date(auction.endTime).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 max-w-2xl text-sm leading-relaxed">
                    {auction.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  {canAddPainting && (
                    <button
                      onClick={() => setShowAddPaintingDialog(true)}
                      className="staff-btn-primary flex items-center justify-center gap-2 py-3"
                    >
                      <IconPlus className="h-5 w-5" />
                      {t.addPaintingToAuction}
                    </button>
                  )}
                  {auction.status === "DRAFT" && (
                    <button
                      onClick={() => handleUpdateStatus("UPCOMING", t.openUpcomingNow, t.confirmOpenUpcoming, "primary")}
                      disabled={updateStatusMutation.isPending}
                      className="staff-btn-secondary flex items-center justify-center gap-2 py-3 border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                      {updateStatusMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                      ) : (
                        <IconCalendar className="h-5 w-5" />
                      )}
                      {t.openUpcomingNow}
                    </button>
                  )}
                  {auction.status === "UPCOMING" && (
                    <button
                      onClick={() => handleUpdateStatus("LIVE", t.openLiveNow, t.confirmOpenLive, "warning")}
                      disabled={updateStatusMutation.isPending}
                      className="staff-btn-secondary flex items-center justify-center gap-2 py-3 border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                      {updateStatusMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                      ) : (
                        <IconGavel className="h-5 w-5" />
                      )}
                      {t.openLiveNow}
                    </button>
                  )}
                  {auction.status === "ONGOING" && (
                    <button
                      onClick={handleEndAuction}
                      disabled={endAuctionMutation.isPending}
                      className="staff-btn-secondary flex items-center justify-center gap-2 py-3 border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                      {endAuctionMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <IconCircleCheck className="h-5 w-5" />
                      )}
                      {t.endAuction}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="staff-card p-6 bg-linear-to-br from-blue-50 to-white border-blue-100 flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg shadow-blue-200/50">
                  <IconPhoto className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black staff-text-primary leading-none">
                    {auction.auctionPaintings?.length || 0}
                  </p>
                  <p className="text-xs font-bold staff-text-secondary uppercase tracking-widest mt-1">
                    {t.totalPaintings}
                  </p>
                </div>
              </div>

              <div className="staff-card p-6 bg-linear-to-br from-indigo-50 to-white border-indigo-100 flex items-center gap-4">
                <div className="p-3 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-200/50">
                  <IconUsers className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black staff-text-primary leading-none">
                    {auction.participantCount || 0}
                  </p>
                  <p className="text-xs font-bold staff-text-secondary uppercase tracking-widest mt-1">
                    {t.participants}
                  </p>
                </div>
              </div>

              <div className="staff-card p-6 bg-linear-to-br from-emerald-50 to-white border-emerald-100 flex items-center gap-4">
                <div className="p-3 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-200/50">
                  <IconGavel className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black staff-text-primary leading-none">
                    {auction.bidCount || 0}
                  </p>
                  <p className="text-xs font-bold staff-text-secondary uppercase tracking-widest mt-1">
                    {t.totalBids}
                  </p>
                </div>
              </div>
            </div>

            {/* Auction paintings gallery */}
            <div className="staff-card overflow-hidden">
              <div className="bg-[#f8f6f0] px-6 py-4 border-b border-[#e6e2da] flex items-center justify-between">
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
                          className="group bg-white border border-[#e6e2da] hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                          <div className="aspect-square relative overflow-hidden bg-gray-50 border-b border-[#e6e2da]">
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
                              <button className="p-1.5 bg-red-500 text-white hover:bg-red-600 shadow-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                <IconTrash className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Link 
                                href={`/dashboard/staff/auctions/painting-detail?id=${auctionPainting.auctionPaintingId}`}
                                className="bg-white text-gray-900 px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors"
                              >
                                {t.viewDetails}
                              </Link>
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <h4 className="font-bold staff-text-primary text-sm line-clamp-1 mb-1">
                              {painting.title}
                            </h4>
                            <div className="mt-auto space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.basePrice}</span>
                                <span className="text-xs font-black text-blue-600">
                                  {auctionPainting.basePrice?.toLocaleString()} VND
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.auctionDuration || "Duration"}</span>
                                <span className="text-xs font-black text-gray-600">
                                  {auctionPainting.auctionDurationMinutes || "--"} {t.minutes || "Min"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between border-t border-dashed border-[#e6e2da] pt-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.currentBid}</span>
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
                  <div className="text-center py-16 border-2 border-dashed border-[#e6e2da]">
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

      {/* Add Painting Modal / Dialog */}
      {showAddPaintingDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden rounded-xl border border-[#e6e2da]">
            <div className="p-6 border-b border-[#e6e2da] flex items-center justify-between bg-[#fcfbf9]">
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
              <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6 border-r border-[#e6e2da]">
                {/* Contest Selection Sidebar */}
                <div className="w-full lg:w-48 flex flex-col gap-4">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest staff-text-secondary">{t.chooseContest}</label>
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
                          <p className="text-[10px] font-black truncate">{contest.title}</p>
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
                          <div className="flex items-center gap-2 border-b border-dashed border-[#e6e2da] pb-2">
                            <IconTrophy className="h-3 w-3 text-orange-400" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest staff-text-secondary">{award.name}</h4>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[...(award.paintings || [])].sort((a, b) => {
                        const priority: Record<string, number> = { REOPEN: 1, ACCEPTED: 2, INAUCTION: 3, SOLD: 4 };
                        return (priority[a.status || ""] || 99) - (priority[b.status || ""] || 99);
                      }).map((painting) => {
                        const isSelected = selectedPaintingIds.includes(painting.paintingId);
                        const isAlreadyInAuction = auction.auctionPaintings?.some(
                          (ap) => ap.paintingId === painting.paintingId
                        ) || painting.status === "INAUCTION";
                        const isSold = painting.status === "SOLD";
                        const isAddable = (painting.status === "REOPEN" || painting.status === "ACCEPTED") && !isAlreadyInAuction;

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
                                <span className={`text-[8px] font-black text-white px-1.5 py-0.5 uppercase tracking-tighter rounded-sm ${
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
                                <span className="bg-black text-[8px] font-black text-white px-1.5 py-0.5 uppercase tracking-tighter rounded">
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
                              <p className="text-[9px] text-white font-bold truncate">{painting.title}</p>
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
              <div className="w-full lg:w-96 flex flex-col bg-[#fffdf9]">
                <div className="p-4 border-b border-[#e6e2da] bg-gray-50 flex items-center gap-2">
                   <div className="p-1.5 bg-blue-100 rounded">
                      <IconGavel className="h-4 w-4 text-blue-600" />
                   </div>
                   <h4 className="text-xs font-black uppercase tracking-widest staff-text-primary">{t.pricingConfiguration || "Pricing Config"}</h4>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedPaintingIds.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                      <IconPhoto className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-[10px] font-bold staff-text-secondary uppercase">{t.selectPaintingsToConfigure || "Select paintings to configure prices"}</p>
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
                              <div key={id} className="p-3 bg-white border border-[#e6e2da] rounded-lg shadow-sm space-y-3">
                                 <div className="flex items-center justify-between gap-2 border-b border-dashed border-gray-100 pb-2">
                                    <p className="text-[10px] font-black staff-text-primary truncate uppercase tracking-tighter">{title}</p>
                                    <button 
                                       onClick={() => setSelectedPaintingIds(prev => prev.filter(pId => pId !== id))}
                                       className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                                    >
                                       <IconX className="h-3 w-3" />
                                    </button>
                                 </div>
                                 <div className="grid grid-cols-1 gap-2">
                                    <div>
                                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5 block">{t.basePrice} (VND)</label>
                                       <input 
                                          type="text"
                                          value={formatVND(prices.basePrice)}
                                          onChange={(e) => handlePriceChange(id, "basePrice", e.target.value)}
                                          className="w-full px-2 py-1 text-xs border border-[#e6e2da] rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                          placeholder="1,000,000"
                                       />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                       <div>
                                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5 block">{t.auctionDuration || "Duration"}</label>
                                          <input 
                                             type="number"
                                             value={prices.auctionDurationMinutes || ""}
                                          onChange={(e) => handlePriceChange(id, "auctionDurationMinutes", e.target.value)}
                                             className="w-full px-2 py-1 text-xs border border-[#e6e2da] rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                             placeholder="15"
                                          />
                                       </div>
                                       <div>
                                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5 block">{t.bidStep || "Bid Step"}</label>
                                          <input 
                                             type="text"
                                             value={formatVND(prices.bidStep)}
                                             onChange={(e) => handlePriceChange(id, "bidStep", e.target.value)}
                                             className="w-full px-2 py-1 text-xs border border-[#e6e2da] rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                             placeholder="100,000"
                                          />
                                       </div>
                                    </div>
                                    <div>
                                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5 block">{t.ceilPrice || "Ceil Price"}</label>
                                       <input 
                                          type="text"
                                          value={formatVND(prices.ceilPrice)}
                                             onChange={(e) => handlePriceChange(id, "ceilPrice", e.target.value)}
                                          className="w-full px-2 py-1 text-xs border border-[#e6e2da] rounded focus:ring-1 focus:ring-blue-500 outline-none"
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

                <div className="p-4 border-t border-[#e6e2da] bg-white flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest staff-text-secondary">
                    <span>{t.selectedText}:</span>
                    <span className="text-blue-600">{selectedPaintingIds.length}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAddPaintingDialog(false)}
                      className="flex-1 staff-btn-outline py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900"
                    >
                      {t.cancel}
                    </button>
                    <button
                      disabled={selectedPaintingIds.length === 0 || addPaintingMutation.isPending}
                      onClick={handleAddPaintings}
                      className="flex-1 staff-btn-primary py-2 flex items-center justify-center gap-2 text-[10px]"
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
