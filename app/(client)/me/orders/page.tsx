"use client";

import {
  CheckCircle2,
  ChevronDown,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
  User,
  UserCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";

type Step = {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  completed?: boolean;
  active?: boolean;
};

const steps: Step[] = [
  { id: 1, label: "Người thắng xác nhận", icon: UserCheck, active: true },
  { id: 2, label: "Kiểm định & niêm phong", icon: ShieldCheck },
  { id: 3, label: "Đang vận chuyển", icon: Truck },
  { id: 4, label: "Hoàn tất", icon: CheckCircle2 },
];

const items = [
  {
    id: "ART-78231",
    name: "Bản In Canvas Limited",
    variant: "Khung gỗ đen",
    price: 1500000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
  },
];

const currency = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)}đ`;

const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
const shipping = 60000;
const holdAmount = subtotal + shipping;

export default function OrdersMockPage() {
  return (
    <main className="min-h-screen bg-[#EAE6E0] px-4 pt-28 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Demo trạng thái</p>
              <p className="text-sm font-medium text-gray-700">Mở nhanh 4 trang chi tiết đơn theo 4 trạng thái giao tác phẩm đấu giá</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/me/orders/1" className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">ID 1 - Chờ người thắng xác nhận</Link>
              <Link href="/me/orders/2" className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">ID 2 - Kiểm định & niêm phong</Link>
              <Link href="/me/orders/3" className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">ID 3 - Đang vận chuyển</Link>
              <Link href="/me/orders/4" className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">ID 4 - Đã giao, chờ xác nhận</Link>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-sm font-semibold text-gray-800">Mã đơn: 356925420</p>
          <p className="mt-1 text-sm text-gray-500">Bạn đã thắng đấu giá. Hệ thống đang giữ tiền trong ví để xử lý giao nhận.</p>

          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="relative grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
                <div className="absolute left-8 right-8 top-4 h-[2px] bg-emerald-200" />
                {steps.map((step) => {
                  const StepIcon = step.icon;
                  const isDone = step.completed || step.active;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${
                          isDone
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-gray-300 bg-white text-gray-400"
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                      </div>
                      <p
                        className={`mt-2 text-center text-xs font-semibold ${
                          step.active ? "text-emerald-700" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      <StepIcon className="mt-1 h-3.5 w-3.5 text-gray-300" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{item.id}</p>
                    <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Màu/Loại: {item.variant}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Số lượng: {item.qty}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{currency(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
            <h2 className="text-2xl font-semibold text-gray-900">Chi phí dự kiến</h2>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Giá trúng đấu</span>
              <span className="font-semibold">{currency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Phí vận chuyển</span>
              <span className="font-semibold">{currency(shipping)}</span>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                <span>Tổng chi phí dự kiến</span>
                <span>{currency(holdAmount)}</span>
              </div>
            </div>
            <p className="text-xs text-amber-700">
              Nếu từ chối nhận sau khi xác nhận đấu giá, hệ thống hoàn ví theo chính sách và khấu trừ tỷ lệ phí vi phạm.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Người mua</h3>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><User className="h-4 w-4" /> John Smith</p>
              <p className="flex items-center gap-2"><Package className="h-4 w-4" /> 1 đơn đấu giá</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Thông tin nhận hàng</h3>
              <span className="text-xs font-semibold text-indigo-500">Chỉnh sửa</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><User className="h-4 w-4" /> john.smith1@gmail.com</p>
              <p className="flex items-center gap-2"><Truck className="h-4 w-4" /> +91 94256 32056</p>
              <p className="flex items-center gap-2"><Wallet className="h-4 w-4" /> Ví: {currency(6500000)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Địa chỉ giao hàng</h3>
              <span className="text-xs font-semibold text-indigo-500">Chỉnh sửa</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> John Smith</p>
              <p>123 Elm Street</p>
              <p>District 1, Ho Chi Minh City</p>
              <p>Vietnam</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Chính sách ví</h3>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Tiền trúng đấu giá được giữ trong ví cho tới khi hoàn tất nhận hàng.</p>
              <p>Nếu từ chối nhận: hệ thống hoàn ví sau khi trừ phí vi phạm theo điều khoản.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
