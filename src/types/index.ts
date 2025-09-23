import type { Draft, EditDraft } from "@/features/students/types/studentForm";
import type { TeacherFormData } from "@/features/teachers/types/teacherForm";

export type ContextType = {
  role: string | undefined;
};

export type ValueType = Draft | EditDraft | TeacherFormData;
export type ValueKind = "Draft" | "EditDraft" | "TeacherFormData";
