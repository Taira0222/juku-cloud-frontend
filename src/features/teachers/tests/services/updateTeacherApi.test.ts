import { api } from '@/lib/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { updateTeacherApi } from '../../services/updateTeacherApi';
import { requestUpdateMockData } from '../../../../tests/fixtures/teachers/teachers';

vi.mock('@/lib/api', () => ({
  api: {
    patch: vi.fn(),
  },
}));

describe('updateTeacherApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should update teacher information', async () => {
    const mockResponse = {
      data: {
        teacher_id: 123,
      },
    };
    vi.mocked(api.patch).mockResolvedValue(mockResponse);

    const result = await updateTeacherApi(123, requestUpdateMockData);

    expect(result).toEqual(mockResponse);
  });
  test('should not update teacher information with invalid data', async () => {
    const mockErrorResponse = { errors: ['unexpected_error'] };
    vi.mocked(api.patch).mockRejectedValueOnce(mockErrorResponse);

    await expect(updateTeacherApi(123, requestUpdateMockData)).rejects.toBe(
      mockErrorResponse
    );
  });
});
