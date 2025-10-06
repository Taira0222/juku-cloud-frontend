import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "@/lib/api";
import {
  createLessonNotePayload,
  createResponseLessonNoteMock,
} from "@/tests/fixtures/lessonNotes/lessonNotes";
import { CreateLessonNote } from "../../api/lessonNoteCreateApi";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("lessonNoteCreateApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("CreateLessonNote", async () => {
    const mockResponse = {
      data: {
        ...createResponseLessonNoteMock,
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const result = await CreateLessonNote(createLessonNotePayload);
    expect(result).toEqual(createResponseLessonNoteMock);
    expect(api.post).toHaveBeenCalledWith("/lesson_notes", {
      ...createLessonNotePayload,
    });
  });

  test("CreateLessonNote - handles API error", async () => {
    const apiError = new Error("API Error");
    vi.mocked(api.post).mockRejectedValueOnce(apiError);

    await expect(CreateLessonNote(createLessonNotePayload)).rejects.toThrow(
      "API Error"
    );
  });

  test("CreateLessonNote - handles invalid response data", async () => {
    const invalidResponse = {
      data: {
        invalid: "data",
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(invalidResponse);

    // Zodエラーがスローされることを確認
    await expect(CreateLessonNote(createLessonNotePayload)).rejects.toThrow();
  });
});
