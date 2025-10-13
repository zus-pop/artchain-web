"use client";

import { useEffect, useState } from "react";
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
}

// Client-only hook to safely use auth store
export function useClientAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    isGuardian: false,
    isCompetitor: false,
    setAccessToken: () => {},
    setUser: () => {},
    logout: () => {},
    isLoading: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize store from localStorage
    const store = useAuthStore.getState();
    store.initialize();

    // Subscribe to store changes
    const unsubscribe = useAuthStore.subscribe((state) => {
      setAuthState({
        isAuthenticated: !!state.accessToken,
        user: state.user,
        accessToken: state.accessToken,
        isGuardian: state.user?.role === "GUARDIAN",
        isCompetitor: state.user?.role === "COMPETITOR",
        setAccessToken: state.setAccessToken,
        setUser: state.setUser,
        logout: state.logout,
        isLoading: false,
      });
    });

    // Set initial state
    const initialState = useAuthStore.getState();
    setAuthState({
      isAuthenticated: !!initialState.accessToken,
      user: initialState.user,
      accessToken: initialState.accessToken,
      isGuardian: initialState.user?.role === "GUARDIAN",
      isCompetitor: initialState.user?.role === "COMPETITOR",
      setAccessToken: initialState.setAccessToken,
      setUser: initialState.setUser,
      logout: initialState.logout,
      isLoading: false,
    });

    return unsubscribe;
  }, []);

  return authState;
}
