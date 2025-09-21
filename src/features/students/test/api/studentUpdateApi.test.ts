import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  editResponseStudentMock,
  editStudentMockPayload,
} from "../../../../tests/fixtures/students/students";
import { api } from "@/lib/api";
import { studentUpdate } from "../../api/studentUpdateApi";

vi.mock("@/lib/api", () => ({
  api: {
    patch: vi.fn(),
  },
}));

describe("studentUpdateApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("updateStudent", async () => {
    const mockResponse = {
      data: {
        ...editResponseStudentMock,
      },
    };

    vi.mocked(api.patch).mockResolvedValueOnce(mockResponse);

    const result = await studentUpdate(editStudentMockPayload);
    expect(result).toEqual(editResponseStudentMock);
    expect(api.patch).toHaveBeenCalledWith(
      `/students/${editStudentMockPayload.id}`,
      {
        ...editStudentMockPayload,
      }
    );
  });

  test("updateStudent - handles API error", async () => {
    const apiError = new Error("API Error");
    vi.mocked(api.patch).mockRejectedValueOnce(apiError);

    await expect(studentUpdate(editStudentMockPayload)).rejects.toThrow(
      "API Error"
    );
  });

  test("updateStudent - handles invalid response data", async () => {
    const invalidResponse = {
      data: {
        invalid: "data",
      },
    };

    vi.mocked(api.patch).mockResolvedValueOnce(invalidResponse);

    // Zodエラーがスローされることを確認
    await expect(studentUpdate(editStudentMockPayload)).rejects.toThrow();
  });
});
