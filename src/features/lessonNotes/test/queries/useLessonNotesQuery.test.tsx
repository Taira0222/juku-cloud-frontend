import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { LessonNoteListFilters } from "../../key";
import {
  LessonNotesMeta,
  lessonNotesMock,
} from "@/tests/fixtures/lessonNotes/lessonNotes";
import type { FetchLessonNotesResponse } from "../../types/lessonNote";
import { FetchLessonNotes } from "../../api/lessonNotesApi";
import { useLessonNotesQuery } from "../../queries/useLessonNotesQuery";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock("../../api/lessonNotesApi", () => ({
  FetchLessonNotes: vi.fn(),
}));

describe("useLessonNotesQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should fetch lesson notes successfully", async () => {
    const mockFilters: LessonNoteListFilters = {
      student_id: 1, //student1
      subject_id: 1, // 英語
      searchKeyword: undefined,
      page: 1,
      perPage: 10,
    };
    const mockResponse = {
      lesson_notes: lessonNotesMock,
      meta: LessonNotesMeta,
    } as FetchLessonNotesResponse;

    vi.mocked(FetchLessonNotes).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useLessonNotesQuery(mockFilters), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
  });

  test("should not fetch lesson notes when disabled", async () => {
    const mockFilters: LessonNoteListFilters = {
      student_id: 1, //student1
      subject_id: 1, // 英語
      searchKeyword: undefined,
      page: 1,
      perPage: 10,
    };

    const { result } = renderHook(
      () => useLessonNotesQuery(mockFilters, { enabled: false }),
      {
        wrapper,
      }
    );
    expect(result.current.data).toBeUndefined();
    expect(FetchLessonNotes).not.toHaveBeenCalled();
  });

  test("should handle error state", async () => {
    const mockFilters: LessonNoteListFilters = {
      student_id: 1, //student1
      subject_id: 1, // 英語
      searchKeyword: undefined,
      page: 1,
      perPage: 10,
    };
    const mockError = new Error("Failed to fetch lesson notes");

    vi.mocked(FetchLessonNotes).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useLessonNotesQuery(mockFilters), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
