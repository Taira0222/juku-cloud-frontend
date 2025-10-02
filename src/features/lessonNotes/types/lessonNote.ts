import {
  descriptionSchema,
  noteTypeEnum,
  titleSchema,
} from "@/features/studentDashboard/type/studentDashboard";
import z from "zod";

export const createExpireDateSchema = z.string().refine(
  (val) => {
    if (!val) return true;
    const today = new Date();
    const inputDate = new Date(val);
    return inputDate >= today;
  },
  {
    message: "有効期限は今日以降の日付を入力してください",
  }
);

const subjectIdsSchema = z
  .array(z.number())
  .min(1, { message: "科目を1つ以上選択してください" });

export const createLessonNoteSchema = z.object({
  subject_ids: subjectIdsSchema,
  title: titleSchema,
  description: descriptionSchema,
  note_type: noteTypeEnum,
  expire_date: createExpireDateSchema,
});

// 有効期限がすでに過ぎている場合、編集時にエラーになるため、編集時は有効期限のバリデーションを外す
export const editLessonNoteSchema = createLessonNoteSchema
  .omit({
    expire_date: true,
  })
  .extend({
    id: z.number({ message: "IDは数値である必要があります" }),
    expire_date: z.string({ message: "期限日の形式が不正です" }),
  });
