import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { studentTraitKeys } from "../../key";
import {
  createResponseStudentTraitMock,
  createStudentTraitPayload,
} from "@/tests/fixtures/studentTraits/studentTraits";
import { CreateStudentTrait } from "../../api/studentTraitCreateApi";
import { useCreateStudentTraitMutation } from "../../mutations/useCreateStudentTraitMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock("../../api/studentTraitCreateApi", () => ({
  CreateStudentTrait: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("useCreateStudentTraitMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should create student trait successfully", async () => {
    const mockResponseData = {
      ...createResponseStudentTraitMock,
    };

    const mockPayload = {
      ...createStudentTraitPayload,
    };

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.mocked(CreateStudentTrait).mockResolvedValueOnce(mockResponseData);
    vi.mocked(toast.success).mockResolvedValueOnce("特性を作成しました");

    const { result } = renderHook(() => useCreateStudentTraitMutation(), {
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
    expect(toast.success).toHaveBeenCalledWith("特性を作成しました");
  });

  test("should handle error state", async () => {
    const mockPayload = {
      ...createStudentTraitPayload,
    };
    const mockError = new Error("Failed to create student trait");

    vi.mocked(CreateStudentTrait).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCreateStudentTraitMutation(), {
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
