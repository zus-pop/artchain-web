"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginApi } from "@/apis/auth";
import { useAuthStore } from "@/store/auth-store";
import { LoginRequest, AuthResponse } from "@/types";

/**
 * Custom hook for login mutation
 * Handles login logic, token storage, and navigation
 */
export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAccessToken, setUser } = useAuthStore();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // Store access token
      setAccessToken(data.access_token);

      // Store user info if available
      if (data.user) {
        setUser(data.user);
      }

      // Show success message
      toast.success("Login successful! Welcome back.");

      // Invalidate user query to refetch data
      queryClient.invalidateQueries({ queryKey: ["user-me"] });

      // Navigate to home page
      router.push("/");
    },
    onError: (error) => {
      // Show error message
      toast.error(error.message || "Login failed. Please try again.");
      
      // Clear any stored tokens on error
      setAccessToken(null);
      setUser(null);
    },
  });
}
