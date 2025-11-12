// File: ImageSlider.tsx
"use client"; // Đảm bảo component chạy phía Client để sử dụng Hooks

import React, { useState } from "react";
import "./ImageSlider.css";
import Image from "next/image";
import { useGetExhibitionById, useGetExhibitions } from "@/apis/exhibition";
import ImageDialog from "./ImageDialog";

// ------------------------------------
// 1. Định nghĩa Type (Interface)
// ------------------------------------
interface ImageItem {
  id: number;
  // Unsplash URL, tôi sẽ điều chỉnh kích thước để phù hợp
  full: string;
  thumb: string;
  title: string;
  date?: string;
  school?: string;
  award?: string;
}

// ------------------------------------
// 2. Component ImageSlider (TSX)
// ------------------------------------
const ImageSlider: React.FC = () => {
  const { data: exhibitions } = useGetExhibitions();
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<string | null>(null);
  const { data: exhibitionData, isLoading } = useGetExhibitionById(selectedExhibitionId || "");
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter active exhibitions
  const activeExhibitions = exhibitions?.data?.filter(ex => ex.status === "ACTIVE") || [];

  // Map exhibition paintings to ImageItem format
  const images: ImageItem[] = exhibitionData?.data?.exhibitionPaintings?.map((painting, index) => ({
    id: index + 1,
    full: painting.imageUrl || "",
    thumb: painting.imageUrl || "",
    title: painting.competitor.fullName,
    date: new Date(painting.addedAt).toLocaleDateString("vi-VN"),
    school: painting.competitor.schoolName,
    award: painting.award?.name,
  })) || [];

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
  };

  return (
    <section className="py-10 bg-[#EAE6E0] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-20">
          <h2 className="text-2xl font-semibold text-[#423137]">Bộ sưu tập</h2>
          <div className="flex items-center gap-4">
            <span className="text-[#423137]">Hãy chọn cuộc triển lãm</span>
            <select
              onChange={(e) => setSelectedExhibitionId(e.target.value || null)}
              value={selectedExhibitionId || ""}
              className="px-4 py-2 border border-[#e6e0da] rounded-md bg-white text-[#423137]"
            >
              <option value="">Chọn triển lãm</option>
              {activeExhibitions.map((ex) => (
                <option key={ex.exhibitionId} value={ex.exhibitionId}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!selectedExhibitionId ? (
          <div className="text-center py-20">
            <p className="text-[#423137]">Vui lòng chọn một cuộc triển lãm để xem bộ sưu tập</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6E1A]"></div>
          </div>
        ) : !images.length ? (
          <div className="text-center py-20">
            <p className="text-[#423137]">Chưa có tranh nào trong bộ sưu tập</p>
          </div>
        ) : (
          <div
            className="slider"
            style={{
              '--width': '400px',
              '--height': '250px',
              '--quantity': images.length,
            } as React.CSSProperties}
          >
            <div className="list">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="item"
                  style={{
                    '--position': idx + 1,
                  } as React.CSSProperties}
                >
                  <div className="item-content">
                    <div
                      className="relative w-full overflow-hidden border border-[#e6e0da] cursor-pointer"
                      style={{ height: 'var(--height)' } as React.CSSProperties}
                      onClick={() => handleImageClick(img)}
                    >
                      <Image src={img.full} alt={img.title} fill className="object-cover" />
                    </div>
                    
                    {/* Caption below image */}
                    <div className="mt-3 px-2">
                      <h3 className="text-lg font-bold text-[#111827] leading-tight">{img.title}</h3>
                      {img.school && <div className="text-sm text-[#423137] mt-1 leading-tight">{img.school}</div>}
                      {img.award && <div className="text-sm text-[#423137] mt-1 leading-tight">{img.award}</div>}
                    </div>
                  </div>

                  {/* Date moved outside the image frame on the right */}
                  <div className="item-date text-[#111827] text-sm font-medium">
                    {img.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ImageDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        image={selectedImage}
      />
    </section>
  );
};

export default ImageSlider;
