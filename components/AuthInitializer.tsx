"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";

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
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Initializing...</p>
      </div>
    );
  }

  return <>{children}</>;
}
