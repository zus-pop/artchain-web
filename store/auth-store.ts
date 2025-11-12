import { WhoAmI } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  user: WhoAmI | null;
  staySignedIn: boolean;
  isHydrated: boolean;
  setAccessToken: (accessToken: string | null) => void;
  setUser: (user: WhoAmI | null) => void;
  setStaySignedIn: (staySignedIn: boolean) => void;
  logout: () => void;
  setHydrated: () => void;
}

// Use persist middleware with proper hydration handling
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      staySignedIn: false,
      isHydrated: false,
      setAccessToken: (accessToken: string | null) => {
        set({ accessToken });
      },
      setUser: (user: WhoAmI | null) => {
        set({ user });
      },
      setStaySignedIn: (staySignedIn: boolean) => {
        set({ staySignedIn });
        // If staySignedIn is false, clear localStorage immediately
        if (!staySignedIn) {
          localStorage.removeItem("auth-storage");
        }
      },
      logout: () => {
        set({ accessToken: null, user: null, staySignedIn: false });
        localStorage.removeItem("auth-storage");
      },
      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Only persist if staySignedIn is true
        if (state.staySignedIn) {
          return {
            accessToken: state.accessToken,
            user: state.user,
            staySignedIn: state.staySignedIn,
          };
        }
        return {};
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);
