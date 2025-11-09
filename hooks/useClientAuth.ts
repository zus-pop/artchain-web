"use client";

import { useAuthStore } from "@/store/auth-store";
import { WhoAmI } from "@/types/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: WhoAmI | null;
  accessToken: string | null;
  isGuardian: boolean;
  isCompetitor: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: WhoAmI | null) => void;
  logout: () => void;
  isLoading: boolean;
  isHydrated: boolean;
}

// Client-only hook to safely use auth store
export function useClientAuth(): AuthState {
  const { accessToken, user, isHydrated, setAccessToken, setUser, logout } =
    useAuthStore();

  return {
    isAuthenticated: !!accessToken,
    user,
    accessToken,
    isGuardian: user?.role === "GUARDIAN",
    isCompetitor: user?.role === "COMPETITOR",
    setAccessToken,
    setUser,
    logout,
    isLoading: !isHydrated,
    isHydrated,
  };
}
