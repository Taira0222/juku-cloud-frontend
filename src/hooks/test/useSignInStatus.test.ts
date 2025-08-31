import { describe, expect, test } from 'vitest';
import { useSignInStatus } from '../useSignInStatus';
import { renderHook } from '@testing-library/react';

import { IconCircle } from '@tabler/icons-react';
import { mockData } from './fixtures/signInStatus';

describe('useSignInStatus', () => {
  test('should return correct status for various sign-in times', () => {
    mockData.forEach(({ day, hours, minutes, mockLabel, colorClass, Icon }) => {
      const miniMinutesAgo = (day * 24 * 60 + hours * 60 + minutes) * 60 * 1000;
      const signInAtMinutes = Date.now() - miniMinutesAgo;
      const signInAtISO = new Date(signInAtMinutes).toISOString();
      const { result } = renderHook(() => useSignInStatus(signInAtISO));

      expect(result.current.label).toBe(mockLabel);
      expect(result.current.colorClass).toBe(colorClass);
      expect(result.current.Icon).toBe(Icon);
    });
  });
  test('should return correct status for null sign-in time', () => {
    const { result } = renderHook(() => useSignInStatus(null));
    expect(result.current.label).toBe('未ログイン');
    expect(result.current.colorClass).toBe('text-muted-foreground');
    expect(result.current.Icon).toBe(IconCircle);
  });
});
