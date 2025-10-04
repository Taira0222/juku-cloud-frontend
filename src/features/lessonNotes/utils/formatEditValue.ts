import type { lessonNoteType } from "../types/lessonNote";
import type { LessonNoteFormEditValues } from "../types/lessonNoteForm";

export const formatEditValue = (
  value: lessonNoteType
): LessonNoteFormEditValues => {
  return {
    id: value.id,
    subject_id: value.student_class_subject.class_subject.id,
    title: value.title,
    description: value.description,
    note_type: value.note_type,
    expire_date: value.expire_date,
  };
};
