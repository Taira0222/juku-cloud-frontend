export type Students = {
  id: number;
  student_code: string;
  name: string;
  status: string;
  school_stage: string;
  grade: number;
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
  current_sign_in_at: string | null;
  students: Students[] | [];
  class_subjects: ClassSubjects[] | [];
  available_days: AvailableDays[] | [];
};

export type teachers = currentUser[] | null;

export type fetchTeachersSuccessResponse = {
  current_user: currentUser | null;
  teachers: teachers;
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
  'provider' | 'uid' | 'allow_password_change' | 'updated_at' | 'school_id'
>;

// teachersStore の型
export type teacherDataTable = {
  id: number;
  name: string;
  role: string;
  employment_status: string;
  class_subjects: {
    id: number;
    name: string;
  }[];
  studentsCount: number;
  current_sign_in_at: string | null;
};

// UpdateTeacherApi のリクエストのデータの型
export type updateTeacherRequest = {
  name: string;
  employment_status: string;
  subject_ids: number[];
  available_day_ids: number[];
  student_ids: number[];
};

// updateTeacherApi の成功時のレスポンスのデータの型
export type updateTeacherSuccessResponse = {
  teacher_id: number;
};

// updateTeacherApi のエラー時のレスポンスのデータの型
export type updateTeacherErrorResponse = {
  error: string;
};
