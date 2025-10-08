import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "@/lib/api";
import type { StudentTraitDeletePayload } from "../../types/studentTraits";
import { DeleteStudentTrait } from "../../api/studentTraitDeleteApi";

vi.mock("@/lib/api", () => ({
  api: {
    delete: vi.fn(),
  },
}));

describe("studentTraitDeleteApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("DeleteStudentTrait", async () => {
    const mockResponse = {
      data: null, // no_content のため data は null
      status: 204,
    };
    const mockProps: StudentTraitDeletePayload = {
      studentId: 1,
      studentTraitId: 1,
    };

    vi.mocked(api.delete).mockResolvedValueOnce(mockResponse);

    const result = await DeleteStudentTrait(mockProps);
    expect(result).toEqual(mockResponse.data);
    expect(api.delete).toHaveBeenCalledWith(
      `/student_traits/${mockProps.studentTraitId}`,
      { params: { student_id: mockProps.studentId } }
    );
  });

  test("DeleteStudentTrait - handles API error", async () => {
    const apiError = new Error("API Error");
    const mockProps: StudentTraitDeletePayload = {
      studentId: 1,
      studentTraitId: 1,
    };
    vi.mocked(api.delete).mockRejectedValueOnce(apiError);

    await expect(DeleteStudentTrait(mockProps)).rejects.toThrow("API Error");
  });

  test("DeleteStudentTrait - handles 404 error response", async () => {
    const invalidResponse = {
      data: {
        errors: {
          code: "NotFound",
          field: "base",
          message: "Student trait not found",
        },
      },
      status: 404,
    };
    const mockProps: StudentTraitDeletePayload = {
      studentId: 999, // 存在しない学生ID
      studentTraitId: 999, // 存在しない生徒特性ID
    };
    vi.mocked(api.delete).mockResolvedValueOnce(invalidResponse);

    await expect(DeleteStudentTrait(mockProps)).resolves.toEqual(
      invalidResponse.data
    );
  });
});
