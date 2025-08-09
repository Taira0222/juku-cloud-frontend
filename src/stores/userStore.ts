import { create } from 'zustand';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  school: string;
};

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null, // 初期値はnull
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
