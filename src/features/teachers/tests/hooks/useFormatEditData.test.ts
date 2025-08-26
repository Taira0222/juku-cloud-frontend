import { describe, expect, test } from 'vitest';
import { detailDrawer, formatEditMock } from '../fixtures/teachers';
import { renderHook } from '@testing-library/react';
import { useFormatEditData } from '../../hooks/useFormatEditData';

describe('useFormatEditData', () => {
  test('should format data correctly', () => {
    const mockPropsData = {
      formData: {
        name: 'John Doe',
        employment_status: 'active',
        subjects: ['mathematics', 'science'],
        available_days: ['monday', 'wednesday'],
        student_ids: [1, 3],
      },
      detailDrawer: detailDrawer,
    };
    const { result } = renderHook(() => useFormatEditData(mockPropsData));

    const { formatSubjectsData, formatDaysData, formatStudentsData } =
      result.current;

    expect(formatSubjectsData()).toEqual([
      {
        id: 3,
        name: 'mathematics',
      },
      {
        id: 4,
        name: 'science',
      },
    ]);
    expect(formatDaysData()).toEqual([
      {
        id: 2,
        name: 'monday',
      },
      {
        id: 4,
        name: 'wednesday',
      },
    ]);
    // fixtures の値を返す
    expect(formatStudentsData()).toEqual([
      {
        id: 1,
        student_code: 'S1234',
        name: 'Student One',
        status: 'active',
        school_stage: 'high_school',
        grade: 3,
      },
      {
        id: 3,
        student_code: 'S4597',
        name: 'Student two',
        status: 'active',
        school_stage: 'junior_high_school',
        grade: 2,
      },
    ]);
  });

  test('should return empty arrays when no matches found', () => {
    const { result } = renderHook(() => useFormatEditData(formatEditMock));

    const { formatSubjectsData, formatDaysData, formatStudentsData } =
      result.current;

    expect(formatSubjectsData()).toEqual([]);
    expect(formatDaysData()).toEqual([]);
    expect(formatStudentsData()).toEqual([]);
  });
});
