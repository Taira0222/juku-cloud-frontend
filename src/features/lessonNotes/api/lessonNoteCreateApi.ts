import { api } from "@/lib/api";
import {
  lessonNotesSchema,
  type LessonNoteCreateRequest,
} from "../types/lessonNote";

export const CreateLessonNote = async (value: LessonNoteCreateRequest) => {
  const { data } = await api.post("/lesson_notes", value);
  return lessonNotesSchema.parse(data);
};
