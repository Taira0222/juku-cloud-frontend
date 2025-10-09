import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { useSignOutMutation } from "../useSignOutMutation";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { signOutApi } from "@/api/signOutApi";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={["/test"]}>{children}</MemoryRouter>
  </QueryClientProvider>
);

vi.mock("@/api/signOutApi", () => ({
  signOutApi: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("useSignOutMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    // store を初期化
    act(() => {
      useUserStore.setState({ user: null });
      useAuthStore.setState({
        signOutInProgress: false,
      });
    });
  });
  test("should sign out successfully", async () => {
    const cancelQueriesSpy = vi.spyOn(queryClient, "cancelQueries");
    const clearSpy = vi.spyOn(queryClient, "clear");

    vi.mocked(toast.success).mockResolvedValueOnce("ログアウトしました");

    const { result } = renderHook(() => useSignOutMutation(), {
      wrapper,
    });

    act(() => {
      result.current.mutate();
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(cancelQueriesSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();
    expect(useUserStore.getState().user).toBeNull();
    expect(useAuthStore.getState().auth).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("ログアウトしました");
  });

  test("should handle error state", async () => {
    const mockError = new Error("Failed to sign out");

    vi.mocked(signOutApi).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSignOutMutation(), {
      wrapper,
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(toast.error).toHaveBeenCalled();
  });
});
