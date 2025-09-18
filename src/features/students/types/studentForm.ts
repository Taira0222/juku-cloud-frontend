import type z from "zod";
import type { createStudentSchema, editStudentSchema } from "./students";

export type Assignment = {
  teacher_id: number;
  subject_id: number;
  day_id: number;
};

export type Draft = {
  name: string;
  status: string;
  school_stage: string;
  grade: number | null;
  desired_school: string | null;
  joined_on: string; // YYYY-MM-DD形式の文字列
  subject_ids: number[];
  available_day_ids: number[];
  assignments: Assignment[];
};

export type EditDraft = Draft & { id: number };

export type StudentFormMode = "create" | "edit";

export type Teacher = {
  id: number;
  name: string;
  teachable_subjects: { id: number; name: string }[];
  workable_days: { id: number; name: string }[];
};

export type SchemaByMode = {
  create: typeof createStudentSchema;
  edit: typeof editStudentSchema;
};

// モードに応じて submit の型を切り替える
export type PayloadByMode<M extends StudentFormMode> = z.infer<SchemaByMode[M]>;

// modeに応じてDraftの型を切り替える
export type DraftByMode<T extends StudentFormMode> = T extends "edit"
  ? EditDraft
  : Draft;

export type ToggleableKeys = "subject_ids" | "available_day_ids";

export type OnChange<M extends StudentFormMode> = (
  updater: DraftByMode<M> | ((prev: DraftByMode<M>) => DraftByMode<M>)
) => void;

export type StudentFormProps<M extends StudentFormMode> = {
  mode: M;
  value: DraftByMode<M>;
  onChange: OnChange<M>;
  onSubmit: (valid: DraftByMode<M>) => void;
  loading?: boolean;
  teachers: Teacher[];
};
