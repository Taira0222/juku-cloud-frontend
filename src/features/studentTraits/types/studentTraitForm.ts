import type { Mode } from "@/features/students/types/studentForm";
import type { CategoryType, StudentTraitType } from "./studentTraits";
import {
  createStudentTraitSchema,
  editStudentTraitSchema,
} from "./studentTraits";
import type z from "zod";

export type StudentTraitFormCreateValues = {
  title: string;
  description: string | null;
  category?: CategoryType;
};

export type StudentTraitFormEditValues = {
  id: number;
  title: string;
  description: string | null;
  category: CategoryType;
};

export type StudentTraitFormSchemaByMode = {
  create: typeof createStudentTraitSchema;
  edit: typeof editStudentTraitSchema;
};

export const StudentTraitFormSchema = {
  create: createStudentTraitSchema,
  edit: editStudentTraitSchema,
} as const satisfies StudentTraitFormSchemaByMode;

// モードに応じて submit の型を切り替える
export type StudentTraitFormPayloadByMode<M extends Mode> = z.infer<
  StudentTraitFormSchemaByMode[M]
>;

// modeに応じてFormValueの型を切り替える
export type StudentTraitFormValuesByMode<M extends Mode> = M extends "edit"
  ? StudentTraitFormEditValues
  : StudentTraitFormCreateValues;

export type OnChangeStudentTrait<M extends Mode> = (
  updater:
    | StudentTraitFormValuesByMode<M>
    | ((
        prev: StudentTraitFormValuesByMode<M>
      ) => StudentTraitFormValuesByMode<M>)
) => void;

export type StudentTraitFormProps<M extends Mode> = {
  mode: M;
  value: StudentTraitFormValuesByMode<M>;
  onChange: OnChangeStudentTrait<M>;
  onSubmit: (data: StudentTraitFormValuesByMode<M>) => void;
  loading?: boolean;
};

export type EditStudentTraitLocationState = {
  background: Location;
  studentTrait: StudentTraitType;
};
