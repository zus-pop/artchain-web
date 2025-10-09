"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerApi } from "@/apis/auth";
import { RegisterRequest } from "@/types";

/**
 * Custom hook for register mutation
 * Handles user registration
 */
export function useRegisterMutation(onSuccessCallback?: () => void) {
  return useMutation<void, Error, RegisterRequest>({
    mutationFn: registerApi,
    onSuccess: () => {
      // Show success message
      toast.success("Registration successful! Please login to continue.");

      // Call callback if provided (e.g., to switch to login tab)
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      // Show error message
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });
}
