import type { lessonNote } from "@/features/studentDashboard/type/studentDashboard";
import type { ClassSubjectType } from "@/features/students/types/students";

export type LessonNoteTableProps = {
  studentId: number;
  subjects: ClassSubjectType[];
  lessonNotes: lessonNote[];
  isAdmin: boolean;
  isMobile: boolean;
};

export type LessonNoteColumnsProps = {
  isAdmin: boolean;
  subjects: ClassSubjectType[];
  studentId: number;
};

export type LessonNoteRawActionsProps = {
  lessonNote: lessonNote;
  subjects: ClassSubjectType[];
  isAdmin: boolean;
  studentId: number;
};
