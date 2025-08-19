export type Students = {
  id: number;
  student_code: string;
  name: string;
  status: string;
  school_stage: string;
  grade: number;
};

export type TeachingAssignments = {
  id: number;
  student_id: number;
  user_id: number;
  teaching_status: boolean;
};

export type ClassSubjects = {
  id: number;
  name: string;
};

export type AvailableDays = {
  id: number;
  name: string;
};

export type currentUser = {
  id: number;
  provider: string;
  uid: string;
  allow_password_change: boolean;
  name: string;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
  school_id: number;
  employment_status: string;
  last_sign_in_at: string | null;
  current_sign_in_at: string | null;
  students: Students[] | [];
  teaching_assignments: TeachingAssignments[] | [];
  class_subjects: ClassSubjects[] | [];
  available_days: AvailableDays[] | [];
};

export type teachers = currentUser[] | [];

export type fetchTeachersSuccessResponse = {
  current_user: currentUser | null;
  teachers: teachers | null;
};

export type fetchTeachersErrorResponse = {
  error: string;
};

// teacher 削除のためのデータ型

export type teacherDeleteErrorResponse = {
  error: string;
};

// 詳細情報を表示するためのデータ
export type teacherDetailDrawer = Omit<
  currentUser,
  | 'provider'
  | 'uid'
  | 'allow_password_change'
  | 'updated_at'
  | 'school_id'
  | 'last_sign_in_at'
>;

// teachersStore の型
export type teacherDataTable = {
  id: number;
  name: string;
  role: string;
  employment_status: string;
  classSubject: {
    id: number;
    name: string;
  }[];
  studentsCount: number;
  current_sign_in_at: string | null;
};
