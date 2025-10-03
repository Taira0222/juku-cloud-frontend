import { api } from "@/lib/api";
import {
  lessonNotesSchema,
  type LessonNoteUpdateRequest,
} from "../types/lessonNote";

export const UpdateLessonNote = async (value: LessonNoteUpdateRequest) => {
  const { data } = await api.patch(`/lesson_notes/${value.id}`, value);
  return lessonNotesSchema.parse(data);
};
