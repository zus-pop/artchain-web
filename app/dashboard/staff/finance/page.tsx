"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { StatsCards } from "@/components/staff/StatsCards";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { useState, useRef } from "react";
import { 
  IconWallet, 
  IconArrowUpRight, 
  IconHistory, 
  IconCheck, 
  IconEye,
  IconReceipt2,
  IconCloudUpload,
  IconUserCircle,
  IconSearch,
  IconFilter,
  IconEyeBolt,
  IconEyePin
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getStaffWithdrawRequests, 
  approveWithdrawRequest, 
  rejectWithdrawRequest 
} from "@/apis/wallet";
import { format } from "date-fns";

export default function StaffFinancePage() {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  const queryClient = useQueryClient();
  
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [staffProofFile, setStaffProofFile] = useState<File | null>(null);
  const [staffProofPreview, setStaffProofPreview] = useState<string | null>(null);
  const [staffNote, setStaffNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  
  const staffFileRef = useRef<HTMLInputElement>(null);

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["staff-withdraw-requests"],
    queryFn: () => getStaffWithdrawRequests(),
  });

  const approveMutation = useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: any }) => 
      approveWithdrawRequest(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-withdraw-requests"] });
      toast.success("Đã phê duyệt yêu cầu thành công!");
      setStaffProofFile(null);
      setStaffProofPreview(null);
      setStaffNote("");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể phê duyệt yêu cầu");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: any }) => 
      rejectWithdrawRequest(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-withdraw-requests"] });
      toast.info("Đã từ chối yêu cầu và hoàn tiền cho khách hàng.");
      setRejectReason("");
      setStaffNote("");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể từ chối yêu cầu");
    }
  });

  const handleStaffFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStaffProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setStaffProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const allRequests = requestsData?.data || [];
  const requests = allRequests.filter(req => req.status === statusFilter);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <StaffSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={t.financeManagement} />
        <div className="flex flex-1 flex-col bg-[#fdfcf9]">
          <div className="staff-page-header">
            <Breadcrumb items={[{ label: t.finance, href: "/dashboard/staff/finance" }]} homeHref="/dashboard/staff" />
          </div>
          
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold staff-heading">
                    Kiểm soát yêu cầu rút tiền
                  </h2>
                  {/* <p className="text-sm staff-text-secondary mt-1">
                    Xem xét và xác nhận các lệnh rút tiền từ ví người dùng
                  </p> */}
                </div>
              </div>

              <StatsCards 
                stats={[
                  {
                    title: "Tổng yêu cầu",
                    value: allRequests.length,
                    // subtitle: "Danh sách hiện tại",
                    icon: <IconHistory className="h-6 w-6" />,
                    variant: "primary",
                  },
                  {
                    title: "Đang chờ duyệt",
                    value: allRequests.filter(r => r.status === 'PENDING').length,
                    // subtitle: "Cần xử lý ngay",
                    icon: <IconWallet className="h-6 w-6" />,
                    variant: "warning",
                  },
                  {
                    title: "Đã giải ngân",
                    value: allRequests.filter(r => r.status === 'APPROVED').length,
                    // subtitle: "Giao dịch thành công",
                    icon: <IconArrowUpRight className="h-6 w-6" />,
                    variant: "success",
                  }
                ]}
              />

              <div className="mt-6">
                <div className="staff-card border-none shadow-md overflow-hidden bg-white">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-lg font-bold staff-text-primary uppercase tracking-tight">Danh sách yêu cầu</h3>
                    <div className="flex gap-4">
                      <div className="flex rounded-sm border border-gray-100 bg-gray-50 p-1">
                        {["PENDING", "APPROVED", "REJECTED"].map((st) => (
                          <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-all ${
                              statusFilter === st 
                                ? "bg-white text-gray-900 shadow-sm" 
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            {st === "PENDING" ? "Chờ duyệt" : st === "APPROVED" ? "Đã duyệt" : "Đã từ chối"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-[#f8f6f0]">
                        <tr className="h-12 border-none">
                          <th className="px-6 text-left text-xs font-black staff-text-secondary uppercase tracking-widest">Người dùng / Ngày tạo</th>
                          <th className="px-6 text-left text-xs font-black staff-text-secondary uppercase tracking-widest">Trạng thái</th>
                          <th className="px-6 text-right text-xs font-black staff-text-secondary uppercase tracking-widest">Số tiền</th>
                          <th className="px-6 text-right text-xs font-black staff-text-secondary uppercase tracking-widest">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-50">
                        {isLoading ? (
                          <tr><td colSpan={4} className="p-12 text-center text-gray-400 animate-pulse font-bold">Đang tải dữ liệu...</td></tr>
                        ) : requests.length === 0 ? (
                          <tr><td colSpan={4} className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Không có yêu cầu nào</td></tr>
                        ) : (
                          requests.map((req) => (
                            <tr key={req.requestId} className="hover:bg-gray-50/50 transition-colors h-20 border-none group">
                              <td className="px-6">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-gray-100 flex items-center justify-center">
                                    <IconUserCircle className="h-6 w-6 text-gray-300" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold staff-text-primary">{req.user?.fullName || req.senderName}</div>
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-tight">
                                      {format(new Date(req.createdAt), "dd/MM/yyyy HH:mm")}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6">
                                <span className={`inline-flex px-3 py-1 text-xs font-black uppercase tracking-widest
                                  ${req.status === 'APPROVED' ? 'staff-badge-approved' : 
                                    req.status === 'PENDING' ? 'staff-badge-pending animate-pulse' : 'staff-badge-rejected'}
                                `}>
                                  {req.status === "PENDING" ? "Chờ duyệt" : req.status === "APPROVED" ? "Đã duyệt" : "Từ chối"}
                                </span>
                              </td>
                              <td className="px-6 text-right">
                                <span className="text-sm font-black italic tracking-tighter">{req.amount.toLocaleString()} <span className="text-xs not-italic opacity-50">VND</span></span>
                              </td>
                              <td className="px-6 text-right">
                                <Dialog onOpenChange={(open) => { 
                                  if(!open) {
                                    setStaffProofFile(null);
                                    setStaffProofPreview(null);
                                    setRejectReason("");
                                    setStaffNote("");
                                  }
                                }}>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-500 rounded-sm transition-all">
                                      {req.status === 'PENDING' ? <IconEyePin className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="rounded-sm p-0 border-none shadow-2xl overflow-hidden max-w-2xl bg-white">
                                    <div className="h-1.5 bg-[var(--staff-primary)]" />
                                    <div className="p-10 space-y-10">
                                      <DialogHeader>
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">Kiểm tra yêu cầu</DialogTitle>
                                            <DialogDescription className="font-bold text-xs tracking-widest uppercase text-gray-400">Mã yêu cầu: {req.requestId}</DialogDescription>
                                          </div>
                                          <Badge className={
                                            req.status === 'APPROVED' ? 'staff-badge-approved px-5 py-2' : 
                                            req.status === 'PENDING' ? 'staff-badge-pending px-5 py-2' : 'staff-badge-rejected px-5 py-2'
                                          }>
                                            {req.status.toUpperCase()}
                                          </Badge>
                                        </div>
                                      </DialogHeader>

                                      <div className="grid grid-cols-2 gap-10 border-t border-b border-gray-100 py-10">
                                         <div className="space-y-4">
                                            <div>
                                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Người yêu cầu</p>
                                              <p className="text-lg font-black italic">{req.user?.fullName || req.senderName}</p>
                                            </div>
                                            <div>
                                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tài khoản ngân hàng</p>
                                              <p className="text-sm font-bold text-gray-700">{req.bankName}</p>
                                              <p className="text-xs font-black text-gray-400 tracking-wider">STK: {req.recipientBankAccountNumber}</p>
                                              <p className="text-xs font-black text-gray-400 tracking-wider">Tên: {req.recipientBankAccountName}</p>
                                            </div>
                                         </div>
                                         <div className="text-right flex flex-col justify-center">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Số tiền giải ngân</p>
                                            <p className="text-4xl font-black italic text-[var(--staff-primary)]">{req.amount.toLocaleString()} <span className="text-xs not-italic">VND</span></p>
                                         </div>
                                      </div>

                                      {req.status === "PENDING" ? (
                                        <div className="space-y-6">
                                          <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                              <p className="text-xs font-black text-[var(--staff-primary)] uppercase tracking-widest flex items-center gap-2">
                                                <IconReceipt2 className="h-4 w-4" /> Tải chứng từ chuyển khoản
                                              </p>
                                              <div 
                                                onClick={() => staffFileRef.current?.click()}
                                                className="relative aspect-video w-full border-2 border-dashed border-red-100 hover:border-[var(--staff-primary)] transition-all cursor-pointer bg-white flex flex-col items-center justify-center group"
                                              >
                                                {staffProofPreview ? (
                                                  <Image src={staffProofPreview} alt="Staff Proof" fill className="object-cover" />
                                                ) : (
                                                  <div className="text-center p-4">
                                                    <IconCloudUpload className="h-8 w-8 text-red-200 mx-auto group-hover:scale-110 transition-transform" />
                                                    <p className="text-xs font-black text-gray-400 mt-2 uppercase tracking-widest">Nhấp để tải lên</p>
                                                  </div>
                                                )}
                                                <input ref={staffFileRef} type="file" className="hidden" accept="image/*" onChange={handleStaffFileChange} />
                                              </div>
                                            </div>
                                            <div className="space-y-4">
                                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Ghi chú xử lý</p>
                                              <textarea 
                                                className="w-full h-[120px] bg-gray-50 border border-gray-100 p-3 text-xs font-bold outline-none focus:border-red-200"
                                                placeholder="VD: Đã chuyển khoản từ VCB..."
                                                value={staffNote}
                                                onChange={(e) => setStaffNote(e.target.value)}
                                              />
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-4">
                                            <Button 
                                              disabled={!staffProofPreview || approveMutation.isPending}
                                              className={`h-16 rounded-sm font-black tracking-[0.2em] text-xs transition-all ${
                                                staffProofPreview ? 'bg-[#111111] hover:bg-green-600 text-white shadow-xl' : 'bg-gray-100 text-gray-300'
                                              }`}
                                              onClick={() => approveMutation.mutate({
                                                requestId: req.requestId,
                                                data: { proofImage: staffProofFile, staffNote }
                                              })}
                                            >
                                              {approveMutation.isPending ? "ĐANG XỬ LÝ..." : "HOÀN TẤT & PHÊ DUYỆT"}
                                            </Button>
                                            
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button 
                                                  variant="outline"
                                                  className="h-16 rounded-sm border border-red-100 text-red-500 hover:bg-red-50 font-black tracking-[0.2em] text-xs"
                                                >
                                                  TỪ CHỐI YÊU CẦU
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent className="rounded-sm border-none p-8 bg-white shadow-2xl">
                                                <DialogHeader>
                                                  <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Lý do từ chối</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 pt-4">
                                                  <textarea 
                                                    className="w-full h-32 bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none"
                                                    placeholder="VD: Sai thông tin số tài khoản..."
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                  />
                                                  <Button 
                                                    disabled={!rejectReason || rejectMutation.isPending}
                                                    onClick={() => rejectMutation.mutate({
                                                      requestId: req.requestId,
                                                      data: { rejectReason, staffNote }
                                                    })}
                                                    className="w-full h-12 staff-btn-danger !rounded-sm font-black text-xs tracking-[0.1em]"
                                                  >
                                                    {rejectMutation.isPending ? "ĐANG XỬ LÝ..." : "XÁC NHẬN TỪ CHỐI"}
                                                  </Button>
                                                </div>
                                              </DialogContent>
                                            </Dialog>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="space-y-6">
                                          {(req.status === "APPROVED" && req.proofImageUrl) && (
                                            <div className="space-y-4">
                                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <IconCheck className="h-4 w-4 text-green-500" /> Chứng từ giải ngân
                                              </p>
                                              <div className="relative aspect-video border border-gray-100 bg-gray-50 overflow-hidden">
                                                <Image src={req.proofImageUrl} alt="Authorized Proof" fill className="object-contain" />
                                              </div>
                                            </div>
                                          )}
                                          {req.status === "REJECTED" && (
                                            <div className="bg-red-50 p-6 border-l-4 border-red-500">
                                              <p className="text-xs font-black text-red-500 uppercase tracking-widest">Lý do từ chối</p>
                                              <p className="text-sm font-bold text-red-900 mt-1">{req.rejectReason || "N/A"}</p>
                                              {req.staffNote && (
                                                <div className="mt-4 pt-4 border-t border-red-100">
                                                  <p className="text-xs font-black text-red-400 uppercase tracking-widest">Ghi chú staff</p>
                                                  <p className="text-xs font-bold text-red-700 mt-1">{req.staffNote}</p>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
