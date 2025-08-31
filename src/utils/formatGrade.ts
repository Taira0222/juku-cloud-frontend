import { formatSchoolStage } from '@/utils/formatSchoolStage';

export const formatGrade = (school_stage: string, grade: number) => {
  const formattedStage = formatSchoolStage(school_stage);
  return `${formattedStage} ${grade}年`;
};
