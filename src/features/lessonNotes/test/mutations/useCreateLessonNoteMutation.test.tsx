import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import {
  createLessonNotePayload,
  createResponseLessonNoteMock,
} from "@/tests/fixtures/lessonNotes/lessonNotes";
import { CreateLessonNote } from "../../api/lessonNoteCreateApi";
import { useCreateLessonNoteMutation } from "../../mutations/useCreateLessonNoteMutation";
import { lessonNoteKeys } from "../../key";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock("../../api/lessonNoteCreateApi", () => ({
  CreateLessonNote: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("useCreateLessonNoteMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should create lesson note successfully", async () => {
    const mockResponseData = {
      ...createResponseLessonNoteMock,
    };

    const mockPayload = {
      ...createLessonNotePayload,
    };

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.mocked(CreateLessonNote).mockResolvedValueOnce(mockResponseData);
    vi.mocked(toast.success).mockResolvedValueOnce("授業引継ぎを作成しました");

    const { result } = renderHook(() => useCreateLessonNoteMutation(), {
      wrapper,
    });

    act(() => {
      result.current.mutate(mockPayload);
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: lessonNoteKeys.lists(),
    });

    const detailKey = lessonNoteKeys.detail(mockResponseData.id);
    expect(setQueryDataSpy).toHaveBeenCalledWith(detailKey, mockResponseData);

    expect(result.current.data).toEqual(mockResponseData);
    expect(toast.success).toHaveBeenCalledWith("授業引継ぎを作成しました");
  });

  test("should handle error state", async () => {
    const mockPayload = {
      ...createLessonNotePayload,
    };
    const mockError = new Error("Failed to create lesson note");

    vi.mocked(CreateLessonNote).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCreateLessonNoteMutation(), {
      wrapper,
    });

    act(() => {
      result.current.mutate(mockPayload);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(toast.error).toHaveBeenCalled();
  });
});
