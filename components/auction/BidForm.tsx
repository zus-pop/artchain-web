"use client";
import React, { useState } from "react";
import { Hammer, TrendingUp } from "lucide-react";

interface BidFormProps {
  auctionId: string | number;
  auctionPaintingId: string | number;
  currentPrice: number;
  bidStep?: number;
  onBid: (amount: number) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function BidForm({
  currentPrice,
  bidStep = 500_000,
  onBid,
  isLoading,
  disabled,
}: BidFormProps) {
  const minBid = currentPrice + bidStep;
  const [amount, setAmount] = useState(minBid);

  const QUICK_INCREMENTS = [bidStep, bidStep * 2, bidStep * 5, bidStep * 10];

  const fmt = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < minBid) return;
    onBid(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current price display */}
      <div className="bg-[#1a1a1a] text-white p-5 rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-1">
          Giá hiện tại
        </p>
        <p className="text-3xl font-black text-[#f07d44] flex items-center gap-2">
          {fmt(currentPrice)}
          <TrendingUp size={20} className="opacity-60" />
        </p>
      </div>

      {/* Quick increment buttons */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">
          Tăng nhanh
        </p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_INCREMENTS.map((inc) => (
            <button
              key={inc}
              type="button"
              onClick={() => setAmount(currentPrice + inc)}
              className="py-2 px-3 border-2 border-dashed border-gray-200 hover:border-[#f07d44] hover:text-[#f07d44] rounded-lg text-xs font-bold transition-all"
            >
              +{fmt(inc)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom amount input */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">
          Nhập giá thầu (tối thiểu {fmt(minBid)})
        </p>
        <div className="relative">
          <input
            type="number"
            value={amount}
            min={minBid}
            step={100_000}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border-2 border-gray-200 focus:border-[#f07d44] rounded-xl px-4 py-3 text-lg font-black outline-none transition pr-14"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-30">
            VNĐ
          </span>
        </div>
        {amount < minBid && (
          <p className="text-red-500 text-xs mt-1 font-medium">
            Giá thầu phải ≥ {fmt(minBid)}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={disabled || isLoading || amount < minBid}
        className="w-full flex items-center justify-center gap-3 bg-[#f07d44] hover:bg-[#d96a30] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg shadow-orange-200"
      >
        {isLoading ? (
          <span className="animate-pulse">Đang đặt giá…</span>
        ) : (
          <>
            Đặt giá thầu <Hammer size={18} />
          </>
        )}
      </button>
    </form>
  );
}
