import {
  createLessonNoteSchema,
  editLessonNoteSchema,
  type lessonNoteType,
  type NoteType,
} from "./lessonNote";
import type z from "zod";
import type { Mode } from "@/features/students/types/studentForm";
import type { ClassSubjectType } from "@/features/students/types/students";

export type LessonNoteFormCreateValues = {
  subject_id: number | null;
  title: string;
  description: string | null;
  note_type: NoteType | null;
  expire_date: string;
};

export type LessonNoteFormEditValues = {
  id: number;
  subject_id: number;
  title: string;
  description: string | null;
  note_type: NoteType; // editでは初期値があるのでnull にする必要がない
  expire_date: string;
};

export type LessonNoteFormSchemaByMode = {
  create: typeof createLessonNoteSchema;
  edit: typeof editLessonNoteSchema;
};

export const LessonNoteFormSchema = {
  create: createLessonNoteSchema,
  edit: editLessonNoteSchema,
} as const satisfies LessonNoteFormSchemaByMode;

// モードに応じて submit の型を切り替える
export type LessonNoteFormPayloadByMode<M extends Mode> = z.infer<
  LessonNoteFormSchemaByMode[M]
>;

// modeに応じてFormValueの型を切り替える
export type LessonNoteFormValuesByMode<M extends Mode> = M extends "edit"
  ? LessonNoteFormEditValues
  : LessonNoteFormCreateValues;

export type OnChangeNote<M extends Mode> = (
  updater:
    | LessonNoteFormValuesByMode<M>
    | ((prev: LessonNoteFormValuesByMode<M>) => LessonNoteFormValuesByMode<M>)
) => void;

export type LessonNoteFormProps<M extends Mode> = {
  mode: M;
  value: LessonNoteFormValuesByMode<M>;
  subjects: ClassSubjectType[];
  onChange: OnChangeNote<M>;
  onSubmit: (valid: LessonNoteFormValuesByMode<M>) => void;
  loading: boolean;
};

export type EditLessonNoteLocationState = {
  lessonNote: lessonNoteType;
  subjects: ClassSubjectType[];
  background: Location;
};
