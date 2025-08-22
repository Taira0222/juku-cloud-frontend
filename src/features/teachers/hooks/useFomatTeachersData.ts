import { useEffect } from 'react';

import { useTeachersStore } from '@/stores/teachersStore';
import type {
  currentUser,
  teacherDataTable,
  teacherDetailDrawer,
} from '../types/teachers';

// toTeacherRow や toTeacherDetailDrawer に渡すデータの型(currentUser や teachers)
type fetchData = currentUser;

// DataTable 用の値に成形する
export const toTeacherRow = (teacher: fetchData): teacherDataTable => ({
  id: teacher.id,
  name: teacher.name,
  role: teacher.role,
  employment_status: teacher.employment_status,
  class_subjects: teacher.class_subjects.map((cs) => ({
    id: cs.id,
    name: cs.name,
  })),
  studentsCount: teacher.students.length,
  current_sign_in_at: teacher.current_sign_in_at,
});

// 詳細情報用の値に成形する
export const toTeacherDetailDrawer = (
  teacher: fetchData
): teacherDetailDrawer => ({
  id: teacher.id,
  name: teacher.name,
  role: teacher.role,
  email: teacher.email,
  created_at: teacher.created_at,
  employment_status: teacher.employment_status,
  current_sign_in_at: teacher.current_sign_in_at,
  students: teacher.students.map((student) => ({
    id: student.id,
    student_code: student.student_code,
    name: student.name,
    status: student.status,
    school_stage: student.school_stage,
    grade: student.grade,
  })),
  available_days: teacher.available_days.map((day) => ({
    id: day.id,
    name: day.name,
  })),
  class_subjects: teacher.class_subjects.map((cs) => ({
    id: cs.id,
    name: cs.name,
  })),
});

// パラメータとして currentUserData と teachersData を受け取るように変更
export const useFormatTeachersData = (
  currentUserData: currentUser | null,
  teachersData: currentUser[] | null,
  enabled: boolean // useFetchTeacher が完了してから処理を始める
) => {
  const setDataTable = useTeachersStore((s) => s.setDataTable);
  const setDetailDrawer = useTeachersStore((s) => s.setDetailDrawer);

  useEffect(() => {
    if (!enabled || (!teachersData && !currentUserData)) return;

    const teacherRows = (teachersData ?? []).filter(Boolean).map(toTeacherRow);
    const detailRows = (teachersData ?? [])
      .filter(Boolean)
      .map(toTeacherDetailDrawer);

    const dataTable = currentUserData
      ? [toTeacherRow(currentUserData), ...teacherRows]
      : teacherRows;

    const detailDrawer = currentUserData
      ? [toTeacherDetailDrawer(currentUserData), ...detailRows]
      : detailRows;

    // 既に入ってるストアの ID とまったく同じなら上書きしない
    const prev = useTeachersStore.getState().detailDrawer;
    const same =
      prev.length === detailDrawer.length &&
      // すべての教師のIDが一致するかチェック(返却値はboolean)
      prev.every((teacher, i) => teacher.id === detailDrawer[i].id);

    if (same) return;

    setDataTable(dataTable);
    setDetailDrawer(detailDrawer);
  }, [enabled, currentUserData, teachersData, setDataTable, setDetailDrawer]);
};
