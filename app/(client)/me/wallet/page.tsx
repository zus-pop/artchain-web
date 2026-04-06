"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  CreditCard,
  History,
  Landmark,
  MoreHorizontal,
  Plus,
  Wallet,
} from "lucide-react";
import { useMeQuery } from "@/hooks/useMeQuery";
import { topupWallet } from "@/apis/wallet";
import { toast } from "sonner";

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const transactions: Transaction[] = [
  {
    id: "1",
    title: "Nạp tiền vào ví",
    date: "03 Th08 2024, 15:43",
    amount: 1200000,
    icon: ArrowUpRight,
  },
  {
    id: "2",
    title: "Thanh toán đơn đấu giá #1293",
    date: "01 Th08 2024, 12:58",
    amount: -560000,
    icon: ArrowDownLeft,
  },
  {
    id: "3",
    title: "Hoàn tiền đơn hủy",
    date: "28 Th07 2024, 21:40",
    amount: 240000,
    icon: ArrowUpRight,
  },
  {
    id: "4",
    title: "Nạp tiền nhanh",
    date: "28 Th07 2024, 09:28",
    amount: 800000,
    icon: ArrowUpRight,
  },
];

const weekData = [80, 130, 100, 170, 140, 185, 150];

export default function WalletPage() {
  const { data: userData, refetch } = useMeQuery();
  const [topupAmount, setTopupAmount] = useState("200000");
  const [isTopupLoading, setIsTopupLoading] = useState(false);

  const maxY = Math.max(...weekData);
  const points = weekData
    .map((value, index) => {
      const x = (index / (weekData.length - 1)) * 100;
      const y = 100 - (value / maxY) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  const balance = userData?.wallet?.balance ?? 0;
  const formattedBalance = new Intl.NumberFormat("vi-VN").format(balance);
  const walletId = userData?.wallet?.walletId || "Chưa có ví";

  const normalizedTopupAmount = useMemo(() => {
    const digitsOnly = topupAmount.replace(/\D/g, "");
    return Number(digitsOnly || 0);
  }, [topupAmount]);

  const handleTopup = async () => {
    if (isTopupLoading) return;

    if (!normalizedTopupAmount || normalizedTopupAmount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    try {
      setIsTopupLoading(true);
      const result = await topupWallet(normalizedTopupAmount);
      const maybeResult = result as Record<string, unknown>;
      const paymentUrl =
        (typeof maybeResult.checkoutUrl === "string" && maybeResult.checkoutUrl) ||
        (typeof maybeResult.paymentUrl === "string" && maybeResult.paymentUrl) ||
        (typeof maybeResult.url === "string" && maybeResult.url) ||
        (maybeResult.data && typeof maybeResult.data === "object"
          ? (((maybeResult.data as Record<string, unknown>).checkoutUrl as string | undefined) ||
            ((maybeResult.data as Record<string, unknown>).paymentUrl as string | undefined) ||
            ((maybeResult.data as Record<string, unknown>).url as string | undefined))
          : undefined);

      toast.success("Tạo giao dịch nạp tiền thành công");

      if (paymentUrl && typeof window !== "undefined") {
        window.open(paymentUrl, "_blank", "noopener,noreferrer");
      }

      await refetch();
    } catch (error: any) {
      toast.error(error?.message || "Không thể tạo giao dịch nạp tiền");
    } finally {
      setIsTopupLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#EAE6E0] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              Quản lý ví
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Theo dõi số dư, giao dịch và tài khoản liên kết
            </p>
          </div>
          <button
            onClick={handleTopup}
            disabled={isTopupLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6E1A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#e65a00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} />
            {isTopupLoading ? "Đang tạo" : "Nạp tiền"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
          <div className="space-y-7 lg:col-span-8">
            <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="absolute -right-16 -top-12 h-44 w-44 rounded-full bg-orange-100 blur-2xl" />
              <div className="relative z-10">
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                      Số dư hiện tại
                    </p>
                    <h2 className="mt-2 text-4xl font-black text-gray-900">{formattedBalance}đ</h2>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-3 text-[#FF6E1A]">
                    <Wallet size={26} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                      ArtChain Wallet ID
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-[0.16em] text-gray-900">
                      {walletId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                    {userData?.wallet?.status || "Đang hoạt động"}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Nạp tiền nhanh</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      inputMode="numeric"
                      value={topupAmount}
                      onChange={(event) => setTopupAmount(event.target.value)}
                      placeholder="Nhập số tiền cần nạp"
                      className="w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline-none ring-0 focus:border-[#FF6E1A]"
                    />
                    <button
                      onClick={handleTopup}
                      disabled={isTopupLoading}
                      className="inline-flex items-center justify-center rounded-lg bg-[#FF6E1A] px-4 py-2 text-sm font-bold text-white hover:bg-[#e65a00] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isTopupLoading ? "Đang xử lý" : "Nạp ngay"}
                    </button>
                  </div>
                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Số tiền: {new Intl.NumberFormat("vi-VN").format(normalizedTopupAmount)}đ
                  </p>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Tổng nạp tháng này
                </p>
                <p className="mt-3 text-2xl font-black text-gray-900">+5.200.000đ</p>
                <p className="mt-2 text-xs font-semibold text-emerald-600">
                  +12% so với tháng trước
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Tổng chi tháng này
                </p>
                <p className="mt-3 text-2xl font-black text-gray-900">-2.850.000đ</p>
                <p className="mt-2 text-xs font-semibold text-[#FF6E1A]">
                  7 giao dịch đấu giá
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Rút tiền
                </p>
                <p className="mt-3 text-2xl font-black text-gray-900">Liên kết NH</p>
                <button className="mt-2 inline-flex items-center text-xs font-bold text-[#FF6E1A] hover:underline">
                  Thêm tài khoản ngân hàng
                </button>
              </div>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-black text-gray-900">
                  <History size={18} className="text-[#FF6E1A]" />
                  Giao dịch gần đây
                </h3>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                  Gần nhất <ChevronDown size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {transactions.map((tx) => {
                  const Icon = tx.icon;
                  const isIncome = tx.amount > 0;

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            isIncome
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-orange-100 text-[#FF6E1A]"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{tx.title}</p>
                          <p className="text-xs font-medium text-gray-500">{tx.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <p
                          className={`text-sm font-black ${
                            isIncome ? "text-emerald-600" : "text-gray-900"
                          }`}
                        >
                          {isIncome ? "+" : ""}
                          {new Intl.NumberFormat("vi-VN").format(tx.amount)}đ
                        </p>
                        <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="space-y-7 lg:col-span-4">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Chi tiêu tuần này
                  </p>
                  <p className="mt-2 text-3xl font-black text-gray-900">1.259.000đ</p>
                </div>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-gray-600">
                  Tuần <ChevronDown size={12} />
                </button>
              </div>

              <div className="relative mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full">
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6E1A" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#FF6E1A" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#FF6E1A"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polygon points={`0,100 ${points} 100,100`} fill="url(#areaFill)" />
                </svg>

                <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  <span>T2</span>
                  <span>T3</span>
                  <span className="text-[#FF6E1A]">T4</span>
                  <span>T5</span>
                  <span>T6</span>
                  <span>T7</span>
                  <span>CN</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-black text-gray-900">Tài khoản liên kết</h4>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-black px-2 py-1.5 text-xs font-black text-white">
                        AC
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">ArtChain Pay</p>
                        <p className="text-xs font-medium text-gray-500">Mặc định</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                      Active
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                  <button className="text-xs font-bold uppercase tracking-wide text-[#FF6E1A] hover:underline">
                    + Thêm tài khoản ngân hàng
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h4 className="mb-4 text-sm font-black uppercase tracking-wider text-gray-900">
                Hành động nhanh
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleTopup}
                  disabled={isTopupLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6E1A] px-3 py-2.5 text-xs font-bold text-white hover:bg-[#ff833b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={14} />
                  {isTopupLoading ? "Đang tạo" : "Nạp tiền"}
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">
                  <Landmark size={14} />
                  Rút tiền
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">
                  <CreditCard size={14} />
                  Lịch sử nạp
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">
                  <Wallet size={14} />
                  Thông tin ví
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}