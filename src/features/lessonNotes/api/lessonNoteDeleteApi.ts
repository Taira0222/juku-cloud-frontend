import { api } from "@/lib/api";
import type { LessonNoteDeletePayload } from "../types/lessonNote";

export const DeleteLessonNote = async ({
  studentId,
  lessonNoteId,
}: LessonNoteDeletePayload) => {
  const { data } = await api.delete(`/lesson_notes/${lessonNoteId}`, {
    params: { student_id: studentId },
  });
  return data;
};
