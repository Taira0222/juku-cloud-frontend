import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { studentCreate } from "../../api/studentCreateApi";
import {
  createResponseStudentMock,
  createStudentMockPayload,
} from "@/tests/fixtures/students/students";
import { renderHook, waitFor } from "@testing-library/react";
import { useCreateStudentMutation } from "../../mutations/useCreateStudentMutation";
import { studentKeys } from "../../key";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock("../../api/studentCreateApi", () => ({
  studentCreate: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("useCreateStudentMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should create student successfully", async () => {
    const mockResponseData = {
      ...createResponseStudentMock,
    };

    const mockPayload = {
      ...createStudentMockPayload,
    };

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.mocked(studentCreate).mockResolvedValueOnce(mockResponseData);
    vi.mocked(toast.success).mockResolvedValueOnce("生徒を作成しました");

    const { result } = renderHook(() => useCreateStudentMutation(), {
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

    expect(toast.success).toHaveBeenCalledWith("生徒を作成しました");
  });

  test("should handle error state", async () => {
    const mockPayload = {
      ...createStudentMockPayload,
    };
    const mockError = new Error("Failed to create student");

    vi.mocked(studentCreate).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCreateStudentMutation(), {
      wrapper,
    });

    await waitFor(() => {
      result.current.mutate(mockPayload);
    });

    expect(toast.error).toHaveBeenCalled();
  });
});
