// 小1〜高3の作成
export const STUDENTS_LEVEL_OPTIONS = [
  ...Array.from({ length: 6 }, (_, i) => ({
    school_stage: 'elementary_school',
    grade: i + 1,
    label: `小学${i + 1}年`,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    school_stage: 'junior_high_school',
    grade: i + 1,
    label: `中学${i + 1}年`,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    school_stage: 'high_school',
    grade: i + 1,
    label: `高校${i + 1}年`,
  })),
] as const;
