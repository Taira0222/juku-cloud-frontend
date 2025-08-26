import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { normalizeStage, parseLevel, stageLabel } from '../../utils/teachers';

describe('stageLabel', () => {
  test('should return correct stage label', () => {
    const mockProps = 'elementary';

    const { result } = renderHook(() => stageLabel(mockProps));

    expect(result.current).toEqual('小');
  });

  test('should return empty string for unknown stage', () => {
    const mockProps = 'unknown';

    const { result } = renderHook(() => stageLabel(mockProps));

    expect(result.current).toEqual('');
  });
});

describe('normalizeStage', () => {
  test('should normalize stage strings correctly', () => {
    const stages = ['elementary', 'junior_high', 'high_school'];
    const expected = ['小', '中', '高'];

    // 英語で受けとった場合はそのまま返す
    stages.forEach((stage, index) => {
      const { result } = renderHook(() => normalizeStage(stage));
      expect(result.current).toEqual(stages[index]);
    });

    // 日本語の略称を受け取った場合は対応する英語のステージを返す
    expected.forEach((exp, index) => {
      const { result } = renderHook(() => normalizeStage(exp));
      expect(result.current).toEqual(stages[index]);
    });
  });

  test('should return null for completely unknown strings', () => {
    const { result } = renderHook(() => normalizeStage('completelyUnknown'));
    expect(result.current).toBeNull();
  });
});

describe('parseLevel', () => {
  test('should parse level strings correctly', () => {
    const levels = ['elementary-3', 'junior_high-2', 'high_school-1'];
    const expected = [
      { stage: 'elementary', grade: 3 },
      { stage: 'junior_high', grade: 2 },
      { stage: 'high_school', grade: 1 },
    ];

    levels.forEach((level, index) => {
      const { result } = renderHook(() => parseLevel(level));
      expect(result.current).toEqual(expected[index]);
    });
  });
});
