import { SCHOOL_STAGE_TRANSLATIONS } from '@/constants/schoolStageTranslations';

export const formatSchoolStage = (english: string) => {
  return SCHOOL_STAGE_TRANSLATIONS[english] ?? english;
};
