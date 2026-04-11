"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Box,
  CheckCircle2,
  Clock3,
  MapPinned,
  PackageCheck,
  ShieldCheck,
  Truck,
  UserCheck,
  Wallet,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

type ShippingStage = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  done: boolean;
};

type OrderMock = {
  id: string;
  orderCode: string;
  artworkTitle: string;
  artworkImage: string;
  artist: string;
  price: number;
  shippingFee: number;
  walletPaid: number;
  statusLabel: string;
  statusTone: "amber" | "blue" | "indigo" | "green";
  etaText: string;
  note: string;
  shippingStages: ShippingStage[];
};

const ORDER_MOCKS: Record<string, OrderMock> = {
  "1": {
    id: "1",
    orderCode: "AUC-2026-0001",
    artworkTitle: "Viết Sắc Trên Lụa",
    artworkImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200",
    artist: "Trần Thế Vĩnh",
    price: 12500000,
    shippingFee: 180000,
    walletPaid: 12680000,
    statusLabel: "Chờ người thắng xác nhận",
    statusTone: "amber",
    etaText: "Vui lòng xác nhận trong 24 giờ",
    note: "Tác phẩm đã sẵn sàng tại kho hệ thống. Bạn cần xác nhận tiếp tục nhận hàng trong 24 giờ, nếu hủy sẽ bị khấu trừ phí xử lý theo chính sách.",
    shippingStages: [
      { title: "Người thắng xác nhận", icon: UserCheck, done: false },
      { title: "Kiểm định và niêm phong", icon: ShieldCheck, done: false },
      { title: "Đang vận chuyển", icon: Truck, done: false },
      { title: "Đã giao", icon: PackageCheck, done: false },
    ],
  },
  "2": {
    id: "2",
    orderCode: "AUC-2026-0002",
    artworkTitle: "Sóng Sớm Trên Phố Cổ",
    artworkImage: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1200",
    artist: "Lê Thanh Hương",
    price: 18900000,
    shippingFee: 230000,
    walletPaid: 19130000,
    statusLabel: "Đang kiểm định & niêm phong",
    statusTone: "blue",
    etaText: "Dự kiến hoàn tất trong hôm nay, 19:00",
    note: "Tác phẩm đang được đội ngũ chuyên môn kiểm tra tính nguyên bản và đóng gói theo tiêu chuẩn bảo tàng.",
    shippingStages: [
      { title: "Người thắng xác nhận", icon: UserCheck, done: true },
      { title: "Kiểm định và niêm phong", icon: ShieldCheck, done: false },
      { title: "Đang vận chuyển", icon: Truck, done: false },
      { title: "Đã giao", icon: PackageCheck, done: false },
    ],
  },
  "3": {
    id: "3",
    orderCode: "AUC-2026-0003",
    artworkTitle: "Vũ Điệp Ánh Sáng",
    artworkImage: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=1200",
    artist: "Nguyễn Văn Minh",
    price: 25600000,
    shippingFee: 260000,
    walletPaid: 25860000,
    statusLabel: "Đang vận chuyển",
    statusTone: "indigo",
    etaText: "Dự kiến giao: 27/03/2026 trước 18:00",
    note: "Đơn vị vận chuyển chuyên dụng đang giao tranh trong thùng chống sốc. Cảm biến nhiệt độ đang ổn định.",
    shippingStages: [
      { title: "Người thắng xác nhận", icon: UserCheck, done: true },
      { title: "Kiểm định và niêm phong", icon: ShieldCheck, done: true },
      { title: "Đang vận chuyển", icon: Truck, done: false },
      { title: "Đã giao", icon: PackageCheck, done: false },
    ],
  },
  "4": {
    id: "4",
    orderCode: "AUC-2026-0004",
    artworkTitle: "Thung Lũng Mây",
    artworkImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200",
    artist: "Phạm Gia Linh",
    price: 9800000,
    shippingFee: 160000,
    walletPaid: 9960000,
    statusLabel: "Đã giao hàng",
    statusTone: "green",
    etaText: "Đã giao lúc 10:24, 25/03/2026",
    note: "Kiện hàng đã đến địa chỉ nhận. Vui lòng xác nhận trong 24 giờ để hoàn tất quy trình và giải phóng tiền cho người bán.",
    shippingStages: [
      { title: "Người thắng xác nhận", icon: UserCheck, done: true },
      { title: "Kiểm định và niêm phong", icon: ShieldCheck, done: true },
      { title: "Đang vận chuyển", icon: Truck, done: true },
      { title: "Đã giao", icon: PackageCheck, done: true },
    ],
  },
};

