"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";
import Loader from "./Loaders";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const isStoreHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    // Mark as hydrated once the store is ready
    if (isStoreHydrated) {
      setIsHydrated(true);
    }
  }, [isStoreHydrated]);

  // Show loading until store is hydrated
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
