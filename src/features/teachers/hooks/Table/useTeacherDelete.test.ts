import { renderHook, waitFor } from '@testing-library/react';
import type { AxiosError, AxiosResponse } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { teacherDeleteErrorResponse } from '../../types/teachers';
import { deleteTeacherApi } from '../../services/deleteTeacherApi';
import { useTeacherDelete } from './useTeacherDelete';

type DeleteTeacherResult = {
  ok: boolean;
};

vi.mock('@/features/teachers/services/deleteTeacherApi');
const MOCK_ID = 1;

describe('useTeacherDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns ok when it succeeds', async () => {
    // Partial ですべてのAxiosResponseでなくてもよくして、部分的なモックを作成する
    // その後、as AxiosResponseで型を強制する

    vi.mocked(deleteTeacherApi).mockResolvedValueOnce({} as AxiosResponse);

    const { result } = renderHook(() => useTeacherDelete());

    let res: DeleteTeacherResult | undefined;
    await waitFor(async () => {
      res = await result.current.deleteTeacher(MOCK_ID);
    });

    await waitFor(() => {
      expect(res).toEqual({ ok: true });
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
    } as unknown as AxiosError<teacherDeleteErrorResponse>;

    vi.mocked(deleteTeacherApi).mockRejectedValueOnce(axiosLikeError);

    const { result } = renderHook(() => useTeacherDelete());

    let res: DeleteTeacherResult | undefined;
    await waitFor(async () => {
      res = await result.current.deleteTeacher(MOCK_ID);
    });

    await waitFor(() => {
      expect(res).toEqual({ ok: false });
      expect(result.current.error).toEqual('Unexpected Error');
      expect(result.current.loading).toBe(false);
    });
  });

  test('sets error message when API call fails', async () => {
    vi.mocked(deleteTeacherApi).mockRejectedValueOnce(
      new Error('Network Error')
    );

    const { result } = renderHook(() => useTeacherDelete());

    let res: DeleteTeacherResult | undefined;
    await waitFor(async () => {
      res = await result.current.deleteTeacher(MOCK_ID);
    });

    await waitFor(() => {
      expect(res).toEqual({ ok: false });
      expect(result.current.error).toEqual('Network Error');
      expect(result.current.loading).toBe(false);
    });
  });
});