const toneClassMap = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
} as const;

const formatVnd = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)}đ`;

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [currentStatusId, setCurrentStatusId] = useState(id);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  const order = useMemo(() => ORDER_MOCKS[currentStatusId] || ORDER_MOCKS["1"], [currentStatusId]);

  const total = order.price + order.shippingFee;
  const activeStageIndex = Math.max(order.shippingStages.findIndex((stage) => !stage.done), 0);
  const resolvedActiveStage = order.shippingStages.every(s => s.done) ? order.shippingStages.length - 1 : activeStageIndex;

  return (
    <main className="min-h-screen bg-[#EAE6E0] px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        
        {/* Header điều hướng */}
        <div className="flex items-center justify-between">
          <Link href="/me/orders" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
          </Link>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
             {["1", "2", "3", "4"].map((demoId) => (
              <button
                key={demoId}
                onClick={() => setCurrentStatusId(demoId)}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                  currentStatusId === demoId ? "bg-[#FF6E1A] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Trạng thái {demoId}
              </button>
            ))}
          </div>
        </div>

        {/* Tiến trình giao hàng (Full Width) */}
        <section className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Tiến trình giao tác phẩm</h2>
          <div className="mt-5 overflow-x-auto">
            <div className="min-w-[760px]">
              <div
                className="relative grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${order.shippingStages.length}, minmax(0, 1fr))`,
                }}
              >
                <div className="absolute left-8 right-8 top-4 h-[2px] bg-emerald-200" />
                {order.shippingStages.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isDone = step.done || idx === resolvedActiveStage;
                  const isActive = idx === resolvedActiveStage;
                  return (
                    <div key={step.title} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${
                          isDone
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-gray-300 bg-white text-gray-400"
                        }`}
                      >
                        {step.done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                      </div>
                      <p
                        className={`mt-2 text-center text-xs font-semibold ${
                          isActive ? "text-emerald-700" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <StepIcon
                        className={`mt-1 h-3.5 w-3.5 ${
                          isActive ? "text-emerald-500" : "text-gray-300"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Bố cục chính: 2 Cột */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          
          {/* CỘT TRÁI: Thông tin chính */}
          <div className="flex-1 space-y-6">
            
            {/* Thông báo quan trọng (Chỉ hiện ở Status 1) */}
            {currentStatusId === "1" && !isRejected && (
              <section className="animate-in fade-in slide-in-from-top-4 rounded-sm border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-amber-900">Yêu cầu xác nhận nhận hàng</p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-700">
                      Hệ thống ghi nhận bạn đã thắng đấu giá. Vui lòng kiểm tra thông tin và xác nhận để chúng tôi bắt đầu quy trình vận chuyển chuyên dụng.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {isRejected && (
              <section className="rounded-sm border border-red-200 bg-red-50 p-5 shadow-sm">
                <p className="text-sm font-bold text-red-700 uppercase">Đơn hàng đã bị từ chối</p>
                <p className="mt-1 text-xs text-red-600">Phí phạt vi phạm (12%) đã được khấu trừ vào ví của bạn.</p>
              </section>
            )}

            {/* Chi tiết tác phẩm */}
            <section className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${toneClassMap[order.statusTone]}`}>
                    {order.statusLabel}
                  </span>
                  <h1 className="mt-4 text-3xl font-black text-gray-900">{order.artworkTitle}</h1>
                  <p className="text-gray-500">Nghệ sĩ: <span className="font-semibold text-gray-900">{order.artist}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-gray-400">Mã đơn hàng</p>
                  <p className="font-mono text-sm font-bold text-gray-900">#{order.orderCode}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-600 border border-gray-100">
                  {order.note}
                </div>

                {/* Tracking nội bộ tùy theo status */}
                {currentStatusId === "2" && (
                  <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-blue-700">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <p>Chuyên gia đang thực hiện đối soát vân tay và niêm phong bảo mật tại kho.</p>
                  </div>
                )}
                {currentStatusId === "3" && (
                  <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-indigo-700">
                    <Truck className="h-5 w-5 shrink-0" />
                    <p>Xe vận chuyển chuyên dụng đang di chuyển. Nhiệt độ thùng xe: 22°C (Ổn định).</p>
                  </div>
                )}
              </div>
            </section>

            {/* Ảnh tác phẩm lớn */}
            <section className="overflow-hidden rounded-sm border border-gray-200 bg-white p-2 shadow-sm">
              <img
                src={order.artworkImage}
                alt={order.artworkTitle}
                className="h-[400px] w-full rounded-xl object-cover shadow-inner"
              />
            </section>
          </div>

          {/* CỘT PHẢI: Chi phí & Hành động (Sidebar) */}
          <aside className="w-full space-y-6 lg:w-[380px]">
            
            {/* Box Chi Phí */}
            <section className="sticky top-24 rounded-sm border border-gray-200 bg-white p-6 shadow-lg shadow-gray-200/50">
              <h3 className="text-lg font-bold text-gray-900">Chi phí dự kiến</h3>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Giá trúng đấu</span>
                  <span className="font-semibold text-gray-900">{formatVnd(order.price)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Phí vận chuyển dự kiến</span>
                  <span className="font-semibold text-gray-900">{formatVnd(order.shippingFee)}</span>
                </div>
                <div className="my-4 border-t border-dashed border-gray-200 pt-4">
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-gray-900">Tổng:</span>
                    <span className="text-2xl font-black text-[#FF6E1A]">{formatVnd(total)}</span>
                  </div>
                  {/* <p className="mt-1 text-[10px] text-right text-gray-400">Đã bao gồm VAT & Phí bảo hiểm tác phẩm</p> */}
                </div>
              </div>

              {/* Nút hành động thay đổi theo trạng thái */}
              <div className="mt-8 space-y-3">
                {currentStatusId === "1" && !isRejected && (
                  <>
                    <button 
                      onClick={() => setCurrentStatusId("2")}
                      className="w-full rounded-xl bg-[#FF6E1A] py-4 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-transform active:scale-95 hover:bg-[#e65a00]"
                    >
                      Xác nhận nhận đơn hàng
                    </button>
                    <button 
                      onClick={() => setIsRejectDialogOpen(true)}
                      className="w-full rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Từ chối (Hủy đơn)
                    </button>
                  </>
                )}

                {currentStatusId === "4" && (
                  <button className="w-full rounded-xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-transform active:scale-95 hover:bg-emerald-700">
                    Xác nhận đã nhận hàng
                  </button>
                )}

                {(currentStatusId === "2" || currentStatusId === "3") && (
                  <button className="w-full rounded-xl bg-gray-900 py-4 text-sm font-bold text-white transition-transform active:scale-95">
                    Liên hệ hỗ trợ 24/7
                  </button>
                )}
              </div>

              {/* Thông tin thêm bên dưới cột phải */}
              <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <MapPinned className="h-4 w-4 text-gray-400" />
                  <span>Vận chuyển từ: <b>Kho Hà Nội</b></span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Box className="h-4 w-4 text-gray-400" />
                  <span>Đóng gói: <b>Tiêu chuẩn Bảo tàng</b></span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-700 font-medium">Bảo hiểm 100% giá trị tác phẩm</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Modal xác nhận từ chối */}
      {isRejectDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md animate-in zoom-in-95 rounded-3xl bg-white p-8 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <X className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Xác nhận từ chối?</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Hành động này không thể hoàn tác. Bạn sẽ bị khấu trừ <b>12% phí vi phạm</b> ({formatVnd(order.price * 0.12)}) theo điều khoản đấu giá.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsRejectDialogOpen(false);
                  setIsRejected(true);
                  setCurrentStatusId("1");
                }}
                className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700"
              >
                Tôi đồng ý và muốn hủy
              </button>
              <button
                onClick={() => setIsRejectDialogOpen(false)}
                className="w-full rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}