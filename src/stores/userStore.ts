import { create } from 'zustand';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null, // 初期値はnull
  setUser: (user) => set({ user }),
}));
