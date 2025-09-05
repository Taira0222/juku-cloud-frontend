export type Assignment = {
  teacher_id: number;
  subject_id: number;
  day_id: number;
};

export type Draft = {
  name: string;
  status: string;
  school_stage: string;
  grade: number | null;
  desired_school: string;
  joined_on: string | null; // YYYY-MM-DD
  subject_ids: number[];
  available_day_ids: number[];
  assignments: Assignment[];
};

export type StudentFormMode = 'create' | 'edit';

export type Teacher = {
  id: number;
  name: string;
  teachable_subjects: { id: number; name: string }[];
  workable_days: { id: number; name: string }[];
};

export type ToggleableKeys = 'subject_ids' | 'available_day_ids';

export type StudentFormProps = {
  mode: StudentFormMode;
  value: Draft;
  onChange: (next: Draft | ((prev: Draft) => Draft)) => void;
  onSubmit: (valid: Draft) => void;
  loading?: boolean;
  teachers: Teacher[];
};
