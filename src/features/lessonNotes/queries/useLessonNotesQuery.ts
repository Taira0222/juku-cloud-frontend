import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { lessonNoteKeys, type LessonNoteListFilters } from "../key";
import type { FetchLessonNotesResponse } from "../types/lessonNote";
import { FetchLessonNotes } from "../api/lessonNotesApi";

type Opts = { enabled?: boolean };
export const useLessonNotesQuery = (
  filters: LessonNoteListFilters,
  opts?: Opts
) =>
  useQuery<FetchLessonNotesResponse, unknown>({
    queryKey: lessonNoteKeys.list(filters),
    queryFn: () => FetchLessonNotes(filters),
    placeholderData: keepPreviousData,
    ...opts,
  });
