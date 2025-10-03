import {
  classSubjectSchema,
  desiredSchoolSchema,
  gradeSchema,
  joinedOnSchema,
  SchoolStageEnum,
  StatusEnum,
} from "@/features/students/types/students";

import z from "zod";

export const titleSchema = z
  .string()
  .trim()
  .min(1, { message: "タイトルは必須です" })
  .max(50, { message: "タイトルは50文字以内で入力してください" });

export const descriptionSchema = z
  .string()
  .max(500, { message: "説明は500文字以内で入力してください" })
  .nullable();

export const StudentDetailSchema = z.object({
  id: z.number({ message: "生徒IDは数値である必要があります" }),
  name: z.string().max(50, { message: "生徒名は50文字以内で入力してください" }),
  status: StatusEnum,
  school_stage: SchoolStageEnum,
  grade: gradeSchema,
  desired_school: desiredSchoolSchema,
  joined_on: joinedOnSchema,
  class_subjects: z.array(classSubjectSchema, {
    message: "受講科目一覧の形式が不正です",
  }),
});

export type StudentDetail = z.infer<typeof StudentDetailSchema>;
