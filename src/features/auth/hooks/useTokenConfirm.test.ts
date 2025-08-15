import { renderHook, waitFor } from '@testing-library/react';
import type { AxiosError, AxiosResponse } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { tokenConfirmApi } from '../services/tokenConfirmApi';
import { useTokenConfirm } from './useTokenConfirm';
import type { TokenConfirmErrorResponse } from '../types/tokenConfirm';

vi.mock('../services/tokenConfirmApi');
const SCHOOL_NAME = 'First_school';

describe('useTokenConfirm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns ok when it succeeds', async () => {
    // Partial ですべてのAxiosResponseでなくてもよくして、部分的なモックを作成する
    // その後、as AxiosResponseで型を強制する
    const mockResponse = {
      data: { school_name: SCHOOL_NAME },
    } as Partial<AxiosResponse> as AxiosResponse;

    const requestData = {
      token: 'valid_token',
    };

    vi.mocked(tokenConfirmApi).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useTokenConfirm(requestData.token));

    // tokenConfirmApi が呼ばれるまで待つ
    await waitFor(() =>
      expect(tokenConfirmApi).toHaveBeenCalledWith('valid_token')
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ school_name: SCHOOL_NAME });
      expect(result.current.tokenError).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  test('returns error when send wrong data', async () => {
    // AxiosErrorのモックを作成
    const axiosLikeError = {
      isAxiosError: true,
      response: {
        data: {
          message: 'Invalid token',
        },
      },
    } as Partial<
      AxiosError<TokenConfirmErrorResponse>
    > as AxiosError<TokenConfirmErrorResponse>;

    // 誤ったtoken
    const requestData = {
      token: 'invalid_token',
    };

    vi.mocked(tokenConfirmApi).mockRejectedValueOnce(axiosLikeError);

    const { result } = renderHook(() => useTokenConfirm(requestData.token));

    await waitFor(() => {
      expect(result.current.tokenError).toEqual('Invalid token');
      expect(result.current.loading).toBe(false);
    });
  });

  test('sets error message when API call fails', async () => {
    vi.mocked(tokenConfirmApi).mockRejectedValueOnce(
      new Error('Network Error')
    );
    // 正しいリクエストデータを使用して、API呼び出しが失敗することをシミュレートします
    const requestData = {
      token: 'valid_token',
    };

    const { result } = renderHook(() => useTokenConfirm(requestData.token));

    await waitFor(() => {
      expect(result.current.data).toBeNull();
      expect(result.current.tokenError).toEqual('Network Error');
      expect(result.current.loading).toBe(false);
    });
  });
});
