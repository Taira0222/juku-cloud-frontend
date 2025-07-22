import { create } from 'zustand';

type WarningStore = {
  warningMessage: string;
  setWarningMessage: (message: string) => void;
  setClearWarningMessage: () => void;
};

export const useWarningStore = create<WarningStore>((set) => ({
  warningMessage: '',
  setWarningMessage: (message) => set({ warningMessage: message }),
  setClearWarningMessage: () => set({ warningMessage: '' }),
}));
