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
  const { setAccessToken, setUser, setStaySignedIn } = useAuthStore();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: (data, variables) => {
      setAccessToken(data.access_token);
      setStaySignedIn(variables.staySignedIn || false);

      if (data.user) {
        setUser(data.user);
      }

      toast.success("Đăng nhập thành công!.");

      queryClient.invalidateQueries({ queryKey: ["user-me"] });

      if (data.user?.role === "STAFF") {
        router.push("/dashboard/staff/contests");
        return;
      }

      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");

      setAccessToken(null);
      setUser(null);
      setStaySignedIn(false);
    },
  });
}
