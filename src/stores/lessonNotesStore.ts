import type { LessonNoteSortByType } from "@/features/lessonNotes/key";
import { create } from "zustand";

type LessonNotesFilters = {
  student_id: number;
  subject_id: number;
  searchKeyword?: string;
  sortBy?: LessonNoteSortByType;
  page: number;
  perPage: number;
};

type LessonNoteState = {
  filters: LessonNotesFilters;
  setFilters: (
    patch:
      | Partial<LessonNotesFilters>
      | ((prev: LessonNotesFilters) => Partial<LessonNotesFilters>)
  ) => void;
};

export const useLessonNotesStore = create<LessonNoteState>((set) => ({
  filters: { student_id: 0, subject_id: 0, page: 1, perPage: 10 },
  setFilters: (patch) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...(typeof patch === "function" ? patch(state.filters) : patch),
      },
    })),
}));
