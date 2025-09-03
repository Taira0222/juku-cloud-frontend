import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fetchStudents } from '../../api/studentsApi';
import {
  mockMeta,
  studentsMock,
} from '../../../../tests/fixtures/students/students';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('studentsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('fetchStudents', async () => {
    const mockResponse = {
      data: {
        students: studentsMock,
        meta: mockMeta,
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

    const mockFilters = {
      searchKeyword: undefined,
      school_stage: undefined,
      grade: undefined,
      page: 1,
      perPage: 10,
    };

    const result = await fetchStudents(mockFilters);
    expect(result).toEqual({
      students: studentsMock,
      meta: mockMeta,
    });
    expect(api.get).toHaveBeenCalledWith('/students', { params: mockFilters });
  });

  test('fetchStudents - handles API error', async () => {
    const apiError = new Error('API Error');
    vi.mocked(api.get).mockRejectedValueOnce(apiError);

    const mockFilters = {
      searchKeyword: undefined,
      school_stage: undefined,
      grade: undefined,
      page: 1,
      perPage: 10,
    };

    await expect(fetchStudents(mockFilters)).rejects.toThrow('API Error');
  });

  test('fetchStudents - handles invalid response data', async () => {
    const invalidResponse = {
      data: {
        // students プロパティが欠けている不正なレスポンス
        meta: mockMeta,
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce(invalidResponse);

    const mockFilters = {
      searchKeyword: undefined,
      school_stage: undefined,
      grade: undefined,
      page: 1,
      perPage: 10,
    };

    // Zodエラーがスローされることを確認
    await expect(fetchStudents(mockFilters)).rejects.toThrow();
  });
});
