import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "@/lib/api";
import { DeleteLessonNote } from "../../api/lessonNoteDeleteApi";
import type { LessonNoteDeletePayload } from "../../types/lessonNote";

vi.mock("@/lib/api", () => ({
  api: {
    delete: vi.fn(),
  },
}));

describe("lessonNoteDeleteApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("DeleteLessonNote", async () => {
    const mockResponse = {
      data: null, // no_content のため data は null
      status: 204,
    };
    const mockProps: LessonNoteDeletePayload = {
      studentId: 1,
      lessonNoteId: 1,
    };

    vi.mocked(api.delete).mockResolvedValueOnce(mockResponse);

    const result = await DeleteLessonNote(mockProps);
    expect(result).toEqual(mockResponse.data);
    expect(api.delete).toHaveBeenCalledWith(
      `/lesson_notes/${mockProps.lessonNoteId}`,
      { params: { student_id: mockProps.studentId } }
    );
  });

  test("deleteLessonNote - handles API error", async () => {
    const apiError = new Error("API Error");
    const mockProps: LessonNoteDeletePayload = {
      studentId: 1,
      lessonNoteId: 1,
    };
    vi.mocked(api.delete).mockRejectedValueOnce(apiError);

    await expect(DeleteLessonNote(mockProps)).rejects.toThrow("API Error");
  });

  test("deleteLessonNote - handles 404 error response", async () => {
    const invalidResponse = {
      data: {
        errors: {
          code: "NotFound",
          field: "base",
          message: "Lesson note not found",
        },
      },
      status: 404,
    };
    const mockProps: LessonNoteDeletePayload = {
      studentId: 999, // 存在しない学生ID
      lessonNoteId: 999, // 存在しないレッスンノートID
    };
    vi.mocked(api.delete).mockResolvedValueOnce(invalidResponse);

    await expect(DeleteLessonNote(mockProps)).resolves.toEqual(
      invalidResponse.data
    );
  });
});
