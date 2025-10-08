import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { studentTraitKeys } from "../../key";
import type { StudentTraitDeletePayload } from "../../types/studentTraits";
import { useDeleteStudentTraitMutation } from "../../mutations/useDeleteStudentTraitMutation";
import { DeleteStudentTrait } from "../../api/studentTraitDeleteApi";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock("../../api/studentTraitDeleteApi", () => ({
  DeleteStudentTrait: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("useDeleteStudentTraitMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should delete student trait successfully", async () => {
    const mockProps: StudentTraitDeletePayload = {
      studentId: 1,
      studentTraitId: 1,
    };

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const removeQuerySpy = vi.spyOn(queryClient, "removeQueries");

    vi.mocked(toast.success).mockReturnValueOnce("特性を削除しました");

    const { result } = renderHook(() => useDeleteStudentTraitMutation(), {
      wrapper,
    });

    act(() => {
      result.current.mutate(mockProps);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: studentTraitKeys.lists(),
    });

    const detailKey = studentTraitKeys.detail(mockProps.studentTraitId);
    expect(removeQuerySpy).toHaveBeenCalledWith({ queryKey: detailKey });

    expect(result.current.data).toBeUndefined();
    expect(toast.success).toHaveBeenCalledWith("特性を削除しました");
  });

  test("should handle error state", async () => {
    const mockProps: StudentTraitDeletePayload = {
      studentId: 1,
      studentTraitId: 1,
    };
    const mockError = new Error("Failed to delete student trait");

    vi.mocked(DeleteStudentTrait).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useDeleteStudentTraitMutation(), {
      wrapper,
    });

    act(() => {
      result.current.mutate(mockProps);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(toast.error).toHaveBeenCalled();
  });
});
