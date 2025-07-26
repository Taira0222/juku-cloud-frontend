import { create } from 'zustand';
import type { AuthHeader } from '@/types/auth';
import { persist } from 'zustand/middleware';

type AuthState = {
  auth: AuthHeader | null; // null または AuthHeader
  setAuth: (auth: AuthHeader) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      auth: null, // 初期値をnullに設定
      setAuth: (auth) => set({ auth }),
      clearAuth: () => set({ auth: null }),
      isAuthenticated: () => {
        const auth = get().auth;
        return (
          auth !== null &&
          auth['access-token'] !== '' &&
          auth.client !== '' &&
          auth.uid !== ''
        );
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
