import { renderHook, waitFor } from '@testing-library/react';
import type { AxiosError, AxiosResponse } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fetchTeachers } from '../../services/teachersApi';
import { useFetchTeachers } from '../../hooks/useFetchTeachers';
import type { fetchTeachersErrorResponse } from '../../types/teachers';

vi.mock('@/features/teachers/services/teachersApi');

describe('useFetchTeachers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns ok when it succeeds', async () => {
    // Partial ですべてのAxiosResponseでなくてもよくして、部分的なモックを作成する
    // その後、as AxiosResponseで型を強制する
    const currentUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    const teachers = [
      { id: 1, name: 'Jane Smith', subject: 'Math' },
      { id: 2, name: 'Bob Johnson', subject: 'Science' },
    ];

    // response.data で値を取得しているので合わせる
    const mockResponse = {
      data: {
        current_user: currentUser,
        teachers: teachers,
      },
    } as Partial<AxiosResponse> as AxiosResponse;

    vi.mocked(fetchTeachers).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useFetchTeachers());

    // fetchTeachers が呼ばれるまで待つ
    await waitFor(() => expect(fetchTeachers).toHaveBeenCalled());

    await waitFor(() => {
      expect(result.current.currentUserData).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
      expect(result.current.teachersData).toEqual([
        { id: 1, name: 'Jane Smith', subject: 'Math' },
        { id: 2, name: 'Bob Johnson', subject: 'Science' },
      ]);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  test('returns error when send wrong data', async () => {
    // AxiosErrorのモックを作成
    const axiosLikeError = {
      isAxiosError: true,
      response: {
        data: {
          error: 'Unexpected Error',
        },
      },
    } as unknown as AxiosError<fetchTeachersErrorResponse>;

    vi.mocked(fetchTeachers).mockRejectedValueOnce(axiosLikeError);

    const { result } = renderHook(() => useFetchTeachers());

    // fetchTeachers が呼ばれるまで待つ
    await waitFor(() => expect(fetchTeachers).toHaveBeenCalled());

    await waitFor(() => {
      expect(result.current.currentUserData).toBeNull();
      expect(result.current.teachersData).toBeNull();
      expect(result.current.error).toEqual('Unexpected Error');
      expect(result.current.loading).toBe(false);
    });
  });

  test('sets error message when API call fails', async () => {
    vi.mocked(fetchTeachers).mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useFetchTeachers());

    await waitFor(() => {
      expect(result.current.currentUserData).toBeNull();
      expect(result.current.teachersData).toBeNull();
      expect(result.current.error).toEqual('Network Error');
      expect(result.current.loading).toBe(false);
    });
  });
});
