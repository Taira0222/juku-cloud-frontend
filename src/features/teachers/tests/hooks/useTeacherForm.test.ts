import { detailDrawer } from "@/tests/fixtures/teachers/teachers";
import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useTeacherForm } from "../../hooks/useTeacherForm";

describe("useTeacherForm", () => {
  test("should initialize form with teacher data", () => {
    const mockProps = detailDrawer[0];
    const { result } = renderHook(() => useTeacherForm(mockProps));
    expect(result.current.formData).toEqual({
      name: mockProps.name,
      employment_status: mockProps.employment_status,
      subjects: mockProps.class_subjects.map((s) => s.name),
      available_days: mockProps.available_days.map((d) => d.name),
    });
  });

  test("should initialize form with empty data when no teacher is provided", () => {
    const { result } = renderHook(() => useTeacherForm());
    expect(result.current.formData).toEqual({
      name: "",
      employment_status: "",
      subjects: [],
      available_days: [],
    });
  });
});
