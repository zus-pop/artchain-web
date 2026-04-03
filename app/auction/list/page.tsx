"use client";
import React, { useState } from "react";
import { Filter, Search } from "lucide-react";
import AuctionCard from "@/components/auction/AuctionCard";
import { useGetAuctions } from "@/apis/auction";
import { AuctionStatus, Auction } from "@/types/auction";
import { useAuth } from "@/hooks";
import { HeaderWrapper } from "@/components/sections/HeaderWrapper";
import { useEffect } from "react";

const STATUS_FILTERS: { id: string; label: string; value?: AuctionStatus[] }[] = [
  { id: "all", label: "Tất cả" },
  { id: "active", label: "Đang diễn ra", value: ["ACTIVE", "LIVE", "ONGOING"] },
  { id: "upcoming", label: "Sắp diễn ra", value: ["UPCOMING", "PENDING"] },
  { id: "ended", label: "Đã kết thúc", value: ["ENDED", "END"] },
  { id: "draft", label: "Bản nháp", value: ["DRAFT"] },
];

export default function AuctionListPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: auctions, isLoading, isError } = useGetAuctions();
  const { user } = useAuth();
  
  if (!mounted) return null;

  const isStaff = user?.role === "STAFF" || user?.role === "ADMIN";

  const availableFilters = STATUS_FILTERS.filter(f => f.id !== "draft" || isStaff);

  const filtered = (auctions ?? []).filter((a: Auction) => {
    // Hide DRAFT from regular users entirely if they are not staff
    if (a.status === "DRAFT" && !isStaff) return false;

    const selectedFilter = STATUS_FILTERS.find((f) => f.id === statusFilter);
    const matchesStatus =
      statusFilter === "all" ||
      (selectedFilter?.value && selectedFilter.value.includes(a.status));
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeCount = (auctions ?? []).filter((a: Auction) => ["ACTIVE", "LIVE", "ONGOING"].includes(a.status)).length;
  const endingSoonCount = (auctions ?? []).filter((a: Auction) => ["UPCOMING", "PENDING"].includes(a.status)).length;

  return (
    <div className="min-h-screen bg-[#eae6e0] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white">
      <HeaderWrapper />
      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-[5%] max-w-[1600px] mx-auto">
        <div className="mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f07d44] mb-4 block">
            Sàn đấu giá trực tuyến
          </span>
          <h1 className="text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
            Cuộc đấu giá <br />
            <span className="text-[#f07d44]">Nghệ thuật</span>
          </h1>
          <p className="text-sm opacity-70 max-w-xl leading-relaxed">
            Khám phá và tham gia đấu giá các tác phẩm nghệ thuật độc đáo từ
            các họa sĩ tài năng. Mỗi tác phẩm đều được chứng thực nguồn gốc
            và đi kèm giấy chứng nhận.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white shadow-sm p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm phiên đấu giá..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-md bg-gray-50 border-2 border-transparent focus:border-[#f07d44] focus:bg-white transition outline-none text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-2 mr-2 text-xs font-bold uppercase tracking-widest opacity-40">
                <Filter size={16} />
                Trạng thái:
              </div>
              {availableFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition ${
                    statusFilter === f.id
                      ? "bg-[#f07d44] text-white shadow-lg shadow-orange-200"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex gap-8 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-bold uppercase tracking-wider opacity-60">
                {activeCount} đấu giá đang diễn ra
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="font-bold uppercase tracking-wider opacity-60">
                {endingSoonCount} sắp diễn ra
              </span>
            </div>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white animate-pulse rounded-md overflow-hidden"
              >
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-32 opacity-40">
            <p className="text-xl font-black uppercase">Lỗi tải dữ liệu</p>
            <p className="text-sm mt-2">Vui lòng thử lại sau</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 opacity-40">
            <p className="text-xl font-black uppercase">Không tìm thấy phiên đấu giá</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((auction) => (
              <AuctionCard key={auction.auctionId} auction={auction} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-20 px-[5%] text-center border-t border-black/5 opacity-30">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em]">
          © 2026 NÉT VẼ XANH — SÀN ĐẤU GIÁ NGHỆ THUẬT
        </p>
      </footer>
    </div>
  );
}
