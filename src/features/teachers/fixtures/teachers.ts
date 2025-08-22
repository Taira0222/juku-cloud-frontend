import { toTeacherDetailDrawer } from '../hooks/useFomatTeachersData';
import type { currentUser, teacherDetailDrawer } from '../types/teachers';

// useFormatTeachersData.test のデータ
export const currentUserResponse = {
  id: 1,
  name: 'John Doe',
  role: 'admin',
  email: 'john.doe@example.com',
  created_at: '2023-01-01T12:00:00Z',
  employment_status: 'active',
  current_sign_in_at: '2023-01-01T12:00:00Z',
  students: [
    {
      id: 1,
      student_code: 'S1234',
      name: 'Student One',
      status: 'active',
      school_stage: 'high school',
      grade: 3,
    },
  ],
  available_days: [
    { id: 1, name: 'Monday' },
    { id: 3, name: 'Wednesday' },
    { id: 5, name: 'Friday' },
  ],
  class_subjects: [
    { id: 1, name: 'Math' },
    { id: 2, name: 'English' },
  ],
} as unknown as currentUser;

export const teacher1 = {
  id: 2,
  name: 'Jane Smith',
  role: 'teacher',
  email: 'jane.smith@example.com',
  created_at: '2024-01-01T12:00:00Z',
  employment_status: 'active',
  current_sign_in_at: '2024-01-01T12:00:00Z',
  students: [
    {
      id: 3,
      student_code: 'S4597',
      name: 'Student two',
      status: 'active',
      school_stage: 'junior high school',
      grade: 2,
    },
  ],
  available_days: [
    { id: 2, name: 'Tuesday' },
    { id: 4, name: 'Thursday' },
  ],
  class_subjects: [
    { id: 2, name: 'English' },
    { id: 3, name: 'Science' },
  ],
};

const teachersData = [teacher1 as unknown as currentUser];

const detailRowsMap = teachersData.map(toTeacherDetailDrawer);

const detailDrawer = [
  toTeacherDetailDrawer(currentUserResponse),
  ...detailRowsMap,
];

// ID でdetailDrawer のデータを検索する関数を追加
export const getDetailDrawerDataMock = (id: number): teacherDetailDrawer => {
  return detailDrawer.find((item) => item.id === id) as teacherDetailDrawer;
};
