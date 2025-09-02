import { describe, expect, test } from 'vitest';
import { getSignInStatus } from '../getSignInStatus';

import { IconCircle } from '@tabler/icons-react';
import { mockData } from './fixtures/signInStatus';

describe('getSignInStatus', () => {
  test('should return correct status for various sign-in times', () => {
    mockData.forEach(({ day, hours, minutes, mockLabel, colorClass, Icon }) => {
      const miniMinutesAgo = (day * 24 * 60 + hours * 60 + minutes) * 60 * 1000;
      const signInAtMinutes = Date.now() - miniMinutesAgo;
      const signInAtISO = new Date(signInAtMinutes).toISOString();
      const result = getSignInStatus(signInAtISO);

      expect(result.label).toBe(mockLabel);
      expect(result.colorClass).toBe(colorClass);
      expect(result.Icon).toBe(Icon);
    });
  });
  test('should return correct status for null sign-in time', () => {
    const result = getSignInStatus(null);
    expect(result.label).toBe('未ログイン');
    expect(result.colorClass).toBe('text-muted-foreground');
    expect(result.Icon).toBe(IconCircle);
  });
});
