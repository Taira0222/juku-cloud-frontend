import { renderHook, waitFor } from '@testing-library/react';
import type { AxiosError, AxiosResponse } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useUserStore } from '@/stores/userStore';

import type { fetchUserErrorResponse } from '../../types/user';
import { fetchUser } from '@/api/userApi';
import { useFetchUser } from '@/queries/useFetchUser';

vi.mock('@/api/userApi', () => ({
  fetchUser: vi.fn(),
}));

describe('useFetchUser', () => {
  beforeEach(() => {
    useUserStore.getState().clearUser();
    vi.clearAllMocks();
  });

  test('calls setUser when it succeeds', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          id: 1,
          provider: 'google',
          uid: '12345',
          allow_password_change: true,
          name: 'John Doe',
          role: 'admin',
          email: 'john.doe@example.com',
          school_id: 1,
          employment_status: 'employed',
          school: {
            id: 1,
            name: 'Example High School',
          },
        },
      },
    } as Partial<AxiosResponse> as AxiosResponse;

    vi.mocked(fetchUser).mockResolvedValueOnce(mockResponse);

    // spy として値を追跡
    const setUserSpy = vi.spyOn(useUserStore.getState(), 'setUser');
    const clearUserSpy = vi.spyOn(useUserStore.getState(), 'clearUser');

    renderHook(() => useFetchUser());

    await waitFor(() => {
      expect(fetchUser).toHaveBeenCalled();
    });

    // 呼び出しを検証
    expect(setUserSpy).toHaveBeenCalledTimes(1);
    expect(clearUserSpy).not.toHaveBeenCalled();

    // 状態の最終値で検証（こっちの方が本質）
    expect(useUserStore.getState().user).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      school: 'Example High School',
    });
  });

  test('calls clearUser when it fails', async () => {
    const axiosLikeError = {
      isAxiosError: true,
      response: {
        data: {
          success: false,
          errors: ['User not found'],
        },
      },
    } as Partial<
      AxiosError<fetchUserErrorResponse>
    > as AxiosError<fetchUserErrorResponse>;

    vi.mocked(fetchUser).mockRejectedValueOnce(axiosLikeError);
    const clearUserSpy = vi.spyOn(useUserStore.getState(), 'clearUser');

    const { result } = renderHook(() => useFetchUser());

    await waitFor(() => {
      expect(fetchUser).toHaveBeenCalled();
      expect(clearUserSpy).toHaveBeenCalled();
      expect(result.current.error).toEqual(['User not found']);
    });
  });

  test('sets error message when API call fails', async () => {
    vi.mocked(fetchUser).mockRejectedValueOnce(new Error('Network Error'));

    const clearUserSpy = vi.spyOn(useUserStore.getState(), 'clearUser');
    const { result } = renderHook(() => useFetchUser());

    await waitFor(() => {
      expect(fetchUser).toHaveBeenCalled();
      expect(clearUserSpy).toHaveBeenCalled();
      expect(result.current.error).toEqual(['Network Error']);
    });
  });
});
