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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAuctionById, useJoinAuction, usePlaceBid } from "@/apis/auction";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import BidForm from "@/components/auction/BidForm";
import BidHistory from "@/components/auction/BidHistory";
import { Bid, BidPlacedEvent, AuctionPainting, AuctionStatus } from "@/types/auction";
import { formatDistanceToNow, intervalToDuration } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuthStore } from "@/store";

// ─── Countdown ───────────────────────────────────────────────────────────────
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      if (!targetDate) return;
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("00:00:00"); return; }
      const dur = intervalToDuration({ start: 0, end: diff });
      const hh = String((dur.hours ?? 0) + (dur.days ?? 0) * 24).padStart(2, "0");
      const mm = String(dur.minutes ?? 0).padStart(2, "0");
      const ss = String(dur.seconds ?? 0).padStart(2, "0");
      setTimeLeft(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AuctionStatus }) {
  const map: Record<AuctionStatus, { label: string; className: string }> = {
    ACTIVE:    { label: "Đang đấu giá", className: "bg-green-100 text-green-800 border-green-200" },
    ONGOING:   { label: "Đang diễn ra", className: "bg-green-100 text-green-800 border-green-200" },
    UPCOMING:  { label: "Sắp diễn ra",  className: "bg-blue-100 text-blue-800 border-blue-200" },
    PENDING:   { label: "Chờ phê duyệt", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    ENDED:     { label: "Đã kết thúc",  className: "bg-gray-100 text-gray-600 border-gray-200" },
    CANCELLED: { label: "Đã hủy",        className: "bg-red-100 text-red-700 border-red-200" },
  };
  const { label, className } = map[status] ?? map.ENDED;
  const isLive = status === "ACTIVE" || status === "ONGOING";
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
      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        <img
          src={p.painting.imageUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=200"}
          alt={p.painting.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-black text-sm leading-tight line-clamp-1">{p.painting.title}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
          {fmt(p.currentBid)}
        </p>
      </div>
      {selected && (
        <CheckCircle size={18} className="text-[#f07d44] flex-shrink-0" />
      )}
    </button>
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
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);

  // Initialize prices and join status from API
  useEffect(() => {
    if (!auction) return;
    
    if (auction.auctionPaintings) {
      const map: Record<string, number> = {};
      
      auction.auctionPaintings.forEach((p) => {
        const idStr = String(p.auctionPaintingId);
        map[idStr] = p.currentBid;
      });
      
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
  }, [auction, userId, hasJoined, localBids.length]);

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

  const { isConnected, participantCount } = useAuctionSocket({
    auctionId,
    onBidPlaced: handleBidPlaced,
    onStatusChanged: () => refetch(),
  });

  const paintings = auction?.auctionPaintings ?? [];
  const selectedPainting = paintings[selectedIdx];
  const selectedIdStr = selectedPainting ? String(selectedPainting.auctionPaintingId) : "";
  const currentPrice = selectedPainting
    ? prices[selectedIdStr] ?? selectedPainting.currentBid
    : 0;

  const visibleBids = localBids.filter(
    (b) => String(b.auctionPaintingId) === selectedIdStr
  );

  const isAuctionLive = auction?.status === "ACTIVE" || auction?.status === "ONGOING";
  const countdownTarget = isAuctionLive ? auction?.endTime : (auction?.startTime ?? "");
  const countdown = useCountdown(countdownTarget || "");

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

  const currentBidCount = visibleBids.length || (selectedPainting?.currentBidderId ? 1 : 0);

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
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#eae6e0]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1600px] mx-auto px-[5%] h-16 flex items-center justify-between">
          <Link href="/auction/list" className="flex items-center gap-2 text-sm font-black uppercase tracking-wider hover:text-[#f07d44] transition">
            <ArrowLeft size={18} />
            Danh sách
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold opacity-50">
              <Users size={14} />
              {participantCount > 0
                ? `${participantCount} người tham gia`
                : `${auction.participantCount ?? 0} người tham gia`}
            </div>

            <div className={`flex items-center gap-1.5 text-xs font-bold ${isConnected ? "text-green-600" : "text-gray-400"}`}>
              {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
              {isConnected ? "Kết nối" : "Offline"}
            </div>

            <StatusBadge status={auction.status} />
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="pt-24 px-[5%] max-w-[1600px] mx-auto pb-20">
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
            <div className="mt-6 inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-6 py-4 rounded-2xl">
              <Timer size={20} className="text-[#f07d44]" />
              <div>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                  {isAuctionLive ? "Kết thúc sau" : "Bắt đầu sau"}
                </p>
                <p className="text-2xl font-black tracking-widest">{countdown}</p>
              </div>
            </div>
          )}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Paintings list */}
          <div className="lg:col-span-3 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">
              Các tác phẩm ({paintings.length})
            </p>
            {paintings.map((p, idx) => (
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

          {/* CENTER: Image & Info */}
          <div className="lg:col-span-6">
            {selectedPainting ? (
              <div className="space-y-6">
                <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl bg-gray-100">
                  <img
                    src={selectedPainting.painting.imageUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800"}
                    alt={selectedPainting.painting.title}
                    className="w-full h-full object-cover"
                  />
                  {isAuctionLive && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Live
                    </div>
                  )}
                  {/* Price display with animation */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8">
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                      Giá hiện tại
                    </p>
                    <div className="flex items-center gap-3">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentPrice}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="text-4xl font-black text-[#f07d44]"
                        >
                          {new Intl.NumberFormat("vi-VN").format(currentPrice)}đ
                        </motion.div>
                      </AnimatePresence>
                      <TrendingUp size={24} className="text-white opacity-40" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
                    {selectedPainting.painting.title}
                  </h2>
                  <p className="text-sm text-[#f07d44] font-bold uppercase tracking-widest opacity-80 mb-4">
                    ID Họa sĩ: {selectedPainting.painting.competitorId}
                  </p>
                  <p className="text-sm opacity-60 leading-relaxed mb-6">
                    {selectedPainting.painting.description || "Không có mô tả cho tác phẩm này."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-100">
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
            {selectedPainting && isAuctionLive && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">
                  Phòng đấu giá
                </p>
                {hasJoined ? (
                  <BidForm
                    auctionId={String(auctionId)}
                    auctionPaintingId={String(selectedPainting.auctionPaintingId)}
                    currentPrice={currentPrice}
                    bidStep={selectedPainting.bidStep}
                    onBid={handleBid}
                    isLoading={bidMutation.isPending}
                    disabled={!isAuctionLive}
                  />
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-center opacity-60">Bạn cần tham gia để đặt giá thầu.</p>
                    <button
                      onClick={handleJoin}
                      disabled={joinMutation.isPending}
                      className="w-full bg-[#f07d44] hover:bg-[#d96a30] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition shadow-lg shadow-orange-100"
                    >
                      {joinMutation.isPending ? "Đang tham gia..." : "Tham gia ngay"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                  Lịch sử thầu
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
