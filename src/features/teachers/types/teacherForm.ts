import type { teacherDetailDrawer } from "./teachers";

// toggleInArray を使用するkey の型
export type ToggleableKeys = "subjects" | "available_days";

export type TeacherFormData = {
  name: string;
  employment_status: string;
  subjects: string[];
  available_days: string[];
};

export type TeacherSubmitProps = {
  formData: TeacherFormData;
  teacherId: number;
  handleClose: () => void;
};

export type setFormDataType = (
  data: TeacherFormData | ((prev: TeacherFormData) => TeacherFormData)
) => void;

export type TeacherFormProps = {
  formData: TeacherFormData;
  setFormData: setFormDataType;
  handleClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  teacher: teacherDetailDrawer | undefined;
};
