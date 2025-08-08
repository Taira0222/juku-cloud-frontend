import currentUser from '../components/Table/currentUser.json';
import teachers from '../components/Table/teachers.json';

type teacherDataTable = {
  id: number;
  name: string;
  role: string;
  employStatus: string;
  classSubject: {
    id: number;
    name: string;
  }[];
  studentsCount: number;
};

type teacherDetailDrawer = {
  id: number;
  name: string;
  email: string;
  role: string;
  employStatus: string;
  last_sign_in_at: string;
  current_sign_in_at: string;
  created_at: string;
  available_days: {
    id: number;
    name: string;
  }[];
  classSubject: {
    id: number;
    name: string;
  }[];
  Students: {
    id: number;
    student_code: string;
    name: string;
  }[];
};

type fetchData = {
  id: number;
  name: string;
  role: string;
  email: string;
  school_id: number | null;
  employStatus: string;
  last_sign_in_at: string;
  current_sign_in_at: string | null;
  created_at: string;
  available_days: {
    id: number;
    name: string;
  }[];
  classSubject: {
    id: number;
    name: string;
  }[];
  Students: {
    id: number;
    student_code: string;
    name: string;
  }[];
};

export type { teacherDataTable, teacherDetailDrawer };

const toTeacherRow = (teacher: fetchData): teacherDataTable => ({
  id: teacher.id,
  name: teacher.name,
  role: teacher.role,
  employStatus: teacher.employStatus,
  classSubject: teacher.classSubject.map((cs) => ({
    id: cs.id,
    name: cs.name,
  })),
  studentsCount: teacher.Students.length,
});

const toTeacherDetailDrawer = (teacher: fetchData): teacherDetailDrawer => ({
  id: teacher.id,
  name: teacher.name,
  email: teacher.email,
  role: teacher.role,
  employStatus: teacher.employStatus,
  last_sign_in_at: teacher.last_sign_in_at,
  current_sign_in_at: teacher.current_sign_in_at || '',
  created_at: teacher.created_at,
  available_days: teacher.available_days.map((day) => ({
    id: day.id,
    name: day.name,
  })),
  classSubject: teacher.classSubject.map((cs) => ({
    id: cs.id,
    name: cs.name,
  })),
  Students: teacher.Students.map((student) => ({
    id: student.id,
    student_code: student.student_code,
    name: student.name,
  })),
});

export const useFormatTeachersData = () => {
  // currentUser と teachers のデータを成形して返す
  const currentUserData: fetchData[] = Array.isArray(currentUser)
    ? currentUser
    : [currentUser];
  const currentUserDataTable: teacherDataTable[] =
    currentUserData.map(toTeacherRow);
  const teachersDataTable: teacherDataTable[] = teachers.map(toTeacherRow);
  const dataTable: teacherDataTable[] = [
    ...currentUserDataTable,
    ...teachersDataTable,
  ];

  // currentUser と teachers の詳細データを成形して返す
  const currentUserDetailData: fetchData[] = Array.isArray(currentUser)
    ? currentUser
    : [currentUser];
  const currentUserDetailDrawer: teacherDetailDrawer[] =
    currentUserDetailData.map(toTeacherDetailDrawer);
  const teachersDetailDrawer: teacherDetailDrawer[] = teachers.map(
    toTeacherDetailDrawer
  );
  const detailDrawer: teacherDetailDrawer[] = [
    ...currentUserDetailDrawer,
    ...teachersDetailDrawer,
  ];

  // ID でdetailDrawer のデータを検索する関数を追加
  const getDetailDrawerData = (id: number): teacherDetailDrawer | undefined => {
    return detailDrawer.find((item) => item.id === id);
  };

  return { dataTable, getDetailDrawerData };
};
