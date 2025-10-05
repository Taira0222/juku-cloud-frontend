import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "@/lib/api";
import {
  LessonNotesMeta,
  lessonNotesMock,
} from "@/tests/fixtures/lessonNotes/lessonNotes";
import type { LessonNoteListFilters } from "../../key";
import { FetchLessonNotes } from "../../api/lessonNotesApi";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("lessonNotesApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("FetchLessonNotes", async () => {
    const mockResponse = {
      data: {
        lesson_notes: lessonNotesMock,
        meta: LessonNotesMeta,
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

    const mockFilters: LessonNoteListFilters = {
      student_id: 1, //student1
      subject_id: 1, // 英語
      searchKeyword: undefined,
      page: 1,
      perPage: 10,
    };

    const result = await FetchLessonNotes(mockFilters);
    expect(result).toEqual({
      lesson_notes: lessonNotesMock,
      meta: LessonNotesMeta,
    });
    expect(api.get).toHaveBeenCalledWith("/lesson_notes", {
      params: mockFilters,
    });
  });

  test("FetchLessonNotes - handles API error", async () => {
    const apiError = new Error("API Error");
    vi.mocked(api.get).mockRejectedValueOnce(apiError);

    const mockFilters: LessonNoteListFilters = {
      student_id: 1,
      subject_id: 1,
      searchKeyword: undefined,
      page: 1,
      perPage: 10,
    };

    await expect(FetchLessonNotes(mockFilters)).rejects.toThrow("API Error");
  });

  test("FetchLessonNotes - handles invalid response data", async () => {
    const invalidResponse = {
      data: {
        // lesson_notes プロパティが欠けている不正なレスポンス
        meta: LessonNotesMeta,
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce(invalidResponse);

    const mockFilters: LessonNoteListFilters = {
      student_id: 1,
      subject_id: 1,
      searchKeyword: undefined,
      page: 1,
      perPage: 10,
    };

    // Zodエラーがスローされることを確認
    await expect(FetchLessonNotes(mockFilters)).rejects.toThrow();
  });
});
