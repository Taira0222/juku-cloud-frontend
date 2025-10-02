import type { ChangeEvent } from "react";
import type {
  LessonNoteFormValuesByMode,
  OnChangeNote,
} from "@/features/lessonNotes/types/lessonNoteForm";
import type { Mode } from "@/features/students/types/studentForm";

export const lessonNoteFormHandlers = <M extends Mode>(
  onChange: OnChangeNote<M>
) => {
  const handleInputChange =
    (field: keyof LessonNoteFormValuesByMode<M>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // Selectコンポーネント用のハンドラー
  const handleSelectChange =
    <T extends keyof LessonNoteFormValuesByMode<M>>(field: T) =>
    (value: LessonNoteFormValuesByMode<M>[T]) => {
      onChange((prev) => ({ ...prev, [field]: value }));
    };

  return {
    handleInputChange,
    handleSelectChange,
  };
};
