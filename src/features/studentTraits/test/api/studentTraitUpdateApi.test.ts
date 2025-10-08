import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "@/lib/api";
import {
  editResponseStudentTraitMock,
  editStudentTraitPayload,
} from "@/tests/fixtures/studentTraits/studentTraits";
import { UpdateStudentTrait } from "../../api/studentTraitUpdate";

vi.mock("@/lib/api", () => ({
  api: {
    patch: vi.fn(),
  },
}));

describe("studentTraitUpdateApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("UpdateStudentTrait", async () => {
    const mockResponse = {
      data: {
        ...editResponseStudentTraitMock,
      },
    };

    vi.mocked(api.patch).mockResolvedValueOnce(mockResponse);

    const result = await UpdateStudentTrait(editStudentTraitPayload);
    expect(result).toEqual(editResponseStudentTraitMock);
    expect(api.patch).toHaveBeenCalledWith(
      `/student_traits/${editStudentTraitPayload.id}`,
      {
        ...editStudentTraitPayload,
      }
    );
  });

  test("updateStudentTrait - handles API error", async () => {
    const apiError = new Error("API Error");
    vi.mocked(api.patch).mockRejectedValueOnce(apiError);

    await expect(UpdateStudentTrait(editStudentTraitPayload)).rejects.toThrow(
      "API Error"
    );
  });

  test("updateStudentTrait - handles invalid response data", async () => {
    const invalidResponse = {
      data: {
        invalid: "data",
      },
    };

    vi.mocked(api.patch).mockResolvedValueOnce(invalidResponse);

    // Zodエラーがスローされることを確認
    await expect(UpdateStudentTrait(editStudentTraitPayload)).rejects.toThrow();
  });
});
