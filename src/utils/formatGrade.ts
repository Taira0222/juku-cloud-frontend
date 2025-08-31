import { useSchoolStageTranslation } from '../hooks/useSchoolStageTranslations';

export const formatGrade = (school_stage: string, grade: number) => {
  const { translateSchoolStage } = useSchoolStageTranslation();

  const formattedStage = translateSchoolStage(school_stage);
  return `${formattedStage} ${grade}年`;
};
