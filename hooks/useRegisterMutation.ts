"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerApi } from "@/apis/auth";
import { RegisterRequest } from "@/types";

export function useRegisterMutation(onSuccessCallback?: () => void) {
  return useMutation<void, Error, RegisterRequest>({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success("Đăng ký thành công! Hãy đăng nhập để tiếp tục");

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });
}
