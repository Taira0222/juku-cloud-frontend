import type { EditDraft } from "../types/studentForm";
import type { Student } from "../types/students";

export const studentFormatForEdit = (student: Student) => {
  const formattedStudent: EditDraft = {
    id: student.id,
    name: student.name,
    school_stage: student.school_stage,
    grade: student.grade,
    status: student.status,
    desired_school: student.desired_school,
    joined_on: student.joined_on,
    subject_ids: [...student.class_subjects.map((s) => s.id)],
    available_day_ids: [...student.available_days.map((d) => d.id)],
    assignments: [
      ...student.teaching_assignments.map((ta) => ({
        teacher_id: ta.teacher_id,
        subject_id: ta.subject_id,
        day_id: ta.day_id,
      })),
    ],
  };
  return formattedStudent;
};
