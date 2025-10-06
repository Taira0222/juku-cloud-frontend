import { lessonNote1 } from "@/tests/fixtures/lessonNotes/lessonNotes";
import { describe, expect, test } from "vitest";
import type { lessonNoteType } from "../../types/lessonNote";
import { formatEditValue } from "../../utils/formatEditValue";

describe("formatEditValue", () => {
  test("should format lesson note correctly", () => {
    const mockProps: lessonNoteType = lessonNote1;
    const result = formatEditValue(mockProps);
    expect(result).toEqual({
      id: 1,
      subject_id: 1,
      title: lessonNote1.title,
      description: lessonNote1.description,
      note_type: lessonNote1.note_type,
      expire_date: lessonNote1.expire_date,
    });
  });
});
