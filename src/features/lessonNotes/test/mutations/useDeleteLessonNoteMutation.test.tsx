import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import type { LessonNoteDeletePayload } from "../../types/lessonNote";
import { useDeleteLessonNoteMutation } from "../../mutations/useDeleteLessonNoteMutation";
import { lessonNoteKeys } from "../../key";
import { DeleteLessonNote } from "../../api/lessonNoteDeleteApi";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock("../../api/lessonNoteDeleteApi", () => ({
  DeleteLessonNote: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("useDeleteLessonNoteMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should delete lesson note successfully", async () => {
    const mockProps: LessonNoteDeletePayload = {
      studentId: 1,
      lessonNoteId: 1,
    };

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const removeQuerySpy = vi.spyOn(queryClient, "removeQueries");

    vi.mocked(toast.success).mockReturnValueOnce("授業引継ぎを削除しました");

    const { result } = renderHook(() => useDeleteLessonNoteMutation(), {
      wrapper,
    });

    await waitFor(() => {
      result.current.mutate(mockProps);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: lessonNoteKeys.lists(),
    });

    const detailKey = lessonNoteKeys.detail(mockProps.lessonNoteId);
    expect(removeQuerySpy).toHaveBeenCalledWith({ queryKey: detailKey });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(toast.success).toHaveBeenCalledWith("授業引継ぎを削除しました");
  });

  test("should handle error state", async () => {
    const mockProps: LessonNoteDeletePayload = {
      studentId: 1,
      lessonNoteId: 1,
    };
    const mockError = new Error("Failed to delete lesson note");

    vi.mocked(DeleteLessonNote).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useDeleteLessonNoteMutation(), {
      wrapper,
    });

    await waitFor(() => {
      result.current.mutate(mockProps);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
    expect(toast.error).toHaveBeenCalled();
  });
});
