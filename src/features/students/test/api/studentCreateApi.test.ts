import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  createResponseStudentMock,
  createStudentMockPayload,
} from "../../../../tests/fixtures/students/students";
import { api } from "@/lib/api";
import { studentCreate } from "../../api/studentCreateApi";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("studentCreateApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("createStudent", async () => {
    const mockResponse = {
      data: {
        ...createResponseStudentMock,
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const result = await studentCreate(createStudentMockPayload);
    expect(result).toEqual(createResponseStudentMock);
    expect(api.post).toHaveBeenCalledWith("/students", {
      ...createStudentMockPayload,
    });
  });

  test("createStudent - handles API error", async () => {
    const apiError = new Error("API Error");
    vi.mocked(api.post).mockRejectedValueOnce(apiError);

    await expect(studentCreate(createStudentMockPayload)).rejects.toThrow(
      "API Error"
    );
  });

  test("createStudent - handles invalid response data", async () => {
    const invalidResponse = {
      data: {
        invalid: "data",
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(invalidResponse);

    // Zodエラーがスローされることを確認
    await expect(studentCreate(createStudentMockPayload)).rejects.toThrow();
  });
});
