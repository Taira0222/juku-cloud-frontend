import { api } from '@/lib/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fetchTeachers } from '../../services/teachersApi';

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('Teachers API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('success fetchTeachers', async () => {
    const mockResponse = {
      current_user: { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      teachers: [
        { id: 1, name: 'Jane Smith', subject: 'Math' },
        { id: 2, name: 'Bob Johnson', subject: 'Science' },
      ],
    };

    vi.mocked(api.get).mockResolvedValue(mockResponse);

    const result = await fetchTeachers();
    expect(result).toEqual(mockResponse);
  });
  test('should not confirm user token with error', async () => {
    const mockErrorResponse = { error: 'unexpected_error' };
    vi.mocked(api.get).mockRejectedValueOnce(mockErrorResponse);

    await expect(fetchTeachers()).rejects.toBe(mockErrorResponse);
  });
});
