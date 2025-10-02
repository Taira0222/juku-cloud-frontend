import type { Mode } from "@/features/students/types/studentForm";
import type { LessonNoteFormValuesByMode } from "../types/lessonNoteForm";

export const normalizeLessonNotePayload = <M extends Mode>(
  value: LessonNoteFormValuesByMode<M>
) => ({
  ...value,
  description:
    value.description && value.description.trim() !== ""
      ? value.description.trim()
      : null,
});
