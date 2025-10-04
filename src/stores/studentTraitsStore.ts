import type { StudentTraitSortByType } from "@/features/studentTraits/key";
import { create } from "zustand";

type StudentTraitsFilters = {
  student_id: number;
  searchKeyword?: string;
  sortBy?: StudentTraitSortByType;
  page: number;
  perPage: number;
};

type StudentTraitsState = {
  filters: StudentTraitsFilters;
  setFilters: (
    patch:
      | Partial<StudentTraitsFilters>
      | ((prev: StudentTraitsFilters) => Partial<StudentTraitsFilters>)
  ) => void;
};

export const useStudentTraitsStore = create<StudentTraitsState>((set) => ({
  filters: { student_id: 0, page: 1, perPage: 10 },
  setFilters: (patch) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...(typeof patch === "function" ? patch(state.filters) : patch),
      },
    })),
}));
