import { z } from "zod";

const subjectEnum = z.enum(
  ["english", "japanese", "mathematics", "science", "social_studies"],
  { message: "科目が不正です" }
);

export type subjectType = z.infer<typeof subjectEnum>;

const availableDaysEnum = z.enum(
  [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ],
  { message: "曜日が不正です" }
);

export const SchoolStageEnum = z.enum(
  ["elementary_school", "junior_high_school", "high_school"],
  {
    message: "学年が不正です",
  }
);

export const StatusEnum = z.enum(
  ["active", "inactive", "on_leave", "graduated"],
  { message: "通塾状況が不正です" }
);

const roleEnum = z.enum(["admin", "teacher"], { message: "役割が不正です" });
export type userRole = z.infer<typeof roleEnum>;
export const gradeSchema = z
  .number()
  .min(1, { message: "学年は1から6の範囲で入力してください" })
  .max(6, { message: "学年は1から6の範囲で入力してください" });

export const desiredSchoolSchema = z
  .string({ message: "志望校は文字列または空である必要があります" })
  .nullable();

export const joinedOnSchema = z.string().refine(
  (val) => {
    if (!val) return true;
    const today = new Date();
    const inputDate = new Date(val);
    return inputDate <= today;
  },
  {
    message: "入会日は今日以前の日付を入力してください",
  }
);

// 共通の型
export const classSubjectSchema = z.object({
  id: z.number({ message: "科目IDは数値である必要があります" }),
  name: subjectEnum,
});

export type ClassSubjectType = z.infer<typeof classSubjectSchema>;

export const availableDaysSchema = z.object({
  id: z.number({ message: "曜日IDは数値である必要があります" }),
  name: availableDaysEnum,
});

// Teacher
export const teachersSchema = z.object({
  id: z.number({ message: "講師IDは数値である必要があります" }),
  name: z.string().max(50, { message: "講師名は50文字以内で入力してください" }),
  role: roleEnum,
  teachable_subjects: z.array(classSubjectSchema, {
    message: "担当可能な科目一覧の形式が不正です",
  }),
  workable_days: z.array(availableDaysSchema, {
    message: "勤務可能曜日一覧の形式が不正です",
  }),
});

// TeachingAssignment
export const teachingAssignmentsSchema = z.object({
  teacher_id: z.number({ message: "講師IDは数値である必要があります" }),
  subject_id: z.number({ message: "科目IDは数値である必要があります" }),
  day_id: z.number({ message: "曜日IDは数値である必要があります" }),
});

// Student
export const studentSchema = z.object({
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
  available_days: z.array(availableDaysSchema, {
    message: "希望曜日一覧の形式が不正です",
  }),
  teachers: z.array(teachersSchema, {
    message: "担当講師一覧の形式が不正です",
  }),
  teaching_assignments: z.array(teachingAssignmentsSchema, {
    message: "担当講師一覧の形式が不正です",
  }),
});
export type Student = z.infer<typeof studentSchema>;

export const metaSchema = z.object({
  total_pages: z.number({ message: "ページ数は数値である必要があります" }),
  total_count: z.number({ message: "総件数は数値である必要があります" }),
  current_page: z.number({
    message: "現在のページ番号は数値である必要があります",
  }),
  per_page: z.number({
    message: "1ページあたりの件数は数値である必要があります",
  }),
});

export type Meta = z.infer<typeof metaSchema>;

// レスポンス全体
export const fetchStudentsSuccessResponseSchema = z.object({
  students: z.array(studentSchema, { message: "生徒一覧の形式が不正です" }),
  meta: metaSchema,
});

export type FetchStudentsSuccessResponse = z.infer<
  typeof fetchStudentsSuccessResponseSchema
>;

// Create用（idなし）
export const createStudentSchema = z.object({
  name: z.string().max(50, { message: "生徒名は50文字以内で入力してください" }),
  status: StatusEnum,
  school_stage: SchoolStageEnum,
  grade: gradeSchema,
  desired_school: desiredSchoolSchema,
  joined_on: joinedOnSchema,
  subject_ids: z
    .array(z.number({ message: "科目IDは数値である必要があります" }), {
      message: "受講科目一覧の形式が不正です",
    })
    .min(1, { message: "受講科目を1つ以上選択してください" }),
  available_day_ids: z
    .array(z.number({ message: "曜日IDは数値である必要があります" }), {
      message: "希望曜日一覧の形式が不正です",
    })
    .min(1, { message: "希望曜日を1つ以上選択してください" }),
  assignments: z
    .array(
      z.object({
        teacher_id: z.number({ message: "講師IDは数値である必要があります" }),
        subject_id: z.number({ message: "科目IDは数値である必要があります" }),
        day_id: z.number({ message: "曜日IDは数値である必要があります" }),
      }),
      { message: "担当講師一覧の形式が不正です" }
    )
    .min(1, { message: "担当講師を1人以上割り当ててください" }),
});

export type createStudentPayload = z.infer<typeof createStudentSchema>;

// update 時の schema
export const editStudentSchema = createStudentSchema.extend({
  id: z
    .number({ message: "生徒IDは数値である必要があります" })
    .positive({ message: "生徒IDは正の数である必要があります" }),
});
export type editStudentPayload = z.infer<typeof editStudentSchema>;

export type editLocationState = {
  background?: Location;
  student?: Student;
};
