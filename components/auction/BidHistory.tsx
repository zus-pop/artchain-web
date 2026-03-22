"use client";
import React, { useEffect, useRef } from "react";
import { Bid } from "@/types/auction";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { TrendingUp } from "lucide-react";

interface BidHistoryProps {
  bids: Bid[];
  highlightUserId?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

export default function BidHistory({ bids, highlightUserId }: BidHistoryProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new bids come in
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [bids.length]);

  if (bids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center opacity-40">
        <TrendingUp size={32} className="mb-3" />
        <p className="text-sm font-bold uppercase tracking-widest">Chưa có lượt đặt giá nào</p>
        <p className="text-xs mt-1">Hãy là người đầu tiên!</p>
      </div>
    );
  }

  const sorted = [...bids].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div
      ref={listRef}
      className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1 scroll-smooth"
    >
      {sorted.map((bid, idx) => {
        const isHighlighted = bid.userId === highlightUserId;
        const isLatest = idx === 0;
        return (
          <div
            key={bid.bidId}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
              isLatest
                ? "bg-[#f07d44] text-white shadow-md shadow-orange-200"
                : isHighlighted
                ? "bg-orange-50 border border-[#f07d44]/30"
                : "bg-gray-50"
            }`}
          >
            <div className="flex flex-col">
              <span className={`font-black ${isLatest ? "text-white" : "text-[#1a1a1a]"}`}>
                {bid.userName || (bid.userId ? `Người dùng #${bid.userId.slice(-4)}` : "Đang tải...") }
              </span>
              <span
                className={`text-[10px] font-medium uppercase tracking-wider ${
                  isLatest ? "text-white/70" : "text-gray-400"
                }`}
              >
                {formatDistanceToNow(new Date(bid.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {isLatest && <TrendingUp size={14} className="opacity-80" />}
              <span className={`font-black text-base ${isLatest ? "text-white" : "text-[#f07d44]"}`}>
                {fmt(bid.amount)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
