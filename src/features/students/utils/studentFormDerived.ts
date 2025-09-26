import type { Teacher } from "../types/studentForm";

export const buildTeachersByTab = (
  teachers: Teacher[],
  selectedSubjectIds: number[],
  allDayIds: readonly number[]
) => {
  // 高速処理できるように Set に変換
  const subjectSet = new Set(selectedSubjectIds);
  // 選択した曜日・科目に応じて、曜日ごとに講師を分類
  const byDay: Record<number, Teacher[]> = {};
  for (const dayId of allDayIds) {
    byDay[dayId] = teachers.filter((t) => {
      // その曜日に勤務していて、かつ選択された科目を指導可能な講師
      const worksThatDay = t.workable_days?.some((d) => d.id === dayId);
      const subjectOK = t.teachable_subjects?.some((s) => subjectSet.has(s.id));
      return worksThatDay && subjectOK;
    });
  }

  return { byDay };
};
