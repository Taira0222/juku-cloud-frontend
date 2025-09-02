import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useStudentsQuery } from '../../queries/useStudentsQuery';
import { describe, expect, test, vi } from 'vitest';
import {
  mockMeta,
  studentsMock,
} from '../../../../tests/fixtures/students/students';
import { fetchStudents } from '../../api/studentsApi';
import type z from 'zod';
import type { fetchStudentsSuccessResponseSchema } from '../../types/students';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock('../../api/studentsApi', () => ({
  fetchStudents: vi.fn(),
}));

describe('useStudentsQuery', () => {
  test('should fetch students successfully', async () => {
    const mockFilters = {
      searchKeyword: undefined,
      school_stage: undefined,
      grade: undefined,
      page: 1,
      perPage: 10,
    };
    const mockResponse = {
      students: studentsMock,
      meta: mockMeta,
    } as z.infer<typeof fetchStudentsSuccessResponseSchema>;

    vi.mocked(fetchStudents).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useStudentsQuery(mockFilters), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
  });

  test('should handle error state', async () => {
    const mockFilters = {
      searchKeyword: undefined,
      school_stage: undefined,
      grade: undefined,
      page: 1,
      perPage: 10,
    };
    const mockError = new Error('Failed to fetch students');

    vi.mocked(fetchStudents).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useStudentsQuery(mockFilters), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
