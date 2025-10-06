import { lessonNoteCreateFormMockValue } from "@/tests/fixtures/lessonNotes/lessonNotes";
import { describe, expect, test } from "vitest";
import { normalizeLessonNotePayload } from "../../utils/lessonNoteFormTransforms";

describe("lessonNoteFormTransforms", () => {
  test("transforms work correctly when trimming whitespace", () => {
    const mockProps = {
      ...lessonNoteCreateFormMockValue,
      description: "  前後にスペース  ",
    };

    const result = normalizeLessonNotePayload(mockProps);
    expect(result).toEqual({
      ...lessonNoteCreateFormMockValue,
      description: "前後にスペース",
    });
  });

  test("transforms work correctly when description is only whitespace", () => {
    const mockProps = {
      ...lessonNoteCreateFormMockValue,
      description: "     ",
    };

    const result = normalizeLessonNotePayload(mockProps);
    expect(result).toEqual({
      ...lessonNoteCreateFormMockValue,
      description: null,
    });
  });

  test("transforms work correctly when description is empty string", () => {
    const mockProps = {
      ...lessonNoteCreateFormMockValue,
      description: "",
    };

    const result = normalizeLessonNotePayload(mockProps);
    expect(result).toEqual({
      ...lessonNoteCreateFormMockValue,
      description: null,
    });
  });
});
