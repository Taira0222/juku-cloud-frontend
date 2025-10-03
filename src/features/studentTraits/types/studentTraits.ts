import {
  descriptionSchema,
  titleSchema,
} from "@/features/studentDashboard/type/studentDashboard";
import { metaSchema } from "@/features/students/types/students";
import z from "zod";

const categoryEnum = z.enum(["good", "careful"], {
  message: "カテゴリーが正しくありません",
});

export type CategoryType = z.infer<typeof categoryEnum>;

export const studentTraitSchema = z.object({
  id: z.number({ message: "IDは数値である必要があります" }),
  title: titleSchema,
  description: descriptionSchema,
  category: categoryEnum,
  created_at: z.string({ message: "作成日の形式が不正です" }),
  updated_at: z.string({ message: "更新日の形式が不正です" }),
});

export type StudentTraitType = z.infer<typeof studentTraitSchema>;

export const fetchStudentTraitsSchema = z.object({
  student_traits: z.array(studentTraitSchema, {
    message: "生徒の特性一覧の形式が不正です",
  }),
  meta: metaSchema,
});

export type FetchStudentTraitsResponse = z.infer<
  typeof fetchStudentTraitsSchema
>;
