import { expect, test } from 'vitest';
import { describe } from 'vitest';
import {
  dateToISO,
  getSubjectLabel,
  isoToDate,
  normalizePayload,
} from '../../utils/studentFormTransforms';
import { createStudentMockPayload } from '@/tests/fixtures/students/students';

describe('dateToISO', () => {
  test('converts Date to ISO string', () => {
    const date = new Date(2023, 0, 5); // January 5, 2023
    const isoString = dateToISO(date);
    expect(isoString).toBe('2023-01-05');
  });
});

describe('isoToDate', () => {
  test('converts ISO string to Date', () => {
    const isoString = '2023-01-05';
    const date = isoToDate(isoString);
    expect(date).toEqual(new Date(2023, 0, 5)); // January 5, 2023
  });
  test('returns undefined for null or undefined input', () => {
    expect(isoToDate(null)).toBeUndefined();
    expect(isoToDate(undefined)).toBeUndefined();
  });
  test('handles incomplete ISO strings', () => {
    expect(isoToDate('2023')).toEqual(new Date(2023, 0, 1)); // January 1, 2023
    expect(isoToDate('2023-02')).toEqual(new Date(2023, 1, 1)); // February 1, 2023
  });
});

describe('normalizePayload', () => {
  test('trims desired_school and converts empty to null', () => {
    const mockPayload = {
      ...createStudentMockPayload,
      desired_school: '  ', // 空白のみ
    };

    const normalized = normalizePayload(mockPayload);
    expect(normalized.desired_school).toBeNull();
  });
  test('trims desired_school if not empty', () => {
    const mockPayload = {
      ...createStudentMockPayload,
      desired_school: '  Stanford University  ',
    };

    const normalized = normalizePayload(mockPayload);
    expect(normalized.desired_school).toBe('Stanford University');
  });
});

describe('getSubjectLabel', () => {
  test('returns correct subject label for valid id', () => {
    const label = getSubjectLabel(1); // english
    expect(label).toBe('english');
  });
  test('returns fallback message for invalid id', () => {
    const label = getSubjectLabel(999); // 存在しないID
    expect(label).toBe('科目が見つかりませんでした');
  });
});
