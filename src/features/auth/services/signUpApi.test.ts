import { api } from '@/lib/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { signUpApi } from './signUpApi';

vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('signUpApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should sign up user with valid credentials', async () => {
    const mockResponse = { data: { uid: 'user1' } };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const requestData = {
      name: 'test user',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      token: 'valid_token',
    };

    const result = await signUpApi(requestData);

    expect(api.post).toHaveBeenCalledWith('/auth', {
      name: 'test user',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      token: 'valid_token',
    });
    expect(result).toEqual(mockResponse);
  });

  test('should not sign up user with invalid credentials', async () => {
    const mockResponse = { errors: ['Invalid token'] };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const requestData = {
      name: 'test user',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      token: 'invalid_token',
    };

    const result = await signUpApi(requestData);
    expect(api.post).toHaveBeenCalledWith('/auth', {
      name: 'test user',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      token: 'invalid_token',
    });
    expect(result).toEqual(mockResponse);
  });
});
