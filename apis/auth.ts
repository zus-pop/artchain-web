import React from "react";
import myAxios from "@/lib/custom-axios";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth-store";
import { useRouter } from "next/navigation";

export function useLoginMutation() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (loginRequest: LoginRequest) => {
      const response = await myAxios.post("/auth/login", loginRequest);
      return response.data;
    },
    onSuccess: (result: AuthResponse) => {
      toast.success(`Login Successfully`);
      
      // Directly update store
      useAuthStore.getState().setAccessToken(result.access_token);
      if (result.user) {
        useAuthStore.getState().setUser(result.user);
      }
      
      router.replace("/");
    },
    onError: (error) => {
      toast.error(error.message);
      useAuthStore.getState().logout();
    },
  });
}

export function useRegisterMutation(callback?: () => void) {
  return useMutation({
    mutationFn: async (registerRequest: RegisterRequest) => {
      const response = await myAxios.post("/auth/register", registerRequest);
      return response.data;
    },
    onSuccess: () => {
      toast.success(`Register Successfully! Now go to login`);
      if (callback) callback();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

// Get current user info - client-only hook to avoid SSR issues
export function useGetUserInfo() {
  const [isClient, setIsClient] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    setIsClient(true);
    // Get initial token
    const initialToken = useAuthStore.getState().accessToken;
    console.log("🔍 useGetUserInfo - Initial token:", !!initialToken);
    setToken(initialToken);
    
    // Subscribe to changes
    const unsubscribe = useAuthStore.subscribe((state) => {
      console.log("🔍 useGetUserInfo - Token changed:", !!state.accessToken);
      setToken(state.accessToken);
    });
    
    return unsubscribe;
  }, []);

  const result = useQuery({
    queryKey: ["user-info", token], // Include token in key for cache invalidation
    queryFn: async () => {
      console.log("🚀 Calling /users/me API");
      const response = await myAxios.get("/users/me");
      console.log("✅ /users/me response:", response.data);
      return response.data as User;
    },
    enabled: isClient && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Log query state
  React.useEffect(() => {
    console.log("🔍 useGetUserInfo query state:", {
      isClient,
      hasToken: !!token,
      isLoading: result.isLoading,
      hasData: !!result.data,
      hasError: !!result.error,
      enabled: isClient && !!token
    });
  }, [isClient, token, result.isLoading, result.data, result.error]);

  // Log errors for debugging
  if (result.error) {
    console.error("❌ Error fetching user info:", result.error);
  }

  return result;
}
