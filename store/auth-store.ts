import { WhoAmI } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  user: WhoAmI | null;
  isHydrated: boolean;
  setAccessToken: (accessToken: string | null) => void;
  setUser: (user: WhoAmI | null) => void;
  logout: () => void;
  setHydrated: () => void;
}

// Use persist middleware with proper hydration handling
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isHydrated: false,
      setAccessToken: (accessToken: string | null) => {
        set({ accessToken });
      },
      setUser: (user: WhoAmI | null) => {
        set({ user });
      },
      logout: () => {
        set({ accessToken: null, user: null });
      },
      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);
