"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginApi } from "@/apis/auth";
import { useAuthStore } from "@/store/auth-store";
import { LoginRequest, AuthResponse } from "@/types";

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAccessToken, setUser } = useAuthStore();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAccessToken(data.access_token);

      if (data.user) {
        setUser(data.user);
      }

      toast.success("Login successful! Welcome back.");

      queryClient.invalidateQueries({ queryKey: ["user-me"] });

      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed. Please try again.");
      
      setAccessToken(null);
      setUser(null);
    },
  });
}
