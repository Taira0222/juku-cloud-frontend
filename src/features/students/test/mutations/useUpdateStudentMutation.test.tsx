import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  editResponseStudentMock,
  editStudentMockPayload,
} from "@/tests/fixtures/students/students";
import { renderHook, waitFor } from "@testing-library/react";
import { studentKeys } from "../../key";
import { toast } from "sonner";
import { studentUpdate } from "../../api/studentUpdateApi";
import { useUpdateStudentMutation } from "../../mutations/useUpdateStudentMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock("../../api/studentUpdateApi", () => ({
  studentUpdate: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("useUpdateStudentMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should update student successfully", async () => {
    const mockResponseData = {
      ...editResponseStudentMock,
    };

    const mockPayload = {
      ...editStudentMockPayload,
    };

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.mocked(studentUpdate).mockResolvedValueOnce(mockResponseData);
    vi.mocked(toast.success).mockResolvedValueOnce("生徒を更新しました");

    const { result } = renderHook(() => useUpdateStudentMutation(), {
      wrapper,
    });

    await waitFor(() => {
      result.current.mutate(mockPayload);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: studentKeys.lists(),
    });

    const detailKey = studentKeys.detail(mockResponseData.id);
    expect(setQueryDataSpy).toHaveBeenCalledWith(detailKey, mockResponseData);

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual(mockResponseData);
    expect(toast.success).toHaveBeenCalledWith("生徒を更新しました");
  });

  test("should handle error state", async () => {
    const mockPayload = {
      ...editStudentMockPayload,
    };
    const mockError = new Error("Failed to update student");

    vi.mocked(studentUpdate).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUpdateStudentMutation(), {
      wrapper,
    });

    await waitFor(() => {
      result.current.mutate(mockPayload);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
    expect(toast.error).toHaveBeenCalled();
  });
});
