import { renderHook, waitFor } from '@testing-library/react';
import type { AxiosError, AxiosResponse } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useUserStore } from '@/stores/userStore';
import { fetchUser } from '../services/userApi';
import { useFetchUser } from './useFetchUser';
import type { fetchUserErrorResponse } from '../types/user';

vi.mock('../services/userApi', () => ({
  fetchUser: vi.fn(),
}));
vi.mock('@/stores/userStore', () => ({
  useUserStore: vi.fn(),
}));

describe('useFetchUser', () => {
  const setUser = vi.fn();
  const clearUser = vi.fn();

  beforeEach(() => {
    vi.mocked(useUserStore).mockImplementation((selector) =>
      selector({
        user: null, // ← user が null なので fetchUser を呼ぶ
        setUser,
        clearUser,
      })
    );
    vi.clearAllMocks();
  });

  test('call setAuth when it succeeds', async () => {
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

    renderHook(() => useFetchUser());

    await waitFor(() => {
      expect(fetchUser).toHaveBeenCalled();
    });

    expect(setUser).toHaveBeenCalledWith({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      school: 'Example High School',
    });
    expect(clearUser).not.toHaveBeenCalled();
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

    const { result } = renderHook(() => useFetchUser());

    await waitFor(() => {
      expect(fetchUser).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(clearUser).toHaveBeenCalled();
      expect(result.current.error).toEqual(['User not found']);
    });
  });

  test('sets error message when API call fails', async () => {
    vi.mocked(fetchUser).mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useFetchUser());

    await waitFor(() => {
      expect(fetchUser).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(clearUser).toHaveBeenCalled();
      expect(result.current.error).toEqual(['Network Error']);
    });
  });
});
