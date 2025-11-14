"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { useEffect } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import Loader from "@/components/Loaders";

function DashboardContent() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Wait for hydration

    if (!isAuthenticated) {
      // Redirect to auth page if not authenticated
      router.push("/auth");
      return;
    }

    // Redirect based on user role
    if (user?.role === "ADMIN") {
      router.push("/dashboard/admin");
    } else if (user?.role === "STAFF") {
      router.push("/dashboard/staff");
    } else {
      // For COMPETITOR and GUARDIAN, redirect to home or show access denied
      router.push("/");
    }
  }, [isAuthenticated, user, router, isLoading]);

  // Show loading while hydrating or checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
         <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ClientOnly
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
         <Loader/>
        </div>
      }
    >
      <DashboardContent />
    </ClientOnly>
  );
}
