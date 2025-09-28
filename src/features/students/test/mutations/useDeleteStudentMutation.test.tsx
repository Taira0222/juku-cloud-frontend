import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { studentKeys } from "../../../key";
import { toast } from "sonner";
import { studentDelete } from "../../api/studentDeleteApi";
import { useDeleteStudentMutation } from "../../mutations/useDeleteStudentMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock("../../api/studentDeleteApi", () => ({
  studentDelete: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("useDeleteStudentMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should delete student successfully", async () => {
    const mockPayload = {
      id: 3,
    };

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const removeQuerySpy = vi.spyOn(queryClient, "removeQueries");

    vi.mocked(toast.success).mockReturnValueOnce("生徒を削除しました");

    const { result } = renderHook(() => useDeleteStudentMutation(), {
      wrapper,
    });

    await waitFor(() => {
      result.current.mutate(mockPayload.id);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: studentKeys.lists(),
    });

    const detailKey = studentKeys.detail(mockPayload.id);
    expect(removeQuerySpy).toHaveBeenCalledWith({ queryKey: detailKey });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(toast.success).toHaveBeenCalledWith("生徒を削除しました");
  });

  test("should handle error state", async () => {
    const mockPayload = {
      id: 3,
    };
    const mockError = new Error("Failed to delete student");

    vi.mocked(studentDelete).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useDeleteStudentMutation(), {
      wrapper,
    });

    await waitFor(() => {
      result.current.mutate(mockPayload.id);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
    expect(toast.error).toHaveBeenCalled();
  });
});
