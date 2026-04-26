"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  Clock,
  Check,
  X,
  CreditCard,
  Eye,
  History,
  Landmark,
  MoreHorizontal,
  Banknote,
  Plus,
  Wallet,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMeQuery } from "@/hooks/useMeQuery";
import { 
  addBankAccount, 
  createWithdrawRequest, 
  getMyBankAccounts, 
  getWalletTransactions, 
  topupWallet,
  getMyWithdrawRequests,
  deleteBankAccount
} from "@/apis/wallet";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const weekData = [80, 130, 100, 170, 140, 185, 150];

const MOCK_WITHDRAWALS_PLACEHOLDER: any[] = [];

export default function WalletPage() {
  const [selectedWd, setSelectedWd] = useState<any>(null);
  const [withdrawalView, setWithdrawalView] = useState<"list" | "detail">("list");
  const [withdrawStep, setWithdrawStep] = useState<"bank" | "amount" | "add-bank">("bank");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  
  const [newBank, setNewBank] = useState({ bankName: "", accountNumber: "", accountHolderName: "" });
  const [txLimit, setTxLimit] = useState(10);
  const [bankToDelete, setBankToDelete] = useState<any>(null);

  const queryClient = useQueryClient();
  const { data: userData, refetch } = useMeQuery();

  const { data: bankAccountsData, isLoading: isBanksLoading } = useQuery({
    queryKey: ["bank-accounts"],
    queryFn: getMyBankAccounts,
    enabled: !!userData,
  });

  const banks = bankAccountsData?.data || [];

  const addBankMutation = useMutation({
    mutationFn: addBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      toast.success("Đã thêm tài khoản ngân hàng thành công!");
      setWithdrawStep("bank");
      setNewBank({ bankName: "", accountNumber: "", accountHolderName: "" });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể thêm tài khoản ngân hàng");
    },
  });

  const deleteBankMutation = useMutation({
    mutationFn: deleteBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      toast.success("Đã xóa tài khoản ngân hàng thành công!");
      setBankToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể xóa tài khoản ngân hàng");
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: createWithdrawRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
      refetch();
      toast.success("Đã gửi yêu cầu rút tiền thành công! Vui lòng chờ Staff phê duyệt.");
      setWithdrawStep("bank");
      setWithdrawAmount("");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể gửi yêu cầu rút tiền");
    },
  });

  const [topupAmount, setTopupAmount] = useState("200000");
  const [isTopupLoading, setIsTopupLoading] = useState(false);

  const { data: transactionsData, isLoading: isTransactionsLoading, isFetching: isTransactionsFetching } = useQuery({
    queryKey: ["wallet-transactions", txLimit],
    queryFn: () => getWalletTransactions(userData!.userId, 1, txLimit),
    enabled: !!userData,
  });

  const { data: myWithdrawRequestsData } = useQuery({
    queryKey: ["my-withdraw-requests"],
    queryFn: () => getMyWithdrawRequests(),
    enabled: !!userData,
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

  // Check withdrawal availability
  const withdrawalAvailableAt = userData?.wallet?.withdrawalAvailableAt;
  const isWithdrawalDisabled = useMemo(() => {
    if (!withdrawalAvailableAt) return false;
    return new Date() < new Date(withdrawalAvailableAt);
  }, [withdrawalAvailableAt]);

  const totalApprovedWithdrawals = useMemo(() => {
    return myWithdrawRequestsData?.data
      ?.filter((wd: any) => wd.status === "APPROVED")
      .reduce((sum: number, wd: any) => sum + wd.amount, 0) ?? 0;
  }, [myWithdrawRequestsData]);

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
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
          <div className="space-y-7 lg:col-span-8">
            <section className="relative overflow-hidden rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
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

            <section className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-black text-gray-900">
                  <History size={18} className="text-[#FF6E1A]" />
                  Giao dịch gần đây
                </h3>
                {/* <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                  Gần nhất <ChevronDown size={14} />
                </button> */}
              </div>

              <div className="space-y-3">
                {isTransactionsLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF6E1A] border-t-transparent"></div>
                    <p className="mt-4 text-sm font-medium text-gray-500">Đang tải giao dịch...</p>
                  </div>
                ) : !transactionsData?.data?.length ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-gray-50 text-gray-400">
                      <History size={32} />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Chưa có giao dịch nào</p>
                    <p className="mt-1 text-xs text-gray-500">Các giao dịch của bạn sẽ xuất hiện tại đây</p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-gray-100">
                      {(transactionsData.data || []).map((tx) => {
                        const impact = tx.walletImpact;
                        const status = tx.status;

                        let Icon = Clock;
                        let iconColor = "bg-amber-50 text-amber-600";
                        if (status === "SUCCESS") {
                          Icon = Check;
                          iconColor = "bg-emerald-50 text-emerald-600";
                        } else if (status === "FAILED" || status === "REJECTED") {
                          Icon = X;
                          iconColor = "bg-red-50 text-red-600";
                        }

                        const amountColor = impact === "NONE" ? "text-gray-400 opacity-60" : impact === "CREDIT" ? "text-emerald-600" : "text-red-500";
                        const sign = impact === "CREDIT" ? "+" : impact === "DEBIT" ? "-" : "";

                        return (
                          <div
                            key={tx.transactionId}
                            className="flex items-center justify-between bg-white py-4 transition first:pt-0 last:pb-0"
                          >
                            <div className="flex items-center gap-4">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`flex h-11 w-11 cursor-default items-center justify-center rounded-xl ${iconColor}`}
                                  >
                                    <Icon size={18} />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  {status === "SUCCESS" ? "Thành công" : 
                                   status === "PENDING" ? "Đang xử lý" : 
                                   status === "FAILED" ? "Thất bại" : 
                                   status === "REJECTED" ? "Từ chối" : status}
                                </TooltipContent>
                              </Tooltip>
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
                                  className={`text-sm font-black ${amountColor}`}
                                >
                                  {sign}
                                  {new Intl.NumberFormat("vi-VN").format(tx.amount)}đ
                                </p>
                                </div>
                              {/* <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <MoreHorizontal size={16} />
                              </button> */}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {transactionsData.pagination && transactionsData.pagination.total > txLimit && (
                      <button 
                        onClick={() => setTxLimit(prev => prev + 10)}
                        disabled={isTransactionsFetching}
                        className="mt-4 w-full rounded-lg border border-gray-100 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {isTransactionsFetching ? "Đang tải thêm..." : "Xem thêm giao dịch"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-7 lg:col-span-4">
            <section className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
              {/* Group 1: Linked Accounts */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tài khoản liên kết</h4>
                {banks.map((bank: any) => (
                  <div key={bank.bankAccountId} className="group/bank relative rounded-sm border border-orange-100 bg-orange-50/50 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white shadow-sm">
                           <Landmark size={20} className="text-[#FF6E1A]" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{bank.bankName}</p>
                          <p className="text-xs font-bold text-[#FF6E1A]">{bank.accountNumber}</p>
                          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">{bank.accountHolderName}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setBankToDelete(bank)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover/bank:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {banks.length === 0 && (
                  <div className="rounded-sm border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                    <button 
                      onClick={() => {
                        setWithdrawStep("add-bank");
                        setIsWithdrawDialogOpen(true);
                      }}
                      className="text-xs font-bold uppercase tracking-wide text-[#FF6E1A] hover:underline"
                    >
                      + Thêm tài khoản ngân hàng
                    </button>
                  </div>
                )}
              </div>

              {/* Group 2: Action Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-50 pt-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6E1A] px-3 py-2.5 text-xs font-bold text-white hover:bg-[#ff833b] transition-all active:scale-95 shadow-lg shadow-orange-100">
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
                          type="text"
                          inputMode="numeric"
                          value={new Intl.NumberFormat("vi-VN").format(Number(topupAmount.replace(/\D/g, "") || 0))}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setTopupAmount(val);
                          }}
                          className="w-full rounded-sm border border-gray-100 bg-gray-50 px-5 py-4 text-2xl font-black text-gray-900 outline-none ring-0 focus:border-[#FF6E1A] transition-all"
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
                        className="mt-4 w-full rounded-sm bg-[#FF6E1A] py-4 text-sm font-black text-white shadow-lg shadow-orange-100 hover:bg-[#e65a00] active:scale-95 transition-all disabled:opacity-50"
                      >
                        {isTopupLoading ? "Đang xử lý..." : "XÁC NHẬN NẠP TIỀN"}
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Dialog open={isWithdrawDialogOpen} onOpenChange={(open) => { 
                        if (isWithdrawalDisabled && open) return;
                        setIsWithdrawDialogOpen(open);
                        if (!open) setWithdrawStep("bank"); 
                      }}>
                        <DialogTrigger asChild>
                          <button 
                            disabled={isWithdrawalDisabled}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Banknote size={14} />
                            Rút tiền
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md overflow-hidden rounded-3xl border-none bg-white p-0 shadow-2xl">
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
                            {isBanksLoading ? (
                               <div className="py-10 text-center opacity-50">Đang tải danh sách...</div>
                            ) : banks.length === 0 ? (
                               <div className="py-6 text-center text-xs font-medium text-gray-400">Chưa có tài khoản liên kết</div>
                            ) : (
                              banks.map((bank: any) => (
                                <div
                                  key={bank.bankAccountId}
                                  onClick={() => setSelectedBank(bank)}
                                  className={`cursor-pointer rounded-sm border p-4 transition-all ${
                                    selectedBank?.bankAccountId === bank.bankAccountId
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
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{bank.accountNumber}</p>
                                      </div>
                                    </div>
                                    {selectedBank?.bankAccountId === bank.bankAccountId && (
                                      <div className="h-5 w-5 rounded-full bg-[#FF6E1A] flex items-center justify-center">
                                        <Plus size={12} className="text-white rotate-45" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                            
                            {banks.length === 0 && (
                              <button
                                onClick={() => setWithdrawStep("add-bank")}
                                className="w-full flex items-center justify-center gap-2 rounded-sm border border-dashed border-gray-300 bg-gray-50 py-4 text-xs font-bold text-gray-500 hover:border-[#FF6E1A] hover:text-[#FF6E1A] transition-all"
                              >
                                <Plus size={14} />
                                THÊM TÀI KHOẢN MỚI
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() => setWithdrawStep("amount")}
                            disabled={!selectedBank}
                            className="mt-6 w-full rounded-sm bg-[#FF6E1A] py-4 text-sm font-black text-white shadow-lg shadow-orange-100 hover:bg-[#e65a00] active:scale-95 transition-all disabled:opacity-50"
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
                                value={newBank.accountNumber}
                                onChange={(e) => setNewBank({...newBank, accountNumber: e.target.value})}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#FF6E1A]"
                              />
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Tên chủ tài khoản (Không dấu)</p>
                              <input 
                                placeholder="VD: NGUYEN VAN A"
                                value={newBank.accountHolderName}
                                onChange={(e) => setNewBank({...newBank, accountHolderName: e.target.value.toUpperCase()})}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#FF6E1A]"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (!newBank.bankName || !newBank.accountNumber || !newBank.accountHolderName) {
                                toast.error("Vui lòng điền đầy đủ thông tin");
                                return;
                              }
                              addBankMutation.mutate(newBank);
                            }}
                            disabled={addBankMutation.isPending}
                            className="w-full rounded-sm bg-[#111111] py-4 text-sm font-black text-white shadow-xl hover:bg-black active:scale-95 transition-all disabled:opacity-50"
                          >
                            {addBankMutation.isPending ? "ĐANG XỬ LÝ..." : "LƯU TÀI KHOẢN"}
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
                                 type="text"
                                 inputMode="numeric"
                                 value={new Intl.NumberFormat("vi-VN").format(Number(withdrawAmount.replace(/\D/g, "") || 0))}
                                 onChange={(e) => {
                                   const val = e.target.value.replace(/\D/g, "");
                                   setWithdrawAmount(val);
                                 }}
                                 className="w-full rounded-sm border border-gray-100 bg-gray-50 px-5 py-4 text-2xl font-black text-gray-900 outline-none ring-0 focus:border-[#FF6E1A] transition-all"
                                 placeholder="0"
                               />
                               <span className="absolute right-5 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400">đ</span>
                             </div>
                          </div>

                          <div className="rounded-xl bg-orange-50 p-4 border border-orange-100">
                            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest leading-loose">
                              Tiền sẽ được chuyển đến:
                            </p>
                            <p className="text-sm font-black text-[#FF6E1A] mt-1">{selectedBank.bankName} - {selectedBank.accountNumber}</p>
                            <p className="text-[10px] font-medium text-orange-600 opacity-70">Chủ TK: {selectedBank.accountHolderName}</p>
                          </div>

                          <button
                            onClick={() => {
                              if (!withdrawAmount || Number(withdrawAmount) <= 0) {
                                toast.error("Vui lòng nhập số tiền hợp lệ");
                                return;
                              }
                              if (Number(withdrawAmount) > balance) {
                                toast.error("Số dư không đủ");
                                return;
                              }
                              const accountId = selectedBank.accountId || selectedBank.bankAccountId || selectedBank.id;
                              if (!accountId) {
                                toast.error("Lỗi dữ liệu tài khoản ngân hàng. Vui lòng thử lại.");
                                return;
                              }
                              withdrawMutation.mutate({
                                amount: Number(withdrawAmount),
                                accountId: accountId
                              });
                            }}
                            disabled={withdrawMutation.isPending}
                            className="w-full rounded-sm bg-[#111111] py-4 text-sm font-black text-white shadow-xl hover:bg-black active:scale-95 transition-all disabled:opacity-50"
                          >
                            {withdrawMutation.isPending ? "ĐANG XỬ LÝ..." : "XÁC NHẬN RÚT TIỀN"}
                          </button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                      </Dialog>
                    </div>
                  </TooltipTrigger>
                  {isWithdrawalDisabled && withdrawalAvailableAt && (
                    <TooltipContent side="top" className="max-w-[200px] text-center">
                      <p>
                        Rút tiền khả dụng vào ngày{" "}
                        {format(new Date(withdrawalAvailableAt), "dd/MM/yyyy HH:mm", {
                          locale: vi,
                        })}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>

              {/* Group 3: Statistics */}
              <div className="mt-8 space-y-6 border-t border-gray-50 pt-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Giao dịch thành công</p>
                  <p className="mt-2 text-2xl font-black text-[#FF6E1A]">
                    +{new Intl.NumberFormat("vi-VN").format(transactionsData?.summary.totalTopupThisMonth ?? 0)}đ
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Đã giải ngân</p>
                  <p className="mt-2 text-2xl font-black text-emerald-600">
                    +{new Intl.NumberFormat("vi-VN").format(totalApprovedWithdrawals)}đ
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Yêu cầu rút tiền</p>
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
                            {myWithdrawRequestsData?.data?.map((wd) => (
                                <div
                                  key={wd.requestId}
                                  onClick={() => {
                                    setSelectedWd(wd);
                                    setWithdrawalView("detail");
                                  }}
                                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-white hover:shadow-md"
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{wd.requestId.slice(0, 8)}</p>
                                      <Eye size={12} className="opacity-0 transition group-hover:opacity-100 text-[#FF6E1A]" />
                                    </div>
                                    <p className="mt-0.5 text-sm font-black text-gray-900">
                                      {new Intl.NumberFormat("vi-VN").format(wd.amount)}đ
                                    </p>
                                  </div>
                                  <div
                                    className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
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
                                      : "Từ chối"}
                                  </div>
                                </div>
                              ))}
                            {(!myWithdrawRequestsData?.data || myWithdrawRequestsData.data.length === 0) && (
                               <div className="py-12 text-center">
                                 <p className="text-xs font-medium text-gray-400">Chưa có yêu cầu rút tiền nào</p>
                               </div>
                            )}
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
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedWd?.requestId}</p>
                              </div>
                            </div>
                            <div className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider bg-white border border-gray-100 ${
                              selectedWd?.status === "APPROVED" ? "text-emerald-600" : selectedWd?.status === "PENDING" ? "text-orange-600" : "text-red-600"
                            }`}>
                              {selectedWd?.status === "APPROVED" ? "Đã duyệt" : selectedWd?.status === "PENDING" ? "Chờ xử lý" : "Đã từ chối"}
                            </div>
                          </div>
                          
                          <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-gray-50 text-center">
                              <div className="flex-1">
                                <p className="text-[9px] font-bold uppercase text-gray-400">Số tiền</p>
                                <p className="text-base font-black text-gray-900">{new Intl.NumberFormat("vi-VN").format(selectedWd?.amount)}đ</p>
                              </div>
                              <div className="h-8 w-[1px] bg-gray-100" />
                              <div className="flex-1">
                                <p className="text-[9px] font-bold uppercase text-gray-400">Ngày yêu cầu</p>
                                <p className="text-sm font-bold text-gray-600">
                                  {selectedWd?.createdAt ? format(new Date(selectedWd.createdAt), "dd/MM/yyyy") : "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Thông tin ngân hàng</p>
                                <p className="text-xs font-bold text-gray-800">{selectedWd?.bankName}</p>
                                <p className="text-sm font-black text-gray-900">{selectedWd?.bankAccountNumber}</p>
                                <p className="text-[10px] font-medium text-gray-500">{selectedWd?.bankAccountName}</p>
                              </div>

                              {selectedWd?.status === "REJECTED" && selectedWd?.rejectReason && (
                                <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                                  <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Lý do từ chối</p>
                                  <p className="text-xs font-bold text-red-700">{selectedWd.rejectReason}</p>
                                </div>
                              )}

                              {selectedWd?.status === "APPROVED" && selectedWd?.proofImageUrl && (
                                <div className="space-y-2">
                                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Chứng từ chuyển khoản</p>
                                  <div>{selectedWd.staffNote}</div>
                                  <div className="relative aspect-video rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                                    <Image src={selectedWd.proofImageUrl} alt="Proof" fill className="object-contain" />
                                    
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
                        </div>
                      )}
                    </AnimatePresence>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!bankToDelete}
        onClose={() => setBankToDelete(null)}
        onConfirm={() => {
          if (bankToDelete) {
            deleteBankMutation.mutate(bankToDelete.bankAccountId);
          }
        }}
        title="Xóa tài khoản ngân hàng"
        description={
          <>
            Bạn có chắc chắn muốn xóa tài khoản <b>{bankToDelete?.bankName} ({bankToDelete?.accountNumber})</b>? 
            Thao tác này không thể hoàn tác.
          </>
        }
        variant="destructive"
        confirmText="XÓA NGAY"
        isLoading={deleteBankMutation.isPending}
      />
    </div>
  </main>
  );
}