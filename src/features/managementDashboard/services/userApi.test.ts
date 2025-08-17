import { api } from '@/lib/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type {
  fetchUserErrorResponse,
  fetchUserSuccessResponse,
} from '../types/user';
import type { AxiosError, AxiosResponse } from 'axios';
import { fetchUser } from './userApi';

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('User API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('fetchUser', async () => {
    const mockResponse: Pick<
      AxiosResponse<fetchUserSuccessResponse>,
      'data'
    > = {
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
    };

    vi.mocked(api.get).mockResolvedValue(mockResponse);

    const result = await fetchUser();
    expect(result.data.success).toEqual(mockResponse.data.success);
    expect(result.data).toEqual(mockResponse.data);
  });
  test('returns error response', async () => {
    const mockErrorResponse: Pick<
      AxiosError<fetchUserErrorResponse>,
      'response'
    > = {
      response: {
        data: {
          success: false,
          errors: ['token_invalid'],
        },
      } as AxiosResponse<fetchUserErrorResponse>,
    };

    vi.mocked(api.get).mockRejectedValue(mockErrorResponse);

    await expect(fetchUser()).rejects.toMatchObject({
      response: { data: { success: false, errors: ['token_invalid'] } },
    });
  });
});
