import { renderHook, act } from '@testing-library/react';
import { useWarningStore } from '@/stores/warningStore';
import type { AxiosResponse } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { signUpApi } from '../services/signUpApi';
import { useSignUp } from './useSignUp';
import type { SignUpRequestData } from '../types/signUp';

vi.mock('../services/signUpApi');
vi.mock('@/stores/warningStore', () => ({
  useWarningStore: vi.fn(),
}));

describe('useSignUp', () => {
  const setClearWarningMessage = vi.fn();

  beforeEach(() => {
    vi.mocked(useWarningStore).mockReturnValue(setClearWarningMessage);
    vi.clearAllMocks();
  });

  test('returns ok when it succeeds', async () => {
    // Partial ですべてのAxiosResponseでなくてもよくして、部分的なモックを作成する
    // その後、as AxiosResponseで型を強制する
    const mockResponse = {
      data: {
        uid: 'user1',
      },
    } as Partial<AxiosResponse> as AxiosResponse;

    const requestData = {
      name: 'test user',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      token: 'valid_token',
    };

    // signUpApi の返却値は headers
    vi.mocked(signUpApi).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useSignUp());

    let res;
    await act(async () => {
      res = await result.current.submit(requestData);
    });

    expect(res).toEqual({ ok: true });
    expect(result.current.error).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });

  test('returns error when send wrong data', async () => {
    const axiosLikeError = {
      isAxiosError: true,
      response: {
        data: {
          errors: {
            full_messages: ['Invalid token'],
          },
        },
      },
    };

    // 誤ったtoken
    const requestData: SignUpRequestData = {
      name: 'test user',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      token: 'invalid_token',
    };

    vi.mocked(signUpApi).mockRejectedValueOnce(axiosLikeError);

    const { result } = renderHook(() => useSignUp());

    let res;
    await act(async () => {
      res = await result.current.submit(requestData);
    });

    expect(res).toEqual({ ok: false });
    expect(result.current.error).toEqual(['Invalid token']);
    expect(result.current.isSubmitting).toBe(false);
  });

  test('sets error message when API call fails', async () => {
    vi.mocked(signUpApi).mockRejectedValueOnce(new Error('Network Error'));
    // 正しいリクエストデータを使用して、API呼び出しが失敗することをシミュレートします
    const requestData = {
      name: 'test user',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      token: 'valid_token',
    };

    const { result } = renderHook(() => useSignUp());

    let res;
    await act(async () => {
      res = await result.current.submit(requestData);
    });

    expect(res).toEqual({ ok: false });
    expect(result.current.error).toEqual(['Network Error']);
    expect(result.current.isSubmitting).toBe(false);
  });
});
