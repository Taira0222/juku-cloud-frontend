import { create } from 'zustand';

type NavState = {
  nextPath: string | null;
  replace: boolean;
  setNextPath: (path: string | null, opts?: { replace?: boolean }) => void;
  clearNextPath: () => void;
};

export const useNavStore = create<NavState>((set) => ({
  nextPath: null,
  replace: false,
  setNextPath: (path, opts) => {
    set({ nextPath: path, replace: opts?.replace ?? false });
  },
  clearNextPath: () => set({ nextPath: null, replace: false }),
}));
