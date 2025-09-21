import type { Draft } from "@/features/students/types/studentForm";
import type {
  createStudentPayload,
  editStudentSchema,
  Student,
  teachersSchema,
} from "@/features/students/types/students";
import {
  AVAILABLE_DAYS_MOCK,
  SUBJECTS_MOCK,
  teacher1,
  teacher2,
  teacher3,
} from "@/tests/fixtures/teachers/teachers";
import type z from "zod";

const isoString = "2025-09-01";

export const mockStudent1: Student = {
  id: 1,
  name: "mockStudent One",
  status: "active",
  school_stage: "high_school",
  grade: 3,
  desired_school: "Stanford university",
  joined_on: isoString,
  class_subjects: [
    SUBJECTS_MOCK[0], // 英語
    SUBJECTS_MOCK[2], // 数学
    SUBJECTS_MOCK[3], // 理科
  ],
  available_days: [
    AVAILABLE_DAYS_MOCK[2], // 火曜日
    AVAILABLE_DAYS_MOCK[4], // 木曜日
    AVAILABLE_DAYS_MOCK[5], // 金曜日
  ],
  // teacher1, 3を所有
  teachers: [
    {
      id: teacher1.id,
      name: teacher1.name,
      role: teacher1.role,
      teachable_subjects: teacher1.class_subjects, // 英語、理科
      workable_days: teacher1.available_days, // 火曜日、木曜日
    } as z.infer<typeof teachersSchema>,
    {
      id: teacher3.id,
      name: teacher3.name,
      role: teacher3.role,
      teachable_subjects: teacher3.class_subjects, // 数学
      workable_days: teacher3.available_days, // 金曜日
    } as z.infer<typeof teachersSchema>,
  ],
  teaching_assignments: [
    {
      teacher_id: 2, // teacher1
      subject_id: 1, // 英語
      day_id: 3, // 火曜日
    },
    {
      teacher_id: 4, // teacher3
      subject_id: 2, // 数学
      day_id: 6, // 金曜日
    },
  ],
};

export const mockStudent2: Student = {
  id: 2,
  name: "mockStudent Two",
  status: "active",
  school_stage: "junior_high_school",
  grade: 3,
  desired_school: "Harvard high school",
  joined_on: isoString,
  class_subjects: [
    SUBJECTS_MOCK[0], // 英語
    SUBJECTS_MOCK[2], // 数学
    SUBJECTS_MOCK[3], // 理科
  ],
  available_days: [
    AVAILABLE_DAYS_MOCK[2], // 火曜日
    AVAILABLE_DAYS_MOCK[4], // 木曜日
    AVAILABLE_DAYS_MOCK[5], // 金曜日
  ],
  teachers: [
    {
      id: teacher2.id,
      name: teacher2.name,
      role: teacher2.role,
      teachable_subjects: teacher2.class_subjects, //英語、理科
      workable_days: teacher2.available_days, // 火曜日、木曜日
    } as z.infer<typeof teachersSchema>,
    {
      id: teacher3.id,
      name: teacher3.name,
      role: teacher3.role,
      teachable_subjects: teacher3.class_subjects, // 数学
      workable_days: teacher3.available_days, // 金曜日
    } as z.infer<typeof teachersSchema>,
  ],
  teaching_assignments: [
    {
      teacher_id: 2, // teacher1
      subject_id: 1, // 英語
      day_id: 3, // 火曜日
    },
    {
      teacher_id: 4, // teacher3
      subject_id: 2, // 数学
      day_id: 6, // 金曜日
    },
  ],
};

// createStudent のレスポンス用モック
export const mockStudent3: Student = {
  id: 3,
  name: "mockStudent Three",
  status: "inactive",
  school_stage: "elementary_school",
  grade: 6,
  desired_school: null,
  joined_on: isoString,
  class_subjects: [SUBJECTS_MOCK[0]], // 英語
  available_days: [AVAILABLE_DAYS_MOCK[2]], // 火曜日
  teachers: [
    {
      id: teacher1.id,
      name: teacher1.name,
      role: teacher1.role,
      teachable_subjects: teacher1.class_subjects, // 英語、理科
      workable_days: teacher1.available_days, // 火曜日、木曜日
    } as z.infer<typeof teachersSchema>,
  ],
  teaching_assignments: [
    {
      teacher_id: 2,
      subject_id: 1,
      day_id: 3,
    },
  ],
};

export const mockMeta = {
  total_pages: 1,
  total_count: 2,
  current_page: 1,
  per_page: 10,
};

export const studentsMock = [mockStudent1, mockStudent2];

export const createStudentMockPayload: createStudentPayload = {
  name: "mockStudent Three",
  status: "inactive",
  school_stage: "elementary_school",
  grade: 6,
  desired_school: null,
  joined_on: isoString,
  subject_ids: [1], // 英語
  available_day_ids: [3], // 火曜日
  assignments: [
    { teacher_id: 2, subject_id: 1, day_id: 3 }, // teacher1をアサイン
  ],
};
export const createResponseStudentMock: Student = mockStudent3;

// studentFormDerived のモック
export const mockTeachers = [teacher1, teacher2, teacher3].map((t) => ({
  id: t.id,
  name: t.name,
  role: t.role,
  teachable_subjects: t.class_subjects,
  workable_days: t.available_days,
}));

// useStudentForm の edit モード用モック
export const editStudentMockPayload: z.infer<typeof editStudentSchema> = {
  ...createStudentMockPayload,
  id: 3,
};

export const editResponseStudentMock: Student = {
  ...mockStudent3,
  status: "inactive",
};

export const initialMockValue: Draft = {
  name: "",
  school_stage: "",
  grade: null,
  status: "",
  desired_school: "",
  joined_on: "",
  subject_ids: [],
  available_day_ids: [],
  assignments: [],
};
