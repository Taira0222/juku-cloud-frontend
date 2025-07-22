import { create } from 'zustand';
import type { AuthHeader } from '@/types/auth';
import { persist } from 'zustand/middleware';

type AuthState = {
  auth?: AuthHeader;
  setAuth: (auth: AuthHeader) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: undefined,
      setAuth: (auth) => set({ auth }),
      clearAuth: () => set({ auth: undefined }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
