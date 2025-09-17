import { renderHook, act } from '@testing-library/react';
import { useSignIn } from '../../hooks/useSignIn';
import { signInApi } from '../../api/signInApi';
import { useAuthStore } from '@/stores/authStore';
import { useWarningStore } from '@/stores/warningStore';
import type { AxiosResponse } from 'axios';
import type { AuthHeader } from '../../types/auth';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../api/signInApi');
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));
vi.mock('@/stores/warningStore', () => ({
  useWarningStore: vi.fn(),
}));

describe('useSignIn', () => {
  const setAuth = vi.fn();
  const setClearWarningMessage = vi.fn();

  beforeEach(() => {
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({
        auth: null,
        setAuth,
        clearAuth: vi.fn(),
        isAuthenticated: vi.fn(),
      })
    );
    vi.mocked(useWarningStore).mockImplementation((selector) =>
      selector({
        warningMessage: '',
        setWarningMessage: vi.fn(),
        setClearWarningMessage,
      })
    );
    vi.clearAllMocks();
  });

  test('call setAuth when it succeeds', async () => {
    const mockHeaders: AuthHeader = {
      'access-token': 'mockAccessToken',
      client: 'mockClient',
      uid: 'mockUid',
      'token-type': 'mockTokenType',
      expiry: 'mockExpiry',
    };

    // Partial ですべてのAxiosResponseでなくてもよくして、部分的なモックを作成する
    // その後、as AxiosResponseで型を強制する
    const mockResponse = {
      headers: mockHeaders,
    } as Partial<AxiosResponse> as AxiosResponse;

    // signInApi の返却値は headers
    vi.mocked(signInApi).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useSignIn());

    let res;
    await act(async () => {
      res = await result.current.submit('test@example.com', 'password123');
      expect(setClearWarningMessage).toHaveBeenCalled();
    });

    expect(res).toEqual({ ok: true });
    expect(setAuth).toHaveBeenCalledWith(mockHeaders);
    expect(result.current.error).toBeNull();
  });

  test('returns error when auth headers are missing', async () => {
    const mockResponse = {
      headers: { 'access-token': 'mockAccessToken' }, // 足りない
    } as Partial<AxiosResponse> as AxiosResponse;

    vi.mocked(signInApi).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useSignIn());

    let res;
    await act(async () => {
      res = await result.current.submit('test@example.com', 'password123');
      expect(setClearWarningMessage).toHaveBeenCalled();
    });

    expect(res).toEqual({ ok: false });
    expect(result.current.error).toEqual(['認証情報の取得に失敗しました。']);
    expect(setAuth).not.toHaveBeenCalled();
  });

  test('sets error message when API call fails', async () => {
    vi.mocked(signInApi).mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useSignIn());

    let res;
    await act(async () => {
      res = await result.current.submit('test@example.com', 'password123');
      expect(setClearWarningMessage).toHaveBeenCalled();
    });

    expect(res).toEqual({ ok: false });
    expect(result.current.error).toEqual(['通信エラーが発生しました。']);
  });
});
