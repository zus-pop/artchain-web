"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ClientOnly component ensures that its children only render on the client side
 * after hydration is complete. This prevents hydration mismatches for components
 * that depend on client-side state like localStorage.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render children when we're on client and store is hydrated
  if (!isClient || !isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
