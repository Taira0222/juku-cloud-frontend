import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { studentDetailMock } from "../../../../tests/fixtures/students/students";
import type { StudentDetail } from "../../type/studentDashboard";
import { fetchStudent } from "../../api/fetchStudentApi";
import { useStudentDetailQuery } from "../../queries/useStudentDetailQuery";

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

vi.mock("../../api/fetchStudentApi", () => ({
  fetchStudent: vi.fn(),
}));
const STUDENT_ID = 1;
describe("useStudentDetailQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should fetch student details successfully", async () => {
    const mockResponse = {
      ...studentDetailMock,
    } as StudentDetail;

    vi.mocked(fetchStudent).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useStudentDetailQuery(STUDENT_ID), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
  });

  test("should handle error state", async () => {
    const mockError = new Error("Failed to fetch student");

    vi.mocked(fetchStudent).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useStudentDetailQuery(STUDENT_ID), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
