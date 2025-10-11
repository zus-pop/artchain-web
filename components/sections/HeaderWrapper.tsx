// src/components/NavigationWrapper.tsx

"use client";

import { usePathname } from 'next/navigation';
import ArtistNavigation from "@/components/sections/ArtistNavigation";

// Định nghĩa các đường dẫn bạn muốn ẩn header
const HIDDEN_PATHS = ["/"]; // Trang chủ

// Định nghĩa các đường dẫn và giá trị defaultTab tương ứng
// contest: 1, gallery: 2, prizes: 3
const ACTIVE_PATHS_TABS: { [key: string]: number } = {
  "/contests": 1,
  "/gallery": 2,
  "/prizes": 3,
};

export function HeaderWrapper() {
  const pathname = usePathname();
  const isHidden = HIDDEN_PATHS.includes(pathname);
  const defaultTab = ACTIVE_PATHS_TABS[pathname];
  const isActive = defaultTab !== undefined;

  if (isHidden) {
    return null;
  }
  if (isActive) {
    return <ArtistNavigation defaultTab={defaultTab} />;
  }
  return <ArtistNavigation />;
}