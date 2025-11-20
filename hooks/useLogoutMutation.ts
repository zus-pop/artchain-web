"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutApi } from "@/apis/auth";
import { useAuthStore } from "@/store/auth-store";

/**
 * Custom hook for logout mutation
 * Handles logout logic, clears tokens, and navigates to login
 */
export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation<void, Error>({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Clear auth state
      logout();

      // Clear all queries
      queryClient.clear();

      // Show success message
      toast.success("Đăng xuất thành công");

      // Navigate to login page
      router.push("/auth");
    },
    onError: (error) => {
      // Even if API call fails, logout locally
      logout();
      queryClient.clear();

      // Show error message
      toast.error(
        error.message || "Logout failed, but you've been logged out locally."
      );

      // Navigate to login page
      router.push("/auth");
    },
  });
}
