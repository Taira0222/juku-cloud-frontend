import { renderHook, waitFor } from "@testing-library/react";
import type { AxiosError, AxiosResponse } from "axios";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { inviteTokenApi } from "../../api/inviteTokenApi";
import { useFetchInviteToken } from "../../queries/useFetchInviteToken";

vi.mock("@/features/teachers/api/inviteTokenApi");

describe("useFetchInviteToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns ok when it succeeds", async () => {
    // response.data で値を取得しているので合わせる
    const mockResponse = {
      data: {
        token: "valid_token",
      },
    } as Partial<AxiosResponse> as AxiosResponse;

    vi.mocked(inviteTokenApi).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useFetchInviteToken());

    // refetch が呼ばれるまで待つ
    await waitFor(() => result.current.refetch());

    await waitFor(() => {
      expect(result.current.inviteToken).toEqual({
        token: "valid_token",
      });
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  test("returns error when send wrong data", async () => {
    // AxiosErrorのモックを作成
    const axiosLikeError = {
      isAxiosError: true,
      response: {
        data: {
          errors: [
            {
              code: "CREATE_TOKEN_FAILED",
              field: "base",
              message: "トークンの作成に失敗しました。",
            },
          ],
        },
        status: 422,
      },
    } as unknown as AxiosError;

    vi.mocked(inviteTokenApi).mockRejectedValueOnce(axiosLikeError);

    const { result } = renderHook(() => useFetchInviteToken());

    // refetch が呼ばれるまで待つ
    await waitFor(() => result.current.refetch());

    await waitFor(() => {
      expect(result.current.inviteToken).toBeNull();
      expect(result.current.error).toEqual(["トークンの作成に失敗しました。"]);
      expect(result.current.loading).toBe(false);
    });
  });

  test("sets error message when API call fails", async () => {
    vi.mocked(inviteTokenApi).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useFetchInviteToken());

    // refetch が呼ばれるまで待つ
    await waitFor(() => result.current.refetch());

    await waitFor(() => {
      expect(result.current.inviteToken).toBeNull();
      expect(result.current.error).toEqual(["通信エラーが発生しました。"]);
      expect(result.current.loading).toBe(false);
    });
  });
});
