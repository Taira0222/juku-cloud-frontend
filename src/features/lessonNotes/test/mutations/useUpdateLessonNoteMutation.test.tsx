import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import {
  editLessonNotePayload,
  editResponseLessonNoteMock,
} from "@/tests/fixtures/lessonNotes/lessonNotes";
import { UpdateLessonNote } from "../../api/lessonNoteUpdateApi";
import { useUpdateLessonNoteMutation } from "../../mutations/useUpdateLessonNoteMutation";
import { lessonNoteKeys } from "../../key";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock("../../api/lessonNoteUpdateApi", () => ({
  UpdateLessonNote: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("useUpdateLessonNoteMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should update lesson note successfully", async () => {
    const mockResponseData = {
      ...editResponseLessonNoteMock,
    };

    const mockPayload = {
      ...editLessonNotePayload,
    };

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.mocked(UpdateLessonNote).mockResolvedValueOnce(mockResponseData);
    vi.mocked(toast.success).mockResolvedValueOnce("引継ぎ事項を更新しました");

    const { result } = renderHook(() => useUpdateLessonNoteMutation(), {
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
    expect(toast.success).toHaveBeenCalledWith("引継ぎ事項を更新しました");
  });

  test("should handle error state", async () => {
    const mockPayload = {
      ...editLessonNotePayload,
    };
    const mockError = new Error("Failed to update lesson note");

    vi.mocked(UpdateLessonNote).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUpdateLessonNoteMutation(), {
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
