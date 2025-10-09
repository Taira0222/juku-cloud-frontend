import { create } from "zustand";
import type { AuthHeader } from "@/features/auth/types/auth";
import { persist } from "zustand/middleware";

type AuthState = {
  auth: AuthHeader | null;
  setAuth: (auth: AuthHeader) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  // signOut 中のフラグ
  signOutInProgress: boolean;
  setSignOutInProgress: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      auth: null,
      setAuth: (auth) => set({ auth }),
      clearAuth: () => {
        set({ auth: null });
        localStorage.removeItem("auth-storage"); // ローカルストレージからも削除
      },
      isAuthenticated: () => {
        const auth = get().auth;
        return (
          auth !== null &&
          auth["access-token"] !== "" &&
          auth.client !== "" &&
          auth.uid !== ""
        );
      },
      signOutInProgress: false,
      setSignOutInProgress: (v) => set({ signOutInProgress: v }),
    }),
    {
      name: "auth-storage",
    }
  )
);
