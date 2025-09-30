import {
  classSubjectSchema,
  desiredSchoolSchema,
  gradeSchema,
  joinedOnSchema,
  SchoolStageEnum,
  StatusEnum,
} from "@/features/students/types/students";

import z from "zod";

const titleSchema = z
  .string()
  .max(100, { message: "タイトルは100文字以内で入力してください" });

const descriptionSchema = z
  .string()
  .max(1000, { message: "説明は1000文字以内で入力してください" })
  .nullable();

const categoryEnum = z.enum(["good", "careful"], {
  message: "カテゴリーが正しくありません",
});

export type CategoryType = z.infer<typeof categoryEnum>;

const noteTypeEnum = z.enum(["homework", "lesson", "other"], {
  message: "ノートタイプが正しくありません",
});

export type NoteType = z.infer<typeof noteTypeEnum>;

const studentClassSubjectSchema = z.object({
  id: z.number({ message: "科目IDは数値である必要があります" }),
  class_subject: classSubjectSchema,
});

const someoneBySchema = z.object({
  id: z.number({ message: "ユーザーIDは数値である必要があります" }),
  name: z
    .string()
    .max(50, { message: "ユーザー名は50文字以内で入力してください" }),
});

export const studentTraitsSchema = z.object({
  id: z.number({ message: "IDは数値である必要があります" }),
  title: titleSchema,
  description: descriptionSchema,
  category: categoryEnum,
  created_at: z.string({ message: "作成日の形式が不正です" }),
  updated_at: z.string({ message: "更新日の形式が不正です" }),
});

export const lessonNotesSchema = z.object({
  id: z.number({ message: "IDは数値である必要があります" }),
  title: titleSchema,
  description: descriptionSchema,
  note_type: noteTypeEnum,
  created_by_name: z.string().max(50, {
    message: "作成者名は50文字以内で入力してください",
  }),
  last_updated_by_name: z
    .string()
    .max(50, { message: "最終更新者名は50文字以内で入力してください" })
    .nullable(),
  expire_date: z.string({ message: "期限日の形式が不正です" }),
  created_by: someoneBySchema,
  last_updated_by: someoneBySchema.nullable(),
  student_class_subject: studentClassSubjectSchema,
  created_at: z.string({ message: "作成日の形式が不正です" }),
  updated_at: z.string({ message: "更新日の形式が不正です" }),
});

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
  student_traits: z.array(studentTraitsSchema, {
    message: "生徒の特性一覧の形式が不正です",
  }),
  lesson_notes: z.array(lessonNotesSchema, {
    message: "授業ノート一覧の形式が不正です",
  }),
});

export type StudentDetail = z.infer<typeof StudentDetailSchema>;

export type studentTrait = z.infer<typeof studentTraitsSchema>;
export type lessonNote = z.infer<typeof lessonNotesSchema>;
