// src/components/NavigationWrapper.tsx

"use client";

import { usePathname } from 'next/navigation';
import ArtistNavigation from "@/components/sections/ArtistNavigation";

// Định nghĩa các đường dẫn bạn muốn ẩn header
const HIDDEN_PATHS = ["/"]; // Trang chủ

export function HeaderWrapper() {
  const pathname = usePathname();

  // Kiểm tra nếu đường dẫn hiện tại nằm trong danh sách ẩn
  const isHidden = HIDDEN_PATHS.includes(pathname);

  if (isHidden) {
    return null; // Không render header nếu đang ở trang chủ
  }

  // Render header cho các trang khác
  return <ArtistNavigation />;
}