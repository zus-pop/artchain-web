// src/components/NavigationWrapper.tsx

"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import AuctionHeader from "./AuctionHeader";

// Định nghĩa các đường dẫn bạn muốn ẩn header
const HIDDEN_PATHS = ["/auth"]; 

export function HeaderWrapper() {
  const pathname = usePathname();
  const isHidden =
    HIDDEN_PATHS.includes(pathname) || pathname.match(/\/exhibition\/\d+\/3d/);

  if (isHidden) {
    return null;
  }

  // Nếu là trang đấu giá, chúc mừng, hoặc ví
  if (
    pathname.startsWith("/auction") || 
    pathname.startsWith("/congratulation") ||
    pathname.startsWith("/me/wallet")
  ) {
    return <AuctionHeader />;
  }

  return <Header />;
}
