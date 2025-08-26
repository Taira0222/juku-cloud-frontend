import { renderHook, waitFor } from '@testing-library/react';
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

describe('normalizeStage', async () => {
  test('should normalize stage strings correctly', () => {
    const stages = ['elementary', 'juniorHigh', 'highSchool', 'unknown'];
    const expected = ['小', '中', '高', ''];

    stages.forEach(async (stage, index) => {
      const { result } = renderHook(() => normalizeStage(stage));
      await waitFor(() => {
        expect(result.current).toEqual(stage[index]);
      });
    });

    expected.forEach(async (exp, index) => {
      const { result } = renderHook(() => normalizeStage(exp));
      await waitFor(() => {
        expect(result.current).toEqual(stages[index]);
      });
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

    levels.forEach(async (level, index) => {
      const { result } = renderHook(() => parseLevel(level));
      await waitFor(() => {
        expect(result.current).toEqual(expected[index]);
      });
    });
  });
});
