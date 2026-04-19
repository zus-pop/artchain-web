"use client";

import { updateUserApi, UpdateUserRequest } from "@/apis/user";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook to update user profile information
 * Invalidates the current user query to refresh data across the app
 */
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      updateUserApi(id, data),
    onSuccess: () => {
      // Invalidate the "user-me" query to refresh profile data
      queryClient.invalidateQueries({
        queryKey: ["user-me", accessToken],
      });
    },
  });
}
