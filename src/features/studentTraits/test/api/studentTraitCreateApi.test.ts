import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "@/lib/api";
import {
  createResponseStudentTraitMock,
  createStudentTraitPayload,
} from "@/tests/fixtures/studentTraits/studentTraits";
import { CreateStudentTrait } from "../../api/studentTraitCreateApi";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("studentTraitCreateApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("CreateStudentTrait", async () => {
    const mockResponse = {
      data: {
        ...createResponseStudentTraitMock,
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const result = await CreateStudentTrait(createStudentTraitPayload);
    expect(result).toEqual(createResponseStudentTraitMock);
    expect(api.post).toHaveBeenCalledWith("/student_traits", {
      ...createStudentTraitPayload,
    });
  });

  test("CreateStudentTrait - handles API error", async () => {
    const apiError = new Error("API Error");
    vi.mocked(api.post).mockRejectedValueOnce(apiError);

    await expect(CreateStudentTrait(createStudentTraitPayload)).rejects.toThrow(
      "API Error"
    );
  });

  test("CreateStudentTrait - handles invalid response data", async () => {
    const invalidResponse = {
      data: {
        invalid: "data",
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(invalidResponse);

    // Zodエラーがスローされることを確認
    await expect(
      CreateStudentTrait(createStudentTraitPayload)
    ).rejects.toThrow();
  });
});
