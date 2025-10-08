import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { studentTraitKeys } from "../../key";
import {
  editResponseStudentTraitMock,
  editStudentTraitPayload,
} from "@/tests/fixtures/studentTraits/studentTraits";
import { UpdateStudentTrait } from "../../api/studentTraitUpdate";
import { useUpdateStudentTraitMutation } from "../../mutations/useUpdateStudentTraitMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock("../../api/studentTraitUpdate", () => ({
  UpdateStudentTrait: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("useUpdateStudentTraitMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should update student trait successfully", async () => {
    const mockResponseData = {
      ...editResponseStudentTraitMock,
    };

    const mockPayload = {
      ...editStudentTraitPayload,
    };

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.mocked(UpdateStudentTrait).mockResolvedValueOnce(mockResponseData);
    vi.mocked(toast.success).mockResolvedValueOnce("特性を更新しました");

    const { result } = renderHook(() => useUpdateStudentTraitMutation(), {
      wrapper,
    });

    act(() => {
      result.current.mutate(mockPayload);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: studentTraitKeys.lists(),
    });

    const detailKey = studentTraitKeys.detail(mockResponseData.id);
    expect(setQueryDataSpy).toHaveBeenCalledWith(detailKey, mockResponseData);

    expect(result.current.data).toEqual(mockResponseData);
    expect(toast.success).toHaveBeenCalledWith("特性を更新しました");
  });

  test("should handle error state", async () => {
    const mockPayload = {
      ...editStudentTraitPayload,
    };
    const mockError = new Error("Failed to update student trait");

    vi.mocked(UpdateStudentTrait).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUpdateStudentTraitMutation(), {
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
