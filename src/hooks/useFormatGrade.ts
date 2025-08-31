import { useSchoolStageTranslation } from './useSchoolStageTranslations';

export const useFormatGrade = (school_stage: string, grade: number) => {
  const { translateSchoolStage } = useSchoolStageTranslation();

  const formattedStage = translateSchoolStage(school_stage);
  return `${formattedStage} ${grade}年`;
};
