"use client";

import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Custom hook for logout mutation
 * Handles logout logic, clears tokens, and navigates to login
 */
export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation<void, Error>({
    mutationFn: async () => {
      // Local-only logout: no API call.
      logout();

      // Clear all queries
      queryClient.clear();

      // Show success message
      toast.success("Đăng xuất thành công");

      // Navigate to login page
      router.push("/auth");
    },
  });
}
