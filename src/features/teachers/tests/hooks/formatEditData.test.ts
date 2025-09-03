import { describe, expect, test } from 'vitest';
import {
  detailDrawer,
  formatEditMock,
  SUBJECTS_MOCK,
} from '../../../../tests/fixtures/teachers/teachers';

import { AVAILABLE_DAYS } from '../../constants/teachers';
import { formatEditData } from '../../utils/formatEditData';

describe('useFormatEditData', () => {
  test('should format data correctly', () => {
    const mockPropsData = {
      formData: {
        name: 'John Doe',
        employment_status: 'active',
        subjects: ['mathematics', 'science'],
        available_days: ['monday', 'wednesday'],
      },
      detailDrawer: detailDrawer,
    };
    const result = formatEditData(mockPropsData);

    const { formatSubjectsData, formatDaysData } = result;

    expect(formatSubjectsData()).toEqual([SUBJECTS_MOCK[2], SUBJECTS_MOCK[3]]);
    expect(formatDaysData()).toEqual([AVAILABLE_DAYS[1], AVAILABLE_DAYS[3]]);
  });

  test('should return empty arrays when no matches found', () => {
    const result = formatEditData(formatEditMock);

    const { formatSubjectsData, formatDaysData } = result;

    expect(formatSubjectsData()).toEqual([]);
    expect(formatDaysData()).toEqual([]);
  });
});
