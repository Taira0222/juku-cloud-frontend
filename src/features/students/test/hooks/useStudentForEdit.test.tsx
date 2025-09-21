import { mockMeta, mockStudent3 } from "@/tests/fixtures/students/students";
import { renderHook, waitFor } from "@testing-library/react";
import { describe } from "node:test";
import { beforeEach, expect, test, vi } from "vitest";
import { useStudentForEdit } from "../../hooks/useStudentForEdit";
import { useStudentsStore } from "@/stores/studentsStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchStudents } from "../../api/studentsApi";

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

vi.mock("../../api/studentsApi", () => ({
  fetchStudents: vi.fn(),
}));

describe("useStudentForEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStudentsStore.setState({
      filters: {
        searchKeyword: undefined,
        school_stage: undefined,
        grade: undefined,
        page: 1,
        perPage: 10,
      },
    });
  });

  test("should return student from state if provided", () => {
    const mockProps = {
      studentId: 3,
      state: {
        student: { ...mockStudent3 },
      },
    };
    vi.mocked(fetchStudents).mockResolvedValueOnce({
      students: [mockStudent3],
      meta: mockMeta,
    });

    const { result } = renderHook(
      () => useStudentForEdit(mockProps.studentId, mockProps.state),
      { wrapper }
    );
    expect(result.current.student).toEqual(mockStudent3);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isNotFound).toBe(false);
  });

  test("should fetch if state does not have student", async () => {
    const mockProps = {
      studentId: 3,
      state: undefined,
    };
    vi.mocked(fetchStudents).mockResolvedValueOnce({
      students: [mockStudent3],
      meta: mockMeta,
    });
    const { result } = renderHook(
      () => useStudentForEdit(mockProps.studentId, mockProps.state),
      { wrapper }
    );
    await waitFor(() => expect(result.current.student).toEqual(mockStudent3));
  });
  test("should return isNotFound true if student not found after fetch", async () => {
    const mockProps = {
      studentId: 999,
      state: undefined,
    };
    vi.mocked(fetchStudents).mockResolvedValueOnce({
      students: [mockStudent3],
      meta: mockMeta,
    });
    const { result } = renderHook(
      () => useStudentForEdit(mockProps.studentId, mockProps.state),
      { wrapper }
    );
    await waitFor(() => expect(result.current.isNotFound).toBe(true));
  });
});
