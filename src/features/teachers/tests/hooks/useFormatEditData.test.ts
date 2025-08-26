import { describe, expect, test } from 'vitest';
import {
  detailDrawer,
  formatEditMock,
  student1,
  student3,
  SUBJECTS_MOCK,
} from '../../../../tests/fixtures/teachers/teachers';
import { renderHook } from '@testing-library/react';
import { useFormatEditData } from '../../hooks/useFormatEditData';
import { AVAILABLE_DAYS } from '../../constants/teachers';

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

    expect(formatSubjectsData()).toEqual([SUBJECTS_MOCK[2], SUBJECTS_MOCK[3]]);
    expect(formatDaysData()).toEqual([AVAILABLE_DAYS[1], AVAILABLE_DAYS[3]]);

    expect(formatStudentsData()).toEqual([student1, student3]);
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
