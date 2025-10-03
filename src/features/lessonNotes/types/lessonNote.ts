import {
  descriptionSchema,
  titleSchema,
} from "@/features/studentDashboard/type/studentDashboard";
import {
  classSubjectSchema,
  metaSchema,
} from "@/features/students/types/students";
import { parseISO, startOfDay } from "date-fns";
import z from "zod";

export const noteTypeEnum = z.enum(["homework", "lesson", "other"], {
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

export type lessonNoteType = z.infer<typeof lessonNotesSchema>;

export const fetchLessonNotesSchema = z.object({
  lesson_notes: z.array(lessonNotesSchema, {
    message: "授業引継ぎ一覧の形式が不正です",
  }),
  meta: metaSchema,
});

export type FetchLessonNotesResponse = z.infer<typeof fetchLessonNotesSchema>;

export const createExpireDateSchema = z.string().refine(
  (val) => {
    // startOfDay を使用し時間を切り捨てる
    const today = startOfDay(new Date());
    const inputDate = startOfDay(parseISO(val));
    return inputDate >= today;
  },
  {
    message: "有効期限は今日以降の日付を入力してください",
  }
);
const subjectIdSchema = z
  .number()
  .min(1, { message: "科目を1つ以上選択してください" });

export const createLessonNoteSchema = z.object({
  subject_id: subjectIdSchema,
  title: titleSchema,
  description: descriptionSchema,
  note_type: noteTypeEnum,
  expire_date: createExpireDateSchema,
});

export type LessonNoteCreate = z.infer<typeof createLessonNoteSchema>;

export type LessonNoteCreateRequest = LessonNoteCreate & {
  student_id: number;
};

// 有効期限がすでに過ぎている場合、編集時にエラーになるため、編集時は有効期限のバリデーションを外す
export const editLessonNoteSchema = createLessonNoteSchema
  .omit({
    expire_date: true,
  })
  .extend({
    id: z.number({ message: "IDは数値である必要があります" }),
    expire_date: z.string({ message: "期限日の形式が不正です" }),
  });

export type LessonNoteEdit = z.infer<typeof editLessonNoteSchema>;

export type LessonNoteUpdateRequest = LessonNoteEdit & {
  student_id: number;
};
