import type { Teacher } from '../types/studentForm';

export const buildTeachersByTab = (
  teachers: Teacher[],
  selectedSubjectIds: number[],
  selectedAvailableDayIds: number[],
  allDayIds: readonly number[]
) => {
  // 高速処理できるように Set に変換
  const subjectSet = new Set(selectedSubjectIds);
  const selectedDaySet = new Set(selectedAvailableDayIds);

  const all = teachers.filter((t) => {
    const subjectOK =
      subjectSet.size === 0 ||
      t.teachable_subjects?.some((s) => subjectSet.has(s.id));
    const dayOK =
      selectedDaySet.size === 0 ||
      t.workable_days?.some((d) => selectedDaySet.has(d.id));
    // 曜日と科目が生徒の希望を満たす講師を抽出
    return !!(subjectOK && dayOK);
  });
  // 選択した曜日・科目に応じて、曜日ごとに講師を分類
  const byDay: Record<number, Teacher[]> = {};
  for (const dayId of allDayIds) {
    byDay[dayId] = teachers.filter((t) => {
      const worksThatDay = t.workable_days?.some((d) => d.id === dayId);
      const subjectOK =
        subjectSet.size === 0 ||
        t.teachable_subjects?.some((s) => subjectSet.has(s.id));
      return !!(worksThatDay && subjectOK);
    });
  }

  return { all, byDay };
};
