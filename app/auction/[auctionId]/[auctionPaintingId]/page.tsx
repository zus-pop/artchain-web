"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Timer,
  Users,
  Wifi,
  WifiOff,
  TrendingUp,
  CheckCircle,
  Info,
  Calendar,
  MessageSquare,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAuctionById, useJoinAuction, usePlaceBid, useGetBidHistory } from "@/apis/auction";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import BidForm from "@/components/auction/BidForm";
import BidHistory from "@/components/auction/BidHistory";
import {
  Bid,
  BidPlacedEvent,
  AuctionPainting,
  AuctionStatus,
  AuctionRealtimeStatus,
} from "@/types/auction";
import { intervalToDuration } from "date-fns";
import { useAuthStore } from "@/store";
import AuctionHeader from "@/components/sections/AuctionHeader";

// ─── Countdown ───────────────────────────────────────────────────────────────
function useCountdown(targetDate: string, serverTimeOffsetMs = 0) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const tick = () => {
      if (!targetDate) return;
      const diff = new Date(targetDate).getTime() - (Date.now() + serverTimeOffsetMs);
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
  }, [targetDate, serverTimeOffsetMs]);
  return timeLeft;
}

interface PaintingTimingState {
  auctionStartTime?: string;
  auctionEndTime?: string;
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AuctionStatus }) {
  const map: Record<AuctionStatus, { label: string; className: string }> = {
    ACTIVE:    { label: "Đang đấu giá", className: "bg-green-100 text-green-800 border-green-200" },
    LIVE:      { label: "Trực tiếp", className: "bg-orange-100 text-orange-800 border-orange-200" },
    ONGOING:   { label: "Diễn ra", className: "bg-green-100 text-green-800 border-green-200" },
    UPCOMING:  { label: "Sắp diễn ra",  className: "bg-blue-100 text-blue-800 border-blue-200" },
    PENDING:   { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    DRAFT:     { label: "Nháp", className: "bg-gray-100 text-gray-500 border-gray-200" },
    ENDED:     { label: "Kết thúc",  className: "bg-gray-100 text-gray-600 border-gray-200" },
    END:       { label: "Kết thúc",  className: "bg-gray-100 text-gray-600 border-gray-200" },
    CANCELLED: { label: "Đã hủy",        className: "bg-red-100 text-red-700 border-red-200" },
  };
  const { label, className } = map[status] ?? map.ENDED;
  const isLive = status === "ACTIVE" || status === "ONGOING" || status === "LIVE";
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${className}`}>
      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
      {label}
    </span>
  );
}

// ─── Bidding Page ─────────────────────────────────────────────────────────────
export default function BiddingPage() {
  const { auctionId, auctionPaintingId } = useParams<{ auctionId: string; auctionPaintingId: string }>();
  const router = useRouter();
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
  const [hasJoined, setHasJoined] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Core painting logic
  const paintings = auction?.auctionPaintings ?? [];
  const selectedPainting = paintings.find(p => String(p.auctionPaintingId) === String(auctionPaintingId));
  
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
      setPrices(prev => ({ ...prev, ...map }));
    }
  }, [auction]);

  const handleBidPlaced = useCallback(
    (event: BidPlacedEvent) => {
      const idStr = String(event.auctionPaintingId);
      setPrices(prev => ({ ...prev, [idStr]: event.amount }));

      if (event.paintingAuctionEndTime) {
        setPaintingTimings((prev) => ({
          ...prev,
          [idStr]: {
            ...prev[idStr],
            auctionEndTime: event.paintingAuctionEndTime ?? undefined,
          },
        }));
      }

      if (idStr === String(auctionPaintingId)) {
        setLocalBids(prev => {
          if (prev.some(b => b.bidId === event.bidId)) return prev;
          return [{
            bidId: event.bidId,
            auctionId: String(event.auctionId),
            auctionPaintingId: idStr,
            userId: event.userId,
            userName: event.userName,
            amount: event.amount,
            createdAt: event.createdAt,
          }, ...prev];
        });
      }
    },
    [auctionPaintingId]
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

  const { isConnected, serverTimeOffsetMs, requestAuctionStatus } = useAuctionSocket({
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

    return () => clearInterval(intervalId);
  }, [isConnected, requestAuctionStatus]);

  const { data: historyBids } = useGetBidHistory(String(auctionId), selectedPainting?.paintingId || "");
  useEffect(() => { if (historyBids) setLocalBids(historyBids); }, [historyBids]);

  const selectedTiming = selectedPainting
    ? paintingTimings[String(selectedPainting.auctionPaintingId)]
    : undefined;
  const countdownTarget =
    selectedPainting?.status === "LIVE"
      ? selectedTiming?.auctionEndTime ?? selectedPainting?.auctionEndTime
      : selectedTiming?.auctionStartTime ?? selectedPainting?.auctionStartTime;
  const countdown = useCountdown(countdownTarget || "", serverTimeOffsetMs);
  const currentPrice = prices[String(auctionPaintingId)] ?? selectedPainting?.currentBid ?? 0;
  const isHighestBidder = !!userId && ((localBids[0] && String(localBids[0].userId) === String(userId)) || (!localBids[0] && selectedPainting?.currentBidderId === userId));
  const isPaintingLive = selectedPainting?.status === "LIVE";
  const isPaintingWaiting = selectedPainting?.status === "WAITING";

  const handleBid = async (amount: number) => {
    if (!selectedPainting) return;
    await bidMutation.mutateAsync({ auctionPaintingId: selectedPainting.auctionPaintingId, bidAmount: amount });
  };

  const handleJoin = async () => { await joinMutation.mutateAsync(); setHasJoined(true); };

  if (isLoading) return <div className="min-h-screen bg-[#eae6e0] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#f07d44] border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  if (!auction || !selectedPainting) return <div className="min-h-screen bg-[#eae6e0] flex items-center justify-center flex-col gap-4 text-sm font-black uppercase opacity-40">Tác phẩm không tồn tại <Link href={`/auction/${auctionId}`} className="underline">Quay lại Gallery</Link></div>;

  return (
    <div className="min-h-screen bg-[#eae6e0] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white">
      <AuctionHeader />
      <main className="pt-32 px-[5%] max-w-[1600px] mx-auto pb-20">
        
        {/* Main Focused Layout */}
        <div className="relative min-h-[700px]">
          <motion.div layout className="w-full">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
              
              <div className="xl:col-span-7 space-y-6">
                <div className="relative aspect-video w-full overflow-hidden rounded-[2.5rem] shadow-2xl bg-white group">
                  <img src={selectedPainting.painting.imageUrl || ""} alt={selectedPainting.painting.title} className="w-full h-full object-cover" />
                  <button onClick={() => setShowInfo(!showInfo)} className="absolute top-6 right-6 z-20 p-2.5 bg-white/60 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg active:scale-90"><Info size={22} className="text-black" /></button>
                  <AnimatePresence>
                    {showInfo && (
                      <motion.div initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(12px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)" }} className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center p-12 text-white text-center">
                         <div className="max-w-md w-full space-y-6">
                            <h3 className="text-2xl font-black uppercase tracking-tight">Chi tiết tác phẩm</h3>
                            <p className="text-sm opacity-80 leading-relaxed font-medium">{selectedPainting.painting.description || "Tác phẩm nghệ thuật độc bản."}</p>
                            <button onClick={() => setShowInfo(false)} className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl">Quay lại</button>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isPaintingLive && (
                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-8 px-6 pt-2 opacity-40">
                   <div className="flex items-center gap-2.5 text-xs font-black"><Users size={16} /><span>Bids : {localBids.length}</span></div>
                   <div className="flex items-center gap-2.5 text-xs font-black"><User size={16} className="text-[#f07d44]" /><span>{auction.auctionParticipants?.length || 0} người tham gia</span></div>
                   <div className="flex items-center gap-2.5 text-xs font-black"><Calendar size={16} /><span>Ends : {selectedPainting.auctionEndTime ? new Date(selectedPainting.auctionEndTime).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' }) : "---"}</span></div>
                </div>
                <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-[2.5rem] p-8 shadow-sm">
                  <div className="flex flex-col gap-1 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Giá hiện tại</span>
                    <span className="text-4xl font-black tracking-tighter text-[#f07d44]">{new Intl.NumberFormat("vi-VN").format(currentPrice)}đ</span>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-black/5">
                    <div className="flex-1"><p className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-1">Bước giá</p><p className="text-sm font-black text-black">+{new Intl.NumberFormat("vi-VN").format(selectedPainting.bidStep || 0)}đ</p></div>
                    <div className="flex-1 border-l border-black/5 pl-4"><p className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-1">Khởi điểm</p><p className="text-sm font-black text-black">{new Intl.NumberFormat("vi-VN").format(selectedPainting.basePrice || 0)}đ</p></div>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-5 space-y-10">
                <h2 className="text-4xl font-black tracking-tight leading-[1.1] text-[#1a1a1a]">{selectedPainting.painting.title}</h2>
                <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#f07d44]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f07d44] mb-8 relative z-10">Thực hiện đặt giá</p>
                  <div className="relative z-10">
                    {(() => {
                       if (isPaintingWaiting) return <div className="text-center py-8 opacity-40"><Timer size={32} className="mx-auto mb-4" /><p className="text-[10px] font-black uppercase tracking-widest">Đang chờ phiên đấu giá</p></div>;
                       const isParticipant = hasJoined || (!!userId && !!auction?.auctionParticipants?.some(p => String(p.userId) === String(userId)));
                       if (isParticipant) return <BidForm auctionId={String(auctionId)} auctionPaintingId={String(selectedPainting.auctionPaintingId)} currentPrice={currentPrice} bidStep={selectedPainting.bidStep} isHighestBidder={isHighestBidder} onBid={handleBid} isLoading={bidMutation.isPending} disabled={!isPaintingLive} />;
                       return <button onClick={handleJoin} className="w-full bg-[#f07d44] hover:bg-[#ff8e5a] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95">Đăng ký Tham gia Đấu giá</button>;
                    })()}
                  </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6">Lịch sử </p>
                   <div className="max-h-[160px] overflow-y-auto custom-scrollbar pr-2"><BidHistory bids={localBids} highlightUserId={userId} /></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 pt-10 border-t border-black/5 flex flex-wrap items-center justify-between gap-6 opacity-30">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"><User size={16} className="text-[#f07d44]" /><span>{auction.auctionParticipants?.length || 0} người tham gia</span></div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"><div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-400"}`} /><span>{isConnected ? "Kết nối trực tiếp" : "Mất kết nối"}</span></div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest leading-none">{auction.title}</p>
        </div>
      </main>
    </div>
  );
}
