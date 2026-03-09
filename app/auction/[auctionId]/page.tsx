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
    UPCOMING:  { label: "Sắp diễn ra",  className: "bg-blue-100 text-blue-800 border-blue-200" },
    ENDED:     { label: "Đã kết thúc",  className: "bg-gray-100 text-gray-600 border-gray-200" },
    CANCELLED: { label: "Đã hủy",       className: "bg-red-100 text-red-700 border-red-200" },
  };
  const { label, className } = map[status] ?? map.ENDED;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${className}`}>
      {status === "ACTIVE" && (
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
      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
        selected
          ? "border-[#f07d44] bg-orange-50"
          : "border-transparent hover:border-gray-200 bg-white"
      }`}
    >
      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        <img
          src={p.painting.imageUrl}
          alt={p.painting.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="font-black text-sm leading-tight line-clamp-1">{p.painting.title}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
          {fmt(p.currentPrice || p.startingPrice)}
        </p>
      </div>
      {selected && (
        <CheckCircle size={18} className="text-[#f07d44] flex-shrink-0 ml-auto" />
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

  // Local bid history for the selected painting (merged from WS + initial data)
  const [localBids, setLocalBids] = useState<Bid[]>([]);
  // Track current prices per painting
  const [prices, setPrices] = useState<Record<string, number>>({});
  // Selected painting index
  const [selectedIdx, setSelectedIdx] = useState(0);
  // Track if user has joined
  const [hasJoined, setHasJoined] = useState(false);

  // Initialize prices from API
  useEffect(() => {
    if (!auction?.paintings) return;
    const map: Record<string, number> = {};
    auction.paintings.forEach((p) => {
      map[p.auctionPaintingId] = p.currentPrice || p.startingPrice;
    });
    setPrices(map);
  }, [auction]);

  // WebSocket
  const handleBidPlaced = useCallback(
    (event: BidPlacedEvent) => {
      // Update price
      setPrices((prev) => ({
        ...prev,
        [event.auctionPaintingId]: event.amount,
      }));
      // Add to local bid list
      setLocalBids((prev) => [
        ...prev,
        {
          bidId: event.bidId,
          auctionId: event.auctionId,
          auctionPaintingId: event.auctionPaintingId,
          userId: event.userId,
          userName: event.userName,
          amount: event.amount,
          createdAt: event.createdAt,
        },
      ]);
    },
    []
  );

  const { isConnected, participantCount } = useAuctionSocket({
    auctionId,
    onBidPlaced: handleBidPlaced,
    onStatusChanged: () => refetch(),
  });

  const paintings = auction?.paintings ?? [];
  const selectedPainting = paintings[selectedIdx];
  const currentPrice = selectedPainting
    ? prices[selectedPainting.auctionPaintingId] ??
      selectedPainting.currentPrice ??
      selectedPainting.startingPrice
    : 0;

  // Bids for selected painting
  const visibleBids = localBids.filter(
    (b) => b.auctionPaintingId === selectedPainting?.auctionPaintingId
  );

  const countdownTarget =
    auction?.status === "ACTIVE" ? auction.endTime : (auction?.startTime ?? "");
  const countdown = useCountdown(countdownTarget);

  const handleBid = async (amount: number) => {
    if (!selectedPainting) return;
    await bidMutation.mutateAsync({
      auctionId,
      auctionPaintingId: selectedPainting.auctionPaintingId,
      amount,
    });
  };

  const handleJoin = async () => {
    await joinMutation.mutateAsync();
    setHasJoined(true);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
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
            {/* Participants */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold opacity-50">
              <Users size={14} />
              {participantCount > 0
                ? `${participantCount} người tham gia`
                : `${auction.participantCount ?? 0} người tham gia`}
            </div>

            {/* WS indicator */}
            <div
              className={`flex items-center gap-1.5 text-xs font-bold ${
                isConnected ? "text-green-600" : "text-gray-400"
              }`}
            >
              {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
              {isConnected ? "Kết nối" : "Offline"}
            </div>

            {/* Status */}
            <StatusBadge status={auction.status} />
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="pt-20 px-[5%] max-w-[1600px] mx-auto pb-20">
        {/* Hero */}
        <div className="py-10 md:py-16">
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
                  {auction.status === "ACTIVE"
                    ? "Kết thúc sau"
                    : "Bắt đầu sau"}
                </p>
                <p className="text-2xl font-black tracking-widest">{countdown}</p>
              </div>
            </div>
          )}
        </div>

        {/* Join button (show if not yet joined) */}
        {auction.status === "ACTIVE" && !hasJoined && (
          <div className="mb-10 p-6 bg-orange-50 border-2 border-[#f07d44]/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-black text-lg">Tham gia phiên đấu giá</p>
              <p className="text-sm opacity-60 mt-0.5">
                Bạn cần tham gia để có thể đặt giá
              </p>
            </div>
            <button
              onClick={handleJoin}
              disabled={joinMutation.isPending}
              className="bg-[#f07d44] hover:bg-[#d96a30] disabled:opacity-50 text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-orange-200 whitespace-nowrap"
            >
              {joinMutation.isPending ? "Đang tham gia…" : "Tham gia ngay"}
            </button>
          </div>
        )}

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Painting list */}
          <div className="lg:col-span-3 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">
              Các tác phẩm ({paintings.length})
            </p>
            {paintings.map((p, idx) => (
              <PaintingTab
                key={p.auctionPaintingId}
                p={{
                  ...p,
                  currentPrice: prices[p.auctionPaintingId] ?? p.currentPrice ?? p.startingPrice,
                }}
                selected={idx === selectedIdx}
                onClick={() => setSelectedIdx(idx)}
              />
            ))}
            {paintings.length === 0 && (
              <p className="text-sm opacity-40 italic">Chưa có tác phẩm nào</p>
            )}
          </div>

          {/* CENTER: Selected painting image */}
          <div className="lg:col-span-6">
            {selectedPainting ? (
              <div>
                <div className="aspect-[4/3] lg:aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl bg-gray-100 relative">
                  <img
                    src={selectedPainting.painting.imageUrl}
                    alt={selectedPainting.painting.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Live indicator */}
                  {auction.status === "ACTIVE" && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Live
                    </div>
                  )}
                  {/* Current price overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                      Giá hiện tại
                    </p>
                    <p className="text-3xl font-black text-white flex items-center gap-2">
                      {new Intl.NumberFormat("vi-VN").format(currentPrice)}đ
                      <TrendingUp size={20} className="text-[#f07d44]" />
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-1">
                    {selectedPainting.painting.title}
                  </h2>
                  {selectedPainting.painting.competitorName && (
                    <p className="text-sm text-[#f07d44] font-bold uppercase tracking-widest opacity-70">
                      {selectedPainting.painting.competitorName}
                    </p>
                  )}
                  {selectedPainting.painting.description && (
                    <p className="text-sm opacity-60 mt-3 leading-relaxed">
                      {selectedPainting.painting.description}
                    </p>
                  )}
                  <div className="mt-4 flex gap-6 text-xs">
                    <div>
                      <p className="font-bold uppercase tracking-widest opacity-40 mb-1">
                        Giá khởi điểm
                      </p>
                      <p className="font-black text-lg">
                        {new Intl.NumberFormat("vi-VN").format(
                          selectedPainting.startingPrice
                        )}đ
                      </p>
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-widest opacity-40 mb-1">
                        Lượt đặt giá
                      </p>
                      <p className="font-black text-lg">{visibleBids.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-white rounded-2xl flex items-center justify-center opacity-30">
                <p className="text-sm font-black uppercase tracking-widest">
                  Chọn tác phẩm
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Bid panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Bid form */}
            {selectedPainting && auction.status === "ACTIVE" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">
                  Đặt giá thầu
                </p>
                <BidForm
                  auctionId={auctionId}
                  auctionPaintingId={selectedPainting.auctionPaintingId}
                  currentPrice={currentPrice}
                  onBid={handleBid}
                  isLoading={bidMutation.isPending}
                  disabled={auction.status !== "ACTIVE"}
                />
              </div>
            )}

            {/* Bid history */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                  Lịch sử đặt giá
                </p>
                {isConnected && (
                  <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Trực tiếp
                  </span>
                )}
              </div>
              <BidHistory
                bids={visibleBids}
                highlightUserId={userId ?? undefined}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
