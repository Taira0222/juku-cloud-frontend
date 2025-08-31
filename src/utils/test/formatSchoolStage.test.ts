import { describe, expect, test } from 'vitest';
import { SCHOOL_STAGE_TRANSLATIONS } from '@/constants/schoolStageTranslations';
import { formatSchoolStage } from '../formatSchoolStage';

describe('useSchoolStageTranslation', () => {
  test('should return the correct translation for each school stage', () => {
    Object.entries(SCHOOL_STAGE_TRANSLATIONS).forEach(
      ([stage, translation]) => {
        expect(formatSchoolStage(stage)).toBe(translation);
      }
    );
  });

  test('should return English without translation for unknown stages', () => {
    const unknownStage = 'unknown';
    const emptyStage = '';
    const UNKNOWN_STAGES = [unknownStage, emptyStage];

    UNKNOWN_STAGES.forEach((stage) => {
      expect(formatSchoolStage(stage)).toBe(stage);
    });
  });
});
