import { api } from '@/lib/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { inviteTokenApi } from '../../services/inviteTokenApi';

vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('invite Token API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('success inviteTokenApi', async () => {
    const mockResponse = {
      token: 'valid_token',
    };

    vi.mocked(api.post).mockResolvedValue(mockResponse);

    const result = await inviteTokenApi();
    expect(result).toEqual(mockResponse);
  });
  test('should not confirm user token with error', async () => {
    const mockErrorResponse = { message: 'invalid_token' };
    vi.mocked(api.post).mockRejectedValueOnce(mockErrorResponse);

    await expect(inviteTokenApi()).rejects.toBe(mockErrorResponse);
  });
});
