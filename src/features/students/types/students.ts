import { z } from 'zod';

const subjectEnum = z.enum(
  ['english', 'japanese', 'mathematics', 'science', 'social_studies'],
  { message: '科目が不正です' }
);

const availableDaysEnum = z.enum(
  [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ],
  { message: '曜日が不正です' }
);

export const SchoolStageEnum = z.enum(
  ['elementary_school', 'junior_high_school', 'high_school'],
  {
    message: '学年が不正です',
  }
);

export const StatusEnum = z.enum(
  ['active', 'inactive', 'on_leave', 'graduated'],
  { message: 'ステータスが不正です' }
);

const roleEnum = z.enum(['admin', 'teacher'], { message: '役割が不正です' });

// 共通の型
export const classSubjectsSchema = z.object({
  id: z.number({ message: '科目IDは数値である必要があります' }),
  name: subjectEnum,
});

export const availableDaysSchema = z.object({
  id: z.number({ message: '曜日IDは数値である必要があります' }),
  name: availableDaysEnum,
});

// Teacher
export const teachersSchema = z.object({
  id: z.number({ message: '講師IDは数値である必要があります' }),
  name: z.string().max(50, { message: '講師名は50文字以内で入力してください' }),
  role: roleEnum,
  teachable_subjects: z.array(classSubjectsSchema, {
    message: '担当可能な科目一覧の形式が不正です',
  }),
  workable_days: z.array(availableDaysSchema, {
    message: '勤務可能曜日一覧の形式が不正です',
  }),
});

// Student
export const studentSchema = z.object({
  id: z.number({ message: '生徒IDは数値である必要があります' }),
  name: z.string().max(50, { message: '生徒名は50文字以内で入力してください' }),
  status: StatusEnum,
  school_stage: SchoolStageEnum,
  grade: z
    .number()
    .min(1, { message: '学年は1から6の範囲で入力してください' })
    .max(6, { message: '学年は1から6の範囲で入力してください' }),
  desired_school: z
    .string({ message: '志望校は文字列または空である必要があります' })
    .nullable(),
  joined_on: z.string({
    message: '入塾日はISO8601形式の日付文字列である必要があります',
  }),
  class_subjects: z.array(classSubjectsSchema, {
    message: '受講科目一覧の形式が不正です',
  }),
  available_days: z.array(availableDaysSchema, {
    message: '希望曜日一覧の形式が不正です',
  }),
  teachers: z.array(teachersSchema, {
    message: '担当講師一覧の形式が不正です',
  }),
});

export const metaSchema = z.object({
  total_pages: z.number({ message: 'ページ数は数値である必要があります' }),
  total_count: z.number({ message: '総件数は数値である必要があります' }),
  current_page: z.number({
    message: '現在のページ番号は数値である必要があります',
  }),
  per_page: z.number({
    message: '1ページあたりの件数は数値である必要があります',
  }),
});

// レスポンス全体
export const fetchStudentsSuccessResponseSchema = z.object({
  students: z.array(studentSchema, { message: '生徒一覧の形式が不正です' }),
  meta: metaSchema,
});
