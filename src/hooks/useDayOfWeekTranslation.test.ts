import { describe, expect, test } from 'vitest';
import { useDayOfWeekTranslation } from './useDayOfWeekTranslation';
import { renderHook } from '@testing-library/react';
import { DAY_OF_WEEK_TRANSLATIONS } from '@/constants/dayOfWeekTranslations';

describe('useDayOfWeekTranslation', () => {
  test('should return the correct translation for each day of the week', () => {
    const { result } = renderHook(() => useDayOfWeekTranslation());

    Object.entries(DAY_OF_WEEK_TRANSLATIONS).forEach(([day, translation]) => {
      expect(result.current.translateDayOfWeek(day)).toBe(translation);
    });
  });

  test('should return english without translation for unknown days', () => {
    const { result } = renderHook(() => useDayOfWeekTranslation());
    const unknownDay = 'unknown';
    const emptyDay = '';
    const UNKNOWN_DAYS = [unknownDay, emptyDay];

    UNKNOWN_DAYS.forEach((day) => {
      expect(result.current.translateDayOfWeek(day)).toBe(day);
    });
  });
});
