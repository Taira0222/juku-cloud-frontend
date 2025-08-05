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
