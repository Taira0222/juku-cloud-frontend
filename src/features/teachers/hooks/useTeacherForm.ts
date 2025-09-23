import { useState } from "react";
import type { teacherDetailDrawer } from "../types/teachers";
import type { TeacherFormData } from "../types/teacherForm";

export const useTeacherForm = (teacher?: teacherDetailDrawer) => {
  const INITIAL_VALUES = {
    name: teacher?.name || "",
    employment_status: teacher?.employment_status || "",
    subjects: teacher?.class_subjects.map((s) => s.name) || [],
    available_days: teacher?.available_days.map((d) => d.name) || [],
  };

  const [formData, setFormData] = useState<TeacherFormData>(INITIAL_VALUES);

  return { formData, setFormData };
};
