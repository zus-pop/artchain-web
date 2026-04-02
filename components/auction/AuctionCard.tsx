"use client";
import React from "react";
import Link from "next/link";
import { Timer, Hammer, Eye, TrendingUp } from "lucide-react";
import { Auction, AuctionStatus } from "@/types/auction";
import { formatDistanceToNow, isPast } from "date-fns";
import { vi } from "date-fns/locale";

interface AuctionCardProps {
  auction: Auction;
}

const STATUS_CONFIG: Record<
  AuctionStatus,
  { label: string; className: string; dot: string }
> = {
  DRAFT: {
    label: "BẢN NHÁP",
    className: "bg-slate-500 text-white",
    dot: "bg-slate-200",
  },
  PENDING: {
    label: "CHỜ PHÊ DUYỆT",
    className: "bg-yellow-500 text-white",
    dot: "bg-yellow-400",
  },
  UPCOMING: {
    label: "SẮP DIỄN RA",
    className: "bg-blue-500 text-white",
    dot: "bg-blue-400",
  },
  ACTIVE: {
    label: "ĐANG ĐẤU GIÁ",
    className: "bg-green-500 text-white",
    dot: "bg-white animate-pulse",
  },
  ONGOING: {
    label: "ĐANG DIỄN RA",
    className: "bg-green-600 text-white",
    dot: "bg-white animate-pulse",
  },
  ENDED: {
    label: "ĐÃ KẾT THÚC",
    className: "bg-gray-400 text-white",
    dot: "bg-white",
  },
  CANCELLED: {
    label: "ĐÃ HỦY",
    className: "bg-red-500 text-white",
    dot: "bg-white",
  },
  LIVE: {
    label: "ĐANG ĐẤU GIÁ",
    className: "bg-green-500 text-white",
    dot: "bg-white animate-pulse",
  },
  END: {
    label: "ĐÃ KẾT THÚC",
    className: "bg-gray-400 text-white",
    dot: "bg-white",
  },
};

function timeLabel(auction: Auction) {
  if (auction.status === "ACTIVE" || auction.status === "LIVE" || auction.status === "ONGOING") {
    return `Còn ${formatDistanceToNow(new Date(auction.endTime), { locale: vi })}`;
  }
  if (auction.status === "UPCOMING" || auction.status === "PENDING") {
    return `Bắt đầu ${formatDistanceToNow(new Date(auction.startTime), {
      addSuffix: true,
      locale: vi,
    })}`;
  }
  return formatDistanceToNow(new Date(auction.endTime), {
    addSuffix: true,
    locale: vi,
  });
}

// Grab the first painting image for the card thumbnail
function getThumb(auction: Auction) {
  return (
    auction.auctionPaintings?.[0]?.painting?.imageUrl ||
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800"
  );
}

function getTopPrice(auction: Auction) {
  if (!auction.auctionPaintings?.length) return null;
  return Math.max(...auction.auctionPaintings.map((p) => p.currentBid || p.basePrice));
}

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "đ";

export default function AuctionCard({ auction }: AuctionCardProps) {
  const cfg = STATUS_CONFIG[auction.status] ?? STATUS_CONFIG.ENDED;
  const topPrice = getTopPrice(auction);

  return (
    <Link href={`/auction/${auction.auctionId}`} className="block group">
      <div className="bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={getThumb(auction)}
            alt={auction.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          />

          {/* Status badge */}
          <div className={`absolute top-4 left-4 text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${cfg.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>

          {/* Time overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Timer size={13} />
                {timeLabel(auction)}
              </div>
              <div className="flex items-center gap-3 text-[10px] opacity-70">
                {auction.bidCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Hammer size={11} /> {auction.bidCount}
                  </span>
                )}
                {auction.participantCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye size={11} /> {auction.participantCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-black uppercase tracking-tight leading-tight mb-0.5 group-hover:text-[#f07d44] transition line-clamp-1">
            {auction.title}
          </h3>
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mb-3">
            {auction.auctionPaintings?.length ?? 0} tác phẩm
          </p>

          {topPrice !== null && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">
                Giá cao nhất
              </p>
              <p className="text-xl font-black text-[#f07d44] flex items-baseline gap-1">
                {fmt(topPrice)}
                <TrendingUp size={14} className="opacity-60" />
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
