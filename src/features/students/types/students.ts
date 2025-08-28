type Teacher = {
  id: number;
  provider: string;
  uid: string;
  allow_password_change: boolean;
  name: string;
  role: string;
  school_stage: string | null;
  grade: number | null;
  graduated_university: string | null;
  email: string;
  created_at: string;
  updated_at: string;
  school_id: number;
};

type Student = {
  id: number;
  school_id: number;
  student_code: string;
  name: string;
  status: string;
  joined_on: string;
  left_on: string | null;
  school_stage: string;
  grade: number;
  desired_school: string | null;
  created_at: string;
  updated_at: string;
  teachers: Teacher[];
};

export type fetchStudentsResponse = Student[];

type fetchStudentsErrorResponse = {
  error: string;
};

export const isFetchStudentsErrorResponse = (
  data: unknown
): data is fetchStudentsErrorResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as fetchStudentsErrorResponse).error === 'string'
  );
};
