import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "@/lib/api";
import { fetchStudent } from "../../api/fetchStudentApi";
import { studentDetailMock } from "@/tests/fixtures/students/students";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));
const STUDENT_ID = 1;
describe("fetchStudentApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fetchStudent", async () => {
    const mockResponse = {
      data: {
        ...studentDetailMock,
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

    const result = await fetchStudent(STUDENT_ID);
    expect(result).toEqual({
      ...studentDetailMock,
    });
  });

  test("fetchStudent - handles API error", async () => {
    const apiError = new Error("API Error");
    vi.mocked(api.get).mockRejectedValueOnce(apiError);

    await expect(fetchStudent(STUDENT_ID)).rejects.toThrow("API Error");
  });

  test("fetchStudent - handles invalid response data", async () => {
    const invalidResponse = {
      data: {
        id: "invalid_id", // 本来は数値であるべき
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce(invalidResponse);

    // Zodエラーがスローされることを確認
    await expect(fetchStudent(1)).rejects.toThrow();
  });
});
