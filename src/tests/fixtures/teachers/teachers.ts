import { toTeacherDetailDrawer } from '../../../features/teachers/hooks/useFomatTeachersData';
import type {
  currentUser,
  teacherDetailDrawer,
} from '../../../features/teachers/types/teachers';

export const student1 = {
  id: 1,
  student_code: 'S1234',
  name: 'Student One',
  status: 'active',
  school_stage: 'high_school',
  grade: 3,
};

export const student2 = {
  id: 2,
  student_code: 'S1235',
  name: 'Student Two',
  status: 'active',
  school_stage: 'junior_high_school',
  grade: 3,
};

export const student3 = {
  id: 3,
  student_code: 'S4597',
  name: 'Student Three',
  status: 'active',
  school_stage: 'junior_high_school',
  grade: 2,
};

// 曜日のモックデータ
export const AVAILABLE_DAYS_MOCK = [
  { id: 1, name: 'sunday' },
  { id: 2, name: 'monday' },
  { id: 3, name: 'tuesday' },
  { id: 4, name: 'wednesday' },
  { id: 5, name: 'thursday' },
  { id: 6, name: 'friday' },
  { id: 7, name: 'saturday' },
] as const;

// 教科のモックデータ
export const SUBJECTS_MOCK = [
  { id: 1, name: 'english' },
  { id: 2, name: 'japanese' },
  { id: 3, name: 'mathematics' },
  { id: 4, name: 'science' },
  { id: 5, name: 'social_studies' },
] as const;

// useFormatTeachersData.test のデータ
export const currentUserResponse = {
  id: 1,
  name: 'John Doe',
  role: 'admin',
  email: 'john.doe@example.com',
  created_at: '2023-01-01T12:00:00Z',
  employment_status: 'active',
  current_sign_in_at: '2023-01-01T12:00:00Z',
  students: [student1, student2],
  available_days: [
    AVAILABLE_DAYS_MOCK[1], // Monday
    AVAILABLE_DAYS_MOCK[3], // Wednesday
    AVAILABLE_DAYS_MOCK[5], // Friday
  ],
  class_subjects: [
    SUBJECTS_MOCK[0], // English
    SUBJECTS_MOCK[2], // Mathematics
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
  students: [student3],
  available_days: [
    AVAILABLE_DAYS_MOCK[2], // Tuesday
    AVAILABLE_DAYS_MOCK[4], // Thursday
  ],
  class_subjects: [
    SUBJECTS_MOCK[0], // English
    SUBJECTS_MOCK[3], // Science
  ],
} as unknown as currentUser;

export const teacher2 = {
  id: 3,
  name: 'Alice Johnson',
  role: 'teacher',
  email: 'alice.johnson@example.com',
  created_at: '2024-01-01T12:00:00Z',
  employment_status: 'active',
  current_sign_in_at: '2024-01-01T12:00:00Z',
  students: [student3],
  available_days: [
    AVAILABLE_DAYS_MOCK[2], // Tuesday
    AVAILABLE_DAYS_MOCK[4], // Thursday
  ],
  class_subjects: [
    SUBJECTS_MOCK[0], // English
    SUBJECTS_MOCK[3], // Science
  ],
} as unknown as currentUser;

// msw の handlers で使用する講師一覧のモックデータ
export const teachers = [teacher1, teacher2];

export const teachersData = [teacher1];

const detailRowsMap = teachersData.map(toTeacherDetailDrawer);

export const detailDrawer = [
  toTeacherDetailDrawer(currentUserResponse),
  ...detailRowsMap,
];

// ID でdetailDrawer のデータを検索する関数を追加
export const getDetailDrawerDataMock = (id: number): teacherDetailDrawer => {
  return detailDrawer.find((item) => item.id === id) as teacherDetailDrawer;
};

// updateTeacherApi のモック
export const requestUpdateMockData = {
  name: 'John Doe',
  employment_status: 'active',
  subject_ids: [1, 2],
  available_day_ids: [1, 2, 3],
  student_ids: [101, 102, 103],
};

// useFormatEditDataの モックデータ

export const formatEditMock = {
  formData: {
    name: 'John Doe',
    employment_status: 'invalid_status',
    subjects: ['unknown'],
    available_days: ['unknown'],
    student_ids: [100],
  },
  detailDrawer: detailDrawer,
};
