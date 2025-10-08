import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { StudentTraitListFilters } from "../../key";
import {
  mockStudentTraits,
  StudentTraitsMeta,
} from "@/tests/fixtures/studentTraits/studentTraits";
import type { FetchStudentTraitsResponse } from "../../types/studentTraits";
import { FetchStudentTraits } from "../../api/studentTraitsApi";
import { useStudentTraitsQuery } from "../../queries/useStudentTraitsQuery";

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

vi.mock("../../api/studentTraitsApi", () => ({
  FetchStudentTraits: vi.fn(),
}));

describe("useStudentTraitsQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should fetch student traits successfully", async () => {
    const mockFilters: StudentTraitListFilters = {
      student_id: 1, //student1
      searchKeyword: undefined,
      sortBy: undefined,
      page: 1,
      perPage: 10,
    };
    const mockResponse: FetchStudentTraitsResponse = {
      student_traits: mockStudentTraits,
      meta: StudentTraitsMeta,
    };

    vi.mocked(FetchStudentTraits).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useStudentTraitsQuery(mockFilters), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
  });

  test("should not fetch lesson notes when disabled", async () => {
    const mockFilters: StudentTraitListFilters = {
      student_id: 1, //student1
      searchKeyword: undefined,
      sortBy: undefined,
      page: 1,
      perPage: 10,
    };

    const { result } = renderHook(
      () => useStudentTraitsQuery(mockFilters, { enabled: false }),
      {
        wrapper,
      }
    );
    expect(result.current.data).toBeUndefined();
    expect(FetchStudentTraits).not.toHaveBeenCalled();
  });

  test("should handle error state", async () => {
    const mockFilters: StudentTraitListFilters = {
      student_id: 1, //student1
      searchKeyword: undefined,
      sortBy: undefined,
      page: 1,
      perPage: 10,
    };
    const mockError = new Error("Failed to fetch student traits");

    vi.mocked(FetchStudentTraits).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useStudentTraitsQuery(mockFilters), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
