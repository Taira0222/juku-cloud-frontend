type currentUser = {
  id: number;
  name: string;
  role: 'teacher' | 'admin';
  email: string;
  school_id: number | null;
  students: Students[];
};

type teachers = {
  id: number;
  name: string;
  email: string;
  role: 'teacher' | 'admin';
  school_id: number | null;
  students: Students[];
}[];

type Students = {
  id: number;
  student_code: string;
  name: string;
};

export type fetchTeachersResponse = {
  current_user: currentUser;
  teachers: teachers;
};

type fetchTeachersErrorResponse = {
  error: string;
};

export const isFetchTeachersErrorResponse = (
  data: unknown
): data is fetchTeachersErrorResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as fetchTeachersErrorResponse).error === 'string'
  );
};
