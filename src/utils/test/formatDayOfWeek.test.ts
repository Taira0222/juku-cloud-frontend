import { describe, expect, test } from 'vitest';
import { formatDayOfWeek } from '../formatDayOfWeek';

import { DAY_OF_WEEK_TRANSLATIONS } from '@/constants/dayOfWeekTranslations';

describe('useDayOfWeekTranslation', () => {
  test('should return the correct translation for each day of the week', () => {
    Object.entries(DAY_OF_WEEK_TRANSLATIONS).forEach(([day, translation]) => {
      expect(formatDayOfWeek(day)).toBe(translation);
    });
  });

  test('should return English without translation for unknown days', () => {
    const unknownDay = 'unknown';
    const emptyDay = '';
    const UNKNOWN_DAYS = [unknownDay, emptyDay];

    UNKNOWN_DAYS.forEach((day) => {
      expect(formatDayOfWeek(day)).toBe(day);
    });
  });
});
