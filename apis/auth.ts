import myAxios from "@/lib/custom-axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "../store";
import { useRouter } from "next/navigation";

export function useLoginMutation() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  return useMutation({
    mutationFn: async (loginRequest: LoginRequest) => {
      const response = await myAxios.post("/auth/login", loginRequest);
      return response.data;
    },
    onSuccess: (result: AuthResponse) => {
      toast.success(`Login Successfully`);
      setAccessToken(result.access_token);
      router.replace("/");
    },
    onError: (error) => {
      toast.error(error.message);
      setAccessToken(null);
    },
  });
}

export function useRegisterMutation(callback?: () => void) {
  return useMutation({
    mutationFn: async (registerRequest: RegisterRequest) => {
      const response = await myAxios.post("/auth/register", registerRequest);
      return response.data;
    },
    onSuccess: (result: AuthResponse) => {
      toast.success(`Register Successfully! Now go to login`);
      if (callback) callback();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
