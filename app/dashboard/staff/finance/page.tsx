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
  IconUpload, 
  IconHistory, 
  IconCheck, 
  IconX, 
  IconEye,
  IconReceipt2,
  IconCloudUpload,
  IconUserCircle
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";

// Mock Data for User Withdrawal Requests
const MOCK_USER_REQUESTS = [
  {
    id: "WD-8801",
    user: "Nguyen Van A",
    walletId: "W-7721-00",
    date: "2024-03-28",
    amount: 1200000,
    status: "Pending",
    reason: "Withdraw to Vietcombank",
    userNote: "Please process ASAP",
    staffProof: null,
  },
  {
    id: "WD-8802",
    user: "Tran Thi B",
    walletId: "W-5542-12",
    date: "2024-03-27",
    amount: 5000000,
    status: "Approved",
    reason: "Withdrawal to BIDV",
    userNote: "N/A",
    staffProof: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "WD-8803",
    user: "Le Van C",
    walletId: "W-9091-66",
    date: "2024-03-26",
    amount: 350000,
    status: "Rejected",
    reason: "Incomplete KYC",
    userNote: "N/A",
    staffProof: null,
  }
];

export default function StaffFinancePage() {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  
  const [requests, setRequests] = useState(MOCK_USER_REQUESTS);
  const [approvingRequestId, setApprovingRequestId] = useState<string | null>(null);
  const [staffProofImage, setStaffProofImage] = useState<string | null>(null);
  const staffFileRef = useRef<HTMLInputElement>(null);
  
  const handleStaffFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStaffProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApprove = (id: string) => {
    if (!staffProofImage) {
      toast.error("You must upload transfer proof image to approve this request.");
      return;
    }

    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "Approved", staffProof: staffProofImage } : req
    ));
    setStaffProofImage(null);
    setApprovingRequestId(null);
    toast.success(`Request ${id} has been approved with proof.`);
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "Rejected" } : req
    ));
    setApprovingRequestId(null);
    toast.info(`Request ${id} has been rejected.`);
  };

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
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb items={[{ label: t.finance, href: "/dashboard/staff/finance" }]} homeHref="/dashboard/staff" />
          </div>
          
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              
              {/* Page Header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold staff-heading">
                    Withdrawal Requests Monitor
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    Review and authorize user fund withdrawals
                  </p>
                </div>
              </div>

              {/* Summary Stats */}
              <StatsCards 
                stats={[
                  {
                    title: "Total Requests",
                    value: requests.length,
                    subtitle: "Life-time requests",
                    icon: <IconHistory className="h-6 w-6" />,
                    variant: "primary",
                  },
                  {
                    title: "Pending Approval",
                    value: requests.filter(r => r.status === 'Pending').length,
                    subtitle: "Action required",
                    icon: <IconWallet className="h-6 w-6" />,
                    variant: "warning",
                  },
                  {
                    title: "Total Paid Out",
                    value: "154,200,000 VND",
                    subtitle: "Successfully processed",
                    icon: <IconArrowUpRight className="h-6 w-6" />,
                    variant: "success",
                  }
                ]}
              />

              {/* Requests Feed - Borderless Style */}
              <div className="mt-6">
                <div className="staff-card border-none shadow-md overflow-hidden bg-white">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-lg font-bold staff-text-primary uppercase tracking-tight">Active Requests Feed</h3>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="rounded-none font-bold text-[10px] text-gray-400">FILTER</Badge>
                      <Badge variant="outline" className="rounded-none font-bold text-[10px] text-gray-400">SORT</Badge>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-[#f8f6f0]">
                        <tr className="h-12 border-none">
                          <th className="px-6 text-left text-[10px] font-black staff-text-secondary uppercase tracking-widest">User / Date</th>
                          <th className="px-6 text-left text-[10px] font-black staff-text-secondary uppercase tracking-widest">Status</th>
                          <th className="px-6 text-right text-[10px] font-black staff-text-secondary uppercase tracking-widest">Amount</th>
                          <th className="px-6 text-right text-[10px] font-black staff-text-secondary uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-50">
                        {requests.length === 0 ? (
                          <tr><td colSpan={4} className="p-12 text-center text-gray-400">No requests found</td></tr>
                        ) : (
                          requests.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50/50 transition-colors h-20 border-none group">
                              <td className="px-6">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-gray-100 flex items-center justify-center">
                                    <IconUserCircle className="h-6 w-6 text-gray-300" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold staff-text-primary">{req.user}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{req.date} • {req.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6">
                                <span className={`inline-flex px-3 py-1 text-[9px] font-black uppercase tracking-widest
                                  ${req.status === 'Approved' ? 'staff-badge-approved' : 
                                    req.status === 'Pending' ? 'staff-badge-pending animate-pulse' : 'staff-badge-rejected'}
                                `}>
                                  {req.status}
                                </span>
                              </td>
                              <td className="px-6 text-right">
                                <span className="text-sm font-black italic tracking-tighter">{req.amount.toLocaleString()} VND</span>
                              </td>
                              <td className="px-6 text-right">
                                <Dialog onOpenChange={(open) => { if(!open) setStaffProofImage(null); }}>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-500 rounded-none transition-all">
                                      {req.status === 'Pending' ? <IconHistory className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="rounded-none p-0 border-none shadow-2xl overflow-hidden max-w-2xl bg-white">
                                    <div className="h-1.5 bg-[#d9534f]" />
                                    <div className="p-10 space-y-10">
                                      <DialogHeader>
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">Request Inspection</DialogTitle>
                                            <DialogDescription className="font-bold text-[9px] tracking-widest uppercase text-gray-400">Reference Number: {req.id}</DialogDescription>
                                          </div>
                                          <Badge className={
                                            req.status === 'Approved' ? 'staff-badge-approved px-5 py-2' : 
                                            req.status === 'Pending' ? 'staff-badge-pending px-5 py-2' : 'staff-badge-rejected px-5 py-2'
                                          }>
                                            {req.status.toUpperCase()}
                                          </Badge>
                                        </div>
                                      </DialogHeader>

                                      <div className="grid grid-cols-2 gap-10 border-t border-b border-gray-100 py-10">
                                         <div className="space-y-4">
                                            <div>
                                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Requesting Party</p>
                                              <p className="text-lg font-black italic">{req.user}</p>
                                              <p className="text-[10px] text-gray-400 font-medium">{req.walletId}</p>
                                            </div>
                                            <div>
                                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Purpose</p>
                                              <p className="text-sm font-bold text-gray-700">{req.reason}</p>
                                              <p className="text-xs italic text-gray-400 mt-1">"{req.userNote}"</p>
                                            </div>
                                         </div>
                                         <div className="text-right flex flex-col justify-center">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payout Amount</p>
                                            <p className="text-4xl font-black italic text-[#d9534f]">{req.amount.toLocaleString()} <span className="text-xs not-italic">VND</span></p>
                                         </div>
                                      </div>

                                      {/* Logic for Pending Approval */}
                                      {req.status === "Pending" ? (
                                        <div className="space-y-6">
                                          <div className="bg-red-50/50 p-6 border-l-4 border-[#d9534f]">
                                            <p className="text-[10px] font-black text-[#d9534f] uppercase tracking-widest mb-4 flex items-center gap-2">
                                              <IconReceipt2 className="h-4 w-4" /> Upload Transfer Receipt to Authorize
                                            </p>
                                            
                                            <div 
                                              onClick={() => staffFileRef.current?.click()}
                                              className="relative aspect-video w-full border-2 border-dashed border-red-100 hover:border-[#d9534f] transition-all cursor-pointer bg-white flex flex-col items-center justify-center p-6 group"
                                            >
                                              {staffProofImage ? (
                                                <Image src={staffProofImage} alt="Staff Proof" fill className="object-contain p-2" />
                                              ) : (
                                                <div className="text-center">
                                                  <IconCloudUpload className="h-10 w-10 text-red-200 mx-auto group-hover:scale-110 transition-transform" />
                                                  <p className="text-[10px] font-black text-gray-400 mt-3 uppercase tracking-widest">Drop Screenshot or Click to Browse</p>
                                                </div>
                                              )}
                                              <input ref={staffFileRef} type="file" className="hidden" accept="image/*" onChange={handleStaffFileChange} />
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-4">
                                            <Button 
                                              disabled={!staffProofImage}
                                              className={`h-16 rounded-none font-black tracking-[0.2em] text-xs transition-all ${
                                                staffProofImage ? 'bg-[#111111] hover:bg-green-600 text-white shadow-xl' : 'bg-gray-100 text-gray-300'
                                              }`}
                                              onClick={() => handleApprove(req.id)}
                                            >
                                              COMPLETE & APPROVE
                                            </Button>
                                            <Button 
                                              variant="outline"
                                              className="h-16 rounded-none border border-red-100 text-red-500 hover:bg-red-50 font-black tracking-[0.2em] text-xs"
                                              onClick={() => handleReject(req.id)}
                                            >
                                              REJECT REQUEST
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        /* Display proof for already approved requests */
                                        req.staffProof && (
                                          <div className="space-y-4">
                                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <IconCheck className="h-4 w-4 text-green-500" /> Authorized Transfer Receipt
                                             </p>
                                             <div className="relative aspect-video border border-gray-100 bg-gray-50 overflow-hidden">
                                                <Image src={req.staffProof} alt="Authorized Proof" fill className="object-contain" />
                                             </div>
                                          </div>
                                        )
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
