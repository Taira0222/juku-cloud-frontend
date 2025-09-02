import { describe, expect, test } from 'vitest';
import { formatGrade } from '../formatGrade';

describe('formatGrade', () => {
  test('should format grade correctly', () => {
    const inputSchoolStage = 'junior_high_school';
    const inputGrade = 3;
    const expectedOutput = '中学3年';
    const result = formatGrade(inputSchoolStage, inputGrade);
    expect(result).toBe(expectedOutput);
  });
  test('should handle invalid school stage', () => {
    const inputSchoolStage = 'invalid_stage';
    const inputGrade = 3;
    const expectedOutput = '無効な学年';
    const result = formatGrade(inputSchoolStage, inputGrade);
    expect(result).toBe(expectedOutput);
  });
  test('should handle invalid grade (non-integer)', () => {
    const inputSchoolStage = 'junior_high_school';
    const inputGrade = 3.5;
    const expectedOutput = '無効な学年';
    const result = formatGrade(inputSchoolStage, inputGrade);
    expect(result).toBe(expectedOutput);
  });
  test('should handle invalid grade (less than 1)', () => {
    const inputSchoolStage = 'junior_high_school';
    const inputGrade = 0;
    const expectedOutput = '無効な学年';
    const result = formatGrade(inputSchoolStage, inputGrade);
    expect(result).toBe(expectedOutput);
  });
  test('should handle invalid grade (not in options)', () => {
    const inputSchoolStage = 'elementary_school';
    const inputGrade = 10;
    const expectedOutput = '無効な学年';
    const result = formatGrade(inputSchoolStage, inputGrade);
    expect(result).toBe(expectedOutput);
  });
});
