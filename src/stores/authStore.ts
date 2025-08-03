import { create } from 'zustand';
import type { AuthHeader } from '@/types/auth';
import { persist } from 'zustand/middleware';

type AuthState = {
  auth: AuthHeader | null;
  setAuth: (auth: AuthHeader) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      auth: null,
      setAuth: (auth) => set({ auth }),
      clearAuth: () => {
        set({ auth: null });
        localStorage.removeItem('auth-storage'); // ローカルストレージからも削除
      },
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
      name: 'auth-storage',
    }
  )
);
