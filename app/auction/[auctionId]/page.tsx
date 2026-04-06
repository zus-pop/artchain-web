"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Timer,
  Users,
  Wifi,
  WifiOff,
  TrendingUp,
  CheckCircle,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAuctionById, useJoinAuction, usePlaceBid, useGetBidHistory } from "@/apis/auction";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import BidForm from "@/components/auction/BidForm";
import BidHistory from "@/components/auction/BidHistory";
import AuctionHeader from "@/components/sections/AuctionHeader";
import {
  Bid,
  BidPlacedEvent,
  AuctionPainting,
  AuctionStatus,
  AuctionRealtimeStatus,
} from "@/types/auction";
// date-fns no longer needed for countdown
import { vi } from "date-fns/locale";
import { useAuthStore } from "@/store";

// ─── Countdown ───────────────────────────────────────────────────────────────
interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMinutes: number;
  isExpired: boolean;
}

function useCountdown(targetDate: string, serverTimeOffsetMs = 0): CountdownData {
  const [data, setData] = useState<CountdownData>({
    days: 0, hours: 0, minutes: 0, seconds: 0, totalMinutes: 0, isExpired: true,
  });

  useEffect(() => {
    const tick = () => {
      if (!targetDate) return;
      const diff = new Date(targetDate).getTime() - (Date.now() + serverTimeOffsetMs);
      if (diff <= 0) {
        setData({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMinutes: 0, isExpired: true });
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      setData({
        days,
        hours,
        minutes,
        seconds,
        totalMinutes: Math.floor(totalSec / 60),
        isExpired: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate, serverTimeOffsetMs]);

  return data;
}

interface PaintingTimingState {
  auctionStartTime?: string;
  auctionEndTime?: string;
}

// ─── Format countdown ────────────────────────────────────────────────────────
function formatCountdown(cd: CountdownData): string {
  if (cd.isExpired) return "Đã kết thúc";
  const pad = (n: number) => String(n).padStart(2, "0");

  if (cd.days > 0) {
    // >= 24h: "2 ngày 03:15:42"
    return `${cd.days} ngày ${pad(cd.hours)}:${pad(cd.minutes)}:${pad(cd.seconds)}`;
  }
  if (cd.hours > 0) {
    // >= 1h: "03:15:42"
    return `${pad(cd.hours)}:${pad(cd.minutes)}:${pad(cd.seconds)}`;
  }
  // < 1h: "15:42"
  return `${pad(cd.minutes)}:${pad(cd.seconds)}`;
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AuctionStatus }) {
  const map: Record<AuctionStatus, { label: string; className: string }> = {
    ACTIVE:    { label: "Đang đấu giá", className: "bg-green-100 text-green-800 border-green-200" },
    LIVE:      { label: "Đang trực tiếp", className: "bg-orange-100 text-orange-800 border-orange-200" },
    ONGOING:   { label: "Đang diễn ra", className: "bg-green-100 text-green-800 border-green-200" },
    UPCOMING:  { label: "Sắp diễn ra",  className: "bg-blue-100 text-blue-800 border-blue-200" },
    PENDING:   { label: "Chờ phê duyệt", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    DRAFT:     { label: "Bản nháp", className: "bg-gray-100 text-gray-500 border-gray-200" },
    ENDED:     { label: "Đã kết thúc",  className: "bg-gray-100 text-gray-600 border-gray-200" },
    END:       { label: "Kết thúc",  className: "bg-gray-100 text-gray-600 border-gray-200" },
    CANCELLED: { label: "Đã hủy",        className: "bg-red-100 text-red-700 border-red-200" },
  };
  const { label, className } = map[status] ?? map.ENDED;
  const isLive = status === "ACTIVE" || status === "ONGOING" || status === "LIVE";
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${className}`}>
      {isLive && (
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      )}
      {label}
    </span>
  );
}

// ─── Painting selector tab ─────────────────────────────────────────────────
function PaintingTab({
  p,
  selected,
  onClick,
}: {
  p: AuctionPainting;
  selected: boolean;
  onClick: () => void;
}) {
  const fmt = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
        selected
          ? "border-[#f07d44] bg-orange-50"
          : "border-transparent hover:border-gray-200 bg-white"
      }`}
    >
      <div className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 ${p.status === "WAITING" ? "grayscale opacity-50" : ""}`}>
        <img
          src={p.painting.imageUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=200"}
          alt={p.painting.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-black text-xs leading-tight line-clamp-1 ${p.status === "WAITING" ? "opacity-40" : ""}`}>{p.painting.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className={`text-[10px] font-bold uppercase tracking-wider ${p.status === "WAITING" ? "text-gray-400" : "text-[#f07d44]"}`}>
            {fmt(p.currentBid)}
          </p>
          {p.status === "LIVE" ? (
             <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          ) : (
             <span className="text-[8px] font-black uppercase text-gray-400">Chờ</span>
          )}
        </div>
      </div>
      {selected && (
        <CheckCircle size={18} className="text-[#f07d44] flex-shrink-0" />
      )}
    </button>
  );
}
// ─── Number ticker ────────────────────────────────────────────────────────
function RollingNumber({ value }: { value: number }) {
  const digits = String(new Intl.NumberFormat("vi-VN").format(value)).split("");
  
  return (
    <div className="flex overflow-hidden">
      {digits.map((digit, i) => (
        <span key={`${i}-${digit}`} className="inline-block relative">
           <AnimatePresence mode="popLayout">
             <motion.span
               key={digit}
               initial={{ y: "100%", opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: "-100%", opacity: 0 }}
               transition={{ 
                 duration: 0.5, 
                 type: "spring", 
                 stiffness: 200, 
                 damping: 20 
               }}
               className="inline-block"
             >
               {digit}
             </motion.span>
           </AnimatePresence>
        </span>
      ))}
      <span className="ml-1 tracking-normal">₫</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AuctionDetailPage() {
  const { auctionId } = useParams<{ auctionId: string }>();
  const { data: auction, isLoading, refetch } = useGetAuctionById(auctionId);
  const joinMutation = useJoinAuction(auctionId);
  const bidMutation = usePlaceBid();
  const { user } = useAuthStore();
  const userId = user?.userId;

  const [localBids, setLocalBids] = useState<Bid[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [paintingTimings, setPaintingTimings] = useState<
    Record<string, PaintingTimingState>
  >({});
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);

  // Initialize prices and join status from API
  useEffect(() => {
    if (!auction) return;
    
    if (auction.auctionPaintings) {
      const map: Record<string, number> = {};
      const timingMap: Record<string, PaintingTimingState> = {};
      
      auction.auctionPaintings.forEach((p) => {
        const idStr = String(p.auctionPaintingId);
        map[idStr] = p.currentBid;
        timingMap[idStr] = {
          auctionStartTime: p.auctionStartTime,
          auctionEndTime: p.auctionEndTime,
        };
      });

      setPaintingTimings((prev) => ({ ...timingMap, ...prev }));
      
      // Update prices from API (only if the new value is strictly greater)
      setPrices((prev) => {
        const next = { ...prev };
        let changed = false;
        Object.keys(map).forEach(id => {
          const apiVal = map[id];
          const currentVal = prev[id] || 0;
          if (apiVal > currentVal) {
            next[id] = apiVal;
            changed = true;
          }
        });
        return changed ? next : prev;
      });

      // Initialize local bids only if empty
      if (localBids.length === 0) {
        const initialBids: Bid[] = [];
        auction.auctionPaintings.forEach((p) => {
          if (p.currentBidderId && p.currentBid) {
            initialBids.push({
              bidId: `initial-${p.auctionPaintingId}`,
              auctionId: String(auction.auctionId),
              auctionPaintingId: String(p.auctionPaintingId),
              userId: p.currentBidderId,
              userName: p.currentBidder?.fullName || p.currentBidder?.username || `Người dùng #${p.currentBidderId.slice(-4)}`,
              amount: p.currentBid,
              createdAt: p.updatedAt || auction.updatedAt || new Date().toISOString(),
            });
          }
        });
        if (initialBids.length > 0) {
          setLocalBids(initialBids);
        }
      }
    }

    if (userId && auction.auctionParticipants) {
      const joined = auction.auctionParticipants.some(p => p.userId === userId);
      if (joined !== hasJoined) {
        setHasJoined(joined);
      }
    }
  }, [auction, userId, hasJoined]); // Removed localBids.length from deps to avoid unnecessary loops


  const handleBidPlaced = useCallback(
    (event: BidPlacedEvent) => {
      const idStr = String(event.auctionPaintingId);
      
      // 1. Update price for animation
      setPrices((prev) => {
        return {
          ...prev,
          [idStr]: event.amount,
        };
      });

      if (event.paintingAuctionEndTime) {
        setPaintingTimings((prev) => ({
          ...prev,
          [idStr]: {
            ...prev[idStr],
            auctionEndTime: event.paintingAuctionEndTime ?? undefined,
          },
        }));
      }

      // 2. Add to bid history with duplicate check
      setLocalBids((prev) => {
        if (prev.some(b => b.bidId === event.bidId)) {
          return prev;
        }

        // Try to find the username from participants list
        let resolvedUserName = event.userName;
        if (!resolvedUserName && auction?.auctionParticipants) {
          const participant = auction.auctionParticipants.find(p => p.userId === event.userId);
          resolvedUserName = participant?.user?.fullName || participant?.user?.username || participant?.fullName;
        }

        return [
          {
            bidId: event.bidId,
            auctionId: String(event.auctionId),
            auctionPaintingId: idStr,
            userId: event.userId,
            userName: resolvedUserName,
            amount: event.amount,
            createdAt: event.createdAt,
          },
          ...prev,
        ];
      });
    },
    [auction?.auctionParticipants]
  );

  const handleAuctionStatus = useCallback((status: AuctionRealtimeStatus) => {
    if (!Array.isArray(status?.paintings)) {
      return;
    }

    setPaintingTimings((prev) => {
      const next = { ...prev };

      for (const painting of status.paintings ?? []) {
        if (!painting?.auctionPaintingId) {
          continue;
        }

        const idStr = String(painting.auctionPaintingId);
        next[idStr] = {
          ...next[idStr],
          auctionStartTime: painting.auctionStartTime ?? next[idStr]?.auctionStartTime,
          auctionEndTime: painting.auctionEndTime ?? next[idStr]?.auctionEndTime,
        };
      }

      return next;
    });
  }, []);

  const {
    isConnected,
    participantCount,
    serverTimeOffsetMs,
    requestAuctionStatus,
  } = useAuctionSocket({
    auctionId,
    onBidPlaced: handleBidPlaced,
    onStatusChanged: () => refetch(),
    onAuctionStatus: handleAuctionStatus,
  });

  useEffect(() => {
    if (!isConnected) return;

    const intervalId = setInterval(() => {
      requestAuctionStatus();
    }, 60000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        requestAuctionStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isConnected, requestAuctionStatus]);

  const paintings = auction?.auctionPaintings ?? [];
  const selectedPainting = paintings[selectedIdx];
  const selectedIdStr = selectedPainting ? String(selectedPainting.auctionPaintingId) : "";
  const currentPrice = selectedPainting
    ? prices[selectedIdStr] ?? selectedPainting.currentBid
    : 0;

  // Fetch real bid history for selected painting
  const { data: historyBids } = useGetBidHistory(
    String(auctionId),
    selectedPainting?.paintingId || ""
  );

  // Sync local bids with history when painting changes
  useEffect(() => {
    if (historyBids) {
      setLocalBids(historyBids);
    }
  }, [historyBids]);

  const visibleBids = localBids.filter(
    (b) => String(b.auctionPaintingId) === selectedIdStr
  );

  const isAuctionLive = auction?.status === "ACTIVE" || auction?.status === "ONGOING" || auction?.status === "LIVE";
  
  // Use painting-specific status for more accurate live state
  const isPaintingLive = selectedPainting?.status === "LIVE";
  const isPaintingWaiting = selectedPainting?.status === "WAITING";
  const selectedTiming = selectedPainting
    ? paintingTimings[String(selectedPainting.auctionPaintingId)]
    : undefined;
  const resolvedPaintingEndTime =
    selectedTiming?.auctionEndTime ?? selectedPainting?.auctionEndTime;
  const resolvedPaintingStartTime =
    selectedTiming?.auctionStartTime ?? selectedPainting?.auctionStartTime;
  
  // Logic for countdown target: 
  // - If painting is live -> count to its end time
  // - If painting is waiting -> count to its start time
  // - Fallback to auction general times
  const countdownTarget = isPaintingLive 
    ? resolvedPaintingEndTime
    : (isPaintingWaiting ? resolvedPaintingStartTime : (isAuctionLive ? auction?.endTime : (auction?.startTime ?? "")));
  
  const countdown = useCountdown(countdownTarget || "", serverTimeOffsetMs);

  const handleBid = async (amount: number) => {
    if (!selectedPainting) return;
    await bidMutation.mutateAsync({
      auctionPaintingId: selectedPainting.auctionPaintingId,
      bidAmount: amount,
    });
  };

  const handleJoin = async () => {
    await joinMutation.mutateAsync();
    setHasJoined(true);
  };

  const currentBidCount = visibleBids.length;
  
  // Detect if current user is leading
  const highestBid = visibleBids[0]; // Bids are sorted descending by hook mapping
  const isHighestBidder = !!userId && (
    (highestBid && String(highestBid.userId) === String(userId)) || 
    (!highestBid && selectedPainting?.currentBidderId === userId)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eae6e0] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#f07d44] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-black uppercase tracking-widest text-sm opacity-40">
            Đang tải phiên đấu giá…
          </p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-[#eae6e0] flex items-center justify-center">
        <div className="text-center opacity-40">
          <p className="text-2xl font-black uppercase">Không tìm thấy phiên đấu giá</p>
          <Link href="/auction/list" className="mt-4 inline-block text-sm underline">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eae6e0] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white">
      <AuctionHeader />

      {/* ── Status & Info Bar (Below Header) ────────────────────────────────── */}
      <div className="pt-24 px-[5%] max-w-[1600px] mx-auto flex items-center justify-between opacity-60">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
            <User size={14} className="text-[#f07d44]" />
            {participantCount > 0
              ? `${participantCount} người tham gia`
              : `${auction.participantCount ?? 0} người tham gia`}
          </div>

          <div className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${isConnected ? "text-green-600" : "text-gray-400"}`}>
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isConnected ? "Kết nối" : "Offline"}
          </div>
        </div>
        <StatusBadge status={auction.status} />
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="pt-8 px-[5%] max-w-[1600px] mx-auto pb-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-3">
            {auction.title}
          </h1>
          {auction.description && (
            <p className="text-sm opacity-60 max-w-2xl leading-relaxed">
              {auction.description}
            </p>
          )}

          {/* Countdown */}
          {countdownTarget && (
            <div className={`mt-6 inline-flex items-center gap-3 ${isPaintingWaiting ? "bg-orange-100 text-orange-900" : "bg-[#1a1a1a] text-white"} px-6 py-4 rounded-2xl transition-colors`}>
              <Timer size={20} className={isPaintingWaiting ? "text-orange-600" : "text-[#f07d44]"} />
              <div>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest flex items-center gap-2">
                  <span>{isPaintingLive ? "Kết thúc sau" : (isPaintingWaiting ? "Bắt đầu sau" : (isAuctionLive ? "Kết thúc sau" : "Bắt đầu sau"))}</span>
                  {selectedPainting?.auctionDurationMinutes && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-current opacity-20" />
                      {/* <span></span> */}
                    </>
                  )}
                </p>
                <p className="text-2xl font-black tracking-widest">{formatCountdown(countdown)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Paintings list */}
          <div className="lg:col-span-3 space-y-6">
            {/* Live Section */}
            {paintings.some(p => p.status === "LIVE") && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f07d44] mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f07d44] animate-pulse" />
                  Đang đấu giá
                </p>
                {paintings.map((p, idx) => p.status === "LIVE" && (
                  <PaintingTab
                    key={p.auctionPaintingId}
                    p={{
                      ...p,
                      currentBid: prices[String(p.auctionPaintingId)] ?? p.currentBid,
                    }}
                    selected={idx === selectedIdx}
                    onClick={() => setSelectedIdx(idx)}
                  />
                ))}
              </div>
            )}

            {/* Waiting Section */}
            {paintings.some(p => p.status === "WAITING" || !p.status) && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">
                  Chờ đấu ({paintings.filter(p => p.status === "WAITING" || !p.status).length})
                </p>
                {paintings.map((p, idx) => (p.status === "WAITING" || !p.status) && (
                  <PaintingTab
                    key={p.auctionPaintingId}
                    p={{
                      ...p,
                      currentBid: prices[String(p.auctionPaintingId)] ?? p.currentBid,
                    }}
                    selected={idx === selectedIdx}
                    onClick={() => setSelectedIdx(idx)}
                  />
                ))}
              </div>
            )}

            {/* Ended Section */}
            {paintings.some(p => p.status === "ENDED" || p.status === "SOLD") && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-3">
                  Đã kết thúc
                </p>
                {paintings.map((p, idx) => (p.status === "ENDED" || p.status === "SOLD") && (
                  <PaintingTab
                    key={p.auctionPaintingId}
                    p={{
                      ...p,
                      currentBid: prices[String(p.auctionPaintingId)] ?? p.currentBid,
                    }}
                    selected={idx === selectedIdx}
                    onClick={() => setSelectedIdx(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CENTER: Image & Info */}
          <div className="lg:col-span-6">
            {selectedPainting ? (
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-100">
                  <img
                    src={selectedPainting.painting.imageUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800"}
                    alt={selectedPainting.painting.title}
                    className="w-full h-auto block"
                  />
                  {isPaintingLive && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Live
                    </div>
                  )}
                  {isPaintingWaiting && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-gray-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Waiting
                    </div>
                  )}
                  {/* Price display with animation */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8">
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                      Giá hiện tại
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="text-4xl font-black text-[#f07d44] leading-none">
                        <RollingNumber value={currentPrice} />
                      </div>
                      <TrendingUp size={24} className="text-white opacity-40" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
                    {selectedPainting.painting.title}
                  </h2>
                  {/* <p className="text-sm text-[#f07d44] font-bold uppercase tracking-widest opacity-80 mb-4">
                    ID Họa sĩ: {selectedPainting.painting.competitorId}
                  </p> */}
                  <p className="text-sm opacity-60 leading-relaxed mb-6">
                    {selectedPainting.painting.description || "Không có mô tả cho tác phẩm này."}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Giá khởi điểm</p>
                      <p className="text-xl font-black">{new Intl.NumberFormat("vi-VN").format(selectedPainting.basePrice)}đ</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Lượt đặt giá</p>
                      <p className="text-xl font-black">{currentBidCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-white rounded-2xl flex items-center justify-center opacity-30 border-2 border-dashed border-gray-300">
                <p className="font-black uppercase tracking-widest">Chọn tác phẩm để xem</p>
              </div>
            )}
          </div>

          {/* RIGHT: Bidding Panel */}
          <div className="lg:col-span-3 space-y-6">
            {selectedPainting && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">
                  Phòng đấu giá
                </p>
                {(() => {
                  if (isPaintingWaiting) {
                    return (
                      <div className="text-center py-8 px-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                         <Timer size={32} className="mx-auto text-gray-300 mb-3" />
                         <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">Đang đợi</p>
                         <p className="text-[10px] opacity-40 leading-relaxed">Vui lòng đợi đến lượt đấu<br/>cho tác phẩm này.</p>
                      </div>
                    );
                  }

                  if (!isPaintingLive && !isAuctionLive) {
                     return (
                      <div className="text-center py-8 px-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                         <div className="text-2xl font-black opacity-10 mb-2">OFF</div>
                         <p className="text-xs font-black uppercase tracking-widest opacity-40">Phiên đấu giá chưa mở</p>
                      </div>
                    );
                  }

                  const isParticipant =
                    hasJoined ||
                    (!!userId &&
                      !!auction?.auctionParticipants?.some(
                        (p) => String(p.userId) === String(userId)
                      ));

                  if (isParticipant) {
                    return (
                      <BidForm
                        auctionId={String(auctionId)}
                        auctionPaintingId={String(
                          selectedPainting.auctionPaintingId
                        )}
                        currentPrice={currentPrice}
                        bidStep={selectedPainting.bidStep}
                        isHighestBidder={isHighestBidder}
                        onBid={handleBid}
                        isLoading={bidMutation.isPending}
                        disabled={!isPaintingLive}
                      />
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <p className="text-xs text-center opacity-60">
                        {userId
                          ? "Bạn cần tham gia để đặt giá."
                          : "Vui lòng đăng nhập để tham gia đấu giá."}
                      </p>
                      {userId ? (
                        <button
                          onClick={handleJoin}
                          disabled={joinMutation.isPending}
                          className="w-full bg-[#f07d44] hover:bg-[#d96a30] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition shadow-lg shadow-orange-100 disabled:opacity-50"
                        >
                          {joinMutation.isPending
                            ? "Đang tham gia..."
                            : "Tham gia ngay"}
                        </button>
                      ) : (
                        <Link
                          href="/auth"
                          className="block w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl font-black text-sm text-center uppercase tracking-widest transition shadow-lg"
                        >
                          Đăng nhập
                        </Link>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                  Lịch sử
                </p>
                {isConnected && (
                  <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </div>
                )}
              </div>
              <BidHistory
                bids={visibleBids}
                highlightUserId={userId}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
