import { beforeEach, describe, expect, test, vi } from 'vitest';
import { updateTeacherApi } from '../../api/updateTeacherApi';
import type {
  updateTeacherSuccessResponse,
} from '../../types/teachers';
import type { AxiosError, AxiosResponse } from 'axios';
import { renderHook, waitFor } from '@testing-library/react';
import { useTeacherUpdate } from '../../mutations/useTeacherUpdate';
import { requestUpdateMockData } from '../../../../tests/fixtures/teachers/teachers';

vi.mock('@/features/teachers/api/updateTeacherApi');

describe('useTeacherUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should update teacher information successfully', async () => {
    // AxiosResponse の一部を持つ Partial 型を作成し、必要な部分だけモックする
    const mockResponse = {
      data: {
        teacher_id: 123,
      },
    } as Partial<AxiosResponse> as AxiosResponse<updateTeacherSuccessResponse>;

    vi.mocked(updateTeacherApi).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useTeacherUpdate());

    await waitFor(async () => {
      const response = await result.current.updateTeacher(
        123,
        requestUpdateMockData
      );
      expect(response.ok).toBe(true);
      expect(response.updatedId).toBe(123);
    });
  });
  test('should returns axios-like response', async () => {
    const axiosLikeError = {
      isAxiosError: true,
      response: {
        data: {
          errors: [{
            code: 'INVALID_EMPLOYMENT_STATUS',
            field: 'base',
            message: 'Invalid employment status'
          }],
        },
        status: 422,
      },
    } as unknown as AxiosError;
    vi.mocked(updateTeacherApi).mockRejectedValue(axiosLikeError);

    const { result } = renderHook(() => useTeacherUpdate());

    await waitFor(async () => {
      const response = await result.current.updateTeacher(
        123,
        requestUpdateMockData
      );
      expect(response.ok).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.error).toEqual(['Invalid employment status']);
      expect(result.current.loading).toBe(false);
    });
  });

  test('set error state when update fails', async () => {
    vi.mocked(updateTeacherApi).mockRejectedValueOnce(
      new Error('Network Error')
    );

    const { result } = renderHook(() => useTeacherUpdate());

    await waitFor(async () => {
      const response = await result.current.updateTeacher(
        123,
        requestUpdateMockData
      );
      expect(response.ok).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.error).toEqual(['通信エラーが発生しました。']);
      expect(result.current.loading).toBe(false);
    });
  });
});
