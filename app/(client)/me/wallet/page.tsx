"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  Eye,
  History,
  Landmark,
  MoreHorizontal,
  Banknote,
  Plus,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMeQuery } from "@/hooks/useMeQuery";
import { getWalletTransactions, topupWallet } from "@/apis/wallet";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

const weekData = [80, 130, 100, 170, 140, 185, 150];

const MOCK_WITHDRAWALS = [
  { 
    id: "WD1024", 
    amount: 1000000, 
    status: "PENDING", 
    date: "2024-03-25",
    proofUrl: null 
  },
  { 
    id: "WD1023", 
    amount: 500000, 
    status: "APPROVED", 
    date: "2024-03-20",
    proofUrl: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: "WD1022", 
    amount: 2000000, 
    status: "REJECTED", 
    date: "2024-03-15",
    proofUrl: null 
  },
];

const LINKED_BANKS = [
  { id: 1, bankName: "Vietcombank", accountNo: "123****890", accountName: "NGUYEN VAN A" },
  { id: 2, bankName: "Techcombank", accountNo: "998****112", accountName: "NGUYEN VAN A" },
];

export default function WalletPage() {
  const [selectedWd, setSelectedWd] = useState<any>(null);
  const [withdrawalView, setWithdrawalView] = useState<"list" | "detail">("list");
  const [withdrawStep, setWithdrawStep] = useState<"bank" | "amount" | "add-bank">("bank");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [banks, setBanks] = useState(LINKED_BANKS);
  const [selectedBank, setSelectedBank] = useState<any>(LINKED_BANKS[0]);
  
  const [newBank, setNewBank] = useState({ bankName: "", accountNo: "", accountName: "" });

  const { data: userData, refetch } = useMeQuery();
  const [topupAmount, setTopupAmount] = useState("200000");
  const [isTopupLoading, setIsTopupLoading] = useState(false);

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["wallet-transactions", userData?.userId],
    queryFn: () => getWalletTransactions(userData!.userId),
    enabled: !!userData?.userId,
  });

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
          {/* <button
            onClick={handleTopup}
            disabled={isTopupLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6E1A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#e65a00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} />
            {isTopupLoading ? "Đang tạo" : "Nạp tiền"}
          </button> */}
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

                {/* <div className="flex flex-wrap items-center justify-between gap-4">
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
                </div> */}

                <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Nạp tiền nhanh</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      inputMode="numeric"
                      value={new Intl.NumberFormat("vi-VN").format(Number(topupAmount.replace(/\D/g, "") || 0))}
                      onChange={(event) => {
                        const rawValue = event.target.value.replace(/\D/g, "");
                        setTopupAmount(rawValue);
                      }}
                      placeholder="Nhập số tiền cần nạp"
                      className="w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline-none ring-0 focus:border-[#FF6E1A]"
                    />
                    <button
                      onClick={handleTopup}
                      disabled={isTopupLoading}
                      className="inline-flex items-center justify-center rounded-lg bg-[#FF6E1A] px-4 py-2 text-sm font-bold text-white hover:bg-[#e65a00] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isTopupLoading ? "Đang xử lý" : "Nạp"}
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
                <p className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Tổng nạp tháng này
                </p>
                <p className="mt-3 text-2xl font-black text-[#FF6E1A]">
                  +{new Intl.NumberFormat("vi-VN").format(transactionsData?.summary.totalTopupThisMonth ?? 0)}đ
                </p>
                {/* <p className="mt-2 text-xs font-semibold text-emerald-600">
                  Cập nhật hôm nay
                </p> */}
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Tổng chi tháng này
                </p>
                <p className="mt-3 text-2xl font-black text-[#FF6E1A]">
                  -{new Intl.NumberFormat("vi-VN").format(transactionsData?.summary.totalSpendThisMonth ?? 0)}đ
                </p>
                {/* <p className="mt-2 text-xs font-semibold text-[#FF6E1A]">
                  Lịch sử giao dịch
                </p> */}
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Yêu cầu rút tiền
                </p>
                {/* <p className="mt-3 text-2xl font-black text-gray-900">Yêu cầu rút tiền</p> */}
                <Dialog
                  onOpenChange={(open) => {
                    if (!open) {
                      setWithdrawalView("list");
                      setSelectedWd(null);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <button className="mt-2 inline-flex items-center text-2xl font-bold text-[#FF6E1A] hover:underline">
                      Xem danh sách
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-3xl border-none bg-white p-0 overflow-hidden">
                    <AnimatePresence mode="wait">
                      {withdrawalView === "list" ? (
                        <div key="list" className="flex flex-col">
                          <div className="bg-gray-50 p-6 border-b border-gray-100">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-black text-gray-900 uppercase">
                                Lịch sử yêu cầu
                              </DialogTitle>
                            </DialogHeader>
                          </div>
                          <div className="p-6 space-y-3">
                            {MOCK_WITHDRAWALS.map((wd) => (
                              <div
                                key={wd.id}
                                onClick={() => {
                                  setSelectedWd(wd);
                                  setWithdrawalView("detail");
                                }}
                                className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-white hover:shadow-md"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{wd.id}</p>
                                    <Eye size={12} className="opacity-0 transition group-hover:opacity-100 text-[#FF6E1A]" />
                                  </div>
                                  <p className="mt-0.5 text-sm font-black text-gray-900">
                                    {new Intl.NumberFormat("vi-VN").format(wd.amount)}đ
                                  </p>
                                </div>
                                <div
                                  className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                    wd.status === "APPROVED"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : wd.status === "PENDING"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {wd.status === "APPROVED"
                                    ? "Thành công"
                                    : wd.status === "PENDING"
                                    ? "Chờ duyệt"
                                    : "Đã hủy"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div key="detail" className="flex flex-col">
                          <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => setWithdrawalView("list")}
                                className="rounded-lg bg-white p-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 transition shadow-sm"
                              >
                                <ChevronLeft size={16} />
                              </button>
                              <div>
                                <DialogTitle className="text-lg font-black uppercase tracking-tighter text-gray-900">Thông tin giao dịch</DialogTitle>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedWd?.id}</p>
                              </div>
                            </div>
                            <div className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider bg-white border border-gray-100 text-gray-500`}>
                              {selectedWd?.status}
                            </div>
                          </div>
                          
                          <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-[9px] font-bold uppercase text-gray-400">Số tiền</p>
                                <p className="text-base font-black text-gray-900">{new Intl.NumberFormat("vi-VN").format(selectedWd?.amount)}đ</p>
                              </div>
                              <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-[9px] font-bold uppercase text-gray-400">Thời gian</p>
                                <p className="text-sm font-bold text-gray-900">{format(new Date(selectedWd?.date), "dd/MM/yyyy")}</p>
                              </div>
                            </div>

                            {selectedWd?.status === "APPROVED" && (
                              <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1.5">
                                  <CreditCard size={10} /> Biên lai chuyển khoản
                                </p>
                                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-inner">
                                  <img 
                                    src={selectedWd?.proofUrl || ""} 
                                    alt="Authorized Proof" 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </div>
                            )}

                            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                              <button 
                                onClick={() => {
                                  toast.success("Đã gửi yêu cầu khiếu nại cho Admin");
                                  setWithdrawalView("list");
                                }}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-xs font-bold text-red-600 hover:bg-red-100 transition shadow-sm active:scale-95"
                              >
                                <AlertTriangle size={14} />
                                Báo cáo bất thường
                              </button>
                              <p className="text-[10px] text-center font-medium text-gray-400">
                                Khiếu nại sẽ được xử lý trong vòng 24h làm việc
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                  </DialogContent>
                </Dialog>
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
                {isTransactionsLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF6E1A] border-t-transparent"></div>
                    <p className="mt-4 text-sm font-medium text-gray-500">Đang tải giao dịch...</p>
                  </div>
                ) : !transactionsData?.data?.length ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                      <History size={32} />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Chưa có giao dịch nào</p>
                    <p className="mt-1 text-xs text-gray-500">Các giao dịch của bạn sẽ xuất hiện tại đây</p>
                  </div>
                ) : (
                  transactionsData.data.map((tx) => {
                    const isIncome = tx.note.toUpperCase().includes("NAP TIEN") || tx.note.toUpperCase().includes("HOÀN TIỀN");
                    const Icon = isIncome ? ArrowUpRight : ArrowDownLeft;

                    return (
                      <div
                        key={tx.transactionId}
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
                            <p className="text-sm font-bold text-gray-900">{tx.note}</p>
                            <p className="text-xs font-medium text-gray-500">
                              {format(new Date(tx.createdAt), "dd 'Th'MM yyyy, HH:mm", { locale: vi })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p
                              className={`text-sm font-black ${
                                isIncome ? "text-emerald-600" : "text-gray-900"
                              }`}
                            >
                              {isIncome ? "+" : "-"}
                              {new Intl.NumberFormat("vi-VN").format(tx.amount)}đ
                            </p>
                            <p className={`text-[10px] font-bold ${
                              tx.status === "SUCCESS" ? "text-emerald-500" : 
                              tx.status === "PENDING" ? "text-amber-500" : "text-red-500"
                            }`}>
                              {tx.status}
                            </p>
                          </div>
                          <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          <div className="space-y-7 lg:col-span-4">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h4 className="mb-4 text-sm font-black uppercase tracking-wider text-gray-900">
                Hành động nhanh
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6E1A] px-3 py-2.5 text-xs font-bold text-white hover:bg-[#ff833b] disabled:cursor-not-allowed disabled:opacity-60">
                      <Plus size={14} />
                      Nạp tiền
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md border-none bg-white p-6 shadow-2xl rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black text-gray-900 uppercase">Nạp tiền vào ví</DialogTitle>
                    </DialogHeader>
                    <div className="mt-6 space-y-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nhập số tiền cần nạp</p>
                      <div className="relative">
                        <input
                          type="number"
                          value={topupAmount}
                          onChange={(e) => setTopupAmount(e.target.value)}
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-2xl font-black text-gray-900 outline-none ring-0 focus:border-[#FF6E1A] transition-all"
                          placeholder="0"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400">đ</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {["100000", "200000", "500000"].map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setTopupAmount(amount)}
                            className="rounded-xl border border-gray-100 bg-gray-50 py-2 text-xs font-bold text-gray-600 hover:border-[#FF6E1A] hover:bg-orange-50 hover:text-[#FF6E1A] transition-all"
                          >
                            +{new Intl.NumberFormat("vi-VN").format(Number(amount))}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={handleTopup}
                        disabled={isTopupLoading}
                        className="mt-4 w-full rounded-2xl bg-[#FF6E1A] py-4 text-sm font-black text-white shadow-lg shadow-orange-100 hover:bg-[#e65a00] active:scale-95 transition-all disabled:opacity-50"
                      >
                        {isTopupLoading ? "Đang xử lý..." : "XÁC NHẬN NẠP TIỀN"}
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog onOpenChange={(open) => { if (!open) setWithdrawStep("bank"); }}>
                  <DialogTrigger asChild>
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95">
                      <Landmark size={14} />
                      Rút tiền
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md border-none bg-white p-0 overflow-hidden shadow-2xl rounded-3xl">
                    <div className="bg-gray-50 p-6 border-b border-gray-100">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-black text-gray-900 uppercase">
                          {withdrawStep === "bank" ? "Chọn tài khoản" : 
                           withdrawStep === "add-bank" ? "Thêm tài khoản" : "Số tiền rút"}
                        </DialogTitle>
                      </DialogHeader>
                    </div>

                    <div className="p-6">
                      {withdrawStep === "bank" ? (
                        <div className="space-y-4">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tài khoản đã liên kết</p>
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {banks.map((bank) => (
                              <div
                                key={bank.id}
                                onClick={() => setSelectedBank(bank)}
                                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                                  selectedBank?.id === bank.id
                                    ? "border-[#FF6E1A] bg-orange-50 shadow-md"
                                    : "border-gray-100 bg-white hover:border-gray-200"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                                      <Landmark size={20} className="text-[#FF6E1A]" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-gray-900">{bank.bankName}</p>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase">{bank.accountNo}</p>
                                    </div>
                                  </div>
                                  {selectedBank?.id === bank.id && (
                                    <div className="h-5 w-5 rounded-full bg-[#FF6E1A] flex items-center justify-center">
                                      <Plus size={12} className="text-white rotate-45" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            
                            <button
                              onClick={() => setWithdrawStep("add-bank")}
                              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-4 text-xs font-bold text-gray-500 hover:border-[#FF6E1A] hover:text-[#FF6E1A] transition-all"
                            >
                              <Plus size={14} />
                              THÊM TÀI KHOẢN MỚI
                            </button>
                          </div>
                          <button
                            onClick={() => setWithdrawStep("amount")}
                            disabled={!selectedBank}
                            className="mt-6 w-full rounded-2xl bg-[#FF6E1A] py-4 text-sm font-black text-white shadow-lg shadow-orange-100 hover:bg-[#e65a00] active:scale-95 transition-all disabled:opacity-50"
                          >
                            TIẾP TỤC
                          </button>
                        </div>
                      ) : withdrawStep === "add-bank" ? (
                        <div className="space-y-6">
                           <div className="flex items-center gap-2 text-gray-400">
                            <button onClick={() => setWithdrawStep("bank")} className="hover:text-gray-900 transition-colors">
                              <ChevronLeft size={16} />
                            </button>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Quay lại danh sách</p>
                          </div>

                          <div className="space-y-5">
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Tên ngân hàng</p>
                              <input 
                                placeholder="VD: Vietcombank, MB Bank..."
                                value={newBank.bankName}
                                onChange={(e) => setNewBank({...newBank, bankName: e.target.value})}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#FF6E1A]"
                              />
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Số tài khoản</p>
                              <input 
                                placeholder="Nhập số tài khoản ngân hàng"
                                value={newBank.accountNo}
                                onChange={(e) => setNewBank({...newBank, accountNo: e.target.value})}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#FF6E1A]"
                              />
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Tên chủ tài khoản (Không dấu)</p>
                              <input 
                                placeholder="VD: NGUYEN VAN A"
                                value={newBank.accountName}
                                onChange={(e) => setNewBank({...newBank, accountName: e.target.value.toUpperCase()})}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#FF6E1A]"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (!newBank.bankName || !newBank.accountNo || !newBank.accountName) {
                                toast.error("Vui lòng điền đầy đủ thông tin");
                                return;
                              }
                              const bankToAdd = { ...newBank, id: Date.now() };
                              setBanks([bankToAdd, ...banks]);
                              setSelectedBank(bankToAdd);
                              setWithdrawStep("bank");
                              setNewBank({ bankName: "", accountNo: "", accountName: "" });
                              toast.success("Đã thêm tài khoản ngân hàng thành công!");
                            }}
                            className="w-full rounded-2xl bg-[#111111] py-4 text-sm font-black text-white shadow-xl hover:bg-black active:scale-95 transition-all"
                          >
                            LƯU TÀI KHOẢN
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 text-gray-400">
                            <button onClick={() => setWithdrawStep("bank")} className="hover:text-gray-900 transition-colors">
                              <ChevronLeft size={16} />
                            </button>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Quay lại chọn ngân hàng</p>
                          </div>
                          
                          <div className="space-y-4">
                             <div className="flex items-center justify-between">
                               <p className="text-[11px] font-bold uppercase text-gray-400">Số dư khả dụng</p>
                               <p className="text-xs font-black text-gray-900">{formattedBalance}đ</p>
                             </div>
                             <div className="relative">
                               <input
                                 type="number"
                                 value={withdrawAmount}
                                 onChange={(e) => setWithdrawAmount(e.target.value)}
                                 className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-2xl font-black text-gray-900 outline-none ring-0 focus:border-[#FF6E1A] transition-all"
                                 placeholder="0"
                               />
                               <span className="absolute right-5 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400">đ</span>
                             </div>
                          </div>

                          <div className="rounded-xl bg-orange-50 p-4 border border-orange-100">
                            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest leading-loose">
                              Tiền sẽ được chuyển đến:
                            </p>
                            <p className="text-sm font-black text-[#FF6E1A] mt-1">{selectedBank.bankName} - {selectedBank.accountNo}</p>
                            <p className="text-[10px] font-medium text-orange-600 opacity-70">Chủ TK: {selectedBank.accountName}</p>
                          </div>

                          <button
                            onClick={() => {
                              toast.success("Đã gửi yêu cầu rút tiền đến Staff, vui lòng chờ!");
                              setWithdrawStep("bank");
                              setWithdrawAmount("");
                            }}
                            className="w-full rounded-2xl bg-[#111111] py-4 text-sm font-black text-white shadow-xl hover:bg-black active:scale-95 transition-all"
                          >
                            XÁC NHẬN RÚT TIỀN
                          </button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95">
                  <CreditCard size={14} />
                  Lịch sử nạp
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95">
                  <Wallet size={14} />
                  Thông tin ví
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Chi tiêu tuần này
                  </p>
                  <p className="mt-2 text-3xl font-black text-gray-900">.000đ</p>
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
          </div>
        </div>
      </div>
    </main>
  );
}