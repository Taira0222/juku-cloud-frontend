import { mockStudent3 } from "@/tests/fixtures/students/students";
import { describe, expect, test } from "vitest";
import { studentFormatForEdit } from "../../utils/studentFormatForEdit";

describe("studentFormatForEdit", () => {
  test("should format student data for editing", () => {
    const mockStudent = mockStudent3;

    const formattedStudent = studentFormatForEdit(mockStudent);
    expect(formattedStudent).toEqual({
      id: mockStudent.id,
      name: mockStudent.name,
      school_stage: mockStudent.school_stage,
      grade: mockStudent.grade,
      status: mockStudent.status,
      desired_school: mockStudent.desired_school,
      joined_on: mockStudent.joined_on,
      subject_ids: mockStudent.class_subjects.map((s) => s.id),
      available_day_ids: mockStudent.available_days.map((d) => d.id),
      assignments: mockStudent.teaching_assignments.map((ta) => ({
        teacher_id: ta.teacher_id,
        subject_id: ta.subject_id,
        day_id: ta.day_id,
      })),
    });
  });
});
