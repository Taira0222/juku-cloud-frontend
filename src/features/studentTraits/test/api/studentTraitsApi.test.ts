import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "@/lib/api";
import type { StudentTraitListFilters } from "../../key";
import {
  mockStudentTraits,
  StudentTraitsMeta,
} from "@/tests/fixtures/studentTraits/studentTraits";
import { FetchStudentTraits } from "../../api/studentTraitsApi";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("studentTraitsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("FetchStudentTraits", async () => {
    const mockResponse = {
      data: {
        student_traits: mockStudentTraits,
        meta: StudentTraitsMeta,
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

    const mockFilters: StudentTraitListFilters = {
      student_id: 1, //student1
      searchKeyword: undefined,
      sortBy: undefined,
      page: 1,
      perPage: 10,
    };

    const result = await FetchStudentTraits(mockFilters);
    expect(result).toEqual({
      student_traits: mockStudentTraits,
      meta: StudentTraitsMeta,
    });
    expect(api.get).toHaveBeenCalledWith("/student_traits", {
      params: mockFilters,
    });
  });

  test("FetchStudentTraits - handles API error", async () => {
    const apiError = new Error("API Error");
    vi.mocked(api.get).mockRejectedValueOnce(apiError);

    const mockFilters: StudentTraitListFilters = {
      student_id: 1,
      searchKeyword: undefined,
      sortBy: undefined,
      page: 1,
      perPage: 10,
    };

    await expect(FetchStudentTraits(mockFilters)).rejects.toThrow("API Error");
  });

  test("FetchStudentTraits- handles invalid response data", async () => {
    const invalidResponse = {
      data: {
        // student_traits プロパティが欠けている不正なレスポンス
        meta: StudentTraitsMeta,
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce(invalidResponse);

    const mockFilters: StudentTraitListFilters = {
      student_id: 1,
      searchKeyword: undefined,
      sortBy: undefined,
      page: 1,
      perPage: 10,
    };

    // Zodエラーがスローされることを確認
    await expect(FetchStudentTraits(mockFilters)).rejects.toThrow();
  });
});
