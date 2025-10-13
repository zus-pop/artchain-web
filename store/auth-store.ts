import { WhoAmI } from "@/types";
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  user: WhoAmI | null;
  setAccessToken: (accessToken: string | null) => void;
  setUser: (user: WhoAmI | null) => void;
  logout: () => void;
  initialize: () => void;
}

// Simple store without persist middleware to avoid SSR issues
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (accessToken: string | null) => {
    set({ accessToken });
    // Manual localStorage sync
    if (typeof window !== "undefined") {
      if (accessToken) {
        localStorage.setItem("auth-token", accessToken);
      } else {
        localStorage.removeItem("auth-token");
      }
    }
  },
  setUser: (user: WhoAmI | null) => {
    set({ user });
    // Manual localStorage sync
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("auth-user", JSON.stringify(user));
      } else {
        localStorage.removeItem("auth-user");
      }
    }
  },
  logout: () => {
    set({ accessToken: null, user: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("auth-user");
    }
  },
  initialize: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth-token");
      const userStr = localStorage.getItem("auth-user");

      console.log("🔄 Auth Store Initialize:");
      console.log("  - Token from localStorage:", !!token);
      console.log("  - User from localStorage:", !!userStr);

      if (token) {
        console.log("  - Setting token to store");
        set({ accessToken: token });
      }

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          console.log("  - Setting user to store:", user);
          set({ user });
        } catch (e) {
          console.error("Failed to parse stored user:", e);
        }
      }
    }
  },
}));
