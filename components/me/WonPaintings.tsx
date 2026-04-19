"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetWonPaintings } from "@/apis/auction";
import { WonPainting } from "@/types/auction";
import { formatCurrency } from "@/lib/utils";

interface WonPaintingsProps {
  userId?: string;
}

export default function WonPaintings({ userId }: WonPaintingsProps) {
  const { data: wonPaintings, isLoading, isError } = useGetWonPaintings(userId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium opacity-50">Đang tải danh sách đơn hàng...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 opacity-50">
        <p className="text-lg font-bold uppercase">Lỗi tải dữ liệu</p>
        <p className="text-sm">Vui lòng thử lại sau</p>
      </div>
    );
  }

  if (!wonPaintings || wonPaintings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-black/10 rounded-sm bg-gray-50/50">
        <div className="text-4xl mb-4">🎨</div>
        <p className="text-lg font-bold uppercase opacity-30">Chưa có đơn hàng nào</p>
        <p className="text-sm opacity-40">Các tác phẩm bạn đấu giá thành công sẽ xuất hiện tại đây.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wonPaintings.map((wp) => (
        <div
          key={wp.auctionPaintingId}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
        >
          {/* Painting Image */}
          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
            <Image
              src={wp.painting.imageUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400"}
              alt={wp.painting.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              Đã trúng 
            </div>
          </div>

          {/* Painting Info */}
          <div className="p-5">
            <h3 className="font-black text-lg leading-tight mb-2 line-clamp-1 group-hover:text-[#f07d44] transition-colors">
              {wp.painting.title}
            </h3>
            
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-50 font-medium">Giá trúng :</span>
                <span className="font-black text-[#f07d44]">
                  {formatCurrency(wp.finalBid)}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-[10px]">
                <span className="opacity-40 font-bold uppercase tracking-widest">Phiên đấu giá:</span>
                <span className="opacity-60 font-medium truncate ml-2">{wp.auctionTitle}</span>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <span className="opacity-40 font-bold uppercase tracking-widest">Mã tác phẩm:</span>
                <span className="font-mono opacity-60">#{String(wp.painting.paintingId).slice(0, 8)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex gap-2">
              <button className="flex-1 bg-black text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-sm active:scale-95">
                Chi tiết
              </button>
              <Link
                href={{
                  pathname: "/mint-nft",
                  query: {
                    paintingId: wp.painting.paintingId,
                    competitorUserId: wp.painting.competitorId,
                  },
                }}
                className="flex-1 bg-[#FF6E1A] text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition shadow-sm active:scale-95 text-center"
              >
                Mint NFT
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
