import { useEffect } from 'react';
import type {
  currentUser,
  teacherDataTable,
  teacherDetailDrawer,
} from '../../types/teachers';
import { useTeachersStore } from '@/stores/teachersStore';

// toTeacherRow や toTeacherDetailDrawer に渡すデータの型(currentUser や teachers)
type fetchData = currentUser;

// DataTable 用の値に成形する
export const toTeacherRow = (teacher: fetchData): teacherDataTable => ({
  id: teacher.id,
  name: teacher.name,
  role: teacher.role,
  employment_status: teacher.employment_status,
  classSubject: teacher.class_subjects.map((cs) => ({
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
  teaching_assignments: teacher.teaching_assignments.map((ta) => ({
    id: ta.id,
    student_id: ta.student_id,
    user_id: ta.user_id,
    teaching_status: ta.teaching_status,
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
  teachersData: currentUser[] | null
) => {
  const setDataTable = useTeachersStore((state) => state.setDataTable);
  const setDetailDrawer = useTeachersStore((state) => state.setDetailDrawer);
  // teachersData に null 要素が混ざる可能性もケアして filter(Boolean)
  const teacherRows = (teachersData ?? []).filter(Boolean).map(toTeacherRow);
  const detailRows = (teachersData ?? [])
    .filter(Boolean)
    .map(toTeacherDetailDrawer);

  // currentUserData がある時だけ先頭に追加
  const dataTable = currentUserData
    ? [toTeacherRow(currentUserData), ...teacherRows]
    : teacherRows;

  const detailDrawer = currentUserData
    ? [toTeacherDetailDrawer(currentUserData), ...detailRows]
    : detailRows;

  useEffect(() => {
    setDataTable(dataTable);
    setDetailDrawer(detailDrawer);
  }, [dataTable, detailDrawer]);
};
