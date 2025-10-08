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

export const createStudentTraitSchema = studentTraitSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type StudentTraitCreate = z.infer<typeof createStudentTraitSchema>;

export type StudentTraitCreateRequest = StudentTraitCreate & {
  student_id: number;
};

export const editStudentTraitSchema = studentTraitSchema.omit({
  created_at: true,
  updated_at: true,
});

export type StudentTraitEdit = z.infer<typeof editStudentTraitSchema>;

export type StudentTraitUpdateRequest = StudentTraitEdit & {
  student_id: number;
};

export type StudentTraitDeletePayload = {
  studentId: number;
  studentTraitId: number;
};
