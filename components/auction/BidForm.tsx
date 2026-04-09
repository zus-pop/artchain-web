import React, { useState } from "react";
import { Gavel, TrendingUp, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BidFormProps {
  auctionId: string | number;
  auctionPaintingId: string | number;
  currentPrice: number;
  bidStep?: number;
  onBid: (amount: number) => void;
  isLoading?: boolean;
  disabled?: boolean;
  isHighestBidder?: boolean;
  walletBalance?: number;
}

export default function BidForm({
  currentPrice,
  bidStep = 10000,
  onBid,
  isLoading,
  disabled,
  isHighestBidder,
  walletBalance = 0,
}: BidFormProps) {
  const router = useRouter();
  const minBid = currentPrice + bidStep;
  const [amount, setAmount] = useState(minBid);

  // Sync amount with current price if it falls below min
  React.useEffect(() => {
    if (amount < minBid) {
      setAmount(minBid);
    }
  }, [minBid]);

  const QUICK_INCREMENTS = [bidStep, bidStep * 5, bidStep * 10, bidStep * 20];

  const fmt = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount < minBid) {
      toast.error(`Giá đặt không hợp lệ`, {
        description: `Giá đặt tối thiểu là ${fmt(minBid)}`,
      });
      return;
    }
    
    if (amount > walletBalance) {
      toast.error(`Số dư trong ví không đủ`, {
        description: `Số dư hiện tại: ${fmt(walletBalance)}. Vui lòng nạp thêm tiền để thực hiện giao dịch này.`,
        duration: 6000,
        action: {
          label: "Nạp tiền ngay",
          onClick: () => router.push("/wallet"),
        },
      });
      return;
    }
    
    onBid(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current price display */}
      <div className={`p-5 rounded-xl transition-colors ${isHighestBidder ? "bg-green-600 text-white" : "bg-[#1a1a1a] text-white"}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mb-1">
          {isHighestBidder ? "Bạn đang dẫn đầu" : "Giá hiện tại"}
        </p>
        <p className="text-3xl font-black flex items-center gap-2">
          {fmt(currentPrice)}
          {isHighestBidder ? <Gavel size={20} className="animate-bounce" /> : <TrendingUp size={20} className="text-[#f07d44]" />}
        </p>
      </div>

      {/* Wallet Balance Info */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#f07d44]/10 flex items-center justify-center">
            <Wallet size={14} className="text-[#f07d44]" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Số dư</p>
        </div>
        <p className="text-sm font-black text-[#1a1a1a]">{fmt(walletBalance)}</p>
      </div>

      {!isHighestBidder ? (
        <>
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
                  className="py-2 px-3 border-2 border-dashed border-gray-200 hover:border-[#f07d44] hover:text-[#f07d44] rounded-lg text-[10px] font-bold transition-all text-center"
                >
                  +{fmt(inc).replace("₫", "đ")}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount input */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">
              Nhập giá
            </p>
            <div className="relative">
              <input
                type="number"
                value={amount}
                min={minBid}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border-2 border-gray-200 focus:border-[#f07d44] rounded-xl px-4 py-3 text-lg font-black outline-none transition pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold opacity-30">
                VNĐ
              </span>
            </div>
            {amount < minBid && (
              <p className="text-red-500 text-[10px] mt-1 font-bold italic">
                Giá  phải lớn hơn hoặc bằng {fmt(minBid)}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={disabled || isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#f07d44] hover:bg-[#d96a30] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg shadow-orange-200"
          >
            {isLoading ? (
              <span className="animate-pulse">Đang đặt giá…</span>
            ) : (
              <>
                Đặt giá <Gavel size={18} />
              </>
            )}
          </button>
        </>
      ) : (
        <div className="bg-orange-50 border-2 border-orange-100 p-4 rounded-xl text-center">
           <p className="text-[10px] font-black uppercase text-[#f07d44] tracking-widest mb-1">Dẫn đầu</p>
           <p className="text-xs opacity-60">Bạn đang là người đặt giá cao nhất. <br/> Hãy chờ đợi để sở hữu tác phẩm!</p>
        </div>
      )}
    </form>
  );
}
