import { SCHOOL_STAGE_TRANSLATIONS } from '@/constants/schoolStageTranslations';

export const useSchoolStageTranslation = () => {
  const translateSchoolStage = (en: string) =>
    SCHOOL_STAGE_TRANSLATIONS[en] ?? en;

  return { translateSchoolStage };
};
