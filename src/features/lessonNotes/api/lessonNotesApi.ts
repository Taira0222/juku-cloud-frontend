import { api } from "@/lib/api";
import type { LessonNoteListFilters } from "../key";
import { fetchLessonNotesSchema } from "../types/lessonNote";

export const FetchLessonNotes = async (filters: LessonNoteListFilters) => {
  const { data } = await api.get("/lesson_notes", { params: filters });
  return fetchLessonNotesSchema.parse(data);
};
