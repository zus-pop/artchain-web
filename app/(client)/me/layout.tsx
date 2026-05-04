"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, isHydrated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    if (isHydrated) {
      if (!accessToken) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        router.push(`/auth?redirect=${pathname}`);
      } else {
        setIsChecking(false);
      }
    }
  }, [accessToken, isHydrated, router, pathname]);

  if (!isHydrated || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EAE6E0]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF6E1A] border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
