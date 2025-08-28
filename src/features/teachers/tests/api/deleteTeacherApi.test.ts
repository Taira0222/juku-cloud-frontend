import { api } from '@/lib/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { deleteTeacherApi } from '../../api/deleteTeacherApi';

vi.mock('@/lib/api', () => ({
  api: {
    delete: vi.fn(),
  },
}));

describe('deleteTeacherApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('success deleteTeacherApi', async () => {
    const mockResponse = { status: 200 };

    vi.mocked(api.delete).mockResolvedValue(mockResponse);

    const result = await deleteTeacherApi(1);
    expect(result).toEqual(mockResponse);
  });
  test('should not delete teacher with error', async () => {
    const mockErrorResponse = { error: 'Teacher not found' };
    vi.mocked(api.delete).mockRejectedValueOnce(mockErrorResponse);

    await expect(deleteTeacherApi(1)).rejects.toBe(mockErrorResponse);
  });
});
