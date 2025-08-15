import { api } from '@/lib/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { tokenConfirmApi } from './tokenConfirmApi';

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('tokenConfirmApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should confirm user token with valid token', async () => {
    const mockResponse = { school_name: 'First_school' };
    vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

    const result = await tokenConfirmApi('valid_token');

    expect(api.get).toHaveBeenCalledWith('/invites/valid_token');

    expect(result).toEqual(mockResponse);
  });

  test('should not confirm user token with invalid token', async () => {
    const mockResponse = { message: 'Invalid token' };
    vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

    const result = await tokenConfirmApi('invalid_token');

    expect(api.get).toHaveBeenCalledWith('/invites/invalid_token');

    expect(result).toEqual(mockResponse);
  });
});
