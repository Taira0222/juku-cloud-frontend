import { describe, expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSchoolStageTranslation } from '../useSchoolStageTranslations';
import { SCHOOL_STAGE_TRANSLATIONS } from '@/constants/schoolStageTranslations';

describe('useSchoolStageTranslation', () => {
  test('should return the correct translation for each school stage', () => {
    const { result } = renderHook(() => useSchoolStageTranslation());

    Object.entries(SCHOOL_STAGE_TRANSLATIONS).forEach(
      ([stage, translation]) => {
        expect(result.current.translateSchoolStage(stage)).toBe(translation);
      }
    );
  });

  test('should return English without translation for unknown stages', () => {
    const { result } = renderHook(() => useSchoolStageTranslation());
    const unknownStage = 'unknown';
    const emptyStage = '';
    const UNKNOWN_STAGES = [unknownStage, emptyStage];

    UNKNOWN_STAGES.forEach((stage) => {
      expect(result.current.translateSchoolStage(stage)).toBe(stage);
    });
  });
});
