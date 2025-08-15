import { api } from '@/lib/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { signInApi } from './signInApi';

vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('signInApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should sign in user with valid credentials', async () => {
    const mockResponse = { data: { uid: 'user1' } };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const result = await signInApi('test@example.com', 'password123');
    expect(api.post).toHaveBeenCalledWith(
      '/auth/sign_in',
      { email: 'test@example.com', password: 'password123' },
      { suppressAuthRedirect: true }
    );
    expect(result).toEqual(mockResponse);
  });

  test('should not sign in user with invalid credentials', async () => {
    const mockResponse = { errors: ['Invalid credentials'] };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const result = await signInApi('test@example.com', 'wrongpassword');
    expect(api.post).toHaveBeenCalledWith(
      '/auth/sign_in',
      { email: 'test@example.com', password: 'wrongpassword' },
      { suppressAuthRedirect: true }
    );
    expect(result).toEqual(mockResponse);
  });
});
