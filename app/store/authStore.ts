// app/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string; role: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: async (username: string, password: string) => {
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();

          if (data.success) {
            set({
              isAuthenticated: true,
              user: {
                username,
                role: "admin",
              },
            });
            return true;
          }

          return false;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },

      logout: async () => {
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
          });

          set({ isAuthenticated: false, user: null });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },

      checkAuth: async () => {
        try {
          const response = await fetch("/api/auth/check", {
            method: "GET",
          });
          const data = await response.json();
          
          if (data.authenticated) {
            set({
              isAuthenticated: true,
              user: data.user,
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
            });
          }
        } catch (error) {
          console.error("Auth check error:", error);
          set({
            isAuthenticated: false,
            user: null,
          });
        }
      },
    }),
    {
      name: "auth-storage", // name of the item in localStorage
      // Only store authentication state, not methods
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
