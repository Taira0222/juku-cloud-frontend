import { z } from 'zod';

const subjectEnum = z.enum([
  'english',
  'japanese',
  'mathematics',
  'science',
  'social_studies',
]);

const availableDaysEnum = z.enum([
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]);

const roleEnum = z.enum(['admin', 'teacher']);

// 共通の型
const classSubjectsSchema = z.object({
  id: z.number(),
  name: subjectEnum,
});

const availableDaysSchema = z.object({
  id: z.number(),
  name: availableDaysEnum,
});

// Teacher
const teacherSchema = z.object({
  id: z.number(),
  name: z.string().max(50),
  role: roleEnum,
  teachable_subjects: z.array(classSubjectsSchema), // = Teachable_subjects
  workable_days: z.array(availableDaysSchema), // = workable_days
});

// Student
export const studentSchema = z.object({
  id: z.number(),
  name: z.string().max(50),
  status: z.string(),
  school_stage: z.string(),
  grade: z.number(),
  desired_school: z.string().nullable(),
  joined_on: z.string(), // ISO 8601 date string
  class_subjects: z.array(classSubjectsSchema),
  available_days: z.array(availableDaysSchema),
  teachers: z.array(teacherSchema),
});

export const metaSchema = z.object({
  total_pages: z.number(),
  total_count: z.number(),
  current_page: z.number(),
  per_page: z.number(),
});

// レスポンス全体
export const fetchStudentsSuccessResponseSchema = z.object({
  students: z.array(studentSchema),
  meta: metaSchema,
});

export const fetchStudentsErrorResponseSchema = z.object({
  error: z.string(),
});
