import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "@/lib/api";
import {
  editLessonNotePayload,
  editResponseLessonNoteMock,
} from "@/tests/fixtures/lessonNotes/lessonNotes";
import { UpdateLessonNote } from "../../api/lessonNoteUpdateApi";

vi.mock("@/lib/api", () => ({
  api: {
    patch: vi.fn(),
  },
}));

describe("lessonNoteUpdateApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("UpdateLessonNote", async () => {
    const mockResponse = {
      data: {
        ...editResponseLessonNoteMock,
      },
    };

    vi.mocked(api.patch).mockResolvedValueOnce(mockResponse);

    const result = await UpdateLessonNote(editLessonNotePayload);
    expect(result).toEqual(editResponseLessonNoteMock);
    expect(api.patch).toHaveBeenCalledWith(
      `/lesson_notes/${editLessonNotePayload.id}`,
      {
        ...editLessonNotePayload,
      }
    );
  });

  test("updateLessonNote - handles API error", async () => {
    const apiError = new Error("API Error");
    vi.mocked(api.patch).mockRejectedValueOnce(apiError);

    await expect(UpdateLessonNote(editLessonNotePayload)).rejects.toThrow(
      "API Error"
    );
  });

  test("updateLessonNote - handles invalid response data", async () => {
    const invalidResponse = {
      data: {
        invalid: "data",
      },
    };

    vi.mocked(api.patch).mockResolvedValueOnce(invalidResponse);

    // Zodエラーがスローされることを確認
    await expect(UpdateLessonNote(editLessonNotePayload)).rejects.toThrow();
  });
});
