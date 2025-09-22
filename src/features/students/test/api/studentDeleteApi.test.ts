import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "@/lib/api";
import { studentDelete } from "../../api/studentDeleteApi";

vi.mock("@/lib/api", () => ({
  api: {
    delete: vi.fn(),
  },
}));

describe("studentDeleteApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("deleteStudent", async () => {
    const mockResponse = {
      data: null, // no_content のため data は null
      status: 204,
    };
    const studentId = 1;

    vi.mocked(api.delete).mockResolvedValueOnce(mockResponse);

    const result = await studentDelete(studentId);
    expect(result).toEqual(mockResponse.data);
    expect(api.delete).toHaveBeenCalledWith(`/students/${studentId}`);
  });

  test("deleteStudent - handles API error", async () => {
    const apiError = new Error("API Error");
    const studentId = 1;
    vi.mocked(api.delete).mockRejectedValueOnce(apiError);

    await expect(studentDelete(studentId)).rejects.toThrow("API Error");
  });

  test("deleteStudent - handles 404 error response", async () => {
    const invalidResponse = {
      data: {
        errors: {
          code: "NotFound",
          field: "base",
          message: "Student not found",
        },
      },
      status: 404,
    };
    const studentId = 999; // 存在しない学生ID

    vi.mocked(api.delete).mockResolvedValueOnce(invalidResponse);

    await expect(studentDelete(studentId)).resolves.toEqual(
      invalidResponse.data
    );
  });
});
