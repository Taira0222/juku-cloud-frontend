export type fetchTeachersResponse = {
  current_user: {
    id: number;
    name: string;
    role: 'teacher' | 'admin';
    email: string;
    school_id: number | null;
  };
  teachers: {
    id: number;
    name: string;
    email: string;
    role: 'teacher' | 'admin';
    school_id: number | null;
  }[];
};

export type fetchTeachersErrorResponse = {
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
