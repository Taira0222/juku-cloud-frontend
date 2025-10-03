import type {
  ClassSubjectType,
  Meta,
} from "@/features/students/types/students";
import type { lessonNoteType } from "./lessonNote";

export type LessonNoteTableProps = {
  studentId: number;
  subjects: ClassSubjectType[];
  lessonNotes: lessonNoteType[];
  meta: Meta;
  isAdmin: boolean;
  isMobile: boolean;
};

export type LessonNoteColumnsProps = {
  isAdmin: boolean;
  subjects: ClassSubjectType[];
  studentId: number;
};

export type LessonNoteRawActionsProps = {
  lessonNote: lessonNoteType;
  subjects: ClassSubjectType[];
  isAdmin: boolean;
  studentId: number;
};
