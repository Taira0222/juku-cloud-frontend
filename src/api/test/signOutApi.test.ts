import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "@/lib/api";
import { signOutApi } from "../signOutApi";

vi.mock("@/lib/api", () => ({
  api: {
    delete: vi.fn(),
  },
}));

describe("signOutApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("signOut", async () => {
    const mockResponse = {
      data: null, // no_content のため data は null
      status: 204,
    };

    vi.mocked(api.delete).mockResolvedValueOnce(mockResponse);

    const result = await signOutApi();
    expect(result).toEqual(mockResponse.data);
    expect(api.delete).toHaveBeenCalledWith("/auth/sign_out");
  });

  test("signOut - handles API error", async () => {
    const apiError = new Error("API Error");

    vi.mocked(api.delete).mockRejectedValueOnce(apiError);

    await expect(signOutApi()).rejects.toThrow("API Error");
  });

  test("signOut - handles 404 error response", async () => {
    const invalidResponse = {
      data: {
        errors: {
          code: "NotFound",
          field: "base",
          message: "Lesson note not found",
        },
      },
      status: 404,
    };

    vi.mocked(api.delete).mockResolvedValueOnce(invalidResponse);

    await expect(signOutApi()).resolves.toEqual(invalidResponse.data);
  });
});
