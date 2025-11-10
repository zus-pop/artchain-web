// File: ImageSlider.tsx
"use client"; // Đảm bảo component chạy phía Client để sử dụng Hooks

import React from "react";
import "./ImageSlider.css";
import Image from "next/image";

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
// 2. Dữ liệu Mẫu (sử dụng ảnh Unsplash)
// ------------------------------------
const images: ImageItem[] = [
  {
    id: 1,
    // Ảnh lớn: sa mạc (Marrakech Merzouga)
    full: "https://images.unsplash.com/photo-1602294898768-b739023bac3d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2574",
    thumb:
      "https://images.unsplash.com/photo-1602294898768-b739023bac3d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2574",
    // thumb: 'https://images.unsplash.com/photo-1549419137-97d8b548b809?w=250&h=300&fit=crop',
    title: "Việt Hoàng",
    date: "16-11-2025",
    school: "Trường Tiểu học Nha Trang",
    award: "Giải nhất",
  },
  {
    id: 2,
    // Ảnh lớn: núi tuyết/khu nghỉ dưỡng (Nagano Prefecture)
    full: "https://images.unsplash.com/photo-1571080708032-b973eb2ea285?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2671",
    thumb:
      "https://images.unsplash.com/photo-1571080708032-b973eb2ea285?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2671",
    // thumb: 'https://images.unsplash.com/photo-1510461872166-50d75062a46e?w=250&h=300&fit=crop',
    title: "Ngọc Thiện",
    date: "16-11-2025",
    school: "Trường Tiểu học Nha Trang",
    award: "Giải nhì",
  },
  {
    id: 3,
    // Ảnh lớn: vách đá/công viên quốc gia (Yosemite)
    full: "https://images.unsplash.com/photo-1675720787471-9aaf944c0cc3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2667",
    thumb:
      "https://images.unsplash.com/photo-1675720787471-9aaf944c0cc3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2667",
    //thumb: 'https://images.unsplash.com/photo-1548485293-847253503d2e?w=250&h=300&fit=crop',
    title: "Yosemite Park",
    date: "16-11-2025",
    school: "Trường Tiểu học Nha Trang",
    award: "Giải ba",
  },
  {
    id: 4,
    // Ảnh lớn: khí cầu/địa điểm kỳ lạ (Goreme Valley)
    full: "https://images.unsplash.com/photo-1548346106-936738156107?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670",
    thumb:
      "https://images.unsplash.com/photo-1548346106-936738156107?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670",
    // thumb: 'https://images.unsplash.com/photo-1524318042571-7ffb2a0c4f92?w=250&h=300&fit=crop',
    title: "Goreme Valley",
    date: "16-11-2025",
    school: "Trường Tiểu học Nha Trang",
    award: "Khuyến khích",
  },
  {
    id: 5,
    // Ảnh lớn: khí cầu/địa điểm kỳ lạ (Goreme Valley)
    full: "https://images.unsplash.com/photo-1721491211723-e91e4952647c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=985",
    thumb:
      "https://images.unsplash.com/photo-1721491211723-e91e4952647c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=985",
    // thumb: 'https://images.unsplash.com/photo-1524318042571-7ffb2a0c4f92?w=250&h=300&fit=crop',
    title: "Goreme Valley",
    date: "16-11-2025",
    school: "Trường Tiểu học Nha Trang",
    award: "Khuyến khích",
  },
  {
    id: 6,
    // Ảnh lớn: khí cầu/địa điểm kỳ lạ (Goreme Valley)
    full: "https://images.unsplash.com/photo-1762515303947-cef3ea72386d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2071",
    thumb:
      "https://images.unsplash.com/photo-1762515303947-cef3ea72386d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2071",
    // thumb: 'https://images.unsplash.com/photo-1524318042571-7ffb2a0c4f92?w=250&h=300&fit=crop',
    title: "Goreme Valley",
    date: "16-11-2025",
    school: "Trường Tiểu học Nha Trang",
    award: "Khuyến khích",
  }
];

// ------------------------------------
// 3. Component ImageSlider (TSX)
// ------------------------------------
const ImageSlider: React.FC = () => {
  return (
    <section className="py-10 bg-[#EAE6E0] px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#423137] mb-20">Bộ sưu tập</h2>
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
                  <div className="relative w-full overflow-hidden border border-[#e6e0da]" style={{ height: 'var(--height)' } as React.CSSProperties}>
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
                  {img.date || "16-11-2025"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;
