import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { fetchUserSuccessResponse } from "@/types/user";
import { fetchUser } from "@/api/userApi";
import { useUserQuery } from "../useUserQuery";

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

vi.mock("@/api/userApi", () => ({
  fetchUser: vi.fn(),
}));

describe("useUserQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should fetch current user successfully", async () => {
    const mockResponse: fetchUserSuccessResponse = {
      success: true,
      data: {
        id: 1,
        provider: "google",
        uid: "12345",
        allow_password_change: true,
        name: "John Doe",
        role: "admin",
        email: "john.doe@example.com",
        school_id: 1,
        employment_status: "employed",
        school: {
          id: 1,
          name: "Example High School",
        },
      },
    };

    vi.mocked(fetchUser).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUserQuery(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      id: mockResponse.data.id,
      name: mockResponse.data.name,
      email: mockResponse.data.email,
      role: mockResponse.data.role,
      school: mockResponse.data.school.name,
    });
  });

  test("should not fetch user when disabled", async () => {
    const { result } = renderHook(() => useUserQuery({ enabled: false }), {
      wrapper,
    });
    expect(result.current.data).toBeUndefined();
    expect(fetchUser).not.toHaveBeenCalled();
  });

  test("should handle error state", async () => {
    const mockError = new Error("Failed to fetch user");

    vi.mocked(fetchUser).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUserQuery(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
