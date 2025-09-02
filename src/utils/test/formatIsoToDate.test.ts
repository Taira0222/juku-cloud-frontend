import { describe, expect, test } from 'vitest';
import { formatIsoToDate } from '../formatIsoToDate';

describe('formatIsoToDate', () => {
  test('should format ISO date strings correctly', () => {
    const input = '2023-03-03T12:00:00Z';
    const expectedOutput = '2023/03/03'; // 日本のローカル日付形式
    const result = formatIsoToDate(input);
    expect(result).toBe(expectedOutput);
  });

  test('should return an empty string for empty input', () => {
    const input = '';
    const expectedOutput = '';
    const result = formatIsoToDate(input);
    expect(result).toBe(expectedOutput);
  });

  test('should return an error message for invalid ISO date strings', () => {
    const input = 'invalid-date';
    const expectedOutput = '';
    const result = formatIsoToDate(input);
    expect(result).toBe(expectedOutput);
  });
});
