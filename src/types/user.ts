type school = {
  id: number;
  name: string;
};

type data = {
  id: number;
  provider: string;
  uid: string;
  allow_password_change: boolean;
  name: string;
  role: string;
  email: string;
  school_id: number;
  employment_status: string;
  school: school;
};

export type fetchUserSuccessResponse = {
  success: boolean;
  data: data;
};

export type fetchUserErrorResponse = {
  success: boolean;
  errors: string[];
};
