import { SCHOOL_STAGE_TRANSLATIONS } from '@/constants/schoolStageTranslations';
import { STUDENTS_LEVEL_OPTIONS } from '@/constants/studentsLevel';
import { formatSchoolStage } from '@/utils/formatSchoolStage';

export const formatGrade = (school_stage: string, grade: number) => {
  // ステージ不正 or 学年が整数でない/1未満は即不正
  if (!SCHOOL_STAGE_TRANSLATIONS[school_stage]) return '無効な学年';
  if (!Number.isInteger(grade) || grade < 1) return '無効な学年';

  const ok = STUDENTS_LEVEL_OPTIONS.some(
    (opt) => opt.school_stage === school_stage && opt.grade === grade
  );
  if (!ok) return '無効な学年';

  return `${formatSchoolStage(school_stage)}${grade}年`;
};
