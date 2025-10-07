import type { LessonNoteFormValuesByMode } from "@/features/lessonNotes/types/lessonNoteForm";
import type {
  Draft,
  EditDraft,
  Mode,
} from "@/features/students/types/studentForm";
import type { StudentTraitFormValuesByMode } from "@/features/studentTraits/types/studentTraitForm";
import type { TeacherFormData } from "@/features/teachers/types/teacherForm";

export type ValueType = Draft | EditDraft | TeacherFormData;
export type ValueKind = "Draft" | "EditDraft" | "TeacherFormData";

export type Variant = "lessonNote" | "studentTrait";
export type FormValuesByVariant<
  M extends Mode,
  V extends Variant
> = V extends "lessonNote"
  ? LessonNoteFormValuesByMode<M>
  : StudentTraitFormValuesByMode<M>;
