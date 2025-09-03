import {
  AVAILABLE_DAYS_MOCK,
  SUBJECTS_MOCK,
  teacher1,
  teacher2,
  teacher3,
} from '@/tests/fixtures/teachers/teachers';

const isoString = new Date(Date.now()).toISOString();

export const mockStudent1 = {
  id: 1,
  name: 'mockStudent One',
  status: 'active',
  school_stage: 'high_school',
  grade: 3,
  desired_school: 'Stanford university',
  joined_on: isoString, // 今の日時をRails に合わせてISOに変換する
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
    },
    {
      id: teacher3.id,
      name: teacher3.name,
      role: teacher3.role,
      teachable_subjects: teacher3.class_subjects, // 数学
      workable_days: teacher3.available_days, // 金曜日
    },
  ],
};

export const mockStudent2 = {
  id: 2,
  name: 'mockStudent Two',
  status: 'active',
  school_stage: 'junior_high_school',
  grade: 3,
  desired_school: 'Harvard high school',
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
    },
    {
      id: teacher3.id,
      name: teacher3.name,
      role: teacher3.role,
      teachable_subjects: teacher3.class_subjects, // 数学
      workable_days: teacher3.available_days, // 金曜日
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
